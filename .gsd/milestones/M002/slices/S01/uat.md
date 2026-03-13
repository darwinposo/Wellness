# UAT: M002/S01 — Project Scaffold
Generated: 2026-03-13
Slice Demo: "After this slice, the developer can run the Reflect app on a physical Android device via EAS development build, see the 4-tab navigation shell with screen stubs, and confirm NativeWind + Supabase + Skia are all wired up without crashes."

## Pre-conditions
- APK installed on Samsung SM-F936B (Galaxy Z Fold 4)
  ```bash
  adb install -r android/app/build/outputs/apk/debug/app-debug.apk
  ```
- Metro bundler running:
  ```bash
  cd /home/darwinposo/projects/github/Wellness
  npx expo start --dev-client
  ```
- Phone connected to same WiFi as dev machine (for Metro JS bundle)

---

## Test 1: App Launches Without Crash

**Verifies:** No crash on launch (Supabase + metro fix verified)

### Steps
1. Open the **Reflect** app on the phone
2. Wait for Metro bundle to load (first load may take 10–15 seconds)
3. Observe the screen

### Expected Results
- App opens and displays a screen — does NOT crash to home screen
- No red error overlay ("RCTFatal" or similar)
- You see content on screen (a stub screen or splash)

### If This Fails
- Check Metro terminal for red error output
- Common cause: Metro not running — ensure `npx expo start --dev-client` is running
- Report: "App crashes on launch with error: <copy the red screen text>"

---

## Test 2: 4-Tab Navigation Shell Visible

**Verifies:** Tab bar shows 4 tabs — Hari Ini, Jurnal, Wawasan, Profil

### Steps
1. With the app open and loaded, look at the bottom of the screen
2. Count the tabs in the bottom navigation bar
3. Read the labels on each tab

### Expected Results
- 4 tabs visible at the bottom
- Tab labels (in Bahasa Indonesia):
  - **Hari Ini** (Today) — leftmost
  - **Jurnal** (Journal)
  - **Wawasan** (Insights)
  - **Profil** (Profile) — rightmost
- Active tab icon/label is **terracotta/orange** (#D4724A)
- Inactive tabs are grey

### If This Fails
- If only 3 tabs: one tab is missing — report which label is absent
- If labels are in English: copy in Indonesian wasn't applied — report "labels show English"
- Report: "Tab bar shows <N> tabs with labels: <what you see>"

---

## Test 3: Tab Navigation Works

**Verifies:** Each tab is tappable and navigates to a stub screen

### Steps
1. Tap **Hari Ini** tab — observe screen content
2. Tap **Jurnal** tab — observe screen content
3. Tap **Wawasan** tab — observe screen content
4. Tap **Profil** tab — observe screen content

### Expected Results
- Each tap switches to a different screen without crashing
- Each screen shows stub content (a screen name or placeholder text)
- No white screen of death, no red error overlay on any tab
- Back-tapping between tabs works smoothly

### If This Fails
- Report: "Tapping <tab name> causes <describe what happens>"

---

## Test 4: NativeWind Design Tokens Rendering

**Verifies:** NativeWind className works — bg-brand-primary renders terracotta

### Steps
1. Navigate to the **Hari Ini** (Today) tab
2. Look for a button and a card on screen
3. Observe the button color

### Expected Results
- A **terracotta/burnt-orange button** is visible (#D4724A — same color as active tab)
- A **card with rounded corners and shadow** is visible below the button
- Text on button is white and readable
- The card appears elevated (slight shadow on Android)

### If This Fails
- If button is grey/default: NativeWind className not applying — report "button is grey, not terracotta"
- If no button visible: Today screen not rendering components — report "Today screen is blank"
- Report: "Today screen shows: <describe what you see>"

---

## Test 5: No Critical Errors in Metro Terminal

**Verifies:** All 7 critical landmines addressed — no Supabase/metro crashes

### Steps
1. While the app is running, look at the Metro terminal output
2. Navigate through all 4 tabs
3. Check for any red ERROR lines in terminal

### Expected Results
- No `Error: Package "stream" was not found` (metro landmine)
- No `AsyncStorage has been removed` warning (Supabase landmine)
- No `url-polyfill` missing error
- Yellow warnings are acceptable; red errors are a fail

### If This Fails
- Copy the exact error text from the terminal
- Report: "Metro shows error: <paste error>"

---

## Test 6: Physical Device Build Confirmed

**Verifies:** App loads on physical Android device via EAS dev build (not Expo Go)

### Steps
1. Check the app icon on your phone — it should say **Reflect** (not "Expo Go")
2. Open the app and confirm it connects to Metro bundler
3. In Metro terminal, look for a line like `Connected: Android <device>`

### Expected Results
- App icon is named "Reflect" with the app's custom icon (or placeholder)
- App connects to Metro on open (not Expo Go's own connection)
- Metro terminal shows the device connected

### If This Fails
- If you see "Open with Expo Go": the dev build APK wasn't installed — reinstall the APK
- Report: "App opens in Expo Go / App icon says Expo Go"

---

## Reporting Results

When you've run these tests:
- **All pass** → S01 is verified ✓ Report back "UAT S01 passed" and we move to S02
- **Something fails** → describe what you saw vs expected:
  > "UAT Test 2 failed: tab bar shows 3 tabs — Profil tab is missing"
  Agent will create fix tasks.

## Notes
- First Metro bundle load can take 20–30 seconds on cold start — wait before declaring a crash
- The app is in stub state — screens show placeholder content, that's expected
- If Metro asks to choose a dev server, pick the one matching your machine's IP
- Landmine note: if you see `NODE_ENV not set` warning in Metro, that's harmless — already handled
