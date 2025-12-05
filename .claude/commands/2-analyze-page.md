---
description: Analyze specific page from Figma with strict meta-policy enforcement
---

# /2-analyze-page - Strict Page Analysis

**Meta-Policy Enforcement**: Zero guessing. 12-section structure. Strict validation.

⚠️ **IMPORTANT**: Read `docs/meta-policy.md` before executing.

This command produces EXACTLY 12 sections in EXACT order with strict blocking on inconsistencies.

**Simplified for direct code generation workflow** (no Figma Make prompts)

---

## Arguments

**Argument 1** - Page Identifier (optional):
- **Page Figma URL**: URL with node-id for specific page
  - Format: `https://figma.com/design/{fileKey}/{fileName}?node-id={X-Y}`
  - Example: `https://figma.com/design/BDWqfvcMQw8RpFhMMMVRa3/Gadki?node-id=21-2`
- **Page Name**: If URL not provided, specify page name
  - Example: "Homepage", "Menu", "FAQ"
  - Agent will find it in `implementation-status.md`
- If omitted: Auto-detects current page from `implementation-status.md`

**Argument 2** - Description File Path (optional):
- Relative path to a `.md` file with human-written description of this page
- Example: `input/strona_glowna/homepage.md`
- Example: `input/faq/description.md`
- If provided, this description will be used to enrich the Figma analysis

**Examples:**
```bash
# 1. By URL + description
/2-analyze-page https://figma.com/design/...?node-id=21-2 input/strona_glowna/homepage.md

# 2. By Page Name + description
/2-analyze-page Homepage input/strona_glowna/homepage.md

# 3. Only Page Name (no description, Figma-only mode)
/2-analyze-page Homepage

# 4. Auto-detect + description
/2-analyze-page "" input/strona_glowna/homepage.md
```

---

## Instructions

Use the **figma-analyzer agent** to analyze the page.

### Steps

**Step 1: Determine Page to Analyze**
```bash
# Priority 1: Figma URL provided
if $ARGUMENT[0] starts with "https://":
  Extract fileKey and nodeId from URL
  Fetch page metadata to get page name

# Priority 2: Page name provided
else if $ARGUMENT[0]:
  PageName = $ARGUMENT[0]
  Find page in implementation-status.md
  Get fileKey and nodeId from status

# Priority 3: Auto-detect from current step
else:
  Glob: docs/**/implementation-status.md
  Read: Find "Current Step" section
  Extract: Page name, fileKey, nodeId
```

**Step 1.5: Load User Description (if provided)**
```javascript
// Check if second argument exists and is not empty
let userDescription = null;
let descriptionPath = null;

if ($ARGUMENT[1] && $ARGUMENT[1].trim() !== '') {
  descriptionPath = $ARGUMENT[1];

  // Read the description file
  try {
    const content = Read({ file_path: descriptionPath });
    userDescription = content;
    console.log(`✅ Loaded user description from: ${descriptionPath}`);
  } catch (error) {
    console.error(`❌ Failed to load description from: ${descriptionPath}`);
    console.error(`   Error: ${error.message}`);
    // Continue without description
  }
}
```

**Step 1.6: Invoke Figma Analyzer Agent**

Build the agent prompt with all collected data:

```javascript
// Build base prompt
let prompt = `Analyze page from Figma.

Resolved page:
- PageName: ${PageName}
- FileKey: ${fileKey}
- NodeId: ${nodeId}`;

// Add user description if provided
if (userDescription) {
  prompt += `

User-provided description file:
- Path: ${descriptionPath}
- Content (authoritative, human-written screenshot/layout description):

\`\`\`
${userDescription}
\`\`\`

IMPORTANT: Treat the user description as authoritative. DO NOT modify or overwrite it.
Use it to:
- Confirm section ordering and naming
- Enrich semantic meaning of sections and components
- Extract textual content that may not be clear from Figma layers
- Detect discrepancies between design file and how the user sees the page

In the implementation plan, add a "User Description" section showing:
- Source file path: ${descriptionPath}
- Brief summary of what the description covers
- How it influenced the analysis`;
} else {
  prompt += `

No user description provided - using Figma-only analysis mode.`;
}

