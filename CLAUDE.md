# CLAUDE.md - React + Figma Development Guide

## Project Overview

DO NOT COMMIT ANYTHING WITHOUT EXPLICIT REQUEST!
DO NOT DEPLOY TO VERCEL WITHOUT EXPLICIT REQUEST!

**Goal**: Pixel-perfect React implementation from Figma designs.

**Philosophy**:
- Design (Figma) is the source of truth
- Every implementation must pass visual verification
- Iterative process: generate → verify → fix → repeat

---

## Tech Stack

- **React 18+** - UI framework
- **React Router v7** - Routing
- **Vite** - Build tool and dev server
- **Tailwind CSS 4.x** - Utility-first styling
- **Sanity CMS v3** - Headless CMS (optional, feature-flagged)

---

## Verification Tools

Two tools for visual verification:

### 1. Sections Verification (Figma → Crop → Compare)

**Best for comparing page sections with Figma.**

```bash
# All sections
make verify-sections SECTIONS_CONFIG=scripts_project/sections-config.json

# Single section
make verify-section SECTION=hero SECTIONS_CONFIG=scripts_project/sections-config.json
```

**How it works:**
1. Fetches full page screenshot from Figma API
2. Crops into sections based on config bounds
3. Screenshots each section from implementation (Playwright)
4. Compares each pair (pixelmatch)
5. Generates HTML report

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

**IMPORTANT:** After each `make verify-section`, ALWAYS provide the user with the HTML report link.

**Script:** `scripts/verify-figma-sections.cjs`

### 2. UIMatch (Single Node Comparison)

**For comparing individual elements (avatars, logos, components).**

```bash
# List available nodes
make verify-list CONFIG=scripts_project/uimatch-config.json

# Verify node
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
| `component/strict` | ≤1% | Components without text (images, icons) |
| `component/dev` | ≤8% | **Default** - full-page with text |

**Output:** `tmp/uimatch-reports/`

**Script:** `scripts/verify-uimatch.cjs`

### Which tool to use?

| Scenario | Tool |
|----------|------|
| Compare sections (hero, footer, about) | `verify-sections` |
| Compare single element | `verify` (UIMatch) |
| Compare avatar/logo | `verify` with `component/strict` |

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
├── verify-uimatch.cjs           # UIMatch single node
└── migrate-*.js                 # CMS migration scripts

scripts_project/                  # Project-specific configs
├── sections-config.json         # Sections bounds for verify-sections
└── uimatch-config.json          # UIMatch nodes config

src/                              # React application
├── components/                   # Shared components
│   ├── ResponsiveWrapper/       # Scale transform wrapper
│   ├── BackgroundLines/         # Decorative lines
│   ├── Footer/                  # Footer component
│   ├── LanguageToggle/          # Language switcher
│   └── ...
├── pages/                        # Page components
│   └── [PageName]/
│       ├── index.jsx            # Uses ResponsiveWrapper
│       ├── Desktop[PageName].jsx # Desktop layout
│       └── Mobile[PageName].jsx  # Mobile layout
├── hooks/                        # Custom React hooks
│   ├── useSanity*.js            # Sanity CMS data fetching
│   ├── useTranslation.js        # i18n hook
│   └── useLanguage.js           # Language context
├── context/                      # React contexts
│   └── LanguageContext.jsx      # Language state management
├── lib/                          # Utilities
│   └── sanity/
│       ├── client.js            # Sanity client config
│       └── queries.js           # GROQ queries
├── translations/                 # i18n translation files
│   ├── index.js                 # Export all translations
│   ├── common.js                # Shared UI texts
│   └── [page].js                # Page-specific texts
└── App.jsx                       # Routes

sanity-studio/                    # Sanity CMS Studio
├── schemaTypes/                  # Content schemas
│   ├── event.ts
│   ├── bioProfile.ts
│   ├── homepageSlide.ts
│   ├── composer.ts
│   ├── photoAlbum.ts
│   ├── media.ts
│   └── ...
└── sanity.config.ts             # Studio configuration

tmp/                              # Temporary files (gitignored)
├── figma-sections/              # verify-sections output
└── uimatch-reports/             # verify output

public/assets/                    # Static assets
└── [feature]/                   # Organized by feature
```

---

## Assets - Download and Verification

### Problem: Incorrect File Extensions

Figma sometimes exports files with wrong extensions (e.g., SVG as `.png`). This causes API errors:
```
API Error: 400 "media_type: Input should be 'image/jpeg', 'image/png', 'image/gif' or 'image/webp'"
```

### ALWAYS check file type before reading

```bash
file public/assets/filename.png
```

If output is `SVG Scalable Vector Graphics image` - file has wrong extension.

### Fix incorrect extensions

