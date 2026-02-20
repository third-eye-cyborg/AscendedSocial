# 🔮 GitHub Codespace - Complete Onboarding Guide

Welcome to Ascended Social! This guide will help you get started in GitHub Codespaces.

## 📖 Quick Navigation

| Document | Purpose |
|----------|---------|
| **README.md** | Overview & quick start commands |
| **SETUP_CHECKLIST.md** | Step-by-step setup verification |
| **RESOURCES.md** | Tools, extensions, and references |
| **CONTENT_GUIDE.md** | Platform features & spiritual content |
| **ONBOARDING.md** | This file - getting started |

## 🚀 Start Here (5 minutes)

### 1. Create Your Codespace
Follow one of these methods:

**Via GitHub Web (Easiest)**
```
1. Go to github.com/third-eye-cyborg/AscendedSocial
2. Click Code (green button)
3. Click "Create codespace on main"
4. Wait ~2-3 minutes for initialization
```

**Via GitHub CLI**
```bash
gh codespace create --repo third-eye-cyborg/AscendedSocial
```

**Via VS Code**
```
1. Install "Remote - Codespaces" extension
2. Ctrl+Shift+P → "Create New Codespace"
3. Select the repository
```

### 2. Verify Setup
When your Codespace loads, you should see:
- ✅ Terminal showing "npm install" completed
- ✅ No red error messages
- ✅ GitHub Copilot icon in sidebar
- ✅ File explorer showing project files

### 3. Start Development
```bash
npm run dev
```

Open `http://localhost:3000` to see the application running.

---

## 🎯 First 30 Minutes

### What's Running?
Your Codespace automatically:
- **Installed** all npm dependencies
- **Configured** TypeScript
- **Setup** database connection
- **Prepared** development servers

### Your First Task (Choose one)

#### Option A: Explore the Application
1. Open browser to `http://localhost:3000`
2. Click around and explore features
3. Open DevTools (F12) to inspect
4. Ask Copilot (Ctrl+I): "What is the App component doing?"

#### Option B: Review Code Structure
```bash
# Terminal commands to explore
ls -la client/src/           # Frontend structure
ls -la server/               # Backend structure
cat README.md               # Project overview
```

#### Option C: Run Tests
```bash
npm run test:cypress         # Component tests
# or
npm run test:playwright      # E2E tests
```

#### Option D: Check Copilot
1. Press `Ctrl+I` to open Copilot Chat
2. Ask a question about the code
3. Ask for help on any file
4. Request code generation

---

## 💻 Development Workflow

### Daily Startup
```bash
# Terminal 1
npm run dev

# Terminal 2 (optional - to watch logs)
npm run logs:all
```

### Making Changes
```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make your changes
# Edit files, add features, etc.

# Commit your work
git add .
git commit -m "Add: feature description"
git push origin feature/my-feature
```

### Testing Changes
```bash
npm run check              # Type check
npm run test:cypress       # Component tests
npm run test:playwright    # E2E tests
```

### Create Pull Request
1. Go to GitHub repository
2. Click "Compare & Pull Request"
3. Add description
4. Request reviewers
5. Merge when approved

---

## 🤖 Using GitHub Copilot

### Getting Started with Copilot

**Copilot Commands:**
- **Ctrl+I** - Open Copilot Chat
- **Ctrl+J** - Quick chat (inline)
- **/explain** - Explain selected code
- **/tests** - Generate tests
- **/doc** - Add documentation

### Example Prompts

```
"Explain this component and what it does"

"Generate tests for this function"

"Refactor this code to use TypeScript best practices"

"How do I create a new post in this system?"

"What does the chakra system do?"

"Help me debug this error: [error message]"
```

### Copilot Chat Tips
1. **Include context** - Select code before asking
2. **Be specific** - "Create a React component that..." works better
3. **Ask follow-ups** - Continue the conversation
4. **Use slash commands** - /explain, /tests, /doc
5. **Reference files** - Type `#` to reference files

---

## 📚 Learning the Project

### Project Structure (Quick Tour)

```
. (root)
├── client/               ← React Frontend
│   └── src/
│       ├── components/   ← Reusable React components
│       ├── pages/        ← Page components
│       └── App.tsx       ← Main app
├── server/               ← Express Backend
│   └── index.ts          ← Server entry point
├── shared/               ← Shared code
│   └── types.ts          ← Type definitions
├── migrations/           ← Database migrations
├── docs/                 ← Documentation
└── .devcontainer/        ← Codespace config (YOU ARE HERE)
```

### Understanding the Chakra System

The platform organizes content by chakra (energy centers):
- **Root** (Red) - Foundation & community
- **Sacral** (Orange) - Creativity
- **Solar Plexus** (Yellow) - Power & will
- **Heart** (Green) - Love & compassion
- **Throat** (Blue) - Communication
- **Third Eye** (Indigo) - Intuition
- **Crown** (Violet) - Enlightenment

See `.devcontainer/CONTENT_GUIDE.md` for full details.

### Database Understanding

The platform uses:
- **PostgreSQL** via Neon (cloud database)
- **Drizzle ORM** for database queries
- Check `server/db/` for schema

