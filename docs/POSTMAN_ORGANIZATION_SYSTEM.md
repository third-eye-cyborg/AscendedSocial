# Postman Enterprise Organization System
## Third Eye Cyborg LLC - Unified API Testing & Documentation

**Document Version**: 1.0  
**Last Updated**: February 10, 2026  
**Owner**: Technical Architecture Team  
**Audience**: All Engineers, QA, DevOps, Product Managers  

---

## 1. Executive Summary

Your Postman workspace is currently fragmented across **9 separate workspaces** with collections scattered and duplicated. This document establishes a **unified Postman organization system** that ensures:

- **Consistency**: Same structure across 4 projects (Ascended Social, Techead, Flaresmith, Expertit)
- **Discoverability**: Any agent can find any API endpoint in < 1 minute
- **Scalability**: Easy to add new APIs, collections, and projects
- **Traceability**: Clear history and versions of all API specifications
- **Collaboration**: Unified environments, shared collections, team-based access

---

## 2. Current State Audit

### Existing Workspaces
```
Total Workspaces: 9
Fragmentation Level: CRITICAL
Collections Across Workspaces: 11 total
Duplicates Detected: Yes (3+ duplicate collections)
Orphaned Collections: Yes (collections with unclear purpose)
```

**Workspace Inventory**:
1. Dan Root's Workspace (empty)
2. Default workspace (personal)
3. ExpertIt (2 collections, duplicate)
4. Third Eye Cyborg Privacy API (2 collections)
5. Expertit Website Integration (0 collections)
6. Ascended Social - Marketing Separation (0 collections)
7. Ascended Social - Consent System (0 collections)
8. Ascended Social - Mobile APIs (6 collections)
9. Ascended Social - Authentication & Mobile Integration (0 collections)

**Issues**:
- ❌ Multiple workspaces for single projects (3 for Ascended Social)
- ❌ No clear naming convention for collections
- ❌ No folder structure within collections (flat organization)
- ❌ Duplicate marketing API collections (appears 3 times)
- ❌ Environments scattered and unshared
- ❌ Pre-request scripts and tests duplicated
- ❌ No team collaboration workflow
- ❌ No versioning strategy

---

## 3. Proposed Architecture

### 3.1 Workspace Structure

**Primary Organization**: Single unified workspace per project (4 total)

```
POSTMAN WORKSPACE
├── Ascended Social (Primary Workspace)
│   ├── Environments
│   │   ├── 🌱 Development
│   │   ├── 🧪 Staging  
│   │   ├── 🚀 Production
│   │   └── 📱 Mobile
│   ├── Collections (Organized by Feature)
│   │   ├── 📚 Admin & Workspace Management
│   │   ├── 🔐 Authentication & Authorization
│   │   ├── 👥 User & Profile APIs
│   │   ├── 📰 Content & Feed APIs
│   │   ├── ✨ Spiritual Features (Oracle, Chakra, Energy)
│   │   ├── 💬 Comments & Engagement APIs
│   │   ├── 📣 Notifications & Messaging
│   │   ├── 📦 Media & Storage APIs
│   │   ├── 🌍 Social & Networking APIs
│   │   ├── 💳 Payments & Subscriptions
│   │   ├── 🛡️ Moderation & Safety APIs
│   │   └── ⚙️ Backend Services & Infrastructure
│   ├── Mock Servers
│   │   ├── Mobile API Mock (for frontend testing)
│   │   └── OAuth Mock (for auth testing)
│   └── Monitors & Automations
│       ├── Health Check Monitor
│       └── Performance Baseline Monitor

├── Techead (Similar Structure)
├── Flaresmith (Similar Structure)
└── Expertit (Similar Structure)
```

### 3.2 Collection Naming Convention

**Format**: `{EMOJI} {Project} - {Feature} - {API Type}`

