# Sanity CMS Internationalization - Technical Documentation

Technical reference for the bilingual (Polish/English) implementation in Sanity CMS.

## Architecture Overview

### Pattern: Separate Fields (Pl/En)

Instead of using Sanity's built-in internationalization plugin, we use a simpler pattern:
- **Two separate fields** for each translatable content
- **Same document** contains both languages
- **Runtime transformation** in React hooks based on current language

**Why this pattern?**
- ✅ Simpler to implement and maintain
- ✅ Better for small teams (only 2 languages)
- ✅ Clear in Sanity Studio UI
- ✅ No plugin dependencies
- ✅ Full control over data structure

## Schema Structure

### Example: Event Schema

```typescript
// sanity-studio/schemaTypes/event.ts
{
  name: 'event',
  type: 'document',
  fields: [
    // Bilingual title
    { name: 'titlePl', title: 'Tytuł (PL)', type: 'string', validation: Rule => Rule.required() },
    { name: 'titleEn', title: 'Tytuł (EN)', type: 'string', validation: Rule => Rule.required() },

    // Old field (hidden for backward compatibility)
    { name: 'title', title: 'Tytuł (deprecated)', type: 'string', hidden: true },

    // Common fields (not translated)
    { name: 'date', type: 'datetime' },
    { name: 'image', type: 'image' },
  ],
  preview: {
    select: {
      title: 'titlePl',  // Use Polish for preview
    }
  }
}
```

### Key Principles

1. **New fields** named with `Pl` and `En` suffixes
2. **Old fields** hidden but not deleted (backward compatibility)
3. **Common fields** (dates, images, IDs) remain unchanged
4. **Preview** uses Polish version for Studio UI
5. **Both languages required** in validation

## GROQ Queries

### Fetching Both Languages

```javascript
// src/lib/sanity/queries.js
export const upcomingEventsQuery = `
  *[_type == "event" && status == "upcoming"] {
    _id,
    titlePl,      // Fetch both languages
    titleEn,
    descriptionPl,
    descriptionEn,
    date,
    "imageUrl": image.asset->url
  }
`
```

**Important:** Always fetch **both** Pl and En fields in queries.

## React Hooks Pattern

### Language Transformation Hook

```javascript
// src/hooks/useSanityEvents.js
import { useLanguage } from '../context/LanguageContext'

export function useSanityEvents(status = 'upcoming') {
  const [events, setEvents] = useState([])
  const { language } = useLanguage()  // Get current language

  useEffect(() => {
    client.fetch(query).then(data => {
      // Transform data based on language
      const transformed = data.map(event => ({
        ...event,
        title: language === 'pl' ? event.titlePl : event.titleEn,
        description: language === 'pl' ? event.descriptionPl : event.descriptionEn,
      }))
      setEvents(transformed)
    })
  }, [status, language])  // Re-fetch when language changes

  return { events, loading, error }
}
```

### Key Points

1. **Import** `useLanguage` hook
2. **Add** `language` to dependency array
3. **Transform** data in `.then()` before setting state
4. **Map** each bilingual field to single field name
5. **Return** transformed data

## LanguageContext

The language context provides:

```javascript
// src/context/LanguageContext.jsx
const LanguageContext = createContext({
  language: 'pl',           // Current language (pl or en)
  setLanguage: () => {},    // Function to change language
})

export function useLanguage() {
  return useContext(LanguageContext)
}
```

**Features:**
- Persisted in `localStorage`
- Default: `'pl'`
- Used by all bilingual hooks
- Triggers re-fetch when changed

## Migration Scripts

### Purpose

Migrate existing single-language data to bilingual schema:
- Copy old field → new `Pl` field
- Set `En` field to `"[EN translation needed]"`
- Safe to run multiple times (duplicate detection)

### Example Migration Script

```javascript
// scripts/migrate-events-i18n.js
async function migrateEvents() {
  const events = await client.fetch(`*[_type == "event"]`)

  for (const event of events) {
    // Skip if already migrated
    if (event.titlePl && event.titleEn) continue

    await client
      .patch(event._id)
      .set({
        titlePl: event.title,
        titleEn: '[EN translation needed]',
      })
      .commit()
  }
}
```

### Migration Script List

| Script | Migrates | Fields |
|--------|----------|--------|
| `migrate-events-i18n.js` | Events | title, performers, description, location |
| `migrate-bio-profiles-i18n.js` | Bio Profiles | name, paragraphs |
| `migrate-homepage-slides-i18n.js` | Homepage Slides | word, tagline |
| `migrate-fundacja-page-i18n.js` | Foundation Page | projects (text, linkText) |
| `migrate-photo-albums-i18n.js` | Photo Albums | title |
| `migrate-media-items-i18n.js` | Media Items | title, description |

## Adding New Bilingual Schema

To add bilingual support to a new schema:

### 1. Update Schema Definition

```typescript
// sanity-studio/schemaTypes/newSchema.ts
fields: [
  // Add bilingual fields
  { name: 'fieldPl', title: 'Field (PL)', type: 'string', validation: Rule => Rule.required() },
  { name: 'fieldEn', title: 'Field (EN)', type: 'string', validation: Rule => Rule.required() },

  // Hide old field (if exists)
  { name: 'field', title: 'Field (deprecated)', type: 'string', hidden: true },
]
```

### 2. Update GROQ Query

```javascript
// src/lib/sanity/queries.js
export const newSchemaQuery = `
  *[_type == "newSchema"] {
    _id,
    fieldPl,
    fieldEn,
  }
`
```

### 3. Update Hook

