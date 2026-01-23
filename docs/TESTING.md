# Testing Documentation

## Overview

Kompopolex uses a two-tier testing strategy:
1. **Unit Tests** - Vitest + React Testing Library
2. **E2E Tests** - Playwright

## Running Tests

### Using Make (Recommended)
```bash
# All tests (unit + E2E)
make test-all

# Unit tests (watch mode)
make test

# Unit tests (once)
make test-unit

# E2E tests
make test-e2e

# Coverage report
make test-coverage

# Full comprehensive report
make test-report

# See all available commands
make help
```

### Using NPM Directly

#### All Tests
```bash
npm run test:all
```

#### Unit Tests Only
```bash
# Run in watch mode
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage

# Interactive UI
npm run test:ui
```

#### E2E Tests Only
```bash
# Run all E2E tests
npm run test:e2e

# Interactive UI
npm run test:e2e:ui

# Specific test file
npx playwright test tests/e2e/homepage.spec.js
```

#### Generate Full Test Report
```bash
npm run test:report
```

## Test Structure

```
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
```

## Unit Testing Patterns

### Testing Hooks
```javascript
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
```

### Testing Components
```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('should toggle language', async () => {
  const user = userEvent.setup()
  render(<LanguageToggle />, { wrapper: LanguageProvider })

  const button = screen.getByRole('button')
  await user.click(button)

  expect(screen.getByText('PL')).toBeInTheDocument()
})
```

### Mocking Sanity Client
```javascript
import { mockFetch } from '../../__mocks__/sanity-client'

vi.mock('../../../src/lib/sanity/client', () => ({
  client: { fetch: mockFetch },
}))

// In test
mockFetch.mockResolvedValueOnce(mockData)
```

## E2E Testing Patterns

### Page Navigation
```javascript
test('should navigate to Bio', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /bio/i }).click()
  await expect(page).toHaveURL('/bio')
})
```

### Language Switching
```javascript
test('should switch language', async ({ page }) => {
  await page.goto('/')
  await page.locator('button:has-text("ENG")').click()
  await expect(page.locator('button:has-text("PL")')).toBeVisible()
})
```

### Waiting for Content
```javascript
test('should load events', async ({ page }) => {
  await page.goto('/kalendarz')
  await expect(page.locator('section')).toBeVisible()
  await page.waitForTimeout(1000) // For animations
})
```

## Coverage Goals

- **Contexts**: 100% coverage
- **Hooks**: ≥90% coverage
- **Components**: ≥80% coverage
- **E2E**: All critical user journeys

## Current Coverage

Run `npm run test:coverage` to see current coverage report.

HTML report available at: `./coverage/index.html`

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Pre-commit hook (unit tests only)

## Visual Regression Testing

See [CLAUDE.md](../CLAUDE.md) for Figma-based visual regression testing:
- `make verify-sections` - Compare all sections
- `make verify NODE=x` - UIMatch single element

## Debugging Tests

### Debug Unit Tests
```bash
npm run test:ui
```

### Debug E2E Tests
```bash
npm run test:e2e:ui
```

### Debug Specific Test
```bash
npx vitest run tests/unit/hooks/useSanityEvents.test.jsx --reporter=verbose
```

## Writing New Tests

### Unit Test Template
```javascript
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
```

### E2E Test Template
```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/page')
    await expect(page.locator('selector')).toBeVisible()
  })
})
```

## Best Practices

1. **Test behavior, not implementation** - Test what users see and do
2. **Use semantic queries** - Prefer `getByRole`, `getByText` over `getByTestId`
3. **Avoid testing internals** - Don't test state, test rendered output
4. **Keep tests focused** - One assertion per test when possible
5. **Use descriptive names** - Test names should explain what they verify
6. **Mock external dependencies** - Mock Sanity, localStorage, etc.
7. **Clean up after tests** - Use `beforeEach` and `afterEach` hooks

## Troubleshooting

### Tests timing out
- Increase timeout in test: `{ timeout: 10000 }`
- Check for missing `await` keywords
- Verify mock data is being returned

### Component not rendering
- Check if proper wrapper is provided (LanguageProvider)
- Verify imports are correct
- Check console for React warnings

### E2E tests failing
- Ensure dev server is running
- Check viewport size for mobile tests
- Add `await page.waitForTimeout()` for animations
- Use `--debug` flag to see browser

## Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
