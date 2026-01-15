# Tina CMS Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate Tina CMS into Kompopolex React project to enable non-technical client content editing through visual admin panel.

**Architecture:** Git-based CMS with Tina Cloud authentication. Content migrated from JS config files to Markdown/JSON in `/content` directory. Tina provides GraphQL API and React hooks for querying content. Visual editor at `/admin` route with live preview.

**Tech Stack:**
- TinaCMS v2+ (React integration)
- Tina Cloud (authentication)
- Vite (build tool)
- React Router v7 (routing)
- Existing: React 18, Tailwind 4

**Trade-offs:**
- ✅ Non-technical client can edit content via browser
- ✅ Git-based workflow (all changes are commits → Vercel auto-deploy)
- ✅ Free tier sufficient (2 users, 1GB assets)
- ✅ Visual live preview
- ⚠️ Adds ~3MB to bundle size
- ⚠️ Requires Tina Cloud account setup
- ⚠️ 2-3h initial implementation time

---

## Phase 1: Setup TinaCMS Foundation

### Task 1: Install TinaCMS Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Tina packages**

Run:
```bash
npm install tinacms @tinacms/cli
```

Expected output: Packages installed successfully

**Step 2: Verify installation**

Run:
```bash
npm list tinacms @tinacms/cli
```

Expected: Shows installed versions (tinacms@2.x, @tinacms/cli@1.x)

**Step 3: Add Tina scripts to package.json**

Edit `package.json`, add to `scripts`:
```json
{
  "scripts": {
    "dev": "tinacms dev -c \"vite\"",
    "build": "tinacms build && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "tina:init": "tinacms init"
  }
}
```

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install TinaCMS dependencies"
```

---

### Task 2: Initialize Tina Configuration

**Files:**
- Create: `tina/config.ts`

**Step 1: Initialize Tina**

Run:
```bash
npm run tina:init
```

Expected: Creates `tina/` directory with basic config

**Step 2: Configure Tina schema (basic structure)**

Create file `tina/config.ts`:

```typescript
import { defineConfig } from "tinacms";

// Branch to use - main for production
const branch = process.env.TINA_BRANCH || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // Will add collections in next tasks
    ],
  },
});
```

**Step 3: Create .env file for Tina credentials**

Create `.env.local`:
```bash
# Leave empty for now - will add Tina Cloud credentials later
TINA_CLIENT_ID=
TINA_TOKEN=
TINA_BRANCH=main
```

Add to `.gitignore`:
```
.env.local
```

**Step 4: Commit**

```bash
git add tina/config.ts .env.local .gitignore
git commit -m "feat: initialize Tina CMS configuration"
```

---

### Task 3: Setup Content Directory Structure

**Files:**
- Create: `content/.gitkeep`

**Step 1: Create content directories**

Run:
```bash
mkdir -p content/homepage
mkdir -p content/bio
mkdir -p content/kalendarz
mkdir -p content/archiwalne
mkdir -p content/media
mkdir -p content/media-wideo
touch content/.gitkeep
```

**Step 2: Verify structure**

Run:
```bash
tree content
```

Expected output:
```
content/
├── .gitkeep
├── homepage/
├── bio/
├── kalendarz/
├── archiwalne/
├── media/
└── media-wideo/
```

**Step 3: Commit**

```bash
git add content/
git commit -m "feat: create content directory structure for Tina"
```

---

## Phase 2: Migrate Homepage Content

### Task 4: Define Homepage Slides Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add Homepage collection to Tina schema**

In `tina/config.ts`, replace `collections: []` with:

```typescript
schema: {
  collections: [
    {
      name: "homepage",
      label: "Homepage Slides",
      path: "content/homepage",
      format: "json",
      fields: [
        {
          type: "string",
          name: "id",
          label: "Slide ID",
          required: true,
        },
        {
          type: "string",
          name: "backgroundColor",
          label: "Background Color",
          required: true,
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          name: "word",
          label: "Word",
          required: true,
        },
        {
          type: "image",
          name: "wordSvg",
          label: "Word SVG",
          required: true,
        },
        {
          type: "number",
          name: "wordY",
          label: "Word Y Position",
          required: true,
        },
        {
          type: "number",
          name: "wordHeight",
          label: "Word Height",
          required: true,
        },
        {
          type: "number",
          name: "wordWidth",
          label: "Word Width",
          required: true,
        },
        {
          type: "string",
          name: "tagline",
          label: "Tagline",
          required: true,
        },
        {
          type: "number",
          name: "taglineX",
          label: "Tagline X Position",
          required: true,
        },
        {
          type: "image",
          name: "image",
          label: "Hero Image",
          required: true,
        },
        {
          type: "string",
          name: "textColor",
          label: "Text Color",
          required: true,
          ui: {
            component: "color",
          },
        },
        {
          type: "string",
          name: "lineColor",
          label: "Line Color",
          required: true,
          ui: {
            component: "color",
          },
        },
        {
          type: "image",
          name: "logoSrc",
          label: "Logo",
          required: true,
        },
      ],
    },
  ],
},
```

**Step 2: Start Tina dev server to verify schema**

Run:
```bash
npm run dev
```

Expected: Vite + Tina dev server starts on http://localhost:5173

**Step 3: Access Tina admin panel**

Navigate to: http://localhost:5173/admin

Expected: Tina admin panel loads (may show "No documents" - that's ok)

**Step 4: Stop dev server and commit**

Press Ctrl+C to stop server

```bash
git add tina/config.ts
git commit -m "feat: add Homepage slides schema to Tina"
```

---

### Task 5: Migrate Homepage Desktop Slides to Tina

**Files:**
- Create: `content/homepage/desktop-slide-1.json`
- Create: `content/homepage/desktop-slide-2.json`
- Create: `content/homepage/desktop-slide-3.json`
- Create: `content/homepage/desktop-slide-4.json`

**Step 1: Create slide 1 (Trio)**

Create `content/homepage/desktop-slide-1.json`:

```json
{
  "id": "1",
  "backgroundColor": "#FDFDFD",
  "word": "Trio",
  "wordSvg": "/assets/slides/word-trio.svg",
  "wordY": 446,
  "wordHeight": 149,
  "wordWidth": 49,
  "tagline": "specjalizujemy się w muzyce najnowszej",
  "taglineX": 514,
  "image": "/assets/slides/hero-1.jpg",
  "textColor": "#131313",
  "lineColor": "#A0E38A",
  "logoSrc": "/assets/logo.svg"
}
```

**Step 2: Create slide 2 (Kompo)**

Create `content/homepage/desktop-slide-2.json`:

```json
{
  "id": "2",
  "backgroundColor": "#761FE0",
  "word": "Kompo",
  "wordSvg": "/assets/slides/word-kompo.svg",
  "wordY": 408,
  "wordHeight": 185,
  "wordWidth": 58,
  "tagline": "gramy wszystko i na wszystkim",
  "taglineX": 612,
  "image": "/assets/slides/hero-2.jpg",
  "textColor": "#FDFDFD",
  "lineColor": "#A0E38A",
  "logoSrc": "/assets/logo-white.svg"
}
```

**Step 3: Create slide 3 (Polex)**

Create `content/homepage/desktop-slide-3.json`:

```json
{
  "id": "3",
  "backgroundColor": "#34B898",
  "word": "Polex",
  "wordSvg": "/assets/slides/word-polex.svg",
  "wordY": 408,
  "wordHeight": 185,
  "wordWidth": 49,
  "tagline": "jesteśmy z Polski",
  "taglineX": 741,
  "image": "/assets/slides/hero-3.jpg",
  "textColor": "#131313",
  "lineColor": "#01936F",
  "logoSrc": "/assets/logo.svg"
}
```

**Step 4: Create slide 4 (Ensemble)**

Create `content/homepage/desktop-slide-4.json`:

```json
{
  "id": "4",
  "backgroundColor": "#FFBD19",
  "word": "Ensemble",
  "wordSvg": "/assets/slides/word-ensemble.svg",
  "wordY": 293,
  "wordHeight": 299,
  "wordWidth": 49,
  "tagline": "komponuje dla nas cały świat",
  "taglineX": 622,
  "image": "/assets/slides/hero-4.jpg",
  "textColor": "#131313",
  "lineColor": "#5B5B5B",
  "logoSrc": "/assets/logo.svg"
}
```

**Step 5: Verify content appears in Tina admin**

Run:
```bash
npm run dev
```

Navigate to: http://localhost:5173/admin

Expected: See 4 slides in "Homepage Slides" collection

**Step 6: Commit**

```bash
git add content/homepage/
git commit -m "feat: migrate desktop homepage slides to Tina content"
```

---

### Task 6: Integrate Tina with React App

**Files:**
- Modify: `src/main.jsx`
- Create: `src/tina/queries.js`

**Step 1: Setup TinaCMS provider in main.jsx**

Modify `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TinaProvider from './tina/TinaProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TinaProvider>
      <App />
    </TinaProvider>
  </StrictMode>,
)
```

**Step 2: Create TinaProvider component**

Create `src/tina/TinaProvider.jsx`:

```jsx
import { TinaEditProvider } from 'tinacms/dist/edit-state'

