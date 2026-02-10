# 📱 Mobile Agent Orientation Prompt

Copy the section below and feed it to your mobile development agent to orient them to the authentication and environment documentation.

---

## 🎯 Mobile Agent Setup & Orientation

You are working on **Ascended Social** mobile app development (iOS, Android, or React Native).

The mobile app needs to connect to our API with proper authentication for **both development (editing) and production (live)** environments.

### 📍 Where to Find Everything

**Our approach mirrors the main web application:**
- **Dev Environment**: Connects to dev Replit backend (while editing)
- **Prod Environment**: Connects to production Replit backend (when published)

### 🎓 Learning Resources

#### Step 1: Understand the Architecture (Start Here)
**Location**: `/docs/AUTH_DOCUMENTATION_README.md`
- Overview of all authentication documentation
- Links to all relevant guides
- Quick navigation map

**Next**: Read `📊 Dev vs Production Environment Summary` in ClickUp list: "📚 Mobile API Documentation"

#### Step 2: Learn About the Two Environments
**File**: `/docs/MOBILE_ENVIRONMENT_CONFIGURATION.md`
- Complete dev vs prod architecture explanation
- How each environment is configured
- Why we have two separate environments
- Key URLs and details for each

**Development Environment**:
```
Backend: https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev
API Base: https://f9f72fa6-.../api
OAuth: Dev Replit Auth
Database: dev_DATABASE_URL (Neon)
Deep Link: ascended-dev://
Purpose: Testing & editing
```

**Production Environment**:
```
Backend: https://app.ascended.social
API Base: https://app.ascended.social/api
OAuth: Prod Replit Auth
Database: prod_DATABASE_URL (Neon)
Deep Link: ascended://
Purpose: Published app, live users
```

#### Step 3: Choose Your Platform & Get Setup Instructions
**File**: `/docs/MOBILE_ENVIRONMENT_CONFIGURATION.md`
**Contains complete code for**:

**iOS (Swift)**:
- Where to put development config (Config.dev.xcconfig)
- Where to put production config (Config.prod.xcconfig)
- How to create ConfigManager class
- Info.plist setup
- Xcode scheme configuration
- Copy-paste ready Swift code

**Android (Kotlin)**:
- build.gradle.kts configuration
- Product flavors setup (dev/prod)
- buildConfigField for environment variables
- AuthManager implementation
- AndroidManifest.xml
- Build commands

**React Native**:
- .env.development and .env.production files
- AppConfig service implementation
- Environment-aware API calls
- Build scripts
- EAS build configuration

#### Step 4: Understand Build & Deployment
**File**: `/docs/MOBILE_BUILD_DEPLOYMENT.md`
- Full build flow diagrams (3 phases)
- How development build works
- How production build works
- How live app works
- Platform-specific build commands
- Pre-build verification checklist
- Common mistakes to avoid

**Build Phases**:
1. **Development Phase** (Local Testing)
   - Load dev configuration
   - Call dev API
   - Use dev authentication
   - Access dev database
   - Test features

2. **Submission Build** (App Store Ready)
   - Load prod configuration
   - Build & sign
   - Submit to App Store/Play Store
   - App review process

3. **Live Production** (Live App)
   - User downloads
   - Prod configuration active
   - Real authentication
   - Live user data

#### Step 5: Test Your Configuration with Postman
**Location**: Postman Workspace
- **Name**: "Ascended Social - Mobile Auth"
- **Collection**: "Mobile Auth Workflows"

**Two Pre-Made Environments**:
- **Development**: Points to dev backend
- **Production**: Points to prod backend

**How to Use**:
1. Open Postman collection
2. Select "Development" environment for testing
3. Use requests to verify your app can connect
4. Switch to "Production" for final testing before launch

**Key Endpoints to Test**:
```
GET /api/mobile-config           # Get configuration
GET /api/mobile-login            # Initiate OAuth
POST /api/mobile-verify          # Verify JWT token
POST /api/auth/token             # Get JWT token
POST /api/auth/refresh           # Refresh token
GET /api/auth/validate           # Validate token
```

### 🔑 Key Files & Locations

**In Your Repository**:
- `/server/mobile-auth-routes.ts` - Mobile API endpoints
- `/server/mobile-config.ts` - Configuration handler
- `/server/replitAuth.ts` - Replit OAuth setup
- `/client/src/lib/queryClient.ts` - How web app makes auth requests

**Documentation**:
- `/docs/MOBILE_AUTH_COMPLETE_GUIDE.md` - Full architecture details
- `/docs/MOBILE_AUTH_QUICK_REFERENCE.md` - 7 endpoints reference
- `/docs/MOBILE_AUTH_SETUP_TUTORIAL.md` - Platform-by-platform tutorial
- `/docs/MOBILE_ENVIRONMENT_CONFIGURATION.md` - **START HERE FOR SETUP**
- `/docs/MOBILE_BUILD_DEPLOYMENT.md` - Build workflow
- `/docs/AUTH_DOCUMENTATION_README.md` - Navigation hub

