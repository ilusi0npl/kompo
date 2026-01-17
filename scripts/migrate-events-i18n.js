#!/usr/bin/env node

/**
 * Migrate Events to Bilingual Schema (Pl/En)
 *
 * Copies existing single-language fields to bilingual fields:
 * - title → titlePl, titleEn = "[EN translation needed]"
 * - performers → performersPl, performersEn = "[EN translation needed]"
 * - description → descriptionPl, descriptionEn = "[EN translation needed]"
 * - location → locationPl, locationEn = "[EN translation needed]"
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
async function migrateEvents() {
  console.log('🚀 Starting Events i18n migration...\n');

  try {
    // Fetch all events (both upcoming and archived)
    const events = await client.fetch(`
      *[_type == "event"] {
        _id,
        title,
        titlePl,
        titleEn,
        performers,
        performersPl,
        performersEn,
        description,
        descriptionPl,
        descriptionEn,
        location,
        locationPl,
        locationEn,
        status
      }
    `);

    console.log(`📋 Found ${events.length} events to process\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const event of events) {
      // Check if already migrated (has new bilingual fields)
      if (event.titlePl && event.titleEn) {
        console.log(`⏭️  Skipping "${event.title || event.titlePl}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare patch data
      const patchData = {};

      // Migrate title
      if (event.title && !event.titlePl) {
        patchData.titlePl = event.title;
        patchData.titleEn = PLACEHOLDER_EN;
      }

      // Migrate performers (optional field)
      if (event.performers !== undefined && !event.performersPl) {
        patchData.performersPl = event.performers || '';
        patchData.performersEn = event.performers ? PLACEHOLDER_EN : '';
      }

      // Migrate description
      if (event.description && !event.descriptionPl) {
        patchData.descriptionPl = event.description;
        patchData.descriptionEn = PLACEHOLDER_EN;
      }

      // Migrate location
      if (event.location && !event.locationPl) {
        patchData.locationPl = event.location;
        patchData.locationEn = PLACEHOLDER_EN;
      }

      // Only patch if there's data to migrate
      if (Object.keys(patchData).length === 0) {
        console.log(`⏭️  Skipping "${event.title}" - no data to migrate`);
        skippedCount++;
        continue;
      }

      // Apply patch
      await client
        .patch(event._id)
        .set(patchData)
        .commit();

      console.log(`✅ Migrated "${event.title}" (${event.status})`);
      migratedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${events.length}`);
    console.log('\n✨ Migration completed successfully!');
    console.log('ℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify migrated events');
    console.log('   2. Add English translations to replace "[EN translation needed]"');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateEvents();