export default function TinaProvider({ children }) {
  return (
    <TinaEditProvider
      showEditButton={true}
      editMode={
        <TinaEditProvider.ToggleButton />
      }
    >
      {children}
    </TinaEditProvider>
  )
}
```

**Step 3: Create Tina queries helper**

Create `src/tina/queries.js`:

```javascript
import client from '../../tina/__generated__/client'

// Query all homepage slides
export async function getHomepageSlides() {
  const slidesResponse = await client.queries.homepageConnection()
  return slidesResponse.data.homepageConnection.edges.map(edge => edge.node)
}
```

**Step 4: Verify app still runs**

Run:
```bash
npm run dev
```

Expected: App runs without errors

**Step 5: Commit**

```bash
git add src/main.jsx src/tina/
git commit -m "feat: integrate TinaCMS provider into React app"
```

---

### Task 7: Update Homepage Component to Use Tina Data

**Files:**
- Modify: `src/pages/Homepage/index.jsx`
- Modify: `src/pages/Homepage/DesktopHomepage.jsx`

**Step 1: Update Homepage index to fetch Tina data**

Modify `src/pages/Homepage/index.jsx`:

Replace import of `slides-config.js` with Tina query:

```jsx
import { useState, useEffect } from 'react';
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopHomepage from './DesktopHomepage';
import MobileHomepage from './MobileHomepage';
import { getHomepageSlides } from '../../tina/queries';

export default function Homepage() {
  const [desktopSlides, setDesktopSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSlides() {
      const slides = await getHomepageSlides();
      // Filter desktop slides (or implement separate collections)
      const desktop = slides.filter(s => s.id >= 1 && s.id <= 4);
      setDesktopSlides(desktop);
      setLoading(false);
    }
    loadSlides();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopHomepage slides={desktopSlides} />}
      mobileContent={<MobileHomepage />}
    />
  );
}
```

**Step 2: Update DesktopHomepage to accept slides prop**

Modify `src/pages/Homepage/DesktopHomepage.jsx`:

Change from importing slides-config to receiving slides as prop:

```jsx
// Remove this line:
// import { desktopSlides } from './slides-config';

// Add prop:
export default function DesktopHomepage({ slides }) {
  // Use slides prop instead of imported desktopSlides
  // ... rest of component
}
```

**Step 3: Test in browser**

Run:
```bash
npm run dev
```

Navigate to: http://localhost:5173

Expected: Homepage loads with slides from Tina content

**Step 4: Commit**

```bash
git add src/pages/Homepage/
git commit -m "feat: update Homepage to use Tina CMS data"
```

---

## Phase 3: Migrate Bio Content

### Task 8: Define Bio Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add Bio collection to schema**

In `tina/config.ts`, add to `collections` array:

```typescript
{
  name: "bio",
  label: "Bio",
  path: "content/bio",
  format: "json",
  fields: [
    {
      type: "string",
      name: "id",
      label: "Bio ID",
      required: true,
    },
    {
      type: "string",
      name: "backgroundColor",
      label: "Background Color",
      required: true,
      ui: {
        component: "color",
      },
    },
    {
      type: "string",
      name: "name",
      label: "Name",
      required: true,
    },
    {
      type: "string",
      name: "lineColor",
      label: "Line Color",
      required: true,
      ui: {
        component: "color",
      },
    },
    {
      type: "string",
      name: "textColor",
      label: "Text Color",
      required: true,
      ui: {
        component: "color",
      },
    },
    {
      type: "image",
      name: "image",
      label: "Photo",
      required: true,
    },
    {
      type: "object",
      name: "imageStyle",
      label: "Image Style",
      fields: [
        {
          type: "string",
          name: "position",
          label: "Position",
        },
        {
          type: "string",
          name: "width",
          label: "Width",
        },
        {
          type: "string",
          name: "height",
          label: "Height",
        },
        {
          type: "string",
          name: "left",
          label: "Left",
        },
        {
          type: "string",
          name: "top",
          label: "Top",
        },
        {
          type: "string",
          name: "maxWidth",
          label: "Max Width",
        },
        {
          type: "string",
          name: "objectFit",
          label: "Object Fit",
        },
        {
          type: "string",
          name: "objectPosition",
          label: "Object Position",
        },
      ],
    },
    {
      type: "image",
      name: "logoSrc",
      label: "Logo",
      required: true,
    },
    {
      type: "string",
      name: "paragraphs",
      label: "Paragraphs",
      list: true,
      ui: {
        component: "textarea",
      },
    },
    {
      type: "number",
      name: "paragraphTops",
      label: "Paragraph Top Positions",
      list: true,
    },
    {
      type: "boolean",
      name: "hasFooter",
      label: "Has Footer",
    },
  ],
},
```

**Step 2: Verify schema compiles**

Run:
```bash
npm run dev
```

Expected: No TypeScript/schema errors

**Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat: add Bio collection schema to Tina"
```

