import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletData } from '@/utils/wallet';

interface WalletContextType {
    currentWallet: WalletData | null;
    wallets: WalletData[];
    updateWallets: (wallet: WalletData) => void;
    switchWallet: (publicKey: string) => Promise<void>;
    deleteWallet: (publicKey: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [currentWallet, setCurrentWallet] = useState<WalletData | null>(null);
    const [wallets, setWallets] = useState<WalletData[]>([]);

    useEffect(() => {
        loadWallets();
    }, []);

    const loadWallets = async () => {
        try {
            const savedWallets = await AsyncStorage.getItem('wallets');
            const currentWalletData = await AsyncStorage.getItem('currentWallet');

            if (savedWallets) {
                setWallets(JSON.parse(savedWallets));
            }
            if (currentWalletData) {
                setCurrentWallet(JSON.parse(currentWalletData));
            }
        } catch (error) {
            console.error('Erreur lors du chargement des wallets:', error);
        }
    };

    const updateWallets = async (wallet: WalletData) => {
        try {
            const updatedWallets = [...wallets.filter(w => w.publicKey !== wallet.publicKey), wallet];
            setWallets(updatedWallets);
            setCurrentWallet(wallet);

            await AsyncStorage.setItem('wallets', JSON.stringify(updatedWallets));
            await AsyncStorage.setItem('currentWallet', JSON.stringify(wallet));
            await AsyncStorage.setItem('hasWallet', 'true');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des wallets:', error);
        }
    };

    const switchWallet = async (publicKey: string) => {
        const wallet = wallets.find(w => w.publicKey === publicKey);
        if (wallet) {
            setCurrentWallet(wallet);
            await AsyncStorage.setItem('currentWallet', JSON.stringify(wallet));
        }
    };

    const deleteWallet = async (publicKey: string) => {
        try {
            const updatedWallets = wallets.filter(w => w.publicKey !== publicKey);
            setWallets(updatedWallets);

            if (currentWallet?.publicKey === publicKey) {
                const newCurrentWallet = updatedWallets[0] || null;
                setCurrentWallet(newCurrentWallet);
                await AsyncStorage.setItem('currentWallet', JSON.stringify(newCurrentWallet));
            }

            await AsyncStorage.setItem('wallets', JSON.stringify(updatedWallets));
            if (updatedWallets.length === 0) {
                await AsyncStorage.removeItem('hasWallet');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du wallet:', error);
        }
    };

    return (
        <WalletContext.Provider value={{
            currentWallet,
            wallets,
            updateWallets,
            switchWallet,
            deleteWallet
        }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallets() {
    return useContext(WalletContext);
} 