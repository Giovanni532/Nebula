import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import Animated, { withSpring, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type WalletSelectorProps = {
    isOpen: boolean;
    onClose: () => void;
};

type WalletItemProps = {
    address: string;
    balance: string;
    isSelected: boolean;
    onSelect?: () => void;
};

function WalletItem({ address, balance, isSelected, onSelect }: WalletItemProps) {
    return (
        <TouchableOpacity
            style={[styles.walletItem, isSelected && styles.walletItemSelected]}
            onPress={onSelect}
        >
            <View style={styles.walletItemLeft}>
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
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const [isVisible, setIsVisible] = useState(false);

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

    if (!isVisible) return null;

    return (
        <View style={styles.modalOverlay}>
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
                        <WalletItem
                            address="CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq"
                            balance="245.8 SOL"
                            isSelected={true}
                        />
                        <WalletItem
                            address="9ZNTfG4NyQgxy2SWjSiQoUyBPEvXT2xKYP6jGA5WHgl"
                            balance="180.5 SOL"
                            isSelected={false}
                        />
                        <WalletItem
                            address="H8zGp8mRQQgX4MZT3BUjCwTNwKqpgLcuKoP5eVzuu8Xk"
                            balance="95.2 SOL"
                            isSelected={false}
                        />
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
    walletItemAddress: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '500',
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
}); 