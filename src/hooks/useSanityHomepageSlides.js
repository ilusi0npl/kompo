import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { homepageSlidesQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Hook to fetch homepage slides from Sanity CMS with bilingual support
 * @returns {object} - { slides, loading, error }
 */
export function useSanityHomepageSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    client
      .fetch(homepageSlidesQuery)
      .then(data => {
        // Handle null/undefined data
        if (!data || !Array.isArray(data)) {
          setSlides([])
          setLoading(false)
          return
        }

        // Transform data based on current language with fallback
        const transformedSlides = data.map(slide => ({
          ...slide,
          word: language === 'pl'
            ? (slide.wordPl || slide.wordEn || '')
            : (slide.wordEn || slide.wordPl || ''),
          tagline: language === 'pl'
            ? (slide.taglinePl || slide.taglineEn || '')
            : (slide.taglineEn || slide.taglinePl || ''),
        }))
        setSlides(transformedSlides)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch homepage slides:', err)
        setError(err)
        setLoading(false)
      })
  }, [language])

  return { slides, loading, error }
}
