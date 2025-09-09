import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pkg from 'telegram';
import { StringSession } from 'telegram/sessions';

const { TelegramClient } = pkg;

// Store active sessions globally (in production, use Redis or database)
if (!global.activeSessions) {
	global.activeSessions = new Map<string, {
		client: TelegramClient;
		sessionId: string;
		needsVerification?: boolean;
		needsPassword?: boolean;
	}>();
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { apiId, apiHash, phoneNumber } = await request.json();

		if (!apiId || !apiHash || !phoneNumber) {
			return json({
				success: false,
				error: 'API ID, API Hash, and phone number are required'
			}, { status: 400 });
		}

		// Create a new session
		const session = new StringSession('');
		const client = new TelegramClient(session, apiId, apiHash, {
			connectionRetries: 1,
			timeout: 10000, // 10 second timeout
		});

		console.log('Attempting to connect to Telegram...');

		// Generate a session ID for tracking
		const sessionId = Math.random().toString(36).substring(2, 15);

		// Store the session before starting the authentication process
		global.activeSessions.set(sessionId, {
			client,
			sessionId,
			apiId,
			apiHash,
			phoneNumber,
			needsVerification: false,
			needsPassword: false,
			phoneCodeHash: null, // Will be set when we get the code hash
			verificationCode: null,
			password: null,
			verificationPromiseResolve: null,
			passwordPromiseResolve: null,
			authCompleted: false
		});

		try {
			// Connect to Telegram first
			console.log('⚡ Connecting to Telegram...');
			await client.connect();
			console.log('✅ Connected to Telegram successfully');

			// Use flags to track what callbacks were triggered
			let codeRequested = false;
			let passwordRequested = false;
			let authCompleted = false;
			
			// Start the login process with a timeout
			const loginPromise = client.start({
				phoneNumber: async () => {
					console.log('📞 Phone number requested:', phoneNumber);
					return phoneNumber;
				},
				password: async () => {
					console.log('🔐 2FA password requested');
					passwordRequested = true;
					
					// Update session flags
					if (global.activeSessions.has(sessionId)) {
						const sessionData = global.activeSessions.get(sessionId)!;
						sessionData.needsPassword = true;
						sessionData.needsVerification = false;
						
						// If we already have a password, return it
						if (sessionData.password) {
							console.log('🔐 Using stored 2FA password');
							return sessionData.password;
						}
						
						// Otherwise, wait for the password via the API
						console.log('🔐 Waiting for 2FA password from user via API...');
						return new Promise((resolve) => {
							sessionData.passwordPromiseResolve = resolve;
						});
					}
					
					console.log('⚠️ Session not found during password callback');
					throw new Error('Session expired');
				},
				phoneCode: async () => {
					console.log('📱 Verification code callback triggered - Telegram requesting code');
					codeRequested = true;
					
					// Update session flags
					if (global.activeSessions.has(sessionId)) {
						const sessionData = global.activeSessions.get(sessionId)!;
						sessionData.needsVerification = true;
						
						// If we already have a verification code, return it
						if (sessionData.verificationCode) {
							console.log('📱 Using stored verification code');
							return sessionData.verificationCode;
						}
						
						// First, let Telegram send the code by throwing an error that we catch
						// This ensures the verification code gets sent to the user's device
						console.log('📱 Throwing error to trigger code sending, then will wait for user input');
						throw new Error('VERIFICATION_CODE_NEEDED');
					}
					
					console.log('⚠️ Session not found during phoneCode callback');
					throw new Error('Session expired');
				},
				onError: (err) => {
					console.error('Telegram client onError callback:', err);
					throw err;
				},
			}).then((result) => {
				console.log('✅ Authentication completed successfully');
				authCompleted = true;
				
				// Update session to mark auth as completed
				if (global.activeSessions.has(sessionId)) {
					global.activeSessions.get(sessionId)!.authCompleted = true;
				}
				
				return client.session.save();
			});
			
			// Race the login promise against a timeout
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => {
					console.log(`⏱️ Timeout triggered after 15 seconds!`);
					console.log(`📊 Flags: codeRequested=${codeRequested}, passwordRequested=${passwordRequested}, authCompleted=${authCompleted}`);
					reject(new Error('LOGIN_TIMEOUT_EXPECTED'));
				}, 15000); // 15 second timeout - plenty of time for verification code to be requested
			});
			
			try {
				const sessionString = await Promise.race([loginPromise, timeoutPromise]);
				
				// If we get here, login was completely successful
				console.log('🎉 Login completed successfully with session string');
				try {
					await client.disconnect();
				} catch (disconnectError) {
					console.error('Error disconnecting after success:', disconnectError);
				}
				
				return json({
					success: true,
					sessionString,
					message: 'Successfully connected to Telegram'
				});
				
			} catch (authError) {
				console.error('Auth process result:', authError);
				const errorMessage = authError instanceof Error ? authError.message : 'Unknown error';
				
				// Handle "Code is empty" error when we've requested verification
				if (errorMessage === 'Code is empty' && codeRequested) {
					console.log('📱 Code is empty error with verification requested - keeping client connected');
					// Keep client connected for verification - DO NOT disconnect
					return json({
						success: true,
						needsVerification: true,
						sessionId,
						message: 'Verification code sent to your Telegram app'
					});
				}
				
				if (errorMessage === 'LOGIN_TIMEOUT_EXPECTED') {
					// This is our expected timeout - check what was requested
					console.log(`🔍 Checking timeout reason: codeRequested=${codeRequested}, passwordRequested=${passwordRequested}`);
					
					if (codeRequested) {
						console.log('✅ Returning verification needed response - keeping client connected');
						// Keep client connected for verification - DO NOT disconnect
						return json({
							success: true,
							needsVerification: true,
							sessionId,
							message: 'Verification code sent to your Telegram app'
						});
					}
					
					if (passwordRequested) {
						console.log('✅ Returning 2FA password needed response');
						return json({
							success: true,
							needsPassword: true,
							sessionId,
							message: 'Please enter your 2FA password'
						});
					}
					
					// If neither was requested, something unexpected happened
					console.log('❌ Timeout occurred but no code or password was requested');
					try {
						await client.disconnect();
					} catch (disconnectError) {
						console.error('Error disconnecting:', disconnectError);
					}
					throw new Error('Unexpected timeout during login');
				}
				
				
				// For other errors, clean up and continue to error handling
				console.log('🔍 Error cleanup - checking if this was a successful verification request');
				if (codeRequested || passwordRequested) {
					console.log('🚫 Skipping disconnect - verification was requested successfully');
					throw authError; // Don't disconnect, just propagate error for outer handling
				}
				
				try {
					await client.disconnect();
				} catch (disconnectError) {
					console.error('Error disconnecting:', disconnectError);
				}
				throw authError;
			}

		} catch (error) {
			console.error('Login process error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			
			// Don't handle LOGIN_TIMEOUT_EXPECTED here - it should be handled in the inner catch
			if (errorMessage === 'LOGIN_TIMEOUT_EXPECTED') {
				console.error('LOGIN_TIMEOUT_EXPECTED leaked to outer catch - this should not happen');
				return json({
					success: false,
					error: 'Internal error: timeout handling failed'
				}, { status: 500 });
			}
			
			// For all other errors, disconnect and clean up
			console.log('🔍 Outer error cleanup - checking if verification was requested');
			if (codeRequested || passwordRequested) {
				console.log('🚫 Skipping disconnect and cleanup - verification was requested successfully');
				// Don't disconnect or clean up session - verification endpoint needs it
			} else {
				try {
					await client.disconnect();
				} catch (disconnectError) {
					console.error('Error disconnecting client:', disconnectError);
				}

				// Clean up session data
				if (global.activeSessions.has(sessionId)) {
					global.activeSessions.delete(sessionId);
				}
			}

			// Handle specific Telegram errors
			if (errorMessage.includes('API_ID_INVALID')) {
				return json({
					success: false,
					error: 'Invalid API ID. Please check your Telegram API credentials.'
				}, { status: 400 });
			}

			if (errorMessage.includes('API_ID_PUBLISHED_FLOOD')) {
				return json({
					success: false,
					error: 'API ID rate limited. Please try again later.'
				}, { status: 429 });
			}

			if (errorMessage.includes('PHONE_NUMBER_INVALID')) {
				return json({
					success: false,
					error: 'Invalid phone number format. Please use international format (e.g., +1234567890).'
				}, { status: 400 });
			}

			if (errorMessage === 'LOGIN_TIMEOUT') {
				return json({
					success: false,
					error: 'Login request timed out. Please check your internet connection and API credentials.'
				}, { status: 408 });
			}
			
			throw error;
		}

	} catch (error) {
		console.error('Telegram login error:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to connect to Telegram'
		}, { status: 500 });
	}
};