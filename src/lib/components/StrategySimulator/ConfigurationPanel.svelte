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

	
	// Date preset options
	const datePresets = [
		{ label: '1 Day', days: 1 },
		{ label: '2 Days', days: 2 },
		{ label: '7 Days', days: 7 },
		{ label: '30 Days', days: 30 }
	];

	// Convert decimal values to percentage display (0.15 -> "15")
	let customStopPercentages = configuration.simulation.trailingStopPercentages
		.map(val => (val * 100).toString())
		.join(', ');

	function updateConfiguration() {
		dispatch('change', configuration);
	}

	function updateTrailingStops() {
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
		updateConfiguration();
	}

	function setDatePreset(days: number) {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(endDate.getDate() - days);

		configuration.filters.startDate = startDate.toISOString().split('T')[0];
		configuration.filters.endDate = endDate.toISOString().split('T')[0];
		updateConfiguration();
	}


	function clearAllFilters() {
		configuration.filters = {
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

<div class="configuration-panel rounded p-2" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
	<div class="flex items-center justify-between mb-3">
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
				Clear
			</button>
		</div>
	</div>

	<!-- Compact Configuration Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
		<!-- Strategy Settings -->
		<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
			<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">📊 Trailing Stop %</h4>
			<input
				type="text"
				bind:value={customStopPercentages}
				placeholder="10, 15, 20, 25"
				class="w-full px-2 py-1.5 text-sm rounded border"
				style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
				on:change={() => updateTrailingStops()}
				disabled={isLoading}
			/>
		</div>

		<!-- Investment Amount -->
		<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
			<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">💰 Amount per Trade</h4>
			<div class="flex gap-2">
				<input
					type="number"
					step="100"
					bind:value={configuration.simulation.investmentAmount}
					placeholder="1000"
					class="flex-1 px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
				<button
					on:click={() => { configuration.simulation.investmentAmount = 1000; updateConfiguration(); }}
					class="px-2 py-1.5 text-xs rounded border transition-colors hover:bg-blue-500 hover:border-blue-500 hover:text-white"
					style="border-color: var(--sqdgn-border); color: var(--sqdgn-text-muted);"
					disabled={isLoading}
				>
					$1K
				</button>
			</div>
		</div>

		<!-- Take Profit -->
		<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
			<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">🎯 Take Profit</h4>
			<div class="flex gap-2">
				<input
					type="number"
					step="0.1"
					bind:value={configuration.simulation.takeProfitMultiplier}
					placeholder="2.0"
					class="flex-1 px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
				<button
					on:click={() => { configuration.simulation.takeProfitMultiplier = undefined; updateConfiguration(); }}
					class="px-2 py-1.5 text-xs rounded border transition-colors hover:bg-red-500 hover:border-red-500 hover:text-white"
					style="border-color: var(--sqdgn-border); color: var(--sqdgn-text-muted);"
					disabled={isLoading}
				>
					Off
				</button>
			</div>
		</div>

		<!-- Date Range -->
		<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
			<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">📅 Date Range</h4>
			<div class="flex gap-1">
				{#each datePresets as preset}
					<button
						on:click={() => setDatePreset(preset.days)}
						class="flex-1 px-2 py-1.5 text-xs rounded border transition-colors hover:bg-blue-500 hover:border-blue-500 hover:text-white"
						style="border-color: var(--sqdgn-border); color: var(--sqdgn-text);"
						disabled={isLoading}
					>
						{preset.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Market Cap Range -->
		<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
			<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">📊 Market Cap</h4>
			<div class="flex gap-2">
				<input
					type="number"
					bind:value={configuration.filters.marketCapMin}
					placeholder="Min"
					class="flex-1 px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
				<input
					type="number"
					bind:value={configuration.filters.marketCapMax}
					placeholder="Max"
					class="flex-1 px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
			</div>
		</div>

	</div>

	{#if showAdvanced}
		<!-- Advanced Filters -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
			<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
				<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">💧 Min Liquidity</h4>
				<input
					type="number"
					bind:value={configuration.filters.liquidityMin}
					placeholder="50000"
					class="w-full px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
			</div>

			<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
				<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">📈 Min Volume</h4>
				<input
					type="number"
					bind:value={configuration.filters.volumeMin}
					placeholder="10000"
					class="w-full px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
			</div>
		</div>
	{/if}

	{#if showAdvanced}
		<!-- Advanced Options -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
			<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
				<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">⏰ Max Hold Days</h4>
				<input
					type="number"
					bind:value={configuration.simulation.maxHoldDays}
					placeholder="30"
					class="w-full px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
			</div>

			<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
				<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">🚀 Slippage (bps)</h4>
				<input
					type="number"
					bind:value={configuration.simulation.slippage}
					placeholder="20"
					class="w-full px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
			</div>

			<div class="rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
				<h4 class="text-xs font-semibold mb-2" style="color: var(--sqdgn-text);">💳 Fees (bps)</h4>
				<input
					type="number"
					bind:value={configuration.simulation.fees}
					placeholder="10"
					class="w-full px-2 py-1.5 text-sm rounded border"
					style="border-color: var(--sqdgn-border); background-color: var(--sqdgn-surface); color: var(--sqdgn-text);"
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
			</div>
		</div>

		<!-- Include Details Toggle -->
		<div class="mt-3 rounded p-3" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
			<label class="flex items-center space-x-2 text-xs" style="color: var(--sqdgn-text);">
				<input
					type="checkbox"
					bind:checked={configuration.includeDetails}
					on:change={updateConfiguration}
					disabled={isLoading}
				/>
				<span>Include individual call details (slower)</span>
			</label>
		</div>
	{/if}

	<!-- Run Button (Bottom) -->
	<div class="mt-3 pt-3 border-t flex justify-end" style="border-color: var(--sqdgn-border);">
		<button
			on:click={() => dispatch('run')}
			class="px-4 py-2 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
			style="background-color: var(--sqdgn-accent);"
			disabled={isLoading}
		>
			{isLoading ? 'Running...' : 'Run Simulation'}
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