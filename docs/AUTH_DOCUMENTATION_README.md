# 🔐 Ascended Social - Mobile Authentication Documentation

## 📚 Complete Authentication System for Mobile & Web Developers

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: February 2026

---

## 🚀 Quick Start (5 minutes)

### For Mobile Developers

1. **Read This First** (3 min):
   - [MOBILE_AUTH_QUICK_REFERENCE.md](./MOBILE_AUTH_QUICK_REFERENCE.md) ⭐ **START HERE**

2. **Implement Your Platform** (config time depends on platform):
   - **iOS**: [MOBILE_AUTH_SETUP_TUTORIAL.md - Part 1](./MOBILE_AUTH_SETUP_TUTORIAL.md#part-1-ios-setup-swift)
   - **Android**: [MOBILE_AUTH_SETUP_TUTORIAL.md - Part 2](./MOBILE_AUTH_SETUP_TUTORIAL.md#part-2-android-setup-kotlin)
   - **React Native**: [MOBILE_AUTH_SETUP_TUTORIAL.md - Part 3](./MOBILE_AUTH_SETUP_TUTORIAL.md#part-3-react-native-setup)

3. **Test with Postman**:
   - Workspace: `Ascended Social - Authentication & Mobile Integration`
   - Collection: `Ascended Social - Auth Workflows`
   - [Postman Setup Guide](./MOBILE_AUTH_QUICK_REFERENCE.md#-postman-collection)

4. **Need Details?**:
   - [MOBILE_AUTH_COMPLETE_GUIDE.md](./MOBILE_AUTH_COMPLETE_GUIDE.md) - Full reference

---

## 📖 Documentation Map

### Quick References (Start Here)
| Document | Purpose | Time |
|----------|---------|------|
| [Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md) | 7 endpoints, copy-paste examples | 5 min |
| [Complete Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md) | Full architecture & flows | 30 min |
| [Setup Tutorial](./MOBILE_AUTH_SETUP_TUTORIAL.md) | Platform-specific code | 20 min |

### By Role
| Role | Start With |
|------|-----------|
| **Mobile Developer** | [Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md) → [Setup Tutorial](./MOBILE_AUTH_SETUP_TUTORIAL.md) |
| **Backend Developer** | [Complete Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md) - Architecture section |
| **QA / Tester** | [Testing Checklist](./TESTING_CHECKLIST.md) |
| **New Team Member** | [Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md) then [Complete Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md) |

---

## 🎯 Complete Feature Overview

### 7 Core Endpoints

```
1. GET  /api/mobile-config              → Get configuration
2. GET  /api/mobile-config/health      → Health check
3. GET  /api/mobile-login              → Start OAuth
4. POST /api/mobile-verify             → Verify token
5. POST /api/auth/token                → Generate JWT
6. POST /api/auth/refresh              → Refresh JWT
7. GET  /api/auth/validate             → Validate token
```

**→ Full endpoint reference**: [Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md)

---

## 📱 Platform Support

### ✅ iOS (Swift)
- Complete AuthManager class
- Keychain secure storage
- Deep link handling
- SceneDelegate setup
- SwiftUI example

**→ Full iOS guide**: [Setup Tutorial - Part 1](./MOBILE_AUTH_SETUP_TUTORIAL.md#part-1-ios-setup-swift)

### ✅ Android (Kotlin)
- Complete AuthManager class
- SharedPreferences storage
- Deep link intent filtering
- Activity handler
- OkHttp integration

**→ Full Android guide**: [Setup Tutorial - Part 2](./MOBILE_AUTH_SETUP_TUTORIAL.md#part-2-android-setup-kotlin)

### ✅ React Native
- Auth service class
- Expo Secure Store integration
- Deep linking setup
- Login component
- Network interceptors

**→ Full React Native guide**: [Setup Tutorial - Part 3](./MOBILE_AUTH_SETUP_TUTORIAL.md#part-3-react-native-setup)

### ✅ Web (Next.js, SvelteKit, Remix)
- Session-based OAuth
- Automatic token management
- Protected routes
- Middleware integration

**→ Web OAuth flow**: [Complete Guide - Web OAuth Flow](./MOBILE_AUTH_COMPLETE_GUIDE.md#-web-oauth-flow)

---

## 🔑 Authentication Methods

### 1. **Web OAuth (Session-Based)**
- Traditional web apps
- Server-side rendering
- Session cookies
- Automatic token refresh

### 2. **Mobile Native (JWT + Deep Links)**
- iOS/Android apps
- Deep link callbacks
- Secure token storage
- Manual token management

### 3. **Mobile Web (Hybrid)**
- Web wrapper in mobile
- Can use either method
- Flexible switching

**→ Compare methods**: [Complete Guide - Auth Architecture](./MOBILE_AUTH_COMPLETE_GUIDE.md#-authentication-architecture)

---

## 🔐 Security Features

✅ **CSRF Protection** - State parameter validation
✅ **Rate Limiting** - 10 attempts per 15 minutes per IP
✅ **Secure Storage** - Keychain (iOS), Shared Preferences (Android), Expo Secure Store (React Native)
✅ **Token Validation** - JWT signature verification
✅ **Session Security** - HttpOnly, Secure cookies in production
✅ **CAPTCHA** - Turnstile verification on production
✅ **Token Expiry** - 7-day TTL with automatic refresh

**→ Security details**: [Complete Guide - Security](./MOBILE_AUTH_COMPLETE_GUIDE.md#-error-handling)

---

## 🧪 Testing & Validation

### Postman Collection
**Access**: https://www.postman.com
- **Team**: Dan Root
- **Workspace**: "Ascended Social - Authentication & Mobile Integration"
- **Collection**: "Ascended Social - Auth Workflows"
- **Environments**: Development & Production

### Manual Testing Checklist
- ☐ Config endpoint works
- ☐ OAuth redirects properly
- ☐ Deep links intercepted
- ☐ Tokens validated
- ☐ Rate limiting works
- ☐ Token refresh succeeds
- ☐ Errors handled gracefully

**→ Full checklist**: [Testing Checklist](./MOBILE_AUTH_COMPLETE_GUIDE.md#-testing--debugging)

---

## 🛠️ Implementation Timeline

### Phase 1: Setup (30 min)
1. Review [Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md)
2. Set up Postman collection
3. Connect to backend

### Phase 2: Implementation (2-4 hours)
1. Implement platform-specific code
2. Configure deep links
3. Set up secure storage

### Phase 3: Testing (1-2 hours)
1. Test with Postman
2. Verify all endpoints
3. Check error handling

### Phase 4: Integration (1-2 hours)
1. Integrate with app UI
2. Handle auth callbacks
3. Test full flow end-to-end

**Total**: 4-8 hours depending on platform and experience

---

## ✅ Pre-Launch Checklist

Before going to production:

### Configuration
- [ ] Mobile config endpoint returns correct domains
- [ ] Backend database and sessions table exist
- [ ] Environment variables set (REPL_ID, SESSION_SECRET, DATABASE_URL)
- [ ] Turnstile configured for production
- [ ] CORS headers properly configured
- [ ] Deep links registered in app manifests

### Functionality
- [ ] OAuth flow works end-to-end
- [ ] Tokens generated and validated
- [ ] Token refresh works
- [ ] Deep links trigger correctly
- [ ] Rate limiting prevents abuse
- [ ] Sessions persist correctly

### Security
- [ ] HTTPS enforced in production
- [ ] Secure cookies enabled
- [ ] CSRF tokens validated
- [ ] Rate limiting enabled
- [ ] Credentials not logged
- [ ] Tokens expire properly

### Testing
- [ ] All endpoints tested with Postman
- [ ] Error cases handled
- [ ] Edge cases covered
- [ ] Mobile app tested on device
- [ ] Network errors handled

---

## 🆘 Need Help?

### Quick Troubleshooting
[🚨 Troubleshooting Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md#-troubleshooting)

Common issues:
- "Config endpoint returns 500" → [Solution](./MOBILE_AUTH_COMPLETE_GUIDE.md#issue-mobile-config-returns-500-error)
- "OAuth redirect loop" → [Solution](./MOBILE_AUTH_COMPLETE_GUIDE.md#issue-oauth-redirect-loop)
- "Deep link not working" → [Solution](./MOBILE_AUTH_COMPLETE_GUIDE.md#issue-deep-link-not-triggering)
- "JWT token invalid" → [Solution](./MOBILE_AUTH_COMPLETE_GUIDE.md#issue-jwt-token-invalid)

### Detailed Resources
- [Complete Guide - Error Handling](./MOBILE_AUTH_COMPLETE_GUIDE.md#-error-handling)
- [Complete Guide - Troubleshooting](./MOBILE_AUTH_COMPLETE_GUIDE.md#-troubleshooting)
- [Complete Guide - Additional Resources](./MOBILE_AUTH_COMPLETE_GUIDE.md#-additional-resources)

---

## 📊 Key Endpoints Summary

### Configuration
```bash
GET /api/mobile-config
# Returns: replitClientId, backendDomain, apiBaseUrl, deepLinkScheme, scopes
```

### Authentication
```bash
GET /api/mobile-login?platform=native&redirect_uri=ascended://auth/callback
# Returns: 302 redirect to Replit OAuth screen

POST /api/mobile-verify
# Body: { "token": "auth-code-or-jwt" }
# Returns: { success, user }
```

### Token Management
```bash
POST /api/auth/token
# Returns: { token, expiresIn }

POST /api/auth/refresh
# Returns: { token }

GET /api/auth/validate
# Returns: { valid, expiresIn, user }
```

---

## 🌐 Environment URLs

### Development
- **Backend**: `http://localhost:3000`
- **Mobile Dev**: `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev`

### Production
- **Main**: `https://app.ascended.social`
- **Web**: `https://ascended.social`

---

## 👥 Team Resources

### For All Teams
- ✅ [Quick Reference](./MOBILE_AUTH_QUICK_REFERENCE.md) - Bookmark this!
- ✅ Postman Collection - Access via team workspace
- ✅ [Complete Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md) - Full reference

### ClickUp Tasks
All documentation organized in ClickUp under:
- **Space**: Expertit
- **Folder**: Ascended Social - Mobile Development
- **List**: 📚 Mobile API Documentation

8 tasks covering:
1. Complete Auth Workflows Documentation
2. Quick Reference: Mobile Auth API Endpoints
3. Mobile Auth Setup Tutorial (iOS, Android, React Native)
4. Postman Collection: Auth Workflows & Testing
5. Postman Integration & Team Setup Guide
6. Backend Authentication Implementation Checklist
7. Troubleshooting Guide: Common Auth Errors
8. Authentication Architecture & System Design

### Documentation Files
```
docs/
├── MOBILE_AUTH_QUICK_REFERENCE.md          ⭐ START HERE
├── MOBILE_AUTH_COMPLETE_GUIDE.md           Full reference
├── MOBILE_AUTH_SETUP_TUTORIAL.md           Code examples
├── AUTH_DOCUMENTATION_README.md            This file
└── API_REFERENCE_AUTH.md                   (Optional detailed specs)
```

---

## 🚀 Getting Started Now

### Option 1: 5-Minute Quick Start
1. Open [MOBILE_AUTH_QUICK_REFERENCE.md](./MOBILE_AUTH_QUICK_REFERENCE.md)
2. Copy endpoint for your platform
3. Test with curl or Postman
4. **Total**: 5 minutes

### Option 2: Full Implementation (2-4 hours)
1. Review [MOBILE_AUTH_QUICK_REFERENCE.md](./MOBILE_AUTH_QUICK_REFERENCE.md) - 5 min
2. Follow [MOBILE_AUTH_SETUP_TUTORIAL.md](./MOBILE_AUTH_SETUP_TUTORIAL.md) - 1-2 hours
3. Test with Postman collection - 30 min
4. Integrate with app - 1-2 hours

### Option 3: Deep Dive (Full day)
1. Read [MOBILE_AUTH_COMPLETE_GUIDE.md](./MOBILE_AUTH_COMPLETE_GUIDE.md) - 1 hour
2. Follow tutorial for your platform - 2 hours
3. Test all endpoints - 1 hour
4. Integration & debugging - 2-3 hours

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 2026 | Initial production release |

---

## 📞 Contact & Support

For issues not covered in documentation:
1. Check [Troubleshooting Guide](./MOBILE_AUTH_COMPLETE_GUIDE.md#-troubleshooting)
2. Review [Error Handling](./MOBILE_AUTH_COMPLETE_GUIDE.md#-error-handling)
3. Check server logs: `npm run logs:all`
4. Test endpoint with Postman
5. Include error logs when asking for help

---

**Last Updated**: February 2026  
**Status**: ✅ Production Ready  
**Maintained By**: Development Team

🎉 **Ready to go!** Start with [MOBILE_AUTH_QUICK_REFERENCE.md](./MOBILE_AUTH_QUICK_REFERENCE.md)
