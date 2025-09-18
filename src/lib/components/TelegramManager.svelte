<script lang="ts">
	import { onMount } from 'svelte';

	// User state
	let user: any = null;
	let loading = true;
	let error: string | null = null;

	// Monitoring state
	let monitoringStatus = {
		isConnected: false,
		activeChannels: [] as string[],
		lastActivity: null as string | null,
		messagesProcessed: 0,
		errors: 0
	};
	let monitoringLoading = false;

	// Available channels (loaded from API)
	let availableChannels: Array<{
		id: string;
		title: string;
		username?: string;
		type: string;
		memberCount: number;
		isPublic: boolean;
	}> = [];
	let channelsLoading = true;
	let channelsError: string | null = null;

	// Selected channels for monitoring
	let selectedChannels: Set<string> = new Set();

	onMount(async () => {
		await loadUserInfo();
		if (user) {
			await loadAvailableChannels();
			await checkMonitoringStatus();
		}
	});

	async function loadUserInfo() {
		try {
			loading = true;
			const response = await fetch('/api/telegram/user-info');
			const result = await response.json();
			
			if (result.success) {
				user = result.user;
			} else {
				error = 'Not logged in';
			}
		} catch (err) {
			console.error('Error loading user info:', err);
			error = 'Failed to load user info';
		} finally {
			loading = false;
		}
	}

	async function loadAvailableChannels() {
		try {
			channelsLoading = true;
			channelsError = null;
			const response = await fetch('/api/telegram/channels');
			const result = await response.json();

			if (result.success) {
				availableChannels = result.channels || [];
			} else {
				channelsError = result.error || 'Failed to load channels';
				console.error('Failed to load channels:', result.error);
			}
		} catch (err) {
			console.error('Error loading channels:', err);
			channelsError = 'Failed to load channels';
		} finally {
			channelsLoading = false;
		}
	}

	async function checkMonitoringStatus() {
		try {
			const response = await fetch('/api/telegram/monitor/start');
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
			console.error('Error checking monitoring status:', err);
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
		if (monitoringLoading || selectedChannels.size === 0) return;

		try {
			monitoringLoading = true;

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
				console.error('Failed to start monitoring:', result.error);
				error = result.error;
			}
		} catch (err) {
			console.error('Error starting monitoring:', err);
			error = 'Failed to start monitoring';
		} finally {
			monitoringLoading = false;
		}
	}

	async function stopChannel(channel: string) {
		if (monitoringLoading) return;

		try {
			monitoringLoading = true;

			const response = await fetch(`/api/telegram/monitor/start?channel=${encodeURIComponent(channel)}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (result.success) {
				await checkMonitoringStatus();
			} else {
				console.error('Failed to stop channel:', result.error);
			}
		} catch (err) {
			console.error('Error stopping channel:', err);
		} finally {
			monitoringLoading = false;
		}
	}

	async function stopAllMonitoring() {
		if (monitoringLoading) return;

		try {
			monitoringLoading = true;

			const response = await fetch('/api/telegram/monitor/start', {
				method: 'DELETE'
			});

			const result = await response.json();

			if (result.success) {
				await checkMonitoringStatus();
				selectedChannels.clear();
				selectedChannels = selectedChannels; // Trigger reactivity
			} else {
				console.error('Failed to stop monitoring:', result.error);
			}
		} catch (err) {
			console.error('Error stopping monitoring:', err);
		} finally {
			monitoringLoading = false;
		}
	}
</script>

<div class="bg-white rounded-lg shadow p-4 space-y-4">
	<!-- User Info Header -->
	<div class="flex items-center justify-between">
		<div class="text-sm text-gray-600">
			{#if loading}
				<span>Loading...</span>
			{:else if user}
				<span>Logged in as: <strong>@{user.username || `${user.firstName} ${user.lastName}`.trim()}</strong></span>
			{:else if error}
				<span class="text-red-600">Not logged in</span>
			{/if}
		</div>

		{#if user}
			<div class="flex items-center space-x-2">
				<div class="w-2 h-2 rounded-full {monitoringStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}"></div>
				<span class="text-xs {monitoringStatus.isConnected ? 'text-green-600' : 'text-red-600'}">
					{monitoringStatus.isConnected ? 'Connected' : 'Disconnected'}
				</span>
			</div>
		{/if}
	</div>

	{#if error}
		<div class="text-red-600 text-sm bg-red-50 p-2 rounded">
			{error}
		</div>
	{/if}

	{#if user}
		<!-- Channel Selection -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-medium text-gray-700">Select Channels to Monitor:</h3>
				{#if !channelsLoading && availableChannels.length > 0}
					<button
						on:click={loadAvailableChannels}
						class="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
						disabled={channelsLoading}
					>
						<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						<span>Refresh</span>
					</button>
				{/if}
			</div>

			{#if channelsLoading}
				<div class="flex items-center justify-center py-4">
					<div class="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
					<span class="ml-2 text-sm text-gray-500">Loading channels...</span>
				</div>
			{:else if channelsError}
				<div class="text-red-600 text-sm bg-red-50 p-2 rounded">
					{channelsError}
					<button
						on:click={loadAvailableChannels}
						class="ml-2 text-blue-600 hover:text-blue-700 underline"
					>
						Retry
					</button>
				</div>
			{:else if availableChannels.length === 0}
				<div class="text-center py-6">
					<svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-2-4H9m0 0L7 9m2 5l-2-5"></path>
					</svg>
					<p class="text-gray-500 text-sm mb-3">No channels found</p>
					<p class="text-xs text-gray-400 mb-4">Make sure you're logged in and have access to Telegram channels</p>
					<button
						on:click={loadAvailableChannels}
						class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Try Again
					</button>
				</div>
			{:else}
				<!-- Channel count summary -->
				<div class="text-xs text-gray-500 mb-3">
					Found {availableChannels.length} available channel{availableChannels.length !== 1 ? 's' : ''}
					{#if selectedChannels.size > 0}
						• {selectedChannels.size} selected
					{/if}
				</div>

				<div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
					{#each availableChannels as channel}
						<label class="flex items-center space-x-3 text-sm p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
							<input
								type="checkbox"
								checked={selectedChannels.has(channel.title)}
								on:change={() => toggleChannel(channel.title)}
								disabled={monitoringLoading}
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
							/>
							<div class="flex-1 min-w-0">
								<div class="font-medium text-gray-900 truncate">{channel.title}</div>
								<div class="text-xs text-gray-500 flex items-center space-x-2">
									<span class="capitalize">{channel.type}</span>
									<span>•</span>
									<span>{channel.memberCount.toLocaleString()} members</span>
									{#if channel.username}
										<span>•</span>
										<span class="font-mono">@{channel.username}</span>
									{/if}
									{#if channel.isPublic}
										<span>•</span>
										<span class="text-green-600">Public</span>
									{/if}
								</div>
							</div>
							{#if monitoringStatus.activeChannels.includes(channel.title)}
								<span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
									Active
								</span>
							{/if}
						</label>
					{/each}
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="flex items-center space-x-2">
				<button
					on:click={startMonitoring}
					disabled={monitoringLoading || selectedChannels.size === 0}
					class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{monitoringLoading ? 'Starting...' : 'Start Monitoring'}
				</button>

				{#if monitoringStatus.activeChannels.length > 0}
					<button
						on:click={stopAllMonitoring}
						disabled={monitoringLoading}
						class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
					>
						{monitoringLoading ? 'Stopping...' : 'Stop All'}
					</button>
				{/if}
			</div>

			<!-- Active Channels Status -->
			{#if monitoringStatus.activeChannels.length > 0}
				<div class="border-t pt-3">
					<h4 class="text-sm font-medium text-gray-700 mb-2">Active Channels ({monitoringStatus.activeChannels.length}):</h4>
					<div class="space-y-1">
						{#each monitoringStatus.activeChannels as channel}
							<div class="flex items-center justify-between text-sm bg-green-50 p-2 rounded">
								<span class="font-medium">{channel}</span>
								<button
									on:click={() => stopChannel(channel)}
									disabled={monitoringLoading}
									class="text-red-600 hover:text-red-700 text-xs disabled:opacity-50"
								>
									Stop
								</button>
							</div>
						{/each}
					</div>

					<!-- Stats -->
					<div class="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-2">
						<div>Messages processed: {monitoringStatus.messagesProcessed}</div>
						<div>Errors: {monitoringStatus.errors}</div>
						{#if monitoringStatus.lastActivity}
							<div class="col-span-2">Last activity: {new Date(monitoringStatus.lastActivity).toLocaleTimeString()}</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>