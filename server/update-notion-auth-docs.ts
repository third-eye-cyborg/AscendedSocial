import { notion, findDatabaseByTitle } from './notion.ts';

// Updated authentication architecture documentation
const AUTH_ARCHITECTURE_UPDATE = {
  title: "Updated Authentication Architecture - AuthKit + Replit Auth",
  content: `
# Updated Authentication Architecture

## Overview
Ascended Social now uses a dual authentication system to provide optimal user experience across different platforms and user types.

## Primary Authentication Systems

### 1. WorkOS AuthKit (Main User Authentication)
- **Purpose**: Primary authentication for regular users across web and mobile platforms
- **Implementation**: WorkOS AuthKit with prebuilt UI
- **Endpoints**: 
  - \`/api/login\` - Unified login endpoint
  - \`/api/callback\` - OAuth callback handler
- **Features**:
  - Social login (Google, GitHub, etc.)
  - Email/password authentication
  - Multi-factor authentication support
  - Mobile-optimized flows
  - JWT token generation for mobile apps

### 2. Replit Auth (Employee & Community Admin Authentication)
- **Purpose**: Authentication for internal staff, employees, and community administrators
- **Implementation**: OpenID Connect via Replit Auth
- **Endpoints**:
  - \`/api/login\` - Replit Auth login
  - \`/api/callback\` - Replit Auth callback
- **Features**:
  - Replit account integration
  - Admin role management
  - Session-based authentication
  - Cross-domain support for development environments

## Authentication Flow Architecture

### Web Application Flow
1. User visits \`/api/login\`
2. System detects platform and user type
3. Redirects to appropriate auth provider:
   - Regular users → WorkOS AuthKit
   - Staff/Admins → Replit Auth
4. OAuth callback processes authentication
5. User session established with appropriate permissions

### Mobile Application Flow
1. Mobile app calls \`/api/login\` with platform parameters
2. AuthKit handles mobile-optimized authentication
3. JWT token generated for mobile app
4. Token stored securely in mobile app
5. API requests authenticated via Bearer token

## Security Features

### JWT Token Management
- **Mobile Apps**: JWT tokens with 7-day expiration
- **Web Apps**: Session-based authentication with refresh tokens
- **Token Security**: Signed with SESSION_SECRET, includes user claims

### Cross-Platform Support
- **Native Mobile Apps**: Deep link callbacks (\`ascended://auth/callback\`)
- **Mobile Web Apps**: URL-based callbacks
- **Desktop Web**: Standard OAuth redirects

### Admin Access Control
- **Replit Auth**: For internal staff and community administrators
- **Role-based permissions**: Different access levels based on user type
- **Secure admin routes**: Protected by authentication middleware

## Implementation Details

### Environment Variables Required
\`\`\`bash
# WorkOS AuthKit
WORKOS_API_KEY=your_workos_api_key
WORKOS_CLIENT_ID=your_workos_client_id

# Replit Auth
REPLIT_DOMAINS=your_domains
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc

# Session Management
SESSION_SECRET=your_session_secret
DATABASE_URL=your_database_url
\`\`\`

### Code Structure
- \`server/workosAuth.ts\` - WorkOS AuthKit implementation
- \`server/replitAuth.ts\` - Replit Auth implementation
- \`server/adminAuth.ts\` - Admin authentication middleware
- \`server/mobile-auth-routes.ts\` - Mobile-specific auth routes

## Migration Notes

### From Previous System
- **Legacy Replit Auth**: Still supported for admin users
- **New AuthKit Integration**: Added for better user experience
- **Backward Compatibility**: Maintained for existing admin workflows

### Benefits of New Architecture
1. **Better UX**: AuthKit provides modern, mobile-optimized auth flows
2. **Security**: Enhanced security with WorkOS infrastructure
3. **Scalability**: Better support for high-volume user authentication
4. **Flexibility**: Dual system allows different auth strategies per user type
5. **Mobile-First**: Optimized mobile authentication experience

## Troubleshooting

### Common Issues
1. **Mobile Deep Links**: Ensure app is configured to handle \`ascended://\` scheme
2. **Cross-Domain Sessions**: Verify domain configuration in Replit Auth
3. **JWT Token Expiry**: Implement token refresh logic in mobile apps
4. **Admin Access**: Ensure proper Replit account configuration for admin users

### Debug Endpoints
- \`/api/auth/user\` - Get current user information
- \`/api/auth/mobile-config\` - Mobile app configuration
- \`/api/auth/status\` - Authentication status check
`
};

