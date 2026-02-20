# 📚 Ascended Social Codespace - Documentation Index

Welcome to your GitHub Codespace for Ascended Social! This folder contains all the configuration and documentation for your development environment.

## 📖 Quick Links to Documentation

### 🚀 Getting Started
1. **[ONBOARDING.md](./ONBOARDING.md)** - Start here! Complete guide to creating and using your Codespace
2. **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step verification that everything works
3. **[README.md](./README.md)** - Codespace features and available commands

### 🛠️ Development Resources
4. **[RESOURCES.md](./RESOURCES.md)** - Tools, extensions, and references available in the Codespace
5. **[COPILOT_GUIDE.md](./COPILOT_GUIDE.md)** - How to use GitHub Copilot effectively
6. **[codespacesrc](./codespacesrc)** - Bash aliases for faster development

### 📱 Platform Features
7. **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** - Ascended Social features, spirituality, and content types

### ⚙️ Configuration Files
8. **[devcontainer.json](./devcontainer.json)** - Main Codespace configuration
9. **[Dockerfile](./Dockerfile)** - Docker image definition
10. **[codespaces.json](./codespaces.json)** - GitHub Codespaces prebuilt container config
11. **[launch.json](./launch.json)** - VS Code debugging configuration
12. **[init.sh](./init.sh)** - Initialization script

---

## 🎯 Choose Your Path

### Path 1: I'm New Here (Never Used This Codespace)
1. Read **[ONBOARDING.md](./ONBOARDING.md)** - 10 min read
2. Follow the setup steps - 5 minutes
3. Follow SETUP_CHECKLIST.md - 5 minutes
4. Start coding!

**Total Time: ~20 minutes**

### Path 2: I Know Node/React Development
1. Skim **[README.md](./README.md)** - 5 minutes
2. Run `npm run dev` - 2 minutes
3. Check **[COPILOT_GUIDE.md](./COPILOT_GUIDE.md)** if using Copilot
4. Start coding!

**Total Time: ~10 minutes**

### Path 3: I Want to Understand the Platform
1. Read **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** - 15 minutes
2. Read **[ONBOARDING.md](./ONBOARDING.md)** - 10 minutes
3. Explore the code in `client/src/` and `server/`
4. Ask Copilot (Ctrl+I) for explanations

**Total Time: ~30 minutes**

### Path 4: I'm Troubleshooting Issues
1. Check **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - 5 minutes
2. Review **[README.md](./README.md)** (Troubleshooting section) - 5 minutes
3. Check **[RESOURCES.md](./RESOURCES.md)** for tool help
4. Use **[COPILOT_GUIDE.md](./COPILOT_GUIDE.md)** to ask Copilot

**Total Time: Varies by issue**

---

## 📋 File Descriptions

| File | Purpose | Read Time |
|------|---------|-----------|
| **ONBOARDING.md** | Complete getting started guide | 15 min |
| **README.md** | Codespace overview, quick commands | 10 min |
| **SETUP_CHECKLIST.md** | Verification steps and troubleshooting | 10 min |
| **RESOURCES.md** | Available tools, extensions, references | 10 min |
| **CONTENT_GUIDE.md** | Platform features and spiritual system | 20 min |
| **COPILOT_GUIDE.md** | GitHub Copilot tips and prompts | 15 min |
| **devcontainer.json** | Main container configuration (technical) | - |
| **Dockerfile** | Docker customization (technical) | - |
| **launch.json** | Debug configuration (technical) | - |
| **codespacesrc** | Bash aliases (use with: `source codespacesrc`) | - |

---

## 🚀 Quick Start Commands

```bash
# Start development
npm run dev

# View logs
npm run logs:all

# Run tests
npm run test:visual:all

# Type check
npm run check

# Database operations
npm run db:push

# Enable these convenient aliases
source .devcontainer/codespacesrc

# Then use shortcuts
start              # npm run dev
test-all           # npm run test:visual:all
health-check       # Verify setup
```

---

## 🎓 Key Concepts

