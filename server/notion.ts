import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Failed to extract page ID");
}

export const NOTION_PAGE_ID = extractPageIdFromUrl(process.env.NOTION_PAGE_URL!);

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 * @returns {Promise<Array<{id: string, title: string}>>} - Array of database objects with id and title
 */
export async function getNotionDatabases() {

    // Array to store the child databases
    const childDatabases = [];

    try {
        // Query all child blocks in the specified page
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: NOTION_PAGE_ID,
                start_cursor: startCursor,
            });

            // Process the results
            for (const block of response.results) {
                // Check if the block is a child database
                if (block.type === "child_database") {
                    const databaseId = block.id;

                    // Retrieve the database title
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        // Add the database to our list
                        childDatabases.push(databaseInfo);
                    } catch (error) {
                        console.error(`Error retrieving database ${databaseId}:`, error);
                    }
                }
            }

            // Check if there are more results to fetch
            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return childDatabases;
    } catch (error) {
        console.error("Error listing child databases:", error);
        throw error;
    }
}

// Find get a Notion database with the matching title
export async function findDatabaseByTitle(title: string) {
    const databases = await getNotionDatabases();

    for (const db of databases) {
        if (db.title && Array.isArray(db.title) && db.title.length > 0) {
            const dbTitle = db.title[0]?.plain_text?.toLowerCase() || "";
            if (dbTitle === title.toLowerCase()) {
                return db;
            }
        }
    }

    return null;
}

// Create a new database if one with a matching title does not exist
export async function createDatabaseIfNotExists(title: string, properties: any) {
    const existingDb = await findDatabaseByTitle(title);
    if (existingDb) {
        return existingDb;
    }
    return await notion.databases.create({
        parent: {
            type: "page_id",
            page_id: NOTION_PAGE_ID
        },
        title: [
            {
                type: "text",
                text: {
                    content: title
                }
            }
        ],
        properties
    });
}

// Create or update documentation page
export async function createOrUpdateDocumentationPage(content: string) {
    try {
        // First, check if there's already a documentation page
        const existingPages = await notion.blocks.children.list({
            block_id: NOTION_PAGE_ID
        });

        let docPageId: string | null = null;
        
        // Look for existing documentation page
        for (const block of existingPages.results) {
            if (block.type === 'child_page' && 'title' in block.child_page) {
                // Get page details to check title
                const pageDetails = await notion.pages.retrieve({
                    page_id: block.id
                });
                
                if ('properties' in pageDetails && pageDetails.properties.title && 
                    'title' in pageDetails.properties.title && 
                    Array.isArray(pageDetails.properties.title.title)) {
                    const title = pageDetails.properties.title.title[0]?.plain_text || '';
                    if (title.toLowerCase().includes('documentation') || title.toLowerCase().includes('readme')) {
                        docPageId = block.id;
                        break;
                    }
                }
            }
        }

        // If no documentation page exists, create one
        if (!docPageId) {
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
                                    content: "Project Documentation"
                                }
                            }
                        ]
                    }
                }
            });
            docPageId = newPage.id;
        } else {
            // Clear existing content
            const existingBlocks = await notion.blocks.children.list({
                block_id: docPageId
            });
            
            for (const block of existingBlocks.results) {
                await notion.blocks.delete({
                    block_id: block.id
                });
            }
        }

        // Convert markdown content to Notion blocks
        const lines = content.split('\n');
        const blocks: any[] = [];
        
        for (const line of lines) {
            if (!line.trim()) {
                continue; // Skip empty lines
            }
            
            if (line.startsWith('# ')) {
                blocks.push({
                    object: "block",
                    type: "heading_1",
                    heading_1: {
                        rich_text: [{
                            type: "text",
                            text: { content: line.substring(2) }
                        }]
                    }
                });
            } else if (line.startsWith('## ')) {
                blocks.push({
                    object: "block",
                    type: "heading_2",
                    heading_2: {
                        rich_text: [{
                            type: "text",
                            text: { content: line.substring(3) }
                        }]
                    }
                });
            } else if (line.startsWith('### ')) {
                blocks.push({
                    object: "block",
                    type: "heading_3",
                    heading_3: {
                        rich_text: [{
                            type: "text",
                            text: { content: line.substring(4) }
                        }]
                    }
                });
            } else if (line.startsWith('- ') || line.startsWith('  - ')) {
                const content = line.startsWith('  - ') ? line.substring(4) : line.substring(2);
                blocks.push({
                    object: "block",
                    type: "bulleted_list_item",
                    bulleted_list_item: {
                        rich_text: [{
                            type: "text",
                            text: { content }
                        }]
                    }
                });
            } else {
                // Regular paragraph
                blocks.push({
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [{
                            type: "text",
                            text: { content: line }
                        }]
                    }
                });
            }
        }

        // Add blocks in batches (Notion API limit is 100 blocks per request)
        const batchSize = 100;
        for (let i = 0; i < blocks.length; i += batchSize) {
            const batch = blocks.slice(i, i + batchSize);
            await notion.blocks.children.append({
                block_id: docPageId,
                children: batch
            });
        }

        return docPageId;
    } catch (error) {
        console.error("Error creating/updating documentation page:", error);
        throw error;
    }
}