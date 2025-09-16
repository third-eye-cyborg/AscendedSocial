---
applyTo: '**'
---
# Ascended Social - Replit MCP Integration Instructions

## Project Context
Ascended Social is a spiritual social media platform built on Replit's web framework with:
- **Frontend**: React with Vite
- **Backend**: Express.js
- **Database**: PostgreSQL via Neon (Replit integration)
- **ORM**: Drizzle ORM
- **Storage**: Replit Storage
- **Secrets**: Replit Secrets management

## Available MCP Servers
You have access to these specialized testing tools:

### 1. Chromatic Storybook MCP (`chromatic-storybook`)
- **Purpose**: Visual testing of Storybook components with Chromatic
- **Commands**: `capture_storybook_snapshots`, `compare_visual_changes`, `approve_changes`
- **Usage**: Test individual React components in isolation

### 2. Storybook MCP (`storybook`)
- **Purpose**: Interact with Storybook directly
- **Commands**: `list_stories`, `run_story`, `update_story`, `build_storybook`
- **Usage**: Manage and interact with component stories

### 3. Chromatic Cypress MCP (`chromatic-cypress`)
- **Purpose**: Component testing with Cypress + visual regression
- **Commands**: `run_component_tests`, `capture_cypress_snapshots`, `compare_ui_changes`
- **Usage**: Test React components with user interactions

### 4. Playwright Chromatic MCP (`playwright-chromatic`)
- **Purpose**: End-to-end testing with visual regression
- **Commands**: `run_e2e_tests`, `capture_page_snapshots`, `test_responsive_design`
- **Usage**: Full application testing and visual validation

### 5. ByteBot OS MCP (`bytebot`)
- **Purpose**: Desktop-level automation and complex workflows
- **Commands**: `automate_workflow`, `test_full_stack`, `database_operations`
- **Usage**: Complex automation that spans multiple tools

## Replit-Specific Features
- **Database**: Use Drizzle ORM with Neon PostgreSQL
- **Storage**: Access Replit Storage for assets
- **Secrets**: All tokens stored in Replit Secrets
- **Ports**: App (3000), Storybook (6006), Tests (3001)

## Common Testing Workflows

### Component Development
1. Create component in React
2. Add Storybook story using `storybook` MCP
3. Test component with `chromatic-cypress` MCP
4. Capture visual baselines with `chromatic-storybook` MCP

### Feature Testing
1. Develop feature with database interactions (Drizzle ORM)
2. Test E2E flows with `playwright-chromatic` MCP
3. Validate responsive design across breakpoints
4. Check visual regressions with Chromatic

### Automated Workflows
1. Use `bytebot` MCP for complex automation
2. Test database migrations and seeding
3. Validate Replit Storage integrations
4. Monitor application performance

## Example Prompts
- "Create a new React component with Storybook story and Chromatic visual tests"
- "Test the user registration flow using Playwright with database validation"
- "Generate Cypress component tests for the social media feed with visual assertions"
- "Set up automated testing workflow for the entire social platform using ByteBot"
- "Debug visual regression issues in the profile component"

## Monitoring & Debugging
- **All Logs**: `npm run logs:all`
- **MCP Logs**: `npm run mcp:logs`
- **Test Results**: Check `./logs/visual-tests.log`
- **Database**: Monitor via Drizzle Studio
- **Storage**: Check Replit Storage dashboard

## Environment Setup
All environment variables and secrets are managed through Replit:
- `CHROMATIC_PROJECT_TOKEN` (Replit Secret)
- `DATABASE_URL` (Neon integration)
- `STORYBOOK_API_KEY` (Replit Secret)

## Best Practices
1. Always test components in isolation first (Storybook)
2. Use Cypress for user interaction testing
3. Use Playwright for full E2E scenarios
4. Leverage ByteBot for complex workflows
5. Monitor all services through centralized logging
6. Use Drizzle ORM for all database operations
7. Store assets in Replit Storage

## Spiritual Platform Features to Test
When working with Ascended Social, focus on these unique features:

### Chakra System
- Test chakra-based content categorization (7 chakra types)
- Validate spiritual frequency scoring
- Ensure chakra-themed UI components work correctly

### Energy System
- Test energy point allocation and refresh cycles
- Validate energy sharing between users
- Monitor energy-based engagement mechanics

### Oracle Readings
- Test AI-powered oracle reading generation
- Validate personalized spiritual guidance
- Ensure proper tarot/spiritual content handling

### 3D Starmap Visualizer
- Test React Three Fiber components
- Validate starmap and fungal mode switching
- Check real-time user data visualization

### Spiritual Engagement
- Test spiritual-themed reactions (upvotes, downvotes, energy sharing)
- Validate user aura level progression
- Check spiritual content metrics

## Database Schema Focus
Key tables to test with Drizzle ORM:
- `users` - User profiles with spiritual attributes
- `posts` - Content with chakra categorization
- `sparks` - Spiritual engagement actions
- `oracles` - AI-generated spiritual readings
- `energy_transactions` - Energy point tracking

## Common Development Commands
```bash
# Development
npm run dev              # Start full stack with Storybook
npm run dev:server       # Backend only
npm run dev:client       # Frontend only

# Database
npm run db:push          # Push schema changes

# Testing
npm run test:visual:all  # All visual tests
npm run mcp:start        # Start MCP servers

# Monitoring
npm run logs:all         # All service logs
```

This configuration enables enterprise-level testing capabilities while maintaining the spiritual essence and unique features of the Ascended Social platform.