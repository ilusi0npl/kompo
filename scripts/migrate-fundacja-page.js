#!/usr/bin/env node

/**
 * Migrate Fundacja Page from fundacja-config.js to Sanity CMS
 *
 * Creates a single fundacjaPage document (singleton)
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config();

// Initialize Sanity client
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

// Fundacja page data from fundacja-config.js
const fundacjaData = {
  title: 'Fundacja',
  backgroundColor: '#34B898',
  lineColor: '#01936F',
  textColor: '#131313',
  linkColor: '#761FE0',
  krs: '0000590463',
  regon: '363197180',
  nip: '8982215656',
  bankAccount: '13 1090 1522 0000 0001 4279 3816',
  email: 'KOMPOPOLEX@GMAIL.COM',
  projects: [
    {
      text: 'wydanie płyty z akordeonową muzyką kameralną Cezarego Duchnowskiego',
      linkText: 'CROSSFADE, WYD. REQUIEM RECORDS',
      linkUrl: 'https://requiemrecords.eu/product/cezary-duchnowski-crossfade/',
    },
    {
      text: 'zamówienie nowych kompozycji u Moniki Szpyrki i Piotra Tabakiernika dla Duo van Vliet',
      linkText: null,
      linkUrl: null,
    },
    {
      text: 'organizacja koncertu Duo van Vliet (+ przyjaciele) w Centrum Sztuki Wro',
      linkText: 'DUO VAN VLIET',
      linkUrl: 'https://www.duovanvliet.com/',
    },
  ],
  accessibilityDeclarationPl: [
    'Fundacja Kompopolex zobowiązuje się zapewnić dostępność swojej strony internetowej zgodnie z przepisami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych. Oświadczenie w sprawie dostępności ma zastosowanie do strony internetowej Strony Domowej Fundacji Kompopolex.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
  ],
  accessibilityDeclarationEn: [
    'Fundacja Kompopolex is committed to ensuring the accessibility of its website in accordance with the provisions of the Act of April 4, 2019 on the digital accessibility of websites and mobile applications of public entities. The accessibility statement applies to the Home Page of the Kompopolex Foundation.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
    'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
  ],
};

/**
 * Create fundacjaPage document in Sanity
 */
async function createFundacjaPage(data) {
  // Check if fundacjaPage already exists (singleton)
  const existing = await client.fetch(`*[_type == "fundacjaPage"][0]`);

  if (existing) {
    console.log(`  ⚠️  Fundacja page already exists: ${existing._id}`);
    console.log(`     To update, delete it in Sanity Studio first`);
    return existing;
  }

  // Convert hex colors to Sanity color format
  const toSanityColor = (hex) => ({
    hex,
    alpha: 1,
  });

  const doc = {
    _type: 'fundacjaPage',
    title: data.title,
    backgroundColor: toSanityColor(data.backgroundColor),
    lineColor: toSanityColor(data.lineColor),
    textColor: toSanityColor(data.textColor),
    linkColor: toSanityColor(data.linkColor),
    krs: data.krs,
    regon: data.regon,
    nip: data.nip,
    bankAccount: data.bankAccount,
    email: data.email,
    projects: data.projects,
    accessibilityDeclarationPl: data.accessibilityDeclarationPl,
    accessibilityDeclarationEn: data.accessibilityDeclarationEn,
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Fundacja page created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Fundacja Page Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  try {
    console.log('Processing: Fundacja page');

    // Create fundacjaPage document
    const fundacjaDoc = await createFundacjaPage(fundacjaData);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Successfully migrated Fundacja page\n');
    console.log(`  ID: ${fundacjaDoc._id}`);
    console.log(`  KRS: ${fundacjaDoc.krs}`);
    console.log(`  Projects: ${fundacjaData.projects.length}`);
    console.log(`  Accessibility (PL): ${fundacjaData.accessibilityDeclarationPl.length} paragraphs`);
    console.log(`  Accessibility (EN): ${fundacjaData.accessibilityDeclarationEn.length} paragraphs`);

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Create useSanityFundacjaPage hook');
    console.log('  3. Integrate into Fundacja page component\n');
  } catch (error) {
    console.error(`\n❌ Failed to migrate Fundacja page`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Run migration
migrate();
