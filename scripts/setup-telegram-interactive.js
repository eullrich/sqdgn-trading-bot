import pkg from 'telegram';
const { TelegramClient } = pkg;
import { StringSession } from 'telegram/sessions/index.js';
import { input } from '@inquirer/prompts';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function setupTelegramInteractive() {
    const apiId = parseInt(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER;

    console.log('🚀 Interactive Telegram Setup');
    console.log(`📱 Phone: ${phoneNumber}`);

    const session = new StringSession('');
    const client = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 5,
    });

    try {
        await client.start({
            phoneNumber: () => phoneNumber,
            password: async () => {
                return await input({
                    message: '🔐 Enter your 2FA password (leave empty if not enabled):',
                    type: 'password',
                });
            },
            phoneCode: async () => {
                return await input({
                    message: '📨 Enter the verification code sent to your phone:',
                });
            },
            onError: (err) => {
                console.error('❌ Error:', err.message);
            },
        });

        console.log('✅ Successfully authenticated!');
        
        const sessionString = client.session.save();
        console.log('🔑 Session created');

        // Save session to env file
        const envPath = '.env.local';
        let envContent = fs.readFileSync(envPath, 'utf-8');
        
        if (envContent.includes('TELEGRAM_SESSION_STRING=')) {
            envContent = envContent.replace(
                /TELEGRAM_SESSION_STRING=.*/,
                `TELEGRAM_SESSION_STRING=${sessionString}`
            );
        } else {
            envContent += `\nTELEGRAM_SESSION_STRING=${sessionString}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('💾 Session saved to .env.local');

        // Test channel access
        const channelUsername = process.env.SQDGN_CHANNEL_USERNAME;
        if (channelUsername) {
            try {
                console.log(`🔍 Testing access to channel: ${channelUsername}`);
                const channel = await client.getEntity(channelUsername);
                console.log(`✅ Channel found: ${channel.title}`);
                
                // Get recent messages
                const messages = await client.getMessages(channel, { limit: 3 });
                console.log(`📬 Found ${messages.length} recent messages`);
                
                if (messages.length > 0) {
                    console.log('📝 Latest message preview:');
                    console.log(`"${messages[0].text?.substring(0, 200)}..."`);
                }
            } catch (error) {
                console.error(`❌ Error accessing channel:`, error.message);
            }
        }

        await client.disconnect();
        console.log('🎉 Setup complete!');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

setupTelegramInteractive();