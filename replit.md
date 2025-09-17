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
Authentication is managed by Replit Auth (OpenID Connect via Passport.js), with user sessions stored in PostgreSQL. Authorization uses middleware for permission checks. 

**Recent Authentication Fixes (September 2025):**
- **Resolved Authentication Middleware Conflict**: Fixed issue where enhanced security middleware was conflicting with Passport authentication, causing 401 errors on `/api/auth/user` endpoint
- **Improved Profile Loading**: Updated profile page to properly handle authentication loading states and wait for authentication completion before attempting to fetch user data
- **Enhanced Middleware Compatibility**: Modified enhanced authentication middleware to work seamlessly with both Passport web authentication and JWT mobile authentication flows

**Enhanced Mobile Authentication System:**
- **Cross-Platform Support**: Native mobile apps, mobile web apps, and desktop web
- **Platform Detection**: Automatic detection via referer headers, user agents, and query parameters
- **Smart Redirects**: Deep links for native apps, URL callbacks for web apps
- **JWT Token Management**: Secure token generation, verification, and storage
- **Domain Flexibility**: Support for development, staging, and production domains

**Mobile Authentication Endpoints:**
- `/api/auth/mobile-config` - Platform-specific configuration
- `/api/auth/mobile-login` - Cross-platform login initiation  
- `/api/auth/mobile-verify` - JWT token verification
- `/api/auth/mobile-config/health` - Service health monitoring

The system ensures seamless authentication across React Native apps with deep linking, Expo web apps with URL callbacks, and traditional web applications with session-based auth.

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

## Codebase Standards

### File Organization and Cleanliness
The project maintains strict standards for codebase cleanliness to ensure maintainability, readability, and professional development practices:

#### **Folder Structure**
- **Root Directory**: Only contains essential project files (README.md, replit.md, package.json, configuration files)
- **docs/**: All project documentation with organized subdirectories:
  - `docs/admin/` - Administrative documentation
  - `docs/developer/` - Development guides and API references  
  - `docs/legal/` - Legal and compliance documentation
  - `docs/styling/` - Design system and styling guides
  - `docs/user/` - User-facing documentation
- **client/**: Frontend React application with organized component structure
- **server/**: Backend Node.js/Express application with clean service separation
- **shared/**: Shared types, schemas, and utilities

#### **File Cleanup Standards**
- **Test and Debug Files**: Remove all temporary test files after development completion
  - No `test-*.js`, `debug-*.html`, or similar files in production branches
  - Keep only official test suites in `tests/` and `cypress/e2e/` directories
- **Build Artifacts**: Regularly clean build outputs and logs
  - Remove `*.log` files, `playwright-report/`, `test-results/` after reviews
  - Preserve `storybook-static/` for production deployment
- **Experimental Files**: Remove server-side experimental and temporary files
  - Delete files with prefixes like `final-*`, `populate-*`, `inject-*`, `inspect-*`
  - Move completed experiments to proper feature implementations

#### **Documentation Placement**
- **Project Documentation**: All `.md` files belong in `docs/` directory structure
- **Component Documentation**: Storybook stories in `stories/` directory
- **API Documentation**: Generated and maintained in `docs/developer/`
- **Change Tracking**: All project changes documented in `docs/CHANGELOG.md`

#### **Code Structure Guidelines**
- **Consistent Imports**: Use established path aliases (`@/components`, `@/lib`, `@shared`)
- **Type Safety**: All TypeScript files properly typed with shared schemas
- **Component Organization**: Related components grouped in logical subdirectories
- **Service Separation**: Clear separation between API routes, storage interfaces, and business logic
- **Configuration Management**: Environment-specific configurations properly isolated

#### **Maintenance Practices**
- **Regular Cleanup**: Perform codebase cleanup after major feature completions
- **Code Reviews**: Include file organization checks in review processes
- **Documentation Updates**: Keep documentation current with code changes
- **Dependency Management**: Regular review and cleanup of unused dependencies
- **Git Hygiene**: Use meaningful commit messages and branch names aligned with spiritual platform features

#### **Quality Assurance**
- **No Dead Code**: Remove unused imports, functions, and components
- **Consistent Styling**: Follow established patterns for component styling and theming
- **Error Handling**: Comprehensive error handling with spiritual-themed user messages
- **Performance Optimization**: Regular performance audits and optimization
- **Accessibility Standards**: Maintain WCAG compliance across all components

These standards ensure the Ascended Social platform maintains professional development practices while supporting its spiritual mission of fostering enlightened online communities.

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

## 🤖 Advanced Visual Testing with MCP

Ascended Social integrates multiple MCP (Model Context Protocol) servers to provide GitHub Copilot with comprehensive testing capabilities:

### Quick Start
1. **Connect VS Code via SSH** (already configured)
2. **Start MCP servers**: `npm run mcp:start`
3. **Open GitHub Copilot Agent Mode**
4. **Use natural language** to generate and run tests

### Available Testing Tools
- **🎨 Chromatic Storybook**: Visual component testing
- **📚 Storybook MCP**: Component story management  
- **🔧 Chromatic Cypress**: Interactive component testing
- **🎭 Playwright Chromatic**: E2E visual testing
- **🤖 ByteBot OS**: Desktop automation

### Example Commands
```bash
# Start all MCP servers
npm run mcp:start

# Run comprehensive visual tests
npm run test:visual:all

# Monitor all logs in real-time
npm run logs:all

# Test specific tools
npm run test:storybook    # Storybook component tests
npm run test:cypress      # Cypress component tests  
npm run test:playwright   # Playwright E2E tests
```

### Copilot Integration Examples
- *"Create a new social media post component with Storybook story and visual tests"*
- *"Test the user authentication flow with database validation using Playwright"*
- *"Generate Cypress tests for the messaging system with real-time updates"*
- *"Set up automated visual regression testing for the entire platform"*

### Tech Stack Integration
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Storage**: Replit Storage for media assets
- **Secrets**: Replit Secrets management
- **Frontend**: React with Vite
- **Backend**: Express.js API

### Monitoring
Real-time logging captures:
- ✅ Component test results
- ✅ Visual regression status  
- ✅ Database operation logs
- ✅ Storage access patterns
- ✅ MCP server interactions
- ✅ Replit service health