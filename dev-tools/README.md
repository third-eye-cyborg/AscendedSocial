# Development Tools

## Trello Integration for Development

The Trello integration is set up as a development tool to help track tasks and progress for the Ascended Social project.

### Board Information
- **Board**: Ascended Social Development
- **URL**: https://trello.com/b/68a9ced99aed4ab60de0c985
- **Board ID**: `68a9ced99aed4ab60de0c985`

### Setup Instructions

1. **Get Trello Credentials**:
   - API Key: https://trello.com/app-key
   - Token: Generate with read/write access to the board

2. **Configure Environment**:
   ```bash
   # Add to Replit Secrets
   TRELLO_API_KEY=your_api_key_here
   TRELLO_TOKEN=your_token_here
   ```

3. **Test Connection**:
   ```bash
   node dev-tools/trello-dev.js test
   ```

### Usage Commands

```bash
# View all commands
node dev-tools/trello-dev.js

# List all boards (to verify access)
node dev-tools/trello-dev.js boards

# Show board lists (To Do, In Progress, Done, etc.)
node dev-tools/trello-dev.js lists

# Show current tasks
node dev-tools/trello-dev.js cards

# Create a new task
node dev-tools/trello-dev.js create <listId> "Task name" "Optional description"

# Test everything
node dev-tools/trello-dev.js test
```

### Development Workflow

1. **Task Creation**: Either developer can create tasks in Trello
2. **Status Updates**: Move cards between lists (To Do → In Progress → Done)
3. **Communication**: Use card comments for technical details
4. **Code Reviews**: Link pull requests or commits to cards

### Troubleshooting

- **401 Unauthorized**: Regenerate API key and token
- **Board not found**: Verify board ID and access permissions
- **Missing lists**: Check board configuration matches expected structure