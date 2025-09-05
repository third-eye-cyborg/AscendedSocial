# Development Setup Guide

This guide will help you set up a local development environment for Ascended Social.

## 🛠️ Prerequisites

### Required Software
- **Node.js**: v20 or higher
- **npm**: v8 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### System Requirements
- **Operating System**: Linux, macOS, or Windows with WSL
- **RAM**: Minimum 8GB, 16GB recommended
- **Storage**: At least 5GB free space

## 📦 Project Structure

```
ascended-social/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── assets/         # Static assets
├── server/                 # Express backend application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   ├── openai.ts           # AI integration
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and types
├── docs/                   # Documentation
└── package.json            # Dependencies and scripts
```

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd ascended-social

# Install dependencies
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ascended_social"

# OpenAI Integration
OPENAI_API_KEY="sk-your-openai-api-key"

# Authentication (Replit Auth)
REPLIT_AUTH_SECRET="your-auth-secret"

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret"
STRIPE_PRICE_ID="price_your-subscription-price"

# Object Storage (Optional)
GOOGLE_CLOUD_STORAGE_BUCKET="your-bucket-name"
```

### 3. Database Setup
The application uses PostgreSQL with Drizzle ORM:

```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Force push if data loss warning
npm run db:push --force
```

### 4. Start Development Server
```bash
# Start both frontend and backend
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 Development Tools

### Available Scripts
```bash
# Start development server
npm run dev

# Database operations
npm run db:generate    # Generate migrations
npm run db:push        # Push schema to DB
npm run db:studio      # Open Drizzle Studio

# Type checking
npm run type-check

# Build for production
npm run build
```

### IDE Configuration

#### VS Code Extensions (Recommended)
- **TypeScript and JavaScript Language Features**
- **Tailwind CSS IntelliSense**
- **ES7+ React/Redux/React-Native snippets**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

#### VS Code Settings (`settings.json`)
```json
{
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    "className\\s*=\\s*['\"`]([^'\"`]*)['\"`]",
    "class\\s*=\\s*['\"`]([^'\"`]*)['\"`]"
  ]
}
```

## 📊 Database Schema

### Core Tables
- **users**: User profiles, energy, aura levels
- **posts**: User-generated content with chakra alignment
- **comments**: Post comments and replies
- **postEngagements**: Likes, upvotes, energy shares
- **spirits**: AI-generated spirit guides
- **spiritualReadings**: Oracle and tarot readings
- **notifications**: User notifications
- **subscriptions**: Premium subscription management

### Key Relationships
- Users have one Spirit Guide
- Posts belong to Users and have many Engagements
- Spirit Guides evolve through user engagement
- Energy system tracks monthly allocations

## 🧩 Architecture Overview

### Frontend (React + TypeScript)
- **Vite**: Build tool and dev server
- **wouter**: Lightweight routing
- **TanStack Query**: Server state management
- **shadcn/ui**: Component library
- **Tailwind CSS**: Utility-first styling

### Backend (Node.js + Express)
- **Express**: Web framework
- **Drizzle ORM**: Type-safe database operations
- **OpenAI API**: AI integration for spirits and oracle
- **Replit Auth**: Authentication system
- **Stripe**: Payment processing (optional)

### Database (PostgreSQL)
- **Neon**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Migration management
- **Connection pooling**: Handled by Neon

## 🔐 Authentication Flow

### Replit Auth Integration
1. User clicks "Sign In" button
2. Redirected to Replit Auth
3. User authorizes application
4. Redirected back with auth token
5. Server validates token and creates session

### Session Management
- Server-side sessions stored in PostgreSQL
- `connect-pg-simple` for session storage
- Session timeout: 30 days
- Automatic cleanup of expired sessions

## 🎨 UI Components

### Component Library (shadcn/ui)
Pre-built components with Radix UI primitives:
- **Cards**: Content containers with mystical styling
- **Buttons**: Primary, secondary, ghost variants
- **Forms**: Validation with react-hook-form + Zod
- **Dialogs**: Modal windows for interactions
- **Progress**: Energy and experience indicators

### Custom Components
- **ProfileIcon**: User avatars with sigil support
- **SpiritAvatar**: AI spirit visualization with evolution
- **PostCard**: Content display with engagement actions
- **SearchModal**: Global content and user search

### Styling System
- **Tailwind CSS**: Utility-first framework
- **Custom Theme**: Mystical color palette
- **Dark Mode**: Default cosmic theme
- **Responsive Design**: Mobile-first approach

## 🤖 AI Integration

### OpenAI Features
- **Spirit Generation**: Based on spiritual questionnaire
- **Daily Readings**: Personalized spiritual guidance
- **Tarot Readings**: Three-card spreads (Premium)
- **Content Categorization**: Automatic chakra alignment

### AI Functions (`server/openai.ts`)
```typescript
// Generate spirit guide based on questionnaire
generateSpirit(questionnaire: SpiritualQuestionnaire): Promise<Spirit>

