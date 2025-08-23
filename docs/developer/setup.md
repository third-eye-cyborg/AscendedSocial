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

*Ready to contribute to the spiritual tech revolution? Start coding and may your commits be blessed with clean code and bug-free deployments!* ✨