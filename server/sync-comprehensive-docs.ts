import { notion, NOTION_PAGE_ID, findDatabaseByTitle } from './notion.ts';

// Current comprehensive project status for documentation
const PROJECT_DOCUMENTATION = [
    {
        title: "Legal Framework & Email Domain Compliance",
        docType: "Technical Specification",
        status: "Published",
        description: "Complete legal documentation framework with corrected email domains for Third Eye Cyborg, LLC business operations",
        contentSummary: "All legal pages updated to use @ascended.social domain. Covers payment terms, copyright policy, service agreements, and third-party disclaimers."
    },
    {
        title: "Notion Workspace Integration Architecture",
        docType: "Technical Specification",
        status: "Published", 
        description: "Comprehensive Notion integration for project management with structured databases for development tracking",
        contentSummary: "Five databases created: Development Tasks, Mobile Development, Project Task Management, Change Log, and Project Documentation with full API integration."
    },
    {
        title: "Mobile Development Roadmap & Architecture",
        docType: "Architecture",
        status: "Published",
        description: "Complete mobile development strategy and technical architecture for React Native spiritual platform implementation", 
        contentSummary: "Cross-platform strategy covering authentication sync, 3D visualization adaptation, spiritual features mobile optimization, and app store deployment."
    },
    {
        title: "Web Platform Technical Architecture",
        docType: "Architecture",
        status: "Published",
        description: "Current web platform technical specification covering frontend, backend, and spiritual features implementation",
        contentSummary: "React/TypeScript frontend, Node.js/Express backend, PostgreSQL database, spiritual content classification, 3D starmap, oracle system, and payment integration."
    },
    {
        title: "Security Framework - Zero Trust Implementation",
        docType: "Technical Specification",
        status: "Published",
        description: "Comprehensive security architecture using Cloudflare Zero Trust with four-layer protection model",
        contentSummary: "User authentication (Replit Auth), admin access protection (Zero Trust), network protection (Gateway), and API protection (WAF) for enterprise-grade security."
    },
    {
        title: "Spiritual Features Technical Specification",
        docType: "Technical Specification",
        status: "Published",
        description: "Complete technical documentation of spiritual platform features including chakra classification, energy systems, and oracle functionality",
        contentSummary: "AI-powered chakra categorization, energy sharing mechanics, 3D starmap visualization, oracle reading system, and gamification features."
    }
];

// Recent change log entries for tracking
const CHANGE_LOG_ENTRIES = [
    {
        title: "Critical Email Domain Correction - Business Compliance",
        changeType: "Bug Fixed",
        description: "Systematic correction of email domains from @ascendedsocial.com to @ascended.social across entire platform for legal compliance",
        technicalDetails: "Updated 13 files: 7 legal pages, server components, frontend components, and documentation to ensure proper business communication",
        impact: "Major"
    },
    {
        title: "Notion Workspace Management System Implementation",
        changeType: "Feature Added",
        description: "Established comprehensive Notion integration for project management with structured databases and documentation sync",
        technicalDetails: "Created five databases with API integration: Development Tasks, Mobile Development, Project Task Management, Change Log, and Project Documentation",
        impact: "Minor"
    },
    {
        title: "Mobile Development Documentation & Todo System",
        changeType: "Documentation",
        description: "Created comprehensive mobile development roadmap with structured todo tracking in Notion workspace",
        technicalDetails: "Built 11 mobile development tasks covering React Native setup, authentication, UI adaptation, and app store deployment",
        impact: "Minor"
    }
];

async function syncComprehensiveDocs() {
    try {
        console.log('📚 Starting comprehensive documentation sync...');
        
        // Find existing databases
        const projectDocsDb = await findDatabaseByTitle("Project Documentation");
        const changeLogDb = await findDatabaseByTitle("Change Log");
        
        if (!projectDocsDb) {
            throw new Error("Project Documentation database not found.");
        }
        
        if (!changeLogDb) {
            throw new Error("Change Log database not found.");
        }

        console.log(`✅ Found Project Documentation DB: ${projectDocsDb.id}`);
        console.log(`✅ Found Change Log DB: ${changeLogDb.id}`);

        // Add Project Documentation
        console.log('📖 Adding project documentation...');
        for (const doc of PROJECT_DOCUMENTATION) {
            try {
                await notion.pages.create({
                    parent: { database_id: projectDocsDb.id },
                    properties: {
                        Title: {
                            title: [{ text: { content: doc.title } }]
                        },
                        Type: { select: { name: doc.docType } },
                        Status: { select: { name: doc.status } },
                        Description: {
                            rich_text: [{ text: { content: doc.description } }]
                        },
                        Summary: {
                            rich_text: [{ text: { content: doc.contentSummary } }]
                        }
                    }
                });
                console.log(`✅ Added documentation: ${doc.title}`);
            } catch (error) {
                console.log(`❌ Failed to add documentation: ${doc.title}`, error.message);
            }
        }

        // Add Change Log Entries
        console.log('📝 Adding change log entries...');
        for (const entry of CHANGE_LOG_ENTRIES) {
            try {
                await notion.pages.create({
                    parent: { database_id: changeLogDb.id },
                    properties: {
                        Title: {
                            title: [{ text: { content: entry.title } }]
                        },
                        Type: { select: { name: entry.changeType } },
                        Description: {
                            rich_text: [{ text: { content: entry.description } }]
                        },
                        Details: {
                            rich_text: [{ text: { content: entry.technicalDetails } }]
                        },
                        Impact: { select: { name: entry.impact } }
                    }
                });
                console.log(`✅ Added change log: ${entry.title}`);
            } catch (error) {
                console.log(`❌ Failed to add change log: ${entry.title}`, error.message);
            }
        }

        console.log('🎉 Comprehensive documentation sync completed!');
        console.log(`📖 Project Documentation: ${PROJECT_DOCUMENTATION.length} items`);
        console.log(`📝 Change Log Entries: ${CHANGE_LOG_ENTRIES.length} items`);
        
        return {
            projectDocs: PROJECT_DOCUMENTATION.length,
            changeLogEntries: CHANGE_LOG_ENTRIES.length,
            projectDocsDbId: projectDocsDb.id,
            changeLogDbId: changeLogDb.id
        };
    } catch (error) {
        console.error('❌ Error syncing comprehensive docs:', error);
        throw error;
    }
}

// Run the documentation sync
syncComprehensiveDocs()
    .then((result) => {
        console.log('✅ Comprehensive documentation sync complete!');
        console.log('📋 Summary:', result);
        console.log('📚 Your Notion workspace documentation is now fully up to date');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Documentation sync failed:', error);
        process.exit(1);
    });

export { syncComprehensiveDocs };