### Ascended Social Architecture
```
┌─────────────────────────────────┐
│   React Frontend (port 3000)    │
│   - Components in client/src/   │
│   - Chakra UI + Tailwind CSS    │
│   - 3D Starmap visualization    │
└──────────────┬──────────────────┘
               │ API (Express.js)
┌──────────────▼──────────────────┐
│  Express Backend (port 3000)    │
│  - Routes in server/routes/     │
│  - Authentication & auth        │
│  - Oracle generation            │
└──────────────┬──────────────────┘
               │ Drizzle ORM
┌──────────────▼──────────────────┐
│  PostgreSQL (Neon)              │
│  - Users, Posts, Sparks         │
│  - Oracles, Energy Transactions │
└─────────────────────────────────┘
```

### 7 Chakras (Content Categories)
1. 🔴 **Root** - Foundation & community
2. 🟠 **Sacral** - Creativity
3. 💛 **Solar Plexus** - Power
4. 💚 **Heart** - Love & compassion
5. 🔵 **Throat** - Communication
6. 💜 **Third Eye** - Intuition
7. 🟣 **Crown** - Enlightenment

### Energy System
- Users earn **Energy Points (EP)** through engagement
- Use EP to create posts, oracle readings, etc.
- Share EP with community members
- Daily refresh cycle

---

## 🤖 GitHub Copilot Commands

| Command | Shortcut | Purpose |
|---------|----------|---------|
| **Open Chat** | Ctrl+I | Chat with Copilot |
| **Inline Chat** | Ctrl+Shift+I | Quick suggestions |
| **Explain Code** | Select + /explain | Understand code |
| **Generate Tests** | Select + /tests | Create test cases |
| **Add Docs** | Select + /doc | Documentation |

See **[COPILOT_GUIDE.md](./COPILOT_GUIDE.md)** for more!

---

## 📞 Getting Help

**Quick Help**
- Press `Ctrl+I` to ask Copilot
- Check README.md (Troubleshooting)
- Search docs/ folder

**Setup Issues**
- Review SETUP_CHECKLIST.md
- Check .env configuration
- Verify database connection

**Platform Questions**
- Read CONTENT_GUIDE.md
- Ask Copilot to explain features
- Browse docs/

**Development Help**
- Ask Copilot (Ctrl+I)
- Check RESOURCES.md
- Reference existing code

---

## 🔄 Typical Workflow

1. **Create branch**: `git checkout -b feature/name`
2. **Start dev server**: `npm run dev`
3. **Make changes**: Edit files in client/ or server/
4. **Test**: `npm run test:cypress` or `npm run test:playwright`
5. **Commit**: `git add . && git commit -m "message"`
6. **Push**: `git push origin feature/name`
7. **Create PR**: Go to GitHub and open Pull Request
8. **Iterate**: Make changes based on review
9. **Merge**: Merge to main when approved

---

## 🌟 Pro Tips

1. **Enable Bash Commands**: Run bash aliases:
   ```bash
   source .devcontainer/codespacesrc
   ```

2. **Keep Dev Server Running**: Open multiple terminals (Ctrl+Shift+`)

3. **Use Copilot Frequently**: Press Ctrl+I for help on anything

4. **Test Before Pushing**: Run `npm run test:visual:all`

5. **Regular Commits**: Commit often with descriptive messages

6. **Check Types**: Run `npm run check` before pushing

7. **Review Logs**: Use `npm run logs:all` to monitor services

---

## 🎉 You're Ready!

Your Codespace is fully configured and ready for development.

### Next Steps:
1. ✅ Read [ONBOARDING.md](./ONBOARDING.md)
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Press Ctrl+I to chat with Copilot
5. ✅ Start building!

---

## 📚 Additional Resources

**Inside this Repo:**
- `README.md` - Project overview
- `docs/` - Full documentation
- `replit.md` - Replit-specific info

**External:**
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🔮 Welcome!

This is Ascended Social - a spiritual social media platform where consciousness and community converge.

**May your code be enlightened. ✨**

---

*Last Updated: February 17, 2026*
*For questions or issues, check the documentation or ask GitHub Copilot (Ctrl+I)*
