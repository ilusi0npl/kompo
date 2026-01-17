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

const profiles = await client.fetch(`*[_type == "bioProfile"] {
  _id,
  namePl,
  paragraphsPl
}`);

profiles.forEach(profile => {
  console.log('\n=== ' + profile.namePl + ' ===');
  profile.paragraphsPl.forEach((p, i) => {
    console.log(`\nParagraph ${i+1} (PL):`);
    console.log(p);
  });
});
