#!/usr/bin/env node

/**
 * Fix missing _key in event program array
 *
 * Adds _key to each program item for all event documents
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { nanoid } from 'nanoid';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

async function fixEventKeys() {
  console.log('🔧 Fixing missing _key in event program\n');

  // Fetch all event documents
  const events = await client.fetch('*[_type == "event"]');
  console.log(`Found ${events.length} events\n`);

  for (const event of events) {
    console.log(`Processing: ${event.title}`);

    // Skip if no program
    if (!event.program || event.program.length === 0) {
      console.log('  - No program, skipping\n');
      continue;
    }

    // Check if program items have _key
    const needsFix = event.program.some(item => !item._key);

    if (!needsFix) {
      console.log('  ✓ Already has keys, skipping\n');
      continue;
    }

    // Add _key to each program item
    const fixedProgram = event.program.map(item => {
      if (item._key) return item; // Already has key
      return {
        ...item,
        _key: nanoid(), // Generate unique key
      };
    });

    // Patch the document
    await client
      .patch(event._id)
      .set({ program: fixedProgram })
      .commit();

    console.log(`  ✓ Fixed ${fixedProgram.length} program items\n`);
  }

  console.log('✅ All events fixed!');
}

fixEventKeys().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