---

### Task 9: Migrate Bio Data to Tina

**Files:**
- Create: `content/bio/bio1-ensemble.json`
- Create: `content/bio/bio2-aleksandra.json`
- Create: `content/bio/bio3-rafal.json`
- Create: `content/bio/bio4-jacek.json`

**Step 1: Create Bio1 (Ensemble)**

Create `content/bio/bio1-ensemble.json`:

```json
{
  "id": "bio1",
  "backgroundColor": "#FDFDFD",
  "name": "Ensemble KOMPOPOLEX",
  "lineColor": "#A0E38A",
  "textColor": "#131313",
  "image": "/assets/bio/bio1-ensemble.jpg",
  "imageStyle": {
    "width": "100%",
    "height": "100%",
    "objectFit": "cover",
    "objectPosition": "50% 50%"
  },
  "logoSrc": "/assets/logo.svg",
  "paragraphs": [
    "Trio specjalizujące się w muzyce najnowszej, założone 2017 roku we Wrocławiu. Wykonują utwory zaangażowane i angażujące, często porzucają swoje instrumenty na rzecz kabli, keyboardów, tańca i śpiewu. W jego skład wchodzą Aleksandra Gołaj (perkusja), Rafał Łuc (akordeon) i Jacek Sotomski (komputery).",
    "Przez lata działalności zespół zdążył zagrać na najważniejszych festiwalach muzyki nowej w Polsce i za granicą: Mixtur Festival, Warszawskiej Jesieni, Sacrum Profanum, Festiwalu Prawykonań, Musica Polonica Nova oraz Musica Electronica Nova. Wystąpił również na MMMM 2.1 w Stalowej Woli, Eksperymentalnych Wtorkach w Sinfonii Varsovii, teatralnym Festiwalu Kontrapunkt w Szczecinie, Festiwalu NeoArte Syntezator Sztuki."
  ],
  "paragraphTops": [260, 420],
  "hasFooter": false
}
```

**Step 2: Create Bio2 (Aleksandra)**

Create `content/bio/bio2-aleksandra.json`:

```json
{
  "id": "bio2",
  "backgroundColor": "#FF734C",
  "name": "Aleksandra Gołaj",
  "lineColor": "#FFBD19",
  "textColor": "#131313",
  "image": "/assets/bio/bio2-aleksandra.jpg",
  "imageStyle": {
    "position": "absolute",
    "width": "342.5%",
    "height": "159.57%",
    "left": "0.75%",
    "top": "-28.91%",
    "maxWidth": "none"
  },
  "logoSrc": "/assets/logo.svg",
  "paragraphs": [
    "Na stałe związana z Orkiestrą Symfoniczną NFM Filharmonia Wrocławska. Jako kameralistka regularnie występuje na festiwalach związanych z muzyką współczesną m. in. MUSMA, Musica Polonica Nova, Musica Electronica Nova, ISCM World Music Days 2014, Poznańska Wiosna Muzyczna, Muzyka na Szczytach, Warszawska Jesień.",
    "W latach 2015-2018 wykładowca Akademii Muzycznej we Wrocławiu. Zaangażowana w umuzykalnianie młodzieży. Bierze udział w pilotażowym projekcie Dolnośląskiego Towarzystwa Muzycznego, polegającym na wprowadzeniu orkiestr dętych jako zajęć pozalekcyjnych."
  ],
  "paragraphTops": [260, 446],
  "hasFooter": false
}
```

**Step 3: Create Bio3 (Rafał)**

Create `content/bio/bio3-rafal.json`:

```json
{
  "id": "bio3",
  "backgroundColor": "#34B898",
  "name": "Rafał Łuc",
  "lineColor": "#01936F",
  "textColor": "#131313",
  "image": "/assets/bio/bio3-rafal.jpg",
  "imageStyle": {
    "position": "absolute",
    "width": "330.37%",
    "height": "153.91%",
    "left": "-101.18%",
    "top": "-13.7%",
    "maxWidth": "none"
  },
  "logoSrc": "/assets/logo.svg",
  "paragraphs": [
    "Wielokrotnie nagradzany muzyk, akordeonista. Absolwent Royal Academy of Music w Londynie, Musikene w San Sebastian, Akademii Muzycznej im. Karola Lipińskiego we Wrocławiu, w której zatrudniony jest na stanowisku adiunkta. We wrześniu 2018 r. uzyskał tytuł doktora habilitowanego, dwukrotnie kandydat do nominacji Paszportów Polityki.",
    "Koncertuje na całym świecie solo, kameralnie oraz z takimi zespołami orkiestrowymi jak BBC Symphony Orchestra, London Sinfonietta, Aurora Orchestra, Rambert Dance Company, NFM Filharmonią Wrocławską.",
    "Jego nagrania znajdują się na 10 płytach CD. Neil Fisher z dziennika 'The Times' określił Rafała Łuca jako: 'dojrzałego muzyka wyróżniającego się głębokim zaangażowaniem w wykorzystanie całego potencjału swojego instrumentu'."
  ],
  "paragraphTops": [260, 444, 556],
  "hasFooter": false
}
```

**Step 4: Create Bio4 (Jacek)**

Create `content/bio/bio4-jacek.json`:

```json
{
  "id": "bio4",
  "backgroundColor": "#73A1FE",
  "name": "Jacek Sotomski",
  "lineColor": "#3478FF",
  "textColor": "#131313",
  "image": "/assets/bio/bio4-jacek.jpg",
  "imageStyle": {
    "position": "absolute",
    "width": "301.44%",
    "height": "140.43%",
    "left": "-198.05%",
    "top": "-0.22%",
    "maxWidth": "none"
  },
  "logoSrc": "/assets/logo.svg",
  "paragraphs": [
    "Jego utwory były wykonywane na festiwalach World Music Days, Warszawska Jesień, BIFEM w Bendigo (Australia), Ostrava Music Days, Musica Polonica Nova, Musica Electronica Nova, oprócz tego jako wykonawca wystąpił na Festival Licences w Paryżu, Ring Ring w Belgradzie, Cinemascope w Mińsku.",
    "W 2018 roku był nominowany do nagrody polskiego środowiska muzycznego Koryfeusz Muzyki Polskiej w kategorii Odkrycie Roku. W 2011 roku założył z Mikołajem Laskowskim duet sultan hagavik, z którym dwa lata po rozpoczęciu działalności wygrał nagrodę nurtu OFF na Przeglądzie Piosenki Aktorskiej we Wrocławiu."
  ],
  "paragraphTops": [256, 416],
  "hasFooter": true
}
```

**Step 5: Verify in Tina admin**

Run:
```bash
npm run dev
```

