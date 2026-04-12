/**
 * Migration script: Bio Profile Paragraphs
 *
 * Zips separate paragraphsPl[] and paragraphsEn[] arrays into a unified
 * paragraphs[] array of { textPl, textEn, display } objects.
 *
 * All existing paragraphs default to display: 'both' (preserves current behavior).
 * Old fields (paragraphsPl, paragraphsEn) are kept in documents for rollback.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=xxx node scripts/migrate-bio-paragraphs.js
 *
 * Dry run (default): shows changes without writing
 *   node scripts/migrate-bio-paragraphs.js --dry-run
 *
 * Apply changes:
 *   SANITY_AUTH_TOKEN=xxx node scripts/migrate-bio-paragraphs.js --apply
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

const isDryRun = !process.argv.includes('--apply')

async function migrate() {
  console.log(isDryRun ? '=== DRY RUN ===' : '=== APPLYING CHANGES ===')

  const profiles = await client.fetch(
    `*[_type == "bioProfile"] { _id, _rev, namePl, paragraphsPl, paragraphsEn, paragraphs }`
  )

  console.log(`Found ${profiles.length} bio profiles`)

  for (const profile of profiles) {
    // Skip if already migrated (has new-format paragraphs)
    if (
      profile.paragraphs &&
      profile.paragraphs.length > 0 &&
      profile.paragraphs[0].textPl
    ) {
      console.log(`  SKIP: ${profile.namePl} (already migrated)`)
      continue
    }

    const plParagraphs = profile.paragraphsPl || []
    const enParagraphs = profile.paragraphsEn || []
    const maxLen = Math.max(plParagraphs.length, enParagraphs.length)

    if (maxLen === 0) {
      console.log(`  SKIP: ${profile.namePl} (no paragraphs)`)
      continue
    }

    // Zip PL and EN paragraphs into unified objects
    const unified = []
    for (let i = 0; i < maxLen; i++) {
      unified.push({
        _type: 'bioParagraph',
        _key: `paragraph-${i}`,
        textPl: plParagraphs[i] || '',
        textEn: enParagraphs[i] || '',
        display: 'both',
      })
    }

    console.log(`  MIGRATE: ${profile.namePl} (${maxLen} paragraphs -> unified)`)

    if (!isDryRun) {
      await client
        .patch(profile._id)
        .ifRevisionId(profile._rev)
        .set({ paragraphs: unified })
        .commit()

      console.log(`    -> Done`)
    }
  }

  console.log('\nMigration complete.')
  if (isDryRun) {
    console.log('Run with --apply to execute changes.')
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
