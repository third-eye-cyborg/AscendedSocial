#!/usr/bin/env node

// Credential diagnostic tool
console.log('🔍 Testing API Credentials...\n');

// Test environment variables
console.log('📋 Environment Check:');
console.log(`TRELLO_API_KEY: ${process.env.TRELLO_API_KEY ? `${process.env.TRELLO_API_KEY.substring(0, 8)}...` : 'MISSING'}`);
console.log(`TRELLO_TOKEN: ${process.env.TRELLO_TOKEN ? `${process.env.TRELLO_TOKEN.substring(0, 8)}...` : 'MISSING'}`);
console.log(`NOTION_INTEGRATION_SECRET: ${process.env.NOTION_INTEGRATION_SECRET ? `${process.env.NOTION_INTEGRATION_SECRET.substring(0, 8)}...` : 'MISSING'}`);
console.log(`NOTION_PAGE_URL: ${process.env.NOTION_PAGE_URL || 'MISSING'}\n`);

// Test Trello API
async function testTrello() {
    console.log('🔧 Testing Trello API...');
    
    if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_TOKEN) {
        console.log('❌ Missing Trello credentials');
        return;
    }
    
    try {
        const url = `https://api.trello.com/1/members/me?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
        const response = await fetch(url);
        const status = response.status;
        
        if (status === 200) {
            const data = await response.json();
            console.log(`✅ Trello: Connected as ${data.fullName} (${data.username})`);
        } else {
            const error = await response.text();
            console.log(`❌ Trello: ${status} - ${error}`);
        }
    } catch (error) {
        console.log(`❌ Trello Error: ${error.message}`);
    }
}

// Test Notion API  
async function testNotion() {
    console.log('📖 Testing Notion API...');
    
    if (!process.env.NOTION_INTEGRATION_SECRET) {
        console.log('❌ Missing Notion credentials');
        return;
    }
    
    try {
        const response = await fetch('https://api.notion.com/v1/users/me', {
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        const status = response.status;
        
        if (status === 200) {
            const data = await response.json();
            console.log(`✅ Notion: Connected as ${data.name || data.type}`);
        } else {
            const error = await response.text();
            console.log(`❌ Notion: ${status} - ${error}`);
        }
    } catch (error) {
        console.log(`❌ Notion Error: ${error.message}`);
    }
}

// Run tests
async function runTests() {
    await testTrello();
    await testNotion();
    
    console.log('\n💡 If credentials are failing:');
    console.log('  • Check for extra spaces in secret values');
    console.log('  • Regenerate tokens with proper permissions');
    console.log('  • For Trello: https://trello.com/app-key');
    console.log('  • For Notion: Share your page with the integration');
}

runTests();