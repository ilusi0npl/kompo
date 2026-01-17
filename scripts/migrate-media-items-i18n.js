#!/usr/bin/env node

/**
 * Migrate Media Items to Bilingual Schema (Pl/En)
 *
 * Copies existing single-language fields to bilingual fields:
 * - title → titlePl, titleEn = "[EN translation needed]"
 * - description → descriptionPl, descriptionEn = "[EN translation needed]" (if exists)
 *
 * Safe to run multiple times - has duplicate detection
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config();

// Initialize Sanity client
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

const PLACEHOLDER_EN = '[EN translation needed]';

/**
 * Main migration function
 */
async function migrateMediaItems() {
  console.log('🚀 Starting Media Items i18n migration...\n');

  try {
    // Fetch all media items
    const items = await client.fetch(`
      *[_type == "mediaItem"] {
        _id,
        title,
        titlePl,
        titleEn,
        description,
        descriptionPl,
        descriptionEn,
        type
      }
    `);

    console.log(`📋 Found ${items.length} media items to process\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const item of items) {
      // Check if already migrated (has new bilingual fields)
      if (item.titlePl && item.titleEn) {
        console.log(`⏭️  Skipping "${item.title || item.titlePl}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare patch data
      const patchData = {};

      // Migrate title
      if (item.title && !item.titlePl) {
        patchData.titlePl = item.title;
        patchData.titleEn = PLACEHOLDER_EN;
      }

      // Migrate description (optional field - may not exist in old schema)
      if (item.description !== undefined && !item.descriptionPl) {
        patchData.descriptionPl = item.description || '';
        patchData.descriptionEn = item.description ? PLACEHOLDER_EN : '';
      }

      // Only patch if there's data to migrate
      if (Object.keys(patchData).length === 0) {
        console.log(`⏭️  Skipping "${item.title}" - no data to migrate`);
        skippedCount++;
        continue;
      }

      // Apply patch
      await client
        .patch(item._id)
        .set(patchData)
        .commit();

      const typeIcon = item.type === 'photo' ? '📷' : '🎥';
      console.log(`✅ Migrated ${typeIcon} "${item.title}"`);
      migratedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${items.length}`);
    console.log('\n✨ Migration completed successfully!');
    console.log('ℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify migrated media items');
    console.log('   2. Add English translations to replace "[EN translation needed]"');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateMediaItems();
