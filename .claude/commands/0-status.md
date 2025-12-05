---
description: Show current workflow progress from implementation-status.md
---

# Check Workflow Status

Read and display the current workflow progress from `implementation-status.md`.

## Instructions

1. Find the implementation-status.md file:
   ```
   Glob pattern: docs/**/implementation-status.md
   ```

2. If file exists:
   - Read the full file
   - Display project info
   - Show pages status table
   - Show shared components status
   - Display current step and next action

3. If file doesn't exist:
   - Inform user: "No implementation-status.md found. Start with /1-analyze-project [Figma URL]"

## Output Format

```
📊 Workflow Status

Project: [project_name]
Figma: [link]
Last updated: [timestamp]

## Pages Status

| Page | Status | Notes |
|------|--------|-------|
| Homepage | ✅ done | First page, extracted components |
| About | 🔄 in-progress | Generating prompt |
| Contact | ⏳ pending | |

## Shared Components

| Component | Status | Location |
|-----------|--------|----------|
| Header | ✅ done | src/components/layout/Header.tsx |
| Footer | ✅ done | src/components/layout/Footer.tsx |
| Button | ✅ done | src/components/ui/Button.tsx |

## Current Step
Page: [current page]
Phase: [current phase]
Next Action: [what to do next]

📋 Next command: [/command-name]
```

$ARGUMENTS
