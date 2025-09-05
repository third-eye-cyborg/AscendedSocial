# Ascended Social - Spiritual Social Media Platform

## Overview
Ascended Social is a mystical social media platform designed to merge spirituality with technology. It facilitates sharing, spiritual engagement with content, and personalized oracle readings. Key features include chakra-based content categorization, user sigils, aura levels, an energy system, premium subscriptions, and an immersive 3D Starmap Visualizer. The platform aims to cultivate a spiritually-aware online community and offer unique, personalized spiritual guidance, focusing on fostering connection and enlightenment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The client is built with React and TypeScript, using Vite. It utilizes a component-based architecture with shadcn/ui for UI, wouter for routing, TanStack Query for server state, and React hooks for local state.

### Backend
The backend uses Node.js/Express with TypeScript in a monorepo structure. It features session-based authentication via Replit Auth with OpenID Connect and adheres to RESTful API conventions. Recent updates include mobile authentication routing fixes to ensure proper API endpoint ordering and mobile app connectivity.

### Data Storage
PostgreSQL serves as the primary database with Drizzle ORM. Google Cloud Storage is used for media files.

### Authentication and Authorization
Authentication is managed by Replit Auth (OpenID Connect via Passport.js), with user sessions stored in PostgreSQL. Authorization uses middleware for permission checks. The system includes dedicated mobile authentication endpoints (`/api/auth/mobile-config`) for seamless mobile app integration with proper route ordering to prevent Vite middleware conflicts.

### Content Management
Posts are automatically categorized into seven chakra types using OpenAI's GPT-4, receiving a spiritual frequency score and chakra classification. It supports text, image, and video content.

### Engagement System
A spiritual-themed engagement system includes upvotes, downvotes, likes, and energy sharing. Users have monthly refreshing energy points for high-impact engagements.

### 3D Starmap Visualization
An immersive 3D starmap visualizes the spiritual community:
- **Starmap Mode (Macro)**: Displays large connections and chakra-based clustering.
- **Fungal Mode (Micro)**: Shows intimate connections around specific users.
Both modes provide real-time user data, interactive features, and professional visual polish using React Three Fiber and Three.js.

### Oracle System
An AI-powered oracle system, utilizing OpenAI's API, provides daily spiritual readings, personalized recommendations, and tarot-style guidance based on user behavior.

### Payment Integration
Stripe handles premium subscriptions and recurring payments, enabling features like unlimited energy and enhanced oracle readings.

### Privacy and Compliance
The platform includes comprehensive GDPR compliance with bidirectional consent management via Enzuzo, opt-out by default analytics (PostHog), granular cookie categorization, and data subject rights APIs.

### Legal Documentation Framework
Comprehensive legal documentation provides protection and compliance for Third Eye Cyborg, LLC operations, including payment terms, copyright assignment & IP protection, community protection framework, copyright policy, service agreement, and third-party service disclaimers.

### Zero Trust Security Architecture
A four-layer security model utilizing Cloudflare Zero Trust:
- **Layer 1: User Authentication (Replit Auth)**: For standard user features.
- **Layer 2: Admin Access Protection (Zero Trust)**: Secures sensitive operations via Cloudflare Access JWT validation.
- **Layer 3: Network Protection (Cloudflare Gateway)**: Provides DNS-level filtering and threat protection.
- **Layer 4: API Protection (Web Application Firewall)**: Offers DDoS protection, rate limiting, and WAF rules for all API endpoints.

### Development Workflow
The platform employs a sophisticated design-to-code workflow integrating visual design, automated testing, and browser automation. This includes Figma for design, MCP for token extraction, Storybook for component documentation, Cypress and Playwright for testing, Browserless for authenticated browser automation, and Chromatic for visual regression testing, ensuring spiritual aesthetics and consistent user experiences.

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
- **PostHog**: Privacy-first user analytics.
- **Enzuzo**: GDPR-compliant cookie consent and preference management.

### Security and Infrastructure
- **Cloudflare Zero Trust**: Enterprise security platform providing layered protection with Access policies, Gateway DNS filtering, and Web Application Firewall.

### Browser Automation and Testing
- **Browserless**: Cloud-based browser automation service providing Playwright and Puppeteer capabilities for authenticated testing, PDF generation, and performance monitoring.

### Design System Integration
- **Figma MCP Server**: Advanced bidirectional design synchronization for design token extraction and component synchronization.
- **Storybook**: Component library showcasing spiritual-themed components with interactive documentation and accessibility testing.

### Compliance and Automation Systems
- **Privacy Compliance Scanner**: Custom implementation for GDPR, CCPA, and privacy compliance analysis including data flow tracking and violation detection.
- **Security Vulnerability Scanner**: Automated security analysis for SQL injection, XSS, authentication issues, and insecure configurations.
- **Browser Automation Service**: Natural language browser automation for testing spiritual platform features including sparks, oracle readings, and energy sharing.
- **MCP Integration**: Model Context Protocol integration for advanced browser automation and compliance scanning workflows.

### UI Components
- **shadcn/ui**: Component library.
- **React Three Fiber**: 3D rendering.
- **Three.js**: 3D graphics engine.