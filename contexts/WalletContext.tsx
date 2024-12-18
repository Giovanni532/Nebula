import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletData } from '@/utils/wallet';

interface WalletContextType {
    currentWallet: WalletData | null;
    wallets: string[];
    updateWallets: (wallet: WalletData) => void;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [currentWallet, setCurrentWallet] = useState<WalletData | null>(null);
    const [wallets, setWallets] = useState<string[]>([]);

    const updateWallets = (wallet: WalletData) => {
        setCurrentWallet(wallet);
        setWallets(prev => [...new Set([...prev, wallet.publicKey])]);
    };

    return (
        <WalletContext.Provider value={{ currentWallet, wallets, updateWallets }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallets() {
    return useContext(WalletContext);
} 