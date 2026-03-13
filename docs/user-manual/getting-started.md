# Getting Started — Reflect Development

## Prerequisites
- WSL2 (Ubuntu) on Windows
- Android SDK at `/mnt/c/Users/Darwin.Poso/AppData/Local/Android/Sdk`
- Node.js 18+
- Samsung SM-F936B (Galaxy Z Fold 4) for physical device testing

## First-Time Setup

```bash
cd /home/darwinposo/projects/github/Wellness
npm install --legacy-peer-deps
cp .env.example .env
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

## Running the App

```bash
# Start Metro bundler
npx expo start --dev-client

# Build and install debug APK (WSL2)
cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Project Structure

See [Project Scaffold](../features/M002-S01-project-scaffold.md) for full architecture.

---

## Features

### M002/S01 — Project Scaffold
App foundation: Expo SDK 55, navigation shell, design tokens, all landmines fixed.

- [Feature Documentation](../features/M002-S01-project-scaffold.md)
- [UAT Script](../../.gsd/milestones/M002/slices/S01/uat.md)
