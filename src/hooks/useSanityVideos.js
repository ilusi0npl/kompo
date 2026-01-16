import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { videoItemsQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch video items from Sanity CMS
 * @returns {object} - { videos, loading, error }
 */
export function useSanityVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(videoItemsQuery)
      .then(data => {
        setVideos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch videos:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { videos, loading, error }
}
