# 🚀 Mobile App Build & Deployment Guide

**Version**: 1.0.0 | **Date**: February 2026

---

## 📱 Build Configurations at a Glance

### Development Build (During Development)
```
Command: npm run build:mobile:dev
└─ Connects to: Dev Replit backend
   ├─ API: https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api
   ├─ OAuth: Dev Replit Auth
   ├─ Database: Dev Neon (test data)
   ├─ Deep Link: ascended-dev://
   └─ App ID: com.ascended.social.dev
```

### Production Build (Published Version)
```
Command: npm run build:mobile:prod
└─ Connects to: Production Replit backend
   ├─ API: https://app.ascended.social/api
   ├─ OAuth: Production Replit Auth
   ├─ Database: Production Neon (live data)
   ├─ Deep Link: ascended://
   └─ App ID: com.ascended.social
```

---

## 🏗️ Full Build Flow

### Phase 1: Development (Testing Phase)

```
┌─────────────────────────────────────────┐
│ 1. Mobile Developer Starts App         │
│    (In Xcode/Android Studio/Expo)      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 2. Load Dev Configuration              │
│    - REACT_APP_ENVIRONMENT=development │
│    - Build config: DEBUG/dev           │
│    - API_BASE_URL = dev domain         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 3. Make API Calls to Dev Backend       │
│    GET /api/mobile-config              │
│       → Returns dev API domain         │
│    GET /api/mobile-login               │
│       → Redirects to dev OAuth         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 4. User Authenticates                  │
│    - Dev Replit OAuth login            │
│    - Dev user database                 │
│    - Deep link: ascended-dev://        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 5. App Functions with Dev Data         │
│    - Dev posts, users, data            │
│    - Test features                     │
│    - Debug as needed                   │
└─────────────────────────────────────────┘
```

### Phase 2: Submission Build (Ready for App Store)

```
┌─────────────────────────────────────────┐
│ 1. Developer Runs Build Command        │
│    npm run build:mobile:prod           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 2. Load Production Configuration       │
│    - REACT_APP_ENVIRONMENT=production  │
│    - Build config: RELEASE/prod        │
│    - API_BASE_URL = prod domain        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 3. Build & Sign App                    │
│    - Compile code                      │
│    - Sign with production certificate  │
│    - Generate .ipa / .apk              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 4. Submit to App Store                 │
│    - TestFlight (iOS)                  │
│    - Google Play Console (Android)     │
│    - App review & approval             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 5. Published App Available             │
│    - Connects to prod backend          │
│    - Production Replit Auth            │
│    - Live user database                │
│    - Deep link: ascended://            │
└─────────────────────────────────────────┘
```

### Phase 3: Live Production

```
┌─────────────────────────────────────────┐
│ User Installs App from App Store       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ App Automatically Configured for Prod  │
│ (from build configuration)              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 1. GET /api/mobile-config              │
│    → Returns prod API domain           │
│    → Returns prod OAuth client ID      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 2. User Logs In                        │
│    → Production Replit OAuth           │
│    → Real user account                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ 3. App Uses Production Data            │
│    → Real posts, users                 │
│    → Production database               │
│    → Live features                     │
└─────────────────────────────────────────┘
```

---

## 🛠️ Platform-Specific Build Commands

### iOS

```bash
# Development Build
xcodebuild -scheme "Ascended Social Dev" -configuration Debug

# Production Build  
xcodebuild -scheme "Ascended Social" -configuration Release

# Archive for App Store
xcodebuild -scheme "Ascended Social" -configuration Release archive
```

### Android

```bash
# Development Build
./gradlew assembleDevDebug

# Production Build
./gradlew assembleProdRelease

# Upload to Google Play
cd android && gradle bundleProdRelease
```

### React Native

```bash
# Development Build
REACT_APP_ENVIRONMENT=development expo build:android

# Production Build
REACT_APP_ENVIRONMENT=production eas build --platform android --build-profile production
```

---

## 🔍 How to Verify You're Using Correct Configuration

### Check Development Setup

```bash
# iOS
xcrun simctl logs booted | grep "apiBaseUrl"
# Should show: f9f72fa6-d1fb-425c-b9c8-6acf959c3a51...

# Android (via Logcat)
adb logcat | grep "API_BASE_URL"
# Should show: f9f72fa6-d1fb-425c-b9c8-6acf959c3a51...

# React Native (via Hermes debugger)
console.log(AppConfig.apiBaseUrl)
// Should show: f9f72fa6-d1fb-425c-b9c8-6acf959c3a51...
```

### Check Production Setup

```bash
# iOS
xcrun simctl logs booted | grep "apiBaseUrl"
# Should show: app.ascended.social

# Android
adb logcat | grep "API_BASE_URL"  
# Should show: app.ascended.social

# React Native
console.log(AppConfig.apiBaseUrl)
// Should show: app.ascended.social
```

### Network Tab Inspection

**Development**
```
GET https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00.../api/mobile-config
GET https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00.../api/mobile-login
```

**Production**
```
GET https://app.ascended.social/api/mobile-config
GET https://app.ascended.social/api/mobile-login
```

---

