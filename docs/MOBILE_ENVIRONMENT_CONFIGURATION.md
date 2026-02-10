# 📱 Mobile App Environment Configuration Guide

**Version**: 1.0.0 | **Date**: February 2026  
**Purpose**: Configure mobile app to connect to correct backend (dev vs production)

---

## 🎯 Overview

Your mobile app needs to connect to different backends depending on the mode:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT PHASE                            │
│  (You're building and testing the mobile app)                   │
│                                                                 │
│  Mobile App (Dev) ──> Dev Replit Backend                        │
│                       - Dev Replit Auth                         │
│                       - Dev Database (Neon)                     │
│                       - Test data                               │
│                                                                 │
│  URL: https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00...       │
│  Replit OAuth: Dev REPL_ID                                     │
│  Database: Dev DATABASE_URL                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLISHED PHASE                              │
│  (App is released/published to app store)                       │
│                                                                 │
│  Mobile App (Live) ──> Production Replit Backend               │
│                        - Production Replit Auth                │
│                        - Production Database (Neon)            │
│                        - Live user data                        │
│                                                                 │
│  URL: https://app.ascended.social                              │
│  Replit OAuth: Prod REPL_ID                                    │
│  Database: Prod DATABASE_URL                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Approach

Your mobile app should have **two build configurations** (like the main web app):

### 1. Development Build (`dev` scheme/flavor)
- **API Base URL**: Dev Replit instance
- **Auth Provider**: Dev Replit OAuth
- **Database**: Dev Neon database
- **Use Case**: Testing during development
- **Commands**: `npm run build:mobile:dev`

### 2. Production Build (`prod` scheme/flavor)
- **API Base URL**: Production Replit instance  
- **Auth Provider**: Production Replit OAuth
- **Database**: Production Neon database
- **Use Case**: Published app in app store
- **Commands**: `npm run build:mobile:prod`

---

## 📊 Environment Comparison

| Component | Development | Production |
|-----------|-------------|-----------|
| **Backend Domain** | `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev` | `https://app.ascended.social` |
| **API Base URL** | `https://<dev-domain>/api` | `https://app.ascended.social/api` |
| **Replit OAuth Client** | Dev REPL_ID | Prod REPL_ID |
| **Auth Endpoint** | Dev OAuth server | Prod OAuth server |
| **Database** | `dev_DATABASE_URL` | `prod_DATABASE_URL` |
| **Dummy Data** | Yes (test users) | No (real users) |
| **API Rate Limit** | Higher (testing) | Lower (production) |
| **Error Logging** | Verbose | Filtered |
| **Deep Link Scheme** | `ascended://dev` | `ascended://` |

---

## 🚀 Implementation Guide

### iOS (Swift)

#### 1. Create Build Configuration Files

**Dev Configuration** (`Config.dev.xcconfig`)
```swift
// Dev Build
BUNDLE_ID = com.ascended.social.dev
PRODUCT_NAME = Ascended Social Dev
API_BASE_URL = https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api
REPLIT_CLIENT_ID = dev-replit-client-id
DEEP_LINK_SCHEME = ascended-dev
ENVIRONMENT = development
```

**Prod Configuration** (`Config.prod.xcconfig`)
```swift
// Production Build
BUNDLE_ID = com.ascended.social
PRODUCT_NAME = Ascended Social
API_BASE_URL = https://app.ascended.social/api
REPLIT_CLIENT_ID = prod-replit-client-id
DEEP_LINK_SCHEME = ascended
ENVIRONMENT = production
```

#### 2. Update ConfigManager

```swift
import Foundation

enum Environment: String {
    case development
    case production
}

struct AppConfig {
    let apiBaseUrl: String
    let replitClientId: String
    let deepLinkScheme: String
    let environment: Environment
    
    static let current: AppConfig = {
        #if DEBUG
        return AppConfig(
            apiBaseUrl: Bundle.main.infoDictionary?["API_BASE_URL"] as? String ?? "https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api",
            replitClientId: Bundle.main.infoDictionary?["REPLIT_CLIENT_ID"] as? String ?? "dev-id",
            deepLinkScheme: Bundle.main.infoDictionary?["DEEP_LINK_SCHEME"] as? String ?? "ascended-dev",
            environment: .development
        )
        #else
        return AppConfig(
            apiBaseUrl: Bundle.main.infoDictionary?["API_BASE_URL"] as? String ?? "https://app.ascended.social/api",
            replitClientId: Bundle.main.infoDictionary?["REPLIT_CLIENT_ID"] as? String ?? "prod-id",
            deepLinkScheme: Bundle.main.infoDictionary?["DEEP_LINK_SCHEME"] as? String ?? "ascended",
            environment: .production
        )
        #endif
    }()
}

// Usage in AuthManager
class AuthManager: ObservableObject {
    let config = AppConfig.current
    
    func startLogin() {
        let loginUrl = "\(config.apiBaseUrl)/mobile-login?platform=native&redirect_uri=\(config.deepLinkScheme)://auth/callback"
        // ... rest of login logic
    }
}
```

#### 3. Update Info.plist for Multiple Schemes

```xml
<!-- Dev Scheme -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLScheme</key>
        <string>ascended-dev</string>
    </dict>
</array>

<!-- Prod Scheme -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLScheme</key>
        <string>ascended</string>
    </dict>
</array>
```

#### 4. Xcode Scheme Setup

```bash
# Dev Scheme
Build Configuration: Debug
Info.plist values: $(inherited) from Config.dev.xcconfig

# Prod Scheme  
Build Configuration: Release
Info.plist values: $(inherited) from Config.prod.xcconfig
```

---

### Android (Kotlin)

#### 1. Create Build Variants

**`build.gradle.kts`**
```kotlin
android {
    buildTypes {
        debug {
            isDebuggable = true
            buildConfigField("String", "API_BASE_URL", "\"https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api\"")
            buildConfigField("String", "REPLIT_CLIENT_ID", "\"dev-replit-client-id\"")
            buildConfigField("String", "DEEP_LINK_SCHEME", "\"ascended-dev\"")
        }
        
        release {
            isMinifyEnabled = true
            buildConfigField("String", "API_BASE_URL", "\"https://app.ascended.social/api\"")
            buildConfigField("String", "REPLIT_CLIENT_ID", "\"prod-replit-client-id\"")
            buildConfigField("String", "DEEP_LINK_SCHEME", "\"ascended\"")
        }
    }
    
    flavorDimensions += "environment"
    productFlavors {
        create("dev") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
            versionNameSuffix = "-dev"
        }
        
        create("prod") {
            dimension = "environment"
        }
    }
}
```

#### 2. Update AuthManager

```kotlin
import android.content.Context
import com.yourapp.BuildConfig

class AuthManager(private val context: Context) {
    private val apiBaseUrl = BuildConfig.API_BASE_URL
    private val replitClientId = BuildConfig.REPLIT_CLIENT_ID
    private val deepLinkScheme = BuildConfig.DEEP_LINK_SCHEME
    
    fun startLogin() {
        val redirectUri = "$deepLinkScheme://auth/callback"
        val loginUrl = "$apiBaseUrl/../mobile-login?platform=native&redirect_uri=$redirectUri"
        
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(loginUrl))
        context.startActivity(intent)
    }
}
```

#### 3. AndroidManifest.xml Setup

```xml
<!-- Debug/Dev -->
<activity android:name=".DeepLinkActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="ascended-dev" android:host="auth" />
    </intent-filter>
</activity>

<!-- Release/Prod -->
<activity android:name=".DeepLinkActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="ascended" android:host="auth" />
    </intent-filter>
</activity>
```

#### 4. Build Commands

```bash
# Dev build
./gradlew dependsOnDevDebug

# Prod build
./gradlew assembleProdRelease
```

---

### React Native

#### 1. Create Environment Files

**`.env.development`**
```bash
REACT_APP_API_BASE_URL=https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api
REACT_APP_REPLIT_CLIENT_ID=dev-replit-client-id
REACT_APP_DEEP_LINK_SCHEME=ascended-dev
REACT_APP_ENVIRONMENT=development
```

**`.env.production`**
```bash
REACT_APP_API_BASE_URL=https://app.ascended.social/api
REACT_APP_REPLIT_CLIENT_ID=prod-replit-client-id
REACT_APP_DEEP_LINK_SCHEME=ascended
REACT_APP_ENVIRONMENT=production
```

#### 2. Create AppConfig Service

```typescript
// config/appConfig.ts
export const AppConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  replitClientId: process.env.REACT_APP_REPLIT_CLIENT_ID || 'dev-id',
  deepLinkScheme: process.env.REACT_APP_DEEP_LINK_SCHEME || 'ascended-dev',
  environment: (process.env.REACT_APP_ENVIRONMENT || 'development') as 'development' | 'production',
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development',
};

// Usage
import { AppConfig } from '@/config/appConfig';

export async function startLogin() {
  const redirectUri = `${AppConfig.deepLinkScheme}://auth/callback`;
  const loginUrl = `${AppConfig.apiBaseUrl}/../mobile-login?platform=native&redirect_uri=${redirectUri}`;
  
  await Linking.openURL(loginUrl);
}
```

#### 3. Build Commands

```bash
# Development build
npm run build:mobile:dev

