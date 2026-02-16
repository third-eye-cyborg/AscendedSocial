import { unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const notionFiles = [
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

console.log('Removing Notion-related files...\n');

let successCount = 0;
let errorCount = 0;

for (const file of notionFiles) {
  const filePath = join(rootDir, file);
  try {
    await unlink(filePath);
    console.log(`✅ Deleted: ${file}`);
    successCount++;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⏭️  Skipped (not found): ${file}`);
    } else {
      console.error(`❌ Error deleting ${file}:`, error.message);
      errorCount++;
    }
  }
}

console.log(`\n📊 Summary: ${successCount} deleted, ${errorCount} errors`);

// Also clean up the temporary deletion scripts
const cleanupFiles = [
  'delete-notion-files.js',
  'cleanup-notion.sh',
  'scripts/remove-notion-files.mjs'
];

console.log('\n🧹 Cleaning up temporary scripts...');
for (const file of cleanupFiles) {
  try {
    await unlink(join(rootDir, file));
    console.log(`✅ Deleted: ${file}`);
  } catch (error) {
    // Ignore errors for cleanup files
  }
}

console.log('\n✨ Notion removal complete!');