// Add remaining instructions
prompt += `

Now follow Steps 2-6:
1. Fetch Figma context (MCP tools: get_metadata, get_design_context, get_variable_defs, get_screenshot)
2. Run map-figma-nodes to generate UIMatch config
3. Analyze design (structure, tokens, components, assets, responsive strategy)
4. Compute component mapping (REUSE/EXTEND/CREATE)
5. Identify critical elements for pixel-perfect verification
6. Generate implementation-plan.md for this page

The plan should include all standard sections plus user description details if provided.`;

// Invoke agent
Task({
  subagent_type: "figma-analyzer",
  prompt: prompt
});
```

**Step 2: Fetch Figma Design Context**
```javascript
// Get page metadata and structure
mcp__figma__get_metadata({
  fileKey: "...",
  nodeId: "..."
})
// Returns: layer structure, component hierarchy

// Get design details
mcp__figma__get_design_context({
  fileKey: "...",
  nodeId: "..."
})
// Returns: styles, layout, text content

// Get design tokens
mcp__figma__get_variable_defs({
  fileKey: "...",
  nodeId: "..."
})
// Returns: colors, typography, spacing

// Get visual reference
mcp__figma__get_screenshot({
  fileKey: "...",
  nodeId: "..."
})
// Returns: screenshot for validation
```

**Step 2.5: Generate Complete UIMatch Config**

Run map-figma-nodes in Figma-only mode to generate comprehensive config with ALL Figma nodes:

```bash
Bash({
  command: `node scripts/map-figma-nodes.cjs \\
    --figma-url="${figmaUrl}" \\
    --mode=figma-only`,
  description: "Generate complete UIMatch config from Figma (no HTML required)"
})
```

**Verify config generation:**
```javascript
// Read generated config
const config = Read({ file_path: "docs/uimatch-config.json" });

// Parse and validate
const parsed = JSON.parse(config);

// Check metadata exists
if (!parsed.meta || !parsed.meta.totalNodes) {
  throw new Error('❌ Config generation failed: no nodes discovered');
}

// Display summary
console.log(`✅ Config generated successfully:`);
console.log(`   Total nodes: ${parsed.meta.totalNodes}`);
console.log(`   Sections: ${Object.keys(parsed.sections).length}`);
console.log(`   Elements: ${Object.keys(parsed.elements).length}`);
console.log(`   Page dimensions: ${parsed.meta.dimensions.width}×${parsed.meta.dimensions.height}px`);
console.log(`   All nodes marked as not implemented (ready for code generation)`);
```

**Include config summary in implementation plan:**
```markdown
## UIMatch Configuration

**Generated from Figma:** ${parsed.meta.generatedAt}

**Discovered Nodes:**
- Total: ${parsed.meta.totalNodes}
- Sections: ${Object.keys(parsed.sections).length}
- Elements: ${Object.keys(parsed.elements).length}

**Page Metadata:**
- File Key: ${parsed.meta.figmaFileKey}
- Node ID: ${parsed.meta.pageNodeId}
- Dimensions: ${parsed.meta.dimensions.width}×${parsed.meta.dimensions.height}px

