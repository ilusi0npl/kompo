# High Contrast WCAG Improvements - Brainstorm

**Date:** 2026-01-25
**Status:** Ready for planning

## What We're Building

Ulepszenie istniejącej implementacji high contrast mode zgodnie z WCAG 2.1 AA oraz dodanie kompleksowych testów E2E pokrywających wszystkie strony aplikacji.

### Goals

1. **WCAG 2.1 AA compliance** - focus indicators, skip links, ARIA improvements
2. **Full E2E test coverage** - jeden zbiorczy test dla wszystkich stron
3. **Color contrast audit** - weryfikacja kontrastu w trybie normalnym i high contrast

## Why This Approach

### Current Implementation Analysis

Obecna implementacja używa:
- CSS `filter: contrast(1.5) grayscale(1)` na `#root`, `#lines-root` i `#fixed-root`
- Portal pattern (`FixedPortal`) do obejścia problemu CSS filter + position:fixed
- localStorage do persystencji stanu
- `aria-pressed` na przycisku toggle

### Identified WCAG Gaps

1. **Brak widocznego focus indicator** - przycisk ContrastToggle nie ma stylu `:focus`
2. **Brak skip link** - nie ma możliwości przeskoczenia do głównej treści
3. **Mobile menu portal** - `#mobile-menu-root` może nie otrzymywać filtra high contrast
4. **Focus trap w mobile menu** - brak kontroli focusu w otwartym menu

### Decision: Enhance Existing Filter

Zachowujemy obecne podejście CSS filter (działa dobrze), ale dodajemy brakujące elementy WCAG. Alternatywy rozważone:
- Alternatywny arkusz stylów - zbyt duży refactor
- Tryb hybrydowy - niepotrzebna złożoność

## Key Decisions

### 1. Focus Indicators (WCAG 2.4.7)

**ContrastToggle i LanguageText:**
- Outline: `2px solid currentColor` z `outline-offset: 2px`
- W trybie high contrast: outline w kolorze żółtym (`#FFBD19`)

### 2. Skip Link (WCAG 2.4.1)

- Tekst: "Przejdź do treści" / "Skip to content"
- Widoczny tylko przy focusie (`:focus-visible`)
- Cel: `#main-content` na głównym kontenerze treści

### 3. Mobile Menu Fixes

**CSS fix dla `#mobile-menu-root`:**
```css
body.high-contrast #mobile-menu-root,
body.high-contrast #mobile-menu-root * {
  filter: contrast(1.5) grayscale(1);
}
```

**Focus management:**
- Focus trap wewnątrz otwartego menu
- Focus wraca do hamburger button po zamknięciu
- Escape zamyka menu

### 4. ARIA Improvements

- `aria-live="polite"` na elemencie ogłaszającym zmianę trybu
- Lepsze `aria-label`: "Włącz tryb wysokiego kontrastu" / "Wyłącz tryb wysokiego kontrastu"

### 5. E2E Test Strategy

**Struktura:** Jeden zbiorczy plik `tests/e2e/accessibility/high-contrast-all-pages.spec.js`

**Strony do testowania:**
- `/` (Homepage)
- `/bio`
- `/kalendarz`
- `/repertuar`
- `/archiwalne`
- `/media`
- `/media-wideo`
- `/fundacja`
- `/kontakt`
- `/specjalne`
- `/wydarzenie/:id`

**Test cases per page:**
1. Toggle włącza/wyłącza `high-contrast` class na body
2. Filter aplikowany do `#root`
3. Fixed elements pozostają widoczne
4. ContrastToggle nie jest grayscale (zachowuje żółty kolor)
5. localStorage persystuje stan
6. Focus indicator widoczny na Tab

**Mobile tests (viewport 390px):**
- Mobile menu otwiera się w high contrast
- ContrastToggle w menu działa

### 6. Color Contrast Audit

**Zakres:** Oba tryby - normalny i high contrast

**Co sprawdzić (WCAG 1.4.3):**
- Kontrast tekstu do tła: minimum 4.5:1 (normalny tekst), 3:1 (duży tekst)
- Kontrast elementów UI: minimum 3:1

**Narzędzia:**
- Playwright + axe-core do automatycznego skanowania
- Raport z listą elementów niespełniających wymagań

**Output:**
- Lista problemów z lokalizacją (strona, selektor, aktualny ratio)
- Rekomendacje poprawek kolorów

## Open Questions

1. **Skip link destination** - czy `#main-content` powinien być na `<main>` czy na pierwszym elemencie treści?
2. **Focus trap library** - użyć gotowej (np. focus-trap-react) czy napisać własną?
3. **Wydarzenie page** - który konkretny event ID użyć w testach? Czy mockować?

## Scope

### In Scope

- Focus indicators na interactive elements (ContrastToggle, LanguageText)
- Skip link komponent (globalny)
- Mobile menu focus management
- CSS fix dla `#mobile-menu-root`
- Zbiorczy test E2E dla wszystkich stron (desktop + mobile)
- Audyt kolorów w trybie normalnym i high contrast
- ARIA improvements

### Out of Scope

- Zmiana podejścia z CSS filter na alternatywny arkusz stylów
- Testy unit dla komponentów (tylko E2E)
- Refactor całej architektury high contrast

## Next Steps

1. Run `/workflows:plan` to create implementation plan
2. Resolve open questions during planning phase
3. Implement in order: WCAG fixes → tests → audit
