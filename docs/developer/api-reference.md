# API Reference

Complete reference for all Ascended Social API endpoints.

## 🔐 Authentication

All authenticated endpoints require a valid session. Authentication is handled through Replit Auth.

### Session Management
- **Session Storage**: PostgreSQL with `connect-pg-simple`
- **Session Duration**: 30 days
- **Cookie Name**: `connect.sid`
- **Authentication Required**: Indicated by `🔒` in endpoint descriptions

## 🌟 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 📡 Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Standard HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 👤 Authentication Endpoints

### Get Current User 🔒
Get information about the currently authenticated user.

```http
GET /api/auth/user
```

**Response:**
```json
{
  "id": "25531750",
  "email": "user@example.com",
  "username": "spiritual_seeker",
  "isPremium": false,
  "energy": 850,
  "aura": 120,
  "hasCompletedOnboarding": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Logout User 🔒
End the current user session.

```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

---

## 📝 Posts Endpoints

### List Posts
Retrieve a paginated list of posts from the community feed.

```http
GET /api/posts?limit=20&offset=0&chakra=all&sort=recent
```

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 20, max: 100)
- `offset` (optional): Number of posts to skip (default: 0)
- `chakra` (optional): Filter by chakra type (`root`, `sacral`, `solar`, `heart`, `throat`, `third_eye`, `crown`, `all`)
- `sort` (optional): Sort order (`recent`, `popular`, `energy`)

**Response:**
```json
[
  {
    "id": "post-uuid",
    "content": "Sharing my morning meditation insights...",
    "mediaUrl": "https://storage.googleapis.com/image.jpg",
    "chakra": "heart",
    "frequency": 8.5,
    "author": {
      "id": "user-id",
      "username": "meditation_master",
      "profileImage": "sigil-data"
    },
    "engagements": {
      "likes": 15,
      "upvotes": 8,
      "energy": 3,
      "comments": 5
    },
    "createdAt": "2024-01-15T14:20:00Z"
  }
]
```

### Get Single Post
Retrieve details for a specific post.

```http
GET /api/posts/:postId
```

**Response:**
```json
{
  "id": "post-uuid",
  "content": "Deep dive into chakra alignment...",
  "mediaUrl": null,
  "chakra": "third_eye",
  "frequency": 9.2,
  "author": { ... },
  "engagements": { ... },
  "comments": [
    {
      "id": "comment-uuid",
      "content": "This resonates deeply with my journey",
      "author": { ... },
      "createdAt": "2024-01-15T15:30:00Z"
    }
  ],
  "createdAt": "2024-01-15T14:20:00Z"
}
```

### Create Post 🔒
Create a new post in the community feed.

```http
POST /api/posts
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Today's spiritual insight: The universe speaks through synchronicity...",
  "mediaUrl": "https://storage.googleapis.com/optional-image.jpg"
}
```

**Response:**
```json
{
  "id": "new-post-uuid",
  "content": "Today's spiritual insight...",
  "chakra": "crown",
  "frequency": 7.8,
  "author": { ... },
  "createdAt": "2024-01-15T16:45:00Z"
}
```

---

## ❤️ Engagement Endpoints

### Engage with Post 🔒
Like, upvote, or share energy with a post.

```http
POST /api/posts/:postId/engage
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "energy"  // "like", "upvote", "energy", "downvote"
}
```

**Response:**
```json
{
  "id": "engagement-uuid",
  "postId": "post-uuid",
  "userId": "user-id",
  "type": "energy",
  "energyAmount": 10,
  "createdAt": "2024-01-15T17:00:00Z"
}
```

### Remove Engagement 🔒
Remove a previous engagement from a post.

```http
DELETE /api/posts/:postId/engage/:engagementType
```

**Response:**
```json
{
  "message": "Engagement removed successfully"
}
```

### Get User Engagement 🔒
Check current user's engagement with a specific post.

```http
GET /api/posts/:postId/engage/user
```

**Response:**
```json
{
  "engagements": ["like", "upvote"]
}
```

---

## 💬 Comments Endpoints

### Get Post Comments
Retrieve comments for a specific post.

```http
GET /api/posts/:postId/comments
```

**Response:**
```json
[
  {
    "id": "comment-uuid",
    "content": "Beautiful insight, thank you for sharing",
    "author": {
      "id": "user-id",
      "username": "wise_soul",
      "profileImage": "sigil-data"
    },
    "createdAt": "2024-01-15T18:15:00Z"
  }
]
```

### Create Comment 🔒
Add a comment to a post.

```http
POST /api/posts/:postId/comments
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This perfectly captures my experience with morning meditation"
}
```

