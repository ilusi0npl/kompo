import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { eventByIdQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch single event from Sanity CMS by ID
 * @param {string} id - Event ID
 * @returns {object} - { event, loading, error }
 */
export function useSanityEvent(id) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    client
      .fetch(eventByIdQuery, { id })
      .then((eventData) => {
        setEvent(eventData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch event:', err)
        setError(err)
        setLoading(false)
      })
  }, [id])

  return { event, loading, error }
}
