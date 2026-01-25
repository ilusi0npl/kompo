---
title: "feat: High Contrast WCAG 2.1 AA Improvements"
type: feat
date: 2026-01-25
---

# feat: High Contrast WCAG 2.1 AA Improvements

## Overview

Ulepszenie istniejącej implementacji high contrast mode zgodnie z WCAG 2.1 AA oraz dodanie kompleksowych testów E2E pokrywających wszystkie strony aplikacji. Zachowujemy obecne podejście CSS filter, dodając brakujące elementy accessibility.

## Problem Statement / Motivation

Obecna implementacja high contrast:
- **Działa dobrze** - CSS filter + FixedPortal pattern rozwiązuje problem fixed positioning
- **Ma luki WCAG** - brak focus indicators, skip link, focus trap w mobile menu
- **Brak pełnego pokrycia testami** - istniejące testy nie pokrywają wszystkich stron

**Użytkownicy dotknięci:**
- Keyboard-only users (brak widocznego focusa)
- Screen reader users (brak skip link, niekompletne ARIA)
- Users with visual impairments (potencjalne problemy z kontrastem)

## Proposed Solution

### Phase 1: WCAG Fixes

1. **Focus Indicators (WCAG 2.4.7)**
   - Dodać `:focus-visible` style do ContrastToggle, LanguageText
   - Outline: `2px solid #761FE0` z `outline-offset: 2px`
   - W high contrast mode: `#FFBD19` (żółty)

2. **Skip Link (WCAG 2.4.1)**
   - Nowy komponent `SkipLink` w App.jsx
   - Target: `<main id="main-content">` owijający Routes
   - Widoczny tylko na `:focus-visible`

3. **LanguageText asMenuItem fix**
   - Zamienić `<p onClick>` na `<button>` (linie 17-36)
   - Dodać `aria-label`: "Przełącz na English" / "Switch to Polish"

4. **Mobile Menu Accessibility (WCAG 2.4.3)**
   - Zainstalować `focus-trap-react`
   - Focus trap wewnątrz menu
   - Escape zamyka menu
   - Focus wraca do MENU button po zamknięciu
   - Dodać `role="dialog"` + `aria-modal="true"` + `aria-label`

5. **ARIA Improvements**
   - `aria-live="polite"` announcer dla zmiany trybu
   - Lepsze `aria-label` na ContrastToggle (PL/EN)
   - `aria-expanded` na MENU button
   - `aria-current="page"` na aktywnych nav linkach

6. **Mobile Menu Portal CSS**
   - Dodać high contrast filter dla `#mobile-menu-root`

### Phase 2: E2E Tests

Jeden zbiorczy plik: `tests/e2e/accessibility/high-contrast-all-pages.spec.js`

### Phase 3: Color Audit

Automatyczny audit z axe-core w obu trybach.

## Technical Considerations

### Architecture Impacts

- **App.jsx** - dodanie SkipLink + `<main>` wrapper
- **MobileMenu.jsx** - focus-trap-react integration
- **MobileHeader.jsx** - aria-expanded state
- **index.css** - nowe focus styles, mobile-menu-root filter

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.jsx` | SkipLink, `<main>` wrapper |
| `src/components/ContrastToggle/ContrastToggle.jsx` | className dla focus, lepsze aria-label |
| `src/components/LanguageText/LanguageText.jsx` | `<button>` zamiast `<p>`, aria-label |
| `src/components/MobileMenu/MobileMenu.jsx` | focus-trap, escape handler, ARIA |
| `src/components/MobileHeader/MobileHeader.jsx` | aria-expanded |
| `src/index.css` | focus-visible styles, mobile-menu-root filter |
| `package.json` | +focus-trap-react, +@axe-core/playwright |

### New Files

| File | Purpose |
|------|---------|
| `src/components/SkipLink/SkipLink.jsx` | Skip to content link |
| `src/components/AriaLiveAnnouncer/AriaLiveAnnouncer.jsx` | Screen reader announcements |
| `tests/e2e/accessibility/high-contrast-all-pages.spec.js` | Comprehensive E2E tests |

### Performance Implications

- `focus-trap-react`: ~3KB gzipped, minimal runtime overhead
- `@axe-core/playwright`: dev dependency only, no production impact

### Security Considerations

None - accessibility improvements only.

## Acceptance Criteria

### Focus Indicators (WCAG 2.4.7)
- [x] ContrastToggle shows visible focus ring on Tab
- [x] LanguageText shows visible focus ring on Tab
- [x] MobileMenu close button shows focus ring
- [x] Focus ring is yellow (#FFBD19) in high contrast mode
- [x] Focus ring is purple (#761FE0) in normal mode

### Skip Link (WCAG 2.4.1)
- [x] Skip link is first focusable element on every page
- [x] Skip link visible only when focused
- [x] Skip link navigates to `#main-content`
- [x] `<main>` element wraps page content

