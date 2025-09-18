#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🛑 Stopping all monitoring services...');

try {
  // Try to stop any existing Telegram clients
  const { getTelegramClient } = await import('../src/lib/server/telegram-client.js');
  const client = getTelegramClient();
  
  if (client.isClientConnected) {
    console.log('🔌 Disconnecting old Telegram client...');
    await client.disconnect();
    console.log('✅ Old Telegram client disconnected');
  } else {
    console.log('ℹ️ No active Telegram client found');
  }
  
} catch (error) {
  console.log('ℹ️ Could not access old Telegram client (likely not running)');
}

try {
  // Try to stop the simplified monitor if it exists
  const { resetTelegramMonitor } = await import('../src/lib/server/services/telegram-monitor.js');
  resetTelegramMonitor();
  console.log('✅ Reset simplified Telegram monitor');
} catch (error) {
  console.log('ℹ️ Could not access simplified monitor');
}

console.log('✅ All monitoring services stopped');
console.log('');
console.log('To start monitoring with the new system:');
console.log('curl -X POST http://localhost:5173/api/telegram/monitor/start \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"fetchHistory": false}\'');