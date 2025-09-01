# Ascended Social - Spiritual Social Media Platform

## Overview
Ascended Social is a mystical social media platform that integrates spirituality with modern technology. It enables users to share posts, engage with content spiritually, and receive personalized oracle readings and recommendations. The platform features a chakra-based content categorization system, user sigils, aura levels, energy systems, premium subscriptions, and an immersive 3D Starmap Visualizer for community exploration. Its business vision includes fostering a spiritually-aware online community and providing unique, personalized spiritual guidance.

## Recent Changes
**September 1, 2025**: Advanced browser automation and testing framework integration
- Implemented comprehensive Browserless integration with Playwright and Puppeteer for authenticated testing
- Added complete Storybook component library with 20+ stories and spiritual theming
- Integrated Chromatic for visual regression testing and design system management
- Established comprehensive testing suite with Cypress and Playwright for cross-browser compatibility
- Enhanced Figma MCP server for bidirectional design synchronization and automated design token extraction
- Added system-wide health monitoring with graceful degradation for rate-limited services

**August 31, 2025**: Comprehensive legal documentation framework integration
- Implemented complete legal protection suite for Third Eye Cyborg, LLC
- Added six dedicated legal pages with professional styling and company branding
- Integrated footer navigation for all legal documents
- Established comprehensive liability protections and service agreements
- Completed DMCA compliance and intellectual property management systems

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

### Legal Documentation Framework
Comprehensive legal documentation provides complete protection and compliance for Third Eye Cyborg, LLC operations:
- **Payment Terms**: Billing procedures, refund policies, Stripe integration terms, subscription management
- **Copyright Assignment & IP Protection**: DMCA compliance, user content licensing, intellectual property transfer agreements
- **Community Protection Framework**: 17-section safety guidelines, graduated enforcement, user behavior standards
- **Copyright Policy**: Internal IP management, staff obligations, copyright establishment procedures for Third Eye Cyborg, LLC
- **Service Agreement**: Contractual framework, liability limitations, professional service delivery standards, 99.9% uptime commitment
- **Third-Party Service Disclaimers**: Comprehensive disclaimers for OpenAI, Stripe, PostHog, OneSignal, Cloudflare, Notion, Browserless, Figma, and Chromatic integrations

### Zero Trust Security Architecture
A four-layer security model utilizing Cloudflare Zero Trust:
- **Layer 1: User Authentication (Replit Auth)**: For standard user features.
- **Layer 2: Admin Access Protection (Zero Trust)**: Secures sensitive operations via Cloudflare Access JWT validation.
- **Layer 3: Network Protection (Cloudflare Gateway)**: Provides DNS-level filtering and threat protection.
- **Layer 4: API Protection (Web Application Firewall)**: Offers DDoS protection, rate limiting, and WAF rules for all API endpoints.

## Business Information
- **Legal Entity**: Third Eye Cyborg, LLC
- **Business Address**: 814 North Granite Drive, Payson, AZ 85541
- **Operating Name**: Ascended Social
- **Legal Contact**: legal@ascended.social
- **Support Contact**: support@ascended.social
- **DMCA Agent**: dmca@ascended.social
- **Jurisdiction**: United States

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

### Browser Automation and Testing
- **Browserless**: Cloud-based browser automation service providing scalable Playwright and Puppeteer capabilities with comprehensive authentication bypass for testing spiritual platform features
  - **Authenticated Screenshots**: Capture screenshots of protected spiritual content like oracle readings, chakra dashboards, and user sigils
  - **PDF Generation**: Create downloadable reports of meditation sessions, aura analysis, and personalized spiritual guidance
  - **User Flow Automation**: Automate complete spiritual journeys including sign-up, chakra assessment, energy sharing, and oracle consultations
  - **Performance Testing**: Monitor loading times for 3D Starmap visualizations and spiritual content rendering
  - **Cross-Browser Testing**: Validate spiritual features across different browsers and devices
  - **Rate Limit Handling**: Graceful degradation when API limits are reached, ensuring continuous service availability

