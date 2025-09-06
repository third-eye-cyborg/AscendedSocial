# Notion Auto-Sync Integration Guide

This guide explains how to use the comprehensive Notion auto-sync system that integrates with MCP (Model Context Protocol) to automatically synchronize your project documentation with Notion.

## 🚀 Features

- **Automatic File Watching**: Monitors file changes and syncs to Notion in real-time
- **MCP Integration**: Full Model Context Protocol support for AI tools
- **Mobile Sync Support**: Cross-platform documentation sync for mobile apps
- **Flexible Configuration**: Customizable watch paths, sync intervals, and file filters
- **Comprehensive API**: RESTful endpoints for manual and automatic sync control
- **Error Handling**: Robust error handling with detailed logging and status reporting

## 📁 System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   File System   │───▶│  Auto-Sync       │───▶│   Notion API    │
│   (Markdown,    │    │  Service         │    │   (Pages &      │
│    TypeScript)  │    │                  │    │    Databases)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   MCP Server     │
                       │   (AI Tools)     │
                       └──────────────────┘
```

## 🛠️ Setup

### 1. Install Dependencies

The required dependencies are already added to `package.json`:

```bash
npm install chokidar glob @types/chokidar @types/glob
```

### 2. Environment Variables

Ensure these environment variables are set:

```bash
NOTION_INTEGRATION_SECRET=your_notion_integration_secret
NOTION_PAGE_ID=your_notion_page_id
```

### 3. Start the Auto-Sync Service

The auto-sync service is automatically registered at `/api/auto-sync`. Initialize it:

```bash
curl -X POST https://your-backend-url/api/auto-sync/init \
  -H "Content-Type: application/json" \
  -d '{
    "watchPaths": ["../*.md", "../docs/**/*.md", "../server/**/*.ts"],
    "syncInterval": 30000,
    "mobileSync": true,
    "includeCodeFiles": false
  }'
```

## 📚 API Endpoints

### Auto-Sync Service (`/api/auto-sync`)

#### Initialize Service
```http
POST /api/auto-sync/init
Content-Type: application/json

{
  "watchPaths": ["../*.md", "../docs/**/*.md"],
  "syncInterval": 30000,
  "mobileSync": true,
  "includeCodeFiles": false
}
```

#### Start Auto-Sync
```http
POST /api/auto-sync/start
```

#### Stop Auto-Sync
```http
POST /api/auto-sync/stop
```

#### Sync All Files
```http
POST /api/auto-sync/sync-all
```

#### Sync Mobile Docs
```http
POST /api/auto-sync/sync-mobile
Content-Type: application/json

{
  "platform": "all"
}
```

#### Get Status
```http
GET /api/auto-sync/status
```

#### Update Configuration
```http
POST /api/auto-sync/config
Content-Type: application/json

{
  "watchPaths": ["../*.md", "../mobile/**/*.md"],
  "syncInterval": 60000,
  "mobileSync": true
}
```

### Notion MCP Service (`/api/notion-mcp`)

#### Initialize MCP Server
```http
POST /api/notion-mcp/init
```

#### Get Available Tools
```http
GET /api/notion-mcp/tools
```

#### Execute MCP Tool
```http
POST /api/notion-mcp/execute/sync_documentation
Content-Type: application/json

{
  "arguments": {
    "filePath": "../README.md",
    "forceUpdate": true
  }
}
```

#### Quick Sync
```http
POST /api/notion-mcp/sync
Content-Type: application/json

