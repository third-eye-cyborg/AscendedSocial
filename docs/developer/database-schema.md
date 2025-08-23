# Database Schema Reference

Complete reference for the Ascended Social PostgreSQL database schema, implemented using Drizzle ORM with full TypeScript integration.

## 📊 Schema Overview

The database is designed around spiritual community interactions, user growth tracking, and AI-powered features. All schemas are defined in `shared/schema.ts` for type safety across frontend and backend.

### Core Design Principles
- **Spiritual-First**: Schema reflects spiritual concepts (chakras, aura, spirit guides)
- **Type Safety**: Full TypeScript integration with Drizzle ORM
- **Scalability**: Optimized for community growth and engagement
- **Audit Trail**: Track spiritual growth and community interactions
- **Privacy**: Secure handling of user data and spiritual information

## 👥 User Management Tables

### users
Core user profiles and spiritual attributes.

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE,
  firstName VARCHAR,
  lastName VARCHAR,
  profileImage TEXT, -- Sigil data or image URL
  isPremium BOOLEAN DEFAULT FALSE,
  energy INTEGER DEFAULT 1000, -- Monthly spiritual energy allocation
  energyLastReset TIMESTAMP DEFAULT NOW(),
  aura INTEGER DEFAULT 0, -- Spiritual aura points accumulated
  hasCompletedOnboarding BOOLEAN DEFAULT FALSE,
  birthDate DATE,
  astrologySign VARCHAR,
  stripeCustomerId VARCHAR,
  stripeSubscriptionId VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Key Features
- **Spiritual Energy**: Monthly allocation of 1,000 energy points
- **Aura System**: Accumulated spiritual influence points
- **Premium Status**: Subscription-based feature access
- **Spiritual Profile**: Astrology and spiritual preferences
- **Stripe Integration**: Payment and subscription management

#### Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_premium ON users(isPremium);
CREATE INDEX idx_users_energy_reset ON users(energyLastReset);
```

### subscriptions
Premium subscription management and billing.

```sql
CREATE TABLE subscriptions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  userId VARCHAR NOT NULL REFERENCES users(id),
  type VARCHAR NOT NULL DEFAULT 'premium', -- Subscription type
  status VARCHAR NOT NULL, -- active, canceled, past_due, etc.
  currentPeriodStart TIMESTAMP,
  currentPeriodEnd TIMESTAMP,
  stripeSubscriptionId VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🌟 Spiritual System Tables

### spirits
AI-generated spirit guides that evolve with user engagement.

```sql
CREATE TABLE spirits (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  userId VARCHAR NOT NULL REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  element VARCHAR, -- fire, water, earth, air
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  questionnaire JSONB, -- Original spiritual assessment answers
  evolution JSONB DEFAULT '[]', -- Array tracking growth milestones
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Spirit Evolution System
```typescript
// Evolution entry structure stored in JSONB
interface EvolutionEntry {
  timestamp: string;
  action: string; // 'like_engagement', 'energy_share', etc.
  experienceGain: number;
  newExperience: number;
  newLevel: number;
  leveledUp: boolean;
}

// Questionnaire structure for spirit generation
interface SpiritQuestionnaire {
  isReligious: boolean;
  isSpiritual: boolean;
  religion?: string;
  spiritualPath?: string;
  beliefs: string;
  offerings: string;
  astrologySign: string;
  timestamp: string;
}
```

#### Key Features
- **Elemental Alignment**: Spirit guides aligned with Fire, Water, Earth, or Air
- **Experience System**: 100 XP per level, gained through community engagement
- **Evolution Tracking**: Complete history of spiritual growth milestones
- **AI Generation**: Created based on user's spiritual questionnaire

#### Indexes
```sql
CREATE INDEX idx_spirits_user ON spirits(userId);
CREATE INDEX idx_spirits_element ON spirits(element);
CREATE INDEX idx_spirits_level ON spirits(level);
```

### spiritualReadings
Oracle system providing daily guidance and tarot readings.

```sql
CREATE TABLE spiritualReadings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  userId VARCHAR NOT NULL REFERENCES users(id),
  type VARCHAR NOT NULL, -- daily, tarot, custom
  content TEXT NOT NULL,
  metadata JSONB, -- Reading-specific data (cards, symbols, etc.)
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Reading Types and Metadata

