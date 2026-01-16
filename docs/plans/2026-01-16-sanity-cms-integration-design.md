# Sanity CMS Integration - Design Document

**Date**: 2026-01-16
**Project**: Kompopolex Website
**Author**: Claude (via brainstorming session)

## Executive Summary

Integration of Sanity.io headless CMS to enable non-technical users to manage content (events, bio profiles, media) while maintaining pixel-perfect Figma implementation approach.

**Selected Solution**: Sanity.io (cloud-hosted, freemium)
**Deployment**: Vercel (Sanity Studio + React frontend)
**Migration Strategy**: Gradual replacement of hardcoded config files with CMS-driven content

---

## Requirements

### User Profile
- **Primary users**: Non-technical (musicians, managers)
- **Technical requirement**: Simple GUI, no code editing needed

### Key Features
- **Draft/Publish workflow**: Save drafts before publishing
- **Simple preview**: Preview button to check changes
- **Balance**: Simple enough for daily use, powerful enough for future needs

### Constraints
- **Budget**: Free/freemium solution
- **Hosting**: Vercel deployment
- **Design fidelity**: Must maintain pixel-perfect Figma implementation

---

## Architecture Overview

### High-Level Structure

```
┌─────────────────┐
│  Sanity Studio  │  <- Admin panel (studio.kompopolex.pl)
│   (React app)   │
└────────┬────────┘
         │
         │ Publish/Save
         ↓
┌─────────────────┐
│ Sanity Content  │  <- Cloud dataset (Sanity infrastructure)
│      Lake       │
└────────┬────────┘
         │
         │ GROQ API
         ↓
┌─────────────────┐
│  React Frontend │  <- Vite app (kompopolex.pl)
│   (Vite + React)│
└─────────────────┘
```

### Project Structure

```
/home/ilusi0n/repo/kompo/
├── sanity-studio/              # NEW - Sanity admin panel
│   ├── schemas/
│   │   ├── index.js           # Schema registry
│   │   ├── event.js           # Event schema
│   │   ├── bioProfile.js      # Bio profile schema
│   │   └── media.js           # Media schema
│   ├── sanity.config.js       # Sanity configuration
│   ├── sanity.cli.js          # CLI configuration
│   └── package.json           # Studio dependencies
│
├── src/                        # EXISTING - Frontend
│   ├── lib/
│   │   └── sanity/            # NEW - Sanity client
│   │       ├── client.js      # Client setup
│   │       └── queries.js     # GROQ queries
│   └── pages/                 # EXISTING - Page components
│       ├── Kalendarz/
│       ├── Bio/
│       └── ...
│
├── scripts_project/            # BACKUP - Old config files
│   ├── kalendarz-config.js.bak
│   └── bio-config.js.bak
│
└── docs/
    └── plans/
        └── 2026-01-16-sanity-cms-integration-design.md
```

### Deployment

| Component | URL | Hosting |
|-----------|-----|---------|
| Sanity Studio | `studio.kompopolex.pl` | Vercel |
| Frontend | `kompopolex.pl` | Vercel |
| Content Lake | Sanity Cloud | Sanity infrastructure |

---

## Content Schemas

### 1. Event Schema

**Purpose**: Manage events for Kalendarz page (upcoming/archived)

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Event title (e.g., "ENSEMBLE KOMPOPOLEX") |
| `date` | datetime | Yes | Event date and time |
| `performers` | text | No | Comma-separated performers (optional if program exists) |
| `program` | array(object) | No | Array of {composer, piece} objects |
| `description` | text | Yes | Event description |
| `location` | text | Yes | Venue location |
| `image` | image | Yes | Event photo (with hotspot support) |
| `imageStyle` | object | No | Figma CSS positioning (objectFit, objectPosition, width, height, left, top) |
| `status` | string | Yes | "upcoming" or "archived" |
| `publishedAt` | datetime | No | If empty = draft, if filled = published |

