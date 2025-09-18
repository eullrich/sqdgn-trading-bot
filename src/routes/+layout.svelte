<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import ModernHeader from '$lib/components/ModernHeader.svelte';
	import type { LayoutData } from './$types';
	
	export let data: LayoutData;
	export let params: Record<string, string>;
	
	// Suppress unused variable warnings - these are SvelteKit layout props
	data, params;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://cdn.tailwindcss.com"></script>
	<style>
		:root {
			--sqdgn-bg: #0a0a0a;
			--sqdgn-surface: #1a1a1a;
			--sqdgn-accent: #4d65ff;
			--sqdgn-text: #ffffff;
			--sqdgn-text-muted: #a3a3a3;
			--sqdgn-border: #2a2a2a;
			--sqdgn-hover: #5b72ff;
		}
	</style>
</svelte:head>

<main class="min-h-screen" style="background-color: var(--sqdgn-bg);">
	<nav style="background-color: var(--sqdgn-surface); border-bottom: 1px solid var(--sqdgn-border);" class="shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold" style="color: var(--sqdgn-text);">
						SQDGN Trading Bot
					</h1>
				</div>
				<div class="flex items-center space-x-6">
					<a href="/calls" class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-opacity-10" 
					   style="color: var(--sqdgn-text-muted);" 
					   onmouseover="this.style.color='var(--sqdgn-accent)'" 
					   onmouseout="this.style.color='var(--sqdgn-text-muted)'">
						Calls
					</a>
					<a href="/trades" class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-opacity-10" 
					   style="color: var(--sqdgn-text-muted);" 
					   onmouseover="this.style.color='var(--sqdgn-accent)'" 
					   onmouseout="this.style.color='var(--sqdgn-text-muted)'">
						Trades
					</a>
					<a href="/stats" class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-opacity-10" 
					   style="color: var(--sqdgn-text-muted);" 
					   onmouseover="this.style.color='var(--sqdgn-accent)'" 
					   onmouseout="this.style.color='var(--sqdgn-text-muted)'">
						Stats
					</a>
					<ModernHeader />
				</div>
			</div>
		</div>
	</nav>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<slot />
	</div>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		margin: 0;
		/* Prevent white flash on page load */
		background-color: var(--sqdgn-bg);
		transition: background-color 0.1s ease;
	}

	:global(*) {
		box-sizing: border-box;
	}

	/* Prevent flash of unstyled content */
	:global(html) {
		background-color: #0a0a0a;
	}

	/* Smooth transitions for all elements */
	:global(main, nav, div) {
		transition: background-color 0.1s ease, opacity 0.1s ease;
	}
</style>
