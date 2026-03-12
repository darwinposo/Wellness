# ADR-002: Backend — Supabase (Singapore Region)
Date: 2026-03-11
Status: Accepted

## Context
Solo builder needs backend + database + auth without managing infrastructure. Mental health data requires strong privacy guarantees. Indonesia PDP Law 2024 compliance required.

## Decision
Supabase (Postgres + Auth + Storage) hosted in Singapore region. AES-256 at rest. Row-level security enforcing user data isolation. No journal content used for AI training.

## Alternatives Considered
- **Firebase**: Rejected — no row-level security, harder to query relational data, Google data residency concerns
- **Custom Node.js + Postgres**: Rejected — too much infrastructure overhead for solo builder MVP
- **PlanetScale + custom auth**: Rejected — more services to manage, no built-in storage
- **Local-first (SQLite)**: Rejected — no cross-device sync, catastrophic data loss risk on phone loss

## Consequences
- Delete account = delete all data instantly (legal + trust requirement)
- E2E encryption deferred to v1.5 as premium feature
- Singapore region = ~20–40ms latency from Indonesia (acceptable)
- Free tier handles thousands of users before paid plan needed
- Trust messaging in UI: "Data kamu tersimpan aman dan terenkripsi"
