# 📱 Ascended Social - Mobile Authentication Complete Guide

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready

---

## 📑 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication Architecture](#authentication-architecture)
3. [Configuration & Setup](#configuration--setup)
4. [Web OAuth Flow](#web-oauth-flow)
5. [Mobile Native Flow](#mobile-native-flow)
6. [JWT Token Management](#jwt-token-management)
7. [Deep Linking](#deep-linking)
8. [Error Handling](#error-handling)
9. [Testing & Debugging](#testing--debugging)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Initialize Mobile App

```bash
# First request: Get mobile configuration
GET /api/mobile-config

# Response includes:
{
  "replitClientId": "your-client-id",
  "backendDomain": "https://your-backend.com",
  "apiBaseUrl": "https://your-backend.com/api",
  "deepLinkScheme": "ascended://",
  "scopes": ["openid", "email", "profile"],
  "features": {
    "deepLinking": true,
    "webFallback": true,
    "tokenRefresh": true
  }
}
```

### 2. Start Authentication Flow

```bash
# Redirect user to native login
GET /api/mobile-login?platform=native&redirect_uri=ascended://auth/callback

# For web wrapper apps
GET /api/mobile-login?platform=web&redirect_uri=https://your-mobile-domain.com/auth/callback
```

### 3. Handle Callback

After successful Replit authentication, the system redirects to your callback URI with authorization code:

```
ascended://auth/callback?code=AUTH_CODE&state=STATE_VALUE
```

### 4. Exchange Code for JWT Token

```bash
POST /api/mobile-verify
Content-Type: application/json

{
  "token": "JWT_FROM_SESSION"
}

# Response
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

## 🏗️ Authentication Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                  Mobile/Web Application                      │
│  (iOS, Android, React Native, Flutter, Next.js, SvelteKit)  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │  Deep Links / Web URLs    │
         │ ascended://auth/callback  │
         │ https://mobile.app.com    │
         └────────────┬──────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────┐
    │   Ascended Social Backend API       │
    │ /api/mobile-config                  │
    │ /api/mobile-login                   │
    │ /api/mobile-verify                  │
    │ /auth/callback                      │
    └────────────┬────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │  Replit Auth / OpenID Connect        │
    │  (OAuth 2.0 Authorization Server)   │
    └─────────────────────────────────────┘
```

### Authentication Methods

| Method | Use Case | Token Type | Session |
|--------|----------|-----------|---------|
| **Web OAuth** | Web apps, server-side rendering | Session Cookie | PostgreSQL Store |
| **Mobile Native** | iOS/Android apps | JWT + Deep Link | In-app memory |
| **Mobile Web** | Web wrapper, hybrid apps | JWT + Cookie | Hybrid |

---

## ⚙️ Configuration & Setup

### Environment Variables

Required environment variables on backend:

```bash
# Replit OAuth Configuration
REPL_ID=your-replit-client-id
ISSUER_URL=https://replit.com/oidc
SESSION_SECRET=your-session-secret-key

# Database
DATABASE_URL=postgresql://...

# Domains
WEB_APP_DOMAIN=ascended.social
MOBILE_DEV_DOMAIN=https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev
MOBILE_PROD_DOMAIN=https://app.ascended.social

# Security
TURNSTILE_SECRET_KEY=your-turnstile-secret

# Node Environment
NODE_ENV=production
```

### Step 1: Get Mobile Configuration

**Request:**
```bash
curl -X GET http://localhost:3000/api/mobile-config \
  -H "Accept: application/json"
```

**Response (200 OK):**
```json
{
  "replitClientId": "2b3f9e5c-1234-5678-9abc-def012345678",
  "backendDomain": "http://localhost:3000",
  "webAppDomain": "ascended.social",
  "mobileDevDomain": "https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev",
  "mobileProdDomain": "https://app.ascended.social",
  "deepLinkScheme": "ascended://",
  "apiBaseUrl": "http://localhost:3000/api",
  "issuerUrl": "https://replit.com/oidc",
  "scopes": ["openid", "email", "profile"],
  "version": "1.0.0",
  "features": {
    "deepLinking": true,
    "webFallback": true,
    "tokenRefresh": true,
    "platformDetection": true
  }
}
```

### Step 2: Verify Configuration Health

**Request:**
```bash
curl -X GET http://localhost:3000/api/mobile-config/health \
  -H "Accept: application/json"
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Mobile configuration is valid",
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

---

## 🌐 Web OAuth Flow

For traditional web applications (Next.js, SvelteKit, Remix, etc.)

### Flow Diagram

```
┌──────────────┐
│ Web Browser  │
└──────┬───────┘
       │ 1. Click "Login"
       ▼
┌──────────────────────────┐
│ Backend Server           │
│ GET /api/login           │
└──────┬───────────────────┘
       │ 2. Redirect to Replit
       ▼
┌──────────────────────────┐
│ Replit Auth              │
│ OAuth Consent Screen     │
└──────┬───────────────────┘
       │ 3. User authenticates
       │ 4. Redirects with code
       ▼
┌──────────────────────────────┐
│ Backend Server               │
│ GET /auth/callback?code=...  │
│ - Validates code             │
│ - Creates session            │
│ - Sets cookie                │
└──────┬───────────────────────┘
       │ 5. Redirect to app
       ▼
┌──────────────┐
│ Authenticated│
│ Web App      │
└──────────────┘
```

### Implementation Steps

**Step 1: User Clicks Login**
```html
<a href="/api/login">Login with Replit</a>
```

**Step 2: Start OAuth (Backend)**
```bash
# GET /api/login
# Returns 302 redirect to Replit Auth
```

**Step 3: User Authenticates (Replit Auth)**
- User logs in with Replit credentials
- Approves permission scopes
- Redirected back to callback

**Step 4: Handle Callback (Backend)**
```bash
# GET /auth/callback?code=AUTH_CODE&state=STATE
# Backend:
# 1. Validates state parameter
# 2. Exchanges code for tokens
# 3. Creates user in database
# 4. Establishes session
# 5. Redirects to dashboard
```

**Step 5: Access Protected Content**
```bash
# Browser automatically sends session cookie
GET /api/user
Cookie: connect.sid=session_id_here

# Returns authenticated user data
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Session Management

Sessions are stored in PostgreSQL with:
- **TTL**: 7 days
- **Storage**: `sessions` table
- **Secure Cookies**: HttpOnly, Secure (in production)
- **CSRF Protection**: Built-in with express-session

---

## 📱 Mobile Native Flow

For native iOS, Android, and React Native applications

### Flow Diagram

```
┌──────────────────┐
│ Mobile App       │
│ (iOS/Android)    │
└────────┬─────────┘
         │ 1. Get config
         ▼
    GET /api/mobile-config
         │
         │ 2. Start auth
         ▼
    GET /api/mobile-login?platform=native
         │ Returns 302 redirect
         ▼
    ┌────────────────────────┐
    │ Replit Auth in Browser │
    │ (OAuth Screen)         │
    └────────┬───────────────┘
             │ 3. User authenticates
             │
             ▼
    ┌────────────────────────────┐
    │ Deep Link Callback         │
    │ ascended://auth/callback   │
    │ ?code=...&state=...        │
    └────────┬───────────────────┘
             │ 4. Mobile app intercepts
             │
             ▼
    ┌────────────────────────────┐
    │ App Backend Handler        │
    │ POST /api/mobile-verify    │
    │ Validate auth code         │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ JWT Token Generated        │
    │ Stored in app secure       │
    │ storage                    │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Authenticated Mobile App   │
    │ API calls with Bearer token│
    └────────────────────────────┘
```

### Mobile Native Implementation

#### 1. Initialize Mobile App

```swift
// iOS Example (Swift)

class AuthManager {
    func initializeAuth() async {
        let config = try await getConfig()
        
        UserDefaults.standard.set(config.apiBaseUrl, forKey: "apiBaseUrl")
        UserDefaults.standard.set(config.deepLinkScheme, forKey: "deepLinkScheme")
    }
    
    func getConfig() async throws -> MobileConfig {
        let url = URL(string: "http://backend.local:3000/api/mobile-config")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(MobileConfig.self, from: data)
    }
}
```

#### 2. Start Login Flow

```swift
// iOS Example

func startMobileLogin() async {
    let platform = "native"
    let redirectUri = "ascended://auth/callback"
    
    let loginUrl = "http://backend.local:3000/api/mobile-login?platform=\(platform)&redirect_uri=\(redirectUri)"
    
    if let url = URL(string: loginUrl) {
        UIApplication.shared.open(url)
    }
}
```

#### 3. Handle Deep Link Callback

```swift
// SceneDelegate or AppDelegate

func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL,
          let components = URLComponents(url: url, resolvingAgainstBaseURL: true) else { return }
    
    if components.scheme == "ascended" && components.host == "auth" {
        // Extract auth code from URL
        if let code = components.queryItems?.first(where: { $0.name == "code" })?.value {
            Task {
                await verifyMobileToken(code: code)
            }
        }
    }
}
```

#### 4. Verify Token and Store JWT

```swift
// Mobile App Token Verification

func verifyMobileToken(code: String) async {
    let backendUrl = UserDefaults.standard.string(forKey: "apiBaseUrl") ?? "http://localhost:3000/api"
    let url = URL(string: "\(backendUrl)/mobile-verify")!
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["token": code]
    request.httpBody = try JSONSerialization.data(withJSONObject: body)
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
        let result = try JSONDecoder().decode(TokenResponse.self, from: data)
        
        // Store JWT token securely
        try KeychainManager.store(token: result.token, service: "ascended.social")
        
        // Save user data
        UserDefaults.standard.set(result.user.id, forKey: "userId")
        UserDefaults.standard.set(result.user.email, forKey: "userEmail")
    }
}
```

#### 5. Make Authenticated API Calls

```swift
// Using JWT Token in Requests

func makeAuthenticatedRequest(endpoint: String) async throws {
    let baseUrl = UserDefaults.standard.string(forKey: "apiBaseUrl") ?? "http://localhost:3000/api"
    let url = URL(string: "\(baseUrl)\(endpoint)")!
    
    var request = URLRequest(url: url)
    
    // Get token from secure storage
    let token = try KeychainManager.retrieve(service: "ascended.social")
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    if let httpResponse = response as? HTTPURLResponse {
        if httpResponse.statusCode == 401 {
            // Token expired, refresh
            try await refreshToken()
        }
    }
    
    return data
}
```

### Android/Kotlin Implementation

```kotlin
// Android Example (Kotlin)

class AuthManager(val context: Context) {
    
    suspend fun getConfig(): MobileConfig {
        return withContext(Dispatchers.IO) {
            val response = HttpClient().get<String>("http://backend.local:3000/api/mobile-config")
            Json.decodeFromString(response)
        }
    }
    
    fun startMobileLogin() {
        val platform = "native"
        val redirectUri = "ascended://auth/callback"
        val loginUrl = "http://backend.local:3000/api/mobile-login?platform=$platform&redirect_uri=$redirectUri"
        
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(loginUrl))
        context.startActivity(intent)
    }
    
    suspend fun verifyToken(code: String): AuthResponse {
        val client = HttpClient()
        return client.post("http://backend.local:3000/api/mobile-verify") {
            contentType(ContentType.Application.Json)
            setBody("""{"token": "$code"}""")
        }
    }
}
```

### React Native Implementation

```typescript
// React Native Example (TypeScript)

import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export class AuthService {
  async getConfig() {
    const response = await fetch('http://backend.local:3000/api/mobile-config');
    return await response.json();
  }

  async startMobileLogin() {
    const platform = 'native';
    const redirectUri = 'ascended://auth/callback';
    const loginUrl = `http://backend.local:3000/api/mobile-login?platform=${platform}&redirect_uri=${redirectUri}`;
    
    await Linking.openURL(loginUrl);
  }

  async verifyToken(code: string) {
    const response = await fetch('http://backend.local:3000/api/mobile-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: code })
    });
    
    const data = await response.json();
    
    // Store token securely
    await SecureStore.setItemAsync('authToken', data.token);
    await SecureStore.setItemAsync('userId', data.user.id);
    
    return data;
  }

  async makeAuthenticatedRequest(endpoint: string) {
    const token = await SecureStore.getItemAsync('authToken');
    
    const response = await fetch(`http://backend.local:3000/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 401) {
      // Refresh token
      await this.refreshToken();
    }
    
    return await response.json();
  }
}
```

---

## 🎫 JWT Token Management

### Token Structure

JWT tokens are three Base64-encoded parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJodHRwczovL2FzY2VuZGVkLnNvY2lhbCIsInN1YiI6InVzZXItMTIzIn0.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

│ Header (Algorithm)        │ Payload (Claims)           │ Signature        │
```

### Token Payload

```json
{
  "iss": "ascended.social",
  "sub": "user-123",
  "aud": "mobile-app",
  "exp": 1707734400,
  "iat": 1707130000,
  "userId": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profileImageUrl": "https://..."
}
```

### Token Claims

| Claim | Type | Note |
|-------|------|------|
| `iss` | string | Token issuer |
| `sub` | string | Subject (user ID) |
| `aud` | string | Audience |
| `exp` | integer | Expiration time (Unix timestamp) |
| `iat` | integer | Issued at (Unix timestamp) |
| `userId` | string | User ID |
| `email` | string | User email |
| `firstName` | string | First name |
| `lastName` | string | Last name |

### Token Lifecycle

```
1. USER LOGS IN
   ↓
2. BACKEND CREATES JWT
   - Expires in 7 days
   - Includes user claims
   ↓
3. MOBILE APP STORES TOKEN
   - Secure storage / Keychain
   - Memory cache
   ↓
4. MOBILE APP USES TOKEN
   - Includes in Authorization header
   - Authorization: Bearer <token>
   ↓
5. TOKEN NEARS EXPIRY (within 5 mins)
   - Mobile app calls /api/auth/refresh
   ↓
6. BACKEND ISSUES NEW TOKEN
   - Previous token invalidated
   ↓
7. MOBILE APP UPDATES TOKEN
   - Automatic refresh
   ↓
8. TOKEN EXPIRES
   - User must re-authenticate
```

### Generate JWT Token

**Endpoint**: `POST /api/auth/token`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "email": "user@example.com"}'
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Refresh JWT Token

**Endpoint**: `POST /api/auth/refresh`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer eyJhbGc..."
```

**Grace Period**: 5 minutes before expiry

**Response (200 OK):**
```json
{
  "token": "eyJhbGc...",
  "expiresIn": 604800
}
```

### Validate JWT Token

**Endpoint**: `GET /api/auth/validate`

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/validate \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK):**
```json
{
  "valid": true,
  "expiresIn": 86400,
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid or expired token"
}
```

### Using JWT in API Requests

All authenticated API requests must include JWT in Authorization header:

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔗 Deep Linking

### Deep Link URI Scheme

**Ascended Social Uses**: `ascended://`

**Example Deep Links**:
```
ascended://auth/callback?code=AUTH_CODE&state=STATE
ascended://user/profile/user-123
ascended://post/post-id
ascended://search?query=meditation
```

### Registering Deep Links

#### iOS (Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLScheme</key>
    <string>ascended</string>
    <key>CFBundleURLName</key>
    <string>com.ascended.social</string>
  </dict>
</array>
```

#### iOS (SceneDelegate)

```swift
func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       let url = userActivity.webpageURL {
        handleDeepLink(url: url)
    }
}

private func handleDeepLink(url: URL) {
    guard url.scheme == "ascended" else { return }
    
    switch url.host {
    case "auth":
        if let code = url.queryItem(name: "code") {
            // Handle auth callback
        }
    case "user":
        if let userId = url.lastPathComponent as? String {
            // Navigate to user profile
        }
    case "post":
        if let postId = url.lastPathComponent as? String {
            // Navigate to post
        }
    default:
        break
    }
}
```

#### Android (AndroidManifest.xml)

```xml
<activity
    android:name=".DeepLinkActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="ascended"
            android:host="auth" />
        <data
            android:scheme="ascended"
            android:host="user" />
    </intent-filter>
</activity>
```

#### Android (Activity Handler)

```kotlin
class DeepLinkActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val intent = intent
        val uri = intent.data
        
        when (uri?.host) {
            "auth" -> handleAuthCallback(uri)
            "user" -> handleUserProfile(uri)
            "post" -> handlePost(uri)
        }
    }
    
    private fun handleAuthCallback(uri: Uri) {
        val code = uri.getQueryParameter("code")
        val authManager = AuthManager(this)
        authManager.verifyToken(code)
    }
}
```

#### React Native

```typescript
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

export async function setupDeepLinking() {
  // Handle deep links from app closed state
  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    handleDeepLink(initialUrl);
  }
  
  // Handle deep links when app is open
  Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });
}

