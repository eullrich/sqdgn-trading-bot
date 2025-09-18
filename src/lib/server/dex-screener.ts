interface TokenPair {
	chainId: string;
	dexId: string;
	url: string;
	pairAddress: string;
	baseToken: {
		address: string;
		name: string;
		symbol: string;
	};
	quoteToken: {
		address: string;
		name: string;
		symbol: string;
	};
	priceNative: string;
	priceUsd: string;
	txns: {
		m5: { buys: number; sells: number };
		h1: { buys: number; sells: number };
		h6: { buys: number; sells: number };
		h24: { buys: number; sells: number };
	};
	volume: {
		h24: number;
		h6: number;
		h1: number;
		m5: number;
	};
	priceChange: {
		m5: number;
		h1: number;
		h6: number;
		h24: number;
	};
	liquidity: {
		usd: number;
		base: number;
		quote: number;
	};
	fdv: number;
	marketCap: number;
	pairCreatedAt: number;
}

interface DexScreenerResponse {
	schemaVersion: string;
	pairs: TokenPair[] | null;
}

export interface TokenPriceData {
	address: string;
	symbol: string;
	name: string;
	priceUsd: number;
	priceChange1h: number;
	priceChange24h: number;
	volume24h: number;
	liquidity: number;
	marketCap: number;
	dexId: string;
	pairAddress: string;
	lastUpdated: Date;
}

class DexScreenerAPI {
	private static readonly BASE_URL = 'https://api.dexscreener.com';
	private static readonly RATE_LIMIT = 300; // requests per minute
	private static readonly SOLANA_CHAIN_ID = 'solana';
	
	private requestQueue: Array<() => Promise<any>> = [];
	private requestCount = 0;
	private windowStart = Date.now();
	private cache = new Map<string, { data: TokenPriceData; expiry: number }>();
	private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

	private async rateLimitedFetch(url: string): Promise<Response> {
		return new Promise((resolve, reject) => {
			const makeRequest = async () => {
				try {
					// Reset counter if minute has passed
					const now = Date.now();
					if (now - this.windowStart >= 60000) {
						this.requestCount = 0;
						this.windowStart = now;
					}

					// Wait if we've hit rate limit
					if (this.requestCount >= DexScreenerAPI.RATE_LIMIT) {
						const waitTime = 60000 - (now - this.windowStart);
						await new Promise(resolve => setTimeout(resolve, waitTime));
						return makeRequest(); // Retry after waiting
					}

					this.requestCount++;
					console.log(`📊 Making DEX Screener API request (${this.requestCount}/${DexScreenerAPI.RATE_LIMIT}): ${url}`);
					
					const response = await fetch(url, {
						headers: {
							'User-Agent': 'SQDGN-Trading-Bot/1.0'
						}
					});

					if (!response.ok) {
						throw new Error(`HTTP ${response.status}: ${response.statusText}`);
					}

					resolve(response);
				} catch (error) {
					reject(error);
				}
			};

			// Add to queue if we're at limit, otherwise execute immediately
			if (this.requestCount >= DexScreenerAPI.RATE_LIMIT) {
				this.requestQueue.push(makeRequest);
				this.processQueue();
			} else {
				makeRequest();
			}
		});
	}

	private async processQueue() {
		if (this.requestQueue.length === 0) return;

		const now = Date.now();
		if (now - this.windowStart >= 60000) {
			// Reset window
			this.requestCount = 0;
			this.windowStart = now;
			
			// Process queued requests
			while (this.requestQueue.length > 0 && this.requestCount < DexScreenerAPI.RATE_LIMIT) {
				const request = this.requestQueue.shift();
				if (request) {
					request().catch(console.error);
				}
			}
		} else {
			// Wait until next window
			const waitTime = 60000 - (now - this.windowStart);
			setTimeout(() => this.processQueue(), waitTime);
		}
	}

	private getCacheKey(address: string): string {
		return `token_${address.toLowerCase()}`;
	}

	private getCached(address: string): TokenPriceData | null {
		const key = this.getCacheKey(address);
		const cached = this.cache.get(key);
		
		if (cached && Date.now() < cached.expiry) {
			console.log(`📋 Using cached data for ${address}`);
			return cached.data;
		}
		
		// Clean up expired cache
		if (cached) {
			this.cache.delete(key);
		}
		
		return null;
	}

	private setCached(address: string, data: TokenPriceData): void {
		const key = this.getCacheKey(address);
		this.cache.set(key, {
			data,
			expiry: Date.now() + this.CACHE_TTL
		});
	}

