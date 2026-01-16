# Sanity CMS Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate Sanity.io headless CMS to enable non-technical content management while maintaining pixel-perfect Figma implementation.

**Architecture:** Sanity Studio (admin panel) deployed to Vercel → Sanity Content Lake (cloud) → React Frontend fetches via GROQ queries with runtime client-side approach.

**Tech Stack:** Sanity.io v3, @sanity/client v6, React 18, Vite, Vercel

---

## Phase 1: Sanity Studio Setup

### Task 1: Initialize Sanity Project

**Files:**
- Create: `sanity-studio/` (new directory)
- Create: `sanity-studio/package.json`
- Create: `sanity-studio/sanity.config.js`
- Create: `sanity-studio/sanity.cli.js`

**Step 1: Initialize Sanity project**

Run from project root:
```bash
cd /home/ilusi0n/repo/kompo
npm create sanity@latest
```

**Interactive prompts:**
- Project name: `Kompopolex CMS`
- Use default dataset configuration? `Y`
- Project output path: `./sanity-studio`
- Select project template: `Clean project with no predefined schemas`
- Package manager: `npm`

Expected: Creates `sanity-studio/` directory with base files

**Step 2: Verify installation**

Run:
```bash
cd sanity-studio
ls -la
```

Expected output:
```
package.json
sanity.config.js
sanity.cli.js
node_modules/
```

**Step 3: Install required plugins**

Run:
```bash
npm install @sanity/color-input @sanity/vision
```

Expected: Packages installed successfully

**Step 4: Save project ID to .env**

After initialization, Sanity CLI outputs project ID. Run:
```bash
cd ..
echo "VITE_SANITY_PROJECT_ID=<your-project-id>" >> .env
echo "VITE_SANITY_DATASET=production" >> .env
```

Replace `<your-project-id>` with actual ID from Sanity CLI output.

**Step 5: Commit**

```bash
git add sanity-studio/ .env
git commit -m "feat: initialize Sanity Studio project

- Create Sanity Studio with clean template
- Install color-input and vision plugins
- Add Sanity env vars to .env

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Configure Sanity Studio

**Files:**
- Modify: `sanity-studio/sanity.config.js`

**Step 1: Update Sanity config**

Replace content of `sanity-studio/sanity.config.js`:

```javascript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'

export default defineConfig({
  name: 'kompopolex',
  title: 'Kompopolex CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: [],
  },
})
```

**Step 2: Create environment config**

Create file `sanity-studio/.env.local`:

```bash
SANITY_STUDIO_PROJECT_ID=<your-project-id>
SANITY_STUDIO_DATASET=production
```

Replace `<your-project-id>` with actual project ID.

**Step 3: Test Studio locally**

Run:
```bash
cd sanity-studio
npm run dev
```

Expected: Studio starts on http://localhost:3333

**Step 4: Verify Studio loads**

Open browser to http://localhost:3333
Expected: Sanity Studio loads with empty schema message

**Step 5: Stop dev server**

Press Ctrl+C in terminal

**Step 6: Commit**

```bash
git add sanity-studio/sanity.config.js sanity-studio/.env.local
git commit -m "feat: configure Sanity Studio with plugins

- Add structureTool, visionTool, colorInput
- Configure project ID and dataset from env
- Verify Studio runs locally

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Create Event Schema

**Files:**
- Create: `sanity-studio/schemas/event.js`
- Create: `sanity-studio/schemas/index.js`
- Modify: `sanity-studio/sanity.config.js`

**Step 1: Create schemas directory**

Run:
```bash
cd sanity-studio
mkdir schemas
```

**Step 2: Create event schema**

Create `sanity-studio/schemas/event.js`:

```javascript
export default {
  name: 'event',
  title: 'Wydarzenia',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'date',
      title: 'Data i godzina',
      type: 'datetime',
      validation: Rule => Rule.required(),
    },
    {
      name: 'performers',
      title: 'Wykonawcy',
      type: 'text',
      description: 'Opcjonalne - jeśli brak, użyj Program',
    },
    {
      name: 'program',
      title: 'Program',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'composer', type: 'string', title: 'Kompozytor'},
          {name: 'piece', type: 'string', title: 'Utwór'},
        ],
      }],
    },
    {
      name: 'description',
      title: 'Opis',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'location',
      title: 'Lokalizacja',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: Rule => Rule.required(),
    },
    {
      name: 'imageStyle',
      title: 'Styl obrazu (Figma CSS)',
      type: 'object',
      description: 'Pozycjonowanie z Figma - opcjonalne',
      fields: [
        {name: 'objectFit', type: 'string', title: 'Object Fit'},
        {name: 'objectPosition', type: 'string', title: 'Object Position'},
        {name: 'width', type: 'string', title: 'Width'},
        {name: 'height', type: 'string', title: 'Height'},
        {name: 'left', type: 'string', title: 'Left'},
        {name: 'top', type: 'string', title: 'Top'},
      ],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Nadchodzące', value: 'upcoming'},
          {title: 'Archiwalne', value: 'archived'},
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
      initialValue: 'upcoming',
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - event jest opublikowany na stronie',
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
      status: 'status',
    },
    prepare({title, date, media, status}) {
      const dateStr = date ? new Date(date).toLocaleDateString('pl-PL') : 'Brak daty'
      const statusLabel = status === 'upcoming' ? '📅' : '📦'
      return {
        title: `${statusLabel} ${title}`,
        subtitle: dateStr,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Data (najnowsze)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Data (najstarsze)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
}
```

**Step 3: Create schema index**

Create `sanity-studio/schemas/index.js`:

```javascript
import event from './event'

export default [event]
```

**Step 4: Import schemas in config**

Modify `sanity-studio/sanity.config.js`, replace `schema: { types: [] }` with:

```javascript
import schemas from './schemas'

// ... rest of config

schema: {
  types: schemas,
},
```

**Step 5: Test schema in Studio**

Run:
```bash
npm run dev
```

Open http://localhost:3333
Expected: "Wydarzenia" appears in sidebar

**Step 6: Create test event**

In Studio:
1. Click "Wydarzenia"
2. Click "+ Create"
3. Fill required fields (title, date, description, location, upload image)
4. Click "Publish"

Expected: Event saved successfully

**Step 7: Stop dev server**

Press Ctrl+C

**Step 8: Commit**

