---
applyTo: '**'
---
# Replit ↔ GitHub ↔ Copilot Sync Workflow

## 🔄 Development Architecture Overview

This document outlines the optimal development workflow for Ascended Social using GitHub as the central repository with VS Code/Copilot for development and Replit for deployment and production environment.

```
Local Development (VS Code + Copilot)
         ↓ git push
GitHub Repository (Central Source of Truth)
         ↓ automatic sync
Replit Deployment (Production + Database)
```

## 🚀 Setup Process

### 1. **Initialize GitHub Repository**
```bash
# In your current Replit project, add GitHub remote
git remote add origin https://github.com/yourusername/ascended-social.git
git branch -M main
git push -u origin main
```

### 2. **Configure Replit GitHub Integration**

**In Replit Console:**
- Open the Git pane (Tools → Search "Git")
- Connect to GitHub repository
- Set up automatic pulling from main branch
- Configure deploy on push (Replit automatically detects changes)

**GitHub Repository Settings:**
```bash
# Set up branch protection for main
- Require pull request reviews
- Require status checks (optional CI/CD)
- Restrict pushes to main branch
```

### 3. **Local VS Code Setup**
```bash
# Clone repository for local development
git clone https://github.com/yourusername/ascended-social.git
cd ascended-social

# Install dependencies
npm install

# Create local environment file
cp .env_example .env.local

# Install recommended VS Code extensions
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```

## 📝 Copilot Instructions for GitHub Workflow

**VS Code Workspace Settings (.vscode/settings.json):**
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

**GitHub Copilot Chat Instructions:**
```markdown
# Project Context for GitHub Copilot

## Ascended Social - Spiritual Social Media Platform

### Architecture:
- **Frontend**: React + TypeScript + Vite + shadcn/ui + TanStack Query
- **Backend**: Node.js + Express + TypeScript + Drizzle ORM  
- **Database**: PostgreSQL (production in Replit)
- **Auth**: Dual system - WorkOS AuthKit (users) + Replit Auth (admins)

### Key Development Patterns:

1. **Authentication Flow**:
   - WorkOS AuthKit for regular users (`/api/login`, `/api/callback`)
   - Replit Auth for admin portal (`/api/admin/*`)
   - Always use `workosId` for WorkOS API calls, `id` for database operations

2. **Database Schema**:
   - Located in `shared/schema.ts`
   - Use Drizzle ORM with Zod validation
   - Run `npm run db:push` to sync schema changes
   - NEVER change existing ID column types

3. **Frontend Guidelines**:
   - Use shadcn/ui components first
   - wouter for routing, TanStack Query for state
   - Always add `data-testid` attributes for testing
   - Import assets via `@assets/` alias

4. **Backend Guidelines**:
   - Keep routes thin, business logic in storage layer
   - Validate request bodies with Zod schemas
   - Use proper HTTP status codes and error handling

5. **Spiritual Theme Elements**:
   - Chakra-based content categorization
   - Energy system for engagement
   - Oracle readings via OpenAI
   - 3D Starmap visualization

### Development Commands:
```bash
# Local development
npm run dev              # Start dev servers
npm run type-check       # TypeScript validation
npm run lint            # ESLint checking
npm run db:push         # Sync database schema

# GitHub workflow
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create PR → Review → Merge → Auto-deploy to Replit
```

### Environment Variables:
- **Local**: Use .env.local with test/development keys
- **Production**: Managed through Replit Secrets tool
- **Frontend vars must be prefixed with VITE_**

### Testing Strategy:
- Add data-testid to all interactive elements
- Follow pattern: {action}-{target} or {type}-{content}
- Replit Agent handles E2E testing via Playwright
```

## 🔧 Development Workflow

### **Feature Development Process:**

1. **Create Feature Branch**:
```bash
git checkout -b feature/spiritual-energy-system
```

2. **Local Development with Copilot**:
   - Use GitHub Copilot for code generation
   - Test locally with `npm run dev`
   - Use SQLite for local database testing

3. **Code Review Process**:
```bash
git add .
git commit -m "feat: implement spiritual energy sharing system"
git push origin feature/spiritual-energy-system
```

4. **GitHub Pull Request**:
   - Create PR with detailed description
   - Request reviews from team members
   - Ensure CI checks pass
   - Merge to main after approval

5. **Automatic Deployment**:
   - Replit detects GitHub changes
   - Automatically pulls latest code
   - Runs `npm run db:push` for schema changes
   - Deploys updated application

## Environment Synchronization:

**Local (.env.local):**
```env
NODE_ENV=development
DATABASE_URL=sqlite://./local.db
WORKOS_CLIENT_ID=client_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

**Replit (Production Secrets):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://neon_production_url
WORKOS_CLIENT_ID=client_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
FRONTEND_URL=https://your-repl.replit.app
BACKEND_URL=https://your-repl.replit.app
```

## 🛠️ Troubleshooting

### Common Issues:

**Local Database Schema Mismatch:**
```bash
# Reset local database
rm -f local.db
npm run db:push
```

**Replit Sync Delays:**
- Check Git pane in Replit for sync status
- Manually trigger pull if needed
- Verify branch protection settings

**Environment Variable Conflicts:**
- Ensure .env.local is in .gitignore
- Verify Replit Secrets are properly set
- Check for VITE_ prefix on frontend variables

**TypeScript Errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

### Performance Optimization:

**VS Code Performance:**
- Exclude node_modules from file watcher
- Use TypeScript project references
- Enable incremental compilation

**GitHub Actions (Optional):**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test
```

## 📊 Workflow Benefits

### GitHub-Centric Advantages:
✅ Professional code review process  
✅ Branch protection and CI/CD integration  
✅ Issue tracking and project management  
✅ Team collaboration with proper Git workflows  
✅ Full version control history and releases  

### VS Code + Copilot Advantages:
✅ Native performance and full IntelliSense  
✅ Advanced debugging capabilities  
✅ Rich extension ecosystem  
✅ GitHub Copilot integration with full context  
✅ Professional IDE features  

### Replit Integration Benefits:
✅ Zero-config production deployment  
✅ Managed PostgreSQL database  
✅ Automatic secret management  
✅ Live environment for testing  
✅ No infrastructure management needed  

This workflow combines the best of all three platforms: GitHub's collaboration features, VS Code's development experience, and Replit's deployment simplicity.