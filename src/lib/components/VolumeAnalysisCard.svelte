<script lang="ts">
	export let volumeData: Array<{
		token_address: string;
		symbol?: string;
		volume_24h: number;
		avg_volume_5m: number;
		peak_volume_5m: number;
		total_transactions: number;
		buy_sell_ratio: number;
	}> = [];

	function formatVolume(volume: number): string {
		if (volume >= 1000000) {
			return `$${(volume / 1000000).toFixed(1)}M`;
		} else if (volume >= 1000) {
			return `$${(volume / 1000).toFixed(1)}K`;
		}
		return `$${volume.toFixed(0)}`;
	}

	function formatRatio(ratio: number): string {
		return `${(ratio * 100).toFixed(0)}% Buy`;
	}

	function getRatioColor(ratio: number): string {
		if (ratio > 0.6) return 'text-green-600';
		if (ratio < 0.4) return 'text-red-600';
		return 'text-yellow-600';
	}
</script>

<div class="bg-white rounded-lg shadow-sm border p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-medium text-gray-900">Volume Analysis</h3>
		<div class="text-sm text-gray-500">
			Top {volumeData.length} tokens by 24h volume
		</div>
	</div>

	<div class="space-y-3">
		{#each volumeData.slice(0, 10) as token}
			<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
				<div class="flex-1">
					<div class="flex items-center space-x-2">
						<span class="font-medium text-gray-900">
							{token.symbol || `${token.token_address.substring(0, 8)}...`}
						</span>
						<div class="flex items-center space-x-2 text-sm text-gray-500">
							<span>{token.total_transactions} txns</span>
							<span class="text-gray-300">•</span>
							<span class="{getRatioColor(token.buy_sell_ratio)}">{formatRatio(token.buy_sell_ratio)}</span>
						</div>
					</div>
					<div class="text-sm text-gray-600 mt-1">
						Peak 5m: {formatVolume(token.peak_volume_5m)} • Avg 5m: {formatVolume(token.avg_volume_5m)}
					</div>
				</div>
				<div class="text-right">
					<div class="font-medium text-gray-900">{formatVolume(token.volume_24h)}</div>
					<div class="text-sm text-gray-500">24h volume</div>
				</div>
			</div>
		{/each}

		{#if volumeData.length === 0}
			<div class="text-center py-8 text-gray-500">
				<svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
				</svg>
				<p class="mt-2">No volume data available</p>
			</div>
		{/if}
	</div>
</div>