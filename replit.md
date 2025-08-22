# Ascended Social - Spiritual Social Media Platform

## Overview

Ascended Social is a mystical social media platform that combines spirituality with modern technology. The application allows users to share posts, engage with content through a spiritual lens, and receive personalized oracle readings and recommendations. The platform implements a chakra-based categorization system for content and includes features like user sigils, aura levels, energy systems, and premium subscriptions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript, leveraging Vite as the build tool. The application uses a component-based architecture with shadcn/ui as the primary UI library, providing a consistent mystical design system. The routing is handled by wouter for lightweight client-side navigation. State management is implemented through TanStack Query for server state and React hooks for local state.

### Backend Architecture
The backend follows a Node.js/Express architecture with TypeScript. The application uses a monorepo structure with shared types and schemas between client and server. Session-based authentication is implemented through Replit Auth with OpenID Connect. The API follows RESTful conventions with middleware for logging, error handling, and authentication.

### Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, posts, comments, engagements, spiritual readings, subscriptions, and sessions. Database migrations are managed through Drizzle Kit. The system also integrates with Google Cloud Storage for file uploads and media storage.

### Authentication and Authorization
Authentication is handled through Replit Auth using OpenID Connect with Passport.js. The system maintains user sessions in PostgreSQL using connect-pg-simple. Authorization is implemented through middleware that checks authentication status and user permissions. The application supports both authenticated and guest user flows.

### Content Management System
Posts are automatically categorized using OpenAI's GPT-4 model into seven chakra types (root, sacral, solar, heart, throat, third_eye, crown). Each post receives a spiritual frequency score and chakra classification. The system supports text, image, and video content with automatic content analysis.

### Engagement System
The platform implements a spiritual-themed engagement system with actions like upvote, downvote, like, and energy sharing. Users have energy points that refresh monthly and can be spent on high-impact engagements. The system tracks engagement statistics and user interactions across posts and comments.

### Oracle System
The application features an AI-powered oracle system that provides daily spiritual readings, personalized recommendations, and tarot-style guidance. This system uses OpenAI's API to generate contextual spiritual content based on user behavior and preferences.

### Payment Integration
Premium subscriptions are managed through Stripe with support for recurring payments. The system handles subscription lifecycle events and provides premium features like unlimited energy and enhanced oracle readings.

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Drizzle ORM**: Type-safe database operations and migrations

### Authentication Services
- **Replit Auth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware for Express

### AI and Content Analysis
- **OpenAI API**: GPT-4 integration for content analysis, chakra categorization, and oracle readings
- **Custom AI Services**: Spiritual content generation, user sigil creation, and personalized recommendations

### Payment Processing
- **Stripe**: Subscription management, payment processing, and billing
- **Stripe Elements**: Frontend payment form components

### Media and Storage
- **Google Cloud Storage**: File upload and media storage with ACL policies
- **Replit Object Storage**: Integrated file storage solution
- **Uppy**: File upload interface and management

### Email and Notifications
- **Resend**: Email service for transactional emails and notifications

### Video Services
- **Bunny.net VOD**: Video on demand streaming and storage
- **Mux**: Live video streaming capabilities

### Analytics and Monitoring
- **PostHog**: User analytics, feature flags, and product insights

### Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework with custom mystical theming
- **React Query**: Server state management and caching
- **Zod**: Runtime type validation and schema definition

### UI Components
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library with mystical customizations
- **Lucide React**: Icon library for UI elements

### Documentation
- **Notion API**: Documentation synchronization and content management