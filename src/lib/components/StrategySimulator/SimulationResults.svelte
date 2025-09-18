<script lang="ts">
	import type { TrailingStopSimulationResponse } from '$lib/types';
	
	export let data: NonNullable<TrailingStopSimulationResponse['data']>;
	
	// Helper functions
	function formatPercent(value: number): string {
		return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
	}
	
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}
	
	function formatDays(value: number): string {
		return `${value.toFixed(1)}d`;
	}
	
	function getPerformanceColor(value: number): string {
		if (value > 10) return 'text-green-400';
		if (value > 0) return 'text-green-300';
		if (value < -10) return 'text-red-400';
		if (value < 0) return 'text-red-300';
		return 'text-gray-300';
	}
	
	function getProfitFactorColor(value: number): string {
		if (value > 2) return 'text-green-400';
		if (value > 1.5) return 'text-green-300';
		if (value > 1) return 'text-yellow-300';
		if (value > 0.5) return 'text-orange-300';
		return 'text-red-400';
	}
	
	function getDeltaColor(value: number): string {
		if (value > 0) return 'text-green-400';
		if (value < 0) return 'text-red-400';
		return 'text-gray-300';
	}

	function getPnLColor(value: number): string {
		if (value > 5000) return 'text-green-400';
		if (value > 1000) return 'text-green-300';
		if (value > 0) return 'text-yellow-300';
		if (value > -1000) return 'text-orange-300';
		return 'text-red-400';
	}
	
	// Sort results by profit factor for display
	const sortedResults = Object.entries(data.results).sort(
		([, a], [, b]) => b.simulated.profitFactor - a.simulated.profitFactor
	);
	
	// Find best result
	const bestResult = sortedResults[0];

	// Calculate investment summary for optimal strategy
	const investmentAmount = data.configuration.simulation.investmentAmount || 1000;
	const numberOfTrades = bestResult[1].simulatedCalls;
	const totalInvestment = numberOfTrades * investmentAmount;
	const totalReturn = totalInvestment + bestResult[1].totalPnL;
	const returnPercentage = totalInvestment > 0 ? (bestResult[1].totalPnL / totalInvestment) * 100 : 0;
</script>

