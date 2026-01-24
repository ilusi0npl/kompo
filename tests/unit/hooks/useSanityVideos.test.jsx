/**
 * Unit tests for useSanityVideos hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityVideos } from '../../../src/hooks/useSanityVideos'
import { LanguageProvider } from '../../../src/context/LanguageContext'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: vi.fn() },
}))

import { client } from '../../../src/lib/sanity/client'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

const createVideo = (overrides = {}) => ({
  _id: `video-${Date.now()}`,
  titlePl: 'Wideo PL',
  titleEn: 'Video EN',
  descriptionPl: 'Opis PL',
  descriptionEn: 'Description EN',
  videoUrl: 'https://youtube.com/watch?v=abc123',
  thumbnailUrl: '/assets/thumb.jpg',
  ...overrides,
})

describe('useSanityVideos', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('Happy Path', () => {
    it('returns transformed videos', async () => {
      client.fetch.mockResolvedValue([createVideo()])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos).toHaveLength(1)
      expect(result.current.videos[0].title).toBe('Wideo PL')
    })
  })

  describe('Empty & Null Handling', () => {
    it('returns empty array for null', async () => {
      client.fetch.mockResolvedValue(null)
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos).toEqual([])
    })

    it('returns empty array for empty array', async () => {
      client.fetch.mockResolvedValue([])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos).toEqual([])
    })
  })

  describe('Missing Fields', () => {
    it('handles missing description', async () => {
      client.fetch.mockResolvedValue([createVideo({ descriptionPl: null, descriptionEn: null })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      // Should fallback to empty string when both translations are missing
      expect(result.current.videos[0].description).toBe('')
    })

    it('handles missing thumbnailUrl', async () => {
      client.fetch.mockResolvedValue([createVideo({ thumbnailUrl: null })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].thumbnailUrl).toBeNull()
    })

    it('handles missing EN fields', async () => {
      client.fetch.mockResolvedValue([createVideo({ titleEn: null, descriptionEn: null })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].title).toBe('Wideo PL')
    })
  })

  describe('Error Handling', () => {
    it('sets error on failure', async () => {
      client.fetch.mockRejectedValue(new Error('Failed'))
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.error).toBeTruthy()
    })
  })

  describe('Large Data', () => {
    it('handles 50 videos', async () => {
      const mockData = Array.from({ length: 50 }, (_, i) => createVideo({ _id: `video-${i}` }))
      client.fetch.mockResolvedValue(mockData)
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos).toHaveLength(50)
    })

    it('handles very long description', async () => {
      const longDesc = 'Lorem ipsum '.repeat(500)
      client.fetch.mockResolvedValue([createVideo({ descriptionPl: longDesc })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].description.length).toBeGreaterThan(5000)
    })
  })

  describe('Special Characters', () => {
    it('preserves Polish chars', async () => {
      client.fetch.mockResolvedValue([createVideo({ titlePl: 'Żółć gęślą jaźń' })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].title).toBe('Żółć gęślą jaźń')
    })

    it('preserves HTML as text', async () => {
      client.fetch.mockResolvedValue([createVideo({ titlePl: '<script>alert(1)</script>' })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].title).toContain('<script>')
    })
  })

  describe('Video URL Handling', () => {
    it('preserves YouTube URL', async () => {
      const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      client.fetch.mockResolvedValue([createVideo({ videoUrl: youtubeUrl })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].videoUrl).toBe(youtubeUrl)
    })

    it('preserves Vimeo URL', async () => {
      const vimeoUrl = 'https://vimeo.com/123456789'
      client.fetch.mockResolvedValue([createVideo({ videoUrl: vimeoUrl })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].videoUrl).toBe(vimeoUrl)
    })

    it('handles null videoUrl', async () => {
      client.fetch.mockResolvedValue([createVideo({ videoUrl: null })])
      const { result } = renderHook(() => useSanityVideos(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.videos[0].videoUrl).toBeNull()
    })
  })
})
