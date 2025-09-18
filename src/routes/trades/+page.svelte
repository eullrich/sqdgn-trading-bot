<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { supabase } from '$lib/stores/supabase';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	
	let walletAddress = '';
	let config = {
		is_auto_buy_enabled: false,
		default_buy_amount_sol: 0.1,
		max_position_size_sol: 1.0,
		default_slippage_bps: 100,
		max_slippage_bps: 500,
		trailing_stop_enabled: true,
		trailing_stop_percentage: 10.0
	};
	
	let loading = false;
	let saving = false;
	let error = '';
	let success = '';
	
	// Trading engine status
	let engineStatus = { isRunning: false, startedAt: null };
	let engineLoading = false;
	let engineError = '';
	
	// Trading activity
	let positions = [];
	let positionsLoading = false;
	
	// Real-time functionality
	let realtimeChannel: RealtimeChannel | null = null;
	let isRealtimeConnected = false;
	
	onMount(async () => {
		// Check if wallet is connected
		if (browser && window.solana && window.solana.isConnected) {
			walletAddress = window.solana.publicKey.toString();
			await loadConfig();
		}
		// Load engine status
		await loadEngineStatus();
		// Load recent positions if wallet connected
		if (walletAddress) {
			await loadRecentPositions();
			setupRealtimeSubscription();
		}
	});

	onDestroy(() => {
		if (realtimeChannel) {
			realtimeChannel.unsubscribe();
		}
	});
	
	async function loadConfig() {
		if (!walletAddress) return;
		
		try {
			loading = true;
			error = '';
			
			const response = await fetch(`/api/trading/config?wallet=${walletAddress}`);
			const result = await response.json();
			
			if (result.success && result.config) {
				config = { ...config, ...result.config };
			}
		} catch (err) {
			error = 'Failed to load configuration';
			console.error(err);
		} finally {
			loading = false;
		}
	}
	
	async function saveConfig() {
		if (!walletAddress) {
			error = 'Please connect your wallet first';
			return;
		}
		
		try {
			saving = true;
			error = '';
			success = '';
			
			const response = await fetch('/api/trading/config', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_wallet_address: walletAddress,
					...config
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				success = 'Configuration saved successfully!';
			} else {
				error = result.error || 'Failed to save configuration';
			}
		} catch (err) {
			error = 'Failed to save configuration';
			console.error(err);
		} finally {
			saving = false;
		}
	}
	
	async function connectWallet() {
		if (!browser) return;
		
		try {
			if (!window.solana) {
				window.open('https://phantom.app/', '_blank');
				return;
			}
			
			const response = await window.solana.connect();
			walletAddress = response.publicKey.toString();
			await loadConfig();
		} catch (err) {
			error = 'Failed to connect wallet';
			console.error(err);
		}
	}
	
	async function loadEngineStatus() {
		try {
			engineError = '';
			const response = await fetch('/api/trading/engine');
			const result = await response.json();
			
			if (result.success) {
				engineStatus = result.status;
			}
		} catch (err) {
			engineError = 'Failed to load engine status';
			console.error(err);
		}
	}
	
	async function toggleEngine() {
		if (engineLoading) return;
		
		try {
			engineLoading = true;
			engineError = '';
			
			const action = engineStatus.isRunning ? 'stop' : 'start';
			const response = await fetch('/api/trading/engine', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ action })
			});
			
			const result = await response.json();
			
			if (result.success) {
				engineStatus = result.status;
				success = result.message;
			} else {
				engineError = result.error || 'Failed to toggle engine';
			}
		} catch (err) {
			engineError = 'Network error occurred';
			console.error(err);
		} finally {
			engineLoading = false;
		}
	}
	
	async function loadRecentPositions() {
		if (!walletAddress) return;
		
		try {
			positionsLoading = true;
			const response = await fetch(`/api/trading/positions?wallet=${walletAddress}&status=all`);
			const result = await response.json();
			
			if (result.success) {
				positions = result.positions.slice(0, 5); // Show only recent 5
			}
		} catch (err) {
			console.error('Failed to load positions:', err);
		} finally {
			positionsLoading = false;
		}
	}

	function setupRealtimeSubscription() {
		if (!walletAddress) return;
		
		// Subscribe to trading positions for this wallet
		realtimeChannel = supabase
			.channel('trading-positions-changes')
			.on('postgres_changes', {
				event: '*',
				schema: 'public',
				table: 'trading_positions',
				filter: `user_wallet_address=eq.${walletAddress}`
			}, (payload) => {
				handlePositionUpdate(payload);
			})
			.on('postgres_changes', {
				event: '*',
				schema: 'public',
				table: 'auto_buy_queue',
				filter: `user_wallet_address=eq.${walletAddress}`
			}, (payload) => {
				handleQueueUpdate(payload);
			})
			.subscribe((status) => {
				isRealtimeConnected = status === 'SUBSCRIBED';
				if (status === 'SUBSCRIBED') {
					console.log('🔴 Trading real-time connected');
				}
			});
	}

	function handlePositionUpdate(payload: any) {
		console.log('🔄 Position update received:', payload);
		
		if (payload.eventType === 'INSERT') {
			// Add new position to the beginning of the list
			positions = [payload.new, ...positions.slice(0, 4)];
			success = `New position opened: ${payload.new.token_symbol}`;
			setTimeout(() => success = '', 3000);
		} else if (payload.eventType === 'UPDATE') {
			// Update existing position
			positions = positions.map(pos => 
				pos.id === payload.new.id ? payload.new : pos
			);
		} else if (payload.eventType === 'DELETE') {
			// Remove position from list
			positions = positions.filter(pos => pos.id !== payload.old.id);
		}
	}

	function handleQueueUpdate(payload: any) {
		console.log('📋 Queue update received:', payload);
		
		if (payload.eventType === 'INSERT') {
			console.log(`🎯 Auto-buy queued: ${payload.new.token_symbol} for ${payload.new.buy_amount_sol} SOL`);
			success = `Auto-buy queued: ${payload.new.token_symbol}`;
			setTimeout(() => success = '', 3000);
		} else if (payload.eventType === 'UPDATE') {
			if (payload.new.status === 'completed') {
				success = `Trade executed: ${payload.new.token_symbol}`;
				setTimeout(() => success = '', 3000);
				// Refresh positions to show new trade
				loadRecentPositions();
			} else if (payload.new.status === 'failed') {
				error = `Trade failed: ${payload.new.token_symbol} - ${payload.new.error_message}`;
				setTimeout(() => error = '', 5000);
			}
		}
	}
