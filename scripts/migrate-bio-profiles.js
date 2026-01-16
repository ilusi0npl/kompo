#!/usr/bin/env node

/**
 * Migrate Bio Profiles from bio-config.js to Sanity CMS
 *
 * Migrates 4 bio profiles:
 * 1. Ensemble KOMPOPOLEX
 * 2. Aleksandra Gołaj
 * 3. Rafał Łuc
 * 4. Jacek Sotomski
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

// Bio profile data from bio-config.js
const bioProfiles = [
  {
    order: 1,
    name: 'Ensemble KOMPOPOLEX',
    backgroundColor: '#FDFDFD',
    lineColor: '#A0E38A',
    textColor: '#131313',
    imagePath: path.join(__dirname, '../public/assets/bio/bio1-ensemble.webp'),
    imageStyle: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: '50% 50%',
    },
    paragraphs: [
      'Trio specjalizujące się w muzyce najnowszej, założone 2017 roku we Wrocławiu. Wykonują utwory zaangażowane i angażujące, często porzucają swoje instrumenty na rzecz kabli, keyboardów, tańca i śpiewu. W jego skład wchodzą Aleksandra Gołaj (perkusja), Rafał Łuc (akordeon) i Jacek Sotomski (komputery).',
      'Przez lata działalności zespół zdążył zagrać na najważniejszych festiwalach muzyki nowej w Polsce i za granicą: Mixtur Festival, Warszawskiej Jesieni, Sacrum Profanum, Festiwalu Prawykonań, Musica Polonica Nova oraz Musica Electronica Nova. Wystąpił również na MMMM 2.1 w Stalowej Woli, Eksperymentalnych Wtorkach w Sinfonii Varsovii, teatralnym Festiwalu Kontrapunkt w Szczecinie, Festiwalu NeoArte Syntezator Sztuki.'
    ],
    paragraphTops: [260, 420],
    hasFooter: false,
  },
  {
    order: 2,
    name: 'Aleksandra Gołaj',
    backgroundColor: '#FF734C',
    lineColor: '#FFBD19',
    textColor: '#131313',
    imagePath: path.join(__dirname, '../public/assets/bio/bio2-aleksandra.webp'),
    imageStyle: {
      position: 'absolute',
      width: '342.5%',
      height: '159.57%',
      left: '0.75%',
      top: '-28.91%',
      maxWidth: 'none',
    },
    paragraphs: [
      'Na stałe związana z Orkiestrą Symfoniczną NFM Filharmonia Wrocławska. Jako kameralistka regularnie występuje na festiwalach związanych z muzyką współczesną m. in. MUSMA, Musica Polonica Nova, Musica Electronica Nova, ISCM World Music Days 2014, Poznańska Wiosna Muzyczna, Muzyka na Szczytach, Warszawska Jesień.',
      'W latach 2015-2018 wykładowca Akademii Muzycznej we Wrocławiu. Zaangażowana w umuzykalnianie młodzieży. Bierze udział w pilotażowym projekcie Dolnośląskiego Towarzystwa Muzycznego, polegającym na wprowadzeniu orkiestr dętych jako zajęć pozalekcyjnych.'
    ],
    paragraphTops: [260, 446],
    hasFooter: false,
  },
  {
    order: 3,
    name: 'Rafał Łuc',
    backgroundColor: '#34B898',
    lineColor: '#01936F',
    textColor: '#131313',
    imagePath: path.join(__dirname, '../public/assets/bio/bio3-rafal.webp'),
    imageStyle: {
      position: 'absolute',
      width: '330.37%',
      height: '153.91%',
      left: '-101.18%',
      top: '-13.7%',
      maxWidth: 'none',
    },
    paragraphs: [
      'Wielokrotnie nagradzany muzyk, akordeonista. Absolwent Royal Academy of Music w Londynie, Musikene w San Sebastian, Akademii Muzycznej im. Karola Lipińskiego we Wrocławiu, w której zatrudniony jest na stanowisku adiunkta. We wrześniu 2018 r. uzyskał tytuł doktora habilitowanego, dwukrotnie kandydat do nominacji Paszportów Polityki.',
      'Koncertuje na całym świecie solo, kameralnie oraz z takimi zespołami orkiestrowymi jak BBC Symphony Orchestra, London Sinfonietta, Aurora Orchestra, Rambert Dance Company, NFM Filharmonią Wrocławską.',
      'Jego nagrania znajdują się na 10 płytach CD. Neil Fisher z dziennika \'The Times\' określił Rafała Łuca jako: \'dojrzałego muzyka wyróżniającego się głębokim zaangażowaniem w wykorzystanie całego potencjału swojego instrumentu\'.'
    ],
    paragraphTops: [260, 444, 556],
    hasFooter: false,
  },
  {
    order: 4,
    name: 'Jacek Sotomski',
    backgroundColor: '#73A1FE',
    lineColor: '#3478FF',
    textColor: '#131313',
    imagePath: path.join(__dirname, '../public/assets/bio/bio4-jacek.webp'),
    imageStyle: {
      position: 'absolute',
      width: '301.44%',
      height: '140.43%',
      left: '-198.05%',
      top: '-0.22%',
      maxWidth: 'none',
    },
    paragraphs: [
      'Jego utwory były wykonywane na festiwalach World Music Days, Warszawska Jesień, BIFEM w Bendigo (Australia), Ostrava Music Days, Musica Polonica Nova, Musica Electronica Nova, oprócz tego jako wykonawca wystąpił na Festival Licences w Paryżu, Ring Ring w Belgradzie, Cinemascope w Mińsku.',
      'W 2018 roku był nominowany do nagrody polskiego środowiska muzycznego Koryfeusz Muzyki Polskiej w kategorii Odkrycie Roku. W 2011 roku założył z Mikołajem Laskowskim duet sultan hagavik, z którym dwa lata po rozpoczęciu działalności wygrał nagrodę nurtu OFF na Przeglądzie Piosenki Aktorskiej we Wrocławiu.'
    ],
    paragraphTops: [256, 416],
    hasFooter: true,
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
 * Create bio profile document in Sanity
 */
