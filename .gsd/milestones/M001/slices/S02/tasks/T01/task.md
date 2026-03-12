# T01: Onboarding Flow (7 Screens)
Slice: M001/S02
Created: 2026-03-12

## Goal
Design all 7 onboarding screens in Figma — from value prop splash through to the paywall — that convert an Indonesian user into a registered trial subscriber.

## Steps
1. Add `📱 Screens` page to Figma file, create `Onboarding` section
2. Design OB-1: Value prop splash (headline + illustration + CTA)
3. Design OB-2: Goal selection (3 tappable cards with icons)
4. Design OB-3: Frequency check (3 options, simple selection)
5. Design OB-4: Time preference (morning/evening/both + time picker visual)
6. Design OB-5: Personalized plan preview (generated program feel)
7. Design OB-6: First value taste (one interactive journal prompt)
8. Design OB-7: Paywall (annual default, monthly secondary, trial framing)
9. Add progress indicator to OB-1 through OB-6 (dots or step counter)
10. Review flow: does each screen earn the right to the next?

## Must-Haves

### Truths
- [ ] OB-1 headline is outcome-first in Bahasa Indonesia (not "Welcome to Reflect")
- [ ] OB-2 has exactly 3 goal options (not more) with illustrations — not text-only
- [ ] OB-3 and OB-4 can be completed in under 5 seconds by tapping
- [ ] OB-5 "plan preview" feels personalized, not generic — references user's goal selection
- [ ] OB-6 shows actual journal prompt text the user can read (not placeholder lorem ipsum)
- [ ] OB-7 annual plan is visually dominant, monthly is secondary/smaller
- [ ] OB-7 has "Nanti saja" dismiss text (not "Tidak, terima kasih")
- [ ] OB-7 trial framing: "Coba gratis 7 hari" (not "Subscribe now")

### Artifacts
- [ ] Figma: 7 frames named OB-1 through OB-7 in the Onboarding section
- [ ] Each frame is 390×844 (iPhone 14 base size — standard for mobile mockups)
- [ ] OB-7 shows annual price (Rp 299.000/tahun) and monthly (Rp 39.000/bulan)

### Key Links
- [ ] All 7 screens use Onboarding Option Card component from `🧩 Components`
- [ ] Progress indicator shows 6 steps (OB-1 through OB-6, paywall is step 7)
- [ ] All CTAs use Button Primary component

## Screen Copy (use this exact copy)

### OB-1 Value Prop
```
Headline: "Mulai refleksi harianmu, rasakan bedanya dalam 7 hari"
Subtext: "Teman AI yang selalu siap mendengarkan, setiap hari"
CTA: "Mulai Sekarang"
```

### OB-2 Goal Selection
```
Headline: "Apa yang ingin kamu capai?"
Option A: 🧘 Ketenangan mental
Option B: 💪 Lebih produktif
Option C: 😴 Tidur lebih baik
```

### OB-3 Frequency
```
Headline: "Seberapa sering kamu journaling?"
Option A: Belum pernah
Option B: Sesekali
Option C: Rutin setiap hari
```

### OB-4 Time
```
Headline: "Kapan waktu terbaikmu untuk refleksi?"
Option A: 🌅 Pagi
Option B: 🌙 Malam
Option C: ☀️ Kapan saja
```

### OB-5 Plan Preview
```
Headline: "Program Refleksimu Sudah Siap"
Subtext: "Berdasarkan tujuanmu, kami menyiapkan program [GOAL] selama 7 hari pertama"
Body: [Personalized plan bullets — 3 items]
CTA: "Lihat Program Saya"
```

### OB-6 Value Taste
```
Headline: "Coba satu sesi gratis sekarang"
Prompt shown: "Hari ini, apa satu hal yang membuatmu bersyukur?"
AI preview: "Senang kamu mau berbagi 😊 Ceritakan lebih lanjut..."
CTA: "Mulai Jurnal Gratis"
```

### OB-7 Paywall
```
Headline: "Lanjutkan perjalananmu"
Annual card (dominant): "Tahunan — Rp 299.000 / tahun" + "Hemat 36%"
Monthly card: "Bulanan — Rp 39.000 / bulan"
CTA: "Coba Gratis 7 Hari"
Dismiss: "Nanti saja"
Fine print: "Bisa dibatalkan kapan saja"
```

## Notes
- Research: Adding first name to paywall copy yields ~17% conversion lift. But we don't have name yet — defer name collection to post-signup.
- Research: Annual as default plan increases LTV 3-4x vs monthly default.
- Illustration style: warm, soft, character-free illustrations (geometric or nature-based) — avoid human character illustrations which are harder to make culturally neutral.
