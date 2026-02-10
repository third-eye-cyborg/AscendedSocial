# Postman Architecture & Design Patterns
## Enterprise API Testing & Integration Standards

**Document Version**: 1.0  
**Audience**: Engineers, QA, DevOps, API Owners  
**Purpose**: Define technical standards and architecture for unified Postman usage

---

## 1. Workspace Architecture

### 1.1 Workspace Design Pattern

```
POSTMAN ACCOUNT (Team: Dan Root)
│
├── Ascended Social (Workspace)
│   ├── Environments (4)
│   ├── Collections (12)
│   ├── Mock Servers (2)
│   └── Monitors (3)
│
├── Techead (Workspace)
│   ├── Environments (4)
│   ├── Collections (6)
│   ├── Mock Servers (1)
│   └── Monitors (2)
│
├── Flaresmith (Workspace)
│   ├── Environments (4)
│   ├── Collections (5)
│   ├── Mock Servers (1)
│   └── Monitors (2)
│
└── Expertit (Workspace)
    ├── Environments (4)
    ├── Collections (5)
    ├── Mock Servers (1)
    └── Monitors (2)
```

### 1.2 Workspace Isolation Strategy

**Principle**: One workspace per project
- Isolates environments and secrets
- Prevents accidental cross-project requests
- Maintains clear ownership
- Scales with project growth

**Benefits**:
- Security: Secrets isolated per project
- Clarity: Team focuses on one project at a time
- Performance: Faster load times
- Management: Easier to maintain and update

---

## 2. Collection Architecture

### 2.1 Collection Design Pattern

**For REST APIs**:
```
Collection: 📱 Ascended Social - Authentication - Mobile Gateway
│
├── 📖 Documentation (Folder)
│   ├── Overview.md (Note)
│   ├── Authentication Flow (Diagram)
│   ├── Error Codes (Reference)
│   └── Code Examples (Note)
│
├── 🔑 Configuration (Folder)
│   ├── PRE: Initialize Auth
│   ├── PRE: Set Constants
│   ├── Helper: Generate JWT
│   └── Helper: Refresh Token
│
├── 🧪 Requests (Folder)
│   ├── POST /auth/login
│   ├── POST /auth/signup
│   ├── POST /auth/logout
│   ├── POST /auth/refresh
│   ├── GET /auth/validate
│   └── POST /auth/revoke
│
├── ✅ Integration Tests (Folder)
│   ├── Signup → Login → Validate
│   ├── Login → Refresh → Logout
│   ├── Invalid Credentials Error
│   └── Token Expiration Flow
│
├── 📊 Performance Tests (Folder)
│   ├── Auth Response Time < 500ms
│   ├── Load Test: 100 logins/min
│   └── Baseline Metrics
│
└── 🐞 Debugging (Folder)
    ├── Debug: Invalid Token
    ├── Debug: Expired Token
    └── Debug: CORS Issues
```

**For GraphQL APIs**:
```
Collection: 📱 Ascended Social - GraphQL - Main API
│
├── 📖 Documentation (Folder)
│   ├── Schema Reference
│   ├── Query Examples
│   ├── Mutation Examples
│   └── Subscription Examples
│
├── 🔑 Configuration (Folder)
│   ├── Auth Header Setup
│   └── Headers & Variables
│
├── 🧪 Queries (Folder)
│   ├── Query: User Profile
│   ├── Query: User Feed
│   ├── Query: Post Details
│   └── Query: Search Posts
│
├── 🧪 Mutations (Folder)
│   ├── Mutation: Create Post
│   ├── Mutation: Update Profile
│   ├── Mutation: Like Post
│   └── Mutation: Comment on Post
│
├── 🧪 Subscriptions (Folder)
│   ├── Subscribe: New Comments
│   ├── Subscribe: Feed Updates
│   └── Subscribe: User Activity
│
└── ✅ Integration Tests (Folder)
    ├── Full Query Cycle
    └── Mutation Validation
```

### 2.2 Request Organization

**Rules**:
1. Group by resource (users, posts, comments)
2. Order by HTTP verb (GET, POST, PUT, DELETE)
3. Name clearly: `{METHOD} {Resource} - {Action} - {Notes}`