{
  "filePath": "../README.md",
  "includeCodeFiles": false
}
```

## 📱 Mobile Integration

### Using the Mobile Sync Client

1. **Copy the client to your mobile Replit**:
   ```bash
   # Copy mobile-sync-client.ts to your mobile project
   ```

2. **Initialize the client**:
   ```typescript
   import { createMobileSyncClient } from './mobile-sync-client';
   
   const mobileSync = createMobileSyncClient(
     'https://your-backend-url',
     'your-api-key' // optional
   );
   
   // Initialize and start auto-sync
   await mobileSync.init();
   await mobileSync.startAutoSync();
   ```

3. **Manual sync operations**:
   ```typescript
   // Sync all mobile docs
   const results = await mobileSync.syncAllDocs();
   
   // Sync specific platform docs
   const iosResults = await mobileSync.syncMobileDocs('ios');
   
   // Get sync status
   const status = await mobileSync.getStatus();
   ```

## 🔧 Configuration Options

### Watch Paths
Configure which files to monitor for changes:

```typescript
const config = {
  watchPaths: [
    '../*.md',                    // All markdown files in parent directory
    '../docs/**/*.md',           // All markdown files in docs subdirectory
    '../server/**/*.ts',         // All TypeScript files in server directory
    '../mobile/**/*.tsx',        // All React Native files in mobile directory
    '../components/**/*.tsx'     // All component files
  ]
};
```

### Sync Intervals
Set how often to perform periodic syncs:

```typescript
const config = {
  syncInterval: 30000,  // 30 seconds
  // syncInterval: 60000,  // 1 minute
  // syncInterval: 300000, // 5 minutes
};
```

### File Filters
Control which file types to sync:

```typescript
const config = {
  includeCodeFiles: false,  // Exclude .ts, .js files
  mobileSync: true,         // Enable mobile-specific sync
};
```

## 📊 Monitoring and Status

### Check Sync Status
```bash
curl https://your-backend-url/api/auto-sync/status
```

Response:
```json
{
  "success": true,
  "status": {
    "isRunning": true,
    "lastSyncTime": "2024-01-15T10:30:00.000Z",
    "statistics": {
      "totalFiles": 25,
      "successfulSyncs": 23,
      "failedSyncs": 2,
      "skippedSyncs": 0
    },
    "recentResults": [...]
  }
}
```

### View Sync History
The service maintains a history of all sync operations with detailed results.

## 🚨 Error Handling

### Common Issues

1. **Notion API Rate Limits**: The service handles rate limiting automatically
2. **File Permission Errors**: Ensure the service has read access to watched files
3. **Network Connectivity**: The service retries failed syncs automatically
4. **Invalid Markdown**: Files with invalid markdown are logged but don't stop the service

### Debugging

Enable detailed logging by checking the server console output. All sync operations are logged with timestamps and status information.

## 🔄 Workflow Examples

### 1. Development Workflow
```bash
# 1. Start the auto-sync service
curl -X POST https://your-backend-url/api/auto-sync/init

# 2. Make changes to your documentation
echo "# New Feature" >> ../docs/new-feature.md

# 3. Changes are automatically synced to Notion
# Check status to see sync results
curl https://your-backend-url/api/auto-sync/status
```

### 2. Mobile Development Workflow
```typescript
// In your mobile Replit
const mobileSync = createMobileSyncClient('https://your-backend-url');

// Initialize
await mobileSync.init();

// Start auto-sync
await mobileSync.startAutoSync();

// Your mobile docs will now sync automatically
// when you make changes to markdown files
```

### 3. Manual Sync Workflow
```bash
# Sync specific file
curl -X POST https://your-backend-url/api/notion-mcp/sync \
  -H "Content-Type: application/json" \
  -d '{"filePath": "../README.md"}'

# Sync all mobile docs
curl -X POST https://your-backend-url/api/auto-sync/sync-mobile \
  -H "Content-Type: application/json" \
  -d '{"platform": "all"}'
```

## 🎯 Best Practices

1. **Organize Documentation**: Use consistent file naming and directory structure
2. **Monitor Sync Status**: Regularly check the sync status and fix any failed syncs
3. **Use Meaningful Commit Messages**: The sync service logs all changes
4. **Test Mobile Sync**: Verify mobile documentation syncs correctly
5. **Backup Important Docs**: Notion serves as your backup, but keep local copies too

## 🔐 Security Considerations

- The auto-sync service requires proper Notion API credentials
- File watching is limited to specified paths for security
- All API endpoints should be protected with appropriate authentication
- Consider using environment variables for sensitive configuration

## 📈 Performance Tips

1. **Optimize Watch Paths**: Only watch necessary directories
2. **Adjust Sync Intervals**: Balance between responsiveness and performance
3. **Filter File Types**: Exclude unnecessary file types to reduce sync load
4. **Monitor Resource Usage**: Check server resources when running auto-sync

## 🆘 Troubleshooting

### Service Won't Start
- Check environment variables
- Verify Notion API credentials
- Check file permissions for watch paths

### Files Not Syncing
- Verify file paths are correct
- Check if files match watch patterns
- Review error logs for specific issues

### Mobile Sync Issues
- Verify backend URL is accessible
- Check API key if using authentication
- Ensure mobile client is properly initialized

## 📞 Support

For issues or questions:
1. Check the server logs for detailed error messages
2. Verify your Notion API setup
3. Test with manual sync operations first
4. Review the configuration options

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Author**: Ascended Social Development Team
