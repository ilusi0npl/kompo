---
description: Run full section workflow
---

# Full Section Workflow - Figma to Pixel-Perfect Implementation

## Overview
Kompleksowy workflow do implementacji sekcji z Figma z weryfikacją pixel-perfect.

## Input
- `$ARGUMENTS` - nazwa sekcji do implementacji (np. "hero", "footer", "all")
- Opcjonalnie: Figma URL jeśli różny od domyślnego

## Workflow

### Phase 1: Discovery & Screenshot
1. Pobierz pełny screenshot strony z Figma
2. Zapisz jako `docs/plans/homepage/figma-full.png`
3. Pobierz metadane struktury (węzły, bounds, hierarchia)

### Phase 2: Section Extraction
Dla każdej sekcji (lub wybranej w `$ARGUMENTS`):

```
Sekcje do ekstrakcji:
| Section   | Y-Start | Y-End | Height | Node ID    |
|-----------|---------|-------|--------|------------|
| hero      | 0       | 865   | 865    | 30:294     |
| video     | 865     | 1490  | 625    | 39:692     |
| intro     | 1750    | 2654  | 904    | 30:302     |
| zasady    | 2950    | 4302  | 1352   | 32:477     |
| materialy | 4703    | 5612  | 909    | 39:590     |
| onas      | 5938    | 6804  | 866    | 2009:229   |
| faq       | 7124    | 7896  | 772    | 43:2593    |
| contact   | 8285    | 9082  | 797    | 39:594     |
| footer    | 9082    | 9567  | 485    | 2007:1189  |
```

Dla każdej sekcji:
1. Wytnij screenshot sekcji z pełnego screenshota
2. Zapisz jako `docs/plans/homepage/{section}/screenshot.png`
3. Zidentyfikuj background (kolor, gradient, obraz)
4. Wylistuj wszystkie elementy potomne

### Phase 3: Element Extraction
Dla każdej sekcji, wyeksportuj elementy:

```bash
# Struktura katalogów
docs/plans/homepage/{section}/
├── screenshot.png          # Screenshot całej sekcji
├── background.md           # Opis tła
├── elements/
│   ├── {element-name}.png  # Raster export
│   ├── {element-name}.svg  # Vector export (jeśli możliwe)
│   └── manifest.json       # Lista wszystkich elementów z pozycjami
└── implementation-plan.md  # Plan implementacji
```

**Element Manifest Format:**
```json
{
  "section": "hero",
  "figmaNodeId": "30:294",
  "bounds": { "x": 0, "y": 0, "width": 1728, "height": 865 },
  "background": {
    "type": "shape",
    "color": "#E83F4B",
    "nodeId": "30:294"
  },
  "elements": [
    {
      "name": "fdds-logo",
      "nodeId": "30:291",
      "type": "frame",
      "bounds": { "x": 110, "y": 64, "width": 164, "height": 71 },
      "exportAs": ["svg", "png"]
    }
  ]
}
```

### Phase 4: Background Analysis
Dla każdej sekcji określ:
1. **Solid color** - hex value
2. **Gradient** - type, colors, direction
3. **Image** - asset path
4. **Shape** - SVG wave, union, etc.
5. **Overlay** - jeśli jest nakładka

### Phase 5: Implementation Plan Generation
Wygeneruj `implementation-plan.md` dla sekcji:

```markdown
# {Section} Implementation Plan

## Background
- Type: {solid|gradient|image|shape}
- Value: {color/gradient/path}
- CSS: `background: #E83F4B;` lub `background-image: url(...)`

## Elements (w kolejności z-index)
1. **{element-name}**
   - Node ID: {nodeId}
   - Position: absolute, left: {x}px, top: {y}px
   - Size: {width}px × {height}px
   - Asset: /assets/{filename}.{ext}
   - Notes: {any special handling}

## Typography
| Text | Font | Size | Weight | Color | Position |
|------|------|------|--------|-------|----------|
| ... | ... | ... | ... | ... | ... |

## Components to Create
1. `{SectionName}Section.jsx` - główny komponent
2. `{Element}Component.jsx` - jeśli reużywalny

## Assets Required
- [ ] {asset-1}.svg
- [ ] {asset-2}.png
```

### Phase 6: Code Generation
1. Stwórz komponenty React zgodnie z planem
2. Użyj dokładnych pozycji z Figma
3. Dodaj `data-section` i `data-node-id` atrybuty

### Phase 7: Verification Loop
```bash
# Uruchom weryfikację
make verify-section SECTION={section} SECTIONS_CONFIG=scripts_gadki/sections-config.json URL=http://localhost:5173

# Sprawdź wynik
# Jeśli diff > 5%:
#   1. Przeanalizuj diff.png
#   2. Zidentyfikuj problematyczne elementy
#   3. Porównaj z Figma
#   4. Napraw pozycje/style
#   5. Powtórz weryfikację
# Powtarzaj aż diff ≤ 5%
```

### Phase 8: Iteration Strategy
Jeśli weryfikacja > 5%, sprawdź w kolejności:

1. **Wymiary sekcji** - czy height/width zgadza się z Figma?
2. **Pozycje elementów** - czy left/top dokładne?
3. **Rozmiary elementów** - czy width/height dokładne?
4. **Assety** - czy używasz prawidłowych plików?
5. **Tekst jako SVG** - czy tekst powinien być wektorowy?
6. **Tło** - czy kształt/kolor jest poprawny?

## Execution

Dla sekcji `$ARGUMENTS`:

```
1. GET Figma metadata dla sekcji
2. GET screenshot sekcji z Figma API
3. EXTRACT wszystkie child elements
4. EXPORT elements jako PNG/SVG
5. ANALYZE background
6. GENERATE implementation plan
7. CREATE React components
8. RUN verification
9. IF diff > 5%: ANALYZE diff, FIX, GOTO 8
10. DONE when diff ≤ 5%
```

## Success Criteria
- [ ] Screenshot sekcji zapisany
- [ ] Wszystkie elementy wyeksportowane
- [ ] Background zidentyfikowany
- [ ] Plan implementacji utworzony
- [ ] Komponenty wygenerowane
- [ ] Weryfikacja ≤ 5% pixel diff