Navigate to: http://localhost:5173/admin

Expected: See 4 bio entries

**Step 6: Commit**

```bash
git add content/bio/
git commit -m "feat: migrate bio content to Tina"
```

---

## Phase 4: Migrate Events Content

### Task 10: Define Kalendarz Events Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add Kalendarz collection to schema**

In `tina/config.ts`, add to `collections` array:

```typescript
{
  name: "kalendarz",
  label: "Kalendarz (Upcoming Events)",
  path: "content/kalendarz",
  format: "json",
  fields: [
    {
      type: "number",
      name: "id",
      label: "Event ID",
      required: true,
    },
    {
      type: "string",
      name: "date",
      label: "Date & Time",
      required: true,
      description: "Format: DD.MM.YY | HH:MM",
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
    },
    {
      type: "string",
      name: "performers",
      label: "Performers",
      description: "Comma-separated list or null for program-based events",
    },
    {
      type: "object",
      name: "program",
      label: "Program",
      list: true,
      description: "Use for program-based events (instead of performers)",
      fields: [
        {
          type: "string",
          name: "composer",
          label: "Composer",
        },
        {
          type: "string",
          name: "piece",
          label: "Piece",
        },
      ],
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "location",
      label: "Location",
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Event Image",
      required: true,
    },
    {
      type: "object",
      name: "imageStyle",
      label: "Image Style",
      fields: [
        {
          type: "string",
          name: "position",
          label: "Position",
        },
        {
          type: "string",
          name: "width",
          label: "Width",
        },
        {
          type: "string",
          name: "height",
          label: "Height",
        },
        {
          type: "string",
          name: "left",
          label: "Left",
        },
        {
          type: "string",
          name: "top",
          label: "Top",
        },
        {
          type: "string",
          name: "maxWidth",
          label: "Max Width",
        },
        {
          type: "string",
          name: "objectFit",
          label: "Object Fit",
        },
        {
          type: "string",
          name: "objectPosition",
          label: "Object Position",
        },
      ],
    },
  ],
},
```

**Step 2: Verify schema**

Run:
```bash
npm run dev
```

Expected: No errors, Tina admin shows Kalendarz collection

**Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat: add Kalendarz events schema to Tina"
```

---

### Task 11: Migrate Kalendarz Events Data

**Files:**
- Create: `content/kalendarz/event-1.json`
- Create: `content/kalendarz/event-2.json`
- Create: `content/kalendarz/event-3.json`

**Step 1: Create Event 1**

Create `content/kalendarz/event-1.json`:

```json
{
  "id": 1,
  "date": "13.12.25 | 18:00",
  "title": "ENSEMBLE KOMPOPOLEX",
  "performers": "Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski",
  "description": "Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.",
  "location": "ASP WROCŁAW, PL. POLSKI 3/4",
  "image": "/assets/kalendarz/event1.jpg",
  "imageStyle": {
    "objectFit": "cover",
    "objectPosition": "50% 50%"
  }
}
```

**Step 2: Create Event 2**

Create `content/kalendarz/event-2.json`:

```json
{
  "id": 2,
  "date": "20.12.25 | 18:00",
  "title": "SPOŁECZNE KOMPONOWANIE 2025",
  "performers": "Julia Łabowska, Karolina Kułaga, Oleś Kulczewicz, Szymon Kępczyński, Tymoteusz Lasik",
  "description": "Lorem ipsum dolor sit amet consectetur. Nunc aenean in auctor eu. Tellus non nulla odio donec. Eu lorem vitae praesent dictumst elit malesuada ultricies. Magna dolor sed in dui. Viverra consequat in suspendisse massa. Gravida aliquet dignissim ut eget.",
  "location": "Akademia Muzyczna im. K. Lipińskiego\nwe Wrocławiu",
  "image": "/assets/kalendarz/event2.jpg",
  "imageStyle": {
    "position": "absolute",
    "width": "209.97%",
    "height": "100%",
    "left": "-33.17%",
    "top": "0",
    "maxWidth": "none"
  }
}
```

**Step 3: Create Event 3 (with program)**

Create `content/kalendarz/event-3.json`:

```json
{
  "id": 3,
  "date": "16.01.26 | 20:00",
  "title": "MIXTUR FESTIVAL",
  "program": [
    {
      "composer": "La Monte Young",
      "piece": "Composition #10"
    },
    {
      "composer": "Marta Śniady",
      "piece": "Body X Ultra"
    },
    {
      "composer": "Martin A. Hirsti-Kvam",
      "piece": "Memory Box #2"
    },
    {
      "composer": "Jennifer Walshe",
      "piece": "EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE"
    },
    {
      "composer": "Rafał Ryterski",
      "piece": "Breathe"
    },
    {
      "composer": "La Monte Young",
      "piece": "Composition #13"
    }
  ],
  "location": "Nau Bostik, Barcelona",
  "image": "/assets/kalendarz/event3.jpg",
  "imageStyle": {
    "objectFit": "cover",
    "objectPosition": "50% 50%"
  }
}
```

**Step 4: Verify in Tina admin**

Run:
```bash
npm run dev
```

Navigate to: http://localhost:5173/admin → Kalendarz

Expected: See 3 events

**Step 5: Commit**

```bash
git add content/kalendarz/
git commit -m "feat: migrate kalendarz events to Tina"
```

---

### Task 12: Define Archiwalne Events Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add Archiwalne collection to schema**

In `tina/config.ts`, add to `collections` array:

```typescript
{
  name: "archiwalne",
  label: "Archiwalne (Archived Events)",
  path: "content/archiwalne",
  format: "json",
  fields: [
    {
      type: "number",
      name: "id",
      label: "Event ID",
      required: true,
    },
    {
      type: "string",
      name: "date",
      label: "Date",
      required: true,
      description: "Format: DD.MM.YY",
    },
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
    },
    {
      type: "string",
      name: "performers",
      label: "Performers",
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Event Image",
      required: true,
    },
    {
      type: "object",
      name: "position",
      label: "Position",
      description: "Desktop layout position (px)",
      fields: [
        {
          type: "number",
          name: "left",
          label: "Left",
        },
        {
          type: "number",
          name: "top",
          label: "Top",
        },
      ],
    },
    {
      type: "boolean",
      name: "hasBorder",
      label: "Has Border",
    },
  ],
},
```

**Step 2: Verify schema**

Run:
```bash
npm run dev
```

Expected: Archiwalne collection appears in admin

**Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat: add Archiwalne events schema to Tina"
```

---

### Task 13: Migrate Archiwalne Events Data (Sample)

**Files:**
- Create: `content/archiwalne/event-1.json`
- Create: `content/archiwalne/event-2.json`

**Step 1: Create archived event 1**

Create `content/archiwalne/event-1.json`:

```json
{
  "id": 1,
  "date": "13.12.25",
  "title": "ENSEMBLE KOMPOPOLEX",
  "performers": "Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski",
  "image": "/assets/archiwalne/event1.jpg",
  "position": {
    "left": 185,
    "top": 275
  },
  "hasBorder": true
}
```