### Mobile Menu (WCAG 2.4.3)
- [x] Focus trapped inside open menu
- [x] Escape key closes menu
- [x] Focus returns to MENU button on close
- [x] Menu has `role="dialog"` and `aria-modal="true"`
- [x] MENU button has `aria-expanded` reflecting state

### ARIA Improvements
- [x] Contrast toggle change announced via aria-live
- [x] Language toggle change announced via aria-live
- [ ] Active nav links have `aria-current="page"` (deferred - requires route matching)
- [x] LanguageText has descriptive aria-label

### CSS Fixes
- [x] `#mobile-menu-root` receives high contrast filter
- [x] Filter: `contrast(1.5) grayscale(1)`

### E2E Tests
- [x] All 12 pages tested: `/`, `/bio`, `/bio/ensemble`, `/media`, `/media/wideo`, `/kalendarz`, `/archiwalne`, `/wydarzenie/1`, `/repertuar`, `/specialne`, `/fundacja`, `/kontakt`
- [x] Each page tested in both viewports (1440px desktop, 390px mobile)
- [x] Each page tested with high contrast on and off
- [x] Toggle functionality verified on each page
- [x] localStorage persistence verified
- [x] Focus indicator visibility verified

### Color Contrast Audit
- [x] axe-core audit runs for all pages in normal mode
- [x] axe-core audit runs for all pages in high contrast mode
- [x] No critical violations (some minor AAA-level violations logged but AA compliant)

## Success Metrics

- **0 WCAG 2.4.7 violations** (focus visible)
- **0 WCAG 2.4.1 violations** (skip link)
- **0 WCAG 2.4.3 violations** (focus order in mobile menu)
- **100% page coverage** in E2E tests
- **0 axe-core serious/critical violations**

## Dependencies & Risks

### Dependencies
- `focus-trap-react` npm package (MIT license)
- `@axe-core/playwright` dev dependency

### Risks

| Risk | Mitigation |
|------|------------|
| focus-trap-react breaks with scale transform | Test thoroughly on mobile; library handles most cases |
| Skip link interferes with existing navigation | Position absolutely, z-index below header |
| aria-live announcements too verbose | Limit to contrast/language changes only |
| axe-core false positives | Review each violation, configure rules if needed |

## Implementation Order

1. **Focus indicators** (CSS only, lowest risk)
2. **LanguageText fix** (small component change)
3. **Skip link + main wrapper** (App.jsx changes)
4. **Mobile menu ARIA** (role, aria-modal, aria-expanded)
5. **Mobile menu focus trap** (requires npm install)
6. **aria-live announcer** (new component)
7. **CSS for mobile-menu-root** (index.css)
8. **E2E tests** (can parallelize with implementation)
9. **Color audit** (final verification)

## References & Research

### Internal References
- Brainstorm: `docs/brainstorms/2026-01-25-high-contrast-wcag-brainstorm.md`
- ContrastToggle: `src/components/ContrastToggle/ContrastToggle.jsx:42-57`
- LanguageText: `src/components/LanguageText/LanguageText.jsx:17-36`
- MobileMenu: `src/components/MobileMenu/MobileMenu.jsx:12-145`
- MobileHeader: `src/components/MobileHeader/MobileHeader.jsx:88-106`
- High contrast CSS: `src/index.css:344-413`
- Existing focus styles: `src/index.css:248-259`
- Existing tests: `tests/e2e/content-overlap/high-contrast-fixed-elements.spec.js`

### External References
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- focus-trap-react: https://github.com/focus-trap/focus-trap-react
- axe-core Playwright: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright

### Key WCAG Criteria
- 2.4.1 Bypass Blocks (skip link)
- 2.4.3 Focus Order (mobile menu trap)
- 2.4.7 Focus Visible (indicators)
- 1.4.3 Contrast Minimum (color audit)
- 4.1.2 Name, Role, Value (ARIA)
