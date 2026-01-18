import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityEvents } from '../../../src/hooks/useSanityEvents'
import { LanguageProvider } from '../../../src/context/LanguageContext'

// Create mock fetch function using vi.hoisted to avoid hoisting issues
const mockFetch = vi.hoisted(() => vi.fn())

// Mock Sanity client
vi.mock('../../../src/lib/sanity/client', () => ({
  client: {
    fetch: mockFetch,
  },
}))

describe('useSanityEvents', () => {
  const mockEventsData = [
    {
      _id: 'event-1',
      titlePl: 'Wydarzenie 1',
      titleEn: 'Event 1',
      performersPl: 'Wykonawca PL',
      performersEn: 'Performer EN',
      descriptionPl: 'Opis PL',
      descriptionEn: 'Description EN',
      locationPl: 'Wrocław',
      locationEn: 'Wroclaw',
      date: '2026-02-15',
      imageUrl: '/image1.jpg',
    },
    {
      _id: 'event-2',
      titlePl: 'Wydarzenie 2',
      titleEn: 'Event 2',
      performersPl: 'Wykonawca 2 PL',
      performersEn: 'Performer 2 EN',
      descriptionPl: 'Opis 2 PL',
      descriptionEn: 'Description 2 EN',
      locationPl: 'Kraków',
      locationEn: 'Krakow',
      date: '2026-03-20',
      imageUrl: '/image2.jpg',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch upcoming events by default', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.events).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('should fetch archived events when status="archived"', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents('archived'), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.events).toHaveLength(2)
  })

  it('should transform events to Polish by default', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstEvent = result.current.events[0]
    expect(firstEvent.title).toBe('Wydarzenie 1')
    expect(firstEvent.performers).toBe('Wykonawca PL')
    expect(firstEvent.description).toBe('Opis PL')
    expect(firstEvent.location).toBe('Wrocław')
  })

  it('should transform events to English when language changes', async () => {
    localStorage.getItem.mockReturnValue('en')
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstEvent = result.current.events[0]
    expect(firstEvent.title).toBe('Event 1')
    expect(firstEvent.performers).toBe('Performer EN')
    expect(firstEvent.description).toBe('Description EN')
    expect(firstEvent.location).toBe('Wroclaw')
  })

  it('should handle null/undefined data gracefully', async () => {
    mockFetch.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should handle empty array data', async () => {
    mockFetch.mockResolvedValueOnce([])

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    mockFetch.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    expect(result.current.error).toBe(mockError)
  })

  it('should preserve original fields in transformed events', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstEvent = result.current.events[0]
    expect(firstEvent._id).toBe('event-1')
    expect(firstEvent.date).toBe('2026-02-15')
    expect(firstEvent.imageUrl).toBe('/image1.jpg')
    expect(firstEvent.titlePl).toBe('Wydarzenie 1')
    expect(firstEvent.titleEn).toBe('Event 1')
  })
})
