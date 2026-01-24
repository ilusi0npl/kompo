import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { upcomingEventsQuery, archivedEventsQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

/**
 * Hook to fetch events from Sanity CMS with bilingual support
 * @param {string} status - 'upcoming' or 'archived'
 * @returns {object} - { events, loading, error }
 */
export function useSanityEvents(status = 'upcoming') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    const query = status === 'upcoming' ? upcomingEventsQuery : archivedEventsQuery

    client
      .fetch(query)
      .then(data => {
        // Handle null/undefined data
        if (!data || !Array.isArray(data)) {
          setEvents([])
          setLoading(false)
          return
        }

        // Transform data based on current language with fallback
        const transformedEvents = data.map(event => ({
          ...event,
          title: language === 'pl'
            ? (event.titlePl || event.titleEn || '')
            : (event.titleEn || event.titlePl || ''),
          performers: language === 'pl'
            ? (event.performersPl || event.performersEn || '')
            : (event.performersEn || event.performersPl || ''),
          description: language === 'pl'
            ? (event.descriptionPl || event.descriptionEn || '')
            : (event.descriptionEn || event.descriptionPl || ''),
          location: language === 'pl'
            ? (event.locationPl || event.locationEn || '')
            : (event.locationEn || event.locationPl || ''),
        }))
        setEvents(transformedEvents)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch events:', err)
        setError(err)
        setLoading(false)
      })
  }, [status, language])

  return { events, loading, error }
}
