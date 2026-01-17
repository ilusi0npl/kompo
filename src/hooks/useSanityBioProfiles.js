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

        // Transform data based on current language
        const transformedProfiles = data.map(profile => ({
          ...profile,
          name: language === 'pl' ? profile.namePl : profile.nameEn,
          paragraphs: language === 'pl' ? profile.paragraphsPl : profile.paragraphsEn,
        }))
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
