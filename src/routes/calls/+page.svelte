<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Call } from '$lib/types';
	import { formatMultiplier } from '$lib/utils';
	import type { PageData } from './$types';
	// TEMPORARILY DISABLED DURING DATABASE MIGRATION
	// import { supabase, realtimeStatus } from '$lib/stores/supabase';
	// import type { RealtimeChannel } from '@supabase/supabase-js';

	export let data: PageData;

	// Initialize with server-side data
	let calls: Call[] = data.calls || [];
	let loading = false; // Data is already loaded server-side
	let error: string | null = data.error || null;
	let currentPage = 0;
	let pageSize = 20;
	let hasMore = true;
	let lastPriceRefresh: string | null = data.lastPriceRefresh || null;

	// Filters
	let filterToken = '';
	let filterCallType = '';
	let filterLabel = '';

	// Sorting - default to most recent calls first (descending order)
	let sortField = 'messageTimestamp';
	let sortDirection: 'asc' | 'desc' = 'desc';

	// TEMPORARILY DISABLED DURING DATABASE MIGRATION
	// Real-time subscription
	// let realtimeChannel: RealtimeChannel | null = null;
	// let isRealtimeConnected = false;

	onMount(() => {
		// Data is already loaded server-side, no need to call loadCalls
		console.log('📞 Client-side onMount - data already loaded:', {
			callsLength: calls.length,
			hasError: !!error,
			lastRefresh: lastPriceRefresh
		});
		// TEMPORARILY DISABLED DURING DATABASE MIGRATION
		// setupRealtimeSubscription();
	});

	onDestroy(() => {
		// TEMPORARILY DISABLED DURING DATABASE MIGRATION
		// if (realtimeChannel) {
		// 	realtimeChannel.unsubscribe();
		// }
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
			console.log('About to make fetch request to:', `/api/calls?${params}`);

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
				pagination: data.pagination,
				sampleCall: data.calls?.[0] ? {
					id: data.calls[0].id,
					tokenSymbol: data.calls[0].tokenSymbol,
					hasMarketCapChange: typeof data.calls[0].market_cap_change !== 'undefined',
					hasCurrentLiquidity: typeof data.calls[0].current_liquidity !== 'undefined'
				} : null
			});
			
			if (reset) {
				calls = data.calls || [];
			} else {
				calls = [...calls, ...(data.calls || [])];
			}
			
			// Update last price refresh time
			if (data.lastPriceRefresh) {
				lastPriceRefresh = data.lastPriceRefresh;
			}
			
			hasMore = (data.calls || []).length === pageSize;
			currentPage++;
		} catch (err) {
			console.error('Load calls error:', err);
			const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while loading calls';
			error = `Error loading calls: ${errorMessage}`;
			console.error('Full error details:', {
				message: errorMessage,
				stack: err instanceof Error ? err.stack : 'No stack trace',
				name: err instanceof Error ? err.name : 'Unknown error type',
				err
			});
		} finally {
			loading = false;
			console.log('loadCalls completed. Final state:', {
				callsLength: calls.length,
				loading,
				hasError: !!error
			});
		}
	}

	function handleFilterChange() {
		loadCalls(true);
	}

	// TEMPORARILY DISABLED DURING DATABASE MIGRATION
	function setupRealtimeSubscription() {
		console.log('⚠️ Real-time subscriptions temporarily disabled during database migration');
		// console.log('🔄 Setting up real-time subscription for calls table...');
		//
		// realtimeChannel = supabase
		// 	.channel('calls-changes')
		// 	.on(
		// 		'postgres_changes',
		// 		{
		// 			event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
		// 			schema: 'public',
		// 			table: 'calls'
		// 		},
		// 		(payload) => {
		// 			console.log('📡 Real-time update received:', payload);
		// 			handleRealtimeUpdate(payload);
		// 		}
		// 	)
		// 	.subscribe((status) => {
		// 		console.log('Real-time subscription status:', status);
		// 		isRealtimeConnected = status === 'SUBSCRIBED';
		// 		if (status === 'SUBSCRIBED') {
		// 			realtimeStatus.set('connected');
		// 			console.log('✅ Real-time subscription connected');
		// 		} else if (status === 'CHANNEL_ERROR') {
		// 			realtimeStatus.set('error');
		// 			console.error('❌ Real-time subscription error');
		// 		}
		// 	});
	}

	// TEMPORARILY DISABLED DURING DATABASE MIGRATION
	// function handleRealtimeUpdate(payload: any) {
	//   const { eventType, new: newRecord, old: oldRecord } = payload;
	//
	//   if (eventType === 'INSERT' && newRecord) {
	//     // Add new call to the beginning of the list (most recent first)
	//     const newCall = newRecord as Call;
	//     console.log('📬 New call received via real-time:', newCall.token_symbol);
	//
	//     // Only add if it's not already in the list (avoid duplicates)
	//     const existingIndex = calls.findIndex(call => call.id === newCall.id);
	//     if (existingIndex === -1) {
	//       calls = [newCall, ...calls];
	//       console.log('✅ Added new call to UI:', newCall.token_symbol);
	//     }
	//   } else if (eventType === 'UPDATE' && newRecord) {
	//     // Update existing call
	//     const updatedCall = newRecord as Call;
	//     const index = calls.findIndex(call => call.id === updatedCall.id);
	//     if (index !== -1) {
	//       calls[index] = updatedCall;
	//       console.log('🔄 Updated call in UI:', updatedCall.token_symbol);
	//     }
	//   } else if (eventType === 'DELETE' && oldRecord) {
	//     // Remove deleted call
	//     const deletedCall = oldRecord as Call;
	//     calls = calls.filter(call => call.id !== deletedCall.id);
	//     console.log('🗑️ Removed call from UI:', deletedCall.token_symbol);
	//   }
	// }

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

	function formatMarketCap(value: number | string | null | undefined): string {
		// Handle edge cases and convert to number if needed
		if (value === null || value === undefined || value === '' || value === 0) return '-';

		const numValue = typeof value === 'string' ? parseFloat(value) : value;

		// Check if we have a valid number after conversion
		if (isNaN(numValue) || !isFinite(numValue)) return '-';

		if (numValue >= 1000000) {
			return `$${(numValue / 1000000).toFixed(2)}M`;
		} else if (numValue >= 1000) {
			return `$${(numValue / 1000).toFixed(0)}K`;
		}
		return `$${numValue.toFixed(0)}`;
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
			return { text: '-', colorClass: 'text-gray-400' };
		}
		
		const absChange = Math.abs(change);
		const sign = change > 0 ? '+' : '';
		const text = `${sign}${absChange.toFixed(2)}%`;
		const colorClass = change > 0 ? 'text-green-400' : 'text-red-400';
		
		return { text, colorClass };
	}

	function formatValueComparison(entryValue: number | null, currentValue: number | null, deltaPercent: number | null) {
		const entryText = entryValue ? formatMarketCap(entryValue) : '-';
		const currentText = currentValue ? formatMarketCap(currentValue) : '-';
		
		let deltaText = '-';
		let deltaColorClass = 'text-gray-400';
		
		if (deltaPercent !== null && deltaPercent !== 0) {
			const sign = deltaPercent > 0 ? '+' : '';
			deltaText = `${sign}${deltaPercent.toFixed(2)}%`;
			deltaColorClass = deltaPercent > 0 ? 'text-green-400' : 'text-red-400';
		}
		
		return {
			entryText,
			currentText,
			deltaText,
			deltaColorClass
		};
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


	function handleSort(field: string) {
		if (sortField === field) {
			// Toggle direction if same field
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// New field, default to desc for most fields, asc for text fields
			sortField = field;
			sortDirection = field === 'tokenSymbol' ? 'asc' : 'desc';
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
			<h2 class="text-2xl font-bold" style="color: var(--sqdgn-text);">Trading Calls</h2>
			<p style="color: var(--sqdgn-text-muted);">All parsed trading signals from the SQDGN channel</p>
		</div>
		<div class="flex flex-col items-end gap-2">
			<div class="text-xs" style="color: var(--sqdgn-text-muted);">
				Last price refresh: {lastPriceRefresh ? getTimeSince(lastPriceRefresh) : 'Loading...'}
			</div>
			<button
				on:click={() => {
					filterToken = '';
					filterCallType = '';
					filterLabel = '';
					handleFilterChange();
				}}
				class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors"
				style="color: var(--sqdgn-text); background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);"
				onmouseover="this.style.backgroundColor='var(--sqdgn-border)'"
				onmouseout="this.style.backgroundColor='var(--sqdgn-surface)'"
				onkeydown="/* handle enter key */"
				role="button"
				tabindex="0"
			>
				Clear Filters
			</button>
		</div>
	</div>


	<!-- Calls Table -->
	<div class="rounded-lg shadow-sm overflow-hidden" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
		<!-- Debug info -->
		<div class="px-4 py-2 bg-gray-100 text-xs text-gray-700 border-b">
			Debug: calls.length = {calls.length}, loading = {loading}, error = {error || 'null'}
			<button on:click={() => loadCalls(true)} class="ml-4 px-2 py-1 bg-blue-500 text-white text-xs rounded">
				Manual Reload
			</button>
		</div>

		{#if loading && calls.length === 0}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--sqdgn-accent);"></div>
			</div>
		{:else if error}
			<div class="rounded-md p-4 m-6" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
				<p class="text-red-400">Error: {error}</p>
			</div>
		{:else if calls.length === 0}
			<div class="text-center py-12">
				<p style="color: var(--sqdgn-text-muted);">No calls found matching your criteria</p>
			</div>
		{:else}
			<div class="w-full">
				<table class="w-full table-fixed" style="border-collapse: separate; border-spacing: 0;">
					<thead style="background-color: var(--sqdgn-border);">
						<tr>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider w-20" style="color: var(--sqdgn-text-muted);">
								<div class="space-y-0.5">
									<div>
										<button 
											on:click={() => handleSort('tokenSymbol')} 
											class="flex items-center space-x-1 hover:text-gray-700 focus:outline-none text-xs"
										>
											<span>Token</span>
											<span class="text-xs">{getSortIcon('tokenSymbol')}</span>
										</button>
									</div>
									<input
										type="text"
										placeholder="Filter..."
										bind:value={filterToken}
										on:input={handleFilterChange}
										class="w-full px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
								</div>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider w-24" style="color: var(--sqdgn-text-muted);">
								<div class="space-y-0.5">
									<div class="text-xs">Type</div>
									<select
										bind:value={filterCallType}
										on:change={handleFilterChange}
										class="w-full px-1 py-0.5 text-xs rounded focus:outline-none focus:ring-1"
										style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border); color: var(--sqdgn-text);"
										onmouseover="this.style.borderColor='var(--sqdgn-accent)'"
										onmouseout="this.style.borderColor='var(--sqdgn-border)'"
									>
										<option value="">All</option>
										<option value="market_activity">Market</option>
										<option value="transaction_spotted">Transaction</option>
										<option value="large_trade">Large Trade</option>
										<option value="wallet_activity">Wallet</option>
										<option value="significant_transaction">Significant</option>
										<option value="wallet_signal">Signal</option>
										<option value="smart_money">Smart Money</option>
										<option value="onchain_signal">On-chain</option>
									</select>
								</div>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider w-20" style="color: var(--sqdgn-text-muted);">
								<div class="space-y-0.5">
									<div class="text-xs">Label</div>
									<select
										bind:value={filterLabel}
										on:change={handleFilterChange}
										class="w-full px-1 py-0.5 text-xs rounded focus:outline-none focus:ring-1"
										style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border); color: var(--sqdgn-text);"
										onmouseover="this.style.borderColor='var(--sqdgn-accent)'"
										onmouseout="this.style.borderColor='var(--sqdgn-border)'"
									>
										<option value="">All</option>
										<option value="NEWBORN">New</option>
										<option value="ESTABLISHED">Est.</option>
										<option value="VETERAN">Vet.</option>
										<option value="MATURING">Mat.</option>
									</select>
								</div>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider w-28" style="color: var(--sqdgn-text-muted);">
								<div class="text-xs">Channel</div>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider w-24" style="color: var(--sqdgn-text-muted);">
								<button
									on:click={() => handleSort('messageTimestamp')}
									class="flex items-center space-x-1 hover:text-gray-700 focus:outline-none text-xs"
								>
									<span>Time</span>
									<span class="text-xs">{getSortIcon('messageTimestamp')}</span>
								</button>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider flex-1" style="color: var(--sqdgn-text-muted);">
								<div class="text-xs">Price (MC)</div>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider flex-1" style="color: var(--sqdgn-text-muted);">
								<div class="text-xs">Liquidity</div>
							</th>
							<th class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider flex-1" style="color: var(--sqdgn-text-muted);">
								<div class="text-xs">Volume</div>
							</th>
						</tr>
					</thead>
					<tbody style="background-color: var(--sqdgn-surface);">
						{#each calls as call}
							<!-- Simplified rendering for debugging -->
							<tr class="transition-colors" style="border-bottom: 1px solid var(--sqdgn-border);">
								<td class="px-2 py-2 truncate">
									<span class="text-sm font-medium" style="color: var(--sqdgn-text);">
										{call.tokenSymbol || 'Unknown'}
									</span>
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									{call.callType || 'N/A'}
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									{call.sqdgnLabel || 'N/A'}
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									SQDGN
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									{getTimeAgo(call.messageTimestamp || call.createdAt)}
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									{formatMarketCap(call.marketCap)}
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									{formatMarketCap(call.liquidity)}
								</td>
								<td class="px-2 py-2 text-xs" style="color: var(--sqdgn-text);">
									{formatMarketCap(call.volume24h)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if hasMore}
				<div class="px-6 py-4 text-center" style="border-top: 1px solid var(--sqdgn-border);">
					<button
						on:click={() => loadCalls()}
						disabled={loading}
						class="px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						style="background-color: var(--sqdgn-accent);"
						onmouseover="if (!this.disabled) this.style.backgroundColor='var(--sqdgn-hover)'"
						onmouseout="if (!this.disabled) this.style.backgroundColor='var(--sqdgn-accent)'"
					>
						{loading ? 'Loading...' : 'Load More'}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>