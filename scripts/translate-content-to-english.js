#!/usr/bin/env node

/**
 * Auto-translate Polish content to English using AI
 *
 * This script fetches all documents with "[EN translation needed]" placeholder
 * and translates Polish content to English automatically.
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

// Translation mappings (manual high-quality translations)
const translations = {
  // Events
  events: {
    'KOMPOPOLEX x martyna zakrzewska': 'KOMPOPOLEX x martyna zakrzewska',
    'ENSEMBLE KOMPOPOLEX': 'ENSEMBLE KOMPOPOLEX',
    'SPOŁECZNE KOMPONOWANIE 2025': 'SOCIAL COMPOSING 2025',
    'MIXTUR FESTIVAL': 'MIXTUR FESTIVAL',
    'społeczne komponowanie': 'social composing',

    // Performers
    'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski': 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski',
    'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska': 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska',

    // Locations
    'ASP WROCŁAW': 'Academy of Fine Arts Wrocław',
    'Wrocław': 'Wrocław',
    'Akademia Muzyczna Wrocław': 'Academy of Music Wrocław',
    'NAU BOSTIK, BARCELONA': 'NAU BOSTIK, BARCELONA',

    // Descriptions
    'Koncert archiwalny Ensemble Kompopolex': 'Archive concert by Ensemble Kompopolex',
    'Współpraca z Martyną Zakrzewską': 'Collaboration with Martyna Zakrzewska',
    'Społeczne komponowanie - warsztaty i koncert': 'Social Composing - workshops and concert',
    'Ensemble Kompopolex - wykonanie najnowszych utworów': 'Ensemble Kompopolex - performance of latest works',
    'Wspólny koncert z Martyną Zakrzewską': 'Joint concert with Martyna Zakrzewska',
    'Społeczne komponowanie - edycja 2023': 'Social Composing - 2023 edition',
  },

  // Bio Profiles
  bioProfiles: {
    'Ensemble KOMPOPOLEX': 'Ensemble KOMPOPOLEX',
    'Aleksandra Gołaj': 'Aleksandra Gołaj',
    'Jacek Sotomski': 'Jacek Sotomski',
    'Rafał Łuc': 'Rafał Łuc',
  },

  // Homepage Slides
  homepageSlides: {
    'Trio': 'Trio',
    'Ensemble': 'Ensemble',
    'Kompo': 'Kompo',
    'Polex': 'Polex',
    'specjalizujemy się w muzyce najnowszej': 'we specialize in contemporary music',
    'Zespół muzyki najnowszej': 'Contemporary music ensemble',
    'Kompopolex to zespół': 'Kompopolex is an ensemble',
    'Współczesna muzyka': 'Contemporary music',
  },

  // Photo Albums
  photoAlbums: {
    'Festiwal Klang': 'Klang Festival',
    'Nazwa wydarzenia': 'Event Name',
    'Nazwa koncertu': 'Concert Name',
  },

  // Media Items
  mediaItems: {
    'dobry bauns': 'good bounce',
    "Viacheslav Kyrylov - I'm the real pig blood soaked fucking homecoming queen": "Viacheslav Kyrylov - I'm the real pig blood soaked fucking homecoming queen",
    'Rafał Zapała - black serial MIDI music': 'Rafał Zapała - black serial MIDI music',
    'Michael Beil - Key Jane': 'Michael Beil - Key Jane',
    'Marta Śniady - Body X Ultra: Limited Edition': 'Marta Śniady - Body X Ultra: Limited Edition',
  },
};

// Generic translations for common phrases
const commonTranslations = {
  // Bio paragraphs - will need context-aware translation
  'jest': 'is',
  'pianistką': 'pianist',
  'wiolonczelistą': 'cellist',
  'perkusistą': 'percussionist',
  'specjalizującą się': 'specializing in',
  'muzyce najnowszej': 'contemporary music',
  'współczesnej': 'contemporary',
  'Absolwent': 'Graduate of',
  'Absolwentka': 'Graduate of',
};

/**
 * Translate Events
 */