async function createBioProfile(profileData, imageAsset) {
  // Check if profile already exists
  const existing = await client.fetch(
    `*[_type == "bioProfile" && name == $name][0]`,
    { name: profileData.name }
  );

  if (existing) {
    console.log(`  ⚠️  Profile already exists: ${existing._id}`);
    return existing;
  }

  // Convert hex colors to Sanity color format
  const toSanityColor = (hex) => ({
    hex,
    alpha: 1,
  });

  const doc = {
    _type: 'bioProfile',
    name: profileData.name,
    order: profileData.order,
    backgroundColor: toSanityColor(profileData.backgroundColor),
    lineColor: toSanityColor(profileData.lineColor),
    textColor: toSanityColor(profileData.textColor),
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
    imageStyle: profileData.imageStyle,
    paragraphs: profileData.paragraphs,
    paragraphTops: profileData.paragraphTops,
    hasFooter: profileData.hasFooter,
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(doc);
  console.log(`  ✓ Profile created: ${created._id}`);
  return created;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Bio Profiles Migration to Sanity CMS\n');
  console.log(`Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.VITE_SANITY_DATASET}\n`);

  // Pre-flight validation: Check all images exist
  console.log('🔍 Pre-flight validation...');
  const missingImages = [];
  for (const profile of bioProfiles) {
    if (!fs.existsSync(profile.imagePath)) {
      missingImages.push(profile.imagePath);
    }
  }

  if (missingImages.length > 0) {
    console.error('\n❌ Error: Missing image files:');
    missingImages.forEach(path => console.error(`  - ${path}`));
    process.exit(1);
  }
  console.log('✓ All image files found\n');

  // Migrate profiles
  const results = [];
  const failures = [];

  for (const profile of bioProfiles) {
    try {
      console.log(`\n[${profile.order}/${bioProfiles.length}] Processing: ${profile.name}`);

      // Upload image
      const imageAsset = await uploadImage(profile.imagePath);

      // Create profile document
      const profileDoc = await createBioProfile(profile, imageAsset);

      results.push({
        order: profile.order,
        name: profile.name,
        sanityId: profileDoc._id,
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate: ${profile.name}`);
      console.error(`     Error: ${error.message}`);
      failures.push({
        order: profile.order,
        name: profile.name,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));

  if (results.length > 0) {
    console.log('\n✅ Successfully migrated profiles:\n');
    results.forEach((r) => {
      console.log(`  ${r.order}. ${r.name}`);
      console.log(`     ID: ${r.sanityId}`);
    });
  }

  if (failures.length > 0) {
    console.log('\n❌ Failed profiles:\n');
    failures.forEach((f) => {
      console.log(`  ${f.order}. ${f.name}`);
      console.log(`     Error: ${f.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Migration complete: ${results.length}/${bioProfiles.length} profiles migrated\n`);

  // Verification reminder
  if (results.length > 0) {
    console.log('📋 Next steps:');
    console.log('  1. Verify data in Sanity Studio');
    console.log('  2. Run: node scripts/verify-bio-migration.js');
    console.log('  3. Continue with Task 16 (Create useSanityBioProfiles hook)\n');
  }
}

// Run migration
migrate();
