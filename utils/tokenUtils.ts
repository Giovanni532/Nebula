import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const JUPITER_TOKEN_LIST_API = 'https://tokens.jup.ag/token/';
const PUMP_API = 'https://api.pump.fun/token/';

// Fonction utilitaire pour attendre
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Gestionnaire de taux de requêtes
class RateLimiter {
    private lastRequestTime: number = 0;
    private minDelay: number = 1000; // 1 seconde minimum entre les requêtes

    async waitForNextRequest() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.minDelay) {
            const waitTime = this.minDelay - timeSinceLastRequest;
            await delay(waitTime);
        }

        this.lastRequestTime = Date.now();
    }
}

const globalRateLimiter = new RateLimiter();

// Fonction avec retry améliorée
async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 5,
    baseDelay: number = 2000
): Promise<T> {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
        try {
            await globalRateLimiter.waitForNextRequest();
            return await operation();
        } catch (error: any) {
            lastError = error;

            const isRateLimit = error?.message?.includes('429') ||
                error?.data?.error?.code === 429 ||
                error?.code === 429;

            if (isRateLimit) {
                const jitter = Math.random() * 1000;
                const waitTime = (baseDelay * Math.pow(2, i)) + jitter;
                console.log(`Rate limit atteint (tentative ${i + 1}/${maxRetries}), attente de ${Math.round(waitTime)}ms...`);
                await delay(waitTime);
                continue;
            }
            throw error;
        }
    }

    console.error(`Échec après ${maxRetries} tentatives`);
    throw lastError;
}

// Fonction pour diviser les requêtes en lots plus petits
async function batchRequests<T>(
    items: any[],
    batchSize: number = 2, // Réduit à 2 requêtes par lot
    processor: (item: any) => Promise<T>
): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(item => retryOperation(() => processor(item)))
        );
        results.push(...batchResults);

        // Pause plus longue entre les lots
        if (i + batchSize < items.length) {
            await delay(2000); // 2 secondes entre chaque lot
        }
    }
    return results;
}

interface TokenInfo {
    name: string;
    symbol: string;
    balance: number;
    priceUSD: number;
    mint: string;
    logoURI: string;
    address: string;
    isFun: boolean;
}

interface TokenMetadata {
    name: string;
    symbol: string;
    logoURI: string;
}

// Fonction pour alterner entre les APIs
async function getTokenPrice(mintAddress: string): Promise<number> {
    try {
        const response = await fetch(`${JUPITER_PRICE_API}?ids=${mintAddress === 'SOL' ? 'So11111111111111111111111111111111111111112' : mintAddress}&showExtraInfo=true`);
        const data = await response.json();

        const tokenData = data.data[mintAddress === 'SOL' ? 'So11111111111111111111111111111111111111112' : mintAddress];

        if (!tokenData) return 0;

        // Utiliser le prix dérivé qui est la moyenne entre le prix d'achat et de vente
        if (tokenData.extraInfo?.quotedPrice) {
            const { buyPrice, sellPrice } = tokenData.extraInfo.quotedPrice;
            return (Number(buyPrice) + Number(sellPrice)) / 2;
        }

        return Number(tokenData.price) || 0;
    } catch (error) {
        console.error('Erreur Jupiter:', error);
        return 0;
    }
}

async function isPumpToken(mintAddress: string): Promise<boolean> {
    return mintAddress.toLowerCase().endsWith('pump');
}

async function getTokenMetadata(mintAddress: string): Promise<TokenMetadata & { isFun: boolean }> {
    const isPump = await isPumpToken(mintAddress);

    try {
        // Si c'est un token Pump, essayer d'abord Jupiter pour les métadonnées
        if (isPump) {
            try {
                const jupiterResponse = await fetch(`${JUPITER_TOKEN_LIST_API}${mintAddress}`);
                const jupiterToken = await jupiterResponse.json();

                return {
                    name: jupiterToken.name || `PUMP ${mintAddress.slice(0, 4)}`,
                    symbol: jupiterToken.symbol || 'PUMP',
                    logoURI: jupiterToken.logoURI || 'https://pump.fun/logo.png',
                    isFun: true
                };
            } catch {
                // Si Jupiter échoue, utiliser les valeurs par défaut pour Pump
                return {
                    name: `Inconnu`,
                    symbol: '',
                    logoURI: 'https://pump.fun/logo.png',
                    isFun: true
                };
            }
        }

        // Pour les tokens non-Pump, continuer avec Jupiter normalement
        const response = await fetch(`${JUPITER_TOKEN_LIST_API}${mintAddress}`);
        const token = await response.json();

        return {
            name: token.name,
            symbol: token.symbol,
            logoURI: token.logoURI || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/unknown-token.png',
            isFun: false
        };
    } catch (error) {
        return {
            name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
            symbol: mintAddress.slice(0, 4),
            logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/unknown-token.png',
            isFun: isPump
        };
    }
}

export async function getTokensForWallet(address: string, connection: Connection): Promise<TokenInfo[]> {
    try {
        const publicKey = new PublicKey(address);

        // Attendre avant de faire les requêtes initiales
        await globalRateLimiter.waitForNextRequest();

        const [tokens, solBalance] = await Promise.all([
            retryOperation(() => connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            })),
            retryOperation(() => connection.getBalance(publicKey))
        ]);

        const nonZeroTokens = tokens.value.filter(token =>
            token.account.data.parsed.info.tokenAmount.uiAmount > 0
        );

        // Traiter les tokens par lots de 2 avec un délai plus long
        const tokenList = await batchRequests(nonZeroTokens, 2, async (token) => {
            const tokenBalance = token.account.data.parsed.info.tokenAmount;
            const mintAddress = token.account.data.parsed.info.mint.toLowerCase();

            // Attendre entre chaque requête de métadonnées
            await globalRateLimiter.waitForNextRequest();

            const [metadata, priceUSD] = await Promise.all([
                getTokenMetadata(mintAddress),
                getTokenPrice(mintAddress)
            ]);

            return {
                ...metadata,
                balance: tokenBalance.uiAmount || 0,
                priceUSD,
                mint: mintAddress,
                address: mintAddress,
                isFun: metadata.isFun
            };
        });

        if (solBalance > 0) {
            await globalRateLimiter.waitForNextRequest();
            const solPrice = await getTokenPrice('SOL');

            tokenList.unshift({
                name: 'Solana',
                symbol: 'SOL',
                logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
                balance: solBalance / 1e9,
                priceUSD: solPrice,
                mint: 'SOL',
                address: 'So11111111111111111111111111111111111111112',
                isFun: false
            });
        }

        return tokenList;
    } catch (error) {
        console.error('Erreur lors de la récupération des tokens:', error);
        return [];
    }
}

