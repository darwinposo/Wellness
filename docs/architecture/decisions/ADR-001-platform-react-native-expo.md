# ADR-001: Platform — React Native with Expo, Android-first
Date: 2026-03-11
Status: Accepted

## Context
Reflect requires daily push notifications (mood check-ins, journaling reminders) — essential for habit-forming wellness apps. Indonesia is ~90% Android. Solo builder with 2–3 month MVP target.

## Decision
React Native with Expo, targeting Android for MVP. iOS deferred until monetization validated.

## Alternatives Considered
- **PWA**: Rejected — unreliable push notifications on iOS, less trusted by Indonesian users, no app store discovery
- **Flutter**: Rejected — smaller ecosystem, less mature Claude API tooling, harder for solo builder
- **Native Android (Kotlin)**: Rejected — no iOS path, more complex for solo builder
- **React Native without Expo**: Rejected — unnecessary complexity, Expo handles build/notifications/OTA updates

## Consequences
- All UI in React Native primitives + NativeWind
- Reanimated 3 + Skia for animations
- Expo Notifications + FCM for push
- EAS Build for cloud compilation (no Mac needed for MVP)
- iOS expansion requires Apple Developer account ($99/year) — deferred
