# ADR-003: LLM — Claude Haiku 4.5
Date: 2026-03-11
Status: Accepted

## Context
AI journaling companion requires emotionally intelligent responses in casual Bahasa Indonesia. Revenue = Rp 39.000/month per paid user (~$2.40 USD). LLM cost must preserve strong margins.

## Decision
Claude Haiku 4.5 for all tiers. Free tier: 150 token max response, no conversation memory. Paid tier: 400 token max response, last 10 sessions in context.

## Cost Analysis
- Input: $0.80/1M tokens | Output: $4/1M tokens
- 20 sessions/month per paid user ≈ $0.08/user/month
- Revenue per paid user: $2.40/month
- LLM margin: ~97% ✓

## Alternatives Considered
- **Claude Sonnet 4.6**: Rejected for MVP — 3.75x more expensive, quality improvement not necessary for this use case
- **GPT-4o mini**: Rejected — cheaper ($0.014/user/month) but noticeably more robotic in emotional contexts; Bahasa Indonesia quality lower
- **Gemini 2.0 Flash**: Rejected — cheapest option but lacks emotional nuance for mental wellness; persona instruction-following weaker
- **GPT-4o**: Rejected — similar cost to Sonnet, same emotional quality concern as OpenAI models

## Consequences
- Anthropic API key required (server-side, never exposed to client)
- System prompt (AI persona) is a core product asset — must be versioned
- Token limits enforced server-side based on subscription tier
- AI must include escalation path: knows when to suggest professional help
- Future: fine-tune Haiku on Indonesian wellness data after 1000+ paid users
