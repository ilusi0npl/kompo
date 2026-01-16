import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { fundacjaPageQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch fundacja page data from Sanity CMS
 * @returns {object} - { data, loading, error }
 */
export function useSanityFundacjaPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(fundacjaPageQuery)
      .then(pageData => {
        setData(pageData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch fundacja page:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
