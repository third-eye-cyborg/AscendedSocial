# Ascended Social - Spiritual Social Media Platform

## Overview
Ascended Social is a mystical social media platform that integrates spirituality with modern technology. It enables users to share posts, engage with content spiritually, and receive personalized oracle readings and recommendations. The platform features a chakra-based content categorization system, user sigils, aura levels, energy systems, premium subscriptions, and an immersive 3D Starmap Visualizer for community exploration. Its business vision includes fostering a spiritually-aware online community and providing unique, personalized spiritual guidance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The client is built with React and TypeScript, using Vite for building. It employs a component-based architecture with shadcn/ui for UI, wouter for routing, TanStack Query for server state, and React hooks for local state.

### Backend
The backend uses Node.js/Express with TypeScript in a monorepo structure. It features session-based authentication via Replit Auth with OpenID Connect and follows RESTful API conventions.

### Data Storage
PostgreSQL serves as the primary database with Drizzle ORM for type-safe operations. Google Cloud Storage is used for media files.

### Authentication and Authorization
Authentication is managed by Replit Auth (OpenID Connect via Passport.js), with user sessions stored in PostgreSQL. Authorization uses middleware to check permissions.

### Content Management
Posts are automatically categorized into seven chakra types using OpenAI's GPT-4, receiving a spiritual frequency score and chakra classification. It supports text, image, and video content.

### Engagement System
A spiritual-themed engagement system allows upvotes, downvotes, likes, and energy sharing. Users have monthly refreshing energy points for high-impact engagements.

### 3D Starmap Visualization
An immersive 3D starmap visualizes the spiritual community:
- **Starmap Mode (Macro)**: Displays large connections and chakra-based clustering.
- **Fungal Mode (Micro)**: Shows intimate connections around specific users.
Both modes provide real-time user data, interactive features, and professional visual polish using React Three Fiber and Three.js.

### Oracle System
An AI-powered oracle system, using OpenAI's API, provides daily spiritual readings, personalized recommendations, and tarot-style guidance based on user behavior.

### Payment Integration
Stripe handles premium subscriptions and recurring payments, enabling features like unlimited energy and enhanced oracle readings.

### Privacy and Compliance
The platform includes comprehensive GDPR compliance with bidirectional consent management via Enzuzo, opt-out by default analytics (PostHog), granular cookie categorization, and data subject rights APIs.

### Zero Trust Security Architecture
A four-layer security model utilizing Cloudflare Zero Trust:
- **Layer 1: User Authentication (Replit Auth)**: For standard user features.
- **Layer 2: Admin Access Protection (Zero Trust)**: Secures sensitive operations via Cloudflare Access JWT validation.
- **Layer 3: Network Protection (Cloudflare Gateway)**: Provides DNS-level filtering and threat protection.
- **Layer 4: API Protection (Web Application Firewall)**: Offers DDoS protection, rate limiting, and WAF rules for all API endpoints.

## External Dependencies

### Database Services
- **Neon Database**: PostgreSQL hosting.
- **Drizzle ORM**: Database operations.

### Authentication Services
- **Replit Auth**: OpenID Connect provider.
- **Passport.js**: Authentication middleware.

### AI and Content Analysis
- **OpenAI API**: GPT-4 for content analysis and oracle readings.

### Payment Processing
- **Stripe**: Subscription and payment management.

### Media and Storage
- **Google Cloud Storage**: File and media storage.
- **Uppy**: File upload interface.

### Email and Notifications
- **OneSignal**: Transactional and marketing email service.

### Video Services
- **Bunny.net VOD**: Video on demand.

### Analytics and Monitoring
- **PostHog**: Privacy-first user analytics with consent-based tracking, feature flags, and product insights
- **Enzuzo**: GDPR-compliant cookie consent banner and preference management (UUID: 1bf8f8f8-a786-11ed-a83e-eb67933cb390)

### Security and Infrastructure
- **Cloudflare Zero Trust**: Enterprise security platform providing layered protection with Access policies, Gateway DNS filtering, and Web Application Firewall
  - **Cloudflare Access**: JWT-based authentication for admin routes with group membership validation
  - **Cloudflare Gateway**: Network-level threat protection and DNS filtering without affecting user experience
  - **Cloudflare WAF**: API protection with DDoS mitigation, rate limiting, and threat detection
  - **Integration**: Sophisticated middleware system for graduated security levels and audit logging

### Testing and Quality Assurance
- **Scrapybara**: Automated screenshot testing.

### UI Components
- **shadcn/ui**: Component library.
- **React Three Fiber**: 3D rendering.
- **Three.js**: 3D graphics engine.