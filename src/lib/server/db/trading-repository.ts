import type { Prisma } from '@prisma/client';
import { db } from './index';

export class TradingRepository {
	// ===== TRADING POSITIONS =====

	/**
	 * Get all positions for a user
	 */
	async findPositionsByUser(
		userWalletAddress: string,
		options: {
			status?: string;
			orderBy?: Prisma.TradingPositionOrderByWithRelationInput;
			take?: number;
			skip?: number;
			include?: Prisma.TradingPositionInclude;
		} = {}
	) {
		const { status, ...restOptions } = options;
		return db.tradingPosition.findMany({
			where: {
				userWalletAddress,
				...(status && { status }),
			},
			...restOptions,
		});
	}

	/**
	 * Get a position by ID
	 */
	async findPositionById(id: string, include?: Prisma.TradingPositionInclude) {
		return db.tradingPosition.findUnique({
			where: { id },
			include,
		});
	}

	/**
	 * Create a new trading position
	 */
	async createPosition(data: Prisma.TradingPositionCreateInput) {
		return db.tradingPosition.create({
			data,
		});
	}

	/**
	 * Update a trading position
	 */
	async updatePosition(id: string, data: Prisma.TradingPositionUpdateInput) {
		return db.tradingPosition.update({
			where: { id },
			data,
		});
	}

	/**
	 * Close a position
	 */
	async closePosition(
		id: string,
		exitData: {
			exitPrice: number;
			exitAmountSol: number;
			exitReason: string;
			exitTxSignature?: string;
			realizedPnlSol: number;
		}
	) {
		return db.tradingPosition.update({
			where: { id },
			data: {
				status: 'closed',
				closedAt: new Date(),
				exitPrice: exitData.exitPrice,
				exitAmountSol: exitData.exitAmountSol,
				exitReason: exitData.exitReason,
				exitTxSignature: exitData.exitTxSignature,
				realizedPnlSol: exitData.realizedPnlSol,
			},
		});
	}

	/**
	 * Get open positions with trailing stops
	 */
	async findOpenPositionsWithStops() {
		return db.tradingPosition.findMany({
			where: {
				status: 'open',
				trailingStops: {
					some: {
						isActive: true,
					},
				},
			},
			include: {
				trailingStops: {
					where: {
						isActive: true,
					},
				},
			},
		});
	}

	// ===== TRAILING STOPS =====

	/**
	 * Create a trailing stop
	 */
	async createTrailingStop(data: Prisma.TrailingStopCreateInput) {
		return db.trailingStop.create({
			data,
		});
	}

	/**
	 * Update a trailing stop
	 */
	async updateTrailingStop(id: string, data: Prisma.TrailingStopUpdateInput) {
		return db.trailingStop.update({
			where: { id },
			data,
		});
	}

	/**
	 * Get active trailing stops
	 */
	async findActiveTrailingStops() {
		return db.trailingStop.findMany({
			where: {
				isActive: true,
				position: {
					status: 'open',
				},
			},
			include: {
				position: {
					select: {
						id: true,
						tokenAddress: true,
						userWalletAddress: true,
						entryAmountTokens: true,
						status: true,
					},
				},
			},
		});
	}

	/**
	 * Deactivate a trailing stop
	 */
	async deactivateTrailingStop(id: string) {
		return db.trailingStop.update({
			where: { id },
			data: {
				isActive: false,
				triggeredAt: new Date(),
			},
		});
	}

	// ===== USER TRADING CONFIG =====

	/**
	 * Get user trading configuration
	 */
	async findUserConfig(userWalletAddress: string) {
		return db.userTradingConfig.findUnique({
			where: { userWalletAddress },
		});
	}

	/**
	 * Create or update user trading configuration
	 */
	async upsertUserConfig(
		userWalletAddress: string,
		data: Prisma.UserTradingConfigCreateInput
	) {
		return db.userTradingConfig.upsert({
			where: { userWalletAddress },
			create: data,
			update: data,
		});
	}

	/**
	 * Get users with auto-buy enabled
	 */
	async findAutoBuyUsers() {
		return db.userTradingConfig.findMany({
			where: {
				isAutoBuyEnabled: true,
			},
		});
	}

	// ===== AUTO BUY QUEUE =====

	/**
	 * Add order to auto-buy queue
	 */
	async queueAutoBuy(data: Prisma.AutoBuyQueueCreateInput) {
		return db.autoBuyQueue.create({
			data,
		});
	}

