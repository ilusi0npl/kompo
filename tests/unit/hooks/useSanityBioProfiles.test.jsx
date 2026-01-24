/**
 * Unit tests for useSanityBioProfiles hook
 * Tests edge cases for CMS data handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityBioProfiles } from '../../../src/hooks/useSanityBioProfiles'
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
const createBioProfile = (overrides = {}) => ({
  _id: `bio-${Date.now()}`,
  namePl: 'Jan Kowalski',
  nameEn: 'John Smith',
  imageUrl: '/assets/bio.jpg',
  paragraphsPl: ['Paragraf 1 PL', 'Paragraf 2 PL'],
  paragraphsEn: ['Paragraph 1 EN', 'Paragraph 2 EN'],
  ...overrides,
})

describe('useSanityBioProfiles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================
  // HAPPY PATH
  // ==========================================
  describe('Happy Path', () => {
    it('returns transformed profiles for PL language', async () => {
      const mockData = [createBioProfile()]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toHaveLength(1)
      expect(result.current.profiles[0].name).toBe('Jan Kowalski')
      expect(result.current.profiles[0].paragraphs).toEqual(['Paragraf 1 PL', 'Paragraf 2 PL'])
      expect(result.current.error).toBeNull()
    })

    it('returns multiple profiles correctly', async () => {
      const mockData = [
        createBioProfile({ _id: 'bio-1', namePl: 'Anna Nowak' }),
        createBioProfile({ _id: 'bio-2', namePl: 'Piotr Wiśniewski' }),
        createBioProfile({ _id: 'bio-3', namePl: 'Maria Kowalczyk' }),
      ]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toHaveLength(3)
      expect(result.current.profiles[0].name).toBe('Anna Nowak')
      expect(result.current.profiles[1].name).toBe('Piotr Wiśniewski')
      expect(result.current.profiles[2].name).toBe('Maria Kowalczyk')
    })
  })

  // ==========================================
  // EMPTY / NULL RESPONSES
  // ==========================================
  describe('Empty & Null Handling', () => {
    it('returns empty array when API returns null', async () => {
      client.fetch.mockResolvedValue(null)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('returns empty array when API returns undefined', async () => {
      client.fetch.mockResolvedValue(undefined)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toEqual([])
    })

    it('returns empty array when API returns empty array', async () => {
      client.fetch.mockResolvedValue([])

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toEqual([])
    })

    it('returns empty array when API returns non-array', async () => {
      client.fetch.mockResolvedValue({ unexpected: 'format' })

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toEqual([])
    })
  })

  // ==========================================
  // MISSING FIELDS
  // ==========================================
  describe('Missing Fields Handling', () => {
    it('handles missing nameEn field', async () => {
      const mockData = [createBioProfile({ nameEn: null })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      // Should use PL name as default
      expect(result.current.profiles[0].name).toBe('Jan Kowalski')
    })

    it('handles missing paragraphsPl field', async () => {
      const mockData = [createBioProfile({ paragraphsPl: null })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      // paragraphs should fallback to EN version
      expect(result.current.profiles[0].paragraphs).toEqual(['Paragraph 1 EN', 'Paragraph 2 EN'])
    })

    it('handles empty paragraphs array', async () => {
      const mockData = [createBioProfile({ paragraphsPl: [], paragraphsEn: [] })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].paragraphs).toEqual([])
    })

    it('handles missing imageUrl', async () => {
      const mockData = [createBioProfile({ imageUrl: null })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].imageUrl).toBeNull()
    })

    it('handles profile with all optional fields missing', async () => {
      const mockData = [{
        _id: 'minimal-bio',
        namePl: 'Name',
        nameEn: null,
        imageUrl: null,
        paragraphsPl: null,
        paragraphsEn: null,
      }]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toHaveLength(1)
      expect(result.current.profiles[0].name).toBe('Name')
    })
  })

  // ==========================================
  // ERROR HANDLING
  // ==========================================
  describe('Error Handling', () => {
    it('sets error state on API failure', async () => {
      const apiError = new Error('Network error')
      client.fetch.mockRejectedValue(apiError)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.profiles).toEqual([])
    })

    it('handles timeout error', async () => {
      client.fetch.mockRejectedValue(new Error('Request timeout'))

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
    })

    it('handles 500 error', async () => {
      client.fetch.mockRejectedValue(new Error('Internal Server Error'))

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.profiles).toEqual([])
    })
  })

  // ==========================================
  // LARGE DATA
  // ==========================================
  describe('Large Data Handling', () => {
    it('handles 50 profiles', async () => {
      const mockData = Array.from({ length: 50 }, (_, i) =>
        createBioProfile({ _id: `bio-${i}`, namePl: `Profile ${i}` })
      )
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles).toHaveLength(50)
    })

    it('handles profile with 20 long paragraphs', async () => {
      const longParagraphs = Array.from({ length: 20 }, (_, i) =>
        `Paragraph ${i}: ${'Lorem ipsum '.repeat(100)}`
      )
      const mockData = [createBioProfile({ paragraphsPl: longParagraphs })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].paragraphs).toHaveLength(20)
    })

    it('handles very long name', async () => {
      const longName = 'A'.repeat(500)
      const mockData = [createBioProfile({ namePl: longName })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].name).toBe(longName)
    })
  })

  // ==========================================
  // SPECIAL CHARACTERS
  // ==========================================
  describe('Special Characters', () => {
    it('preserves Polish characters', async () => {
      const mockData = [createBioProfile({
        namePl: 'Żółć gęślą jaźń ĄĘÓŁŃŹŻĆŚ',
        paragraphsPl: ['Zażółć gęślą jaźń'],
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].name).toBe('Żółć gęślą jaźń ĄĘÓŁŃŹŻĆŚ')
      expect(result.current.profiles[0].paragraphs[0]).toBe('Zażółć gęślą jaźń')
    })

    it('preserves HTML entities as text', async () => {
      const mockData = [createBioProfile({
        namePl: '<script>alert("xss")</script>',
        paragraphsPl: ['Test & "quotes" <b>bold</b>'],
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      // Hook should pass through data as-is (escaping is component responsibility)
      expect(result.current.profiles[0].name).toContain('<script>')
      expect(result.current.profiles[0].paragraphs[0]).toContain('&')
    })

    it('preserves newlines in paragraphs', async () => {
      const mockData = [createBioProfile({
        paragraphsPl: ['Line 1\nLine 2\nLine 3'],
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].paragraphs[0]).toContain('\n')
    })

    it('handles emoji characters', async () => {
      const mockData = [createBioProfile({
        namePl: 'Artist 🎵🎹🎼',
      })]
      client.fetch.mockResolvedValue(mockData)

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.profiles[0].name).toContain('🎵')
    })
  })

  // ==========================================
  // LOADING STATE
  // ==========================================
  describe('Loading State', () => {
    it('starts with loading true', () => {
      client.fetch.mockImplementation(() => new Promise(() => {})) // Never resolves

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      expect(result.current.loading).toBe(true)
      expect(result.current.profiles).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('sets loading to false after success', async () => {
      client.fetch.mockResolvedValue([createBioProfile()])

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      expect(result.current.loading).toBe(true)

      await waitFor(() => expect(result.current.loading).toBe(false))
    })

    it('sets loading to false after error', async () => {
      client.fetch.mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => useSanityBioProfiles(), { wrapper })

      expect(result.current.loading).toBe(true)

      await waitFor(() => expect(result.current.loading).toBe(false))
    })
  })
})