**Preview**:
- Title: Event title
- Subtitle: Formatted date (pl-PL locale)
- Media: Event image

**Implementation**:
```javascript
// sanity-studio/schemas/event.js
export default {
  name: 'event',
  title: 'Wydarzenia',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Data i godzina',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'performers',
      title: 'Wykonawcy',
      type: 'text',
      description: 'Opcjonalne - jeśli brak, użyj Program'
    },
    {
      name: 'program',
      title: 'Program',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'composer', type: 'string', title: 'Kompozytor'},
          {name: 'piece', type: 'string', title: 'Utwór'}
        ]
      }]
    },
    {
      name: 'description',
      title: 'Opis',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'location',
      title: 'Lokalizacja',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: Rule => Rule.required()
    },
    {
      name: 'imageStyle',
      title: 'Styl obrazu (Figma CSS)',
      type: 'object',
      description: 'Pozycjonowanie z Figma',
      fields: [
        {name: 'objectFit', type: 'string'},
        {name: 'objectPosition', type: 'string'},
        {name: 'width', type: 'string'},
        {name: 'height', type: 'string'},
        {name: 'left', type: 'string'},
        {name: 'top', type: 'string'}
      ]
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Nadchodzące', value: 'upcoming'},
          {title: 'Archiwalne', value: 'archived'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      description: 'Gdy wypełnione - event jest opublikowany'
    }
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image'
    },
    prepare({title, date, media}) {
      return {
        title,
        subtitle: new Date(date).toLocaleDateString('pl-PL'),
        media
      }
    }
  }
}
```

### 2. Bio Profile Schema

**Purpose**: Manage artist bio profiles (slider pages)

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Artist/ensemble name |
| `order` | number | Yes | Display order (1, 2, 3, 4) |
| `backgroundColor` | color | Yes | Slide background color (hex) |
| `lineColor` | color | Yes | Decorative line color (hex) |
| `textColor` | color | Yes | Text color (hex) |
| `image` | image | Yes | Profile photo (with hotspot) |
| `imageStyle` | object | No | Figma CSS positioning |
| `paragraphs` | array(text) | Yes | Bio text paragraphs |
| `paragraphTops` | array(number) | No | Y positions for each paragraph (desktop) |
| `hasFooter` | boolean | No | Show footer (default: false, only Bio4) |
| `publishedAt` | datetime | No | If empty = draft, if filled = published |

**Preview**:
- Title: "{order}. {name}"
- Media: Profile image

**Ordering**: Default sort by `order` field (ascending)

