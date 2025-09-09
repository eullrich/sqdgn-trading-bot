import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';
import { DataPipeline } from '$lib/server/data-pipeline';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const tokenSymbol = url.searchParams.get('token');
		const callType = url.searchParams.get('call_type');
		const label = url.searchParams.get('label');
		const isValid = url.searchParams.get('is_valid');
		const sortField = url.searchParams.get('sort_field') || 'created_at';
		const sortDirection = url.searchParams.get('sort_direction') || 'desc';

		// Simplified query to avoid JOIN issues - use existing price columns
		let query = supabaseAdmin
			.from('calls_with_performance')
			.select('*')
			.order(sortField, { ascending: sortDirection === 'asc' })
			.range(offset, offset + limit - 1);

		// Apply filters
		if (tokenSymbol) {
			query = query.eq('token_symbol', tokenSymbol.toUpperCase());
		}

		if (callType) {
			query = query.eq('call_type', callType);
		}

		if (label) {
			query = query.eq('sqdgn_label', label);
		}

		if (isValid !== null) {
			query = query.eq('is_valid', isValid === 'true');
		}

		const { data, error, count } = await query;

		if (error) {
			console.error('Database error:', error);
			console.error('Query details:', { limit, offset, tokenSymbol, callType, label, isValid });
			return json({ error: 'Failed to fetch calls', details: error.message }, { status: 500 });
		}

		if (!data) {
			console.warn('No data returned from query');
			return json({ calls: [], pagination: { limit, offset, total: 0 } });
		}

		// Process the data - use existing market cap and price columns from calls_with_performance
		const processedCalls = (data || []).map((call: Record<string, any>) => {
			// Calculate market cap change percentage
			let marketCapChange: number | null = null;
			if (call.market_cap && call.current_market_cap && call.market_cap > 0) {
				marketCapChange = ((call.current_market_cap - call.market_cap) / call.market_cap) * 100;
			}
			
			return {
				...call,
				// Map existing price columns for consistent frontend access
				latest_price_usd: call.current_price_usd || null,
				latest_market_cap: call.current_market_cap || null,
				market_cap_change: marketCapChange,
				price_last_updated: call.price_updated_at || null,
				market_cap_last_updated: call.market_cap_updated_at || null
			};
		});

		return json({
			calls: processedCalls,
			pagination: {
				limit,
				offset,
				total: count
			}
		});

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { messages } = body;

		if (!Array.isArray(messages)) {
			return json({ error: 'Messages must be an array' }, { status: 400 });
		}

		// Validate message format
		for (const message of messages) {
			if (!message.messageId || !message.text) {
				return json({ 
					error: 'Each message must have messageId and text fields' 
				}, { status: 400 });
			}
		}

		// Process the messages
		const result = await DataPipeline.batchProcessMessages(messages);

		return json({
			success: result.success,
			processed: result.processed,
			created: result.created,
			updated: result.updated,
			errors: result.errors
		});

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};