```bash
# Change to correct extension
mv public/assets/file.png public/assets/file.svg

# Check all at once
for f in public/assets/*.png; do
  type=$(file -b "$f" | head -c 3)
  if [ "$type" = "SVG" ]; then
    echo "FAKE PNG (actually SVG): $f"
  fi
done
```

### Download assets from Figma

1. **Use `get_design_context`** - returns asset download URLs
2. **Download via curl/wget** with correct extension
3. **Verify type** before use: `file filename.ext`

### Reading image files

| File Type | How to Read |
|-----------|------------|
| PNG/JPG/GIF/WebP (real) | `Read` tool - works |
| SVG | `Read` tool as text - works |
| PNG/JPG (but actually SVG) | **DOESN'T WORK** - fix extension |

### Workflow for new assets

1. Download asset from Figma
2. `file public/assets/new-asset.png` - check real type
3. If type doesn't match extension → change extension
4. Then use in code

---

## Best Practices

### Components must have `data-section`
```jsx
<div data-section="hero" className="...">
  <HeroSection />
</div>
```

### Verification workflow
1. Run `verify-sections` for all sections
2. Check HTML report for each section
3. Fix differences and repeat
4. For elements (logos, avatars) use `verify` with UIMatch

---

## Responsive Design - Scale Transform Approach

### Problem

Pages have fixed width (e.g., 1440px for desktop), causing side margins on smaller screens.

### Solution: Scale Transform

Instead of full responsiveness (rewriting layout), use CSS transform scaling:

- **Desktop**: base width 1440px, scale: `viewportWidth / 1440`
- **Mobile**: base width 390px, scale: `viewportWidth / 390`
- **Breakpoint**: 768px - switch to mobile below this

### File structure

```
src/
├── components/
│   └── ResponsiveWrapper/
│       └── ResponsiveWrapper.jsx    # Scaling wrapper
├── pages/
│   └── [PageName]/
│       ├── index.jsx                # Main - uses ResponsiveWrapper
│       ├── Desktop[PageName].jsx    # Desktop layout
│       └── Mobile[PageName].jsx     # Mobile layout
```

### ResponsiveWrapper - implementation

```jsx
// src/components/ResponsiveWrapper/ResponsiveWrapper.jsx
import { useState, useEffect } from 'react';

const DESKTOP_WIDTH = 1440;  // Adjust per project
const MOBILE_WIDTH = 390;    // Adjust per project
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

### Usage in page

```jsx
// src/pages/[PageName]/index.jsx
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import Desktop[PageName] from './Desktop[PageName]';
import Mobile[PageName] from './Mobile[PageName]';

export default function [PageName]() {
  return (
    <ResponsiveWrapper
      desktopContent={<Desktop[PageName] />}
      mobileContent={<Mobile[PageName] />}
    />
  );
}
```

### Required CSS fix

```css
/* src/index.css */
html, body {
  overflow-x: hidden;
  background-color: #FFFFFF;
}
```

### Implementation workflow

1. **Move current code** to `Desktop[PageName].jsx`
2. **Create `Mobile[PageName].jsx`** based on Figma mobile design
3. **Download mobile assets** to `public/assets/mobile/`
4. **Implement `ResponsiveWrapper`**
5. **Connect in `index.jsx`**
6. **Test** on viewports: 1920px, 1280px, 768px, 390px

### Figma mobile design

Always provide Figma link with mobile design in prompt:
```
Mobile design: https://www.figma.com/design/[fileKey]/[fileName]?node-id=[nodeId]
```

### Testing viewports

```bash
# DevTools → Responsive Mode → select width:
# - 1920px (large desktop)
# - 1280px (laptop)
# - 768px (just before breakpoint)
# - 390px (iPhone 14)
```

### When to use Scale Transform vs Full Responsive?

| Approach | When |
|----------|------|
| **Scale Transform** | Pixel-perfect from Figma, quick implementation |
| **Full Responsive** | SEO-critical, accessibility-first, complex interactions |

**Default: Scale Transform** - maintains pixel-perfect design consistency.

---

## Internationalization (i18n)

### Language System

This project supports **bilingual content (Polish/English)** with two separate strategies:

#### 1. UI Texts - Translation Files

Static UI elements (navigation, buttons, labels) use translation files:

**Structure:**
```
src/translations/
├── index.js          # Export all translations
├── common.js         # Shared: nav, footer, labels, loading, errors
├── [page].js         # Page-specific texts
```

**Pattern:**
```javascript
// src/translations/common.js
export const pl = {
  nav: {
    bio: 'Bio',
    media: 'Media',
    // ...
  },
  loading: {
    events: 'Ładowanie wydarzeń...',
  },
};

export const en = {
  nav: {
    bio: 'Bio',
    media: 'Media',
    // ...
  },
  loading: {
    events: 'Loading events...',
  },
};
```

**Usage in components:**
```javascript
import { useTranslation } from '../../hooks/useTranslation';

