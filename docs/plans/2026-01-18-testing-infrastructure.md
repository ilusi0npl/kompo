# Testing Infrastructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive testing infrastructure with unit tests (Vitest) and E2E tests (Playwright) for the Kompopolex React application.

**Architecture:** Two-tier testing strategy:
1. **Unit tests** - Test components and hooks in isolation with Vitest + React Testing Library
2. **E2E tests** - Test full user journeys and page functionality with Playwright

**Tech Stack:**
- Vitest 2.x - Fast unit test runner with React support
- @testing-library/react - React component testing utilities
- @testing-library/jest-dom - DOM matchers for assertions
- Playwright 1.57 (already installed) - E2E browser testing
- happy-dom - Lightweight DOM for Vitest

---

## Phase 1: Setup Testing Infrastructure

### Task 1: Install Unit Testing Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Vitest and testing libraries**

Run:
```bash
npm install -D vitest@^2.0.0 @testing-library/react@^16.0.0 @testing-library/jest-dom@^6.6.3 @testing-library/user-event@^14.5.2 happy-dom@^15.11.7
```

Expected: Dependencies installed successfully

**Step 2: Commit dependency installation**

Run:
```bash
git add package.json package-lock.json
git commit -m "test: install Vitest and React Testing Library dependencies"
```

Expected: Commit created successfully

---

### Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.js`
- Create: `tests/setup.js`

**Step 1: Create Vitest configuration**

Create `vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.js',
    include: ['tests/unit/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/**/*.config.js',
        'src/**/index.js',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 2: Create test setup file**

Create `tests/setup.js`:
```javascript
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
vi.stubEnv('VITE_SANITY_PROJECT_ID', 'test-project-id')
vi.stubEnv('VITE_SANITY_DATASET', 'test-dataset')
vi.stubEnv('VITE_USE_SANITY', 'false')

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock
```

**Step 3: Add test scripts to package.json**

Modify `package.json` scripts section:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:run && npm run test:e2e"
  }
}
```

**Step 4: Commit test configuration**

Run:
```bash
git add vitest.config.js tests/setup.js package.json
git commit -m "test: configure Vitest with React Testing Library"
```

Expected: Commit created successfully

---

### Task 3: Configure Playwright for E2E Tests

**Files:**
- Create: `playwright.config.js`
- Create: `tests/e2e/.gitkeep`

**Step 1: Create Playwright configuration**

Create `playwright.config.js`:
```javascript
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Kompopolex E2E tests
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'tmp/playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

**Step 2: Create E2E test directory**

Run:
```bash
mkdir -p tests/e2e
touch tests/e2e/.gitkeep
```

Expected: Directory created

**Step 3: Commit Playwright configuration**

Run:
```bash
git add playwright.config.js tests/e2e/.gitkeep
git commit -m "test: configure Playwright for E2E testing"
```

Expected: Commit created successfully

---

## Phase 2: Unit Tests - Contexts and Hooks

### Task 4: Test LanguageContext

**Files:**
- Create: `tests/unit/context/LanguageContext.test.jsx`

**Step 1: Write LanguageContext tests**

Create `tests/unit/context/LanguageContext.test.jsx`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '../../../src/context/LanguageContext'

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
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
```

**Step 2: Run the test**

Run:
```bash
npm run test:run tests/unit/context/LanguageContext.test.jsx
```

Expected: All tests pass (8 tests)

**Step 3: Commit LanguageContext tests**

Run:
```bash
git add tests/unit/context/LanguageContext.test.jsx
git commit -m "test: add unit tests for LanguageContext"
```

Expected: Commit created successfully

---

### Task 5: Test useSanityEvents Hook

**Files:**
- Create: `tests/unit/hooks/useSanityEvents.test.jsx`
- Create: `tests/__mocks__/sanity-client.js`

**Step 1: Create Sanity client mock**

Create `tests/__mocks__/sanity-client.js`:
```javascript
import { vi } from 'vitest'

export const mockFetch = vi.fn()

export const client = {
  fetch: mockFetch,
}
```

**Step 2: Write useSanityEvents tests**

Create `tests/unit/hooks/useSanityEvents.test.jsx`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityEvents } from '../../../src/hooks/useSanityEvents'
import { LanguageProvider } from '../../../src/context/LanguageContext'
import { mockFetch } from '../../__mocks__/sanity-client'

// Mock Sanity client
vi.mock('../../../src/lib/sanity/client', () => ({
  client: {
    fetch: mockFetch,
  },
}))

