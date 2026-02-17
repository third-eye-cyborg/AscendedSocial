# GitHub Codespaces - Setup Checklist

## ✅ Pre-Codespace Setup (One-time only)

- [ ] Fork the repository
- [ ] Verify GitHub Copilot is enabled on your account
- [ ] Generate GitHub personal access token (if needed)
- [ ] Ensure sufficient Codespace hours quota
- [ ] Review repository secrets/environment setup

## 🚀 Creating a Codespace

### Option 1: Via GitHub Web
1. Go to repository main page
2. Click "Code" button (green)
3. Click "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for environment to initialize

### Option 2: Via VS Code
1. Install Remote - Codespaces extension
2. Open Command Palette (Ctrl+Shift+P)
3. Type "Codespaces: Create New Codespace"
4. Select repository and branch
5. Wait for initialization

### Option 3: Via GitHub CLI
```bash
gh codespace create --repo your-username/AscendedSocial --branch main
```

## ⚙️ First-Time Setup Checklist

After Codespace opens:

- [ ] Terminal shows successful npm install
- [ ] `.env` file created with proper variables
- [ ] No error messages in terminal
- [ ] Type Checker (TypeScript) shows no errors
- [ ] Extensions loaded (GitHub Copilot visible)

## 🔧 Environment Configuration

### Required Environment Variables
Create `.env` with:
```
NODE_ENV=development
DATABASE_URL=<your-neon-database-url>
DIRECT_URL=<your-neon-direct-url>
OPENAI_API_KEY=<your-openai-key-if-using-ai>
GITHUB_TOKEN=<your-github-token>
```

### Optional Environment Variables
```
DEBUG=*                  # Enable verbose logging
CHROMATIC_PROJECT_TOKEN # Visual testing
FIGMA_FILE_KEY          # Design sync
FIGMA_ACCESS_TOKEN      # Design sync
```

## ✨ Startup Verification

After all setup:

1. **Check Node/npm**
   ```bash
   node --version  # Should be v20+
   npm --version   # Should be 8+
   ```

2. **Run Type Check**
   ```bash
   npm run check
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```

4. **Verify Ports**
   - 3000 - Application
   - 3001 - Preview/Builder
   - 6006 - Storybook

## 🎯 First Development Task

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Activate Copilot Chat: `Ctrl+I`

3. Ask Copilot: "Explain the project structure"

4. Make a small change and commit:
   ```bash
   git add .
   git commit -m "Initial exploration"
   git push -u origin feature/my-feature
   ```

5. Create a Pull Request on GitHub

## 🐛 Troubleshooting First Run

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Dependencies Failed
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Database Connection Error
1. Verify DATABASE_URL in .env
2. Check Neon connection status
3. Run: `npm run db:push`

### Copilot Not Showing
1. Check extension: Extensions sidebar → GitHub Copilot
2. Sign in with your GitHub account
3. Reload window: Ctrl+Shift+P → Reload

## 📱 Working with Codespace

### Daily Startup
```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Logs (optional)
npm run logs:all

# Terminal 3: Testing (optional)
npm run test:visual:all
```

### Managing Codespaces

**List Active Codespaces**
```bash
gh codespace list
```

**Stop a Codespace**
```bash
gh codespace stop -c <codespace-name>
```

**Delete a Codespace**
```bash
gh codespace delete -c <codespace-name>
```

**Connect to Existing Codespace**
```bash
gh codespace code -c <codespace-name>
```

## 💾 Saving Work

### Commit Regularly
```bash
git add .
git commit -m "Feature: description"
git push origin feature/my-feature
```

### Create PR for Feedback
1. Push feature branch
2. Go to GitHub → Compare & Pull Request
3. Add description
4. Request reviewers
5. Assign to yourself

### Codespace Lifecycle
- **Idle**: Automatically pauses after 30 mins
- **Stopped**: Can restart from GitHub
- **Deleted**: Frees up quota hours

## 🔄 Syncing with Main Branch

When main branch has updates:

```bash
git fetch origin main
git merge origin/main
# Or rebase if preferred:
git rebase origin/main

# Reinstall deps if needed
npm install
npm run db:push
```

## 📊 Monitoring Performance

**Check Resource Usage**
```bash
# Disk space
df -h

# Memory usage
free -h

# Running processes
ps aux | grep node
```

**View Logs**
```bash
npm run logs:all      # All services
npm run mcp:logs      # MCP servers only
tail -f logs/*.log    # Individual logs
```

## 🎓 Learning Resources

**Inside Codespace**
- `.devcontainer/README.md` - Full guide
- `.devcontainer/RESOURCES.md` - Tools & references
- `.devcontainer/CONTENT_GUIDE.md` - Platform features
- `docs/` - Project documentation

**External Resources**
- GitHub Copilot Docs
- VS Code Remote Development
- Project README.md
- Contributing guidelines

## 🎉 You're All Set!

Your Codespace is ready for development. 

**Next Steps:**
1. Choose a task from the issues
2. Activate Copilot Chat (Ctrl+I)
3. Ask Copilot for help
4. Code with confidence!

---

Remember: Your Codespace is stored in the cloud. You can close your browser and reconnect later!

**One more thing**: Source the bash aliases for productivity:
```bash
source .devcontainer/codespacesrc
```

Then use shortcuts:
```bash
start              # npm run dev
test-all           # npm run test:visual:all
health-check       # Verify setup
docs               # Open documentation
```

Happy coding! 🔮✨