**Daily Reading Metadata**
```typescript
interface DailyReadingMetadata {
  title: string;
  card: string; // Associated tarot or oracle card
  symbols: string[]; // Spiritual symbols for meditation
  guidance: string; // Practical application advice
}
```

**Tarot Reading Metadata**
```typescript
interface TarotReadingMetadata {
  question: string;
  cards: Array<{
    name: string;
    meaning: string;
    position: 'past' | 'present' | 'future';
  }>;
  interpretation: string;
  guidance: string;
}
```

#### Indexes
```sql
CREATE INDEX idx_readings_user ON spiritualReadings(userId);
CREATE INDEX idx_readings_type ON spiritualReadings(type);
CREATE INDEX idx_readings_date ON spiritualReadings(createdAt);
```

## 📝 Content Management Tables

### posts
User-generated spiritual content with AI categorization.

```sql
CREATE TABLE posts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  authorId VARCHAR NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  mediaUrl TEXT, -- Optional image/video URL
  chakra VARCHAR, -- AI-determined chakra alignment
  frequency DECIMAL, -- Spiritual frequency score (1-10)
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Chakra System
Posts are automatically categorized into seven chakra types:
- **root**: Grounding, survival, basic needs
- **sacral**: Creativity, sexuality, relationships
- **solar**: Personal power, confidence, identity
- **heart**: Love, compassion, connection
- **throat**: Communication, truth, expression
- **third_eye**: Intuition, wisdom, spiritual insight
- **crown**: Divine connection, enlightenment, transcendence

#### Spiritual Frequency
AI-generated score (1-10) representing:
- Content spiritual depth and authenticity
- Potential for community resonance
- Alignment with spiritual growth principles
- Quality of spiritual insight or teaching

#### Indexes
```sql
CREATE INDEX idx_posts_author ON posts(authorId);
CREATE INDEX idx_posts_chakra ON posts(chakra);
CREATE INDEX idx_posts_frequency ON posts(frequency);
CREATE INDEX idx_posts_created ON posts(createdAt);
```

### comments
Nested spiritual discussions on posts.

```sql
CREATE TABLE comments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  postId VARCHAR NOT NULL REFERENCES posts(id),
  authorId VARCHAR NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Features
- **Spiritual Discussion**: Facilitate meaningful spiritual conversations
- **Community Support**: Encourage supportive spiritual community
- **Growth Tracking**: Comments contribute to spirit guide experience
- **Moderation**: Content guidelines ensure positive spiritual environment

#### Indexes
```sql
CREATE INDEX idx_comments_post ON comments(postId);
CREATE INDEX idx_comments_author ON comments(authorId);
CREATE INDEX idx_comments_created ON comments(createdAt);
```

## ❤️ Engagement System Tables

### postEngagements
Track all forms of spiritual engagement with content.

```sql
CREATE TABLE postEngagements (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  postId VARCHAR NOT NULL REFERENCES posts(id),
  userId VARCHAR NOT NULL REFERENCES users(id),
  type VARCHAR NOT NULL, -- like, upvote, energy, downvote
  energyAmount INTEGER, -- Amount spent for energy engagements
  createdAt TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(postId, userId, type) -- Prevent duplicate engagements
);
```

#### Engagement Types

**Free Engagements**
- **like**: Basic appreciation (+5 Spirit XP)
- **upvote**: Quality content recognition (+10 Spirit XP)
- **downvote**: Constructive feedback (+2 Spirit XP)

**Energy Engagements** (Cost: 10 Energy Points)
- **energy**: Deep spiritual resonance (+20 Spirit XP)

#### Unique Constraint
Users can only have one engagement of each type per post, preventing spam while allowing multiple engagement types.

