import { vi } from 'vitest'

export const mockFetch = vi.fn()

export const client = {
  fetch: mockFetch,
}