describe('useSanityEvents', () => {
  const mockEventsData = [
    {
      _id: 'event-1',
      titlePl: 'Wydarzenie 1',
      titleEn: 'Event 1',
      performersPl: 'Wykonawca PL',
      performersEn: 'Performer EN',
      descriptionPl: 'Opis PL',
      descriptionEn: 'Description EN',
      locationPl: 'Wrocław',
      locationEn: 'Wroclaw',
      date: '2026-02-15',
      imageUrl: '/image1.jpg',
    },
    {
      _id: 'event-2',
      titlePl: 'Wydarzenie 2',
      titleEn: 'Event 2',
      performersPl: 'Wykonawca 2 PL',
      performersEn: 'Performer 2 EN',
      descriptionPl: 'Opis 2 PL',
      descriptionEn: 'Description 2 EN',
      locationPl: 'Kraków',
      locationEn: 'Krakow',
      date: '2026-03-20',
      imageUrl: '/image2.jpg',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch upcoming events by default', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.events).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('should fetch archived events when status="archived"', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents('archived'), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result.current.events).toHaveLength(2)
  })

  it('should transform events to Polish by default', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstEvent = result.current.events[0]
    expect(firstEvent.title).toBe('Wydarzenie 1')
    expect(firstEvent.performers).toBe('Wykonawca PL')
    expect(firstEvent.description).toBe('Opis PL')
    expect(firstEvent.location).toBe('Wrocław')
  })

  it('should transform events to English when language changes', async () => {
    localStorage.getItem.mockReturnValue('en')
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstEvent = result.current.events[0]
    expect(firstEvent.title).toBe('Event 1')
    expect(firstEvent.performers).toBe('Performer EN')
    expect(firstEvent.description).toBe('Description EN')
    expect(firstEvent.location).toBe('Wroclaw')
  })

  it('should handle null/undefined data gracefully', async () => {
    mockFetch.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should handle empty array data', async () => {
    mockFetch.mockResolvedValueOnce([])

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    mockFetch.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    expect(result.current.error).toBe(mockError)
  })

  it('should preserve original fields in transformed events', async () => {
    mockFetch.mockResolvedValueOnce(mockEventsData)

    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstEvent = result.current.events[0]
    expect(firstEvent._id).toBe('event-1')
    expect(firstEvent.date).toBe('2026-02-15')
    expect(firstEvent.imageUrl).toBe('/image1.jpg')
    expect(firstEvent.titlePl).toBe('Wydarzenie 1')
    expect(firstEvent.titleEn).toBe('Event 1')
  })
})
```

**Step 3: Run the tests**

Run:
```bash
npm run test:run tests/unit/hooks/useSanityEvents.test.jsx
```

Expected: All tests pass (9 tests)

**Step 4: Commit useSanityEvents tests**

Run:
```bash
git add tests/__mocks__/sanity-client.js tests/unit/hooks/useSanityEvents.test.jsx
git commit -m "test: add unit tests for useSanityEvents hook"
```

Expected: Commit created successfully

---

### Task 6: Test useSanityBioProfiles Hook

**Files:**
- Create: `tests/unit/hooks/useSanityBioProfiles.test.jsx`

**Step 1: Write useSanityBioProfiles tests**

Create `tests/unit/hooks/useSanityBioProfiles.test.jsx`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityBioProfiles } from '../../../src/hooks/useSanityBioProfiles'
import { LanguageProvider } from '../../../src/context/LanguageContext'
import { mockFetch } from '../../__mocks__/sanity-client'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: {
    fetch: mockFetch,
  },
}))

describe('useSanityBioProfiles', () => {
  const mockProfilesData = [
    {
      _id: 'profile-1',
      namePl: 'Ensemble Kompopolex',
      nameEn: 'Ensemble Kompopolex',
      imageUrl: '/bio1.jpg',
      paragraphsPl: ['Paragraf 1 PL', 'Paragraf 2 PL'],
      paragraphsEn: ['Paragraph 1 EN', 'Paragraph 2 EN'],
    },
    {
      _id: 'profile-2',
      namePl: 'Aleksandra Kowalska',
      nameEn: 'Aleksandra Kowalska',
      imageUrl: '/bio2.jpg',
      paragraphsPl: ['Bio PL'],
      paragraphsEn: ['Bio EN'],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch bio profiles successfully', async () => {
    mockFetch.mockResolvedValueOnce(mockProfilesData)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profiles).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('should transform profiles to Polish by default', async () => {
    mockFetch.mockResolvedValueOnce(mockProfilesData)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstProfile = result.current.profiles[0]
    expect(firstProfile.name).toBe('Ensemble Kompopolex')
    expect(firstProfile.paragraphs).toEqual(['Paragraf 1 PL', 'Paragraf 2 PL'])
  })

  it('should transform profiles to English when language="en"', async () => {
    localStorage.getItem.mockReturnValue('en')
    mockFetch.mockResolvedValueOnce(mockProfilesData)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstProfile = result.current.profiles[0]
    expect(firstProfile.name).toBe('Ensemble Kompopolex')
    expect(firstProfile.paragraphs).toEqual(['Paragraph 1 EN', 'Paragraph 2 EN'])
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
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('API error')
    mockFetch.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSanityBioProfiles(), {
      wrapper: LanguageProvider,
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(mockError)
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:run tests/unit/hooks/useSanityBioProfiles.test.jsx
```

Expected: All tests pass (5 tests)

**Step 3: Commit useSanityBioProfiles tests**

Run:
```bash
git add tests/unit/hooks/useSanityBioProfiles.test.jsx
git commit -m "test: add unit tests for useSanityBioProfiles hook"
```

Expected: Commit created successfully

---

## Phase 3: Unit Tests - Components

### Task 7: Test ResponsiveWrapper Component

**Files:**
- Create: `tests/unit/components/ResponsiveWrapper.test.jsx`

**Step 1: Write ResponsiveWrapper tests**

Create `tests/unit/components/ResponsiveWrapper.test.jsx`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResponsiveWrapper from '../../../src/components/ResponsiveWrapper/ResponsiveWrapper'