**Step 2: Create archived event 2**

Create `content/archiwalne/event-2.json`:

```json
{
  "id": 2,
  "date": "10.12.24",
  "title": "KOMPOPOLEX x martyna zakrzewska",
  "performers": "Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Martyna Zakrzewska",
  "image": "/assets/archiwalne/event2.jpg",
  "position": {
    "left": 515,
    "top": 275
  },
  "hasBorder": false
}
```

**Step 3: Verify in admin**

Navigate to: http://localhost:5173/admin → Archiwalne

Expected: See 2 archived events

**Step 4: Commit**

```bash
git add content/archiwalne/
git commit -m "feat: migrate archiwalne events to Tina (sample data)"
```

**Note:** Repeat this pattern for remaining archived events (3-6).

---

## Phase 5: Migrate Media Content

### Task 14: Define Media Gallery Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add Media collection to schema**

In `tina/config.ts`, add to `collections` array:

```typescript
{
  name: "media",
  label: "Media (Photo Galleries)",
  path: "content/media",
  format: "json",
  fields: [
    {
      type: "number",
      name: "id",
      label: "Gallery ID",
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Thumbnail Image",
      required: true,
    },
    {
      type: "string",
      name: "title",
      label: "Gallery Title",
      required: true,
    },
    {
      type: "string",
      name: "photographer",
      label: "Photographer",
      required: true,
    },
    {
      type: "image",
      name: "images",
      label: "Gallery Images",
      list: true,
      required: true,
    },
  ],
},
```

**Step 2: Verify schema**

Run:
```bash
npm run dev
```

Expected: Media collection appears in admin

**Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat: add Media galleries schema to Tina"
```

---

### Task 15: Migrate Media Galleries Data (Sample)

**Files:**
- Create: `content/media/gallery-1.json`
- Create: `content/media/gallery-2.json`

**Step 1: Create gallery 1**

Create `content/media/gallery-1.json`:

```json
{
  "id": 1,
  "image": "/assets/media/photo1.jpg",
  "title": "Festiwal Klang",
  "photographer": "Alexander Banck-Petersen",
  "images": [
    "/assets/media/photo1.jpg",
    "/assets/media/photo1-2.jpg",
    "/assets/media/photo1.jpg"
  ]
}
```

**Step 2: Create gallery 2**

Create `content/media/gallery-2.json`:

```json
{
  "id": 2,
  "image": "/assets/media/photo3.jpg",
  "title": "Nazwa wydarzenia",
  "photographer": "Wojciech Chrubasik",
  "images": [
    "/assets/media/photo3.jpg",
    "/assets/media/photo3.jpg",
    "/assets/media/photo3.jpg"
  ]
}
```

**Step 3: Verify in admin**

Navigate to: http://localhost:5173/admin → Media

Expected: See 2 galleries

**Step 4: Commit**

```bash
git add content/media/
git commit -m "feat: migrate media galleries to Tina (sample data)"
```

**Note:** Repeat for remaining galleries (3-6).

---

### Task 16: Define Media Wideo Schema

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add MediaWideo collection to schema**

In `tina/config.ts`, add to `collections` array:

```typescript
{
  name: "mediaWideo",
  label: "Media Wideo (Videos)",
  path: "content/media-wideo",
  format: "json",
  fields: [
    {
      type: "number",
      name: "id",
      label: "Video ID",
      required: true,
    },
    {
      type: "image",
      name: "thumbnail",
      label: "Thumbnail",
      required: true,
    },
    {
      type: "string",
      name: "title",
      label: "Video Title",
      required: true,
    },
    {
      type: "string",
      name: "youtubeUrl",
      label: "YouTube URL",
      required: true,
      description: "Full YouTube watch URL",
    },
  ],
},
```

**Step 2: Verify schema**

Run:
```bash
npm run dev
```

Expected: MediaWideo collection appears in admin

**Step 3: Commit**

```bash
git add tina/config.ts
git commit -m "feat: add MediaWideo videos schema to Tina"
```

---

### Task 17: Migrate Media Wideo Data

**Files:**
- Create: `content/media-wideo/video-1.json`
- Create: `content/media-wideo/video-2.json`
- Create: `content/media-wideo/video-3.json`
- Create: `content/media-wideo/video-4.json`

**Step 1: Create video 1**

Create `content/media-wideo/video-1.json`:

```json
{
  "id": 1,
  "thumbnail": "/assets/media-wideo/video1.jpg",
  "title": "Rafał Zapała - black serial MIDI music",
  "youtubeUrl": "https://www.youtube.com/watch?v=YBwiarivOio"
}
```

**Step 2: Create video 2**

Create `content/media-wideo/video-2.json`:

```json
{
  "id": 2,
  "thumbnail": "/assets/media-wideo/video2.jpg",
  "title": "Michael Beil - Key Jane",
  "youtubeUrl": "https://www.youtube.com/watch?v=gDZOeN8r9jY"
}
```

**Step 3: Create video 3**

Create `content/media-wideo/video-3.json`:

```json
{
  "id": 3,
  "thumbnail": "/assets/media-wideo/video3.jpg",
  "title": "Viacheslav Kyrylov - I'm the real pig blood soaked fucking homecoming queen",
  "youtubeUrl": "https://www.youtube.com/watch?v=rd-vz7qARGo"
}
```

**Step 4: Create video 4**

Create `content/media-wideo/video-4.json`:

```json
{
  "id": 4,
  "thumbnail": "/assets/media-wideo/video4.jpg",
  "title": "Marta Śniady - Body X Ultra: Limited Edition",
  "youtubeUrl": "https://www.youtube.com/watch?v=ayGAJlgoxP4"
}
```

**Step 5: Verify in admin**

Navigate to: http://localhost:5173/admin → MediaWideo

Expected: See 4 videos

**Step 6: Commit**

```bash
git add content/media-wideo/
git commit -m "feat: migrate media wideo videos to Tina"
```

---

## Phase 6: Setup Tina Cloud Authentication

### Task 18: Create Tina Cloud Account

**Files:**
- None (external setup)

**Step 1: Sign up for Tina Cloud**

Navigate to: https://app.tina.io/register

Create account with email or GitHub OAuth

**Step 2: Create new Tina project**

In Tina Cloud dashboard:
- Click "Create New Project"
- Project name: "Kompopolex"
- Connect GitHub repository: `[YOUR_REPO_URL]`
- Branch: `main`

**Step 3: Copy credentials**

From project settings, copy:
- Client ID
- Read-only Token

**Step 4: Add credentials to .env.local**

Edit `.env.local`:

```bash
TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_read_only_token_here
TINA_BRANCH=main
```

**Step 5: Verify connection**

Run:
```bash
npm run dev
```

Navigate to: http://localhost:5173/admin

Try to log in with Tina Cloud credentials

Expected: Successfully logged in to Tina admin

**Step 6: Document credentials location**

Add to `.gitignore` (if not already):
```
.env.local
```

Create `.env.example`:
```bash
# Tina Cloud credentials (get from https://app.tina.io)
TINA_CLIENT_ID=
TINA_TOKEN=
TINA_BRANCH=main
```

**Step 7: Commit**

```bash
git add .env.example .gitignore
git commit -m "feat: setup Tina Cloud authentication"
```

---

### Task 19: Configure Vercel Environment Variables

**Files:**
- None (Vercel dashboard)

**Step 1: Add Tina credentials to Vercel**

In Vercel dashboard for Kompopolex project:
1. Go to Settings → Environment Variables
2. Add:
   - `TINA_CLIENT_ID` = [your client id]
   - `TINA_TOKEN` = [your read-only token]
   - `TINA_BRANCH` = `main`

**Step 2: Trigger redeploy**

Push any change to trigger Vercel redeploy with new env vars

**Step 3: Verify production admin panel**

Navigate to: `https://your-domain.com/admin`

