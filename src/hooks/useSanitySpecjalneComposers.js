import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { specialneComposersQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch Specialne composers from Sanity CMS
 * @returns {object} - { composers, loading, error }
 */
export function useSanitySpecjalneComposers() {
  const [composers, setComposers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Skip if client not configured
    if (!client) {
      setLoading(false)
      return
    }

    client
      .fetch(specialneComposersQuery)
      .then(data => {
        setComposers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch specialne composers:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { composers, loading, error }
}