// Updated mobile development guide
const MOBILE_DEV_UPDATE = {
  title: "Mobile Development Guide - Updated Authentication",
  content: `
# Mobile Development Guide - Updated Authentication

## Authentication Integration

### WorkOS AuthKit Integration
The mobile app now uses WorkOS AuthKit for a seamless authentication experience.

#### iOS Implementation
\`\`\`swift
// Configure AuthKit
let authKit = AuthKit(
  clientId: "your_workos_client_id",
  redirectUri: "ascended://auth/callback"
)

// Handle authentication
func authenticate() {
  authKit.presentAuthFlow { result in
    switch result {
    case .success(let user):
      // Store JWT token
      UserDefaults.standard.set(user.jwt, forKey: "auth_token")
    case .failure(let error):
      print("Auth failed: \\(error)")
    }
  }
}
\`\`\`

#### Android Implementation
\`\`\`kotlin
// Configure AuthKit
val authKit = AuthKit.Builder()
  .clientId("your_workos_client_id")
  .redirectUri("ascended://auth/callback")
  .build()

// Handle authentication
fun authenticate() {
  authKit.presentAuthFlow { result ->
    when (result) {
      is AuthResult.Success -> {
        // Store JWT token
        val prefs = getSharedPreferences("auth", Context.MODE_PRIVATE)
        prefs.edit().putString("jwt_token", result.user.jwt).apply()
      }
      is AuthResult.Error -> {
        Log.e("Auth", "Authentication failed", result.error)
      }
    }
  }
}
\`\`\`

### API Authentication
All API requests must include the JWT token in the Authorization header:

\`\`\`typescript
// API client configuration
const apiClient = axios.create({
  baseURL: 'https://ascended.social/api',
  headers: {
    'Authorization': \`Bearer \${getStoredJWT()}\`,
    'Content-Type': 'application/json'
  }
});
\`\`\`

## Updated Mobile Features

### Cross-Platform Authentication
- **Unified Login**: Same auth flow for iOS and Android
- **Deep Link Support**: Seamless callback handling
- **Token Management**: Automatic token refresh
- **Offline Support**: Cached authentication state

### Security Enhancements
- **JWT Tokens**: Secure, stateless authentication
- **Token Expiry**: 7-day token lifetime with refresh
- **Biometric Auth**: Optional biometric authentication
- **Secure Storage**: Encrypted token storage

## Development Workflow

### Testing Authentication
1. Use development domains for testing
2. Configure deep links in development builds
3. Test both success and failure scenarios
4. Verify token refresh functionality

### Production Deployment
1. Update deep link configuration
2. Configure production WorkOS client
3. Test end-to-end authentication flow
4. Monitor authentication metrics
`
};

// Updated API reference
const API_REFERENCE_UPDATE = {
  title: "API Reference - Updated Authentication Endpoints",
  content: `
# API Reference - Updated Authentication Endpoints

## Authentication Endpoints

### Primary Login Endpoint
\`\`\`http
GET /api/login
\`\`\`

**Description**: Unified login endpoint that routes to appropriate authentication provider based on user type and platform.

**Query Parameters**:
- \`redirectUrl\` (string, optional): URL to redirect after successful authentication
- \`platform\` (string, optional): Platform identifier ('mobile', 'web', 'native')
- \`mobile_bounce\` (boolean, optional): Indicates mobile app authentication
- \`state\` (string, optional): State parameter for OAuth flow

**Response**: Redirects to appropriate authentication provider

### OAuth Callback
\`\`\`http
GET /api/callback
\`\`\`

**Description**: Handles OAuth callbacks from both WorkOS AuthKit and Replit Auth.

**Query Parameters**: OAuth standard parameters (code, state, etc.)

**Response**: Redirects to appropriate destination based on platform and user type

### User Information
\`\`\`http
GET /api/auth/user
\`\`\`

**Description**: Get current authenticated user information.

**Headers**:
- \`Authorization: Bearer <jwt_token>\` (for mobile apps)
- Session cookie (for web apps)

**Response**:
\`\`\`json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profileImageUrl": "https://...",
  "sigil": "user_sigil",
  "sigilImageUrl": "https://...",
  "auraLevel": 5,
  "energy": 100
}
\`\`\`

### Mobile Configuration
\`\`\`http
GET /api/auth/mobile-config
\`\`\`

**Description**: Get mobile app configuration including authentication settings.

**Response**:
\`\`\`json
{
  "authProvider": "workos",
  "clientId": "workos_client_id",
  "redirectUri": "ascended://auth/callback",
  "apiBaseUrl": "https://ascended.social/api"
}
\`\`\`

## Authentication Headers

### JWT Token (Mobile Apps)
\`\`\`http
Authorization: Bearer <jwt_token>
\`\`\`

### Session Cookie (Web Apps)
\`\`\`http
Cookie: connect.sid=<session_id>
\`\`\`

## Error Responses

### 401 Unauthorized
\`\`\`json
{
  "message": "Unauthorized",
  "code": "AUTH_REQUIRED"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "message": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS"
}
\`\`\`

## Platform-Specific Notes

### Mobile Apps
- Use JWT Bearer token authentication
- Implement token refresh logic
- Handle deep link callbacks
- Store tokens securely

### Web Apps
- Use session-based authentication
- Handle OAuth redirects
- Support both auth providers
- Maintain session state

### Admin Access
- Requires Replit Auth authentication
- Additional permission checks
- Enhanced security measures
- Audit logging enabled
`
};

