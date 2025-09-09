<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';
	
	export let data: LayoutData;
	export let params: Record<string, string>;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<nav class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-gray-900">
						SQDGN Trading Bot
					</h1>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
						Dashboard
					</a>
					<a href="/calls" data-sveltekit-preload-data="off" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
						Calls
					</a>
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
	}
	
	:global(*) {
		box-sizing: border-box;
	}
</style>
