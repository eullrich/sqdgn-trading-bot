import { callsRepo, priceRepo } from './database';
import type { 
  TrailingStopSimulationFilters, 
  TrailingStopSimulationParams,
  TrailingStopCallDetail,
  TrailingStopScenarioResult,
  PerformanceMetrics,
  ExitBreakdown,
  ImprovementMetrics
} from '../types';

interface CallRecord {
  id: string;
  contractAddress: string;
  tokenSymbol: string;
  callType: string;
  sqdgnLabel: string | null;
  entryTime: string;
  entryPrice: number;
  entryMarketCap: number;
  liquidity: number | null;
  volume24h: number | null;
  currentMarketCap: number | null;
}

interface PriceSnapshot {
  time: string;
  priceUsd: number;
}

interface SimulationResult {
  peakPrice: number;
  peakTime: string;
  exitPrice?: number;
  exitTime?: string;
  exitReason?: string;
  simulatedRoi?: number;
  daysToPeak: number;
  daysToExit?: number;
  feesPaid?: number;
}

export class TrailingStopSimulator {
  
  /**
   * Main entry point to run trailing stop simulation
   */
  async simulate(
    filters: TrailingStopSimulationFilters = {},
    simulation: TrailingStopSimulationParams,
    includeDetails = false
  ): Promise<{
    results: Record<string, TrailingStopScenarioResult>;
    optimal: { trailingStopPct: number; profitFactor: number; medianROI: number; winRate: number };
    details?: TrailingStopCallDetail[];
    overview: {
      totalCallsAnalyzed: number;
      callsWithPriceData: number;
      dataAvailabilityPct: number;
    };
  }> {
    
    // Get filtered calls
    const calls = await this.getFilteredCalls(filters);
    
    const results: Record<string, TrailingStopScenarioResult> = {};
    let bestConfiguration = { trailingStopPct: 0, profitFactor: 0, medianROI: 0, winRate: 0 };
    let detailsForBest: TrailingStopCallDetail[] = [];
    
    // Run simulation for each trailing stop percentage
    for (const trailingStopPct of simulation.trailingStopPercentages) {
      const scenarioResult = await this.simulateScenario(
        calls,
        trailingStopPct,
        simulation,
        includeDetails
      );
      
      const pctKey = `${(trailingStopPct * 100).toFixed(0)}%`;
      results[pctKey] = scenarioResult;
      
      // Track best configuration
      if (scenarioResult.simulated.profitFactor > bestConfiguration.profitFactor) {
        bestConfiguration = {
          trailingStopPct,
          profitFactor: scenarioResult.simulated.profitFactor,
          medianROI: scenarioResult.simulated.medianROI,
          winRate: scenarioResult.simulated.winRate
        };
        detailsForBest = scenarioResult.details || [];
      }
    }
    
    // Calculate data availability
    const callsWithPriceData = Object.values(results)[0]?.simulatedCalls || 0;
    
    return {
      results,
      optimal: bestConfiguration,
      details: includeDetails ? detailsForBest : undefined,
      overview: {
        totalCallsAnalyzed: calls.length,
        callsWithPriceData,
        dataAvailabilityPct: calls.length > 0 ? (callsWithPriceData / calls.length) * 100 : 0
      }
    };
  }
  