	/**
	 * Get pending auto-buy orders
	 */
	async findPendingAutoBuyOrders(limit: number = 10) {
		return db.autoBuyQueue.findMany({
			where: {
				status: 'pending',
			},
			orderBy: {
				createdAt: 'asc',
			},
			take: limit,
			include: {
				call: {
					select: {
						tokenSymbol: true,
						contractAddress: true,
					},
				},
			},
		});
	}

	/**
	 * Update auto-buy order status
	 */
	async updateAutoBuyOrder(
		id: string,
		data: {
			status: string;
			errorMessage?: string;
			tradeId?: string;
			processedAt?: Date;
		}
	) {
		return db.autoBuyQueue.update({
			where: { id },
			data: {
				...data,
				processedAt: data.processedAt || new Date(),
			},
		});
	}

	// ===== TRADE HISTORY =====

	/**
	 * Log a trade execution
	 */
	async logTrade(data: Prisma.TradeHistoryCreateInput) {
		return db.tradeHistory.create({
			data,
		});
	}

	/**
	 * Get trade history for a user
	 */
	async findTradeHistory(
		userWalletAddress: string,
		options: {
			positionId?: string;
			tradeType?: string;
			orderBy?: Prisma.TradeHistoryOrderByWithRelationInput;
			take?: number;
			skip?: number;
		} = {}
	) {
		const { positionId, tradeType, ...restOptions } = options;
		return db.tradeHistory.findMany({
			where: {
				userWalletAddress,
				...(positionId && { positionId }),
				...(tradeType && { tradeType }),
			},
			include: {
				position: {
					select: {
						tokenSymbol: true,
						tokenAddress: true,
					},
				},
			},
			...restOptions,
		});
	}

	/**
	 * Update trade status
	 */
	async updateTradeStatus(
		id: string,
		status: string,
		txSignature?: string,
		errorMessage?: string
	) {
		return db.tradeHistory.update({
			where: { id },
			data: {
				txStatus: status,
				txSignature,
				errorMessage,
				confirmedAt: status === 'confirmed' ? new Date() : undefined,
			},
		});
	}

	// ===== ANALYTICS QUERIES =====

	/**
	 * Get trading metrics for a user
	 */
	async getUserTradingMetrics(userWalletAddress: string) {
		const [positions, trades] = await Promise.all([
			db.tradingPosition.findMany({
				where: { userWalletAddress },
				select: {
					status: true,
					realizedPnlSol: true,
					unrealizedPnlSol: true,
					openedAt: true,
					closedAt: true,
				},
			}),
			db.tradeHistory.findMany({
				where: { userWalletAddress },
				select: {
					tradeType: true,
					amountSol: true,
					createdAt: true,
				},
			}),
		]);

		const openPositions = positions.filter((p) => p.status === 'open');
		const closedPositions = positions.filter((p) => p.status === 'closed');

		const totalPnL = closedPositions.reduce(
			(sum, p) => sum + (p.realizedPnlSol?.toNumber() || 0),
			0
		);

		const winningTrades = closedPositions.filter(
			(p) => (p.realizedPnlSol?.toNumber() || 0) > 0
		);

		const winRate =
			closedPositions.length > 0
				? (winningTrades.length / closedPositions.length) * 100
				: 0;

		// Calculate average hold time in hours
		const holdTimes = closedPositions
			.filter((p) => p.openedAt && p.closedAt)
			.map((p) => {
				const opened = new Date(p.openedAt!).getTime();
				const closed = new Date(p.closedAt!).getTime();
				return (closed - opened) / (1000 * 60 * 60); // Convert to hours
			});

		const averageHoldTime =
			holdTimes.length > 0
				? holdTimes.reduce((sum, time) => sum + time, 0) / holdTimes.length
				: 0;

		return {
			totalPositions: positions.length,
			openPositions: openPositions.length,
			totalPnL,
			winRate,
			averageHoldTime,
			totalTrades: trades.length,
		};
	}

	/**
	 * Get positions by token
	 */
	async findPositionsByToken(tokenAddress: string) {
		return db.tradingPosition.findMany({
			where: { tokenAddress },
			include: {
				call: {
					select: {
						tokenSymbol: true,
						sqdgnLabel: true,
						callType: true,
					},
				},
			},
			orderBy: {
				openedAt: 'desc',
			},
		});
	}
}