<script lang="ts">
	export let gainers: Array<{
		token_address: string;
		symbol?: string;
		price_change_24h: number;
		volume_24h: number;
		current_price: number;
	}> = [];
	
	export let losers: Array<{
		token_address: string;
		symbol?: string;
		price_change_24h: number;
		volume_24h: number;
		current_price: number;
	}> = [];

	let activeTab: 'gainers' | 'losers' = 'gainers';

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

	function formatPercentage(pct: number): string {
		return `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`;
	}

	function getPercentageColor(pct: number): string {
		return pct > 0 ? 'text-green-600' : 'text-red-600';
	}
</script>

<div class="bg-white rounded-lg shadow-sm border p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-medium text-gray-900">Top Movers (24h)</h3>
		
		<!-- Tab Navigation -->
		<div class="flex space-x-1 bg-gray-100 p-1 rounded-md">
			<button
				class="px-3 py-1 text-sm font-medium rounded transition-colors {activeTab === 'gainers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}"
				on:click={() => activeTab = 'gainers'}
			>
				Gainers ({gainers.length})
			</button>
			<button
				class="px-3 py-1 text-sm font-medium rounded transition-colors {activeTab === 'losers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}"
				on:click={() => activeTab = 'losers'}
			>
				Losers ({losers.length})
			</button>
		</div>
	</div>

	<div class="space-y-3">
		{#if activeTab === 'gainers'}
			{#each gainers.slice(0, 8) as token}
				<div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
					<div class="flex-1">
						<div class="font-medium text-gray-900">
							{token.symbol || `${token.token_address.substring(0, 8)}...`}
						</div>
						<div class="text-sm text-gray-600">
							{formatPrice(token.current_price)} • Vol: {formatVolume(token.volume_24h)}
						</div>
					</div>
					<div class="text-right">
						<div class="font-medium {getPercentageColor(token.price_change_24h)}">
							{formatPercentage(token.price_change_24h)}
						</div>
						<div class="text-xs text-gray-500">24h change</div>
					</div>
				</div>
			{/each}

			{#if gainers.length === 0}
				<div class="text-center py-8 text-gray-500">
					<div class="text-2xl mb-2">📈</div>
					<p>No gainers found in the selected timeframe</p>
				</div>
			{/if}
		{:else}
			{#each losers.slice(0, 8) as token}
				<div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
					<div class="flex-1">
						<div class="font-medium text-gray-900">
							{token.symbol || `${token.token_address.substring(0, 8)}...`}
						</div>
						<div class="text-sm text-gray-600">
							{formatPrice(token.current_price)} • Vol: {formatVolume(token.volume_24h)}
						</div>
					</div>
					<div class="text-right">
						<div class="font-medium {getPercentageColor(token.price_change_24h)}">
							{formatPercentage(token.price_change_24h)}
						</div>
						<div class="text-xs text-gray-500">24h change</div>
					</div>
				</div>
			{/each}

			{#if losers.length === 0}
				<div class="text-center py-8 text-gray-500">
					<div class="text-2xl mb-2">📉</div>
					<p>No significant losers found in the selected timeframe</p>
				</div>
			{/if}
		{/if}
	</div>
</div>