// Create daily spiritual reading
generateDailyReading(): Promise<SpiritualReading>

// Generate tarot card reading (Premium)
generateTarotReading(question: string): Promise<TarotReading>

// Categorize post by chakra
categorizePostByChakra(content: string): Promise<ChakraType>
```

## 📱 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Posts & Engagement
- `GET /api/posts` - List posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/engage` - Like, upvote, energy share
- `DELETE /api/posts/:id/engage/:type` - Remove engagement

### Spirits & Energy
- `GET /api/spirit` - Get user's spirit guide
- `PUT /api/spirit/experience` - Update spirit experience
- `GET /api/users/:id/stats` - User statistics

### Oracle Features
- `GET /api/readings/daily` - Daily spiritual reading
- `POST /api/readings/tarot` - Generate tarot reading (Premium)
- `GET /api/oracle/recommendations` - AI recommendations

## 🧪 Testing

### Test Structure
```
tests/
├── unit/           # Individual function tests
├── integration/    # API endpoint tests
├── e2e/           # End-to-end user flows
└── fixtures/      # Test data and mocks
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Spirit System"

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 Mobile App Development

### Mobile Architecture Overview

Ascended Social supports mobile applications through a hybrid approach:
- **Native Mobile Apps**: iOS and Android with React Native
- **Progressive Web App (PWA)**: Mobile-optimized web experience
- **API-First Design**: All mobile features accessible via REST API

### Mobile Environment Configuration

Mobile apps require specific environment configurations for different deployment stages:

#### Development Environment
```javascript
// mobile-config.dev.js
export const mobileConfig = {
  API_BASE_URL: "http://localhost:5000/api",
  MOBILE_AUTH_REDIRECT_URI: "ascended://auth/callback",
  MOBILE_DEEP_LINK_SCHEME: "ascended://",
  PUSH_NOTIFICATION_ENDPOINT: "https://onesignal.com/api/v1",
  ENVIRONMENT: "development"
};
```

#### Staging Environment
```javascript
// mobile-config.staging.js
export const mobileConfig = {
  API_BASE_URL: "https://[REPL_SLUG].[REPL_OWNER].repl.co/api",
  MOBILE_AUTH_REDIRECT_URI: "ascended-staging://auth/callback",
  MOBILE_DEEP_LINK_SCHEME: "ascended-staging://",
  PUSH_NOTIFICATION_ENDPOINT: "https://onesignal.com/api/v1",
  ENVIRONMENT: "staging"
};
```

#### Production Environment
```javascript
// mobile-config.prod.js
export const mobileConfig = {
  API_BASE_URL: "https://ascended.social/api",
  MOBILE_AUTH_REDIRECT_URI: "ascended-prod://auth/callback",
  MOBILE_DEEP_LINK_SCHEME: "ascended-prod://",
  PUSH_NOTIFICATION_ENDPOINT: "https://onesignal.com/api/v1",
  ENVIRONMENT: "production"
};
```

### Mobile Authentication Flow

#### 1. Replit Auth Integration for Mobile

Mobile apps use a modified OAuth flow with deep linking:

```typescript
// Mobile authentication service
export class MobileAuthService {
  private config: MobileConfig;

  async initiateLogin(): Promise<void> {
    const authUrl = `${this.config.API_BASE_URL}/login?redirect=${this.config.MOBILE_AUTH_REDIRECT_URI}`;
    
    // Open browser for authentication
    await InAppBrowser.open(authUrl, {
      showTitle: true,
      showURL: false,
      toolbar: true
    });
  }

  async handleDeepLink(url: string): Promise<AuthResult> {
    if (url.startsWith(this.config.MOBILE_DEEP_LINK_SCHEME)) {
      const token = this.extractTokenFromUrl(url);
      return await this.validateSession(token);
    }
    throw new Error('Invalid deep link');
  }

