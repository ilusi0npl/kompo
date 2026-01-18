import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Only create client if Sanity is enabled and configured
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;

// Create Sanity client only if enabled and configured
export const client = USE_SANITY && projectId ? createClient({
  projectId: projectId,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for faster reads
}) : null;

// Image URL builder helper (only if client exists)
const builder = client ? imageUrlBuilder(client) : null;

/**
 * Generate image URL from Sanity image source
 * @param {object} source - Sanity image object
 * @returns {string} - Image URL
 */
export const urlFor = (source) => {
  if (!builder) {
    console.warn('Sanity client not configured. Cannot build image URL.');
    return '';
  }
  return builder.image(source);
}
