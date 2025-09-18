<script lang="ts">
	import { onMount } from 'svelte';
	import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
	import { browser } from '$app/environment';
	
	export let onConnect: (address: string) => void = () => {};
	export let onDisconnect: () => void = () => {};
	
	let phantomProvider: any = null;
	let walletPublicKey: string | null = null;
	let connecting = false;
	let connected = false;
	
	onMount(() => {
		if (browser) {
			checkIfWalletIsConnected();
			
			// Listen for account changes
			if (window.solana) {
				window.solana.on('accountChanged', (publicKey: PublicKey | null) => {
					if (publicKey) {
						walletPublicKey = publicKey.toString();
						connected = true;
						onConnect(walletPublicKey);
					} else {
						disconnect();
					}
				});
			}
		}
	});
	
	async function checkIfWalletIsConnected() {
		try {
			const provider = getProvider();
			if (provider) {
				phantomProvider = provider;
				
				// Check if already connected
				const resp = await provider.connect({ onlyIfTrusted: true });
				walletPublicKey = resp.publicKey.toString();
				connected = true;
				onConnect(walletPublicKey);
			}
		} catch (error) {
			console.log('Wallet not connected yet');
		}
	}
	
	function getProvider() {
		if ('solana' in window) {
			const provider = (window as any).solana;
			if (provider.isPhantom) {
				return provider;
			}
		}
		return null;
	}
	
	async function connectWallet() {
		if (connecting) return;
		
		connecting = true;
		try {
			const provider = getProvider();
			if (!provider) {
				window.open('https://phantom.app/', '_blank');
				return;
			}
			
			phantomProvider = provider;
			const resp = await provider.connect();
			walletPublicKey = resp.publicKey.toString();
			connected = true;
			onConnect(walletPublicKey);
		} catch (error) {
			console.error('Failed to connect wallet:', error);
		} finally {
			connecting = false;
		}
	}
	
	async function disconnect() {
		if (phantomProvider) {
			await phantomProvider.disconnect();
		}
		walletPublicKey = null;
		connected = false;
		onDisconnect();
	}
	
	function truncateAddress(address: string): string {
		if (!address) return '';
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}
</script>

{#if connected && walletPublicKey}
	<div class="flex items-center space-x-2">
		<button
			class="px-3 py-1 text-xs rounded flex items-center space-x-2 transition-all"
			style="background-color: var(--sqdgn-surface); border: 1px solid var(--sqdgn-border); color: var(--sqdgn-text-muted);"
			on:click={disconnect}
			onmouseover="this.style.borderColor='var(--sqdgn-accent)'"
			onmouseout="this.style.borderColor='var(--sqdgn-border)'"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
				<circle cx="12" cy="12" r="3" fill="var(--sqdgn-accent)"/>
			</svg>
			<span>{truncateAddress(walletPublicKey)}</span>
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>
	</div>
{:else}
	<button
		class="px-3 py-1 text-xs rounded flex items-center space-x-2 transition-all disabled:opacity-50"
		style="background-color: var(--sqdgn-accent); color: white;"
		on:click={connectWallet}
		disabled={connecting}
		onmouseover="this.style.backgroundColor='var(--sqdgn-hover)'"
		onmouseout="this.style.backgroundColor='var(--sqdgn-accent)'"
	>
		{#if connecting}
			<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
			</svg>
			<span>Connecting...</span>
		{:else}
			<svg class="w-4 h-4" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill="url(#phantom-gradient)" d="M20.5714 2C31.3604 2 40.1429 10.7824 40.1429 21.5714C40.1429 32.3604 31.3604 41.1429 20.5714 41.1429C9.78245 41.1429 1 32.3604 1 21.5714C1 16.0184 3.10357 10.9643 6.61426 7.14286H24.8929C30.3214 7.14286 34.75 11.5714 34.75 17C34.75 22.4286 30.3214 26.8571 24.8929 26.8571H16.2857C13.5714 26.8571 11.3571 24.6429 11.3571 21.9286C11.3571 19.2143 13.5714 17 16.2857 17H24.8929C26.25 17 27.3571 18.1071 27.3571 19.4643C27.3571 20.8214 26.25 21.9286 24.8929 21.9286H16.2857"/>
				<defs>
					<linearGradient id="phantom-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:#AB9FF2;stop-opacity:1" />
						<stop offset="100%" style="stop-color:#512DA8;stop-opacity:1" />
					</linearGradient>
				</defs>
			</svg>
			<span>Connect Phantom</span>
		{/if}
	</button>
{/if}

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>