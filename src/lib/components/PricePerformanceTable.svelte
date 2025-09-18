<script lang="ts">
	export let performanceData: Array<{
		token_address: string;
		symbol?: string;
		// Initial call data
		call_created_at?: string;
		initial_price_usd?: number;
		initial_volume_24h?: number;
		initial_liquidity_usd?: number;
		initial_market_cap?: number;
		initial_txn_buys_5m?: number;
		initial_txn_sells_5m?: number;
		initial_snapshot_time?: string;
		// Current data
		current_price: number;
		current_volume_24h: number;
		current_liquidity_usd?: number;
		current_market_cap?: number;
		current_txn_buys_5m?: number;
		current_txn_sells_5m?: number;
		current_snapshot_time: string;
		// Comparisons
		price_change_since_call?: number;
		volume_change_since_call?: number;
		liquidity_change_since_call?: number;
		market_cap_change_since_call?: number;
		buy_sell_ratio_change?: number;
	}> = [];

	let sortField: string = 'call_created_at';
	let sortDirection: 'asc' | 'desc' = 'desc';

	$: sortedData = [...performanceData].sort((a, b) => {
		let aVal = a[sortField as keyof typeof a];
		let bVal = b[sortField as keyof typeof b];
		
		// Special handling for date fields
		if (sortField === 'call_created_at') {
			// Handle null/undefined dates - put them at the bottom
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1; // null values go to bottom
			if (bVal == null) return -1; // null values go to bottom
			
			// Convert to dates and compare
			const dateA = new Date(aVal as string);
			const dateB = new Date(bVal as string);
			return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
		}
		
		// Handle null/undefined values for other fields
		if (aVal == null) aVal = 0;
		if (bVal == null) bVal = 0;
		
		if (typeof aVal === 'string' && typeof bVal === 'string') {
			return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
		}
		
		const numA = Number(aVal);
		const numB = Number(bVal);
		return sortDirection === 'asc' ? numA - numB : numB - numA;
	});

	function handleSort(field: string) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'desc';
		}
	}

	function formatPrice(price: number): string {
		if (price >= 1) {
			return `$${price.toFixed(4)}`;
		}
		return `$${price.toFixed(8)}`;
	}

	function formatVolume(volume: number): string {
		if (volume >= 1000000) {
			return `$${(volume / 1000000).toFixed(1)}M`;
		} else if (volume >= 1000) {
			return `$${(volume / 1000).toFixed(1)}K`;
		}
		return `$${volume.toFixed(0)}`;
	}

	function formatMarketCap(cap?: number): string {
		if (!cap) return '-';
		if (cap >= 1000000000) {
			return `$${(cap / 1000000000).toFixed(1)}B`;
		} else if (cap >= 1000000) {
			return `$${(cap / 1000000).toFixed(1)}M`;
		} else if (cap >= 1000) {
			return `$${(cap / 1000).toFixed(1)}K`;
		}
		return `$${cap.toFixed(0)}`;
	}

	function formatPercentage(pct: number): string {
		return `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`;
	}

	function getPercentageColor(pct: number): string {
		return pct > 0 ? 'text-green-400' : pct < 0 ? 'text-red-400' : 'text-gray-400';
	}

	function formatTime(timeStr: string): string {
		const date = new Date(timeStr);
		return date.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: false 
		});
	}

	function getSortIcon(field: string): string {
		if (sortField !== field) return '↕️';
		return sortDirection === 'asc' ? '↑' : '↓';
	}


	function formatDateTime(dateStr?: string): { date: string; time: string } {
		if (!dateStr) return { date: '-', time: '-' };
		const date = new Date(dateStr);
		return {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
		};
	}

	function formatLastUpdated(dateStr?: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		
		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
		return date.toLocaleDateString();
	}

	// Get the most recent update time from the performance data
	$: mostRecentUpdate = performanceData.length > 0 
		? performanceData.reduce((latest, token) => 
			!latest || (token.current_snapshot_time && new Date(token.current_snapshot_time) > new Date(latest))
				? token.current_snapshot_time 
				: latest
		, null as string | null)
		: null;
</script>