**Config file:** `docs/uimatch-config.json`
```

**Step 3: Analyze Design**

Extract from Figma:
1. **Page Structure**:
   - Main sections (Hero, Content, CTA, etc.)
   - Component hierarchy
   - Layout approach (absolute positioning vs Auto Layout)

2. **Design Tokens**:
   - Colors (primary, secondary, backgrounds, text)
   - Typography (font families, sizes, weights)
   - Spacing (margins, padding, gaps)
   - Border radius, shadows, etc.

3. **Components**:
   - Shared components (Header, Footer, Button)
   - Page-specific components (HeroSection, etc.)
   - Interactive elements (forms, modals, etc.)

4. **Assets**:
   - Images (list all with URLs)
   - Icons (if any)
   - Logos, illustrations

5. **Responsive Strategy**:
   - Determine if design uses Figma Auto Layout
   - Plan responsive approach:
     - Auto Layout → Flexbox/Grid (ideal)
     - Absolute positioning → Dual layout strategy

**Step 4: Component Mapping (CRITICAL)**

This step determines what to REUSE, EXTEND, or CREATE.

#### 4.1: Inventory Existing Components

```bash
# Find ALL existing shared components
Glob: src/components/**/*.{jsx,tsx}
Glob: src/components/layout/*.{jsx,tsx}

# Read each component to understand:
# - Props it accepts
# - Visual structure
# - Variants it supports
```

#### 4.2: Compare Each Figma Section with Existing Components

For EACH section identified in Figma:

```markdown
1. Get screenshot of Figma section
2. Read existing component code
3. Compare structure:
   - Same layout? Same elements?
   - Differences = variant (color, text, show/hide element)?
4. Calculate similarity score (0-100%)
```

**Similarity Scoring:**
- Same structure, same content → 100% (identical)
- Same structure, different content → 90-99% (REUSE)
- Same structure, needs new prop → 70-89% (EXTEND)
- Different structure → <70% (CREATE)

#### 4.3: Decision Matrix

| Similarity | Action | Description |
|-----------|--------|-------------|
| **≥90%** | **REUSE** | Import component as-is, no changes needed |
| **70-89%** | **EXTEND** | Add new prop/variant to existing component |
| **<70%** | **CREATE** | Build new page-specific component |

#### 4.4: Document Component Mapping Table

```markdown
## Component Mapping

| Figma Section | Node ID | Existing Component | Similarity | Action | Changes Needed |
|---------------|---------|-------------------|------------|--------|----------------|
| Header (red bg) | 32:100 | Header.jsx | 85% | EXTEND | +variant="red" prop |
| Header (with center logo) | 41:200 | Header.jsx | 80% | EXTEND | +centerLogo prop |
| Footer | 32:900 | Footer.jsx | 100% | REUSE | none |
| Newsletter signup | 41:500 | NewsletterSection.jsx | 95% | REUSE | none |
| Hero image section | 32:300 | - | 0% | CREATE | new HeroSection.jsx |
| Wave background | 41:600 | WaveBackground.jsx | 90% | REUSE | pass color as prop |
```

**CRITICAL RULES:**
1. **Header is ALWAYS reused** - Never create HeaderVariant, ArticleHeader, etc.
2. **Footer is ALWAYS reused** - One Footer component for entire site
3. **If >70% similar → EXTEND existing component** - Don't duplicate
4. **Variants = props, not new components** - `variant="red"` not `RedHeader.jsx`

#### 4.5: Plan Component Extensions

For each EXTEND action, document required changes:

```markdown
## Component Extensions Required

### Header.jsx
**Current props:** variant (default|transparent)
**New props needed:**
- `centerLogo` (boolean) - Show logo in center instead of left
- `variant="red"` - Red background variant
- `variant="article"` - Article page style

**Implementation:**
\`\`\`jsx
// Add to Header.jsx
{centerLogo && (
  <div className="absolute left-1/2 -translate-x-1/2">
    <CenterLogo />
  </div>
)}
\`\`\`
```

**Step 5: Identify Critical Elements for Verification**

For pixel-perfect verification, identify:

1. **Logos and Branding**
   - Company logos
   - Partner logos
   - Branded graphics

2. **Mascots and Illustrations**
   - Character graphics (e.g., Gadek mascot)
   - Custom illustrations
   - Complex graphics

3. **Critical UI Elements**
   - Headers with precise layouts
   - Footers with exact positioning
   - Call-to-action buttons with specific styling

**For each critical element, extract:**
```javascript
{
  name: "Gadek mascot",
  nodeId: "2007-212",           // From Figma metadata
  selector: "[data-node-id='2007:212']",  // CSS selector for Playwright
  threshold: "STRICT",          // STRICT (≤1%) or DEFAULT (≤8%)
  priority: "HIGH",             // HIGH, MEDIUM, LOW
  reason: "Brand identity element, must be pixel-perfect"
}
```

**Threshold decision:**
- **STRICT (≤1%)**: Images, logos, icons (no text rendering issues)
- **DEFAULT (≤8%)**: Sections with text (allows font rendering differences)

**Step 6: Create Implementation Plan**

Generate plan document:
```markdown
# ${PageName} Implementation Plan

**Date**: 2025-11-24
**Figma URL**: https://figma.com/design/${fileKey}?node-id=${nodeId}
**Status**: Ready for code generation

---

## Design Analysis

### Page Structure
- **Dimensions**: 1728px × ${height}px (desktop)
- **Layout Type**: ${layoutType} (Auto Layout / Absolute positioning)
- **Sections**: ${sectionCount}

### Main Sections
1. **HeroSection** (top, ~800px height)
   - Purpose: Main campaign message
   - Components: Logo, heading, tagline, CTA button
   - Background: Image + overlay

2. **ContentSection** (middle)
   - Purpose: Campaign details
   - Components: Text blocks, images, cards
   - Layout: 2-column grid

3. **CTASection** (bottom)
   - Purpose: Call to action
   - Components: Heading, button, contact info

---

## Design Tokens

### Colors
\`\`\`javascript
const colors = {
  primary: '#E83F4B',
  primaryDark: '#B61919',
  secondary: '#0A5556',
  background: '#EFEEE8',
  backgroundLight: '#F6F5F1',
  backgroundAlt: '#E0DDD1',
  text: '#1E1E1E',
  accentYellow: '#F1C500',
  accentOrange: '#EF771B',
  accentBlue: '#273488'
};
\`\`\`

### Typography
- **Display Font**: Happy Season (headings)
- **Body Font**: Lato (400, 700, 900)
- **Heading Sizes**: h1: 72px, h2: 48px, h3: 36px
- **Body Size**: 16px (mobile), 18px (desktop)

### Spacing
- **Container padding**: 24px (mobile), 48px (desktop)
- **Section gaps**: 64px (mobile), 96px (desktop)
- **Element spacing**: 8px, 16px, 24px, 32px

---

## Component Mapping

### Decision Summary
| Action | Count |
|--------|-------|
| REUSE  | X     |
| EXTEND | X     |
| CREATE | X     |

### Full Mapping Table

| Figma Section | Node ID | Existing Component | Similarity | Action | Changes Needed |
|---------------|---------|-------------------|------------|--------|----------------|
| Header | XX:XX | Header.jsx | XX% | REUSE/EXTEND/CREATE | details |
| Footer | XX:XX | Footer.jsx | XX% | REUSE/EXTEND/CREATE | details |
| ... | ... | ... | ... | ... | ... |

### Component Extensions Required

#### Header.jsx (if EXTEND)
**Current props:** variant, ...
**New props needed:**
- `newProp` (type) - description

#### [Other components to extend...]

### New Components to Create

1. **ComponentName**
   - Purpose: ...
   - Figma Node: XX:XX
   - Structure: ...

---

## Components (Legacy Reference)

### Shared Components
- [x] **Header** - See Component Mapping above
- [x] **Footer** - See Component Mapping above
- [x] **Button** - See Component Mapping above

### Page-Specific Components (from CREATE actions)
See Component Mapping table - all CREATE actions become page-specific components.

---

## Assets

### Images (${imageCount} total)
1. `/assets/hero-bg.png` - ${url}
2. `/assets/g-card.png` - ${url}
3. `/assets/a-card.png` - ${url}
... (list all)

### Download Strategy
- Fetch all images from Figma API
- Save to `public/assets/` with descriptive names
- Optimize: Convert to WebP if >100KB

---

## Verification Plan

### Critical Elements for Pixel-Perfect Verification

Elements requiring element-level Figma comparison:

| Element | Figma Node ID | Selector | Threshold | Priority | Reason |
|---------|---------------|----------|-----------|----------|--------|
| Gadek mascot | 2007-212 | [data-node-id='2007:212'] | STRICT (≤1%) | HIGH | Brand identity, complex illustration |
| GADKI logo | 32-569 | [data-node-id='32:569'] | STRICT (≤1%) | HIGH | Brand logo, must be exact |
| FDDS logo | 32-614 | [data-node-id='32:614'] | STRICT (≤1%) | HIGH | Partner logo, legal requirement |
| Hero background | 21-100 | [data-section='hero'] | DEFAULT (≤8%) | MEDIUM | Large image with text overlay |

**Note:** Add `data-node-id` attributes during implementation for automated verification.

### Required Data Attributes

During implementation, add these attributes to critical elements:

```jsx
// Example: Gadek mascot
<div
  data-node-id="2007:212"
  data-element="gadek-mascot"
  className="absolute left-[774px] top-[80px] ..."
>
  <img src="/assets/gadek-mascot.png" alt="Gadek mascot" />
</div>

// Example: GADKI logo
<img
  data-node-id="32:569"
  data-element="gadki-logo"
  src="/assets/gadki-logo.svg"
  alt="GADKI logo"
/>
```

### Verification Commands (Post-Implementation)

After code generation, run these verification checks:

#### 1. Element-Level Verification (Critical Assets)
```bash
# Gadek mascot (STRICT threshold)
make verify-element \
  URL=http://localhost:5173/ \
  SELECTOR="[data-node-id='2007:212']" \
  NODE_ID=2007-212 \
  STRICT=true

# GADKI logo (STRICT threshold)
make verify-element \
  URL=http://localhost:5173/ \
  SELECTOR="[data-node-id='32:569']" \
  NODE_ID=32-569 \
  STRICT=true

# FDDS logo (STRICT threshold)
make verify-element \
  URL=http://localhost:5173/ \
  SELECTOR="[data-node-id='32:614']" \
  NODE_ID=32-614 \
  STRICT=true
```

#### 2. Section-Level Verification
```bash
# Scan all sections for structural issues
make verify-sections URL=http://localhost:5173/

# Per-section Figma comparison
make verify-sections-figma URL=http://localhost:5173/
```

#### 3. Full Page Validation
```bash
# Complete validation pipeline (9 steps)
/6-validate-page ${PageName}
```

### Expected Verification Results

| Check | Expected Result | Action if Failed |
|-------|----------------|------------------|
| Element comparison (logos) | PASS (≤1% diff) | Re-export asset from Figma, check CSS transforms |
| Element comparison (mascot) | PASS (≤1% diff) | Verify positioning, check for scaling issues |
| Section scan | PASS (no structural issues) | Fix ZERO_HEIGHT, FLIPPED_IMAGE issues |
| Asset manifest | PASS (all assets correct) | Replace wrong assets, fix positions |
| UIMatch full page | PASS (≤8% diff) | Analyze diff.png for structural vs font differences |

### Asset Manifest Template

Create `docs/asset-manifest.json` for automated asset verification:

```json
{
  "page": "${PageName}",
  "sections": {
    "hero": {
      "description": "Hero section with Gadek mascot",
      "assets": [
        {
          "name": "gadek-mascot.png",
          "nodeId": "2007-212",
          "x": 774,
          "y": 80,
          "w": 180,
          "h": 180,
          "role": "mascot",
          "critical": true
        }
      ]
    },
    "header": {
      "description": "Site header with logos",
      "assets": [
        {
          "name": "gadki-logo.svg",
          "nodeId": "32-569",
          "x": 68,
          "y": 143,
          "w": 175,
          "h": 76,
          "role": "logo",
          "critical": true
        },
        {
          "name": "fdds-logo.svg",
          "nodeId": "32-614",
          "x": 110,
          "y": 64,
          "w": 164,
          "h": 71,
          "role": "logo",
          "critical": true
        }
      ]
    }
  }
}
```

---

## Responsive Strategy

### Approach: Dual Layout
**Desktop (≥1024px)**: Pixel-perfect from Figma
- Use exact positions, sizes from Figma
- Absolute positioning where needed
- Fixed width: 1728px container

**Mobile/Tablet (<1024px)**: Semantic responsive
- Flexbox/Grid for layout
- Stacked sections
- Fluid typography (clamp)
- Touch-friendly spacing

### Breakpoints
- `sm: 640px` - Mobile landscape
- `md: 768px` - Tablet
- `lg: 1024px` - Desktop (pixel-perfect)
- `xl: 1280px` - Large desktop
- `2xl: 1536px` - Extra large

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create directory: `src/pages/${PageName}/`
- [ ] Create components directory: `src/pages/${PageName}/components/`
- [ ] Download all assets to `public/assets/`

### Phase 2: Code Generation (via /3-generate-code)
- [ ] Generate main page component
- [ ] Generate section components
- [ ] Extract/import shared components
- [ ] Add route to App.jsx
- [ ] Create page README.md

### Phase 3: Refinement (via /4-refine-code)
- [ ] Extract design tokens to tailwind.config
- [ ] Split large components
- [ ] Add PropTypes
- [ ] Optimize performance
- [ ] Add accessibility (alt, ARIA)
- [ ] Add JSDoc documentation

### Phase 4: Validation
- [ ] Visual comparison with Figma
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility audit
- [ ] Performance check

---

## Next Steps

**Ready for code generation!**

Run: `/3-generate-code ${PageName}`

This will:
1. Read this implementation plan
2. Fetch Figma design context
3. Generate React components
4. Download assets
5. Update App.jsx routing
6. Create component documentation

After generation, run `/4-refine-code` to polish the code.
```

**Step 6: Update Implementation Status**

```markdown
## Workflow Progress

### Current Step: ✅ ${PageName} Analyzed - Ready for Code Generation

**Completed:**
- ✅ Phase 0: Full project analysis
- ✅ Phase 1: ${PageName} page analysis

**Analysis Results:**
- Page dimensions: 1728px × ${height}px
- Sections: ${sectionCount}
- Components: ${componentCount}
- Assets: ${assetCount} images
- Design tokens: ${colorCount} colors, ${fontCount} fonts

**Next Step:** /3-generate-code
```

### Output

Agent generates:
```
docs/gadki/
└── plans/
    └── 2025-11-24-${PageName}-implementation-plan.md
```

---

## After Completion

Inform user:
```
✅ Page analysis complete!

📊 ${PageName}:
- Dimensions: 1728px × ${height}px
- Sections: ${sectionCount}
- Components: ${componentCount} (${sharedCount} shared, ${pageSpecificCount} page-specific)
- Assets: ${assetCount} images
- Design tokens: ${colorCount} colors, ${fontCount} fonts

📋 Saved to: docs/gadki/plans/2025-11-24-${PageName}-implementation-plan.md

🚀 Next step: /3-generate-code
   Generate React code from this plan
```

---

## Examples

### Example 1: Analyze by Page Name with User Description
```bash
/2-analyze-page Homepage input/strona_glowna/homepage.md
```
Finds Homepage in status, loads user description, merges with Figma analysis.

### Example 2: Analyze by Figma URL with User Description
```bash
/2-analyze-page https://figma.com/design/BDWqfvcMQw8RpFhMMMVRa3/Gadki?node-id=21-2 input/strona_glowna/homepage.md
```
Extracts page info from URL, loads description, performs enriched analysis.

### Example 3: Analyze by Page Name Only (Figma-only mode)
```bash
/2-analyze-page Homepage
```
Finds Homepage in status, analyzes using Figma data only.

### Example 4: Auto-detect Current Page
```bash
/2-analyze-page
```
Detects current page from `implementation-status.md`, analyzes it.

### Example 5: Auto-detect with User Description
```bash
/2-analyze-page "" input/strona_glowna/homepage.md
```
Auto-detects page, loads description for enriched analysis.

---

## Notes

- **Simplified for direct generation**: No Figma Make prompts
- **Focus**: Structure + tokens + implementation checklist
- **Output**: Plan for `/3-generate-code` to use
- **Reusability**: Analysis works for any Figma page design
- **User descriptions**: Optional `.md` files enrich analysis with human-written context
  - Helps confirm section ordering and naming
  - Captures textual content hard to extract from Figma
  - Spots discrepancies between design and implementation intent

---

## Workflow Integration

**This command is part of the new Figma → React workflow:**

1. `/1-analyze-project` - Full project discovery
2. **`/2-analyze-page`** ⬅️ YOU ARE HERE
3. `/3-generate-code` - Generate React code
4. `/4-refine-code` - Polish generated code
5. `/5-compare-existing` - Compare with Figma (optional)

**Dependencies:**
- Requires: `implementation-status.md` from `/1-analyze-project`
- Produces: Implementation plan for `/3-generate-code`

$ARGUMENTS
