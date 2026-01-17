#!/usr/bin/env node

/**
 * Migrate Photo Albums to Bilingual Schema (Pl/En)
 *
 * Copies existing single-language fields to bilingual fields:
 * - title → titlePl, titleEn = "[EN translation needed]"
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
async function migratePhotoAlbums() {
  console.log('🚀 Starting Photo Albums i18n migration...\n');

  try {
    // Fetch all photo albums
    const albums = await client.fetch(`
      *[_type == "photoAlbum"] {
        _id,
        title,
        titlePl,
        titleEn
      }
    `);

    console.log(`📋 Found ${albums.length} photo albums to process\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const album of albums) {
      // Check if already migrated (has new bilingual fields)
      if (album.titlePl && album.titleEn) {
        console.log(`⏭️  Skipping "${album.title || album.titlePl}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare patch data
      const patchData = {};

      // Migrate title
      if (album.title && !album.titlePl) {
        patchData.titlePl = album.title;
        patchData.titleEn = PLACEHOLDER_EN;
      }

      // Only patch if there's data to migrate
      if (Object.keys(patchData).length === 0) {
        console.log(`⏭️  Skipping "${album.title}" - no data to migrate`);
        skippedCount++;
        continue;
      }

      // Apply patch
      await client
        .patch(album._id)
        .set(patchData)
        .commit();

      console.log(`✅ Migrated "${album.title}"`);
      migratedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${albums.length}`);
    console.log('\n✨ Migration completed successfully!');
    console.log('ℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify migrated photo albums');
    console.log('   2. Add English translations to replace "[EN translation needed]"');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migratePhotoAlbums();
