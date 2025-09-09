import pkg from 'telegram';
const { TelegramClient } = pkg;
import { StringSession } from 'telegram/sessions/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testTelegramConnection() {
    const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
    const apiHash = process.env.TELEGRAM_API_HASH || '';
    const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER || '';

    console.log('📋 Configuration:');
    console.log(`API ID: ${apiId}`);
    console.log(`API Hash: ${apiHash ? '✓ Present' : '✗ Missing'}`);
    console.log(`Phone: ${phoneNumber}`);

    if (!apiId || !apiHash || !phoneNumber) {
        console.error('❌ Missing required environment variables');
        process.exit(1);
    }

    const session = new StringSession('');
    const client = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 3,
        timeout: 10000,
    });

    try {
        console.log('🔌 Connecting to Telegram...');
        
        await client.start({
            phoneNumber: () => phoneNumber,
            password: () => {
                console.log('🔐 2FA password required (if enabled)');
                return ''; // Empty for now
            },
            phoneCode: () => {
                console.log('📨 Phone verification code required');
                throw new Error('Manual phone verification needed - check your phone!');
            },
            onError: (err) => {
                console.error('❌ Client error:', err.message);
            },
        });

        console.log('✅ Successfully connected!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('PHONE_NUMBER_BANNED')) {
            console.log('\n💡 Troubleshooting suggestions:');
            console.log('1. Verify your phone number is correct');
            console.log('2. Check if you can log into Telegram normally');
            console.log('3. Try using a different device/network');
            console.log('4. Wait a few hours and try again');
            console.log('5. Contact Telegram support if the issue persists');
        }
    } finally {
        try {
            await client.disconnect();
            console.log('🔌 Disconnected');
        } catch (e) {
            // Ignore disconnect errors
        }
    }
}

testTelegramConnection();