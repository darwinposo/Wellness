# Project Context — Reflect
Generated: 2026-03-11

## Project Goal
Reflect is an AI-powered journaling and mood tracking app built for Indonesian users, with ambitions to become the best wellness app in Southeast Asia. The hero feature is an AI companion that responds to journal entries in warm, casual Bahasa Indonesia — like texting a close friend who genuinely listens. Built with React Native + Expo (Android-first), powered by Claude Haiku 4.5, with a Figma-first design approach targeting a premium, culturally resonant aesthetic.

## Decisions

### D001 — Platform
**Choice:** React Native with Expo, Android-first MVP
**Reasoning:** Indonesia is ~90% Android. Push notifications are critical for daily habit formation (mood check-ins, journaling reminders). Expo dramatically reduces solo-builder complexity. One codebase for Android + iOS + optional web.
**Ruled out:** PWA (unreliable push notifications on iOS, less trusted by Indonesian users); Flutter (smaller ecosystem, less Claude API tooling)
**Downstream impact:** All UI components use React Native primitives + NativeWind. Animations via Reanimated 3 + Skia. Expo Router for navigation.

### D002 — Design Approach
**Choice:** Figma-first — all screens designed before any code is written
**Reasoning:** Beauty is the competitive advantage. Getting the aesthetic right (warm, Indonesian-soul, premium) requires visual iteration, not code iteration. Design sprint = 3–4 days producing a full design system + all MVP screens.
**Ruled out:** Code-first (produces mediocre UI); UI kit templates (too generic, can't capture cultural nuance)
**Downstream impact:** Milestone 1 is entirely Figma. No code until design is approved.

### D003 — Geographic Scope
**Choice:** Indonesia-first MVP, SEA expansion post-validation
**Reasoning:** Depth beats breadth at MVP stage. Indonesian market = 270M people, zero strong local AI wellness competitor, clear cultural gap. Nail Indonesia → expand to MY/SG/PH/TH with design/language variants.
**Ruled out:** SEA-English first (higher ARPU but smaller TAM at MVP, misses the cultural gap opportunity); Multi-market simultaneously (splits focus fatally for solo builder)
**Downstream impact:** All copy in Bahasa Indonesia. Pricing in IDR. Cultural references = Indonesian life rhythms.

### D004 — Hero Feature
**Choice:** AI Journaling as core, mood check-in as daily entry point
**Reasoning:** Highest retention mechanic, hardest to copy, strongest premium justification. Mood check-in feeds context into journal AI (AI already knows your mood before you start writing). Reference: Replika grew to 10M users on AI memory + continuity alone.
**Ruled out:** Mood tracking only (no AI = no moat); Guided sessions (Calm already owns this globally); Habit tracking (too shallow for premium positioning)
**Downstream impact:** Claude Haiku 4.5 integration is core infrastructure. Conversation memory architecture is critical. Journal entry → mood context → AI response pipeline.

### D005 — AI Companion Tone
**Choice:** Warm friend — casual Bahasa Indonesia, emotionally validates before advising, uses colloquial register (kamu, aduh, etc.)
**Reasoning:** Indonesian sungkan/malu culture means users won't open up to authority figures. A teman (friend) unlocks emotional sharing. Clinical tone = Wysa's failure mode in this market.
**Ruled out:** Clinical/therapist tone (triggers shame/sungkan); Formal Bahasa Indonesia (feels like a government app)
**Downstream impact:** System prompt engineering is a core product asset. AI persona must be documented and versioned. Knows when to refer to professional help.

### D006 — Monetization
**Choice:** Hybrid freemium — 3 sessions/week + short AI responses free forever. Rp 39.000/month for unlimited sessions + AI memory + full responses + insights + breathing tools.
**Reasoning:** Free tier is genuinely useful (not crippled-ware) → organic sharing. Paywall hits at AI memory — the emotional hook. Annual plan at Rp 299.000 for churn reduction.
**Ruled out:** Time-limited trial (creates urgency but kills organic growth); Full paywall (too high friction for Indonesian market)
**Downstream impact:** Auth must distinguish free/paid users. AI context window limited by tier. Conversion nudge copy is a product asset.

### D007 — Data Storage
**Choice:** Supabase (Postgres + Auth + Storage), Singapore region, AES-256 at rest, row-level security, no journal content used for AI training
**Reasoning:** Supabase replaces backend + database + auth for solo builder. Singapore region = low latency for Indonesia. Indonesia PDP Law 2024 compliance. Trust messaging in UI > privacy policy.
**Ruled out:** Local-first (no cross-device sync, catastrophic data loss risk); E2E encrypted at MVP (too complex for solo builder timeline — deferred to v1.5 as premium feature)
**Downstream impact:** All journal entries encrypted at rest. Delete account = delete all data instantly. E2E encryption deferred to v1.5 premium tier.

### D008 — LLM
**Choice:** Claude Haiku 4.5 for all tiers, with tiered response depth (150 token max for free, 400 token max for paid, conversation memory only for paid)
**Reasoning:** Best emotional intelligence per dollar in the market. $0.08/user/month at paid tier against $2.40 revenue = 97% LLM margin. Superior Bahasa Indonesia output and empathetic response quality vs GPT-4o mini.
**Ruled out:** Claude Sonnet 4.6 (too expensive at scale, not necessary for this use case); GPT-4o mini (cheaper but noticeably more robotic in emotional contexts); Gemini Flash (decent but lacks emotional nuance for mental wellness)
**Downstream impact:** Anthropic API key required. Prompt engineering for persona is critical. Token limits enforced server-side by tier.

### D009 — App Name
**Choice:** Reflect
**Reasoning:** The name is the product — journaling IS reflection. Universally understood across SEA without translation. Premium, minimal brand identity. Low trademark risk. Domain-friendly.
**Ruled out:** Teman Jiwa (too Indonesia-specific for SEA expansion, religious connotation risk); Rasa (beautiful but less product-descriptive); Lega (too Indonesia-specific); Bloom (trademark risk)
**Downstream impact:** App store listings as "Reflect". Bundle ID: com.reflect.app. All brand assets use Reflect wordmark.

## Constraints
- Solo builder — scope must fit 2–3 month MVP timeline
- Budget-conscious — infrastructure choices must be free/cheap until revenue validated
- Android-first — iOS deferred until monetization proven
- No religious framing — universal wellness positioning
- Indonesia PDP Law 2024 compliance required

## Out of Scope (MVP)
- iOS app (post-Android validation)
- Multiple languages (English/Malay/Thai — post-Indonesia success)
- Community/social features
- Wearable integrations
- Therapist marketplace
- B2B/enterprise wellness
- E2E encryption (v1.5)
- Habit tracking module
- Sleep tracking

## Deferred
- Islamic mindfulness features: noted during Discuss, explicitly removed from scope
- SEA expansion: MY, SG, PH, TH — after Indonesia MVP validated
- E2E encryption: premium feature for v1.5
- Fine-tuned Haiku: after 1000+ paid users
- Web companion app: v2.0
- See also: .gsd/deferred.md for the 6 other app ideas from research
