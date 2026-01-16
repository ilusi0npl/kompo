#!/usr/bin/env node

/**
 * Migration script: Migrate existing events to Sanity CMS
 *
 * Usage: node scripts/migrate-events.js
 *
 * Requires: SANITY_AUTH_TOKEN environment variable
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity client configuration
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

// Event data from kalendarz-config.js
const events = [
  {
    id: 1,
    date: '13.12.25 | 18:00',
    dateISO: '2025-12-13T18:00:00',
    title: 'ENSEMBLE KOMPOPOLEX',
    performers: 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    description: 'Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.',
    location: 'ASP WROCŁAW, PL. POLSKI 3/4',
    imagePath: path.join(__dirname, '../public/assets/kalendarz/event1.jpg'),
    imageStyle: {
      objectFit: 'cover',
      objectPosition: '50% 50%',
    },
  },
  {
    id: 2,
    date: '20.12.25 | 18:00',
    dateISO: '2025-12-20T18:00:00',
    title: 'SPOŁECZNE KOMPONOWANIE 2025',
    performers: 'Julia Łabowska, Karolina Kułaga, Oleś Kulczewicz, Szymon Kępczyński, Tymoteusz Lasik',
    description: 'Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.',
    location: 'Akademia Muzyczna im. K. Lipińskiego\nwe Wrocławiu',
    imagePath: path.join(__dirname, '../public/assets/kalendarz/event2.jpg'),
    imageStyle: {
      position: 'absolute',
      width: '209.97%',
      height: '100%',
      left: '-33.17%',
      top: '0',
      maxWidth: 'none',
    },
  },
  {
    id: 3,
    date: '16.01.26 | 20:00',
    dateISO: '2026-01-16T20:00:00',
    title: 'MIXTUR FESTIVAL',
    performers: null,
    program: [
      { composer: 'La Monte Young', piece: 'Composition #10' },
      { composer: 'Marta Śniady', piece: 'Body X Ultra' },
      { composer: 'Martin A. Hirsti-Kvam', piece: 'Memory Box #2' },
      { composer: 'Jennifer Walshe', piece: 'EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE' },
      { composer: 'Rafał Ryterski', piece: 'Breathe' },
      { composer: 'La Monte Young', piece: 'Composition #13' },
    ],
    description: 'Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.',
    location: 'Nau Bostik, Barcelona',
    imagePath: path.join(__dirname, '../public/assets/kalendarz/event3.jpg'),
    imageStyle: {
      objectFit: 'cover',
      objectPosition: '50% 50%',
    },
  },
];

/**
 * Upload image to Sanity
 */
async function uploadImage(imagePath) {
  console.log(`  → Uploading image: ${path.basename(imagePath)}`);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const imageStream = fs.createReadStream(imagePath);
  const asset = await client.assets.upload('image', imageStream, {
    filename: path.basename(imagePath),
  });

  console.log(`  ✓ Image uploaded: ${asset._id}`);
  return asset;
}

/**
 * Create event document in Sanity
 */
async function createEvent(eventData, imageAsset) {
  console.log(`  → Creating event document: ${eventData.title}`);

  // Check if event already exists
  const existing = await client.fetch(
    `*[_type == "event" && title == $title][0]`,
    { title: eventData.title }
  );

  if (existing) {
    console.log(`  ⚠️  Event already exists: ${existing._id}`);
    return existing;
  }

  const doc = {
    _type: 'event',
    title: eventData.title,
    date: eventData.dateISO,
    performers: eventData.performers || undefined,
    program: eventData.program || undefined,
    description: eventData.description,
    location: eventData.location,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
    imageStyle: eventData.imageStyle,
    status: 'upcoming',
    publishedAt: new Date().toISOString(),
  };

  const result = await client.create(doc);
  console.log(`  ✓ Event created: ${result._id}`);
  return result;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting event migration to Sanity CMS\n');
  console.log(`Project: cy9ddq1w`);
  console.log(`Dataset: production`);
  console.log(`Events to migrate: ${events.length}\n`);

  // Check for auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ Error: SANITY_AUTH_TOKEN environment variable is required');
    console.error('\nTo generate a token:');
    console.error('1. Go to https://www.sanity.io/manage/personal/tokens');
    console.error('2. Create a new token with "Editor" permissions');
    console.error('3. Set the token: export SANITY_AUTH_TOKEN=your_token_here');
    process.exit(1);
  }

  // Pre-flight validation: Check all images exist
  console.log('🔍 Pre-flight validation...');
  const missingImages = [];
  for (const event of events) {
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

  const results = [];
  const failures = [];

  for (const event of events) {
    try {
      console.log(`\n[${event.id}/${events.length}] Processing: ${event.title}`);

      // Upload image
      const imageAsset = await uploadImage(event.imagePath);

      // Create event document
      const eventDoc = await createEvent(event, imageAsset);

      results.push({
        id: event.id,
        title: event.title,
        sanityId: eventDoc._id,
        imageId: imageAsset._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${event.title}`);
      console.error(`  Error: ${error.message}`);
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
    console.log('\n✅ Successfully migrated events:\n');
    results.forEach((r) => {
      console.log(`  • ${r.title} (${r.sanityId})`);
    });
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed events:\n');
    failures.forEach((f) => {
      console.log(`  • ${f.title}: ${f.error}`);
    });
  }

  console.log('\n📊 Summary:');
  console.log(`  Total events: ${events.length}`);
  console.log(`  Successful: ${results.length}`);
  console.log(`  Failed: ${failures.length}`);

  if (results.length > 0) {
    console.log('\n🔍 Verify in Sanity Studio:');
    console.log('  1. Open: http://localhost:3333');
    console.log('  2. Navigate to "Event" in left sidebar');
    console.log('  3. Or use Vision with query: *[_type == "event"] | order(date asc)');
  }

  // Exit with error code if any failures
  if (failures.length > 0) {
    process.exit(1);
  }
}

// Run migration
migrate();