  private async validateSession(token: string): Promise<AuthResult> {
    const response = await fetch(`${this.config.API_BASE_URL}/auth/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
}
```

#### 2. Session Management on Mobile

```typescript
// Mobile session storage
export class MobileSessionManager {
  async storeSession(sessionData: SessionData): Promise<void> {
    await SecureStore.setItemAsync('user_session', JSON.stringify(sessionData));
  }

  async getSession(): Promise<SessionData | null> {
    const session = await SecureStore.getItemAsync('user_session');
    return session ? JSON.parse(session) : null;
  }

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync('user_session');
  }
}
```

### Mobile-Specific API Considerations

#### Request Headers for Mobile

All mobile API requests should include specific headers:

```typescript
const mobileApiHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'AscendedSocial-Mobile/1.0',
  'X-Platform': Platform.OS, // 'ios' or 'android'
  'X-App-Version': Application.nativeApplicationVersion,
  'X-Build-Number': Application.nativeBuildVersion
};
```

#### Offline Functionality

Mobile apps implement offline-first data synchronization:

```typescript
// Offline data manager
export class OfflineDataManager {
  private storage: SQLiteDatabase;

  async syncWhenOnline(): Promise<void> {
    if (NetInfo.isConnected) {
      await this.uploadPendingPosts();
      await this.downloadLatestContent();
      await this.syncEngagements();
    }
  }

  async cachePost(post: Post): Promise<void> {
    await this.storage.executeSql(
      'INSERT OR REPLACE INTO cached_posts VALUES (?, ?, ?)',
      [post.id, JSON.stringify(post), new Date().toISOString()]
    );
  }
}
```

### Push Notifications

#### OneSignal Integration

Mobile apps use OneSignal for spiritual notifications:

```typescript
// Push notification setup
export class MobilePushService {
  async initialize(): Promise<void> {
    OneSignal.setAppId(this.config.ONESIGNAL_APP_ID);
    
    OneSignal.setNotificationOpenedHandler((notification) => {
      this.handleNotificationOpened(notification);
    });

    OneSignal.setNotificationWillShowInForegroundHandler((notification) => {
      return this.handleForegroundNotification(notification);
    });
  }

  async subscribeToSpiritualTopics(userTopics: string[]): Promise<void> {
    const spiritualTopics = [
      'daily-wisdom',
      'spirit-evolution',
      'energy-sharing',
      'oracle-readings',
      ...userTopics
    ];

    for (const topic of spiritualTopics) {
      await OneSignal.sendTag(topic, 'subscribed');
    }
  }
}
```

#### Spiritual Notification Types

Mobile apps receive specialized spiritual notifications:

```typescript
interface SpiritualNotification {
  type: 'daily_reading' | 'spirit_evolution' | 'energy_received' | 'community_update';
  title: string;
  body: string;
  data: {
    chakra?: ChakraType;
    energyAmount?: number;
    postId?: string;
    spiritualLevel?: number;
  };
  icon: string;
  sound: 'chime' | 'bell' | 'crystal';
}
```

### Mobile UI Components

#### Spiritual-Themed Mobile Components

```typescript
// Mobile-specific spiritual components
export const MobileSpiritualComponents = {
  EnergyMeter: ({ current, max }: { current: number; max: number }) => (
    <RadialProgress 
      progress={current / max}
      colors={['#purple', '#gold', '#white']}
      glowEffect={true}
    />
  ),

  ChakraSelector: ({ onSelect }: { onSelect: (chakra: ChakraType) => void }) => (
    <ScrollView horizontal>
      {CHAKRAS.map(chakra => (
        <TouchableOpacity 
          key={chakra}
          onPress={() => onSelect(chakra)}
          style={styles.chakraButton}
        >
          <ChakraIcon chakra={chakra} animated={true} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  ),

  SpiritAvatar: ({ spirit, size }: { spirit: Spirit; size: number }) => (
    <Animated.View style={[styles.avatar, { width: size, height: size }]}>
      <Image source={{ uri: spirit.imageUrl }} style={styles.spiritImage} />
      <LevelBadge level={spirit.level} />
    </Animated.View>
  )
};
```

### Mobile Performance Optimization

#### Image Loading and Caching

```typescript
// Optimized image loading for spiritual content
export class MobileImageService {
  private cache = new ImageCache();

  async loadSpiritualImage(url: string): Promise<string> {
    const cached = await this.cache.get(url);
    if (cached) return cached;

    const optimized = await this.resizeForMobile(url);
    await this.cache.set(url, optimized);
    return optimized;
  }

  private async resizeForMobile(url: string): Promise<string> {
    return ImageResizer.resize({
      uri: url,
      width: Dimensions.get('window').width,
      height: 400,
      quality: 0.8,
      format: 'WEBP'
    });
  }
}
```

#### Lazy Loading for Community Feed

```typescript
// Optimized feed loading
export const MobileFeedComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    setLoading(true);
    const newPosts = await api.getPosts({
      limit: 10,
      offset: posts.length,
      optimize: 'mobile'
    });
    setPosts(prev => [...prev, ...newPosts]);
    setLoading(false);
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <MobilePostCard post={item} />}
      onEndReached={loadMorePosts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <LoadingSpinner /> : null}
    />
  );
};
```

### Mobile Testing and Automation

#### Automated Testing with Browserless

Mobile testing integrates with the platform's browser automation:

```typescript
// Mobile app testing service
export class MobileTestingService {
  async testSpiritualFlow(): Promise<TestResult> {
    const testSteps = [
      'Launch app',
      'Login with test user',
      'Navigate to spirit guide',
      'Check spirit evolution',
      'Share energy with post',
      'Verify energy transfer'
    ];

    const results = await this.runMobileAutomation(testSteps);
    return this.validateSpiritualFeatures(results);
  }

  private async runMobileAutomation(steps: string[]): Promise<any> {
    const response = await fetch('/api/automation/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: `Mobile test: ${steps.join(' -> ')}`,
        platform: 'mobile',
        options: { timeout: 60000 }
      })
    });
    return response.json();
  }
}
```

### Mobile Deployment Pipeline

#### Environment-Specific Mobile Builds

```bash
# Development build
npm run mobile:build:dev

# Staging build  
npm run mobile:build:staging

# Production build
npm run mobile:build:prod
```

#### Mobile Environment Variables

```env
# Development Mobile Config
DEV_MOBILE_AUTH_CLIENT_ID="replit-mobile-dev"
DEV_MOBILE_DEEP_LINK_SCHEME="ascended-dev://"
DEV_PUSH_NOTIFICATION_KEY="onesignal-dev-key"

# Staging Mobile Config  
STAGING_MOBILE_AUTH_CLIENT_ID="replit-mobile-staging"
STAGING_MOBILE_DEEP_LINK_SCHEME="ascended-staging://"
STAGING_PUSH_NOTIFICATION_KEY="onesignal-staging-key"

# Production Mobile Config
PROD_MOBILE_AUTH_CLIENT_ID="replit-mobile-prod"  
PROD_MOBILE_DEEP_LINK_SCHEME="ascended://"
PROD_PUSH_NOTIFICATION_KEY="onesignal-prod-key"
```

### Mobile Debugging and Monitoring

#### Real-time Error Tracking

```typescript
// Mobile error reporting
export class MobileErrorService {
  async reportError(error: Error, context: ErrorContext): Promise<void> {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      platform: Platform.OS,
      appVersion: Application.nativeApplicationVersion,
      userId: await this.getCurrentUserId(),
      spiritualContext: context.spiritualState,
      timestamp: new Date().toISOString()
    };

    await fetch('/api/mobile/errors', {
      method: 'POST',
      body: JSON.stringify(errorReport)
    });
  }
}
```

---

## 🚀 Deployment

### Environment Setup
1. **Database**: Set up PostgreSQL database
2. **Environment Variables**: Configure production secrets
3. **Object Storage**: Set up Google Cloud Storage (optional)
4. **AI Integration**: Configure OpenAI API key

### Build Process
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Health Checks
The application includes health check endpoints:
- `GET /health` - Basic health check
- `GET /api/health` - API health with database connectivity

## 🐛 Common Issues

### Database Connection
```
Error: connect ECONNREFUSED
```
**Solution**: Verify DATABASE_URL and database is running

### Missing Environment Variables
```
Error: OPENAI_API_KEY is not defined
```
**Solution**: Copy `.env.example` to `.env` and fill in values

### Port Conflicts
```
Error: Port 5000 is already in use
```
**Solution**: Change port in `server/index.ts` or kill conflicting process

### TypeScript Errors
```
Error: Cannot find module '@shared/schema'
```
**Solution**: Ensure TypeScript paths are configured in `tsconfig.json`

---

## 🔒 Security & Compliance Framework

### Zero Trust Architecture

Ascended Social implements a four-layer Zero Trust security model using Cloudflare:

#### Layer 1: User Authentication (Replit Auth)
Standard user authentication for platform features:

```typescript
// Replit Auth integration
export class ReplitAuthProvider {
  async authenticateUser(request: Request): Promise<User | null> {
    const session = await this.getSession(request);
    if (!session?.user) return null;
    
    // Validate session with Replit's OpenID Connect
    const userInfo = await this.validateSessionWithReplit(session.token);
    return userInfo;
  }

  private async validateSessionWithReplit(token: string): Promise<UserInfo> {
    const response = await fetch('https://replit.com/api/auth/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
}
```

#### Layer 2: Admin Access Protection (Cloudflare Access)
Secures sensitive administrative operations:

```typescript
// Zero Trust JWT validation for admin operations
export class ZeroTrustAdminAuth {
  private cloudflarePublicKey: string;

  async validateAdminAccess(request: Request): Promise<AdminUser | null> {
    const cfAccessJWT = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!cfAccessJWT) throw new Error('Admin access requires Zero Trust authentication');

    try {
      const payload = await this.verifyCloudflareJWT(cfAccessJWT);
      return this.createAdminUser(payload);
    } catch (error) {
      this.auditLogger.logFailedAdminAccess(request, error);
      return null;
    }
  }

  private async verifyCloudflareJWT(token: string): Promise<any> {
    const decoded = jwt.verify(token, this.cloudflarePublicKey, {
      algorithms: ['RS256'],
      audience: process.env.CLOUDFLARE_AUD,
      issuer: `https://${process.env.CLOUDFLARE_TEAM_DOMAIN}.cloudflareaccess.com`
    });
    return decoded;
  }

  async createZeroTrustPolicy(policyData: PolicyRequest): Promise<Policy> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/access/policies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: policyData.name,
        decision: 'allow',
        include: [{ email: { email: policyData.adminEmail } }],
        require: [{ device_posture: { integration_uid: 'managed-device' } }]
      })
    });
    return response.json();
  }
}
```

#### Layer 3: Network Protection (Cloudflare Gateway)
DNS-level filtering and threat protection:

```typescript
// Gateway DNS filtering configuration
export class NetworkSecurityConfig {
  async configureGatewayFiltering(): Promise<void> {
    const gatewayPolicies = [
      {
        name: 'Block Malicious Domains',
        enabled: true,
        filters: ['malware', 'phishing', 'adult-content'],
        action: 'block'
      },
      {
        name: 'Monitor Social Media Access',
        enabled: true,
        filters: ['social-media'],
        action: 'audit'
      }
    ];

    for (const policy of gatewayPolicies) {
      await this.createGatewayPolicy(policy);
    }
  }

