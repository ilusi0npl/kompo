import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { photoAlbumsQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch photo albums from Sanity CMS
 * @returns {object} - { albums, loading, error }
 */
export function useSanityPhotoAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(photoAlbumsQuery)
      .then(data => {
        setAlbums(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch photo albums:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { albums, loading, error }
}
