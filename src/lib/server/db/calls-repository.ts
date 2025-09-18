import type { Prisma } from '@prisma/client';
import { db } from './index';

export class CallsRepository {
	/**
	 * Get all calls with optional filtering and pagination
	 */
	async findMany(options: {
		where?: Prisma.CallWhereInput;
		orderBy?: Prisma.CallOrderByWithRelationInput;
		take?: number;
		skip?: number;
		include?: Prisma.CallInclude;
	} = {}) {
		return db.call.findMany(options);
	}

	/**
	 * Get a single call by ID
	 */
	async findById(id: string, include?: Prisma.CallInclude) {
		return db.call.findUnique({
			where: { id },
			include,
		});
	}

	/**
	 * Get a call by message ID
	 */
	async findByMessageId(messageId: string, include?: Prisma.CallInclude) {
		return db.call.findUnique({
			where: { messageId },
			include,
		});
	}

	/**
	 * Create a new call
	 */
	async create(data: Prisma.CallCreateInput) {
		return db.call.create({
			data,
		});
	}

	/**
	 * Update an existing call
	 */
	async update(id: string, data: Prisma.CallUpdateInput) {
		return db.call.update({
			where: { id },
			data,
		});
	}

	/**
	 * Delete a call
	 */
	async delete(id: string) {
		return db.call.delete({
			where: { id },
		});
	}

	/**
	 * Get calls with performance data (includes current market data)
	 */
	async findWithPerformance(options: {
		where?: Prisma.CallWhereInput;
		orderBy?: Prisma.CallOrderByWithRelationInput;
		take?: number;
		skip?: number;
	} = {}) {
		return db.call.findMany({
			...options,
			select: {
				id: true,
				createdAt: true,
				messageId: true,
				rawMessage: true,
				messageTimestamp: true,
				tokenSymbol: true,
				tokenName: true,
				contractAddress: true,
				sqdgnLabel: true,
				callType: true,
				marketCap: true,
				liquidity: true,
				volume24h: true,
				currentPriceUsd: true,
				priceUpdatedAt: true,
				currentMarketCap: true,
				marketCapUpdatedAt: true,
				dexScreenerUrl: true,
				jupiterUrl: true,
				raydiumUrl: true,
				isValid: true,
				// Calculate price change percentage
				_count: {
					select: {
						tradingPositions: true,
					},
				},
			},
		});
	}

	/**
	 * Get calls by token address
	 */
	async findByToken(contractAddress: string, options: {
		orderBy?: Prisma.CallOrderByWithRelationInput;
		take?: number;
		skip?: number;
	} = {}) {
		return db.call.findMany({
			where: { contractAddress },
			...options,
		});
	}

