# 📱 Quick Reference: Mobile Auth API Endpoints

## Base URLs

- **Development**: `http://localhost:3000`
- **Mobile Dev Server**: `https://f9f72fa6-d1fb-425c-b9c8-6acf959c3a51-00-2v7zngs8czufl.riker.replit.dev`
- **Production**: `https://app.ascended.social`

---

## 🎯 Core Endpoints

### 1. Mobile Configuration
```
GET /api/mobile-config
```
Returns: OAuth client ID, API base URL, deep link scheme, supported scopes

**Use When**: Initializing app, setting up OAuth

---

### 2. Health Check
```
GET /api/mobile-config/health
```
Returns: Configuration status (healthy/degraded)

**Use When**: Verifying backend setup

---

### 3. Mobile Login (OAuth Initiation)
```
GET /api/mobile-login?platform=native&redirect_uri=<uri>
```
Returns: 302 redirect to Replit Auth

**Parameters**:
- `platform`: `native` or `web`
- `redirect_uri`: App callback URI

**Use When**: User clicks login button

---

### 4. Mobile Token Verification
```
POST /api/mobile-verify
Content-Type: application/json

{
  "token": "JWT_TOKEN"
}
```
Returns: User data if token valid

**Use When**: Processing OAuth callback

---

### 5. Generate JWT Token
```
POST /api/auth/token
Content-Type: application/json

{
  "userId": "user-id",
  "email": "user@example.com"
}
```
Returns: JWT token with 7-day expiry

**Use When**: Creating fresh token for user

---

### 6. Refresh JWT Token
```
POST /api/auth/refresh
Authorization: Bearer <token>
```
Returns: New JWT token

**Grace Period**: 5 minutes before expiry

**Use When**: Token expires soon (automatic in most apps)

---

### 7. Validate JWT Token
```
GET /api/auth/validate
Authorization: Bearer <token>
```
Returns: Token validity, expiry time, user data

**Use When**: Checking token before making requests

---

## 🔑 Authorization

All protected endpoints require JWT in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Quick Start Flow

```mermaid
graph LR
    A["1. GET /api/mobile-config"] -->|Get settings| B["2. GET /api/mobile-login"]
    B -->|Oauth screen| C["3. User Authenticates"]
    C -->|Deep link callback| D["4. POST /api/mobile-verify"]
    D -->|JWT token| E["5. Make API Calls"]
    E -->|Authorization: Bearer| F["Protected Resources"]
    F -->|Token expires| G["6. POST /api/auth/refresh"]
    G -->|New token| E
```

---

## 📱 Platform-Specific Callbacks

### iOS Deep Link
```
ascended://auth/callback?code=AUTH_CODE&state=STATE
```

### Android Deep Link
```
ascended://auth/callback?code=AUTH_CODE&state=STATE
```

### Web Wrapper
```
https://mobile-domain.com/auth/callback?code=AUTH_CODE&state=STATE
```

---

## ⚡ Example: Complete Login Flow

### Step 1: Get Config
```bash
curl http://localhost:3000/api/mobile-config
```

### Step 2: Start Login
```bash
open "http://localhost:3000/api/mobile-login?platform=native&redirect_uri=ascended://auth/callback"
```

### Step 3: Handle Callback
When user approves, browser redirects to:
```
ascended://auth/callback?code=abc123&state=xyz789
```

Your app intercepts this and extracts `code`.

### Step 4: Verify Token
```bash
curl -X POST http://localhost:3000/api/mobile-verify \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123"}'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  }
}
```

### Step 5: Store JWT & Make Requests
```bash
# Store token in secure storage
# Make authenticated requests with Authorization header

curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## ✅ Verification Checklist

Before deploying mobile app:

- [ ] Mobile config endpoint responds with correct domains
- [ ] OAuth flow redirects to Replit auth
- [ ] Deep link scheme is registered in app
- [ ] Deep link callback is intercepted
- [ ] Token verification returns user data
- [ ] JWT tokens work in Authorization header
- [ ] Token refresh extends validity
- [ ] Expired tokens are rejected (401)
- [ ] Rate limiting works (429 after 10 attempts)
- [ ] Error messages are user-friendly

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Config endpoint returns 500" | Check REPL_ID env var |
| "OAuth redirect loop" | Clear cookies, check SESSION_SECRET |
| "Deep link not opening" | Verify scheme in app manifest |
| "Token verification fails" | Check Bearer format, token not expired |
| "Rate limited too quickly" | Rate limit is per IP+UserAgent |

---

## 📖 Full Documentation

For complete guide with code examples, see: [MOBILE_AUTH_COMPLETE_GUIDE.md](./MOBILE_AUTH_COMPLETE_GUIDE.md)

For API testing: Download **Ascended Social - Auth Workflows** Postman collection
