<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let channels: any[] = [];
	let loading = true;
	let error = '';
	let selectedChannels = new Set<string>();
	let selectedChannelData = new Map<string, any>();
	let saving = false;
	
	// Check if user is authenticated
	let isAuthenticated = false;
	
	onMount(async () => {
		await checkAuthStatus();
		if (isAuthenticated) {
			await loadChannels();
		}
	});
	
	async function checkAuthStatus() {
		try {
			const response = await fetch('/api/auth/status');
			const result = await response.json();
			isAuthenticated = result.authenticated;
			
			if (!isAuthenticated) {
				goto('/login');
				return;
			}
		} catch (err) {
			console.error('Auth check failed:', err);
			goto('/login');
		}
	}
	
	async function loadChannels() {
		loading = true;
		error = '';
		
		try {
			const response = await fetch('/api/telegram/channels');
			const result = await response.json();
			
			if (response.ok) {
				channels = result.channels || [];
			} else {
				error = result.error || 'Failed to load channels';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error';
		} finally {
			loading = false;
		}
	}
	
	function toggleChannel(channelId: string) {
		const channel = channels.find(c => c.id === channelId);
		if (selectedChannels.has(channelId)) {
			selectedChannels.delete(channelId);
			selectedChannelData.delete(channelId);
		} else {
			selectedChannels.add(channelId);
			selectedChannelData.set(channelId, channel);
		}
		selectedChannels = new Set(selectedChannels); // Trigger reactivity
		selectedChannelData = new Map(selectedChannelData);
	}
	
	async function saveSelection() {
		if (selectedChannels.size === 0) {
			error = 'Please select at least one channel to monitor';
			return;
		}
		
		saving = true;
		error = '';
		
		try {
			// Step 1: Save channel selection
			const response = await fetch('/api/telegram/channels/select', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					channels: Array.from(selectedChannelData.values())
				})
			});
			
			const result = await response.json();
			
			if (!response.ok) {
				error = result.error || 'Failed to save channel selection';
				return;
			}
			
			// Step 2: Start monitoring the selected channels
			const monitorResponse = await fetch('/api/telegram/start-listening', {
				method: 'POST'
			});
			
			const monitorResult = await monitorResponse.json();
			
			if (monitorResponse.ok) {
				// Successfully started monitoring
				goto('/');
			} else {
				error = monitorResult.error || 'Failed to start monitoring. Your channels were saved but monitoring could not be started.';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error';
		} finally {
			saving = false;
		}
	}
	
	function getChannelTypeIcon(type: string) {
		switch (type) {
			case 'channel':
				return '📢';
			case 'group':
				return '👥';
			case 'supergroup':
				return '🌐';
			default:
				return '💬';
		}
	}
	
	function formatMemberCount(count: number) {
		if (count > 1000000) {
			return `${(count / 1000000).toFixed(1)}M`;
		} else if (count > 1000) {
			return `${(count / 1000).toFixed(1)}K`;
		}
		return count.toString();
	}
</script>

<svelte:head>
	<title>Select Channels - SQDGN Trading Bot</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-3xl font-extrabold text-gray-900 mb-2">
				Select Channels to Monitor
			</h2>
			<p class="text-lg text-gray-600">
				Choose which Telegram channels you'd like to monitor for trading signals
			</p>
		</div>

		{#if error}
			<div class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
				<div class="flex">
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<div class="mt-2 text-sm text-red-700">
							<p>{error}</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if loading}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-lg text-gray-600">Loading your channels...</span>
			</div>
		{:else if channels.length === 0}
			<div class="text-center py-12">
				<div class="mx-auto h-12 w-12 text-gray-400 mb-4">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No Channels Found</h3>
				<p class="text-gray-600 mb-6">
					We couldn't find any channels in your Telegram account. Make sure you've joined some channels first.
				</p>
				<button 
					on:click={loadChannels}
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		{:else}
			<div class="bg-white shadow-sm rounded-lg overflow-hidden">
				<div class="px-6 py-4 border-b border-gray-200">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium text-gray-900">
							Available Channels ({channels.length})
						</h3>
						<div class="text-sm text-gray-500">
							{selectedChannels.size} selected
						</div>
					</div>
				</div>
				
				<div class="divide-y divide-gray-200">
					{#each channels as channel}
						<div class="p-6 hover:bg-gray-50 transition-colors">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-4 flex-1">
									<div class="flex-shrink-0">
										<span class="text-2xl">{getChannelTypeIcon(channel.type)}</span>
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center space-x-2">
											<h4 class="text-lg font-medium text-gray-900 truncate">
												{channel.title}
											</h4>
											{#if channel.username}
												<span class="text-sm text-gray-500">@{channel.username}</span>
											{/if}
										</div>
										{#if channel.description}
											<p class="mt-1 text-sm text-gray-600 truncate">
												{channel.description}
											</p>
										{/if}
										<div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
											<span class="flex items-center">
												<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
												</svg>
												{formatMemberCount(channel.memberCount)} members
											</span>
											<span>{channel.type}</span>
											{#if channel.isPublic !== undefined}
												<span>{channel.isPublic ? 'Public' : 'Private'}</span>
											{/if}
										</div>
									</div>
								</div>
								<div class="flex-shrink-0 ml-4">
									<button
										on:click={() => toggleChannel(channel.id)}
										class="relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors {selectedChannels.has(channel.id) ? 'bg-blue-600' : 'bg-gray-200'}"
									>
										<span class="sr-only">Toggle {channel.title}</span>
										<span 
											class="inline-block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform {selectedChannels.has(channel.id) ? 'translate-x-3' : 'translate-x-1'}"
										></span>
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
				
				<div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
					<div class="flex items-center justify-between">
						<div class="text-sm text-gray-600">
							{selectedChannels.size} channel{selectedChannels.size === 1 ? '' : 's'} selected
						</div>
						<div class="flex space-x-3">
							<button
								on:click={() => goto('/')}
								class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								on:click={saveSelection}
								disabled={saving || selectedChannels.size === 0}
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if saving}
									<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								{/if}
								Start Monitoring
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>