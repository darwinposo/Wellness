# Changelog — Reflect

## [Unreleased]
### In Progress
- M002: App Foundation (S01 + S02 complete, S03 planned)

---

## [M002: App Foundation] - In Progress

### [S02: Onboarding Flow] - 2026-03-13
- 7-screen onboarding flow in Bahasa Indonesia — Value Prop → Goal → Frequency → Time → Plan Preview → AI Taste → Paywall
- Zustand onboarding store + auth store with AsyncStorage persistence
- Root auth guard (3-way routing: onboarding / login / tabs) using Expo Router `<Redirect>`
- ProgressDots component + PricingCard (IDR pricing: Rp 299.000/tahun, Rp 39.000/bulan)
- 24 tests across 5 test files — all passing

### [S01: Project Scaffold] - 2026-03-12
- Expo SDK 55 app initialized with full dependency set
- All 8 critical landmines neutralized before first commit
- 4-tab navigation shell with Indonesian labels and terracotta brand (#D4724A)
- NativeWind + design tokens: Button, Card, SafeScreen components
- EAS Build profiles: development, preview, production

---

## [M001: Design System & Figma Prototype] - 2026-03-12 (partial)
### Added
- Design tokens: W3C tokens.json (16 primitives, 12 semantic, spacing, typography)
- Tailwind config mapped to NativeWind (design/tokens/tailwind.config.js)
- CSS custom properties for light/dark mode (design/tokens/global.css)
- Figma automation plugin v2 (one-click Variables + text styles setup)

### Notes
- Figma Variables setup deferred — plugin ready at design/figma-plugin/
- Design artifacts captured in code tokens; Figma UI work skipped to accelerate M002
