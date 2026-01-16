#!/usr/bin/env node

/**
 * Fix missing _key in photoAlbum images array
 *
 * Adds _key to each image in the images array for all photoAlbum documents
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

async function fixPhotoAlbumKeys() {
  console.log('🔧 Fixing missing _key in photoAlbum images\n');

  // Fetch all photoAlbum documents
  const albums = await client.fetch('*[_type == "photoAlbum"]');
  console.log(`Found ${albums.length} photo albums\n`);

  for (const album of albums) {
    console.log(`Processing: ${album.title} (${album._id})`);

    // Check if images have _key
    const needsFix = album.images && album.images.some(img => !img._key);

    if (!needsFix) {
      console.log('  ✓ Already has keys, skipping\n');
      continue;
    }

    // Add _key to each image
    const fixedImages = album.images.map(img => {
      if (img._key) return img; // Already has key
      return {
        ...img,
        _key: nanoid(), // Generate unique key
      };
    });

    // Patch the document
    await client
      .patch(album._id)
      .set({ images: fixedImages })
      .commit();

    console.log(`  ✓ Fixed ${fixedImages.length} images\n`);
  }

  console.log('✅ All albums fixed!');
}

fixPhotoAlbumKeys().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