**Implementation**:
```javascript
// sanity-studio/schemas/bioProfile.js
export default {
  name: 'bioProfile',
  title: 'Profile Bio',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'backgroundColor',
      title: 'Kolor tła',
      type: 'color',
      validation: Rule => Rule.required()
    },
    {
      name: 'lineColor',
      title: 'Kolor linii',
      type: 'color',
      validation: Rule => Rule.required()
    },
    {
      name: 'textColor',
      title: 'Kolor tekstu',
      type: 'color',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: {hotspot: true},
      validation: Rule => Rule.required()
    },
    {
      name: 'imageStyle',
      title: 'Styl obrazu (Figma CSS)',
      type: 'object',
      fields: [
        {name: 'width', type: 'string'},
        {name: 'height', type: 'string'},
        {name: 'left', type: 'string'},
        {name: 'top', type: 'string'},
        {name: 'objectFit', type: 'string'},
        {name: 'objectPosition', type: 'string'}
      ]
    },
    {
      name: 'paragraphs',
      title: 'Paragrafy',
      type: 'array',
      of: [{type: 'text'}],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'paragraphTops',
      title: 'Pozycje Y paragrafów (desktop)',
      type: 'array',
      of: [{type: 'number'}],
      description: 'Pozycje top dla każdego paragrafu w px'
    },
    {
      name: 'hasFooter',
      title: 'Pokaż stopkę',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'name',
      order: 'order',
      media: 'image'
    },
    prepare({title, order, media}) {
      return {
        title: `${order}. ${title}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Kolejność',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}]
    }
  ]
}
```

### 3. Media Schema

**Purpose**: Manage media gallery items (photos/videos) - for future expansion

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Media title |
| `type` | string | Yes | "photo" or "video" |
| `file` | image | Yes (if photo) | Image file |
| `videoUrl` | url | Yes (if video) | YouTube/Vimeo URL |
| `publishedAt` | datetime | No | Draft/publish control |

**Implementation**:
```javascript
// sanity-studio/schemas/media.js
export default {
  name: 'mediaItem',
  title: 'Media',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Zdjęcie', value: 'photo'},
          {title: 'Wideo', value: 'video'}
        ]
      }
    },
    {
      name: 'file',
      title: 'Plik',
      type: 'image',
      validation: Rule => Rule.required()
    },
    {
      name: 'videoUrl',
      title: 'URL Wideo (YouTube/Vimeo)',
      type: 'url',
      hidden: ({parent}) => parent?.type !== 'video'
    },
    {
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime'
    }
  ]
}
```

---

## Data Flow & Integration

### Data Fetching Strategy

**Approach**: Runtime client-side fetch (recommended for initial implementation)

**Rationale**:
- Always up-to-date content (no rebuild needed)
- Simpler implementation
- Sanity CDN provides caching
- Can optimize to build-time later if needed

**Alternative** (future optimization):
- Build-time fetch: Generate static JSON during `npm run build`
- Trade-off: Requires rebuild after content changes

### Sanity Client Setup

**Dependencies**:
```json
{
  "@sanity/client": "^6.0.0",
  "@sanity/image-url": "^1.0.0"
}
```

**Client configuration**:
```javascript
// src/lib/sanity/client.js
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for faster reads
})

// Image URL builder helper
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
```

**Environment variables** (`.env`):
```bash
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
```

### GROQ Queries

**Query definitions**:
```javascript
// src/lib/sanity/queries.js

// Upcoming events (published only)
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

// Archived events (published only)
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

// Bio profiles (published only, ordered)
export const bioProfilesQuery = `
  *[_type == "bioProfile" && defined(publishedAt)] | order(order asc) {
    _id,
    name,
    order,
    backgroundColor,
    lineColor,
    textColor,
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
    imageStyle
  }
`
```

**GROQ syntax notes**:
- `*[filter]` - Query documents with filter
- `defined(publishedAt)` - Only published content (draft/publish workflow)
- `order(field asc/desc)` - Sorting
- `"imageUrl": image.asset->url` - Dereference image to URL
- `[0]` - Get first element (for single document queries)
- `$id` - Query parameter

### Component Integration

**Example**: Kalendarz page integration

**Before** (hardcoded config):
```javascript
// src/pages/Kalendarz/kalendarz-config.js
export const events = [
  {
    id: 1,
    date: '13.12.25 | 18:00',
    title: 'ENSEMBLE KOMPOPOLEX',
    // ...
  }
]
```

**After** (Sanity-driven):
```javascript
// src/pages/Kalendarz/DesktopKalendarz.jsx
import { useState, useEffect } from 'react';
import { client } from '../../lib/sanity/client';
import { upcomingEventsQuery } from '../../lib/sanity/queries';