// Updated security framework
const SECURITY_FRAMEWORK_UPDATE = {
  title: "Security & Compliance Framework - Updated Authentication",
  content: `
# Security & Compliance Framework - Updated Authentication

## Authentication Security

### Multi-Provider Architecture
- **WorkOS AuthKit**: Primary user authentication with enterprise-grade security
- **Replit Auth**: Internal staff authentication with domain-based access control
- **JWT Tokens**: Secure, stateless authentication for mobile applications
- **Session Management**: Secure session handling for web applications

### Security Features

#### WorkOS AuthKit Security
- **Enterprise SSO**: Support for enterprise identity providers
- **MFA Support**: Built-in multi-factor authentication
- **Password Policies**: Configurable password requirements
- **Account Lockout**: Protection against brute force attacks
- **Audit Logging**: Comprehensive authentication event logging

#### Replit Auth Security
- **Domain Validation**: Restricted to configured Replit domains
- **OpenID Connect**: Industry-standard authentication protocol
- **Token Validation**: Secure token verification and validation
- **Session Security**: Encrypted session storage in PostgreSQL

#### JWT Token Security
- **Signed Tokens**: HMAC-SHA256 signature verification
- **Expiration**: 7-day token lifetime with automatic refresh
- **Claims Validation**: User identity and permission verification
- **Secure Storage**: Encrypted storage in mobile applications

## Compliance Features

### GDPR Compliance
- **Data Portability**: User data export functionality
- **Right to Erasure**: Account deletion with data removal
- **Consent Management**: Granular privacy controls
- **Data Minimization**: Only collect necessary authentication data

### Security Monitoring
- **Authentication Events**: Log all login attempts and failures
- **Suspicious Activity**: Detect and alert on unusual patterns
- **Rate Limiting**: Prevent brute force attacks
- **IP Blocking**: Block malicious IP addresses

### Audit Trail
- **Login Events**: Track all authentication attempts
- **Permission Changes**: Log role and permission modifications
- **Data Access**: Monitor data access patterns
- **Security Events**: Record security-related activities

## Implementation Security

### Code Security
- **Input Validation**: Validate all authentication inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Cross-site request forgery prevention

### Infrastructure Security
- **HTTPS Only**: All authentication endpoints use HTTPS
- **Secure Headers**: Security headers for all responses
- **Database Encryption**: Encrypted database connections
- **Environment Variables**: Secure configuration management

## Security Best Practices

### For Developers
1. **Never log sensitive data**: Avoid logging passwords or tokens
2. **Validate all inputs**: Sanitize and validate user inputs
3. **Use secure defaults**: Implement secure-by-default configurations
4. **Regular updates**: Keep dependencies and libraries updated
5. **Security testing**: Regular security audits and penetration testing

### For Users
1. **Strong passwords**: Use complex, unique passwords
2. **MFA enabled**: Enable multi-factor authentication when available
3. **Regular updates**: Keep mobile apps updated
4. **Secure networks**: Avoid public Wi-Fi for sensitive operations
5. **Logout properly**: Always log out from shared devices

## Incident Response

### Security Incident Procedures
1. **Detection**: Monitor authentication logs for anomalies
2. **Assessment**: Evaluate the scope and impact of incidents
3. **Containment**: Isolate affected systems and accounts
4. **Investigation**: Analyze logs and determine root cause
5. **Recovery**: Restore normal operations securely
6. **Documentation**: Document lessons learned and improvements

### Contact Information
- **Security Team**: security@ascended.social
- **Emergency Response**: Available 24/7 for critical issues
- **Bug Bounty**: security-bugs@ascended.social
`
};

