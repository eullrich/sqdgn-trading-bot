<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let title = 'System Logs';
	export let height = '300px';
	export let maxLines = 100;

	let logs: string[] = [];
	let isStreaming = false;
	let autoScroll = true;
	let terminal: HTMLElement;
	let eventSource: EventSource | null = null;

	onMount(async () => {
		await fetchInitialLogs();
		startLogStreaming();
	});

	onDestroy(() => {
		stopLogStreaming();
	});

	async function fetchInitialLogs() {
		try {
			const response = await fetch('/api/logs?lines=50');
			if (response.ok) {
				const data = await response.json();
				logs = data.logs || [];
				scrollToBottom();
			}
		} catch (error) {
			console.error('Failed to fetch initial logs:', error);
			logs = [`[ERROR] Failed to fetch logs: ${error instanceof Error ? error.message : 'Unknown error'}`];
		}
	}

	function startLogStreaming() {
		if (isStreaming || eventSource) return;
		
		try {
			eventSource = new EventSource('/api/logs/stream');
			
			eventSource.onopen = () => {
				isStreaming = true;
				addLogLine('[INFO] Log streaming connected');
			};

			eventSource.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.log) {
					addLogLine(data.log);
				}
			};

			eventSource.onerror = () => {
				isStreaming = false;
				addLogLine('[ERROR] Log streaming disconnected');
				// Try to reconnect after 5 seconds
				setTimeout(() => {
					if (!isStreaming && eventSource?.readyState === EventSource.CLOSED) {
						startLogStreaming();
					}
				}, 5000);
			};
		} catch (error) {
			console.error('Failed to start log streaming:', error);
			isStreaming = false;
		}
	}

	function stopLogStreaming() {
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		isStreaming = false;
	}

	function addLogLine(line: string) {
		logs = [...logs, line].slice(-maxLines);
		if (autoScroll) {
			// Use setTimeout to ensure DOM is updated before scrolling
			setTimeout(scrollToBottom, 0);
		}
	}

	function scrollToBottom() {
		if (terminal) {
			terminal.scrollTop = terminal.scrollHeight;
		}
	}

	function toggleAutoScroll() {
		autoScroll = !autoScroll;
		if (autoScroll) {
			scrollToBottom();
		}
	}

	function clearLogs() {
		logs = [];
	}

	function downloadLogs() {
		const logContent = logs.join('\n');
		const blob = new Blob([logContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `sqdgn-bot-logs-${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function getLogLineClass(line: string): string {
		if (line.includes('[ERROR]') || line.includes('ERROR:')) {
			return 'text-red-400';
		}
		if (line.includes('[WARN]') || line.includes('WARN:')) {
			return 'text-yellow-400';
		}
		if (line.includes('[INFO]') || line.includes('INFO:')) {
			return 'text-blue-400';
		}
		if (line.includes('✅')) {
			return 'text-green-400';
		}
		if (line.includes('🔍') || line.includes('📋')) {
			return 'text-purple-400';
		}
		if (line.includes('💓')) {
			return 'text-pink-400';
		}
		return 'text-gray-300';
	}
</script>

<div class="bg-white rounded-lg shadow-sm border">
	<div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<h3 class="text-lg font-medium text-gray-900">{title}</h3>
			<div class="flex items-center space-x-2">
				<div class="w-2 h-2 rounded-full {isStreaming ? 'bg-green-500' : 'bg-red-500'}"></div>
				<span class="text-sm text-gray-600">
					{isStreaming ? 'Live' : 'Disconnected'}
				</span>
			</div>
		</div>
		
		<div class="flex items-center space-x-2">
			<button
				on:click={toggleAutoScroll}
				class="px-3 py-1 text-xs font-medium rounded-md transition-colors {autoScroll ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}"
				title="Toggle auto-scroll"
			>
				Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
			</button>
			
			<button
				on:click={downloadLogs}
				class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
				title="Download logs"
			>
				Download
			</button>
			
			<button
				on:click={clearLogs}
				class="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
				title="Clear logs"
			>
				Clear
			</button>
		</div>
	</div>
	
	<div 
		bind:this={terminal}
		class="bg-gray-900 text-sm font-mono overflow-y-auto p-4 space-y-1"
		style="height: {height}; max-height: {height};"
	>
		{#if logs.length === 0}
			<div class="text-gray-500 text-center py-8">
				No logs available
			</div>
		{:else}
			{#each logs as line}
				<div class="whitespace-pre-wrap break-all {getLogLineClass(line)}">
					{line}
				</div>
			{/each}
		{/if}
	</div>
</div>