function handleDeepLink(url: string) {
  const parsed = new URL(url);
  
  if (parsed.protocol === 'ascended:') {
    switch (parsed.hostname) {
      case 'auth':
        const code = parsed.searchParams.get('code');
        handleAuthCallback(code!);
        break;
      case 'user':
        const userId = parsed.pathname.split('/')[2];
        navigateToProfile(userId);
        break;
      case 'post':
        const postId = parsed.pathname.split('/')[2];
        navigateToPost(postId);
        break;
    }
  }
}
```

### AASA (Apple App Site Association)

For iOS universal links, create `.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.ascended.social",
        "paths": ["/auth/callback", "/user/*", "/post/*"]
      }
    ]
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 302 | Redirect | Follow redirect |
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Re-authenticate |
| 403 | Forbidden | Check permissions |
| 429 | Rate Limited | Retry after delay |
| 500 | Server Error | Retry with backoff |

### Common Error Responses

#### Invalid Token

```json
{
  "success": false,
  "error": "No token provided"
}
```

**Action**: Get new token from auth flow

#### Expired Token

```json
{
  "success": false,
  "error": "Token expired"
}
```

**Action**: Call `/api/auth/refresh` or re-authenticate

#### Invalid Mobile Config

```json
{
  "status": "degraded",
  "message": "Mobile configuration is missing required variables"
}
```

