# CLAUDE.md

## Project Overview

DO NOT COMMIT ANYTHING WITHOUT EXPLICIT ASKED!

**Cel**: Pixel-perfect implementacja stron React z designów Figma.

**Filozofia**:
- Design (Figma) jest źródłem prawdy
- Każda implementacja musi przejść weryfikację wizualną
- Iteracyjny proces: generuj → weryfikuj → napraw → powtórz

---

## Tech Stack

- **React 18+** - UI framework
- **React Router v7** - Routing
- **Vite** - Build tool and dev server
- **Tailwind CSS 4.x** - Utility-first styling

---

## Verification Tools

Mamy 2 narzędzia do weryfikacji wizualnej:

### 1. Sections Verification (Figma → Crop → Compare)

**Najlepsze do porównywania sekcji strony z Figma.**

```bash
# Wszystkie sekcje
make verify-sections SECTIONS_CONFIG=scripts_project/sections-config.json

# Pojedyncza sekcja
make verify-section SECTION=hero SECTIONS_CONFIG=scripts_project/sections-config.json
```

**Co robi:**
1. Pobiera pełny screenshot strony z Figma API
2. Tnie go na sekcje według bounds w configu
3. Robi screenshot każdej sekcji z implementacji (Playwright)
4. Porównuje każdą parę (pixelmatch)
5. Generuje HTML report

**Config:** `scripts_project/sections-config.json`
```json
{
  "figmaFileKey": "YOUR_FILE_KEY",
  "figmaNodeId": "NODE_ID",
  "pageWidth": 1728,
  "sections": {
    "hero": { "y": 0, "height": 865, "selector": "[data-section='hero']" },
    "about": { "y": 865, "height": 700, "selector": "[data-section='about']" }
  }
}
```

**Output:** `tmp/figma-sections/[timestamp]/report.html`

**WAŻNE:** Po każdym uruchomieniu `make verify-section` ZAWSZE podawaj użytkownikowi link do raportu HTML, np.:
```
file:///home/ilusi0n/repo/kompo/tmp/figma-sections/2025-12-05T18-59-06/report.html
```

**Skrypt:** `scripts/verify-figma-sections.cjs`

### 2. UIMatch (Single Node Comparison)

**Do porównywania pojedynczych elementów (awatary, logo, komponenty).**

```bash
# Lista dostępnych nodes
make verify-list CONFIG=scripts_project/uimatch-config.json

# Weryfikacja node'a
make verify NODE=title CONFIG=scripts_project/uimatch-config.json
make verify NODE=avatar CONFIG=scripts_project/uimatch-config.json
```

**Config:** `scripts_project/uimatch-config.json`
```json
{
  "figmaFileKey": "YOUR_FILE_KEY",
  "defaultProfile": "component/dev",
  "defaultUrl": "http://localhost:5173",
  "outputDir": "tmp/uimatch-reports",
  "nodes": {
    "title": { "id": "50-64", "name": "Page title", "selector": "[data-node-id='50:64']" },
    "avatar": { "id": "2007-220", "name": "Avatar", "selector": "[data-node-id='2007:220']", "profile": "component/strict" }
  },
  "aliases": { "av": "avatar" }
}
```

**UIMatch Profiles:**
| Profile | pixelDiffRatio | Use Case |
|---------|---------------|----------|
| `component/strict` | ≤1% | Komponenty bez tekstu (obrazy, ikony) |
| `component/dev` | ≤8% | **Domyślny** - full-page z tekstem |

**Output:** `tmp/uimatch-reports/`

**Skrypt:** `scripts/verify-uimatch.cjs`

### Kiedy użyć którego narzędzia?

| Scenariusz | Narzędzie |
|------------|-----------|
| Porównanie sekcji (hero, footer, about) | `verify-sections` |
| Porównanie pojedynczego elementu | `verify` (UIMatch) |
| Porównanie awatara/logo | `verify` z `component/strict` |