Expected: Tina admin panel works on production

---

## Phase 7: Update React Components to Use Tina

### Task 20: Create Tina Query Hooks

**Files:**
- Create: `src/hooks/useTinaContent.js`

**Step 1: Create generic Tina content hook**

Create `src/hooks/useTinaContent.js`:

```javascript
import { useState, useEffect } from 'react';
import client from '../../tina/__generated__/client';

// Generic hook to fetch Tina content
export function useTinaContent(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = `${collectionName}Connection`;
        const response = await client.queries[query]();
        const items = response.data[query].edges.map(edge => edge.node);
        setData(items);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [collectionName]);

  return { data, loading, error };
}

// Specific hooks for each collection
export function useHomepageSlides() {
  return useTinaContent('homepage');
}

export function useBioSlides() {
  return useTinaContent('bio');
}

export function useKalendarzEvents() {
  return useTinaContent('kalendarz');
}

export function useArchivalneEvents() {
  return useTinaContent('archiwalne');
}

export function useMediaGalleries() {
  return useTinaContent('media');
}

export function useMediaWideoVideos() {
  return useTinaContent('mediaWideo');
}
```

**Step 2: Test hook in Homepage**

Modify `src/pages/Homepage/index.jsx`:

```jsx
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopHomepage from './DesktopHomepage';
import MobileHomepage from './MobileHomepage';
import { useHomepageSlides } from '../../hooks/useTinaContent';

export default function Homepage() {
  const { data: slides, loading } = useHomepageSlides();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter desktop slides (id 1-4)
  const desktopSlides = slides.filter(s => parseInt(s.id) >= 1 && parseInt(s.id) <= 4);

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopHomepage slides={desktopSlides} />}
      mobileContent={<MobileHomepage />}
    />
  );
}
```

**Step 3: Verify in browser**

Run:
```bash
npm run dev
```

Expected: Homepage loads with Tina data

**Step 4: Commit**

```bash
git add src/hooks/useTinaContent.js src/pages/Homepage/index.jsx
git commit -m "feat: create Tina content hooks and update Homepage"
```

---

### Task 21: Update Bio Component

**Files:**
- Modify: `src/pages/Bio/index.jsx`
- Modify: `src/pages/Bio/DesktopBio.jsx`

**Step 1: Update Bio index to use Tina hook**

Modify `src/pages/Bio/index.jsx`:

```jsx
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopBio from './DesktopBio';
import MobileBio from './MobileBio';
import { useBioSlides } from '../../hooks/useTinaContent';

export default function Bio() {
  const { data: bioSlides, loading } = useBioSlides();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopBio slides={bioSlides} />}
      mobileContent={<MobileBio slides={bioSlides} />}
    />
  );
}
```

**Step 2: Update DesktopBio to accept slides prop**

Modify `src/pages/Bio/DesktopBio.jsx`:

Remove import of `bio-config.js`, accept `slides` prop:

```jsx
// Remove: import { desktopBioSlides } from './bio-config';

export default function DesktopBio({ slides }) {
  // Use slides prop instead of imported desktopBioSlides
  // ... rest of component
}
```

**Step 3: Test Bio page**

Navigate to: http://localhost:5173/bio

Expected: Bio page loads with Tina data

**Step 4: Commit**

```bash
git add src/pages/Bio/
git commit -m "feat: update Bio page to use Tina CMS data"
```

---

### Task 22: Update Kalendarz Component

**Files:**
- Modify: `src/pages/Kalendarz/index.jsx`
- Modify: `src/pages/Kalendarz/DesktopKalendarz.jsx`

**Step 1: Update Kalendarz index**

Modify `src/pages/Kalendarz/index.jsx`:

```jsx
import ResponsiveWrapper from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import DesktopKalendarz from './DesktopKalendarz';
import MobileKalendarz from './MobileKalendarz';
import { useKalendarzEvents } from '../../hooks/useTinaContent';

export default function Kalendarz() {
  const { data: events, loading } = useKalendarzEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopKalendarz events={events} />}
      mobileContent={<MobileKalendarz events={events} />}
    />
  );
}
```

**Step 2: Update DesktopKalendarz to accept events prop**

Modify `src/pages/Kalendarz/DesktopKalendarz.jsx`:

```jsx
// Remove: import { events } from './kalendarz-config';

export default function DesktopKalendarz({ events }) {
  // Use events prop
  // ... rest of component
}
```

**Step 3: Test Kalendarz page**

Navigate to: http://localhost:5173/kalendarz

Expected: Kalendarz loads with Tina events

**Step 4: Commit**

```bash
git add src/pages/Kalendarz/
git commit -m "feat: update Kalendarz page to use Tina CMS data"
```

---

### Task 23: Update Remaining Components (Archiwalne, Media, MediaWideo)

**Files:**
- Modify: `src/pages/Archiwalne/index.jsx`
- Modify: `src/pages/Media/index.jsx`
- Modify: `src/pages/MediaWideo/index.jsx`

**Step 1: Update Archiwalne**

Modify `src/pages/Archiwalne/index.jsx`:

```jsx
import { useArchivalneEvents } from '../../hooks/useTinaContent';

export default function Archiwalne() {
  const { data: events, loading } = useArchivalneEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopArchiwalne events={events} />}
      mobileContent={<MobileArchiwalne events={events} />}
    />
  );
}
```

**Step 2: Update Media**

Modify `src/pages/Media/index.jsx`:

```jsx
import { useMediaGalleries } from '../../hooks/useTinaContent';

export default function Media() {
  const { data: galleries, loading } = useMediaGalleries();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMedia galleries={galleries} />}
      mobileContent={<MobileMedia galleries={galleries} />}
    />
  );
}
```

**Step 3: Update MediaWideo**

Modify `src/pages/MediaWideo/index.jsx`:

