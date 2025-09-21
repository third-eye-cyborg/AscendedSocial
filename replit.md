# Ascended Social - Spiritual Social Media Platform

## Overview
Ascended Social is a mystical social media platform designed to merge spirituality with technology. It facilitates sharing, spiritual engagement with content, and personalized oracle readings. Key features include chakra-based content categorization, user sigils, aura levels, an energy system, premium subscriptions, and an immersive 3D Starmap Visualizer. The platform aims to cultivate a spiritually-aware online community and offer unique, personalized spiritual guidance, focusing on fostering connection and enlightenment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend is built with React and TypeScript, utilizing shadcn/ui for UI components and React Three Fiber/Three.js for immersive 3D visualizations. The platform offers two 3D Starmap visualization modes: "Starmap Mode" for macro connections and "Fungal Mode" for micro, intimate connections around users, providing real-time interactive data.

### Technical Implementations
The client uses React, TypeScript, and Vite with wouter for routing and TanStack Query for server state management. The backend is a Node.js/Express application in a monorepo, using TypeScript and adhering to RESTful API conventions. PostgreSQL with Drizzle ORM is the primary database, and Google Cloud Storage handles media files. Authentication is session-based via Replit Auth (OpenID Connect) with Passport.js, supporting cross-platform mobile authentication with JWT tokens and deep linking for native apps. Content is categorized into seven chakra types using OpenAI's GPT-4, which also provides spiritual frequency scores. An AI-powered oracle system uses OpenAI's API for personalized readings.

### Feature Specifications
- **Chakra-based Content**: Automatic categorization of posts into seven chakra types with spiritual frequency scores using OpenAI's GPT-4.
- **Engagement System**: Spiritual-themed upvotes, downvotes, likes, and energy sharing with monthly refreshing energy points.
- **Oracle System**: AI-powered daily readings, recommendations, and tarot-style guidance based on user behavior.
- **Premium Subscriptions**: Managed by RevenueCat and Paddle, offering features like unlimited energy and enhanced oracle readings.
- **Zero Trust Security**: Four-layer model using Cloudflare Zero Trust for user authentication, admin access, network protection, and API protection.

### System Design Choices
The project enforces strict codebase standards for folder structure, file cleanup, documentation placement, and code structure. A sophisticated design-to-code workflow integrates Figma, Storybook, Cypress, Playwright, Browserless, and Chromatic for visual regression testing. Comprehensive GDPR compliance is achieved with Klaro for cookie consent and Fides for privacy orchestration.

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
- **RevenueCat**: Cross-platform subscription management.
- **Paddle**: Web-based checkout and payment processing.

### Media and Storage
- **Google Cloud Storage**: File and media storage.
- **Uppy**: File upload interface.

### Email and Notifications
- **OneSignal**: Push notifications and transactional/marketing email delivery.

### Video Services
- **Bunny.net VOD**: Video on demand.

### Analytics and Monitoring
- **PostHog**: Privacy-first user analytics.

### Privacy and Consent Management
- **Klaro**: Open-source, GDPR-compliant cookie consent banner.
- **Fides**: Privacy orchestration platform.

### Security and Infrastructure
- **Cloudflare Zero Trust**: Enterprise security platform (Access, Gateway, WAF).

### Browser Automation and Testing
- **Browserless**: Cloud-based browser automation (Playwright/Puppeteer).

### Design System Integration
- **Figma MCP Server**: Design token extraction and component synchronization.
- **Storybook**: Component library.

### UI Components
- **shadcn/ui**: Component library.
- **React Three Fiber**: 3D rendering.
- **Three.js**: 3D graphics engine.