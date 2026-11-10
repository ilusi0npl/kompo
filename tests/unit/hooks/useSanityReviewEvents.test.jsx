/**
 * Unit tests for useSanityReviewEvents hook and review event normalization
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityReviewEvents, normalizeReviewEvent } from '../../../src/hooks/useSanityReviewEvents'
import { LanguageProvider } from '../../../src/context/LanguageContext'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: vi.fn() },
}))

import { client } from '../../../src/lib/sanity/client'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

const createEvent = (overrides = {}) => ({
  _id: 'abc',
  slug: 'sacrum-profanum-2020',
  titlePl: 'Wykład',
  titleEn: 'Lecture',
  festivalPl: 'Festiwal',
  festivalEn: 'Festival',
  date: '2020-11-15',
  placePl: 'Kraków',
  placeEn: 'Krakow',
  imageUrl: '/a.jpg',
  reviews: [{
    _key: 'r1',
    outlet: 'Ruch Muzyczny',
    author: 'Agnieszka Lniak',
    publishedOn: '07.12.2020',
    url: 'https://ruchmuzyczny.pl/article/507',
    sourceTitle: 'SACRUM PROFANUM 2020 (relacje)',
    textPl: 'Akapit pierwszy.\n\nAkapit drugi.',
    textEn: 'First paragraph.\n\nSecond paragraph.',
  }],
  ...overrides,
})

describe('normalizeReviewEvent', () => {
  it('splits review text into paragraphs on blank lines', () => {
    const event = normalizeReviewEvent(createEvent(), 'pl')
    expect(event.reviews[0].paragraphs).toEqual(['Akapit pierwszy.', 'Akapit drugi.'])
  })

  it('shows the Polish excerpt in English when no translation exists yet', () => {
    const raw = createEvent()
    raw.reviews[0].textEn = ''
    const event = normalizeReviewEvent(raw, 'en')
    expect(event.reviews[0].paragraphs).toEqual(['Akapit pierwszy.', 'Akapit drugi.'])
  })

  it('keeps the source title in the original language', () => {
    const event = normalizeReviewEvent(createEvent(), 'en')
    expect(event.reviews[0].sourceTitle).toBe('SACRUM PROFANUM 2020 (relacje)')
    expect(event.title).toBe('Lecture')
  })

  it('formats the event date as DD.MM.YYYY', () => {
    expect(normalizeReviewEvent(createEvent(), 'pl').date).toBe('15.11.2020')
  })

  it('treats an event without reviews as having an empty list', () => {
    expect(normalizeReviewEvent(createEvent({ reviews: null }), 'pl').reviews).toEqual([])
  })
})

describe('useSanityReviewEvents', () => {
  beforeEach(() => vi.clearAllMocks())

  it('hides events that have no reviews', async () => {
    client.fetch.mockResolvedValue([createEvent(), createEvent({ _id: 'x', slug: 'empty', reviews: [] })])
    const { result } = renderHook(() => useSanityReviewEvents(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.events.map(e => e.id)).toEqual(['sacrum-profanum-2020'])
  })

  it('returns empty list for null data', async () => {
    client.fetch.mockResolvedValue(null)
    const { result } = renderHook(() => useSanityReviewEvents(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.events).toEqual([])
  })
})
