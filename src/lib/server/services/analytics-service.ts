import { callsRepo, priceRepo } from '../database';
import type { Call as PrismaCall } from '@prisma/client';
import { getCacheService, CacheKeys } from './cache-service';

interface PerformanceMetrics {
  totalCalls: number;
  successfulCalls: number;
  winRate: number;
  averageROI: number;
  totalVolume: number;
  topPerformers: Array<{
    tokenSymbol: string;
    roi: number;
    priceChange: number;
  }>;
}

interface TokenAnalytics {
  tokenAddress: string;
  tokenSymbol: string;
  callCount: number;
  firstCallDate: Date;
  lastCallDate: Date;
  averageROI: number;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

export class AnalyticsService {
  
  async getPerformanceMetrics(days: number = 7): Promise<PerformanceMetrics> {
    const cache = getCacheService();
    const cacheKey = CacheKeys.performanceMetrics(days);
    
    // Try cache first
    const cached = cache.get<PerformanceMetrics>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    try {
      // Get all calls within the period
      const calls = await callsRepo.findRecentCalls({
        since: startDate,
        validOnly: true
      });

      if (!calls || calls.length === 0) {
        return {
          totalCalls: 0,
          successfulCalls: 0,
          winRate: 0,
          averageROI: 0,
          totalVolume: 0,
          topPerformers: []
        };
      }

      // Calculate metrics
      const totalCalls = calls.length;
      const successfulCalls = calls.filter(c => this.isSuccessfulCall(c)).length;
      const winRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

      // Calculate ROI for calls with price data
      const callsWithROI = calls
        .filter(c => c.marketCap && c.currentMarketCap)
        .map(c => ({
          ...c,
          roi: ((c.currentMarketCap!.toNumber() - c.marketCap!.toNumber()) / c.marketCap!.toNumber()) * 100
        }));

      const averageROI = callsWithROI.length > 0
        ? callsWithROI.reduce((sum, c) => sum + c.roi, 0) / callsWithROI.length
        : 0;

      // Total volume
      const totalVolume = calls.reduce((sum, c) => sum + (c.volume24h?.toNumber() || 0), 0);

      // Top performers
      const topPerformers = callsWithROI
        .sort((a, b) => b.roi - a.roi)
        .slice(0, 5)
        .map(c => ({
          tokenSymbol: c.tokenSymbol || 'Unknown',
          roi: c.roi,
          priceChange: c.currentPriceUsd?.toNumber() || 0
        }));

      const result = {
        totalCalls,
        successfulCalls,
        winRate,
        averageROI,
        totalVolume,
        topPerformers
      };
      
      // Cache the result
      cache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes
      
      return result;

    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  async getTokenAnalytics(tokenAddress: string): Promise<TokenAnalytics | null> {
    try {
      // Get all calls for this token
      const calls = await callsRepo.findByTokenAddress(tokenAddress);
      if (!calls || calls.length === 0) return null;

      const latestCall = calls[0];
      const firstCall = calls[calls.length - 1];

      // Calculate average ROI
      const callsWithROI = calls
        .filter(c => c.marketCap && c.currentMarketCap)
        .map(c => ((c.currentMarketCap!.toNumber() - c.marketCap!.toNumber()) / c.marketCap!.toNumber()) * 100);

      const averageROI = callsWithROI.length > 0
        ? callsWithROI.reduce((sum, roi) => sum + roi, 0) / callsWithROI.length
        : 0;

      // Get latest price snapshot
      const snapshot = await priceRepo.getLatestSnapshot(tokenAddress);

      return {
        tokenAddress,
        tokenSymbol: latestCall.tokenSymbol || 'Unknown',
        callCount: calls.length,
        firstCallDate: new Date(firstCall.createdAt),
        lastCallDate: new Date(latestCall.createdAt),
        averageROI,
        currentPrice: snapshot?.priceUsd || latestCall.currentPriceUsd?.toNumber() || 0,
        priceChange24h: snapshot?.priceChange24h || 0,
        volume24h: snapshot?.volume24h || latestCall.volume24h?.toNumber() || 0,
        marketCap: snapshot?.marketCap || latestCall.currentMarketCap?.toNumber() || 0
      };

    } catch (error) {
      console.error('Failed to get token analytics:', error);
      return null;
    }
  }

  async getTimeSeriesData(
    tokenAddress: string, 
    hours: number = 24
  ): Promise<Array<{ time: Date; price: number; volume: number }>> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    try {
      const snapshots = await priceRepo.getTimeSeriesData(tokenAddress, startTime);

      return (snapshots || []).map(s => ({
        time: new Date(s.time),
        price: s.priceUsd || 0,
        volume: s.volume5m || 0
      }));

    } catch (error) {
      console.error('Failed to get time series data:', error);
      return [];
    }
  }

  async getTopMovers(limit: number = 10): Promise<Array<{
    tokenSymbol: string;
    tokenAddress: string;
    priceChange24h: number;
    volume24h: number;
    marketCap: number;
  }>> {
    try {
      // Get latest snapshot for each token
      const latestSnapshots = await priceRepo.getLatestSnapshots(1000);

      // Group by token and get latest for each
      const tokenMap = new Map();
      for (const snapshot of latestSnapshots || []) {
        if (!tokenMap.has(snapshot.tokenAddress)) {
          tokenMap.set(snapshot.tokenAddress, snapshot);
        }
      }

      // Sort by price change and return top movers
      const topMovers = Array.from(tokenMap.values())
        .sort((a, b) => Math.abs(b.priceChange24h || 0) - Math.abs(a.priceChange24h || 0))
        .slice(0, limit);

      // Get token symbols from calls table
      const addresses = topMovers.map(s => s.tokenAddress);
      const calls = await callsRepo.findByTokenAddresses(addresses);

      const symbolMap = new Map(calls?.map(c => [c.contractAddress, c.tokenSymbol]) || []);

      return topMovers.map(snapshot => ({
        tokenSymbol: symbolMap.get(snapshot.tokenAddress) || 'Unknown',
        tokenAddress: snapshot.tokenAddress,
        priceChange24h: snapshot.priceChange24h || 0,
        volume24h: snapshot.volume24h || 0,
        marketCap: snapshot.marketCap || 0
      }));

    } catch (error) {
      console.error('Failed to get top movers:', error);
      return [];
    }
  }

  async getCallsByType(days: number = 7): Promise<{
    buy: number;
    sell: number;
    long: number;
    short: number;
    other: number;
  }> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    try {
      const calls = await callsRepo.findRecentCalls({
        since: startDate,
        validOnly: true,
        select: ['callType']
      });

      const callTypes = {
        buy: 0,
        sell: 0,
        long: 0,
        short: 0,
        other: 0
      };

      for (const call of calls || []) {
        const type = call.callType?.toLowerCase();
        if (type in callTypes) {
          callTypes[type as keyof typeof callTypes]++;
        } else {
          callTypes.other++;
        }
      }

      return callTypes;

    } catch (error) {
      console.error('Failed to get calls by type:', error);
      return { buy: 0, sell: 0, long: 0, short: 0, other: 0 };
    }
  }

  private isSuccessfulCall(call: PrismaCall): boolean {
    // Consider a call successful if it has positive ROI
    if (call.marketCap && call.currentMarketCap) {
      return call.currentMarketCap.toNumber() > call.marketCap.toNumber();
    }

    if (call.currentPriceUsd) {
      // If we don't have initial price, consider any positive current price as successful
      return call.currentPriceUsd.toNumber() > 0;
    }

    // No price data available
    return false;
  }
}

// Singleton instance
let analyticsServiceInstance: AnalyticsService | null = null;

export function getAnalyticsService(): AnalyticsService {
  if (!analyticsServiceInstance) {
    analyticsServiceInstance = new AnalyticsService();
  }
  return analyticsServiceInstance;
}