	async getTokenPrice(address: string): Promise<TokenPriceData | null> {
		// Check cache first
		const cached = this.getCached(address);
		if (cached) return cached;

		try {
			const url = `${DexScreenerAPI.BASE_URL}/latest/dex/tokens/${address}`;
			const response = await this.rateLimitedFetch(url);
			const data: DexScreenerResponse = await response.json();

			if (!data.pairs || data.pairs.length === 0) {
				console.warn(`⚠️ No pairs found for token ${address}`);
				return null;
			}

			// Find the best pair (highest liquidity)
			const bestPair = data.pairs.reduce((best, current) => {
				return (current.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? current : best;
			});

			const priceData: TokenPriceData = {
				address,
				symbol: bestPair.baseToken.symbol,
				name: bestPair.baseToken.name,
				priceUsd: parseFloat(bestPair.priceUsd) || 0,
				priceChange1h: bestPair.priceChange?.h1 || 0,
				priceChange24h: bestPair.priceChange?.h24 || 0,
				volume24h: bestPair.volume?.h24 || 0,
				liquidity: bestPair.liquidity?.usd || 0,
				marketCap: bestPair.marketCap || 0,
				dexId: bestPair.dexId,
				pairAddress: bestPair.pairAddress,
				lastUpdated: new Date()
			};

			// Cache the result
			this.setCached(address, priceData);
			console.log(`✅ Fetched price for ${priceData.symbol}: $${priceData.priceUsd}`);
			
			return priceData;

		} catch (error) {
			console.error(`❌ Error fetching price for ${address}:`, error);
			return null;
		}
	}

	async getTokenPrices(addresses: string[]): Promise<Map<string, TokenPriceData>> {
		const results = new Map<string, TokenPriceData>();
		
		// Check cache first
		const uncachedAddresses: string[] = [];
		for (const address of addresses) {
			const cached = this.getCached(address);
			if (cached) {
				results.set(address, cached);
			} else {
				uncachedAddresses.push(address);
			}
		}

		if (uncachedAddresses.length === 0) {
			console.log('📋 All requested prices were cached');
			return results;
		}

		console.log(`📊 Fetching prices for ${uncachedAddresses.length} tokens (${addresses.length - uncachedAddresses.length} cached)`);

		// Process in batches to respect rate limits and API constraints
		const BATCH_SIZE = 10; // Conservative batch size
		const batches = [];
		for (let i = 0; i < uncachedAddresses.length; i += BATCH_SIZE) {
			batches.push(uncachedAddresses.slice(i, i + BATCH_SIZE));
		}

		for (const batch of batches) {
			try {
				// Use individual requests for now - could optimize with multi-token endpoint later
				const batchPromises = batch.map(address => this.getTokenPrice(address));
				const batchResults = await Promise.allSettled(batchPromises);

				for (let i = 0; i < batch.length; i++) {
					const result = batchResults[i];
					if (result.status === 'fulfilled' && result.value) {
						results.set(batch[i], result.value);
					}
				}

				// Small delay between batches to be respectful
				if (batches.indexOf(batch) < batches.length - 1) {
					await new Promise(resolve => setTimeout(resolve, 200));
				}
			} catch (error) {
				console.error('❌ Error processing batch:', error);
			}
		}

		console.log(`✅ Successfully fetched ${results.size}/${addresses.length} token prices`);
		return results;
	}

	// Clean up expired cache entries
	cleanCache(): void {
		const now = Date.now();
		let cleanedCount = 0;
		
		for (const [key, value] of this.cache.entries()) {
			if (now >= value.expiry) {
				this.cache.delete(key);
				cleanedCount++;
			}
		}
		
		if (cleanedCount > 0) {
			console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
		}
	}

	getCacheStats(): { size: number; hitRate: number } {
		return {
			size: this.cache.size,
			hitRate: 0 // Could implement hit rate tracking if needed
		};
	}
}

// Singleton instance
let dexScreenerAPI: DexScreenerAPI | null = null;

export function getDexScreenerAPI(): DexScreenerAPI {
	if (!dexScreenerAPI) {
		dexScreenerAPI = new DexScreenerAPI();
		
		// Clean cache every 10 minutes
		setInterval(() => {
			dexScreenerAPI?.cleanCache();
		}, 10 * 60 * 1000);
	}
	return dexScreenerAPI;
}

export { DexScreenerAPI };