#### Indexes
```sql
CREATE INDEX idx_engagements_post ON postEngagements(postId);
CREATE INDEX idx_engagements_user ON postEngagements(userId);
CREATE INDEX idx_engagements_type ON postEngagements(type);
CREATE UNIQUE INDEX idx_engagements_unique ON postEngagements(postId, userId, type);
```

## 🔔 Communication Tables

### notifications
System and community notifications for users.

```sql
CREATE TABLE notifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  userId VARCHAR NOT NULL REFERENCES users(id),
  type VARCHAR NOT NULL, -- engagement, comment, milestone, system
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  triggerUserId VARCHAR REFERENCES users(id), -- User who triggered notification
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Notification Types

**Community Notifications**
- **engagement**: Someone engaged with your post
- **comment**: Someone commented on your post
- **follow**: Someone followed you
- **mention**: Someone mentioned you in a post or comment

**System Notifications**
- **milestone**: Spirit guide level up or achievement
- **energy_reset**: Monthly energy allocation refresh
- **subscription**: Premium subscription changes
- **system**: Important platform announcements

**Spiritual Notifications**
- **daily_reading**: New daily Oracle reading available
- **community_event**: Spiritual community events and gatherings
- **growth_suggestion**: Personalized spiritual growth recommendations

#### Indexes
```sql
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(isRead);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(createdAt);
```

## 🤝 Social Connection Tables

### connections
Spiritual connections and relationships between users.

```sql
CREATE TABLE connections (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  requesterId VARCHAR NOT NULL REFERENCES users(id),
  requestedId VARCHAR NOT NULL REFERENCES users(id),
  status VARCHAR NOT NULL DEFAULT 'pending', -- pending, accepted, declined, blocked
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(requesterId, requestedId)
);
```

#### Connection Status Flow
1. **pending**: Initial connection request sent
2. **accepted**: Both parties connected, enhanced features available
3. **declined**: Request rejected, can be sent again later
4. **blocked**: Permanent block, prevents future connection attempts

#### Enhanced Features for Connected Users
- **Priority Feed**: Connected users' content appears more prominently
- **Direct Messaging**: Private spiritual discussions
- **Shared Experiences**: Joint spiritual practices and reflections
- **Energy Bonuses**: Enhanced energy sharing between connected users

#### Indexes
```sql
CREATE INDEX idx_connections_requester ON connections(requesterId);
CREATE INDEX idx_connections_requested ON connections(requestedId);
CREATE INDEX idx_connections_status ON connections(status);
CREATE UNIQUE INDEX idx_connections_unique ON connections(requesterId, requestedId);
```

### spiritualInteractions
Track deeper spiritual interactions between community members.

```sql
CREATE TABLE spiritualInteractions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  fromUserId VARCHAR NOT NULL REFERENCES users(id),
  toUserId VARCHAR NOT NULL REFERENCES users(id),
  type VARCHAR NOT NULL, -- energy_share, spiritual_bond, mentor_guidance
  metadata JSONB, -- Interaction-specific data
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Interaction Types

**Energy Interactions**
- **energy_share**: Direct spiritual energy sharing between users
- **energy_amplification**: Boosting another user's spiritual content
- **collective_energy**: Participation in group energy work

**Spiritual Bonding**
- **spiritual_bond**: Deep spiritual connection formation
- **mentor_guidance**: Formal spiritual mentorship interactions
- **peer_support**: Mutual spiritual support and encouragement

#### Metadata Examples
```typescript
// Energy sharing metadata
interface EnergyShareMetadata {
  energyAmount: number;
  intention: string;
  context: 'post' | 'direct' | 'group_event';
}

// Mentorship metadata
interface MentorshipMetadata {
  sessionType: 'guidance' | 'practice' | 'discussion';
  topic: string;
  duration?: number; // minutes
}
```

#### Indexes
```sql
CREATE INDEX idx_interactions_from ON spiritualInteractions(fromUserId);
CREATE INDEX idx_interactions_to ON spiritualInteractions(toUserId);
CREATE INDEX idx_interactions_type ON spiritualInteractions(type);
CREATE INDEX idx_interactions_created ON spiritualInteractions(createdAt);
```