**Response:**
```json
{
  "id": "new-comment-uuid",
  "content": "This perfectly captures my experience...",
  "author": { ... },
  "postId": "post-uuid",
  "createdAt": "2024-01-15T18:30:00Z"
}
```

---

## 🔮 Spirit Guide Endpoints

### Get User's Spirit 🔒
Retrieve the current user's spirit guide information.

```http
GET /api/spirit
```

**Response:**
```json
{
  "id": "spirit-uuid",
  "name": "Lumina Stardancer",
  "description": "A wise guide who dances between worlds, bringing clarity to complex spiritual matters.",
  "element": "air",
  "level": 7,
  "experience": 650,
  "questionnaire": {
    "isReligious": false,
    "isSpiritual": true,
    "spiritualPath": "meditation",
    "beliefs": "Everything is connected through universal energy",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "evolution": [
    {
      "timestamp": "2024-01-15T12:00:00Z",
      "action": "like_engagement",
      "experienceGain": 5,
      "newExperience": 645,
      "newLevel": 7,
      "leveledUp": false
    },
    {
      "timestamp": "2024-01-15T14:30:00Z",
      "action": "energy_engagement",
      "experienceGain": 20,
      "newExperience": 665,
      "newLevel": 7,
      "leveledUp": false
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

---

## 🌟 Oracle & Readings Endpoints

### Get Daily Reading 🔒
Retrieve the user's daily spiritual reading.

```http
GET /api/readings/daily
```

**Response:**
```json
{
  "id": "reading-uuid",
  "type": "daily",
  "content": "Today's energy calls for introspection and patience. The universe is aligning opportunities that require careful consideration...",
  "metadata": {
    "title": "Patience and Reflection",
    "card": "The Hermit",
    "symbols": ["lantern", "mountain", "star"],
    "guidance": "Trust in divine timing and inner wisdom"
  },
  "createdAt": "2024-01-15T06:00:00Z"
}
```

### Generate Tarot Reading 🔒 💎
Generate a three-card tarot reading (Premium feature).

```http
POST /api/readings/tarot
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What guidance do I need for my spiritual growth this month?"
}
```

**Response:**
```json
{
  "id": "tarot-reading-uuid",
  "type": "tarot",
  "content": "Your tarot reading reveals a journey of transformation...",
  "metadata": {
    "question": "What guidance do I need for my spiritual growth this month?",
    "cards": [
      {
        "name": "The Fool",
        "meaning": "New beginnings and spiritual awakening",
        "position": "past"
      },
      {
        "name": "The Star",
        "meaning": "Hope, guidance, and cosmic connection",
        "position": "present"
      },
      {
        "name": "The Sun",
        "meaning": "Joy, success, and spiritual fulfillment",
        "position": "future"
      }
    ],
    "interpretation": "Your past experiences of taking spiritual leaps of faith have led you to a present moment of divine guidance...",
    "guidance": "Trust in your journey and remain open to the universe's abundant blessings"
  },
  "createdAt": "2024-01-15T19:00:00Z"
}
```

### Get Oracle Recommendations 🔒
Get personalized spiritual content recommendations.

```http
GET /api/oracle/recommendations?limit=5
```

**Query Parameters:**
- `limit` (optional): Number of recommendations (default: 5, max: 20)

**Response:**
```json
[
  {
    "title": "Awakening Your Inner Light",
    "description": "Explore techniques for connecting with your authentic spiritual essence",
    "type": "insight",
    "chakra": "crown",
    "relevanceScore": 9.2
  },
  {
    "title": "Grounding Practices for Air Signs",
    "description": "Specific meditation techniques for those with air element spirits",
    "type": "practice",
    "chakra": "root",
    "relevanceScore": 8.7
  }
]
```

---

## 👥 User & Social Endpoints

### Get User Stats 🔒
Retrieve statistics for a specific user.

```http
GET /api/users/:userId/stats
```

**Response:**
```json
{
  "totalPosts": 24,
  "totalEngagements": 156,
  "positiveEnergy": 89,
  "auraLevel": 3,
  "spiritLevel": 7,
  "joinedAt": "2024-01-01T00:00:00Z"
}
```

### Get User Profile
Retrieve public profile information for a user.

```http
GET /api/users/:userId
```

**Response:**
```json
{
  "id": "user-id",
  "username": "cosmic_wanderer",
  "profileImage": "sigil-data",
  "auraLevel": 3,
  "spiritName": "Luna Dreamweaver",
  "joinedAt": "2024-01-01T00:00:00Z",
  "stats": {
    "totalPosts": 24,
    "positiveEnergy": 89
  }
}
```

### Get User Posts
Retrieve posts created by a specific user.

```http
GET /api/users/:userId/posts?limit=20&offset=0
```

**Response:**
```json
[
  {
    "id": "post-uuid",
    "content": "Post content...",
    "chakra": "heart",
    "frequency": 8.2,
    "engagements": { ... },
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

---

## 🔍 Search Endpoints

### Search Content
Search for posts, users, and spiritual content across the platform.

```http
GET /api/search?query=meditation&type=all&limit=20
```

**Query Parameters:**
- `query` (required): Search term (minimum 2 characters)
- `type` (optional): Content type (`posts`, `users`, `all`) (default: `all`)
- `limit` (optional): Maximum results (default: 20, max: 50)

**Response:**
```json
[
  {
    "type": "post",
    "id": "post-uuid",
    "title": "spiritual_seeker",
    "content": "Morning meditation brought profound insights...",
    "author": { ... },
    "chakra": "crown",
    "createdAt": "2024-01-15T08:00:00Z"
  },
  {
    "type": "user",
    "id": "user-id",
    "title": "meditation_master",
    "content": "Spiritual seeker with 45 posts shared",
    "author": { ... },
    "auraLevel": 4,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## 🔔 Notifications Endpoints

### Get User Notifications 🔒
Retrieve notifications for the current user.

```http
GET /api/notifications?limit=20
```

**Query Parameters:**
- `limit` (optional): Number of notifications (default: 20, max: 100)

**Response:**
```json
[
  {
    "id": "notification-uuid",
    "type": "engagement",
    "title": "New Energy Share",
    "message": "cosmic_wanderer shared energy with your post",
    "isRead": false,
    "triggerUser": {
      "id": "user-id",
      "username": "cosmic_wanderer",
      "profileImage": "sigil-data"
    },
    "createdAt": "2024-01-15T20:30:00Z"
  }
]
```

### Get Unread Count 🔒
Get the count of unread notifications.

```http
GET /api/notifications/unread-count
```

**Response:**
```json
{
  "count": 3
}
```

### Mark Notification as Read 🔒
Mark a specific notification as read.

```http
PUT /api/notifications/:notificationId/read
```

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

---

## 🎨 Sigil Generation Endpoints

### Generate Sigil 🔒
Generate a unique spiritual sigil for the user.

```http
POST /api/generate-sigil
```

**Response:**
```json
{
  "sigil": "◇○◇\n△☆△\n◇○◇"
}
```

### Set Sigil as Profile 🔒
Set a generated sigil as the user's profile image.

```http
PUT /api/set-sigil-as-profile
Content-Type: application/json
```

**Request Body:**
```json
{
  "sigil": "◇○◇\n△☆△\n◇○◇"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "username": "spiritual_seeker",
    "profileImage": "◇○◇\n△☆△\n◇○◇"
  }
}
```

---

## 💳 Subscription Endpoints

### Get or Create Subscription 🔒
Manage Stripe subscription for Premium features.

```http
POST /api/get-or-create-subscription
```

**Response:**
```json
{
  "subscriptionId": "sub_stripe_id",
  "clientSecret": "pi_client_secret_for_frontend"
}
```

---

## 🏥 Health Check Endpoints

### Basic Health Check
Check if the API is responsive.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T21:00:00Z"
}
```

### API Health Check
Check API and database connectivity.

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai": "operational",
  "timestamp": "2024-01-15T21:00:00Z"
}
```

---

## 🚨 Error Codes

### Authentication Errors
- `AUTH_001`: Invalid session token
- `AUTH_002`: Session expired
- `AUTH_003`: User not found

### Validation Errors
- `VAL_001`: Missing required fields
- `VAL_002`: Invalid data format
- `VAL_003`: Content too long/short

### Business Logic Errors
- `BIZ_001`: Insufficient energy
- `BIZ_002`: Premium feature required
- `BIZ_003`: Rate limit exceeded

### System Errors
- `SYS_001`: Database connection failed
- `SYS_002`: AI service unavailable
- `SYS_003`: External service error

---

## 📚 SDK & Libraries

### JavaScript/TypeScript Client
```typescript
import { AscendedSocialAPI } from '@ascended-social/client'

const api = new AscendedSocialAPI({
  baseURL: 'https://api.ascended-social.com',
  apiKey: 'your-api-key'
})

// Get user's spirit guide
const spirit = await api.getSpirit()

// Create a new post
const post = await api.createPost({
  content: 'Sharing today\'s spiritual insight...'
})

// Engage with energy
await api.engageWithPost(post.id, 'energy')
```

---

*May your API integrations be blessed with perfect status codes and seamless spiritual connections!* ✨