function Component() {
  const t = useTranslation();
  return <div>{t.nav.bio}</div>;
}
```

#### 2. Dynamic Content - Sanity CMS Bilingual Fields

Content from CMS uses separate fields for each language:

**Pattern:** `fieldPl` / `fieldEn` in the same document

**Examples:**
- `titlePl` / `titleEn`
- `descriptionPl` / `descriptionEn`
- `performersPl` / `performersEn`

**GROQ queries include both:**
```javascript
export const eventsQuery = `
  *[_type == "event" && defined(publishedAt)] {
    _id,
    titlePl,
    titleEn,
    descriptionPl,
    descriptionEn,
    // ...
  }
`
```

**Hooks transform based on language:**
```javascript
import { useLanguage } from '../context/LanguageContext';

function useSanityEvents() {
  const { language } = useLanguage();

  // Fetch data with both languages
  const data = await client.fetch(eventsQuery);

  // Transform based on current language
  return data.map(event => ({
    title: language === 'pl' ? event.titlePl : event.titleEn,
    description: language === 'pl' ? event.descriptionPl : event.descriptionEn,
    // ...
  }));
}
```

### Language Context

Global language state managed by React Context:

```javascript
// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'pl';
    }
    return 'pl';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pl' ? 'en' : 'pl');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

### Special Cases

**Content that is NOT translated:**
- Composer names (remain in original)
- Musical piece names (remain in original)
- Proper names and locations (may remain in original)

**Migration to bilingual:**
- See `scripts/migrate-*-i18n.js` scripts
- All have duplicate detection - safe to run multiple times
- Use OpenAI API for automatic translation

---

## Sanity CMS Integration

### Overview

**Sanity CMS v3** for content management with feature flag system for gradual rollout.

**Feature Flag**: `VITE_USE_SANITY` (default: `false`)
- When `true`: Content fetched from Sanity CMS
- When `false`: Content from local config files (backward compatible)

### Environment Setup

Required in `.env`:

```bash
# Figma Design Tokens
FIGMA_ACCESS_TOKEN=your-figma-token-here

# Sanity CMS Configuration
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
SANITY_STUDIO_URL=your-studio-url-here
SANITY_AUTH_TOKEN=your-sanity-auth-token-here

# Feature Flag
VITE_USE_SANITY=false  # Set to 'true' to enable Sanity CMS
```

### Sanity Studio

Start Studio locally:

```bash
cd sanity-studio
npm install
npm run dev
```

Studio runs at: `http://localhost:3333`

### Content Schema Pattern

**Document schemas** (multiple instances):
```typescript
// sanity-studio/schemaTypes/event.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'event',
  type: 'document',
  title: 'Event',
  fields: [
    {
      name: 'titlePl',
      type: 'string',
      title: 'Title (Polish)',
      validation: (rule) => rule.required(),
    },
    {
      name: 'titleEn',
      type: 'string',
      title: 'Title (English)',
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    },
    // ...
  ],
});
```

**Singleton schemas** (single instance):
```typescript
// sanity-studio/schemaTypes/kontaktPage.ts
export default defineType({
  name: 'kontaktPage',
  type: 'document',
  title: 'Kontakt Page',
  fields: [
    {
      name: 'email',
      type: 'string',
      title: 'Email',
    },
    // ...
  ],
});
```

### GROQ Queries

All queries centralized in `src/lib/sanity/queries.js`:

```javascript
/**
 * GROQ Syntax Guide:
 * - *[filter] - Query documents with filter
 * - defined(field) - Field exists and is not null
 * - order(field asc/desc) - Sort results
 * - "alias": field.nested->ref - Dereference and alias
 * - [0] - Get first element
 * - $param - Query parameter
 */

// Example: Query with bilingual fields
export const eventsQuery = `
  *[_type == "event" && status == "upcoming" && defined(publishedAt)] | order(date asc) {
    _id,
    titlePl,
    titleEn,
    date,
    performersPl,
    performersEn,
    descriptionPl,
    descriptionEn,
    locationPl,
    locationEn,
    "imageUrl": image.asset->url,
    ticketUrl,
    showTicketButton
  }
`

// Example: Singleton query (first element)
export const kontaktPageQuery = `
  *[_type == "kontaktPage"][0] {
    email,
    backgroundColor,
    lineColor,
    "teamImageUrl": teamImage.asset->url
  }
`
```

### React Hooks Pattern

Custom hooks provide data fetching with language transformation:

