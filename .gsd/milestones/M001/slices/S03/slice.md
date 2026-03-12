# S03: Supporting Screens & Click-Through Prototype
Milestone: M001
Created: 2026-03-12
Iteration: 1

## Demo Sentence
After this slice, the user can navigate the complete Reflect experience end-to-end in a Figma click-through prototype — from onboarding to journaling to insights — and it looks like the best wellness app in Indonesia.

## Boundary Map

### Produces
- Figma screens: JOURNAL-DETAIL, INSIGHTS, PAYWALL-FULL, PROFILE, SETTINGS, LOGIN
- Figma: Click-through prototype with all primary + secondary user flows
- `design/screens/screen-inventory.md` — full list of all designed screens

### Consumes
- From S01: Full component library + token system
- From S02: All core screens (used as prototype connection source)

## Tasks
- T01: Journal detail + Insights screen (mood history graph wireframe)
- T02: Paywall full screen + Login + Profile
- T03: Settings + prototype wiring (all flows connected, click-through ready)

## Must-Haves (Slice Level)

### Truths
- [ ] Insights screen has a mood graph area (even if wireframe/placeholder in Figma — Skia will render it in code)
- [ ] Paywall full screen (reached from settings/upgrade CTA) is more detailed than onboarding OB-7
- [ ] Profile screen shows streak, total entries count, and subscription status
- [ ] Settings screen has: Notifications toggle, Subscription status, Delete account option
- [ ] Prototype covers: Onboarding → Home → Mood check-in → Journal session (primary flow)
- [ ] Prototype covers: Home → Journal list → Entry detail (secondary flow)
- [ ] Prototype covers: Settings → Upgrade → Paywall (upgrade flow)
- [ ] All 17+ screens are complete — no placeholder frames missing content

### Artifacts
- [ ] 8 screens in `📱 Screens / Supporting` section
- [ ] Figma Prototype with ≥3 connected flows (primary, secondary, upgrade)
- [ ] `design/screens/screen-inventory.md` listing all 17 screens with status

### Key Links
- [ ] Paywall screen reuses pricing copy from OB-7 (Rp 299.000/299k annual, Rp 39.000 monthly)
- [ ] Profile streak display uses Streak Badge component