**Action**: Check environment variables on backend

#### Rate Limit Exceeded

```json
{
  "error": "Too many authentication attempts",
  "message": "Please wait before trying again",
  "retryAfter": 300
}
```

**Action**: Wait `retryAfter` seconds before retrying

### Error Handling in Mobile Code

```typescript
async function makeAuthenticatedRequest(endpoint: string) {
  try {
    const token = await getStoredToken();
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    switch (response.status) {
      case 200:
        return await response.json();
      
      case 401:
        // Token expired or invalid
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry request with new token
          return makeAuthenticatedRequest(endpoint);
        } else {
          // Redirect to login
          navigateToLogin();
        }
        break;
      
      case 429:
        // Rate limited
        const retryAfter = response.headers.get('Retry-After') || '60';
        showError(`Too many requests. Wait ${retryAfter} seconds.`);
        break;
      
      case 500:
        // Server error - retry with backoff
        await exponentialBackoffRetry(() => 
          makeAuthenticatedRequest(endpoint)
        );
        break;
    }
  } catch (error) {
    console.error('Request failed:', error);
    showError('Network error. Please check connection.');
  }
}
```

---

## 🧪 Testing & Debugging

### Postman Collection

A complete Postman collection is available in the workspace:

**Location**: `Ascended Social - Authentication Workflows`

