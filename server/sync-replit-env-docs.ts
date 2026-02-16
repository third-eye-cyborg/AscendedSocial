import { readFileSync } from 'fs';
import { notion, NOTION_PAGE_ID } from './notion.js';

// Create a specific function for Replit environment documentation
async function createReplitEnvironmentDocsPage(content: string) {
    try {
        console.log('🔧 Creating Replit Environment Documentation page...');
        
        // Create a new page specifically for Replit environment docs
        const newPage = await notion.pages.create({
            parent: {
                type: "page_id",
                page_id: NOTION_PAGE_ID
            },
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: "Replit Development Environments & Version Control"
                            }
                        }
                    ]
                }
            }
        });

        console.log(`📄 Created new page: ${newPage.id}`);

        // Convert markdown content to Notion blocks
        const lines = content.split('\n');
        const blocks: any[] = [];
        
        for (const line of lines) {
            if (line.startsWith('# ')) {
                // H1 Header
                blocks.push({
                    type: "heading_1",
                    heading_1: {
                        rich_text: [{ text: { content: line.substring(2) } }]
                    }
                });
            } else if (line.startsWith('## ')) {
                // H2 Header
                blocks.push({
                    type: "heading_2",
                    heading_2: {
                        rich_text: [{ text: { content: line.substring(3) } }]
                    }
                });
            } else if (line.startsWith('### ')) {
                // H3 Header
                blocks.push({
                    type: "heading_3",
                    heading_3: {
                        rich_text: [{ text: { content: line.substring(4) } }]
                    }
                });
            } else if (line.startsWith('#### ')) {
                // H4 Header (use heading_3 as Notion doesn't have h4)
                blocks.push({
                    type: "heading_3",
                    heading_3: {
                        rich_text: [{ text: { content: line.substring(5) } }]
                    }
                });
            } else if (line.startsWith('```')) {
                // Code block start/end - handle separately
                continue;
            } else if (line.startsWith('- ')) {
                // Bulleted list
                blocks.push({
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                        rich_text: [{ text: { content: line.substring(2) } }]
                    }
                });
            } else if (line.match(/^\d+\./)) {
                // Numbered list
                blocks.push({
                    type: "numbered_list_item",
                    numbered_list_item: {
                        rich_text: [{ text: { content: line.replace(/^\d+\.\s*/, '') } }]
                    }
                });
            } else if (line.startsWith('---')) {
                // Divider
                blocks.push({
                    type: "divider",
                    divider: {}
                });
            } else if (line.trim() !== '') {
                // Regular paragraph
                blocks.push({
                    type: "paragraph",
                    paragraph: {
                        rich_text: [{ text: { content: line } }]
                    }
                });
            }
        }

        // Add blocks in batches (Notion API limit is 100 blocks per request)
        const batchSize = 90;
        for (let i = 0; i < blocks.length; i += batchSize) {
            const batch = blocks.slice(i, i + batchSize);
            await notion.blocks.children.append({
                block_id: newPage.id,
                children: batch
            });
        }

        return newPage.id;
    } catch (error) {
        console.error("Error creating Replit environment documentation page:", error);
        throw error;
    }
}

// Sync Replit environment documentation to Notion
async function syncReplitEnvDocsToNotion() {
    try {
        console.log('📚 Syncing Replit Environment Documentation to Notion...');
        
        // Read the notion-replit-dev-environments.md file
        const docContent = readFileSync('../notion-replit-dev-environments.md', 'utf-8');
        
        // Upload to Notion
        const pageId = await createReplitEnvironmentDocsPage(docContent);
        
        console.log('✅ Replit Environment Documentation successfully synced to Notion!');
        console.log(`📄 Page ID: ${pageId}`);
        console.log(`🔗 Check your Notion workspace for the new "Replit Development Environments & Version Control" page`);
        
        return pageId;
    } catch (error) {
        console.error('❌ Error syncing Replit environment documentation:', error);
        throw error;
    }
}

// Run sync
syncReplitEnvDocsToNotion()
    .then(() => {
        console.log('🎉 Replit Environment Documentation sync complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Sync failed:', error);
        process.exit(1);
    });