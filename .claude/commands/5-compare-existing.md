---
description: Compare existing component with Figma design and plan updates
---

# Compare Existing Component with Figma

Compare an existing component in the codebase with its Figma design and plan refactoring updates.

## Arguments

- **Component Figma URL** (required): URL with node-id for the component
  - Format: `https://figma.com/design/{fileKey}/{fileName}?node-id={X-Y}`

Agent will automatically find the existing component in the codebase.

## Instructions

Use the **figma-analyzer agent** with comparison mode.

### Steps:

1. Extract fileKey and nodeId from URL
2. Fetch component design from Figma
3. Search codebase for existing component with same/similar name
4. Read existing component code
5. Compare:
   - Structure differences
   - Styling differences
   - Props differences
   - Missing features
6. Create refactoring plan (skip Anima generation)
7. Update Workflow Progress

### Output:

- `docs/[project]/refactoring/[date]-[Component]-comparison-plan.md` with:
  - Current vs. Design comparison
  - Differences identified
  - Refactoring steps to align with design
  - No Anima prompts (uses existing code)

### After completion:

```
✅ Comparison complete!

📊 [ComponentName]:
- Existing: src/[path]/[Component].tsx
- Match: [X]%
- Differences: [Y] found

📋 Refactoring plan saved to: docs/[project]/refactoring/[date]-[Component]-comparison-plan.md

🚀 Next step: /6-execute-refactoring
   This will update the existing component to match Figma design
```

$ARGUMENTS
