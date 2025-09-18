import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { getDexScreenerAPI } from './dex-screener';

export interface QuoteResponse {
	inputMint: string;
	inAmount: string;
	outputMint: string;
	outAmount: string;
	otherAmountThreshold: string;
	swapMode: string;
	slippageBps: number;
	priceImpactPct: string;
	routePlan: any[];
	contextSlot?: number;
	timeTaken?: number;
}

export interface SwapRequest {
	quoteResponse: QuoteResponse;
	userPublicKey: string;
	wrapAndUnwrapSol?: boolean;
	useSharedAccounts?: boolean;
	feeAccount?: string;
	computeUnitPriceMicroLamports?: number;
	prioritizationFeeLamports?: number;
	asLegacyTransaction?: boolean;
	useTokenLedger?: boolean;
	destinationTokenAccount?: string;
	dynamicComputeUnitLimit?: boolean;
	skipUserAccountsRpcCalls?: boolean;
}

export interface SwapResponse {
	swapTransaction: string;
	lastValidBlockHeight: number;
	prioritizationFeeLamports?: number;
}

export interface TokenPrice {
	id: string;
	mintSymbol: string;
	vsToken: string;
	vsTokenSymbol: string;
	price: number;
}

export interface JupiterToken {
	address: string;
	chainId: number;
	decimals: number;
	name: string;
	symbol: string;
	logoURI?: string;
	tags?: string[];
}

const JUPITER_API_URL = 'https://quote-api.jup.ag/v6';
const JUPITER_PRICE_API_URL = 'https://price.jup.ag/v4';

export class JupiterClient {
	private connection: Connection;
	private tokenCache: Map<string, JupiterToken> = new Map();
	private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
	private readonly PRICE_CACHE_TTL = 30000; // 30 seconds
	
	constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
		this.connection = new Connection(rpcUrl, 'confirmed');
	}
	
	/**
	 * Get a swap quote from Jupiter
	 */
	async getQuote(
		inputMint: string,
		outputMint: string,
		amount: number,
		slippageBps: number = 50 // 0.5% default slippage
	): Promise<QuoteResponse> {
		const params = new URLSearchParams({
			inputMint,
			outputMint,
			amount: amount.toString(),
			slippageBps: slippageBps.toString(),
			onlyDirectRoutes: 'false',
			asLegacyTransaction: 'false'
		});
		
		const response = await fetch(`${JUPITER_API_URL}/quote?${params}`);
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Jupiter quote failed: ${error}`);
		}
		
		return await response.json();
	}
	
	/**
	 * Get swap transaction from Jupiter
	 */
	async getSwapTransaction(swapRequest: SwapRequest): Promise<SwapResponse> {
		const response = await fetch(`${JUPITER_API_URL}/swap`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(swapRequest)
		});
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Jupiter swap failed: ${error}`);
		}
		
		return await response.json();
	}
	
	/**
	 * Execute a swap transaction
	 */
	async executeSwap(
		swapTransaction: string,
		lastValidBlockHeight: number,
		signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
	): Promise<string> {
		try {
			// Deserialize the transaction
			const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
			const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
			
			// Sign the transaction
			const signedTransaction = await signTransaction(transaction);
			
			// Send the transaction
			const rawTransaction = signedTransaction.serialize();
			const txid = await this.connection.sendRawTransaction(rawTransaction, {
				skipPreflight: true,
				maxRetries: 2
			});
			
			// Confirm the transaction
			const latestBlockHash = await this.connection.getLatestBlockhash();
			await this.connection.confirmTransaction({
				blockhash: latestBlockHash.blockhash,
				lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
				signature: txid
			}, 'confirmed');
			
			return txid;
		} catch (error) {
			console.error('Swap execution failed:', error);
			throw error;
		}
	}
	
	/**
	 * Get token price from Jupiter with DexScreener fallback
	 */
	async getTokenPrice(tokenAddress: string): Promise<number | null> {
		// Check cache first
		const cached = this.priceCache.get(tokenAddress);
		if (cached && Date.now() - cached.timestamp < this.PRICE_CACHE_TTL) {
			return cached.price;
		}

		// Try Jupiter first
		try {
			const response = await fetch(`${JUPITER_PRICE_API_URL}/price?ids=${tokenAddress}`);

			if (response.ok) {
				const data = await response.json();
				const priceData = data.data[tokenAddress];

				if (priceData && priceData.price) {
					const price = parseFloat(priceData.price);
					// Update cache
					this.priceCache.set(tokenAddress, {
						price,
						timestamp: Date.now()
					});
					return price;
				}
			}
		} catch (error) {
			console.warn('Jupiter price API unavailable, falling back to DexScreener:', error.message);
		}

		// Fallback to DexScreener
		try {
			const dexScreener = getDexScreenerAPI();
			const priceData = await dexScreener.getTokenPrice(tokenAddress);

			if (priceData && priceData.priceUsd > 0) {
				// Update cache
				this.priceCache.set(tokenAddress, {
					price: priceData.priceUsd,
					timestamp: Date.now()
				});
				return priceData.priceUsd;
			}

			return null;
		} catch (error) {
			console.error('Error fetching token price from both Jupiter and DexScreener:', error);
			return null;
		}
	}
	
	/**
	 * Get multiple token prices with DexScreener fallback
	 */
	async getTokenPrices(tokenAddresses: string[]): Promise<Map<string, number>> {
		const prices = new Map<string, number>();

		// Filter out cached prices
		const uncachedTokens = tokenAddresses.filter(addr => {
			const cached = this.priceCache.get(addr);
			if (cached && Date.now() - cached.timestamp < this.PRICE_CACHE_TTL) {
				prices.set(addr, cached.price);
				return false;
			}
			return true;
		});

		if (uncachedTokens.length === 0) {
			return prices;
		}

		// Try Jupiter first
		let failedTokens = [...uncachedTokens];
		try {
			const response = await fetch(
				`${JUPITER_PRICE_API_URL}/price?ids=${uncachedTokens.join(',')}`
			);

			if (response.ok) {
				const data = await response.json();

				for (const token of uncachedTokens) {
					const priceData = data.data[token];
					if (priceData && priceData.price) {
						const price = parseFloat(priceData.price);
						prices.set(token, price);
						// Update cache
						this.priceCache.set(token, {
							price,
							timestamp: Date.now()
						});
						// Remove from failed list
						failedTokens = failedTokens.filter(t => t !== token);
					}
				}
			}
		} catch (error) {
			console.warn('Jupiter price API unavailable for batch fetch, falling back to DexScreener:', error.message);
		}

		// Fallback to DexScreener for remaining tokens
		if (failedTokens.length > 0) {
			try {
				const dexScreener = getDexScreenerAPI();
				const dexPrices = await dexScreener.getTokenPrices(failedTokens);

				for (const [token, priceData] of dexPrices.entries()) {
					if (priceData.priceUsd > 0) {
						prices.set(token, priceData.priceUsd);
						// Update cache
						this.priceCache.set(token, {
							price: priceData.priceUsd,
							timestamp: Date.now()
						});
					}
				}
			} catch (error) {
				console.error('Error fetching remaining token prices from DexScreener:', error);
			}
		}

		return prices;
	}
	
	/**
	 * Get token metadata from Jupiter
	 */
	async getTokenInfo(tokenAddress: string): Promise<JupiterToken | null> {
		// Check cache first
		if (this.tokenCache.has(tokenAddress)) {
			return this.tokenCache.get(tokenAddress)!;
		}
		
		try {
			// Fetch all tokens if cache is empty
			if (this.tokenCache.size === 0) {
				await this.loadTokenList();
			}
			
			return this.tokenCache.get(tokenAddress) || null;
		} catch (error) {
			console.error('Error fetching token info:', error);
			return null;
		}
	}
	
	/**
	 * Load Jupiter token list
	 */
	private async loadTokenList(): Promise<void> {
		try {
			const response = await fetch('https://token.jup.ag/all');
			
			if (!response.ok) {
				throw new Error('Failed to fetch token list');
			}
			
			const tokens: JupiterToken[] = await response.json();
			
			// Cache all tokens
			for (const token of tokens) {
				this.tokenCache.set(token.address, token);
			}
			
			console.log(`Loaded ${tokens.length} tokens from Jupiter`);
		} catch (error) {
			console.error('Error loading token list:', error);
		}
	}
	
	/**
	 * Find token by symbol
	 */
	async findTokenBySymbol(symbol: string): Promise<JupiterToken | null> {
		// Ensure token list is loaded
		if (this.tokenCache.size === 0) {
			await this.loadTokenList();
		}
		
		// Search for token by symbol (case insensitive)
		const upperSymbol = symbol.toUpperCase();
		for (const token of this.tokenCache.values()) {
			if (token.symbol.toUpperCase() === upperSymbol) {
				return token;
			}
		}
		
		return null;
	}
	
	/**
	 * Calculate price impact for a swap
	 */
	calculatePriceImpact(quote: QuoteResponse): number {
		return parseFloat(quote.priceImpactPct);
	}
	
	/**
	 * Get recommended slippage based on price impact
	 */
	getRecommendedSlippage(priceImpact: number): number {
		// Base slippage of 0.5%
		let slippageBps = 50;
		
		// Add extra slippage for high price impact
		if (priceImpact > 1) {
			slippageBps = Math.min(1000, Math.ceil(priceImpact * 100)); // Cap at 10%
		}
		
		return slippageBps;
	}
}

// Singleton instance
let jupiterClientInstance: JupiterClient | null = null;

export function getJupiterClient(rpcUrl?: string): JupiterClient {
	if (!jupiterClientInstance) {
		jupiterClientInstance = new JupiterClient(rpcUrl);
	}
	return jupiterClientInstance;
}