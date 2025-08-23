// Populate Trello board with development tasks once credentials are working

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_SECRET;
const BOARD_ID = '68a9ced99aed4ab60de0c985';

if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
  console.error('❌ Trello credentials not found');
  console.error('Expected: TRELLO_API_KEY and TRELLO_SECRET');
  process.exit(1);
}

async function makeRequest(endpoint: string, options: any = {}) {
  const url = `https://api.trello.com/1${endpoint}`;
  
  if (!options.method || options.method === 'GET') {
    const separator = endpoint.includes('?') ? '&' : '?';
    const authUrl = `${url}${separator}key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
    const response = await fetch(authUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Trello API error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  }
  
  const body = options.body || {};
  body.key = TRELLO_API_KEY;
  body.token = TRELLO_TOKEN;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Trello API error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

async function populateTrelloBoardWithTasks() {
  try {
    console.log('🔧 Setting up Trello development board...');
    
    // Get board lists
    const lists = await makeRequest(`/boards/${BOARD_ID}/lists`);
    console.log('📋 Found lists:', lists.map((l: any) => l.name).join(', '));
    
    // Find or create standard development lists
    let backlogList = lists.find((l: any) => l.name.toLowerCase().includes('backlog'));
    let todoList = lists.find((l: any) => l.name.toLowerCase().includes('to do') || l.name.toLowerCase().includes('todo'));
    let inProgressList = lists.find((l: any) => l.name.toLowerCase().includes('progress') || l.name.toLowerCase().includes('doing'));
    let doneList = lists.find((l: any) => l.name.toLowerCase().includes('done') || l.name.toLowerCase().includes('complete'));
    
    // Create missing lists if needed
    if (!backlogList) {
      backlogList = await makeRequest('/lists', {
        method: 'POST',
        body: { name: 'Backlog', idBoard: BOARD_ID }
      });
      console.log('✅ Created Backlog list');
    }
    
    if (!todoList) {
      todoList = await makeRequest('/lists', {
        method: 'POST', 
        body: { name: 'To Do', idBoard: BOARD_ID }
      });
      console.log('✅ Created To Do list');
    }
    
    if (!inProgressList) {
      inProgressList = await makeRequest('/lists', {
        method: 'POST',
        body: { name: 'In Progress', idBoard: BOARD_ID }
      });
      console.log('✅ Created In Progress list');
    }
    
    if (!doneList) {
      doneList = await makeRequest('/lists', {
        method: 'POST',
        body: { name: 'Done', idBoard: BOARD_ID }
      });
      console.log('✅ Created Done list');
    }
    
    // Development tasks to create
    const developmentTasks = [
      {
        name: '🔧 Fix Trello Power-Up API Integration',
        desc: 'Update authentication to use modern Power-Up based API access instead of deprecated direct API method. Research new Atlassian developer platform requirements.',
        listId: inProgressList.id,
        labels: ['red'] // Bug fix
      },
      {
        name: '📚 Sync Notion Documentation',
        desc: 'Complete setup of Notion integration for project documentation. Auto-sync replit.md and track development progress.',
        listId: doneList.id,
        labels: ['purple'] // Documentation
      },
      {
        name: '🎨 Enhanced Post Creation UI',
        desc: 'Polish post creation interface with improved file upload experience, mystical theming, and better user feedback.',
        listId: doneList.id,
        labels: ['blue'] // Enhancement
      },
      {
        name: '🌟 3D Starmap Visualization',
        desc: 'Maintain immersive 3D starmap with dual visualization modes (cosmic starfield and fungal network). Real-time user data integration.',
        listId: doneList.id,
        labels: ['green'] // Feature
      },
      {
        name: '🔮 Oracle System Enhancements',
        desc: 'Expand AI-powered oracle readings with more personalized spiritual guidance, tarot integration, and daily recommendations.',
        listId: backlogList.id,
        labels: ['green'] // Feature
      },
      {
        name: '💎 Premium Subscription Features',
        desc: 'Implement additional premium features: unlimited energy, enhanced readings, exclusive content, and priority support.',
        listId: backlogList.id,
        labels: ['green'] // Feature
      },
      {
        name: '🔄 Development Workflow Documentation',
        desc: 'Complete documentation of development processes, task management, and AI-human collaboration workflows.',
        listId: doneList.id,
        labels: ['purple'] // Documentation
      }
    ];
    
    // Create cards
    for (const task of developmentTasks) {
      const card = await makeRequest('/cards', {
        method: 'POST',
        body: {
          name: task.name,
          desc: task.desc,
          idList: task.listId
        }
      });
      
      console.log(`✅ Created: ${task.name}`);
    }
    
    console.log('🎉 Trello development board populated successfully!');
    console.log(`📄 View board: https://trello.com/b/${BOARD_ID}`);
    
  } catch (error) {
    console.error('❌ Error populating Trello board:', error);
  }
}

populateTrelloBoardWithTasks();