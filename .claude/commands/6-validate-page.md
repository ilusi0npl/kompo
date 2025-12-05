---
description: Run ALL verification checks on a page and generate comprehensive quality report
---

# Validate Page - Complete Quality Assessment

Run ALL available verification checks on a page and generate a comprehensive report comparing implementation with Figma design.

**Purpose:** One-command full quality assessment of a page's implementation fidelity.

---

## Arguments

- **Page Name**: Page to validate - e.g., "Homepage", "O_kampanii", "FAQ"

---

## Prerequisites

1. Dev server running: `npm run dev`
2. `FIGMA_ACCESS_TOKEN` set in `.env`
3. Page implemented with `data-section` attributes on all sections
4. Asset manifest exists: `docs/asset-manifest.json` (optional but recommended)
5. Visual baselines generated: `make generate-baselines` (optional but recommended)

---

## What This Command Does

Runs `make verify-full` which executes core verification checks and generates a comprehensive HTML quality report:

```
┌─────────────────────────────────────────────────────────────┐
│              VERIFICATION PIPELINE (verify-full)            │
├─────────────────────────────────────────────────────────────┤
│ 1. ELEMENT CHECK       → Duplicates, overlaps, broken       │
│ 2. ASSET CHECK         → Transforms, flipped images         │
│ 3. CONSISTENCY CHECK   → Cross-page header/footer           │
│ 4. SEMANTIC VALIDATION → Duplicates, dimensions, tokens     │
│    ├─ semantic-duplicates  → Branding duplicates            │
│    ├─ section-dimensions   → Section/card sizes, gaps       │
│    └─ design-tokens        → Color validation               │
│ 5. UIMATCH             → Full-page pixel comparison         │
│ 6. DIMENSION VALIDATION → UIMatch dimension sanity check    │
├─────────────────────────────────────────────────────────────┤
│               HTML QUALITY REPORT (AUTO-GENERATED)          │
│ → Summary dashboard with pass/fail status                   │
│ → Interactive image comparison sliders                      │
│ → Issues categorized by severity                            │
│ → Section-by-section analysis with screenshots              │
│ → Auto-opens in Firefox after generation                    │
└─────────────────────────────────────────────────────────────┘
```

**Additional Checks (run manually if needed):**
- `make verify-page-sections` - Forbidden sections detection
- `make verify-sections` - Per-section structural scan with screenshots
- `make verify-asset-manifest` - Asset position/bounds validation
- `make verify-visual-regression` - Baseline comparison (requires baselines)
- `make verify-sections-figma` - Live Figma screenshot comparison
- `make verify-element` - Element-level Figma comparison

---

## Execution Flow

### Step 1: Determine Page URL and Figma Node

```markdown
Map page name to:
- URL: http://localhost:5173/[page-path]
- Figma Node ID: from implementation-status.md or plan

Page Mapping:
| Page Name | URL Path | Node ID |
|-----------|----------|---------|
| Homepage | / | 21-2 |
| O_kampanii | /o-kampanii | 32-563 |
| FAQ | /faq | XX-YY |
```

### Step 2: Run Complete Verification Pipeline

Execute the complete verification pipeline using `make verify-full`:

```bash
# Run ALL verification checks and generate HTML report
make verify-full URL=http://localhost:5173/[page-path] NODE_ID=[page-node-id]

# This single command runs:
# 1. verify-elements     → Duplicates, overlaps, broken assets, clipping
# 2. verify-assets       → CSS transforms, flipped images, aspect ratios
# 3. verify-consistency  → Cross-page Header/Footer consistency
# 4. verify-semantic     → Branding duplicates, dimensions, design tokens
# 5. verify (UIMatch)    → Full-page pixel comparison vs Figma
# 6. verify-uimatch-dimensions → Dimension validation
# 7. Generate HTML report → tmp/validation-reports/[timestamp].html

# Output locations:
# → tmp/uimatch-reports/
# → tmp/validation-reports/[timestamp].html (comprehensive HTML report)
# → Individual check results in respective tmp/ subdirectories
```

**Note:** The HTML report is automatically opened in Firefox after generation.

### Step 3: Review HTML Report

The `make verify-full` command automatically generates and opens an interactive HTML report in Firefox.

**Primary Review:**
```bash
# HTML report auto-opens in Firefox
# Location: tmp/validation-reports/[timestamp].html

# The report includes:
# 1. Summary dashboard - Overall pass/fail status, quality score
# 2. UIMatch comparison - Interactive image slider (Figma vs Implementation)
# 3. Section analysis - Per-section screenshots and issues
# 4. Detailed issue list - Categorized by severity (CRITICAL, HIGH, MEDIUM, LOW)
```

**Manual File Review (if needed):**
```bash
# UIMatch raw results
Read: tmp/uimatch-reports/report.json
Read: tmp/uimatch-reports/diff.png

# For additional checks (if run separately):
Read: tmp/section-scans/*/[section].png
Read: tmp/asset-manifest-reports/*/report.json
Read: tmp/visual-regression/*/[section]/diff.png
```

### Step 4: Analyze HTML Report

The automatically generated HTML report categorizes all issues by severity and provides an interactive interface for review.

**Issue Severity Levels (in HTML report):**

