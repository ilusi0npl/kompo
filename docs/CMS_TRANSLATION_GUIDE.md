# Sanity CMS Translation Guide

Guide for content editors on how to review and improve English translations in Sanity CMS.

## Overview

All content in Kompopolex Sanity CMS now supports two languages:
- **Polish (PL)** - Primary language
- **English (EN)** - Secondary language

**✅ Initial translations completed!** All Polish content has been automatically translated to English. You can now review and improve these translations in Sanity Studio.

## Accessing Sanity Studio

1. Open your browser and go to: **http://localhost:3333**
2. Or visit the production Studio URL (if deployed)
3. Log in with your Sanity account

## Content Types with Translations

The following content types have bilingual fields:

### 1. Wydarzenia (Events)

Fields to translate:
- **Tytuł (PL)** → **Tytuł (EN)**
- **Wykonawcy (PL)** → **Wykonawcy (EN)**
- **Opis (PL)** → **Opis (EN)**
- **Lokalizacja (PL)** → **Lokalizacja (EN)**

**DO NOT translate:**
- Program (composer names and piece titles stay in original language)
- Date, image, ticket URL

### 2. Profile Bio (Bio Profiles)

Fields to translate:
- **Nazwa (PL)** → **Nazwa (EN)**
- **Paragrafy (PL)** → **Paragrafy (EN)** (translate each paragraph individually)

**DO NOT translate:**
- Image

### 3. Slajd Homepage (Homepage Slides)

Fields to translate:
- **Słowo (PL)** → **Słowo (EN)**
- **Tagline (PL)** → **Tagline (EN)**

**DO NOT translate:**
- Image

### 4. Strona Fundacja (Foundation Page)

Fields to translate:
- **Projekty** → For each project:
  - **Opis projektu (PL)** → **Opis projektu (EN)**
  - **Tekst linku PL** → **Tekst linku EN** (optional)

**DO NOT translate:**
- KRS, REGON, NIP, Bank Account, Email
- Accessibility Declaration (already has separate PL/EN fields)

### 5. Album Zdjęciowy (Photo Albums)

Fields to translate:
- **Tytuł albumu (PL)** → **Tytuł albumu (EN)**

**DO NOT translate:**
- Photographer, images

### 6. Media (Media Items)

Fields to translate:
- **Tytuł (PL)** → **Tytuł (EN)**
- **Opis (PL)** → **Opis (EN)** (optional)

**DO NOT translate:**
- Type, file, video URL, thumbnail

## Translation Workflow

### Step 1: Find Documents with Placeholder Text

Look for documents with `[EN translation needed]` in English fields.

### Step 2: Open Document for Editing

1. Click on the document in the list
2. Scroll to the English fields (marked with "EN" suffix)
3. Click on the field to edit

### Step 3: Replace Placeholder

1. Delete `[EN translation needed]`
2. Enter the English translation
3. Keep the same tone and style as the Polish version

### Step 4: Save Changes

1. Click **Save** or **Publish** button
2. Verify the translation appears correctly

## Translation Tips

### General Guidelines

1. **Be consistent** - Use the same terminology across all documents
2. **Keep length similar** - Try to match the Polish text length
3. **Preserve formatting** - Keep line breaks, capitalization, and punctuation style
4. **Respect context** - Translate meaning, not just words

### Specific Tips for Each Content Type

**Events:**
- Location: Translate institution names if they have official English versions
- Performers: Keep artist names unchanged, translate roles/descriptions only
- Description: Focus on clarity and cultural context for international audience

**Bio Profiles:**
- Keep professional tone
- Translate achievements and awards accurately
- Maintain paragraph structure

**Homepage Slides:**
- Word: Can be left as-is (Trio, Kompo, Polex, Ensemble) or translated if appropriate
- Tagline: Translate creatively while preserving the brand voice

**Foundation Page:**
- Projects: Be clear and formal
- Link text: Keep it short and actionable (e.g., "Read more", "Learn more")

**Photo Albums:**
- Keep titles descriptive and concise

**Media Items:**
- Titles: Can be artistic/creative - maintain the original intent
- Descriptions: Provide context for international viewers

## Priority Translation Order

We recommend translating in this order:

### Week 1 (High Priority)
1. **Wydarzenia (Events)** - Both upcoming and archived
2. **Profile Bio** - All 4 profiles
3. **Slajd Homepage** - All 4 slides

### Week 2 (Medium Priority)
4. **Strona Fundacja** - Projects section
5. **Album Zdjęciowy** - All album titles
6. **Media** - All media item titles and descriptions

## Quality Checklist

Before marking translation as complete, verify:

- [ ] No `[EN translation needed]` placeholders remain
- [ ] Translation makes sense in English
- [ ] Spelling and grammar are correct
- [ ] Formatting matches Polish version
- [ ] Special characters (ł, ś, ć, etc.) are handled appropriately
- [ ] Links and URLs work correctly (if applicable)

## Getting Help

If you encounter any issues or have questions:

1. **Technical issues** - Contact the development team
2. **Translation questions** - Consult with content manager
3. **Missing fields** - Report to tech lead

## Common Mistakes to Avoid

❌ **DON'T:**
- Leave `[EN translation needed]` in published content
- Use machine translation without review
- Translate composer names or piece titles
- Change the meaning or tone significantly
- Skip optional fields without consideration

✅ **DO:**
- Review your translation before saving
- Keep cultural context in mind
- Ask questions if unsure
- Maintain consistency across related documents
- Test how it looks on the website

## Example Translations

### Event Title
- **PL:** ENSEMBLE KOMPOPOLEX
- **EN:** ENSEMBLE KOMPOPOLEX (name stays the same)

### Event Description
- **PL:** Koncert muzyki współczesnej
- **EN:** Contemporary music concert

### Bio Paragraph
- **PL:** Aleksandra Gołaj jest pianistką specjalizującą się w muzyce najnowszej.
- **EN:** Aleksandra Gołaj is a pianist specializing in contemporary music.

### Homepage Tagline
- **PL:** Specjalizujemy się w muzyce najnowszej
- **EN:** We specialize in contemporary music

### Foundation Project
- **PL:** Organizujemy warsztaty kompozytorskie dla młodzieży
- **EN:** We organize composition workshops for young people

---

**Remember:** The goal is to make Kompopolex accessible to international audiences while maintaining the artistic and cultural authenticity of the content.