**Examples**:
```
✅ 📱 Ascended Social - Authentication - Mobile Gateway
✅ 📱 Ascended Social - User Profiles - REST API
✅ 📱 Ascended Social - Spiritual Features - Oracle Readings
✅ 🏗️ Techead - Project Management - Team APIs
✅ ⚒️ Flaresmith - Smithing Tools - Inventory API
✅ 💼 Expertit - Expert Platform - Booking API
```

**Project Emojis**:
- 📱 Ascended Social
- 🏗️ Techead
- ⚒️ Flaresmith  
- 💼 Expertit

**API Type Prefixes**:
- `REST API` - Standard REST endpoints
- `GraphQL API` - GraphQL query interface
- `WebSocket API` - Real-time connections
- `Mobile Gateway` - Mobile-specific endpoints
- `Integration API` - Third-party integrations
- `Admin API` - Admin-only endpoints
- `Public API` - Public-facing endpoints
- `Internal API` - Internal services only

### 3.3 Environment Strategy

**Standard Environments** (per project):

1. **🌱 Development**
   - Local development server
   - Mock data enabled
   - Debug mode ON
   - Base URL: `http://localhost:3000`

2. **🧪 Staging**
   - Staging server
   - Real database (copy)
   - Integration tests enabled
   - Base URL: `https://staging-api.{project}.com`

3. **🚀 Production**
   - Production server
   - Real database
   - Rate limiting enabled
   - Base URL: `https://api.{project}.com`

4. **📱 Mobile**
   - Mobile-specific endpoints
   - Mobile authentication flow
   - Mobile headers configured
   - Base URL: `https://mobile-api.{project}.com`

**Shared Variables** (in each environment):
```
base_url          → Environment-specific URL
api_version       → v1, v2, etc.
auth_token        → Session token
user_id           → Current user ID
project_id        → Current project ID
api_key           → API key for service
timeout           → Request timeout (ms)
debug_mode        → true/false
```

### 3.4 Collection Structure Within Each Collection

**Folders** (within each collection):

```
Collection: 📱 Ascended Social - Authentication - Mobile Gateway
├── 📖 Documentation
│   ├── Overview
│   ├── Authentication Flow Diagram
│   ├── Error Codes Reference
│   └── Code Examples
│
├── 🔑 Setup & Configuration
│   ├── Environment Setup
│   ├── Pre-request Scripts
│   ├── Auth Token Generation
│   └── Test Configuration
│
├── 🧪 Core API Requests
│   ├── Login Endpoint
│   ├── Logout Endpoint
│   ├── Refresh Token
│   ├── Verify Session
│   └── Revoke Token
│
├── ✅ Integration Tests
│   ├── Login + Verify Flow
│   ├── Token Refresh Cycle
│   ├── Session Timeout
│   ├── Invalid Credentials
│   └── Rate Limiting
│
├── 📊 Performance Tests
│   ├── Load Testing Setup
│   ├── Concurrency Tests
│   └── Response Time Baselines
│
└── 🐞 Debugging & Troubleshooting
    ├── Common Issues
    ├── Debug Requests
    └── Support Scripts
```

### 3.5 Request Naming Convention

**Format**: `{METHOD} {RESOURCE} - {ACTION} - {NOTES}`

**Examples**:
```
GET /users/{id} - Fetch Single User - with profile
POST /posts - Create Post - validation required
PUT /posts/{id} - Update Post - chakra field
DELETE /posts/{id} - Delete Post - cascading
PATCH /users/{id}/profile - Update Profile - avatar only
```

### 3.6 Pre-request Script Strategy

**Template**:
```javascript
// Set timestamp
pm.environment.set("timestamp", new Date().toISOString());

// Set request ID for tracing
pm.environment.set("request_id", pm.variables.replaceRecursive("{{$randomUUID}}"));

// Add required headers
pm.request.headers.add({key: "X-Request-ID", value: pm.environment.get("request_id")});
pm.request.headers.add({key: "X-Timestamp", value: pm.environment.get("timestamp")});

// Log request details
console.log(`[${pm.environment.get("env_name")}] ${pm.request.method} ${pm.request.url.toString()}`);

// Validate auth token exists
if (!pm.environment.get("auth_token")) {
    console.warn("⚠️ No auth token found. Run auth collection first.");
}
```

