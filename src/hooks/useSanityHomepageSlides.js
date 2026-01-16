import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { homepageSlidesQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch homepage slides from Sanity CMS
 * @returns {object} - { slides, loading, error }
 */
export function useSanityHomepageSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(homepageSlidesQuery)
      .then(data => {
        setSlides(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch homepage slides:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { slides, loading, error }
}