  private async createGatewayPolicy(policy: GatewayPolicy): Promise<void> {
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/gateway/rules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(policy)
    });
  }
}
```

#### Layer 4: API Protection (Web Application Firewall)
DDoS protection, rate limiting, and WAF rules:

```typescript
// WAF rules for spiritual platform protection
export class WebApplicationFirewall {
  async setupSpiritualPlatformWAF(): Promise<void> {
    const wafRules = [
      // Rate limiting for API endpoints
      {
        expression: '(http.request.uri.path contains "/api/")',
        action: 'challenge',
        description: 'Rate limit API endpoints',
        enabled: true
      },
      
      // Protect spiritual content upload endpoints
      {
        expression: '(http.request.uri.path contains "/api/posts" and http.request.method eq "POST")',
        action: 'js_challenge',
        description: 'Protect post creation endpoint',
        enabled: true
      },
      
      // Block common attack patterns
      {
        expression: '(http.request.uri.query contains "union select" or http.request.uri.query contains "<script")',
        action: 'block',
        description: 'Block SQL injection and XSS attempts',
        enabled: true
      }
    ];

    for (const rule of wafRules) {
      await this.createWAFRule(rule);
    }
  }

  async enableDDoSProtection(): Promise<void> {
    const ddosConfig = {
      sensitivity: 'medium',
      response: {
        content_type: 'application/json',
        body: JSON.stringify({ 
          error: 'Too many requests. Please practice spiritual patience 🙏',
          code: 'RATE_LIMITED'
        })
      }
    };

    await this.configureDDoSProtection(ddosConfig);
  }
}
```

### GDPR Compliance Framework

#### Privacy-First Data Architecture

```typescript
// GDPR-compliant data management
export class PrivacyComplianceManager {
  async processDataSubjectRequest(request: DataSubjectRequest): Promise<ComplianceResponse> {
    switch (request.type) {
      case 'access':
        return await this.handleDataAccess(request);
      case 'deletion':
        return await this.handleDataDeletion(request);
      case 'rectification':
        return await this.handleDataRectification(request);
      case 'portability':
        return await this.handleDataPortability(request);
      default:
        throw new Error(`Unsupported request type: ${request.type}`);
    }
  }

