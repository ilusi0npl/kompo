import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { upcomingEventsQuery, archivedEventsQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch events from Sanity CMS
 * @param {string} status - 'upcoming' or 'archived'
 * @returns {object} - { events, loading, error }
 */
export function useSanityEvents(status = 'upcoming') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const query = status === 'upcoming' ? upcomingEventsQuery : archivedEventsQuery

    client
      .fetch(query)
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch events:', err)
        setError(err)
        setLoading(false)
      })
  }, [status])

  return { events, loading, error }
}
