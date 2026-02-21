#!/usr/bin/env tsx
/**
 * Simple test to check if the app is responding to basic requests
 */

import http from 'http';

async function testEndpoint(path: string) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 200),
          redirect: res.headers.location,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        error: 'TIMEOUT',
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Auth Endpoints\n');

  const tests = [
    { path: '/', name: 'Home page' },
    { path: '/api/auth/user', name: 'Auth user (no session)' },
    { path: '/api/login?host=localhost:3000', name: 'Login redirect' },
    { path: '/api/health', name: 'Health check' },
  ];

  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    const result = await testEndpoint(test.path);
    console.log(`  Status: ${result.status || result.error}`);
    if (result.redirect) {
      console.log(`  Redirect: ${result.redirect}`);
    }
    console.log('');
  }
}

runTests().catch(console.error);
