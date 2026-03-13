# T02: Onboarding Screens 5–7 (Plan Preview, Value Taste, Paywall)
Slice: M002/S02
Created: 2026-03-12

## Goal
Build the final 3 onboarding screens — the personalized plan preview (shows user's choices), a mock AI journal taste (hardcoded, no real API), and the paywall with pricing in IDR.

## Steps
1. Create Screen 5: `src/app/onboarding/preview.tsx` — personalized plan
2. Create Screen 6: `src/app/onboarding/taste.tsx` — mock AI response demo
3. Create Screen 7: `src/app/onboarding/paywall.tsx` — pricing + login trigger
4. Create `src/components/ui/PricingCard.tsx` — annual vs monthly plan card
5. Wire paywall CTA to `/auth/login`

## Must-Haves

### Truths
- [ ] Screen 5 shows user's selected goal + frequency (from Zustand store)
- [ ] Screen 6 shows a hardcoded journal prompt + AI response (simulates the product)
- [ ] Screen 7 shows both plans: Rp 299.000/tahun AND Rp 39.000/bulan
- [ ] Annual plan is pre-selected / highlighted as recommended
- [ ] "Mulai Gratis" CTA exists (skips paywall, goes to login)
- [ ] Paywall CTA "Coba Premium Gratis 7 Hari" → navigates to `/auth/login`

### Artifacts
- [ ] `src/app/onboarding/preview.tsx` — exists, reads from onboardingStore
- [ ] `src/app/onboarding/taste.tsx` — exists, mock AI conversation
- [ ] `src/app/onboarding/paywall.tsx` — exists, both pricing tiers shown
- [ ] `src/components/ui/PricingCard.tsx` — exists, annual + monthly variants

### Key Links
- [ ] `preview.tsx` reads `goal` + `frequency` from `useOnboardingStore`
- [ ] Paywall CTAs both navigate to `/auth/login`
- [ ] Screen 5, 6, 7 progress dots show 5/7, 6/7, 7/7

## Copy (Bahasa Indonesia)

### Screen 5 — Plan Preview
```
Title:    "Rencanamu sudah siap! 🎉"
Subtext:  "Berdasarkan pilihanmu:"
Card:     "Tujuan: [user goal]"
          "Frekuensi: [user frequency]"
          "Waktu terbaik: [user time]"
          "→ AI akan mengingatkanmu [time] dengan sesi personal"
CTA:      "Lihat Contoh Sesinya"
```

### Screen 6 — Value Taste
```
Title:    "Begini rasanya sesi denganku"
Prompt:   "Bagaimana perasaanmu hari ini?" [shown as AI message bubble]
Response: [user taps mood, hardcoded reply appears]:
          "Aduh, hari yang berat ya? Cerita lebih dong — apa yang paling bikin kamu capek hari ini?"
CTA:      "Aku mau ini setiap hari →"
```

### Screen 7 — Paywall
```
Title:    "Mulai perjalananmu"
Subtext:  "Coba gratis 7 hari, batalkan kapan saja."
Plan 1 (recommended):
  Badge:  "PALING HEMAT"
  Price:  "Rp 299.000/tahun"
  Note:   "~Rp 24.900/bulan"
Plan 2:
  Price:  "Rp 39.000/bulan"
CTA 1:   "Coba Premium Gratis 7 Hari"
CTA 2:   "Mulai Gratis (3 sesi/minggu)"
Fine print: "Tidak perlu kartu kredit untuk mencoba."
```

## Notes
- Screen 6: hardcode the AI interaction — do NOT call Claude API here. Real API is M003.
- Paywall does NOT process payment — that's RevenueCat in M004. Just UI + navigation.
- PricingCard: annual card has brand/primary border + "PALING HEMAT" badge, monthly is plain
- The "Mulai Gratis" path: navigate to login, set a flag `isPremium: false` in auth store
