import { notion, NOTION_PAGE_ID } from './notion.js';

// Extract page ID from Notion URL
function extractPageIdFromUrl(url: string): string {
  const match = url.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error(`Failed to extract page ID from URL: ${url}`);
}

// Get page content
async function getPageContent(pageId: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page;
  } catch (error: any) {
    console.error(`Error retrieving page ${pageId}:`, error.message);
    return null;
  }
}

// Get page blocks (content)
async function getPageBlocks(pageId: string) {
  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    return blocks.results;
  } catch (error: any) {
    console.error(`Error retrieving blocks for page ${pageId}:`, error.message);
    return [];
  }
}

// Get database content
async function getDatabaseContent(databaseId: string) {
  try {
    const database = await notion.databases.query({ database_id: databaseId });
    return database.results;
  } catch (error: any) {
    console.error(`Error retrieving database ${databaseId}:`, error.message);
    return [];
  }
}

// Inspect a single page
async function inspectPage(url: string, pageType: 'page' | 'database' = 'page') {
  try {
    const pageId = extractPageIdFromUrl(url);
    console.log(`\n🔍 Inspecting ${pageType}: ${url}`);
    console.log(`📄 Page ID: ${pageId}`);
    
    if (pageType === 'database') {
      const content = await getDatabaseContent(pageId);
      console.log(`📊 Database entries: ${content.length}`);
      
      if (content.length > 0) {
        console.log(`📋 Sample entries:`);
        content.slice(0, 3).forEach((entry: any, index: number) => {
          console.log(`  ${index + 1}. ${JSON.stringify(entry.properties, null, 2)}`);
        });
      }
    } else {
      const page = await getPageContent(pageId);
      if (page) {
        console.log(`📄 Page title: ${page.properties?.title?.title?.[0]?.plain_text || 'No title'}`);
        console.log(`📄 Page type: ${page.object}`);
        console.log(`📄 Created: ${page.created_time}`);
        console.log(`📄 Last edited: ${page.last_edited_time}`);
        
        const blocks = await getPageBlocks(pageId);
        console.log(`📝 Content blocks: ${blocks.length}`);
        
        if (blocks.length > 0) {
          console.log(`📋 Block types:`);
          const blockTypes = blocks.map((block: any) => block.type);
          const uniqueTypes = [...new Set(blockTypes)];
          uniqueTypes.forEach(type => {
            const count = blockTypes.filter(t => t === type).length;
            console.log(`  - ${type}: ${count}`);
          });
        }
      }
    }
    
    return { success: true, pageId, content: pageType === 'database' ? await getDatabaseContent(pageId) : await getPageBlocks(pageId) };
  } catch (error: any) {
    console.error(`❌ Error inspecting page ${url}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main inspection function
async function inspectAllPages() {
  console.log('🔍 Starting Notion pages inspection...\n');
  
  const pages = [
    { url: 'https://www.notion.so/258308ef03eb8165800dee4c5416a596?pvs=21', name: 'Development Tasks', type: 'database' as const },
    { url: 'https://www.notion.so/258308ef03eb8133b761d033ea5b2dbf?pvs=21', name: 'Change Log', type: 'database' as const },
    { url: 'https://www.notion.so/258308ef03eb817faf0cdeb8839f9db4?pvs=21', name: 'Project Task Management', type: 'database' as const },
    { url: 'https://www.notion.so/Replit-Development-Environments-Version-Control-25a308ef03eb8131872fe55ebea8d6e3?pvs=21', name: 'Replit Development Environments & Version Control', type: 'page' as const },
    { url: 'https://www.notion.so/260308ef03eb815ba890d84ecf9d8631?pvs=21', name: 'Project Documentation', type: 'page' as const },
    { url: 'https://www.notion.so/Web-to-Mobile-Sync-Documentation-260308ef03eb81a0b145fc8f7c1054e4?pvs=21', name: 'Web-to-Mobile Sync Documentation', type: 'page' as const },
    { url: 'https://www.notion.so/API-Reference-Documentation-265308ef03eb81fe8324ea6c6455a9c7?pvs=21', name: 'API Reference Documentation', type: 'page' as const },
    { url: 'https://www.notion.so/Mobile-Development-Guide-265308ef03eb81f39105ea7124c91b67?pvs=21', name: 'Mobile Development Guide', type: 'page' as const },
    { url: 'https://www.notion.so/Advanced-Spiritual-Features-265308ef03eb81f4a9b2d80ed989a571?pvs=21', name: 'Advanced Spiritual Features', type: 'page' as const },
    { url: 'https://www.notion.so/Security-Compliance-Framework-265308ef03eb8186abe8da1f37b06395?pvs=21', name: 'Security & Compliance Framework', type: 'page' as const },
    { url: 'https://www.notion.so/Ascended-Social-Design-System-Styling-265308ef03eb81ee88ceed4ea4c1c4f8?pvs=21', name: '🎨 Ascended Social - Design System & Styling', type: 'page' as const },
    { url: 'https://www.notion.so/Mobile-Authentication-Routing-Fix-265308ef03eb81a4a41bf826ade2fcf3?pvs=21', name: 'Mobile Authentication Routing Fix', type: 'page' as const },
    { url: 'https://www.notion.so/Enhanced-Mobile-Authentication-System-266308ef03eb81b29a11de39ad16bd4f?pvs=21', name: 'Enhanced Mobile Authentication System', type: 'page' as const },
    { url: 'https://www.notion.so/Mobile-Authentication-API-Reference-266308ef03eb812dba68cc036cc0038e?pvs=21', name: 'Mobile Authentication API Reference', type: 'page' as const }
  ];
  
  const results = [];
  
  for (const page of pages) {
    const result = await inspectPage(page.url, page.type);
    results.push({
      name: page.name,
      url: page.url,
      ...result
    });
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Inspection Summary:');
  console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed pages:');
    failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }
  
  return results;
}

// Run the inspection
inspectAllPages()
  .then((results) => {
    console.log('\n🎉 Notion pages inspection completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Inspection failed:', error);
    process.exit(1);
  });

export { inspectAllPages, inspectPage };
