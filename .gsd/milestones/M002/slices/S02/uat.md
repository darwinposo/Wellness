# UAT: S02 — Onboarding Flow
Generated: 2026-03-13
Slice Demo: "After this slice, the user can tap through all 7 onboarding screens, select their goal/frequency/time preferences, see the personalized plan preview, get a taste of the AI journal feature, and reach the paywall screen."

## Pre-conditions
- App built and installed on Android device or emulator
- Build command: `npx expo run:android` (dev) or install the debug APK
- App data cleared (fresh install OR: Android Settings → Apps → Reflect → Clear Storage)
- No existing user session

---

## Test 1: Fresh Launch → Onboarding Screen 1 (Value Prop)

**Verifies:** First launch routes to onboarding; Screen 1 renders correctly

### Steps
1. Clear app data (Settings → Apps → Reflect → Clear Storage)
2. Open the app

### Expected Results
- Splash screen shows briefly, then Screen 1 appears
- Screen 1 headline reads (in Bahasa Indonesia): value proposition text visible
- Button at the bottom reads **"Mulai Perjalananmu"**
- No tabs visible — user is in full-screen onboarding mode
- Hardware back button does NOT exit the screen (nothing happens or a soft block)

### If This Fails
- Check: root `_layout.tsx` — `isComplete` flag from AsyncStorage should be `false` on fresh install
- Report: "UAT Test 1 failed: [what you saw]"

---

## Test 2: Screen 1 → Screen 2 (Goal Selection)

**Verifies:** Forward navigation works; Screen 2 renders 3 goal options

### Steps
1. On Screen 1, tap **"Mulai Perjalananmu"**

### Expected Results
- App navigates to Screen 2 (goal selection)
- Progress dots appear — **1 out of 7** dots filled/active
- Screen shows 3 goal options (cards) in Bahasa Indonesia
- **"Lanjut"** / next button is **disabled** (greyed out) until a goal is selected
- All copy is in Bahasa Indonesia

### If This Fails
- Check: `src/app/onboarding/index.tsx` → router.push target
- Report: "UAT Test 2 failed: [what happened]"

---

## Test 3: Goal Selection State

**Verifies:** Selecting a goal highlights it and enables the CTA

### Steps
1. On Screen 2, tap one of the 3 goal cards (e.g. the first option)
2. Observe the card appearance
3. Observe the button state

