#!/usr/bin/env node

/**
 * Migrate Event Descriptions from Plain Text to Portable Text
 *
 * Converts descriptionPl and descriptionEn fields from plain text (string)
 * to Portable Text (array of blocks) format.
 *
 * Safe to run multiple times - skips events that already have array descriptions.
 *
 * Usage: node scripts/migrate-event-descriptions-to-portable-text.js
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

function generateKey() {
  return randomBytes(6).toString('hex');
}

/**
 * Convert plain text string to Portable Text block array.
 * Each paragraph (separated by double newlines) becomes a block.
 */
function textToPortableText(text) {
  if (!text || typeof text !== 'string') return null;

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

  return paragraphs.map(paragraph => ({
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: generateKey(),
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }));
}

async function migrateEventDescriptions() {
  console.log('Starting Event descriptions migration to Portable Text...\n');

  try {
    const events = await client.fetch(`
      *[_type == "event"] {
        _id,
        titlePl,
        descriptionPl,
        descriptionEn
      }
    `);

    console.log(`Found ${events.length} events\n`);

    let migrated = 0;
    let skipped = 0;

    for (const event of events) {
      const needsMigrationPl = typeof event.descriptionPl === 'string';
      const needsMigrationEn = typeof event.descriptionEn === 'string';

      if (!needsMigrationPl && !needsMigrationEn) {
        console.log(`  SKIP: "${event.titlePl}" - already Portable Text`);
        skipped++;
        continue;
      }

      const patch = client.patch(event._id);

      if (needsMigrationPl) {
        const blocks = textToPortableText(event.descriptionPl);
        if (blocks) {
          patch.set({ descriptionPl: blocks });
        }
      }

      if (needsMigrationEn) {
        const blocks = textToPortableText(event.descriptionEn);
        if (blocks) {
          patch.set({ descriptionEn: blocks });
        }
      }

      await patch.commit();
      console.log(`  MIGRATED: "${event.titlePl}" (PL: ${needsMigrationPl}, EN: ${needsMigrationEn})`);
      migrated++;
    }

    console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrateEventDescriptions();
