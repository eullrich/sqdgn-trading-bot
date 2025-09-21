import { callsRepo, priceRepo } from '../database';

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

interface PriceSnapshot {
  tokenAddress: string;
  tokenSymbol: string;
  priceUsd: number;
  priceNative: number;
  volume5m: number;
  volume1h: number;
  volume24h: number;
  liquidityUsd: number;
  marketCap: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;
  txnBuys5m: number;
  txnSells5m: number;
  dexId: string;
  pairAddress: string;
}

export class PriceService {
  private static readonly BASE_URL = 'https://api.dexscreener.com';
  private static readonly RATE_LIMIT_PER_MINUTE = 300;
  private static readonly BATCH_SIZE = 30;
  
  private requestCount = 0;
  private windowStart = Date.now();
  private cache = new Map<string, { data: PriceSnapshot; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async fetchTokenPrice(address: string): Promise<PriceSnapshot | null> {
    // Check cache first
    const cached = this.getFromCache(address);
    if (cached) return cached;

    try {
      await this.enforceRateLimit();
      
      const url = `${PriceService.BASE_URL}/latest/dex/tokens/${address}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'SQDGN-Trading-Bot/2.0' }
      });

      if (!response.ok) {
        console.error(`API error ${response.status} for ${address}`);
        return null;
      }

      const data = await response.json();
      
      if (!data.pairs || data.pairs.length === 0) {
        console.warn(`No pairs found for ${address}`);
        return null;
      }

      // Find best pair by liquidity
      const bestPair: TokenPair = data.pairs.reduce((best: TokenPair, current: TokenPair) => 
        (current.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? current : best
      );

      const snapshot: PriceSnapshot = {
        tokenAddress: address,
        tokenSymbol: bestPair.baseToken.symbol,
        priceUsd: parseFloat(bestPair.priceUsd) || 0,
        priceNative: parseFloat(bestPair.priceNative) || 0,
        volume5m: bestPair.volume?.m5 || 0,
        volume1h: bestPair.volume?.h1 || 0,
        volume24h: bestPair.volume?.h24 || 0,
        liquidityUsd: bestPair.liquidity?.usd || 0,
        marketCap: bestPair.marketCap || 0,
        priceChange5m: bestPair.priceChange?.m5 || 0,
        priceChange1h: bestPair.priceChange?.h1 || 0,
        priceChange24h: bestPair.priceChange?.h24 || 0,
        txnBuys5m: bestPair.txns?.m5?.buys || 0,
        txnSells5m: bestPair.txns?.m5?.sells || 0,
        dexId: bestPair.dexId,
        pairAddress: bestPair.pairAddress
      };

      this.addToCache(address, snapshot);
      return snapshot;

    } catch (error) {
      console.error(`Failed to fetch price for ${address}:`, error);
      return null;
    }
  }

  async fetchMultipleTokenPrices(addresses: string[]): Promise<Map<string, PriceSnapshot>> {
    const results = new Map<string, PriceSnapshot>();
    
    // Check cache and filter out what we need to fetch
    const toFetch: string[] = [];
    for (const address of addresses) {
      const cached = this.getFromCache(address);
      if (cached) {
        results.set(address, cached);
      } else {
        toFetch.push(address);
      }
    }

    if (toFetch.length === 0) {
      console.log('All prices served from cache');
      return results;
    }

    console.log(`Fetching ${toFetch.length} prices (${results.size} from cache)`);

    // Process in batches
    for (let i = 0; i < toFetch.length; i += PriceService.BATCH_SIZE) {
      const batch = toFetch.slice(i, i + PriceService.BATCH_SIZE);
      
      // Fetch batch in parallel with error handling
      const promises = batch.map(addr => 
        this.fetchTokenPrice(addr).catch(err => {
          console.error(`Failed to fetch ${addr}:`, err);
          return null;
        })
      );

      const batchResults = await Promise.all(promises);
      
      for (let j = 0; j < batch.length; j++) {
        const result = batchResults[j];
        if (result) {
          results.set(batch[j], result);
        }
      }

      // Small delay between batches
      if (i + PriceService.BATCH_SIZE < toFetch.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  async ingestPriceSnapshots(): Promise<{ inserted: number; errors: number; tokens: number; duration: number; skipped: number }> {
    const startTime = Date.now();
    try {
      // Optimized: Get unique token addresses directly from recent calls
      const uniqueAddresses = await this.getUniqueRecentTokens();

      if (uniqueAddresses.length === 0) {
        console.log('No tokens to fetch prices for');
        return { inserted: 0, errors: 0, tokens: 0, duration: Date.now() - startTime, skipped: 0 };
      }
      console.log(`Found ${uniqueAddresses.length} unique tokens to fetch`);

      // Skip tokens with recent price data to reduce API calls
      const tokensToFetch = await this.filterTokensForUpdate(uniqueAddresses);
      const skipped = uniqueAddresses.length - tokensToFetch.length;

      if (skipped > 0) {
        console.log(`Skipping ${skipped} tokens with recent price data`);
      }

      // Fetch prices for remaining tokens
      const priceMap = tokensToFetch.length > 0
        ? await this.fetchMultipleTokenPrices(tokensToFetch)
        : new Map<string, PriceSnapshot>();

      // Add cached prices for skipped tokens
      for (const address of uniqueAddresses) {
        if (!priceMap.has(address)) {
          const cached = this.getFromCache(address);
          if (cached) {
            priceMap.set(address, cached);
          }
        }
      }
      
      // Prepare snapshots for insertion and batch call updates
      const snapshots = [];
      const callUpdates = new Map<string, any>();
      const now = new Date().toISOString();
      
      for (const [address, snapshot] of priceMap.entries()) {
        snapshots.push({
          time: now,
          token_address: address,
          price_usd: snapshot.priceUsd,
          price_native: snapshot.priceNative,
          volume_5m: snapshot.volume5m,
          volume_1h: snapshot.volume1h,
          volume_24h: snapshot.volume24h,
          liquidity_usd: snapshot.liquidityUsd,
          market_cap: snapshot.marketCap,
          price_change_5m: snapshot.priceChange5m,
          price_change_1h: snapshot.priceChange1h,
          price_change_24h: snapshot.priceChange24h,
          txn_buys_5m: snapshot.txnBuys5m,
          txn_sells_5m: snapshot.txnSells5m,
          dex_id: snapshot.dexId,
          pair_address: snapshot.pairAddress,
          source: 'price_service'
        });

        // Track for batch call updates
        callUpdates.set(address, {
          currentPriceUsd: snapshot.priceUsd,
          currentMarketCap: snapshot.marketCap,
          priceUpdatedAt: new Date(now),
          marketCapUpdatedAt: new Date(now)
        });
      }

      // Batch insert snapshots and update calls
      let insertedCount = 0;
      if (snapshots.length > 0) {
        try {
          const result = await priceRepo.batchInsertSnapshots(snapshots.map(snapshot => ({
            tokenAddress: snapshot.token_address,
            tokenSymbol: snapshot.token_symbol,
            time: new Date(snapshot.time),
            priceUsd: snapshot.price_usd,
            priceNative: snapshot.price_native,
            volume24h: snapshot.volume_24h,
            volume5m: snapshot.volume_5m,
            volume1h: snapshot.volume_1h,
            liquidityUsd: snapshot.liquidity_usd,
            marketCap: snapshot.market_cap,
            priceChange5m: snapshot.price_change_5m,
            priceChange1h: snapshot.price_change_1h,
            priceChange24h: snapshot.price_change_24h,
            txnBuys5m: snapshot.txn_buys_5m,
            txnSells5m: snapshot.txn_sells_5m,
            dexId: snapshot.dex_id,
            pairAddress: snapshot.pair_address,
            source: snapshot.source
          })));
          insertedCount = result.count || snapshots.length;
        } catch (insertError) {
          console.error('Failed to insert snapshots:', insertError);
          return {
            inserted: 0,
            errors: 1,
            tokens: uniqueAddresses.length,
            duration: Date.now() - startTime,
            skipped: 0
          };
        }
      }

      // Batch update calls table
      if (callUpdates.size > 0) {
        try {
          await this.batchUpdateCalls(callUpdates);
        } catch (updateError) {
          console.warn('Failed to batch update calls:', updateError);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Inserted ${insertedCount} price snapshots for ${uniqueAddresses.length} tokens in ${duration}ms (skipped ${skipped})`);

      return {
        inserted: insertedCount,
        errors: uniqueAddresses.length - priceMap.size,
        tokens: uniqueAddresses.length,
        duration,
        skipped
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Price ingestion failed:', error);
      return { inserted: 0, errors: 1, tokens: 0, duration, skipped: 0 };
    }
  }

  /**
   * Optimized method to get unique token addresses from recent calls
   */
  private async getUniqueRecentTokens(): Promise<string[]> {
    try {
      // Use a more efficient query to get unique contract addresses
      const result = await callsRepo.findUniqueRecentContracts(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      return result.filter(Boolean) as string[];
    } catch (error) {
      console.warn('Failed to get unique recent tokens, falling back to full query:', error);

      // Fallback to original method
      const calls = await callsRepo.findMany({
        where: {
          contractAddress: { not: null },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        },
        select: {
          contractAddress: true
        }
      });

      return [...new Set(calls.map(c => c.contractAddress).filter(Boolean))] as string[];
    }
  }

  /**
   * Filter tokens that need price updates (skip recent data)
   */
  private async filterTokensForUpdate(addresses: string[]): Promise<string[]> {
    const tokensToFetch: string[] = [];
    const minUpdateInterval = 4 * 60 * 1000; // 4 minutes

    for (const address of addresses) {
      // Check cache first
      const cached = this.getFromCache(address);
      if (cached) {
        continue; // Skip if in cache
      }

      // Check database for recent price data
      try {
        const latest = await priceRepo.getLatestPrice(address);
        if (!latest || (Date.now() - new Date(latest.time).getTime()) > minUpdateInterval) {
          tokensToFetch.push(address);
        }
      } catch (error) {
        // If we can't check, fetch it
        tokensToFetch.push(address);
      }
    }

    return tokensToFetch;
  }

  /**
   * Batch update calls table with new price data
   */
  private async batchUpdateCalls(updates: Map<string, any>): Promise<void> {
    const batchSize = 50;
    const addresses = Array.from(updates.keys());

    for (let i = 0; i < addresses.length; i += batchSize) {
      const batch = addresses.slice(i, i + batchSize);

      try {
        await Promise.all(batch.map(async (address) => {
          const update = updates.get(address);
          if (update) {
            await callsRepo.batchUpdateByContract(address, update);
          }
        }));
      } catch (error) {
        console.warn(`Failed to batch update calls for addresses ${batch.join(', ')}:`, error);
      }
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if minute has passed
    if (now - this.windowStart >= 60000) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    // Wait if at limit
    if (this.requestCount >= PriceService.RATE_LIMIT_PER_MINUTE) {
      const waitTime = 60000 - (now - this.windowStart);
      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Reset after waiting
      this.requestCount = 0;
      this.windowStart = Date.now();
    }

    this.requestCount++;
  }

  private getFromCache(address: string): PriceSnapshot | null {
    const cached = this.cache.get(address.toLowerCase());
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    
    // Remove expired entry
    if (cached) {
      this.cache.delete(address.toLowerCase());
    }
    
    return null;
  }

  private addToCache(address: string, data: PriceSnapshot): void {
    this.cache.set(address.toLowerCase(), {
      data,
      timestamp: Date.now()
    });

    // Clean old entries if cache is too large
    if (this.cache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > this.CACHE_TTL) {
          this.cache.delete(key);
        }
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Could track this if needed
    };
  }
}

// Singleton instance
let priceServiceInstance: PriceService | null = null;

export function getPriceService(): PriceService {
  if (!priceServiceInstance) {
    priceServiceInstance = new PriceService();
  }
  return priceServiceInstance;
}