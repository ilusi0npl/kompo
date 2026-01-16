#!/usr/bin/env node

/**
 * Migrate Kontakt Page from kontakt-config.js to Sanity CMS
 *
 * Creates a single kontaktPage document (singleton)
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

// Kontakt page data from kontakt-config.js
const kontaktData = {
  title: 'Kontakt',
  backgroundColor: '#FF734C',
  lineColor: '#FFBD19',
  email: 'KOMPOPOLEX@GMAIL.COM',
  teamImagePath: path.join(__dirname, '../public/assets/kontakt/team-photo.jpg'),
};

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
 * Create kontaktPage document in Sanity
 */
async function createKontaktPage(data, imageAsset) {
  // Check if kontaktPage already exists (singleton)
  const existing = await client.fetch(`*[_type == "kontaktPage"][0]`);

  if (existing) {
    console.log(`  ⚠️  Kontakt page already exists: ${existing._id}`);
    console.log(`     To update, delete it in Sanity Studio first`);
    return existing;
  }

  // Convert hex colors to Sanity color format
  const toSanityColor = (hex) => ({
    hex,
    alpha: 1,
  });

  const doc = {
    _type: 'kontaktPage',
    title: data.title,
    backgroundColor: toSanityColor(data.backgroundColor),
    lineColor: toSanityColor(data.lineColor),
    email: data.email,
    teamImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Kontakt page created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Kontakt Page Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  // Pre-flight validation: Check image exists
  console.log('🔍 Pre-flight validation...');
  if (!fs.existsSync(kontaktData.teamImagePath)) {
    console.error(`\n❌ Error: Team image not found: ${kontaktData.teamImagePath}`);
    process.exit(1);
  }
  console.log('✓ Team image file found\n');

  try {
    console.log('Processing: Kontakt page');

    // Upload team image
    const imageAsset = await uploadImage(kontaktData.teamImagePath);

    // Create kontaktPage document
    const kontaktDoc = await createKontaktPage(kontaktData, imageAsset);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Successfully migrated Kontakt page\n');
    console.log(`  ID: ${kontaktDoc._id}`);
    console.log(`  Email: ${kontaktDoc.email}`);
    console.log(`  Background: ${kontaktData.backgroundColor}`);
    console.log(`  Line color: ${kontaktData.lineColor}`);

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Create useSanityKontaktPage hook');
    console.log('  3. Integrate into Kontakt page component\n');
  } catch (error) {
    console.error(`\n❌ Failed to migrate Kontakt page`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Run migration
migrate();
