/**
 * Script to check and fix session scopes
 * Run: node scripts/check-session-scopes.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSessions() {
  try {
    console.log('🔍 Checking sessions in database...\n');

    const sessions = await prisma.session.findMany({
      where: {
        shop: 'd2c-apps.myshopify.com',
      },
    });

    if (sessions.length === 0) {
      console.log('❌ No sessions found for d2c-apps.myshopify.com');
      return;
    }

    console.log(`✅ Found ${sessions.length} session(s):\n`);

    sessions.forEach((session, index) => {
      console.log(`Session ${index + 1}:`);
      console.log(`  ID: ${session.id}`);
      console.log(`  Shop: ${session.shop}`);
      console.log(`  Scope: ${session.scope || 'null'}`);
      console.log(`  Scope Type: ${typeof session.scope}`);
      console.log(`  Has read_themes: ${(session.scope || '').includes('read_themes') ? '✅' : '❌'}`);
      console.log(`  Has write_themes: ${(session.scope || '').includes('write_themes') ? '✅' : '❌'}`);
      console.log(`  Has read_products: ${(session.scope || '').includes('read_products') ? '✅' : '❌'}`);
      console.log(`  Access Token: ${session.accessToken ? 'Present' : 'Missing'}`);
      console.log(`  Expires: ${session.expires || 'Never'}`);
      console.log('');
    });

    // Check if any session has read_themes
    const hasReadThemes = sessions.some(s => (s.scope || '').includes('read_themes'));
    
    if (!hasReadThemes) {
      console.log('⚠️  WARNING: No session has read_themes scope!');
      console.log('\nTo fix this:');
      console.log('1. Delete all sessions: DELETE FROM Session WHERE shop = "d2c-apps.myshopify.com"');
      console.log('2. Or use: /app/clear-session route');
      console.log('3. Then re-authorize the app');
    } else {
      console.log('✅ At least one session has read_themes scope');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSessions();