	/**
	 * Get recent calls (last 24 hours)
	 */
	async findRecent(hours: number = 24) {
		const since = new Date();
		since.setHours(since.getHours() - hours);

		return db.call.findMany({
			where: {
				createdAt: {
					gte: since,
				},
				isValid: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	/**
	 * Count calls by filters
	 */
	async count(where?: Prisma.CallWhereInput) {
		return db.call.count({ where });
	}

	/**
	 * Update current price data for a call
	 */
	async updatePriceData(
		id: string,
		priceData: {
			currentPriceUsd?: number;
			currentMarketCap?: number;
		}
	) {
		return db.call.update({
			where: { id },
			data: {
				currentPriceUsd: priceData.currentPriceUsd,
				priceUpdatedAt: priceData.currentPriceUsd ? new Date() : undefined,
				currentMarketCap: priceData.currentMarketCap,
				marketCapUpdatedAt: priceData.currentMarketCap ? new Date() : undefined,
			},
		});
	}

	/**
	 * Batch update price data for multiple calls
	 */
	async batchUpdatePrices(
		updates: Array<{
			id: string;
			currentPriceUsd?: number;
			currentMarketCap?: number;
		}>
	) {
		const transaction = updates.map((update) =>
			db.call.update({
				where: { id: update.id },
				data: {
					currentPriceUsd: update.currentPriceUsd,
					priceUpdatedAt: update.currentPriceUsd ? new Date() : undefined,
					currentMarketCap: update.currentMarketCap,
					marketCapUpdatedAt: update.currentMarketCap ? new Date() : undefined,
				},
			})
		);

		return db.$transaction(transaction);
	}

	/**
	 * Search calls by token symbol or name
	 */
	async search(query: string, options: {
		take?: number;
		skip?: number;
	} = {}) {
		return db.call.findMany({
			where: {
				OR: [
					{
						tokenSymbol: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						tokenName: {
							contains: query,
							mode: 'insensitive',
						},
					},
				],
				isValid: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			...options,
		});
	}

	/**
	 * Find many calls with custom filters (used by API)
	 */
	async findManyWithFilters(options: {
		filters?: {
			tokenSymbol?: string;
			callType?: string;
			sqdgnLabel?: string;
			isValid?: boolean;
		};
		orderBy?: Prisma.CallOrderByWithRelationInput;
		skip?: number;
		take?: number;
	}) {
		const { filters = {}, ...restOptions } = options;

		const where: Prisma.CallWhereInput = {
			...(filters.tokenSymbol && { tokenSymbol: filters.tokenSymbol }),
			...(filters.callType && { callType: filters.callType }),
			...(filters.sqdgnLabel && { sqdgnLabel: filters.sqdgnLabel }),
			...(filters.isValid !== undefined && { isValid: filters.isValid }),
		};

		return db.call.findMany({
			where,
			...restOptions,
		});
	}

	/**
	 * Count calls with custom filters (used by API)
	 */
	async countWithFilters(filters: {
		tokenSymbol?: string;
		callType?: string;
		sqdgnLabel?: string;
		isValid?: boolean;
	} = {}) {
		const where: Prisma.CallWhereInput = {
			...(filters.tokenSymbol && { tokenSymbol: filters.tokenSymbol }),
			...(filters.callType && { callType: filters.callType }),
			...(filters.sqdgnLabel && { sqdgnLabel: filters.sqdgnLabel }),
			...(filters.isValid !== undefined && { isValid: filters.isValid }),
		};

		return db.call.count({ where });
	}

	/**
	 * Find recent calls for analytics service
	 */
	async findRecentCalls(options: {
		since?: Date;
		validOnly?: boolean;
		select?: string[];
	} = {}) {
		const where: Prisma.CallWhereInput = {
			...(options.since && { createdAt: { gte: options.since } }),
			...(options.validOnly && { isValid: true }),
		};

		return db.call.findMany({
			where,
			orderBy: { createdAt: 'desc' },
		});
	}

	/**
	 * Find calls by token address
	 */
	async findByTokenAddress(tokenAddress: string) {
		return db.call.findMany({
			where: { contractAddress: tokenAddress },
			orderBy: { createdAt: 'desc' },
		});
	}

	/**
	 * Find calls by multiple token addresses
	 */
	async findByTokenAddresses(tokenAddresses: string[]) {
		return db.call.findMany({
			where: {
				contractAddress: {
					in: tokenAddresses,
				},
			},
			select: {
				contractAddress: true,
				tokenSymbol: true,
			},
		});
	}

	/**
	 * Delete old invalid calls (used by job processor cleanup)
	 */
	async deleteOldInvalidCalls(beforeDate: Date) {
		const result = await db.call.deleteMany({
			where: {
				createdAt: { lt: beforeDate },
				isValid: false,
			},
		});
		return result.count;
	}

	/**
	 * Find recent calls with contract addresses (used by analytics refresh)
	 */
	async findRecentCallsWithContracts(since: Date) {
		return db.call.findMany({
			where: {
				createdAt: { gte: since },
				contractAddress: { not: null },
			},
			select: {
				contractAddress: true,
			},
		});
	}
}