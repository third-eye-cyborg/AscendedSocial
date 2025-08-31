import { notion, findDatabaseByTitle } from './notion.ts';

// Comprehensive todos using EXACT database property names
const DEVELOPMENT_TODOS = [
    {
        title: "Email Domain Compliance Fix - Legal Pages ✅",
        type: "Bug",
        status: "Done",
        priority: "High",
        description: "Successfully corrected all email domains from @ascendedsocial.com to @ascended.social across 13 files including legal pages, server components, and documentation for complete business compliance",
        assignedTo: "Development Team",
        technicalNotes: "Updated legal pages: payment-terms, copyright-assignment, community-protection, copyright-policy, service-agreement, third-party-disclaimer. Also updated server/emailService.ts, MarketingFooter.tsx, about.tsx, and replit.md"
    },
    {
        title: "3D Starmap Performance Optimization",
        type: "Improvement",
        status: "To Do",
        priority: "High",
        description: "Optimize React Three Fiber rendering for large-scale spiritual community visualization with advanced performance techniques",
        assignedTo: "Frontend Team",
        technicalNotes: "Implement LOD (Level of Detail), frustum culling, instanced rendering, and GPU optimization for smooth spiritual community exploration"
    },
    {
        title: "Oracle AI Streaming Implementation",
        type: "Feature",
        status: "To Do",
        priority: "High",
        description: "Implement real-time streaming responses for oracle readings using OpenAI's streaming API for enhanced spiritual guidance",
        assignedTo: "Backend Team",
        technicalNotes: "Integrate Server-Sent Events (SSE) with OpenAI streaming API, implement real-time oracle guidance delivery system"
    },
    {
        title: "Enhanced Chakra Content AI Classification",
        type: "Improvement",
        status: "To Do",
        priority: "Medium",
        description: "Improve AI-powered chakra categorization accuracy with advanced semantic analysis and confidence scoring",
        assignedTo: "AI Integration Team",
        technicalNotes: "Refine OpenAI prompts for spiritual frequency analysis, implement confidence scoring, and enhance chakra classification accuracy"
    },
    {
        title: "Stripe Subscription Management Dashboard",
        type: "Feature", 
        status: "To Do",
        priority: "Medium",
        description: "Build comprehensive subscription management interface for premium spiritual features and billing management",
        assignedTo: "Payment Integration Team",
        technicalNotes: "Integrate Stripe Customer Portal with custom spiritual features management, implement subscription analytics and user billing interface"
    },
    {
        title: "Zero Trust Security Audit & Enhancement",
        type: "Technical Debt",
        status: "To Do",
        priority: "High",
        description: "Complete security audit of Cloudflare Zero Trust implementation and enhance admin protection systems",
        assignedTo: "Security Team",
        technicalNotes: "Review JWT validation, group permissions, audit logging, and enhance Cloudflare Access policies for compliance"
    },
    {
        title: "Advanced Energy System Gamification",
        type: "Feature",
        status: "To Do", 
        priority: "Medium",
        description: "Implement advanced energy sharing mechanics with spiritual achievement system and user engagement tracking",
        assignedTo: "Gamification Team",
        technicalNotes: "Add energy history tracking, achievement badges, monthly energy leaderboards, and spiritual milestone rewards"
    },
    {
        title: "GDPR Data Export System Implementation",
        type: "Feature",
        status: "To Do",
        priority: "High",
        description: "Build comprehensive user data export functionality for complete GDPR compliance and user data rights",
        assignedTo: "Compliance Team", 
        technicalNotes: "Create ZIP export system with all user data, posts, energy history, oracle readings, and metadata for data portability"
    }
];

