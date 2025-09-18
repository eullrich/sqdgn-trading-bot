#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🗑️  Starting database cleanup...');

    // Clear all calls data
    const deletedCalls = await prisma.call.deleteMany({});
    console.log(`✅ Deleted ${deletedCalls.count} calls`);

    // Clear price snapshots
    const deletedSnapshots = await prisma.tokenPriceSnapshot.deleteMany({});
    console.log(`✅ Deleted ${deletedSnapshots.count} price snapshots`);

    // Clear audit logs (optional - comment out if you want to keep logs)
    const deletedLogs = await prisma.auditLog.deleteMany({});
    console.log(`✅ Deleted ${deletedLogs.count} audit logs`);

    console.log('🎉 Database cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();