#!/usr/bin/env node

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

const query = `*[_type == "event" && defined(publishedAt)] | order(date asc) {
  _id,
  title,
  date,
  status,
  performers,
  program,
  description,
  location,
  "imageUrl": image.asset->url,
  imageStyle,
  publishedAt
}`;

const events = await client.fetch(query);
console.log('\n📋 Migrated Events:\n');
console.log(JSON.stringify(events, null, 2));
console.log(`\n✅ Total published events: ${events.length}`);
