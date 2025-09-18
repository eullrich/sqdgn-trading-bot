import { PrismaClient } from '@prisma/client';

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
  });

  try {
    console.log('🔄 Testing database connection...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');

    // Test creating a simple audit log
    console.log('🔄 Testing audit log creation...');
    const auditLog = await prisma.auditLog.create({
      data: {
        eventType: 'TEST_CONNECTION',
        entityType: 'DATABASE',
        details: { message: 'Database migration test successful' }
      }
    });
    console.log('✅ Audit log created:', auditLog.id);

    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});