```javascript
// src/hooks/useSanityNewSchema.js
import { useLanguage } from '../context/LanguageContext'

export function useSanityNewSchema() {
  const { language } = useLanguage()

  useEffect(() => {
    client.fetch(query).then(data => {
      const transformed = data.map(item => ({
        ...item,
        field: language === 'pl' ? item.fieldPl : item.fieldEn,
      }))
      setData(transformed)
    })
  }, [language])
}
```

### 4. Create Migration Script

```javascript
// scripts/migrate-new-schema-i18n.js
const items = await client.fetch(`*[_type == "newSchema"]`)

for (const item of items) {
  if (item.fieldPl && item.fieldEn) continue

  await client.patch(item._id).set({
    fieldPl: item.field,
    fieldEn: '[EN translation needed]',
  }).commit()
}
```

## Special Cases

### Nested Arrays (e.g., fundacjaPage.projects)

For nested objects in arrays:

**Schema:**
```typescript
{
  name: 'projects',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'textPl', type: 'text' },
      { name: 'textEn', type: 'text' },
    ]
  }]
}
```

**GROQ Query:**
```javascript
projects[] {
  textPl,
  textEn,
  linkUrl
}
```

**Hook Transformation:**
```javascript
projects: pageData.projects?.map(project => ({
  text: language === 'pl' ? project.textPl : project.textEn,
  linkUrl: project.linkUrl,
}))
```

### Optional Fields

For optional bilingual fields:

**Schema:**
```typescript
{ name: 'descriptionPl', type: 'text' },  // No validation
{ name: 'descriptionEn', type: 'text' },
```

**Migration:**
```javascript
descriptionPl: item.description || '',
descriptionEn: item.description ? '[EN translation needed]' : '',
```

## Backward Compatibility

### Hidden Old Fields

Old fields are **hidden** but **not deleted**:

**Why?**
- Allows rollback if needed
- Maintains data integrity
- Migration scripts use old fields as source

**When to delete?**
- After confirming all data migrated successfully
- After translations are complete
- After testing in production

### Rollback Strategy

If needed to rollback:

1. **Show old fields** in schema (remove `hidden: true`)
2. **Hide new Pl/En fields**
3. **Restart Sanity Studio**
4. Data remains intact

## Testing

### Unit Tests

Test language transformation logic:

```javascript
describe('useSanityEvents', () => {
  it('transforms data to Polish', () => {
    const { result } = renderHook(() => useSanityEvents(), {
      wrapper: ({ children }) => (
        <LanguageProvider initialLanguage="pl">
          {children}
        </LanguageProvider>
      ),
    })

    expect(result.current.events[0].title).toBe('Polski tytuł')
  })
})
```

### Integration Tests

Test language switching:

1. **Load page** in Polish
2. **Switch to English** using language toggle
3. **Verify** content changes
4. **Reload page** - language should persist

## Performance Considerations

### Re-fetching on Language Change

**Current approach:**
- Language change → `useEffect` dependency triggered → Re-fetch from Sanity

**Optimization (future):**
- Cache both languages in state
- Switch language → transform cached data (no re-fetch)

**Trade-off:**
- Current: Simpler code, more network requests
- Optimized: Complex state management, fewer requests

For Kompopolex scale, current approach is sufficient.

## Common Issues

### Issue 1: Old placeholders visible

**Problem:** `[EN translation needed]` appears on website

**Solution:**
1. Check if `VITE_USE_SANITY=true` in `.env`
2. Verify hook is transforming data correctly
3. Add English translations in Sanity Studio

### Issue 2: Language doesn't switch

**Problem:** Content stays in Polish when switching to English

**Solution:**
1. Check `useLanguage()` is imported in hook
2. Verify `language` is in `useEffect` deps
3. Check transformation logic in `.map()`

### Issue 3: Migration script errors

**Problem:** Script fails with "Cannot read property 'title'"

**Solution:**
1. Check GROQ query includes old fields
2. Handle null/undefined values:
   ```javascript
   titlePl: event.title || '',
   ```

## File Structure

```
sanity-studio/
├── schemaTypes/
│   ├── event.ts              # Bilingual schemas
│   ├── bioProfile.ts
│   └── ...

scripts/
├── migrate-events-i18n.js    # Migration scripts
├── migrate-bio-profiles-i18n.js
└── ...

src/
├── context/
│   └── LanguageContext.jsx   # Language provider
├── hooks/
│   ├── useSanityEvents.js    # Bilingual hooks
│   ├── useSanityBioProfiles.js
│   └── ...
├── lib/sanity/
│   ├── client.js             # Sanity client
│   └── queries.js            # GROQ queries (with Pl/En)
└── translations/             # UI text translations
    ├── pl.json
    └── en.json
```

## Best Practices

1. **Always fetch both languages** in GROQ queries
2. **Transform in hooks** not in components
3. **Add language to deps** in useEffect
4. **Test both languages** when developing
5. **Document non-translated fields** (e.g., program, composer names)
6. **Use placeholders** for missing translations
7. **Keep migration scripts** for future reference

## Future Improvements

Potential enhancements:

1. **Partial translations** - Allow mixing PL/EN fields
2. **Translation status** - Track which fields are translated
3. **Automatic translation** - AI-assisted translations
4. **More languages** - Add German, French, etc.
5. **Translation workflow** - In-Studio translation UI

---

**For more information:**
- Editor guide: `docs/CMS_TRANSLATION_GUIDE.md`
- Sanity docs: https://www.sanity.io/docs
- Project docs: `CLAUDE.md`
