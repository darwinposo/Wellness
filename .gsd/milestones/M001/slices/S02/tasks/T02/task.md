# T02: Today/Home Screen + Mood Check-in
Slice: M001/S02
Created: 2026-03-12

## Goal
Design the Today/Home screen (the first thing users see after onboarding) and the mood check-in flow that serves as the daily entry point into journaling.

## Steps
1. Design HOME screen: greeting, streak badge, daily mood CTA, recent journal preview
2. Design MOOD-1: mood scale selector (5-level, visual, not text-only)
3. Design MOOD-2: mood context (optional label tags + short note field)
4. Design the transition state: mood saved → prompt to journal
5. Add empty state variant for HOME (first-time user, no history yet)
6. Review: can a user understand what to do on HOME in 3 seconds?

## Must-Haves

### Truths
- [ ] HOME screen greeting is time-aware: "Selamat pagi, [Name]" / "Selamat malam"
- [ ] Streak badge is visible on HOME (prominently, not buried)
- [ ] Mood check-in CTA is the most visually prominent element on HOME
- [ ] Mood selector uses visual scale (emojis or color spectrum), not text buttons
- [ ] After mood is selected, user sees a smooth transition to journal prompt (not a dead end)
- [ ] HOME empty state (first use) shows encouraging message, not empty space

### Artifacts
- [ ] HOME frame (390×844) in `📱 Screens / Main App` section
- [ ] HOME-empty frame (first-time user variant)
- [ ] MOOD-1 frame (mood scale screen)
- [ ] MOOD-2 frame (context/tags/note screen)
- [ ] MOOD-saved frame (confirmation + journal CTA)

### Key Links
- [ ] HOME mood CTA uses Button Primary component
- [ ] Streak badge uses Streak Badge component from `🧩 Components`
- [ ] Mood selector on MOOD-1 uses Mood Selector component

## Screen Copy

### HOME Screen
```
Greeting: "Selamat pagi, [Name] 👋"
Streak: "🔥 [N] hari berturut-turut"
Mood CTA section:
  Label: "Bagaimana perasaanmu hari ini?"
  CTA Button: "Cek Mood Sekarang"
Recent section: "Refleksi Terakhir" → shows 1-2 recent journal cards
```

### MOOD-1 Scale
```
Header: "Bagaimana perasaanmu?"
Subtext: "Jujur aja, ini hanya untukmu"
Scale: 😢 → 😟 → 😐 → 🙂 → 😄
Labels: Sangat sedih / Sedih / Biasa / Senang / Sangat senang
```

### MOOD-2 Context
```
Header: "Ada yang ingin ditambahkan?"
Tag chips (multi-select): Capek kerja, Keluarga, Hubungan, Kesehatan, Keuangan, Prestasi, Lainnya
Optional note: text input "Ceritakan sedikit... (opsional)"
CTA: "Simpan Mood"
Skip: "Lewati"
```

### MOOD-saved
```
Animation area: Lottie checkmark (120×120)
Text: "Mood tersimpan 🎉"
Subtext: "Mau cerita lebih? AI temanmu sudah siap mendengarkan."
CTA Primary: "Mulai Jurnal"
CTA Ghost: "Nanti aja"
```

## Notes
- Research: Highest conversion from mood check-in to journal happens when the AI's response preview is shown immediately after mood save. The MOOD-saved screen should show a teaser AI message.
- The 5-emoji scale is the lowest-friction mood input pattern (Daylio proof: millions of daily users). Don't replace with sliders or number ratings.
