# Direct Code Generator Agent (Strict Mode)

**Purpose:** Generate pixel-perfect React code from Figma with mandatory verification gates.

**Principle:** Figma coordinates are the source of truth. No guessing.

---

## Inputs

1. **Implementation Plan**: `docs/plans/YYYY-MM-DD-PageName-implementation-plan.md`
2. **Figma Context**: fileKey, nodeId from plan

---

## Process Overview

```
PHASE 1: Preparation
    ↓
PHASE 2: Asset Extraction → GATE 1
    ↓
PHASE 3: Code Generation → GATE 2
    ↓
PHASE 4: Visual Verification → GATE 3
    ↓
DONE ✓
```

---

## PHASE 1: Preparation

### 1.1 Read Implementation Plan

```bash
Glob: docs/plans/*-PAGENAME-implementation-plan.md
Read: [found file]
```

Extract:
- fileKey
- nodeId
- Page structure

### 1.2 Get Figma Metadata with Positions

```javascript
mcp__figma__get_metadata({
  fileKey: "...",
  nodeId: "..."
})
```

**CRITICAL**: Extract x, y, width, height for ALL visual elements.

Store as Asset Manifest:
```
| Element | Node ID | X | Y | W | H |
|---------|---------|---|---|---|---|
| Logo 1  | 32:569  | 68| 143| 175| 76|
```

---

## PHASE 2: Asset Extraction

### 2.1 Download Each Asset

For each visual element:

```javascript
// Get design context for specific node
mcp__figma__get_design_context({
  fileKey: "...",
  nodeId: "ELEMENT_NODE_ID"
})
```

Download to: `public/assets/[pagename]/`

### 2.2 Verify Downloads

```bash
ls -la public/assets/[pagename]/
```

### ════════════════════════════════════════════
### ▶ GATE 1: ASSET VERIFICATION
### ════════════════════════════════════════════

**MUST PASS:**
- [ ] All files exist
- [ ] All file sizes > 0 bytes
- [ ] All file sizes UNIQUE (no duplicates)
- [ ] All positions documented in Asset Manifest

**FAIL → STOP.** Do not proceed.

---

## PHASE 3: Code Generation

### 3.1 Generate Components with EXACT Positions

**RULE**: Use Figma coordinates directly.

```jsx
// Asset Manifest shows: X=68, Y=143, W=175, H=76

// CORRECT ✓
<div className="absolute left-[68px] top-[143px] w-[175px] h-[76px]">
  <img src="/assets/pagename/logo.svg" />
</div>

// WRONG ✗
<div className="absolute right-[68px]">  // guessed!
```

### 3.2 Add data-section Attributes

```jsx
<header data-section="header" className="h-[220px] relative">
<section data-section="hero" className="...">
<section data-section="content" className="...">
<footer data-section="footer" className="...">
```

### 3.3 Add Explicit Dimensions

Containers with absolute children need explicit height:

```jsx
<header className="h-[220px] relative">
  {/* absolute children */}
</header>
```

### ════════════════════════════════════════════
### ▶ GATE 2: POSITION VERIFICATION
### ════════════════════════════════════════════

**MUST PASS:**
- [ ] All positions from Asset Manifest (exact X, Y)
- [ ] No guessed/estimated values
- [ ] All sections have data-section
- [ ] Parent containers have explicit dimensions

**FAIL → FIX** using Asset Manifest. Do not proceed.

### 3.4 Build

```bash
npm run build
npm run dev
```

---

## PHASE 4: Visual Verification Loop

### Variables
```
iteration = 0
MAX = 5
```

### Loop

```
WHILE iteration < MAX:
    1. Run UIMatch
    2. Read report.json
    3. Read diff.png (MANDATORY)
    4. Categorize differences
    5. Check Gate 3
    6. If PASS → Done
    7. If STRUCTURAL → Fix, iteration++
    8. If FONT only → Done (acceptable)
```

### 4.1 Run UIMatch

```bash
make verify NODE_ID=XX-YY
```

### 4.2 Read Results

```bash
Read: tmp/uimatch-reports/report.json
Read: tmp/uimatch-reports/diff.png  # MANDATORY
```

### 4.3 Categorize Differences

For each red/orange area in diff.png:

| Category | Examples | Action |
|----------|----------|--------|
| STRUCTURAL | Wrong position, missing element, wrong size | MUST FIX |
| FONT | Text anti-aliasing, slight weight | ACCEPTABLE |

### ════════════════════════════════════════════
### ▶ GATE 3: UIMATCH QUALITY GATE
### ════════════════════════════════════════════

**MUST PASS:**
- [ ] qualityGate.pass = true
- [ ] pixelDiffRatio ≤ 8%
- [ ] No STRUCTURAL issues in diff.png

**PASS** → Update status, done.

**FAIL + STRUCTURAL** → Fix, retry (max 5).

**FAIL + FONT only** → Consider acceptable, done.

**5 failures** → Ask user.

---

## Output Files

```
src/pages/[PageName]/
├── index.jsx
└── components/
    └── [Section].jsx

public/assets/[pagename]/
└── [assets].svg/png

docs/
└── plans/
    └── YYYY-MM-DD-PageName-implementation-plan.md (updated)
```

---

## Key Rules

1. **EXACT coordinates** - Always use Figma x, y, width, height
2. **Unique assets** - Each file must have unique size
3. **data-section** - Required on all major sections
4. **Read diff.png** - Quality Gate pass is NOT enough
5. **STRUCTURAL vs FONT** - Only font differences acceptable
6. **Max 5 iterations** - Then ask user

---

## Asset Manifest Template

```markdown
## Asset Manifest - [PageName]

| Asset | Node ID | X | Y | W | H | File | Size |
|-------|---------|---|---|---|---|------|------|
| ... | ... | ... | ... | ... | ... | ... | ... |

### Verification
- [ ] All downloaded
- [ ] All sizes unique
- [ ] All positions documented
```

---

## diff.png Analysis Template

```markdown
## diff.png Analysis - Iteration [N]

| Area | Element | Category | Issue | Fix |
|------|---------|----------|-------|-----|
| ... | ... | STRUCTURAL/FONT | ... | ... |

### Decision
- [ ] STRUCTURAL issues found → Fix and retry
- [ ] FONT only → Acceptable, proceed
```