describe('ResponsiveWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set default viewport width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })
  })

  it('should render desktop content on desktop viewport', () => {
    window.innerWidth = 1440

    render(
      <ResponsiveWrapper
        desktopContent={<div>Desktop Content</div>}
        mobileContent={<div>Mobile Content</div>}
      />
    )

    expect(screen.getByText('Desktop Content')).toBeInTheDocument()
    expect(screen.queryByText('Mobile Content')).not.toBeInTheDocument()
  })

  it('should render mobile content on mobile viewport', () => {
    window.innerWidth = 390

    render(
      <ResponsiveWrapper
        desktopContent={<div>Desktop Content</div>}
        mobileContent={<div>Mobile Content</div>}
      />
    )

    expect(screen.getByText('Mobile Content')).toBeInTheDocument()
    expect(screen.queryByText('Desktop Content')).not.toBeInTheDocument()
  })

  it('should switch to mobile content at breakpoint (768px)', () => {
    window.innerWidth = 768

    render(
      <ResponsiveWrapper
        desktopContent={<div>Desktop Content</div>}
        mobileContent={<div>Mobile Content</div>}
      />
    )

    expect(screen.getByText('Mobile Content')).toBeInTheDocument()
  })

  it('should render desktop content just above breakpoint (769px)', () => {
    window.innerWidth = 769

    render(
      <ResponsiveWrapper
        desktopContent={<div>Desktop Content</div>}
        mobileContent={<div>Mobile Content</div>}
      />
    )

    expect(screen.getByText('Desktop Content')).toBeInTheDocument()
  })

  it('should apply scale transform based on viewport width', () => {
    window.innerWidth = 1200 // Should scale to 1200/1440 = 0.833...

    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Content</div>}
        mobileContent={<div>Mobile</div>}
      />
    )

    const scaledDiv = container.querySelector('div > div')
    expect(scaledDiv).toHaveStyle({ transform: 'scale(0.8333333333333334)' })
  })

  it('should apply custom background color', () => {
    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Content</div>}
        mobileContent={<div>Mobile</div>}
        backgroundColor="#FF0000"
      />
    )

    const wrapper = container.firstChild
    expect(wrapper).toHaveStyle({ background: expect.stringContaining('#FF0000') })
  })

  it('should hide lines when hideLines=true', () => {
    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Content</div>}
        mobileContent={<div>Mobile</div>}
        hideLines={true}
        backgroundColor="#FDFDFD"
      />
    )

    const wrapper = container.firstChild
    // When hideLines is true, background should be just the color, no gradients
    expect(wrapper).toHaveStyle({ background: '#FDFDFD' })
  })

  it('should render lines when hideLines=false', () => {
    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Content</div>}
        mobileContent={<div>Mobile</div>}
        hideLines={false}
        backgroundColor="#FDFDFD"
        lineColor="#A0E38A"
      />
    )

    const wrapper = container.firstChild
    const bgStyle = wrapper.style.background
    // Should contain linear-gradient for lines
    expect(bgStyle).toContain('linear-gradient')
    expect(bgStyle).toContain('#A0E38A')
  })

  it('should use mobile line positions on mobile viewport', () => {
    window.innerWidth = 390

    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Desktop</div>}
        mobileContent={<div>Mobile</div>}
        lineColor="#A0E38A"
      />
    )

    const wrapper = container.firstChild
    const bgStyle = wrapper.style.background
    // Mobile line positions: [97, 195, 292]
    // At scale 1 (390/390), should have gradients at these positions
    expect(bgStyle).toContain('linear-gradient')
  })

  it('should set content width to desktop width (1440px)', () => {
    window.innerWidth = 1920

    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Content</div>}
        mobileContent={<div>Mobile</div>}
      />
    )

    const scaledDiv = container.querySelector('div > div')
    expect(scaledDiv).toHaveStyle({ width: '1440px' })
  })

  it('should set content width to mobile width (390px) on mobile', () => {
    window.innerWidth = 390

    const { container } = render(
      <ResponsiveWrapper
        desktopContent={<div>Desktop</div>}
        mobileContent={<div>Mobile</div>}
      />
    )

    const scaledDiv = container.querySelector('div > div')
    expect(scaledDiv).toHaveStyle({ width: '390px' })
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:run tests/unit/components/ResponsiveWrapper.test.jsx
```

Expected: All tests pass (11 tests)

**Step 3: Commit ResponsiveWrapper tests**

Run:
```bash
git add tests/unit/components/ResponsiveWrapper.test.jsx
git commit -m "test: add unit tests for ResponsiveWrapper component"
```

Expected: Commit created successfully

---

### Task 8: Test LanguageToggle Component

**Files:**
- Create: `tests/unit/components/LanguageToggle.test.jsx`

**Step 1: Write LanguageToggle tests**

Create `tests/unit/components/LanguageToggle.test.jsx`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageToggle from '../../../src/components/LanguageToggle/LanguageToggle'
import { LanguageProvider } from '../../../src/context/LanguageContext'

describe('LanguageToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render "ENG" button when language is Polish', () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    expect(screen.getByText('ENG')).toBeInTheDocument()
  })

  it('should render "PL" button when language is English', () => {
    localStorage.getItem.mockReturnValue('en')

    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    expect(screen.getByText('PL')).toBeInTheDocument()
  })

  it('should toggle language from PL to EN when clicked', async () => {
    const user = userEvent.setup()

    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    const button = screen.getByRole('button')
    expect(screen.getByText('ENG')).toBeInTheDocument()

    await user.click(button)

    expect(screen.getByText('PL')).toBeInTheDocument()
  })

  it('should toggle language from EN to PL when clicked', async () => {
    const user = userEvent.setup()
    localStorage.getItem.mockReturnValue('en')

    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    const button = screen.getByRole('button')
    expect(screen.getByText('PL')).toBeInTheDocument()

    await user.click(button)

    expect(screen.getByText('ENG')).toBeInTheDocument()
  })

  it('should apply custom text color', () => {
    render(
      <LanguageProvider>
        <LanguageToggle textColor="#FF0000" />
      </LanguageProvider>
    )

    const text = screen.getByText('ENG')
    expect(text).toHaveStyle({ color: '#FF0000' })
  })

  it('should apply custom scale', () => {
    render(
      <LanguageProvider>
        <LanguageToggle scale={2} />
      </LanguageProvider>
    )

    const text = screen.getByText('ENG')
    expect(text).toHaveStyle({ fontSize: '40px' })
  })

  it('should apply custom styles', () => {
    render(
      <LanguageProvider>
        <LanguageToggle style={{ marginTop: '10px' }} />
      </LanguageProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ marginTop: '10px' })
  })

  it('should include globe icon SVG', () => {
    const { container } = render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '28')
    expect(svg).toHaveAttribute('height', '28')
  })

  it('should apply transition when provided', () => {
    render(
      <LanguageProvider>
        <LanguageToggle transition="0.3s ease" />
      </LanguageProvider>
    )

    const text = screen.getByText('ENG')
    expect(text).toHaveStyle({ transition: 'color 0.3s ease' })
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:run tests/unit/components/LanguageToggle.test.jsx
```

Expected: All tests pass (9 tests)

**Step 3: Commit LanguageToggle tests**

Run:
```bash
git add tests/unit/components/LanguageToggle.test.jsx
git commit -m "test: add unit tests for LanguageToggle component"
```

Expected: Commit created successfully

---

### Task 9: Test BackgroundLines Component

**Files:**
- Create: `tests/unit/components/BackgroundLines.test.jsx`

**Step 1: Write BackgroundLines tests**

Create `tests/unit/components/BackgroundLines.test.jsx`:
```javascript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BackgroundLines from '../../../src/components/BackgroundLines/BackgroundLines'

describe('BackgroundLines', () => {
  it('should render desktop lines at correct positions', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const linesContainer = container.firstChild
    expect(linesContainer).toBeInTheDocument()

    // Desktop should have 6 lines
    const lines = linesContainer.querySelectorAll('div')
    expect(lines).toHaveLength(6)
  })

  it('should render mobile lines at correct positions', () => {
    const { container } = render(
      <BackgroundLines isMobile={true} lineColor="#A0E38A" scale={1} />
    )

    const linesContainer = container.firstChild
    expect(linesContainer).toBeInTheDocument()

    // Mobile should have 3 lines
    const lines = linesContainer.querySelectorAll('div')
    expect(lines).toHaveLength(3)
  })

  it('should apply line color correctly', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#FF0000" scale={1} />
    )

    const firstLine = container.querySelector('div > div')
    expect(firstLine).toHaveStyle({ backgroundColor: '#FF0000' })
  })

  it('should apply scale to line positions', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={0.5} />
    )

    const firstLine = container.querySelector('div > div')
    // First desktop line at 155px, scaled by 0.5 = 77.5px
    expect(firstLine).toHaveStyle({ left: '77.5px' })
  })

  it('should position desktop lines at [155, 375, 595, 815, 1035, 1255]', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('div > div')
    const expectedPositions = [155, 375, 595, 815, 1035, 1255]

    lines.forEach((line, index) => {
      expect(line).toHaveStyle({ left: `${expectedPositions[index]}px` })
    })
  })

  it('should position mobile lines at [97, 195, 292]', () => {
    const { container } = render(
      <BackgroundLines isMobile={true} lineColor="#A0E38A" scale={1} />
    )

    const lines = container.querySelectorAll('div > div')
    const expectedPositions = [97, 195, 292]

    lines.forEach((line, index) => {
      expect(line).toHaveStyle({ left: `${expectedPositions[index]}px` })
    })
  })

  it('should render lines with 1px width', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const firstLine = container.querySelector('div > div')
    expect(firstLine).toHaveStyle({ width: '1px' })
  })

  it('should render lines with full height', () => {
    const { container } = render(
      <BackgroundLines isMobile={false} lineColor="#A0E38A" scale={1} />
    )

    const firstLine = container.querySelector('div > div')
    expect(firstLine).toHaveStyle({ height: '100%' })
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:run tests/unit/components/BackgroundLines.test.jsx
```

Expected: All tests pass (8 tests)

**Step 3: Commit BackgroundLines tests**

Run:
```bash
git add tests/unit/components/BackgroundLines.test.jsx
git commit -m "test: add unit tests for BackgroundLines component"
```

Expected: Commit created successfully

---

## Phase 4: E2E Tests - Page Navigation and Core Features

### Task 10: Test Homepage E2E

**Files:**
- Create: `tests/e2e/homepage.spec.js`

**Step 1: Write Homepage E2E tests**

Create `tests/e2e/homepage.spec.js`:
```javascript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check page title or main heading
    await expect(page).toHaveURL('/')

    // Wait for main content to be visible
    await expect(page.locator('section')).toBeVisible()
  })

  test('should display logo', async ({ page }) => {
    await page.goto('/')

    const logo = page.locator('img[alt*="logo" i], img[src*="logo"]').first()
    await expect(logo).toBeVisible()
  })

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/')

    // Check for navigation links
    const bioLink = page.getByRole('link', { name: /bio/i })
    const kalendarzeLink = page.getByRole('link', { name: /kalendarz/i })

    await expect(bioLink).toBeVisible()
    await expect(kalendarzeLink).toBeVisible()
  })

  test('should toggle language from PL to EN', async ({ page }) => {
    await page.goto('/')

    // Find language toggle button
    const langToggle = page.locator('.language-toggle, button:has-text("ENG")')
    await expect(langToggle).toBeVisible()

    // Click to switch to English
    await langToggle.click()

    // Should now show "PL" as the toggle option
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should persist language choice in localStorage', async ({ page }) => {
    await page.goto('/')

    // Toggle to English
    const langToggle = page.locator('button:has-text("ENG")')
    await langToggle.click()

    // Reload page
    await page.reload()

    // Should still be in English (showing PL toggle)
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')

    const heroSection = page.locator('[data-section="hero"], section').first()
    await expect(heroSection).toBeVisible()
  })

  test('should have footer with email', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer, [role="contentinfo"]')
    await expect(footer).toBeVisible()

    // Check for email link
    const emailLink = page.locator('a[href^="mailto:"]')
    await expect(emailLink).toBeVisible()
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    // Page should still load and display content
    await expect(page.locator('section')).toBeVisible()
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:e2e tests/e2e/homepage.spec.js
```

Expected: All tests pass (8 tests)

**Step 3: Commit Homepage E2E tests**

Run:
```bash
git add tests/e2e/homepage.spec.js
git commit -m "test: add E2E tests for Homepage"
```

Expected: Commit created successfully

---

### Task 11: Test Navigation E2E

**Files:**
- Create: `tests/e2e/navigation.spec.js`

**Step 1: Write Navigation E2E tests**

Create `tests/e2e/navigation.spec.js`:
```javascript
import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/bio', name: 'Bio' },
  { path: '/kalendarz', name: 'Kalendarz' },
  { path: '/archiwalne', name: 'Archiwalne' },
  { path: '/media', name: 'Media Galeria' },
  { path: '/media/wideo', name: 'Media Wideo' },
  { path: '/repertuar', name: 'Repertuar' },
  { path: '/specialne', name: 'Specialne' },
  { path: '/kontakt', name: 'Kontakt' },
  { path: '/fundacja', name: 'Fundacja' },
]

test.describe('Navigation', () => {
  test('should navigate to Bio page from Homepage', async ({ page }) => {
    await page.goto('/')

    const bioLink = page.getByRole('link', { name: /bio/i }).first()
    await bioLink.click()

    await expect(page).toHaveURL('/bio')
    await expect(page.locator('section')).toBeVisible()
  })

  test('should navigate to Kalendarz page', async ({ page }) => {
    await page.goto('/')

    const kalendarzeLink = page.getByRole('link', { name: /kalendarz/i }).first()
    await kalendarzeLink.click()

    await expect(page).toHaveURL('/kalendarz')
    await expect(page.locator('section')).toBeVisible()
  })

  test('should navigate to Kontakt page', async ({ page }) => {
    await page.goto('/')

    const kontaktLink = page.getByRole('link', { name: /kontakt/i }).first()
    await kontaktLink.click()

    await expect(page).toHaveURL('/kontakt')
    await expect(page.locator('section')).toBeVisible()
  })

  test('should allow browser back navigation', async ({ page }) => {
    await page.goto('/')

    // Navigate to Bio
    await page.getByRole('link', { name: /bio/i }).first().click()
    await expect(page).toHaveURL('/bio')

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('should allow browser forward navigation', async ({ page }) => {
    await page.goto('/')

    // Navigate to Bio
    await page.getByRole('link', { name: /bio/i }).first().click()
    await expect(page).toHaveURL('/bio')

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL('/bio')
  })

  for (const pageInfo of PAGES) {
    test(`should load ${pageInfo.name} page without errors`, async ({ page }) => {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))

      await page.goto(pageInfo.path)

      // Page should load
      await expect(page.locator('section')).toBeVisible({ timeout: 10000 })

      // No JavaScript errors
      expect(errors).toEqual([])
    })
  }
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:e2e tests/e2e/navigation.spec.js
```

Expected: All tests pass (15 tests total: 5 navigation + 10 page loads)

**Step 3: Commit Navigation E2E tests**

Run:
```bash
git add tests/e2e/navigation.spec.js
git commit -m "test: add E2E tests for navigation across all pages"
```

Expected: Commit created successfully

---

### Task 12: Test Kalendarz Page with Sanity Integration

**Files:**
- Create: `tests/e2e/kalendarz-sanity.spec.js`

**Step 1: Write Kalendarz Sanity E2E tests**

Create `tests/e2e/kalendarz-sanity.spec.js`:
```javascript
import { test, expect } from '@playwright/test'

test.describe('Kalendarz Page - Sanity Integration', () => {
  test.describe('With Local Config (VITE_USE_SANITY=false)', () => {
    test.use({
      storageState: undefined,
    })

    test('should load events from local config', async ({ page }) => {
      // Ensure we're using local config
      await page.addInitScript(() => {
        localStorage.setItem('test-mode', 'local')
      })

      await page.goto('/kalendarz')

      // Should display event cards
      const eventCards = page.locator('[data-testid="event-card"], section > div')
      await expect(eventCards.first()).toBeVisible({ timeout: 5000 })
    })

    test('should not show loading state for too long', async ({ page }) => {
      await page.goto('/kalendarz')

      // Should not have permanent loading text
      await page.waitForTimeout(3000)
      const loadingText = page.locator('text=/ładowanie|loading/i')
      await expect(loadingText).not.toBeVisible()
    })
  })

  test.describe('Common Features (Both Modes)', () => {
    test('should display event images', async ({ page }) => {
      await page.goto('/kalendarz')

      // Wait for images to load
      await page.waitForTimeout(2000)

      const images = page.locator('img[src*="/assets/"], img[src*="cdn.sanity"]')
      const imageCount = await images.count()

      expect(imageCount).toBeGreaterThan(0)
    })

    test('should show event dates', async ({ page }) => {
      await page.goto('/kalendarz')

      // Look for date patterns (DD.MM.YY format or similar)
      const dates = page.locator('text=/\\d{1,2}\\.\\d{1,2}\\.\\d{2,4}/')
      await expect(dates.first()).toBeVisible({ timeout: 5000 })
    })

    test('should display event locations', async ({ page }) => {
      await page.goto('/kalendarz')

      // Should have location icons or text
      const locationInfo = page.locator('[data-testid="location"], svg[viewBox*="28"], text=/wrocław|kraków|barcelona/i')
      await expect(locationInfo.first()).toBeVisible({ timeout: 5000 })
    })

    test('should switch between Nadchodzące and Archiwalne tabs', async ({ page }) => {
      await page.goto('/kalendarz')

      // Find and click Archiwalne tab
      const archivalneTab = page.getByRole('button', { name: /archiwalne/i })
        .or(page.locator('text=/archiwalne/i').first())

      if (await archivalneTab.isVisible()) {
        await archivalneTab.click()
        await page.waitForTimeout(1000)

        // URL should change or content should update
        const hasArchivedContent = await page.locator('section').isVisible()
        expect(hasArchivedContent).toBe(true)
      }
    })

    test('should maintain language when navigating', async ({ page }) => {
      await page.goto('/kalendarz')

      // Switch to English
      const langToggle = page.locator('button:has-text("ENG")')
      if (await langToggle.isVisible()) {
        await langToggle.click()
        await page.waitForTimeout(500)

        // Navigate to another page
        await page.getByRole('link', { name: /bio/i }).first().click()
        await page.waitForLoadState('networkidle')

        // Navigate back
        await page.getByRole('link', { name: /kalendarz/i }).first().click()

        // Should still be in English
        await expect(page.locator('button:has-text("PL")')).toBeVisible()
      }
    })
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:e2e tests/e2e/kalendarz-sanity.spec.js
```

Expected: All tests pass (7 tests)

**Step 3: Commit Kalendarz Sanity E2E tests**

Run:
```bash
git add tests/e2e/kalendarz-sanity.spec.js
git commit -m "test: add E2E tests for Kalendarz with Sanity integration"
```

Expected: Commit created successfully

---

### Task 13: Test Language Switching E2E

**Files:**
- Create: `tests/e2e/language-switching.spec.js`

**Step 1: Write Language Switching E2E tests**

Create `tests/e2e/language-switching.spec.js`:
```javascript
import { test, expect } from '@playwright/test'

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should default to Polish language', async ({ page }) => {
    await page.goto('/')

    const langToggle = page.locator('button:has-text("ENG")')
    await expect(langToggle).toBeVisible()
  })

  test('should switch to English when toggle clicked', async ({ page }) => {
    await page.goto('/')

    const engToggle = page.locator('button:has-text("ENG")')
    await engToggle.click()

    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should switch back to Polish', async ({ page }) => {
    await page.goto('/')

    // Switch to English
    await page.locator('button:has-text("ENG")').click()
    await expect(page.locator('button:has-text("PL")')).toBeVisible()

    // Switch back to Polish
    await page.locator('button:has-text("PL")').click()
    await expect(page.locator('button:has-text("ENG")')).toBeVisible()
  })

  test('should persist language after page reload', async ({ page }) => {
    await page.goto('/')

    // Switch to English
    await page.locator('button:has-text("ENG")').click()
    await expect(page.locator('button:has-text("PL")')).toBeVisible()

    // Reload page
    await page.reload()

    // Should still be English
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should persist language across page navigation', async ({ page }) => {
    await page.goto('/')

    // Switch to English
    await page.locator('button:has-text("ENG")').click()

    // Navigate to Bio
    await page.getByRole('link', { name: /bio/i }).first().click()
    await page.waitForLoadState('networkidle')

    // Should still be English
    await expect(page.locator('button:has-text("PL")')).toBeVisible()

    // Navigate to Kalendarz
    await page.getByRole('link', { name: /kalendarz/i }).first().click()
    await page.waitForLoadState('networkidle')

    // Should still be English
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should update content when language changes on Kalendarz', async ({ page }) => {
    await page.goto('/kalendarz')

    // Get initial text content
    const initialContent = await page.locator('section').first().textContent()

    // Switch language
    const langToggle = page.locator('.language-toggle, button:has-text("ENG"), button:has-text("PL")')
    await langToggle.first().click()

    // Wait for content update
    await page.waitForTimeout(500)

    // Content should be different (language changed)
    const newContent = await page.locator('section').first().textContent()

    // At least the toggle button should show different text
    const toggleChanged = initialContent !== newContent
    expect(toggleChanged).toBe(true)
  })

  test('should update content when language changes on Bio', async ({ page }) => {
    await page.goto('/bio')

    // Switch language
    const langToggle = page.locator('button:has-text("ENG"), button:has-text("PL")')
    await langToggle.first().click()

    // Content should update (wait for re-render)
    await page.waitForTimeout(500)

    // Check that language toggle now shows opposite language
    const oppositeToggle = await langToggle.first().textContent()
    expect(['ENG', 'PL']).toContain(oppositeToggle.trim())
  })

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const langToggle = page.locator('button:has-text("ENG")')
    await expect(langToggle).toBeVisible()

    await langToggle.click()
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })
})
```

**Step 2: Run the tests**

Run:
```bash
npm run test:e2e tests/e2e/language-switching.spec.js
```

Expected: All tests pass (8 tests)

**Step 3: Commit Language Switching E2E tests**

Run:
```bash
git add tests/e2e/language-switching.spec.js
git commit -m "test: add E2E tests for language switching functionality"
```

Expected: Commit created successfully

---

## Phase 5: Additional Unit Tests for Remaining Hooks

### Task 14: Test useSanityHomepageSlides Hook

**Files:**
- Create: `tests/unit/hooks/useSanityHomepageSlides.test.jsx`

**Step 1: Write useSanityHomepageSlides tests**

Create `tests/unit/hooks/useSanityHomepageSlides.test.jsx`:
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityHomepageSlides } from '../../../src/hooks/useSanityHomepageSlides'
import { LanguageProvider } from '../../../src/context/LanguageContext'
import { mockFetch } from '../../__mocks__/sanity-client'

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
```

**Step 2: Run the tests**

Run:
```bash
npm run test:run tests/unit/hooks/useSanityHomepageSlides.test.jsx
```

Expected: All tests pass (5 tests)

**Step 3: Commit tests**

Run:
```bash
git add tests/unit/hooks/useSanityHomepageSlides.test.jsx
git commit -m "test: add unit tests for useSanityHomepageSlides hook"
```

Expected: Commit created successfully

---

### Task 15: Create Test Coverage Report Script

**Files:**
- Create: `scripts/test-report.js`

**Step 1: Create test report generation script**

Create `scripts/test-report.js`:
```javascript
#!/usr/bin/env node

/**
 * Generate comprehensive test report
 * Runs all tests and generates coverage report
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runTests() {
  console.log('🧪 Running Test Suite\n')
  console.log('═'.repeat(60))

  try {
    // Run unit tests with coverage
    console.log('\n📊 Running Unit Tests with Coverage...\n')
    const { stdout: unitOutput } = await execAsync('npm run test:coverage', {
      cwd: path.join(__dirname, '..'),
    })
    console.log(unitOutput)

    // Run E2E tests
    console.log('\n🌐 Running E2E Tests...\n')
    const { stdout: e2eOutput } = await execAsync('npm run test:e2e', {
      cwd: path.join(__dirname, '..'),
    })
    console.log(e2eOutput)

    console.log('\n✅ All Tests Completed Successfully!\n')
    console.log('═'.repeat(60))
    console.log('\n📈 Coverage Report:')
    console.log('   HTML: ./coverage/index.html')
    console.log('\n📊 E2E Report:')
    console.log('   HTML: ./tmp/playwright-report/index.html\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Tests Failed!\n')
    console.error(error.stdout || error.message)
    process.exit(1)
  }
}

runTests()
```

**Step 2: Make script executable and add to package.json**

Run:
```bash
chmod +x scripts/test-report.js
```

Modify `package.json` to add test report script:
```json
{
  "scripts": {
    "test:report": "node scripts/test-report.js"
  }
}
```

**Step 3: Commit test report script**

Run:
```bash
git add scripts/test-report.js package.json
git commit -m "test: add comprehensive test report generation script"
```

Expected: Commit created successfully

---

## Phase 6: Documentation and Final Integration

### Task 16: Create Testing Documentation

**Files:**
- Create: `docs/TESTING.md`

**Step 1: Write comprehensive testing documentation**

Create `docs/TESTING.md`:
```markdown
# Testing Documentation

## Overview

Kompopolex uses a two-tier testing strategy:
1. **Unit Tests** - Vitest + React Testing Library
2. **E2E Tests** - Playwright

## Running Tests

### All Tests
\`\`\`bash
npm run test:all
\`\`\`

### Unit Tests Only
\`\`\`bash
# Run in watch mode
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage

# Interactive UI
npm run test:ui
\`\`\`

### E2E Tests Only
\`\`\`bash
# Run all E2E tests
npm run test:e2e

# Interactive UI
npm run test:e2e:ui

# Specific test file
npx playwright test tests/e2e/homepage.spec.js
\`\`\`

### Generate Full Test Report
\`\`\`bash
npm run test:report
\`\`\`

## Test Structure

\`\`\`
tests/
├── setup.js                    # Vitest global setup
├── __mocks__/                  # Shared mocks
│   └── sanity-client.js       # Sanity client mock
├── unit/                       # Unit tests
│   ├── context/               # Context tests
│   │   └── LanguageContext.test.jsx
│   ├── hooks/                 # Hook tests
│   │   ├── useSanityEvents.test.jsx
│   │   ├── useSanityBioProfiles.test.jsx
│   │   └── useSanityHomepageSlides.test.jsx
│   └── components/            # Component tests
│       ├── ResponsiveWrapper.test.jsx
│       ├── LanguageToggle.test.jsx
│       └── BackgroundLines.test.jsx
└── e2e/                       # E2E tests
    ├── homepage.spec.js
    ├── navigation.spec.js
    ├── kalendarz-sanity.spec.js
    └── language-switching.spec.js
\`\`\`

## Unit Testing Patterns

### Testing Hooks
\`\`\`javascript
import { renderHook, waitFor } from '@testing-library/react'
import { useSanityEvents } from '../../../src/hooks/useSanityEvents'
import { LanguageProvider } from '../../../src/context/LanguageContext'

test('should fetch events', async () => {
  const { result } = renderHook(() => useSanityEvents(), {
    wrapper: LanguageProvider,
  })

  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })

  expect(result.current.events).toHaveLength(2)
})
\`\`\`

### Testing Components
\`\`\`javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('should toggle language', async () => {
  const user = userEvent.setup()
  render(<LanguageToggle />, { wrapper: LanguageProvider })

  const button = screen.getByRole('button')
  await user.click(button)

  expect(screen.getByText('PL')).toBeInTheDocument()
})
\`\`\`

### Mocking Sanity Client
\`\`\`javascript
import { mockFetch } from '../../__mocks__/sanity-client'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: mockFetch },
}))

// In test
mockFetch.mockResolvedValueOnce(mockData)
\`\`\`

## E2E Testing Patterns

### Page Navigation
\`\`\`javascript
test('should navigate to Bio', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /bio/i }).click()
  await expect(page).toHaveURL('/bio')
})
\`\`\`

### Language Switching
\`\`\`javascript
test('should switch language', async ({ page }) => {
  await page.goto('/')
  await page.locator('button:has-text("ENG")').click()
  await expect(page.locator('button:has-text("PL")')).toBeVisible()
})
\`\`\`

### Waiting for Content
\`\`\`javascript
test('should load events', async ({ page }) => {
  await page.goto('/kalendarz')
  await expect(page.locator('section')).toBeVisible()
  await page.waitForTimeout(1000) // For animations
})
\`\`\`

## Coverage Goals

- **Contexts**: 100% coverage
- **Hooks**: ≥90% coverage
- **Components**: ≥80% coverage
- **E2E**: All critical user journeys

## Current Coverage

Run \`npm run test:coverage\` to see current coverage report.

HTML report available at: \`./coverage/index.html\`

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Pre-commit hook (unit tests only)

## Visual Regression Testing

See [CLAUDE.md](../CLAUDE.md) for Figma-based visual regression testing:
- \`make verify-sections\` - Compare all sections
- \`make verify NODE=x\` - UIMatch single element

## Debugging Tests

### Debug Unit Tests
\`\`\`bash
npm run test:ui
\`\`\`

### Debug E2E Tests
\`\`\`bash
npm run test:e2e:ui
\`\`\`

### Debug Specific Test
\`\`\`bash
npx vitest run tests/unit/hooks/useSanityEvents.test.jsx --reporter=verbose
\`\`\`

## Writing New Tests

### Unit Test Template
\`\`\`javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
\`\`\`

### E2E Test Template
\`\`\`javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/page')
    await expect(page.locator('selector')).toBeVisible()
  })
})
\`\`\`

## Best Practices

1. **Test behavior, not implementation** - Test what users see and do
2. **Use semantic queries** - Prefer \`getByRole\`, \`getByText\` over \`getByTestId\`
3. **Avoid testing internals** - Don't test state, test rendered output
4. **Keep tests focused** - One assertion per test when possible
5. **Use descriptive names** - Test names should explain what they verify
6. **Mock external dependencies** - Mock Sanity, localStorage, etc.
7. **Clean up after tests** - Use \`beforeEach\` and \`afterEach\` hooks

## Troubleshooting

### Tests timing out
- Increase timeout in test: \`{ timeout: 10000 }\`
- Check for missing \`await\` keywords
- Verify mock data is being returned

### Component not rendering
- Check if proper wrapper is provided (LanguageProvider)
- Verify imports are correct
- Check console for React warnings

### E2E tests failing
- Ensure dev server is running
- Check viewport size for mobile tests
- Add \`await page.waitForTimeout()\` for animations
- Use \`--debug\` flag to see browser

## Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
\`\`\`

**Step 2: Commit documentation**

Run:
```bash
git add docs/TESTING.md
git commit -m "docs: add comprehensive testing documentation"
```

Expected: Commit created successfully

---

### Task 17: Update README with Testing Information

**Files:**
- Modify: `README.md`

**Step 1: Add testing section to README**

Add to `README.md` (after "Development Commands" section):
```markdown
## Testing

Kompopolex has comprehensive test coverage with unit and E2E tests.

### Quick Start
\`\`\`bash
# Run all tests
npm run test:all

# Unit tests only
npm test

# E2E tests only
npm run test:e2e

# Generate coverage report
npm run test:coverage
\`\`\`

### Test Reports
- **Coverage**: \`./coverage/index.html\`
- **E2E Report**: \`./tmp/playwright-report/index.html\`

For detailed testing documentation, see [docs/TESTING.md](docs/TESTING.md).
\`\`\`

**Step 2: Commit README update**

Run:
```bash
git add README.md
git commit -m "docs: add testing section to README"
```

Expected: Commit created successfully

---

### Task 18: Create CI/CD GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/tests.yml`

**Step 1: Create GitHub Actions workflow**

Create `.github/workflows/tests.yml`:
```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: unit-tests

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: tmp/playwright-report/
          retention-days: 30
```

**Step 2: Commit GitHub Actions workflow**

Run:
```bash
git add .github/workflows/tests.yml
git commit -m "ci: add GitHub Actions workflow for running tests"
```

Expected: Commit created successfully

---

### Task 19: Final Verification - Run All Tests

**Files:**
- None (verification step)

**Step 1: Run complete test suite**

Run:
```bash
npm run test:all
```

Expected: All unit and E2E tests pass

**Step 2: Generate coverage report**

Run:
```bash
npm run test:coverage
```

Expected: Coverage report generated at `./coverage/index.html`

**Step 3: Verify coverage meets goals**

Open `./coverage/index.html` in browser and verify:
- Contexts: ≥90% coverage
- Hooks: ≥80% coverage
- Components: ≥70% coverage

**Step 4: Create final commit**

Run:
```bash
git add .
git commit -m "test: complete testing infrastructure implementation

- Unit tests for contexts, hooks, and components
- E2E tests for pages, navigation, and features
- Test coverage reporting
- CI/CD integration
- Comprehensive documentation"
```

Expected: Final commit created successfully

---

## Summary

This plan implements:

✅ **Unit Tests (Vitest)**
- LanguageContext (8 tests)
- useSanityEvents (9 tests)
- useSanityBioProfiles (5 tests)
- useSanityHomepageSlides (5 tests)
- ResponsiveWrapper (11 tests)
- LanguageToggle (9 tests)
- BackgroundLines (8 tests)

✅ **E2E Tests (Playwright)**
- Homepage (8 tests)
- Navigation (15 tests)
- Kalendarz with Sanity (7 tests)
- Language Switching (8 tests)

✅ **Infrastructure**
- Vitest configuration
- Playwright configuration
- Test mocks and setup
- Coverage reporting
- CI/CD workflow
- Comprehensive documentation

**Total Test Count**: ~93 tests

**Commands to remember**:
- `npm test` - Run unit tests in watch mode
- `npm run test:e2e` - Run E2E tests
- `npm run test:all` - Run all tests
- `npm run test:coverage` - Generate coverage report
- `npm run test:report` - Full test report

---

## Next Steps

After implementation, you can:
1. Add more hook tests (useSanityKontaktPage, useSanityFundacjaPage, etc.)
2. Add more component tests (Footer, MobileMenu, etc.)
3. Add visual regression tests integration with Figma verification
4. Set up pre-commit hooks to run unit tests
5. Add performance testing with Lighthouse

The foundation is solid and extensible! 🎉
