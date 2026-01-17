import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { photoAlbumsQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Hook to fetch photo albums from Sanity CMS with bilingual support
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
        // Handle null/undefined data
        if (!data || !Array.isArray(data)) {
          setAlbums([])
          setLoading(false)
          return
        }

        // Transform data based on current language
        const transformedAlbums = data.map(album => ({
          ...album,
          title: language === 'pl' ? album.titlePl : album.titleEn,
        }))
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