**Environments**:
- `Development` - Local and dev servers
- `Production` - Production endpoints

### Manual Testing Checklist

- [ ] Mobile config endpoint returns valid config
- [ ] Mobile config health check returns healthy status
- [ ] Mobile login redirects to Replit auth
- [ ] Deep link callback properly parsed
- [ ] JWT token generated successfully
- [ ] Token validation works
- [ ] Token refresh extends expiry
- [ ] Expired tokens properly rejected
- [ ] Rate limiting triggers after 10 attempts
- [ ] Rate limiting resets after 15 minutes

### Debug Logging

Enable debug logging in mobile app:

```typescript
// TypeScript/JavaScript
const DEBUG = true;

function logAuth(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[AUTH] ${message}`, data || '');
  }
}

// Usage
logAuth('Token obtained:', { expiresIn: token.exp });
logAuth('Making request to:', endpoint);
logAuth('Response status:', response.status);
```

### Browser DevTools

For web-based testing:

1. **Application Tab**:
   - View session cookies
   - Check stored token values
   - Verify CORS headers

2. **Network Tab**:
   - Check all auth requests
   - Verify redirects
   - Monitor token refresh calls

3. **Console Tab**:
   - Set custom auth values
   - Test token validation
   - Monitor for security warnings

```javascript
// Console commands for testing
// Check stored token
console.log(localStorage.getItem('authToken'));

