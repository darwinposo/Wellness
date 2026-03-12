# S02: Core Screen Designs
Milestone: M001
Created: 2026-03-12
Iteration: 1

## Demo Sentence
After this slice, the user can click through the 7-screen Reflect onboarding flow, see the Today/Home screen, complete a mood check-in, and view the AI journal session screen — all in Figma with the design system applied.

## Boundary Map

### Produces
- Figma screens: OB-1 through OB-7 (onboarding, 7 screens)
- Figma screens: HOME (Today screen with mood CTA)
- Figma screens: MOOD (mood check-in flow, 2 states)

### Consumes
- From S01: All Figma Variables (colors, spacing, typography)
- From S01: All component library elements (buttons, cards, inputs, mood selector)

## Tasks
- T01: Onboarding flow (7 screens, OB-1 through OB-7)
- T02: Today/Home screen + Mood check-in
- T03: AI Journal session screen + Journal list

## Must-Haves (Slice Level)

### Truths
- [ ] Onboarding screens tell a coherent story: value → personalization → plan preview → taste → paywall
- [ ] OB-7 paywall shows annual plan as default option with savings callout
- [ ] "Nanti saja" (Maybe later) dismiss option visible on paywall screen
- [ ] HOME screen has a clear, prominent daily mood check-in CTA
- [ ] Journal session screen feels like a messaging interface, not a form
- [ ] All 9 screens use 24px outer padding (screen edge to content)

### Artifacts
- [ ] Figma `📱 Screens` page with sections: Onboarding (7 screens), Main (2+ screens)
- [ ] All 9 screens built with Auto Layout (no absolute positioning except for decorative elements)
- [ ] Mood selector component appears on mood check-in screen with all 5 states visible
- [ ] AI chat bubble design defined (user bubble + AI companion bubble, distinct styles)

### Key Links
- [ ] All screens use components from `🧩 Components` page (no one-off designs)
- [ ] All text uses text styles from `🎨 Foundations` (no local font overrides)
- [ ] OB-7 paywall reuses the Button Primary component
