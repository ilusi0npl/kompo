#!/usr/bin/env node

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

async function checkTranslations() {
  // Check one event
  const event = await client.fetch(`*[_type == "event"][0] {
    titlePl, titleEn,
    descriptionPl, descriptionEn,
    locationPl, locationEn
  }`);

  console.log('📋 Example Event Translation:\n');
  console.log('Title PL:', event.titlePl);
  console.log('Title EN:', event.titleEn);
  console.log('\nDescription PL:', event.descriptionPl?.substring(0, 80));
  console.log('Description EN:', event.descriptionEn?.substring(0, 80));
  console.log('\nLocation PL:', event.locationPl);
  console.log('Location EN:', event.locationEn);

  // Check one bio profile
  const bio = await client.fetch(`*[_type == "bioProfile"][0] {
    namePl, nameEn,
    paragraphsPl, paragraphsEn
  }`);

  console.log('\n\n👤 Example Bio Profile Translation:\n');
  console.log('Name PL:', bio.namePl);
  console.log('Name EN:', bio.nameEn);
  console.log('\nFirst Paragraph PL:', bio.paragraphsPl[0]);
  console.log('First Paragraph EN:', bio.paragraphsEn[0]);

  // Check homepage slide
  const slide = await client.fetch(`*[_type == "homepageSlide"][0] {
    wordPl, wordEn,
    taglinePl, taglineEn
  }`);

  console.log('\n\n🏠 Example Homepage Slide Translation:\n');
  console.log('Word PL:', slide.wordPl);
  console.log('Word EN:', slide.wordEn);
  console.log('\nTagline PL:', slide.taglinePl);
  console.log('Tagline EN:', slide.taglineEn);
}

checkTranslations();