```jsx
import { useMediaWideoVideos } from '../../hooks/useTinaContent';

export default function MediaWideo() {
  const { data: videos, loading } = useMediaWideoVideos();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveWrapper
      desktopContent={<DesktopMediaWideo videos={videos} />}
      mobileContent={<MobileMediaWideo videos={videos} />}
    />
  );
}
```

**Step 4: Test all pages**

Navigate to each page and verify data loads correctly

**Step 5: Commit**

```bash
git add src/pages/Archiwalne/ src/pages/Media/ src/pages/MediaWideo/
git commit -m "feat: update remaining pages to use Tina CMS data"
```

---

## Phase 8: Finalize and Documentation

### Task 24: Add Admin Route

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add admin route to React Router**

Modify `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router';
import { LanguageProvider } from './context/LanguageContext';
import Homepage from './pages/Homepage';
import Bio from './pages/Bio';
// ... other imports
import TinaAdmin from './pages/TinaAdmin';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/bio" element={<Bio />} />
          {/* ... other routes */}
          <Route path="/admin" element={<TinaAdmin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
```

**Step 2: Create TinaAdmin component**

Create `src/pages/TinaAdmin/index.jsx`:

```jsx
import { TinaAdmin as TinaAdminInner } from 'tinacms';

export default function TinaAdmin() {
  return <TinaAdminInner />;
}
```

**Step 3: Test admin panel**

Navigate to: http://localhost:5173/admin

Expected: Tina admin panel loads with all collections

**Step 4: Commit**

```bash
git add src/App.jsx src/pages/TinaAdmin/
git commit -m "feat: add /admin route for Tina CMS panel"
```

---

### Task 25: Create Client Documentation

**Files:**
- Create: `docs/CLIENT_CMS_GUIDE.md`

**Step 1: Write client documentation**

Create `docs/CLIENT_CMS_GUIDE.md`:

```markdown
# Kompopolex CMS - Instrukcja dla Klienta

## Logowanie do panelu administracyjnego

1. Wejdź na stronę: **https://kompopolex.com/admin**
2. Kliknij "Login with Tina Cloud"
3. Zaloguj się swoim kontem email lub GitHub

---

## Jak edytować treści?

### Homepage - Slajdy główne

1. W menu po lewej wybierz **"Homepage Slides"**
2. Kliknij na slajd, który chcesz edytować (np. "desktop-slide-1")
3. Edytuj pola:
   - **Tagline** - zmień tekst pod głównym słowem
   - **Hero Image** - kliknij aby zmienić zdjęcie
   - **Background Color** - zmień kolor tła
4. Kliknij **"Save"** na górze

**Zmiany pojawią się na stronie po ~2 minutach (Vercel auto-deploy).**

---

### Bio - Biografie członków zespołu

1. Wybierz **"Bio"** z menu
2. Kliknij na bio osoby (np. "bio2-aleksandra")
3. Edytuj:
   - **Name** - imię i nazwisko
   - **Paragraphs** - tekst biografii (każdy akapit osobno)
   - **Photo** - zdjęcie osoby
4. Kliknij **"Save"**

---

### Kalendarz - Nadchodzące wydarzenia

1. Wybierz **"Kalendarz (Upcoming Events)"**
2. **Aby dodać nowe wydarzenie:**
   - Kliknij **"Create New"**
   - Wypełnij wszystkie pola:
     - **Date & Time** - format: `DD.MM.YY | HH:MM` (np. `15.03.26 | 19:00`)
     - **Title** - nazwa wydarzenia
     - **Performers** - wykonawcy (oddzieleni przecinkami)
     - **Description** - opis wydarzenia
     - **Location** - miejsce (możesz użyć Enter dla nowej linii)
     - **Event Image** - zdjęcie wydarzenia
   - Kliknij **"Save"**

3. **Aby edytować wydarzenie:**
   - Kliknij na istniejące wydarzenie
   - Zmień pola
   - Kliknij **"Save"**

4. **Aby usunąć wydarzenie:**
   - Kliknij na wydarzenie
   - Kliknij ikonę kosza (🗑️) na górze
   - Potwierdź usunięcie

---

### Archiwum - Wydarzenia archiwalne

Działa identycznie jak Kalendarz, tylko w kolekcji **"Archiwalne"**.

---

### Media - Galerie zdjęć

1. Wybierz **"Media (Photo Galleries)"**
2. **Aby dodać nową galerię:**
   - Kliknij **"Create New"**
   - **Thumbnail Image** - główne zdjęcie (miniaturka)
   - **Gallery Title** - nazwa galerii
   - **Photographer** - fotograf
   - **Gallery Images** - kliknij "Add Item" aby dodać kolejne zdjęcia
   - Kliknij **"Save"**

---

### Wideo - Filmy YouTube

1. Wybierz **"Media Wideo (Videos)"**
2. **Aby dodać nowy film:**
   - Kliknij **"Create New"**
   - **Thumbnail** - miniaturka filmu
   - **Video Title** - tytuł filmu
   - **YouTube URL** - pełny link do filmu (np. `https://www.youtube.com/watch?v=abc123`)
   - Kliknij **"Save"**

---

## Uploadowanie zdjęć

1. Kliknij w pole z typem **"Image"**
2. Kliknij **"Upload"**
3. Wybierz plik z komputera
4. Poczekaj na upload
5. Kliknij **"Insert"**

**Zalecane formaty:**
- JPG dla zdjęć (lżejsze)
- PNG dla grafik z przezroczystością
- SVG dla logo i ikon

---

## Jak anulować zmiany?

Jeśli edytujesz dokument i chcesz cofnąć zmiany:
- **Nie klikaj "Save"**
- Wyjdź z dokumentu (kliknij inny dokument lub cofnij strzałką przeglądarki)
- Twoje niezapisane zmiany zostaną porzucone

---

## Co robić gdy coś nie działa?

1. **Odśwież stronę** (F5)
2. **Wyloguj się i zaloguj ponownie**
3. **Sprawdź czy wszystkie wymagane pola są wypełnione** (czerwona gwiazdka *)
4. **Skontaktuj się z deweloperem** jeśli problem nie ustępuje

---

## Ważne informacje

- ⏱️ **Zmiany pojawiają się na stronie po ~2 minutach** (czas na Vercel deploy)
- 💾 **Wszystkie zmiany są automatycznie zapisywane w git** (możemy cofnąć każdą zmianę)
- 🖼️ **Maksymalny rozmiar obrazu: 10MB** (zalecane < 2MB dla lepszej wydajności)
- 🎨 **Pixel-perfect design** - nie zmieniaj pozycji i rozmiarów bez konsultacji z deweloperem

---

**Masz pytania? Napisz do dewelopera!**
```

**Step 2: Commit documentation**

```bash
git add docs/CLIENT_CMS_GUIDE.md
git commit -m "docs: add client CMS usage guide"
```

---

### Task 26: Update Project README

**Files:**
- Modify: `README.md`

**Step 1: Add Tina CMS section to README**

Add to `README.md`:

```markdown
## Tina CMS

