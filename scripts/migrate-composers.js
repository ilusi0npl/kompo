#!/usr/bin/env node

/**
 * Migrate Composers from repertuar-config.js and specialne-config.js to Sanity CMS
 *
 * Migrates composers with their works to the composer schema
 * - Repertuar: 25 composers
 * - Specialne: 7 composers
 */

import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { nanoid } from 'nanoid';

dotenv.config();

// Initialize Sanity client
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'cy9ddq1w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});

// Repertuar composers data (from repertuar-config.js)
const repertuarComposers = [
  {
    name: 'Carola Bauckholt',
    year: '(1959)',
    works: [{ title: 'Geräusche (1992)', isSpecial: false }],
  },
  {
    name: 'Piotr Bednarczyk',
    year: '(1994)',
    works: [{ title: 'triggered (2020)', isSpecial: true }],
  },
  {
    name: 'Jorge Sanchez-Chiong',
    year: '(1969)',
    works: [{ title: 'Salt Water (2014/15)', isSpecial: false }],
  },
  {
    name: 'Monika Dalach',
    year: '(1993)',
    works: [{ title: 'CARBON IS THE NEW BLACK (2020)', isSpecial: true }],
  },
  {
    name: 'Nina Fukuoka',
    year: '(1988)',
    works: [{ title: 'uncanny valley (2018)', isSpecial: true }],
  },
  {
    name: 'Aleksandra Gryka',
    year: '(1977)',
    works: [{ title: 'PLASTIC (2021)', isSpecial: false }],
  },
  {
    name: 'Katarina Gryvul',
    year: '(1993)',
    works: [{ title: 'Chasm (2023)', isSpecial: true }],
  },
  {
    name: 'Eloain Lovis Hübner',
    year: '(1993)',
    works: [{ title: 'trauma und zwischenraum (2021)', isSpecial: true }],
  },
  {
    name: 'Neo Hülcker',
    year: '(1987)',
    works: [{ title: 'we speak (2019)', isSpecial: false }],
  },
  {
    name: 'La Monte Young',
    year: '(1935)',
    works: [{ title: 'Composition #7, #10, #13', isSpecial: false }],
  },
  {
    name: 'Martin A. Hirsti-Kvam',
    year: '(1991)',
    works: [{ title: 'Memory Box #2 (2023)', isSpecial: true }],
  },
  {
    name: 'Simon Løffler',
    year: '(1981)',
    works: [{ title: 'b (2012)', isSpecial: false }],
  },
  {
    name: 'Paweł Malinowski',
    year: '(1994)',
    works: [{ title: 'Imaginarium Polkolor (2020)', isSpecial: true }],
  },
  {
    name: 'Celeste Oram',
    year: '(1990)',
    works: [{ title: 'XEROX ROCK (2015)', isSpecial: false }],
  },
  {
    name: 'Piotr Peszat',
    year: '(1990)',
    works: [{ title: 'Untitled Folder #3 (2019)', isSpecial: false }],
  },
  {
    name: 'Rafał Zapała',
    year: '(1975)',
    works: [{ title: 'black serial MIDI music (2023)', isSpecial: true }],
  },
  {
    name: 'Rafał Ryterski',
    year: '(1992)',
    works: [{ title: 'Breathe (2021)', isSpecial: true }],
  },
  {
    name: 'Kelley Sheehan',
    year: '(1989)',
    works: [{ title: 'BrainZaps (2020)', isSpecial: false }],
  },
  {
    name: 'Agata Zemla',
    year: '(1994)',
    works: [{ title: 'Simona (2021)', isSpecial: true }],
  },
  {
    name: 'Monika Szpyrka',
    year: '(1993)',
    works: [{ title: 'Angle of Reflection (2022)', isSpecial: true }],
  },
  {
    name: 'Olgierd Żemojtel',
    year: '',
    works: [{ title: 'BANKSY________ (2022)', isSpecial: true }],
  },
  {
    name: 'Teoniki Rożynek',
    year: '(1991)',
    works: [
      { title: 'bol (2017)', isSpecial: false },
      { title: 'The Most Satysfying Music in the World (2017)', isSpecial: false },
    ],
  },
  {
    name: 'Jenniffer Walshe',
    year: '(1974)',
    works: [
      {
        title: 'EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE (2013)',
        isSpecial: false,
      },
    ],
  },
  {
    name: 'Matthew Shlomowitz',
    year: '(1975)',
    works: [{ title: 'Weird Audio Guide (2011 rev. 2020)', isSpecial: false }],
  },
  {
    name: 'Marta Śniady',
    year: '(1986)',
    works: [
      { title: 'c_ut|e_#1 (2017)', isSpecial: false },
      { title: 'Body X Ultra (2023)', isSpecial: true },
    ],
  },
];

