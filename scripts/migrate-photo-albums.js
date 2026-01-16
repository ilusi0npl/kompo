#!/usr/bin/env node

/**
 * Migrate Photo Albums from media-config.js to Sanity CMS
 *
 * Migrates 6 photo albums from media page
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

// Photo albums data from media-config.js
const photoAlbums = [
  {
    order: 1,
    title: 'Festiwal Klang',
    photographer: 'Alexander Banck-Petersen',
    thumbnailPath: path.join(__dirname, '../public/assets/media/photo1.jpg'),
    imagePaths: [
      path.join(__dirname, '../public/assets/media/photo1.jpg'),
      path.join(__dirname, '../public/assets/media/photo1-2.jpg'),
      path.join(__dirname, '../public/assets/media/photo1.jpg'),
    ],
  },
  {
    order: 2,
    title: 'Nazwa wydarzenia',
    photographer: 'Wojciech Chrubasik',
    thumbnailPath: path.join(__dirname, '../public/assets/media/photo3.jpg'),
    imagePaths: [
      path.join(__dirname, '../public/assets/media/photo3.jpg'),
      path.join(__dirname, '../public/assets/media/photo3.jpg'),
      path.join(__dirname, '../public/assets/media/photo3.jpg'),
    ],
  },
  {
    order: 3,
    title: 'Nazwa konceru',
    photographer: 'Alexander Banck-Petersen',
    thumbnailPath: path.join(__dirname, '../public/assets/media/photo5.jpg'),
    imagePaths: [
      path.join(__dirname, '../public/assets/media/photo5.jpg'),
      path.join(__dirname, '../public/assets/media/photo5.jpg'),
      path.join(__dirname, '../public/assets/media/photo5.jpg'),
    ],
  },
  {
    order: 4,
    title: 'Festiwal Klang',
    photographer: 'Alexander Banck-Petersen',
    thumbnailPath: path.join(__dirname, '../public/assets/media/photo2.jpg'),
    imagePaths: [
      path.join(__dirname, '../public/assets/media/photo2.jpg'),
      path.join(__dirname, '../public/assets/media/photo2.jpg'),
      path.join(__dirname, '../public/assets/media/photo2.jpg'),
    ],
  },
  {
    order: 5,
    title: 'Nazwa wydarzenia',
    photographer: 'Wojciech Chrubasik',
    thumbnailPath: path.join(__dirname, '../public/assets/media/photo4.jpg'),
    imagePaths: [
      path.join(__dirname, '../public/assets/media/photo4.jpg'),
      path.join(__dirname, '../public/assets/media/photo4.jpg'),
      path.join(__dirname, '../public/assets/media/photo4.jpg'),
    ],
  },
  {
    order: 6,
    title: 'Nazwa konceru',
    photographer: 'Alexander Banck-Petersen',
    thumbnailPath: path.join(__dirname, '../public/assets/media/photo6.jpg'),
    imagePaths: [
      path.join(__dirname, '../public/assets/media/photo6.jpg'),
      path.join(__dirname, '../public/assets/media/photo6.jpg'),
      path.join(__dirname, '../public/assets/media/photo6.jpg'),
    ],
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
 * Create photo album document in Sanity
 */
async function createPhotoAlbum(albumData, thumbnailAsset, imageAssets) {
  // Check if album already exists (by title and photographer)
  const existing = await client.fetch(
    `*[_type == "photoAlbum" && title == $title && photographer == $photographer][0]`,
    { title: albumData.title, photographer: albumData.photographer }
  );

  if (existing) {
    console.log(`  ⚠️  Album already exists: ${existing._id}`);
    return existing;
  }

  const doc = {
    _type: 'photoAlbum',
    title: albumData.title,
    photographer: albumData.photographer,
    order: albumData.order,
    thumbnail: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: thumbnailAsset._id,
      },
    },
    images: imageAssets.map(asset => ({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    })),
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Album created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Photo Albums Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  // Pre-flight validation: Check all images exist
  console.log('🔍 Pre-flight validation...');
  const missingImages = [];
  for (const album of photoAlbums) {
    if (!fs.existsSync(album.thumbnailPath)) {
      missingImages.push(album.thumbnailPath);
    }
    for (const imagePath of album.imagePaths) {
      if (!fs.existsSync(imagePath)) {
        missingImages.push(imagePath);
      }
    }
  }

  if (missingImages.length > 0) {
    console.error('\n❌ Error: Missing image files:');
    missingImages.forEach(path => console.error(`  - ${path}`));
    process.exit(1);
  }
  console.log('✓ All image files found\n');

  // Migrate albums
  const results = [];
  const failures = [];

  for (const album of photoAlbums) {
    try {
      console.log(`\n[${album.order}/${photoAlbums.length}] Processing: ${album.title} (${album.photographer})`);

      // Upload thumbnail
      const thumbnailAsset = await uploadImage(album.thumbnailPath);

      // Upload all album images
      const imageAssets = [];
      for (const imagePath of album.imagePaths) {
        const asset = await uploadImage(imagePath);
        imageAssets.push(asset);
      }

      // Create album document
      const albumDoc = await createPhotoAlbum(album, thumbnailAsset, imageAssets);

      results.push({
        order: album.order,
        title: album.title,
        sanityId: albumDoc._id,
        imageCount: imageAssets.length,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${album.title}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        order: album.order,
        title: album.title,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));

  if (results.length > 0) {
    console.log('\n✅ Successfully migrated photo albums:\n');
    results.forEach((r) => {
      console.log(`  ${r.order}. ${r.title}`);
      console.log(`     ID: ${r.sanityId}`);
      console.log(`     Images: ${r.imageCount}`);
    });
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed albums:\n');
    failures.forEach((f) => {
      console.log(`  ${f.order}. ${f.title}`);
      console.log(`     Error: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Migration complete: ${results.length}/${photoAlbums.length} albums migrated\n`);

  // Verification reminder
  if (results.length > 0) {
    console.log('📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Create useSanityPhotoAlbums hook');
    console.log('  3. Integrate into Media page component\n');
  }
}

// Run migration
migrate();
