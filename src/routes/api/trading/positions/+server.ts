import { json } from '@sveltejs/kit';
import { tradingRepo } from '$lib/server/database';
import { getTradingService } from '$lib/server/services/trading/TradingService';
import { PositionManager } from '$lib/server/services/trading/PositionManager';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const walletAddress = url.searchParams.get('wallet');
		const status = url.searchParams.get('status') || 'open';

		if (!walletAddress) {
			return json({ success: false, error: 'Wallet address is required' }, { status: 400 });
		}

		const positions = await tradingRepo.findPositionsByUser(walletAddress, {
			...(status !== 'all' && { status }),
			orderBy: { openedAt: 'desc' }
		});

		return json({ success: true, positions: positions || [] });

	} catch (error) {
		console.error('Error in GET /api/trading/positions:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { action, positionId, walletAddress } = await request.json();

		if (action === 'close') {
			if (!positionId || !walletAddress) {
				return json({ success: false, error: 'Position ID and wallet address are required' }, { status: 400 });
			}

			// Get position details
			const position = await tradingRepo.findPositionById(positionId);

			if (!position || position.userWalletAddress !== walletAddress || position.status !== 'open') {
				return json({ success: false, error: 'Position not found or already closed' }, { status: 404 });
			}

			// For now, simulate closing the position
			// In a real implementation, this would execute a sell order through Jupiter
			const currentPrice = position.currentPrice || position.entryPrice;
			const exitValueSol = (position.entryAmountTokens * currentPrice) / 1e9;
			const realizedPnl = exitValueSol - position.entryAmountSol;

			// Update position
			await tradingRepo.updatePosition(positionId, {
				status: 'closed',
				exitPrice: currentPrice,
				exitAmountSol: exitValueSol,
				exitReason: 'manual',
				realizedPnlSol: realizedPnl,
				closedAt: new Date()
			});

			// Create trade history record
			await tradingRepo.logTrade({
				positionId,
				userWalletAddress: walletAddress,
				tokenAddress: position.tokenAddress,
				tokenSymbol: position.tokenSymbol,
				tradeType: 'sell',
				amountSol: exitValueSol,
				amountTokens: position.entryAmountTokens,
				price: currentPrice,
				txStatus: 'confirmed'
			});

			// Deactivate trailing stops if they exist
			const trailingStops = await tradingRepo.findActiveTrailingStops();
			const relevantStops = trailingStops.filter(stop => stop.positionId === positionId);
			for (const stop of relevantStops) {
				await tradingRepo.deactivateTrailingStop(stop.id);
			}

			return json({ success: true, message: 'Position closed successfully' });
		}

		return json({ success: false, error: 'Invalid action' }, { status: 400 });

	} catch (error) {
		console.error('Error in POST /api/trading/positions:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};