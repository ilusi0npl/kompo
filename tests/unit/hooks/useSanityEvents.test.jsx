/**
 * Unit tests for useSanityEvents hook
 * Tests edge cases for CMS data handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityEvents } from '../../../src/hooks/useSanityEvents'
import { LanguageProvider } from '../../../src/context/LanguageContext'

// Mock Sanity client
vi.mock('../../../src/lib/sanity/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}))

import { client } from '../../../src/lib/sanity/client'

// Wrapper with LanguageProvider
const wrapper = ({ children }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

// Test data generators
const createEvent = (overrides = {}) => ({
  _id: `event-${Date.now()}`,
  titlePl: 'Koncert testowy',
  titleEn: 'Test Concert',
  date: new Date().toISOString(),
  performersPl: 'Wykonawcy PL',
  performersEn: 'Performers EN',
  descriptionPl: 'Opis PL',
  descriptionEn: 'Description EN',
  locationPl: 'Warszawa',
  locationEn: 'Warsaw',
  imageUrl: '/assets/event.jpg',
  status: 'upcoming',
  ...overrides,
})

describe('useSanityEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================
  // HAPPY PATH
  // ==========================================
  describe('Happy Path', () => {
    it('returns transformed events for PL language', async () => {
      const mockData = [createEvent()]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toHaveLength(1)
      expect(result.current.events[0].title).toBe('Koncert testowy')
      expect(result.current.events[0].location).toBe('Warszawa')
      expect(result.current.error).toBeNull()
    })

    it('fetches upcoming events by default', async () => {
      client.fetch.mockResolvedValue([createEvent()])

      renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(client.fetch).toHaveBeenCalled())

      // Check that the query was called (upcoming is default)
      expect(client.fetch).toHaveBeenCalledTimes(1)
    })

    it('fetches archived events when status is archived', async () => {
      client.fetch.mockResolvedValue([createEvent({ status: 'archived' })])

      const { result } = renderHook(() => useSanityEvents('archived'), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toHaveLength(1)
    })
  })

  // ==========================================
  // EMPTY / NULL RESPONSES
  // ==========================================
  describe('Empty & Null Handling', () => {
    it('returns empty array when API returns null', async () => {
      client.fetch.mockResolvedValue(null)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('returns empty array when API returns undefined', async () => {
      client.fetch.mockResolvedValue(undefined)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toEqual([])
    })

    it('returns empty array when API returns empty array', async () => {
      client.fetch.mockResolvedValue([])

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toEqual([])
    })

    it('returns empty array when API returns object instead of array', async () => {
      client.fetch.mockResolvedValue({ error: 'Something went wrong' })

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toEqual([])
    })
  })

  // ==========================================
  // MISSING FIELDS
  // ==========================================
  describe('Missing Fields Handling', () => {
    it('handles missing performers field', async () => {
      const mockData = [createEvent({ performersPl: null, performersEn: null })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      // Should fallback to empty string when both translations are missing
      expect(result.current.events[0].performers).toBe('')
    })

    it('handles missing EN translations', async () => {
      const mockData = [createEvent({
        titleEn: null,
        descriptionEn: null,
        locationEn: null,
        performersEn: null,
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      // Should still work with PL
      expect(result.current.events[0].title).toBe('Koncert testowy')
    })

    it('handles missing imageUrl', async () => {
      const mockData = [createEvent({ imageUrl: null })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].imageUrl).toBeNull()
    })

    it('handles missing date', async () => {
      const mockData = [createEvent({ date: null })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].date).toBeNull()
    })

    it('handles event with minimal fields', async () => {
      const mockData = [{
        _id: 'minimal-event',
        titlePl: 'Title',
        titleEn: null,
        date: null,
        performersPl: null,
        performersEn: null,
        descriptionPl: null,
        descriptionEn: null,
        locationPl: null,
        locationEn: null,
        imageUrl: null,
      }]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toHaveLength(1)
      expect(result.current.events[0].title).toBe('Title')
    })
  })

  // ==========================================
  // ERROR HANDLING
  // ==========================================
  describe('Error Handling', () => {
    it('sets error state on API failure', async () => {
      client.fetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.events).toEqual([])
    })

    it('handles 500 error', async () => {
      client.fetch.mockRejectedValue(new Error('Internal Server Error'))

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
    })
  })

  // ==========================================
  // LARGE DATA
  // ==========================================
  describe('Large Data Handling', () => {
    it('handles 100 events', async () => {
      const mockData = Array.from({ length: 100 }, (_, i) =>
        createEvent({ _id: `event-${i}`, titlePl: `Event ${i}` })
      )
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events).toHaveLength(100)
    })

    it('handles event with very long description', async () => {
      const longDescription = 'Lorem ipsum '.repeat(1000)
      const mockData = [createEvent({ descriptionPl: longDescription })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].description.length).toBeGreaterThan(10000)
    })

    it('handles event with long program', async () => {
      const mockData = [createEvent({
        program: Array.from({ length: 50 }, (_, i) => ({
          composer: `Composer ${i}`,
          piece: `Piece ${i}`,
        })),
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].program).toHaveLength(50)
    })
  })

  // ==========================================
  // SPECIAL CHARACTERS
  // ==========================================
  describe('Special Characters', () => {
    it('preserves Polish characters', async () => {
      const mockData = [createEvent({
        titlePl: 'Żółć gęślą jaźń',
        locationPl: 'Łódź, ul. Żółkiewskiego',
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].title).toBe('Żółć gęślą jaźń')
      expect(result.current.events[0].location).toBe('Łódź, ul. Żółkiewskiego')
    })

    it('preserves HTML as text', async () => {
      const mockData = [createEvent({
        titlePl: '<script>alert("xss")</script>',
        descriptionPl: 'Test & "quotes"',
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].title).toContain('<script>')
    })

    it('handles multiline performers', async () => {
      const mockData = [createEvent({
        performersPl: 'Artist 1\nArtist 2\nArtist 3',
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].performers).toContain('\n')
    })
  })

  // ==========================================
  // DATE HANDLING
  // ==========================================
  describe('Date Handling', () => {
    it('preserves ISO date format', async () => {
      const isoDate = '2025-06-15T19:00:00.000Z'
      const mockData = [createEvent({ date: isoDate })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].date).toBe(isoDate)
    })

    it('handles invalid date string', async () => {
      const mockData = [createEvent({ date: 'invalid-date' })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      // Hook should pass through (validation is component's job)
      expect(result.current.events[0].date).toBe('invalid-date')
    })

    it('handles far future date', async () => {
      const futureDate = '2099-12-31T23:59:59.000Z'
      const mockData = [createEvent({ date: futureDate })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.events[0].date).toBe(futureDate)
    })
  })

  // ==========================================
  // LOADING STATE
  // ==========================================
  describe('Loading State', () => {
    it('starts with loading true', () => {
      client.fetch.mockImplementation(() => new Promise(() => {}))

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      expect(result.current.loading).toBe(true)
      expect(result.current.events).toEqual([])
    })

    it('sets loading to false after success', async () => {
      client.fetch.mockResolvedValue([createEvent()])

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))
    })

    it('sets loading to false after error', async () => {
      client.fetch.mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => useSanityEvents(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))
    })
  })
})