```bash
git add schemas/
git add sanity.config.js
git commit -m "feat: add Event schema for Wydarzenia

- Create event.js schema with all required fields
- Support for performers and program arrays
- Image with hotspot support
- imageStyle for Figma CSS positioning
- Draft/publish via publishedAt field
- Status: upcoming/archived

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create BioProfile Schema

**Files:**
- Create: `sanity-studio/schemas/bioProfile.js`
- Modify: `sanity-studio/schemas/index.js`

**Step 1: Create bioProfile schema**

Create `sanity-studio/schemas/bioProfile.js`:

```javascript
export default {
  name: 'bioProfile',
  title: 'Profile Bio',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      description: 'Kolejność slajdu (1, 2, 3, 4)',
      validation: Rule => Rule.required().min(1).integer(),
    },
    {
      name: 'backgroundColor',
      title: 'Kolor tła',
      type: 'color',
      validation: Rule => Rule.required(),
    },
    {
      name: 'lineColor',
      title: 'Kolor linii',
      type: 'color',
      validation: Rule => Rule.required(),
    },
    {
      name: 'textColor',
      title: 'Kolor tekstu',
      type: 'color',
      validation: Rule => Rule.required(),
    },
    {
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: Rule => Rule.required(),
    },
    {
      name: 'imageStyle',
      title: 'Styl obrazu (Figma CSS)',
      type: 'object',
      description: 'Pozycjonowanie z Figma - opcjonalne',
      fields: [
        {name: 'width', type: 'string', title: 'Width'},
        {name: 'height', type: 'string', title: 'Height'},
        {name: 'left', type: 'string', title: 'Left'},
        {name: 'top', type: 'string', title: 'Top'},
        {name: 'objectFit', type: 'string', title: 'Object Fit'},
        {name: 'objectPosition', type: 'string', title: 'Object Position'},
      ],
    },
    {
      name: 'paragraphs',
      title: 'Paragrafy',
      type: 'array',
      of: [{type: 'text'}],
      validation: Rule => Rule.required().min(1),
    },
    {
      name: 'paragraphTops',
      title: 'Pozycje Y paragrafów (desktop)',
      type: 'array',
      of: [{type: 'number'}],
      description: 'Pozycje top dla każdego paragrafu w px (np. [260, 420])',
    },
    {
      name: 'hasFooter',
      title: 'Pokaż stopkę',
      type: 'boolean',
      description: 'Tylko ostatni profil (Bio4) ma stopkę',
      initialValue: false,
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - profil jest opublikowany',
    },
  ],
  preview: {
    select: {
      title: 'name',
      order: 'order',
      media: 'image',
    },
    prepare({title, order, media}) {
      return {
        title: `${order}. ${title}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Kolejność',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
}
```

**Step 2: Add to schema index**

Modify `sanity-studio/schemas/index.js`:

```javascript
import event from './event'
import bioProfile from './bioProfile'

export default [event, bioProfile]
```

**Step 3: Test schema in Studio**

Run:
```bash
npm run dev
```

Open http://localhost:3333
Expected: "Profile Bio" appears in sidebar

**Step 4: Create test bio profile**

In Studio:
1. Click "Profile Bio"
2. Click "+ Create"
3. Fill fields (name: "Test", order: 1, colors, upload image, add paragraph)
4. Click "Publish"

Expected: Profile saved successfully

**Step 5: Stop dev server**

Press Ctrl+C

**Step 6: Commit**

```bash
git add schemas/bioProfile.js schemas/index.js
git commit -m "feat: add BioProfile schema

- Create bioProfile.js with order, colors, image
- Support for multiple paragraphs
- paragraphTops for pixel-perfect positioning
- hasFooter flag for Bio4
- Color input for backgroundColor, lineColor, textColor

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Create Media Schema

**Files:**
- Create: `sanity-studio/schemas/media.js`
- Modify: `sanity-studio/schemas/index.js`

**Step 1: Create media schema**

Create `sanity-studio/schemas/media.js`:

```javascript
export default {
  name: 'mediaItem',
  title: 'Media',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Zdjęcie', value: 'photo'},
          {title: 'Wideo', value: 'video'},
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
      initialValue: 'photo',
    },
    {
      name: 'file',
      title: 'Plik',
      type: 'image',
      description: 'Upload zdjęcia',
      hidden: ({parent}) => parent?.type === 'video',
    },
    {
      name: 'videoUrl',
      title: 'URL Wideo (YouTube/Vimeo)',
      type: 'url',
      description: 'Link do wideo na YouTube lub Vimeo',
      hidden: ({parent}) => parent?.type !== 'video',
      validation: Rule => Rule.custom((url, context) => {
        const type = context.parent?.type
        if (type === 'video' && !url) {
          return 'URL wideo jest wymagany'
        }
        return true
      }),
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - media jest opublikowane',
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'file',
    },
    prepare({title, type, media}) {
      const icon = type === 'photo' ? '📷' : '🎥'
      return {
        title: `${icon} ${title}`,
        media,
      }
    },
  },
}
```

**Step 2: Add to schema index**

Modify `sanity-studio/schemas/index.js`:

```javascript
import event from './event'
import bioProfile from './bioProfile'
import media from './media'

export default [event, bioProfile, media]
```

**Step 3: Test schema in Studio**

Run:
```bash
npm run dev
```

Expected: "Media" appears in sidebar

**Step 4: Stop dev server**

Press Ctrl+C

**Step 5: Commit**

```bash
git add schemas/media.js schemas/index.js
git commit -m "feat: add Media schema for future gallery

- Support for photo and video types
- Conditional fields based on type
- Video URL validation for YouTube/Vimeo
- Draft/publish workflow

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Build and Deploy Sanity Studio

**Files:**
- Create: `sanity-studio/vercel.json`

**Step 1: Create Vercel config**

Create `sanity-studio/vercel.json`:

```json
{
  "version": 2,
  "name": "kompopolex-studio",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**Step 2: Add build script**

Verify `sanity-studio/package.json` has build script:

```json
{
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build"
  }
}
```

**Step 3: Build Studio locally**

Run:
```bash
cd sanity-studio
npm run build
```

Expected: Creates `dist/` folder with static build

**Step 4: Test build**

Run:
```bash
npx serve dist -p 3333
```

Open http://localhost:3333
Expected: Studio loads from static build

Press Ctrl+C to stop

**Step 5: Deploy to Vercel**

Run:
```bash
vercel --prod
```

Follow prompts:
- Set up and deploy: Y
- Which scope: (your account)
- Link to existing project: N
- Project name: kompopolex-studio
- Directory: ./
- Override settings: N

Expected: Deployment successful, URL provided

**Step 6: Save deployment URL**

Add to `.env` in root:
```bash
echo "SANITY_STUDIO_URL=<vercel-url>" >> ../.env
```

**Step 7: Configure CORS**

Run from sanity-studio:
```bash
npx sanity cors add <vercel-url>
npx sanity cors add http://localhost:5173
npx sanity cors add http://localhost:3333
```

Expected: CORS origins added

**Step 8: Commit**

```bash
git add vercel.json ../.env
git commit -m "feat: deploy Sanity Studio to Vercel

