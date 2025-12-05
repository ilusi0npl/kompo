# UX Designer Agent Ecosystem - Quick Start Guide

## 📁 What Was Created

**Three specialized agents** that automate the **Figma → Anima → Claude Code** workflow:

```
.claude/agents/
├── figma-analyzer-agent.md           # Agent 1: Analyzes Figma designs
├── anima-prompt-writer-agent.md      # Agent 2: Generates English prompts for Anima
├── code-integration-planner-agent.md # Agent 3: Plans code refactoring
└── README.md                          # This file (with 7 ready commands)
```

**+ 7 ready-to-use commands** to orchestrate the entire process (see below)

---

## ⚡ TL;DR - Start in 30 Seconds

**Copy this command and replace the placeholders**:

```
Analyze [ComponentName] from Figma:
https://figma.com/design/{your-file-key}/{file-name}?node-id={X-Y}
```

**Then**:
1. Answer Agent 1's questions
2. Copy English prompts to dev.animaapp.com
3. Generate code in Anima
4. Paste code back to Claude Code
5. Say "Execute this refactoring plan"

**Done!** ✅ Your component is ready.

[See all 7 commands below ⬇️](#-ready-to-use-commands)

---

## 🎮 Ready-to-Use Commands

Copy and paste these commands into Claude Code to start the workflow:

### 1️⃣ Analyze Single Component from Figma

```
Analyze [ComponentName] from Figma:
https://figma.com/design/{fileKey}/{fileName}?node-id={X-Y}
```

**Replace**:
- `[ComponentName]` with actual component name (e.g., "HeroSection", "Navbar", "ProductCard")
- `{fileKey}` with your Figma file key from the URL
- `{fileName}` with your Figma file name (optional, for readability)
- `{X-Y}` with the node-id from Figma URL (e.g., "21-2" or "40-935")

**What happens**:
- Agent 1 (figma-analyzer) launches automatically
- Analyzes the Figma design
- Asks you questions about implementation
- Agent 2 (anima-prompt-writer) generates English prompts for Anima
- You copy prompts → paste to dev.animaapp.com → generate code → download

---

### 2️⃣ Analyze Entire Page from Figma

```
Analyze the full [PageName] page from Figma and create implementation plan:
https://figma.com/design/{fileKey}/{fileName}?node-id={X-Y}
```

**What happens**:
- Agent 1 analyzes the entire page
- Breaks it down into reusable components + page-specific sections
- Creates master implementation plan with priorities

---

### 3️⃣ Batch Analyze Multiple Components

```
Analyze these components from Figma and create batch plan:
1. [Component1] - https://figma.com/design/{fileKey}?node-id={X-Y}
2. [Component2] - https://figma.com/design/{fileKey}?node-id={X-Y}
3. [Component3] - https://figma.com/design/{fileKey}?node-id={X-Y}
4. [Component4] - https://figma.com/design/{fileKey}?node-id={X-Y}
```

**What happens**:
- Agent 1 analyzes all components
- Creates master plan with priorities
- Agent 2 generates ALL Anima prompts at once
- You can batch-generate all components in Anima

---

### 4️⃣ Integrate Anima-Generated Code

```
Here's the Anima-generated code for [ComponentName]:

[Paste the full .tsx file content here]

Implementation plan: docs/[project_name]/plans/YYYY-MM-DD-[ComponentName]-implementation-plan.md
Anima prompts: docs/[project_name]/plans/YYYY-MM-DD-[ComponentName]-anima-prompts.md
```

**Example**:
```
Here's the Anima-generated code for FAQ:

[Paste FAQ.tsx content]

Implementation plan: docs/gadki-experiment/plans/2025-11-16-FAQ-implementation-plan.md
Anima prompts: docs/gadki-experiment/plans/2025-11-16-FAQ-anima-prompts.md
```

**What happens**:
- Agent 3 (code-integration-planner) launches
- Reads both plan files for full context
- Analyzes the Anima code
- Creates step-by-step refactoring plan
- Saves plan to `docs/[project_name]/refactoring/YYYY-MM-DD-[ComponentName]-refactoring-plan.md`

---

### 5️⃣ Compare Existing Component with Figma

```
Compare existing [ComponentName] component with Figma design and plan updates:
https://figma.com/design/{fileKey}/{fileName}?node-id={X-Y}
```

**What happens**:
- Agent 1 analyzes Figma design
- Reads your existing component code
- Identifies differences (styling, structure, props)
- Plans refactoring without regenerating via Anima

---

### 6️⃣ Start Full Project Implementation

```
I want to implement the complete project from Figma. Start with Phase 0 project discovery.
```

**What happens**:
- Agent 1 enters Phase 0: Project Discovery
- Reads your project docs (CLAUDE.md, package.json, tailwind.config.js)
- Maps all existing components
- Asks strategic questions about workflow
- Creates complete master plan for entire project

---

### 7️⃣ Execute Refactoring Plan

After Agent 3 creates and saves a refactoring plan:

```
Execute refactoring plan from docs/[project_name]/refactoring/YYYY-MM-DD-[ComponentName]-refactoring-plan.md
```

**Example**:
```
Execute refactoring plan from docs/gadki-experiment/refactoring/2025-11-16-FAQ-refactoring-plan.md
```

**What happens**:
- Claude Code reads the saved refactoring plan
- Follows the step-by-step plan autonomously
- Adds TypeScript interfaces
- Extracts hardcoded values to props
- Replaces duplicate components
- Fixes styling/design tokens
- Runs Visual Verification automatically as final step
- Runs tests

---

### 8️⃣ Analyze Full Project Structure

```
Analyze full project from Figma:
https://figma.com/design/{fileKey}/{fileName}
```

**Example**:
```
Analyze full project from Figma:
https://figma.com/design/BDWqfvcMQw8RpFhMMMVRa3/Gadki_www_OST
```

**What happens**:
- Agent 1 fetches ALL pages and frames from Figma
- Intelligently identifies shared components (Header, Footer, Buttons, etc.)
- Detects page-specific sections
- Analyzes local codebase for existing components
- Creates complete project map in `implementation-status.md`
- Recommends implementation order (shared components first, then pages)

**When to use**:
- **First time**: Runs automatically when no `implementation-status.md` exists
- **Manual refresh**: Use this command to re-analyze the project (e.g., after Figma changes)

**Output**:
- Complete Figma project map with all pages and components
- Shared components identified with occurrence count
- Page-specific sections listed
- Comparison with existing codebase
- Recommended implementation order

---

## 📊 Workflow Progress Tracking

Each component's progress is tracked in `implementation-status.md` with explicit checkboxes:

```markdown
## Workflow Progress

### Header - In Progress

- [x] 1. Analyze full project (Command #8) - `implementation-status.md` created
- [x] 2. Analyze component (Command #1) - `2025-11-18-Header-implementation-plan.md`
- [ ] 3. Generate Anima prompts (Command #2)
- [ ] 4. [USER] Generate code in Anima
- [ ] 5. Integrate code (Command #4)
- [ ] 6. Execute refactoring (Command #7)
- [ ] 7. Visual verification

### Footer - Not Started

- [ ] 1. Analyze full project (Command #8)
...
```

**Benefits:**
- Always know exactly where you are in the workflow
- Each agent automatically updates progress after completing their task
- Clear next steps after each command

---

## 🤖 Autonomous AI Decisions

Agents make strategic decisions automatically to minimize user input:

| Decision | AI Choice | Reasoning |
|----------|-----------|-----------|
| Strategy | Shared components first | Most efficient - reuse across pages |
| Batch | One at a time | Verify each before proceeding |
| Existing code | Based on match % | >70% refactor, <30% regenerate |

**AI asks user only when:**
- Certainty <80% (multiple equally good options)
- Destructive action (overwrite/delete existing code)
- Critical information missing

---

## 🎯 Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 0 (First Run Only): Project Discovery                        │
│ • User provides project name                                       │
│ • Agent 1 analyzes project structure                               │
│ • Saves: docs/[project]/implementation-status.md                   │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 1: figma-analyzer                                             │
│ • User provides Figma URL                                           │
│ • Agent analyzes design & asks questions                            │
│ • Saves: docs/[project]/plans/YYYY-MM-DD-[Component]-              │
│          implementation-plan.md                                     │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 2: anima-prompt-writer                                        │
│ • User provides: path to implementation plan                        │
│ • Agent reads plan & generates English prompts                      │
│ • Saves: docs/[project]/plans/YYYY-MM-DD-[Component]-              │
│          anima-prompts.md                                           │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│ USER ACTION: Anima Code Generation                                  │
│ • Copy prompts from anima-prompts.md                                │
│ • Paste to dev.animaapp.com                                         │
│ • Generate code → Download ZIP                                      │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT 3: code-integration-planner                                   │
│ • User provides: code + paths to implementation plan & prompts      │
│ • Agent reads both files & creates refactoring plan                 │
│ • Saves: docs/[project]/refactoring/YYYY-MM-DD-[Component]-        │
│          refactoring-plan.md                                        │
└─────────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│ CLAUDE CODE: Execute Refactoring                                    │
│ • User: "Execute refactoring plan from [path]"                      │
│ • Claude Code reads plan & executes each step autonomously          │
│ • Visual Verification runs automatically as final step              │
│ • DONE ✅                                                           │
└─────────────────────────────────────────────────────────────────────┘

File Structure Created:
docs/[project_name]/
├── implementation-status.md          ← Phase 0 output, updated progress
├── plans/
│   ├── YYYY-MM-DD-[Component]-implementation-plan.md  ← Agent 1
│   └── YYYY-MM-DD-[Component]-anima-prompts.md        ← Agent 2
└── refactoring/
    └── YYYY-MM-DD-[Component]-refactoring-plan.md     ← Agent 3
```

---

## 🚀 How to Use

### First Time Setup (Phase 0)

**IMPORTANT**: On your first run, Agent 1 will ask for the project name and perform project discovery:

```
User: "Analyze [ComponentName] from Figma: [URL]"

Agent 1: "What is the project name?"
User: "gadki-experiment"

Agent 1: [Performs Phase 0: Project Discovery]
         - Analyzes project structure
         - Creates directory structure:
           docs/gadki-experiment/plans/
           docs/gadki-experiment/refactoring/
         - Saves: docs/gadki-experiment/implementation-status.md
         [... continues with component analysis ...]
```

**On subsequent runs**, Agent 1 will:
- Read `implementation-status.md` instead of running Phase 0
- Jump directly to analyzing the requested component
- Track progress in the status file

---

### Example: Implementing a Component from Figma

#### Step 1: Launch Agent 1 (Figma Analyzer)

**In Claude Code, type**:
```
Analyze [ComponentName] from Figma:
https://figma.com/design/{fileKey}/{fileName}?node-id={X-Y}
```

**Example (from a real project)**:
```
Analyze MaterialDownloadList from Figma:
https://figma.com/design/BDWqfvcMQw8RpFhMMMVRa3/ProjectName?node-id=40-935
```

**What Agent 1 will do**:
1. Fetch design metadata from Figma
2. Search your codebase for existing [ComponentName]
3. Ask you questions like:
   - "[Should X feature be included by default?]"
   - "[Should Y be a sub-component?]"
4. Create implementation plan

**You answer the questions**, then Agent 1 outputs a plan.

---

#### Step 2: Launch Agent 2 (Anima Prompt Writer)

**After Agent 1 saves the implementation plan**, you invoke Agent 2 with:

```
"Generate Anima prompts from: docs/[project_name]/plans/YYYY-MM-DD-[ComponentName]-implementation-plan.md"
```

**Example**:
```
"Generate Anima prompts from: docs/gadki-experiment/plans/2025-11-16-FAQ-implementation-plan.md"
```

**What Agent 2 will do**:
1. Take the implementation plan
2. Generate step-by-step English prompts for dev.animaapp.com
3. Include:
   - Exact Figma selection instructions
   - Anima configuration settings
   - What to copy/ignore after generation
   - Cleanup requirements

**Agent 2 saves prompts to**: `docs/[project_name]/plans/YYYY-MM-DD-[ComponentName]-anima-prompts.md`

**Example file**:
```
docs/gadki-experiment/plans/2025-11-16-FAQ-anima-prompts.md
```

**Content example**:
```markdown
# Anima Prompt 1: [ComponentName]

## 📍 Figma Setup
1. Open: https://figma.com/design/{fileKey}?node-id={X-Y}
2. Navigate to "[Page Name]" page
3. Select [specific elements to include]

## ⚙️ Anima Configuration
- Framework: React
- Language: TypeScript
- Styling: Tailwind CSS

## 🚀 Steps
1. Click Generate Code
2. Download ZIP
3. Extract files

## ✅ What to Copy
✅ src/[ComponentName].tsx → [discovered shared components directory]/

## 🧹 Cleanup (for Agent 3)
- Add props: [propName1], [propName2]
- Extract [hardcoded data] to constants
- Replace [duplicate components]
```

---

#### Step 3: You Go to Anima

**Copy the English prompts** from Agent 2 output.

**In dev.animaapp.com**:
1. Open Figma URL as instructed
2. Select component as described
3. Configure Anima (React + TypeScript + Tailwind)
4. Click Generate Code
5. Download ZIP file
6. Extract and find the generated .tsx files

---

#### Step 4: You Return with Code

**Paste the generated code and file paths** to Claude Code:

```
Here's the Anima-generated code for [ComponentName]:

[Paste [ComponentName].tsx content here]

Implementation plan: docs/[project_name]/plans/YYYY-MM-DD-[ComponentName]-implementation-plan.md
Anima prompts: docs/[project_name]/plans/YYYY-MM-DD-[ComponentName]-anima-prompts.md
```

**Example**:
```
Here's the Anima-generated code for FAQ:

[Paste FAQ.tsx content]

Implementation plan: docs/gadki-experiment/plans/2025-11-16-FAQ-implementation-plan.md
Anima prompts: docs/gadki-experiment/plans/2025-11-16-FAQ-anima-prompts.md
```

**Claude Code launches Agent 3.**

---

#### Step 5: Agent 3 (Code Integration Planner)

**What Agent 3 will do**:
1. Analyze the Anima-generated code
2. Identify hardcoded values → should be props
3. Find duplicate components → should reuse existing Button, Link, etc.
4. Plan refactoring steps (numbered, actionable)
5. Create testing checklist

**Agent 3 saves refactoring plan to**: `docs/[project_name]/refactoring/YYYY-MM-DD-[ComponentName]-refactoring-plan.md`

**Example file**:
```
docs/gadki-experiment/refactoring/2025-11-16-FAQ-refactoring-plan.md
```

**Content example**:
```markdown
# Code Integration Plan: [ComponentName]

## Step 1: Add TypeScript Interface
```typescript
interface [ComponentName]Props {
  [propName]?: [type];
}
```

## Step 2: Extract Hardcoded Data
Move [data array/object] to constant...

## Step 3: Replace Duplicate Components
Find: <button className="...">
Replace: <Button variant="..." />

## Step 4-10: [More refactoring steps...]

## Testing Checklist
- [ ] Component renders
- [ ] Props work correctly
- [ ] [Feature] shows/hides based on [prop]
```

---

#### Step 6: Claude Code Executes

**You say**:
```
Execute refactoring plan from docs/[project_name]/refactoring/YYYY-MM-DD-[ComponentName]-refactoring-plan.md
```

**Example**:
```
Execute refactoring plan from docs/gadki-experiment/refactoring/2025-11-16-FAQ-refactoring-plan.md
```

**Claude Code will**:
1. Read the refactoring plan from Agent 3
2. Execute each step sequentially
3. Add TypeScript interfaces
4. Extract hardcoded values to props
5. Replace duplicate components with existing ones
6. Add state management if needed
7. Fix styling to use project tokens
8. Run tests

**Result**: Fully integrated, production-ready component! 🎉

---

## 📋 Usage Patterns

### Pattern 1: New Component (doesn't exist)
```
1. "Analyze [ComponentName] from Figma [URL]"
2. Agent 1 → Agent 2 → You copy prompts to Anima
3. Generate code in Anima
4. Paste back → Agent 3 → Claude Code refactors
```

### Pattern 2: Existing Component (needs update)
```
1. "Analyze [ComponentName] from Figma [URL]"
2. Agent 1 finds existing component, asks: "Regenerate or refactor?"
3. If regenerate: Same as Pattern 1
4. If refactor: Claude Code updates existing without Anima
```

### Pattern 3: Full Page (many components)
```
1. "Analyze [PageName] from Figma [URL]"
2. Agent 1 breaks down into sections
3. For each unique section:
   - Agent 2 generates Anima prompt
   - You generate in Anima
   - Agent 3 plans refactoring
4. For shared sections (Header, Footer):
   - Skip Anima, reuse existing components
```

---

## 💡 Tips for Best Results

### When Talking to Agent 1:
✅ **Provide complete Figma URL** with node-id
✅ **Specify if component already exists** in project
✅ **Answer questions thoughtfully** - they affect the entire flow
✅ **Mention any special requirements** (variants, props, state)

### When Using Anima:
✅ **Follow Agent 2's prompts exactly** - they're tested and specific
✅ **Select exactly what's described** - precise selection matters
✅ **Verify Anima config** before generating (React + TS + Tailwind)
✅ **Download immediately** - Anima sessions can expire

### When Pasting Code to Agent 3:
✅ **Paste the full component file** - don't truncate
✅ **Include any sub-components** generated by Anima
✅ **Mention if you made manual changes** - Agent 3 needs to know

---

## 🎓 Advanced Usage

### Multi-Component Generation

If you need to generate 5+ components:

```
"Analyze these components from Figma and create a batch plan:
1. [Component1] (node-id: {X-Y})
2. [Component2] (node-id: {X-Y})
3. [Component3] (node-id: {X-Y})
4. [Component4] variant1 (node-id: {X-Y})
5. [Component4] variant2 (node-id: {X-Y})"
```

Agent 1 will create a **master plan** with all components, then Agent 2 will generate **all prompts at once** so you can batch-process in Anima.

### Component Variants

For components with multiple variants (e.g., [Component]: variant1 + variant2):

Agent 2 will generate **separate prompts** for each variant:
```
# Anima Prompt 1A: [ComponentName] - Variant A
# Anima Prompt 1B: [ComponentName] - Variant B
```

Then Agent 3 will plan how to **merge them** into a single component with `variant` prop.

### Partial Updates

If you only want to update styling (not regenerate):

```
"Compare existing [ComponentName] with Figma design and plan styling updates only"
```

Agent 1 will skip to Claude Code refactoring without going through Anima.

---

## 🐛 Troubleshooting

### Issue: Agent 1 can't find Figma design

**Solution**:
- Verify URL format: `https://figma.com/design/{fileKey}/...?node-id=XX-YY`
- Check if you have access to the Figma file
- Try using Figma's "Copy link" feature for exact URL

### Issue: Anima generates wrong component

**Solution**:
- Re-read Agent 2's selection instructions carefully
- Use Figma's search (Cmd/Ctrl + F) to find exact component name
- Try selecting parent frame instead of individual layers
- Contact me to regenerate Agent 2 prompts

### Issue: Agent 3's plan has TypeScript errors

**Solution**:
- Paste the FULL error message when asking for help
- Agent 3 will update the plan with correct types
- If persistent, check project's tsconfig.json settings

### Issue: Refactored component doesn't match design

**Solution**:
- Compare with Figma using screenshot: "Does this match? [screenshot]"
- Agent 3 will identify styling differences
- Update Tailwind classes to match design tokens

---

## 📚 Related Documentation

- **Main Implementation Plan**: `/plan/IMPLEMENTATION_PLAN.md`
- **Anima Guide**: `/plan/ANIMA_IMPLEMENTATION_GUIDE.md`
- **Quick Implementation**: `/plan/QUICK_IMPLEMENTATION_GUIDE.md`
- **Project Instructions**: `/CLAUDE.md`

---

## 🎯 Quick Reference

| Need to... | Command Number | Quick Command |
|------------|----------------|---------------|
| Analyze single component | 1️⃣ | `Analyze [Component] from Figma: [URL]` |
| Analyze full page | 2️⃣ | `Analyze the full [Page] page from Figma: [URL]` |
| Batch analyze components | 3️⃣ | `Analyze these components: [list]` |
| Generate Anima prompts | 2️⃣ | `Generate Anima prompts from: docs/[project]/plans/[date]-[Component]-implementation-plan.md` |
| Integrate Anima code | 4️⃣ | `Here's the Anima-generated code: [paste] + Implementation plan: [path] + Anima prompts: [path]` |
| Compare with existing | 5️⃣ | `Compare existing [Component] with Figma: [URL]` |
| Start full project | 6️⃣ | `I want to implement the complete project from Figma` |
| Execute refactoring | 7️⃣ | `Execute refactoring plan from docs/[project]/refactoring/[date]-[Component]-refactoring-plan.md` |
| Analyze full Figma project | 8️⃣ | `Analyze full project from Figma: [URL]` |

**See full command details in [🎮 Ready-to-Use Commands](#-ready-to-use-commands) section above.**

---

## ✨ Example Session

**Full example from start to finish**:

```
User: "Analyze [ComponentName] from Figma
       https://figma.com/design/{fileKey}?node-id={X-Y}"

Agent 1: [Fetches design, searches codebase]
         "[ComponentName] doesn't exist. Questions:
          1. [Should feature X be configurable via props?]
          2. [Should sub-element Y be included?]"

User: "[Answers to questions]"

Agent 1: [Creates plan]
         "✅ Generate via Anima: [ComponentName]
          Props needed: [prop1], [prop2], [prop3]
          💾 Saved plan to: docs/gadki-experiment/plans/2025-11-16-[ComponentName]-implementation-plan.md"

User: "Generate Anima prompts from: docs/gadki-experiment/plans/2025-11-16-[ComponentName]-implementation-plan.md"

Agent 2: [Reads plan, generates English prompt]
         "# Anima Prompt: [ComponentName]
          ## Figma Setup
          1. Open: [URL]
          2. Select [specific section/frame]
          ...
          💾 Saved prompts to: docs/gadki-experiment/plans/2025-11-16-[ComponentName]-anima-prompts.md"

User: [Copies prompts from saved file to Anima, generates, downloads]
      "Here's the Anima-generated code for [ComponentName]:

       [pastes code]

       Implementation plan: docs/gadki-experiment/plans/2025-11-16-[ComponentName]-implementation-plan.md
       Anima prompts: docs/gadki-experiment/plans/2025-11-16-[ComponentName]-anima-prompts.md"

Agent 3: [Reads both files, analyzes code]
         "# Code Integration Plan: [ComponentName]
          ## Step 1: Add props interface...
          ## Step 2: Extract [hardcoded values]...
          ## Step 3-10: [More steps]...
          💾 Saved refactoring plan to: docs/gadki-experiment/refactoring/2025-11-16-[ComponentName]-refactoring-plan.md"

User: "Execute refactoring plan from docs/gadki-experiment/refactoring/2025-11-16-[ComponentName]-refactoring-plan.md"

Claude Code: [Reads saved plan, refactors code step-by-step]
             "✅ Refactoring complete!
              - Added TypeScript interface
              - Extracted [data] to props
              - Replaced [duplicates] with existing components
              - Fixed [styling/tokens]
              Component ready at: [discovered path]/[ComponentName].tsx"

User: "Test it in [PageName] page"

Claude Code: [Adds import and usage]
             "✅ Integrated into page. Run dev server to test."

DONE! 🎉
```

---

**Questions?** Just ask! These agents are designed to be conversational and helpful. They'll guide you through the entire process.

**Happy coding! 🚀**
