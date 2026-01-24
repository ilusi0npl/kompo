/**
 * Unit tests for useSanityHomepageSlides hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityHomepageSlides } from '../../../src/hooks/useSanityHomepageSlides'
import { LanguageProvider } from '../../../src/context/LanguageContext'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: vi.fn() },
}))

import { client } from '../../../src/lib/sanity/client'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

const createSlide = (overrides = {}) => ({
  _id: `slide-${Date.now()}`,
  wordPl: 'Trio',
  wordEn: 'Trio',
  taglinePl: 'Tagline PL',
  taglineEn: 'Tagline EN',
  imageUrl: '/assets/slide.jpg',
  ...overrides,
})

describe('useSanityHomepageSlides', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('Happy Path', () => {
    it('returns transformed slides', async () => {
      client.fetch.mockResolvedValue([createSlide()])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides).toHaveLength(1)
      expect(result.current.slides[0].word).toBe('Trio')
    })
  })

  describe('Empty & Null Handling', () => {
    it('returns empty array for null', async () => {
      client.fetch.mockResolvedValue(null)
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides).toEqual([])
    })

    it('returns empty array for empty array', async () => {
      client.fetch.mockResolvedValue([])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides).toEqual([])
    })
  })

  describe('Missing Fields', () => {
    it('handles missing tagline', async () => {
      client.fetch.mockResolvedValue([createSlide({ taglinePl: null, taglineEn: null })])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      // Should fallback to empty string when both translations are missing
      expect(result.current.slides[0].tagline).toBe('')
    })

    it('handles missing imageUrl', async () => {
      client.fetch.mockResolvedValue([createSlide({ imageUrl: null })])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides[0].imageUrl).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('sets error on failure', async () => {
      client.fetch.mockRejectedValue(new Error('Failed'))
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.error).toBeTruthy()
    })
  })

  describe('Large Data', () => {
    it('handles 30 slides', async () => {
      const mockData = Array.from({ length: 30 }, (_, i) => createSlide({ _id: `slide-${i}` }))
      client.fetch.mockResolvedValue(mockData)
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides).toHaveLength(30)
    })

    it('handles very long word', async () => {
      const longWord = 'A'.repeat(200)
      client.fetch.mockResolvedValue([createSlide({ wordPl: longWord })])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides[0].word.length).toBe(200)
    })
  })

  describe('Special Characters', () => {
    it('preserves Polish chars', async () => {
      client.fetch.mockResolvedValue([createSlide({ wordPl: 'Żółć' })])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides[0].word).toBe('Żółć')
    })

    it('preserves HTML as text', async () => {
      client.fetch.mockResolvedValue([createSlide({ wordPl: '<script>alert(1)</script>' })])
      const { result } = renderHook(() => useSanityHomepageSlides(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.slides[0].word).toContain('<script>')
    })
  })
})
