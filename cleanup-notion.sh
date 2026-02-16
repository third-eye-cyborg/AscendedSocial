#!/bin/bash

# Delete Notion-related files

echo "Deleting Notion-related files..."

rm -f server/notion.ts
rm -f server/notion-mcp-server.ts
rm -f server/notion-mcp-routes.ts
rm -f server/auto-sync-service.ts
rm -f server/auto-sync-routes.ts
rm -f server/sync-docs.ts
rm -f server/sync-replit-env-docs.ts
rm -f server/sync-comprehensive-docs.ts
rm -f server/update-notion-auth-docs.ts
rm -f server/update-mobile-dev-db.ts
rm -f server/update-comprehensive-api-docs.ts
rm -f server/update-main-docs.ts
rm -f server/update-notion-workspace.ts
rm -f server/update-existing-notion-pages.ts

# Delete the cleanup files themselves
rm -f delete-notion-files.js
rm -f cleanup-notion.sh

echo "✅ Notion files deleted successfully!"
