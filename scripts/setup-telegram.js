import pkg from 'telegram';
const { TelegramClient } = pkg;
import { StringSession } from 'telegram/sessions/index.js';
import { input } from '@inquirer/prompts';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function setupTelegram() {
    const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
    const apiHash = process.env.TELEGRAM_API_HASH || '';
    const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER || '';

    if (!apiId || !apiHash || !phoneNumber) {
        console.error('❌ Missing required environment variables:');
        console.error('- TELEGRAM_API_ID');
        console.error('- TELEGRAM_API_HASH'); 
        console.error('- TELEGRAM_PHONE_NUMBER');
        console.error('\nPlease update your .env.local file with credentials from https://my.telegram.org');
        process.exit(1);
    }

    console.log('🚀 Setting up Telegram Client API connection...');
    console.log(`📱 Phone number: ${phoneNumber}`);

    const session = new StringSession('');
    const client = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 5,
    });

    try {
        await client.start({
            phoneNumber: async () => phoneNumber,
            password: async () => {
                const password = await input({
                    message: '🔐 Enter your 2FA password (leave empty if not enabled):',
                    type: 'password',
                });
                return password;
            },
            phoneCode: async () => {
                const code = await input({
                    message: '📨 Enter the verification code sent to your phone:',
                });
                return code;
            },
            onError: (err) => {
                console.error('❌ Authentication error:', err);
            },
        });

        console.log('✅ Successfully authenticated with Telegram!');
        
        const sessionString = client.session.save();
        console.log('🔑 Session string generated');

        // Update .env.local with session string
        const envPath = '.env.local';
        let envContent = fs.readFileSync(envPath, 'utf-8');
        
        // Add or update session string
        if (envContent.includes('TELEGRAM_SESSION_STRING=')) {
            envContent = envContent.replace(
                /TELEGRAM_SESSION_STRING=.*/,
                `TELEGRAM_SESSION_STRING=${sessionString}`
            );
        } else {
            envContent += `\nTELEGRAM_SESSION_STRING=${sessionString}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('💾 Session string saved to .env.local');

        // Test channel access
        const channelUsername = process.env.SQDGN_CHANNEL_USERNAME;
        if (channelUsername) {
            try {
                console.log(`🔍 Testing access to channel: ${channelUsername}`);
                const channel = await client.getEntity(channelUsername);
                console.log(`✅ Successfully connected to channel: ${channel.title}`);
                
                // Get recent messages to test
                const messages = await client.getMessages(channel, { limit: 5 });
                console.log(`📬 Found ${messages.length} recent messages`);
                
                if (messages.length > 0) {
                    console.log(`📝 Latest message preview: "${messages[0].text?.substring(0, 100)}..."`);
                }
            } catch (error) {
                console.error(`❌ Error accessing channel ${channelUsername}:`, error);
                console.log('💡 Make sure you have access to this channel and the username is correct');
            }
        }

        await client.disconnect();
        console.log('🎉 Setup complete! You can now run the application.');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

setupTelegram();