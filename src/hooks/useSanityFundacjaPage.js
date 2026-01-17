import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { fundacjaPageQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Hook to fetch fundacja page data from Sanity CMS with bilingual support
 * @returns {object} - { data, loading, error }
 */
export function useSanityFundacjaPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    client
      .fetch(fundacjaPageQuery)
      .then(pageData => {
        if (!pageData) {
          setData(null)
          setLoading(false)
          return
        }

        // Transform projects array based on current language
        const transformedData = {
          ...pageData,
          projects: pageData.projects?.map(project => ({
            text: language === 'pl' ? project.textPl : project.textEn,
            linkText: language === 'pl' ? project.linkTextPl : project.linkTextEn,
            linkUrl: project.linkUrl,
          })) || [],
          accessibilityDeclaration: language === 'pl'
            ? pageData.accessibilityDeclarationPl
            : pageData.accessibilityDeclarationEn,
        }

        setData(transformedData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch fundacja page:', err)
        setError(err)
        setLoading(false)
      })
  }, [language])

  return { data, loading, error }
}