  /**
   * Get filtered calls from the database
   */
  private async getFilteredCalls(filters: TrailingStopSimulationFilters): Promise<CallRecord[]> {
    const whereConditions: any = {
      isValid: true,
      contractAddress: { not: null },
      marketCap: { not: null }
    };

    // Apply filters
    if (filters.callTypes?.length) {
      whereConditions.callType = { in: filters.callTypes };
    }

    if (filters.labels?.length) {
      if (filters.labels.includes('NO_LABEL')) {
        const otherLabels = filters.labels.filter(l => l !== 'NO_LABEL');
        whereConditions.OR = [
          { sqdgnLabel: { in: otherLabels } },
          { sqdgnLabel: null }
        ];
      } else {
        whereConditions.sqdgnLabel = { in: filters.labels };
      }
    }

    if (filters.marketCapMin) {
      whereConditions.marketCap = { ...whereConditions.marketCap, gte: filters.marketCapMin };
    }

    if (filters.marketCapMax) {
      whereConditions.marketCap = { ...whereConditions.marketCap, lte: filters.marketCapMax };
    }

    if (filters.liquidityMin) {
      whereConditions.liquidity = { gte: filters.liquidityMin };
    }

    if (filters.volumeMin) {
      whereConditions.volume24h = { gte: filters.volumeMin };
    }

    if (filters.startDate) {
      whereConditions.createdAt = { ...whereConditions.createdAt, gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      // Set end date to end of day (23:59:59.999) to include all calls from that day
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      whereConditions.createdAt = { ...whereConditions.createdAt, lte: endDate };
    }

    if (filters.includeTokens?.length) {
      whereConditions.contractAddress = { in: filters.includeTokens };
    }

    if (filters.excludeTokens?.length) {
      whereConditions.contractAddress = { notIn: filters.excludeTokens };
    }

    try {
      const calls = await callsRepo.findMany({
        where: whereConditions,
        take: 1000, // Reasonable limit for simulation
        orderBy: { createdAt: 'desc' }
      });

      // Get actual entry prices from price snapshots
      const callsWithPrices = await Promise.all(calls.map(async (call) => {
        let entryPrice = 0;

        // Try to get actual price from first price snapshot after call time
        if (call.contractAddress) {
          try {
            const entryTime = call.messageTimestamp?.toISOString() || call.createdAt.toISOString();
            const priceSnapshots = await priceRepo.getPriceHistory(call.contractAddress, {
              startTime: new Date(entryTime),
              limit: 1 // Just get the first snapshot
            });

            if (priceSnapshots.length > 0 && priceSnapshots[0].priceUsd) {
              entryPrice = priceSnapshots[0].priceUsd;
            }
          } catch (error) {
            console.warn(`Could not fetch entry price for ${call.contractAddress}:`, error);
          }
        }

        // Fallback: estimate from market cap (but this is unreliable)
        if (entryPrice === 0 && call.marketCap) {
          entryPrice = (call.marketCap || 0) / 1000000; // Still not ideal, but better than nothing
        }

        return {
          id: call.id,
          contractAddress: call.contractAddress || '',
          tokenSymbol: call.tokenSymbol || 'UNKNOWN',
          callType: call.callType || 'BUY',
          sqdgnLabel: call.sqdgnLabel,
          entryTime: call.messageTimestamp?.toISOString() || call.createdAt.toISOString(),
          entryPrice,
          entryMarketCap: call.marketCap || 0,
          liquidity: call.liquidity,
          volume24h: call.volume24h,
          currentMarketCap: call.currentMarketCap || call.marketCap || 0
        };
      }));

      // Filter out calls without valid entry prices
      return callsWithPrices.filter(call => call.entryPrice > 0);
    } catch (error) {
      console.error('Error fetching filtered calls:', error);
      return [];
    }
  }
  
  /**
   * Run simulation for a specific trailing stop percentage
   */
  private async simulateScenario(
    calls: CallRecord[],
    trailingStopPct: number,
    simulation: TrailingStopSimulationParams,
    includeDetails: boolean
  ): Promise<TrailingStopScenarioResult> {
    
    const simulationResults: (SimulationResult & CallRecord)[] = [];
    const details: TrailingStopCallDetail[] = [];
    
    for (const call of calls) {
      try {
        const priceHistory = await this.getPriceHistory(call.contractAddress, call.entryTime);
        
        if (priceHistory.length === 0) {
          continue; // Skip calls without price data
        }
        
        const result = this.simulateTrailingStop(
          call,
          priceHistory,
          trailingStopPct,
          simulation
        );
        
        if (result) {
          simulationResults.push({ ...result, ...call });
          
          if (includeDetails) {
            details.push(this.createCallDetail(call, result, priceHistory, simulation));
          }
        }
      } catch (error) {
        console.error(`Error simulating call ${call.id}:`, error);
        continue;
      }
    }
    
    // Calculate metrics
    const totalCalls = calls.length;
    const simulatedCalls = simulationResults.length;
    const coverage = totalCalls > 0 ? simulatedCalls / totalCalls : 0;
    
    // Calculate exit breakdown
    const exitBreakdown = this.calculateExitBreakdown(simulationResults);
    
    // Calculate performance metrics
    const simulatedMetrics = this.calculatePerformanceMetrics(
      simulationResults.map(r => r.simulatedRoi || 0)
    );
    
    const actualMetrics = this.calculateActualPerformanceMetrics(simulationResults);
    
    // Calculate improvement metrics
    const improvement = this.calculateImprovementMetrics(simulationResults);
    
    // Calculate fees
    const totalFeesPaid = simulationResults.reduce((sum, r) => sum + (r.feesPaid || 0), 0);
    const avgFeesPerTrade = simulatedCalls > 0 ? totalFeesPaid / simulatedCalls : 0;

    // Calculate scenario metrics
    const scenarios = this.calculateScenarioMetrics(simulationResults, trailingStopPct);

    // Calculate total PnL by summing individual trade PnLs
    const investmentAmount = simulation.investmentAmount || 1000;
    const totalPnL = simulationResults.reduce((sum, result) => {
      const tradeROI = result.simulatedRoi || 0;
      const tradePnL = investmentAmount * (tradeROI / 100);
      return sum + tradePnL;
    }, 0);

    return {
      trailingStopPct,
      totalCalls,
      simulatedCalls,
      coverage,
      exitBreakdown,
      simulated: {
        ...simulatedMetrics,
        avgDaysToExit: this.calculateAverage(simulationResults.map(r => r.daysToExit).filter(d => d !== undefined)),
        avgDaysToPeak: this.calculateAverage(simulationResults.map(r => r.daysToPeak))
      },
      actual: actualMetrics,
      improvement,
      totalFeesPaid,
      avgFeesPerTrade,
      totalPnL,
      scenarios,
      details: includeDetails ? details : undefined
    };
  }
  
  /**
   * Get price history for a token after entry time
   */
  private async getPriceHistory(tokenAddress: string, entryTime: string): Promise<PriceSnapshot[]> {
    try {
      const priceSnapshots = await priceRepo.getPriceHistory(tokenAddress, {
        startTime: new Date(entryTime),
        limit: 2016 // 1 week of 5-minute snapshots
      });

      return priceSnapshots
        .filter(snapshot => snapshot.priceUsd !== null)
        .map(snapshot => ({
          time: snapshot.time.toISOString(),
          priceUsd: snapshot.priceUsd || 0
        }));
    } catch (error) {
      console.error(`Error fetching price history for ${tokenAddress}:`, error);
      return [];
    }
  }
  
  /**
   * Simulate trailing stop logic for a single call
   */
  private simulateTrailingStop(
    call: CallRecord,
    priceHistory: PriceSnapshot[],
    trailingStopPct: number,
    simulation: TrailingStopSimulationParams
  ): SimulationResult | null {
    
    if (priceHistory.length === 0 || call.entryPrice <= 0) {
      return null;
    }
    
    let currentPeak = call.entryPrice;
    let currentPeakTime = call.entryTime;
    const entryTime = new Date(call.entryTime);
    
    // Calculate thresholds
    const takeProfitLevel = simulation.takeProfitMultiplier 
      ? call.entryPrice * simulation.takeProfitMultiplier 
      : null;
    
    const maxHoldTime = simulation.maxHoldDays 
      ? new Date(entryTime.getTime() + simulation.maxHoldDays * 24 * 60 * 60 * 1000)
      : null;
    
    for (const snapshot of priceHistory) {
      const snapshotTime = new Date(snapshot.time);
      
      // Update peak if we hit a new high
      if (snapshot.priceUsd > currentPeak) {
        currentPeak = snapshot.priceUsd;
        currentPeakTime = snapshot.time;
      }
      
      // Calculate trailing stop level
      const trailingStopLevel = currentPeak * (1 - trailingStopPct);
      
      // Check exit conditions
      
      // 1. Take Profit hit
      if (takeProfitLevel && snapshot.priceUsd >= takeProfitLevel) {
        return this.calculateExitResult(
          call.entryPrice,
          takeProfitLevel,
          currentPeak,
          currentPeakTime,
          snapshot.time,
          'TAKE_PROFIT',
          entryTime,
          simulation
        );
      }
      
      // 2. Trailing Stop hit
      if (snapshot.priceUsd <= trailingStopLevel) {
        return this.calculateExitResult(
          call.entryPrice,
          trailingStopLevel,
          currentPeak,
          currentPeakTime,
          snapshot.time,
          'TRAILING_STOP',
          entryTime,
          simulation
        );
      }
      
      // 3. Max hold time reached
      if (maxHoldTime && snapshotTime >= maxHoldTime) {
        return this.calculateExitResult(
          call.entryPrice,
          snapshot.priceUsd,
          currentPeak,
          currentPeakTime,
          snapshot.time,
          'MAX_HOLD',
          entryTime,
          simulation
        );
      }
    }
    
    // If we got here, no exit condition was met
    const lastSnapshot = priceHistory[priceHistory.length - 1];
    return {
      peakPrice: currentPeak,
      peakTime: currentPeakTime,
      daysToPeak: this.calculateDaysDifference(entryTime, new Date(currentPeakTime))
    };
  }
  
  /**
   * Calculate exit result with fees and slippage
   */
  private calculateExitResult(
    entryPrice: number,
    exitPriceGross: number,
    peakPrice: number,
    peakTime: string,
    exitTime: string,
    exitReason: string,
    entryTime: Date,
    simulation: TrailingStopSimulationParams
  ): SimulationResult {
    
    // Apply slippage (negative for sells)
    const exitPriceAfterSlippage = exitPriceGross * (1 - (simulation.slippage || 20) / 10000);
    
    // Calculate fees (entry + exit)
    const entryFee = entryPrice * ((simulation.fees || 10) / 10000);
    const exitFee = exitPriceAfterSlippage * ((simulation.fees || 10) / 10000);
    const totalFees = entryFee + exitFee;
    
    // Net exit price after fees
    const exitPriceNet = exitPriceAfterSlippage - (totalFees / 2); // Distribute fees
    
    // Calculate ROI
    const roi = ((exitPriceNet - entryPrice) / entryPrice) * 100;
    
    return {
      peakPrice: peakPrice,
      peakTime: peakTime,
      exitPrice: exitPriceNet,
      exitTime: exitTime,
      exitReason: exitReason,
      simulatedRoi: roi,
      daysToPeak: this.calculateDaysDifference(entryTime, new Date(peakTime)),
      daysToExit: this.calculateDaysDifference(entryTime, new Date(exitTime)),
      feesPaid: totalFees
    };
  }
  
  /**
   * Calculate days difference between two dates
   */
  private calculateDaysDifference(date1: Date, date2: Date): number {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
  }
  
  /**
   * Calculate exit breakdown
   */
  private calculateExitBreakdown(results: (SimulationResult & CallRecord)[]): ExitBreakdown {
    return {
      takeProfitExits: results.filter(r => r.exitReason === 'TAKE_PROFIT').length,
      trailingStopExits: results.filter(r => r.exitReason === 'TRAILING_STOP').length,
      maxHoldExits: results.filter(r => r.exitReason === 'MAX_HOLD').length,
      noExits: results.filter(r => !r.exitReason).length
    };
  }
  
  /**
   * Calculate performance metrics from ROI array
   */
  private calculatePerformanceMetrics(rois: number[]): PerformanceMetrics {
    if (rois.length === 0) {
      return {
        winRate: 0,
        medianROI: 0,
        averageROI: 0,
        profitFactor: 0,
        percentiles: { p10: 0, p25: 0, p75: 0, p90: 0 },
        riskMetrics: {
          standardDeviation: 0,
          maxROI: 0,
          minROI: 0,
          sharpeRatio: 0,
          maxDrawdown: 0
        }
      };
    }

    const winRate = (rois.filter(roi => roi > 0).length / rois.length) * 100;
    const medianROI = this.calculateMedian(rois);
    const averageROI = this.calculateAverage(rois);
    const profitFactor = this.calculateProfitFactor(rois);

    // Calculate percentiles
    const percentiles = this.calculatePercentiles(rois);

    // Calculate risk metrics
    const riskMetrics = this.calculateRiskMetrics(rois);

    return { winRate, medianROI, averageROI, profitFactor, percentiles, riskMetrics };
  }
  
  /**
   * Calculate actual performance metrics (market cap based)
   */
  private calculateActualPerformanceMetrics(results: (SimulationResult & CallRecord)[]): PerformanceMetrics {
    const actualROIs = results.map(r => {
      if (r.currentMarketCap && r.entryMarketCap && r.entryMarketCap > 0) {
        return ((r.currentMarketCap - r.entryMarketCap) / r.entryMarketCap) * 100;
      }
      return 0;
    });
    
    return this.calculatePerformanceMetrics(actualROIs);
  }
  
  /**
   * Calculate improvement metrics
   */
  private calculateImprovementMetrics(results: (SimulationResult & CallRecord)[]): ImprovementMetrics {
    const simulated = this.calculatePerformanceMetrics(results.map(r => r.simulatedRoi || 0));
    const actual = this.calculateActualPerformanceMetrics(results);
    
    const improvements = results.map(r => {
      const actualROI = r.currentMarketCap && r.entryMarketCap && r.entryMarketCap > 0
        ? ((r.currentMarketCap - r.entryMarketCap) / r.entryMarketCap) * 100
        : 0;
      return (r.simulatedRoi || 0) - actualROI;
    });
    
    return {
      averageImprovement: this.calculateAverage(improvements),
      winRateDelta: simulated.winRate - actual.winRate,
      medianROIDelta: simulated.medianROI - actual.medianROI,
      profitFactorDelta: simulated.profitFactor - actual.profitFactor
    };
  }
  
  /**
   * Create call detail object
   */
  private createCallDetail(call: CallRecord, result: SimulationResult, priceHistory: PriceSnapshot[], simulation: TrailingStopSimulationParams): TrailingStopCallDetail {
    const actualROI = call.currentMarketCap && call.entryMarketCap && call.entryMarketCap > 0
      ? ((call.currentMarketCap - call.entryMarketCap) / call.entryMarketCap) * 100
      : 0;
    
    const currentPrice = priceHistory.length > 0 
      ? priceHistory[priceHistory.length - 1].price_usd
      : call.entryPrice;
    
    return {
      callId: call.id,
      tokenAddress: call.contractAddress,
      tokenSymbol: call.tokenSymbol,
      callType: call.callType,
      sqdgnLabel: call.sqdgnLabel || 'NO_LABEL',
      
      entryTime: call.entryTime,
      entryPrice: call.entryPrice,
      entryMarketCap: call.entryMarketCap,
      liquidity: call.liquidity || 0,
      volume24h: call.volume24h || 0,
      
      peakPrice: result.peakPrice,
      peakTime: result.peakTime,
      peakMultiple: result.peakPrice / call.entryPrice,
      daysToPeak: result.daysToPeak,
      
      exitPrice: result.exitPrice,
      exitTime: result.exitTime,
      exitReason: result.exitReason,
      daysToExit: result.daysToExit,
      
      simulatedROI: result.simulatedRoi,
      actualROI,
      currentPrice,
      improvement: result.simulatedRoi ? result.simulatedRoi - actualROI : undefined,
      feesPaid: result.feesPaid,
      
      peakCapture: result.exitPrice ? result.exitPrice / result.peakPrice : undefined,
      exitFromEntry: result.exitPrice ? result.exitPrice / call.entryPrice : undefined,
      dollarPnL: (result.exitPrice && call.entryPrice)
        ? Math.round((simulation.investmentAmount || 1000) * ((result.exitPrice / call.entryPrice) - 1))
        : undefined
    };
  }
  
  // Utility functions
  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
  
  private calculateAverage(numbers: (number | undefined)[]): number {
    const validNumbers = numbers.filter((n): n is number => n !== undefined && !isNaN(n));
    return validNumbers.length > 0 
      ? validNumbers.reduce((sum, n) => sum + n, 0) / validNumbers.length
      : 0;
  }
  
  private calculateProfitFactor(rois: number[]): number {
    const profits = rois.filter(roi => roi > 0);
    const losses = rois.filter(roi => roi < 0);

    const totalProfits = profits.reduce((sum, roi) => sum + roi, 0);
    const totalLosses = Math.abs(losses.reduce((sum, roi) => sum + roi, 0));

    if (totalLosses === 0) {
      return totalProfits > 0 ? 999 : 0;
    }

    return totalProfits / totalLosses;
  }

  /**
   * Calculate percentile distribution
   */
  private calculatePercentiles(numbers: number[]): { p10: number; p25: number; p75: number; p90: number } {
    const sorted = [...numbers].sort((a, b) => a - b);
    const len = sorted.length;

    const getPercentile = (p: number) => {
      const index = Math.ceil((p / 100) * len) - 1;
      return sorted[Math.max(0, Math.min(index, len - 1))];
    };

    return {
      p10: getPercentile(10),
      p25: getPercentile(25),
      p75: getPercentile(75),
      p90: getPercentile(90)
    };
  }

  /**
   * Calculate risk metrics
   */
  private calculateRiskMetrics(rois: number[]): {
    standardDeviation: number;
    maxROI: number;
    minROI: number;
    sharpeRatio: number;
    maxDrawdown: number;
  } {
    const mean = this.calculateAverage(rois);
    const maxROI = Math.max(...rois);
    const minROI = Math.min(...rois);

    // Standard deviation
    const variance = rois.reduce((sum, roi) => sum + Math.pow(roi - mean, 2), 0) / rois.length;
    const standardDeviation = Math.sqrt(variance);

    // Sharpe ratio (assuming 0% risk-free rate)
    const sharpeRatio = standardDeviation > 0 ? mean / standardDeviation : 0;

    // Calculate maximum drawdown
    let maxDrawdown = 0;
    let peak = rois[0];
    for (const roi of rois) {
      if (roi > peak) {
        peak = roi;
      } else {
        const drawdown = peak - roi;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }

    return {
      standardDeviation,
      maxROI,
      minROI,
      sharpeRatio,
      maxDrawdown
    };
  }

  /**
   * Calculate what-if scenario metrics
   */
  private calculateScenarioMetrics(results: (SimulationResult & CallRecord)[], trailingStopPct: number): {
    portfolioValue1000: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
    recoveryRate: number;
    timeInMarket: number;
  } {
    const rois = results.map(r => r.simulatedRoi || 0);

    // Portfolio value if $1000 invested in each call
    const portfolioValue1000 = 1000 * rois.length * (1 + this.calculateAverage(rois) / 100);

    // Calculate consecutive wins/losses
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    for (const roi of rois) {
      if (roi > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
      }
    }

    // Recovery rate (of losing positions that recovered before exit)
    const losingResults = results.filter(r => (r.simulatedRoi || 0) < 0);
    const recoveredResults = losingResults.filter(r => r.peakPrice && r.entryPrice && r.peakPrice > r.entryPrice);
    const recoveryRate = losingResults.length > 0 ? (recoveredResults.length / losingResults.length) * 100 : 0;

    // Time in market (average days to exit / total possible days)
    const avgDaysToExit = this.calculateAverage(results.map(r => r.daysToExit).filter((d): d is number => d !== undefined));
    const timeInMarket = avgDaysToExit || 0;

    return {
      portfolioValue1000,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      recoveryRate,
      timeInMarket
    };
  }
}