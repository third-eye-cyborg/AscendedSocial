import { notion, NOTION_PAGE_ID, createDatabaseIfNotExists } from './notion.js';

// Setup all development databases mentioned in replit.md
async function setupDevelopmentDatabases() {
    try {
        console.log('🗄️ Setting up development databases in Notion...');
        
        // 1. Development Tasks Database
        console.log('📋 Creating Development Tasks database...');
        const devTasksDb = await createDatabaseIfNotExists("Development Tasks", {
            Title: {
                title: {}
            },
            Type: {
                select: {
                    options: [
                        { name: "Feature", color: "blue" },
                        { name: "Bug", color: "red" },
                        { name: "Improvement", color: "green" },
                        { name: "Documentation", color: "orange" },
                        { name: "Technical Debt", color: "gray" }
                    ]
                }
            },
            Status: {
                select: {
                    options: [
                        { name: "To Do", color: "gray" },
                        { name: "In Progress", color: "blue" },
                        { name: "Review", color: "yellow" },
                        { name: "Done", color: "green" },
                        { name: "Blocked", color: "red" }
                    ]
                }
            },
            Priority: {
                select: {
                    options: [
                        { name: "High", color: "red" },
                        { name: "Medium", color: "yellow" },
                        { name: "Low", color: "green" }
                    ]
                }
            },
            Description: {
                rich_text: {}
            },
            "Assigned To": {
                rich_text: {}
            },
            "Due Date": {
                date: {}
            },
            "Created Date": {
                date: {}
            },
            "Completed Date": {
                date: {}
            },
            "Time Tracking": {
                rich_text: {}
            },
            "Technical Notes": {
                rich_text: {}
            }
        });

        // 2. Mobile Development Database
        console.log('📱 Creating Mobile Development database...');
        const mobileDevDb = await createDatabaseIfNotExists("Mobile Development", {
            Title: {
                title: {}
            },
            Platform: {
                select: {
                    options: [
                        { name: "iOS", color: "blue" },
                        { name: "Android", color: "green" },
                        { name: "Cross-Platform", color: "purple" },
                        { name: "Backend Integration", color: "orange" }
                    ]
                }
            },
            Status: {
                select: {
                    options: [
                        { name: "Planning", color: "gray" },
                        { name: "In Development", color: "blue" },
                        { name: "Testing", color: "yellow" },
                        { name: "Completed", color: "green" },
                        { name: "On Hold", color: "red" }
                    ]
                }
            },
            "Auth Integration Status": {
                select: {
                    options: [
                        { name: "Not Started", color: "gray" },
                        { name: "In Progress", color: "blue" },
                        { name: "Integrated", color: "green" },
                        { name: "Testing", color: "yellow" }
                    ]
                }
            },
            "Backend Sync": {
                checkbox: {}
            },
            Description: {
                rich_text: {}
            },
            "Implementation Notes": {
                rich_text: {}
            }
        });

        // 3. Project Task Management Database
        console.log('📊 Creating Project Task Management database...');
        const projectTaskDb = await createDatabaseIfNotExists("Project Task Management", {
            Title: {
                title: {}
            },
            Category: {
                select: {
                    options: [
                        { name: "Development", color: "blue" },
                        { name: "Design", color: "purple" },
                        { name: "Documentation", color: "orange" },
                        { name: "Testing", color: "yellow" },
                        { name: "Deployment", color: "green" },
                        { name: "Planning", color: "gray" }
                    ]
                }
            },
            Status: {
                select: {
                    options: [
                        { name: "Backlog", color: "gray" },
                        { name: "To Do", color: "gray" },
                        { name: "In Progress", color: "blue" },
                        { name: "Review", color: "yellow" },
                        { name: "Done", color: "green" }
                    ]
                }
            },
            Priority: {
                select: {
                    options: [
                        { name: "Critical", color: "red" },
                        { name: "High", color: "orange" },
                        { name: "Medium", color: "yellow" },
                        { name: "Low", color: "green" }
                    ]
                }
            },
            "Assigned To": {
                rich_text: {}
            },
            "Due Date": {
                date: {}
            },
            "Time Tracking": {
                rich_text: {}
            },
            "Technical Notes": {
                rich_text: {}
            },
            Description: {
                rich_text: {}
            }
        });

        // 4. Change Log Database
        console.log('📝 Creating Change Log database...');
        const changeLogDb = await createDatabaseIfNotExists("Change Log", {
            Title: {
                title: {}
            },
            "Change Type": {
                select: {
                    options: [
                        { name: "Feature Added", color: "green" },
                        { name: "Bug Fixed", color: "red" },
                        { name: "Improvement", color: "blue" },
                        { name: "Documentation", color: "orange" },
                        { name: "Configuration", color: "gray" },
                        { name: "Refactoring", color: "purple" }
                    ]
                }
            },
            Date: {
                date: {}
            },
            Version: {
                rich_text: {}
            },
            Description: {
                rich_text: {}
            },
            "Technical Details": {
                rich_text: {}
            },
            "Files Changed": {
                rich_text: {}
            },
            "Impact": {
                select: {
                    options: [
                        { name: "Major", color: "red" },
                        { name: "Minor", color: "yellow" },
                        { name: "Patch", color: "green" }
                    ]
                }
            },
            "Commit Hash": {
                rich_text: {}
            }
        });

        // 5. Project Documentation Database
        console.log('📚 Creating Project Documentation database...');
        const projectDocsDb = await createDatabaseIfNotExists("Project Documentation", {
            Title: {
                title: {}
            },
            "Document Type": {
                select: {
                    options: [
                        { name: "Technical Specification", color: "blue" },
                        { name: "User Guide", color: "green" },
                        { name: "API Documentation", color: "orange" },
                        { name: "Architecture", color: "purple" },
                        { name: "Process", color: "gray" },
                        { name: "Troubleshooting", color: "red" }
                    ]
                }
            },
            Status: {
                select: {
                    options: [
                        { name: "Draft", color: "gray" },
                        { name: "In Review", color: "yellow" },
                        { name: "Published", color: "green" },
                        { name: "Outdated", color: "red" }
                    ]
                }
            },
            "Last Updated": {
                date: {}
            },
            "Updated By": {
                rich_text: {}
            },
            Description: {
                rich_text: {}
            },
            "Content Summary": {
                rich_text: {}
            },
            "Related Links": {
                rich_text: {}
            }
        });

        console.log('✅ All development databases created successfully!');
        console.log('📊 Database Summary:');
        console.log(`- Development Tasks: ${devTasksDb.id}`);
        console.log(`- Mobile Development: ${mobileDevDb.id}`);
        console.log(`- Project Task Management: ${projectTaskDb.id}`);
        console.log(`- Change Log: ${changeLogDb.id}`);
        console.log(`- Project Documentation: ${projectDocsDb.id}`);

        return {
            devTasksDb,
            mobileDevDb,
            projectTaskDb,
            changeLogDb,
            projectDocsDb
        };
    } catch (error) {
        console.error('❌ Error setting up development databases:', error);
        throw error;
    }
}