**Example - Users Resource**:
```
GET /users
├── GET /users - List all users
├── GET /users/{id} - Get single user
├── GET /users/{id}/profile - Get profile
├── GET /users/{id}/posts - Get user posts
│
POST /users
├── POST /users - Create user (signup)
├── POST /users/{id}/follow - Follow user
├── POST /users/{id}/block - Block user
│
PUT /users
├── PUT /users/{id} - Update user
├── PUT /users/{id}/password - Change password
├── PUT /users/{id}/settings - Update settings
│
DELETE /users
├── DELETE /users/{id} - Delete user
├── DELETE /users/{id}/posts - Delete all posts
└── DELETE /users/{id}/follow - Unfollow user
```

---

## 3. Environment Architecture

### 3.1 Environment Strategy

**Standard Environments**:

| Env | Purpose | Base URL | Auth | Speed | Cost |
|-----|---------|----------|------|-------|------|
| Dev | Development | localhost:3000 | Mock | Fast | Free |
| Staging | QA Testing | staging-api.project | Real | Med | Med |
| Prod | Live Data | api.project | Real | Varies | High |
| Mobile | Mobile Testing | mobile-api.project | Mobile Flow | Varies | High |

### 3.2 Environment Variable Strategy

**Hierarchy**:
```
1. Environment Variables (highest priority)
   - {{base_url}}
   - {{auth_token}}
   - {{user_id}}

2. Collection Variables (medium priority)
   - {{default_timeout}}
   - {{api_version}}

3. Global Variables (lowest priority - avoid)
   - {{shared_constant}}
```

**Essential Variables** (in every environment):

```javascript
// API Configuration
base_url           // http://localhost:3000 or https://api.project.com
api_version        // v1, v2, etc
api_key            // Service API key
api_secret         // Service API secret

// Authentication
auth_token         // JWT or Bearer token
auth_refresh_token // Refresh token for auth renewal
user_id            // Current authenticated user ID
user_email         // Current user email

// Project/Resource IDs
project_id         // Current project being tested
organization_id    // Organization context
workspace_id       // Team/workspace context

// Flags & Configuration
debug_mode         // true/false
log_level          // debug, info, warn, error
timeout            // 5000, request timeout in ms
max_retries        // 3, max retry attempts

// Mobile-Specific (mobile env only)
device_id          // Mobile device identifier
app_version        // Mobile app version
platform           // ios, android, web
```

### 3.3 Secret Management

**Best Practices**:
1. **Never** hardcode secrets in collections
2. **Always** use encrypted environment variables
3. **Rotate** secrets regularly (monthly)
4. **Audit** for exposed secrets (weekly)
5. **Use** Postman Vault when available

**Vault Example**:
```
Vault Secrets:
├── production_api_key
├── production_db_password
├── stripe_secret_key
├── twilio_auth_token
├── openai_api_key
└── oauth_client_secret
```

---

## 4. Pre-request Script Architecture

### 4.1 Pre-request Script Patterns

**Pattern 1: Initialize Request**
```javascript
// Set timestamp for tracing
pm.environment.set("request_timestamp", new Date().toISOString());

// Generate unique request ID
const uuid = require("uuid");
pm.environment.set("request_id", uuid.v4());

// Log details
console.log(`[${pm.environment.get("env_name")}] Request starting...`);
```

**Pattern 2: Dynamic URL Building**
```javascript
// Build URL from environment variables
const baseUrl = pm.environment.get("base_url");
const userId = pm.environment.get("user_id");
const endpoint = `/users/${userId}`;

// Construct full URL
const fullUrl = baseUrl + endpoint;
pm.request.url = fullUrl;

// Save for debugging
pm.environment.set("last_url", fullUrl);
```

**Pattern 3: Auth Token Handling**
```javascript
// Get current auth token
const authToken = pm.environment.get("auth_token");

// Check if token exists
if (!authToken) {
    throw new Error("No auth token found. Run auth collection first.");
}

// Add to headers
pm.request.headers.add({
    key: "Authorization",
    value: `Bearer ${authToken}`
});

// Check if token might be expired (simple check)
const tokenExpiry = pm.environment.get("token_expiry");
const now = Date.now();
if (tokenExpiry && now > tokenExpiry) {
    console.warn("⚠️ Token may be expired. Consider refreshing.");
}
```