// Set test token
localStorage.setItem('authToken', 'test-jwt-token');

// Monitor API calls
fetch('/api/user', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
}).then(r => r.json()).then(console.log);
```

### Monitoring Production

For production deployments:

1. **Monitor Auth Endpoints**:
   ```bash
   # Check login success rate
   # Monitor failed token validations
   # Track rate limit triggers
   ```

2. **Log Key Events**:
   - User login
   - Token refresh
   - Token expiry
   - Authentication failures

3. **Set Alerts**:
   - High rate limit trigger count
   - Increased failed auth attempts
   - Token validation failures

---

## 🔧 Troubleshooting

### Issue: Mobile Config Returns 500 Error

**Symptoms**:
```
GET /api/mobile-config → 500 Internal Server Error
```

**Solutions**:
1. Check backend logs: `npm run logs:all`
2. Verify `REPL_ID` environment variable is set
3. Check database connection: `npm run db:push`
4. Restart server: `npm run dev`

### Issue: OAuth Redirect Loop

**Symptoms**:
- Redirecting between login page and Replit repeatedly
- Session not being created

**Solutions**:
1. Clear browser cookies for the domain
2. Check `SESSION_SECRET` is set
3. Verify database sessions table exists
4. Check Replit credentials are correct

### Issue: Deep Link Not Triggering

**Symptoms**:
- `ascended://` links not opening app
- Auth callback not being intercepted

