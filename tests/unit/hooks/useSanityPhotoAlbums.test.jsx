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

const createSectionedAlbum = (overrides = {}) => ({
  _id: `album-${Date.now()}`,
  titlePl: 'Album Sekcje PL',
  titleEn: 'Album Sections EN',
  photographer: 'Anna Fotograf',
  thumbnailUrl: '/assets/thumb-s.jpg',
  imageUrls: null,
  sections: [
    {
      _key: 'sec1',
      namePl: 'Scena',
      nameEn: 'Stage',
      imageUrls: ['/assets/stage1.jpg', '/assets/stage2.jpg'],
    },
    {
      _key: 'sec2',
      namePl: 'Publiczność',
      nameEn: 'Audience',
      imageUrls: ['/assets/audience1.jpg'],
    },
  ],
  ...overrides,
})

describe('useSanityPhotoAlbums', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('Happy Path', () => {
    it('returns transformed albums with normalized shape', async () => {
      client.fetch.mockResolvedValue([createAlbum()])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums).toHaveLength(1)

      const album = result.current.albums[0]
      expect(album.title).toBe('Album PL')
      expect(album.id).toBeDefined()
      expect(album.image).toBe('/assets/thumb.jpg')
      expect(album.photographer).toBe('Jan Fotograf')
      expect(album.images).toEqual(['/assets/1.jpg', '/assets/2.jpg'])
      expect(album.hasSections).toBe(false)
      expect(album.sections).toBeNull()
    })
  })

  describe('Sections Support', () => {
    it('transforms sectioned album correctly', async () => {
      client.fetch.mockResolvedValue([createSectionedAlbum()])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      const album = result.current.albums[0]
      expect(album.hasSections).toBe(true)
      expect(album.sections).toHaveLength(2)
      expect(album.sections[0].name).toBe('Scena')
      expect(album.sections[0].images).toEqual(['/assets/stage1.jpg', '/assets/stage2.jpg'])
      expect(album.sections[1].name).toBe('Publiczność')
      expect(album.sections[1].images).toEqual(['/assets/audience1.jpg'])
    })

    it('provides flat images array from sections', async () => {
      client.fetch.mockResolvedValue([createSectionedAlbum()])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      const album = result.current.albums[0]
      expect(album.images).toEqual([
        '/assets/stage1.jpg', '/assets/stage2.jpg', '/assets/audience1.jpg',
      ])
    })

    it('handles mixed albums (some flat, some sectioned)', async () => {
      client.fetch.mockResolvedValue([createAlbum(), createSectionedAlbum()])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.albums).toHaveLength(2)
      expect(result.current.albums[0].hasSections).toBe(false)
      expect(result.current.albums[1].hasSections).toBe(true)
    })

    it('resolves bilingual section names in PL', async () => {
      client.fetch.mockResolvedValue([createSectionedAlbum()])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      // Default language is PL
      expect(result.current.albums[0].sections[0].name).toBe('Scena')
      expect(result.current.albums[0].sections[1].name).toBe('Publiczność')
    })

    it('handles album with empty sections array', async () => {
      client.fetch.mockResolvedValue([createSectionedAlbum({ sections: [] })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      const album = result.current.albums[0]
      expect(album.hasSections).toBe(false)
      expect(album.sections).toBeNull()
    })

    it('handles section with empty imageUrls', async () => {
      client.fetch.mockResolvedValue([createSectionedAlbum({
        sections: [
          { _key: 'sec1', namePl: 'Pusta', nameEn: 'Empty', imageUrls: [] },
        ],
      })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      const album = result.current.albums[0]
      expect(album.hasSections).toBe(true)
      expect(album.sections[0].images).toEqual([])
      expect(album.images).toEqual([])
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
      expect(result.current.albums[0].image).toBeNull()
    })

    it('handles empty imageUrls array', async () => {
      client.fetch.mockResolvedValue([createAlbum({ imageUrls: [] })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].images).toEqual([])
    })

    it('handles null imageUrls', async () => {
      client.fetch.mockResolvedValue([createAlbum({ imageUrls: null })])
      const { result } = renderHook(() => useSanityPhotoAlbums(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.albums[0].images).toEqual([])
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
      expect(result.current.albums[0].images).toHaveLength(200)
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
