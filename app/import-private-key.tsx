import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ImportPrivateKeyScreen() {
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState('');

    const handleImport = async () => {
        try {
            const secretKey = new Uint8Array(privateKey.split(',').map(Number));
            const keypair = Keypair.fromSecretKey(secretKey);

            await AsyncStorage.setItem('currentWallet', keypair.publicKey.toString());
            await AsyncStorage.setItem('hasWallet', 'true');

            const existingWallets = await AsyncStorage.getItem('wallets');
            const walletsList = existingWallets ? JSON.parse(existingWallets) : [];
            walletsList.push(keypair.publicKey.toString());
            await AsyncStorage.setItem('wallets', JSON.stringify(walletsList));

            router.replace('/(tabs)');
        } catch (error) {
            setError('Clé privée invalide');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.dark.gradientStart, Colors.dark.gradientEnd]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Importer avec une clé privée</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre clé privée"
                        placeholderTextColor={Colors.dark.secondaryText}
                        value={privateKey}
                        onChangeText={setPrivateKey}
                        multiline
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleImport}>
                        <Text style={styles.buttonText}>Importer</Text>
                    </TouchableOpacity>
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
    },
    content: {
        padding: 20,
        marginTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        color: Colors.dark.text,
        marginBottom: 20,
        minHeight: 100,
    },
    error: {
        color: Colors.dark.error,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
}); 