**Solutions**:

**iOS**:
1. Verify `CFBundleURLScheme` in Info.plist
2. Ensure SceneDelegate implements `continue(_:)`
3. Check app is installed (not just running in simulator)

**Android**:
1. Verify deep link intent filter in AndroidManifest.xml
2. Ensure activity implements proper intent handling
3. Test with: `adb shell am start -W -a android.intent.action.VIEW -d "ascended://auth/callback" com.ascended.social`

### Issue: JWT Token Invalid

**Symptoms**:
```json
{
  "error": "Invalid token payload"
}
```

**Solutions**:
1. Verify token includes `userId` claim
2. Check token signature matches `SESSION_SECRET`
3. Verify token not expired (8 days old)
4. Check Bearer authorization format: `Bearer <token>`

### Issue: Rate Limiting Triggered Incorrectly

**Symptoms**:
- Getting 429 errors after few auth attempts
- Other users experiencing rate limits

**Solutions**:
1. Rate limits are per IP+UserAgent
2. Check if behind shared proxy/NAT
3. Verify Cloudflare rate limiting configured
4. Check auth attempt tracking in database

### Issue: Mobile App Can't Connect to Backend

**Symptoms**:
- Network errors from mobile app
- CORS errors in browser console

**Solutions**:
1. Verify `backendDomain` in mobile config
2. Check CORS headers on backend
3. Test with curl: `curl -i http://backend-domain/api/mobile-config`
4. Verify firewall/network rules
5. Check mobile app is using correct domain

### Getting Help

If you're still having issues:

1. **Check Logs**: `npm run logs:all`
2. **Use Postman**: Test endpoints with provided collection
3. **Debug with Browser**: Use DevTools to inspect requests
4. **Read Error Messages**: Stack traces include helpful context
5. **Contact Support**: Include error logs and curl reproduction steps

---

## 📚 Additional Resources

- [Replit Auth Documentation](https://docs.replit.com/auth/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [JWT (JSON Web Tokens) Guide](https://tools.ietf.org/html/rfc7519)
- [Deep Linking Best Practices](https://developer.apple.com/documentation/uikit/universal_links)
- [Express.js Session Management](https://expressjs.com/en/resources/middleware/session.html)

---

**Last Updated**: February 2026  
**Version**: 1.0.0 Production Ready
