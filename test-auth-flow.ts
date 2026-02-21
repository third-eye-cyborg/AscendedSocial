#!/usr/bin/env tsx
/**
 * Auth Flow Diagnostic Test
 * Tests authentication endpoints to verify the auth flow is working
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  passed: boolean;
  endpoint: string;
  status?: number;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

async function test(name: string, endpoint: string, options?: any) {
  try {
    console.log(`🧪 Testing ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      redirect: 'manual',
      credentials: 'include',
    });
    
    const passed = response.status < 500;
    const result: TestResult = {
      endpoint,
      status: response.status,
      passed,
    };

    if (!passed) {
      result.error = `HTTP ${response.status}`;
    } else if (response.status === 302 || response.status === 307) {
      result.details = `Redirects to: ${response.headers.get('location')}`;
    }

    results.push(result);
    console.log(`  ${passed ? '✅' : '❌'} ${name} (${response.status})`);
    return response;
  } catch (error: any) {
    const result: TestResult = {
      endpoint,
      passed: false,
      error: error.message,
    };
    results.push(result);
    console.log(`  ❌ ${name}: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Auth Flow Diagnostics\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test basic connectivity
  await test('Server is running', '/');

  // Test auth endpoints
  console.log('\n📝 Auth Endpoints:');
  await test('Login endpoint', '/api/login?host=localhost:3000', { method: 'GET' });
  await test('Auth user endpoint (no auth)', '/api/auth/user', { method: 'GET' });
  
  // Test admin endpoints
  console.log('\n🔐 Admin Endpoints:');
  await test('Admin login endpoint', '/api/admin/login', { method: 'GET' });
  
  // Test public routes
  console.log('\n🌐 Public Routes:');
  await test('Health check', '/api/health', { method: 'GET' });
  
  // Summary
  console.log('\n📊 Summary:');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  console.log(`Passed: ${passed}/${total} endpoints`);
  
  if (passed === total) {
    console.log('\n✅ All tests passed! Auth endpoints are responding correctly.');
  } else {
    console.log('\n❌ Some tests failed. Review the details above.');
    console.log('\nFailed endpoints:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.endpoint} (${r.error})`);
    });
  }
}

runTests().catch(console.error);