This project uses **Tina CMS** for content management.

### For Developers

**Start dev server with Tina:**
```bash
npm run dev
```

**Access admin panel:**
http://localhost:5173/admin

**Environment variables required:**
```bash
TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_read_only_token
TINA_BRANCH=main
```

Get credentials from: https://app.tina.io

**Content location:**
- All content is stored in `/content` directory as JSON files
- Managed through Tina admin panel at `/admin` route
- All changes create git commits → Vercel auto-deploys

### For Clients

See full client guide: [docs/CLIENT_CMS_GUIDE.md](docs/CLIENT_CMS_GUIDE.md)

**Quick start:**
1. Go to: https://kompopolex.com/admin
2. Login with Tina Cloud credentials
3. Edit content in visual editor
4. Click "Save" - changes go live in ~2 minutes
```

**Step 2: Commit README update**

```bash
git add README.md
git commit -m "docs: add Tina CMS section to README"
```

---

### Task 27: Deprecate Old Config Files

**Files:**
- Modify: `src/pages/Homepage/slides-config.js`
- Modify: `src/pages/Bio/bio-config.js`
- Modify: `src/pages/Kalendarz/kalendarz-config.js`
- And other config files

**Step 1: Add deprecation notice to old config files**

Add at top of each `-config.js` file:

```javascript
/**
 * @deprecated This file is deprecated and will be removed in future version.
 * Content is now managed through Tina CMS.
 * See: docs/CLIENT_CMS_GUIDE.md
 *
 * DO NOT EDIT THIS FILE - use Tina admin panel at /admin instead.
 */
```

**Step 2: Commit deprecation notices**

```bash
git add src/pages/**/\*-config.js
git commit -m "docs: deprecate old config files in favor of Tina CMS"
```

---

### Task 28: Final Testing Checklist

**Files:**
- None (manual testing)

**Step 1: Test all pages load correctly**

Navigate to each page and verify:
- ✅ Homepage loads with slides
- ✅ Bio loads with 4 members
- ✅ Kalendarz shows events
- ✅ Archiwalne shows archived events
- ✅ Media shows galleries
- ✅ MediaWideo shows videos

**Step 2: Test Tina admin panel**

1. Navigate to `/admin`
2. Login with Tina Cloud
3. Edit a piece of content (e.g., Homepage slide tagline)
4. Save changes
5. Verify changes appear in admin preview
6. Refresh frontend page - verify changes persist

**Step 3: Test content CRUD operations**

**Create:**
- Add new event in Kalendarz
- Verify it appears on frontend

**Update:**
- Edit existing Bio entry
- Verify changes appear

**Delete:**
- Remove test event
- Verify it's gone from frontend

**Step 4: Test media upload**

- Upload new image through Tina
- Use it in an event
- Verify image displays correctly

**Step 5: Document any issues**

Create issues for any bugs found

---

### Task 29: Production Deployment

**Files:**
- None (Vercel dashboard)

**Step 1: Merge to main branch**

```bash
git checkout main
git merge [feature-branch-name]
git push origin main
```

**Step 2: Verify Vercel deployment**

Check Vercel dashboard for successful deployment

**Step 3: Test production admin panel**

Navigate to: https://kompopolex.com/admin

Login and verify admin panel works on production

**Step 4: Invite client to Tina Cloud**

In Tina Cloud dashboard:
1. Go to project settings
2. Click "Invite User"
3. Enter client email
4. Send invitation

**Step 5: Client onboarding**

- Send client the link to `docs/CLIENT_CMS_GUIDE.md`
- Walk them through first content edit
- Verify they can login and make changes

---

## Phase 9: Optional Enhancements

### Task 30: Add Content Validation Rules (Optional)

**Files:**
- Modify: `tina/config.ts`

**Step 1: Add validation to date fields**

In Kalendarz schema, update date field:

```typescript
{
  type: "string",
  name: "date",
  label: "Date & Time",
  required: true,
  description: "Format: DD.MM.YY | HH:MM",
  ui: {
    validate: (value) => {
      const regex = /^\d{2}\.\d{2}\.\d{2} \| \d{2}:\d{2}$/;
      if (!regex.test(value)) {
        return "Date must be in format: DD.MM.YY | HH:MM";
      }
    },
  },
},
```

**Step 2: Add image size recommendations**

Add to image fields:

```typescript
{
  type: "image",
  name: "image",
  label: "Event Image",
  required: true,
  description: "Recommended: 330x462px, max 2MB",
},
```

**Step 3: Test validation**

Try entering invalid date format in admin - should show error

**Step 4: Commit**

```bash
git add tina/config.ts
git commit -m "feat: add content validation rules to Tina schema"
```

---

### Task 31: Setup Tina Media Manager (Optional)

**Files:**
- Modify: `tina/config.ts`

**Step 1: Configure media settings for better organization**

Update media config in `tina/config.ts`:

```typescript
media: {
  tina: {
    mediaRoot: "assets",
    publicFolder: "public",
    // Optional: organize uploads by type
    loadCustomStore: async () => {
      return {
        persist: async (files) => {
          // Custom upload logic if needed
        },
      };
    },
  },
},
```

**Step 2: Create media folders structure**

```bash
mkdir -p public/assets/uploads/kalendarz
mkdir -p public/assets/uploads/bio
mkdir -p public/assets/uploads/media
```

**Step 3: Document media organization**

Add to client guide:
- Where to upload images for each content type
- Naming conventions

---

## Success Criteria

✅ **Tina CMS installed and configured**
✅ **All content migrated from JS configs to Tina**
✅ **Admin panel accessible at /admin**
✅ **Client can login and edit content**
✅ **Changes auto-deploy to production via Vercel**
✅ **Client documentation created**
✅ **Old config files deprecated**
✅ **All pages load correctly with Tina data**

---

## Rollback Plan

If Tina CMS causes issues:

1. **Revert commits:**
   ```bash
   git revert [commit-hash]..HEAD
   git push origin main
   ```

2. **Keep old config files** (don't delete them during migration)

3. **Components still have fallback** to old imports if needed

---

## Time Estimate

- **Phase 1-2 (Setup + Homepage):** 2-3 hours
- **Phase 3-5 (Migrate content):** 3-4 hours
- **Phase 6-7 (Auth + Components):** 2-3 hours
- **Phase 8 (Docs + Testing):** 1-2 hours

**Total: 8-12 hours of focused work**

Split over 2-3 days for proper testing.

---

## Next Steps After Completion

1. **Train client** on using Tina admin panel
2. **Monitor first week** of client usage for issues
3. **Optimize performance** if bundle size is concern
4. **Add more collections** (Repertuar, Specjalne, Fundacja, Kontakt)
5. **Setup automated backups** of content directory
6. **Consider Tina paid tier** if free tier limits are reached

---

**End of Plan**