```markdown
CRITICAL (Must Fix) - Red badges
- WRONG_ASSET, MISSING_ASSET, BROKEN_IMAGE
- STRUCTURAL_DIFF (major layout differences in UIMatch)
- ZERO_HEIGHT sections

HIGH (Should Fix) - Orange badges
- DUPLICATE_IMAGE, FLIPPED_IMAGE
- POSITION_ERROR (>50px off)
- BOUNDS_OVERFLOW

MEDIUM (Review) - Yellow badges
- POSITION_WARNING (10-50px off)
- SIZE_MISMATCH, EXTRA_ASSET, OVERLAPPING

LOW (Acceptable) - Blue badges
- FONT_DIFF (~5% font rendering differences)
- MINOR_POSITION (<10px off)
```

**HTML Report Features:**
- **Summary Dashboard**: Total sections, pass/fail counts, quality score
- **Interactive Sliders**: Figma vs Implementation comparison (drag to compare)
- **Section Analysis**: Per-section screenshots with issue highlights
- **Issue List**: Expandable accordions grouped by severity
- **Navigation**: Quick links to jump between sections

### Step 5: Fix Issues and Re-validate

Based on the HTML report analysis:

```markdown
1. **Review Quality Score** (displayed at top of report)
   - Score ≥90: Excellent - ready for review
   - Score 75-89: Good - minor fixes needed
   - Score 50-74: Needs work - address HIGH and MEDIUM issues
   - Score <50: Critical - major fixes required

2. **Fix CRITICAL Issues First**
   - These are blockers preventing pixel-perfect implementation
   - Use diff.png and comparison slider to identify exact problems

3. **Address HIGH Issues**
   - Important for visual fidelity
   - May require code restructuring

4. **Re-run Validation**
   make verify-full URL=http://localhost:5173/[page-path] NODE_ID=[node-id]

5. **Iterate Until Score ≥90**
   - Each run generates new timestamped HTML report
   - Compare current vs previous report to track progress
```

---

## Output: Interactive HTML Report

The command automatically generates a comprehensive HTML report with:

**Location:** `tmp/validation-reports/[timestamp].html` (auto-opens in Firefox)

**Report Contents:**

1. **Summary Dashboard**
   - Quality Score: XX/100 (Excellent/Good/Needs Work/Critical)
   - Total Sections: X
   - Passed/Failed counts
   - Overall status indicators

2. **Check Results Table**
   - Element Check, Asset Check, Consistency, Semantic, UIMatch
   - Each with PASS/FAIL status and issue counts
   - UIMatch metrics: DFS score, pixel diff ratio

3. **Interactive Image Comparisons**
   - Figma vs Implementation slider (drag to compare)
   - Diff view showing highlighted differences
   - Per-section screenshots (if available)

4. **Issues by Severity**
   - Expandable accordions for CRITICAL, HIGH, MEDIUM, LOW
   - Each issue with description and affected section
   - Color-coded badges for quick severity identification

5. **Per-Section Analysis**
   - Individual section breakdowns
   - Visual regression results (if baselines exist)
   - Screenshot links and status

6. **Recommendations**
   - Prioritized action items based on issue severity
   - Quick links to relevant documentation

**Additional Files Generated:**
- `tmp/uimatch-reports/` - Raw UIMatch data (report.json, diff.png)
- Individual check outputs in respective `tmp/` subdirectories

**Next Steps:**
- Score ≥90: Page ready for review → consider `/4-refine-code`
- Score <90: Fix issues → re-run `/6-validate-page [PageName]`

---

## Quick Reference

### Page URL Mapping

| Page | URL | Figma Node |
|------|-----|------------|
| Homepage | http://localhost:5173/ | 21-2 |
| O_kampanii | http://localhost:5173/o-kampanii | 32-563 |
| FAQ | http://localhost:5173/faq | TBD |
| Materialy | http://localhost:5173/materialy | TBD |

### Quality Thresholds (verify-full)

| Check | Pass Criteria | Fail Criteria |
|-------|---------------|---------------|
| UIMatch pixelDiff | ≤8% | >8% |
| Element Check | 0 CRITICAL issues | >0 CRITICAL |
| Asset Check | 0 flipped/broken | >0 flipped/broken |
| Semantic Validation | 0 duplicates | >0 duplicates |
| Overall Quality Score | ≥90/100 | <90/100 |

**Additional Checks (if run separately):**
| Check | Pass | Fail |
|-------|------|------|
| Visual Regression | ≤10% per section | >10% |
| Asset Manifest | 0 wrong/missing | >0 wrong/missing |

---

## Error Handling

### If dev server not running:
```
ERROR: Dev server not responding at http://localhost:5173
FIX: Run 'npm run dev' in another terminal
```

### If FIGMA_ACCESS_TOKEN not set:
```
ERROR: FIGMA_ACCESS_TOKEN not found
FIX: Set it in .env file
```

### If no baselines exist:
```
NOTE: verify-full works WITHOUT baselines
Visual regression is an OPTIONAL additional check
TIP: Run 'make generate-baselines' + 'make verify-visual-regression' separately if needed
```

### If no asset manifest:
```
NOTE: verify-full works WITHOUT asset manifest
Asset manifest verification is an OPTIONAL additional check
TIP: Create manifest + run 'make verify-asset-manifest' separately if needed
```

**Important:** `make verify-full` runs core checks only. Optional checks (visual regression, asset manifest, per-section scans) must be run separately if needed.

---

$ARGUMENTS
