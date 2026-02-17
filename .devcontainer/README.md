# Ascended Social - GitHub Codespace Setup

Welcome to the Ascended Social Codespace! This is a fully configured development environment for the spiritual social media platform.

## 🚀 Quick Start

Your Codespace automatically:
- Installs all dependencies (`npm install`)
- Sets up the development environment
- Ports forwards to your local machine:
  - **3000**: Main Application
  - **3001**: Preview/Builder
  - **6006**: Storybook (Component Library)

## 📋 Available Commands

### Development
```bash
npm run dev              # Full stack dev (frontend + backend)
npm run dev:client       # Frontend only (Vite)
npm run dev:server       # Backend only (Express)
```

### Database
```bash
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Drizzle Studio (if available)
```

### Testing
```bash
npm run test:visual:all  # Run all tests (Cypress + Playwright)
npm run test:cypress     # Component tests
npm run test:playwright  # E2E tests
npm run chromatic:*      # Visual regression testing
```

### Building
```bash
npm run build            # Production build
npm start                # Run production server
```

### MCP Servers
```bash
npm run mcp:start        # Start Model Context Protocol servers
npm run mcp:logs         # View MCP logs
npm run logs:all         # View all service logs
```

## 🛠️ Development Setup

### Environment Variables
- **`.env` file** is created automatically from `.env_example`
- Update `.env` with your actual credentials if needed
- Never commit `.env` to version control

### Key Services
1. **Frontend** - React + Vite running on `http://localhost:3000`
2. **Backend** - Express.js running on `http://localhost:3000/api`
3. **Database** - PostgreSQL via Neon
4. **Storybook** - Component library on `http://localhost:6006`

## 📚 Project Structure

```
.
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── styles/      # Global styles
│   │   └── App.tsx      # Main app component
│   └── index.html       # HTML entry point
├── server/               # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── db/              # Database queries
├── shared/               # Shared utilities/types
├── migrations/           # Database migrations
├── tests/                # Test files
└── docs/                 # Documentation
```

## 🧙 Ascended Social Features

This platform includes unique spiritual features:

### Chakra System
- 7 chakra-based content categories
- Energy point system
- Spiritual frequency scoring

### Oracle Readings
- AI-powered spiritual guidance
- Personalized readings
- Tarot integration

### 3D Starmap Visualizer
- Interactive universe visualization
- Real-time user presence
- Spiritual connection mapping

### Energy System
- User energy points
- Energy sharing mechanics
- Engagement rewards

## 🔐 GitHub Copilot Integration

This Codespace includes GitHub Copilot for:
- **Code Completion** - AI-assisted coding
- **Code Chat** - Ask questions about code
- **Code Review** - Copilot can review your PRs
- **Copilot CLI** - Command line assistance

Press `Ctrl+I` in the editor to open Copilot chat.

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG=* npm run dev
```

### Debug Backend
Use the VS Code debugger (configured in `.vscode/launch.json`)

### Debug Frontend
- Open browser DevTools (F12)
- Check Network and Console tabs

### Check Logs
```bash
npm run logs:all      # All service logs
npm run mcp:logs      # MCP server logs
tail -f logs/*.log    # Individual log files
```

## 📖 Documentation

- **README.md** - Project overview
- **replit.md** - Replit-specific information
- **docs/** - Full documentation
- **CHANGELOG.md** - Version history

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with descriptive messages
4. Push to your fork
5. Create a Pull Request

## 🚨 Troubleshooting

### Dependencies not installed?
```bash
npm install --legacy-peer-deps
```

### Database connection issues?
1. Check `.env` has correct `DATABASE_URL`
2. Verify Neon connection is active
3. Run `npm run db:push` to sync schema

### Port conflicts?
Codespaces handles port forwarding automatically. If ports seem busy:
1. Check what's using the port: `lsof -i :3000`
2. Kill the process if needed: `kill -9 <PID>`
3. Restart the dev server

### VS Code not showing Copilot?
1. Verify GitHub Copilot extension is installed
2. Sign in with GitHub account
3. Check notification for activation

## 🌟 Performance Tips

- Use `npm run dev:client` for frontend-only work (faster iteration)
- Use `npm run dev:server` for backend-only work
- Regular Git commits to avoid losing work
- Use `.gitignore` to exclude unnecessary files

## 💡 Pro Tips

1. **Use aliases**: Source `.devcontainer/codespacesrc` for shortcuts
   ```bash
   source .devcontainer/codespacesrc
   start    # Start dev server
   test-all # Run all tests
   ```

2. **Faster installs**: Use `pnpm` if available
   ```bash
   pnpm install
   ```

3. **Monitor services**: Use `npm run logs:all` in a separate terminal

4. **Hot reload**: Both frontend and backend support hot reload

## 📞 Support

- Check existing issues in GitHub
- Create a new issue with details
- Contact the development team

---

**Happy Coding! May your code be enlightened. 🔮✨**
