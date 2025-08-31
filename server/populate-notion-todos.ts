import { notion, NOTION_PAGE_ID, findDatabaseByTitle } from './notion.ts';

// Simple but comprehensive todos that match existing database schema
const DEVELOPMENT_TODOS = [
    {
        title: "Email Domain Compliance Fix - Legal Pages ✅",
        type: "Bug",
        status: "Done",
        priority: "Critical",
        description: "Successfully corrected all email domains from @ascendedsocial.com to @ascended.social across 13 files including legal pages, server components, and documentation for complete business compliance"
    },
    {
        title: "3D Starmap Performance Optimization",
        type: "Improvement",
        status: "To Do",
        priority: "High",
        description: "Optimize React Three Fiber rendering for large-scale spiritual community visualization with LOD techniques, frustum culling, and instanced rendering"
    },
    {
        title: "Oracle AI Streaming Implementation",
        type: "Feature",
        status: "To Do",
        priority: "High",
        description: "Implement real-time streaming responses for oracle readings using OpenAI's streaming API with Server-Sent Events for enhanced spiritual guidance delivery"
    },
    {
        title: "Enhanced Chakra Content AI Classification",
        type: "Improvement",
        status: "To Do",
        priority: "Medium",
        description: "Improve AI-powered chakra categorization accuracy with advanced semantic analysis and confidence scoring for spiritual frequency analysis"
    },
    {
        title: "Stripe Subscription Management Dashboard",
        type: "Feature",
        status: "To Do",
        priority: "Medium",
        description: "Build comprehensive subscription management interface integrating Stripe Customer Portal with custom spiritual features for premium users"
    },
    {
        title: "Zero Trust Security Audit & Enhancement",
        type: "Technical Debt",
        status: "To Do",
        priority: "High",
        description: "Complete security audit of Cloudflare Zero Trust implementation with enhanced JWT validation, group permissions, and audit logging"
    },
    {
        title: "Advanced Energy System Gamification",
        type: "Feature",
        status: "To Do",
        priority: "Medium",
        description: "Implement advanced energy sharing mechanics with achievement system, energy history tracking, badges, and monthly leaderboards"
    },
    {
        title: "GDPR Data Export System",
        type: "Feature",
        status: "To Do",
        priority: "High",
        description: "Build comprehensive user data export functionality with ZIP export of all user data, posts, energy history, and oracle readings for GDPR compliance"
    }
];

const MOBILE_DEVELOPMENT_TODOS = [
    {
        title: "React Native Project Setup & Architecture",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Initialize React Native project with TypeScript, Expo custom development build, navigation setup, and spiritual platform architecture foundation"
    },
    {
        title: "Replit Auth Mobile Integration",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Implement OpenID Connect authentication flow using react-native-app-auth with secure token storage via Keychain/Keystore for seamless spiritual platform access"
    },
    {
        title: "Spiritual Post Creation Mobile UI",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Build mobile-optimized post creation with chakra wheel selector, spiritual frequency input, and image/video picker using mobile-first design principles"
    },
    {
        title: "3D Starmap Mobile Adaptation",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Adapt 3D starmap visualization for mobile with touch controls, gesture navigation, and GPU performance optimization for spiritual community exploration"
    },
    {
        title: "Oracle Readings Mobile Experience",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Create immersive mobile oracle reading experience with offline capability, push notifications for daily guidance, and gesture-based spiritual card interactions"
    },
    {
        title: "Energy System Mobile Interactions",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Implement mobile energy sharing with swipe gestures, haptic feedback for spiritual interactions, and real-time energy animations"
    },
    {
        title: "Stripe Mobile Payment Integration",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Implement in-app purchase flow for premium spiritual features using Stripe React Native SDK with iOS/Android payment handling"
    },
    {
        title: "Push Notification Spiritual System",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Build personalized spiritual reminder system with OneSignal integration, scheduled guidance, and chakra-based notification categorization"
    },
    {
        title: "Offline Spiritual Content Sync",
        platform: ["Cross-Platform"],
        status: "Planning",
        description: "Implement offline-first architecture with SQLite local storage, background sync, and conflict resolution for spiritual content access"
    },
    {
        title: "iOS App Store Submission Preparation",
        platform: ["iOS"],
        status: "Planning",
        description: "Prepare iOS app for Apple App Store in Lifestyle/Spirituality category with screenshots, metadata, privacy labels, and compliance"
    },
    {
        title: "Android Play Store Release Setup",
        platform: ["Android"],
        status: "Planning",
        description: "Prepare Android app for Google Play Store in spiritual wellness category with signed APK/AAB, Play Console integration, and release notes"
    }
];

