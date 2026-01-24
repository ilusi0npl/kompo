# Content Edge Cases Testing System

## Overview

System testów symulujących różne scenariusze danych z CMS (Sanity) w celu wykrycia problemów z treścią przed produkcją.

## Goals

- Testowanie edge cases bez potrzeby rzeczywistego CMS
- Wykrywanie problemów z długimi tekstami, pustymi danymi, brakującymi polami
- Pokrycie wszystkich stron z dynamiczną treścią
- Dwa poziomy: E2E (Playwright) + Unit (Vitest)

## Architecture

```
tests/
├── e2e/
│   ├── content-edge-cases/
│   │   ├── fixtures/
│   │   │   ├── generators.js      # Data factories
│   │   │   └── scenarios.js       # Predefined edge cases
│   │   ├── bio-edge-cases.spec.js
│   │   ├── kalendarz-edge-cases.spec.js
│   │   ├── media-edge-cases.spec.js
│   │   ├── homepage-edge-cases.spec.js
│   │   └── wydarzenie-edge-cases.spec.js
│   └── helpers/
│       └── sanity-mock-helper.js  # Route interception
│
└── unit/
    └── hooks/
        ├── useSanityBioProfiles.test.js
        ├── useSanityEvents.test.js
        └── ...
```

## Test Scenarios

| Scenario | Description |
|----------|-------------|
| `empty` | No data - empty arrays |
| `minimal` | Single element, short text |
| `extremeLength` | Very long text (10k+ chars) |
| `massiveCount` | Many elements (50-100+) |
| `missingOptional` | Optional fields null/undefined |
| `missingImages` | No image URLs |
| `specialChars` | XSS, Polish chars, whitespace |
| `mixedLanguage` | Missing translations |

## Test Matrix

| Scenario | Bio | Kalendarz | Media | Homepage | Wydarzenie |
|----------|:---:|:---------:|:-----:|:--------:|:----------:|
| Empty state | ✓ | ✓ | ✓ | ✓ | ✓ |
| Minimal data | ✓ | ✓ | ✓ | ✓ | ✓ |
| Extreme length | ✓ | ✓ | ✓ | ✓ | ✓ |
| Massive count | ✓ | ✓ | ✓ | ✓ | - |
| Missing optional | ✓ | ✓ | ✓ | ✓ | ✓ |
| Missing images | ✓ | ✓ | ✓ | ✓ | ✓ |
| Special chars | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mixed language | ✓ | ✓ | ✓ | ✓ | ✓ |
| API error | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mobile viewport | ✓ | ✓ | ✓ | ✓ | ✓ |

## Implementation Files

### 1. generators.js - Data factories

```javascript
export const generators = {
  text: {
    short: (chars = 10) => 'A'.repeat(chars),
    long: (chars = 5000) => 'Lorem ipsum '.repeat(chars / 12).slice(0, chars),
    withNewlines: (lines = 10) => Array(lines).fill('Paragraph.').join('\n\n'),
  },
  event: (overrides = {}) => ({ ...defaults, ...overrides }),
  bioProfile: (overrides = {}) => ({ ...defaults, ...overrides }),
  // ... more generators
  array: (generator, count) => Array.from({ length: count }, generator),
};
```

### 2. scenarios.js - Predefined edge cases

```javascript
export const scenarios = {
  empty: { events: [], bioProfiles: [], slides: [] },
  minimal: { events: [minimalEvent], bioProfiles: [minimalProfile] },
  extremeLength: { events: [longEvent], bioProfiles: [longProfile] },
  massiveCount: { events: array(100), bioProfiles: array(50) },
  // ... more scenarios
};
```

### 3. sanity-mock-helper.js - Route interception

```javascript
export async function mockSanityResponses(page, mockData) {
  await page.route(SANITY_API_PATTERN, async (route) => {
    // Match query to mock data
    // Return appropriate response
  });
}
```

## Commands

```bash
# All E2E edge case tests
npm run test:e2e -- tests/e2e/content-edge-cases/

# Single page
npm run test:e2e -- tests/e2e/content-edge-cases/bio-edge-cases.spec.js

# Unit tests for hooks
npm run test -- tests/unit/hooks/

# All tests
npm run test:all
```

## Expected Test Count

| Type | Count |
|------|-------|
| E2E - Bio | ~15 |
| E2E - Kalendarz | ~15 |
| E2E - Media | ~12 |
| E2E - Homepage | ~10 |
| E2E - Wydarzenie | ~12 |
| Unit - Hooks | ~56 |
| **Total** | ~120 |

## Success Criteria

- All edge case scenarios pass without crashes
- No `undefined` or `null` displayed in UI
- No horizontal scroll on any viewport
- XSS properly escaped
- Polish characters displayed correctly
- Graceful error states on API failures
