#!/usr/bin/env node

const fetch = (await import('node-fetch')).default;

const BASE_URL = 'http://localhost:5000';

async function testIndividualPostEndpoint() {
  console.log('\n🧪 Testing individual post endpoint (should be public now)...');
  
  try {
    // Test getting posts list first to find a valid post ID
    const postsResponse = await fetch(`${BASE_URL}/api/posts`);
    if (!postsResponse.ok) {
      console.log(`❌ Failed to get posts list: ${postsResponse.status}`);
      return;
    }
    
    const posts = await postsResponse.json();
    if (posts.length === 0) {
      console.log('⚠️  No posts found in the database to test');
      return;
    }
    
    const testPost = posts[0];
    console.log(`📝 Testing with post ID: ${testPost.id}`);
    
    // Test accessing individual post without authentication
    const postResponse = await fetch(`${BASE_URL}/api/posts/${testPost.id}`);
    
    if (postResponse.ok) {
      const post = await postResponse.json();
      console.log(`✅ Individual post endpoint working: "${post.content?.substring(0, 50)}..."`);
    } else {
      console.log(`❌ Individual post endpoint failed: ${postResponse.status} - ${await postResponse.text()}`);
    }
  } catch (error) {
    console.log(`❌ Error testing individual post endpoint: ${error.message}`);
  }
}

async function testAuthBypass() {
  console.log('\n🧪 Testing authentication bypass for Playwright...');
  
  const testHeaders = [
    { name: 'Playwright User-Agent', headers: { 'User-Agent': 'Mozilla/5.0 (Playwright)' } },
    { name: 'Testing Mode Header', headers: { 'X-Testing-Mode': 'true' } },
    { name: 'Auth Bypass Header', headers: { 'X-Test-Auth-Bypass': 'true' } },
    { name: 'Spiritual Tester Header', headers: { 'X-Spiritual-Tester': 'active' } }
  ];
  
  for (const test of testHeaders) {
    try {
      console.log(`\n  Testing ${test.name}...`);
      const response = await fetch(`${BASE_URL}/api/auth/user`, {
        headers: test.headers
      });
      
      if (response.ok) {
        const user = await response.json();
        console.log(`  ✅ Auth bypass working with ${test.name}: ${user.email}`);
      } else {
        console.log(`  ❌ Auth bypass failed with ${test.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ Error testing ${test.name}: ${error.message}`);
    }
  }
}

async function testRouteSegregation() {
  console.log('\n🧪 Testing route segregation info...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/debug/route-info?path=/api/posts/test-id`);
    
    if (response.ok) {
      const info = await response.json();
      console.log('🔍 Route info for /api/posts/:id:', JSON.stringify(info, null, 2));
    } else {
      console.log(`❌ Failed to get route info: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error getting route info: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Testing post page functionality fixes...');
  
  await testRouteSegregation();
  await testIndividualPostEndpoint();
  await testAuthBypass();
  
  console.log('\n✅ Test suite completed!');
}

runTests().catch(console.error);