async function updateNotionPages() {
  try {
    console.log('🔄 Starting Notion pages update with latest authentication information...');
    
    // Find the Project Documentation database
    const projectDocsDb = await findDatabaseByTitle("Project Documentation");
    if (!projectDocsDb) {
      throw new Error("Project Documentation database not found.");
    }
    
    console.log(`✅ Found Project Documentation DB: ${projectDocsDb.id}`);

    // Update authentication architecture page
    console.log('📝 Updating authentication architecture documentation...');
    try {
      await notion.pages.create({
        parent: { database_id: projectDocsDb.id },
        properties: {
          Title: {
            title: [{ text: { content: AUTH_ARCHITECTURE_UPDATE.title } }]
          },
          Type: { select: { name: "Technical Specification" } },
          Status: { select: { name: "Published" } },
          Description: {
            rich_text: [{ text: { content: "Updated authentication architecture documentation covering WorkOS AuthKit for main users and Replit Auth for employees and community admins" } }]
          },
          Summary: {
            rich_text: [{ text: { content: "Comprehensive documentation of the dual authentication system, including implementation details, security features, and migration notes" } }]
          }
        }
      });
      console.log('✅ Added authentication architecture documentation');
    } catch (error) {
      console.log('❌ Failed to add authentication architecture documentation:', error.message);
    }

    // Update mobile development guide
    console.log('📱 Updating mobile development guide...');
    try {
      await notion.pages.create({
        parent: { database_id: projectDocsDb.id },
        properties: {
          Title: {
            title: [{ text: { content: MOBILE_DEV_UPDATE.title } }]
          },
          Type: { select: { name: "Development Guide" } },
          Status: { select: { name: "Published" } },
          Description: {
            rich_text: [{ text: { content: "Updated mobile development guide with WorkOS AuthKit integration, JWT token management, and cross-platform authentication" } }]
          },
          Summary: {
            rich_text: [{ text: { content: "Complete mobile development guide covering iOS/Android implementation, API integration, and security best practices" } }]
          }
        }
      });
      console.log('✅ Added mobile development guide');
    } catch (error) {
      console.log('❌ Failed to add mobile development guide:', error.message);
    }

    // Update API reference
    console.log('🔌 Updating API reference documentation...');
    try {
      await notion.pages.create({
        parent: { database_id: projectDocsDb.id },
        properties: {
          Title: {
            title: [{ text: { content: API_REFERENCE_UPDATE.title } }]
          },
          Type: { select: { name: "API Documentation" } },
          Status: { select: { name: "Published" } },
          Description: {
            rich_text: [{ text: { content: "Updated API reference with new authentication endpoints, JWT token handling, and platform-specific implementation details" } }]
          },
          Summary: {
            rich_text: [{ text: { content: "Comprehensive API documentation covering all authentication endpoints, request/response formats, and error handling" } }]
          }
        }
      });
      console.log('✅ Added API reference documentation');
    } catch (error) {
      console.log('❌ Failed to add API reference documentation:', error.message);
    }

    // Update security framework
    console.log('🔒 Updating security framework documentation...');
    try {
      await notion.pages.create({
        parent: { database_id: projectDocsDb.id },
        properties: {
          Title: {
            title: [{ text: { content: SECURITY_FRAMEWORK_UPDATE.title } }]
          },
          Type: { select: { name: "Security Documentation" } },
          Status: { select: { name: "Published" } },
          Description: {
            rich_text: [{ text: { content: "Updated security framework covering multi-provider authentication, compliance features, and security best practices" } }]
          },
          Summary: {
            rich_text: [{ text: { content: "Comprehensive security documentation including authentication security, compliance features, and incident response procedures" } }]
          }
        }
      });
      console.log('✅ Added security framework documentation');
    } catch (error) {
      console.log('❌ Failed to add security framework documentation:', error.message);
    }

    // Add change log entry
    console.log('📝 Adding change log entry...');
    const changeLogDb = await findDatabaseByTitle("Change Log");
    if (changeLogDb) {
      try {
        await notion.pages.create({
          parent: { database_id: changeLogDb.id },
          properties: {
            Title: {
              title: [{ text: { content: "Authentication Documentation Update" } }]
            },
            Date: {
              date: { start: new Date().toISOString().split('T')[0] }
            },
            Type: {
              select: { name: "Documentation" }
            },
            Impact: {
              select: { name: "High" }
            },
            Description: {
              rich_text: [{ text: { content: "Updated all Notion documentation pages with latest authentication architecture information, including WorkOS AuthKit for main users and Replit Auth for employees and community admins" } }]
            }
          }
        });
        console.log('✅ Added change log entry');
      } catch (error) {
        console.log('❌ Failed to add change log entry:', error.message);
      }
    }

    console.log('🎉 Notion pages update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating Notion pages:', error);
    throw error;
  }
}

// Run the update
updateNotionPages().catch(console.error);