**Pattern 4: Request Transformation**
```javascript
// Parse body if needed
const bodyData = JSON.parse(pm.request.body.toString());

// Transform data
bodyData.timestamp = new Date().toISOString();
bodyData.request_id = pm.environment.get("request_id");
bodyData.user_id = pm.environment.get("user_id");

// Update request body
pm.request.body.raw = JSON.stringify(bodyData);
```

**Pattern 5: Rate Limiting Handling**
```javascript
// Check rate limit status from previous request
const remainingRequests = pm.globals.get("rate_limit_remaining");
const resetTime = pm.globals.get("rate_limit_reset");

if (remainingRequests && remainingRequests < 5) {
    console.warn(`⚠️ Rate limit approaching: ${remainingRequests} requests left`);
}

// Add rate limit headers if needed
if (pm.environment.get("include_rate_limit_headers")) {
    pm.request.headers.add({
        key: "X-Rate-Limit-Bypass",
        value: pm.environment.get("rate_limit_bypass_key")
    });
}
```

### 4.2 Collection-Level Pre-request Scripts

```javascript
// This runs BEFORE every request in collection

// 1. Validate environment is set
if (!pm.environment.name) {
    throw new Error("Please select an environment (Dev, Staging, Prod)");
}

// 2. Check auth token freshness
const authToken = pm.environment.get("auth_token");
const tokenRefreshUrl = pm.environment.get("base_url") + "/auth/refresh";

// 3. Add request tracking
pm.request.headers.add({
    key: "X-Collection",
    value: "Ascended Social Mobile Gateway"
});

pm.request.headers.add({
    key: "X-Environment",
    value: pm.environment.name
});

// 4. Log request
console.log(`${pm.request.method} ${pm.request.url}`);
console.log(`Environment: ${pm.environment.name}`);
```

---

## 5. Test Script Architecture

### 5.1 Test Script Patterns

**Pattern 1: Status Code Validation**
```javascript
// Test various status codes
pm.test("Status should be 200 OK", () => {
    pm.response.to.have.status(200);
});

pm.test("Status should be 201 Created", () => {
    pm.response.to.have.status(201);
});

pm.test("Status should be 400 Bad Request", () => {
    pm.response.to.have.status(400);
});

pm.test("Status should be 401 Unauthorized", () => {
    pm.response.to.have.status(401);
});

pm.test("Status should be one of 200, 201, 204", () => {
    pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
});
```

**Pattern 2: Response Header Validation**
```javascript
pm.test("Response has Content-Type: application/json", () => {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response has required security headers", () => {
    pm.response.to.have.header("X-Content-Type-Options");
    pm.response.to.have.header("X-Frame-Options");
    pm.response.to.have.header("Strict-Transport-Security");
});

pm.test("Response time is acceptable", () => {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

**Pattern 3: Response Body Validation**
```javascript
const responseBody = pm.response.json();

pm.test("Response has required fields", () => {
    pm.expect(responseBody).to.have.property("id");
    pm.expect(responseBody).to.have.property("timestamp");
    pm.expect(responseBody).to.have.property("status");
});

pm.test("Response fields have correct types", () => {
    pm.expect(responseBody.id).to.be.a("string");
    pm.expect(responseBody.timestamp).to.be.a("string");
    pm.expect(responseBody.status).to.be.a("string");
});

pm.test("Response data is valid", () => {
    pm.expect(responseBody.id).to.not.be.empty;
    pm.expect(responseBody.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T/);
    pm.expect(["active", "inactive"]).to.include(responseBody.status);
});
```

**Pattern 4: JSON Schema Validation**
```javascript
const schema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "name": { "type": "string" },
        "created_at": { "type": "string", "format": "date-time" }
    },
    "required": ["id", "email", "name"]
};

pm.test("Response matches schema", () => {
    pm.response.to.have.jsonSchema(schema);
});
```

**Pattern 5: Save Values for Next Request**
```javascript
const responseBody = pm.response.json();

// Save for next request
pm.environment.set("user_id", responseBody.id);
pm.environment.set("auth_token", responseBody.token);
pm.environment.set("refresh_token", responseBody.refresh_token);
pm.environment.set("token_expiry", responseBody.expires_at);

