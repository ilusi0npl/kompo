#!/usr/bin/env node

/**
 * Migrate Bio Profiles to Bilingual Schema (Pl/En)
 *
 * Copies existing single-language fields to bilingual fields:
 * - name → namePl, nameEn = "[EN translation needed]"
 * - paragraphs → paragraphsPl, paragraphsEn = [array with placeholders]
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
async function migrateBioProfiles() {
  console.log('🚀 Starting Bio Profiles i18n migration...\n');

  try {
    // Fetch all bio profiles
    const profiles = await client.fetch(`
      *[_type == "bioProfile"] {
        _id,
        name,
        namePl,
        nameEn,
        paragraphs,
        paragraphsPl,
        paragraphsEn
      }
    `);

    console.log(`📋 Found ${profiles.length} bio profiles to process\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const profile of profiles) {
      // Check if already migrated (has new bilingual fields)
      if (profile.namePl && profile.nameEn) {
        console.log(`⏭️  Skipping "${profile.name || profile.namePl}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare patch data
      const patchData = {};

      // Migrate name
      if (profile.name && !profile.namePl) {
        patchData.namePl = profile.name;
        patchData.nameEn = PLACEHOLDER_EN;
      }

      // Migrate paragraphs
      if (profile.paragraphs && !profile.paragraphsPl) {
        patchData.paragraphsPl = profile.paragraphs;

        // Create English placeholder array with same length
        patchData.paragraphsEn = profile.paragraphs.map(() => PLACEHOLDER_EN);
      }

      // Only patch if there's data to migrate
      if (Object.keys(patchData).length === 0) {
        console.log(`⏭️  Skipping "${profile.name}" - no data to migrate`);
        skippedCount++;
        continue;
      }

      // Apply patch
      await client
        .patch(profile._id)
        .set(patchData)
        .commit();

      console.log(`✅ Migrated "${profile.name}"`);
      migratedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${profiles.length}`);
    console.log('\n✨ Migration completed successfully!');
    console.log('ℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify migrated bio profiles');
    console.log('   2. Add English translations to replace "[EN translation needed]"');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateBioProfiles();