// Add sample data to demonstrate the databases
async function addSampleData() {
    try {
        console.log('🌱 Adding sample data to databases...');
        
        // Find the Development Tasks database
        const databases = await setupDevelopmentDatabases();
        
        // Add a sample development task
        const sampleTask = await notion.pages.create({
            parent: {
                database_id: databases.devTasksDb.id
            },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: "Enhanced Mobile Post Card Responsiveness"
                            }
                        }
                    ]
                },
                Type: {
                    select: {
                        name: "Improvement"
                    }
                },
                Status: {
                    select: {
                        name: "Done"
                    }
                },
                Priority: {
                    select: {
                        name: "High"
                    }
                },
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: "Optimized PostCard component for mobile devices with responsive spacing, touch-friendly buttons, and improved image handling. Fixed TypeScript errors and enhanced user experience on mobile."
                            }
                        }
                    ]
                },
                "Created Date": {
                    date: {
                        start: new Date().toISOString().split('T')[0]
                    }
                },
                "Completed Date": {
                    date: {
                        start: new Date().toISOString().split('T')[0]
                    }
                },
                "Technical Notes": {
                    rich_text: [
                        {
                            text: {
                                content: "Updated responsive classes (sm:, md:), improved button sizing for touch interaction, fixed imageUrls TypeScript interface, and optimized spacing throughout the component."
                            }
                        }
                    ]
                }
            }
        });

        // Add a sample change log entry
        const sampleChangeLog = await notion.pages.create({
            parent: {
                database_id: databases.changeLogDb.id
            },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: "Mobile PostCard Optimization & Notion Integration Setup"
                            }
                        }
                    ]
                },
                "Change Type": {
                    select: {
                        name: "Improvement"
                    }
                },
                Date: {
                    date: {
                        start: new Date().toISOString().split('T')[0]
                    }
                },
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: "Enhanced mobile responsiveness of PostCard component and established complete Notion integration for development workflow management."
                            }
                        }
                    ]
                },
                "Technical Details": {
                    rich_text: [
                        {
                            text: {
                                content: "1. Fixed responsive classes in PostCard.tsx for mobile optimization\n2. Setup Notion databases for development tracking\n3. Created documentation sync workflows\n4. Established project management integration"
                            }
                        }
                    ]
                },
                "Files Changed": {
                    rich_text: [
                        {
                            text: {
                                content: "client/src/components/PostCard.tsx, server/notion.ts, server/setup-notion-databases.ts, replit.md"
                            }
                        }
                    ]
                },
                Impact: {
                    select: {
                        name: "Minor"
                    }
                }
            }
        });

        console.log('✅ Sample data added successfully!');
        console.log(`📋 Sample Task: ${sampleTask.id}`);
        console.log(`📝 Sample Change Log: ${sampleChangeLog.id}`);

    } catch (error) {
        console.error('❌ Error adding sample data:', error);
        throw error;
    }
}

// Run setup
setupDevelopmentDatabases()
    .then(() => addSampleData())
    .then(() => {
        console.log('🎉 Notion development workspace setup complete!');
        console.log('🔗 Check your Notion workspace for all the new databases and documentation');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Setup failed:', error);
        process.exit(1);
    });

export { setupDevelopmentDatabases, addSampleData };