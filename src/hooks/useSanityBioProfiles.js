import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { bioProfilesQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch bio profiles from Sanity CMS
 * @returns {object} - { profiles, loading, error }
 */
export function useSanityBioProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(bioProfilesQuery)
      .then(data => {
        setProfiles(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch bio profiles:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { profiles, loading, error }
}
