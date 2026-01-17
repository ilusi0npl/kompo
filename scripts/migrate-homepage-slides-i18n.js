#!/usr/bin/env node

/**
 * Migrate Homepage Slides to Bilingual Schema (Pl/En)
 *
 * Copies existing single-language fields to bilingual fields:
 * - word → wordPl, wordEn = "[EN translation needed]"
 * - tagline → taglinePl, taglineEn = "[EN translation needed]"
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
async function migrateHomepageSlides() {
  console.log('🚀 Starting Homepage Slides i18n migration...\n');

  try {
    // Fetch all homepage slides
    const slides = await client.fetch(`
      *[_type == "homepageSlide"] {
        _id,
        word,
        wordPl,
        wordEn,
        tagline,
        taglinePl,
        taglineEn
      }
    `);

    console.log(`📋 Found ${slides.length} homepage slides to process\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const slide of slides) {
      // Check if already migrated (has new bilingual fields)
      if (slide.wordPl && slide.wordEn) {
        console.log(`⏭️  Skipping "${slide.word || slide.wordPl}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare patch data
      const patchData = {};

      // Migrate word
      if (slide.word && !slide.wordPl) {
        patchData.wordPl = slide.word;
        patchData.wordEn = PLACEHOLDER_EN;
      }

      // Migrate tagline
      if (slide.tagline && !slide.taglinePl) {
        patchData.taglinePl = slide.tagline;
        patchData.taglineEn = PLACEHOLDER_EN;
      }

      // Only patch if there's data to migrate
      if (Object.keys(patchData).length === 0) {
        console.log(`⏭️  Skipping "${slide.word}" - no data to migrate`);
        skippedCount++;
        continue;
      }

      // Apply patch
      await client
        .patch(slide._id)
        .set(patchData)
        .commit();

      console.log(`✅ Migrated "${slide.word}"`);
      migratedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${slides.length}`);
    console.log('\n✨ Migration completed successfully!');
    console.log('ℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify migrated homepage slides');
    console.log('   2. Add English translations to replace "[EN translation needed]"');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateHomepageSlides();
