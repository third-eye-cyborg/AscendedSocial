import { notion } from './notion.ts';

// Main documentation pages that need updating
const MAIN_PAGES = {
  'Replit Development Environments & Version Control': '25a308ef03eb8131872fe55ebea8d6e3',
  'Web-to-Mobile Sync Documentation': '260308ef03eb81a0b145fc8f7c1054e4'
};

// Updated content for main documentation pages
const UPDATED_MAIN_CONTENT = {
  'Replit Development Environments & Version Control': `
# Replit Development Environments & Version Control - Updated

## Overview
This document covers the development environment setup and version control practices for Ascended Social, including the latest authentication architecture updates.

## Development Environment Setup

### Prerequisites
- **Node.js**: Version 20.19.3 or higher
- **TypeScript**: Version 5.6.3
- **PostgreSQL**: Database for development
- **Replit Account**: For Replit Auth integration
- **WorkOS Account**: For AuthKit integration

### Environment Variables
\`\`\`bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ascended_social

# Authentication - WorkOS AuthKit (Primary Users)
WORKOS_API_KEY=your_workos_api_key
WORKOS_CLIENT_ID=your_workos_client_id

# Authentication - Replit Auth (Employees & Admins)
REPLIT_DOMAINS=your_domains
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc

# Session Management
SESSION_SECRET=your_session_secret

# Notion Integration
NOTION_INTEGRATION_SECRET=your_notion_secret
NOTION_PAGE_URL=your_notion_page_url

# Other Services
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key
POSTHOG_API_KEY=your_posthog_key
\`\`\`

## Authentication Architecture

### Dual Authentication System
Ascended Social now uses a sophisticated dual authentication system:

#### 1. WorkOS AuthKit (Primary Users)
- **Purpose**: Main authentication for regular users
- **Features**: Social login, MFA, enterprise SSO
- **Implementation**: \`server/workosAuth.ts\`
- **Endpoints**: \`/api/login\`, \`/api/callback\`

#### 2. Replit Auth (Employees & Admins)
- **Purpose**: Authentication for internal staff and community administrators
- **Features**: Replit account integration, admin roles
- **Implementation**: \`server/replitAuth.ts\`
- **Endpoints**: \`/api/login\`, \`/api/callback\`

### Mobile Authentication
- **Platform Detection**: Automatic detection of mobile vs web platforms
- **Deep Links**: \`ascended://auth/callback\` for mobile apps
- **JWT Tokens**: Secure token-based authentication for mobile
- **Cross-Platform**: Unified authentication flow for iOS and Android

## Development Workflow

### 1. Project Setup
\`\`\`bash
# Clone repository
git clone https://github.com/your-org/ascended-social.git
cd ascended-social

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push

# Start development server
npm run dev
\`\`\`

### 2. Authentication Testing
\`\`\`bash
# Test WorkOS AuthKit (Primary Users)
curl "http://localhost:5000/api/login?platform=web"

# Test Replit Auth (Admins)
curl "http://localhost:5000/api/login?platform=admin"

# Test Mobile Authentication
curl "http://localhost:5000/api/login?platform=mobile&redirectUrl=ascended://auth/callback"
\`\`\`

### 3. Database Management
\`\`\`bash
# Push schema changes
npm run db:push

# Generate migrations
npx drizzle-kit generate

# View database
npx drizzle-kit studio
\`\`\`

## Version Control Practices

### Git Workflow
1. **Feature Branches**: Create feature branches for new development
2. **Pull Requests**: All changes go through pull request review
3. **Code Review**: Required review from at least one team member
4. **Testing**: All changes must pass tests before merge
5. **Documentation**: Update documentation for any API changes

### Branch Naming Convention
- \`feature/authentication-updates\`
- \`fix/mobile-auth-routing\`
- \`docs/notion-sync-updates\`
- \`refactor/auth-middleware\`

### Commit Messages
- \`feat: add WorkOS AuthKit integration\`
- \`fix: resolve mobile authentication routing\`
- \`docs: update authentication documentation\`
- \`refactor: improve JWT token handling\`

## Code Organization

### Server Structure
\`\`\`
server/
├── auth/
│   ├── workosAuth.ts          # WorkOS AuthKit implementation
│   ├── replitAuth.ts          # Replit Auth implementation
│   ├── adminAuth.ts           # Admin authentication
│   └── mobile-auth-routes.ts  # Mobile auth routes
├── routes/
│   ├── api.ts                 # Main API routes
│   ├── auth.ts                # Authentication routes
│   └── mobile.ts              # Mobile-specific routes
├── middleware/
│   ├── auth.ts                # Authentication middleware
│   ├── validation.ts          # Request validation
│   └── rateLimit.ts           # Rate limiting
└── utils/
    ├── jwt.ts                 # JWT utilities
    ├── encryption.ts          # Encryption utilities
    └── validation.ts          # Validation utilities
\`\`\`

### Client Structure
\`\`\`
client/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── mobile/
│   │       ├── MobileAuth.tsx
│   │       └── DeepLinkHandler.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useMobileAuth.ts
│   └── utils/
│       ├── auth.ts
│       └── mobile.ts
\`\`\`

## Testing Strategy

### Unit Tests
- Authentication middleware testing
- JWT token generation and validation
- API endpoint testing
- Mobile authentication flow testing

### Integration Tests
- End-to-end authentication flows
- Mobile app integration testing
- Database integration testing
- Third-party service integration

### E2E Tests
- Complete user authentication flows
- Mobile app authentication testing
- Admin authentication testing
- Cross-platform compatibility testing

## Deployment

### Development Environment
- **URL**: \`https://your-repl.dev\`
- **Database**: Neon PostgreSQL
- **Authentication**: WorkOS AuthKit + Replit Auth
- **Monitoring**: PostHog analytics

### Production Environment
- **URL**: \`https://ascended.social\`
- **Database**: Neon PostgreSQL (production)
- **Authentication**: WorkOS AuthKit + Replit Auth
- **Monitoring**: PostHog analytics + custom monitoring

### Mobile App Deployment
- **iOS**: App Store deployment
- **Android**: Google Play Store deployment
- **Deep Links**: \`ascended://auth/callback\`
- **API**: Production API endpoints

## Monitoring and Debugging

### Authentication Monitoring
- Login success/failure rates
- Token generation and validation metrics
- Mobile vs web authentication patterns
- Error rates by platform

### Debug Tools
- Authentication flow logging
- JWT token debugging
- Mobile deep link testing
- API request/response monitoring

### Common Issues
1. **Mobile Deep Links**: Ensure app is configured to handle \`ascended://\` scheme
2. **Token Expiry**: Implement proper token refresh logic
3. **Cross-Domain Sessions**: Verify domain configuration
4. **Admin Access**: Ensure proper Replit account setup

## Security Considerations

### Authentication Security
- JWT tokens signed with HMAC-SHA256
- Secure session management
- Rate limiting on authentication endpoints
- Input validation and sanitization

### Mobile Security
- Secure token storage (Keychain/EncryptedSharedPreferences)
- Certificate pinning for API requests
- Deep link validation
- Biometric authentication support

### Admin Security
- Replit Auth for admin access
- Role-based permissions
- Audit logging for admin actions
- Secure admin routes

## Documentation Updates

### Notion Integration
- Automatic documentation sync
- Authentication architecture updates
- API reference updates
- Mobile development guide updates

### API Documentation
- Swagger/OpenAPI documentation
- Authentication endpoint documentation
- Mobile SDK documentation
- Error code reference

## Future Improvements

### Planned Features
- Biometric authentication
- Multi-device authentication sync
- Advanced analytics
- A/B testing for authentication flows

### Technical Debt
- Legacy code cleanup
- Performance optimization
- Test coverage improvement
- Documentation updates

## Troubleshooting

### Common Issues
1. **Authentication Not Working**: Check environment variables and configuration
2. **Mobile Deep Links**: Verify URL scheme configuration
3. **Token Issues**: Check JWT secret and token validation
4. **Database Connection**: Verify DATABASE_URL configuration

### Debug Commands
\`\`\`bash
# Check authentication status
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/auth/user

# Test mobile configuration
curl http://localhost:5000/api/auth/mobile-config

# Check database connection
npm run db:studio

# View logs
npm run dev | grep -i auth
\`\`\`

### Support Resources
- Developer documentation
- API reference guides
- Troubleshooting guides
- Community support forums
`,

  'Web-to-Mobile Sync Documentation': `
# Web-to-Mobile Sync Documentation - Updated

## Overview
This document covers the web-to-mobile synchronization system for Ascended Social, including the latest authentication architecture and data synchronization strategies.

## Authentication Synchronization

### Unified Authentication System
The web-to-mobile sync now uses a unified authentication system powered by WorkOS AuthKit:

#### Web Authentication
- **WorkOS AuthKit**: Primary authentication for web users
- **Session Management**: Secure session-based authentication
- **OAuth Flow**: Standard OAuth 2.0 flow with PKCE
- **Token Storage**: Secure HTTP-only cookies

#### Mobile Authentication
- **WorkOS AuthKit**: Same authentication provider as web
- **JWT Tokens**: Stateless authentication for mobile apps
- **Deep Links**: Seamless callback handling
- **Token Storage**: Secure platform-specific storage

### Cross-Platform Authentication
- **Unified Login**: Same authentication flow for web and mobile
- **Token Sharing**: JWT tokens work across platforms
- **Session Sync**: Authentication state synchronized
- **Logout Sync**: Logout propagates across devices

## Data Synchronization Architecture

### Real-Time Sync
- **WebSocket Connections**: Real-time data synchronization
- **Event Broadcasting**: Changes broadcast to all connected clients
- **Conflict Resolution**: Automatic conflict resolution for data changes
- **Offline Support**: Offline changes synced when connection restored

### Data Types Synchronized
1. **User Profile**: Profile information, settings, preferences
2. **Posts**: Spiritual posts, energy levels, chakra information
3. **Oracle Readings**: Personal oracle readings and insights
4. **Energy System**: Energy levels, achievements, spiritual progress
5. **Social Interactions**: Likes, comments, shares, follows
6. **Premium Features**: Subscription status, premium content access

### Sync Strategies

#### Optimistic Updates
- **Immediate UI Updates**: Changes reflected immediately in UI
- **Background Sync**: Changes synced in background
- **Conflict Resolution**: Conflicts resolved automatically
- **Rollback Support**: Failed changes rolled back gracefully

#### Conflict Resolution
- **Last-Write-Wins**: Most recent change takes precedence
- **Field-Level Merging**: Merge changes at field level
- **User Preference**: User can choose resolution strategy
- **Admin Override**: Admin can override conflicts

## Mobile App Integration

### iOS Implementation
\`\`\`swift
import Foundation
import Combine

class SyncManager: ObservableObject {
    @Published var isOnline = false
    @Published var syncStatus = "Idle"
    
    private var cancellables = Set<AnyCancellable>()
    private let authManager: AuthManager
    
    init(authManager: AuthManager) {
        self.authManager = authManager
        setupSync()
    }
    
    private func setupSync() {
        // Monitor network status
        NetworkMonitor.shared.isConnected
            .sink { [weak self] isConnected in
                self?.isOnline = isConnected
                if isConnected {
                    self?.syncPendingChanges()
                }
            }
            .store(in: &cancellables)
        
        // Monitor authentication changes
        authManager.$isAuthenticated
            .sink { [weak self] isAuthenticated in
                if isAuthenticated {
                    self?.startSync()
                } else {
                    self?.stopSync()
                }
            }
            .store(in: &cancellables)
    }
    
    func syncPendingChanges() {
        syncStatus = "Syncing..."
        
        // Sync user profile
        syncUserProfile()
        
        // Sync posts
        syncPosts()
        
        // Sync oracle readings
        syncOracleReadings()
        
        // Sync energy system
        syncEnergySystem()
        
        syncStatus = "Synced"
    }
    
    private func syncUserProfile() {
        // Implementation for user profile sync
    }
    
    private func syncPosts() {
        // Implementation for posts sync
    }
    
    private func syncOracleReadings() {
        // Implementation for oracle readings sync
    }
    
    private func syncEnergySystem() {
        // Implementation for energy system sync
    }
}
\`\`\`

### Android Implementation
\`\`\`kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class SyncManager {
    private val authManager: AuthManager
    private val networkMonitor: NetworkMonitor
    private val syncScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    
    private val _syncStatus = MutableStateFlow("Idle")
    val syncStatus: StateFlow<String> = _syncStatus.asStateFlow()
    
    private val _isOnline = MutableStateFlow(false)
    val isOnline: StateFlow<Boolean> = _isOnline.asStateFlow()
    
    init(authManager: AuthManager, networkMonitor: NetworkMonitor) {
        this.authManager = authManager
        this.networkMonitor = networkMonitor
        setupSync()
    }
    
    private fun setupSync() {
        // Monitor network status
        syncScope.launch {
            networkMonitor.isConnected.collect { isConnected ->
                _isOnline.value = isConnected
                if (isConnected) {
                    syncPendingChanges()
                }
            }
        }
        
        // Monitor authentication changes
        syncScope.launch {
            authManager.isAuthenticated.collect { isAuthenticated ->
                if (isAuthenticated) {
                    startSync()
                } else {
                    stopSync()
                }
            }
        }
    }
    
    suspend fun syncPendingChanges() {
        _syncStatus.value = "Syncing..."
        
        try {
            // Sync user profile
            syncUserProfile()
            
            // Sync posts
            syncPosts()
            
            // Sync oracle readings
            syncOracleReadings()
            
            // Sync energy system
            syncEnergySystem()
            
            _syncStatus.value = "Synced"
        } catch (e: Exception) {
            _syncStatus.value = "Sync Failed: \${e.message}"
        }
    }
    
    private suspend fun syncUserProfile() {
        // Implementation for user profile sync
    }
    
    private suspend fun syncPosts() {
        // Implementation for posts sync
    }
    
    private suspend fun syncOracleReadings() {
        // Implementation for oracle readings sync
    }
    
    private suspend fun syncEnergySystem() {
        // Implementation for energy system sync
    }
}
\`\`\`

## API Endpoints for Sync

### Sync Status
\`\`\`http
GET /api/sync/status
\`\`\`

**Description**: Get current synchronization status.

**Headers**:
- \`Authorization: Bearer <jwt_token>\`

**Response**:
\`\`\`json
{
  "isOnline": true,
  "lastSync": "2025-01-08T16:00:00Z",
  "pendingChanges": 0,
  "syncStatus": "Synced",
  "conflicts": []
}
\`\`\`

### Sync Data
\`\`\`http
POST /api/sync/data
\`\`\`

**Description**: Synchronize data between web and mobile.

**Headers**:
- \`Authorization: Bearer <jwt_token>\`
- \`Content-Type: application/json\`

**Request Body**:
\`\`\`json
{
  "dataType": "posts",
  "lastSync": "2025-01-08T15:00:00Z",
  "changes": [
    {
      "id": "post_123",
      "action": "update",
      "data": {
        "content": "Updated spiritual insight",
        "energy": 15
      }
    }
  ]
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "syncedChanges": 1,
  "conflicts": [],
  "nextSync": "2025-01-08T17:00:00Z"
}
\`\`\`

### Resolve Conflicts
\`\`\`http
POST /api/sync/conflicts
\`\`\`

**Description**: Resolve synchronization conflicts.

**Headers**:
- \`Authorization: Bearer <jwt_token>\`
- \`Content-Type: application/json\`

**Request Body**:
\`\`\`json
{
  "conflictId": "conflict_123",
  "resolution": "use_mobile",
  "data": {
    "content": "Mobile version of post",
    "energy": 20
  }
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "resolved": true,
  "message": "Conflict resolved successfully"
}
\`\`\`

## Offline Support

### Offline Data Storage
- **Local Database**: SQLite for offline data storage
- **Change Queue**: Queue of pending changes
- **Conflict Tracking**: Track conflicts for resolution
- **Sync Metadata**: Metadata for synchronization

### Offline Capabilities
- **Read Data**: Access cached data offline
- **Create Posts**: Create posts offline
- **Edit Profile**: Update profile offline
- **View Oracle Readings**: Access cached readings

### Sync on Reconnect
- **Automatic Sync**: Sync when connection restored
- **Conflict Resolution**: Resolve conflicts automatically
- **Data Validation**: Validate synced data
- **Error Handling**: Handle sync errors gracefully

## Performance Optimization

### Sync Strategies
- **Incremental Sync**: Only sync changed data
- **Batch Operations**: Batch multiple changes together
- **Compression**: Compress data for transmission
- **Caching**: Cache frequently accessed data

### Network Optimization
- **Connection Pooling**: Reuse connections
- **Request Batching**: Batch multiple requests
- **Compression**: Compress request/response data
- **Retry Logic**: Retry failed requests

### Memory Management
- **Data Pagination**: Paginate large datasets
- **Memory Cleanup**: Clean up unused data
- **Cache Limits**: Limit cache size
- **Garbage Collection**: Regular garbage collection

## Error Handling

### Sync Errors
- **Network Errors**: Handle network connectivity issues
- **Authentication Errors**: Handle token expiration
- **Data Validation Errors**: Handle invalid data
- **Conflict Errors**: Handle synchronization conflicts

### Error Recovery
- **Retry Logic**: Retry failed operations
- **Fallback Strategies**: Use fallback data sources
- **User Notification**: Notify users of errors
- **Automatic Recovery**: Attempt automatic recovery

### Error Monitoring
- **Error Logging**: Log all sync errors
- **Error Analytics**: Track error patterns
- **Performance Metrics**: Monitor sync performance
- **User Feedback**: Collect user feedback on errors

## Testing

### Unit Tests
- Sync manager testing
- Conflict resolution testing
- Offline storage testing
- Error handling testing

### Integration Tests
- Web-mobile sync testing
- Authentication sync testing
- Data consistency testing
- Performance testing

### E2E Tests
- Complete sync flow testing
- Offline-online transition testing
- Conflict resolution testing
- Multi-device sync testing

## Monitoring and Analytics

### Sync Metrics
- Sync success rate
- Sync frequency
- Data transfer volume
- Conflict resolution rate

### Performance Metrics
- Sync duration
- Network usage
- Memory usage
- Battery impact

### User Analytics
- Sync usage patterns
- Offline usage patterns
- Error frequency
- User satisfaction

## Troubleshooting

### Common Issues
1. **Sync Not Working**: Check network connectivity and authentication
2. **Data Conflicts**: Review conflict resolution settings
3. **Performance Issues**: Check data volume and network conditions
4. **Authentication Errors**: Verify token validity and refresh

### Debug Tools
- Sync status monitoring
- Conflict resolution tools
- Performance profiling
- Error logging and analysis

### Support Resources
- Developer documentation
- Troubleshooting guides
- Community support forums
- Technical support team
`
};

async function updateMainDocs() {
  try {
    console.log('🔄 Starting update of main documentation pages...');
    
    for (const [pageName, pageId] of Object.entries(MAIN_PAGES)) {
      console.log(`📝 Updating page: ${pageName}`);
      
      try {
        // Get the current page content
        const page = await notion.pages.retrieve({ page_id: pageId });
        console.log(`✅ Retrieved page: ${pageName}`);
        
        // For now, we'll log that the content has been prepared
        // Updating existing page content requires more complex block operations
        const updatedContent = UPDATED_MAIN_CONTENT[pageName as keyof typeof UPDATED_MAIN_CONTENT];
        if (updatedContent) {
          console.log(`📄 Content prepared for: ${pageName}`);
          console.log(`📊 Content length: ${updatedContent.length} characters`);
        }
        
      } catch (error) {
        console.log(`❌ Failed to update page ${pageName}:`, error.message);
      }
    }
    
    console.log('🎉 Main documentation pages update completed!');
    console.log('📝 Note: Content has been prepared but requires manual update in Notion');
    
  } catch (error) {
    console.error('❌ Error updating main documentation pages:', error);
    throw error;
  }
}

// Run the update
updateMainDocs().catch(console.error);
