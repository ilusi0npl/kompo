import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { reviewEventsQuery } from '../lib/sanity/queries'
import { useLanguage } from '../context/LanguageContext'

const pick = (pl, en, language) => (language === 'pl' ? (pl || en || '') : (en || pl || ''))

// Excerpts are pasted as plain text; a blank line starts a new paragraph.
const toParagraphs = (text) => (text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

const formatDate = (iso) => (iso ? iso.split('-').reverse().join('.') : '')

/**
 * Normalize a raw review event (Sanity or local config) for the current language.
 * Source titles stay in their original language; only the excerpt is translated.
 */
export function normalizeReviewEvent(event, language) {
  return {
    id: event.slug,
    title: pick(event.titlePl, event.titleEn, language),
    festival: pick(event.festivalPl, event.festivalEn, language),
    place: pick(event.placePl, event.placeEn, language),
    date: formatDate(event.date),
    image: event.imageUrl || '',
    reviews: (event.reviews || []).map(review => ({
      key: review._key,
      outlet: review.outlet,
      author: review.author || '',
      date: review.publishedOn || '',
      url: review.url,
      sourceTitle: review.sourceTitle,
      paragraphs: toParagraphs(pick(review.textPl, review.textEn, language)),
      photo: review.photoUrl || '',
      photoCaption: pick(review.photoCaptionPl, review.photoCaptionEn, language),
    })),
  }
}

/**
 * Normalize a list of review events, dropping events that have no reviews yet.
 */
export function normalizeReviewEvents(events, language) {
  return (events || [])
    .map(event => normalizeReviewEvent(event, language))
    .filter(event => event.reviews.length > 0)
}

/**
 * Hook to fetch review events from Sanity CMS with bilingual support.
 * @returns {object} - { events, loading, error }
 */
export function useSanityReviewEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()

  useEffect(() => {
    client
      .fetch(reviewEventsQuery)
      .then(data => {
        setEvents(Array.isArray(data) ? normalizeReviewEvents(data, language) : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch review events:', err)
        setError(err)
        setLoading(false)
      })
  }, [language])

  return { events, loading, error }
}
