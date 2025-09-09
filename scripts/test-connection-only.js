import pkg from 'telegram';
const { TelegramClient } = pkg;
import { StringSession } from 'telegram/sessions/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnectionOnly() {
    const apiId = parseInt(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    
    console.log('🧪 Testing basic Telegram connection...');
    console.log(`API ID: ${apiId}`);
    console.log(`API Hash: ${apiHash ? 'Present' : 'Missing'}`);
    
    const session = new StringSession('');
    const client = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 1,
        timeout: 5000,
    });

    try {
        console.log('🔌 Attempting connection...');
        await client.connect();
        console.log('✅ Basic connection successful!');
        
        // Don't try to authenticate, just test connection
        console.log('📊 Connection info:');
        console.log(`Connected: ${client.connected}`);
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('api_id')) {
            console.log('💡 API ID issue - verify at my.telegram.org');
        } else if (error.message.includes('api_hash')) {
            console.log('💡 API Hash issue - verify at my.telegram.org');
        } else {
            console.log('💡 Network or server issue');
        }
    } finally {
        try {
            await client.disconnect();
            console.log('🔌 Disconnected cleanly');
        } catch (e) {
            console.log('⚠️ Disconnect error (normal)');
        }
    }
}

testConnectionOnly();