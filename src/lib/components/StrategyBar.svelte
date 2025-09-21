<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TrailingStopSimulationRequest } from '$lib/types';

	export let configuration: TrailingStopSimulationRequest;
	export let isLoading = false;

	const dispatch = createEventDispatcher<{
		change: TrailingStopSimulationRequest;
		apply: TrailingStopSimulationRequest;
	}>();

	// Bag size options
	const bagSizeOptions = [20, 50, 100];

	// Trailing stop preset options - all necessary variables are defined
	const trailingStopPresets = [5, 10, 15, 20]; // Common trailing stop percentages


	// Date preset options
	const datePresets = [
		{ label: '1d', days: 1 },
		{ label: '2d', days: 2 },
		{ label: '7d', days: 7 },
		{ label: '30d', days: 30 }
	];

	// Reactive variables for bag size
	let bagSize = 50;
	let trailingStopPercentage = 15; // Percentage (0-50)
	let takeProfitSlider = 0; // 0-20 (0 = Off, 1-20 = multiplier)
	let selectedDatePreset: number | null = null;

	// Investment amount is just the bag size per call
	$: investmentPerCall = bagSize;

	// Update configuration when values change
	$: {
		configuration.simulation.trailingStopPercentages = [trailingStopPercentage / 100];
		configuration.simulation.investmentAmount = investmentPerCall;
		configuration.simulation.takeProfitMultiplier = takeProfitSlider > 0 ? takeProfitSlider : undefined;
		updateConfiguration();
	}

	function updateConfiguration() {
		dispatch('change', configuration);
	}

	function applyStrategy() {
		dispatch('apply', configuration);
	}

	function setDatePreset(days: number) {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(endDate.getDate() - days);

		configuration.filters.startDate = startDate.toISOString().split('T')[0];
		configuration.filters.endDate = endDate.toISOString().split('T')[0];
		selectedDatePreset = days;
		updateConfiguration();
	}

	function setBagSize(size: number) {
		bagSize = size;
	}

	function setTrailingStop(percentage: number) {
		trailingStopPercentage = percentage;
	}

	function setInvestmentAmount(amount: number) {
		bagSize = amount;
	}


</script>

<div class="strategy-bar rounded p-3 mb-6" style="background-color: var(--sqdgn-surface); border: 2px solid var(--sqdgn-accent);">
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-6">
			<!-- Trailing Stop Slider -->
			<div class="flex items-center space-x-3">
				<span class="text-sm font-medium" style="color: var(--sqdgn-text);">🎯 Stop Loss:</span>
				<div class="flex items-center space-x-2">
					<input
						type="range"
						min="0"
						max="50"
						step="1"
						bind:value={trailingStopPercentage}
						class="w-24 h-2 rounded-lg appearance-none cursor-pointer"
						style="background: linear-gradient(to right, var(--sqdgn-accent) 0%, var(--sqdgn-accent) {trailingStopPercentage * 2}%, var(--sqdgn-border) {trailingStopPercentage * 2}%, var(--sqdgn-border) 100%);"
						disabled={isLoading}
					/>
					<span class="text-xs font-medium w-8" style="color: var(--sqdgn-text);">{trailingStopPercentage}%</span>
				</div>
			</div>

			<!-- Bag Size -->
			<div class="flex items-center space-x-2">
				<span class="text-sm font-medium" style="color: var(--sqdgn-text);">💰 Bag:</span>
				<div class="flex space-x-1">
					{#each bagSizeOptions as size}
						<button
							on:click={() => setBagSize(size)}
							class="px-2 py-1 rounded text-xs border transition-colors"
							class:active={bagSize === size}
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {bagSize === size ? 'var(--sqdgn-accent)' : 'transparent'};"
							disabled={isLoading}
						>
							${size}
						</button>
					{/each}
				</div>
			</div>


			<!-- Investment Per Call Display -->
			<div class="flex items-center space-x-2">
				<span class="text-sm font-medium" style="color: var(--sqdgn-text);">💵 Per Call:</span>
				<span class="text-sm font-bold px-2 py-1 rounded" style="color: var(--sqdgn-text); background-color: var(--sqdgn-bg);">
					${investmentPerCall}
				</span>
			</div>

			<!-- Take Profit Slider -->
			<div class="flex items-center space-x-3">
				<span class="text-sm font-medium" style="color: var(--sqdgn-text);">🎯 Take Profit:</span>
				<div class="flex items-center space-x-2">
					<input
						type="range"
						min="0"
						max="20"
						step="1"
						bind:value={takeProfitSlider}
						class="w-24 h-2 rounded-lg appearance-none cursor-pointer"
						style="background: linear-gradient(to right, var(--sqdgn-accent) 0%, var(--sqdgn-accent) {takeProfitSlider * 5}%, var(--sqdgn-border) {takeProfitSlider * 5}%, var(--sqdgn-border) 100%);"
						disabled={isLoading}
					/>
					<span class="text-xs font-medium w-10" style="color: var(--sqdgn-text);">{takeProfitSlider === 0 ? 'Off' : takeProfitSlider + 'x'}</span>
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<span class="text-sm font-medium" style="color: var(--sqdgn-text);">📅</span>
				<div class="flex space-x-1">
					{#each datePresets as preset}
						<button
							on:click={() => setDatePreset(preset.days)}
							class="px-2 py-1 rounded text-xs border transition-colors"
							class:active={selectedDatePreset === preset.days}
							style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {selectedDatePreset === preset.days ? 'var(--sqdgn-accent)' : 'transparent'};"
							disabled={isLoading}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<button
			on:click={applyStrategy}
			class="px-4 py-1.5 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
			style="background-color: var(--sqdgn-accent);"
			disabled={isLoading}
		>
			{isLoading ? 'Analyzing...' : 'Apply Strategy'}
		</button>
	</div>
</div>

<style>
	.active {
		color: white !important;
	}

	/* Custom slider styling */
	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
	}

	/* Track styling */
	input[type="range"]::-webkit-slider-track {
		height: 8px;
		border-radius: 4px;
	}

	/* Thumb styling */
	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: var(--sqdgn-accent);
		border: 2px solid white;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	/* Firefox slider styling */
	input[type="range"]::-moz-range-track {
		height: 8px;
		border-radius: 4px;
		background: var(--sqdgn-border);
		border: none;
	}

	input[type="range"]::-moz-range-thumb {
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: var(--sqdgn-accent);
		border: 2px solid white;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
</style>