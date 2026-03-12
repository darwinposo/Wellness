# M001: Design System & Figma Prototype
Created: 2026-03-12

## Goal
Produce a complete, approved Figma design system and click-through prototype for all MVP screens.
Zero code is written in this milestone. Design is the deliverable.

## Demo
After M001, you can open Figma and click through the entire Reflect user journey — from onboarding to journaling with the AI companion — and it looks like the best wellness app in Indonesia.

## Slices
- S01: Design Foundation — After this, the user can see the full color system, typography, and base component library applied consistently across sample screens in Figma
- S02: Core Screens — After this, the user can click through the onboarding flow, today/home screen, mood check-in, and journal session in Figma
- S03: Supporting Screens & Prototype — After this, the user can navigate the complete Reflect experience end-to-end in a Figma click-through prototype, ready to hand off to code

## Must-Haves (Milestone Level)
- [ ] Figma Variables set up with Primitives + Semantic token collections, light/dark modes
- [ ] All MVP screens designed (≥16 screens) using the design system
- [ ] Click-through Figma prototype covering the primary user journey
- [ ] Token export pipeline verified: Figma Variables → JSON → tailwind.config.js + global.css
- [ ] Design review completed and signed off before M002 starts
- [ ] NO_RN_EXPORT constraints documented on all unsupported Figma effects

## Out of Scope
- Any React Native code
- Backend or API integration
- Actual AI responses (use static placeholder copy)
- Dark mode implementation (design for it, implement in code later)
- iPad / tablet layouts
