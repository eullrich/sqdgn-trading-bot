<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { DashboardMetrics } from '$lib/types';
	import { formatCurrency, formatPercentage, formatMultiplier } from '$lib/utils';
	import Terminal from '$lib/components/Terminal.svelte';

	let analytics: any = null;
	let roiData: any = null;
	let loading = true;
	let error: string | null = null;
	
	// Real-time monitoring state
	let monitoringStatus = { isListening: false, status: 'disconnected' };
	let monitoringLoading = false;

	// Advanced filtering state
	let selectedPeriod = '1d';
	let selectedToken = '';
	let selectedCallType = '';
	let selectedLabel = '';
	let customStartDate = '';
	let customEndDate = '';
	
	// Dynamic options that will be populated from the analytics data
	$: callTypeOptions = analytics?.callTypeBreakdown?.map((ct: any) => ({
		value: ct.type,
		label: ct.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
	})) || [];
	
	$: labelOptions = analytics?.labelPerformance?.map((lp: any) => ({
		value: lp.label,
		label: lp.label.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
	})) || [];

	const periods = [
		{ value: '1d', label: 'Last 24 hours' },
		{ value: '2d', label: 'Last 2 days' },
		{ value: '7d', label: 'Last 7 days' },
		{ value: '30d', label: 'Last 30 days' },
		{ value: '90d', label: 'Last 90 days' },
		{ value: 'all', label: 'All time' },
		{ value: 'custom', label: 'Custom range' }
	];

	onMount(async () => {
		// Check authentication first
		const authResponse = await fetch('/api/auth/status');
		const authResult = await authResponse.json();
		
		if (!authResult.authenticated) {
			goto('/login');
			return;
		}
		
		await loadDashboardData();
	});

	async function loadDashboardData() {
		try {
			loading = true;
			
			// Build analytics parameters with filters
			const analyticsParams = new URLSearchParams();
			
			if (selectedPeriod === 'custom') {
				if (customStartDate) {
					analyticsParams.set('start_date', new Date(customStartDate).toISOString());
				}
				if (customEndDate) {
					const endDate = new Date(customEndDate);
					endDate.setHours(23, 59, 59, 999);
					analyticsParams.set('end_date', endDate.toISOString());
				}
			} else if (selectedPeriod !== 'all') {
				const days = parseInt(selectedPeriod);
				const startDate = new Date();
				startDate.setDate(startDate.getDate() - days);
				analyticsParams.set('start_date', startDate.toISOString());
			}

			if (selectedToken) {
				analyticsParams.set('token', selectedToken);
			}

			if (selectedCallType) {
				analyticsParams.set('call_type', selectedCallType);
			}

			if (selectedLabel) {
				analyticsParams.set('label', selectedLabel);
			}
			
			// Fetch analytics data with filters
			const analyticsResponse = await fetch(`/api/analytics?${analyticsParams}`);
			if (!analyticsResponse.ok) {
				throw new Error('Failed to fetch analytics');
			}
			analytics = await analyticsResponse.json();
			
			// Fetch real-time ROI data (always unfiltered for current portfolio view)
			try {
				const roiResponse = await fetch('/api/analytics/roi', {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				});
				if (roiResponse.ok) {
					roiData = await roiResponse.json();
				} else {
					console.warn('ROI data fetch failed:', roiResponse.status);
				}
			} catch (roiError) {
				console.warn('ROI data fetch error:', roiError);
				// Continue without ROI data - the UI will fall back gracefully
			}
			
			// Check monitoring status
			await checkMonitoringStatus();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function checkMonitoringStatus() {
		try {
			const response = await fetch('/api/telegram/start-listening');
			if (response.ok) {
				monitoringStatus = await response.json();
			}
		} catch (err) {
			console.error('Failed to check monitoring status:', err);
		}
	}

	async function startMonitoring() {
		monitoringLoading = true;
		try {
			const response = await fetch('/api/telegram/start-listening', {
				method: 'POST'
			});
			
			if (response.ok) {
				const result = await response.json();
				monitoringStatus = { isListening: true, status: result.status };
			} else {
				const errorData = await response.json();
				alert(`Failed to start monitoring: ${errorData.error}`);
			}
		} catch (err) {
			alert('Failed to start monitoring: ' + (err instanceof Error ? err.message : 'Unknown error'));
		} finally {
			monitoringLoading = false;
		}
	}

	async function stopMonitoring() {
		monitoringLoading = true;
		try {
			const response = await fetch('/api/telegram/start-listening', {
				method: 'DELETE'
			});
			
			if (response.ok) {
				const result = await response.json();
				monitoringStatus = { isListening: false, status: result.status };
			} else {
				const errorData = await response.json();
				alert(`Failed to stop monitoring: ${errorData.error}`);
			}
		} catch (err) {
			alert('Failed to stop monitoring: ' + (err instanceof Error ? err.message : 'Unknown error'));
		} finally {
			monitoringLoading = false;
		}
	}

	async function fetchHistory() {
		monitoringLoading = true;
		try {
			const response = await fetch('/api/telegram/fetch-history', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ limit: 50 })
			});
			
			if (response.ok) {
				const result = await response.json();
				alert(`Successfully processed ${result.limit} recent messages!`);
				// Refresh analytics
				window.location.reload();
			} else {
				const errorData = await response.json();
				alert(`Failed to fetch history: ${errorData.error}`);
			}
		} catch (err) {
			alert('Failed to fetch history: ' + (err instanceof Error ? err.message : 'Unknown error'));
		} finally {
			monitoringLoading = false;
		}
	}

	function getROIColor(roi: number): string {
		if (roi > 10) return 'text-green-600';
		if (roi > 0) return 'text-green-500';
		if (roi > -10) return 'text-yellow-600';
		return 'text-red-600';
	}
	
	function formatROI(roi: number): string {
		const sign = roi > 0 ? '+' : '';
		return `${sign}${roi.toFixed(2)}%`;
	}
	
	function formatPrice(price: number): string {
		if (price < 0.000001) {
			return price.toExponential(2);
		} else if (price < 0.01) {
			return `$${price.toFixed(6)}`;
		} else if (price < 1) {
			return `$${price.toFixed(4)}`;
		} else {
			return `$${price.toFixed(2)}`;
		}
	}
	
	function getTimeAgo(dateString: string): string {
		const now = new Date();
		const date = new Date(dateString);
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
		
		if (diffHours < 1) return 'Just now';
		if (diffHours < 24) return `${diffHours}h ago`;
		return `${Math.floor(diffHours / 24)}d ago`;
	}
	
	async function updatePrices() {
		try {
			const response = await fetch('/api/prices/fetch', { method: 'POST' });
			if (response.ok) {
				// Refresh all data after price update
				await loadDashboardData();
			}
		} catch (error) {
			console.error('Error updating prices:', error);
		}
	}

	// Filter change handlers
	function handlePeriodChange() {
		loadDashboardData();
	}

	function handleTokenChange() {
		loadDashboardData();
	}

	function resetFilters() {
		selectedPeriod = '1d';
		selectedToken = '';
		selectedCallType = '';
		selectedLabel = '';
		customStartDate = '';
		customEndDate = '';
		loadDashboardData();
	}

	function getPerformanceColor(value: number, type: 'winRate' | 'multiplier' | 'pnl'): string {
		switch (type) {
			case 'winRate':
				if (value >= 70) return 'text-green-600';
				if (value >= 50) return 'text-yellow-600';
				return 'text-red-600';
			case 'multiplier':
				if (value >= 3) return 'text-green-600';
				if (value >= 2) return 'text-yellow-600';
				return 'text-red-600';
			case 'pnl':
				if (value > 0) return 'text-green-600';
				if (value === 0) return 'text-gray-600';
				return 'text-red-600';
			default:
				return 'text-gray-600';
		}
	}
