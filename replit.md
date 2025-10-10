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
- **Premium Subscriptions**: Managed by Polar, offering features like unlimited energy and enhanced oracle readings.
- **Zero Trust Security**: Four-layer model using Cloudflare Zero Trust for user authentication, admin access, network protection, and API protection.
- **Privacy Compliance**:
  - **TermsHub Integration**: GDPR/CCPA-compliant cookie consent banner replacing Klaro/Enzuzo
  - **DSAR Form** (`/dsar`): GDPR data subject access requests (access, deletion, rectification, portability, restriction, objection)
  - **Do Not Sell Form** (`/do-not-sell-form`): CCPA opt-out requests
  - **Self-Hosted Consent Auditing**: Complete consent logging system using Cloudflare D1 EU database
    - `POST /api/privacy/consent/audit`: Log consent events (accepted, updated, rejected)
    - `GET /api/privacy/consent/history/:userId`: Retrieve user consent history
    - `POST /api/privacy/consent/withdraw`: Withdraw all user consents
    - `GET /api/privacy/consent/statistics`: Get consent statistics by status
  - **Cloudflare Turnstile**: Security verification on all privacy forms (enabled on production domains)
  - **Sentry SDK v8**: Error tracking and crash reporting for frontend (React) and backend (Node.js/Express)

### System Design Choices
The project enforces strict codebase standards for folder structure, file cleanup, documentation placement, and code structure. A sophisticated design-to-code workflow integrates Figma, Storybook, Cypress, Playwright, Browserless, and Chromatic for visual regression testing. 

**Privacy Infrastructure**: Comprehensive GDPR and CCPA compliance featuring TermsHub for cookie consent management, self-hosted consent auditing using Cloudflare D1 EU database for GDPR-compliant consent storage, and dedicated DSAR (Data Subject Access Request) and Do Not Sell forms providing users with direct access to their privacy rights. The consent auditing system gracefully handles D1 unavailability with fallback console logging while maintaining full endpoint functionality.

**Error Monitoring**: Sentry SDK v8 integrated on both frontend (React) and backend (Node.js/Express) for comprehensive error tracking and crash reporting with proper Express error handler setup.

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
- **Polar**: Primary payment processor for web-based checkout and subscription management.
  - REST API integration (lightweight, no SDK dependencies)
  - Direct checkout URL redirect flow
  - Backend validation using Zod schemas for product IDs
  - MCP server support for automated product creation
  - Environment variables required:
    - `POLAR_ACCESS_TOKEN`: API access token from Polar dashboard
    - `POLAR_PRICE_ID_MYSTIC`: Price ID for Mystic plan ($12/month)
    - `POLAR_PRICE_ID_ASCENDED`: Price ID for Ascended plan ($24/month)
    - `POLAR_WEBHOOK_SECRET`: Secret for webhook signature validation
  - Webhook endpoint: `/api/webhooks/polar`
  - Service module: `server/lib/polar.ts`
  - Supports both production and sandbox environments

### Media and Storage
- **Google Cloud Storage**: File and media storage.
- **Uppy**: File upload interface.

### Email and Notifications
- **OneSignal**: Push notifications and transactional/marketing email delivery.

### Video Services
- **Bunny.net VOD**: Video on demand.

### Analytics and Monitoring
- **PostHog**: Privacy-first user analytics.
- **Sentry**: Error tracking and crash reporting for both frontend and backend.

### Privacy and Consent Management
- **TermsHub**: GDPR and CCPA-compliant cookie consent banner and legal document hosting (replaces Klaro/Enzuzo).
- **Self-Hosted Consent Auditing**: Custom implementation using Cloudflare D1 EU database for GDPR-compliant consent storage, with complete API endpoints for logging, retrieval, withdrawal, and statistics.
- **Cloudflare D1**: EU-based serverless database for secure consent storage. Requires environment variables: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_D1_DATABASE_ID`.
- **Cloudflare Turnstile**: CAPTCHA-free security verification on privacy forms (production domains only).
- **Prighter**: EU representative services for GDPR compliance.

### Security and Infrastructure
- **Cloudflare Zero Trust**: Enterprise security platform (Access, Gateway, WAF).
- **Bearer CLI**: Open-source SAST (Static Application Security Testing) tool v1.51.0 for security and privacy risk detection. Scans source code for OWASP Top 10, CWE Top 25 vulnerabilities, and sensitive data flows. Integrated with privacy stack for automated security scanning.
- **Snyk**: Vulnerability scanning (enabled when API key configured).

### Browser Automation and Testing
- **Browserless**: Cloud-based browser automation (Playwright/Puppeteer).

### Design System Integration
- **Figma MCP Server**: Design token extraction and component synchronization.
- **Storybook**: Component library.

### UI Components
- **shadcn/ui**: Component library.
- **React Three Fiber**: 3D rendering.
- **Three.js**: 3D graphics engine.