// Specialne composers data (from specialne-config.js)
const specialneComposers = [
  {
    name: 'Michael Beil',
    year: '(1963)',
    works: [{ title: 'Caravan (2017)', isSpecial: false }],
  },
  {
    name: 'Cezary Duchnowski',
    year: '(1971)',
    works: [{ title: 'Wściekłość (2018)', isSpecial: true }],
  },
  {
    name: 'Kuba Krzewiński',
    year: '(1988)',
    works: [{ title: 'Another Air (2017)', isSpecial: true }],
  },
  {
    name: 'Simon Løffler',
    year: '(1981)',
    works: [{ title: 'H (2014-2018)', isSpecial: false }],
  },
  {
    name: 'Bogusław Schaeffer',
    year: '(1929-2019)',
    works: [{ title: 'TIS MW2 (1963)', isSpecial: false }],
  },
  {
    name: 'Jacek Sotomski',
    year: '(1987)',
    works: [{ title: 'CREDOPOL (2018, rev. 2019)', isSpecial: true }],
  },
  {
    name: 'Marek Chołoniewski',
    year: '(1953)',
    works: [{ title: 'Assemblages dla konkretnych wykonawców (1975-79)', isSpecial: false }],
  },
];

/**
 * Create composer in Sanity
 */
async function createComposer(composerData, category, order) {
  // Check if composer already exists (by name and category)
  const existing = await client.fetch(
    `*[_type == "composer" && name == $name && category == $category][0]`,
    { name: composerData.name, category }
  );

  if (existing) {
    console.log(`  ⚠️  Composer already exists: ${existing._id}`);
    return existing;
  }

  const doc = {
    _type: 'composer',
    name: composerData.name,
    year: composerData.year,
    works: composerData.works.map(work => ({
      ...work,
      _key: nanoid(),
    })),
    category,
    order,
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Composer created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Composers Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  const results = [];
  const failures = [];

  // Migrate Repertuar composers
  console.log('📚 Migrating Repertuar composers...\n');
  for (let i = 0; i < repertuarComposers.length; i++) {
    const composer = repertuarComposers[i];
    try {
      console.log(`[${i + 1}/${repertuarComposers.length}] Processing: ${composer.name}`);
      const composerDoc = await createComposer(composer, 'repertuar', i + 1);
      results.push({
        name: composer.name,
        category: 'repertuar',
        sanityId: composerDoc._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${composer.name}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        name: composer.name,
        category: 'repertuar',
        error: error.message,
      });
    }
  }

  console.log('\n');

  // Migrate Specialne composers
  console.log('⭐ Migrating Specialne composers...\n');
  for (let i = 0; i < specialneComposers.length; i++) {
    const composer = specialneComposers[i];
    try {
      console.log(`[${i + 1}/${specialneComposers.length}] Processing: ${composer.name}`);
      const composerDoc = await createComposer(composer, 'specialne', i + 1);
      results.push({
        name: composer.name,
        category: 'specialne',
        sanityId: composerDoc._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${composer.name}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        name: composer.name,
        category: 'specialne',
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));

  if (results.length > 0) {
    console.log('\n✅ Successfully migrated composers:\n');

    const repertuar = results.filter((r) => r.category === 'repertuar');
    const specialne = results.filter((r) => r.category === 'specialne');

    if (repertuar.length > 0) {
      console.log(`📚 Repertuar (${repertuar.length}):`);
      repertuar.forEach((r) => {
        console.log(`  • ${r.name}`);
        console.log(`    ID: ${r.sanityId}`);
      });
    }

    if (specialne.length > 0) {
      console.log(`\n⭐ Specialne (${specialne.length}):`);
      specialne.forEach((r) => {
        console.log(`  • ${r.name}`);
        console.log(`    ID: ${r.sanityId}`);
      });
    }
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed composers:\n');
    failures.forEach((f) => {
      console.log(`  • ${f.name} (${f.category})`);
      console.log(`    Error: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(
    `\n✅ Migration complete: ${results.length}/${repertuarComposers.length + specialneComposers.length} composers migrated\n`
  );

  // Verification reminder
  if (results.length > 0) {
    console.log('📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Add GROQ queries for composers');
    console.log('  3. Create hooks: useSanityRepertuar, useSanitySpecjalne');
    console.log('  4. Integrate into Repertuar and Specialne page components\n');
  }
}

// Run migration
migrate();