async function populateNotionTodos() {
    try {
        console.log('🚀 Starting Notion todo population...');
        
        // Find existing databases
        const devTasksDb = await findDatabaseByTitle("Development Tasks");
        const mobileDevDb = await findDatabaseByTitle("Mobile Development");
        
        if (!devTasksDb) {
            throw new Error("Development Tasks database not found. Please run setup-notion-databases.ts first.");
        }
        
        if (!mobileDevDb) {
            throw new Error("Mobile Development database not found. Please run setup-notion-databases.ts first.");
        }

        console.log(`✅ Found Development Tasks DB: ${devTasksDb.id}`);
        console.log(`✅ Found Mobile Development DB: ${mobileDevDb.id}`);

        // Add Web Development Todos using only available properties
        console.log('🌐 Adding web development todos...');
        for (const todo of DEVELOPMENT_TODOS) {
            try {
                await notion.pages.create({
                    parent: { database_id: devTasksDb.id },
                    properties: {
                        Title: {
                            title: [{ text: { content: todo.title } }]
                        },
                        Type: { select: { name: todo.type } },
                        Status: { select: { name: todo.status } },
                        Priority: { select: { name: todo.priority } },
                        Description: {
                            rich_text: [{ text: { content: todo.description } }]
                        }
                    }
                });
                console.log(`✅ Added: ${todo.title}`);
            } catch (error) {
                console.log(`❌ Failed to add: ${todo.title}`, error.message);
            }
        }

        // Add Mobile Development Todos using only available properties
        console.log('📱 Adding mobile development todos...');
        for (const todo of MOBILE_DEVELOPMENT_TODOS) {
            try {
                await notion.pages.create({
                    parent: { database_id: mobileDevDb.id },
                    properties: {
                        Title: {
                            title: [{ text: { content: todo.title } }]
                        },
                        Platform: { 
                            multi_select: todo.platform.map(p => ({ name: p }))
                        },
                        Status: { select: { name: todo.status } },
                        Description: {
                            rich_text: [{ text: { content: todo.description } }]
                        }
                    }
                });
                console.log(`✅ Added: ${todo.title}`);
            } catch (error) {
                console.log(`❌ Failed to add: ${todo.title}`, error.message);
            }
        }

        console.log('🎉 Notion todo population completed successfully!');
        console.log(`📊 Web Development Tasks: ${DEVELOPMENT_TODOS.length} items`);
        console.log(`📱 Mobile Development Tasks: ${MOBILE_DEVELOPMENT_TODOS.length} items`);
        
        return {
            webTodos: DEVELOPMENT_TODOS.length,
            mobileTodos: MOBILE_DEVELOPMENT_TODOS.length,
            devTasksDbId: devTasksDb.id,
            mobileDevDbId: mobileDevDb.id
        };
    } catch (error) {
        console.error('❌ Error populating Notion todos:', error);
        throw error;
    }
}

// Run the todo population
populateNotionTodos()
    .then((result) => {
        console.log('✅ Notion todo population complete!');
        console.log('📋 Summary:', result);
        console.log('🚀 Your Notion workspace is now fully populated with development todos');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Todo population failed:', error);
        process.exit(1);
    });

export { populateNotionTodos };