/**
 * Migration script: Add default partners to existing events
 *
 * Adds default partner logos to all events that don't have partners yet.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Sanity client setup
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Default partners (matching the hardcoded config)
const DEFAULT_PARTNERS = [
  { name: 'Miasto Wrocław', logoPath: 'public/assets/wydarzenie/partner-wroclaw.png' },
  { name: 'ZAIKS', logoPath: 'public/assets/wydarzenie/partner-zaiks.png' },
  { name: 'Recepcja', logoPath: 'public/assets/wydarzenie/partner-recepcja.png' },
  { name: 'Polmic', logoPath: 'public/assets/wydarzenie/partner-polmic.png' },
]

async function uploadImageAsset(imagePath) {
  const fs = await import('fs')
  const fullPath = path.resolve(__dirname, '..', imagePath)

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${fullPath}`)
    return null
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
    })
    console.log(`✅ Uploaded: ${path.basename(imagePath)} -> ${asset._id}`)
    return asset._id
  } catch (error) {
    console.error(`❌ Failed to upload ${imagePath}:`, error.message)
    return null
  }
}

async function addPartnersToEvents() {
  console.log('🚀 Starting migration: Add partners to events\n')

  // Step 1: Upload partner logos
  console.log('📤 Step 1: Uploading partner logos...')
  const partnerAssets = []

  for (const partner of DEFAULT_PARTNERS) {
    const assetId = await uploadImageAsset(partner.logoPath)
    if (assetId) {
      partnerAssets.push({
        name: partner.name,
        logo: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
        },
      })
    }
  }

  if (partnerAssets.length === 0) {
    console.error('❌ No partner logos uploaded. Aborting.')
    return
  }

  console.log(`✅ Uploaded ${partnerAssets.length} partner logos\n`)

  // Step 2: Fetch all events
  console.log('📥 Step 2: Fetching all events...')
  const events = await client.fetch(`*[_type == "event"] { _id, title, partners }`)
  console.log(`Found ${events.length} events\n`)

  if (events.length === 0) {
    console.log('⚠️  No events found in dataset.')
    return
  }

  // Step 3: Add partners to events that don't have them
  console.log('🔧 Step 3: Adding partners to events...')
  let updatedCount = 0

  for (const event of events) {
    if (!event.partners || event.partners.length === 0) {
      try {
        await client
          .patch(event._id)
          .set({ partners: partnerAssets })
          .commit()

        console.log(`✅ Added partners to: ${event.title}`)
        updatedCount++
      } catch (error) {
        console.error(`❌ Failed to update ${event.title}:`, error.message)
      }
    } else {
      console.log(`⏭️  Skipped (already has partners): ${event.title}`)
    }
  }

  console.log(`\n✅ Migration complete! Updated ${updatedCount}/${events.length} events.`)
}

// Run migration
addPartnersToEvents().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
