import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';
import { getDexScreenerAPI, type TokenPriceData } from '$lib/server/dex-screener';

interface PriceFetchResult {
	success: boolean;
	processed: number;
	updated: number;
	errors: Array<{
		callId: string;
		error: string;
	}>;
	priceData: Array<{
		callId: string;
		symbol: string;
		priceUsd: number;
		marketCap: number;
		priceChange24h: number;
		marketCapChange?: number;
	}>;
}

export const POST: RequestHandler = async ({ url }) => {
	try {
		const forceRefresh = url.searchParams.get('force') === 'true';
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
		
		console.log(`🔄 Starting price fetch process (force: ${forceRefresh}, limit: ${limit})`);

		// Get calls that have contract addresses and need price updates
		let query = supabaseAdmin
			.from('calls')
			.select('id, token_symbol, contract_address, market_cap, current_price_usd, current_market_cap, price_updated_at, created_at')
			.not('contract_address', 'is', null)
			.order('created_at', { ascending: false })
			.limit(limit);

		// If not forcing refresh, only get calls that haven't been updated recently
		if (!forceRefresh) {
			// Get calls where price was never fetched or is older than 30 minutes
			const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
			query = query.or(`price_updated_at.is.null,price_updated_at.lt.${thirtyMinutesAgo}`);
		}

		const { data: calls, error: fetchError } = await query;

		if (fetchError) {
			console.error('Database error fetching calls:', fetchError);
			return json({ error: 'Failed to fetch calls from database' }, { status: 500 });
		}

		if (!calls || calls.length === 0) {
			return json({
				success: true,
				processed: 0,
				updated: 0,
				errors: [],
				priceData: [],
				message: 'No calls found requiring price updates'
			});
		}

		console.log(`📊 Found ${calls.length} calls needing price updates`);

		const result: PriceFetchResult = {
			success: true,
			processed: 0,
			updated: 0,
			errors: [],
			priceData: []
		};

		// Get unique contract addresses to minimize API calls
		const uniqueAddresses = Array.from(new Set(calls.map(call => call.contract_address).filter(Boolean))) as string[];
		console.log(`🔍 Fetching prices for ${uniqueAddresses.length} unique tokens`);

		// Fetch price data from DEX Screener
		const dexAPI = getDexScreenerAPI();
		const priceDataMap = await dexAPI.getTokenPrices(uniqueAddresses);

		// Process each call
		for (const call of calls) {
			result.processed++;
			
			if (!call.contract_address) {
				result.errors.push({
					callId: call.id,
					error: 'No contract address available'
				});
				continue;
			}

			const priceData = priceDataMap.get(call.contract_address);
			if (!priceData) {
				result.errors.push({
					callId: call.id,
					error: 'Price data not available from DEX Screener'
				});
				continue;
			}

			try {
				// Start a transaction to update both tables
				const now = new Date().toISOString();

				// Insert price data into token_prices table
				const { error: priceInsertError } = await supabaseAdmin
					.from('token_prices')
					.insert({
						call_id: call.id,
						token_address: call.contract_address,
						symbol: priceData.symbol,
						name: priceData.name,
						price_usd: priceData.priceUsd,
						price_change_1h: priceData.priceChange1h,
						price_change_24h: priceData.priceChange24h,
						volume_24h: priceData.volume24h,
						liquidity_usd: priceData.liquidity,
						market_cap: priceData.marketCap,
						dex_id: priceData.dexId,
						pair_address: priceData.pairAddress,
						fetched_at: now
					});

				if (priceInsertError) {
					console.error(`❌ Error inserting price data for call ${call.id}:`, priceInsertError);
					result.errors.push({
						callId: call.id,
						error: `Failed to insert price data: ${priceInsertError.message}`
					});
					continue;
				}

				// Update the calls table with current price and market cap
				const { error: callUpdateError } = await supabaseAdmin
					.from('calls')
					.update({
						current_price_usd: priceData.priceUsd,
						current_market_cap: priceData.marketCap,
						price_updated_at: now,
						market_cap_updated_at: now
					})
					.eq('id', call.id);

				if (callUpdateError) {
					console.error(`❌ Error updating call ${call.id}:`, callUpdateError);
					result.errors.push({
						callId: call.id,
						error: `Failed to update call: ${callUpdateError.message}`
					});
					continue;
				}

				result.updated++;
				
				// Calculate market cap change percentage if we have initial market cap
				let marketCapChange: number | undefined;
				if (call.market_cap && call.market_cap > 0) {
					marketCapChange = ((priceData.marketCap - call.market_cap) / call.market_cap) * 100;
				}
				
				result.priceData.push({
					callId: call.id,
					symbol: priceData.symbol,
					priceUsd: priceData.priceUsd,
					marketCap: priceData.marketCap,
					priceChange24h: priceData.priceChange24h,
					marketCapChange
				});

				console.log(`✅ Updated price for ${priceData.symbol} (${call.id}): $${priceData.priceUsd}`);

			} catch (error) {
				console.error(`💥 Unexpected error processing call ${call.id}:`, error);
				result.errors.push({
					callId: call.id,
					error: error instanceof Error ? error.message : 'Unknown error'
				});
			}
		}

		if (result.errors.length > 0) {
			result.success = false;
		}

		console.log(`✅ Price fetch completed: ${result.updated}/${result.processed} updated, ${result.errors.length} errors`);

		return json(result);

	} catch (error) {
		console.error('💥 Critical error in price fetch:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			processed: 0,
			updated: 0,
			errors: [],
			priceData: []
		}, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		// Return stats about recent price data
		const { data: stats, error } = await supabaseAdmin
			.from('token_prices')
			.select('call_id, symbol, price_usd, price_change_24h, fetched_at')
			.order('fetched_at', { ascending: false })
			.limit(20);

		if (error) {
			return json({ error: 'Failed to fetch price stats' }, { status: 500 });
		}

		// Get counts
		const { count: totalPrices } = await supabaseAdmin
			.from('token_prices')
			.select('*', { count: 'exact', head: true });

		const { count: callsWithPrices } = await supabaseAdmin
			.from('calls')
			.select('*', { count: 'exact', head: true })
			.not('current_price_usd', 'is', null);

		return json({
			totalPriceRecords: totalPrices || 0,
			callsWithPrices: callsWithPrices || 0,
			recentPrices: stats || [],
			lastUpdate: stats?.[0]?.fetched_at || null
		});

	} catch (error) {
		console.error('Error fetching price stats:', error);
		return json({
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};