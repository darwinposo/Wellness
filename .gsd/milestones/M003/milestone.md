# M003: Core Wellness Features
Created: 2026-03-12

## Goal
The app's hero features are fully working: mood check-in feeds context to the AI journal companion (Claude Haiku 4.5), with session memory for paid users.

## Demo
After M003, a user can complete a mood check-in, start a journal session where the AI references their mood, have a 5-turn conversation, see their journal history, and — if paid — have the AI reference past sessions.

## Slices
- S01: Mood Check-in — After this, the user can tap the mood CTA on Home, select their mood + tags + optional note, and see the saved mood reflected in their history
- S02: AI Journal Session — After this, the user can start a journal session where Claude Haiku 4.5 responds in warm Bahasa Indonesia, with mood context in the opening message, for up to 5 turns (free tier)
- S03: Journal History + Memory — After this, the user can view their journal entry list and detail, and paid users see the AI reference their past 10 sessions in new conversations

## Must-Haves (Milestone Level)
- [ ] Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) integrated with prompt caching on system prompt
- [ ] Free tier hard limit: 3 sessions/week, 150 token max response
- [ ] Paid tier: unlimited sessions, 400 token max, last 10 sessions in context
- [ ] AI system prompt includes crisis response escalation language
- [ ] Journal entries saved to Supabase with RLS (user can only see their own)
- [ ] Streaming responses (SSE) working for chat-feel UX

## Out of Scope
- RevenueCat (paywall is a non-functional screen — M004)
- Push notifications (M004)
- Skia mood graph (M004)
- Breathing exercises (M004)
