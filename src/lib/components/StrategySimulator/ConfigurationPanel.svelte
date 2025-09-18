<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TrailingStopSimulationRequest } from '$lib/types';

	export let configuration: TrailingStopSimulationRequest;
	export let showAdvanced = false;
	export let isLoading = false;

	const dispatch = createEventDispatcher<{
		change: TrailingStopSimulationRequest;
		run: void;
	}>();

	// Available options
	const availableCallTypes = ['BUY', 'SELL', 'LONG', 'SHORT'];
	const availableLabels = ['STARTER', 'ZONE', 'MIDCAP', 'LOWCAP', 'DEGENHOUR', 'MOONSHOT', 'NO_LABEL'];
	
	// Preset trailing stop percentages
	const trailingStopPresets = [
		{ label: 'Conservative', values: [0.20, 0.25, 0.30] },
		{ label: 'Moderate', values: [0.10, 0.15, 0.20] },
		{ label: 'Aggressive', values: [0.05, 0.08, 0.10] },
		{ label: 'Ultra Aggressive', values: [0.01, 0.02, 0.03] },
		{ label: 'Custom Range', values: [0.05, 0.10, 0.15, 0.20] }
	];

	// Convert decimal values to percentage display (0.15 -> "15")
	let customStopPercentages = configuration.simulation.trailingStopPercentages
		.map(val => (val * 100).toString())
		.join(', ');

	function updateConfiguration() {
		dispatch('change', configuration);
	}

	function updateTrailingStops(preset: number[] | null = null) {
		if (preset) {
			configuration.simulation.trailingStopPercentages = [...preset];
			// Convert preset decimals to percentage display for consistency
			customStopPercentages = preset.map(val => (val * 100).toString()).join(', ');
		} else {
			// Parse custom input (expecting percentage format like "10, 15, 20")
			try {
				const parsed = customStopPercentages
					.split(',')
					.map(s => {
						const val = parseFloat(s.trim());
						// Handle both percentage (10) and decimal (0.1) input formats
						return val > 1 ? val / 100 : val;
					})
					.filter(n => !isNaN(n) && n > 0 && n < 1);

				if (parsed.length > 0) {
					configuration.simulation.trailingStopPercentages = parsed;
				}
			} catch (e) {
				console.warn('Invalid trailing stop percentages:', e);
			}
		}
		updateConfiguration();
	}

	function toggleCallType(callType: string) {
		if (!configuration.filters) configuration.filters = {};
		if (!configuration.filters.callTypes) configuration.filters.callTypes = [];
		
		const index = configuration.filters.callTypes.indexOf(callType);
		if (index > -1) {
			configuration.filters.callTypes.splice(index, 1);
		} else {
			configuration.filters.callTypes.push(callType);
		}
		updateConfiguration();
	}

	function toggleLabel(label: string) {
		if (!configuration.filters) configuration.filters = {};
		if (!configuration.filters.labels) configuration.filters.labels = [];
		
		const index = configuration.filters.labels.indexOf(label);
		if (index > -1) {
			configuration.filters.labels.splice(index, 1);
		} else {
			configuration.filters.labels.push(label);
		}
		updateConfiguration();
	}

	function clearAllFilters() {
		configuration.filters = {
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
		};
		updateConfiguration();
	}
</script>

