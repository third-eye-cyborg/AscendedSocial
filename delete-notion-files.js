const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'server/notion.ts',
  'server/notion-mcp-server.ts',
  'server/notion-mcp-routes.ts',
  'server/auto-sync-service.ts',
  'server/auto-sync-routes.ts',
  'server/sync-docs.ts',
  'server/sync-replit-env-docs.ts',
  'server/sync-comprehensive-docs.ts',
  'server/update-notion-auth-docs.ts',
  'server/update-mobile-dev-db.ts',
  'server/update-comprehensive-api-docs.ts',
  'server/update-main-docs.ts',
  'server/update-notion-workspace.ts',
  'server/update-existing-notion-pages.ts'
];

let deleted = 0;
let notFound = 0;

filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
      deleted++;
    } else {
      console.log(`⚠️  Not found: ${file}`);
      notFound++;
    }
  } catch (error) {
    console.error(`❌ Error deleting ${file}:`, error.message);
  }
});

console.log(`\n📊 Summary: ${deleted} deleted, ${notFound} not found`);