</script>

<svelte:head>
	<title>SQDGN Trading Bot - Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
		<p class="text-gray-600">Overview of your trading signals and performance</p>
	</div>

	<!-- Real-time Monitoring Control Panel -->
	<div class="bg-white rounded-lg shadow-sm border">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-medium text-gray-900">Real-time SQDGN Monitoring</h3>
			<p class="text-sm text-gray-600">Control live message parsing from the SQDGN Telegram channel</p>
		</div>
		<div class="p-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div class="flex items-center">
						<div class="w-3 h-3 rounded-full {monitoringStatus.isListening ? 'bg-green-500' : 'bg-gray-400'}"></div>
						<span class="ml-2 text-sm font-medium text-gray-900">
							Status: {monitoringStatus.status || 'disconnected'}
						</span>
					</div>
					{#if monitoringStatus.isListening}
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
							Live
						</span>
					{:else}
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							Offline
						</span>
					{/if}
				</div>
				
				<div class="flex items-center space-x-3">
					<button
						on:click={() => goto('/channels')}
						class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						Select Channels
					</button>
					
					<button
						on:click={fetchHistory}
						disabled={monitoringLoading}
						class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
					>
						{#if monitoringLoading}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
						{/if}
						Fetch History
					</button>
					
					{#if monitoringStatus.isListening}
						<button
							on:click={stopMonitoring}
							disabled={monitoringLoading}
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
						>
							{#if monitoringLoading}
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							{/if}
							Stop Monitoring
						</button>
					{:else}
						<button
							on:click={startMonitoring}
							disabled={monitoringLoading}
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
						>
							{#if monitoringLoading}
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							{/if}
							Start Monitoring
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Advanced Filters Panel -->
	<div class="bg-white rounded-lg shadow-sm border">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-medium text-gray-900">Analytics Filters</h3>
			<p class="text-sm text-gray-600">Filter data for detailed analysis and insights</p>
		</div>
		<div class="p-6">
			<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div>
					<label for="period" class="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
					<select
						id="period"
						bind:value={selectedPeriod}
						on:change={handlePeriodChange}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{#each periods as period}
							<option value={period.value}>{period.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="token-filter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Token</label>
					<input
						id="token-filter"
						type="text"
						placeholder="e.g. BTC, ETH (optional)"
						bind:value={selectedToken}
						on:input={handleTokenChange}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
				</div>

				<div>
					<label for="call-type-filter" class="block text-sm font-medium text-gray-700 mb-1">Call Type</label>
					<select
						id="call-type-filter"
						bind:value={selectedCallType}
						on:change={loadDashboardData}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">All Types</option>
						{#each callTypeOptions as callType}
							<option value={callType.value}>{callType.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="label-filter" class="block text-sm font-medium text-gray-700 mb-1">SQDGN Label</label>
					<select
						id="label-filter"
						bind:value={selectedLabel}
						on:change={loadDashboardData}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">All Labels</option>
						{#each labelOptions as label}
							<option value={label.value}>{label.label}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-end">
					<button
						on:click={resetFilters}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Reset Filters
					</button>
				</div>
			</div>
			
			<!-- Custom Date Range (shown when custom period is selected) -->
			{#if selectedPeriod === 'custom'}
				<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
						<input
							id="start-date"
							type="date"
							bind:value={customStartDate}
							on:change={loadDashboardData}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
					</div>
					<div>
						<label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
						<input
							id="end-date"
							type="date"
							bind:value={customEndDate}
							on:change={loadDashboardData}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 rounded-md p-4">
			<p class="text-red-800">Error: {error}</p>
		</div>
	{:else if analytics}
		<!-- Real-Time ROI Overview Stats -->
		{#if roiData && analytics}
			<!-- Enhanced Key Metrics Overview -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
								<dd class="text-lg font-medium text-gray-900">{analytics.overview?.totalCalls || roiData.totalCalls}</dd>
								<dd class="text-sm text-gray-500">{analytics.overview?.callsWithData || roiData.callsWithPrices} with data</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Avg Market Cap ROI</dt>
								<dd class="text-lg font-medium {getPerformanceColor(analytics.overview?.avgMarketCapROI || 0, 'pnl')}">
									{analytics.overview?.avgMarketCapROI > 0 ? '+' : ''}{(analytics.overview?.avgMarketCapROI || 0).toFixed(1)}%
								</dd>
								<dd class="text-sm text-gray-500">Market cap change</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
								<dd class="text-lg font-medium {getPerformanceColor(analytics.overview?.overallWinRate || 0, 'winRate')}">
									{(analytics.overview?.overallWinRate || 0).toFixed(1)}%
								</dd>
								<dd class="text-sm text-gray-500">Positive ROI calls</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Best Performer</dt>
								<dd class="text-lg font-medium {getPerformanceColor(analytics.overview?.bestPerformer || 0, 'pnl')}">
									{analytics.overview?.bestPerformer > 0 ? '+' : ''}{(analytics.overview?.bestPerformer || 0).toFixed(1)}%
								</dd>
								<dd class="text-sm text-gray-500">Highest gain</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Worst Performer</dt>
								<dd class="text-lg font-medium {getPerformanceColor(analytics.overview?.worstPerformer || 0, 'pnl')}">
									{analytics.overview?.worstPerformer > 0 ? '+' : ''}{(analytics.overview?.worstPerformer || 0).toFixed(1)}%
								</dd>
								<dd class="text-sm text-gray-500">Lowest change</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<!-- Real-time Portfolio Overview -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Portfolio ROI</dt>
								<dd class="text-lg font-medium {getROIColor(roiData.portfolioROI)}">
									{formatROI(roiData.portfolioROI)}
								</dd>
								<dd class="text-sm text-gray-500">Current portfolio</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Market Cap Coverage</dt>
								<dd class="text-lg font-medium text-gray-900">
									{((analytics.overview?.callsWithData || roiData.callsWithMarketCapData) / Math.max(analytics.overview?.totalCalls || roiData.totalCalls, 1) * 100).toFixed(1)}%
								</dd>
								<dd class="text-sm text-gray-500">{analytics.overview?.callsWithData || roiData.callsWithMarketCapData}/{analytics.overview?.totalCalls || roiData.totalCalls} calls with market cap data</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
		{:else if roiData}
			<!-- Fallback ROI stats if analytics not available -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
								<dd class="text-lg font-medium text-gray-900">{roiData.totalCalls}</dd>
							</dl>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Portfolio ROI</dt>
								<dd class="text-lg font-medium {getROIColor(roiData.portfolioROI)}">
									{formatROI(roiData.portfolioROI)}
								</dd>
							</dl>
						</div>
					</div>
				</div>


				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Market Cap Coverage</dt>
								<dd class="text-lg font-medium text-gray-900">
									{roiData.callsWithMarketCapData || roiData.callsWithPrices}/{roiData.totalCalls}
								</dd>
								<dd class="text-sm text-gray-500">calls with market cap data</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<!-- Today's Performance Banner -->
			{#if roiData?.todaysPerformance?.callsToday > 0}
				<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
					<div class="flex items-center justify-between">
						<div>
							<h4 class="text-lg font-medium text-blue-900">Today's Performance</h4>
							<p class="text-sm text-blue-600">{roiData.todaysPerformance.callsToday} calls made today</p>
						</div>
						<div class="flex items-center space-x-6">
							<div class="text-center">
								<div class="text-2xl font-bold {getROIColor(roiData.todaysPerformance.todayROI)}">
									{formatROI(roiData.todaysPerformance.todayROI)}
								</div>
								<div class="text-xs text-gray-600">Avg ROI</div>
							</div>
							<div class="text-center">
								<div class="text-lg font-semibold text-green-600">
									{formatROI(roiData.todaysPerformance.biggestGainToday)}
								</div>
								<div class="text-xs text-gray-600">Best</div>
							</div>
							<div class="text-center">
								<div class="text-lg font-semibold text-red-600">
									{formatROI(roiData.todaysPerformance.biggestLossToday)}
								</div>
								<div class="text-xs text-gray-600">Worst</div>
							</div>
							<button
								on:click={updatePrices}
								class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
							>
								Update Prices
							</button>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<!-- Fallback to basic stats if ROI data not available -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
								<dd class="text-lg font-medium text-gray-900">{analytics?.overview?.total_calls || 0}</dd>
							</dl>
						</div>
					</div>
				</div>
				<div class="bg-white rounded-lg shadow-sm border p-6">
					<div class="text-center text-gray-500">
						<p>Price data loading...</p>
						<button
							on:click={updatePrices}
							class="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
						>
							Fetch Prices
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if roiData}
			<!-- Enhanced Analytics Sections -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Call Type Breakdown -->
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">📊 Call Type Analysis</h3>
						<p class="text-sm text-gray-600">Performance breakdown by call type</p>
					</div>
					<div class="p-6">
						{#if analytics?.callTypeBreakdown && analytics.callTypeBreakdown.length > 0}
							<div class="space-y-4">
								{#each analytics.callTypeBreakdown as callType}
									<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div class="flex items-center space-x-3">
											<span class="font-semibold text-gray-900">{callType.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
											<span class="text-sm text-gray-500">{callType.count} calls</span>
										</div>
										<div class="flex items-center space-x-4 text-sm">
											<div class="text-center">
												<div class="font-medium {getPerformanceColor(callType.winRate, 'winRate')}">
													{callType.winRate.toFixed(1)}%
												</div>
												<div class="text-gray-500">Win Rate</div>
											</div>
											<div class="text-center">
												<div class="font-medium {getPerformanceColor(callType.avgROI, 'pnl')}">
													{callType.avgROI > 0 ? '+' : ''}{callType.avgROI.toFixed(1)}%
												</div>
												<div class="text-gray-500">Avg ROI</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else if roiData?.callTypePerformance && roiData.callTypePerformance.length > 0}
							<!-- Fallback to ROI data if analytics not available -->
							<div class="space-y-4">
								{#each roiData.callTypePerformance.slice(0, 5) as callType}
									<div class="flex items-center justify-between">
										<div class="flex items-center">
											<span class="text-sm font-medium text-gray-900">
												{callType.callType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
											</span>
											<span class="ml-2 text-xs text-gray-500">({callType.count})</span>
										</div>
										<div class="text-right">
											<div class="text-sm font-medium {getROIColor(callType.avgROI)}">
												{formatROI(callType.avgROI)}
											</div>
											<div class="text-xs text-gray-500">avg</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500 text-center py-4">No call type data available</p>
						{/if}
					</div>
				</div>

				<!-- SQDGN Label Performance -->
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">🏷️ Label Performance</h3>
						<p class="text-sm text-gray-600">ROI performance by token maturity labels</p>
					</div>
					<div class="p-6">
						{#if analytics?.labelPerformance && analytics.labelPerformance.length > 0}
							<div class="space-y-4">
								{#each analytics.labelPerformance as label}
									<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div class="flex items-center space-x-3">
											<span class="font-semibold text-gray-900">{label.label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
											<span class="text-sm text-gray-500">{label.count} calls</span>
										</div>
										<div class="flex items-center space-x-4 text-sm">
											<div class="text-center">
												<div class="font-medium {getPerformanceColor(label.winRate, 'winRate')}">
													{label.winRate.toFixed(1)}%
												</div>
												<div class="text-gray-500">Win Rate</div>
											</div>
											<div class="text-center">
												<div class="font-medium {getPerformanceColor(label.avgROI, 'pnl')}">
													{label.avgROI > 0 ? '+' : ''}{label.avgROI.toFixed(1)}%
												</div>
												<div class="text-gray-500">Avg ROI</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else if roiData?.labelPerformance && roiData.labelPerformance.length > 0}
							<!-- Fallback to ROI data if analytics not available -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								{#each roiData.labelPerformance as label}
									<div class="bg-gray-50 rounded-lg p-4 text-center">
										<div class="text-lg font-bold {getROIColor(label.avgROI)}">
											{formatROI(label.avgROI)}
										</div>
										<div class="text-sm font-medium text-gray-700 mt-1">
											{label.label}
										</div>
										<div class="text-xs text-gray-500">
											{label.count} calls
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500 text-center py-4">No SQDGN label data available</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Top Performers Section -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Top Gainers -->
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200 bg-green-50">
						<h3 class="text-lg font-medium text-green-800">🚀 Top Gainers</h3>
					</div>
					<div class="p-6">
						{#if roiData?.topGainers && roiData.topGainers.length > 0}
							<div class="space-y-4">
								{#each roiData.topGainers.slice(0, 5) as gainer}
									<div class="flex items-center justify-between">
										<div class="flex items-center">
											<span class="font-medium text-gray-900">${gainer.symbol}</span>
											<span class="ml-2 text-xs text-gray-500">{getTimeAgo(gainer.createdAt)}</span>
										</div>
										<div class="text-right">
											<div class="text-sm font-medium text-green-600">
												{formatROI(gainer.roi)}
											</div>
											<div class="text-xs text-gray-500">
												{formatPrice(gainer.currentPrice)}
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500 text-center py-4">No price data available</p>
						{/if}
					</div>
				</div>

				<!-- Top Losers -->
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200 bg-red-50">
						<h3 class="text-lg font-medium text-red-800">📉 Biggest Losers</h3>
					</div>
					<div class="p-6">
						{#if roiData?.topLosers && roiData.topLosers.length > 0}
							<div class="space-y-4">
								{#each roiData.topLosers.slice(0, 5) as loser}
									<div class="flex items-center justify-between">
										<div class="flex items-center">
											<span class="font-medium text-gray-900">${loser.symbol}</span>
											<span class="ml-2 text-xs text-gray-500">{getTimeAgo(loser.createdAt)}</span>
										</div>
										<div class="text-right">
											<div class="text-sm font-medium text-red-600">
												{formatROI(loser.roi)}
											</div>
											<div class="text-xs text-gray-500">
												{formatPrice(loser.currentPrice)}
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500 text-center py-4">No price data available</p>
						{/if}
					</div>
				</div>

				<!-- Performance Trends Chart -->
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">📈 Performance Trends</h3>
						<p class="text-sm text-gray-600">Daily win rate trends</p>
					</div>
					<div class="p-6">
						{#if analytics?.trends && analytics.trends.length > 0}
							<div class="space-y-3">
								{#each analytics.trends.slice(-14) as trend}
									<div class="flex items-center justify-between">
										<span class="text-sm text-gray-600 w-20">
											{new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</span>
										<div class="flex-1 mx-4">
											<div class="flex items-center space-x-2">
												<div class="flex-1 bg-gray-200 rounded-full h-2">
													<div 
														class="bg-blue-500 h-2 rounded-full transition-all" 
														style="width: {Math.min(trend.winRate, 100)}%"
													></div>
												</div>
												<span class="text-xs text-gray-500 w-12">
													{trend.winRate.toFixed(0)}%
												</span>
											</div>
										</div>
										<div class="flex items-center space-x-2 text-sm">
											<span class="text-gray-600">{trend.calls}</span>
											<span class="text-gray-400">calls</span>
										</div>
									</div>
								{/each}
							</div>
							<div class="mt-4 text-xs text-gray-500 text-center">
								Last {Math.min(analytics.trends.length, 14)} days
							</div>
						{:else}
							<p class="text-gray-500 text-center py-4">No trend data available</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Top Performing Tokens -->
			{#if analytics?.topTokens && analytics.topTokens.length > 0}
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">🏆 Top Performing Tokens</h3>
						<p class="text-sm text-gray-600">Best performing tokens by win rate and ROI</p>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{#each analytics.topTokens.slice(0, 8) as token}
								<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div class="flex items-center space-x-3">
										<span class="font-semibold text-gray-900">${token.symbol}</span>
										<span class="text-sm text-gray-500">{token.count} calls</span>
									</div>
									<div class="flex items-center space-x-4 text-sm">
										<div class="text-center">
											<div class="font-medium {getPerformanceColor(token.winRate, 'winRate')}">
												{token.winRate.toFixed(1)}%
											</div>
											<div class="text-gray-500">Win Rate</div>
										</div>
										<div class="text-center">
											<div class="font-medium {getPerformanceColor(token.avgROI, 'pnl')}">
												{token.avgROI > 0 ? '+' : ''}{token.avgROI.toFixed(1)}%
											</div>
											<div class="text-gray-500">Avg ROI</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<!-- Detailed Statistics -->
			{#if analytics?.overview}
				<div class="bg-white rounded-lg shadow-sm border">
					<div class="px-6 py-4 border-b border-gray-200">
						<h3 class="text-lg font-medium text-gray-900">📊 Detailed Statistics</h3>
						<p class="text-sm text-gray-600">Additional insights and metrics</p>
					</div>
					<div class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div class="text-center">
								<div class="text-2xl font-bold text-gray-900">
									{((analytics.overview.callsWithData / Math.max(analytics.overview.totalCalls, 1)) * 100).toFixed(1)}%
								</div>
								<div class="text-sm text-gray-500 mt-1">Data Coverage</div>
								<div class="text-xs text-gray-400">{analytics.overview.callsWithData}/{analytics.overview.totalCalls} calls</div>
							</div>

							<div class="text-center">
								<div class="text-2xl font-bold text-gray-900">
									{analytics.topTokens?.length || 0}
								</div>
								<div class="text-sm text-gray-500 mt-1">Unique Tokens</div>
								<div class="text-xs text-gray-400">tracked</div>
							</div>

							<div class="text-center">
								<div class="text-2xl font-bold text-gray-900">
									{analytics.recentActivity && analytics.recentActivity.length > 0 ? Math.round((Date.now() - new Date(analytics.recentActivity[0].created_at).getTime()) / (1000 * 60 * 60)) : 0}h
								</div>
								<div class="text-sm text-gray-500 mt-1">Since Last Call</div>
								<div class="text-xs text-gray-400">hours ago</div>
							</div>

							<div class="text-center">
								<div class="text-2xl font-bold text-gray-900">
									{analytics.trends ? (analytics.trends.reduce((sum, t) => sum + t.calls, 0) / Math.max(analytics.trends.length, 1)).toFixed(1) : '0.0'}
								</div>
								<div class="text-sm text-gray-500 mt-1">Avg Calls/Day</div>
								<div class="text-xs text-gray-400">recent period</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

		{:else}
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<div class="text-center text-gray-500">
					<p>Loading ROI analytics...</p>
					<p class="text-sm mt-2">Make sure to fetch prices first for accurate ROI calculations</p>
				</div>
			</div>
		{/if}

		<!-- Terminal Output Section -->
		<div class="space-y-6">
			<Terminal 
				title="🖥️ System Logs" 
				height="400px" 
				maxLines={200}
			/>
		</div>

	{/if}
</div>