### Design System Integration
- **Figma MCP Server**: Advanced bidirectional design synchronization enabling real-time design-to-code workflows for spiritual UI components
  - **Design Token Extraction**: Automatically extract chakra colors, spiritual typography, and mystical spacing from Figma designs
  - **Component Synchronization**: Sync spiritual UI components like chakra wheels, oracle cards, and energy meters between Figma and codebase
  - **Bidirectional Updates**: Push code changes back to Figma for design team collaboration on spiritual aesthetics
  - **Automated Story Generation**: Create Storybook stories directly from Figma component specifications
  - **Real-time Monitoring**: Health checks and error handling for continuous design system synchronization

- **Storybook Integration**: Comprehensive component library showcasing 20+ spiritual-themed components
  - **Chakra-Based Design System**: Stories for Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, and Crown chakra components
  - **Spiritual Components**: Oracle cards, sigil generators, aura visualizers, energy meters, and meditation timers
  - **Interactive Documentation**: Live component playground with spiritual theming and cosmic backgrounds
  - **Accessibility Testing**: Built-in a11y validation for spiritual accessibility compliance
  - **Visual Regression**: Automated screenshot comparison for consistent spiritual aesthetics
  - **Chromatic Integration**: Seamless deployment with GitHub synchronization for version control

- **Testing Framework**: Multi-layered testing approach ensuring spiritual platform reliability
  - **Cypress Component Testing**: Isolated testing of spiritual UI components with real user interactions
  - **Playwright E2E Testing**: Full user journey testing including authentication, chakra assessment, and oracle readings
  - **Visual Regression Testing**: Pixel-perfect comparison of spiritual components across browser updates
  - **Cross-Browser Compatibility**: Validation across Chrome, Firefox, Safari, and Edge for universal spiritual experiences
  - **Accessibility Testing**: WCAG compliance testing for inclusive spiritual guidance
  - **Performance Testing**: Load time optimization for 3D spiritual visualizations and AI-powered oracle responses

### Complete Design-to-Code Workflow
The platform implements a full spiritual design workflow ecosystem:
1. **Figma Design**: Manual creation and iteration of spiritual UI components, chakra visualizations, and mystical aesthetics
2. **MCP Sync**: Automated real-time extraction of spiritual design tokens (chakra colors, sacred geometry, spiritual typography)
3. **Storybook Generation**: Dynamic story creation for spiritual components with interactive cosmic backgrounds
4. **Testing Validation**: 
   - Cypress component testing for spiritual interactions (energy sharing, chakra selections, oracle card draws)
   - Playwright E2E testing for complete spiritual user journeys (sign-up → chakra assessment → oracle reading)
   - Visual regression testing for consistent spiritual aesthetics across updates
5. **Chromatic Deployment**: Automated visual testing deployment with spiritual theme validation and GitHub integration
6. **Bidirectional Updates**: Real-time synchronization of design changes between development and Figma for collaborative spiritual design
7. **Automated Health Monitoring**: Continuous monitoring of design system health with graceful degradation for service interruptions

### UI Components
- **shadcn/ui**: Component library.
- **React Three Fiber**: 3D rendering.
- **Three.js**: 3D graphics engine.

## Legal Documentation Pages
All legal pages feature consistent branding with the Ascended Social logo and mystical design aesthetic:

### Core Legal Framework
- **`/payment-terms`**: Comprehensive billing, refunds, and Stripe integration policies
- **`/copyright-assignment`**: DMCA compliance and IP protection for user-generated content
- **`/community-protection`**: 17-section safety guidelines with graduated enforcement
- **`/copyright-policy`**: Internal IP management and staff copyright obligations
- **`/service-agreement`**: Professional service delivery terms with 99.9% uptime commitment
- **`/third-party-disclaimer`**: Comprehensive disclaimers for all integrated external services

### Navigation Integration
All legal pages are accessible via footer links in the marketing footer component, ensuring consistent user access to legal documentation throughout the platform. Each page includes cross-references to related legal documents and maintains professional legal language while preserving the platform's spiritual aesthetic.