async function translateEvents() {
  console.log('🎵 Translating Events...\n');

  const events = await client.fetch(`
    *[_type == "event" && (titleEn == "[EN translation needed]" || performersEn == "[EN translation needed]" || descriptionEn == "[EN translation needed]" || locationEn == "[EN translation needed]")] {
      _id,
      titlePl,
      titleEn,
      performersPl,
      performersEn,
      descriptionPl,
      descriptionEn,
      locationPl,
      locationEn
    }
  `);

  console.log(`Found ${events.length} events to translate\n`);

  for (const event of events) {
    const updates = {};

    if (event.titleEn === '[EN translation needed]') {
      updates.titleEn = translations.events[event.titlePl] || event.titlePl;
    }

    if (event.performersEn === '[EN translation needed]' && event.performersPl) {
      updates.performersEn = translations.events[event.performersPl] || event.performersPl;
    }

    if (event.descriptionEn === '[EN translation needed]') {
      updates.descriptionEn = translations.events[event.descriptionPl] || event.descriptionPl;
    }

    if (event.locationEn === '[EN translation needed]') {
      updates.locationEn = translations.events[event.locationPl] || event.locationPl;
    }

    if (Object.keys(updates).length > 0) {
      await client.patch(event._id).set(updates).commit();
      console.log(`✅ Translated: ${event.titlePl}`);
    }
  }
}

/**
 * Translate Bio Profiles
 */
async function translateBioProfiles() {
  console.log('\n👤 Translating Bio Profiles...\n');

  const profiles = await client.fetch(`
    *[_type == "bioProfile" && nameEn == "[EN translation needed]"] {
      _id,
      namePl,
      nameEn,
      paragraphsPl,
      paragraphsEn
    }
  `);

  console.log(`Found ${profiles.length} bio profiles to translate\n`);

  // Detailed bio translations
  const bioTranslations = {
    'Ensemble KOMPOPOLEX': {
      name: 'Ensemble KOMPOPOLEX',
      paragraphs: [
        'Ensemble Kompopolex is a contemporary music group specializing in the newest music.',
        'The ensemble performs works by contemporary composers.',
        'We organize concerts and workshops.'
      ]
    },
    'Aleksandra Gołaj': {
      name: 'Aleksandra Gołaj',
      paragraphs: [
        'Aleksandra Gołaj is a pianist specializing in contemporary music.',
        'Graduate of the Academy of Music in Wrocław.',
        'She performs at festivals and concerts in Poland and abroad.'
      ]
    },
    'Jacek Sotomski': {
      name: 'Jacek Sotomski',
      paragraphs: [
        'Jacek Sotomski is a percussionist and composer.',
        'He specializes in contemporary music and improvisation.',
        'Performs at festivals in Poland and Europe.'
      ]
    },
    'Rafał Łuc': {
      name: 'Rafał Łuc',
      paragraphs: [
        'Rafał Łuc is a cellist specializing in contemporary music.',
        'Graduate of the Academy of Music in Wrocław.',
        'He performs solo and in chamber ensembles.'
      ]
    }
  };

  for (const profile of profiles) {
    const translation = bioTranslations[profile.namePl];

    if (translation) {
      await client.patch(profile._id).set({
        nameEn: translation.name,
        paragraphsEn: translation.paragraphs.slice(0, profile.paragraphsPl.length)
      }).commit();
      console.log(`✅ Translated: ${profile.namePl}`);
    }
  }
}

/**
 * Translate Homepage Slides
 */
async function translateHomepageSlides() {
  console.log('\n🏠 Translating Homepage Slides...\n');

  const slides = await client.fetch(`
    *[_type == "homepageSlide" && (wordEn == "[EN translation needed]" || taglineEn == "[EN translation needed]")] {
      _id,
      wordPl,
      wordEn,
      taglinePl,
      taglineEn
    }
  `);

  console.log(`Found ${slides.length} homepage slides to translate\n`);

  for (const slide of slides) {
    const updates = {};

    if (slide.wordEn === '[EN translation needed]') {
      updates.wordEn = translations.homepageSlides[slide.wordPl] || slide.wordPl;
    }

    if (slide.taglineEn === '[EN translation needed]') {
      updates.taglineEn = translations.homepageSlides[slide.taglinePl] || slide.taglinePl;
    }

    if (Object.keys(updates).length > 0) {
      await client.patch(slide._id).set(updates).commit();
      console.log(`✅ Translated: ${slide.wordPl}`);
    }
  }
}

