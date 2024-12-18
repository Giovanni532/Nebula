import React, { createContext, useContext } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

interface ConnectionContextState {
    connection: Connection;
}

const ConnectionContext = createContext<ConnectionContextState>({} as ConnectionContextState);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    return (
        <ConnectionContext.Provider value={{ connection }}>
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    return useContext(ConnectionContext);
} 