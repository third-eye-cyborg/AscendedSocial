# Architecture Overview

Ascended Social is built as a modern full-stack web application with a focus on real-time spiritual community features, AI integration, and scalable user growth.

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│   React Client  │◄──►│  Express Server  │◄──►│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)      │    │   (Database)    │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │                  │
                    │   External APIs  │
                    │ • OpenAI API     │
                    │ • Stripe API     │
                    │ • Replit Auth    │
                    │ • Object Storage │
                    │                  │
                    └──────────────────┘
```

### Technology Stack

#### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety across the application
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching

#### Backend Stack
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Type-safe database operations
- **Passport.js**: Authentication middleware
- **express-session**: Session management

#### Database & Storage
- **PostgreSQL**: Primary relational database
- **Neon**: Serverless PostgreSQL hosting
- **Google Cloud Storage**: Object storage for media files
- **Replit Object Storage**: Alternative object storage solution

#### External Integrations
- **OpenAI API**: AI-powered features (spirits, oracle, tarot)
- **Stripe**: Payment processing for subscriptions
- **Replit Auth**: OpenID Connect authentication
- **Resend**: Email service for notifications

## 🎯 Core Design Principles

### Spiritual-First Design
Every technical decision considers the spiritual user experience:
- **Meaningful Interactions**: Technology serves spiritual connection, not engagement metrics
- **Authentic Growth**: Systems encourage genuine spiritual development over gamification
- **Community Harmony**: Features foster supportive community dynamics
- **Mystical Aesthetics**: Visual design reflects spiritual themes and cosmic energy

### Type Safety
End-to-end type safety from database to UI:
- **Shared Types**: Single source of truth in `shared/schema.ts`
- **Database Types**: Drizzle generates types from schema
- **API Types**: Request/response types shared between client and server
- **Component Props**: All React components fully typed

### Performance Optimization
Built for scale while maintaining spiritual focus:
- **Efficient Queries**: Optimized database operations with Drizzle
- **Client-Side Caching**: TanStack Query reduces unnecessary requests
- **Code Splitting**: Dynamic imports for better initial load times
- **Image Optimization**: Responsive images and proper formats

### Security by Design
Comprehensive security throughout the application:
- **Authentication**: OpenID Connect with session management
- **Authorization**: Role-based access control
- **Data Validation**: Input validation on client and server
- **SQL Injection Prevention**: Parameterized queries with Drizzle

## 📊 Data Architecture

### Database Schema Design

#### Core Entities
```sql
-- User management and spiritual profiles
users (id, email, username, energy, aura, isPremium, ...)
spirits (id, userId, name, element, level, experience, evolution, ...)
subscriptions (id, userId, stripeSubscriptionId, status, ...)

-- Content and community
posts (id, authorId, content, mediaUrl, chakra, frequency, ...)
comments (id, postId, authorId, content, ...)
postEngagements (id, postId, userId, type, energyAmount, ...)

-- Spiritual features
spiritualReadings (id, userId, type, content, metadata, ...)
notifications (id, userId, type, title, message, ...)

-- Connection system
connections (id, requesterId, requestedId, status, ...)
spiritualInteractions (id, fromUserId, toUserId, type, metadata, ...)
```

#### Relationship Design
- **One-to-One**: User ↔ Spirit (each user has exactly one spirit guide)
- **One-to-Many**: User → Posts, User → Comments, User → Engagements
- **Many-to-Many**: Users ↔ Users (via connections table)
- **Hierarchical**: Posts → Comments (nested spiritual discussions)

### Data Flow Patterns

#### Read Operations
```
Client Request → TanStack Query Cache Check → API Route → Storage Layer → Database → Response
```

#### Write Operations
```
Client Mutation → Validation → API Route → Storage Layer → Database → Cache Invalidation → UI Update
```

#### Real-time Updates
```
User Action → Database Update → Cache Invalidation → UI Refresh (via Query Invalidation)
```

## 🔄 API Architecture

### RESTful Design
Clean, predictable API structure:

#### Resource-Based Routes
```
GET    /api/posts          # List posts
POST   /api/posts          # Create post
GET    /api/posts/:id      # Get specific post
PUT    /api/posts/:id      # Update post
DELETE /api/posts/:id      # Delete post

