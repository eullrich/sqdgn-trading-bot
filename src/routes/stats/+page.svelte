<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import StrategySimulator from '$lib/components/StrategySimulator/StrategySimulator.svelte';

	let stats: any = null;
	let loading = true;
	let error: string | null = null;
	let selectedPeriod = 30;
	let startDate = '';
	let endDate = '';
	let useCustomRange = false;
	
	// Navigation state
	let currentView = 'overview'; // 'overview' or 'simulator'

	const periods = [
		{ value: 1, label: 'Today' },
		{ value: 7, label: '7 Days' },
		{ value: 30, label: '30 Days' },
		{ value: 90, label: '90 Days' },
		{ value: 365, label: '1 Year' }
	];

	// Initialize date range
	const today = new Date();
	const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
	
	endDate = today.toISOString().split('T')[0];
	startDate = thirtyDaysAgo.toISOString().split('T')[0];

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
			} else {
				throw new Error(result.error || 'Unknown error');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load stats';
		} finally {
			loading = false;
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

	function formatPercent(num: number): string {
		return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
	}

	function getPerformanceColor(value: number): string {
		if (value > 0) return 'text-green-400';
		if (value < 0) return 'text-red-400';
		return 'text-gray-400';
	}

	function getProfitFactorColor(value: number): string {
		if (value >= 1.5) return 'text-green-400';
		if (value >= 1.0) return 'text-yellow-400';
		return 'text-red-400';
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
				<div class="flex items-center space-x-6">
					<h1 class="text-2xl font-bold" style="color: var(--sqdgn-text);">Trading Statistics</h1>
					
					<!-- Navigation Tabs -->
					<div class="flex space-x-1">
						<button
							on:click={() => currentView = 'overview'}
							class="px-3 py-1.5 rounded text-sm font-medium border transition-colors"
							class:active-tab={currentView === 'overview'}
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {currentView === 'overview' ? 'var(--sqdgn-accent)' : 'transparent'};"
						>
							Overview
						</button>
						<button
							on:click={() => currentView = 'simulator'}
							class="px-3 py-1.5 rounded text-sm font-medium border transition-colors"
							class:active-tab={currentView === 'simulator'}
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {currentView === 'simulator' ? 'var(--sqdgn-accent)' : 'transparent'};"
						>
							Strategy Simulator
						</button>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<div class="flex items-center space-x-2">
						<label class="text-sm font-medium" style="color: var(--sqdgn-text);">Period:</label>
						<select
							bind:value={selectedPeriod}
							on:change={handlePeriodChange}
							class="rounded px-3 py-1 text-sm focus:outline-none focus:ring-1"
							style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border); color: var(--sqdgn-text);"
							disabled={useCustomRange}
						>
							{#each periods as period}
								<option value={period.value}>{period.label}</option>
							{/each}
						</select>
					</div>
					<div class="flex items-center space-x-2">
						<label class="text-sm font-medium" style="color: var(--sqdgn-text);">Custom:</label>
						<input
							type="date"
							bind:value={startDate}
							on:change={handleCustomRangeChange}
							class="rounded px-2 py-1 text-sm focus:outline-none focus:ring-1"
							style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border); color: var(--sqdgn-text);"
						/>
						<span style="color: var(--sqdgn-text-muted);">to</span>
						<input
							type="date"
							bind:value={endDate}
							on:change={handleCustomRangeChange}
							class="rounded px-2 py-1 text-sm focus:outline-none focus:ring-1"
							style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border); color: var(--sqdgn-text);"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Content based on current view -->
		{#if currentView === 'overview'}
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
			<!-- Primary Overview Section -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Win Rate</div>
					<div class="text-2xl font-bold {getPerformanceColor(stats.performanceMetrics.winRate)}">{stats.performanceMetrics.winRate.toFixed(1)}%</div>
				</div>
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Median ROI</div>
					<div class="text-2xl font-bold {getPerformanceColor(stats.performanceMetrics.medianROI)}">{formatPercent(stats.performanceMetrics.medianROI)}</div>
				</div>
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Profit Factor</div>
					<div class="text-2xl font-bold {getProfitFactorColor(stats.performanceMetrics.profitFactor)}">{stats.performanceMetrics.profitFactor.toFixed(2)}</div>
				</div>
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Successful Calls</div>
					<div class="text-2xl font-bold text-green-400">{stats.performanceMetrics.successfulCalls}</div>
				</div>
			</div>

			<!-- Secondary Overview Section -->
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Total Calls</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.overview.totalCalls}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Valid Calls</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.overview.validCalls}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Calls/Day</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.detailedStats.callsPerDay.toFixed(1)}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Unique Tokens</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.detailedStats.uniqueTokens}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Total Volume</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{formatCurrency(stats.detailedStats.totalVolume)}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Avg Hold Time</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.performanceMetrics.averageHoldTime.toFixed(1)}h</div>
				</div>
			</div>

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
										<span class="{getPerformanceColor(parseFloat(type.medianROI))}">{formatPercent(parseFloat(type.medianROI))}</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Profit Factor:</span>
										<span class="{getProfitFactorColor(parseFloat(type.profitFactor))}">{type.profitFactor}</span>
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
										<span class="{getPerformanceColor(parseFloat(label.medianROI))}">{formatPercent(parseFloat(label.medianROI))}</span>
									</div>
									<div>
										<span style="color: var(--sqdgn-text-muted);">Profit Factor:</span>
										<span class="{getProfitFactorColor(parseFloat(label.profitFactor))}">{label.profitFactor}</span>
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

			<!-- Performance Tables -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<!-- Top Performers -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-3" style="color: var(--sqdgn-text);">Top Performers</h3>
					<div class="space-y-1">
						{#each stats.topPerformers.slice(0, 10) as call}
							<div class="flex items-center justify-between text-xs py-1">
								<div class="flex-1 min-w-0">
									<div class="flex items-center space-x-2">
										{#if call.contractAddress}
											<a 
												href={getDexScreenerUrl(call.contractAddress)} 
												target="_blank" 
												class="font-medium hover:underline" 
												style="color: var(--sqdgn-accent);"
											>
												{call.tokenSymbol}
											</a>
										{:else}
											<span class="font-medium" style="color: var(--sqdgn-text);">{call.tokenSymbol}</span>
										{/if}
										<span class="px-1 py-0.5 rounded text-xs" style="background-color: var(--sqdgn-bg); color: var(--sqdgn-text-muted);">{call.callType}</span>
									</div>
									<div class="text-xs" style="color: var(--sqdgn-text-muted);">
										{call.label || 'No Label'} • {formatDateTime(call.createdAt)}
									</div>
								</div>
								<div class="text-right">
									<div class="font-bold text-green-400">{formatPercent(call.roi)}</div>
									<div style="color: var(--sqdgn-text-muted);">{formatCurrency(call.currentMarketCap || 0)}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Worst Performers -->
				<div class="rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h3 class="text-sm font-semibold mb-3" style="color: var(--sqdgn-text);">Worst Performers</h3>
					<div class="space-y-1">
						{#each stats.worstPerformers.slice(0, 10) as call}
							<div class="flex items-center justify-between text-xs py-1">
								<div class="flex-1 min-w-0">
									<div class="flex items-center space-x-2">
										{#if call.contractAddress}
											<a 
												href={getDexScreenerUrl(call.contractAddress)} 
												target="_blank" 
												class="font-medium hover:underline" 
												style="color: var(--sqdgn-accent);"
											>
												{call.tokenSymbol}
											</a>
										{:else}
											<span class="font-medium" style="color: var(--sqdgn-text);">{call.tokenSymbol}</span>
										{/if}
										<span class="px-1 py-0.5 rounded text-xs" style="background-color: var(--sqdgn-bg); color: var(--sqdgn-text-muted);">{call.callType}</span>
									</div>
									<div class="text-xs" style="color: var(--sqdgn-text-muted);">
										{call.label || 'No Label'} • {formatDateTime(call.createdAt)}
									</div>
								</div>
								<div class="text-right">
									<div class="font-bold text-red-400">{formatPercent(call.roi)}</div>
									<div style="color: var(--sqdgn-text-muted);">{formatCurrency(call.currentMarketCap || 0)}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Price Analysis -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Avg Entry Price</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{formatCurrency(stats.priceAnalysis.averageEntryPrice)}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Avg Current Price</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{formatCurrency(stats.priceAnalysis.averageCurrentPrice)}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Price Winners</div>
					<div class="text-lg font-bold text-green-400">{stats.priceAnalysis.positivePriceChanges}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Price Losers</div>
					<div class="text-lg font-bold text-red-400">{stats.priceAnalysis.negativePriceChanges}</div>
				</div>
			</div>

			<!-- Additional Token Stats -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Best Token</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.detailedStats.bestToken?.symbol || 'N/A'}</div>
					<div class="text-xs text-green-400">{stats.detailedStats.bestToken ? formatPercent(stats.detailedStats.bestToken.avgROI) : 'N/A'}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Worst Token</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{stats.detailedStats.worstToken?.symbol || 'N/A'}</div>
					<div class="text-xs text-red-400">{stats.detailedStats.worstToken ? formatPercent(stats.detailedStats.worstToken.avgROI) : 'N/A'}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Total Liquidity</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{formatCurrency(stats.detailedStats.totalLiquidity)}</div>
				</div>
				<div class="rounded p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<div class="text-xs" style="color: var(--sqdgn-text-muted);">Avg Liquidity</div>
					<div class="text-lg font-bold" style="color: var(--sqdgn-text);">{formatCurrency(stats.detailedStats.averageLiquidity)}</div>
				</div>
			</div>
			{/if}
		{:else if currentView === 'simulator'}
			<!-- Strategy Simulator Section -->
			<StrategySimulator />
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