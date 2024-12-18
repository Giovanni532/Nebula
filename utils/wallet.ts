import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function generateNewWallet() {
    try {
        // Générer une nouvelle phrase mnémonique
        const mnemonic = bip39.generateMnemonic();

        // Créer un nouveau Keypair
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const keypair = Keypair.fromSeed(seed.slice(0, 32));

        // Sauvegarder les informations du wallet
        await AsyncStorage.setItem('currentWallet', keypair.publicKey.toString());
        await AsyncStorage.setItem('hasWallet', 'true');
        await AsyncStorage.setItem('walletMnemonic', mnemonic);

        // Sauvegarder la liste des wallets
        const existingWallets = await AsyncStorage.getItem('wallets');
        const walletsList = existingWallets ? JSON.parse(existingWallets) : [];
        walletsList.push(keypair.publicKey.toString());
        await AsyncStorage.setItem('wallets', JSON.stringify(walletsList));

        return {
            publicKey: keypair.publicKey.toString(),
            privateKey: keypair.secretKey.toString(),
            mnemonic
        };
    } catch (error) {
        console.error('Erreur lors de la création du wallet:', error);
        throw error;
    }
} 