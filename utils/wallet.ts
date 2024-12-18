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
        console.log('Début de l\'importation du wallet avec la clé privée:', privateKey);

        if (!validatePrivateKey(privateKey)) {
            console.error('Clé privée invalide:', privateKey);
            throw new Error('Format de clé privée invalide');
        }

        const privateKeyBytes = bs58.decode(privateKey);
        const keypair = Keypair.fromSecretKey(privateKeyBytes);
        const publicKey = keypair.publicKey;

        console.log('Clé publique générée:', publicKey.toString());

        // Récupérer d'abord la balance avec retry
        let balance = 0;
        try {
            balance = await connection.getBalance(publicKey);
        } catch (error) {
            console.warn('Erreur lors de la récupération de la balance, utilisation de 0:', error);
        }

        // Récupérer ensuite les tokens avec retry
        let tokens: Array<{
            name: string;
            symbol: string;
            balance: number;
            priceUSD: number;
            logoURI: string;
            isFun: boolean;
        }> = [];
        try {
            tokens = await getTokensForWallet(publicKey.toString(), connection);
        } catch (error) {
            console.warn('Erreur lors de la récupération des tokens, utilisation d\'un tableau vide:', error);
        }

        const walletData: WalletData = {
            name: name?.trim() || `Solana Wallet ${publicKey.toString().slice(0, 6)}`,
            publicKey: publicKey.toString(),
            privateKey: bs58.encode(keypair.secretKey),
            balance: balance / LAMPORTS_PER_SOL,
            tokens
        };

        console.log('Wallet importé avec succès');
        return walletData;
    } catch (error) {
        console.error('Erreur lors de l\'import du wallet:', error);
        throw error;
    }
}

export async function generateNewWallet(connection: Connection, name?: string): Promise<WalletData> {
    try {
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey;

        let balance = 0;
        try {
            balance = await connection.getBalance(publicKey);
        } catch (error) {
            console.warn('Erreur lors de la récupération de la balance, utilisation de 0:', error);
        }

        let tokens: Array<{
            name: string;
            symbol: string;
            balance: number;
            priceUSD: number;
            logoURI: string;
            isFun: boolean;
        }> = [];
        try {
            tokens = await getTokensForWallet(publicKey.toString(), connection);
        } catch (error) {
            console.warn('Erreur lors de la récupération des tokens, utilisation d\'un tableau vide:', error);
        }

        return {
            name: name?.trim() || `Solana Wallet ${publicKey.toString().slice(0, 6)}`,
            publicKey: publicKey.toString(),
            privateKey: bs58.encode(keypair.secretKey),
            balance: balance / LAMPORTS_PER_SOL,
            tokens
        };
    } catch (error) {
        console.error('Erreur lors de la création du wallet:', error);
        throw error;
    }
}

export async function importWalletFromMnemonic(mnemonic: string, connection: Connection, name?: string): Promise<WalletData> {
    try {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const keypair = Keypair.fromSeed(seed.slice(0, 32));
        const publicKey = keypair.publicKey;

        const [balance, tokens] = await Promise.all([
            connection.getBalance(publicKey),
            getTokensForWallet(publicKey.toString(), connection)
        ]);

        const walletData: WalletData = {
            name: name?.trim() || `Solana Wallet ${publicKey.toString().slice(0, 6)}`,
            publicKey: publicKey.toString(),
            privateKey: bs58.encode(keypair.secretKey),
            mnemonic,
            balance: balance / LAMPORTS_PER_SOL,
            tokens
        };

        return walletData;
    } catch (error) {
        console.error('Erreur lors de l\'import du wallet:', error);
        throw error;
    }
} 