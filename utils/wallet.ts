import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as bip39 from 'bip39';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTokensForWallet } from './tokenUtils';
import bs58 from 'bs58';

export interface WalletData {
    publicKey: string;
    privateKey: string;
    mnemonic?: string;
    name: string;
    balance: number;
    tokens: Array<{
        name: string;
        symbol: string;
        balance: number;
        priceUSD: number;
        logoURI: string;
        isFun: boolean;
    }>;
}

export async function generateNewWallet(connection: Connection, name?: string): Promise<WalletData> {
    try {
        const keypair = Keypair.generate();
        const privateKeyBase58 = bs58.encode(keypair.secretKey);
        const publicKey = keypair.publicKey;

        const balance = await connection.getBalance(publicKey);
        const tokens = await getTokensForWallet(publicKey.toString(), connection);

        const walletData: WalletData = {
            name: name?.trim() || `Solana Wallet ${publicKey.toString().slice(0, 6)}`,
            publicKey: publicKey.toString(),
            privateKey: privateKeyBase58,
            balance: balance / LAMPORTS_PER_SOL,
            tokens
        };

        await AsyncStorage.setItem('currentWallet', JSON.stringify(walletData));
        await AsyncStorage.setItem('hasWallet', 'true');

        return walletData;
    } catch (error) {
        console.error('Erreur lors de la création du wallet:', error);
        throw error;
    }
}

export function validatePrivateKey(key: string): boolean {
    try {
        const bytes = bs58.decode(key);
        return bytes.length === 64;
    } catch {
        return false;
    }
}

export async function importWalletFromPrivateKey(privateKey: string, connection: Connection, name?: string): Promise<WalletData> {
    try {
        if (!validatePrivateKey(privateKey)) {
            throw new Error('Format de clé privée invalide');
        }

        const privateKeyBytes = bs58.decode(privateKey);
        const keypair = Keypair.fromSecretKey(privateKeyBytes);
        const publicKey = keypair.publicKey;

        const balance = await connection.getBalance(publicKey);
        const tokens = await getTokensForWallet(publicKey.toString(), connection);

        const walletData: WalletData = {
            name: name?.trim() || `Solana Wallet ${publicKey.toString().slice(0, 6)}`,
            publicKey: publicKey.toString(),
            privateKey: privateKey,
            balance: balance / LAMPORTS_PER_SOL,
            tokens
        };

        await AsyncStorage.setItem('currentWallet', JSON.stringify(walletData));
        await AsyncStorage.setItem('hasWallet', 'true');

        return walletData;
    } catch (error) {
        console.error('Erreur lors de l\'import du wallet:', error);
        throw error;
    }
}

export async function importWalletFromMnemonic(mnemonic: string, connection: Connection, name?: string): Promise<WalletData> {
    try {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const keypair = Keypair.fromSeed(seed.slice(0, 32));
        const publicKey = keypair.publicKey;

        const tokens = await getTokensForWallet(publicKey.toString(), connection);
        const balance = await connection.getBalance(publicKey);

        const walletData: WalletData = {
            name: name?.trim() || `Solana Wallet ${publicKey.toString().slice(0, 6)}`,
            publicKey: publicKey.toString(),
            privateKey: bs58.encode(keypair.secretKey),
            mnemonic,
            balance: balance / LAMPORTS_PER_SOL,
            tokens
        };

        await AsyncStorage.setItem('currentWallet', JSON.stringify(walletData));
        await AsyncStorage.setItem('hasWallet', 'true');

        return walletData;
    } catch (error) {
        console.error('Erreur lors de l\'import du wallet:', error);
        throw error;
    }
} 