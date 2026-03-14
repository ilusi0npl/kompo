import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { photoAlbumsQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Transform a raw Sanity album into a normalized shape.
 * Handles both flat images[] and sectioned albums.
 *
 * @returns {{ id, title, photographer, image, images, sections, hasSections }}
 */
function transformAlbum(album, language) {
  const title = language === 'pl'
    ? (album.titlePl || album.titleEn || '')
    : (album.titleEn || album.titlePl || '')

  const hasSections = Array.isArray(album.sections) && album.sections.length > 0

  const sections = hasSections
    ? album.sections.map(s => ({
        key: s._key,
        name: language === 'pl'
          ? (s.namePl || s.nameEn || '')
          : (s.nameEn || s.namePl || ''),
        images: s.imageUrls || [],
      }))
    : null

  const images = hasSections
    ? album.sections.flatMap(s => s.imageUrls || [])
    : (album.imageUrls || [])

  return {
    id: album._id,
    title,
    photographer: album.photographer,
    image: album.thumbnailUrl,
    images,
    sections,
    hasSections,
  }
}

/**
 * Hook to fetch photo albums from Sanity CMS with bilingual support.
 * Returns normalized albums - single source of transformation.
 *
 * @returns {object} - { albums, loading, error }
 */
export function useSanityPhotoAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    client
      .fetch(photoAlbumsQuery)
      .then(data => {
        if (!data || !Array.isArray(data)) {
          setAlbums([])
          setLoading(false)
          return
        }

        const transformedAlbums = data.map(album => transformAlbum(album, language))
        setAlbums(transformedAlbums)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch photo albums:', err)
        setError(err)
        setLoading(false)
      })
  }, [language])

  return { albums, loading, error }
}
