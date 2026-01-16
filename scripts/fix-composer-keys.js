#!/usr/bin/env node

/**
 * Fix missing _key in composer works array
 *
 * Adds _key to each work in the works array for all composer documents
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

async function fixComposerKeys() {
  console.log('🔧 Fixing missing _key in composer works\n');

  // Fetch all composer documents
  const composers = await client.fetch('*[_type == "composer"]');
  console.log(`Found ${composers.length} composers\n`);

  for (const composer of composers) {
    console.log(`Processing: ${composer.name}`);

    // Check if works have _key
    const needsFix = composer.works && composer.works.some(work => !work._key);

    if (!needsFix) {
      console.log('  ✓ Already has keys, skipping\n');
      continue;
    }

    // Add _key to each work
    const fixedWorks = composer.works.map(work => {
      if (work._key) return work; // Already has key
      return {
        ...work,
        _key: nanoid(), // Generate unique key
      };
    });

    // Patch the document
    await client
      .patch(composer._id)
      .set({ works: fixedWorks })
      .commit();

    console.log(`  ✓ Fixed ${fixedWorks.length} works\n`);
  }

  console.log('✅ All composers fixed!');
}

fixComposerKeys().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
