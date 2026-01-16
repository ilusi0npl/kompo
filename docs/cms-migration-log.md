# CMS Migration Log

## 2026-01-16 - Initial Event Migration

**Status**: Completed ✅

**Migration Method**: Automated script using Sanity Client API

### Events Migrated

1. **ENSEMBLE KOMPOPOLEX**
   - Date: 13.12.2025 18:00
   - Performers: Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski
   - Location: ASP WROCŁAW, PL. POLSKI 3/4
   - Image: event1.jpg (2913x4096)
   - Sanity ID: `d5y53MbRG9hlbHOiHJnhQN`
   - CDN URL: https://cdn.sanity.io/images/cy9ddq1w/production/3c7044d50961b7758b7b9dfaa5fa326249f3a5d4-2913x4096.jpg

2. **SPOŁECZNE KOMPONOWANIE 2025**
   - Date: 20.12.2025 18:00
   - Performers: Julia Łabowska, Karolina Kułaga, Oleś Kulczewicz, Szymon Kępczyński, Tymoteusz Lasik
   - Location: Akademia Muzyczna im. K. Lipińskiego we Wrocławiu
   - Image: event2.jpg (4096x2731)
   - Sanity ID: `d5y53MbRG9hlbHOiHJniie`
   - CDN URL: https://cdn.sanity.io/images/cy9ddq1w/production/ed62828cc289318602408d8a0715121beaabd658-4096x2731.jpg

3. **MIXTUR FESTIVAL**
   - Date: 16.01.2026 20:00
   - Program: 6 compositions (La Monte Young, Marta Śniady, Martin A. Hirsti-Kvam, Jennifer Walshe, Rafał Ryterski, La Monte Young)
   - Location: Nau Bostik, Barcelona
   - Image: event3.jpg (2496x3744)
   - Sanity ID: `d5y53MbRG9hlbHOiHJnixw`
   - CDN URL: https://cdn.sanity.io/images/cy9ddq1w/production/3fb7baadb98313b6626e5948afddefc621ce883f-2496x3744.jpg

### Technical Details

**Source**: `src/pages/Kalendarz/kalendarz-config.js`

**Script**: `scripts/migrate-events.js`

**Sanity Project**: cy9ddq1w / production dataset

**Published**: All events marked with `publishedAt` timestamp (2026-01-16T09:28:xx)

**Status**: All set to "upcoming"

### Notes

- All images uploaded successfully to Sanity CDN
- imageStyle preserved from Figma config for pixel-perfect positioning
- Event 1 & 2 use `performers` field (text)
- Event 3 uses `program` array with 6 composer/piece objects
- All descriptions set to placeholder Lorem ipsum text
- Migration verified via GROQ query: `*[_type == "event" && defined(publishedAt)]`

### Verification

Query used:
```groq
*[_type == "event" && defined(publishedAt)] | order(date asc) {
  _id, title, date, status, performers, program,
  "imageUrl": image.asset->url, imageStyle
}
```

Result: ✅ 3 events returned, all data correct