# Production build  
npm run build:mobile:prod
```

**`package.json` scripts**
```json
{
  "scripts": {
    "build:mobile:dev": "REACT_APP_ENVIRONMENT=development expo build:android",
    "build:mobile:prod": "REACT_APP_ENVIRONMENT=production expo build:android",
    "eas:build:dev": "REACT_APP_ENVIRONMENT=development eas build --platform android",
    "eas:build:prod": "REACT_APP_ENVIRONMENT=production eas build --platform android"
  }
}
```

---

## 🔑 Backend Configuration

### How the Backend Serves Different Endpoints

The backend automatically detects which environment the request comes from:

```typescript
// server/mobile-auth-routes.ts
router.get('/mobile-config', (req, res) => {
  const host = req.get('host');
  
  // Detect environment from request origin
  const isDevelopment = host.includes('replit.dev');
  
  const config = {
    apiBaseUrl: isDevelopment 
      ? `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api`
      : `https://app.ascended.social/api`,
    
    replitClientId: isDevelopment
      ? process.env.DEV_REPLIT_CLIENT_ID
      : process.env.PROD_REPLIT_CLIENT_ID,
    
    deepLinkScheme: isDevelopment
      ? 'ascended-dev://'
      : 'ascended://'
  };
  
  res.json(config);
});
```

### Replit Environment Variables

**Development Replit Instance** (`server/.env`)
```bash
# Dev Instance Variables
REPL_ID=dev-replit-client-id
REPLOT_OWNER=dev-owner
DATABASE_URL=postgresql://dev-user:dev-pass@neon.postgres.vercel.app/dev_db
NODE_ENV=development
```

**Production Replit Instance** (`server/.env`)
```bash
# Prod Instance Variables
REPL_ID=prod-replit-client-id
REPLIT_OWNER=prod-owner
DATABASE_URL=postgresql://prod-user:prod-pass@neon.postgres.vercel.app/prod_db
NODE_ENV=production
```

---

## 🧪 Testing Environment Configuration

### Postman Environments

#### Development Environment Variables
```json
{
  "apiBaseUrl": "https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api",
  "deepLinkScheme": "ascended-dev",
  "platform": "native",
  "environment": "development",
  "authToken": "",
  "userId": ""
}
```

#### Production Environment Variables
```json
{
  "apiBaseUrl": "https://app.ascended.social/api",
  "deepLinkScheme": "ascended",
  "platform": "native",
  "environment": "production",
  "authToken": "",
  "userId": ""
}
```

---

## ✅ Configuration Checklist

### Development Build
- [ ] API Base URL points to dev Replit instance
- [ ] Replit Client ID is dev client ID
- [ ] Deep link scheme is `ascended-dev://`
- [ ] Database connection uses dev database
- [ ] Build configuration set to DEBUG/dev
- [ ] Tested with dev backend
- [ ] Dummy data loads correctly

