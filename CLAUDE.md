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