---

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Dev server (http://localhost:5173/)
npm run build    # Production build
npm run lint     # Check code quality
```

### Makefile
```bash
make help                      # Show all commands
make verify-list CONFIG=...    # List UIMatch nodes
make verify NODE=... CONFIG=.. # UIMatch verification
make verify-sections ...       # Sections verification
make verify-section SECTION=.. # Single section
make screenshot                # Take screenshot
make install-uimatch           # Install dependencies
make clean                     # Clean tmp files
```

---

## Figma Integration

### Requirements
- `FIGMA_ACCESS_TOKEN` in `.env` file
- Figma desktop app running (for MCP tools)

### MCP Tools
- `mcp__figma__get_design_context` - Get design context and code
- `mcp__figma__get_screenshot` - Get design screenshots
- `mcp__figma__get_metadata` - Get structure overview

---

## File Structure

```
scripts/                          # Generic verification scripts
├── verify-figma-sections.cjs    # Sections verification
└── verify-uimatch.cjs           # UIMatch single node

scripts_project/                  # Project-specific configs (create this!)
├── sections-config.json         # Sections bounds for verify-sections
└── uimatch-config.json          # UIMatch nodes config

src/                              # React application
├── components/                   # Shared components
├── pages/                        # Page components
└── App.jsx                       # Routes

tmp/                              # Temporary files (gitignored)
├── figma-sections/              # verify-sections output
└── uimatch-reports/             # verify output

public/assets/                    # Static assets
```

---

## Assets - Pobieranie i Weryfikacja

### Problem: Błędne rozszerzenia plików

Figma czasem eksportuje pliki z błędnym rozszerzeniem (np. SVG jako `.png`). Powoduje to błąd API:
```
API Error: 400 "media_type: Input should be 'image/jpeg', 'image/png', 'image/gif' or 'image/webp'"
```

### PRZED odczytaniem obrazu - ZAWSZE sprawdź typ pliku

```bash
file public/assets/nazwa-pliku.png
```

Jeśli wynik to `SVG Scalable Vector Graphics image` - plik ma błędne rozszerzenie.

### Naprawa błędnych rozszerzeń

```bash
# Zmień rozszerzenie na prawidłowe
mv public/assets/plik.png public/assets/plik.svg

# Lub sprawdź wszystkie naraz
for f in public/assets/*.png; do
  type=$(file -b "$f" | head -c 3)
  if [ "$type" = "SVG" ]; then
    echo "FAKE PNG (actually SVG): $f"
  fi
done
```

### Pobieranie assetów z Figma

1. **Użyj `get_design_context`** - zwraca URL-e do pobrania assetów
2. **Pobierz przez curl/wget** z prawidłowym rozszerzeniem
3. **Zweryfikuj typ** przed użyciem: `file nazwa-pliku.ext`

### Czytanie plików graficznych

| Typ pliku | Jak czytać |
|-----------|-----------|
| PNG/JPG/GIF/WebP (prawdziwe) | `Read` tool - działa |
| SVG | `Read` tool jako tekst - działa |
| PNG/JPG (ale faktycznie SVG) | **NIE DZIAŁA** - napraw rozszerzenie |

### Workflow dla nowych assetów

1. Pobierz asset z Figma
2. `file public/assets/nowy-asset.png` - sprawdź prawdziwy typ
3. Jeśli typ nie zgadza się z rozszerzeniem → zmień rozszerzenie
4. Dopiero wtedy używaj w kodzie

---

## Best Practices

### Komponenty muszą mieć `data-section`
```jsx
<div data-section="hero" className="...">
  <HeroSection />
</div>
```

### Workflow weryfikacji
1. Uruchom `verify-sections` dla wszystkich sekcji
2. Sprawdź HTML report dla każdej sekcji
3. Napraw różnice i powtórz
4. Dla elementów (logo, awatary) użyj `verify` z UIMatch

---

## Responsywność - Scale Transform Approach

### Problem

Strony mają stałą szerokość (np. 1728px dla desktop), przez co pojawiają się paski po bokach na mniejszych ekranach.

### Rozwiązanie: Scale Transform

Zamiast pełnej responsywności (przepisywanie layoutu), używamy skalowania CSS transform:

- **Desktop**: bazowa szerokość 1728px, skaluj: `viewportWidth / 1728`
- **Mobile**: bazowa szerokość 390px, skaluj: `viewportWidth / 390`
- **Breakpoint**: 768px - poniżej przełącz na mobile

### Struktura plików

```
src/
├── components/
│   └── ResponsiveWrapper/
│       └── ResponsiveWrapper.jsx    # Wrapper skalujący
├── pages/
│   └── Homepage/
│       ├── index.jsx                # Główny - używa ResponsiveWrapper
│       ├── DesktopHomepage.jsx      # Layout desktop (1728px)
│       └── MobileHomepage.jsx       # Layout mobile (390px)
```

### ResponsiveWrapper - implementacja

```jsx
// src/components/ResponsiveWrapper/ResponsiveWrapper.jsx
import { useState, useEffect } from 'react';

const DESKTOP_WIDTH = 1728;
const MOBILE_WIDTH = 390;
const BREAKPOINT = 768;

export default function ResponsiveWrapper({
  desktopContent,
  mobileContent,
  desktopHeight = 5000,  // Adjust per project
  mobileHeight = 8000,   // Adjust per project
}) {
  const [viewport, setViewport] = useState({ width: window.innerWidth });

  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewport.width < BREAKPOINT;
  const baseWidth = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const scale = viewport.width / baseWidth;

  return (
    <div style={{
      width: baseWidth,
      transformOrigin: 'top left',
      transform: `scale(${scale})`,
    }}>
      {isMobile ? mobileContent : desktopContent}
    </div>
  );
}
```

### Użycie w stronie

```jsx
// src/pages/Homepage/index.jsx
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopHomepage from './DesktopHomepage';
import MobileHomepage from './MobileHomepage';

export default function Homepage() {
  return (
    <ResponsiveWrapper
      desktopContent={<DesktopHomepage />}
      mobileContent={<MobileHomepage />}
    />
  );
}
```

### CSS fix (wymagane)

```css
/* src/index.css */
html, body {
  overflow-x: hidden;
  background-color: #FFFFFF;
}
```

### Workflow implementacji

1. **Przenieś obecny kod** do `DesktopHomepage.jsx`
2. **Stwórz `MobileHomepage.jsx`** bazując na Figma mobile design
3. **Pobierz assety mobilne** do `public/assets/mobile/`
4. **Zaimplementuj `ResponsiveWrapper`**
5. **Połącz w `index.jsx`**
6. **Przetestuj** na viewportach: 1920px, 1280px, 768px, 390px

### Figma mobile design

Zawsze podawaj link do Figma z mobile designem w prompcie:
```
Mobile design: https://www.figma.com/design/[fileKey]/[fileName]?node-id=[nodeId]
```

### Testowanie viewportów

```bash
# DevTools → Responsive Mode → wybierz szerokość:
# - 1920px (duży desktop)
# - 1280px (laptop)
# - 768px (tuż przed breakpointem)
# - 390px (iPhone 14)
```

### Kiedy używać Scale Transform vs Full Responsive?

| Podejście | Kiedy |
|-----------|-------|
| **Scale Transform** | Pixel-perfect z Figma, szybka implementacja |
| **Full Responsive** | SEO-critical, accessibility-first, złożone interakcje |

**Domyślnie używamy Scale Transform** - zachowuje pixel-perfect zgodność z designem.

---

## Kompopolex - Implementacja Homepage

### Figma Design

| Wersja | Link | Wymiary |
|--------|------|---------|
| Desktop | [node 9-301](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=9-301) | 1440 x 700 px |
| Mobile | [node 71-470](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=71-470) | 390 x 683 px |

### Struktura plików

```
src/
├── components/
│   └── ResponsiveWrapper/
│       └── ResponsiveWrapper.jsx    # Skaluje layout do viewportu
├── pages/
│   └── Homepage/
│       ├── index.jsx                # Główny - używa ResponsiveWrapper
│       ├── DesktopHomepage.jsx      # Layout desktop (1440px)
│       └── MobileHomepage.jsx       # Layout mobile (390px)

public/
├── favicon.svg                      # Favicon (logo Kompopolex)
└── assets/
    ├── logo.svg                     # Logo desktop
    ├── hero-photo.jpg               # Zdjęcie hero desktop (295KB)
    └── mobile/
        ├── logo.svg                 # Logo mobile
        ├── hero-photo.jpg           # Zdjęcie hero mobile (90KB)
        └── trio.svg                 # SVG "Trio" mobile
```

### Konfiguracja responsywności

```jsx
// src/components/ResponsiveWrapper/ResponsiveWrapper.jsx
const DESKTOP_WIDTH = 1440;  // Z Figma desktop
const MOBILE_WIDTH = 390;    // Z Figma mobile
const BREAKPOINT = 768;      // Przełączenie desktop/mobile
```

### Kolory z designu

| Nazwa | Hex | Użycie |
|-------|-----|--------|
| Background | #FDFDFD | Tło strony |
| Text | #131313 | Tekst |
| Lines | #A0E38A | Pionowe linie dekoracyjne |

### Pionowe linie dekoracyjne

**Desktop (1440px):** x = 155, 375, 595, 815, 1035, 1255
**Mobile (390px):** x = 97, 195, 292

### Weryfikacja sekcji

```bash
# Weryfikuj hero desktop
make verify-section SECTION=hero SECTIONS_CONFIG=scripts_project/sections-config.json
```

**Ostatni wynik:** 1.59% diff (PASSED, próg ≤8%)

### Fonty

- **IBM Plex Mono** - wszystkie teksty
- Pliki: `public/fonts/ibm-plex-mono/*.woff2`
- Definicje: `src/index.css` (@font-face)

---

## Kompopolex - Implementacja Bio

### Figma Design

| Wersja | Link | Wymiary |
|--------|------|---------|
| Desktop Bio1 (Ensemble) | [node 9-449](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=9-449) | 1440 x 700 px |
| Desktop Bio2 (Aleksandra) | [node 10-903](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=10-903) | 1440 x 700 px |
| Desktop Bio3 (Rafał) | [node 10-611](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=10-611) | 1440 x 700 px |
| Desktop Bio4 (Jacek) | [node 10-642](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=10-642) | 1440 x 700 px |

### Struktura plików

```
src/pages/Bio/
├── index.jsx           # Główny - używa ResponsiveWrapper
├── DesktopBio.jsx      # Layout desktop (1440px)
├── MobileBio.jsx       # Layout mobile (390px)
├── bio-config.js       # Konfiguracja slajdów Bio

public/assets/bio/
├── bio1-ensemble.jpg   # Zdjęcie Ensemble
├── bio2-aleksandra.jpg # Zdjęcie Aleksandra
├── bio3-rafal.jpg      # Zdjęcie Rafał
├── bio4-jacek.jpg      # Zdjęcie Jacek
└── bio-text.svg        # SVG "Bio." (49x107px)
```

### Kolory slajdów Bio

| Slajd | Background | Line Color | Text |
|-------|-----------|------------|------|
| Bio1 (Ensemble) | #FDFDFD | #A0E38A | #131313 |
| Bio2 (Aleksandra) | #FF734C | #FFBD19 | #131313 |
| Bio3 (Rafał) | #34B898 | #01936F | #131313 |
| Bio4 (Jacek) | #73A1FE | #3478FF | #131313 |

### Pozycjonowanie obrazów (z Figma CSS)

Każdy slajd Bio ma inne pozycjonowanie obrazu w kontenerze 300x460px:

```javascript
// Bio1 - object-cover centered
imageStyle: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }

// Bio2 - Aleksandra
imageStyle: { width: '342.5%', height: '159.57%', left: '0.75%', top: '-28.91%' }

// Bio3 - Rafał
imageStyle: { width: '330.37%', height: '153.91%', left: '-101.18%', top: '-13.7%' }

// Bio4 - Jacek
imageStyle: { width: '301.44%', height: '140.43%', left: '-198.05%', top: '-0.22%' }
```

### Weryfikacja sekcji

```bash
make verify-section SECTION=bio1-ensemble SECTIONS_CONFIG=scripts_project/sections-config.json
make verify-section SECTION=bio2-aleksandra SECTIONS_CONFIG=scripts_project/sections-config.json
make verify-section SECTION=bio3-rafal SECTIONS_CONFIG=scripts_project/sections-config.json
make verify-section SECTION=bio4-jacek SECTIONS_CONFIG=scripts_project/sections-config.json
```

### Ostatnie wyniki weryfikacji

| Sekcja | Diff | Status |
|--------|------|--------|
| bio1-ensemble | 3.77% | ✅ PASSED |
| bio2-aleksandra | 2.86% | ✅ PASSED |
| bio3-rafal | 3.55% | ✅ PASSED |
| bio4-jacek | 5.76% | ✅ PASSED |

### Kluczowe elementy

- **Bio text SVG**: 49x107px, używa `fill={currentData.textColor}` dla dynamicznego koloru
- **Stopka**: tylko na Bio4 (Jacek), pozycja `left: 185px, top: 652px`
- **Nawigacja**: Bio w menu Homepage linkuje do `/bio` przez React Router

---

## Kompopolex - Implementacja Kalendarz

### Figma Design

| Wersja | Link | Wymiary |
|--------|------|---------|
| Desktop | [node 19-49](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=19-49) | 1440 x 2047 px |

### Struktura plików

```
src/pages/Kalendarz/
├── index.jsx              # Główny - używa ResponsiveWrapper
├── DesktopKalendarz.jsx   # Layout desktop (1440px)
├── kalendarz-config.js    # Konfiguracja wydarzeń

public/assets/kalendarz/
├── event1.jpg             # Zdjęcie Ensemble Kompopolex
├── event2.jpg             # Zdjęcie Społeczne Komponowanie
├── event3.jpg             # Zdjęcie Mixtur Festival
└── place-icon.svg         # Ikona lokalizacji
```

### Elementy strony

1. **Pionowe linie dekoracyjne** - x = 155, 375, 595, 815, 1035, 1255 (te same co Homepage)
2. **Logo** - `/assets/logo.svg`, pozycja: left: 185px, top: 60px
3. **"Kalendarz" tekst** - rotacja -90°, pozycja: left: 94px, top: 275px
4. **Nawigacja** - "Nadchodzące" / "Archiwalne" - left: 185px, top: 190px
5. **3 eventy** - każdy z obrazem (330x462px), datą, tytułem, wykonawcami/programem, opisem, lokalizacją
6. **Stopka** - email + social links, wycentrowana na dole
7. **Menu nawigacyjne** - prawa strona, pozycja: left: 1265px, top: 60px

### Wydarzenia

| Event | Tytuł | Data | Lokalizacja |
|-------|-------|------|-------------|
| 1 | ENSEMBLE KOMPOPOLEX | 13.12.25 18:00 | ASP WROCŁAW |
| 2 | SPOŁECZNE KOMPONOWANIE 2025 | 20.12.25 18:00 | Akademia Muzyczna |
| 3 | MIXTUR FESTIVAL | 16.01.26 20:00 | NAU BOSTIK, BARCELONA |

### Weryfikacja sekcji

```bash
make verify-section SECTION=kalendarz SECTIONS_CONFIG=scripts_project/sections-config.json
```

### Ostatnie wyniki weryfikacji

| Sekcja | Diff | Status |
|--------|------|--------|
| kalendarz | 2.82% | ✅ PASSED |

---

## Quick Start for New Project

1. **Create project config folder:**
   ```bash
   mkdir scripts_project
   ```

2. **Create sections-config.json** with your Figma file details

3. **Create uimatch-config.json** with your nodes

4. **Run verification:**
   ```bash
   make verify-sections SECTIONS_CONFIG=scripts_project/sections-config.json
   ```
