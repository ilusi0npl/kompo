#!/usr/bin/env node

/**
 * Migrate Homepage Slides from slides-config.js to Sanity CMS
 *
 * Migrates 4 homepage hero slides:
 * 1. Trio - "specjalizujemy się w muzyce najnowszej"
 * 2. Kompo - "gramy wszystko i na wszystkim"
 * 3. Polex - "jesteśmy z Polski"
 * 4. Ensemble - "komponuje dla nas cały świat"
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

// Homepage slides data from slides-config.js
const slides = [
  {
    order: 1,
    word: 'Trio',
    tagline: 'specjalizujemy się w muzyce najnowszej',
    backgroundColor: '#FDFDFD',
    textColor: '#131313',
    lineColor: '#A0E38A',
    imagePath: path.join(__dirname, '../public/assets/slides/hero-1.webp'),
    wordSvgPath: path.join(__dirname, '../public/assets/slides/word-trio.svg'),
    wordY: 446,
    wordHeight: 149,
    wordWidth: 49,
    taglineX: 514,
    logoSrc: '/assets/logo.svg',
  },
  {
    order: 2,
    word: 'Kompo',
    tagline: 'gramy wszystko i na wszystkim',
    backgroundColor: '#761FE0',
    textColor: '#FDFDFD',
    lineColor: '#A0E38A',
    imagePath: path.join(__dirname, '../public/assets/slides/hero-2.webp'),
    wordSvgPath: path.join(__dirname, '../public/assets/slides/word-kompo.svg'),
    wordY: 408,
    wordHeight: 185,
    wordWidth: 58,
    taglineX: 612,
    logoSrc: '/assets/logo-white.svg',
  },
  {
    order: 3,
    word: 'Polex',
    tagline: 'jesteśmy z Polski',
    backgroundColor: '#34B898',
    textColor: '#131313',
    lineColor: '#01936F',
    imagePath: path.join(__dirname, '../public/assets/slides/hero-3.webp'),
    wordSvgPath: path.join(__dirname, '../public/assets/slides/word-polex.svg'),
    wordY: 408,
    wordHeight: 185,
    wordWidth: 49,
    taglineX: 741,
    logoSrc: '/assets/logo.svg',
  },
  {
    order: 4,
    word: 'Ensemble',
    tagline: 'komponuje dla nas cały świat',
    backgroundColor: '#FFBD19',
    textColor: '#131313',
    lineColor: '#5B5B5B',
    imagePath: path.join(__dirname, '../public/assets/slides/hero-4.webp'),
    wordSvgPath: path.join(__dirname, '../public/assets/slides/word-ensemble.svg'),
    wordY: 293,
    wordHeight: 299,
    wordWidth: 49,
    taglineX: 622,
    logoSrc: '/assets/logo.svg',
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
 * Upload SVG file to Sanity
 */
async function uploadSvg(svgPath) {
  if (!fs.existsSync(svgPath)) {
    throw new Error(`SVG not found: ${svgPath}`);
  }

  const svgStream = fs.createReadStream(svgPath);
  const asset = await client.assets.upload('file', svgStream, {
    filename: path.basename(svgPath),
    contentType: 'image/svg+xml',
  });

  console.log(`    ✓ SVG uploaded: ${asset._id}`);
  return asset;
}

/**
 * Create homepage slide document in Sanity
 */
async function createSlide(slideData, imageAsset, svgAsset) {
  // Check if slide already exists
  const existing = await client.fetch(
    `*[_type == "homepageSlide" && word == $word][0]`,
    { word: slideData.word }
  );

  if (existing) {
    console.log(`  ⚠️  Slide already exists: ${existing._id}`);
    return existing;
  }

  // Convert hex colors to Sanity color format
  const toSanityColor = (hex) => ({
    hex,
    alpha: 1,
  });

  const doc = {
    _type: 'homepageSlide',
    word: slideData.word,
    order: slideData.order,
    tagline: slideData.tagline,
    backgroundColor: toSanityColor(slideData.backgroundColor),
    textColor: toSanityColor(slideData.textColor),
    lineColor: toSanityColor(slideData.lineColor),
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
    wordSvg: {
      _type: 'file',
      asset: {
        _type: 'reference',
        _ref: svgAsset._id,
      },
    },
    wordPosition: {
      wordY: slideData.wordY,
      wordHeight: slideData.wordHeight,
      wordWidth: slideData.wordWidth,
    },
    taglineX: slideData.taglineX,
    logoSrc: slideData.logoSrc,
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Slide created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Homepage Slides Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  // Pre-flight validation: Check all images and SVGs exist
  console.log('🔍 Pre-flight validation...');
  const missingFiles = [];
  for (const slide of slides) {
    if (!fs.existsSync(slide.imagePath)) {
      missingFiles.push(slide.imagePath);
    }
    if (!fs.existsSync(slide.wordSvgPath)) {
      missingFiles.push(slide.wordSvgPath);
    }
  }

  if (missingFiles.length > 0) {
    console.error('\n❌ Error: Missing files:');
    missingFiles.forEach(path => console.error(`  - ${path}`));
    process.exit(1);
  }
  console.log('✓ All image and SVG files found\n');

  // Migrate slides
  const results = [];
  const failures = [];

  for (const slide of slides) {
    try {
      console.log(`\n[${slide.order}/${slides.length}] Processing: ${slide.word}`);

      // Upload image
      const imageAsset = await uploadImage(slide.imagePath);

      // Upload SVG
      const svgAsset = await uploadSvg(slide.wordSvgPath);

      // Create slide document
      const slideDoc = await createSlide(slide, imageAsset, svgAsset);

      results.push({
        order: slide.order,
        word: slide.word,
        sanityId: slideDoc._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${slide.word}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        order: slide.order,
        word: slide.word,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));

  if (results.length > 0) {
    console.log('\n✅ Successfully migrated slides:\n');
    results.forEach((r) => {
      console.log(`  ${r.order}. ${r.word}`);
      console.log(`     ID: ${r.sanityId}`);
    });
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed slides:\n');
    failures.forEach((f) => {
      console.log(`  ${f.order}. ${f.word}`);
      console.log(`     Error: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Migration complete: ${results.length}/${slides.length} slides migrated\n`);

  // Verification reminder
  if (results.length > 0) {
    console.log('📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Create useSanityHomepageSlides hook');
    console.log('  3. Integrate into Homepage component\n');
  }
}

// Run migration
migrate();
