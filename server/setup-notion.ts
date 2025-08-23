import { Client } from "@notionhq/client";
import { notion, NOTION_PAGE_ID, createDatabaseIfNotExists, findDatabaseByTitle } from "./notion.js";

// Environment variables validation
if (!process.env.NOTION_INTEGRATION_SECRET) {
    throw new Error("NOTION_INTEGRATION_SECRET is not defined. Please add it to your environment variables.");
}

// Setup databases for development workflow
async function setupNotionDatabases() {
    console.log('🔧 Setting up development databases...');
    
    // Create Development Tasks database
    const tasksDb = await createDatabaseIfNotExists("Development Tasks", {
        // Every database needs a Name/Title property
        Title: {
            title: {}
        },
        Description: {
            rich_text: {}
        },
        Type: {
            select: {
                options: [
                    { name: "Feature", color: "blue" },
                    { name: "Bug Fix", color: "red" },
                    { name: "Enhancement", color: "green" },
                    { name: "Documentation", color: "purple" },
                    { name: "Refactor", color: "orange" },
                    { name: "Testing", color: "yellow" }
                ]
            }
        },
        Status: {
            select: {
                options: [
                    { name: "Backlog", color: "gray" },
                    { name: "To Do", color: "red" },
                    { name: "In Progress", color: "yellow" },
                    { name: "Review", color: "blue" },
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
        Assignee: {
            select: {
                options: [
                    { name: "User", color: "blue" },
                    { name: "AI Assistant", color: "purple" },
                    { name: "Collaboration", color: "green" }
                ]
            }
        },
        CreatedDate: {
            date: {}
        },
        CompletedDate: {
            date: {}
        }
    });

    console.log(`✅ Created Development Tasks database: ${tasksDb.id}`);

    // Create Change Log database
    const changeLogDb = await createDatabaseIfNotExists("Change Log", {
        Title: {
            title: {}
        },
        Description: {
            rich_text: {}
        },
        Category: {
            select: {
                options: [
                    { name: "Feature Added", color: "green" },
                    { name: "Bug Fixed", color: "red" },
                    { name: "Enhancement", color: "blue" },
                    { name: "Breaking Change", color: "orange" },
                    { name: "Documentation", color: "purple" }
                ]
            }
        },
        Version: {
            rich_text: {}
        },
        Date: {
            date: {}
        },
        FilesChanged: {
            rich_text: {}
        }
    });

    console.log(`✅ Created Change Log database: ${changeLogDb.id}`);
    
    return { tasksDb, changeLogDb };
}

async function createInitialTasks() {
    try {
        console.log("📝 Adding initial development tasks...");

        // Find the databases
        const tasksDb = await findDatabaseByTitle("Development Tasks");

        if (!tasksDb) {
            throw new Error("Could not find the Development Tasks database.");
        }

        const initialTasks = [
            {
                title: "Review Trello Integration Setup",
                description: "Complete setup of Trello integration for development task management. Need to fix API credentials and test board connectivity.",
                type: "Bug Fix",
                status: "In Progress",
                priority: "High",
                assignee: "AI Assistant"
            },
            {
                title: "Enhanced Post Creation UI",
                description: "Continue improving the post creation interface with better file upload experience and spiritual theming.",
                type: "Enhancement", 
                status: "Review",
                priority: "Medium",
                assignee: "AI Assistant"
            },
            {
                title: "Community Features Polish",
                description: "Final polish on community card visibility, badge contrast, and user experience improvements.",
                type: "Enhancement",
                status: "Done",
                priority: "Medium",
                assignee: "AI Assistant"
            },
            {
                title: "3D Starmap Visualization",
                description: "Maintain and enhance the immersive 3D starmap with dual visualization modes for cosmic and fungal network views.",
                type: "Feature",
                status: "Done",
                priority: "High",
                assignee: "Collaboration"
            },
            {
                title: "Development Workflow Documentation",
                description: "Complete documentation of development processes, task management, and collaboration workflows.",
                type: "Documentation",
                status: "Done",
                priority: "Medium",
                assignee: "AI Assistant"
            },
            {
                title: "Oracle System Enhancements",
                description: "Expand AI-powered oracle readings with more personalized spiritual guidance and daily recommendations.",
                type: "Feature",
                status: "Backlog",
                priority: "Medium",
                assignee: "AI Assistant"
            },
            {
                title: "Premium Subscription Features",
                description: "Implement additional premium features like unlimited energy, enhanced readings, and exclusive content.",
                type: "Feature",
                status: "Backlog",
                priority: "Low",
                assignee: "Collaboration"
            }
        ];

        for (let task of initialTasks) {
            await notion.pages.create({
                parent: {
                    database_id: tasksDb.id
                },
                properties: {
                    Title: {
                        title: [
                            {
                                text: {
                                    content: task.title
                                }
                            }
                        ]
                    },
                    Description: {
                        rich_text: [
                            {
                                text: {
                                    content: task.description
                                }
                            }
                        ]
                    },
                    Type: {
                        select: {
                            name: task.type
                        }
                    },
                    Status: {
                        select: {
                            name: task.status
                        }
                    },
                    Priority: {
                        select: {
                            name: task.priority
                        }
                    },
                    Assignee: {
                        select: {
                            name: task.assignee
                        }
                    },
                    CreatedDate: {
                        date: {
                            start: new Date().toISOString().split('T')[0]
                        }
                    }
                }
            });

            console.log(`✅ Created task: ${task.title}`);
        }

        console.log("📋 Initial development tasks created successfully!");
    } catch (error) {
        console.error("❌ Error creating initial tasks:", error);
    }
}

// Run the setup
setupNotionDatabases().then((databases) => {
    return createInitialTasks();
}).then(() => {
    console.log("🎉 Notion development workspace setup complete!");
    process.exit(0);
}).catch(error => {
    console.error("💥 Setup failed:", error);
    process.exit(1);
});