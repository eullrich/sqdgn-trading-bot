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

  async ingestPriceSnapshots(): Promise<{ inserted: number; errors: number; tokens: number }> {
    try {
      // Get all unique token addresses from recent calls
      const calls = await callsRepo.findMany({
        where: {
          contractAddress: { not: null },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        },
        select: {
          contractAddress: true,
          tokenSymbol: true
        }
      });

      if (!calls || calls.length === 0) {
        console.log('No tokens to fetch prices for');
        return { inserted: 0, errors: 0, tokens: 0 };
      }

      // Get unique addresses
      const uniqueAddresses = [...new Set(calls.map(c => c.contractAddress).filter(Boolean))] as string[];
      console.log(`Found ${uniqueAddresses.length} unique tokens to fetch`);

      // Fetch prices
      const priceMap = await this.fetchMultipleTokenPrices(uniqueAddresses);
      
      // Prepare snapshots for insertion
      const snapshots = [];
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

        // Also update the calls table with latest price
        try {
          await callsRepo.findMany({
            where: { contractAddress: address }
          }).then(async (callsToUpdate) => {
            await Promise.all(callsToUpdate.map(call =>
              callsRepo.update(call.id, {
                currentPriceUsd: snapshot.priceUsd,
                currentMarketCap: snapshot.marketCap,
                priceUpdatedAt: new Date(now),
                marketCapUpdatedAt: new Date(now)
              })
            ));
          });
        } catch (updateError) {
          console.warn(`Failed to update calls table for ${address}:`, updateError);
        }
      }

      // Batch insert snapshots
      if (snapshots.length > 0) {
        try {
          await priceRepo.batchInsertSnapshots(snapshots.map(snapshot => ({
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
        } catch (insertError) {
          console.error('Failed to insert snapshots:', insertError);
          return {
            inserted: 0,
            errors: 1,
            tokens: uniqueAddresses.length 
          };
        }
      }

      console.log(`✅ Inserted ${snapshots.length} price snapshots for ${uniqueAddresses.length} tokens`);
      
      return {
        inserted: snapshots.length,
        errors: uniqueAddresses.length - priceMap.size,
        tokens: uniqueAddresses.length
      };

    } catch (error) {
      console.error('Price ingestion failed:', error);
      return { inserted: 0, errors: 1, tokens: 0 };
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