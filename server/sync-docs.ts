import { readFileSync } from 'fs';
import { createOrUpdateDocumentationPage } from './notion.js';

// Sync documentation to Notion
async function syncDocsToNotion() {
    try {
        console.log('📚 Syncing documentation to Notion...');
        
        // Read the replit.md file
        const docContent = readFileSync('../replit.md', 'utf-8');
        
        // Upload to Notion
        const pageId = await createOrUpdateDocumentationPage(docContent);
        
        console.log('✅ Documentation successfully synced to Notion!');
        console.log(`📄 Page ID: ${pageId}`);
        
        return pageId;
    } catch (error) {
        console.error('❌ Error syncing documentation:', error);
        throw error;
    }
}

// Run sync
syncDocsToNotion()
    .then(() => {
        console.log('🎉 Documentation sync complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Sync failed:', error);
        process.exit(1);
    });

export { syncDocsToNotion };