<div class="rounded shadow-sm p-3" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
	<div class="flex items-center justify-between mb-2">
		<div>
			<h3 class="text-sm font-medium" style="color: var(--sqdgn-text);">Price Performance</h3>
			{#if mostRecentUpdate}
				<div class="text-xs mt-0.5" style="color: var(--sqdgn-text-muted);">
					Last updated: {formatLastUpdated(mostRecentUpdate)}
				</div>
			{/if}
		</div>
		<div class="text-right">
			<div class="text-xs" style="color: var(--sqdgn-text-muted);">
				{performanceData.length} tokens tracked
			</div>
			{#if mostRecentUpdate}
				<div class="text-xs mt-0.5" style="color: var(--sqdgn-text-muted); opacity: 0.7;">
					{formatDateTime(mostRecentUpdate).date} {formatDateTime(mostRecentUpdate).time}
				</div>
			{/if}
		</div>
	</div>

	{#if sortedData.length > 0}
		<div class="overflow-x-auto">
			<table class="min-w-full" style="border-collapse: separate; border-spacing: 0;">
				<thead style="background-color: var(--sqdgn-border);">
					<tr>
						<th scope="col" class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" style="color: var(--sqdgn-text-muted);" onmouseover="this.style.backgroundColor='var(--sqdgn-surface)'" onmouseout="this.style.backgroundColor='transparent'" on:click={() => handleSort('symbol')}>
							Token {getSortIcon('symbol')}
						</th>
						<th scope="col" class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" style="color: var(--sqdgn-text-muted);" onmouseover="this.style.backgroundColor='var(--sqdgn-surface)'" onmouseout="this.style.backgroundColor='transparent'" on:click={() => handleSort('call_created_at')}>
							Call Date {getSortIcon('call_created_at')}
						</th>
						<th scope="col" class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" style="color: var(--sqdgn-text-muted);" onmouseover="this.style.backgroundColor='var(--sqdgn-surface)'" onmouseout="this.style.backgroundColor='transparent'" on:click={() => handleSort('price_change_since_call')}>
							Price {getSortIcon('price_change_since_call')}
						</th>
						<th scope="col" class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--sqdgn-text-muted);">
							Volume
						</th>
						<th scope="col" class="px-2 py-1 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--sqdgn-text-muted);">
							Liquidity
						</th>
					</tr>
				</thead>
				<tbody style="background-color: var(--sqdgn-surface);">
					{#each sortedData.slice(0, 20) as token}
						<tr class="transition-colors" style="border-bottom: 1px solid var(--sqdgn-border);" onmouseover="this.style.backgroundColor='rgba(77, 101, 255, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
							<!-- Token -->
							<td class="px-2 py-2 whitespace-nowrap">
								<div class="text-sm font-medium" style="color: var(--sqdgn-text);">
									{token.symbol || `${token.token_address.substring(0, 8)}...`}
								</div>
								{#if token.symbol}
									<div class="text-xs font-mono" style="color: var(--sqdgn-text-muted);">
										{token.token_address.substring(0, 12)}...
									</div>
								{/if}
							</td>
							
							<!-- Call Date -->
							<td class="px-2 py-2 whitespace-nowrap text-xs" style="color: var(--sqdgn-text);">
								{#if token.call_created_at}
									{@const callDate = formatDateTime(token.call_created_at)}
									<div class="font-medium">{callDate.date}</div>
									<div class="text-xs" style="color: var(--sqdgn-text-muted);">{callDate.time}</div>
								{:else}
									<span style="color: var(--sqdgn-text-muted); opacity: 0.5;">-</span>
								{/if}
							</td>
							
							<!-- Price & ROI -->
							<td class="px-2 py-2 whitespace-nowrap text-xs">
								<div class="space-y-1">
									<div class="flex items-center justify-between">
										<span class="text-xs" style="color: var(--sqdgn-text-muted);">Entry:</span>
										<span class="font-mono" style="color: var(--sqdgn-text);">
											{token.initial_price_usd ? formatPrice(token.initial_price_usd) : '-'}
										</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-xs" style="color: var(--sqdgn-text-muted);">Mark:</span>
										<span class="font-mono font-medium" style="color: var(--sqdgn-text);">
											{formatPrice(token.current_price)}
										</span>
									</div>
									{#if token.price_change_since_call !== null && token.price_change_since_call !== undefined}
										<div class="flex items-center justify-between mt-1">
											<span class="text-xs" style="color: var(--sqdgn-text-muted);">ROI:</span>
											<span class="font-bold {getPercentageColor(token.price_change_since_call)}">
												{formatPercentage(token.price_change_since_call)}
												{#if token.price_change_since_call > 0}
													📈
												{:else if token.price_change_since_call < 0}
													📉
												{/if}
											</span>
										</div>
									{/if}
								</div>
							</td>
							
							<!-- Volume Comparison -->
							<td class="px-2 py-2 whitespace-nowrap text-xs">
								<div class="space-y-1">
									<div class="flex items-center justify-between">
										<span class="text-xs" style="color: var(--sqdgn-text-muted);">Entry:</span>
										<span style="color: var(--sqdgn-text);">
											{token.initial_volume_24h ? formatVolume(token.initial_volume_24h) : '-'}
										</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-xs" style="color: var(--sqdgn-text-muted);">Mark:</span>
										<span class="font-medium" style="color: var(--sqdgn-text);">
											{formatVolume(token.current_volume_24h)}
										</span>
									</div>
								</div>
							</td>
							
							<!-- Liquidity Comparison -->
							<td class="px-2 py-2 whitespace-nowrap text-xs">
								<div class="space-y-1">
									<div class="flex items-center justify-between">
										<span class="text-xs" style="color: var(--sqdgn-text-muted);">Entry:</span>
										<span style="color: var(--sqdgn-text);">
											{token.initial_liquidity_usd ? formatVolume(token.initial_liquidity_usd) : '-'}
										</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-xs" style="color: var(--sqdgn-text-muted);">Mark:</span>
										<span class="font-medium" style="color: var(--sqdgn-text);">
											{token.current_liquidity_usd ? formatVolume(token.current_liquidity_usd) : '-'}
										</span>
									</div>
									{#if token.liquidity_change_since_call !== null && token.liquidity_change_since_call !== undefined}
										<div class="text-xs {getPercentageColor(token.liquidity_change_since_call)} text-center">
											{formatPercentage(token.liquidity_change_since_call)}
										</div>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="text-center py-4" style="color: var(--sqdgn-text-muted);">
			<svg class="mx-auto h-8 w-8" fill="none" stroke="var(--sqdgn-text-muted)" viewBox="0 0 24 24" style="opacity: 0.5;">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
			</svg>
			<p class="mt-1 text-xs">No performance data available</p>
		</div>
	{/if}
</div>