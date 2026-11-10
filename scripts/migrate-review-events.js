#!/usr/bin/env node

/**
 * Migrate review events from recenzje-config.js to Sanity CMS
 *
 * Creates one "reviewEvent" document per event with its reviews and photos.
 * Document IDs are derived from the slug, so existing documents are skipped
 * (safe to run multiple times).
 *
 * Usage:
 *   node scripts/migrate-review-events.js --dry-run
 *   node scripts/migrate-review-events.js
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { reviewEvents } from '../src/pages/MediaRecenzje/recenzje-config.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes('--dry-run');

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

const uploaded = new Map();

async function imageRef(publicUrl) {
  if (!publicUrl) return undefined;
  if (!uploaded.has(publicUrl)) {
    const filePath = path.join(__dirname, '../public', publicUrl);
    const asset = DRY_RUN
      ? { _id: `dry-run-${path.basename(filePath)}` }
      : await client.assets.upload('image', fs.createReadStream(filePath), { filename: path.basename(filePath) });
    uploaded.set(publicUrl, asset._id);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(publicUrl) } };
}

async function toDocument(event) {
  const reviews = [];
  for (const review of event.reviews) {
    const { photoUrl, ...fields } = review;
    reviews.push({ _type: 'review', ...fields, photo: await imageRef(photoUrl) });
  }
  const { slug, imageUrl, ...fields } = event;
  return {
    _id: `reviewEvent-${slug}`,
    _type: 'reviewEvent',
    ...fields,
    slug: { _type: 'slug', current: slug },
    image: await imageRef(imageUrl),
    reviews,
    publishedAt: new Date().toISOString(),
  };
}

async function main() {
  if (!DRY_RUN && !process.env.SANITY_AUTH_TOKEN) {
    console.error('SANITY_AUTH_TOKEN is not set');
    process.exit(1);
  }

  for (const event of reviewEvents) {
    const id = `reviewEvent-${event.slug}`;
    const exists = DRY_RUN ? null : await client.getDocument(id);
    if (exists) {
      console.log(`skip    ${id} (already exists)`);
      continue;
    }
    const doc = await toDocument(event);
    if (DRY_RUN) {
      console.log(`dry-run ${id}: ${doc.titlePl}, ${doc.reviews.length} review(s), image ${doc.image?.asset._ref}`);
      continue;
    }
    await client.create(doc);
    console.log(`created ${id}: ${doc.titlePl}, ${doc.reviews.length} review(s)`);
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
