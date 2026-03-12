# T03: Settings + Prototype Wiring
Slice: M001/S03
Created: 2026-03-12

## Goal
Design the Settings screen, then wire all 17+ screens into a complete click-through Figma prototype covering all primary user flows.

## Steps
1. Design SETTINGS: notifications, account, subscription, privacy, delete account
2. Create `design/screens/screen-inventory.md` documenting all screens
3. Wire Prototype Flow 1 (Primary): OB-1→OB-2→OB-3→OB-4→OB-5→OB-6→OB-7→HOME→MOOD-1→MOOD-2→MOOD-saved→JOURNAL-SESSION
4. Wire Prototype Flow 2 (Journal History): HOME→JOURNAL-LIST→JOURNAL-DETAIL
5. Wire Prototype Flow 3 (Upgrade): PROFILE→SETTINGS→PAYWALL-FULL
6. Wire tab bar navigation on HOME, JOURNAL-LIST, INSIGHTS, PROFILE
7. Final design review: check all screens at 100% zoom on mobile preview
8. Share prototype link for review

## Must-Haves

### Truths
- [ ] Settings has Delete Account option (legally required per PDP Law + trust signal)
- [ ] All 3 prototype flows are clickable end-to-end without dead ends
- [ ] Tab bar navigation works on all main app screens
- [ ] Back navigation works on all detail screens
- [ ] Prototype can be viewed on iPhone frame in Figma preview

### Artifacts
- [ ] SETTINGS frame
- [ ] Figma prototype with ≥3 connected flows
- [ ] `design/screens/screen-inventory.md` — all 17+ screens listed with Figma frame names
- [ ] Shareable Figma prototype link documented in `design/screens/screen-inventory.md`

## Screen Inventory Target
```
Onboarding (7): OB-1, OB-2, OB-3, OB-4, OB-5, OB-6, OB-7
Auth (1): LOGIN
Main App (5): HOME, HOME-empty, MOOD-1, MOOD-2, MOOD-saved
Journal (4): JOURNAL-LIST, JOURNAL-SESSION, JOURNAL-DETAIL, JOURNAL-SESSION-multiconvo
Insights (2): INSIGHTS, INSIGHTS-empty
Account (3): PAYWALL-FULL, PROFILE, SETTINGS
Total: 22 screens
```

## Notes
- Prototype interaction type: "On tap" → "Navigate to" for all connections
- Use Smart Animate for OB-1→OB-2 etc (slide left) and MOOD-1→MOOD-2 (slide up)
- The prototype is the M001 deliverable. It should be shareable with potential early users for feedback before M002 coding starts.
