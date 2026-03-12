# M004: Monetization & Launch
Created: 2026-03-12

## Goal
The app is monetized, polished, and submitted to Google Play Indonesia.

## Demo
After M004, Reflect is live on Google Play Indonesia with working subscriptions (Rp 39.000/month, Rp 299.000/year via RevenueCat), daily push notification reminders, a Skia mood graph on the Insights screen, and all Google Play compliance requirements met.

## Slices
- S01: RevenueCat + Paywall — After this, a user can tap "Upgrade", see the paywall, subscribe via Google Play (IDR pricing), and immediately unlock premium features
- S02: Push Notifications — After this, the user receives a daily mood check-in reminder at their preferred time, and a gentle journaling nudge if they haven't journaled in 3 days
- S03: Insights Screen (Skia) — After this, the user can view their mood history calendar heatmap and trend line graph powered by React Native Skia
- S04: Google Play Submission — After this, the app is submitted to Google Play Indonesia, health declaration form completed, data safety section filled, and awaiting review

## Must-Haves (Milestone Level)
- [ ] RevenueCat free tier (under $2,500 MTR) — $0 cost at launch
- [ ] IDR pricing configured in Google Play Console: Rp 39.000/month, Rp 299.000/year
- [ ] Google Play health declaration form submitted (mandatory for wellness apps Aug 2025+)
- [ ] Data safety section declares: mood data, journal text, Anthropic API data sharing
- [ ] Privacy policy live at a public URL (required for Play Store listing)
- [ ] Push notification permission requested AFTER first journal entry saved (not during onboarding)
- [ ] App store listing in Bahasa Indonesia

## Out of Scope
- iOS App Store submission (post-Android validation)
- Breathing exercises (deferred to v1.1)
- SEA language expansion (deferred to v2.0)