## 🗄️ Session Management

### sessions
Server-side session storage for authentication.

```sql
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
```

#### Session Data Structure
```typescript
interface SessionData {
  passport: {
    user: {
      claims: {
        sub: string; // User ID
        email: string;
        username?: string;
      }
    }
  };
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
}
```

#### Features
- **Automatic Cleanup**: Expired sessions automatically removed
- **Security**: HTTP-only cookies, CSRF protection
- **Persistence**: 30-day session duration with renewal
- **Tracking**: Last activity and security information

#### Indexes
```sql
CREATE INDEX idx_sessions_expire ON sessions(expire);
```

## 🔄 Data Relationships

### Entity Relationship Diagram
```
users (1) ←→ (1) spirits
  │
  ├─→ (1:N) posts
  ├─→ (1:N) comments
  ├─→ (1:N) postEngagements
  ├─→ (1:N) spiritualReadings
  ├─→ (1:N) notifications
  └─→ (1:N) subscriptions

posts (1) ←→ (N) comments
posts (1) ←→ (N) postEngagements

users (N) ←→ (N) connections [self-referential]
users (N) ←→ (N) spiritualInteractions [self-referential]
```

### Cascade Behaviors
- **User Deletion**: CASCADE to spirits, posts, comments, engagements
- **Post Deletion**: CASCADE to comments and engagements
- **Spirit Updates**: Trigger experience recalculation
- **Energy Updates**: Validate sufficient energy before engagement

## 📈 Performance Considerations

### Indexing Strategy

#### Primary Indexes
- All foreign keys automatically indexed
- Composite indexes for common query patterns
- Partial indexes for filtered queries

#### Query-Specific Indexes
```sql
-- Feed queries: posts by creation date and chakra
CREATE INDEX idx_posts_feed ON posts(createdAt DESC, chakra);

-- User spiritual stats: engagements by user and type
CREATE INDEX idx_engagements_user_stats ON postEngagements(userId, type, createdAt);

-- Spirit evolution: spirits by level and experience
CREATE INDEX idx_spirits_evolution ON spirits(level DESC, experience DESC);

-- Notification queries: unread notifications by user
CREATE INDEX idx_notifications_unread ON notifications(userId, isRead, createdAt);
```

#### JSONB Indexes
```sql
-- Spirit evolution history queries
CREATE INDEX idx_spirits_evolution_gin ON spirits USING GIN(evolution);

-- Reading metadata searches
CREATE INDEX idx_readings_metadata_gin ON spiritualReadings USING GIN(metadata);

-- Spiritual interaction metadata
CREATE INDEX idx_interactions_metadata_gin ON spiritualInteractions USING GIN(metadata);
```

### Data Archiving
- **Old Sessions**: Automatic cleanup of expired sessions
- **Notification History**: Archive read notifications older than 6 months
- **Evolution History**: Compress old spirit evolution entries
- **Engagement Archives**: Move old engagement data to cold storage

## 🔧 Schema Migrations

### Migration Strategy
Using Drizzle Kit for type-safe schema evolution:

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:push

# Force apply migrations (data loss possible)
npm run db:push --force
```

### Migration Best Practices
1. **Backward Compatibility**: New columns should be nullable or have defaults
2. **Data Migration**: Use separate scripts for data transformations
3. **Index Management**: Add indexes after data migration for performance
4. **Testing**: Validate migrations on staging before production
5. **Rollback Plan**: Always have rollback procedures for critical changes

### Schema Versioning
```typescript
// Track schema version for compatibility
export const SCHEMA_VERSION = '2024.01.15.001';

// Migration metadata
interface Migration {
  version: string;
  description: string;
  timestamp: Date;
  checksum: string;
}
```

---

*This schema supports authentic spiritual community growth while maintaining the technical foundation for a scalable, performant platform. Each table and relationship serves the higher purpose of facilitating genuine spiritual connection and personal evolution.* 📊✨