POST   /api/posts/:id/engage     # Engage with post
DELETE /api/posts/:id/engage/:type # Remove engagement
GET    /api/posts/:id/comments   # Get post comments
```

#### Spiritual Feature Routes
```
GET    /api/spirit               # Get user's spirit guide
PUT    /api/spirit/experience    # Update spirit experience
GET    /api/readings/daily       # Daily spiritual reading
POST   /api/readings/tarot       # Generate tarot reading
GET    /api/oracle/recommendations # AI recommendations
```

### Error Handling Strategy
Consistent error responses across all endpoints:

#### Error Response Format
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation details if applicable"
  }
}
```

#### Error Categories
- **Authentication Errors** (401): Invalid or expired sessions
- **Authorization Errors** (403): Insufficient permissions
- **Validation Errors** (400): Invalid request data
- **Business Logic Errors** (400): Insufficient energy, premium required
- **System Errors** (500): Database, AI service, or external API failures

## 🤖 AI Integration Architecture

### OpenAI Integration Patterns

#### AI Service Layer
```typescript
// Centralized AI operations in server/openai.ts
export async function generateSpirit(questionnaire: SpiritualQuestionnaire): Promise<Spirit>
export async function generateDailyReading(): Promise<SpiritualReading>
export async function generateTarotReading(question: string): Promise<TarotReading>
export async function categorizePostByChakra(content: string): Promise<ChakraType>
```

#### AI Response Handling
```typescript
// Structured prompts for consistent AI responses
const prompt = `Generate a spiritual reading with this JSON structure: 
{ "title": "Reading title", "content": "Main content", "guidance": "Practical advice" }`;

// Error handling and fallbacks
try {
  const aiResponse = await openai.chat.completions.create(/* ... */);
  const parsed = JSON.parse(aiResponse.choices[0].message.content);
  return validateAIResponse(parsed);
} catch (error) {
  return getFallbackResponse();
}
```

### AI Cost Management
- **Response Caching**: Cache AI responses to reduce API calls
- **Smart Retries**: Exponential backoff for transient failures
- **Cost Monitoring**: Track OpenAI API usage and costs
- **Fallback Content**: Graceful degradation when AI services are unavailable

## 🔐 Authentication & Authorization

### Authentication Flow
```
User → Replit Auth → JWT Token → Server Validation → Session Creation → Database Storage
```

#### Session Management
- **Storage**: PostgreSQL with connect-pg-simple
- **Duration**: 30-day sessions with automatic renewal
- **Security**: HTTP-only cookies, CSRF protection
- **Cleanup**: Automatic removal of expired sessions

### Authorization Patterns

#### Role-Based Access Control
```typescript
// Middleware for protected routes
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};

// Premium feature protection
const requiresPremium = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user.isPremium) return res.status(403).json({ message: "Premium required" });
  next();
};
```

#### Resource-Level Authorization
- **Post Ownership**: Users can only edit/delete their own posts
- **Spirit Access**: Users can only access their own spirit guide
- **Energy Validation**: Prevent users from spending more energy than available
- **Premium Features**: Restrict advanced features to paying subscribers

## 🎨 Frontend Architecture

### Component Architecture

#### Component Hierarchy
```
App
├── Router
├── Layout
│   ├── Header (Navigation, User Menu)
│   ├── Sidebar (Navigation, Spirit Guide, Energy)
│   └── Main Content Area
└── Pages
    ├── Home (Feed, Posts, Engagement)
    ├── Profile (User Info, Spirit Guide, Stats)
    ├── Oracle (Daily Readings, Tarot, Recommendations)
    ├── Spirit (Spirit Guide Details, Evolution)
    └── Energy (Energy Management, Usage Analytics)
```

#### Component Types
- **Pages**: Route-level components with data fetching
- **Layouts**: Structural components for consistent UI
- **Features**: Complex business logic components
- **UI Components**: Reusable design system components
- **Hooks**: Custom React hooks for shared logic

