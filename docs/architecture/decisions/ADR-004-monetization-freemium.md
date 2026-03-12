# ADR-004: Monetization — Hybrid Freemium
Date: 2026-03-11
Status: Accepted

## Context
Indonesian market is price-sensitive but increasingly willing to pay for premium digital experiences. Need to drive organic growth (free tier) while converting on emotional hook.

## Decision
Hybrid freemium model:
- Free forever: 3 AI journal sessions/week, short responses (150 tokens), 7-day mood history
- Premium (Rp 39.000/month): unlimited sessions, full responses (400 tokens), AI memory, weekly insights, breathing tools, full history + export
- Annual plan: Rp 299.000/year (~Rp 24.900/month equivalent, 36% saving)

## Paywall Logic
- Sessions 1–3: Full free experience, build habit
- Session 4: First soft nudge ("Upgrade to let me remember you")
- Session 7: AI surfaces memory limitation naturally
- Session 14: Hard paywall on AI memory feature
- The AI itself is the conversion mechanic — not popups

## Alternatives Considered
- **Time-limited trial (7/14 days)**: Rejected — creates urgency but kills organic growth; Indonesian users share apps with friends
- **Full paywall**: Rejected — too high friction, no trial = no trust
- **Usage-limited (3 entries/month free)**: Rejected — too stingy, users churn before experiencing value
- **Ads-supported free tier**: Rejected — ads in a mental wellness app breaks trust and premium positioning

## Consequences
- Auth system must track session count + subscription status
- AI response token limits enforced server-side by tier
- Conversion nudge copy is a product asset (must feel natural, not manipulative)
- Rp 299.000 annual plan = primary LTV driver, reduces churn significantly
