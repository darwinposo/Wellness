# Changelog — Reflect

## [Unreleased]
### In Progress
- M003: Core Wellness Features (S01: Mood Check-in → next)

---

## [M002: App Foundation] - 2026-03-15 ✓

### [S03: Authentication] - 2026-03-15
- Google OAuth + email/password login and registration — all in Bahasa Indonesia
- Password reset via secure deep link with 10-minute expiry + session revocation
- Session persistence across app kills (AsyncStorage)
- Auth-first routing: login always before onboarding on fresh install
- 7 branded Supabase email templates in Bahasa Indonesia
- 100 tests across 13 test suites

### [S02: Onboarding Flow] - 2026-03-13
- 7-screen onboarding flow in Bahasa Indonesia — Value Prop → Goal → Frequency → Time → Plan Preview → AI Taste → Paywall
- Zustand onboarding store + auth store with AsyncStorage persistence
- Root auth guard (3-way routing: onboarding / login / tabs)
- ProgressDots + PricingCard (IDR: Rp 299.000/tahun, Rp 39.000/bulan)
- 24 tests across 5 test files

### [S01: Project Scaffold] - 2026-03-12
- Expo SDK 55 initialized with full production dependency set
- All 8 critical landmines neutralized
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
