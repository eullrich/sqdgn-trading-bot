<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to calls page as the main landing
		goto('/calls');
	});
</script>

<svelte:head>
	<title>SQDGN Trading Bot</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center" style="background-color: var(--sqdgn-bg);">
	<div class="text-center">
		<div class="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full mx-auto mb-4" style="color: var(--sqdgn-accent);"></div>
		<p style="color: var(--sqdgn-text-muted);">Redirecting...</p>
	</div>
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