  private async handleDataAccess(request: DataSubjectRequest): Promise<UserDataExport> {
    const userData = await this.aggregateUserData(request.userId);
    
    return {
      personalData: this.sanitizePersonalData(userData.profile),
      posts: userData.posts.map(post => this.sanitizePostData(post)),
      engagements: userData.engagements,
      spiritGuide: this.sanitizeSpiritData(userData.spirit),
      energyHistory: userData.energyTransactions,
      processingPurposes: this.getDataProcessingPurposes(),
      retentionPeriods: this.getDataRetentionPeriods(),
      thirdPartySharing: this.getThirdPartyDataSharing()
    };
  }

  private async handleDataDeletion(request: DataSubjectRequest): Promise<DeletionResponse> {
    // Implement right to be forgotten
    const deletionPlan = await this.createDeletionPlan(request.userId);
    
    // Anonymize posts instead of deletion to preserve community context
    await this.anonymizePosts(request.userId);
    
    // Delete personal identifiable information
    await this.deletePII(request.userId);
    
    // Remove from analytics
    await this.removeFromAnalytics(request.userId);
    
    // Notify third-party services
    await this.notifyThirdPartyDeletion(request.userId);
    
    return {
      deletedData: deletionPlan.deletedItems,
      anonymizedData: deletionPlan.anonymizedItems,
      retainedData: deletionPlan.retainedItems,
      completionDate: new Date().toISOString()
    };
  }
}
```

#### Cookie Consent Management (Enzuzo Integration)

```typescript
// GDPR-compliant cookie management
export class CookieConsentManager {
  async initializeConsentManagement(): Promise<void> {
    // Initialize Enzuzo consent widget
    this.setupEnzuzoWidget();
    
    // Configure consent categories
    await this.configureConsentCategories();
    
    // Set up consent event listeners
    this.setupConsentEventHandlers();
  }

