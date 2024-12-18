import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function WelcomeScreen() {
    useEffect(() => {
        checkWalletStatus();
    }, []);

    const checkWalletStatus = async () => {
        const hasWallet = await AsyncStorage.getItem('hasWallet');
        if (hasWallet) {
            router.replace('/(tabs)');
        }
    };

    const handleOptionSelect = async (option: string) => {
        // À implémenter: logique de création/import du wallet
        await AsyncStorage.setItem('hasWallet', 'true');
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.dark.gradientStart, Colors.dark.gradientEnd]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Bienvenue sur Nebula</Text>
                    <Text style={styles.subtitle}>
                        L'application décentralisée pour Solana
                    </Text>

                    <View style={styles.options}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleOptionSelect('create')}
                        >
                            <Text style={styles.buttonText}>Créer mon wallet</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleOptionSelect('privateKey')}
                        >
                            <Text style={styles.buttonText}>J'ai une clé privée</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleOptionSelect('mnemonic')}
                        >
                            <Text style={styles.buttonText}>J'ai une phrase mnémonique</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: Colors.dark.secondaryText,
        marginBottom: 60,
        textAlign: 'center',
    },
    options: {
        width: '100%',
        gap: 16,
    },
    button: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
    buttonText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
}); 