</script>

<svelte:head>
	<title>Trades - SQDGN Trading Bot</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2" style="color: var(--sqdgn-text);">Trades</h1>
		<p class="text-lg" style="color: var(--sqdgn-text-muted);">
			Configure your automated trading preferences
		</p>
	</div>

	{#if !walletAddress}
		<div class="rounded-xl p-8 text-center mb-8" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<svg class="w-16 h-16 mx-auto mb-4" style="color: var(--sqdgn-text-muted);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
			</svg>
			<h2 class="text-xl font-semibold mb-2" style="color: var(--sqdgn-text);">Connect Your Wallet</h2>
			<p class="mb-6" style="color: var(--sqdgn-text-muted);">
				Connect your Phantom wallet to configure trading settings
			</p>
			<button
				on:click={connectWallet}
				class="px-6 py-3 rounded-xl font-medium transition-all duration-200"
				style="background-color: var(--sqdgn-accent); color: white;"
				onmouseover="this.style.backgroundColor='var(--sqdgn-hover)'"
				onmouseout="this.style.backgroundColor='var(--sqdgn-accent)'"
			>
				Connect Phantom Wallet
			</button>
		</div>
	{:else}
		<div class="rounded-xl p-6 mb-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<h2 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Wallet Connected</h2>
			<p class="text-sm font-mono" style="color: var(--sqdgn-text-muted);">
				{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
			</p>
		</div>

		<!-- Trading Engine Status -->
		<div class="rounded-xl p-6 mb-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold" style="color: var(--sqdgn-text);">Trading Engine</h2>
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 rounded-full {engineStatus.isRunning ? 'bg-green-400' : 'bg-red-400'}"></div>
					<span class="text-sm {engineStatus.isRunning ? 'text-green-400' : 'text-red-400'}">
						{engineStatus.isRunning ? 'Running' : 'Stopped'}
					</span>
				</div>
			</div>
			
			<div class="space-y-3">
				{#if engineStatus.isRunning && engineStatus.startedAt}
					<p class="text-sm" style="color: var(--sqdgn-text-muted);">
						Started: {new Date(engineStatus.startedAt).toLocaleString()}
					</p>
				{/if}
				
				<div class="flex items-center space-x-4">
					<button
						on:click={toggleEngine}
						disabled={engineLoading}
						class="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 {
							engineStatus.isRunning 
								? 'bg-red-600 hover:bg-red-700 text-white' 
								: 'text-white'
						}"
						style={!engineStatus.isRunning ? "background-color: var(--sqdgn-accent);" : ""}
						onmouseover={!engineStatus.isRunning ? "if (!this.disabled) this.style.backgroundColor='var(--sqdgn-hover)'" : ""}
						onmouseout={!engineStatus.isRunning ? "if (!this.disabled) this.style.backgroundColor='var(--sqdgn-accent)'" : ""}
					>
						{#if engineLoading}
							{engineStatus.isRunning ? 'Stopping...' : 'Starting...'}
						{:else}
							{engineStatus.isRunning ? 'Stop Engine' : 'Start Engine'}
						{/if}
					</button>
					
					<button
						on:click={loadEngineStatus}
						class="px-3 py-2 text-sm rounded-lg transition-colors"
						style="color: var(--sqdgn-text-muted); border: 1px solid var(--sqdgn-border);"
						onmouseover="this.style.borderColor='var(--sqdgn-accent)'"
						onmouseout="this.style.borderColor='var(--sqdgn-border)'"
					>
						Refresh
					</button>
				</div>
				
				{#if engineError}
					<p class="text-sm text-red-400">{engineError}</p>
				{/if}
				
				<div class="text-xs p-3 rounded-lg" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
					<p style="color: var(--sqdgn-text-muted);">
						<strong>How it works:</strong> The trading engine runs in the background and automatically processes SQDGN signals. 
						When enabled, it will create buy orders for tokens mentioned in new calls and manage your trailing stops.
					</p>
				</div>
			</div>
		</div>

		<!-- Recent Trading Activity -->
		<div class="rounded-xl p-6 mb-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center space-x-3">
					<h2 class="text-lg font-semibold" style="color: var(--sqdgn-text);">Recent Activity</h2>
					<div class="flex items-center space-x-2">
						<div class="w-2 h-2 rounded-full {isRealtimeConnected ? 'bg-green-400' : 'bg-gray-400'}"></div>
						<span class="text-xs {isRealtimeConnected ? 'text-green-400' : 'text-gray-400'}">
							{isRealtimeConnected ? 'Live' : 'Offline'}
						</span>
					</div>
				</div>
				<button
					on:click={loadRecentPositions}
					class="px-3 py-1 text-xs rounded-lg transition-colors"
					style="color: var(--sqdgn-text-muted); border: 1px solid var(--sqdgn-border);"
					onmouseover="this.style.borderColor='var(--sqdgn-accent)'"
					onmouseout="this.style.borderColor='var(--sqdgn-border)'"
				>
					Refresh
				</button>
			</div>
			
			{#if positionsLoading}
				<div class="flex items-center justify-center py-4">
					<div class="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" style="color: var(--sqdgn-accent);"></div>
				</div>
			{:else if positions.length === 0}
				<p class="text-sm py-4" style="color: var(--sqdgn-text-muted);">
					No trading activity yet. Enable auto-buy and start the trading engine to begin!
				</p>
			{:else}
				<div class="space-y-2">
					{#each positions as position}
						<div class="flex items-center justify-between p-3 rounded-lg" style="background-color: var(--sqdgn-bg); border: 1px solid var(--sqdgn-border);">
							<div class="flex-1">
								<div class="flex items-center space-x-2">
									<span class="font-medium text-sm" style="color: var(--sqdgn-text);">${position.token_symbol}</span>
									<span class="text-xs px-2 py-1 rounded-full {
										position.status === 'open' ? 'bg-blue-500/20 text-blue-400' : 
										position.status === 'closed' ? 'bg-gray-500/20 text-gray-400' : 
										'bg-yellow-500/20 text-yellow-400'
									}">
										{position.status}
									</span>
								</div>
								<p class="text-xs mt-1" style="color: var(--sqdgn-text-muted);">
									{position.entry_amount_sol.toFixed(3)} SOL
									{#if position.status === 'closed' && position.realized_pnl_sol}
										• PnL: {position.realized_pnl_sol > 0 ? '+' : ''}{position.realized_pnl_sol.toFixed(4)} SOL
									{/if}
								</p>
							</div>
							<div class="text-right">
								<p class="text-xs" style="color: var(--sqdgn-text-muted);">
									{new Date(position.opened_at).toLocaleDateString()}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if loading}
			<div class="text-center py-8">
				<div class="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full mx-auto" style="color: var(--sqdgn-accent);"></div>
				<p class="mt-2" style="color: var(--sqdgn-text-muted);">Loading configuration...</p>
			</div>
		{:else}
			<form on:submit|preventDefault={saveConfig} class="space-y-6">
				<!-- Auto-Buy Settings -->
				<div class="rounded-xl p-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h2 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Auto-Buy Settings</h2>
					
					<div class="space-y-4">
						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={config.is_auto_buy_enabled}
								class="w-4 h-4 rounded"
								style="accent-color: var(--sqdgn-accent);"
							/>
							<span class="font-medium" style="color: var(--sqdgn-text);">Enable Auto-Buy</span>
						</label>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium mb-2" style="color: var(--sqdgn-text);">
									Default Buy Amount (SOL)
								</label>
								<input
									type="number"
									step="0.01"
									min="0.01"
									max="100"
									bind:value={config.default_buy_amount_sol}
									class="w-full px-3 py-2 rounded-lg border text-sm"
									style="background-color: var(--sqdgn-bg); border-color: var(--sqdgn-border); color: var(--sqdgn-text);"
									disabled={!config.is_auto_buy_enabled}
								/>
							</div>
							
							<div>
								<label class="block text-sm font-medium mb-2" style="color: var(--sqdgn-text);">
									Max Position Size (SOL)
								</label>
								<input
									type="number"
									step="0.1"
									min="0.1"
									max="1000"
									bind:value={config.max_position_size_sol}
									class="w-full px-3 py-2 rounded-lg border text-sm"
									style="background-color: var(--sqdgn-bg); border-color: var(--sqdgn-border); color: var(--sqdgn-text);"
									disabled={!config.is_auto_buy_enabled}
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Slippage Settings -->
				<div class="rounded-xl p-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h2 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Slippage Settings</h2>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium mb-2" style="color: var(--sqdgn-text);">
								Default Slippage ({(config.default_slippage_bps / 100).toFixed(1)}%)
							</label>
							<input
								type="range"
								min="50"
								max="1000"
								step="25"
								bind:value={config.default_slippage_bps}
								class="w-full"
								style="accent-color: var(--sqdgn-accent);"
							/>
							<div class="flex justify-between text-xs mt-1" style="color: var(--sqdgn-text-muted);">
								<span>0.5%</span>
								<span>10%</span>
							</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium mb-2" style="color: var(--sqdgn-text);">
								Max Slippage ({(config.max_slippage_bps / 100).toFixed(1)}%)
							</label>
							<input
								type="range"
								min="100"
								max="2000"
								step="50"
								bind:value={config.max_slippage_bps}
								class="w-full"
								style="accent-color: var(--sqdgn-accent);"
							/>
							<div class="flex justify-between text-xs mt-1" style="color: var(--sqdgn-text-muted);">
								<span>1%</span>
								<span>20%</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Trailing Stop Settings -->
				<div class="rounded-xl p-6" style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
					<h2 class="text-lg font-semibold mb-4" style="color: var(--sqdgn-text);">Risk Management</h2>
					
					<div class="space-y-4">
						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={config.trailing_stop_enabled}
								class="w-4 h-4 rounded"
								style="accent-color: var(--sqdgn-accent);"
							/>
							<span class="font-medium" style="color: var(--sqdgn-text);">Enable Trailing Stop-Loss</span>
						</label>
						
						<div>
							<label class="block text-sm font-medium mb-2" style="color: var(--sqdgn-text);">
								Trailing Stop Percentage ({config.trailing_stop_percentage}%)
							</label>
							<input
								type="range"
								min="5"
								max="50"
								step="1"
								bind:value={config.trailing_stop_percentage}
								class="w-full"
								style="accent-color: var(--sqdgn-accent);"
								disabled={!config.trailing_stop_enabled}
							/>
							<div class="flex justify-between text-xs mt-1" style="color: var(--sqdgn-text-muted);">
								<span>5%</span>
								<span>50%</span>
							</div>
							<p class="text-xs mt-2" style="color: var(--sqdgn-text-muted);">
								Automatically sell when price drops {config.trailing_stop_percentage}% from the highest point
							</p>
						</div>
					</div>
				</div>

				<!-- Error/Success Messages -->
				{#if error}
					<div class="rounded-lg p-4" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
						<p class="text-red-400 text-sm">{error}</p>
					</div>
				{/if}

				{#if success}
					<div class="rounded-lg p-4" style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3);">
						<p class="text-green-400 text-sm">{success}</p>
					</div>
				{/if}

				<!-- Save Button -->
				<div class="flex justify-end">
					<button
						type="submit"
						disabled={saving}
						class="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
						style="background-color: var(--sqdgn-accent); color: white;"
						onmouseover="if (!this.disabled) this.style.backgroundColor='var(--sqdgn-hover)'"
						onmouseout="if (!this.disabled) this.style.backgroundColor='var(--sqdgn-accent)'"
					>
						{saving ? 'Saving...' : 'Save Configuration'}
					</button>
				</div>
			</form>
		{/if}
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
</style>