- Add Vercel config for static build
- Build and deploy Studio to production
- Configure CORS for frontend and local dev

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: Frontend Integration

### Task 7: Install Sanity Client

**Files:**
- Modify: `package.json` (root)

**Step 1: Install dependencies**

Run from project root:
```bash
cd /home/ilusi0n/repo/kompo
npm install @sanity/client @sanity/image-url
```

Expected: Packages installed successfully

**Step 2: Verify installation**

Run:
```bash
npm list @sanity/client @sanity/image-url
```

Expected:
```
├── @sanity/client@6.x.x
└── @sanity/image-url@1.x.x
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install Sanity client dependencies

- Add @sanity/client for data fetching
- Add @sanity/image-url for image URL generation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Create Sanity Client

**Files:**
- Create: `src/lib/sanity/client.js`

**Step 1: Create lib directory**

Run:
```bash
mkdir -p src/lib/sanity
```

**Step 2: Create client file**

Create `src/lib/sanity/client.js`:

```javascript
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Create Sanity client
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for faster reads
})

// Image URL builder helper
const builder = imageUrlBuilder(client)

/**
 * Generate image URL from Sanity image source
 * @param {object} source - Sanity image object
 * @returns {string} - Image URL
 */
export const urlFor = (source) => {
  return builder.image(source)
}
```

**Step 3: Verify .env has required vars**

Check `.env` file contains:
```bash
VITE_SANITY_PROJECT_ID=<your-project-id>
VITE_SANITY_DATASET=production
```

If missing, add them.

**Step 4: Test client import**

Create test file `src/lib/sanity/client.test.js`:

```javascript
import { client, urlFor } from './client.js'

console.log('Client config:', {
  projectId: client.config().projectId,
  dataset: client.config().dataset,
  apiVersion: client.config().apiVersion,
  useCdn: client.config().useCdn,
})

// Test will be removed after verification
```

**Step 5: Run test**

Run:
```bash
node --experimental-modules src/lib/sanity/client.test.js
```

Expected output:
```
Client config: {
  projectId: '<your-id>',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true
}
```

**Step 6: Remove test file**

Run:
```bash
rm src/lib/sanity/client.test.js
```

**Step 7: Commit**

```bash
git add src/lib/sanity/client.js .env
git commit -m "feat: create Sanity client for frontend

- Configure client with projectId and dataset
- Enable CDN for faster reads
- Add urlFor helper for image URLs

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Create GROQ Queries

**Files:**
- Create: `src/lib/sanity/queries.js`

**Step 1: Create queries file**

Create `src/lib/sanity/queries.js`:

```javascript
/**
 * GROQ Queries for Kompopolex CMS
 *
 * GROQ Syntax Guide:
 * - *[filter] - Query documents with filter
 * - defined(field) - Field exists and is not null
 * - order(field asc/desc) - Sort results
 * - "alias": field.nested->ref - Dereference and alias
 * - [0] - Get first element
 * - $param - Query parameter
 */

// Upcoming events (published only, sorted by date ascending)
export const upcomingEventsQuery = `
  *[_type == "event" && status == "upcoming" && defined(publishedAt)] | order(date asc) {
    _id,
    title,
    date,
    performers,
    program,
    description,
    location,
    "imageUrl": image.asset->url,
    imageStyle
  }
`

// Archived events (published only, sorted by date descending)
export const archivedEventsQuery = `
  *[_type == "event" && status == "archived" && defined(publishedAt)] | order(date desc) {
    _id,
    title,
    date,
    performers,
    program,
    description,
    location,
    "imageUrl": image.asset->url,
    imageStyle
  }
`

// All events (for testing, includes drafts)
export const allEventsQuery = `
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    date,
    status,
    publishedAt,
    "imageUrl": image.asset->url
  }
`

// Bio profiles (published only, sorted by order ascending)
export const bioProfilesQuery = `
  *[_type == "bioProfile" && defined(publishedAt)] | order(order asc) {
    _id,
    name,
    order,
    "backgroundColor": backgroundColor.hex,
    "lineColor": lineColor.hex,
    "textColor": textColor.hex,
    "imageUrl": image.asset->url,
    imageStyle,
    paragraphs,
    paragraphTops,
    hasFooter
  }
`

// Single event by ID
export const eventByIdQuery = `
  *[_type == "event" && _id == $id][0] {
    _id,
    title,
    date,
    performers,
    program,
    description,
    location,
    "imageUrl": image.asset->url,
    imageStyle,
    status,
    publishedAt
  }
`

// Media items (published only)
export const mediaItemsQuery = `
  *[_type == "mediaItem" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    type,
    "imageUrl": file.asset->url,
    videoUrl,
    publishedAt
  }
`
```

**Step 2: Test query syntax in Sanity Vision**

Run Studio:
```bash
cd sanity-studio
npm run dev
```

Open http://localhost:3333
1. Click "Vision" tab (plugin icon)
2. Paste `upcomingEventsQuery` (without export const)
3. Click "Fetch"

Expected: Query returns events (or empty array if none published)

**Step 3: Test bio query**

Paste `bioProfilesQuery` in Vision
Expected: Query returns bio profiles with hex colors

**Step 4: Stop Studio**

Press Ctrl+C

**Step 5: Commit**

