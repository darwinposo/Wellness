# T02: Base Component Library
Slice: M001/S01
Created: 2026-03-12

## Goal
Build all reusable UI components in Figma that will be used across every screen — all using the Variables from T01, all with complete interactive states.

## Steps
1. Create `🧩 Components` page in the Figma file
2. Build Button components: Primary, Secondary, Ghost — all 3 sizes (SM/MD/LG), all states
3. Build Input components: Text input, Multi-line textarea (journal), with states
4. Build Card components: Journal card (list), Mood card, Onboarding option card
5. Build Navigation: Tab bar (4 tabs), Back header, Modal drag handle
6. Build Mood selector: 5-level emoji/icon scale with label
7. Build Streak badge + progress indicator
8. Build Tag/Chip component (mood labels)
9. Build Lottie placeholder frames (200x200, 120x120, full-screen overlay)
10. Apply Auto Layout to ALL components (no manual constraints)
11. Verify every component uses Variables (zero hardcoded hex values)

## Must-Haves

### Truths
- [ ] Button component has 3 variants × 3 sizes × 4 states = 36 frames
- [ ] All cards use Auto Layout with Fill width, Hug height
- [ ] Zero hardcoded hex values in any component — everything references Variables
- [ ] Mood selector shows all 5 states clearly (1=sangat sedih → 5=sangat bahagia)
- [ ] Tab bar shows all 4 tabs: Today, Journal, Insights, Profile — active + inactive states
- [ ] Card corner radius = 16px (rounded-2xl), internal padding = 16px uniform

### Artifacts
- [ ] `🧩 Components` page with ≥8 component sections
- [ ] Button section: ≥12 frames (3 variants × 4 states minimum)
- [ ] Card section: Journal card, Mood card, Onboarding option card all present
- [ ] Navigation section: Tab bar (active/inactive), Header variants
- [ ] Lottie placeholder frames: 3 frames sized 200x200, 120x120, 375x812

### Key Links
- [ ] Every component fill color references a Semantic Variable
- [ ] Journal card body text uses `Journal Body` text style (Lora)
- [ ] All other text uses Plus Jakarta Sans text styles

## Context Needed
- Research: Card shadow = `0 4px 16px rgba(0,0,0,0.10)`, outer padding 24px, card padding 16px
- Research: Indonesian UX — visual-first hierarchy, image-rich cards outperform text lists

## Component Spec

### Journal Card
```
Width: Fill (minus 48px outer padding)
Height: Hug
Padding: 16px uniform
Corner radius: 16px
Shadow: 0 4px 16px rgba(0,0,0,0.10)
Structure (top to bottom, Auto Layout vertical, gap 8px):
  - Mood color accent bar (4px height, full width, color = mood variable)
  - Date + time (Caption style, text/muted color)
  - Preview text (Body style, 2 lines max, text/primary)
  - AI response preview (Caption style, brand/secondary color, italic)
```

### Primary Button
```
Width: Fill or Fixed
Height: 52px (LG), 44px (MD), 36px (SM)
Corner radius: 12px
Background: brand/primary Variable
Text: white, Body style, SemiBold
States: Default, Pressed (90% opacity), Disabled (40% opacity)
```

## Notes
- Purrweb research: premium apps use 2x the padding designers think they need. When in doubt, add more air.
- Big Human research: ONE bold accent color (brand/primary) against muted backgrounds. Don't overuse the terracotta.