<div class="simulation-results space-y-6">
	<!-- Overview Section -->
	<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
		<h3 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Simulation Overview</h3>
		
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="text-center">
				<div class="text-2xl font-bold" style="color: var(--sqdgn-text);">{data.overview.totalCallsAnalyzed}</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Total Calls</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-green-400">{data.overview.callsWithPriceData}</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">With Price Data</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold" style="color: var(--sqdgn-text);">{data.overview.dataAvailabilityPct.toFixed(0)}%</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Data Coverage</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold" style="color: var(--sqdgn-accent);">{Object.keys(data.results).length}</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Scenarios Tested</div>
			</div>
		</div>
		
		<!-- Filters Summary -->
		{#if data.overview.filtersApplied && (data.overview.filtersApplied.callTypes > 0 || data.overview.filtersApplied.labels > 0 || data.overview.filtersApplied.marketCapRange || data.overview.filtersApplied.tokenFilters > 0)}
			<div class="mt-4 pt-4 border-t" style="border-color: var(--sqdgn-border);">
				<h4 class="text-xs font-medium mb-2" style="color: var(--sqdgn-text-muted);">Applied Filters</h4>
				<div class="flex flex-wrap gap-2 text-xs">
					{#if data.overview.filtersApplied.callTypes > 0}
						<span class="px-2 py-1 rounded" style="background-color: var(--sqdgn-bg); color: var(--sqdgn-text);">
							Call Types: {data.overview.filtersApplied.callTypes}
						</span>
					{/if}
					{#if data.overview.filtersApplied.labels > 0}
						<span class="px-2 py-1 rounded" style="background-color: var(--sqdgn-bg); color: var(--sqdgn-text);">
							Labels: {data.overview.filtersApplied.labels}
						</span>
					{/if}
					{#if data.overview.filtersApplied.marketCapRange}
						<span class="px-2 py-1 rounded" style="background-color: var(--sqdgn-bg); color: var(--sqdgn-text);">
							Market Cap Filter
						</span>
					{/if}
					{#if data.overview.filtersApplied.liquidityMin > 0}
						<span class="px-2 py-1 rounded" style="background-color: var(--sqdgn-bg); color: var(--sqdgn-text);">
							Min Liquidity: {formatCurrency(data.overview.filtersApplied.liquidityMin)}
						</span>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Optimal Configuration -->
	{#if data.optimal}
		<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 2px solid var(--sqdgn-accent);">
			<h3 class="text-lg font-semibold mb-3 flex items-center" style="color: var(--sqdgn-text);">
				🎯 Optimal Configuration
			</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="text-center">
					<div class="text-xl font-bold" style="color: var(--sqdgn-accent);">{(data.optimal.trailingStopPct * 100).toFixed(0)}%</div>
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Trailing Stop</div>
				</div>
				<div class="text-center">
					<div class="text-xl font-bold {getProfitFactorColor(data.optimal.profitFactor)}">{data.optimal.profitFactor.toFixed(2)}</div>
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Profit Factor</div>
				</div>
				<div class="text-center">
					<div class="text-xl font-bold {getPerformanceColor(data.optimal.medianROI)}">{formatPercent(data.optimal.medianROI)}</div>
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Median ROI</div>
				</div>
				<div class="text-center">
					<div class="text-xl font-bold {getPerformanceColor(data.optimal.winRate)}">{data.optimal.winRate.toFixed(1)}%</div>
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Win Rate</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Investment Summary -->
	<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
		<h3 class="text-lg font-semibold mb-4 flex items-center" style="color: var(--sqdgn-text);">
			💰 Investment Summary (Optimal Strategy)
		</h3>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="text-center">
				<div class="text-xl font-bold" style="color: var(--sqdgn-text);">{numberOfTrades}</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Number of Trades</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold" style="color: var(--sqdgn-text);">{formatCurrency(totalInvestment)}</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Total Investment</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold {getPnLColor(bestResult[1].totalPnL)}">{formatCurrency(totalReturn)}</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Total Return</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold {getPnLColor(bestResult[1].totalPnL)}">{returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%</div>
				<div class="text-xs" style="color: var(--sqdgn-text-muted);">Return %</div>
			</div>
		</div>
	</div>

	<!-- Results Comparison Table -->
	<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
		<h3 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Strategy Comparison</h3>
		
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b" style="border-color: var(--sqdgn-border);">
						<th class="text-left p-2" style="color: var(--sqdgn-text);">Trailing Stop</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">Coverage</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">Win Rate</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">P75 ROI</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">Profit Factor</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">Total PnL</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">Avg Days</th>
						<th class="text-center p-2" style="color: var(--sqdgn-text);">Improvement</th>
					</tr>
				</thead>
				<tbody>
					{#each sortedResults as [stopPct, result]}
						<tr class="border-b hover:bg-opacity-5" style="border-color: var(--sqdgn-border);" 
							class:best-result={result === bestResult[1]}
							onmouseover="this.style.backgroundColor='rgba(77,101,255,0.05)'" 
							onmouseout="this.style.backgroundColor='transparent'">
							<td class="p-2 font-medium" style="color: var(--sqdgn-text);">
								{stopPct}
								{#if result === bestResult[1]}
									<span class="ml-2 text-xs px-1.5 py-0.5 rounded" style="background-color: var(--sqdgn-accent); color: white;">BEST</span>
								{/if}
							</td>
							<td class="p-2 text-center" style="color: var(--sqdgn-text);">
								{result.simulatedCalls}/{result.totalCalls}
								<div class="text-xs" style="color: var(--sqdgn-text-muted);">({(result.coverage * 100).toFixed(0)}%)</div>
							</td>
							<td class="p-2 text-center">
								<div class="{getPerformanceColor(result.simulated.winRate)}">{result.simulated.winRate.toFixed(1)}%</div>
								<div class="text-xs {getDeltaColor(result.improvement.winRateDelta)}">
									{result.improvement.winRateDelta >= 0 ? '+' : ''}{result.improvement.winRateDelta.toFixed(1)}%
								</div>
							</td>
							<td class="p-2 text-center">
								<div class="{getPerformanceColor(result.simulated.percentiles?.p75 || result.simulated.medianROI)}">{formatPercent(result.simulated.percentiles?.p75 || result.simulated.medianROI)}</div>
								<div class="text-xs {getDeltaColor(result.improvement.medianROIDelta)}">
									{result.improvement.medianROIDelta >= 0 ? '+' : ''}{result.improvement.medianROIDelta.toFixed(1)}%
								</div>
							</td>
							<td class="p-2 text-center">
								<div class="{getProfitFactorColor(result.simulated.profitFactor)}">{result.simulated.profitFactor.toFixed(2)}</div>
								<div class="text-xs {getDeltaColor(result.improvement.profitFactorDelta)}">
									{result.improvement.profitFactorDelta >= 0 ? '+' : ''}{result.improvement.profitFactorDelta.toFixed(2)}
								</div>
							</td>
							<td class="p-2 text-center">
								<div class="{getPnLColor(result.totalPnL)}">{formatCurrency(result.totalPnL)}</div>
							</td>
							<td class="p-2 text-center" style="color: var(--sqdgn-text);">
								{formatDays(result.simulated.avgDaysToExit)}
							</td>
							<td class="p-2 text-center {getDeltaColor(result.improvement.averageImprovement)}">
								{formatPercent(result.improvement.averageImprovement)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Enhanced Analytics -->
	<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
		<h3 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Enhanced Performance Analytics</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each sortedResults.slice(0, 2) as [stopPct, result]}
				<div>
					<h4 class="text-sm font-medium mb-3" style="color: var(--sqdgn-text);">
						{stopPct} Trailing Stop
						{#if result === bestResult[1]}
							<span class="ml-2 text-xs px-1.5 py-0.5 rounded" style="background-color: var(--sqdgn-accent); color: white;">OPTIMAL</span>
						{/if}
					</h4>

					<!-- Percentile Distribution -->
					<div class="mb-4">
						<h5 class="text-xs font-medium mb-2" style="color: var(--sqdgn-text-muted);">ROI Distribution</h5>
						<div class="grid grid-cols-2 gap-2 text-xs">
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">P10:</span>
								<span class="{getPerformanceColor(result.simulated.percentiles?.p10 || 0)}">{formatPercent(result.simulated.percentiles?.p10 || 0)}</span>
							</div>
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">P25:</span>
								<span class="{getPerformanceColor(result.simulated.percentiles?.p25 || 0)}">{formatPercent(result.simulated.percentiles?.p25 || 0)}</span>
							</div>
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">P75:</span>
								<span class="{getPerformanceColor(result.simulated.percentiles?.p75 || 0)}">{formatPercent(result.simulated.percentiles?.p75 || 0)}</span>
							</div>
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">P90:</span>
								<span class="{getPerformanceColor(result.simulated.percentiles?.p90 || 0)}">{formatPercent(result.simulated.percentiles?.p90 || 0)}</span>
							</div>
						</div>
					</div>

					<!-- Risk Metrics -->
					<div class="mb-4">
						<h5 class="text-xs font-medium mb-2" style="color: var(--sqdgn-text-muted);">Risk Analysis</h5>
						<div class="space-y-1 text-xs">
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">Std Dev:</span>
								<span style="color: var(--sqdgn-text);">{(result.simulated.riskMetrics?.standardDeviation || 0).toFixed(1)}%</span>
							</div>
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">Max Drawdown:</span>
								<span class="text-red-400">{formatPercent(-(result.simulated.riskMetrics?.maxDrawdown || 0))}</span>
							</div>
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">Sharpe Ratio:</span>
								<span class="{result.simulated.riskMetrics?.sharpeRatio > 0 ? 'text-green-400' : 'text-red-400'}">{(result.simulated.riskMetrics?.sharpeRatio || 0).toFixed(2)}</span>
							</div>
						</div>
					</div>

					<!-- What-If Scenarios -->
					{#if result.scenarios}
						<div>
							<h5 class="text-xs font-medium mb-2" style="color: var(--sqdgn-text-muted);">What-If Scenarios</h5>
							<div class="space-y-1 text-xs">
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">$1000 Portfolio Value:</span>
									<span class="font-medium {getPerformanceColor((result.scenarios.portfolioValue1000 - 1000) / 1000 * 100)}">{formatCurrency(result.scenarios.portfolioValue1000)}</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Max Winning Streak:</span>
									<span class="text-green-400">{result.scenarios.maxConsecutiveWins}</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Max Losing Streak:</span>
									<span class="text-red-400">{result.scenarios.maxConsecutiveLosses}</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Recovery Rate:</span>
									<span style="color: var(--sqdgn-text);">{result.scenarios.recoveryRate.toFixed(1)}%</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Avg Time in Market:</span>
									<span style="color: var(--sqdgn-text);">{formatDays(result.scenarios.timeInMarket)}</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Exit Breakdown -->
	<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
		<h3 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Exit Breakdown</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each sortedResults.slice(0, 2) as [stopPct, result]}
				<div>
					<h4 class="text-sm font-medium mb-3" style="color: var(--sqdgn-text);">
						{stopPct} Trailing Stop
						{#if result === bestResult[1]}
							<span class="ml-2 text-xs px-1.5 py-0.5 rounded" style="background-color: var(--sqdgn-accent); color: white;">OPTIMAL</span>
						{/if}
					</h4>
					<div class="space-y-2 text-xs">
						<div class="flex justify-between">
							<span style="color: var(--sqdgn-text-muted);">Trailing Stop Exits:</span>
							<span class="font-medium" style="color: var(--sqdgn-text);">{result.exitBreakdown.trailingStopExits}</span>
						</div>
						{#if result.exitBreakdown.takeProfitExits > 0}
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">Take Profit Exits:</span>
								<span class="font-medium text-green-400">{result.exitBreakdown.takeProfitExits}</span>
							</div>
						{/if}
						{#if result.exitBreakdown.maxHoldExits > 0}
							<div class="flex justify-between">
								<span style="color: var(--sqdgn-text-muted);">Max Hold Exits:</span>
								<span class="font-medium text-orange-400">{result.exitBreakdown.maxHoldExits}</span>
							</div>
						{/if}
						<div class="flex justify-between">
							<span style="color: var(--sqdgn-text-muted);">No Exit (Still Holding):</span>
							<span class="font-medium" style="color: var(--sqdgn-text);">{result.exitBreakdown.noExits}</span>
						</div>
						<div class="flex justify-between pt-2 border-t" style="border-color: var(--sqdgn-border);">
							<span style="color: var(--sqdgn-text-muted);">Avg Days to Peak:</span>
							<span class="font-medium" style="color: var(--sqdgn-text);">{formatDays(result.simulated.avgDaysToPeak)}</span>
						</div>
						<div class="flex justify-between">
							<span style="color: var(--sqdgn-text-muted);">Total Fees Paid:</span>
							<span class="font-medium" style="color: var(--sqdgn-text);">{formatCurrency(result.totalFeesPaid)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Individual Call Details -->
	{#if data.details && data.details.length > 0}
		<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<h3 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">
				Individual Call Results 
				<span class="text-sm font-normal" style="color: var(--sqdgn-text-muted);">
					({data.details.length} calls, {(data.meta.detailsForStopPct * 100).toFixed(0)}% trailing stop)
				</span>
			</h3>
			
			<div class="overflow-x-auto">
				<table class="w-full text-xs">
					<thead>
						<tr class="border-b" style="border-color: var(--sqdgn-border);">
							<th class="text-left p-2" style="color: var(--sqdgn-text);">Token</th>
							<th class="text-center p-2" style="color: var(--sqdgn-text);">Entry</th>
							<th class="text-center p-2" style="color: var(--sqdgn-text);">Peak</th>
							<th class="text-center p-2" style="color: var(--sqdgn-text);">Exit</th>
							<th class="text-center p-2" style="color: var(--sqdgn-text);">Simulated ROI</th>
							<th class="text-center p-2" style="color: var(--sqdgn-text);">Dollar P&L</th>
							<th class="text-center p-2" style="color: var(--sqdgn-text);">Improvement</th>
						</tr>
					</thead>
					<tbody>
						{#each data.details.slice(0, 20) as call}
							<tr class="border-b hover:bg-opacity-5" style="border-color: var(--sqdgn-border);"
								onmouseover="this.style.backgroundColor='rgba(77,101,255,0.05)'" 
								onmouseout="this.style.backgroundColor='transparent'">
								<td class="p-2">
									<div class="font-medium" style="color: var(--sqdgn-text);">{call.tokenSymbol}</div>
									<div class="text-xs" style="color: var(--sqdgn-text-muted);">{call.callType} • {call.sqdgnLabel || 'No Label'}</div>
								</td>
								<td class="p-2 text-center">
									<div class="font-medium" style="color: var(--sqdgn-text);">${call.entryPrice.toFixed(6)}</div>
									<div class="text-xs" style="color: var(--sqdgn-text-muted);">{new Date(call.entryTime).toLocaleDateString()}</div>
								</td>
								<td class="p-2 text-center">
									<div class="font-medium text-green-400">${call.peakPrice.toFixed(6)}</div>
									<div class="text-xs" style="color: var(--sqdgn-text-muted);">{call.peakMultiple?.toFixed(1)}x • {formatDays(call.daysToPeak)}</div>
								</td>
								<td class="p-2 text-center">
									{#if call.exitPrice && call.exitReason}
										<div class="font-medium" style="color: var(--sqdgn-text);">${call.exitPrice.toFixed(6)}</div>
										<div class="text-xs" style="color: var(--sqdgn-text-muted);">
											{call.exitReason === 'TRAILING_STOP' ? 'Stop' : call.exitReason === 'TAKE_PROFIT' ? 'TP' : call.exitReason} • {formatDays(call.daysToExit || 0)}
										</div>
									{:else}
										<div class="text-xs" style="color: var(--sqdgn-text-muted);">Still Held</div>
									{/if}
								</td>
								<td class="p-2 text-center {getPerformanceColor(call.simulatedROI || 0)}">
									{call.simulatedROI ? formatPercent(call.simulatedROI) : 'N/A'}
								</td>
								<td class="p-2 text-center {getPerformanceColor(call.dollarPnL || 0)}">
									{call.dollarPnL !== undefined ? `$${call.dollarPnL.toFixed(0)}` : 'N/A'}
								</td>
								<td class="p-2 text-center {getDeltaColor(call.improvement || 0)}">
									{call.improvement ? formatPercent(call.improvement) : 'N/A'}
								</td>
							</tr>
						{/each}
						{#if data.details.length > 20}
							<tr>
								<td colspan="7" class="p-2 text-center text-xs" style="color: var(--sqdgn-text-muted);">
									... and {data.details.length - 20} more calls
								</td>
							</tr>
						{/if}
						<!-- Summary Row -->
						<tr class="border-t-2" style="border-color: var(--sqdgn-accent); background-color: rgba(77, 101, 255, 0.05);">
							<td class="p-2 font-semibold" style="color: var(--sqdgn-text);">
								Summary ({data.details.length} calls)
							</td>
							<td class="p-2 text-center text-xs" style="color: var(--sqdgn-text-muted);">
								Entry Range
							</td>
							<td class="p-2 text-center text-xs" style="color: var(--sqdgn-text-muted);">
								Avg Peak: {data.details.reduce((sum, call) => sum + (call.peakMultiple || 0), 0) / data.details.length}x
							</td>
							<td class="p-2 text-center text-xs" style="color: var(--sqdgn-text-muted);">
								{data.details.filter(call => call.exitReason).length} exits
							</td>
							<td class="p-2 text-center font-semibold {getPerformanceColor(data.details.reduce((sum, call) => sum + (call.simulatedROI || 0), 0) / data.details.length)}">
								{formatPercent(data.details.reduce((sum, call) => sum + (call.simulatedROI || 0), 0) / data.details.length)}
							</td>
							<td class="p-2 text-center font-semibold {getPerformanceColor(data.details.reduce((sum, call) => sum + (call.dollarPnL || 0), 0))}">
								${data.details.reduce((sum, call) => sum + (call.dollarPnL || 0), 0).toFixed(0)}
							</td>
							<td class="p-2 text-center font-semibold {getDeltaColor(data.details.reduce((sum, call) => sum + (call.improvement || 0), 0) / data.details.length)}">
								{formatPercent(data.details.reduce((sum, call) => sum + (call.improvement || 0), 0) / data.details.length)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	.best-result {
		background-color: rgba(77, 101, 255, 0.1) !important;
	}
	
	table th, table td {
		white-space: nowrap;
	}
	
	@media (max-width: 768px) {
		table th, table td {
			padding: 0.25rem;
			font-size: 0.75rem;
		}
	}
</style>