```bash
git add src/lib/sanity/queries.js
git commit -m "feat: create GROQ queries for CMS data

- upcomingEventsQuery - published upcoming events
- archivedEventsQuery - published archived events
- bioProfilesQuery - published bio profiles with colors
- eventByIdQuery - single event by ID
- mediaItemsQuery - published media items

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: Content Migration - Kalendarz

### Task 10: Migrate Existing Events to Sanity

**Files:**
- Read: `src/pages/Kalendarz/kalendarz-config.js`
- Manual: Sanity Studio (data entry)

**Step 1: Read existing events config**

Run:
```bash
cat src/pages/Kalendarz/kalendarz-config.js
```

Note down all events data.

**Step 2: Start Sanity Studio**

Run:
```bash
cd sanity-studio
npm run dev
```

Open http://localhost:3333

**Step 3: Import Event 1 - Ensemble Kompopolex**

In Studio:
1. Click "Wydarzenia" → "+ Create"
2. Fill fields:
   - Tytuł: `ENSEMBLE KOMPOPOLEX`
   - Data: `2025-12-13T18:00:00`
   - Wykonawcy: `Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski`
   - Opis: (copy from config)
   - Lokalizacja: `ASP WROCŁAW, PL. POLSKI 3/4`
   - Zdjęcie: Upload from `public/assets/kalendarz/event1.jpg`
   - imageStyle → objectFit: `cover`
   - imageStyle → objectPosition: `50% 50%`
   - Status: `Nadchodzące`
   - Data publikacji: (current date/time)
3. Click "Publish"

Expected: Event created successfully

**Step 4: Import Event 2 - Społeczne Komponowanie**

Repeat for Event 2:
- Tytuł: `SPOŁECZNE KOMPONOWANIE 2025`
- Data: `2025-12-20T18:00:00`
- Wykonawcy: `Julia Łabowska, Karolina Kułaga, Oleś Kulczewicz, Szymon Kępczyński, Tymoteusz Lasik`
- Lokalizacja: `Akademia Muzyczna im. K. Lipińskiego\nwe Wrocławiu`
- Zdjęcie: Upload `public/assets/kalendarz/event2.jpg`
- imageStyle: (copy from config - position absolute, width 209.97%, etc.)
- Status: `Nadchodzące`
- Publish

**Step 5: Import Event 3 - Mixtur Festival**

Repeat for Event 3:
- Tytuł: `MIXTUR FESTIVAL`
- Data: `2026-01-16T20:00:00`
- Wykonawcy: (leave empty)
- Program: Add 6 items from config
- Lokalizacja: `Nau Bostik, Barcelona`
- Zdjęcie: Upload `public/assets/kalendarz/event3.jpg`
- imageStyle: objectFit cover, 50% 50%
- Status: `Nadchodzące`
- Publish

**Step 6: Verify in Vision**

Click Vision tab, run:
```groq
*[_type == "event" && defined(publishedAt)] | order(date asc) {
  title,
  date,
  status
}
```

Expected: All 3 events returned

**Step 7: Stop Studio**

Press Ctrl+C

**Step 8: Document migration**

Create file `docs/cms-migration-log.md`:

```markdown
# CMS Migration Log

## 2026-01-16 - Initial Event Migration

**Status**: Completed

**Events migrated:**
1. ENSEMBLE KOMPOPOLEX (13.12.25)
2. SPOŁECZNE KOMPONOWANIE 2025 (20.12.25)
3. MIXTUR FESTIVAL (16.01.26)

**Notes:**
- All images uploaded successfully
- imageStyle preserved from config
- Event 3 uses program array (not performers)
- All published and verified in Sanity Vision
```

**Step 9: Commit**

```bash
git add docs/cms-migration-log.md
git commit -m "docs: migrate existing events to Sanity CMS

- Import 3 events from kalendarz-config.js
- Upload images and configure imageStyle
- Verify all published and queryable

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Add Feature Flag to Environment

**Files:**
- Modify: `.env`
- Create: `.env.example`

**Step 1: Add feature flag to .env**

Run:
```bash
echo "VITE_USE_SANITY=false" >> .env
```

**Step 2: Create .env.example**

Create `.env.example`:

```bash
# Sanity CMS
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production

# Feature flag for gradual CMS migration
VITE_USE_SANITY=false

# Figma
FIGMA_ACCESS_TOKEN=your-token-here
```

**Step 3: Verify .env is gitignored**

Run:
```bash
cat .gitignore | grep .env
```

Expected: `.env` is in gitignore

**Step 4: Commit**

```bash
git add .env.example
git commit -m "feat: add feature flag for Sanity migration

- VITE_USE_SANITY controls data source
- Start with false (use hardcoded configs)
- Will enable per page during migration
- Add .env.example for documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Create Sanity Hook for Kalendarz

**Files:**
- Create: `src/hooks/useSanityEvents.js`

**Step 1: Create hooks directory**

Run:
```bash
mkdir -p src/hooks
```

**Step 2: Create useSanityEvents hook**

Create `src/hooks/useSanityEvents.js`:

```javascript
import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { upcomingEventsQuery, archivedEventsQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch events from Sanity CMS
 * @param {string} status - 'upcoming' or 'archived'
 * @returns {object} - { events, loading, error }
 */
export function useSanityEvents(status = 'upcoming') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const query = status === 'upcoming' ? upcomingEventsQuery : archivedEventsQuery

    client
      .fetch(query)
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch events:', err)
        setError(err)
        setLoading(false)
      })
  }, [status])

  return { events, loading, error }
}
```

**Step 3: Create test component**

Create `src/hooks/useSanityEvents.test.jsx`:

```javascript
import { useSanityEvents } from './useSanityEvents'

function TestComponent() {
  const { events, loading, error } = useSanityEvents('upcoming')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Events: {events.length}</h1>
      {events.map(event => (
        <div key={event._id}>
          <h2>{event.title}</h2>
          <p>{new Date(event.date).toLocaleDateString('pl-PL')}</p>
        </div>
      ))}
    </div>
  )
}

export default TestComponent
```

**Step 4: Test hook**

Add to `src/App.jsx` temporarily:

```javascript
import TestComponent from './hooks/useSanityEvents.test'

// In routes, add:
<Route path="/test-sanity" element={<TestComponent />} />
```

**Step 5: Run dev server**

Run:
```bash
npm run dev
```

Open http://localhost:5173/test-sanity

Expected: Shows 3 events with titles and dates

**Step 6: Remove test code**

Remove TestComponent import and route from App.jsx
Delete `src/hooks/useSanityEvents.test.jsx`

**Step 7: Stop dev server**

Press Ctrl+C

**Step 8: Commit**

```bash
git add src/hooks/useSanityEvents.js
git commit -m "feat: create useSanityEvents hook

- Fetch events from Sanity based on status
- Handle loading and error states
- Return events array for component use
- Tested with 3 migrated events

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Integrate Sanity into DesktopKalendarz

**Files:**
- Modify: `src/pages/Kalendarz/DesktopKalendarz.jsx`
- Read: `src/pages/Kalendarz/kalendarz-config.js`

**Step 1: Read current DesktopKalendarz**

Run:
```bash
head -50 src/pages/Kalendarz/DesktopKalendarz.jsx
```

Note the current structure.

**Step 2: Backup current config import**

At top of `src/pages/Kalendarz/DesktopKalendarz.jsx`, modify imports:

```javascript
import { useState, useEffect } from 'react';
import { useSanityEvents } from '../../hooks/useSanityEvents';
// Keep old import for fallback
import { events as configEvents } from './kalendarz-config';
```

**Step 3: Add feature flag logic**

After imports, add:

```javascript
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function DesktopKalendarz() {
  // Sanity data
  const { events: sanityEvents, loading, error } = useSanityEvents('upcoming');

  // Use Sanity data if enabled, otherwise use config
  const events = USE_SANITY ? sanityEvents : configEvents;

  // Show loading state only when using Sanity
  if (USE_SANITY && loading) {
    return (
      <div className="relative" style={{width: '1440px', height: '2008px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: '18px', fontFamily: 'IBM Plex Mono'}}>Ładowanie wydarzeń...</div>
      </div>
    );
  }

  // Show error state only when using Sanity
  if (USE_SANITY && error) {
    return (
      <div className="relative" style={{width: '1440px', height: '2008px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: '18px', fontFamily: 'IBM Plex Mono', color: '#FF0000'}}>
          Błąd ładowania wydarzeń. Spróbuj ponownie później.
        </div>
      </div>
    );
  }

  // Rest of component stays the same...
```

**Step 4: Update date formatting**

Find where date is displayed, update to handle datetime:

```javascript
// Old: {event.date}
// New:
{new Date(event.date).toLocaleDateString('pl-PL', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).replace(',', ' |')}
```

**Step 5: Test with feature flag OFF**

Ensure `.env` has `VITE_USE_SANITY=false`

Run:
```bash
npm run dev
```

Open http://localhost:5173/kalendarz

Expected: Shows events from kalendarz-config.js (old data)

**Step 6: Test with feature flag ON**

Update `.env`:
```bash
VITE_USE_SANITY=true
```

Restart dev server (Ctrl+C, then `npm run dev`)

Open http://localhost:5173/kalendarz

Expected: Shows events from Sanity (should be same 3 events)

**Step 7: Stop dev server**

Press Ctrl+C

**Step 8: Set flag back to false**

Update `.env`:
```bash
VITE_USE_SANITY=false
```

**Step 9: Commit**

```bash
git add src/pages/Kalendarz/DesktopKalendarz.jsx
git commit -m "feat: integrate Sanity into DesktopKalendarz with feature flag

- Add useSanityEvents hook
- Implement feature flag VITE_USE_SANITY
- Fallback to config when flag is false
- Add loading and error states
- Update date formatting for datetime

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 14: Visual Verification - Kalendarz

**Files:**
- Run: Visual verification script

**Step 1: Enable Sanity**

Update `.env`:
```bash
VITE_USE_SANITY=true
```

**Step 2: Start dev server**

Run:
```bash
npm run dev
```

**Step 3: Run visual verification**

In new terminal:
```bash
make verify-section SECTION=kalendarz SECTIONS_CONFIG=scripts_project/sections-config.json
```

**Step 4: Check report**

Expected output includes:
```
✓ Pixel difference: X.XX% (threshold: 8%)
PASSED
```

Open HTML report (path shown in output).

**Step 5: Analyze differences**

If diff > 8%:
- Check date formatting matches exactly
- Verify imageUrl resolves correctly
- Check imageStyle object is applied
- Debug and fix, then re-verify

If diff ≤ 8%: PASS

**Step 6: Document results**

Update `docs/cms-migration-log.md`:

```markdown
## 2026-01-16 - Kalendarz Visual Verification

**Status**: PASSED

**Pixel diff**: X.XX% (threshold: 8%)

**Notes:**
- Sanity data matches hardcoded config
- Images load correctly from Sanity CDN
- Date formatting preserves original style
- No visual regressions detected
```

**Step 7: Stop dev server**

Press Ctrl+C

**Step 8: Keep Sanity enabled**

Leave `.env` with `VITE_USE_SANITY=true` for Kalendarz

**Step 9: Commit**

```bash
git add docs/cms-migration-log.md
git commit -m "test: visual verification for Kalendarz with Sanity

- Run pixel diff comparison
- Verify <8% threshold
- Document results in migration log

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: Content Migration - Bio

### Task 15: Migrate Bio Profiles to Sanity

**Files:**
- Read: `src/pages/Bio/bio-config.js`
- Manual: Sanity Studio (data entry)

**Step 1: Start Sanity Studio**

Run:
```bash
cd sanity-studio
npm run dev
```

**Step 2: Import Bio1 - Ensemble**

In Studio:
1. Click "Profile Bio" → "+ Create"
2. Fill fields:
   - Nazwa: `Ensemble KOMPOPOLEX`
   - Kolejność: `1`
   - Kolor tła: `#FDFDFD`
   - Kolor linii: `#A0E38A`
   - Kolor tekstu: `#131313`
   - Zdjęcie: Upload `public/assets/bio/bio1-ensemble.jpg`
   - imageStyle → width: `100%`
   - imageStyle → height: `100%`
   - imageStyle → objectFit: `cover`
   - imageStyle → objectPosition: `50% 50%`
   - Paragrafy: Add 2 paragraphs (copy from bio-config.js)
   - Pozycje Y paragrafów: `[260, 420]`
   - Pokaż stopkę: `false`
   - Data publikacji: (current date/time)
3. Click "Publish"

**Step 3: Import Bio2 - Aleksandra**

Repeat with data from bio-config:
- Nazwa: `Aleksandra Gołaj`
- Kolejność: `2`
- Colors: `#FF734C`, `#FFBD19`, `#131313`
- imageStyle: position absolute, width 342.5%, height 159.57%, left 0.75%, top -28.91%
- Paragrafy: 2 paragraphs
- paragraphTops: `[260, 446]`
- Publish

**Step 4: Import Bio3 - Rafał**

- Nazwa: `Rafał Łuc`
- Kolejność: `3`
- Colors: `#34B898`, `#01936F`, `#131313`
- imageStyle: width 330.37%, height 153.91%, left -101.18%, top -13.7%
- Paragrafy: 3 paragraphs
- paragraphTops: `[260, 444, 556]`
- Publish

**Step 5: Import Bio4 - Jacek**

- Nazwa: `Jacek Sotomski`
- Kolejność: `4`
- Colors: `#73A1FE`, `#3478FF`, `#131313`
- imageStyle: width 301.44%, height 140.43%, left -198.05%, top -0.22%
- Paragrafy: 2 paragraphs
- paragraphTops: `[256, 416]`
- Pokaż stopkę: `true` ← IMPORTANT
- Publish

**Step 6: Verify in Vision**

Run query:
```groq
*[_type == "bioProfile" && defined(publishedAt)] | order(order asc) {
  name,
  order,
  hasFooter
}
```

Expected: 4 profiles in order, Bio4 has hasFooter: true

**Step 7: Stop Studio**

Press Ctrl+C

**Step 8: Update migration log**

Update `docs/cms-migration-log.md`:

```markdown
## 2026-01-16 - Bio Profiles Migration

**Status**: Completed

**Profiles migrated:**
1. Ensemble KOMPOPOLEX (order: 1)
2. Aleksandra Gołaj (order: 2)
3. Rafał Łuc (order: 3)
4. Jacek Sotomski (order: 4, hasFooter: true)

**Notes:**
- All images and imageStyle preserved
- Colors migrated as hex values
- paragraphTops arrays for pixel-perfect positioning
- Only Bio4 has footer enabled
```

