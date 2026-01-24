/**
 * Unit tests for useSanityPhotoAlbums hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityPhotoAlbums } from '../../../src/hooks/useSanityPhotoAlbums'
import { LanguageProvider } from '../../../src/context/LanguageContext'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: vi.fn() },
}))

import { client } from '../../../src/lib/sanity/client'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

const createAlbum = (overrides = {}) => ({
  _id: `album-${Date.now()}`,
  titlePl: 'Album PL',
  titleEn: 'Album EN',
  photographer: 'Jan Fotograf',
  thumbnailUrl: '/assets/thumb.jpg',
  imageUrls: ['/assets/1.jpg', '/assets/2.jpg'],
  ...overrides,
})

describe('useSanityPhotoAlbums', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('Happy Path', () => {
    it('returns transformed albums', async () => {
      client.fetch.mockResolvedValue([createAlbum()])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums).toHaveLength(1)
      expect(result.current.albums[0].title).toBe('Album PL')
    })
  })

  describe('Empty & Null Handling', () => {
    it('returns empty array for null', async () => {
      client.fetch.mockResolvedValue(null)
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums).toEqual([])
    })

    it('returns empty array for empty array', async () => {
      client.fetch.mockResolvedValue([])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums).toEqual([])
    })
  })

  describe('Missing Fields', () => {
    it('handles missing thumbnailUrl', async () => {
      client.fetch.mockResolvedValue([createAlbum({ thumbnailUrl: null })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].thumbnailUrl).toBeNull()
    })

    it('handles empty imageUrls array', async () => {
      client.fetch.mockResolvedValue([createAlbum({ imageUrls: [] })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].imageUrls).toEqual([])
    })

    it('handles null imageUrls', async () => {
      client.fetch.mockResolvedValue([createAlbum({ imageUrls: null })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].imageUrls).toBeNull()
    })

    it('handles missing EN title', async () => {
      client.fetch.mockResolvedValue([createAlbum({ titleEn: null })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].title).toBe('Album PL')
    })
  })

  describe('Error Handling', () => {
    it('sets error on failure', async () => {
      client.fetch.mockRejectedValue(new Error('Failed'))
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.error).toBeTruthy()
    })
  })

  describe('Large Data', () => {
    it('handles 30 albums', async () => {
      const mockData = Array.from({ length: 30 }, (_, i) => createAlbum({ _id: `album-${i}` }))
      client.fetch.mockResolvedValue(mockData)
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums).toHaveLength(30)
    })

    it('handles album with 200 images', async () => {
      const manyImages = Array.from({ length: 200 }, (_, i) => `/assets/${i}.jpg`)
      client.fetch.mockResolvedValue([createAlbum({ imageUrls: manyImages })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].imageUrls).toHaveLength(200)
    })

    it('handles very long title', async () => {
      const longTitle = 'A'.repeat(500)
      client.fetch.mockResolvedValue([createAlbum({ titlePl: longTitle })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].title.length).toBe(500)
    })
  })

  describe('Special Characters', () => {
    it('preserves Polish chars', async () => {
      client.fetch.mockResolvedValue([createAlbum({
        titlePl: 'Żółć gęślą jaźń',
        photographer: 'Łukasz Żółkiewski',
      })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].title).toBe('Żółć gęślą jaźń')
      expect(result.current.albums[0].photographer).toBe('Łukasz Żółkiewski')
    })

    it('preserves HTML as text', async () => {
      client.fetch.mockResolvedValue([createAlbum({ photographer: '<script>alert(1)</script>' })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].photographer).toContain('<script>')
    })
  })
})
