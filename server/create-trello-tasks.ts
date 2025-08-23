import { notion, findDatabaseByTitle } from "./notion.js";

// Add current development tasks to Notion
async function addCurrentTasks() {
    console.log('📋 Adding current development tasks to Notion...');
    
    const tasksDb = await findDatabaseByTitle("Development Tasks");
    if (!tasksDb) {
        console.error('❌ Development Tasks database not found');
        return;
    }

    const currentTasks = [
        {
            title: "Fix Trello API Integration",
            description: "Trello API returning 'invalid key' error. Need to investigate new power-up dashboard authentication method and update API references as mentioned by user.",
            type: "Bug Fix",
            status: "In Progress", 
            priority: "High",
            assignee: "AI Assistant"
        },
        {
            title: "Update Trello API References",
            description: "User mentioned Trello now does dev stuff in power-up dashboard. Research and implement updated API authentication and endpoints.",
            type: "Enhancement",
            status: "To Do",
            priority: "High", 
            assignee: "AI Assistant"
        },
        {
            title: "Complete Development Workflow Setup",
            description: "Finalize both Trello and Notion integrations for seamless development task management and collaboration.",
            type: "Feature",
            status: "In Progress",
            priority: "High",
            assignee: "Collaboration"
        }
    ];

    for (let task of currentTasks) {
        await notion.pages.create({
            parent: {
                database_id: tasksDb.id
            },
            properties: {
                Title: {
                    title: [{ text: { content: task.title } }]
                },
                Description: {
                    rich_text: [{ text: { content: task.description } }]
                },
                Type: {
                    select: { name: task.type }
                },
                Status: {
                    select: { name: task.status }
                },
                Priority: {
                    select: { name: task.priority }
                },
                Assignee: {
                    select: { name: task.assignee }
                },
                CreatedDate: {
                    date: { start: new Date().toISOString().split('T')[0] }
                }
            }
        });
        
        console.log(`✅ Added task: ${task.title}`);
    }
    
    console.log('🎉 Current development tasks added to Notion!');
}

addCurrentTasks().catch(console.error);