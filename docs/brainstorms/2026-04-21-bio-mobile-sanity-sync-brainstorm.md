---
date: 2026-04-21
topic: bio-mobile-sanity-sync
---

# Bio Mobile: Sync Text with Sanity CMS

## What We're Building

Fix a content mismatch bug: desktop Bio shows Sanity CMS content, mobile Bio shows hardcoded translation file content. On production (`VITE_USE_SANITY=true`) users see different text depending on device.

**Root cause confirmed by Playwright test against production:**
- `DesktopBio.jsx` — calls `useSanityBioProfiles()`, uses CMS data when `VITE_USE_SANITY=true`
- `MobileBio.jsx` — always reads from `t('bio.slides.*.paragraphs')` (static translation files)

Example diff (production):
- Desktop ensemble: "Ensemble Kompopolex to polski zespół muzyki współczesnej, założony w 2017 roku..."
- Mobile ensemble: "Trio specjalizujące się w muzyce najnowszej, założone w 2017 roku..."

## Why This Approach

Two options were considered:

**A. Add Sanity to MobileBio (chosen)** — mirror DesktopBio's pattern in MobileBio.jsx. One file to change, minimal diff, same proven hook.

**B. Lift fetch to Bio/index.jsx** — cleaner separation of concerns but requires touching 3 files and changing prop interfaces.

Chose A: simpler, surgical, matches CLAUDE.md guideline ("Touch only what's needed").

## Key Decisions

- **Pattern to mirror**: `DesktopBio.jsx` lines 11–56 (import hook, `transformSanityProfiles`, conditional assignment)
- **Fallback**: When Sanity unavailable, fall back to `t()` — same as desktop
- **Image stays from config**: `mobileImageStyles` array is Figma-derived crop data, not from Sanity
- **Loading state**: Add loading guard (same as desktop) to avoid flash of stale content
- **TDD required**: Write failing E2E test first (verify mobile shows Sanity text), then implement

## Open Questions

- Does `useSanityBioProfiles` return `mainParagraphs` vs `paragraphs` consistently? Verify in hook.
- Jacek profile exists in Sanity? Test showed 0 paragraphs for `/bio/jacek` — may not be published yet.

## Next Steps

→ `/workflows:plan` for implementation details
