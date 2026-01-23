import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '../../../src/context/LanguageContext'

describe('LanguageContext', () => {
  beforeEach(() => {
    // Reset localStorage mock to return null by default
    localStorage.getItem.mockReturnValue(null)
    localStorage.setItem.mockClear()
    localStorage.clear.mockClear()
    vi.clearAllMocks()
  })

  describe('LanguageProvider', () => {
    it('should provide default language as "pl"', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('pl')
    })

    it('should load language from localStorage if available', () => {
      localStorage.getItem.mockReturnValue('en')

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('en')
      expect(localStorage.getItem).toHaveBeenCalledWith('language')
    })

    it('should toggle language from pl to en', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('pl')

      act(() => {
        result.current.toggleLanguage()
      })

      expect(result.current.language).toBe('en')
    })

    it('should toggle language from en to pl', () => {
      localStorage.getItem.mockReturnValue('en')

      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      expect(result.current.language).toBe('en')

      act(() => {
        result.current.toggleLanguage()
      })

      expect(result.current.language).toBe('pl')
    })

    it('should save language to localStorage on change', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.toggleLanguage()
      })

      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en')
    })

    it('should allow setting language directly', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      })

      act(() => {
        result.current.setLanguage('en')
      })

      expect(result.current.language).toBe('en')
    })
  })

  describe('useLanguage', () => {
    it('should throw error when used outside LanguageProvider', () => {
      expect(() => {
        renderHook(() => useLanguage())
      }).toThrow('useLanguage must be used within a LanguageProvider')
    })
  })
})