**Step 9: Commit**

```bash
git add docs/cms-migration-log.md
git commit -m "docs: migrate bio profiles to Sanity CMS

- Import 4 bio profiles with all data
- Preserve imageStyle positioning
- Configure colors and paragraph positions
- Enable footer for Bio4 only

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 16: Create useSanityBioProfiles Hook

**Files:**
- Create: `src/hooks/useSanityBioProfiles.js`

**Step 1: Create hook**

Create `src/hooks/useSanityBioProfiles.js`:

```javascript
import { useState, useEffect } from 'react'
import { client } from '../lib/sanity/client'
import { bioProfilesQuery } from '../lib/sanity/queries'

/**
 * Hook to fetch bio profiles from Sanity CMS
 * @returns {object} - { profiles, loading, error }
 */
export function useSanityBioProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(bioProfilesQuery)
      .then(data => {
        setProfiles(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch bio profiles:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { profiles, loading, error }
}
```

**Step 2: Commit**

```bash
git add src/hooks/useSanityBioProfiles.js
git commit -m "feat: create useSanityBioProfiles hook

- Fetch bio profiles from Sanity
- Handle loading and error states
- Return ordered profiles array

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 17: Integrate Sanity into DesktopBio

**Files:**
- Modify: `src/pages/Bio/DesktopBio.jsx`

**Step 1: Read current DesktopBio structure**

Run:
```bash
head -50 src/pages/Bio/DesktopBio.jsx
```

**Step 2: Add Sanity integration**

Update imports in `src/pages/Bio/DesktopBio.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { useSanityBioProfiles } from '../../hooks/useSanityBioProfiles';
import { desktopBioSlides } from './bio-config';
```

**Step 3: Add feature flag logic**

After imports:

```javascript
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

export default function DesktopBio() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sanity data
  const { profiles: sanityProfiles, loading, error } = useSanityBioProfiles();

  // Transform Sanity data to match component structure
  const sanitySlides = sanityProfiles.map(profile => ({
    id: `bio${profile.order}`,
    backgroundColor: profile.backgroundColor,
    name: profile.name,
    lineColor: profile.lineColor,
    textColor: profile.textColor,
    image: profile.imageUrl,
    imageStyle: profile.imageStyle || {},
    logoSrc: '/assets/logo.svg',
    paragraphs: profile.paragraphs,
    paragraphTops: profile.paragraphTops || [],
    hasFooter: profile.hasFooter,
    height: profile.hasFooter ? 850 : 700,
  }));

  // Use Sanity data if enabled, otherwise use config
  const slides = USE_SANITY ? sanitySlides : desktopBioSlides;

  // Loading state
  if (USE_SANITY && loading) {
    return (
      <div className="relative" style={{width: '1440px', height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDFDFD'}}>
        <div style={{fontSize: '18px', fontFamily: 'IBM Plex Mono'}}>Ładowanie profili...</div>
      </div>
    );
  }

  // Error state
  if (USE_SANITY && error) {
    return (
      <div className="relative" style={{width: '1440px', height: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDFDFD'}}>
        <div style={{fontSize: '18px', fontFamily: 'IBM Plex Mono', color: '#FF0000'}}>
          Błąd ładowania profili.
        </div>
      </div>
    );
  }

  // Rest of component uses `slides` variable...
  const currentData = slides[currentIndex];

  // ... rest of component
```

**Step 4: Test with flag OFF**

Ensure `.env` has `VITE_USE_SANITY=false`

Run:
```bash
npm run dev
```

Open http://localhost:5173/bio

Expected: Shows bio from config

**Step 5: Test with flag ON**

Update `.env`:
```bash
VITE_USE_SANITY=true
```

Restart dev server

Open http://localhost:5173/bio

Expected: Shows bio from Sanity, navigate through all 4 slides

**Step 6: Verify colors**

Check each slide:
- Bio1: White background (#FDFDFD), green lines
- Bio2: Orange background (#FF734C), yellow lines
- Bio3: Teal background (#34B898), dark teal lines
- Bio4: Blue background (#73A1FE), dark blue lines, footer visible

**Step 7: Stop dev server**

Press Ctrl+C

**Step 8: Commit**

```bash
git add src/pages/Bio/DesktopBio.jsx
git commit -m "feat: integrate Sanity into DesktopBio with feature flag

- Add useSanityBioProfiles hook
- Transform Sanity data to component structure
- Implement feature flag with fallback
- Add loading and error states
- Preserve all styling and colors

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 18: Visual Verification - Bio Profiles

**Files:**
- Run: Visual verification for all bio sections

**Step 1: Enable Sanity**

Ensure `.env` has:
```bash
VITE_USE_SANITY=true
```

**Step 2: Start dev server**

Run:
```bash
npm run dev
```

**Step 3: Verify Bio1**

Run:
```bash
make verify-section SECTION=bio1-ensemble SECTIONS_CONFIG=scripts_project/sections-config.json
```

Expected: Diff ≤ 8%

**Step 4: Verify Bio2**

Run:
```bash
make verify-section SECTION=bio2-aleksandra SECTIONS_CONFIG=scripts_project/sections-config.json
```

Expected: Diff ≤ 8%

**Step 5: Verify Bio3**

Run:
```bash
make verify-section SECTION=bio3-rafal SECTIONS_CONFIG=scripts_project/sections-config.json
```

Expected: Diff ≤ 8%

**Step 6: Verify Bio4**

Run:
```bash
make verify-section SECTION=bio4-jacek SECTIONS_CONFIG=scripts_project/sections-config.json
```

Expected: Diff ≤ 8%

**Step 7: Document results**

Update `docs/cms-migration-log.md`:

```markdown
## 2026-01-16 - Bio Visual Verification

**Status**: PASSED

**Results:**
- Bio1 (Ensemble): X.XX% diff ✓
- Bio2 (Aleksandra): X.XX% diff ✓
- Bio3 (Rafał): X.XX% diff ✓
- Bio4 (Jacek): X.XX% diff ✓

**Notes:**
- All colors render correctly from hex values
- Image positioning preserved via imageStyle
- Paragraph positioning matches via paragraphTops
- Footer only on Bio4 as expected
```

**Step 8: Stop dev server**

Press Ctrl+C

**Step 9: Commit**

```bash
git add docs/cms-migration-log.md
git commit -m "test: visual verification for Bio profiles with Sanity

- Verify all 4 bio slides
- All pass <8% pixel diff threshold
- Colors, images, paragraphs render correctly

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: Cleanup and Finalization

### Task 19: Remove Feature Flag and Old Configs

**Files:**
- Modify: `src/pages/Kalendarz/DesktopKalendarz.jsx`
- Modify: `src/pages/Bio/DesktopBio.jsx`
- Move: `src/pages/Kalendarz/kalendarz-config.js`
- Move: `src/pages/Bio/bio-config.js`
- Modify: `.env`

**Step 1: Remove feature flag from Kalendarz**

Edit `src/pages/Kalendarz/DesktopKalendarz.jsx`:

Remove:
```javascript
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';
import { events as configEvents } from './kalendarz-config';
```

Simplify to always use Sanity:
```javascript
import { useSanityEvents } from '../../hooks/useSanityEvents';

export default function DesktopKalendarz() {
  const { events, loading, error } = useSanityEvents('upcoming');

  if (loading) {
    // loading UI
  }

  if (error) {
    // error UI
  }

  // Rest of component uses `events` from Sanity
```

**Step 2: Remove feature flag from Bio**

Edit `src/pages/Bio/DesktopBio.jsx`:

Remove feature flag logic, always use Sanity:
```javascript
import { useSanityBioProfiles } from '../../hooks/useSanityBioProfiles';

export default function DesktopBio() {
  const { profiles: sanityProfiles, loading, error } = useSanityBioProfiles();

  const slides = sanityProfiles.map(profile => ({
    // transform
  }));

  // Rest uses slides from Sanity
```

**Step 3: Move old configs to backup**

Run:
```bash
mv src/pages/Kalendarz/kalendarz-config.js scripts_project/kalendarz-config.js.bak
mv src/pages/Bio/bio-config.js scripts_project/bio-config.js.bak
```

**Step 4: Remove feature flag from .env**

Remove line from `.env`:
```bash
VITE_USE_SANITY=true
```

**Step 5: Update .env.example**

Edit `.env.example`, remove:
```bash
# Feature flag (for gradual migration)
VITE_USE_SANITY=false
```

**Step 6: Test pages**

Run:
```bash
npm run dev
```

Open:
- http://localhost:5173/kalendarz - should work
- http://localhost:5173/bio - should work

Both should use Sanity data only.

**Step 7: Stop dev server**

Press Ctrl+C

**Step 8: Commit**

```bash
git add src/pages/Kalendarz/DesktopKalendarz.jsx src/pages/Bio/DesktopBio.jsx scripts_project/*.bak .env .env.example
git commit -m "refactor: remove feature flag and finalize Sanity migration

- Remove VITE_USE_SANITY feature flag
- Always use Sanity for Kalendarz and Bio
- Move old config files to scripts_project/*.bak
- Simplify component logic

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 20: Update Documentation

**Files:**
- Modify: `CLAUDE.md`
- Create: `docs/sanity-cms-guide.md`

**Step 1: Update CLAUDE.md**

Add section to `CLAUDE.md` after "Assets" section:

```markdown
---

## CMS - Sanity Integration

### Overview

Content (events, bio profiles) is managed via **Sanity.io** headless CMS.

- **Sanity Studio**: https://studio.kompopolex.pl (admin panel)
- **Dataset**: production (cloud-hosted)
- **Client**: Runtime fetch via @sanity/client

### Content Types

| Type | Schema | Usage |
|------|--------|-------|
| `event` | Wydarzenia | Kalendarz page (upcoming/archived) |
| `bioProfile` | Profile Bio | Bio page (4 profiles) |
| `mediaItem` | Media | Future gallery use |

### Data Flow

```
Sanity Studio → Publish → Sanity Cloud → GROQ API → React Frontend
```

**Frontend integration:**
- `src/lib/sanity/client.js` - Sanity client config
- `src/lib/sanity/queries.js` - GROQ queries
- `src/hooks/useSanityEvents.js` - Events hook
- `src/hooks/useSanityBioProfiles.js` - Bio hook

### Adding New Event

1. Open Sanity Studio
2. Navigate to "Wydarzenia"
3. Click "+ Create"
4. Fill required fields (title, date, description, location, image)
5. Upload image, adjust hotspot if needed
6. Set imageStyle if custom positioning needed (from Figma)
7. Set Status: "Nadchodzące" or "Archiwalne"
8. **Save as draft** OR **Publish** (fill Data publikacji)

**Draft vs Published:**
- Draft: `publishedAt` empty → NOT visible on website
- Published: `publishedAt` filled → visible on website

### Editing Bio Profile

1. Open Sanity Studio
2. Navigate to "Profile Bio"
3. Click on profile to edit
4. Update fields (text, colors, image)
5. Preserve `order` field (determines slide order)
6. Publish changes

### Environment Variables

```bash
VITE_SANITY_PROJECT_ID=<project-id>
VITE_SANITY_DATASET=production
```

### Useful Commands

```bash
# Start Studio locally
cd sanity-studio
npm run dev  # http://localhost:3333

# Deploy Studio to Vercel
npm run build
vercel --prod

# Export dataset (backup)
cd sanity-studio
npx sanity dataset export production backup.tar.gz

# Test GROQ queries
# Use Vision plugin in Studio (localhost:3333)
```

### GROQ Query Examples

**Get upcoming events:**
```groq
*[_type == "event" && status == "upcoming" && defined(publishedAt)] | order(date asc) {
  title,
  date,
  "imageUrl": image.asset->url
}
```

**Get bio profiles:**
```groq
*[_type == "bioProfile" && defined(publishedAt)] | order(order asc) {
  name,
  "backgroundColor": backgroundColor.hex
}
```

---
```

**Step 2: Create user guide**

Create `docs/sanity-cms-guide.md`:

```markdown
# Sanity CMS - Przewodnik Użytkownika

> Instrukcja zarządzania treścią na stronie Kompopolex

## Logowanie

1. Otwórz https://studio.kompopolex.pl
2. Zaloguj się kontem Google/GitHub (przypisanym przez administratora)

## Dodawanie Wydarzenia

### Krok 1: Utwórz nowe wydarzenie

1. Kliknij **"Wydarzenia"** w menu bocznym
2. Kliknij **"+ Create"** (plus w prawym górnym rogu)
3. Otworzy się formularz

### Krok 2: Wypełnij podstawowe dane

- **Tytuł**: Nazwa wydarzenia (np. "ENSEMBLE KOMPOPOLEX")
- **Data i godzina**: Wybierz z kalendarza
- **Wykonawcy**: Wpisz wykonawców oddzielonych przecinkami
  - LUB użyj **Program** dla szczegółowego programu koncertu
- **Opis**: Tekst opisujący wydarzenie
- **Lokalizacja**: Miejsce wydarzenia (np. "ASP WROCŁAW, PL. POLSKI 3/4")

### Krok 3: Dodaj zdjęcie

1. Kliknij **"Upload"** w sekcji Zdjęcie
2. Wybierz plik JPG/PNG
3. (Opcjonalnie) Kliknij na zdjęcie i ustaw **hotspot** (punkt centralny)
4. **Styl obrazu** - pozostaw puste (lub skopiuj z podobnego wydarzenia)

### Krok 4: Ustaw status i publikację

- **Status**:
  - "Nadchodzące" - dla przyszłych wydarzeń
  - "Archiwalne" - dla wydarzeń z przeszłości
- **Data publikacji**:
  - **Zostaw puste** aby zapisać jako szkic (nie widoczne na stronie)
  - **Wypełnij datą** aby opublikować (widoczne na stronie)

### Krok 5: Zapisz

- Kliknij **"Publish"** aby opublikować od razu
- LUB kliknij **"Save"** aby zapisać szkic

## Edycja Wydarzenia

1. Kliknij **"Wydarzenia"**
2. Znajdź wydarzenie na liście
3. Kliknij aby otworzyć
4. Edytuj pola
5. Kliknij **"Publish"** aby zapisać zmiany

## Usuwanie Wydarzenia

1. Otwórz wydarzenie do edycji
2. Kliknij **"⋮"** (menu) w prawym górnym rogu
3. Wybierz **"Delete"**
4. Potwierdź usunięcie

## Przenoszenie do Archiwum

1. Otwórz wydarzenie
2. Zmień **Status** z "Nadchodzące" na "Archiwalne"
3. Kliknij **"Publish"**

## Edycja Profilu Bio

1. Kliknij **"Profile Bio"**
2. Wybierz profil (1-4)
3. Edytuj:
   - **Nazwa**: Imię i nazwisko
   - **Paragrafy**: Tekst biografii
   - **Kolory**: Kliknij aby zmienić (suwak lub wpisz hex)
   - **Zdjęcie**: Upload nowego zdjęcia
4. **Kolejność**: NIE ZMIENIAJ (kontroluje pozycję slajdu)
5. Kliknij **"Publish"**

## Najczęstsze Pytania

**Q: Jak ukryć wydarzenie bez usuwania?**
A: Wyczyść pole "Data publikacji" - wydarzenie będzie szkicem (nie widoczne na stronie)

**Q: Jak zmienić kolejność wydarzeń?**
A: Wydarzenia sortują się automatycznie po dacie (najwcześniejsze pierwsze)

**Q: Co zrobić jeśli zdjęcie nie wygląda dobrze?**
A: Otwórz zdjęcie → kliknij na podgląd → ustaw hotspot (niebieski punkt) na ważnym elemencie zdjęcia

**Q: Błąd podczas publikacji?**
A: Sprawdź czy wszystkie wymagane pola są wypełnione (czerwona gwiazdka *)

## Pomoc

W razie problemów skontaktuj się z administratorem.
```

**Step 3: Commit**

```bash
git add CLAUDE.md docs/sanity-cms-guide.md
git commit -m "docs: add Sanity CMS documentation

- Update CLAUDE.md with CMS integration details
- Add Polish user guide for non-tech users
- Document data flow, queries, and commands

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 21: Final Build and Test

**Files:**
- Run: Build and test production bundle

**Step 1: Run production build**

Run:
```bash
npm run build
```

Expected: Build completes successfully

**Step 2: Check build output**

Run:
```bash
ls -lh dist/assets/
```

Expected: JS and CSS bundles created

**Step 3: Test production build locally**

Run:
```bash
npx serve dist -p 5173
```

Open http://localhost:5173

Test:
1. Homepage loads
2. Navigate to /kalendarz - events show from Sanity
3. Navigate to /bio - bio profiles show from Sanity
4. All images load
5. No console errors

**Step 4: Stop serve**

Press Ctrl+C

**Step 5: Update migration log**

Update `docs/cms-migration-log.md`:

```markdown
## 2026-01-16 - Migration Complete

**Status**: ✅ COMPLETED

**Summary:**
- Sanity Studio deployed to Vercel
- All schemas created (event, bioProfile, media)
- 3 events migrated to Sanity
- 4 bio profiles migrated to Sanity
- Frontend integration complete
- Visual verification passed for all pages
- Feature flag removed
- Production build tested

**Next steps:**
- Configure custom domain for Studio (studio.kompopolex.pl)
- Set up CORS in Sanity dashboard
- User training session
```

**Step 6: Commit**

```bash
git add docs/cms-migration-log.md
git commit -m "test: final production build verification

- Build completes successfully
- All pages work with Sanity data
- No console errors
- Mark migration as complete

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Post-Implementation Tasks

### Task 22: Configure Custom Domain

**Manual steps** (not automated):

1. **Vercel Dashboard**:
   - Go to kompopolex-studio project
   - Settings → Domains
   - Add `studio.kompopolex.pl`
   - Follow DNS configuration instructions

2. **DNS Provider**:
   - Add CNAME record: `studio` → `cname.vercel-dns.com`
   - Wait for propagation (~5-30 min)

3. **Sanity CORS**:
   - Go to https://sanity.io/manage
   - Select project
   - API → CORS origins
   - Add:
     - `https://kompopolex.pl`
     - `https://studio.kompopolex.pl`
   - Save

4. **Verify**:
   - Open https://studio.kompopolex.pl
   - Should load Studio
   - Create test event, verify it appears on https://kompopolex.pl/kalendarz

---

### Task 23: User Training

**Manual steps**:

1. **Schedule training session** with non-tech users

2. **Prepare materials**:
   - Share `docs/sanity-cms-guide.md` (Polish)
   - Optional: Record screen walkthrough

3. **Training agenda** (30-45 min):
   - Login to Studio
   - Add new event (practice with test event)
   - Edit existing event
   - Upload image and set hotspot
   - Draft vs Published workflow
   - Q&A

4. **Post-training**:
   - Give users access (invite via Sanity dashboard, role: Editor)
   - Ask them to create real event
   - Collect feedback

---

## Summary

**Implementation complete!**

**What was built:**
- ✅ Sanity Studio with 3 content schemas
- ✅ Frontend integration with hooks and GROQ queries
- ✅ Migrated all existing content (3 events, 4 bio profiles)
- ✅ Visual verification passed (pixel-perfect preserved)
- ✅ Feature flag removed, Sanity is primary data source
- ✅ Documentation for developers and users
- ✅ Production build tested

**Remaining manual tasks:**
- Configure custom domain (studio.kompopolex.pl)
- User training and access provisioning

**Timeline:**
- Development: ~3-4 hours (22 tasks)
- Manual setup: ~1 hour (domain, CORS, training)

**Total effort:** 4-5 hours for full integration ✓
