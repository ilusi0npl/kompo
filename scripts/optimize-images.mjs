#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const QUALITY = 85; // WebP quality
const MAX_WIDTH = 1200; // Max width for images

// Image directories to optimize
const IMAGE_DIRS = [
  { path: 'public/assets/bio', maxWidth: 900 },      // Bio images shown at 300px
  { path: 'public/assets/kalendarz', maxWidth: 990 }, // Event images shown at 330px
  { path: 'public/assets', maxWidth: 1200 },          // Hero and other images
];

async function optimizeImage(inputPath, outputPath, maxWidth) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`  Processing: ${basename(inputPath)} (${metadata.width}x${metadata.height})`);

    // Resize if image is too large
    let pipeline = image;
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Convert to WebP
    await pipeline
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    const savedPercent = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`    → ${basename(outputPath)} (${(outputStats.size / 1024 / 1024).toFixed(2)}MB, saved ${savedPercent}%)`);

    return {
      input: inputPath,
      output: outputPath,
      originalSize: inputStats.size,
      newSize: outputStats.size,
      saved: inputStats.size - outputStats.size,
    };
  } catch (error) {
    console.error(`  ERROR processing ${inputPath}:`, error.message);
    return null;
  }
}

async function processDirectory(dirPath, maxWidth) {
  if (!existsSync(dirPath)) {
    console.log(`Skipping non-existent directory: ${dirPath}`);
    return [];
  }

  console.log(`\nProcessing directory: ${dirPath}`);

  const files = await readdir(dirPath);
  const results = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    const ext = extname(file).toLowerCase();

    // Skip if not an image or already WebP
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      continue;
    }

    // Skip old backups
    if (file.includes('-old')) {
      continue;
    }

    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    const result = await optimizeImage(filePath, outputPath, maxWidth);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('================================\n');

  const allResults = [];

  for (const dir of IMAGE_DIRS) {
    const results = await processDirectory(dir.path, dir.maxWidth);
    allResults.push(...results);
  }

  // Summary
  if (allResults.length > 0) {
    const totalOriginal = allResults.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = allResults.reduce((sum, r) => sum + r.newSize, 0);
    const totalSaved = totalOriginal - totalNew;
    const savedPercent = ((totalSaved / totalOriginal) * 100).toFixed(1);

    console.log('\n================================');
    console.log('📊 Summary:');
    console.log(`  Images processed: ${allResults.length}`);
    console.log(`  Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  New size: ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB (${savedPercent}%)`);
    console.log('================================\n');

    console.log('✅ Optimization complete!');
    console.log('\n💡 Next steps:');
    console.log('  1. Update image paths in config files (.jpg → .webp)');
    console.log('  2. Test the website to ensure images display correctly');
    console.log('  3. Remove old .jpg files if everything works');
  } else {
    console.log('\nNo images to optimize.');
  }
}

main().catch(console.error);
