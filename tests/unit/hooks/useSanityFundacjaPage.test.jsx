/**
 * Unit tests for useSanityFundacjaPage hook
 * Tests singleton page data with projects and accessibility declaration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { useSanityFundacjaPage } from '../../../src/hooks/useSanityFundacjaPage'
import { LanguageProvider } from '../../../src/context/LanguageContext'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: vi.fn() },
}))

import { client } from '../../../src/lib/sanity/client'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

const createFundacjaPage = (overrides = {}) => ({
  _id: 'fundacjaPage',
  krs: '0000123456',
  regon: '123456789',
  nip: '1234567890',
  bankAccount: 'PL12 3456 7890 1234 5678 9012 3456',
  email: 'KONTAKT@FUNDACJA.PL',
  projects: [
    {
      textPl: 'Projekt 1 PL',
      textEn: 'Project 1 EN',
      linkTextPl: 'Więcej PL',
      linkTextEn: 'More EN',
      linkUrl: 'https://example.com/project1',
    },
  ],
  accessibilityDeclarationPl: ['Paragraf 1 PL', 'Paragraf 2 PL', 'Paragraf 3 PL'],
  accessibilityDeclarationEn: ['Paragraph 1 EN', 'Paragraph 2 EN', 'Paragraph 3 EN'],
  ...overrides,
})

describe('useSanityFundacjaPage', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('Happy Path', () => {
    it('returns transformed data for PL', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage())
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data).not.toBeNull()
      expect(result.current.data.krs).toBe('0000123456')
      expect(result.current.data.projects[0].text).toBe('Projekt 1 PL')
      expect(result.current.data.accessibilityDeclaration[0]).toBe('Paragraf 1 PL')
    })

    it('transforms projects array correctly', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        projects: [
          { textPl: 'P1', textEn: 'E1', linkTextPl: 'L1', linkTextEn: 'LE1', linkUrl: 'url1' },
          { textPl: 'P2', textEn: 'E2', linkTextPl: 'L2', linkTextEn: 'LE2', linkUrl: 'url2' },
        ],
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.projects).toHaveLength(2)
      expect(result.current.data.projects[0].text).toBe('P1')
      expect(result.current.data.projects[0].linkText).toBe('L1')
      expect(result.current.data.projects[0].linkUrl).toBe('url1')
    })
  })

  describe('Null Handling', () => {
    it('returns null data when API returns null', async () => {
      client.fetch.mockResolvedValue(null)
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('returns null data when API returns undefined', async () => {
      client.fetch.mockResolvedValue(undefined)
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data).toBeNull()
    })
  })

  describe('Missing Fields', () => {
    it('handles missing projects array', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({ projects: null }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.projects).toEqual([])
    })

    it('handles empty projects array', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({ projects: [] }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.projects).toEqual([])
    })

    it('handles project with missing linkUrl', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        projects: [
          { textPl: 'Text', textEn: 'Text', linkTextPl: null, linkTextEn: null, linkUrl: null },
        ],
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      // Should fallback to empty string when values are missing
      expect(result.current.data.projects[0].linkUrl).toBe('')
      expect(result.current.data.projects[0].linkText).toBe('')
    })

    it('handles missing accessibilityDeclaration', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        accessibilityDeclarationPl: null,
        accessibilityDeclarationEn: null,
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      // Should fallback to empty array when both translations are missing
      expect(result.current.data.accessibilityDeclaration).toEqual([])
    })

    it('handles empty accessibilityDeclaration array', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        accessibilityDeclarationPl: [],
        accessibilityDeclarationEn: [],
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.accessibilityDeclaration).toEqual([])
    })

    it('handles missing EN translations', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        projects: [{ textPl: 'PL', textEn: null, linkTextPl: 'Link', linkTextEn: null, linkUrl: 'url' }],
        accessibilityDeclarationEn: null,
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.projects[0].text).toBe('PL')
    })
  })

  describe('Error Handling', () => {
    it('sets error on failure', async () => {
      client.fetch.mockRejectedValue(new Error('Failed'))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBeTruthy()
      expect(result.current.data).toBeNull()
    })
  })

  describe('Large Data', () => {
    it('handles 50 projects', async () => {
      const manyProjects = Array.from({ length: 50 }, (_, i) => ({
        textPl: `Projekt ${i}`,
        textEn: `Project ${i}`,
        linkTextPl: `Link ${i}`,
        linkTextEn: `Link ${i}`,
        linkUrl: `https://example.com/${i}`,
      }))
      client.fetch.mockResolvedValue(createFundacjaPage({ projects: manyProjects }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.projects).toHaveLength(50)
    })

    it('handles very long accessibility paragraphs', async () => {
      const longParagraphs = ['A'.repeat(3000), 'B'.repeat(3000), 'C'.repeat(3000)]
      client.fetch.mockResolvedValue(createFundacjaPage({
        accessibilityDeclarationPl: longParagraphs,
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.accessibilityDeclaration[0].length).toBe(3000)
    })
  })

  describe('Special Characters', () => {
    it('preserves Polish chars', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        projects: [{ textPl: 'Żółć gęślą jaźń', textEn: 'EN', linkTextPl: 'Łódź', linkTextEn: 'EN', linkUrl: 'url' }],
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.projects[0].text).toBe('Żółć gęślą jaźń')
      expect(result.current.data.projects[0].linkText).toBe('Łódź')
    })

    it('preserves HTML as text in email', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        email: '<SCRIPT>ALERT(1)</SCRIPT>@EVIL.COM',
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.email).toContain('<SCRIPT>')
    })
  })

  describe('Static Fields (not language-dependent)', () => {
    it('preserves KRS, REGON, NIP, bankAccount', async () => {
      client.fetch.mockResolvedValue(createFundacjaPage({
        krs: '1234567890',
        regon: '0987654321',
        nip: '5555555555',
        bankAccount: 'PL00 0000 0000 0000 0000 0000 0000',
      }))
      const { result } = renderHook(() => useSanityFundacjaPage(), { wrapper })
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.data.krs).toBe('1234567890')
      expect(result.current.data.regon).toBe('0987654321')
      expect(result.current.data.nip).toBe('5555555555')
      expect(result.current.data.bankAccount).toBe('PL00 0000 0000 0000 0000 0000 0000')
    })
  })
})
