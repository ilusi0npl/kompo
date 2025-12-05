# Visual Verifier Agent

**Purpose:** Run UIMatch verification loop and analyze diff.png for structural issues.

**Principle:** diff.png is the source of truth. Quality Gate pass is NOT enough.

---

## Inputs

1. **Page Name**: Page being verified
2. **Figma Node ID**: For UIMatch comparison
3. **Asset Manifest**: For position reference

---

## Process Overview

```
START
  ↓
Run UIMatch
  ↓
Read report.json + diff.png
  ↓
Categorize differences
  ↓
STRUCTURAL? ─YES→ Generate fix → Retry (max 5)
  ↓ NO
PASS ✓
```

---

## Verification Loop

### Variables

```
iteration = 0
MAX_ITERATIONS = 5
```

### Loop Steps

#### Step 1: Run UIMatch

```bash
make verify NODE_ID=XX-YY
```

Or with Makefile:
```bash
make verify NODE_ID=32-563
```

#### Step 2: Read Report

```bash
Read: tmp/uimatch-reports/report.json
```

Extract:
- `qualityGate.pass` (boolean)
- `metrics.dfs` (0-100)
- `metrics.pixelDiffRatio` (percentage)

#### Step 3: Read diff.png (MANDATORY)

```bash
Read: tmp/uimatch-reports/diff.png
```

**CRITICAL**: ALWAYS read diff.png, even if Quality Gate passed.

Also read for comparison:
- `tmp/uimatch-reports/impl.png` (implementation screenshot)
- `tmp/uimatch-reports/figma.png` (Figma screenshot)

#### Step 4: Analyze Differences

For EACH red/orange highlighted area in diff.png:

1. **Locate**: Where is the highlighted area? (top-left, center, bottom?)
2. **Identify**: What element is it? (logo, text, section, image?)
3. **Compare**: Look at impl.png vs figma.png for that area
4. **Categorize**: STRUCTURAL or FONT?
5. **Document**: Record issue and fix if STRUCTURAL

#### Step 5: Categorize

| Category | Indicators | Examples | Action |
|----------|------------|----------|--------|
| STRUCTURAL | Shape differs, element missing, wrong position | Logo at X=100 instead of X=68 | MUST FIX |
| FONT | Text blur, slight weight diff | Anti-aliasing differences (~5%) | ACCEPTABLE |

#### Step 6: Decision

```
IF qualityGate.pass AND no STRUCTURAL:
    → PASS ✓ Done

IF STRUCTURAL issues found:
    iteration++
    IF iteration > MAX_ITERATIONS:
        → Ask user for guidance
    ELSE:
        → Generate fix instructions
        → Apply fix
        → Retry from Step 1

IF qualityGate.fail BUT only FONT issues:
    → Consider PASS (font rendering ~5% expected)
    → Done
```

---

## diff.png Analysis Protocol

### Reading diff.png

The diff.png image shows:
- **Red/Orange areas**: Visual differences between Figma and implementation
- **White/Light areas**: Matching pixels
- **Darker red**: Larger differences

### Systematic Analysis

```markdown
## diff.png Analysis - Iteration [N]

### Overview
- Total highlighted areas: [count]
- Quality Gate: [PASS/FAIL]
- DFS Score: [XX]/100
- Pixel Diff: [X.XX]%

### Area Analysis

| # | Location | Element | Category | Issue | Fix |
|---|----------|---------|----------|-------|-----|
| 1 | top-left | Logo | STRUCTURAL | X position wrong | left-[100px] → left-[68px] |
| 2 | center | Heading | FONT | Anti-aliasing | Acceptable |
| 3 | right | Image | STRUCTURAL | Missing | Add image component |

### Decision
- [x] STRUCTURAL issues: 2 found
- [ ] FONT only: No
- Action: Fix issues #1 and #3, retry
```

### Common STRUCTURAL Issues

| Issue | How to Identify | Fix |
|-------|-----------------|-----|
| Wrong X position | Element shifted horizontally | Update `left-[Xpx]` from Asset Manifest |
| Wrong Y position | Element shifted vertically | Update `top-[Ypx]` from Asset Manifest |
| Wrong size | Element too big/small | Update `w-[Wpx] h-[Hpx]` from Asset Manifest |
| Missing element | Large red area where element should be | Add missing component |
| Z-index wrong | Element behind/in front incorrectly | Adjust `z-[N]` class |
| Wrong asset | Different image showing | Check Asset Manifest for correct node ID |

### Common FONT Issues (Acceptable)

| Issue | How to Identify | Why Acceptable |
|-------|-----------------|----------------|
| Anti-aliasing | Slight blur around text | Browser vs Figma rendering differs |
| Weight difference | Text slightly bolder/lighter | Font rendering varies |
| Letter spacing | Minor spacing difference | Sub-pixel rendering |

---

## Fix Generation

When STRUCTURAL issue found, generate specific fix:

### Format

```markdown
## Fix Required - Iteration [N]

### Issue
- Element: [name]
- Current: left-[100px] top-[150px]
- Expected: left-[68px] top-[143px] (from Asset Manifest)

### Code Change

File: src/pages/[PageName]/components/[Component].jsx
Line: [N]

Before:
```jsx
<div className="absolute left-[100px] top-[150px]">
```

After:
```jsx
<div className="absolute left-[68px] top-[143px]">
```

### Verification
After fix, re-run: `make verify NODE_ID=XX-YY`
```

---

## Escalation Protocol

After 5 failed iterations:

```markdown
## Verification Escalation - 5 Attempts Failed

### Summary
- Iterations: 5
- Remaining STRUCTURAL issues: [count]

### Issues Not Resolved
| # | Element | Issue | Attempted Fixes |
|---|---------|-------|-----------------|
| 1 | ... | ... | ... |

### Options
1. **Continue trying** - More iterations
2. **Accept current state** - Document remaining differences
3. **Manual intervention** - User fixes specific issue

### Recommendation
[Based on remaining issues, recommend option]
```

---

## Output

### On PASS

```markdown
## Visual Verification - PASS ✅

- Quality Gate: PASS
- DFS Score: [XX]/100
- Pixel Diff: [X.XX]%
- Iterations: [N]
- Remaining differences: Font rendering only (~5%)
```

### On FAIL (after escalation)

```markdown
## Visual Verification - NEEDS ATTENTION ⚠️

- Iterations: 5 (max reached)
- Remaining STRUCTURAL issues: [count]
- User decision required

[Escalation details]
```

---

## Integration

This agent is called by:
- `/3-generate-code` - During Phase 4
- Can also be called standalone for re-verification

### Standalone Usage

```
Verify visual match for [PageName]
- Figma Node: XX-YY
- Asset Manifest: [path]
```