```javascript
// src/hooks/useSanityEvents.js
import { useState, useEffect } from 'react';
import { client } from '../lib/sanity/client';
import { eventsQuery } from '../lib/sanity/queries';
import { useLanguage } from '../context/LanguageContext';

export function useSanityEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await client.fetch(eventsQuery);

        // Transform based on current language
        const transformed = data.map(event => ({
          _id: event._id,
          title: language === 'pl' ? event.titlePl : event.titleEn,
          description: language === 'pl' ? event.descriptionPl : event.descriptionEn,
          performers: language === 'pl' ? event.performersPl : event.performersEn,
          location: language === 'pl' ? event.locationPl : event.locationEn,
          date: event.date,
          imageUrl: event.imageUrl,
          // ...
        }));

        setEvents(transformed);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [language]); // Re-fetch when language changes

  return { events, loading, error };
}
```

**Null Safety:** All hooks include comprehensive null/undefined checks:
```javascript
const transformed = data?.map(event => ({
  title: language === 'pl' ? (event.titlePl || '') : (event.titleEn || ''),
  // ...
})) || [];
```

### Component Integration Pattern

All components follow this pattern:

```javascript
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Fetch from Sanity
const { data, loading, error } = useSanityHook();

// Transform to match config structure
const content = USE_SANITY && data
  ? transformData(data)
  : localConfigData;

// Loading state (Sanity only)
if (USE_SANITY && loading) {
  return <LoadingState />;
}

// Error state (Sanity only)
if (USE_SANITY && error) {
  return <ErrorState />;
}

// Normal render
return <Component content={content} />;
```

### Migration Scripts

Pattern for migrating local config to Sanity:

```javascript
// scripts/migrate-[content]-[i18n].js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function migrate() {
  // 1. Fetch existing to avoid duplicates
  const existing = await client.fetch(`*[_type == "typeName"]`);

  // 2. Import local config
  const localData = [...];

  // 3. Create documents
  for (const item of localData) {
    // Check if exists
    const exists = existing.find(e => e.someUniqueField === item.someUniqueField);
    if (exists) {
      console.log(`Skipping duplicate: ${item.name}`);
      continue;
    }

    // Create document
    await client.create({
      _type: 'typeName',
      fieldPl: item.field,
      fieldEn: await translate(item.field), // Optional: auto-translate
      publishedAt: new Date().toISOString(),
      // ...
    });
  }
}

migrate();
```

All migration scripts have:
- **Duplicate detection** - safe to run multiple times
- **Optional translation** - uses OpenAI API for auto-translation
- **Sanity asset upload** - uploads images to Sanity CDN

### Publishing Workflow

1. **Edit content** in Sanity Studio (http://localhost:3333)
2. **Set publishedAt** date to make content live
3. **Content appears** automatically on website (when `VITE_USE_SANITY=true`)

**Note**: Only documents with `publishedAt` field are fetched by queries.

### Deployment

**Production Checklist**:
1. Ensure `SANITY_AUTH_TOKEN` is set in production environment
2. Set `VITE_USE_SANITY=true` in production `.env`
3. Deploy Sanity Studio to hosting (optional: `npx sanity deploy`)
4. Grant Sanity Studio access to content editors
5. Monitor API usage in Sanity dashboard

### Asset Management

All images uploaded to **Sanity CDN**:
- Automatic optimization
- Global CDN distribution
- Image transformations available
- No need to commit images to git

### Troubleshooting

**Issue**: Content not loading
- Check `VITE_USE_SANITY=true` in `.env`
- Verify `SANITY_AUTH_TOKEN` is set
- Check console for errors

**Issue**: Old content showing
- Ensure documents have `publishedAt` field set
- Check query filters in `src/lib/sanity/queries.js`
- Clear browser cache

**Issue**: Build errors
- Run `npm run build` to check for errors
- Verify all hooks imported correctly

---

## Quick Start for New Project

1. **Clone and install:**
   ```bash
   git clone [repo]
   npm install
   ```

2. **Create project config folder:**
   ```bash
   mkdir scripts_project
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   # Fill in FIGMA_ACCESS_TOKEN and other values
   ```

4. **Create verification configs:**
   - `scripts_project/sections-config.json` - Figma file and section bounds
   - `scripts_project/uimatch-config.json` - Individual node configs

5. **Start development:**
   ```bash
   npm run dev
   ```

6. **Run verification:**
   ```bash
   make verify-sections SECTIONS_CONFIG=scripts_project/sections-config.json
   ```

7. **Optional - Setup Sanity CMS:**
   ```bash
   cd sanity-studio
   npm install
   npm run dev
   ```

---

## Project-Specific Details

> **Note:** This section contains project-specific implementation details for Kompopolex.
> For generic patterns, refer to sections above.

See [KOMPOPOLEX.md](./KOMPOPOLEX.md) for:
- Specific Figma design links
- Color schemes and design tokens
- Page-by-page implementation details
- Verification results
- Asset locations
