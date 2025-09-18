<script lang="ts">
	import { onMount } from 'svelte';
	import ConfigurationPanel from './ConfigurationPanel.svelte';
	import SimulationResults from './SimulationResults.svelte';
	import type { TrailingStopSimulationRequest, TrailingStopSimulationResponse } from '$lib/types';

	export let initialFilters: any = {};
	
	// Simulation state
	let isLoading = false;
	let error: string | null = null;
	let simulationData: TrailingStopSimulationResponse['data'] | null = null;
	
	// Configuration state
	let currentConfig: TrailingStopSimulationRequest = {
		filters: {
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
		},
		simulation: {
			trailingStopPercentages: [0.10, 0.15, 0.20, 0.25],
			takeProfitMultiplier: undefined,
			maxHoldDays: undefined,
			slippage: 20, // 0.2%
			fees: 10, // 0.1%
			investmentAmount: 1000 // $1000 per trade
		},
		includeDetails: true
	};

	// Panel visibility
	let showConfiguration = true;
	let showAdvancedFilters = false;

	async function runSimulation() {
		if (isLoading) return;

		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/analytics/trailing-stop-simulation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(currentConfig)
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result: TrailingStopSimulationResponse = await response.json();

			if (result.success && result.data) {
				simulationData = result.data;
			} else {
				error = result.error || 'Failed to run simulation';
			}
		} catch (err) {
			console.error('Simulation error:', err);
			error = err instanceof Error ? err.message : 'Failed to run simulation';
		} finally {
			isLoading = false;
		}
	}

	function resetConfiguration() {
		currentConfig = {
			filters: {
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
			},
			simulation: {
				trailingStopPercentages: [0.10, 0.15, 0.20, 0.25],
				takeProfitMultiplier: undefined,
				maxHoldDays: undefined,
				slippage: 20,
				fees: 10
			},
			includeDetails: false
		};
		simulationData = null;
		error = null;
	}

	function handleConfigurationChange(newConfig: TrailingStopSimulationRequest) {
		currentConfig = { ...newConfig };
	}

	// Apply initial filters on mount but don't auto-run simulation
	onMount(() => {
		if (initialFilters && Object.keys(initialFilters).length > 0) {
			currentConfig.filters = { ...currentConfig.filters, ...initialFilters };
		}
		// Removed auto-run simulation - user must click "Run Simulation" button
	});
</script>

<div class="strategy-simulator">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="text-xl font-bold" style="color: var(--sqdgn-text);">Strategy Simulator</h2>
			<p class="text-sm mt-1" style="color: var(--sqdgn-text-muted);">
				Simulate trailing stop loss exits using historical price data to optimize your trading strategy.
			</p>
		</div>
		
		<div class="flex items-center space-x-3">
			<!-- Configuration Toggle -->
			<button
				on:click={() => showConfiguration = !showConfiguration}
				class="px-3 py-1.5 rounded text-sm font-medium border transition-colors"
				style="border-color: var(--sqdgn-border); color: var(--sqdgn-text); background-color: {showConfiguration ? 'var(--sqdgn-accent)' : 'transparent'};"
			>
				{showConfiguration ? 'Hide' : 'Show'} Config
			</button>
			
			<!-- Reset Button -->
			<button
				on:click={resetConfiguration}
				class="px-3 py-1.5 rounded text-sm font-medium border transition-colors hover:bg-red-500 hover:border-red-500 hover:text-white"
				style="border-color: var(--sqdgn-border); color: var(--sqdgn-text);"
				disabled={isLoading}
			>
				Reset
			</button>
			
			<!-- Run Simulation Button -->
			<button
				on:click={runSimulation}
				class="px-4 py-1.5 rounded text-sm font-medium text-white transition-colors disabled:opacity-50"
				style="background-color: var(--sqdgn-accent);"
				disabled={isLoading}
			>
				{isLoading ? 'Running...' : 'Run Simulation'}
			</button>
		</div>
	</div>

	<!-- Configuration Panel -->
	{#if showConfiguration}
		<div class="mb-6">
			<ConfigurationPanel
				bind:configuration={currentConfig}
				bind:showAdvanced={showAdvancedFilters}
				{isLoading}
				on:change={({ detail }) => handleConfigurationChange(detail)}
				on:run={runSimulation}
			/>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex justify-center items-center py-12 rounded" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--sqdgn-accent);"></div>
			<span class="ml-3 text-sm" style="color: var(--sqdgn-text-muted);">Running simulation...</span>
		</div>
	{/if}

	<!-- Error State -->
	{#if error && !isLoading}
		<div class="rounded-lg p-4 mb-6" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
			<p class="text-red-400 text-sm">{error}</p>
			<button
				on:click={runSimulation}
				class="mt-2 px-3 py-1 rounded text-xs text-red-400 border border-red-400 hover:bg-red-400 hover:text-white transition-colors"
			>
				Retry
			</button>
		</div>
	{/if}

	<!-- Simulation Results -->
	{#if simulationData && !isLoading}
		<SimulationResults data={simulationData} />
	{/if}

	<!-- Empty State -->
	{#if !simulationData && !isLoading && !error}
		<div class="text-center py-12 rounded" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<div class="text-4xl mb-4">📊</div>
			<h3 class="text-lg font-semibold mb-2" style="color: var(--sqdgn-text);">No Simulation Data</h3>
			<p class="text-sm" style="color: var(--sqdgn-text-muted);">Configure your parameters and run a simulation to see results.</p>
		</div>
	{/if}
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

	.strategy-simulator {
		width: 100%;
		max-width: 100%;
	}
</style>