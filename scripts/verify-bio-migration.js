#!/usr/bin/env node

/**
 * Verify Bio Profiles Migration
 *
 * Fetches bio profiles from Sanity and displays for verification
 */

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

const query = `*[_type == "bioProfile"] | order(order asc) {
  _id,
  name,
  order,
  backgroundColor,
  lineColor,
  textColor,
  "imageUrl": image.asset->url,
  imageStyle,
  paragraphs,
  paragraphTops,
  hasFooter,
  publishedAt
}`;

async function verify() {
  console.log('🔍 Fetching Bio Profiles from Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  try {
    const profiles = await client.fetch(query);

    if (profiles.length === 0) {
      console.log('⚠️  No bio profiles found in Sanity CMS\n');
      return;
    }

    console.log(`✅ Found ${profiles.length} bio profiles:\n`);
    console.log('='.repeat(80));

    profiles.forEach((profile, index) => {
      console.log(`\n[${profile.order}] ${profile.name}`);
      console.log('-'.repeat(80));
      console.log(`ID:              ${profile._id}`);
      console.log(`Background:      ${profile.backgroundColor?.hex}`);
      console.log(`Line Color:      ${profile.lineColor?.hex}`);
      console.log(`Text Color:      ${profile.textColor?.hex}`);
      console.log(`Image URL:       ${profile.imageUrl}`);
      console.log(`Has Footer:      ${profile.hasFooter}`);
      console.log(`Published At:    ${profile.publishedAt}`);

      console.log(`\nParagraphs (${profile.paragraphs.length}):`);
      profile.paragraphs.forEach((p, i) => {
        const preview = p.length > 100 ? p.substring(0, 100) + '...' : p;
        console.log(`  ${i + 1}. ${preview}`);
      });

      if (profile.paragraphTops) {
        console.log(`\nParagraph Tops:  [${profile.paragraphTops.join(', ')}]`);
      }

      if (profile.imageStyle) {
        console.log('\nImage Style:');
        Object.entries(profile.imageStyle).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Verification complete!');
    console.log('\n📋 Next steps:');
    console.log('  1. Check image URLs open correctly in browser');
    console.log('  2. Compare with bio-config.js data');
    console.log('  3. Continue with Task 16 (Create useSanityBioProfiles hook)\n');

  } catch (error) {
    console.error('\n❌ Error fetching bio profiles:', error.message);
    process.exit(1);
  }
}

verify();
