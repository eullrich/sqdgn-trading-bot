<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import WalletConnection from './WalletConnection.svelte';

	// User state
	let user: any = null;
	let userLoading = true;
	let userError: string | null = null;
	
	// Monitoring state
	let monitoringStatus = {
		isConnected: false,
		activeChannels: [],
		lastActivity: null,
		messagesProcessed: 0,
		errors: 0
	};
	let monitoringLoading = false;
	let monitoringError: string | null = null;

	// Dropdown state
	let showUserDropdown = false;

	// Wallet state
	let walletAddress: string | null = null;

	// Available channels (loaded from API)
	let availableChannels: Array<{
		id: string;
		title: string;
		username?: string;
		type: string;
		memberCount: number;
		isPublic: boolean;
	}> = [];
	let channelsLoading = false;
	let channelsError: string | null = null;

	// Selected channels for monitoring
	let selectedChannels: Set<string> = new Set();

	onMount(async () => {
		// Load user info with silent failure
		await loadUserInfo();

		// Only check monitoring status if user is loaded and we're in browser
		if (user && browser) {
			// Use a delay to prevent initial loading flash
			setTimeout(() => {
				checkMonitoringStatus();
			}, 500);
		}
	});

	async function loadUserInfo() {
		try {
			userLoading = true;
			userError = null;

			const response = await fetch('/api/telegram/user-info');

			if (!response.ok) {
				// Silent failure - user likely not logged in
				userError = null; // Don't show error state
				return;
			}

			const result = await response.json();

			if (result.success) {
				user = result.user;
			} else {
				// Silent failure - user not logged in
				userError = null;
			}
		} catch (err) {
			// Silent failure - don't show error states that cause flashing
			console.debug('User info not available (expected if not logged in):', err);
			userError = null;
		} finally {
			userLoading = false;
		}
	}

	async function loadAvailableChannels() {
		try {
			channelsLoading = true;
			channelsError = null;

			const response = await fetch('/api/telegram/channels');

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			if (result.success) {
				availableChannels = result.channels || [];
				if (availableChannels.length === 0) {
					channelsError = 'No channels found. Make sure you have access to Telegram channels.';
				}
			} else {
				// Handle specific error types
				if (result.error?.includes('Not authenticated') || result.error?.includes('Not a valid string')) {
					channelsError = 'Please log in to Telegram first to load channels.';
				} else {
					channelsError = result.error || 'Failed to load channels';
				}
				console.error('Failed to load channels:', result.error);
			}
		} catch (err) {
			console.error('Error loading channels:', err);
			channelsError = 'Unable to load channels. Please check your connection and try again.';
		} finally {
			channelsLoading = false;
		}
	}

	async function checkMonitoringStatus() {
		try {
			// Use the proper connection status endpoint with silent failure
			const response = await fetch('/api/telegram/connection-status');

			if (!response.ok) {
				// Silent failure - don't disrupt UI
				console.debug('Telegram monitoring not available');
				return;
			}

			const result = await response.json();

			if (result.success && result.status) {
				monitoringStatus = {
					isConnected: result.status.isConnected || false,
					activeChannels: result.status.activeChannels || [],
					lastActivity: result.status.lastActivity,
					messagesProcessed: result.status.messagesProcessed || 0,
					errors: result.status.errors || 0
				};

				// Update selected channels based on what's currently active
				selectedChannels = new Set(monitoringStatus.activeChannels);
			}
		} catch (err) {
			// Silent failure - don't disrupt UI with error states
			console.debug('Telegram status check failed (expected if not configured):', err);
		}
	}

	function toggleChannel(channelTitle: string) {
		if (selectedChannels.has(channelTitle)) {
			selectedChannels.delete(channelTitle);
		} else {
			selectedChannels.add(channelTitle);
		}
		selectedChannels = selectedChannels; // Trigger reactivity
	}

	async function startMonitoring() {
		if (selectedChannels.size === 0) return;

		try {
			monitoringError = null;
			const response = await fetch('/api/telegram/monitor/start', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					channels: Array.from(selectedChannels),
					fetchHistory: false
				})
			});

			const result = await response.json();

			if (result.success) {
				await checkMonitoringStatus();
			} else {
				monitoringError = result.error || 'Failed to start monitoring';
				console.error('Failed to start monitoring:', result.error);
			}
		} catch (err) {
			monitoringError = 'Unable to start monitoring. Please check your connection.';
			console.error('Error starting monitoring:', err);
		}
	}

	async function stopAllMonitoring() {
		try {
			monitoringError = null;
			const response = await fetch('/api/telegram/monitor/start', {
				method: 'DELETE'
			});

			const result = await response.json();

			if (result.success) {
				await checkMonitoringStatus();
				selectedChannels.clear();
				selectedChannels = selectedChannels; // Trigger reactivity
			} else {
				monitoringError = result.error || 'Failed to stop monitoring';
				console.error('Failed to stop monitoring:', result.error);
			}
		} catch (err) {
			monitoringError = 'Unable to stop monitoring. Please check your connection.';
			console.error('Error stopping monitoring:', err);
		}
	}

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST'
			});
			
			if (response.ok) {
				goto('/login');
			}
		} catch (err) {
			console.error('Logout failed:', err);
		}
	}

	async function toggleUserDropdown(event?: Event) {
		// Prevent event bubbling to avoid immediate close
		if (event) {
			event.stopPropagation();
		}

		showUserDropdown = !showUserDropdown;

		// Load channels when dropdown is first opened
		if (showUserDropdown && availableChannels.length === 0 && !channelsLoading && !channelsError) {
			await loadAvailableChannels();
		}
	}

	// Click outside to close dropdowns
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;

		if (showUserDropdown) {
			const dropdown = document.getElementById('user-dropdown');
			if (dropdown && !dropdown.contains(target)) {
				showUserDropdown = false;
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="flex items-center space-x-2">
	{#if user}
		<!-- User Profile Dropdown -->
		<div class="relative" id="user-dropdown">
			<button
				on:click={toggleUserDropdown}
				class="pump-button flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
				class:active={showUserDropdown}
			>
				<!-- User Avatar/Icon -->
				<div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style="background: linear-gradient(135deg, var(--sqdgn-accent), var(--sqdgn-hover));">
					{user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
				</div>
				<span class="hidden sm:inline">
					{user.username || `${user.firstName} ${user.lastName}`.trim()}
				</span>
				<svg class="w-4 h-4 transition-transform duration-200" class:rotate-180={showUserDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
				</svg>
			</button>

			{#if showUserDropdown}
				<div class="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 pump-dropdown">
					<div class="p-4 border-b" style="border-color: var(--sqdgn-border);">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style="background: linear-gradient(135deg, var(--sqdgn-accent), var(--sqdgn-hover));">
								{user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
							</div>
							<div>
								<div class="font-semibold" style="color: var(--sqdgn-text);">
									{user.username || `${user.firstName} ${user.lastName}`.trim()}
								</div>
								<div class="text-sm" style="color: var(--sqdgn-text-muted);">
									Telegram User
								</div>
							</div>
						</div>
					</div>

					<!-- Wallet Connection Section -->
					<div class="p-4 border-b" style="border-color: var(--sqdgn-border);">
						<div class="mb-2">
							<span class="text-sm font-medium" style="color: var(--sqdgn-text);">Wallet</span>
						</div>
						<WalletConnection 
							onConnect={(address) => walletAddress = address}
							onDisconnect={() => walletAddress = null}
						/>
					</div>

					<!-- Channel Selection Section -->
					<div class="p-4 border-b" style="border-color: var(--sqdgn-border);">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center space-x-2">
								<span class="text-sm font-medium" style="color: var(--sqdgn-text);">Channel Monitoring</span>
								{#if !channelsLoading && availableChannels.length > 0 && !channelsError}
									<button
										on:click={loadAvailableChannels}
										class="text-xs p-1 rounded hover:bg-gray-100 transition-colors"
										style="color: var(--sqdgn-text-muted);"
										title="Refresh channels"
										disabled={channelsLoading}
									>
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
										</svg>
									</button>
								{/if}
							</div>
							<div class="flex items-center space-x-2">
								<div class="w-2 h-2 rounded-full {monitoringStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}"></div>
								<span class="text-xs {monitoringStatus.isConnected ? 'text-green-400' : 'text-red-400'}">
									{monitoringStatus.isConnected ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>

						{#if channelsLoading}
							<div class="flex items-center justify-center py-3">
								<div class="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
								<span class="ml-2 text-xs" style="color: var(--sqdgn-text-muted);">Loading channels...</span>
							</div>
						{:else if channelsError}
							<div class="text-red-400 text-xs mb-2 p-2 rounded" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
								{channelsError}
								<button
									on:click={loadAvailableChannels}
									class="ml-2 text-blue-600 hover:text-blue-700 text-xs px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 transition-colors"
									disabled={channelsLoading}
								>
									{channelsLoading ? 'Loading...' : 'Retry'}
								</button>
							</div>
						{:else if availableChannels.length > 0}
							<!-- Channel Selection -->
							<div class="space-y-2 mb-3 max-h-32 overflow-y-auto">
								{#each availableChannels as channel, index}
									<label for="channel-{index}" class="flex items-center space-x-2 text-xs cursor-pointer">
										<input
											id="channel-{index}"
											type="checkbox"
											checked={selectedChannels.has(channel.title)}
											on:change={() => toggleChannel(channel.title)}
											class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
										/>
										<div class="flex-1 min-w-0">
											<div class="font-medium truncate" style="color: var(--sqdgn-text);">{channel.title}</div>
											<div class="text-xs opacity-60" style="color: var(--sqdgn-text-muted);">
												{channel.memberCount.toLocaleString()} members
											</div>
										</div>
										{#if monitoringStatus.activeChannels.includes(channel.title)}
											<span class="text-xs text-green-600 bg-green-100 px-1 rounded">●</span>
										{/if}
									</label>
								{/each}
							</div>

							<!-- Action Buttons -->
							<div class="flex space-x-2">
								{#if selectedChannels.size > 0}
									<button
										on:click={startMonitoring}
										class="flex-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
									>
										Start ({selectedChannels.size})
									</button>
								{/if}
								{#if monitoringStatus.activeChannels.length > 0}
									<button
										on:click={stopAllMonitoring}
										class="flex-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
									>
										Stop All
									</button>
								{/if}
							</div>
						{:else}
							<div class="text-xs text-center py-4" style="color: var(--sqdgn-text-muted);">
								<div class="mb-2">No channels available</div>
								<button
									on:click={loadAvailableChannels}
									class="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 transition-colors"
									disabled={channelsLoading}
								>
									{channelsLoading ? 'Loading...' : 'Try Loading'}
								</button>
							</div>
						{/if}

						<!-- Monitoring Error Display -->
						{#if monitoringError}
							<div class="mt-2 text-red-400 text-xs bg-red-50 p-2 rounded">
								{monitoringError}
							</div>
						{/if}
					</div>

					<!-- Logout Button -->
					<div class="p-4">
						<button
							on:click={handleLogout}
							class="w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors"
							style="color: #ef4444; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);"
							onmouseover="this.style.backgroundColor='rgba(239, 68, 68, 0.2)'"
							onmouseout="this.style.backgroundColor='rgba(239, 68, 68, 0.1)'"
						>
							Sign Out
						</button>
					</div>
				</div>
			{/if}
		</div>
	{:else if userLoading}
		<div class="pump-button px-4 py-2 rounded-xl">
			<div class="w-16 h-4 loading-skeleton rounded"></div>
		</div>
	{:else}
		<WalletConnection 
			onConnect={(address) => walletAddress = address}
			onDisconnect={() => walletAddress = null}
		/>
		<a href="/login" class="pump-button px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200">
			Sign In
		</a>
	{/if}
</div>

<style>
	.pump-button {
		background-color: var(--sqdgn-accent);
		border: none;
		color: white;
		transition: all 0.2s ease;
		/* Prevent flashing during load */
		opacity: 1;
		visibility: visible;
	}

	.pump-button:hover {
		background-color: var(--sqdgn-hover);
		transform: translateY(-1px);
		box-shadow: 0 4px 20px rgba(77, 101, 255, 0.3);
	}

	.pump-button.active {
		background-color: var(--sqdgn-hover);
		box-shadow: 0 0 0 1px var(--sqdgn-accent);
	}

	.pump-dropdown {
		background: var(--sqdgn-surface);
		border: 1px solid var(--sqdgn-border);
		backdrop-filter: blur(20px);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
		/* Smooth transitions to prevent flashing */
		transition: opacity 0.2s ease, visibility 0.2s ease;
	}

	.rotate-180 {
		transform: rotate(180deg);
	}

	/* Loading states that don't cause flashing */
	.loading-skeleton {
		animation: pulse 1.5s ease-in-out infinite;
		background: linear-gradient(90deg, var(--sqdgn-surface) 25%, rgba(255,255,255,0.1) 50%, var(--sqdgn-surface) 75%);
		background-size: 200% 100%;
	}

	@keyframes pulse {
		0%, 100% { background-position: 200% 0; }
		50% { background-position: -200% 0; }
	}

	/* Prevent black flash during component updates */
	div, span, button {
		transition: background-color 0.1s ease;
	}
</style>