import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// DexScreener API types
interface DexScreenerTokenPair {
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
  pairs: DexScreenerTokenPair[] | null;
}

interface PriceSnapshot {
  time: string;
  token_address: string;
  price_usd: number;
  price_native: number;
  volume_5m: number;
  volume_1h: number;
  volume_24h: number;
  liquidity_usd: number;
  market_cap: number;
  price_change_5m: number;
  price_change_1h: number;
  price_change_24h: number;
  txn_buys_5m: number;
  txn_sells_5m: number;
  dex_id: string;
  pair_address: string;
  source: string;
}

// Rate limiting for DexScreener API (300 requests per minute)
class RateLimiter {
  private requests: number[] = [];
  private readonly limit = 300; // requests per minute
  private readonly window = 60 * 1000; // 1 minute in milliseconds

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than 1 minute
    this.requests = this.requests.filter(time => now - time < this.window);
    
    if (this.requests.length < this.limit) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0;
    const oldest = Math.min(...this.requests);
    return Math.max(0, this.window - (Date.now() - oldest));
  }
}

const rateLimiter = new RateLimiter();

async function fetchTokenPriceData(tokenAddress: string): Promise<PriceSnapshot | null> {
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    console.log(`⏳ Rate limit reached, waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return fetchTokenPriceData(tokenAddress); // Retry
  }

  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    console.log(`📊 Fetching price data for ${tokenAddress}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SQDGN-Trading-Bot/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status} ${response.statusText}`);
    }

    const data: DexScreenerResponse = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      console.warn(`⚠️ No pairs found for token ${tokenAddress}`);
      return null;
    }

    // Find the best pair (highest liquidity)
    const bestPair = data.pairs.reduce((best, current) => {
      return (current.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? current : best;
    });

    // Create timestamp rounded to nearest 5 minutes
    const now = new Date();
    const minutes = Math.floor(now.getMinutes() / 5) * 5;
    const roundedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minutes, 0, 0);

    const snapshot: PriceSnapshot = {
      time: roundedTime.toISOString(),
      token_address: tokenAddress,
      price_usd: parseFloat(bestPair.priceUsd) || 0,
      price_native: parseFloat(bestPair.priceNative) || 0,
      volume_5m: bestPair.volume?.m5 || 0,
      volume_1h: bestPair.volume?.h1 || 0,
      volume_24h: bestPair.volume?.h24 || 0,
      liquidity_usd: bestPair.liquidity?.usd || 0,
      market_cap: bestPair.marketCap || 0,
      price_change_5m: bestPair.priceChange?.m5 || 0,
      price_change_1h: bestPair.priceChange?.h1 || 0,
      price_change_24h: bestPair.priceChange?.h24 || 0,
      txn_buys_5m: bestPair.txns?.m5?.buys || 0,
      txn_sells_5m: bestPair.txns?.m5?.sells || 0,
      dex_id: bestPair.dexId,
      pair_address: bestPair.pairAddress,
      source: 'dexscreener'
    };

    console.log(`✅ Price snapshot for ${bestPair.baseToken.symbol}: $${snapshot.price_usd} (${bestPair.dexId})`);
    return snapshot;

  } catch (error) {
    console.error(`❌ Error fetching price for ${tokenAddress}:`, error);
    return null;
  }
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { tokenAddresses } = await req.json()

    console.log(`🔄 Starting price snapshot ingestion for ${tokenAddresses?.length || 'auto'} tokens`)

    // Start tracking this ingestion run
    const runId = crypto.randomUUID()
    const startTime = new Date().toISOString()

    await supabase.from('ingestion_runs').insert({
      run_id: runId,
      started_at: startTime,
      ok: null, // Still running
      data_type: 'snapshots'
    })

    let activeTokens: { token_address: string, symbol: string }[] = []
    
    if (tokenAddresses && Array.isArray(tokenAddresses)) {
      // Use provided token addresses
      activeTokens = tokenAddresses.map((addr: string) => ({
        token_address: addr,
        symbol: 'UNKNOWN'
      }))
    } else {
      // Get active tokens from database
      const { data: tokens, error: tokensError } = await supabase
        .rpc('get_active_token_addresses', { days_back: 30 })

      if (tokensError) {
        throw new Error(`Failed to get active tokens: ${tokensError.message}`)
      }

      // Limit to top 50 tokens to stay within rate limits
      activeTokens = (tokens || []).slice(0, 50)
    }

    console.log(`📋 Processing ${activeTokens.length} tokens`)

    let totalProcessed = 0
    let totalInserted = 0
    let errors: string[] = []

    // Process tokens in batches to respect rate limits
    const BATCH_SIZE = 10;
    const batches = [];
    for (let i = 0; i < activeTokens.length; i += BATCH_SIZE) {
      batches.push(activeTokens.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (token) => {
        try {
          totalProcessed++
          
          const snapshot = await fetchTokenPriceData(token.token_address);
          
          if (!snapshot) {
            console.log(`⚠️ No price data for ${token.symbol} (${token.token_address})`);
            return null;
          }

          // Insert snapshot (upsert to handle duplicates)
          const { error: insertError } = await supabase
            .from('token_price_snapshots_5m')
            .upsert([snapshot], { 
              onConflict: 'time,token_address',
              ignoreDuplicates: false 
            })

          if (insertError) {
            errors.push(`${token.symbol}: ${insertError.message}`)
            console.error(`❌ Insert error for ${token.symbol}:`, insertError)
            return null
          }

          console.log(`✅ ${token.symbol}: snapshot inserted`)
          return snapshot

        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error'
          errors.push(`${token.symbol}: ${errorMsg}`)
          console.error(`❌ Error processing ${token.symbol}:`, errorMsg)
          return null
        }
      });

      // Process batch with some parallelism but not too much to avoid overwhelming the API
      const batchResults = await Promise.allSettled(batchPromises);
      const successfulResults = batchResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .length;
      
      totalInserted += successfulResults;

      // Small delay between batches to be respectful
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }
    }

    // Update ingestion run with results
    const endTime = new Date().toISOString()
    await supabase.from('ingestion_runs').update({
      ended_at: endTime,
      ok: errors.length === 0,
      tokens_processed: totalProcessed,
      rows_inserted: totalInserted,
      data_type: 'snapshots',
      error_message: errors.length > 0 ? errors.join('; ') : null
    }).eq('run_id', runId)

    console.log(`🏁 Ingestion completed: ${totalInserted} snapshots inserted, ${errors.length} errors`)

    return new Response(
      JSON.stringify({
        success: true,
        runId,
        tokensProcessed: totalProcessed,
        snapshotsInserted: totalInserted,
        errors: errors.length,
        errorDetails: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Critical error in price snapshot ingestion:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})