# Ascended Social Codespace - Resources & Content Guide

## 📚 Learning Resources

### Documentation & References

#### Official Documentation
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

#### Ascended Social Specific
- **Local Docs**: See `docs/` folder
- **Project README**: `README.md`
- **Replit Guide**: `replit.md`
- **API Reference**: `docs/api-reference.md` (if available)

### Technology Stack

**Frontend**
- React 18.3+
- Vite 7.3+ (build tool)
- TypeScript 5.6+
- Tailwind CSS 3.4+
- Radix UI Components
- React Three Fiber (3D visualization)

**Backend**
- Express.js 4.21+
- Node.js 20+
- TypeScript
- Passport.js (authentication)
- Express Session

**Database**
- PostgreSQL (via Neon)
- Drizzle ORM 0.39+
- Drizzle Kit

**Testing**
- Cypress (component & E2E)
- Playwright (E2E testing)
- Vitest (unit testing)
- Chromatic (visual regression)

**Tools & Services**
- Builder.io (visual CMS)
- GitHub Copilot (AI coding assistant)
- Sentry (error tracking)
- PostHog (analytics)
- OpenAI (AI integration)

## 🛠️ Useful Codespace Tools

### VS Code Extensions (Pre-installed)

**Essential Development**
- **GitHub Copilot** - AI code assistant
- **GitHub Copilot Chat** - Chat with AI about code
- **ESLint** - Code quality
- **Prettier** - Code formatter
- **TypeScript** - Type checking

**React & Frontend**
- **ES7+ React/Redux/React-Native Snippets** - Code snippets
- **React Snippets** - Additional React helpers
- **Tailwind CSS IntelliSense** - CSS class completion

**Testing & Debugging**
- **Playwright Test for VSCode** - Run Playwright tests
- **Cypress** - E2E testing
- **Jest Runner** - Unit test runner

**UI Components**
- **Radix UI** - Component library docs

**Utilities**
- **Git Lens** - Git history & blame
- **Docker** - Docker management
- **Todo Tree** - TODO/FIXME highlighting
- **Code Spell Checker** - Spelling validation
- **Error Lens** - Inline error display
- **Log File Highlighter** - Log file syntax

### Command Line Tools (Pre-installed)

```bash
# Package Managers
npm          # Node package manager
pnpm         # Alternative fast package manager
yarn         # Alternative package manager

# Development
tsx          # TypeScript executor
tsc          # TypeScript compiler
node         # Node.js runtime
npx          # NPM package runner

# Database
psql         # PostgreSQL client
sqlite3      # SQLite client
drizzle-kit  # Drizzle ORM tools

# Git Tools
git          # Version control
gh           # GitHub CLI
git-lfs      # Git Large File Storage

# Utilities
jq           # JSON processor
docker       # Container management
python3      # Python runtime