### Expected Results
- Tapped card shows a **terracotta (#D4724A) border** (selected state)
- Other cards return to unselected state (shadow, no colored border)
- **"Lanjut"** button becomes **enabled** (not greyed out)
- Only one card can be selected at a time

### If This Fails
- Check: `src/app/onboarding/goal.tsx` → selection state logic
- Report: "UAT Test 3 failed: [what you saw]"

---

## Test 4: Screens 3 and 4 (Frequency + Time Preference)

**Verifies:** Selection cards work on Frequency and Time screens; progress dots advance

### Steps
1. From Screen 2 (goal selected), tap **"Lanjut"**
2. On Screen 3 (Frequency): tap one of the 4 frequency options
3. Confirm button is now enabled, then tap **"Lanjut"**
4. On Screen 4 (Time Preference): verify 4 time options with emoji appear
5. Tap one option (e.g. Pagi, Siang, Sore, or Malam)
6. Tap **"Lanjut"**

### Expected Results
- Screen 3: 4 frequency options selectable; progress dots show **2/7**
- Screen 4: 4 time options with emoji (🌅 Pagi, ☀️ Siang, 🌇 Sore, 🌙 Malam or similar); progress dots show **3/7**
- Selection card highlight behavior consistent with Test 3
- All copy in Bahasa Indonesia
- **"Lanjut"** disabled until selection made on each screen

### If This Fails
- Check: `src/app/onboarding/frequency.tsx`, `src/app/onboarding/time.tsx`
- Report: "UAT Test 4 failed: [screen number + what you saw]"

---

## Test 5: Screen 5 — Personalized Plan Preview

**Verifies:** Plan preview reads from Zustand store and shows user's actual selections

### Steps
1. After completing Screens 2–4 (goal + frequency + time selected), arrive at Screen 5
2. Read the plan preview content

### Expected Results
- Screen 5 shows the user's **actual goal selection** (not a generic placeholder)
- Screen 5 shows the user's **actual frequency selection**
- Progress dots show **4/7** (or 5/7 depending on counting)
- Content is in Bahasa Indonesia

### If This Fails
- Check: `src/app/onboarding/preview.tsx` — `useOnboardingStore()` reading `.goal` and `.frequency`
- Report: "UAT Test 5 failed: saw generic text / wrong values / empty"

---

## Test 6: Screen 6 — AI Journal Taste

**Verifies:** Mock AI chat screen renders with mood picker and hardcoded response

### Steps
1. Tap **"Lanjut"** from Screen 5 to reach Screen 6
2. Observe the mood picker options
3. Tap one of the mood options
4. Observe the AI response area

### Expected Results
- Screen 6 shows a hardcoded AI prompt/question in Bahasa Indonesia
- Mood options are tappable (emoji or text)
- After tapping a mood, a warm hardcoded AI response appears
- Progress dots show **5/7** (or 6/7)
- Response tone is warm/casual (not clinical)

### If This Fails
- Check: `src/app/onboarding/taste.tsx` — local `useState` for mood
- Report: "UAT Test 6 failed: [what you saw]"

---

## Test 7: Screen 7 — Paywall

**Verifies:** Paywall shows correct IDR pricing; annual plan pre-selected

### Steps
1. Tap **"Lanjut"** from Screen 6 to reach Screen 7 (Paywall)

### Expected Results
- Screen 7 shows **Rp 299.000/tahun** (annual plan)
- Screen 7 shows **Rp 39.000/bulan** (monthly plan)
- **Annual plan is pre-selected** / highlighted by default
- Two CTAs visible:
  - **"Mulai Gratis"** (start free)
  - **"Coba Premium Gratis 7 Hari"** (7-day premium trial)
- Progress dots show **6/7** or **7/7**
- All copy in Bahasa Indonesia

### If This Fails
- Check: `src/app/onboarding/paywall.tsx` and `src/components/ui/PricingCard.tsx`
- Report: "UAT Test 7 failed: [what you saw — wrong price / wrong CTA text]"

---

## Test 8: Paywall CTA → Login Screen

**Verifies:** Both CTAs complete onboarding and navigate to login

### Steps
1. On Screen 7 (Paywall), tap **"Mulai Gratis"**
2. Observe where the app navigates

### Expected Results
- App navigates to the **Login screen** (`/auth/login`)
- Login screen is visible (stub is acceptable — just needs to render)
- Onboarding screens are no longer accessible via back button

### Repeat with CTA 2:
1. Clear app data again (fresh install)
2. Complete all 7 onboarding screens
3. On Screen 7, tap **"Coba Premium Gratis 7 Hari"**
4. Same expected result: navigates to Login screen

### If This Fails
- Check: `paywall.tsx` — `complete()` called before `router.replace('/auth/login')`
- Report: "UAT Test 8 failed: [stayed on paywall / crashed / wrong screen]"

---

## Test 9: AsyncStorage Persistence (State Survives Restart)

**Verifies:** Selections persist across app restarts; returning users go directly to login

### Steps
1. Complete onboarding screens 1–4 (do NOT tap "Lanjut" on Screen 4 yet)
2. Force-close the app (swipe away from recents)
3. Re-open the app

### Expected Results
- App resumes onboarding — your previous selections (goal, frequency, time) should still be selected if you navigate back to those screens
- App does NOT start back at Screen 1 (unless `isComplete` was never set — this is acceptable for mid-flow restart)

### Returning user (onboarding complete):
1. Complete full onboarding (all 7 screens, tap any CTA on paywall)
2. Force-close the app
3. Re-open the app

### Expected Results (returning user)
- App skips onboarding entirely
- App shows Login screen (not Screen 1 of onboarding)
- If user had a valid session, app shows main tabs directly

### If This Fails
- Check: `src/store/onboarding.ts` — `persist` middleware with AsyncStorage
- Check: `src/app/_layout.tsx` — auth guard reading `isComplete`
- Report: "UAT Test 9 failed: [showed wrong screen on restart]"

---

## Test 10: Back Navigation

**Verifies:** Back navigation works between screens; Screen 1 blocks hardware back

### Steps
1. Start fresh onboarding
2. Navigate to Screen 2 (Goal)
3. Press the Android hardware back button

### Expected Results
- App goes back to Screen 1

### Then:
4. On Screen 1, press the Android hardware back button

### Expected Results
- Nothing happens (back is blocked on Screen 1 — user cannot exit onboarding via back)
- App does NOT close or navigate away

### If This Fails
- Check: `src/app/onboarding/index.tsx` → `BackHandler` implementation
- Report: "UAT Test 10 failed: [back button exited app / navigated somewhere unexpected]"

---

## Reporting Results

When you've run these tests:
- **All pass** → S02 is verified from your perspective. Move to S03 (Authentication).
- **Something fails** → describe exactly what you saw vs. what was expected:
  - "UAT Test 5 failed: Screen 5 showed 'undefined' instead of my goal selection"
  - Agent will create fix tasks immediately.

## Notes
- The AI response in Screen 6 (taste.tsx) is intentionally **hardcoded** — no real Claude API call yet. Real AI integration is M003/S02.
- The Paywall CTAs go to `/auth/login` — no actual payment processing. RevenueCat is M004/S01.
- The login screen at `/auth/login` is currently a stub — full implementation is M002/S03.
- Progress dot count: dots span screens 1–7. You should see 1/7 on Screen 1 up to 7/7 on Screen 7.
