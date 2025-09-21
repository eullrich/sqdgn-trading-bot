<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import StrategyBar from '$lib/components/StrategyBar.svelte';
	import type { TrailingStopSimulationRequest, TrailingStopSimulationResponse } from '$lib/types';

	let stats: any = null;
	let simulationData: TrailingStopSimulationResponse['data'] | null = null;
	let loading = true;
	let simulationLoading = false;
	let error: string | null = null;
	let selectedPeriod = 30;
	let startDate = '';
	let endDate = '';
	let useCustomRange = false;

	// Strategy configuration
	let strategyConfig: TrailingStopSimulationRequest = {
		filters: {
			callTypes: [],
			labels: [],
			marketCapMin: undefined,
			marketCapMax: undefined,
			liquidityMin: undefined,
			volumeMin: undefined,
			startDate: undefined,
			endDate: undefined,
			includeTokens: [],
			excludeTokens: []
		},
		simulation: {
			trailingStopPercentages: [0.15],
			takeProfitMultiplier: undefined,
			maxHoldDays: undefined,
			slippage: 20,
			fees: 10,
			investmentAmount: 500 // Default: $50 bag × 10 calls
		},
		includeDetails: true
	};

	const periods = [
		{ value: 1, label: '1 Day' },
		{ value: 2, label: '2 Days' },
		{ value: 7, label: '7 Days' },
		{ value: 30, label: '30 Days' }
	];

	// Initialize date range
	const today = new Date();
	const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
	
	endDate = today.toISOString().split('T')[0];
	startDate = thirtyDaysAgo.toISOString().split('T')[0];

	// Reactive computed value for best simulation result
	$: bestSimulationResult = simulationData && simulationData.results
		? Object.values(simulationData.results).sort((a, b) => b.simulated.totalROI - a.simulated.totalROI)[0]
		: null;

	// Throttling variables for simulation to prevent excessive API calls
	let simulationThrottleTimer: NodeJS.Timeout | null = null;
	const SIMULATION_THROTTLE_DELAY = 2000; // 2 seconds

	// Reactive computed value for optimal trailing stop percentage
	$: optimalTrailingStopPct = simulationData && simulationData.results
		? Object.entries(simulationData.results).sort(([, a], [, b]) => b.simulated.totalROI - a.simulated.totalROI)[0]?.[0]
		: null;

	onMount(async () => {
		// Check authentication first
		const authResponse = await fetch('/api/auth/status');
		const authResult = await authResponse.json();
		
		if (!authResult.authenticated) {
			goto('/login');
			return;
		}
		
		await loadStats();
	});

	async function loadStats() {
		try {
			loading = true;
			error = null;

			let url = '/api/analytics/comprehensive';
			if (useCustomRange) {
				url += `?start_date=${startDate}&end_date=${endDate}`;
			} else {
				url += `?days=${selectedPeriod}`;
			}

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Failed to fetch stats');
			}

			const result = await response.json();
			if (result.success) {
				stats = result.data;
				// Also run initial strategy simulation (directly, not throttled)
				await executeStrategySimulation();
			} else {
				throw new Error(result.error || 'Unknown error');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load stats';
		} finally {
			loading = false;
		}
	}

	// Throttled version to prevent excessive API calls
	function runStrategySimulation() {
		// Clear any existing throttle timer
		if (simulationThrottleTimer) {
			clearTimeout(simulationThrottleTimer);
		}

		// Set a new throttle timer
		simulationThrottleTimer = setTimeout(() => {
			executeStrategySimulation();
		}, SIMULATION_THROTTLE_DELAY);
	}

	async function executeStrategySimulation() {
		try {
			simulationLoading = true;

			// Update strategy config with current date range
			if (useCustomRange) {
				strategyConfig.filters.startDate = startDate;
				strategyConfig.filters.endDate = endDate;
			} else {
				const endDate = new Date();
				const startDate = new Date();
				startDate.setDate(endDate.getDate() - selectedPeriod);
				strategyConfig.filters.startDate = startDate.toISOString().split('T')[0];
				strategyConfig.filters.endDate = endDate.toISOString().split('T')[0];
			}

			const response = await fetch('/api/analytics/trailing-stop-simulation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(strategyConfig)
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result: TrailingStopSimulationResponse = await response.json();

			if (result.success && result.data) {
				simulationData = result.data;
			} else {
				console.error('Strategy simulation failed:', result.error);
			}
		} catch (err) {
			console.error('Strategy simulation error:', err);
		} finally {
			simulationLoading = false;
		}
	}

	function handlePeriodChange() {
		useCustomRange = false;
		loadStats();
	}

	function handleCustomRangeChange() {
		useCustomRange = true;
		loadStats();
	}

	function handleStrategyChange(event: CustomEvent<TrailingStopSimulationRequest>) {
		strategyConfig = { ...event.detail };
	}

	function handleStrategyApply(event: CustomEvent<TrailingStopSimulationRequest>) {
		strategyConfig = { ...event.detail };
		runStrategySimulation();
	}

	function getDexScreenerUrl(contractAddress: string): string {
		return `https://dexscreener.com/solana/${contractAddress}`;
	}

	function formatNumber(num: number): string {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toFixed(2);
	}

	function formatCurrency(num: number): string {
		return new Intl.NumberFormat('en-US', { 
			style: 'currency', 
			currency: 'USD',
			minimumFractionDigits: num < 0.01 ? 6 : 2
		}).format(num);
	}

	function formatPercent(num: number | undefined | null): string {
		if (num === undefined || num === null || isNaN(num)) return '0.00%';
		return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
	}

	function getPerformanceColor(value: number): string {
		if (value > 0) return 'text-green-400';
		if (value < 0) return 'text-red-400';
		return 'text-gray-400';
	}

	function safeParseNumber(value: any): number {
		if (typeof value === 'number') return value;
		if (typeof value === 'string') {
			const parsed = parseFloat(value);
			return isNaN(parsed) ? 0 : parsed;
		}
		return 0;
	}


	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Stats - SQDGN Trading Bot</title>
</svelte:head>

<div class="min-h-screen" style="background-color: var(--sqdgn-bg);">
	<div class="max-w-7xl mx-auto px-4 py-6">
		<!-- Header -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h1 class="text-2xl font-bold" style="color: var(--sqdgn-text);">Trading Performance</h1>
					<p class="text-sm mt-1" style="color: var(--sqdgn-text-muted);">Actual performance vs. simulated strategy with stop losses and take profits</p>
				</div>
			</div>
		</div>

		<!-- Strategy Configuration Bar -->
		<StrategyBar
			bind:configuration={strategyConfig}
			isLoading={simulationLoading}
			on:change={handleStrategyChange}
			on:apply={handleStrategyApply}
		/>
			{#if loading}
				<div class="flex justify-center items-center py-12">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--sqdgn-accent);"></div>
					<span class="ml-3 text-sm" style="color: var(--sqdgn-text-muted);">Loading statistics...</span>
				</div>
			{:else if error}
				<div class="rounded-lg p-4 mb-6" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
					<p class="text-red-400 text-sm">{error}</p>
				</div>
			{:else if stats}
			<!-- Strategy vs Actual Performance -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<!-- Win Rate Comparison -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Win Rate</div>
					{#if bestSimulationResult}
						<div class="text-xl font-bold {getPerformanceColor(bestSimulationResult.simulated.winRate)}">{bestSimulationResult.simulated.winRate.toFixed(1)}%</div>
						<div class="text-xs flex items-center" style="color: var(--sqdgn-text-muted);">
							<span class="mr-1">📊</span> vs {stats.performanceMetrics.winRate.toFixed(1)}% actual
						</div>
					{:else}
						<div class="text-xl font-bold {getPerformanceColor(stats.performanceMetrics.winRate)}">{stats.performanceMetrics.winRate.toFixed(1)}%</div>
						<div class="text-xs" style="color: var(--sqdgn-text-muted);">Actual performance</div>
					{/if}
				</div>

				<!-- Median ROI Comparison -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Median ROI</div>
					{#if bestSimulationResult}
						<div class="text-xl font-bold {getPerformanceColor(bestSimulationResult.simulated.medianROI)}">{formatPercent(bestSimulationResult.simulated.medianROI)}</div>
						<div class="text-xs flex items-center" style="color: var(--sqdgn-text-muted);">
							<span class="mr-1">📊</span> vs {formatPercent(stats.performanceMetrics.medianROI)} actual
						</div>
					{:else}
						<div class="text-xl font-bold {getPerformanceColor(stats.performanceMetrics.medianROI)}">{formatPercent(stats.performanceMetrics.medianROI)}</div>
						<div class="text-xs" style="color: var(--sqdgn-text-muted);">Actual performance</div>
					{/if}
				</div>

				<!-- ROI Comparison -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">ROI</div>
					{#if bestSimulationResult}
						<div class="text-xl font-bold {getPerformanceColor(bestSimulationResult.simulated.totalROI)}">{formatPercent(bestSimulationResult.simulated.totalROI)}</div>
					{:else}
						<div class="text-xl font-bold {getPerformanceColor(stats.performanceMetrics.totalROI)}">{formatPercent(stats.performanceMetrics.totalROI)}</div>
						<div class="text-xs" style="color: var(--sqdgn-text-muted);">Actual performance</div>
					{/if}
				</div>

				<!-- Expected P&L -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Expected P&L</div>
					{#if bestSimulationResult}
						<div class="text-xl font-bold {bestSimulationResult.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">{formatCurrency(bestSimulationResult.totalPnL)}</div>
						<div class="text-xs" style="color: var(--sqdgn-text-muted);">Projected Profit/Loss</div>
					{:else}
						<div class="text-xl font-bold text-green-400">{stats.performanceMetrics.successfulCalls}</div>
						<div class="text-xs" style="color: var(--sqdgn-text-muted);">Successful Calls</div>
					{/if}
				</div>
			</div>

			<!-- Secondary Overview Section -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Coverage</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">
						{#if simulationData}
							{simulationData.overview.dataAvailabilityPct.toFixed(0)}%
						{:else}
							{stats.detailedStats.callsPerDay.toFixed(1)}/day
						{/if}
					</div>
				</div>
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Expected P&L</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">
						{#if simulationData && simulationData.results}
							{#if bestSimulationResult}
								<span class="{bestSimulationResult.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">
									{formatCurrency(bestSimulationResult.totalPnL)}
								</span>
							{:else}
								{formatCurrency(stats.detailedStats.totalVolume)}
							{/if}
						{:else}
							{formatCurrency(stats.detailedStats.totalVolume)}
						{/if}
					</div>
				</div>
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Avg Hold Time</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">
						{#if simulationData && simulationData.results}
							{#if bestSimulationResult}
								{bestSimulationResult.simulated.avgDaysToExit.toFixed(1)}d
							{:else}
								{stats.performanceMetrics.averageHoldTime.toFixed(1)}h
							{/if}
						{:else}
							{stats.performanceMetrics.averageHoldTime.toFixed(1)}h
						{/if}
					</div>
				</div>
			</div>

			<!-- Strategy Performance Table -->
			{#if simulationData && simulationData.results}
				<div class="rounded p-4 mb-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-4" style="color: var(--sqdgn-text);">Strategy Performance Comparison</h3>

					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b" style="border-color: var(--sqdgn-border);">
									<th class="text-left p-2" style="color: var(--sqdgn-text);">Strategy</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Win Rate</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">ROI</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Total P&L</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Improvement</th>
								</tr>
							</thead>
							<tbody>
								{#each Object.entries(simulationData.results).sort(([, a], [, b]) => b.simulated.totalROI - a.simulated.totalROI) as [stopPct, result], index}
									<tr class="border-b hover:bg-opacity-5" style="border-color: var(--sqdgn-border);"
										class:best-result={index === 0}
										onmouseover="this.style.backgroundColor='rgba(77,101,255,0.05)'"
										onmouseout="this.style.backgroundColor='transparent'">
										<td class="p-2 font-medium" style="color: var(--sqdgn-text);">
											{stopPct} Trailing Stop
										</td>
										<td class="p-2 text-center">
											<div class="{getPerformanceColor(result.simulated.winRate)}">{result.simulated.winRate.toFixed(1)}%</div>
											<div class="text-xs" style="color: var(--sqdgn-text-muted);">vs {result.actual.winRate.toFixed(1)}%</div>
										</td>
										<td class="p-2 text-center">
											<div class="{getPerformanceColor(result.simulated.totalROI)}">{formatPercent(result.simulated.totalROI)}</div>
											<div class="text-xs" style="color: var(--sqdgn-text-muted);">vs {formatPercent(result.actual.totalROI)}</div>
										</td>
										<td class="p-2 text-center">
											<div class="{result.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">{formatCurrency(result.totalPnL)}</div>
										</td>
										<td class="p-2 text-center {result.improvement.averageImprovement >= 0 ? 'text-green-400' : 'text-red-400'}">
											{formatPercent(result.improvement.averageImprovement)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<!-- Enhanced Daily Activity Table -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<div class="lg:col-span-2 rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-3" style="color: var(--sqdgn-text);">Daily Activity Breakdown</h3>
					<div class="max-h-64 overflow-y-auto">
						<table class="w-full text-xs">
							<thead class="sticky top-0" style="background-color: var(--sqdgn-surface);">
								<tr class="border-b" style="border-color: var(--sqdgn-border);">
									<th class="text-left p-1" style="color: var(--sqdgn-text-muted);">Date</th>
									<th class="text-right p-1" style="color: var(--sqdgn-text-muted);">Calls</th>
									<th class="text-right p-1" style="color: var(--sqdgn-text-muted);">Success%</th>
									<th class="text-right p-1" style="color: var(--sqdgn-text-muted);">Avg ROI</th>
									<th class="text-right p-1" style="color: var(--sqdgn-text-muted);">Tokens</th>
									<th class="text-right p-1" style="color: var(--sqdgn-text-muted);">Volume</th>
								</tr>
							</thead>
							<tbody>
								{#each stats.dailyBreakdown.filter(day => day.count > 0).slice(-21) as day}
									<tr class="hover:bg-opacity-5" onmouseover="this.style.backgroundColor='rgba(77,101,255,0.05)'" onmouseout="this.style.backgroundColor='transparent'">
										<td class="p-1" style="color: var(--sqdgn-text);">{formatDate(day.date)}</td>
										<td class="p-1 text-right" style="color: var(--sqdgn-text);">{day.count}</td>
										<td class="p-1 text-right {getPerformanceColor(parseFloat(day.successRate))}">{day.successRate}%</td>
										<td class="p-1 text-right {getPerformanceColor(parseFloat(day.averageROI))}">{formatPercent(parseFloat(day.averageROI))}</td>
										<td class="p-1 text-right" style="color: var(--sqdgn-text);">{day.uniqueTokens}</td>
										<td class="p-1 text-right" style="color: var(--sqdgn-text-muted);">{formatCurrency(day.totalVolume)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-3" style="color: var(--sqdgn-text);">Activity Summary</h3>
					<div class="space-y-3 text-xs">
						<div class="flex justify-between">
							<span style="color: var(--sqdgn-text-muted);">Most Active Day:</span>
							<div class="text-right">
								<div style="color: var(--sqdgn-text);">{formatDate(stats.detailedStats.mostActiveDay?.date)}</div>
								<div style="color: var(--sqdgn-text-muted);">{stats.detailedStats.mostActiveDay?.count} calls</div>
							</div>
						</div>
						<div class="flex justify-between">
							<span style="color: var(--sqdgn-text-muted);">Avg Volume:</span>
							<span style="color: var(--sqdgn-text);">{formatCurrency(stats.detailedStats.averageVolume)}</span>
						</div>
						<div class="flex justify-between">
							<span style="color: var(--sqdgn-text-muted);">Days Tracked:</span>
							<span style="color: var(--sqdgn-text);">{stats.dailyBreakdown.filter(day => day.count > 0).length}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Distribution Tables -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<!-- Enhanced Call Type Distribution -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-3" style="color: var(--sqdgn-text);">Call Types Performance</h3>
					<div class="space-y-2">
						{#each stats.callTypeDistribution as type}
							<div class="border-b pb-2" style="border-color: var(--sqdgn-border);">
								<div class="flex items-center justify-between text-xs mb-1">
									<span style="color: var(--sqdgn-text);" class="font-medium">{type.type}</span>
									<div class="flex items-center space-x-2">
										<span class="w-8 text-right" style="color: var(--sqdgn-text);">{type.count}</span>
										<span class="w-12 text-right" style="color: var(--sqdgn-text-muted);">({type.percentage}%)</span>
									</div>
								</div>
								<div class="grid grid-cols-3 gap-2 text-xs">
									<div>
										<span style="color: var(--sqdgn-text-muted);">Win Rate:</span>
										<span class="{getPerformanceColor(parseFloat(type.winRate))}">{type.winRate}%</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Median ROI:</span>
										<span class="{getPerformanceColor(safeParseNumber(type.medianROI))}">{formatPercent(safeParseNumber(type.medianROI))}</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Win Rate:</span>
										<span class="{getPerformanceColor(safeParseNumber(type.winRate))}">{safeParseNumber(type.winRate).toFixed(1)}%</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Total P&L:</span>
										<span class="{safeParseNumber(type.totalPnL) >= 0 ? 'text-green-400' : 'text-red-400'}">{formatCurrency(safeParseNumber(type.totalPnL))}</span>
									</div>
								</div>
								<div class="w-full h-1 rounded-full mt-1" style="background-color: var(--sqdgn-border);">
									<div 
										class="h-1 rounded-full" 
										style="background-color: var(--sqdgn-accent); width: {type.percentage}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Enhanced Label Distribution -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-3" style="color: var(--sqdgn-text);">SQDGN Labels Performance</h3>
					<div class="space-y-2">
						{#each stats.labelDistribution.slice(0, 10) as label}
							<div class="border-b pb-2" style="border-color: var(--sqdgn-border);">
								<div class="flex items-center justify-between text-xs mb-1">
									<span style="color: var(--sqdgn-text);" class="font-medium truncate">{label.label === 'NO_LABEL' ? 'No Label' : label.label}</span>
									<div class="flex items-center space-x-2">
										<span class="w-8 text-right" style="color: var(--sqdgn-text);">{label.count}</span>
										<span class="w-12 text-right" style="color: var(--sqdgn-text-muted);">({label.percentage}%)</span>
									</div>
								</div>
								<div class="grid grid-cols-3 gap-2 text-xs mb-1">
									<div>
										<span style="color: var(--sqdgn-text-muted);">Win Rate:</span>
										<span class="{getPerformanceColor(parseFloat(label.winRate))}">{label.winRate}%</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Median ROI:</span>
										<span class="{getPerformanceColor(safeParseNumber(label.medianROI))}">{formatPercent(safeParseNumber(label.medianROI))}</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Win Rate:</span>
										<span class="{getPerformanceColor(safeParseNumber(label.winRate))}">{safeParseNumber(label.winRate).toFixed(1)}%</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Total P&L:</span>
										<span class="{safeParseNumber(label.totalPnL) >= 0 ? 'text-green-400' : 'text-red-400'}">{formatCurrency(safeParseNumber(label.totalPnL))}</span>
									</div>
								</div>
								{#if label.bestToken}
									<div class="flex justify-between text-xs">
										<div>
											<span style="color: var(--sqdgn-text-muted);">Best:</span>
											<span class="text-green-400">{label.bestToken.symbol} ({formatPercent(label.bestToken.roi)})</span>
										</div>
										{#if label.worstToken}
											<div>
												<span style="color: var(--sqdgn-text-muted);">Worst:</span>
												<span class="text-red-400">{label.worstToken.symbol} ({formatPercent(label.worstToken.roi)})</span>
											</div>
										{/if}
									</div>
								{/if}
								<div class="w-full h-1 rounded-full mt-1" style="background-color: var(--sqdgn-border);">
									<div 
										class="h-1 rounded-full" 
										style="background-color: var(--sqdgn-accent); width: {label.percentage}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Strategy Summary Cards -->
			{#if simulationData}
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<!-- Investment Summary -->
					<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 2px solid var(--sqdgn-accent);">
						<h3 class="text-sm font-semibold mb-3 flex items-center" style="color: var(--sqdgn-text);">
							📊 Strategy Impact Analysis
						</h3>
						{#if bestSimulationResult}
							<div class="space-y-3 text-sm">
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Number of Trades:</span>
									<span style="color: var(--sqdgn-text);">{bestSimulationResult.simulatedCalls}</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Total Investment:</span>
									<span style="color: var(--sqdgn-text);">{formatCurrency(bestSimulationResult.simulatedCalls * (strategyConfig.simulation.investmentAmount || 1000))}</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Total Return:</span>
									<span class="{bestSimulationResult.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">
										{formatCurrency((bestSimulationResult.simulatedCalls * (strategyConfig.simulation.investmentAmount || 1000)) + bestSimulationResult.totalPnL)}
									</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Net P&L:</span>
									<span class="font-bold {bestSimulationResult.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">
										{formatCurrency(bestSimulationResult.totalPnL)}
									</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Return %:</span>
									<span class="font-bold {bestSimulationResult.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">
										{((bestSimulationResult.totalPnL / (bestSimulationResult.simulatedCalls * (strategyConfig.simulation.investmentAmount || 1000))) * 100).toFixed(1)}%
									</span>
								</div>
							</div>
						{/if}
					</div>

					<!-- Exit Strategy Breakdown -->
					<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
						<h3 class="text-sm font-semibold mb-3 flex items-center" style="color: var(--sqdgn-text);">
							🎯 Exit Strategy Breakdown
						</h3>
						{#if bestSimulationResult}
							<div class="space-y-3 text-sm">
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Trailing Stop Exits:</span>
									<span style="color: var(--sqdgn-text);">{bestSimulationResult.exitBreakdown.trailingStopExits}</span>
								</div>
								{#if bestSimulationResult.exitBreakdown.takeProfitExits > 0}
									<div class="flex justify-between">
										<span style="color: var(--sqdgn-text-muted);">Take Profit Exits:</span>
										<span class="text-green-400">{bestSimulationResult.exitBreakdown.takeProfitExits}</span>
									</div>
								{/if}
								{#if bestSimulationResult.exitBreakdown.maxHoldExits > 0}
									<div class="flex justify-between">
										<span style="color: var(--sqdgn-text-muted);">Max Hold Exits:</span>
										<span class="text-yellow-400">{bestSimulationResult.exitBreakdown.maxHoldExits}</span>
									</div>
								{/if}
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">No Exit (Holding):</span>
									<span style="color: var(--sqdgn-text);">{bestSimulationResult.exitBreakdown.noExits}</span>
								</div>
								<div class="flex justify-between border-t pt-2" style="border-color: var(--sqdgn-border);">
									<span style="color: var(--sqdgn-text-muted);">Avg Days to Exit:</span>
									<span style="color: var(--sqdgn-text);">{bestSimulationResult.simulated.avgDaysToExit.toFixed(1)} days</span>
								</div>
								<div class="flex justify-between">
									<span style="color: var(--sqdgn-text-muted);">Avg Days to Peak:</span>
									<span style="color: var(--sqdgn-text);">{bestSimulationResult.simulated.avgDaysToPeak.toFixed(1)} days</span>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Detailed Calls Table -->
			{#if simulationData && simulationData.details && simulationData.details.length > 0}
				<div class="rounded p-4 mb-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-4" style="color: var(--sqdgn-text);">📊 Individual Call Performance</h3>

					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b" style="border-color: var(--sqdgn-border);">
									<th class="text-left p-2" style="color: var(--sqdgn-text);">Ticker</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Entry Date</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Entry Price</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Peak Price</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">Exit Price</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">P&L ($)</th>
									<th class="text-center p-2" style="color: var(--sqdgn-text);">ROI (%)</th>
								</tr>
							</thead>
							<tbody>
								{#each simulationData.details.slice(0, 50) as call}
									<tr class="border-b hover:bg-opacity-5" style="border-color: var(--sqdgn-border);"
										onmouseover="this.style.backgroundColor='rgba(77,101,255,0.05)'"
										onmouseout="this.style.backgroundColor='transparent'">
										<td class="p-2 font-medium" style="color: var(--sqdgn-text);">
											{call.tokenSymbol}
										</td>
										<td class="p-2 text-center text-xs" style="color: var(--sqdgn-text-muted);">
											{new Date(call.entryTime).toLocaleDateString()}
										</td>
										<td class="p-2 text-center" style="color: var(--sqdgn-text);">
											${call.entryPrice.toFixed(6)}
										</td>
										<td class="p-2 text-center text-green-400">
											${call.peakPrice.toFixed(6)}
										</td>
										<td class="p-2 text-center" style="color: var(--sqdgn-text);">
											{#if call.exitPrice}
												${call.exitPrice.toFixed(6)}
											{:else}
												<span style="color: var(--sqdgn-text-muted);">Holding</span>
											{/if}
										</td>
										<td class="p-2 text-center">
											{#if call.dollarPnL !== undefined}
												<span class="{call.dollarPnL >= 0 ? 'text-green-400' : 'text-red-400'}">
													{formatCurrency(call.dollarPnL)}
												</span>
											{:else}
												<span style="color: var(--sqdgn-text-muted);">-</span>
											{/if}
										</td>
										<td class="p-2 text-center">
											{#if call.simulatedROI !== undefined}
												<span class="{call.simulatedROI >= 0 ? 'text-green-400' : 'text-red-400'}">
													{formatPercent(call.simulatedROI)}
												</span>
											{:else}
												<span class="{call.actualROI >= 0 ? 'text-green-400' : 'text-red-400'}">
													{formatPercent(call.actualROI)}
												</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					{#if simulationData.details.length > 50}
						<div class="mt-3 text-xs text-center" style="color: var(--sqdgn-text-muted);">
							Showing first 50 of {simulationData.details.length} calls
						</div>
					{/if}
				</div>
			{/if}

			{/if}
	</div>
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
	
	.active-tab {
		color: white !important;
	}
</style>