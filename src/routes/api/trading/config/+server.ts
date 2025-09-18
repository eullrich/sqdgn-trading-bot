import { json } from '@sveltejs/kit';
import { tradingRepo } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const walletAddress = url.searchParams.get('wallet');

		if (!walletAddress) {
			return json({ success: false, error: 'Wallet address is required' }, { status: 400 });
		}

		const config = await tradingRepo.findUserConfig(walletAddress);

		return json({
			success: true,
			config: config || {
				isAutoBuyEnabled: false,
				defaultBuyAmountSol: 0.1,
				maxPositionSizeSol: 1.0,
				defaultSlippageBps: 100,
				maxSlippageBps: 500,
				trailingStopEnabled: true,
				trailingStopPercentage: 10.0
			}
		});

	} catch (error) {
		console.error('Error in GET /api/trading/config:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		
		const {
			user_wallet_address,
			telegram_user_id,
			is_auto_buy_enabled,
			default_buy_amount_sol,
			max_position_size_sol,
			default_slippage_bps,
			max_slippage_bps,
			trailing_stop_enabled,
			trailing_stop_percentage
		} = body;
		
		if (!user_wallet_address) {
			return json({ success: false, error: 'Wallet address is required' }, { status: 400 });
		}
		
		// Validate numeric values
		if (default_buy_amount_sol <= 0 || default_buy_amount_sol > 100) {
			return json({ success: false, error: 'Buy amount must be between 0.01 and 100 SOL' }, { status: 400 });
		}
		
		if (max_position_size_sol <= 0 || max_position_size_sol > 1000) {
			return json({ success: false, error: 'Max position size must be between 0.1 and 1000 SOL' }, { status: 400 });
		}
		
		if (default_slippage_bps < 50 || default_slippage_bps > 2000) {
			return json({ success: false, error: 'Default slippage must be between 0.5% and 20%' }, { status: 400 });
		}
		
		if (max_slippage_bps < 100 || max_slippage_bps > 2000) {
			return json({ success: false, error: 'Max slippage must be between 1% and 20%' }, { status: 400 });
		}
		
		if (trailing_stop_percentage < 5 || trailing_stop_percentage > 50) {
			return json({ success: false, error: 'Trailing stop percentage must be between 5% and 50%' }, { status: 400 });
		}
		
		// Upsert configuration
		const config = await tradingRepo.upsertUserConfig({
			userWalletAddress: user_wallet_address,
			telegramUserId: telegram_user_id,
			isAutoBuyEnabled: is_auto_buy_enabled,
			defaultBuyAmountSol: default_buy_amount_sol,
			maxPositionSizeSol: max_position_size_sol,
			defaultSlippageBps: default_slippage_bps,
			maxSlippageBps: max_slippage_bps,
			trailingStopEnabled: trailing_stop_enabled,
			trailingStopPercentage: trailing_stop_percentage,
			updatedAt: new Date()
		});

		return json({ success: true, config });
		
	} catch (error) {
		console.error('Error in POST /api/trading/config:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};