import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, Alert, TextInput, Modal } from 'react-native';
import Animated, { withSpring, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { useWallets } from '@/contexts/WalletContext';
import { WalletData } from '@/utils/wallet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type WalletSelectorProps = {
    isOpen: boolean;
    onClose: () => void;
};

type WalletItemProps = {
    address: string;
    name: string;
    balance: string;
    isSelected: boolean;
    onSelect?: () => void;
    onEditName?: () => void;
};

function WalletItem({ address, name, balance, isSelected, onSelect, onEditName }: WalletItemProps) {
    return (
        <TouchableOpacity
            style={[styles.walletItem, isSelected && styles.walletItemSelected]}
            onPress={onSelect}
        >
            <View style={styles.walletItemLeft}>
                <View style={styles.walletItemHeader}>
                    <Text style={styles.walletItemName}>{name}</Text>
                    <TouchableOpacity onPress={onEditName}>
                        <FontAwesome5 name="edit" size={14} color={Colors.dark.secondaryText} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.walletItemAddress}>{address}</Text>
                <Text style={styles.walletItemBalance}>{balance}</Text>
            </View>
            {isSelected && (
                <FontAwesome5 name="check" size={16} color={Colors.dark.primary} />
            )}
        </TouchableOpacity>
    );
}

export function WalletSelector({ isOpen, onClose }: WalletSelectorProps) {
    const { wallets, currentWallet, switchWallet, updateWallets } = useWallets();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const [isVisible, setIsVisible] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletData | null>(null);
    const [newWalletName, setNewWalletName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            translateY.value = withSpring(0, { damping: 50 });
        } else {
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, () => {
                runOnJS(setIsVisible)(false);
            });
        }
    }, [isOpen]);

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const handleWalletSelect = async (publicKey: string) => {
        await switchWallet(publicKey);
        onClose();
    };

    const handleEditName = (wallet: WalletData) => {
        setEditingWallet(wallet);
        setNewWalletName(wallet.name);
    };

    const handleSaveWalletName = async () => {
        if (editingWallet && newWalletName.trim()) {
            const updatedWallet = {
                ...editingWallet,
                name: newWalletName.trim()
            };
            await updateWallets(updatedWallet);
            setEditingWallet(null);
        }
    };

    const renderEditModal = () => (
        <Modal
            visible={!!editingWallet}
            transparent
            animationType="fade"
            onRequestClose={() => setEditingWallet(null)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.editModalContent}>
                    <Text style={styles.editModalTitle}>Modifier le nom</Text>
                    <TextInput
                        style={styles.editModalInput}
                        value={newWalletName}
                        onChangeText={setNewWalletName}
                        placeholder="Entrez un nouveau nom"
                        placeholderTextColor={Colors.dark.secondaryText}
                    />
                    <View style={styles.editModalButtons}>
                        <TouchableOpacity 
                            style={[styles.editModalButton, styles.cancelButton]}
                            onPress={() => setEditingWallet(null)}
                        >
                            <Text style={styles.editModalButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.editModalButton, styles.saveButton]}
                            onPress={handleSaveWalletName}
                        >
                            <Text style={styles.editModalButtonText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (!isVisible) return null;

    return (
        <View style={styles.modalOverlay}>
            {renderEditModal()}
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />
            <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
                <View style={styles.modalContent}>
                    <View style={styles.line} />
                    <Text style={styles.modalTitle}>Select Wallet</Text>
                    <ScrollView style={styles.walletList}>
                        {wallets.length === 0 ? (
                            <Text style={styles.emptyText}>Aucun wallet trouvé</Text>
                        ) : (
                            wallets.map((wallet) => (
                                <WalletItem
                                    key={wallet.publicKey}
                                    address={wallet.publicKey}
                                    name={wallet.name}
                                    balance={`${wallet.balance} SOL`}
                                    isSelected={currentWallet?.publicKey === wallet.publicKey}
                                    onSelect={() => handleWalletSelect(wallet.publicKey)}
                                    onEditName={() => handleEditName(wallet)}
                                />
                            ))
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.dark.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: SCREEN_HEIGHT * 0.9,
    },
    modalContent: {
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    modalTitle: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    walletList: {
        maxHeight: SCREEN_HEIGHT * 0.6,
        paddingHorizontal: 20,
    },
    walletItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    walletItemSelected: {
        borderColor: Colors.dark.primary,
        borderWidth: 1,
    },
    walletItemLeft: {
        flex: 1,
    },
    walletItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    walletItemName: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
    walletItemAddress: {
        color: Colors.dark.secondaryText,
        fontSize: 14,
        marginBottom: 4,
    },
    walletItemBalance: {
        color: Colors.dark.secondaryText,
        fontSize: 14,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    closeButton: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
    emptyText: {
        color: Colors.dark.secondaryText,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
    editModalContent: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 20,
        width: '80%',
        alignSelf: 'center',
    },
    editModalTitle: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    editModalInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: Colors.dark.text,
        marginBottom: 20,
    },
    editModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editModalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    saveButton: {
        backgroundColor: Colors.dark.primary,
    },
    editModalButtonText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '500',
    },
}); 