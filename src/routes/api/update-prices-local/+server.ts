import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';
import { getDexScreenerAPI } from '$lib/server/dex-screener';

export const GET: RequestHandler = async () => {
  try {
    console.log('🔄 Starting local price update...');
    
    // Get active token addresses from recent calls
    const { data: calls, error: callsError } = await supabaseAdmin
      .from('calls')
      .select('contract_address, token_symbol')
      .not('contract_address', 'is', null)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .limit(20);

    if (callsError) {
      throw new Error(`Failed to get active tokens: ${callsError.message}`);
    }

    if (!calls || calls.length === 0) {
      return json({ 
        success: true, 
        message: 'No active tokens to update',
        tokensProcessed: 0,
        snapshotsInserted: 0
      });
    }

    // Get unique token addresses
    const uniqueTokens = Array.from(
      new Map(calls.map(call => [call.contract_address, call]))
        .values()
    ).filter(call => call.contract_address);

    console.log(`📋 Updating prices for ${uniqueTokens.length} tokens`);

    const dexAPI = getDexScreenerAPI();
    let totalProcessed = 0;
    let totalInserted = 0;
    const errors: string[] = [];

    // Process tokens in batches
    const BATCH_SIZE = 5;
    for (let i = 0; i < uniqueTokens.length; i += BATCH_SIZE) {
      const batch = uniqueTokens.slice(i, i + BATCH_SIZE);
      
      for (const token of batch) {
        try {
          totalProcessed++;
          
          const priceData = await dexAPI.getTokenPrice(token.contract_address!);
          
          if (!priceData) {
            console.log(`⚠️ No price data for ${token.token_symbol} (${token.contract_address})`);
            continue;
          }

          // Create timestamp rounded to nearest 5 minutes for consistency
          const now = new Date();
          const minutes = Math.floor(now.getMinutes() / 5) * 5;
          const roundedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minutes, 0, 0);

          // Insert snapshot
          const snapshot = {
            time: roundedTime.toISOString(),
            token_address: token.contract_address,
            price_usd: priceData.priceUsd || 0,
            price_native: null,
            volume_5m: null,
            volume_1h: null,
            volume_24h: priceData.volume24h || 0,
            liquidity_usd: priceData.liquidity || null,
            market_cap: priceData.marketCap || null,
            price_change_5m: null,
            price_change_1h: priceData.priceChange1h || null,
            price_change_24h: priceData.priceChange24h || null,
            txn_buys_5m: null,
            txn_sells_5m: null,
            dex_id: priceData.dexId || null,
            pair_address: priceData.pairAddress || null,
            source: 'dexscreener_local'
          };

          const { error: insertError } = await supabaseAdmin
            .from('token_price_snapshots_5m')
            .upsert([snapshot], { 
              onConflict: 'time,token_address',
              ignoreDuplicates: false 
            });

          if (insertError) {
            errors.push(`${token.token_symbol}: ${insertError.message}`);
            console.error(`❌ Insert error for ${token.token_symbol}:`, insertError);
            continue;
          }

          totalInserted++;
          console.log(`✅ ${token.token_symbol}: $${priceData.priceUsd} - snapshot inserted`);

        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`${token.token_symbol}: ${errorMsg}`);
          console.error(`❌ Error processing ${token.token_symbol}:`, errorMsg);
        }
      }

      // Small delay between batches
      if (i + BATCH_SIZE < uniqueTokens.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`🏁 Local price update completed: ${totalInserted} snapshots inserted, ${errors.length} errors`);

    return json({
      success: true,
      timestamp: new Date().toISOString(),
      tokensProcessed: totalProcessed,
      snapshotsInserted: totalInserted,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Local price update error:', error);
    
    return json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};