import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { repertuarComposersQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch Repertuar composers from Sanity CMS
 * @returns {object} - { composers, loading, error }
 */
export function useSanityRepertuarComposers() {
  const [composers, setComposers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(repertuarComposersQuery)
      .then(data => {
        setComposers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch repertuar composers:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { composers, loading, error }
}
