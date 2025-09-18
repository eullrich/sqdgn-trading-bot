<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// User state
	let user: any = null;
	let userLoading = true;
	let userError: string | null = null;
	
	// Channel state
	let channels: any[] = [];
	let channelsLoading = false;
	let channelsError: string | null = null;
	let selectedChannel: string = '';
	let showChannelDropdown = false;
	
	// Monitoring state
	let monitoringStatus = { isConnected: false, currentChannel: null, lastActivity: null, messagesProcessed: 0 };
	let monitoringLoading = false;
	let monitoringError: string | null = null;

	// Default channel - use the actual title from Telegram
	const DEFAULT_CHANNEL = 'SQDGN Solana Direct';

	onMount(async () => {
		await loadUserInfo();
		if (user) {
			loadSelectedChannel();
			await checkMonitoringStatus();
		}
	});

	async function loadUserInfo() {
		try {
			userLoading = true;
			userError = null;
			const response = await fetch('/api/telegram/user-info');
			const result = await response.json();
			
			if (result.success) {
				user = result.user;
			} else {
				userError = 'Not logged in';
			}
		} catch (err) {
			console.error('Error loading user info:', err);
			userError = 'Failed to load user info';
		} finally {
			userLoading = false;
		}
	}

	function loadSelectedChannel() {
		if (browser) {
			let savedChannel = localStorage.getItem('selectedChannel') || DEFAULT_CHANNEL;
			
			// Migrate old channel name format
			if (savedChannel === 'SQDGN_Solana_Direct') {
				savedChannel = 'SQDGN Solana Direct';
				localStorage.setItem('selectedChannel', savedChannel);
			}
			
			selectedChannel = savedChannel;
		}
	}

	function saveSelectedChannel(channel: string) {
		if (browser) {
			localStorage.setItem('selectedChannel', channel);
		}
	}

	async function loadChannels() {
		// Always reload to get fresh channel list
		
		try {
			channelsLoading = true;
			channelsError = null;
			console.log('🔄 Loading channels from Telegram...');
			
			const response = await fetch('/api/telegram/channels');
			const result = await response.json();
			console.log('📺 Channels result:', result);
			
			if (result.success) {
				channels = result.channels || [];
				console.log(`✅ Loaded ${channels.length} channels from Telegram`);
				
				// Add default channel if not in list
				if (!channels.find(c => c.username === DEFAULT_CHANNEL || c.title === DEFAULT_CHANNEL)) {
					channels.unshift({
						id: DEFAULT_CHANNEL,
						title: 'SQDGN Solana Direct',
						username: DEFAULT_CHANNEL,
						type: 'channel',
						memberCount: 0
					});
				}
			} else {
				console.error('❌ Failed to load channels:', result.error);
				channelsError = result.error || 'Failed to load channels';
				
				// Fallback to default channel only
				channels = [{
					id: DEFAULT_CHANNEL,
					title: 'SQDGN Solana Direct',
					username: DEFAULT_CHANNEL,
					type: 'channel',
					memberCount: 0
				}];
			}
		} catch (err) {
			console.error('Error loading channels:', err);
			channelsError = 'Failed to load channels';
			
			// Fallback to default channel only
			channels = [{
				id: DEFAULT_CHANNEL,
				title: 'SQDGN Solana Direct',
				username: DEFAULT_CHANNEL,
				type: 'channel',
				memberCount: 0
			}];
		} finally {
			channelsLoading = false;
		}
	}

	async function checkMonitoringStatus() {
		try {
			const response = await fetch('/api/telegram/monitor/start');
			const result = await response.json();
			
			if (result.success && result.status) {
				monitoringStatus = result.status;
			}
		} catch (err) {
			console.error('Error checking monitoring status:', err);
		}
	}

	async function toggleMonitoring() {
		if (monitoringLoading || !selectedChannel) return;
		
		try {
			monitoringLoading = true;
			monitoringError = null;
			
			const method = monitoringStatus.isConnected ? 'DELETE' : 'POST';
			
			const response = await fetch('/api/telegram/monitor/start', {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: method === 'POST' ? JSON.stringify({
					channel: selectedChannel,
					fetchHistory: false
				}) : undefined
			});
			
			const result = await response.json();
			
			if (result.success) {
				if (result.status) {
					monitoringStatus = result.status;
				} else {
					// For DELETE response
					monitoringStatus = {
						isConnected: false,
						currentChannel: null,
						lastActivity: null,
						messagesProcessed: 0
					};
				}
			} else {
				monitoringError = result.error || 'Failed to toggle monitoring';
			}
		} catch (err) {
			console.error('Error toggling monitoring:', err);
			monitoringError = 'Network error occurred';
		} finally {
			monitoringLoading = false;
		}
	}

	function selectChannel(channel: any) {
		// Prioritize username, then title, then id for channel identification
		const newChannel = channel.username || channel.title || channel.id;
		console.log(`🔄 Selecting channel: ${newChannel}`, {
			title: channel.title,
			username: channel.username,
			type: channel.type,
			memberCount: channel.memberCount
		});
		
		selectedChannel = newChannel;
		saveSelectedChannel(selectedChannel);
		showChannelDropdown = false;
		
		// Clear any previous errors
		monitoringError = null;
		
		// If currently monitoring, restart with new channel
		if (monitoringStatus.isConnected) {
			console.log('♾️ Restarting monitoring with new channel');
			toggleMonitoring().then(() => {
				setTimeout(toggleMonitoring, 1000); // Restart after 1 second
			});
		} else {
			console.log(`✅ Channel selected: "${channel.title}" (@${channel.username}). Click Start Monitoring to begin.`);
		}
	}

	function toggleDropdown() {
		if (!showChannelDropdown) {
			loadChannels();
		}
		showChannelDropdown = !showChannelDropdown;
	}

	function getSelectedChannelDisplay() {
		const channel = channels.find(c => 
			c.username === selectedChannel || 
			c.title === selectedChannel || 
			c.id === selectedChannel
		);
		return channel ? channel.title : selectedChannel;
	}

	// Click outside to close dropdown
	function handleClickOutside(event: MouseEvent) {
		if (showChannelDropdown) {
			const dropdown = document.getElementById('channel-dropdown');
			if (dropdown && !dropdown.contains(event.target as Node)) {
				showChannelDropdown = false;
			}
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="flex items-center space-x-2 sm:space-x-4 text-sm">
	<!-- User Status -->
	<div class="hidden sm:block" style="color: var(--sqdgn-text-muted);">
		{#if userLoading}
			<span class="text-xs">Loading...</span>
		{:else if user}
			<span>Logged in as <strong style="color: var(--sqdgn-accent);">@{user.username || `${user.firstName} ${user.lastName}`.trim()}</strong></span>
		{:else if userError}
			<span class="text-xs" style="color: #ef4444;">Not logged in</span>
		{/if}
	</div>

	{#if user}
		<!-- Monitoring Status -->
		<div class="flex items-center space-x-2">
			<div class="flex items-center space-x-1" title={monitoringStatus.isConnected ? `Monitoring ${monitoringStatus.currentChannel || selectedChannel}` : 'Not monitoring'}>
				<div class="w-2 h-2 rounded-full {monitoringStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}"></div>
				<span class="text-xs {monitoringStatus.isConnected ? 'text-green-400' : 'text-red-400'}">
					{monitoringStatus.isConnected ? 'Monitoring' : 'Not monitoring'}
				</span>
			</div>

			<!-- Channel Selection -->
			<div class="relative" id="channel-dropdown">
				<button
					on:click={toggleDropdown}
					class="flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors"
					style="color: var(--sqdgn-text-muted); border: 1px solid var(--sqdgn-border); background-color: var(--sqdgn-surface);"
					onmouseover="this.style.backgroundColor='var(--sqdgn-border)'"
					onmouseout="this.style.backgroundColor='var(--sqdgn-surface)'"
					disabled={channelsLoading}
				>
					<span class="truncate max-w-32">{getSelectedChannelDisplay()}</span>
					{#if channelsLoading && showChannelDropdown}
						<svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
					{:else}
						<svg class="w-3 h-3 transform transition-transform {showChannelDropdown ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					{/if}
				</button>

				{#if showChannelDropdown}
					<div class="absolute right-0 mt-1 w-64 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
					     style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border);">
						<!-- Refresh button -->
						<div class="sticky top-0 px-3 py-2" style="background-color: var(--sqdgn-surface); border-bottom: 1px solid var(--sqdgn-border);">
							<button
								on:click={loadChannels}
								disabled={channelsLoading}
								class="flex items-center space-x-1 text-xs disabled:opacity-50 transition-colors"
								style="color: var(--sqdgn-text-muted);"
								onmouseover="this.style.color='var(--sqdgn-accent)'"
								onmouseout="this.style.color='var(--sqdgn-text-muted)'"
							>
								<svg class="w-3 h-3 {channelsLoading ? 'animate-spin' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
								<span>Refresh Channels</span>
							</button>
						</div>
						{#if channelsLoading}
							<div class="px-3 py-2 text-xs flex items-center space-x-2" style="color: var(--sqdgn-text-muted);">
								<svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
								<span>Loading channels...</span>
							</div>
						{:else if channelsError}
							<div class="px-3 py-2 text-xs" style="color: #ef4444;">{channelsError}</div>
						{:else if channels.length === 0}
							<div class="px-3 py-2 text-xs" style="color: var(--sqdgn-text-muted);">No channels available</div>
						{:else}
							{#each channels as channel}
								<button
									on:click={() => selectChannel(channel)}
									class="w-full text-left px-3 py-2 flex flex-col transition-colors {selectedChannel === (channel.username || channel.title || channel.id) ? 'border-l-2' : ''}"
									style="color: var(--sqdgn-text); {selectedChannel === (channel.username || channel.title || channel.id) ? 'background-color: var(--sqdgn-border); border-left-color: var(--sqdgn-accent);' : ''}"
									onmouseover="if (this.style.borderLeftColor !== 'var(--sqdgn-accent)') this.style.backgroundColor='var(--sqdgn-border)'"
									onmouseout="if (this.style.borderLeftColor !== 'var(--sqdgn-accent)') this.style.backgroundColor='transparent'"
									title={`${channel.title}${channel.username ? ` (@${channel.username})` : ''} - ${channel.type}${channel.memberCount ? ` • ${channel.memberCount.toLocaleString()} members` : ''}`}
								>
									<div class="flex items-center justify-between">
										<div class="font-medium text-xs truncate pr-2" style="color: var(--sqdgn-text);">{channel.title}</div>
										{#if selectedChannel === (channel.username || channel.title || channel.id)}
											<svg class="w-3 h-3 flex-shrink-0" fill="var(--sqdgn-accent)" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
											</svg>
										{/if}
									</div>
									{#if channel.username}
										<div class="text-xs truncate" style="color: var(--sqdgn-text-muted);">@{channel.username}</div>
									{:else}
										<div class="text-xs italic" style="color: var(--sqdgn-text-muted); opacity: 0.7;">No username</div>
									{/if}
									<div class="text-xs truncate" style="color: var(--sqdgn-text-muted);">
										<span class="capitalize">{channel.type}</span>
										{#if channel.memberCount && channel.memberCount > 0}
											• {channel.memberCount.toLocaleString()} members
										{/if}
										{#if !channel.isPublic}
											• <span style="color: #f59e0b;">Private</span>
										{/if}
									</div>
								</button>
							{/each}
						{/if}
					</div>
				{/if}
			</div>

			<!-- Monitoring Toggle Button -->
			<button
				on:click={toggleMonitoring}
				disabled={monitoringLoading || !selectedChannel || !user}
				class="px-2 sm:px-3 py-1 text-xs rounded transition-colors disabled:opacity-50 {
					monitoringStatus.isConnected 
						? 'bg-red-600 hover:bg-red-700 text-white' 
						: 'bg-blue-600 hover:bg-blue-700 text-white'
				}"
			>
				{#if monitoringLoading}
					<span class="sm:hidden">{monitoringStatus.isConnected ? 'Stop...' : 'Start...'}</span>
					<span class="hidden sm:inline">{monitoringStatus.isConnected ? 'Stopping...' : 'Starting...'}</span>
				{:else}
					<span class="sm:hidden">{monitoringStatus.isConnected ? 'Stop' : 'Start'}</span>
					<span class="hidden sm:inline">{monitoringStatus.isConnected ? 'Stop' : 'Start Monitoring'}</span>
				{/if}
			</button>
		</div>

		<!-- Error Display -->
		{#if monitoringError}
			<div class="text-xs text-red-600 max-w-48 truncate" title={monitoringError}>
				{monitoringError}
			</div>
		{/if}
	{/if}
</div>

<style>
	/* Ensure dropdown appears above other content */
	.z-50 {
		z-index: 50;
	}
</style>