### State Management Strategy

#### Server State (TanStack Query)
```typescript
// User's spirit guide data
const { data: spirit } = useQuery<Spirit>({
  queryKey: ["/api/spirit"],
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Optimistic updates for engagements
const engageMutation = useMutation({
  mutationFn: (data) => apiRequest("POST", `/api/posts/${postId}/engage`, data),
  onMutate: async (newEngagement) => {
    // Optimistically update UI
    queryClient.setQueryData(["/api/posts", postId], (old) => ({...}));
  },
});
```

#### Client State (React Hooks)
- **UI State**: Modal visibility, form state, temporary selections
- **User Preferences**: Theme, layout preferences, notification settings
- **Temporary Data**: Form inputs, draft posts, unsaved changes

### Routing Strategy
```typescript
// Clean route structure with wouter
<Route path="/" component={Home} />
<Route path="/profile/:userId" component={Profile} />
<Route path="/spirit" component={SpiritPage} />
<Route path="/energy" component={EnergyPage} />
<Route path="/oracle" component={Oracle} />
```

## 📈 Performance Architecture

### Caching Strategy

#### Client-Side Caching (TanStack Query)
- **Stale-While-Revalidate**: Serve cached data while fetching updates
- **Cache Invalidation**: Smart invalidation based on user actions
- **Background Updates**: Automatic data refresh for active tabs
- **Offline Support**: Graceful degradation when offline

#### Server-Side Caching
- **Database Query Caching**: Drizzle query result caching
- **AI Response Caching**: Cache OpenAI responses for common queries
- **Session Caching**: In-memory session cache for frequently accessed users
- **Static Asset Caching**: CDN caching for images and media

### Database Optimization

#### Query Optimization
```typescript
// Efficient joins to reduce N+1 queries
const postsWithAuthors = await db
  .select({
    post: posts,
    author: users,
    engagementCounts: sql<number>`count(${postEngagements.id})`.as('engagementCounts')
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(postEngagements, eq(posts.id, postEngagements.postId))
  .groupBy(posts.id, users.id)
  .limit(20);
```

#### Indexing Strategy
- **Primary Keys**: Automatic B-tree indexes
- **Foreign Keys**: Indexes on all relationship columns
- **Query-Specific**: Indexes on frequently filtered/sorted columns
- **Composite Indexes**: Multi-column indexes for complex queries

## 🔧 Development Architecture

### Code Organization
```
ascended-social/
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configuration
│   └── assets/         # Static assets and images
├── server/
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Database operations layer
│   ├── openai.ts       # AI integration services
│   └── index.ts        # Server entry point
├── shared/
│   └── schema.ts       # Shared types and database schema
└── docs/               # Comprehensive documentation
```

### Build and Deployment

#### Development Workflow
1. **Local Development**: `npm run dev` starts both client and server
2. **Type Checking**: Continuous TypeScript validation
3. **Hot Reloading**: Instant feedback for code changes
4. **Database Sync**: `npm run db:push` syncs schema changes

#### Production Build
```bash
# Build optimized client bundle
npm run build:client

# Start production server
npm start

# Database migrations in production
npm run db:push
```

### Testing Strategy

#### Unit Tests
- **Pure Functions**: Utility functions and business logic
- **Components**: React component behavior and props
- **API Routes**: Request/response handling and validation
- **Database Operations**: Storage layer functionality

#### Integration Tests
- **API Endpoints**: Full request/response cycles
- **Authentication Flow**: Login and session management
- **AI Integration**: OpenAI API interactions with mocks
- **Payment Processing**: Stripe integration testing

#### End-to-End Tests
- **User Journeys**: Complete user flows from signup to engagement
- **Spiritual Features**: Spirit evolution and energy system
- **Community Interactions**: Post creation, engagement, and comments
- **Premium Features**: Subscription and premium functionality

---

*This architecture balances technical excellence with spiritual purpose, creating a platform that serves authentic spiritual growth while maintaining the performance and reliability users expect from modern web applications.* 🏗️✨