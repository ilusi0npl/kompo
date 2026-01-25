---
title: Compress CLAUDE.md for AI Optimization
type: refactor
date: 2026-01-25
---

# Compress CLAUDE.md for AI Optimization

## Overview

Reduce CLAUDE.md from 1451 lines (~41KB) to ~700-800 lines (~20KB) **without splitting into multiple files**. Primary goal: faster AI context loading while preserving all essential information.

## Problem Statement

Current CLAUDE.md is bloated with:
- Verbose code examples (many 20-40 line blocks)
- Redundant explanations
- Full implementation details that exist in source files
- Repetitive patterns shown multiple times

This increases AI token consumption and slows context processing.

## Proposed Solution

Apply **telegraphic style compression** - same information density, fewer tokens.

### Compression Techniques

| Technique | Before | After | Savings |
|-----------|--------|-------|---------|
| Code examples | Full implementations | Key patterns + file refs | ~60% |
| Prose | Full sentences | Telegraphic phrases | ~40% |
| Tables | Verbose descriptions | Terse entries | ~30% |
| Headers | Nested hierarchy | Flat with bold | ~20% |

## Technical Approach

### Phase 1: Code Example Compression

**Target sections:**
- ResponsiveWrapper implementation (lines 636-672) → 10 lines max
- LanguageContext full implementation (lines 958-994) → reference only
- Migration script pattern (lines 1256-1298) → 5-line pattern
- useSanityEvents hook (lines 1150-1195) → reference to actual file
- GROQ query examples (lines 1105-1144) → inline patterns only

**Strategy:**
```markdown
// BEFORE (20 lines)
```jsx
// src/components/ResponsiveWrapper/ResponsiveWrapper.jsx
import { useState, useEffect } from 'react';
const DESKTOP_WIDTH = 1440;
// ... 15 more lines
```

// AFTER (3 lines)
**ResponsiveWrapper** (`src/components/ResponsiveWrapper/`): Scale transform, breakpoint 768px.
Desktop: 1440px base. Mobile: 390px base. Formula: `scale = viewportWidth / baseWidth`
```

### Phase 2: Prose Compression

**Target sections:**
- Bug Fixing Workflow explanation → bullet workflow
- High Contrast Mode explanation (lines 182-238) → condensed pattern
- Responsive Design explanation (lines 606-776) → essential rules only
- Sanity Integration explanation (lines 1010-1345) → patterns + refs

**Strategy:**
```markdown
// BEFORE
**Problem:** In high contrast mode, fixed elements (menu, decorative lines, logo)
stayed at top of page instead of scrolling properly. This happened because CSS
`filter` property creates a new containing block, breaking `position: fixed` behavior.

**Root cause:** Original CSS...

// AFTER
**High Contrast + Fixed Positioning:** CSS `filter` breaks `position: fixed`.
Solution: FixedPortal renders to `#fixed-root` outside filtered `#root`.
```

### Phase 3: Reference Tables Compression

**Target sections:**
- Shared Components Reference (lines 436-480) → compact table
- Custom Hooks Reference (lines 485-510) → compact table
- Sanity Hooks Reference (lines 1205-1220) → compact table
- Scripts Reference (lines 1348-1396) → compact table

**Strategy:**
```markdown
// BEFORE (verbose)
### ContrastToggle
**File**: `src/components/ContrastToggle/ContrastToggle.jsx`
- Toggle accessibility high-contrast mode
- Props: `iconColor`, `style`, `transition`, `scale`, `onClick`
- Toggles `.high-contrast` class on `document.body`
- Persists to `localStorage('highContrast')`
- Active indicator color: `#FFBD19` (yellow)

// AFTER (compact)
| Component | File | Key Props | Notes |
|-----------|------|-----------|-------|
| ContrastToggle | ContrastToggle/ | iconColor, style, scale | localStorage, #FFBD19 active |
```

### Phase 4: Section Merging

**Merge candidates:**
- "Development Commands" + "Makefile" → single "Commands" section
- "File Structure" → trim to essentials (actual structure is in code)
- "Quick Start" → merge into Project Overview
- "Best Practices" scattered items → consolidate

### Phase 5: Remove Redundancies

**Identified redundancies:**
- High Contrast Mode explained twice (Lessons Learned + Best Practices)
- FixedPortal pattern repeated in multiple places
- i18n pattern shown in both translations and Sanity sections
- Test patterns shown in Testing + E2E helpers

## Acceptance Criteria

### Size Requirements
- [x] Final file under 800 lines (achieved: 337 lines, -77%)
- [x] Final file under 25KB (achieved: 10KB, -76%)
- [x] No information loss (all patterns preserved)

### Readability
- [x] All headings scannable
- [x] Code examples runnable (not broken by compression)
- [x] File references accurate (all paths verified)

### AI Optimization
- [x] Reduced token count by 40%+ (achieved: ~76%)
- [x] Key patterns in first 500 lines (entire file is 337 lines)
- [x] Critical warnings at top (DO NOT CHANGE, DO NOT COMMIT)

## Implementation Checklist

### Preparation
- [x] Backup current CLAUDE.md (CLAUDE.md.backup)
- [x] Count current tokens (estimate: ~10,000)

### Compression Passes
- [x] Pass 1: Replace verbose code examples with refs (achieved: -1114 lines total)
- [x] Pass 2: Compress prose to telegraphic style
- [x] Pass 3: Compact all tables
- [x] Pass 4: Merge/consolidate sections
- [x] Pass 5: Remove redundancies

### Validation
- [x] Verify all file paths still valid
- [x] Verify all code snippets syntactically correct
- [ ] Test AI comprehension with sample queries (optional)
- [x] Compare side-by-side for missed information

## Expected Structure (Post-Compression)

```
CLAUDE.md (~750 lines)
├── Project Overview + Quick Start (merged, 30 lines)
├── Critical Rules (DO NOT CHANGE/COMMIT/DEPLOY, 10 lines)
├── Tech Stack (5 lines, list only)
├── Bug Fixing Workflow (20 lines, telegraphic)
├── Commands Reference (20 lines, table)
├── File Structure (15 lines, essential only)
├── Verification Tools (40 lines, compressed)
├── Components & Hooks Reference (50 lines, tables)
├── Responsive Design Pattern (40 lines, rules only)
├── Testing (30 lines, commands + patterns)
├── i18n System (40 lines, patterns only)
├── Sanity CMS (80 lines, patterns + refs)
├── Lessons Learned (50 lines, condensed gotchas)
├── Assets Handling (20 lines, workflow only)
└── Scripts Reference (30 lines, table)
```

## Success Metrics

| Metric | Current | Target | Method |
|--------|---------|--------|--------|
| Lines | 1451 | <800 | wc -l |
| Size (KB) | 41 | <25 | wc -c |
| Token estimate | ~10,000 | <6,000 | tiktoken |
| Code example lines | ~400 | <100 | grep |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lost context for AI | High | Test with sample prompts before/after |
| Broken file references | Medium | Grep all paths, verify exist |
| Unrunnable code snippets | Low | Keep minimal working examples |

## References

- Current file: `/home/ilusi0n/repo/kompo/CLAUDE.md`
- Companion file: `/home/ilusi0n/repo/kompo/KOMPOPOLEX.md`
- Testing docs: `/home/ilusi0n/repo/kompo/docs/TESTING.md`
