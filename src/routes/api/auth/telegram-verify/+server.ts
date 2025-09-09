import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pkg from 'telegram';
const { Api } = pkg;

// This would be shared with the login endpoint (in production, use a proper store)
declare global {
	var activeSessions: Map<string, any>;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { sessionId, verificationCode, password } = await request.json();

		if (!sessionId) {
			return json({
				success: false,
				error: 'Session ID is required'
			}, { status: 400 });
		}

		// Get the session from the login endpoint
		const sessionData = global.activeSessions?.get(sessionId);
		
		if (!sessionData || !sessionData.client) {
			return json({
				success: false,
				error: 'Invalid or expired session'
			}, { status: 400 });
		}

		console.log('🔍 Starting verification with:', {
			needsVerification: sessionData.needsVerification,
			needsPassword: sessionData.needsPassword,
			hasVerificationCode: !!verificationCode,
			hasPassword: !!password
		});

		// The verification approach: restart authentication with the provided code
		// Since the original authentication was paused/failed, we need to start a new
		// authentication attempt with the verification code provided by the user
		
		if (sessionData.needsVerification && verificationCode) {
			console.log('📱 User provided verification code, restarting authentication');
			
			const { client, apiId, apiHash, phoneNumber } = sessionData;
			
			try {
				// Restart the authentication process with the verification code
				await client.start({
					phoneNumber: async () => {
						console.log('📞 Phone number requested during verification');
						return phoneNumber;
					},
					phoneCode: async () => {
						console.log('📱 Providing verification code:', verificationCode);
						return verificationCode;
					},
					password: async () => {
						console.log('🔐 2FA password requested during verification');
						// Update session to indicate 2FA is needed
						sessionData.needsPassword = true;
						sessionData.needsVerification = false;
						global.activeSessions.set(sessionId, sessionData);
						throw new Error('2FA_REQUIRED');
					},
					onError: (err) => {
						console.error('Verification auth error:', err);
						throw err;
					}
				});
				
				// Success - authentication completed
				const sessionString = client.session.save();
				console.log('✅ Verification successful, cleaning up');
				
				// Clean up
				await client.disconnect();
				global.activeSessions?.delete(sessionId);

				return json({
					success: true,
					sessionString,
					message: 'Successfully verified and connected to Telegram'
				});
				
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				console.error('Verification error:', errorMessage);
				
				if (errorMessage === '2FA_REQUIRED') {
					return json({
						success: false,
						needsPassword: true,
						error: 'Please enter your 2FA password'
					}, { status: 400 });
				}
				
				// Handle specific verification errors
				let userError = 'Verification failed';
				if (errorMessage.includes('PHONE_CODE_INVALID')) {
					userError = 'Invalid verification code';
				} else if (errorMessage.includes('PHONE_CODE_EXPIRED')) {
					userError = 'Verification code expired';
				}
				
				return json({
					success: false,
					error: userError
				}, { status: 400 });
			}
		}
		
		if (sessionData.needsPassword && password) {
			console.log('🔐 User provided 2FA password, restarting authentication');
			
			const { client, apiId, apiHash, phoneNumber } = sessionData;
			
			try {
				// Restart authentication with 2FA password
				await client.start({
					phoneNumber: async () => {
						console.log('📞 Phone number requested during 2FA');
						return phoneNumber;
					},
					phoneCode: async () => {
						console.log('📱 Code callback during 2FA - should not be needed');
						throw new Error('Verification code already provided');
					},
					password: async () => {
						console.log('🔐 Providing 2FA password');
						return password;
					},
					onError: (err) => {
						console.error('2FA auth error:', err);
						throw err;
					}
				});
				
				// Success - authentication completed
				const sessionString = client.session.save();
				console.log('✅ 2FA verification successful, cleaning up');
				
				// Clean up
				await client.disconnect();
				global.activeSessions?.delete(sessionId);

				return json({
					success: true,
					sessionString,
					message: 'Successfully verified and connected to Telegram'
				});
				
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				console.error('2FA verification error:', errorMessage);
				
				// Handle specific 2FA errors
				let userError = 'Password verification failed';
				if (errorMessage.includes('PASSWORD_HASH_INVALID')) {
					userError = 'Invalid 2FA password';
				}
				
				return json({
					success: false,
					error: userError
				}, { status: 400 });
			}
		}
		
		return json({
			success: false,
			error: 'Missing required verification data'
		}, { status: 400 });

	} catch (error) {
		console.error('Telegram verification error:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Verification failed'
		}, { status: 500 });
	}
};