const MOBILE_DEVELOPMENT_TODOS = [
    {
        title: "React Native Project Setup & Architecture Foundation",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "Not Started",
        backendSync: true,
        description: "Initialize React Native project with TypeScript, Expo custom development build, navigation setup, and spiritual platform architecture foundation",
        implementationNotes: "Setup Expo with custom development build for native modules, configure React Navigation, establish project structure, and integrate spiritual theming"
    },
    {
        title: "Replit Auth Mobile Integration & Security",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "Not Started",
        backendSync: true,
        description: "Implement OpenID Connect authentication flow using react-native-app-auth with secure token storage for seamless spiritual platform access",
        implementationNotes: "Use react-native-app-auth for OAuth flow, implement secure token storage with iOS Keychain and Android Keystore, sync with existing Replit Auth"
    },
    {
        title: "Spiritual Post Creation Mobile UI System",
        platform: "Cross-Platform", 
        status: "Planning",
        authStatus: "In Progress",
        backendSync: true,
        description: "Build mobile-optimized post creation interface with chakra selection, spiritual frequency input, and advanced media upload capabilities",
        implementationNotes: "Implement image/video picker with react-native-image-picker, create chakra wheel selector component, spiritual frequency input with mobile-first design"
    },
    {
        title: "3D Starmap Mobile Visualization Adaptation",
        platform: "Cross-Platform",
        status: "Planning", 
        authStatus: "Integrated",
        backendSync: true,
        description: "Adapt 3D starmap visualization for mobile devices with touch controls, gesture navigation, and performance optimization",
        implementationNotes: "Use react-native-3d-scene or similar library, implement gesture controls with react-native-gesture-handler, optimize rendering for mobile GPUs"
    },
    {
        title: "Oracle Readings Mobile Experience & Offline Support",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "In Progress", 
        backendSync: true,
        description: "Create immersive mobile oracle reading experience with offline capability and personalized spiritual guidance",
        implementationNotes: "Implement local storage for offline readings with SQLite, push notifications for daily guidance, gesture-based spiritual card interactions"
    },
    {
        title: "Energy System Mobile Interactions & Haptics",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "In Progress",
        backendSync: true,
        description: "Implement mobile energy sharing system with swipe gestures, haptic feedback, and real-time spiritual animations",
        implementationNotes: "Implement swipe gestures for energy sharing, haptic feedback with react-native-haptic-feedback, real-time energy animation system"
    },
    {
        title: "Stripe Mobile Payment Integration & Subscriptions",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "Testing",
        backendSync: true,
        description: "Implement in-app purchase flow for premium spiritual features with comprehensive subscription management",
        implementationNotes: "Integrate Stripe React Native SDK, implement subscription management UI, handle iOS/Android payment flows with platform-specific features"
    },
    {
        title: "Push Notification Spiritual Reminder System",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "Not Started",
        backendSync: true,
        description: "Build personalized spiritual reminder system with OneSignal integration and chakra-based categorization",
        implementationNotes: "Setup OneSignal React Native SDK, implement scheduled spiritual reminders, chakra-based notification categorization, personalized guidance timing"
    },
    {
        title: "Offline Spiritual Content Sync Architecture",
        platform: "Cross-Platform",
        status: "Planning",
        authStatus: "In Progress",
        backendSync: true,
        description: "Implement offline-first architecture for spiritual content access without internet connectivity",
        implementationNotes: "Implement SQLite local storage with WatermelonDB, background sync with conflict resolution, offline spiritual content caching"
    },
    {
        title: "iOS App Store Submission & Compliance",
        platform: "iOS",
        status: "Planning",
        authStatus: "Not Started",
        backendSync: false,
        description: "Prepare and submit iOS app for Apple App Store review in Lifestyle/Spirituality category with full compliance",
        implementationNotes: "Create App Store screenshots, prepare metadata and descriptions, implement privacy labels, ensure Apple guideline compliance for spiritual content"
    },
    {
        title: "Android Play Store Release & Optimization",
        platform: "Android",
        status: "Planning",
        authStatus: "Not Started", 
        backendSync: false,
        description: "Prepare and release Android app on Google Play Store for spiritual wellness category with optimization",
        implementationNotes: "Generate signed APK/AAB, create Play Store listing with spiritual wellness positioning, implement Play Console integration, prepare release notes"
    }
];

async function populateCorrectTodos() {
    try {
        console.log('🚀 Starting corrected Notion todo population...');
        
        // Find existing databases
        const devTasksDb = await findDatabaseByTitle("Development Tasks");
        const mobileDevDb = await findDatabaseByTitle("Mobile Development");
        
        if (!devTasksDb || !mobileDevDb) {
            throw new Error("Required databases not found. Please run setup first.");
        }

        console.log(`✅ Found Development Tasks DB: ${devTasksDb.id}`);
        console.log(`✅ Found Mobile Development DB: ${mobileDevDb.id}`);

        // Add Web Development Todos with correct property names
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
                        },
                        "Assigned To": {
                            rich_text: [{ text: { content: todo.assignedTo } }]
                        },
                        "Created Date": {
                            date: { start: "2025-08-31" }
                        },
                        ...(todo.status === "Done" && {
                            "Completed Date": {
                                date: { start: "2025-08-31" }
                            }
                        }),
                        "Technical Notes": {
                            rich_text: [{ text: { content: todo.technicalNotes } }]
                        }
                    }
                });
                console.log(`✅ Added: ${todo.title}`);
            } catch (error) {
                console.log(`❌ Failed to add: ${todo.title}`, error.message);
            }
        }

        // Add Mobile Development Todos with correct property names
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
                            select: { name: todo.platform }
                        },
                        Status: { select: { name: todo.status } },
                        "Auth Integration Status": {
                            select: { name: todo.authStatus }
                        },
                        "Backend Sync": { checkbox: todo.backendSync },
                        Description: {
                            rich_text: [{ text: { content: todo.description } }]
                        },
                        "Implementation Notes": {
                            rich_text: [{ text: { content: todo.implementationNotes } }]
                        }
                    }
                });
                console.log(`✅ Added: ${todo.title}`);
            } catch (error) {
                console.log(`❌ Failed to add: ${todo.title}`, error.message);
            }
        }

        console.log('🎉 Corrected Notion todo population completed successfully!');
        console.log(`📊 Web Development Tasks: ${DEVELOPMENT_TODOS.length} items`);
        console.log(`📱 Mobile Development Tasks: ${MOBILE_DEVELOPMENT_TODOS.length} items`);
        
        return {
            webTodos: DEVELOPMENT_TODOS.length,
            mobileTodos: MOBILE_DEVELOPMENT_TODOS.length,
            devTasksDbId: devTasksDb.id,
            mobileDevDbId: mobileDevDb.id
        };
    } catch (error) {
        console.error('❌ Error populating corrected Notion todos:', error);
        throw error;
    }
}

// Run the corrected todo population
populateCorrectTodos()
    .then((result) => {
        console.log('✅ Corrected Notion todo population complete!');
        console.log('📋 Summary:', result);
        console.log('🚀 Your Notion workspace is now fully populated with comprehensive development todos');
        process.exit(0);
    })
    .catch(error => {
        console.error('💥 Corrected todo population failed:', error);
        process.exit(1);
    });

export { populateCorrectTodos };