### 3.7 Test Script Strategy

**Template**:
```javascript
// Test 1: Status Code
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

// Test 2: Response Headers
pm.test("Content-Type is JSON", function() {
    pm.response.to.have.header("Content-Type", "application/json");
});

// Test 3: Response Body
pm.test("Response has required fields", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("timestamp");
});

// Test 4: Save variables for next request
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.token);
    pm.environment.set("user_id", jsonData.user_id);
}

// Test 5: Performance
pm.test("Response time is < 500ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test 6: Data validation
pm.test("Email format is valid", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.email).to.match(/^[\w\.-]+@[\w\.-]+\.\w+$/);
});
```

---

## 4. Implementation Strategy

### Phase 1: Consolidation (Week 1)
- [ ] Audit all existing collections and identify duplicates
- [ ] Map which collections belong to which project
- [ ] Create new single workspace structure
- [ ] Migrate collections to new workspace
- [ ] Dedup conflicting collections
- [ ] Archive old fragmented workspaces

### Phase 2: Standardization (Week 2)
- [ ] Rename collections per naming convention
- [ ] Reorganize folder structures within collections
- [ ] Create standard environments per project
- [ ] Create shared pre-request scripts
- [ ] Create shared test scripts
- [ ] Document all environment variables

### Phase 3: Documentation (Week 2)
- [ ] Create API documentation for each collection
- [ ] Add overview notes to each folder
- [ ] Create integration test examples
- [ ] Document authentication flows
- [ ] Create troubleshooting guides

### Phase 4: Automation (Week 3)
- [ ] Create collection runners for CI/CD
- [ ] Set up monitors for health checks
- [ ] Create mock servers for testing frontends
- [ ] Implement API documentation sync
- [ ] Set up automated test runs

### Phase 5: Team Training (Week 3-4)
- [ ] Train team on new structure
- [ ] Establish workflow standards
- [ ] Create agent onboarding guide
- [ ] Share best practices
- [ ] Measure adoption

---

## 5. Project-Specific Guidelines

### 5.1 Ascended Social

**Key Collections**:
1. Authentication & Authorization (Mobile + Web)
2. User & Profile Management
3. Content Creation & Feed
4. Spiritual Features (Oracle, Chakra, Energy)
5. Comments & Reactions
6. Notifications & Messaging
7. Media Upload & Processing
8. Social Interactions (Follow, Block, etc.)
9. Payments & Subscriptions
10. Moderation & Safety
11. Analytics & Admin
12. WebSocket (Real-time updates)

**Special Considerations**:
- Mobile authentication has different flow than web
- Spiritual features require specific database constraints
- Energy system has rate limiting
- Content moderation requires approval workflow
- Real-time features need WebSocket testing

### 5.2 Techead

**Key Collections**:
1. Project Management APIs
2. Team Collaboration APIs
3. Document Management
4. Reporting & Analytics
5. Integration APIs
6. Admin & Settings

**Special Considerations**:
- Project hierarchy (Organization → Project → Team)
- Permission-based access control
- Real-time collaboration (WebSocket)
- Large file handling

### 5.3 Flaresmith

**Key Collections**:
1. Smithing Tool APIs
2. Inventory Management
3. Order Management
4. Crafting Workflow
5. Materials Database
6. Production & Quality

**Special Considerations**:
- Complex workflow states
- Material tracking
- Production scheduling
- Quality assurance validation

### 5.4 Expertit

**Key Collections**:
1. Expert Registration & Profiles
2. Booking & Scheduling
3. Meeting Management
4. Payment Processing
5. Review & Ratings
6. Admin & Moderation

**Special Considerations**:
- Calendar synchronization
- Payment gateway integration
- Real-time availability updates
- Dispute resolution workflow

---

## 6. Shared Resources & Libraries

### 6.1 Pre-request Script Library

Create shared scripts for:
- Authentication (OAuth, JWT, API Key)
- Request ID and correlation tracking
- Timestamp and versioning
- Rate limiting handling
- Proxy configuration
- Device fingerprinting