### Production Build
- [ ] API Base URL points to production domain
- [ ] Replit Client ID is production client ID
- [ ] Deep link scheme is `ascended://`
- [ ] Database connection uses production database
- [ ] Build configuration set to RELEASE/prod
- [ ] Tested with production backend
- [ ] Ready for app store submission

---

## 🔄 Migration Between Environments

### Moving from Dev to Prod

```
1. Development Phase (Testing)
   ↓
   App running on dev backend
   Testing with dev data
   
2. Pre-Production Testing
   ↓
   Switch environment variable
   Test against production backend
   Verify forms, API calls
   
3. Production Submission
   ↓
   Build with prod configuration
   Submit to app store
   Users connect to prod backend
```

### Rolling Back on Production Issue

```
1. Issue detected in production
   ↓
2. Quickly rollback mobile version
   ↓
3. Increment version (e.g., 1.0.0 → 1.0.1)
   ↓
4. Rebuild dev version to fix
   ↓
5. Test thoroughly in dev environment
   ↓
6. Rebuild prod version with fix
   ↓
7. Resubmit to app store
```

---

## 📝 Version Control & Documentation

### Branches

```
main (development)
  └─ Mobile app dev builds connect to dev backend
  └─ Regular commits and testing

releases/
  └─ Production release branches
  └─ Mobile app prod builds connect to prod backend
  └─ Tagged for version control
```

### Configuration Files in Git

```
mobile/
├── .env.development      (checked in - safe defaults)
├── .env.production       (checked in - prod URLs safe)
├── .env.local           (NOT checked in - local overrides)
├── ios/
│   ├── Config.dev.xcconfig
│   └── Config.prod.xcconfig
└── android/
    └── build.gradle.kts
```

---

## 🔐 Security Considerations

### Development Environment
- ✅ Test data is safe to expose
- ✅ More verbose logging for debugging
- ✅ Can use test OAuth credentials
- ⚠️ Never commit real production secrets

### Production Environment
- ✅ Only real, sensitive data
- ✅ Minimal error logging
- ✅ Production OAuth credentials only
- ✅ Secrets stored in Replit Secrets, not code
- ✅ Rate limiting enforced
- ✅ CORS restrictions enabled

---

## 🚀 Deployment Pipeline

```
Mobile Developer
       ↓
[DEV Build Configuration]
       ↓
Test on Dev Backend
   (ascended-dev://)
       ↓
Verify Functionality
       ↓
[PROD Build Configuration]
       ↓
Final Testing
       ↓
Build Release (.ipa / .apk)
       ↓
Submit to App Store / Google Play
       ↓
Production Users
   (ascended://)
```

---

## 📚 Related Documentation

- [Mobile Auth Complete Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md) - Auth implementation details
- [Mobile Auth Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md) - API endpoints for both environments
- [Backend Configuration](../server/mobile-config.ts) - Server-side environment detection

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Production Ready
