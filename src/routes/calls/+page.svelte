<script lang="ts">
	import { onMount } from 'svelte';
	import type { Call } from '$lib/types';
	import { formatMultiplier } from '$lib/utils';

	let calls: Call[] = [];
	let loading = true;
	let error: string | null = null;
	let currentPage = 0;
	let pageSize = 20;
	let hasMore = true;

	// Filters
	let filterToken = '';
	let filterCallType = '';
	let filterLabel = '';

	// Sorting
	let sortField = 'created_at';
	let sortDirection: 'asc' | 'desc' = 'desc';

	onMount(() => {
		loadCalls();
	});

	async function loadCalls(reset = false) {
		if (reset) {
			calls = [];
			currentPage = 0;
			hasMore = true;
			error = null; // Clear any previous errors
		}

		try {
			loading = true;
			const params = new URLSearchParams({
				limit: pageSize.toString(),
				offset: (currentPage * pageSize).toString()
			});

			if (filterToken) params.set('token', filterToken);
			if (filterCallType) params.set('call_type', filterCallType);
			if (filterLabel) params.set('label', filterLabel);
			
			// Add sorting parameters
			params.set('sort_field', sortField);
			params.set('sort_direction', sortDirection);

			console.log('Loading calls with params:', params.toString());

			const response = await fetch(`/api/calls?${params}`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});
			
			console.log('API Response status:', response.status, response.statusText);

			if (!response.ok) {
				const errorText = await response.text().catch(() => 'Unknown error');
				console.error('API Error Details:', {
					status: response.status,
					statusText: response.statusText,
					body: errorText,
					url: response.url
				});
				throw new Error(`API returned ${response.status}: ${errorText}`);
			}

			const data = await response.json().catch(async (err) => {
				console.error('JSON Parse Error:', err);
				throw new Error('Server returned invalid JSON response');
			});
			
			console.log('Loaded calls data:', { 
				callCount: data.calls?.length || 0, 
				hasMore: (data.calls || []).length === pageSize,
				pagination: data.pagination 
			});
			
			if (reset) {
				calls = data.calls || [];
			} else {
				calls = [...calls, ...(data.calls || [])];
			}
			
			hasMore = (data.calls || []).length === pageSize;
			currentPage++;
		} catch (err) {
			console.error('Load calls error:', err);
			const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while loading calls';
			error = `Error loading calls: ${errorMessage}`;
		} finally {
			loading = false;
		}
	}

	function handleFilterChange() {
		loadCalls(true);
	}

	function getRiskLevelColor(riskLevel: string): string {
		switch (riskLevel) {
			case 'LOW': return 'text-green-600 bg-green-100';
			case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
			case 'HIGH': return 'text-red-600 bg-red-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	function getSignalTypeColor(signalType: string): string {
		switch (signalType) {
			case 'BUY':
			case 'LONG': return 'text-green-600 bg-green-100';
			case 'SELL':
			case 'SHORT': return 'text-red-600 bg-red-100';
			default: return 'text-blue-600 bg-blue-100';
		}
	}

	function formatDate(dateString: string): string {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString();
	}

	function formatDateTime(dateString: string): string {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
	}

	function getTimeAgo(dateString: string): string {
		if (!dateString) return '-';
		const now = new Date();
		const date = new Date(dateString);
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 30) return `${diffDays}d ago`;
		return formatDate(dateString);
	}

	function formatMarketCap(value: number): string {
		if (!value || value === 0) return '-';
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(2)}M`;
		} else if (value >= 1000) {
			return `$${(value / 1000).toFixed(0)}K`;
		}
		return `$${value.toFixed(0)}`;
	}

	function formatCallType(callType: string): string {
		if (!callType) return '-';
		return callType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	}

	function formatPrice(price: number | null): string {
		if (!price || price === 0) return '-';
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

	function formatPriceChange(change: number | null): { text: string; colorClass: string } {
		if (change === null || change === 0) {
			return { text: '-', colorClass: 'text-gray-500' };
		}
		
		const absChange = Math.abs(change);
		const sign = change > 0 ? '+' : '';
		const text = `${sign}${absChange.toFixed(2)}%`;
		const colorClass = change > 0 ? 'text-green-600' : 'text-red-600';
		
		return { text, colorClass };
	}

	function getTimeSince(dateString: string | null): string {
		if (!dateString) return 'Never';
		const now = new Date();
		const date = new Date(dateString);
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
		return `${Math.floor(diffMins / 1440)}d ago`;
	}

	let priceUpdateInProgress = false;

	async function updatePrices(force = false) {
		if (priceUpdateInProgress) return;
		
		try {
			priceUpdateInProgress = true;
			const params = force ? '?force=true' : '';
			const response = await fetch(`/api/prices/fetch${params}`, {
				method: 'POST'
			});
			
			if (response.ok) {
				const result = await response.json();
				console.log(`Price update completed: ${result.updated}/${result.processed} updated`);
				// Refresh the calls data to show updated prices
				await loadCalls(true);
			} else {
				const error = await response.json();
				console.error('Price update failed:', error);
			}
		} catch (error) {
			console.error('Error updating prices:', error);
		} finally {
			priceUpdateInProgress = false;
		}
	}

	function handleSort(field: string) {
		if (sortField === field) {
			// Toggle direction if same field
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// New field, default to desc for most fields, asc for text fields
			sortField = field;
			sortDirection = field === 'token_symbol' ? 'asc' : 'desc';
		}
		loadCalls(true);
	}

	function getSortIcon(field: string): string {
		if (sortField !== field) return '↕️';
		return sortDirection === 'asc' ? '↑' : '↓';
	}
</script>

<svelte:head>
	<title>SQDGN Trading Bot - Calls</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Trading Calls</h2>
			<p class="text-gray-600">All parsed trading signals from the SQDGN channel</p>
		</div>
		<div class="flex gap-2">
			<button
				on:click={() => updatePrices(false)}
				disabled={priceUpdateInProgress}
				class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{priceUpdateInProgress ? 'Updating...' : 'Update Prices'}
			</button>
			<button
				on:click={() => updatePrices(true)}
				disabled={priceUpdateInProgress}
				class="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Force Refresh
			</button>
			<button
				on:click={() => {
					filterToken = '';
					filterCallType = '';
					filterLabel = '';
					handleFilterChange();
				}}
				class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Clear Filters
			</button>
		</div>
	</div>


	<!-- Calls Table -->
	<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
		{#if loading && calls.length === 0}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-md p-4 m-6">
				<p class="text-red-800">Error: {error}</p>
			</div>
		{:else if calls.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500">No calls found matching your criteria</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<div class="space-y-0.5">
									<div>
										<button 
											on:click={() => handleSort('token_symbol')} 
											class="flex items-center space-x-1 hover:text-gray-700 focus:outline-none"
										>
											<span>Token</span>
											<span>{getSortIcon('token_symbol')}</span>
										</button>
									</div>
									<input
										type="text"
										placeholder="Filter..."
										bind:value={filterToken}
										on:input={handleFilterChange}
										class="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
								</div>
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<div class="space-y-0.5">
									<div>Call Type</div>
									<select
										bind:value={filterCallType}
										on:change={handleFilterChange}
										class="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										<option value="">All</option>
										<option value="market_activity">Market Activity</option>
										<option value="transaction_spotted">Transaction Spotted</option>
										<option value="large_trade">Large Trade</option>
										<option value="wallet_activity">Wallet Activity</option>
										<option value="significant_transaction">Significant Transaction</option>
										<option value="wallet_signal">Wallet Signal</option>
										<option value="smart_money">Smart Money</option>
										<option value="onchain_signal">On-chain Signal</option>
									</select>
								</div>
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<div class="space-y-0.5">
									<div>Label</div>
									<select
										bind:value={filterLabel}
										on:change={handleFilterChange}
										class="w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										<option value="">All</option>
										<option value="NEWBORN">Newborn</option>
										<option value="ESTABLISHED">Established</option>
										<option value="VETERAN">Veteran</option>
										<option value="MATURING">Maturing</option>
									</select>
								</div>
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button 
									on:click={() => handleSort('created_at')} 
									class="flex items-center space-x-1 hover:text-gray-700 focus:outline-none"
								>
									<span>Call Time</span>
									<span>{getSortIcon('created_at')}</span>
								</button>
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Creation Date
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Market Cap
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Liquidity
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Current Market Cap
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button 
									on:click={() => handleSort('pnl_percentage')} 
									class="flex items-center space-x-1 hover:text-gray-700 focus:outline-none"
								>
									<span>Market Cap Performance</span>
									<span>{getSortIcon('pnl_percentage')}</span>
								</button>
							</th>
							<th class="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								DEX Screener
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each calls as call}
							<tr class="hover:bg-gray-50">
								<td class="px-3 py-2 whitespace-nowrap">
									<span class="font-medium text-gray-900">
										{call.token_symbol ? `$${call.token_symbol}` : '-'}
									</span>
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
									{formatCallType(call.call_type)}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
									{call.sqdgn_label || '-'}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
									<div class="font-medium">{getTimeAgo(call.message_timestamp || call.created_at)}</div>
									<div class="text-xs text-gray-500">{formatDateTime(call.message_timestamp || call.created_at)}</div>
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
									{call.creation_date ? formatDate(call.creation_date) : '-'}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
									{call.market_cap ? formatMarketCap(call.market_cap) : '-'}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
									{call.liquidity ? formatMarketCap(call.liquidity) : '-'}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
									<div class="font-medium">{call.latest_market_cap ? formatMarketCap(call.latest_market_cap) : '-'}</div>
									{#if call.market_cap_last_updated}
										<div class="text-xs text-gray-500">{getTimeSince(call.market_cap_last_updated)}</div>
									{:else}
										<div class="text-xs text-gray-400">No market cap data</div>
									{/if}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm">
									{#if call.market_cap_change !== null}
										{@const marketCapChange = formatPriceChange(call.market_cap_change)}
										<div class="flex flex-col">
											<span class={marketCapChange.colorClass + ' font-medium'}>
												{marketCapChange.text}
											</span>
											<div class="text-xs text-gray-500 mt-1">
												{call.market_cap ? formatMarketCap(call.market_cap) : 'N/A'} → {call.latest_market_cap ? formatMarketCap(call.latest_market_cap) : 'N/A'}
											</div>
										</div>
									{:else}
										<span class="text-gray-400">-</span>
									{/if}
								</td>
								<td class="px-3 py-2 whitespace-nowrap text-sm text-blue-600">
									{#if call.dex_screener_url}
										<a href={call.dex_screener_url} target="_blank" rel="noopener noreferrer" class="hover:underline">
											View
										</a>
									{:else}
										<span class="text-gray-400">-</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if hasMore}
				<div class="px-6 py-4 border-t border-gray-200 text-center">
					<button
						on:click={() => loadCalls()}
						disabled={loading}
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Loading...' : 'Load More'}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>