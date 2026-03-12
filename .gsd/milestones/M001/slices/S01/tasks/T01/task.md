# T01: Color System + Typography in Figma Variables
Slice: M001/S01
Created: 2026-03-12

## Goal
Set up the complete Reflect color palette and typography system in Figma using Variables (not Styles), with light/dark mode support and the exact palette from research specs.

## Steps
1. Create Figma file: "Reflect Design System"
2. Open Variables panel (Local Variables) → create Collection: `Primitives`
3. Add all raw color values as primitives (oklch values — use Figma's color picker)
4. Create Collection: `Semantic` with Modes: Light, Dark
5. Map semantic roles to primitive values (both light and dark variants)
6. Create Spacing collection: 4, 8, 12, 16, 20, 24, 32, 48, 64
7. Load fonts: Plus Jakarta Sans (400, 600, 700) + Lora (400, 700)
8. Create text styles using Variables: Display, Title, Body, Caption, Journal Body
9. Create a `🎨 Foundations` page documenting the full system with usage notes
10. Add a `NO_RN_EXPORT` component annotation template for unsupported Figma effects

## Must-Haves

### Truths
- [ ] Primitives collection has ≥12 color variables (bg-primary, surface, brand-warm, brand-calm, mood-positive, mood-negative, text-primary, text-muted, border, overlay, error, success)
- [ ] Semantic collection has Light AND Dark modes defined
- [ ] Typography scale has exactly 5 text styles: Display 32/700, Title 24/600, Body 16/400 lh-1.6, Caption 13/400, Journal 18/400 lh-1.8 (Lora)
- [ ] Spacing scale defined as Variables: 4/8/12/16/20/24/32/48/64

### Artifacts
- [ ] Figma file "Reflect Design System" exists and is shared
- [ ] `🎨 Foundations` page with color swatches, type scale, spacing grid
- [ ] Variables panel shows 2 collections (Primitives + Semantic), ≥12 color vars each
- [ ] Text styles panel shows 5 text styles

### Key Links
- [ ] Each semantic Variable references a Primitive Variable (not hardcoded hex)
- [ ] All text styles use Plus Jakarta Sans except `Journal Body` which uses Lora

## Context Needed
- D002: Figma-first approach — this is the foundation everything builds on
- D009: App name Reflect, wordmark in Plus Jakarta Sans SemiBold

## Color Values to Use
```
Primitives:
  color-amber-400: oklch(72% 0.15 45)    ← brand warm
  color-teal-500:  oklch(65% 0.10 230)   ← brand calm
  color-sage-400:  oklch(78% 0.14 130)   ← mood positive
  color-coral-400: oklch(72% 0.12 35)    ← mood negative
  color-neutral-950: oklch(20% 0.02 260) ← text primary
  color-neutral-500: oklch(55% 0.02 260) ← text muted
  color-warm-50:   oklch(97% 0.01 80)    ← bg primary
  color-white:     oklch(100% 0 0)       ← surface/cards

Semantic Light Mode:
  bg/primary       → color-warm-50
  surface          → color-white
  brand/primary    → color-amber-400
  brand/secondary  → color-teal-500
  mood/positive    → color-sage-400
  mood/negative    → color-coral-400
  text/primary     → color-neutral-950
  text/muted       → color-neutral-500
```

## Notes
- Do NOT use Figma Styles for colors — use Variables only. Styles cannot be exported to JSON.
- The `NO_RN_EXPORT` annotation: create a component called `[NO_RN_EXPORT]` for tagging layers with blend modes / background blur that have no React Native equivalent.
- Outer screen padding = 24px. Card internal padding = 16px. These go in the Spacing collection.