<div class="configuration-panel rounded p-4" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-sm font-semibold" style="color: var(--sqdgn-text);">Configuration</h3>
		<div class="flex items-center space-x-2">
			<button
				on:click={() => showAdvanced = !showAdvanced}
				class="text-xs px-2 py-1 rounded border transition-colors"
				style="border-color: var(--sqdgn-border); color: var(--sqdgn-text-muted);"
			>
				{showAdvanced ? 'Basic' : 'Advanced'}
			</button>
			<button
				on:click={clearAllFilters}
				class="text-xs px-2 py-1 rounded border transition-colors hover:bg-red-500 hover:border-red-500 hover:text-white"
				style="border-color: var(--sqdgn-border); color: var(--sqdgn-text-muted);"
				disabled={isLoading}
			>
				Clear Filters
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Left Column: Filters -->
		<div class="space-y-4">
			<h4 class="text-xs font-medium text-uppercase tracking-wide" style="color: var(--sqdgn-text-muted);">Filters</h4>
			
			<!-- Call Types -->
			<div>
				<label class="block text-xs font-medium mb-2" style="color: var(--sqdgn-text);">Call Types</label>
				<div class="flex flex-wrap gap-2">
					{#each availableCallTypes as callType}
						<button
							on:click={() => toggleCallType(callType)}
							class="px-2 py-1 rounded text-xs font-medium border transition-colors"
							class:selected={configuration.filters?.callTypes?.includes(callType)}
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {configuration.filters?.callTypes?.includes(callType) ? 'var(--sqdgn-accent)' : 'transparent'};"
							disabled={isLoading}
						>
							{callType}
						</button>
					{/each}
				</div>
			</div>

			<!-- SQDGN Labels -->
			<div>
				<label class="block text-xs font-medium mb-2" style="color: var(--sqdgn-text);">SQDGN Labels</label>
				<div class="flex flex-wrap gap-2">
					{#each availableLabels as label}
						<button
							on:click={() => toggleLabel(label)}
							class="px-2 py-1 rounded text-xs font-medium border transition-colors"
							class:selected={configuration.filters?.labels?.includes(label)}
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {configuration.filters?.labels?.includes(label) ? 'var(--sqdgn-accent)' : 'transparent'};"
							disabled={isLoading}
						>
							{label === 'NO_LABEL' ? 'No Label' : label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Market Cap Range -->
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Min Market Cap</label>
					<input
						type="number"
						bind:value={configuration.filters.marketCapMin}
						placeholder="0"
						class="w-full px-2 py-1 text-xs rounded border"
						style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
						on:change={updateConfiguration}
						disabled={isLoading}
					/>
				</div>
				<div>
					<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Max Market Cap</label>
					<input
						type="number"
						bind:value={configuration.filters.marketCapMax}
						placeholder="10000000"
						class="w-full px-2 py-1 text-xs rounded border"
						style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
						on:change={updateConfiguration}
						disabled={isLoading}
					/>
				</div>
			</div>

			{#if showAdvanced}
				<!-- Advanced Filters -->
				<div class="pt-2 border-t" style="border-color: var(--sqdgn-border);">
					<div class="grid grid-cols-2 gap-2 mb-3">
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Min Liquidity ($)</label>
							<input
								type="number"
								bind:value={configuration.filters.liquidityMin}
								placeholder="50000"
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
						</div>
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Min 24h Volume ($)</label>
							<input
								type="number"
								bind:value={configuration.filters.volumeMin}
								placeholder="10000"
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Start Date</label>
							<input
								type="date"
								bind:value={configuration.filters.startDate}
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
						</div>
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">End Date</label>
							<input
								type="date"
								bind:value={configuration.filters.endDate}
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Right Column: Strategy Parameters -->
		<div class="space-y-4">
			<h4 class="text-xs font-medium text-uppercase tracking-wide" style="color: var(--sqdgn-text-muted);">Strategy Parameters</h4>
			
			<!-- Trailing Stop Presets -->
			<div>
				<label class="block text-xs font-medium mb-2" style="color: var(--sqdgn-text);">Trailing Stop Presets</label>
				<div class="flex flex-wrap gap-2 mb-2">
					{#each trailingStopPresets as preset}
						<button
							on:click={() => updateTrailingStops(preset.values)}
							class="px-2 py-1 rounded text-xs font-medium border transition-colors hover:bg-blue-500 hover:border-blue-500 hover:text-white"
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text);"
							disabled={isLoading}
						>
							{preset.label}
						</button>
					{/each}
				</div>
				<div>
					<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Custom Percentages (comma separated)</label>
					<input
						type="text"
						bind:value={customStopPercentages}
						placeholder="10, 15, 20, 25"
						class="w-full px-2 py-1 text-xs rounded border"
						style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
						on:change={() => updateTrailingStops()}
						disabled={isLoading}
					/>
					<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">Example: 10, 15, 20, 25 (for 10%, 15%, 20%, 25%)</p>
				</div>
			</div>

			<!-- Take Profit Setting -->
			<div class="mt-4">
				<label class="block text-xs font-medium mb-2" style="color: var(--sqdgn-text);">Take Profit Target</label>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Multiplier (x)</label>
						<input
							type="number"
							step="0.1"
							bind:value={configuration.simulation.takeProfitMultiplier}
							placeholder="2.0"
							class="w-full px-2 py-1 text-xs rounded border"
							style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
							on:change={updateConfiguration}
							disabled={isLoading}
						/>
						<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">Exit at 2x = 100% gain</p>
					</div>
					<div class="flex items-end">
						<button
							on:click={() => { configuration.simulation.takeProfitMultiplier = undefined; updateConfiguration(); }}
							class="px-3 py-1 text-xs rounded border transition-colors hover:bg-red-500 hover:border-red-500 hover:text-white"
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text-muted);"
							disabled={isLoading}
						>
							Disable TP
						</button>
					</div>
				</div>
			</div>

			<!-- Investment Amount -->
			<div class="mt-4">
				<label class="block text-xs font-medium mb-2" style="color: var(--sqdgn-text);">Investment Amount</label>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Amount per Trade ($)</label>
						<input
							type="number"
							step="100"
							bind:value={configuration.simulation.investmentAmount}
							placeholder="1000"
							class="w-full px-2 py-1 text-xs rounded border"
							style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
							on:change={updateConfiguration}
							disabled={isLoading}
						/>
						<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">Dollar amount invested per trade</p>
					</div>
					<div class="flex items-end">
						<button
							on:click={() => { configuration.simulation.investmentAmount = 1000; updateConfiguration(); }}
							class="px-3 py-1 text-xs rounded border transition-colors hover:bg-blue-500 hover:border-blue-500 hover:text-white"
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text-muted);"
							disabled={isLoading}
						>
							Reset $1K
						</button>
					</div>
				</div>
			</div>

			{#if showAdvanced}
				<!-- Advanced Strategy Parameters -->
				<div class="pt-2 border-t" style="border-color: var(--sqdgn-border);">
					<div class="grid grid-cols-2 gap-2 mb-3">
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Max Hold Days</label>
							<input
								type="number"
								bind:value={configuration.simulation.maxHoldDays}
								placeholder="30"
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
							<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">Force exit after X days</p>
						</div>
						<div>
							<!-- Empty div for grid layout -->
						</div>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Slippage (bps)</label>
							<input
								type="number"
								bind:value={configuration.simulation.slippage}
								placeholder="20"
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
							<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">20 bps = 0.2%</p>
						</div>
						<div>
							<label class="block text-xs font-medium mb-1" style="color: var(--sqdgn-text);">Trading Fees (bps)</label>
							<input
								type="number"
								bind:value={configuration.simulation.fees}
								placeholder="10"
								class="w-full px-2 py-1 text-xs rounded border"
								style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-bg); color: var(--sqdgn-text);"
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
							<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">10 bps = 0.1%</p>
						</div>
					</div>

					<div class="mt-3">
						<label class="flex items-center space-x-2 text-xs" style="color: var(--sqdgn-text);">
							<input
								type="checkbox"
								bind:checked={configuration.includeDetails}
								on:change={updateConfiguration}
								disabled={isLoading}
							/>
							<span>Include individual call details</span>
						</label>
						<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">Shows detailed trade breakdown with entry/exit prices and P&L (slower)</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Run Button (Bottom) -->
	<div class="mt-4 pt-4 border-t flex justify-end" style="border-color: var(--sqdgn-border);">
		<button
			on:click={() => dispatch('run')}
			class="px-6 py-2 rounded font-medium text-white transition-colors disabled:opacity-50"
			style="background-color: var(--sqdgn-accent);"
			disabled={isLoading}
		>
			{isLoading ? 'Running Simulation...' : 'Run Simulation'}
		</button>
	</div>
</div>

<style>
	.selected {
		color: white !important;
	}
	
	input:focus {
		outline: none;
		border-color: var(--sqdgn-accent);
	}
	
	input[type="checkbox"] {
		accent-color: var(--sqdgn-accent);
	}
</style>