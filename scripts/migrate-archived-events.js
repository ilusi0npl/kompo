#!/usr/bin/env node

/**
 * Migrate Archived Events from archiwalne-config.js to Sanity CMS
 *
 * Migrates 6 archived events to the existing "event" schema
 * with status="archived"
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sanity client
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

// Archived events data from archiwalne-config.js
const archivedEvents = [
  {
    id: 1,
    date: '2025-12-13T00:00:00',
    title: 'ENSEMBLE KOMPOPOLEX',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    imagePath: path.join(__dirname, '../public/assets/archiwalne/event1.jpg'),
    description: 'Koncert archiwalny Ensemble Kompopolex',
    location: 'ASP WROCŁAW',
  },
  {
    id: 2,
    date: '2024-12-10T00:00:00',
    title: 'KOMPOPOLEX x martyna zakrzewska',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska',
    imagePath: path.join(__dirname, '../public/assets/archiwalne/event2.jpg'),
    description: 'Współpraca z Martyną Zakrzewską',
    location: 'Wrocław',
  },
  {
    id: 3,
    date: '2023-12-20T00:00:00',
    title: 'społeczne komponowanie',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    imagePath: path.join(__dirname, '../public/assets/archiwalne/event3.jpg'),
    description: 'Społeczne komponowanie - warsztaty i koncert',
    location: 'Akademia Muzyczna Wrocław',
  },
  {
    id: 4,
    date: '2025-12-13T00:00:00',
    title: 'ENSEMBLE KOMPOPOLEX',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    imagePath: path.join(__dirname, '../public/assets/archiwalne/event4.jpg'),
    description: 'Ensemble Kompopolex - wykonanie najnowszych utworów',
    location: 'ASP WROCŁAW',
  },
  {
    id: 5,
    date: '2024-12-10T00:00:00',
    title: 'KOMPOPOLEX x martyna zakrzewska',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska',
    imagePath: path.join(__dirname, '../public/assets/archiwalne/event5.jpg'),
    description: 'Wspólny koncert z Martyną Zakrzewską',
    location: 'Wrocław',
  },
  {
    id: 6,
    date: '2023-12-20T00:00:00',
    title: 'społeczne komponowanie',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    imagePath: path.join(__dirname, '../public/assets/archiwalne/event6.jpg'),
    description: 'Społeczne komponowanie - edycja 2023',
    location: 'Akademia Muzyczna Wrocław',
  },
];

/**
 * Upload image to Sanity CDN
 */
async function uploadImage(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const imageStream = fs.createReadStream(imagePath);
  const asset = await client.assets.upload('image', imageStream, {
    filename: path.basename(imagePath),
  });

  console.log(`    ✓ Image uploaded: ${asset._id}`);
  return asset;
}

/**
 * Create archived event document in Sanity
 */
async function createEvent(eventData, imageAsset) {
  // Check if event already exists (by title and date)
  const existing = await client.fetch(
    `*[_type == "event" && title == $title && date == $date][0]`,
    { title: eventData.title, date: eventData.date }
  );

  if (existing) {
    console.log(`  ⚠️  Event already exists: ${existing._id}`);
    return existing;
  }

  const doc = {
    _type: 'event',
    title: eventData.title,
    date: eventData.date,
    performers: eventData.performers,
    description: eventData.description,
    location: eventData.location,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
    status: 'archived',
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Event created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Archived Events Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  // Pre-flight validation: Check all images exist
  console.log('🔍 Pre-flight validation...');
  const missingImages = [];
  for (const event of archivedEvents) {
    if (!fs.existsSync(event.imagePath)) {
      missingImages.push(event.imagePath);
    }
  }

  if (missingImages.length > 0) {
    console.error('\n❌ Error: Missing image files:');
    missingImages.forEach(path => console.error(`  - ${path}`));
    process.exit(1);
  }
  console.log('✓ All image files found\n');

  // Migrate events
  const results = [];
  const failures = [];

  for (const event of archivedEvents) {
    try {
      console.log(`\n[${event.id}/${archivedEvents.length}] Processing: ${event.title}`);

      // Upload image
      const imageAsset = await uploadImage(event.imagePath);

      // Create event document
      const eventDoc = await createEvent(event, imageAsset);

      results.push({
        id: event.id,
        title: event.title,
        sanityId: eventDoc._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${event.title}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        id: event.id,
        title: event.title,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));

  if (results.length > 0) {
    console.log('\n✅ Successfully migrated archived events:\n');
    results.forEach((r) => {
      console.log(`  ${r.id}. ${r.title}`);
      console.log(`     ID: ${r.sanityId}`);
    });
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed events:\n');
    failures.forEach((f) => {
      console.log(`  ${f.id}. ${f.title}`);
      console.log(`     Error: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Migration complete: ${results.length}/${archivedEvents.length} events migrated\n`);

  // Verification reminder
  if (results.length > 0) {
    console.log('📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Query archived events uses existing archivedEventsQuery');
    console.log('  3. Integrate into Archiwalne page component\n');
  }
}

// Run migration
migrate();
