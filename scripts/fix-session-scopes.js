/**
 * Script to delete sessions and force re-authorization
 * Run: node scripts/fix-session-scopes.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSessions() {
  try {
    const shop = 'd2c-apps.myshopify.com';
    
    console.log(`🗑️  Deleting all sessions for shop: ${shop}\n`);

    const result = await prisma.session.deleteMany({
      where: { shop },
    });

    console.log(`✅ Deleted ${result.count} session(s)`);
    console.log('\nNext steps:');
    console.log('1. Go to your app in Shopify admin');
    console.log('2. You will be redirected to re-authorize');
    console.log('3. Grant the new scopes: read_themes, write_themes, read_products');
    console.log('4. After re-authorization, check /app/debug-scopes to verify scopes');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSessions();