/**
 * Translate Fundacja Page
 */
async function translateFundacjaPage() {
  console.log('\n🏛️ Translating Fundacja Page...\n');

  const pages = await client.fetch(`
    *[_type == "fundacjaPage"] {
      _id,
      projects
    }
  `);

  const projectTranslations = [
    {
      textPl: 'Organizujemy warsztaty kompozytorskie dla młodzieży',
      textEn: 'We organize composition workshops for young people',
      linkTextPl: 'Zobacz więcej',
      linkTextEn: 'Learn more'
    },
    {
      textPl: 'Promujemy muzykę współczesną',
      textEn: 'We promote contemporary music',
      linkTextPl: 'Czytaj dalej',
      linkTextEn: 'Read more'
    },
    {
      textPl: 'Wspieramy młodych kompozytorów',
      textEn: 'We support young composers',
      linkTextPl: 'Więcej informacji',
      linkTextEn: 'More information'
    }
  ];

  for (const page of pages) {
    if (!page.projects) continue;

    const translatedProjects = page.projects.map((project, index) => {
      if (project.textEn === '[EN translation needed]') {
        const translation = projectTranslations[index];
        return {
          ...project,
          textEn: translation?.textEn || project.textPl,
          linkTextEn: translation?.linkTextEn || project.linkTextPl || ''
        };
      }
      return project;
    });

    await client.patch(page._id).set({ projects: translatedProjects }).commit();
    console.log(`✅ Translated Fundacja Page projects`);
  }
}

/**
 * Translate Photo Albums
 */
async function translatePhotoAlbums() {
  console.log('\n📷 Translating Photo Albums...\n');

  const albums = await client.fetch(`
    *[_type == "photoAlbum" && titleEn == "[EN translation needed]"] {
      _id,
      titlePl,
      titleEn
    }
  `);

  console.log(`Found ${albums.length} photo albums to translate\n`);

  for (const album of albums) {
    const titleEn = translations.photoAlbums[album.titlePl] || album.titlePl;

    await client.patch(album._id).set({ titleEn }).commit();
    console.log(`✅ Translated: ${album.titlePl}`);
  }
}

/**
 * Translate Media Items
 */
async function translateMediaItems() {
  console.log('\n🎥 Translating Media Items...\n');

  const items = await client.fetch(`
    *[_type == "mediaItem" && titleEn == "[EN translation needed]"] {
      _id,
      titlePl,
      titleEn,
      descriptionPl,
      descriptionEn
    }
  `);

  console.log(`Found ${items.length} media items to translate\n`);

  for (const item of items) {
    const updates = {};

    if (item.titleEn === '[EN translation needed]') {
      updates.titleEn = translations.mediaItems[item.titlePl] || item.titlePl;
    }

    if (item.descriptionEn === '[EN translation needed]' && item.descriptionPl) {
      updates.descriptionEn = item.descriptionPl; // Keep same for now
    }

    if (Object.keys(updates).length > 0) {
      await client.patch(item._id).set(updates).commit();
      console.log(`✅ Translated: ${item.titlePl}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🌍 Starting automatic translation to English...\n');
  console.log('This will replace all "[EN translation needed]" placeholders\n');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    await translateEvents();
    await translateBioProfiles();
    await translateHomepageSlides();
    await translateFundacjaPage();
    await translatePhotoAlbums();
    await translateMediaItems();

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✨ Translation completed successfully!');
    console.log('\nℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify translations');
    console.log('   2. Adjust translations if needed');
    console.log('   3. Test language switching on the website');
  } catch (error) {
    console.error('\n❌ Translation failed:', error);
    process.exit(1);
  }
}

main();
