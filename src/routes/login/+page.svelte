<script lang="ts">
	import { goto } from '$app/navigation';
	
	let step = 'credentials'; // 'credentials', 'verification', 'success'
	let loading = false;
	let error = '';
	
	// Form data
	let phoneNumber = '';
	let verificationCode = '';
	let password = '';
	
	// Session data
	let sessionString = '';
	let sessionId = '';
	let needsVerification = false;
	let needsPassword = false;

	async function submitCredentials() {
		if (!phoneNumber) {
			error = 'Please enter your phone number';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/telegram-login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					phoneNumber
				})
			});

			const result = await response.json();
			console.log('Login result:', result);

			// Check for verification or password requirements first (these can come with success=true)
			if (result.needsVerification) {
				needsVerification = true;
				needsPassword = false;
				sessionId = result.sessionId;
				step = 'verification';
				error = ''; // Clear any previous errors
				console.log('Switching to verification step. SessionId:', sessionId);
			} else if (result.needsPassword) {
				needsPassword = true;
				needsVerification = false;
				sessionId = result.sessionId;
				step = 'verification';
				error = ''; // Clear any previous errors
				console.log('Switching to password step. SessionId:', sessionId);
			} else if (result.sessionString) {
				// Success - got session string
				sessionString = result.sessionString;
				// Store session in cookie
				document.cookie = `telegram_session=${sessionString}; path=/; max-age=${60*60*24*30}`;
				step = 'success';
			} else if (result.success === false) {
				// Handle explicit errors
				error = result.error || 'Login failed';
				console.error('Login failed:', error);
			} else {
				// Fallback for unexpected responses
				error = 'Unexpected response from server';
				console.error('Unexpected response:', result);
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error';
		} finally {
			loading = false;
		}
	}

	async function submitVerification() {
		if (needsVerification && !verificationCode) {
			error = 'Please enter the verification code';
			return;
		}
		if (needsPassword && !password) {
			error = 'Please enter your 2FA password';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/telegram-verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId,
					verificationCode: needsVerification ? verificationCode : undefined,
					password: needsPassword ? password : undefined
				})
			});

			const result = await response.json();
			console.log('Verification result:', result);

			if (response.ok) {
				// Session cookie is now set server-side by the verification endpoint
				step = 'success';
			} else {
				error = result.error || 'Verification failed';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error';
		} finally {
			loading = false;
		}
	}

	function proceedToDashboard() {
		// Navigate to dashboard and refresh to reload user state
		goto('/', { replaceState: true });
	}
</script>

<svelte:head>
	<title>Login - SQDGN Trading Bot</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Connect to Telegram
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					Sign in with your Telegram account to access channels
				</p>
			</div>

			{#if error}
				<div class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
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

			{#if step === 'credentials'}
				<form on:submit|preventDefault={submitCredentials} class="space-y-6">
					<div>
						<label for="phoneNumber" class="block text-sm font-medium text-gray-700">
							Phone Number
						</label>
						<div class="mt-1">
							<input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								required
								bind:value={phoneNumber}
								class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="+1234567890"
								disabled={loading}
							/>
						</div>
						<p class="mt-2 text-sm text-gray-600">
							Enter your phone number with country code (e.g., +1 for US)
						</p>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{#if loading}
								<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							{/if}
							Send Verification Code
						</button>
					</div>

					<div class="mt-6">
						<div class="text-xs text-gray-600">
							<p>A verification code will be sent to your Telegram app once you submit your phone number.</p>
						</div>
					</div>
				</form>

			{:else if step === 'verification'}
				<!-- Debug info -->
				<div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
					<p><strong>Debug:</strong> step={step}, needsVerification={needsVerification}, needsPassword={needsPassword}, sessionId={sessionId}</p>
				</div>
				
				<form on:submit|preventDefault={submitVerification} class="space-y-6">
					{#if needsVerification}
						<div>
							<label for="verificationCode" class="block text-sm font-medium text-gray-700">
								Verification Code
							</label>
							<div class="mt-1">
								<input
									id="verificationCode"
									name="verificationCode"
									type="text"
									required
									bind:value={verificationCode}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Enter code from Telegram"
								/>
							</div>
							<p class="mt-2 text-sm text-gray-600">
								Check your Telegram app for a verification code
							</p>
						</div>
					{/if}

					{#if needsPassword}
						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">
								2FA Password
							</label>
							<div class="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									required
									bind:value={password}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Enter your 2FA password"
								/>
							</div>
						</div>
					{/if}

					<div>
						<button
							type="submit"
							disabled={loading}
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{#if loading}
								<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							{/if}
							Verify
						</button>
					</div>
				</form>

			{:else if step === 'success'}
				<div class="text-center">
					<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
						<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
					<h3 class="text-lg font-medium text-gray-900 mb-2">Successfully Connected!</h3>
					<p class="text-sm text-gray-600 mb-6">
						Your Telegram account is now connected. You can access the trading dashboard.
					</p>
					<button
						on:click={proceedToDashboard}
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
					>
						Go to Dashboard
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>