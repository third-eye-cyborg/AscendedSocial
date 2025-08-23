#!/usr/bin/env node

// Development tool for Trello integration
// Usage: node dev-tools/trello-dev.js [command] [args]

const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = '68a9ced99aed4ab60de0c985';

if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
  console.error('❌ Trello credentials not found in environment variables');
  process.exit(1);
}

async function makeRequest(endpoint, options = {}) {
  const url = `https://api.trello.com/1${endpoint}`;
  
  // For GET requests, add auth as query params
  if (!options.method || options.method === 'GET') {
    const separator = endpoint.includes('?') ? '&' : '?';
    const authUrl = `${url}${separator}key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
    const response = await fetch(authUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Trello API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }
  
  // For POST/PUT/DELETE, add auth to body
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
    throw new Error(`Trello API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

async function listBoards() {
  try {
    const boards = await makeRequest('/members/me/boards');
    console.log('📋 Available Boards:');
    boards.forEach(board => {
      const marker = board.id === BOARD_ID ? '👉' : '  ';
      console.log(`${marker} ${board.name} (${board.id})`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function listLists() {
  try {
    const lists = await makeRequest(`/boards/${BOARD_ID}/lists`);
    console.log('📝 Board Lists:');
    lists.forEach(list => {
      console.log(`  • ${list.name} (${list.id})`);
    });
    return lists;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function listCards() {
  try {
    const cards = await makeRequest(`/boards/${BOARD_ID}/cards`);
    console.log('🎯 Current Tasks:');
    
    if (cards.length === 0) {
      console.log('  No tasks found');
      return;
    }
    
    cards.forEach(card => {
      console.log(`  📌 ${card.name}`);
      if (card.desc) {
        console.log(`     ${card.desc.substring(0, 100)}${card.desc.length > 100 ? '...' : ''}`);
      }
      console.log(`     List: ${card.list?.name || 'Unknown'}`);
      console.log(`     URL: ${card.shortUrl}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createCard(listId, name, description = '') {
  try {
    const card = await makeRequest('/cards', {
      method: 'POST',
      body: {
        idList: listId,
        name,
        desc: description
      }
    });
    
    console.log(`✅ Created card: ${card.name}`);
    console.log(`   URL: ${card.shortUrl}`);
    return card;
  } catch (error) {
    console.error('❌ Error creating card:', error.message);
  }
}

async function main() {
  const command = process.argv[2];
  
  console.log('🔧 Ascended Social Development - Trello Integration\n');
  
  switch (command) {
    case 'boards':
      await listBoards();
      break;
    case 'lists':
      await listLists();
      break;
    case 'cards':
    case 'tasks':
      await listCards();
      break;
    case 'create':
      const listId = process.argv[3];
      const name = process.argv[4];
      const description = process.argv[5];
      
      if (!listId || !name) {
        console.log('Usage: node dev-tools/trello-dev.js create <listId> <name> [description]');
        await listLists();
        return;
      }
      
      await createCard(listId, name, description);
      break;
    case 'test':
      console.log('🔍 Testing Trello connection...');
      await listBoards();
      console.log('');
      await listLists();
      console.log('');
      await listCards();
      break;
    default:
      console.log(`
📚 Available Commands:
  boards    - List all available boards
  lists     - Show lists on the development board  
  cards     - Show all current tasks/cards
  create    - Create a new task (requires listId, name, and optional description)
  test      - Test connection and show board overview

🎯 Development Board: https://trello.com/b/68a9ced99aed4ab60de0c985

Examples:
  node dev-tools/trello-dev.js test
  node dev-tools/trello-dev.js cards
  node dev-tools/trello-dev.js create <listId> "Fix user profile bug" "Users can't update their profile image"
      `);
  }
}

main().catch(console.error);