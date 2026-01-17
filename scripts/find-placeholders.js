import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

const PLACEHOLDER = '[EN translation needed]';

async function findPlaceholders() {
  console.log('🔍 Searching for remaining placeholders...\n');

  // Check events
  const events = await client.fetch(`
    *[_type == "event" && (
      titleEn match "${PLACEHOLDER}" ||
      performersEn match "${PLACEHOLDER}" ||
      descriptionEn match "${PLACEHOLDER}" ||
      locationEn match "${PLACEHOLDER}"
    )] {
      _id, titlePl
    }
  `);

  if (events.length > 0) {
    console.log(`❌ Found ${events.length} events with placeholders`);
  } else {
    console.log(`✅ All events translated`);
  }

  // Check bio profiles
  const bios = await client.fetch(`
    *[_type == "bioProfile" && nameEn match "${PLACEHOLDER}"] {
      _id, namePl
    }
  `);

  if (bios.length > 0) {
    console.log(`❌ Found ${bios.length} bio profiles with placeholders`);
  } else {
    console.log(`✅ All bio profiles translated`);
  }

  // Check homepage slides
  const slides = await client.fetch(`
    *[_type == "homepageSlide" && (
      wordEn match "${PLACEHOLDER}" ||
      taglineEn match "${PLACEHOLDER}"
    )] {
      _id, wordPl
    }
  `);

  if (slides.length > 0) {
    console.log(`❌ Found ${slides.length} homepage slides with placeholders`);
  } else {
    console.log(`✅ All homepage slides translated`);
  }

  // Check photo albums
  const albums = await client.fetch(`
    *[_type == "photoAlbum" && titleEn match "${PLACEHOLDER}"] {
      _id, titlePl
    }
  `);

  if (albums.length > 0) {
    console.log(`❌ Found ${albums.length} photo albums with placeholders`);
  } else {
    console.log(`✅ All photo albums translated`);
  }

  // Check media items
  const media = await client.fetch(`
    *[_type == "mediaItem" && titleEn match "${PLACEHOLDER}"] {
      _id, titlePl
    }
  `);

  if (media.length > 0) {
    console.log(`❌ Found ${media.length} media items with placeholders`);
  } else {
    console.log(`✅ All media items translated`);
  }

  const total = events.length + bios.length + slides.length + albums.length + media.length;

  console.log('\n════════════════════════════════════════');
  if (total === 0) {
    console.log('🎉 All content translated! No placeholders found.');
  } else {
    console.log(`⚠️  Total items with placeholders: ${total}`);
  }
}

findPlaceholders();
