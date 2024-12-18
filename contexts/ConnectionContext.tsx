import React, { createContext, useContext } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

interface ConnectionContextState {
    connection: Connection;
}

const ConnectionContext = createContext<ConnectionContextState>({} as ConnectionContextState);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const rpcEndpoint = 'https://api.mainnet-beta.solana.com';

    const connection = new Connection(rpcEndpoint, {
        commitment: 'confirmed',
        wsEndpoint: rpcEndpoint.replace('https', 'wss'),
        confirmTransactionInitialTimeout: 100,
    });

    return (
        <ConnectionContext.Provider value={{ connection }}>
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    return useContext(ConnectionContext);
} 