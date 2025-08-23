# Ascended Social - Spiritual Social Media Platform

## Overview

Ascended Social is a mystical social media platform that combines spirituality with modern technology. The application allows users to share posts, engage with content through a spiritual lens, and receive personalized oracle readings and recommendations. The platform implements a chakra-based categorization system for content and includes features like user sigils, aura levels, energy systems, premium subscriptions, and an immersive 3D Starmap Visualizer for community exploration.

## Recent Changes

### December 2024 - Enhanced User Experience
- **3D Starmap Visualizer**: Completed full implementation with dual visualization modes (cosmic starfield and fungal mycelium network), displaying users as interactive stars/mushrooms with real-time spiritual data
- **Enhanced Post Voting System**: Redesigned engagement interface with mystical theming, animated feedback, spiritual messaging, and improved visual hierarchy
- **Live Data Integration**: Fixed API query handling to ensure both starmap modes use dynamic user data including connections, chakra information, and spiritual statistics
- **Visual Polish**: Added professional lighting, enhanced materials, gradient backgrounds, and smooth animations throughout the user interface

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
The platform implements a polished spiritual-themed engagement system with actions like upvote, downvote, like, and energy sharing. The interface features mystical design language with animated hover effects, glowing buttons, and contextual spiritual messaging. Users have energy points that refresh monthly and can be spent on high-impact engagements. The system tracks engagement statistics and user interactions across posts and comments with real-time visual feedback and success notifications.

### 3D Starmap Visualization System
The application features an immersive 3D starmap that visualizes the spiritual community as an interactive cosmic experience. Users appear as glowing stars clustered by chakra energy, aura levels, and spiritual connections. The system supports dual visualization modes:
- **Cosmic Starfield Mode**: Overview of all souls as stars in a mystical night sky with chakra-based clustering
- **Fungal Network Mode**: Detailed view showing mushroom-like nodes connected by spiritual bonds and relationships
- **Real-time Data**: Live user information including dominant chakras, aura/energy levels, connection counts, and spiritual statistics
- **Interactive Features**: Clickable profiles, advanced filtering by spiritual attributes, smooth 3D navigation, and contextual tooltips
- **Professional Polish**: Enhanced lighting, atmospheric effects, animated materials, and responsive design

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

### Testing and Quality Assurance
- **Scrapybara**: Automated screenshot testing and visual regression detection
  - **Screenshot Protocol**: Captures UI states across different user flows and breakpoints
  - **Visual Testing**: Compares screenshots to detect unintended design changes
  - **Cross-browser Testing**: Ensures consistent appearance across different browsers
  - **Regression Detection**: Automatically identifies visual bugs introduced by code changes

### Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework with custom mystical theming
- **React Query**: Server state management and caching
- **Zod**: Runtime type validation and schema definition

### UI Components
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library with mystical customizations and enhanced spiritual theming
- **Lucide React**: Icon library for UI elements and enhanced voting interface
- **React Three Fiber**: 3D rendering library for the immersive starmap visualization
- **Three.js**: WebGL-powered 3D graphics engine for cosmic and network visualizations

### Documentation and Change Management
- **Notion API**: Documentation synchronization and content management
- **Change Tracking**: All significant updates and feature changes are automatically documented in the Notion database
- **Version Control Integration**: Code changes are synchronized with project documentation for complete traceability