  private setupEnzuzoWidget(): void {
    window.Enzuzo = window.Enzuzo || {};
    window.Enzuzo.config = {
      // Spiritual-themed consent experience
      theme: 'dark-mystical',
      position: 'bottom-center',
      message: 'We honor your privacy as sacred. Choose how you\'d like to share your energy with our spiritual analytics.',
      acceptText: 'Accept All Energies',
      declineText: 'Essential Only',
      settingsText: 'Customize Energy Sharing'
    };
  }

  private async configureConsentCategories(): Promise<void> {
    const categories = [
      {
        name: 'essential',
        label: 'Essential Spiritual Functions',
        description: 'Required for basic platform functionality and spiritual journey tracking',
        required: true,
        cookies: ['session', 'csrf', 'auth_state']
      },
      {
        name: 'analytics',
        label: 'Spiritual Analytics',
        description: 'Helps us understand community spiritual growth patterns',
        required: false,
        cookies: ['posthog', 'spiritual_insights', 'chakra_analytics']
      },
      {
        name: 'personalization',
        label: 'Oracle Personalization',
        description: 'Enables personalized spiritual guidance and oracle readings',
        required: false,
        cookies: ['oracle_prefs', 'spirit_profile', 'reading_history']
      }
    ];

    await this.registerConsentCategories(categories);
  }

  async handleConsentChange(consent: ConsentPreferences): Promise<void> {
    // Update analytics based on consent
    if (consent.analytics) {
      await this.enableAnalytics();
    } else {
      await this.disableAnalytics();
    }

    // Configure personalization features
    if (consent.personalization) {
      await this.enablePersonalization();
    } else {
      await this.disablePersonalization();
    }

    // Store consent preferences
    await this.storeConsentPreferences(consent);
  }
}
```

### Data Processing Audit Trail

```typescript
// Comprehensive audit logging for compliance
export class ComplianceAuditLogger {
  async logDataProcessing(activity: DataProcessingActivity): Promise<void> {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId: activity.userId,
      dataType: activity.dataType,
      processingPurpose: activity.purpose,
      legalBasis: activity.legalBasis,
      dataProcessor: activity.processor,
      action: activity.action,
      ipAddress: this.hashIP(activity.ipAddress),
      userAgent: activity.userAgent,
      sessionId: activity.sessionId
    };

    // Store in secure audit database
    await this.storeAuditEntry(auditEntry);
    
    // Real-time compliance monitoring
    await this.analyzeForComplianceViolations(auditEntry);
  }

  async generateComplianceReport(timeframe: TimeRange): Promise<ComplianceReport> {
    const auditEntries = await this.getAuditEntries(timeframe);
    
    return {
      period: timeframe,
      totalDataSubjects: this.countUniqueUsers(auditEntries),
      processingActivities: this.categorizeProcessingActivities(auditEntries),
      legalBasisBreakdown: this.analyzeLegalBasis(auditEntries),
      thirdPartyProcessors: this.identifyThirdPartyProcessors(auditEntries),
      dataRetentionCompliance: await this.checkRetentionCompliance(),
      consentRates: await this.calculateConsentRates(timeframe),
      dataSubjectRequests: await this.getDataSubjectRequestStats(timeframe)
    };
  }
}
```

---

## 🔌 Third-Party Integration Guides

### Stripe Payment Integration

#### Subscription Management
```typescript
// Spiritual subscription tiers with Stripe
export class SpiritualSubscriptionService {
  private stripe: Stripe;

