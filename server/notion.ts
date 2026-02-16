type NotionClient = any;

let notionClient: NotionClient | null = null;
let notionClientInitAttempted = false;

// Legacy export for older scripts; use getNotionClient() for actual access.
export const notion: NotionClient | null = null;

async function getNotionClient(): Promise<NotionClient | null> {
    if (notionClientInitAttempted) {
        return notionClient;
    }

    notionClientInitAttempted = true;

    if (!process.env.NOTION_INTEGRATION_SECRET) {
        return null;
    }

    try {
        const { Client } = await import("@notionhq/client");
        notionClient = new Client({
            auth: process.env.NOTION_INTEGRATION_SECRET,
        });
        return notionClient;
    } catch (error: any) {
        if (error?.code === "ERR_MODULE_NOT_FOUND") {
            console.warn("⚠️ Notion SDK not installed. Notion integration disabled.");
            return null;
        }
        console.error("❌ Failed to initialize Notion client:", error);
        return null;
    }
}

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Failed to extract page ID");
}

export const NOTION_PAGE_ID = process.env.NOTION_PAGE_URL 
  ? extractPageIdFromUrl(process.env.NOTION_PAGE_URL)
  : null;

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 * @returns {Promise<Array<{id: string, title: string}>>} - Array of database objects with id and title
 */
export async function getNotionDatabases() {
    const notion = await getNotionClient();
    // Return empty array if Notion is not configured
    if (!notion || !NOTION_PAGE_ID) {
        console.log('⚠️ Notion integration not configured (missing NOTION_INTEGRATION_SECRET, NOTION_PAGE_URL, or SDK)');
        return [];
    }

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
                if ('type' in block && block.type === "child_database") {
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
        if ('title' in db && db.title && Array.isArray(db.title) && db.title.length > 0) {
            const dbTitle = 'title' in db && db.title[0]?.plain_text?.toLowerCase() || "";
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
    const notion = await getNotionClient();
    if (!notion || !NOTION_PAGE_ID) {
        console.warn('⚠️ Notion integration not configured. Skipping database creation.');
        return null;
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
        const notion = await getNotionClient();
        if (!notion || !NOTION_PAGE_ID) {
            console.warn('⚠️ Notion integration not configured. Skipping documentation sync.');
            return null;
        }
        // First, check if there's already a documentation page
        const existingPages = await notion.blocks.children.list({
            block_id: NOTION_PAGE_ID
        });

        let docPageId: string | null = null;
        
        // Look for existing documentation page
        for (const block of existingPages.results) {
            if ('type' in block && block.type === 'child_page' && 'child_page' in block) {
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