### 6.2 Test Script Library

Create shared test templates for:
- Status code validation
- JSON schema validation
- Response time assertions
- Data type validation
- Security headers verification
- Error message standardization

### 6.3 Environment Templates

Create template environments for:
- Local development
- Docker container
- Staging environment
- Production environment
- Mobile testing
- Integration testing

---

## 7. Best Practices for Agents

### 7.1 When Creating New Collections

1. **Name** following convention: `{EMOJI} {Project} - {Feature} - {Type}`
2. **Describe** the purpose in collection description
3. **Organize** with logical folder structure
4. **Categorize** requests by endpoint groups
5. **Document** complex flows with notes
6. **Secure** sensitive variables (don't hardcode)
7. **Version** if API version changes

### 7.2 When Adding Requests

1. **Name** clearly: `{METHOD} {Resource} - {Action}`
2. **Describe** what the request does
3. **Tag** with labels (feature, flow, security, etc.)
4. **Organize** in appropriate folder
5. **Configure** for all environments
6. **Test** with pre-request scripts
7. **Validate** with test scripts
8. **Example** include sample responses

### 7.3 When Creating Environments

1. **Base** always set base_url variable
2. **Secure** use encrypted values for secrets
3. **Scope** environment to specific purpose
4. **Version** incrementally (dev → staging → prod)
5. **Document** all variables with descriptions
6. **Share** team environments (don't personal)
7. **Validate** before deployment

### 7.4 When Running Tests

1. **Prepare** ensure environment is set correctly
2. **Understand** what each test validates
3. **Run** in appropriate sequence
4. **Monitor** response and performance
5. **Debug** if test fails using Postman console
6. **Document** results and issues
7. **Follow up** on any anomalies

### 7.5 When Troubleshooting

1. **Verify** environment variables are set
2. **Check** request body and headers
3. **Validate** authentication is current
4. **Review** API documentation for changes
5. **Compare** with working request
6. **Check** logs for server-side errors
7. **Ask** team if unsure

---

## 8. Workflow Examples

### 8.1 Typical Agent Workflow

**Scenario**: Add new endpoint for user profile update

```
1. Navigate to: Ascended Social Workspace
2. Open: 👥 Ascended Social - User Profiles - REST API
3. Find folder: PUT /users/{id}
4. Click: Add New Request
5. Name: PUT /users/{id} - Update Profile
6. Configure:
   - URL: {{base_url}}/users/{{user_id}}
   - Headers: Authorization token
   - Body: JSON with profile fields
   - Pre-request: Add request ID
   - Tests: Validate 200, check response fields
7. Save and document
8. Test with each environment
9. Share with team via collection version
```

### 8.2 Testing a Complete Flow

**Scenario**: Validate authentication → create post → like post flow

```
1. Navigate to: Ascended Social Workspace
2. Run Collection: 🔐 Authentication (get auth token)
3. Run Collection: 📰 Content Creation (create post)
4. Run Request: POST /posts/{id}/likes (like post)
5. Verify each step:
   - Auth returns valid token
   - Post created with correct data
   - Like increments count
6. Run integrated test suite
7. Document results
```

### 8.3 Debugging an API Issue

**Scenario**: User profile endpoint returning 500 error

```
1. Open endpoint: PUT /users/{id}
2. Verify environment is set
3. Check authorization token is valid
4. Test with simple body first
5. Review Postman console for request/response
6. Check server logs (backend)
7. Try alternative payload
8. Compare with similar endpoint
9. Document issue and solution
10. Share findings with team
```

---

## 9. Success Metrics

Track these metrics to measure success:

- **Organization**: 100% of collections follow naming convention
- **Discoverability**: Any endpoint findable in < 1 minute
- **Testing**: 90%+ of collections have test scripts
- **Documentation**: Every collection has overview notes
- **Compliance**: Zero hardcoded secrets in collections
- **Health**: API health monitors running continuously
- **Adoption**: Agents using new structure consistently
- **Performance**: Baseline performance metrics documented

---

## 10. Agent Responsibilities

### Shared Responsibilities
- ✅ Use correct naming conventions
- ✅ Follow folder organization
- ✅ Add test scripts to requests
- ✅ Use environment variables (no hardcoding)
- ✅ Document complex flows
- ✅ Keep collections current
- ✅ Report discrepancies

### API Owner Responsibilities
- ✅ Maintain API collection accuracy
- ✅ Update when API changes
- ✅ Add examples and documentation
- ✅ Create integration tests
- ✅ Review pull requests from testers
- ✅ Respond to issues

### QA Responsibilities
- ✅ Create comprehensive test suites
- ✅ Test all endpoints per environment
- ✅ Document test results
- ✅ Report issues systematically
- ✅ Validate error handling
- ✅ Performance regression detection

### DevOps Responsibilities
- ✅ Maintain environments
- ✅ Update environment variables
- ✅ Manage API keys/secrets
- ✅ Monitor API health
- ✅ Handle emergency issues
- ✅ Audit collection access

---

## 11. Troubleshooting Guide

### Problem: Request fails in Production but works in Dev

**Solution**:
1. Check environment variables (base_url, api_key)
2. Verify authentication token is valid
3. Check IP allowlisting if applicable
4. Review production API documentation for changes
5. Test with cURL outside Postman
6. Check server logs for errors

### Problem: Tests are failing but request succeeds

**Solution**:
1. Check test script syntax (JavaScript)
2. Verify response data structure matches test
3. Print response to Postman console
4. Test response time thresholds
5. Check required headers
6. Debug test variables

### Problem: Timeout errors when running collection

**Solution**:
1. Increase request timeout in settings
2. Reduce number of parallel requests
3. Check server performance/load
4. Verify API isn't rate limiting
5. Test single requests first
6. Check network connectivity

### Problem: Secrets exposed in collection export

**Solution**:
1. NEVER export with env variables expanded
2. Use encrypted environment variables
3. Regular audit for hardcoded values
4. Use Postman's vault for secrets
5. Rotate exposed API keys immediately
6. Train team on security

### Problem: Collections out of sync with actual API

**Solution**:
1. Compare with API documentation
2. Test all endpoints manually
3. Update inconsistencies
4. Add newer endpoints
5. Remove deprecated endpoints
6. Version collections in Git

---

## 12. Quick Reference Checklist

### New Collection
- [ ] Named correctly: `{EMOJI} {Project} - {Feature} - {Type}`
- [ ] Has description
- [ ] Organized in folders
- [ ] Environments configured
- [ ] Pre-request scripts added
- [ ] Test scripts added
- [ ] Examples provided
- [ ] Documented in navigation guide

### New Request
- [ ] Named: `{METHOD} {Resource} - {Action}`
- [ ] URL uses environment variables
- [ ] Headers configured
- [ ] Body documented
- [ ] Pre-request scripts
- [ ] Test scripts
- [ ] Example response saved
- [ ] Tested in all environments

### New Environment
- [ ] All required variables set
- [ ] Sensitive variables encrypted
- [ ] Base URL configured
- [ ] API keys/tokens set
- [ ] Timeouts appropriate
- [ ] Tested with sample request
- [ ] Shared with team
- [ ] Documented

---

## 13. Next Steps

1. **Read**: Review this document as a team
2. **Implement**: Execute POSTMAN_QUICK_IMPLEMENTATION_GUIDE.md
3. **Consolidate**: Move collections per migration plan
4. **Standardize**: Rename and reorganize
5. **Document**: Add notes and examples
6. **Test**: Run full test suites
7. **Train**: Team workshop on new structure
8. **Monitor**: Track success metrics
9. **Optimize**: Refine based on feedback
10. **Scale**: Add new projects/collections following pattern

---

**Document Control**:
- Version: 1.0
- Status: Active
- Review Date: Every 3 months
- Last Modified: February 10, 2026
- Owner: Technical Architecture
- Access: All team members
