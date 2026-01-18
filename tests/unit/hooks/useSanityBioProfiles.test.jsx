import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityBioProfiles } from '../../../src/hooks/useSanityBioProfiles'
import { LanguageProvider } from '../../../src/context/LanguageContext'

// Create mock fetch function using vi.hoisted to avoid hoisting issues
const mockFetch = vi.hoisted(() => vi.fn())

// Mock Sanity client
vi.mock('../../../src/lib/sanity/client', () => ({
  client: {
    fetch: mockFetch,
  },
}))

describe('useSanityBioProfiles', () => {
  const mockBioProfilesData = [
    {
      _id: 'profile-1',
      namePl: 'Aleksandra Gryka',
      nameEn: 'Aleksandra Gryka',
      paragraphsPl: [
        'Pierwszy akapit po polsku.',
        'Drugi akapit po polsku.',
      ],
      paragraphsEn: [
        'First paragraph in English.',
        'Second paragraph in English.',
      ],
      imageUrl: '/bio1.jpg',
      backgroundColor: '#FF734C',
      lineColor: '#FFBD19',
      textColor: '#131313',
    },
    {
      _id: 'profile-2',
      namePl: 'Rafał Zapała',
      nameEn: 'Rafał Zapała',
      paragraphsPl: [
        'Biogram Rafała po polsku.',
      ],
      paragraphsEn: [
        'Rafał bio in English.',
      ],
      imageUrl: '/bio2.jpg',
      backgroundColor: '#34B898',
      lineColor: '#01936F',
      textColor: '#131313',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch bio profiles successfully', async () => {
    mockFetch.mockResolvedValueOnce(mockBioProfilesData)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.profiles).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profiles).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('should transform profiles to Polish by default', async () => {
    mockFetch.mockResolvedValueOnce(mockBioProfilesData)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstProfile = result.current.profiles[0]
    expect(firstProfile.name).toBe('Aleksandra Gryka')
    expect(firstProfile.paragraphs).toEqual([
      'Pierwszy akapit po polsku.',
      'Drugi akapit po polsku.',
    ])
  })

  it('should transform profiles to English when language="en"', async () => {
    localStorage.getItem.mockReturnValue('en')
    mockFetch.mockResolvedValueOnce(mockBioProfilesData)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstProfile = result.current.profiles[0]
    expect(firstProfile.name).toBe('Aleksandra Gryka')
    expect(firstProfile.paragraphs).toEqual([
      'First paragraph in English.',
      'Second paragraph in English.',
    ])
  })

  it('should handle null data gracefully', async () => {
    mockFetch.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profiles).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Failed to fetch profiles')
    mockFetch.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profiles).toEqual([])
    expect(result.current.error).toBe(mockError)
  })
})