  async createSpiritualSubscription(userId: string, tier: SubscriptionTier): Promise<SubscriptionResult> {
    const user = await this.userService.getUser(userId);
    
    // Create or retrieve Stripe customer
    const customer = await this.getOrCreateStripeCustomer(user);
    
    // Configure subscription based on spiritual tier
    const subscriptionConfig = this.getSpiritualTierConfig(tier);
    
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: subscriptionConfig.priceId }],
      metadata: {
        userId: userId,
        spiritualTier: tier,
        auraLevel: user.aura?.toString() || '1'
      },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status
    };
  }

  private getSpiritualTierConfig(tier: SubscriptionTier) {
    const spiritualTiers = {
      'seeker': {
        priceId: process.env.STRIPE_SEEKER_PRICE_ID,
        features: ['unlimited_energy', 'daily_oracle', 'basic_tarot'],
        name: 'Spiritual Seeker',
        price: 999 // $9.99/month
      },
      'mystic': {
        priceId: process.env.STRIPE_MYSTIC_PRICE_ID,
        features: ['unlimited_energy', 'daily_oracle', 'full_tarot', 'community_insights'],
        name: 'Mystic Wanderer',
        price: 1999 // $19.99/month
      },
      'enlightened': {
        priceId: process.env.STRIPE_ENLIGHTENED_PRICE_ID,
        features: ['unlimited_energy', 'unlimited_oracle', 'premium_tarot', 'personal_spirit_guide'],
        name: 'Enlightened Being',
        price: 4999 // $49.99/month
      }
    };

    return spiritualTiers[tier];
  }

  async handleWebhook(rawBody: string, signature: string): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }
  }
}
```

### Google Cloud Storage Integration

#### Spiritual Media Management
```typescript
// Google Cloud Storage for spiritual content
export class SpiritualMediaService {
  private storage: Storage;
  private bucket: Bucket;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
    });
    this.bucket = this.storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);
  }

  async uploadSpiritualContent(
    file: Buffer, 
    metadata: SpiritualContentMetadata
  ): Promise<string> {
    const fileName = this.generateSpiritualFileName(metadata);
    const fileUpload = this.bucket.file(fileName);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: metadata.mimeType,
        metadata: {
          userId: metadata.userId,
          chakra: metadata.chakra,
          spiritualCategory: metadata.category,
          uploadDate: new Date().toISOString(),
          auraLevel: metadata.userAuraLevel?.toString()
        }
      },
      public: false,
      validation: 'crc32c'
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
        resolve(`gs://${this.bucket.name}/${fileName}`);
      });
      stream.end(file);
    });
  }

  async generateSignedUrl(fileName: string, userId: string): Promise<string> {
    // Verify user has access to this spiritual content
    await this.verifyContentAccess(fileName, userId);
    
    const [url] = await this.bucket.file(fileName).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return url;
  }

  private generateSpiritualFileName(metadata: SpiritualContentMetadata): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `spiritual-content/${metadata.userId}/${metadata.chakra}/${timestamp}-${random}.${metadata.extension}`;
  }
}
```

### OneSignal Push Notifications

#### Spiritual Notification System
```typescript
// OneSignal integration for spiritual notifications
export class SpiritualNotificationService {
  private oneSignal: OneSignalApi;

  async sendSpiritualNotification(notification: SpiritualNotification): Promise<void> {
    const spiritualMessage = this.craftSpiritualMessage(notification);
    
    await this.oneSignal.createNotification({
      app_id: process.env.ONESIGNAL_APP_ID!,
      headings: { en: spiritualMessage.title },
      contents: { en: spiritualMessage.body },
      data: {
        type: notification.type,
        chakra: notification.chakra,
        spiritualLevel: notification.spiritualLevel,
        deepLink: notification.deepLink
      },
      filters: this.createSpiritualAudience(notification.audience),
      ios_badgeType: 'Increase',
      ios_badgeCount: 1,
      android_channel_id: 'spiritual-guidance',
      small_icon: 'spiritual_icon',
      large_icon: this.getChakraIcon(notification.chakra)
    });
  }

  private craftSpiritualMessage(notification: SpiritualNotification): NotificationMessage {
    const templates = {
      daily_oracle: {
        title: '🔮 Your Daily Oracle Awaits',
        body: 'The universe has guidance for your spiritual journey today'
      },
      spirit_evolution: {
        title: '✨ Your Spirit Guide Has Evolved!',
        body: `${notification.spiritName} has reached level ${notification.newLevel}`
      },
      energy_received: {
        title: '⚡ Spiritual Energy Received',
        body: `${notification.senderName} shared ${notification.energyAmount} energy with you`
      },
      chakra_alignment: {
        title: '🌈 Chakra Alignment Opportunity',
        body: `Your ${notification.chakra} chakra is calling for attention`
      },
      community_wisdom: {
        title: '🙏 Community Wisdom Available',
        body: 'New insights from your spiritual community await'
      }
    };

    return templates[notification.type] || {
      title: '🌟 Spiritual Update',
      body: notification.customMessage || 'Something spiritual awaits you'
    };
  }

  async subscribeToSpiritualTopics(userId: string, preferences: NotificationPreferences): Promise<void> {
    const spiritualTags = {
      daily_oracle: preferences.dailyOracle,
      spirit_evolution: preferences.spiritEvolution,
      energy_notifications: preferences.energySharing,
      chakra_guidance: preferences.chakraGuidance,
      community_updates: preferences.communityUpdates
    };

    // Update user's OneSignal tags
    await this.oneSignal.editDevice(userId, { tags: spiritualTags });
  }
}
```

### PostHog Analytics Integration

#### Privacy-First Spiritual Analytics
```typescript
// PostHog integration for spiritual journey analytics
export class SpiritualAnalyticsService {
  private posthog: PostHog;

  constructor() {
    this.posthog = new PostHog(
      process.env.POSTHOG_API_KEY!,
      { 
        host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
        flushAt: 20,
        flushInterval: 10000
      }
    );
  }

