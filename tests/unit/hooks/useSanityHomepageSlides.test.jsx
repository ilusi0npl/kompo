import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityHomepageSlides } from '../../../src/hooks/useSanityHomepageSlides'
import { LanguageProvider } from '../../../src/context/LanguageContext'

// Create mock fetch function using vi.hoisted to avoid hoisting issues
const mockFetch = vi.hoisted(() => vi.fn())

// Mock Sanity client
vi.mock('../../../src/lib/sanity/client', () => ({
  client: {
    fetch: mockFetch,
  },
}))

describe('useSanityHomepageSlides', () => {
  const mockSlidesData = [
    {
      _id: 'slide-1',
      wordPl: 'ZESPÓŁ',
      wordEn: 'ENSEMBLE',
      taglinePl: 'Nowa muzyka',
      taglineEn: 'New music',
      imageUrl: '/slide1.jpg',
    },
    {
      _id: 'slide-2',
      wordPl: 'KONCERT',
      wordEn: 'CONCERT',
      taglinePl: 'Nadchodzący',
      taglineEn: 'Upcoming',
      imageUrl: '/slide2.jpg',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch slides successfully', async () => {
    mockFetch.mockResolvedValueOnce(mockSlidesData)

    const { result } = renderHook(() => useSanityHomepageSlides(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.slides).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('should transform slides to Polish by default', async () => {
    mockFetch.mockResolvedValueOnce(mockSlidesData)

    const { result } = renderHook(() => useSanityHomepageSlides(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.slides[0].word).toBe('ZESPÓŁ')
    expect(result.current.slides[0].tagline).toBe('Nowa muzyka')
  })

  it('should transform slides to English when language="en"', async () => {
    localStorage.getItem.mockReturnValue('en')
    mockFetch.mockResolvedValueOnce(mockSlidesData)

    const { result } = renderHook(() => useSanityHomepageSlides(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.slides[0].word).toBe('ENSEMBLE')
    expect(result.current.slides[0].tagline).toBe('New music')
  })

  it('should handle null data', async () => {
    mockFetch.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useSanityHomepageSlides(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.slides).toEqual([])
  })

  it('should handle errors', async () => {
    const error = new Error('Fetch failed')
    mockFetch.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useSanityHomepageSlides(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(error)
  })
})
