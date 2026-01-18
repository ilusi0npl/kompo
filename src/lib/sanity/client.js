import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Create Sanity client with default values for testing
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'dummy-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for faster reads
})

// Image URL builder helper
const builder = imageUrlBuilder(client)

/**
 * Generate image URL from Sanity image source
 * @param {object} source - Sanity image object
 * @returns {string} - Image URL
 */
export const urlFor = (source) => {
  return builder.image(source)
}