## 📋 Pre-Build Checklist

### Before Development Build

- [ ] Environment variable file created (`.env.development`)
- [ ] API_BASE_URL points to dev Replit
- [ ] Deep link scheme set to `ascended-dev`
- [ ] Build config set to DEBUG/dev
- [ ] Confirmed connecting to dev database
- [ ] Test user accounts exist in dev database
- [ ] Deep links test with ascended-dev://

### Before Production Build

- [ ] Environment variable file created (`.env.production`)
- [ ] API_BASE_URL points to prod domain (app.ascended.social)
- [ ] Deep link scheme set to `ascended` (not `ascended-dev`)
- [ ] Build config set to RELEASE/prod
- [ ] All features tested in dev first
- [ ] Production certificates configured
- [ ] Signing keys properly set up
- [ ] Version number incremented
- [ ] Tested with TestFlight or Play Console internal track
- [ ] Deep links test with ascended:// (no -dev)

---

## 🚨 Common Mistakes to Avoid

❌ **Building for production with dev configuration**
- Result: App can't connect to prod backend
- Fix: Check environment variables before building

❌ **Using same deep link for dev and prod**
- Result: Dev app interferes with prod app
- Fix: Use `ascended-dev://` for dev, `ascended://` for prod

❌ **Forgetting to update version number**
- Result: App Store won't accept update
- Fix: Always increment version before release build

❌ **Hardcoding API URLs instead of using configuration**
- Result: Have to recompile for each environment
- Fix: Use config files and environment variables

❌ **Committing production secrets to git**
- Result: Security breach
- Fix: Use .gitignore for .env.production

---

## 📊 Environment Comparison Table

| Aspect | Dev Build | Prod Build |
|--------|-----------|-----------|
| **Configuration** | `.env.development` | `.env.production` |
| **Build Command** | `npm run build:mobile:dev` | `npm run build:mobile:prod` |
| **API Base URL** | `f9f72fa6-...riker.replit.dev` | `app.ascended.social` |
| **OAuth Client** | Dev REPL_ID | Prod REPL_ID |
| **Deep Links** | `ascended-dev://` | `ascended://` |
| **App ID** | `com.ascended.social.dev` | `com.ascended.social` |
| **Database** | dev_DATABASE_URL | prod_DATABASE_URL |
| **Logging** | Verbose | Filtered |
| **Data** | Test data | Live user data |
| **Install** | Manual/Simulator | App Store |
| **Users** | Developers/QA | End users |

---

## 🔄 Environment Migration Workflow

### Scenario: Need to release version 1.1.0

```
Step 1: Development Phase
├─ Create feature branch: feature/new-feature
├─ Work with dev configuration
├─ Test on dev backend
├─ Commit to main
└─ All CI tests pass

Step 2: Prepare Release
├─ Create release branch: release/1.1.0
├─ Update version: 1.0.0 → 1.1.0
├─ Update changelog
└─ Merge to main

Step 3: Build Release
├─ Run: npm run build:mobile:prod
├─ Load prod configuration
├─ Compile with prod settings
├─ Sign with prod certificate
└─ Generate release bundle

Step 4: Submit & Publish
├─ Upload to App Store / Play Store
├─ Pass review process
├─ Mark as live
└─ Users download from store

Step 5: Live on Production
├─ Users connect to prod backend
├─ Production Replit Auth
├─ Production database
└─ Live features active
```

---

## 🛡️ Troubleshooting Build Issues

### Issue: App connects to dev when should connect to prod

**Symptoms**:
- App shows test data in production
- OAuth redirects to dev auth screen
- Version 1.0.0 in app store but showing dev data

**Solution**:
```bash
# Check environment was loaded correctly
grep REACT_APP_ENVIRONMENT .env.production
# Should output: REACT_APP_ENVIRONMENT=production

# Rebuild with forced production config
npm run build:mobile:prod -- --force-prod-config

# Verify in app logs
console.log(AppConfig.environment) // should be 'production'
```

### Issue: Deep links don't work

**Symptoms**:
- ascended:// or ascended-dev:// links don't open app
- Auth callback fails

**Solution**:
```bash
# iOS: Check Info.plist
grep ascended Info.plist

# Android: Check AndroidManifest.xml  
grep schema AndroidManifest.xml

# React Native: Check app.json
cat app.json | grep deepLiningScheme

# Should match build configuration:
# Dev: ascended-dev
# Prod: ascended
```

### Issue: Can't authenticate

**Symptoms**:
- OAuth screen redirects incorrectly
- Token validation fails

**Solution**:
```bash
# Check backend URL matches
curl https://app.ascended.social/api/mobile-config
# Response should show correct domain

# Verify deep link callback format
# Dev: ascended-dev://auth/callback
# Prod: ascended://auth/callback
```

---

## 📚 Related Documentation

- [Mobile Environment Configuration](./MOBILE_ENVIRONMENT_CONFIGURATION.md) - Detailed configuration guide
- [Mobile Auth Complete Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md) - Auth implementation
- [Backend Configuration](../server/mobile-config.ts) - Server-side setup

---

**Last Updated**: February 2026  
**Version**: 1.0.0