**ClickUp Tasks** (List: "📚 Mobile API Documentation"):
- "📊 Dev vs Production Environment Summary" - Quick overview
- "🔧 Mobile Environment Configuration (Dev vs Prod)" - Detailed setup
- "🚀 Mobile Build & Deployment Workflow" - Build process
- "📚 Mobile Environment Setup: ClickUp Learning Path" - Learning guide

### 🎯 Quick Start (TL;DR)

1. **Understand the Goal**: Your app needs different configs for dev (testing) and prod (published)
2. **Read** `MOBILE_ENVIRONMENT_CONFIGURATION.md` (Choose your platform)
3. **Copy** config code into your project
4. **Build** using the commands in `MOBILE_BUILD_DEPLOYMENT.md`
5. **Test** with Postman (Development environment first, then Production)
6. **Deploy** to app store with production configuration

### 🔐 Security Considerations

- **Never hardcode** API URLs or OAuth credentials
- **Use environment variables** loaded at build time
- **Store tokens** in secure storage (Keychain/SharedPrefs/Secure Store)
- **Different app IDs** for dev vs production
- **Different deep links** schemes (ascended-dev:// vs ascended://)
- **Separate OAuth clients** for dev and production

### 🆘 Troubleshooting

**"Connection refused" or "Cannot reach API"**:
- Check you're using correct base URL for your environment
- Dev: https://f9f72fa6-...
- Prod: https://app.ascended.social
- See: Troubleshooting section in `MOBILE_BUILD_DEPLOYMENT.md`

**"OAuth login not working"**:
- Check deep link scheme matches your environment
- Dev: ascended-dev://
- Prod: ascended://
- Verify app ID in OAuth provider settings

**"Token validation fails"**:
- Ensure token has correct format (Bearer token in header)
- Check token isn't expired (7-day TTL)
- Use refresh endpoint if expired
- See: `MOBILE_AUTH_QUICK_REFERENCE.md` for endpoints

**"Version/build number issues"**:
- See: "Common Mistakes" section in `MOBILE_BUILD_DEPLOYMENT.md`
- Follow pre-build checklist before submission

### 🚀 Development Workflow

**Daily Development**:
```
1. Use Development environment
2. Connect to dev backend
3. Test features with dev data
4. Iterate quickly
5. Use Postman to verify endpoints
```

**Before Publishing**:
```
1. Switch to Production environment
2. Verify all configs point to prod
3. Run final build
4. Test with Postman Production environment
5. Build final submission package
6. Submit to app store
```

**After Publishing**:
```
1. Monitor live app
2. Check logs for production environment
3. Handle live user issues
4. For fixes: follow same build workflow
5. Submit updates from production config
```

### 📞 Quick Reference

**Development API**:
- Base URL: `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev/api`
- Deep Link: `ascended-dev://`
- App ID: `com.ascended.social.dev`

**Production API**:
- Base URL: `https://app.ascended.social/api`
- Deep Link: `ascended://`
- App ID: `com.ascended.social`

**Key Commands**:
```bash
# Build for development testing
npm run build:mobile:dev

# Build for production release
npm run build:mobile:prod

# Test with Postman
# 1. Open Postman
# 2. Select "Development" environment
# 3. Run requests to verify
# 4. Switch to "Production" for final test
```

---

## 🎓 Recommended Reading Order

1. **Start** → Auth Documentation README (5 min overview)
2. **Learn** → Dev vs Production Environment Summary (10 min)
3. **Configure** → Mobile Environment Configuration for your platform (30 min)
4. **Build** → Mobile Build & Deployment Workflow (20 min)
5. **Test** → Postman environments and endpoints (15 min)
6. **Deep Dive** → Other documentation files as needed

**Total Time**: 60-90 minutes to fully understand the system

---

## 💡 Key Principles

✅ **Development Configuration**:
- Used by unpublished app
- Points to dev backend
- Uses test/dummy data
- For editing and testing
- Quick iteration cycle

✅ **Production Configuration**:
- Used by published app
- Points to production backend
- Uses live data
- For real users
- Stability is critical

✅ **Build Approach**:
- Same codebase for dev and prod
- Configuration loaded at build time
- Different build variants/flavors
- No runtime switching
- Clear, predictable behavior

✅ **Testing Strategy**:
- Test with dev environment first
- Verify with Postman before builds
- Test prod config before submission
- Monitor logs in production

---

**You now have everything needed to:**
- Configure your mobile app for dev and prod
- Build and test locally
- Deploy to app stores
- Monitor production
- Debug issues in either environment

**Start with**: `/docs/MOBILE_ENVIRONMENT_CONFIGURATION.md` for your platform.

Good luck! 🚀
