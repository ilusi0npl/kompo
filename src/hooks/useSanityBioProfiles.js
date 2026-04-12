import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { bioProfilesQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Hook to fetch bio profiles from Sanity CMS with bilingual support
 * @returns {object} - { profiles, loading, error }
 */
export function useSanityBioProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    client
      .fetch(bioProfilesQuery)
      .then(data => {
        // Handle null/undefined data
        if (!data || !Array.isArray(data)) {
          setProfiles([])
          setLoading(false)
          return
        }

        // Transform data based on current language with fallback
        const transformedProfiles = data.map(profile => {
          // Use unified paragraphs if available, fallback to old separate arrays
          let paragraphs
          if (profile.paragraphs && profile.paragraphs.length > 0 && profile.paragraphs[0].textPl) {
            // New unified format: array of { textPl, textEn, display }
            paragraphs = profile.paragraphs.map(p => ({
              text: language === 'pl' ? (p.textPl || p.textEn || '') : (p.textEn || p.textPl || ''),
              display: p.display || 'both',
            }))
          } else {
            // Old format: separate paragraphsPl/paragraphsEn arrays (backward compat)
            const texts = language === 'pl'
              ? (profile.paragraphsPl || profile.paragraphsEn || [])
              : (profile.paragraphsEn || profile.paragraphsPl || [])
            paragraphs = texts.map(text => ({ text, display: 'both' }))
          }

          return {
            ...profile,
            slug: profile.slug || null,
            name: language === 'pl'
              ? (profile.namePl || profile.nameEn || '')
              : (profile.nameEn || profile.namePl || ''),
            paragraphs,
            // Filtered views for convenience
            mainParagraphs: paragraphs
              .filter(p => p.display === 'main' || p.display === 'both')
              .map(p => p.text),
            moreParagraphs: paragraphs
              .filter(p => p.display === 'more' || p.display === 'both')
              .map(p => p.text),
          }
        })
        setProfiles(transformedProfiles)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch bio profiles:', err)
        setError(err)
        setLoading(false)
      })
  }, [language])

  return { profiles, loading, error }
}
