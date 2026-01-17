import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { videoItemsQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Hook to fetch video items from Sanity CMS with bilingual support
 * @returns {object} - { videos, loading, error }
 */
export function useSanityVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    client
      .fetch(videoItemsQuery)
      .then(data => {
        // Transform data based on current language
        const transformedVideos = data.map(video => ({
          ...video,
          title: language === 'pl' ? video.titlePl : video.titleEn,
          description: language === 'pl' ? video.descriptionPl : video.descriptionEn,
        }))
        setVideos(transformedVideos)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch videos:', err)
        setError(err)
        setLoading(false)
      })
  }, [language])

  return { videos, loading, error }
}
