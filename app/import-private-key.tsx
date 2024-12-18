import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { importWalletFromPrivateKey, validatePrivateKey } from '@/utils/wallet';
import { useConnection } from '@/contexts/ConnectionContext';
import { useWallets } from '@/contexts/WalletContext';

export default function ImportPrivateKeyScreen() {
    const [privateKey, setPrivateKey] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { connection } = useConnection();
    const { updateWallets } = useWallets();

    const handleImport = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        try {
            if (!validatePrivateKey(privateKey)) {
                throw new Error('Format de clé privée invalide');
            }

            const walletData = await importWalletFromPrivateKey(privateKey, connection);
            updateWallets(walletData);
            router.replace('/(tabs)');
        } catch (error) {
            console.log(error);
            setError('Clé privée invalide ou erreur lors de l\'import');
        } finally {
            setIsLoading(false);
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
                        editable={!isLoading}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleImport}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Import en cours...' : 'Importer'}
                        </Text>
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
    buttonDisabled: {
        opacity: 0.7,
    },
}); 