export default function DesktopKalendarz() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.fetch(upcomingEventsQuery)
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd ładowania wydarzeń</div>;

  return (
    <div className="relative" style={{width: '1440px', height: '2047px'}}>
      {/* Existing layout code */}
      {events.map((event, idx) => (
        <div key={event._id} className="event-card">
          <img
            src={event.imageUrl}
            alt={event.title}
            style={event.imageStyle}
          />
          <h3>{event.title}</h3>
          <p>{new Date(event.date).toLocaleString('pl-PL')}</p>
          <p>{event.performers}</p>
          <p>{event.description}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}
```

**Key changes**:
1. Replace import of config file with Sanity client import
2. Add React hooks for state management (events, loading, error)
3. Fetch data in `useEffect`
4. Handle loading and error states
5. Map over fetched events (same rendering logic)
6. Use `event.imageUrl` instead of local path
7. Format date with `Date` object

**Performance optimization** (future):
- Add React Query or SWR for caching
- Add loading skeleton UI
- Implement pagination if events > 10

---

## Migration Strategy

### Phase 1: Setup (Week 1)

1. **Initialize Sanity project**
   ```bash
   cd /home/ilusi0n/repo/kompo
   npm create sanity@latest -- --project sanity-studio
   cd sanity-studio
   npm install
   ```

2. **Create schemas** (event.js, bioProfile.js, media.js)

3. **Deploy Sanity Studio to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Configure custom domain**: `studio.kompopolex.pl`

### Phase 2: Frontend Integration (Week 1-2)

1. **Install Sanity client**
   ```bash
   npm install @sanity/client @sanity/image-url
   ```

2. **Create client setup** (`src/lib/sanity/client.js`)

3. **Define GROQ queries** (`src/lib/sanity/queries.js`)

4. **Add environment variables** (`.env`)

### Phase 3: Gradual Content Migration (Week 2-3)

**Approach**: Feature flag for safe rollout

1. **Add feature flag**:
   ```javascript
   // .env
   VITE_USE_SANITY=false  # Start with false
   ```

2. **Implement dual-source logic**:
   ```javascript
   // src/pages/Kalendarz/DesktopKalendarz.jsx
   const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

   useEffect(() => {
     if (USE_SANITY) {
       // Fetch from Sanity
       client.fetch(upcomingEventsQuery).then(setEvents);
     } else {
       // Use hardcoded config (fallback)
       import('./kalendarz-config').then(m => setEvents(m.events));
     }
   }, []);
   ```

3. **Migration order**:
   - Step 1: Migrate **Kalendarz** (events) - simplest, most dynamic content
   - Step 2: Migrate **Bio** profiles - verify color/image handling
   - Step 3: Migrate **Media** - test with photos/videos

4. **Verification per page**:
   - Import existing data to Sanity Studio
   - Enable feature flag for page: `VITE_USE_SANITY=true`
   - Run visual verification: `make verify-section SECTION=...`
   - Compare pixel diff (must be <8%)
   - If PASSED → keep Sanity
   - If FAILED → debug, fix imageStyle mapping

5. **Cleanup**:
   - After all pages verified → remove feature flag
   - Move old config files to `scripts_project/*.bak`
   - Update documentation

### Phase 4: Training & Handoff (Week 3-4)

1. **Create user guide** (Polish language):
   - How to add new event
   - How to edit bio profile
   - How to upload images
   - Draft vs Publish workflow
   - Preview functionality

2. **Create video walkthrough** (screen recording)

3. **Initial data entry session** with non-tech users

4. **Collect feedback** and iterate on UX

---

## Testing & Verification

### Visual Verification

**Requirement**: All pages must maintain pixel-perfect fidelity after CMS migration

**Process**:
1. Import existing content to Sanity
2. Deploy frontend with Sanity integration
3. Run section verification:
   ```bash
   make verify-section SECTION=kalendarz SECTIONS_CONFIG=scripts_project/sections-config.json
   ```
4. Check HTML report: pixel diff must be ≤8%
5. If failed: debug imageStyle mapping, re-verify

**Critical test cases**:
- Events with `objectFit: cover` vs complex positioning
- Bio profiles with different color schemes
- Image hotspot handling
- Paragraph positioning (paragraphTops array)

### Data Integrity

**Tests**:
1. **Draft/Publish workflow**:
   - Create event without `publishedAt` → should NOT appear on frontend
   - Add `publishedAt` → should appear immediately

2. **Image handling**:
   - Upload high-res image (2MB+) → Sanity auto-optimizes
   - Verify `imageUrl` generates correct CDN URL
   - Test hotspot positioning

3. **Query performance**:
   - Measure fetch time for `upcomingEventsQuery`
   - Target: <500ms (Sanity CDN should deliver <200ms)

4. **Error handling**:
   - Disconnect internet → frontend should show error state
   - Invalid query → log error, show fallback UI

### User Acceptance Testing

**Scenarios** (with non-tech users):
1. Add new upcoming event
2. Edit existing event (change date)
3. Move event from upcoming → archived
4. Upload and crop image
5. Save as draft, preview, publish
6. Edit bio profile text

**Success criteria**:
- User can complete all tasks without developer help
- No confusion about draft vs published state
- Image upload/crop intuitive
- Preview works as expected

---

## Deployment Plan

### Sanity Studio Deployment

**Platform**: Vercel
**Domain**: `studio.kompopolex.pl`

**Steps**:
1. Build Studio:
   ```bash
   cd sanity-studio
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Configure custom domain in Vercel dashboard

4. Set CORS origins in Sanity project settings:
   - `https://kompopolex.pl`
   - `https://studio.kompopolex.pl`
   - `http://localhost:5173` (dev)

### Frontend Deployment

**Platform**: Vercel (existing)
**Domain**: `kompopolex.pl`

**Environment variables** (Vercel dashboard):
```
VITE_SANITY_PROJECT_ID=<project-id>
VITE_SANITY_DATASET=production
```

**Build command** (unchanged):
```bash
npm run build
```

**Deploy**:
```bash
vercel --prod
```

### Database (Content Lake)

**Hosting**: Sanity Cloud
**Dataset**: `production`
**Backup**: Automatic (Sanity provides built-in backups)

**Additional dataset** (optional):
- `staging` - for testing schema changes before production

---

## Cost Analysis

### Sanity Free Tier Limits

| Resource | Free Tier | Kompopolex Estimate | Status |
|----------|-----------|---------------------|--------|
| Users | 3 | 2-3 (admins) | ✅ OK |
| Documents | 10,000 | ~50-100 (events + bio + media) | ✅ OK |
| Assets (images) | 5GB | ~500MB (estimated) | ✅ OK |
| API requests | 100k/month | ~10k/month (low traffic) | ✅ OK |
| Bandwidth | 10GB/month | ~2GB/month | ✅ OK |

**Verdict**: Free tier is sufficient for foreseeable future

**Paid tier** (if needed later):
- **Growth**: $99/month - 10 users, 1M documents, 50GB assets
- Unlikely to need for this project scale

### Vercel Costs

**Sanity Studio**:
- Static build (Next.js)
- Free tier: 100GB bandwidth/month
- Estimate: <1GB/month → **FREE**

**Frontend** (unchanged):
- Existing Vercel deployment
- No additional costs

**Total monthly cost**: **$0**

---

## Security & Access Control

### Sanity Project Access

**Roles**:
1. **Administrator** (developer):
   - Full access to Studio, datasets, API tokens
   - Can modify schemas

2. **Editor** (non-tech users):
   - Access to Studio only
   - Can create/edit/publish documents
   - Cannot modify schemas or project settings

**Setup**:
- Invite users via Sanity dashboard
- Assign "Editor" role to non-tech users

### API Security

**Public access** (read-only):
- Frontend uses CDN-enabled queries (no token needed)
- Only published content (`defined(publishedAt)`) is accessible
- Drafts are NOT exposed to public API

**Private access** (admin):
- Studio uses authenticated token
- Write operations require authentication

**CORS configuration**:
- Whitelist only trusted domains:
  - `https://kompopolex.pl`
  - `https://studio.kompopolex.pl`
  - `http://localhost:5173` (dev only)

### Asset Protection

**Images**:
- Uploaded to Sanity CDN
- Public URLs (by design for web use)
- Auto-optimized (WebP, responsive sizes)

**Recommendation**: Do not upload sensitive/private images

---

## Maintenance & Operations

### Content Workflow

**Typical flow** (non-tech user):
1. Log in to `studio.kompopolex.pl`
2. Navigate to "Wydarzenia" (Events)
3. Click "+ Create" → "Event"
4. Fill in fields (title, date, description, etc.)
5. Upload image → adjust hotspot if needed
6. **Save** (draft) → preview on frontend
7. **Publish** → fill `publishedAt` field → visible on live site

**Draft vs Published**:
- **Draft**: `publishedAt` is empty → NOT visible on frontend
- **Published**: `publishedAt` has date → visible on frontend

### Schema Changes

**Process**:
1. Developer edits schema file (e.g., `event.js`)
2. Deploy Studio: `npm run build && vercel --prod`
3. Sanity auto-migrates existing documents (non-destructive)
4. Test in Studio → verify frontend queries

**Breaking changes** (avoid):
- Renaming fields → breaks existing queries
- Removing required fields → existing docs become invalid

**Safe changes**:
- Adding optional fields
- Modifying field descriptions
- Changing field order in Studio

### Monitoring

**Metrics to track**:
1. **API response time**: Sanity dashboard → Usage tab
2. **Error rate**: Frontend console logs, Sentry (if integrated)
3. **Content freshness**: Last published date per content type

**Alerting** (optional):
- Set up Vercel Analytics for frontend performance
- Sanity webhook → notify on schema changes

### Backup & Recovery

**Sanity backups**:
- Automatic daily backups (included in free tier)
- Export dataset: `sanity dataset export production backup.tar.gz`

**Recovery**:
- Import from backup: `sanity dataset import backup.tar.gz production`
- Point-in-time recovery (contact Sanity support)

**Disaster recovery plan**:
1. Export dataset weekly (cron job)
2. Store in Git LFS or S3
3. Document import procedure in runbook

---

## Future Enhancements

### Short-term (1-3 months)

1. **Rich text editor** for event descriptions:
   - Current: Plain text
   - Future: Portable Text (Sanity's rich text format)
   - Benefit: Bold, italic, links in descriptions

2. **Image optimization presets**:
   - Define standard sizes for event images
   - Auto-generate responsive images

3. **Search functionality**:
   - Search events by title, performer, location
   - Use Sanity's full-text search

### Medium-term (3-6 months)

1. **Localization** (i18n):
   - English translations for international audience
   - Use `@sanity/language-filter` plugin

2. **Event categories/tags**:
   - Tag events (concert, workshop, festival)
   - Filter by tag on frontend

3. **Related events**:
   - Suggest related events based on performers/tags

### Long-term (6-12 months)

1. **Editorial workflow**:
   - Multi-stage approval (draft → review → published)
   - Use Sanity Workflows plugin (paid tier)

2. **Analytics integration**:
   - Track which events get most views
   - A/B test descriptions/images

3. **Webhooks**:
   - Auto-notify social media on new event publish
   - Integrate with email newsletter (Mailchimp)

---

## Risks & Mitigations

### Risk 1: Vendor Lock-in

**Risk**: Content stored in Sanity Cloud, hard to migrate
**Likelihood**: Low (Sanity has export APIs)
**Impact**: Medium (requires rebuild if migrating)

**Mitigation**:
- Regular dataset exports (weekly backup)
- Content structure mirrors JSON schema (portable)
- Sanity dataset is essentially JSON (easy to import elsewhere)

### Risk 2: API Downtime

**Risk**: Sanity API outage breaks frontend
**Likelihood**: Very low (99.9% SLA)
**Impact**: High (site shows no content)

**Mitigation**:
- Implement fallback to cached data (React Query stale-while-revalidate)
- Show error state with contact info
- Monitor Sanity status page: https://status.sanity.io

### Risk 3: Free Tier Limits

**Risk**: Exceed free tier (10k docs, 5GB assets)
**Likelihood**: Low (current estimate: 100 docs, 500MB)
**Impact**: Medium (need to pay $99/month)

**Mitigation**:
- Monitor usage in Sanity dashboard
- Archive old events (soft delete, keep in dataset)
- Compress images before upload (Sanity auto-optimizes but still counts toward quota)

### Risk 4: Schema Breaking Changes

**Risk**: Developer accidentally breaks queries
**Likelihood**: Medium (human error)
**Impact**: High (frontend breaks)

**Mitigation**:
- Use TypeScript types generated from schema
- Test queries in Sanity Vision plugin before deploying
- Version schema files in Git
- Staging dataset for testing changes

### Risk 5: Non-tech User Confusion

**Risk**: Users struggle with Studio UI
**Likelihood**: Medium (learning curve)
**Impact**: Medium (content not updated)

**Mitigation**:
- Comprehensive training (video + written guide)
- Simplify schemas (hide advanced fields)
- Regular check-ins (monthly) to answer questions
- Document common tasks in Polish

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Visual fidelity | ≤8% pixel diff | `make verify-section` reports |
| API response time | <500ms | Sanity dashboard |
| Frontend build time | <2 min | Vercel build logs |
| Error rate | <1% | Frontend console logs |

### User Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to add event | <5 min | User testing |
| Training completion | 100% | User checklist |
| User satisfaction | ≥4/5 | Survey (post-training) |
| Content update frequency | ≥1/week | Sanity analytics |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Developer time saved | 2h/week | Time tracking (no more manual edits) |
| Content freshness | Events updated within 24h of announcement | Compare event dates to publish dates |
| Zero deployment for content | 100% of edits via CMS | Git commits analysis |

---

## Conclusion

Sanity CMS integration provides a scalable, user-friendly solution for managing Kompopolex website content while preserving pixel-perfect Figma fidelity.

**Key benefits**:
- ✅ Non-technical users can manage content independently
- ✅ Draft/publish workflow prevents accidental changes
- ✅ Free tier sufficient for project scale
- ✅ Minimal code changes (preserves existing pixel-perfect implementation)
- ✅ Vercel-friendly (easy deployment)

**Next steps**:
1. Initialize Sanity project
2. Create schemas
3. Deploy Studio to Vercel
4. Integrate frontend (Kalendarz page first)
5. Visual verification
6. User training

**Timeline**: 3-4 weeks for full implementation and training

---

## Appendix A: Required Sanity Plugins

```json
{
  "dependencies": {
    "@sanity/color-input": "^3.0.0",  // Color picker for bio profiles
    "@sanity/vision": "^3.0.0"         // GROQ query testing (dev tool)
  }
}
```

## Appendix B: Sanity Studio Configuration

```javascript
// sanity-studio/sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import schemas from './schemas'

export default defineConfig({
  name: 'kompopolex',
  title: 'Kompopolex CMS',
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  plugins: [
    deskTool(),
    visionTool(), // Query testing
    colorInput(),  // Color picker
  ],
  schema: {
    types: schemas,
  },
})
```

## Appendix C: Sample .env File

```bash
# Sanity configuration
VITE_SANITY_PROJECT_ID=abc123def
VITE_SANITY_DATASET=production

# Feature flag (for gradual migration)
VITE_USE_SANITY=true

# Figma (existing)
FIGMA_ACCESS_TOKEN=your-token
```

## Appendix D: Useful Commands

```bash
# Sanity Studio
cd sanity-studio
npm run dev          # Local development (http://localhost:3333)
npm run build        # Build for production
sanity deploy        # Quick deploy to sanity.studio subdomain
vercel --prod        # Deploy to custom domain

# Frontend
npm run dev          # Vite dev server
npm run build        # Production build

# Verification
make verify-section SECTION=kalendarz SECTIONS_CONFIG=scripts_project/sections-config.json

# Backup
sanity dataset export production backup-$(date +%Y%m%d).tar.gz
```

---

**Document Status**: Approved
**Ready for Implementation**: Yes
**Estimated Effort**: 3-4 weeks (setup + migration + training)
