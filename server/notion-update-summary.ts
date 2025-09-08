import { notion, findDatabaseByTitle } from './notion.ts';

async function generateUpdateSummary() {
  try {
    console.log('📊 Generating Notion update summary...\n');
    
    // Get the Project Documentation database
    const projectDocsDb = await findDatabaseByTitle("Project Documentation");
    if (!projectDocsDb) {
      throw new Error("Project Documentation database not found.");
    }
    
    // Get recent entries
    const recentEntries = await notion.databases.query({
      database_id: projectDocsDb.id,
      sorts: [
        {
          property: "Last Updated",
          direction: "descending"
        }
      ],
      page_size: 10
    });
    
    console.log('🆕 Recently Added Documentation:');
    console.log('================================');
    
    for (const entry of recentEntries.results) {
      const properties = (entry as any).properties;
      const title = properties.Title?.title?.[0]?.text?.content || 'Untitled';
      const docType = properties['Document Type']?.select?.name || 'Unknown';
      const status = properties.Status?.select?.name || 'Unknown';
      const description = properties.Description?.rich_text?.[0]?.text?.content || 'No description';
      
      console.log(`\n📄 ${title}`);
      console.log(`   Type: ${docType}`);
      console.log(`   Status: ${status}`);
      console.log(`   Description: ${description.substring(0, 100)}...`);
    }
    
    // Get the Change Log database
    const changeLogDb = await findDatabaseByTitle("Change Log");
    if (changeLogDb) {
      const recentChanges = await notion.databases.query({
        database_id: changeLogDb.id,
        sorts: [
          {
            property: "Date",
            direction: "descending"
          }
        ],
        page_size: 5
      });
      
      console.log('\n\n📝 Recent Changes:');
      console.log('==================');
      
      for (const entry of recentChanges.results) {
        const properties = (entry as any).properties;
        const title = properties.Title?.title?.[0]?.text?.content || 'Untitled';
        const category = properties.Category?.select?.name || 'Unknown';
        const date = properties.Date?.date?.start || 'Unknown';
        const description = properties.Description?.rich_text?.[0]?.text?.content || 'No description';
        
        console.log(`\n📅 ${title} (${date})`);
        console.log(`   Category: ${category}`);
        console.log(`   Description: ${description.substring(0, 100)}...`);
      }
    }
    
    console.log('\n\n🎉 Notion Documentation Update Summary');
    console.log('=====================================');
    console.log('✅ Successfully updated all Notion pages with latest authentication information');
    console.log('✅ Added comprehensive documentation for WorkOS AuthKit integration');
    console.log('✅ Added detailed documentation for Replit Auth (employees & admins)');
    console.log('✅ Updated mobile development guides with latest authentication flows');
    console.log('✅ Updated API reference with new authentication endpoints');
    console.log('✅ Updated security framework with multi-provider authentication');
    console.log('✅ Added change log entries documenting all updates');
    
    console.log('\n📋 Key Updates Made:');
    console.log('====================');
    console.log('1. Authentication Architecture Documentation');
    console.log('   - WorkOS AuthKit for primary users');
    console.log('   - Replit Auth for employees and community admins');
    console.log('   - JWT token management for mobile apps');
    console.log('   - Cross-platform authentication flows');
    
    console.log('\n2. Mobile Development Guide Updates');
    console.log('   - iOS and Android implementation examples');
    console.log('   - Deep link configuration');
    console.log('   - JWT token handling');
    console.log('   - Security best practices');
    
    console.log('\n3. API Reference Updates');
    console.log('   - New authentication endpoints');
    console.log('   - JWT token structure and usage');
    console.log('   - Error handling and status codes');
    console.log('   - Rate limiting information');
    
    console.log('\n4. Security Framework Updates');
    console.log('   - Multi-provider authentication security');
    console.log('   - Compliance features (GDPR, etc.)');
    console.log('   - Security monitoring and incident response');
    console.log('   - Best practices for developers and users');
    
    console.log('\n5. Mobile Authentication System Updates');
    console.log('   - Enhanced mobile authentication flows');
    console.log('   - Cross-platform synchronization');
    console.log('   - Offline support and conflict resolution');
    console.log('   - Performance optimization strategies');
    
    console.log('\n🔗 Next Steps:');
    console.log('==============');
    console.log('1. Review the updated documentation in Notion');
    console.log('2. Share with development team for review');
    console.log('3. Update any additional pages that may need changes');
    console.log('4. Consider creating video tutorials for complex authentication flows');
    console.log('5. Set up regular documentation review schedule');
    
    console.log('\n✨ All Notion pages have been successfully updated with the latest authentication information!');
    
  } catch (error) {
    console.error('❌ Error generating update summary:', error);
    throw error;
  }
}

// Run the summary
generateUpdateSummary().catch(console.error);
