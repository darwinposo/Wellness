# T03: AI Journal Session Screen + Journal List
Slice: M001/S02
Created: 2026-03-12

## Goal
Design the AI journal session screen (the hero feature — where users journal with the AI companion) and the journal entry list screen.

## Steps
1. Design JOURNAL-SESSION: full-screen writing interface with AI response area
2. Design JOURNAL-SESSION states: empty (AI greeting), user typed, AI responded, continued conversation
3. Design JOURNAL-LIST: card list of past journal entries
4. Design the AI companion "typing" indicator
5. Review: does the journal screen feel like a conversation, not a form?

## Must-Haves

### Truths
- [ ] Journal session screen feels like iMessage/WhatsApp — conversation UI, not a text editor
- [ ] AI messages have distinct visual treatment from user messages (different bubble colors, alignment)
- [ ] AI opening message references the user's mood from check-in (contextual, not generic)
- [ ] Text input area is at the bottom, keyboard-aware design
- [ ] Journal list shows mood color accent on each card (left border or background tint)
- [ ] Free tier indicator visible but non-intrusive (e.g., "2 dari 3 sesi minggu ini")

### Artifacts
- [ ] JOURNAL-SESSION frame with 3 conversation states (greeting, mid-convo, multi-turn)
- [ ] JOURNAL-LIST frame with ≥3 journal cards showing varied content
- [ ] AI typing indicator frame (animated dots placeholder)
- [ ] Free tier usage indicator on JOURNAL-SESSION or JOURNAL-LIST

### Key Links
- [ ] Journal cards on JOURNAL-LIST use Journal Card component from `🧩 Components`
- [ ] AI message bubbles use brand-calm color, user bubbles use surface color

## Screen Copy

### JOURNAL-SESSION (AI Opening based on Mood = 😐 Biasa)
```
AI bubble (top):
"Hai! Aku lihat hari ini kamu merasa biasa aja 😊
Terkadang hari yang 'biasa' justru punya banyak hal menarik kalau kita perhatiin.
Ada yang pengen kamu ceritain hari ini?"

[Input area at bottom]
Placeholder: "Cerita apa aja, aku dengerin..."
Send button: arrow icon, brand-warm color

[Keyboard area below]
```

### JOURNAL-SESSION (Mid-conversation state)
```
User bubble: "Hari ini kerja banyak, tapi ngerasa gak produktif"
AI bubble: "Hmm, perasaan 'sibuk tapi gak produktif' itu berat banget ya...
Kira-kira ada gak satu hal yang bikin kamu ngerasa paling terganggu hari ini?"
```

### JOURNAL-LIST
```
Header: "Jurnal Kamu"
Subheader: "April 2026"
Cards:
  - [Coral accent] "Capek kerja" — "Hari ini kerja banyak, tapi ngerasa..." — 2 hari lalu
  - [Sage accent] "Prestasi" — "Akhirnya selesai juga project yang..." — 5 hari lalu
  - [Neutral] "—" — "Hari yang biasa, tapi..." — 1 minggu lalu
```

## Notes
- The journal session is the #1 retention driver. Every design decision here should optimize for the user feeling HEARD, not diagnosed.
- Research: Warm friend tone means AI message bubbles should feel casual — rounded corners (20px), soft background color, no clinical iconography.
- Journal text input should use Lora font (the journal content typeface) — signals "this is writing space" not "this is UI".
- Free tier usage indicator: non-intrusive. Small text + progress bar at top of screen. Never a popup mid-conversation.
