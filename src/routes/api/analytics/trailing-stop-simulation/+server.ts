import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';
import { TrailingStopSimulator } from '$lib/server/trailing-stop-simulator';

interface SimulationFilters {
  callTypes?: string[];
  labels?: string[];
  marketCapMin?: number;
  marketCapMax?: number;
  liquidityMin?: number;
  volumeMin?: number;
  startDate?: string;
  endDate?: string;
  includeTokens?: string[];
  excludeTokens?: string[];
}

interface SimulationParams {
  trailingStopPercentages: number[];
  takeProfitMultiplier?: number;
  maxHoldDays?: number;
  slippage?: number; // basis points
  fees?: number; // basis points
  investmentAmount?: number; // dollars per trade
}

interface SimulationRequest {
  filters?: SimulationFilters;
  simulation: SimulationParams;
  includeDetails?: boolean; // Whether to return individual call results
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: SimulationRequest = await request.json();
    
    // Default values
    const filters = body.filters || {};
    const simulation = {
      trailingStopPercentages: body.simulation.trailingStopPercentages || [0.10, 0.15, 0.20, 0.25],
      takeProfitMultiplier: body.simulation.takeProfitMultiplier || null,
      maxHoldDays: body.simulation.maxHoldDays || null,
      slippage: body.simulation.slippage || 20, // 20 basis points = 0.2%
      fees: body.simulation.fees || 10, // 10 basis points = 0.1%
      investmentAmount: body.simulation.investmentAmount || 1000, // dollars per trade
    };
    const includeDetails = body.includeDetails || false;

    // Validate trailing stop percentages
    if (!Array.isArray(simulation.trailingStopPercentages) || simulation.trailingStopPercentages.length === 0) {
      return json({
        success: false,
        error: 'trailingStopPercentages must be a non-empty array'
      }, { status: 400 });
    }

    // Convert filters to JSONB format for the database function
    const filtersJsonb = JSON.stringify(filters);

    // Run the real trailing stop simulation
    console.log('🔄 Running trailing stop simulation with real price data...');
    const simulator = new TrailingStopSimulator();
    
    const simulationResult = await simulator.simulate(
      filters,
      simulation,
      includeDetails
    );
    
    console.log(`✅ Simulation completed: ${simulationResult.overview.callsWithPriceData} calls simulated`);
    
    // Transform results to match expected API format
    const summaryData = Object.entries(simulationResult.results).map(([pctKey, result]) => ({
      trailing_stop_pct: result.trailingStopPct,
      total_calls: result.totalCalls,
      simulated_calls: result.simulatedCalls,
      take_profit_exits: result.exitBreakdown.takeProfitExits,
      trailing_stop_exits: result.exitBreakdown.trailingStopExits,
      max_hold_exits: result.exitBreakdown.maxHoldExits,
      no_exits: result.exitBreakdown.noExits,
      simulated_win_rate: result.simulated.winRate,
      simulated_median_roi: result.simulated.medianROI,
      simulated_avg_roi: result.simulated.averageROI,
      simulated_profit_factor: result.simulated.profitFactor,
      actual_win_rate: result.actual.winRate,
      actual_median_roi: result.actual.medianROI,
      actual_avg_roi: result.actual.averageROI,
      actual_profit_factor: result.actual.profitFactor,
      avg_days_to_exit: result.simulated.avgDaysToExit,
      avg_days_to_peak: result.simulated.avgDaysToPeak,
      avg_improvement: result.improvement.averageImprovement,
      total_fees_paid: result.totalFeesPaid
    }));

    // Organize summary data by trailing stop percentage
    const summaryByStopPct: Record<string, any> = {};
    let bestConfiguration = null;
    let bestProfitFactor = 0;

    for (const row of summaryData || []) {
      const pctKey = `${(row.trailing_stop_pct * 100).toFixed(0)}%`;
      summaryByStopPct[pctKey] = {
        trailingStopPct: row.trailing_stop_pct,
        totalCalls: row.total_calls,
        simulatedCalls: row.simulated_calls,
        coverage: row.simulated_calls / row.total_calls,
        
        // Exit breakdown
        exitBreakdown: {
          takeProfitExits: row.take_profit_exits,
          trailingStopExits: row.trailing_stop_exits,
          maxHoldExits: row.max_hold_exits,
          noExits: row.no_exits
        },
        
        // Simulated performance - use direct result data instead of transformed
        simulated: simulationResult.results[pctKey].simulated,
        
        // Actual performance for comparison - use direct result data
        actual: simulationResult.results[pctKey].actual,
        
        // Improvement metrics - use direct result data
        improvement: simulationResult.results[pctKey].improvement,

        // Cost analysis - use direct result data
        totalFeesPaid: simulationResult.results[pctKey].totalFeesPaid,
        avgFeesPerTrade: simulationResult.results[pctKey].avgFeesPerTrade,

        // Total PnL - use direct result data
        totalPnL: simulationResult.results[pctKey].totalPnL,

        // Scenario metrics - new enhanced analytics
        scenarios: simulationResult.results[pctKey].scenarios
      };

      // Track best configuration
      if (row.simulated_profit_factor > bestProfitFactor) {
        bestProfitFactor = row.simulated_profit_factor;
        bestConfiguration = {
          trailingStopPct: row.trailing_stop_pct,
          profitFactor: row.simulated_profit_factor,
          medianROI: row.simulated_median_roi,
          winRate: row.simulated_win_rate
        };
      }
    }

