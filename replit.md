# Ascended Social - Spiritual Social Media Platform

## Overview

Ascended Social is a mystical social media platform that combines spirituality with modern technology. The application allows users to share posts, engage with content through a spiritual lens, and receive personalized oracle readings and recommendations. The platform implements a chakra-based categorization system for content and includes features like user sigils, aura levels, energy systems, premium subscriptions, and an immersive 3D Starmap Visualizer for community exploration.

## Recent Changes

### December 2024 - Enhanced User Experience
- **3D Starmap Visualizer**: Completed full implementation with dual visualization modes (cosmic starfield and fungal mycelium network), displaying users as interactive stars/mushrooms with real-time spiritual data
- **Enhanced Post Voting System**: Redesigned engagement interface with mystical theming, animated feedback, spiritual messaging, and improved visual hierarchy
- **Live Data Integration**: Fixed API query handling to ensure both starmap modes use dynamic user data including connections, chakra information, and spiritual statistics
- **Visual Polish**: Added professional lighting, enhanced materials, gradient backgrounds, and smooth animations throughout the user interface

### August 2025 - Privacy-First Analytics & GDPR Compliance
- **Enzuzo Cookie Consent Integration**: Implemented comprehensive cookie banner with UUID: 1bf8f8f8-a786-11ed-a83e-eb67933cb390 for GDPR-compliant consent management
- **Privacy-First PostHog Analytics**: Configured opt-out by default analytics with consent-based data collection and privacy-focused features
- **Bidirectional Consent Sync**: Real-time synchronization between Enzuzo banner and internal consent management systems
- **Cookie Preference Center**: Added #manage_cookies links throughout navigation for easy access to cookie settings
- **GDPR Data Rights APIs**: Implemented data export, deletion, and privacy status endpoints for complete compliance
- **Consent Management System**: Built comprehensive privacy infrastructure with granular cookie categorization

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
The application features an immersive 3D starmap that visualizes the spiritual community as an interactive cosmic experience with two distinct visualization paradigms:

**Conceptual Design:**
- **Starmap Mode (Macro View)**: Shows large connections and groupings across the entire application - representing the universal overview of spiritual community patterns, chakra-based clustering, and app-wide relationship networks
- **Fungal Mode (Micro View)**: Shows small, intimate connections around a specific star/user - representing the detailed mycelium network of close spiritual bonds and local relationship webs

**Technical Implementation:**
- **Cosmic Starfield Mode**: Overview of all souls as glowing stars in a mystical night sky with broad community clustering and universal spiritual patterns
- **Fungal Network Mode**: Focused view showing mushroom-like nodes with detailed local connections around individual users, representing intimate spiritual bonds and close relationship networks
- **Real-time Data**: Live user information including dominant chakras, aura/energy levels, connection counts, and spiritual statistics
- **Interactive Features**: Clickable profiles, advanced filtering by spiritual attributes, smooth 3D navigation, and contextual tooltips
- **Professional Polish**: Enhanced lighting, atmospheric effects, animated materials, and responsive design

### Oracle System
The application features an AI-powered oracle system that provides daily spiritual readings, personalized recommendations, and tarot-style guidance. This system uses OpenAI's API to generate contextual spiritual content based on user behavior and preferences.

### Payment Integration
Premium subscriptions are managed through Stripe with support for recurring payments. The system handles subscription lifecycle events and provides premium features like unlimited energy and enhanced oracle readings.

### Privacy and Compliance System
The platform implements comprehensive privacy infrastructure with GDPR compliance built from the ground up. The system features bidirectional consent management between Enzuzo cookie banner and internal privacy controls, opt-out by default analytics, granular cookie categorization, and complete data subject rights APIs. Privacy preferences are synchronized in real-time across all platform components, ensuring consent choices are immediately respected throughout the application. Cookie preference center links are accessible from navigation menus and settings areas using the #manage_cookies anchor.

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
- **PostHog**: Privacy-first user analytics with consent-based tracking, feature flags, and product insights
- **Enzuzo**: GDPR-compliant cookie consent banner and preference management (UUID: 1bf8f8f8-a786-11ed-a83e-eb67933cb390)

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

### Task Management and Development Workflow

#### Notion-Based Development Workflow
The project uses Notion as a comprehensive development management system for tracking features, bugs, improvements, and project documentation:

- **Workspace**: [Ascended Social Documentation](https://www.notion.so/Ascended-Social-Web-and-Mobile-Communication-Board-and-Documentation-Sync-257308ef03eb8039a843d972780228a5)
- **Purpose**: Complete development coordination between developers and AI assistant with integrated documentation
- **Integration**: Automated synchronization between code changes and project documentation

#### Development Databases
1. **Development Tasks**: Features, bugs, and improvements tracked with status, priority, and assignments
2. **Mobile Development**: Mobile app features and backend synchronization tracking with auth integration status
3. **Project Task Management**: General project coordination with time tracking and technical notes  
4. **Change Log**: Automatic documentation of all significant project updates and modifications
5. **Project Documentation**: Centralized knowledge base with technical specifications and user guides

#### Development Workflow Process
1. **Task Creation**: New features, bugs, or improvements are created in the Development Tasks database
2. **Planning**: Tasks are organized with status (To Do, In Progress, Review, Done), priority levels, and assignments
3. **Progress Tracking**: Task status updates synchronized with development progress
4. **Documentation**: Technical details, implementation notes, and decisions tracked in linked documentation
5. **Change Tracking**: All modifications automatically logged in the Change Log database
6. **Completion**: Finished tasks marked complete with links to relevant commits and documentation

#### Development Tools
- **Notion API Integration**: `tsx server/sync-docs.ts` for automated documentation synchronization
- **Database Access**: Direct integration with Notion databases for real-time updates
- **Automated Sync**: Code changes and project updates automatically reflected in documentation

This unified system enables efficient collaboration between human developers and AI assistants while maintaining comprehensive project documentation and ensuring all development work is tracked, organized, and properly documented.