  async trackSpiritualJourney(userId: string, event: SpiritualEvent): Promise<void> {
    // Only track if user has consented to analytics
    const hasConsent = await this.checkAnalyticsConsent(userId);
    if (!hasConsent) return;

    const spiritualProperties = await this.buildSpiritualContext(userId, event);
    
    this.posthog.capture({
      distinctId: userId,
      event: event.type,
      properties: {
        ...spiritualProperties,
        // Anonymized spiritual metrics
        aura_level_range: this.getAuraRange(event.auraLevel),
        dominant_chakra: event.chakra,
        spirit_element: event.spiritElement,
        spiritual_path_category: event.pathCategory,
        community_resonance_score: event.resonanceScore,
        energy_flow_pattern: event.energyPattern
      }
    });
  }

  private async buildSpiritualContext(userId: string, event: SpiritualEvent): Promise<any> {
    return {
      // User spiritual state (anonymized)
      spiritual_level: this.categorizeLevel(event.userLevel),
      primary_interests: event.interests?.slice(0, 3), // Limit for privacy
      engagement_pattern: event.engagementType,
      
      // Community context
      community_size_range: this.getCommunitySize(event.communityId),
      collective_consciousness_level: event.communityConsciousnessLevel,
      
      // Platform context
      feature_usage: event.featureInteraction,
      spiritual_tools_used: event.toolsUsed,
      
      // Temporal context
      moon_phase: this.getCurrentMoonPhase(),
      spiritual_season: this.getSpiritualSeason(),
      time_of_day_energy: this.getTimeEnergyLevel()
    };
  }

  async generateSpiritualInsights(communityId?: string): Promise<SpiritualInsights> {
    const query = `
      SELECT 
        properties.dominant_chakra as chakra,
        avg(properties.aura_level_range) as avg_aura_level,
        count(*) as activity_count,
        properties.spiritual_path_category as path
      FROM events 
      WHERE event = 'spiritual_engagement'
      ${communityId ? `AND properties.community_id = '${communityId}'` : ''}
      AND timestamp > now() - interval 30 day
      GROUP BY chakra, path
      ORDER BY activity_count DESC
    `;

    const results = await this.posthog.query(query);
    return this.transformToSpiritualInsights(results);
  }
}
```

### Bunny.net Video Integration

#### Spiritual Video Content Delivery
```typescript
// Bunny.net CDN for spiritual video content
export class SpiritualVideoService {
  private bunnyApi: BunnyApi;

  async uploadSpiritualVideo(
    videoBuffer: Buffer, 
    metadata: SpiritualVideoMetadata
  ): Promise<VideoUploadResult> {
    // Upload to Bunny.net storage
    const fileName = this.generateSpiritualVideoName(metadata);
    
    const uploadResult = await fetch(`https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${fileName}`, {
      method: 'PUT',
      headers: {
        'AccessKey': process.env.BUNNY_STORAGE_API_KEY!,
        'Content-Type': 'video/mp4'
      },
      body: videoBuffer
    });

    if (!uploadResult.ok) {
      throw new Error('Failed to upload spiritual video');
    }

    // Create video library entry with spiritual metadata
    const videoLibraryEntry = await this.createVideoLibraryEntry({
      fileName: fileName,
      title: metadata.title,
      chakra: metadata.chakra,
      spiritualCategory: metadata.category,
      guidedMeditation: metadata.isGuidedMeditation,
      energyLevel: metadata.energyLevel
    });

    return {
      videoId: videoLibraryEntry.guid,
      playbackUrl: `https://${process.env.BUNNY_CDN_HOSTNAME}/${fileName}`,
      thumbnailUrl: await this.generateSpiritualThumbnail(videoLibraryEntry.guid),
      streamingUrls: this.generateStreamingUrls(videoLibraryEntry.guid)
    };
  }

  private async createVideoLibraryEntry(videoData: any): Promise<any> {
    const response = await fetch(`https://video.bunnycdn.com/library/${process.env.BUNNY_VIDEO_LIBRARY_ID}/videos`, {
      method: 'POST',
      headers: {
        'AccessKey': process.env.BUNNY_VIDEO_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: videoData.title,
        collectionId: this.getSpiritualCollectionId(videoData.chakra),
        chapters: videoData.guidedMeditation ? this.createMeditationChapters() : undefined
      })
    });

    return response.json();
  }

  async getVideoAnalytics(videoId: string, timeframe: string): Promise<SpiritualVideoAnalytics> {
    const analytics = await fetch(`https://video.bunnycdn.com/library/${process.env.BUNNY_VIDEO_LIBRARY_ID}/videos/${videoId}/statistics`, {
      headers: { 'AccessKey': process.env.BUNNY_VIDEO_API_KEY! }
    });

    const data = await analytics.json();
    
    return {
      totalViews: data.totalViews,
      watchTime: data.totalWatchTime,
      spiritualEngagement: this.calculateSpiritualEngagement(data),
      chakraResonance: await this.analyzeChakraResonance(videoId),
      communityFeedback: await this.getCommunityVideoFeedback(videoId)
    };
  }
}
```

---

*Ready to contribute to the spiritual tech revolution? Start coding and may your commits be blessed with clean code and bug-free deployments!* ✨