Key tables:
- `users` - User profiles
- `posts` - Content
- `sparks` - Engagement
- `oracles` - AI readings

---

## 🛠️ Common Tasks

### Add a New Component
```bash
# Create file
touch client/src/components/MyComponent.tsx

# Open Copilot Chat (Ctrl+I)
# Ask: "Create a React component for..."
```

### Create an API Endpoint
```bash
# Ask Copilot:
# "Create an Express route that..."

# Or check existing routes:
ls server/routes/
```

### Update Database
```bash
# Make changes to schema (server/db/schema.ts)
npm run db:push              # Push to database
npm run db:studio            # Visual editor (if available)
```

### Run Tests
```bash
npm run test:cypress         # Component tests
npm run test:playwright      # E2E tests
npm run test:visual:all      # All tests
```

### Check Type Safety
```bash
npm run check                # TypeScript check
```

---

## 🐛 Debugging

### Browser DevTools
Press `F12` to open DevTools:
- **Console** - View logs and errors
- **Network** - See API calls
- **Sources** - Debug JavaScript
- **Application** - View storage

### VS Code Debugger
Configuration is in `.devcontainer/launch.json`
- Set breakpoints (click line number)
- Press F5 to start debugging
- Step through code

### View Logs
```bash
npm run logs:all             # All services
tail -f logs/mcp-servers.log # Specific log
```

### Enable Detailed Logging
```bash
DEBUG=* npm run dev          # Very verbose output
```

---

## 📱 Ports & Services

Your Codespace forwards these ports:

| Port | Service | URL |
|------|---------|-----|
| 3000 | Application | http://localhost:3000 |
| 3001 | Preview/Builder | http://localhost:3001 |
| 6006 | Storybook | http://localhost:6006 |

All are automatically accessible via GitHub's port forwarding.

---

## 💾 Saving Your Work

### Regular Commits
```bash
git add .
git commit -m "What you changed"
git push origin feature/my-feature
```

### Create Pull Request
1. Push your branch
2. Go to GitHub repository
3. Click "Compare & Pull Request"
4. Fill in description
5. Submit for review

### Codespace Lifecycle
- **Idle**: Auto-pauses after 30 minutes (you can resume)
- **Active**: You're using it
- **Stopped**: You stopped it manually
- **Deleted**: Frees up quota hours

---

## ❓ FAQs

**Q: How do I stop my Codespace?**
A: Click your avatar → Codespaces → Select Codespace → Stop

**Q: Will my work be saved?**
A: Yes! All files and git history persists when you close the browser

**Q: Can I use my own editor?**
A: Yes! VS Code on your computer can connect to Codespaces (Remote extension)

**Q: How much does it cost?**
A: GitHub gives free quota hours. Check your account settings for details.

**Q: What if something breaks?**
A: Ask Copilot (Ctrl+I) or check the docs. You can also create a new Codespace.

**Q: How do I get help?**
A: Use Copilot Chat (Ctrl+I), check `.devcontainer/README.md`, or contact the team

---

## 🎓 Next Steps

After completing setup:

1. **Week 1**: Learn the codebase
   - Browse through files
   - Ask Copilot questions
   - Read documentation

2. **Week 2**: Make small changes
   - Fix typos or docs
   - Update UI text
   - Add comments

3. **Week 3**: Contribute features
   - Pick an issue
   - Build a feature
   - Submit pull request

4. **Ongoing**: Master the platform
   - Understand spiritual features
   - Learn frontend/backend separation
   - Contribute to discussions

---

## 📞 Getting Help

| Need | Action |
|------|--------|
| Quick answer | Press Ctrl+I (Copilot Chat) |
| Code explanation | Select code → Ctrl+I → /explain |
| Generate code | Ask Copilot in chat |
| Bug report | Create GitHub issue |
| Questions | Check README.md or docs/ |
| Feature request | Check discussions |

---

## 🎉 You're Ready!

Your Codespace is set up and ready for development.

**Right now:**
1. ✅ Open a terminal (press Ctrl+`)
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Press Ctrl+I to chat with Copilot
5. ✅ Start coding!

---

### Tips Before You Go

- **Source aliases**: `source .devcontainer/codespacesrc` for shortcuts
- **Keep terminal open**: Keep `npm run dev` running
- **Use multiple terminals**: Open new terminal with Ctrl+Shift+`
- **Tab/Window switcher**: Use Ctrl+Tab to switch between files
- **Command Palette**: Press Ctrl+Shift+P for all commands
- **GitHub Copilot**: Press Ctrl+I whenever you need help

---

**Welcome to the team! Happy coding! 🔮✨**

---

### Quick Links
- [GitHub Repository](https://github.com/third-eye-cyborg/AscendedSocial)
- [Project README](../../README.md)
- [Setup Checklist](.SETUP_CHECKLIST.md)
- [Resources Guide](./RESOURCES.md)
- [Content Guide](./CONTENT_GUIDE.md)
- [Codespace README](./README.md)

---

*Last updated: Feb 17, 2026*
