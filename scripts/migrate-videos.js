#!/usr/bin/env node

/**
 * Migrate Videos from media-wideo-config.js to Sanity CMS
 *
 * Migrates 4 YouTube videos to mediaItem schema with type="video"
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

// Videos data from media-wideo-config.js
const videos = [
  {
    id: 1,
    title: 'Rafał Zapała - black serial MIDI music',
    youtubeUrl: 'https://www.youtube.com/watch?v=YBwiarivOio',
    thumbnailPath: path.join(__dirname, '../public/assets/media-wideo/video1.jpg'),
  },
  {
    id: 2,
    title: 'Michael Beil - Key Jane',
    youtubeUrl: 'https://www.youtube.com/watch?v=gDZOeN8r9jY',
    thumbnailPath: path.join(__dirname, '../public/assets/media-wideo/video2.jpg'),
  },
  {
    id: 3,
    title: "Viacheslav Kyrylov - I'm the real pig blood soaked fucking homecoming queen",
    youtubeUrl: 'https://www.youtube.com/watch?v=rd-vz7qARGo',
    thumbnailPath: path.join(__dirname, '../public/assets/media-wideo/video3.jpg'),
  },
  {
    id: 4,
    title: 'Marta Śniady - Body X Ultra: Limited Edition',
    youtubeUrl: 'https://www.youtube.com/watch?v=ayGAJlgoxP4',
    thumbnailPath: path.join(__dirname, '../public/assets/media-wideo/video4.jpg'),
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

  console.log(`    ✓ Thumbnail uploaded: ${asset._id}`);
  return asset;
}

/**
 * Create video mediaItem in Sanity
 */
async function createVideo(videoData, thumbnailAsset) {
  // Check if video already exists (by title)
  const existing = await client.fetch(
    `*[_type == "mediaItem" && type == "video" && title == $title][0]`,
    { title: videoData.title }
  );

  if (existing) {
    console.log(`  ⚠️  Video already exists: ${existing._id}`);
    return existing;
  }

  const doc = {
    _type: 'mediaItem',
    type: 'video',
    title: videoData.title,
    videoUrl: videoData.youtubeUrl,
    thumbnail: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: thumbnailAsset._id,
      },
    },
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Video created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Videos Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  // Pre-flight validation: Check all thumbnails exist
  console.log('🔍 Pre-flight validation...');
  const missingThumbnails = [];
  for (const video of videos) {
    if (!fs.existsSync(video.thumbnailPath)) {
      missingThumbnails.push(video.thumbnailPath);
    }
  }

  if (missingThumbnails.length > 0) {
    console.error('\n❌ Error: Missing thumbnail files:');
    missingThumbnails.forEach(path => console.error(`  - ${path}`));
    process.exit(1);
  }
  console.log('✓ All thumbnail files found\n');

  // Migrate videos
  const results = [];
  const failures = [];

  for (const video of videos) {
    try {
      console.log(`\n[${video.id}/${videos.length}] Processing: ${video.title}`);

      // Upload thumbnail
      const thumbnailAsset = await uploadImage(video.thumbnailPath);

      // Create video document
      const videoDoc = await createVideo(video, thumbnailAsset);

      results.push({
        id: video.id,
        title: video.title,
        sanityId: videoDoc._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${video.title}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        id: video.id,
        title: video.title,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));

  if (results.length > 0) {
    console.log('\n✅ Successfully migrated videos:\n');
    results.forEach((r) => {
      console.log(`  ${r.id}. ${r.title}`);
      console.log(`     ID: ${r.sanityId}`);
    });
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed videos:\n');
    failures.forEach((f) => {
      console.log(`  ${f.id}. ${f.title}`);
      console.log(`     Error: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Migration complete: ${results.length}/${videos.length} videos migrated\n`);

  // Verification reminder
  if (results.length > 0) {
    console.log('📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Update mediaItemsQuery to include videos');
    console.log('  3. Integrate into MediaWideo page component\n');
  }
}

// Run migration
migrate();