// Save for debugging
pm.globals.set("last_response", JSON.stringify(responseBody));

console.log(`✅ Saved user_id: ${responseBody.id}`);
```

**Pattern 6: Error Validation**
```javascript
// Test error responses
pm.test("Error response has standard format", () => {
    const responseBody = pm.response.json();
    pm.expect(responseBody).to.have.property("error");
    pm.expect(responseBody).to.have.property("message");
    pm.expect(responseBody).to.have.property("code");
});

pm.test("Error code is meaningful", () => {
    const responseBody = pm.response.json();
    pm.expect(responseBody.code).to.match(/^E_[A-Z_]+$/);
});
```

### 5.2 Collection-Level Test Scripts

```javascript
// This runs AFTER every request in collection

// 1. Always validate response time
pm.test("Response time < 2 seconds", () => {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// 2. Check for success
if (pm.response.code >= 200 && pm.response.code < 300) {
    console.log("✅ Request successful");
} else if (pm.response.code >= 400) {
    console.error("❌ Request failed");
    console.error(pm.response.text());
}

// 3. Log performance
console.log(`Response time: ${pm.response.responseTime}ms`);

// 4. Track test results
pm.globals.set("last_test_result", {
    status: pm.response.code,
    time: pm.response.responseTime,
    url: pm.request.url,
    timestamp: new Date().toISOString()
});
```

---

## 6. Mock Server Architecture

### 6.1 Mock Server Design

**Use Cases**:
1. Frontend development (no backend needed)
2. Testing error scenarios
3. Performance testing
4. Integration testing before API ready

**Example - Mobile Auth Mock**:
```
Mock Server: Ascended Social Mobile Auth Mock
├── Base URL: https://mock-auth.ascendedsocial.com
├── Enabled: True
├── Default Response: 200 OK
│
├── Response Rules
│   ├── POST /auth/login
│   │   ├── Rule 1: email=valid → 200 with token
│   │   └── Rule 2: email=invalid → 401 error
│   │
│   ├── POST /auth/signup
│   │   ├── Rule 1: all_valid → 201 created
│   │   └── Rule 2: email_exists → 409 conflict
│   │
│   └── POST /auth/logout
│       └── Always: 204 No Content
│
└── Examples
    ├── Success Response (200)
    ├── Error Response (401)
    └── Validation Error (422)
```

### 6.2 Mock Response Examples

```javascript
// Mock Login Response
{
    "id": "user_12345",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_xyz",
    "expires_at": "2026-02-11T06:23:43Z",
    "user": {
        "id": "user_12345",
        "email": "user@example.com",
        "name": "John Doe",
        "avatar": "https://...",
        "aura_level": 5
    }
}

// Mock Signup Response
{
    "id": "user_67890",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "created_at": "2026-02-10T06:23:43Z",
    "verification_required": true,
    "message": "Check email for verification link"
}

// Mock Error Response
{
    "error": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "code": "E_AUTH_INVALID",
    "timestamp": "2026-02-10T06:23:43Z",
    "request_id": "req_abc123"
}
```

---

## 7. Monitor Architecture

### 7.1 Health Check Monitors

**Purpose**: Continuous monitoring of API availability

**Example - Ascended Social Health Monitor**:
```
Monitor: Ascended Social Health Check
├── Schedule: Every 15 minutes
├── Runs per interval: 3
├── Collections to Run: Health Check (5 requests)
│
├── Requests
│   ├── GET /health → expect 200
│   ├── GET /status → expect 200
│   ├── POST /auth/validate → expect 200
│   ├── GET /posts → expect 200
│   └── GET /users/{id} → expect 200
│
├── On Failure
│   ├── Email Alert: ops@company.com
│   ├── Slack: #api-alerts
│   └── PagerDuty: P3 incident
│
├── SLA
│   ├── Uptime Target: 99.9%
│   ├── Response Time Target: < 500ms
│   └── Error Rate Target: < 0.1%
│
└── Dashboard
    ├── Uptime chart
    ├── Response time trend
    └── Alert history
```

---

## 8. API Testing Patterns

### 8.1 CRUD Testing Pattern

```
Collection Flow: User Management CRUD
│
├── CREATE
│   ├── POST /users - Create user
│   ├── Assertions: 201 status, ID returned
│   ├── Save: user_id for next requests
│   │
│   └── POST /users - Duplicate - expect 409
│
├── READ
│   ├── GET /users/{id} - Get single user
│   ├── Assertions: 200 status, correct user returned
│   │
│   └── GET /users/{id} - Invalid ID - expect 404
│
├── UPDATE
│   ├── PUT /users/{id} - Update user
│   ├── Assertions: 200 status, fields updated
│   │
│   ├── PUT /users/{id} - Partial update - PATCH
│   │
│   └── PUT /users/{id} - Invalid data - expect 400
│
└── DELETE
    ├── DELETE /users/{id} - Delete user
    ├── Assertions: 204 status
    │
    └── DELETE /users/{id} - Already deleted - expect 404
```

### 8.2 Authentication Flow Testing

```
Collection Flow: Authentication Lifecycle
│
├── 1. Register New User
│   ├── POST /auth/signup
│   ├── Response: user_id, verification_required
│   └── Save: user_email for verification
│
├── 2. Verify Email
│   ├── GET /auth/verify?token={verification_token}
│   ├── Response: verified message
│   └── Save: verification status
│
├── 3. Login
│   ├── POST /auth/login
│   ├── Response: auth_token, refresh_token
│   └── Save: auth_token for authenticated requests
│
├── 4. Make Authenticated Request
│   ├── GET /users/me
│   ├── Headers: Authorization: Bearer {{auth_token}}
│   └── Response: current user data
│
├── 5. Refresh Token
│   ├── POST /auth/refresh
│   ├── Body: refresh_token
│   ├── Response: new auth_token
│   └── Save: updated auth_token
│
├── 6. Validate Session
│   ├── GET /auth/validate
│   ├── Headers: Authorization: Bearer {{auth_token}}
│   └── Response: valid/invalid
│
└── 7. Logout
    ├── POST /auth/logout
    ├── Response: logout message
    └── Cleanup: clear tokens
```

---

## 9. Performance Testing Patterns

### 9.1 Load Test Configuration

```
Collection: Performance - Load Testing

├── Setup: Create test data
│   ├── Create 100 test users
│   ├── Create 1000 test posts
│   └── Setup test auth tokens
│
├── Load Test: Sustained load
│   ├── 100 concurrent requests
│   ├── 10 requests per user
│   ├── Monitor response times
│   ├── Measure throughput
│   └── Track error rates
│
├── Spike Test: Sudden spike
│   ├── Normal: 10 req/sec
│   ├── Spike: 100 req/sec for 30 sec
│   ├── Monitor recovery
│   └── Check for cascading failures
│
├── Stress Test: Breaking point
│   ├── Gradually increase load
│   ├── Until performance degrades
│   ├── Identify breaking point
│   └── Document results
│
└── Results
    ├── Avg response time: 150ms
    ├── P95 response time: 300ms
    ├── P99 response time: 500ms
    ├── Throughput: 500 req/sec
    └── Error rate: < 0.1%
```

---

## 10. Best Practices Checklist

### Collection Creation
- [ ] Follow naming convention
- [ ] Add description
- [ ] Organize in folders
- [ ] Add documentation
- [ ] Configure for all environments
- [ ] Include examples
- [ ] Add pre-request scripts
- [ ] Add test scripts

### Request Creation
- [ ] Name clearly
- [ ] Document purpose
- [ ] Use variables (no hardcoding)
- [ ] Add description
- [ ] Include examples
- [ ] Pre-request scripts
- [ ] Test scripts
- [ ] Save responses

### Environment Configuration
- [ ] Set base_url
- [ ] Add all variables
- [ ] Encrypt secrets
- [ ] Test with sample request
- [ ] Document variables
- [ ] Share with team
- [ ] Validate before use

### Testing Standards
- [ ] 100% of requests have tests
- [ ] Test status codes
- [ ] Test response structure
- [ ] Test data validation
- [ ] Test error scenarios
- [ ] Save values for workflow
- [ ] Log for debugging
- [ ] Performance assertions

---

**Document**: POSTMAN_ARCHITECTURE_GUIDE.md  
**Version**: 1.0  
**Status**: Active  
**Last Updated**: February 10, 2026
