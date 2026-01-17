#!/usr/bin/env node

/**
 * Migrate Fundacja Page to Bilingual Schema (Pl/En)
 *
 * Migrates the projects array to have bilingual fields:
 * - projects[].text → textPl, textEn = "[EN translation needed]"
 * - projects[].linkText → linkTextPl, linkTextEn = "[EN translation needed]"
 *
 * Note: accessibilityDeclarationPl/En are already bilingual
 *
 * Safe to run multiple times - has duplicate detection
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

const PLACEHOLDER_EN = '[EN translation needed]';

/**
 * Main migration function
 */
async function migrateFundacjaPage() {
  console.log('🚀 Starting Fundacja Page i18n migration...\n');

  try {
    // Fetch fundacja page (singleton)
    const pages = await client.fetch(`
      *[_type == "fundacjaPage"] {
        _id,
        projects
      }
    `);

    if (pages.length === 0) {
      console.log('⚠️  No fundacjaPage document found');
      return;
    }

    console.log(`📋 Found ${pages.length} fundacjaPage document(s) to process\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const page of pages) {
      if (!page.projects || page.projects.length === 0) {
        console.log('⏭️  Skipping - no projects found');
        skippedCount++;
        continue;
      }

      // Check if already migrated (check first project)
      const firstProject = page.projects[0];
      if (firstProject.textPl && firstProject.textEn) {
        console.log('⏭️  Skipping - already migrated');
        skippedCount++;
        continue;
      }

      // Migrate projects array
      const migratedProjects = page.projects.map(project => {
        const migratedProject = { ...project };

        // Migrate text
        if (project.text && !project.textPl) {
          migratedProject.textPl = project.text;
          migratedProject.textEn = PLACEHOLDER_EN;
        }

        // Migrate linkText (optional)
        if (project.linkText !== undefined && !project.linkTextPl) {
          migratedProject.linkTextPl = project.linkText || '';
          migratedProject.linkTextEn = project.linkText ? PLACEHOLDER_EN : '';
        }

        return migratedProject;
      });

      // Apply patch
      await client
        .patch(page._id)
        .set({ projects: migratedProjects })
        .commit();

      console.log(`✅ Migrated fundacjaPage with ${migratedProjects.length} projects`);
      migratedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${pages.length}`);
    console.log('\n✨ Migration completed successfully!');
    console.log('ℹ️  Next steps:');
    console.log('   1. Open Sanity Studio and verify migrated fundacja page');
    console.log('   2. Add English translations to replace "[EN translation needed]"');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateFundacjaPage();
