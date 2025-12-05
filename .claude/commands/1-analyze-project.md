---
description: Analyze full Figma project structure with strict meta-policy enforcement
---

# /1-analyze-project - Strict Project Analysis

**Meta-Policy Enforcement**: Zero guessing. Strict validation. Block on inconsistencies.

## Requirements

- **FIGMA_ACCESS_TOKEN**: Set in `.env` or environment
- **Figma URL**: Full project URL

## Arguments

1. **Figma URL** (required): `https://figma.com/design/{fileKey}/{fileName}`
2. **Page Descriptions** (optional): `PageName=path/to/description.md`

## Process

Read `docs/meta-policy.md` for complete enforcement rules.

### Phase 1: Figma Access Validation

1. Verify `FIGMA_ACCESS_TOKEN` exists
2. Test API access with provided URL
3. Extract fileKey and validate file accessibility
4. **BLOCK if**: Token invalid, file inaccessible, permissions insufficient

### Phase 2: Project Structure Fetch

1. Fetch complete file structure via Figma REST API
2. Identify all pages (top-level canvases)
3. For each page extract:
   - Node-id (format: XX:YY)
   - Dimensions (width x height)
   - Child frame/section count
   - Complexity score: `sections * avg_depth`
4. **BLOCK if**: API errors, incomplete data, OR >10 pages without user confirmation

### Phase 3: Shared Components Discovery

1. Scan for shared components (COMPONENT type nodes)
2. Identify instances across pages
3. Map usage: `{componentId: [pageIds]}`
4. **BLOCK if**: Critical shared components (Header/Footer) have >2 variants

Strict rule: NO HeaderVariant, FooterVariant, etc. allowed.

### Phase 4: Implementation Status Generation

Generate `docs/implementation-status.md`:

```markdown
# Implementation Status: [Project Name]

## Project Metadata
- Figma File: [URL]
- File Key: [key]
- Total Pages: N
- Analysis Date: YYYY-MM-DD HH:MM:SS
- Meta-Policy: ENFORCED ✓

## Pages Overview

| Page | Node ID | Dimensions | Sections | Complexity | Status | User Desc | Plan |
|------|---------|------------|----------|------------|--------|-----------|------|
| Homepage | 21:2 | 1728x5840 | 8 | HIGH | ⬜ Not Started | ✅ path.md | - |
| About | 45:3 | 1728x3200 | 5 | MEDIUM | ⬜ Not Started | ❌ none | - |

## Shared Components

### Header (Component: 12:34)
- **Used in**: Homepage, About, Contact (3 pages)
- **Variants**: 1 ✓ (>2 = BLOCKED)
- **Status**: ⬜ Not Implemented
- **Action**: Implement once, REUSE everywhere

### Footer (Component: 56:78)
- **Used in**: Homepage, About, Contact (3 pages)
- **Variants**: 1 ✓
- **Status**: ⬜ Not Implemented
- **Action**: Implement once, REUSE everywhere

## Consistency Requirements (ENFORCED)

- ✅ Header/Footer MUST be identical across all pages
- ✅ NO HeaderVariant or FooterVariant components allowed
- ✅ Same props for shared components everywhere
- ✅ Zero divergence between pages

## Implementation Order (Recommended)

1. **Shared Components** (Header, Footer) - Implement first
2. **Homepage** (reference implementation)
3. **Other pages** (reuse shared components)

## Validation Status

- ✅ All pages have node-ids
- ✅ All pages have dimensions
- ✅ Shared components identified
- ✅ No >2 variants of critical components
- ✅ Ready for Phase 0.1 (per-page analysis)
```

### Phase 5: Validation

Run consistency checks:

```javascript
const validation = {
  allPagesHaveNodeIds: pages.every(p => p.nodeId),
  allPagesHaveDimensions: pages.every(p => p.width && p.height),
  sharedComponentsIdentified: sharedComponents.length > 0,
  noExcessiveVariants: sharedComponents.every(c =>
    c.name.match(/header|footer/i) ? c.variants <= 2 : true
  )
};

if (!Object.values(validation).every(v => v)) {
  console.error('❌ VALIDATION FAILED - CANNOT PROCEED');
  console.error('Fix issues and retry /1-analyze-project');
  process.exit(1);
}
```

**BLOCK if ANY check fails.**

## Output

Console summary:

```
✅ Phase 1: Figma Access - PASSED
✅ Phase 2: Structure Fetch - PASSED (8 pages)
✅ Phase 3: Shared Components - PASSED (2 shared, no excessive variants)
✅ Phase 4: Status Generation - COMPLETE
✅ Phase 5: Validation - PASSED

📄 Saved to: docs/implementation-status.md

🚀 Next step: /2-analyze-page [PageName]
   Recommended: Homepage (8 sections, HIGH complexity)
```

## Failure Cases

If validation fails:

```
❌ CANNOT PROCEED - VALIDATION FAILED

Critical Issues:
1. [SHARED_COMPONENTS] Header has 3 variants (max 2 allowed)
   - Remediation: Consolidate Header variants or confirm intentional

2. [PAGES] 3 pages missing node-ids
   - Pages: Contact, FAQ, Menu
   - Remediation: Re-fetch with proper API access

Fix issues and retry /1-analyze-project
```

$ARGUMENTS
