#!/usr/bin/env node
// Quick environment check for Replit Auth configuration

console.log('\n🔍 Checking Replit Auth Environment Variables:\n');
console.log('═'.repeat(60));

const requiredVars = [
  'REPL_ID',
  'REPLIT_DOMAINS', 
  'SESSION_SECRET',
  'DATABASE_URL'
];

const optionalVars = [
  'ISSUER_URL',
  'REPL_SLUG',
  'REPL_OWNER',
  'DEBUG_AUTH'
];

console.log('\n✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (value.length > 30 ? `${value.substring(0, 30)}...` : value) : 'NOT SET';
  console.log(`${status} ${varName}: ${display}`);
});

console.log('\n🔧 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  const display = value ? (value.length > 30 ? `${value.substring(0, 30)}...` : value) : 'not set (will use defaults)';
  console.log(`${status} ${varName}: ${display}`);
});

console.log('\n═'.repeat(60));

// Check for common issues
console.log('\n🔎 Diagnostic Checks:\n');

if (!process.env.REPL_ID) {
  console.log('❌ CRITICAL: REPL_ID is missing!');
  console.log('   This should be automatically set by Replit.');
  console.log('   Make sure "Log in with Replit" integration is enabled in .replit file');
}

if (!process.env.REPLIT_DOMAINS) {
  console.log('❌ CRITICAL: REPLIT_DOMAINS is missing!');
  console.log('   Add to .env file: REPLIT_DOMAINS="yourdomain.com"');
} else {
  const domains = process.env.REPLIT_DOMAINS.split(',').map(d => d.trim());
  console.log(`✅ Configured for ${domains.length} domain(s):`);
  domains.forEach(d => console.log(`   - ${d}`));
  
  // Check callback URLs
  console.log('\n📍 Expected OAuth callback URLs:');
  domains.forEach(domain => {
    console.log(`   - https://${domain}/api/callback`);
  });
  console.log('\n   ⚠️  These MUST be registered in your Replit OAuth app settings!');
}

if (!process.env.SESSION_SECRET) {
  console.log('❌ CRITICAL: SESSION_SECRET is missing!');
  console.log('   Add a secure random string to .env file');
}

console.log('\n═'.repeat(60));
console.log('\n');