    // Use the best configuration from the real simulation
    bestConfiguration = simulationResult.optimal;

    let detailsData = null;
    if (includeDetails && simulationResult.details) {
      // Use real detailed results from the simulation
      detailsData = simulationResult.details.map(detail => ({
        callId: detail.callId,
        tokenAddress: detail.tokenAddress,
        tokenSymbol: detail.tokenSymbol,
        callType: detail.callType,
        sqdgnLabel: detail.sqdgnLabel,
        
        // Entry data
        entryTime: detail.entryTime,
        entryPrice: detail.entryPrice,
        entryMarketCap: detail.entryMarketCap,
        liquidity: detail.liquidity,
        volume24h: detail.volume24h,
        
        // Peak data
        peakPrice: detail.peakPrice,
        peakTime: detail.peakTime,
        peakMultiple: detail.peakMultiple,
        daysToPeak: detail.daysToPeak,
        
        // Exit data
        exitPrice: detail.exitPrice,
        exitTime: detail.exitTime,
        exitReason: detail.exitReason,
        daysToExit: detail.daysToExit,
        
        // Performance
        simulatedROI: detail.simulatedROI,
        actualROI: detail.actualROI,
        currentPrice: detail.currentPrice,
        improvement: detail.improvement,
        feesPaid: detail.feesPaid,
        
        // Calculated metrics
        peakCapture: detail.peakCapture,
        exitFromEntry: detail.exitFromEntry,
        dollarPnL: detail.dollarPnL
      }));
    }

    // Calculate overall statistics using real simulation data
    const overallStats = {
      totalCallsAnalyzed: simulationResult.overview.totalCallsAnalyzed,
      callsWithPriceData: simulationResult.overview.callsWithPriceData,
      dataAvailabilityPct: simulationResult.overview.dataAvailabilityPct,
      
      // Applied filters summary
      filtersApplied: {
        callTypes: filters.callTypes?.length || 0,
        labels: filters.labels?.length || 0,
        marketCapRange: filters.marketCapMin || filters.marketCapMax ? true : false,
        liquidityMin: filters.liquidityMin || 0,
        volumeMin: filters.volumeMin || 0,
        dateRange: filters.startDate || filters.endDate ? true : false,
        tokenFilters: (filters.includeTokens?.length || 0) + (filters.excludeTokens?.length || 0)
      }
    };

    return json({
      success: true,
      data: {
        // Configuration used
        configuration: {
          filters,
          simulation: {
            ...simulation,
            trailingStopPercentages: simulation.trailingStopPercentages.map(pct => `${(pct * 100).toFixed(0)}%`)
          }
        },
        
        // Overall statistics
        overview: overallStats,
        
        // Results by trailing stop percentage
        results: summaryByStopPct,
        
        // Best performing configuration
        optimal: bestConfiguration,
        
        // Individual call details (if requested)
        details: detailsData,
        
        // Metadata
        meta: {
          generatedAt: new Date().toISOString(),
          detailsIncluded: includeDetails,
          detailsForStopPct: includeDetails ? (bestConfiguration?.trailingStopPct || simulation.trailingStopPercentages[0]) : null
        }
      }
    });

  } catch (error) {
    console.error('Failed to simulate trailing stop loss:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to simulate trailing stop loss'
    }, { status: 500 });
  }
};

// GET endpoint for quick testing with default parameters
export const GET: RequestHandler = async ({ url }) => {
  const trailingStopPct = parseFloat(url.searchParams.get('stop') || '0.15');
  const includeDetails = url.searchParams.get('details') === 'true';
  
  try {
    // Use default configuration for GET requests
    const defaultRequest: SimulationRequest = {
      filters: {},
      simulation: {
        trailingStopPercentages: [trailingStopPct],
        slippage: 20,
        fees: 10
      },
      includeDetails
    };
    
    // Create a mock Request object for the POST handler
    const mockRequest = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify(defaultRequest),
      headers: { 'Content-Type': 'application/json' }
    });
    
    return await POST({ request: mockRequest } as any);
    
  } catch (error) {
    console.error('Failed to run default trailing stop simulation:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run simulation'
    }, { status: 500 });
  }
};