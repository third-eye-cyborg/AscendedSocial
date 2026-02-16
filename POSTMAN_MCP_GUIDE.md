# Postman MCP Integration - Quick Reference

This guide shows how to use Ascended Social's Postman environments with the MCP (Model Context Protocol) tools available in your development environment.

## 🎯 Overview

You have access to Postman MCP tools that can:
- Create and manage collections
- Create and manage environments  
- Run collections with environments
- Generate API specifications
- Sync collections with API specs

## 📋 Prerequisites

1. **Environment files imported** into Postman:
   - `postman-environment-dev.json` (Development)  
   - `postman-environment-prod.json` (Production)

2. **Secrets filled in** for the environment you're using

3. **Postman account** authenticated in VS Code

## 🔧 Available MCP Tools

### Environment Management

#### Get Current Environment
```typescript
// Get info about currently selected environment
await mcp_postman.getEnvironment({
  environmentId: "your-env-id"
})
```

#### Create New Environment
```typescript
await mcp_postman.createEnvironment({
  workspace: "workspace-id",
  environment: {
    name: "Ascended Social - Local",
    values: [
      { key: "BASE_URL", value: "http://localhost:5000", type: "default", enabled: true },
      { key: "AUTH_TOKEN", value: "", type: "secret", enabled: true }
    ]
  }
})
```

#### Update Environment
```typescript
await mcp_postman.putEnvironment({
  environmentId: "env-id",
  environment: {
    name: "Updated Name",
    values: [
      { key: "NEW_VAR", value: "new-value", type: "default", enabled: true }
    ]
  }
})
```

### Collection Management

#### Run Collection with Environment
```typescript
await mcp_postman.runCollection({
  collectionId: "your-collection-id",
  environmentId: "your-env-id", // Use your imported environment
  abortOnError: false,
  iterationCount: 1
})
```

#### Get Collections
```typescript
await mcp_postman.getCollections({
  workspace: "workspace-id"
})
```

## 🚀 Common Workflows

### Workflow 1: Test API with Environment Secrets

```typescript
// 1. Get your environment ID (after importing)
const envs = await mcp_postman.getEnvironments()
const devEnv = envs.find(e => e.name.includes("Development"))

// 2. Run PostHog collection with dev environment
const result = await mcp_postman.runCollection({
  collectionId: "posthog-collection-id",
  environmentId: devEnv.id,
  requestTimeout: 10000
})

// 3. Check results
console.log(result.run.stats) // success/failure counts
console.log(result.run.executions) // individual request results
```

### Workflow 2: Create Test Environment Programmatically

```typescript
// Create a test environment with secrets injected from Replit
await mcp_postman.createEnvironment({
  workspace: "workspace-id",
  environment: {
    name: "Ascended Social - CI/CD",
    values: [
      { 
        key: "BASE_URL", 
        value: process.env.REPLIT_URL || "http://localhost:5000",
        type: "default",
        enabled: true 
      },
      { 
        key: "DATABASE_URL", 
        value: process.env.DATABASE_URL,
        type: "secret",
        enabled: true 
      },
      { 
        key: "OPENAI_API_KEY", 
        value: process.env.OPENAI_API_KEY,
        type: "secret",
        enabled: true 
      }
    ]
  }
})
```

### Workflow 3: Update Environment Variables

```typescript
// Get current environment
const env = await mcp_postman.getEnvironment({
  environmentId: "your-env-id"
})

// Add new variables
env.values.push({
  key: "NEW_FEATURE_FLAG",
  value: "true",
  type: "default",
  enabled: true,
  description: "Enable new chakra visualization feature"
})

// Update environment
await mcp_postman.putEnvironment({
  environmentId: "your-env-id",
  environment: env
})
```

### Workflow 4: Test Multiple Environments

```typescript
// Test the same collection across both environments
const environments = [
  "dev-env-id",
  "production-env-id"
]

for (const envId of environments) {
  console.log(`Testing environment: ${envId}`)
  
  const result = await mcp_postman.runCollection({
    collectionId: "ascended-social-api-collection",
    environmentId: envId,
    abortOnFailure: true
  })
  
  if (result.run.stats.assertions.failed > 0) {
    console.error(`❌ Tests failed in ${envId}`)
  } else {
    console.log(`✅ All tests passed in ${envId}`)
  }
}
```

## 🔐 Injecting Secrets from Replit

You can programmatically inject Replit secrets into Postman environments:

```typescript
// Map Replit secrets to Postman environment variables
const secretMapping = {
  'DATABASE_URL': process.env.DATABASE_URL,
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  'SESSION_SECRET': process.env.SESSION_SECRET,
  'POSTHOG_API_TOKEN': process.env.POSTHOG_API_TOKEN,
  'BUILDER_API_KEY': process.env.BUILDER_API_KEY,
  'SENTRY_DSN': process.env.SENTRY_DSN
}

// Get environment
const env = await mcp_postman.getEnvironment({
  environmentId: "your-env-id"
})

// Update values from Replit secrets
env.values = env.values.map(v => {
  if (secretMapping[v.key]) {
    return { ...v, value: secretMapping[v.key] }
  }
  return v
})

// Save updated environment
await mcp_postman.putEnvironment({
  environmentId: "your-env-id",
  environment: env
})
```

## 📊 Example: Automated API Testing Script

Create a script to run all tests with proper environment:

```typescript
// scripts/test-api.ts
import { mcp_postman } from './mcp-clients'

async function runAPITests() {
  console.log('🚀 Starting Ascended Social API Tests')
  
  // 1. Get development environment
  const envs = await mcp_postman.getEnvironments()
  const devEnv = envs.find(e => e.name === "Ascended Social - Development")
  
  if (!devEnv) {
    throw new Error('Development environment not found! Import postman-environment.json first.')
  }
  
  // 2. Get collections
  const collections = await mcp_postman.getCollections()
  const apiCollection = collections.find(c => c.name.includes("Ascended Social"))
  
  if (!apiCollection) {
    throw new Error('API collection not found!')
  }
  
  // 3. Run tests
  console.log(`📝 Running collection: ${apiCollection.name}`)
  console.log(`🌍 Using environment: ${devEnv.name}`)
  
  const result = await mcp_postman.runCollection({
    collectionId: apiCollection.uid,
    environmentId: devEnv.uid,
    requestTimeout: 15000,
    stopOnError: false
  })
  
  // 4. Report results
  const { stats } = result.run
  console.log('\n📊 Test Results:')
  console.log(`✅ Passed: ${stats.assertions.total - stats.assertions.failed}`)
  console.log(`❌ Failed: ${stats.assertions.failed}`)
  console.log(`📨 Requests: ${stats.requests.total}`)
  
  // 5. Show failures
  if (stats.assertions.failed > 0) {
    console.log('\n❌ Failed Tests:')
    result.run.executions.forEach(exec => {
      exec.assertions?.forEach(assertion => {
        if (assertion.error) {
          console.log(`  - ${exec.item.name}: ${assertion.error.message}`)
        }
      })
    })
    process.exit(1)
  }
  
  console.log('\n✨ All tests passed!')
}

runAPITests().catch(console.error)
```

## 🔍 Debugging

### Check Environment Variables
```typescript
const env = await mcp_postman.getEnvironment({
  environmentId: "your-env-id"
})

console.log('Environment variables:')
env.values.forEach(v => {
  const value = v.type === 'secret' ? '***' : v.value
  console.log(`  ${v.key}: ${value}`)
})
```

### Test Single Request
```typescript
// Run just one request from a collection
const result = await mcp_postman.runCollection({
  collectionId: "collection-id",
  environmentId: "env-id",
  abortOnError: false
})

// Check specific request
const authRequest = result.run.executions.find(e => 
  e.item.name === "User Login"
)

console.log('Request:', authRequest.request)
console.log('Response:', authRequest.response)
```

## 📚 Resources

- [Postman MCP Documentation](https://github.com/postman-mcp)
- [Ascended Social Postman Setup](./POSTMAN_SETUP.md)
- [Environment Files](./postman-environment.json)
- [PostHog Collection](./docs/integrations/postman-posthog-collection.json)

## 💡 Tips

1. **Always use environments** - Never hardcode secrets in collections
2. **Use secret type** - Set `type: "secret"` for sensitive values
3. **Test locally first** - Use development environment before production
4. **Automate testing** - Use MCP tools in CI/CD pipelines
5. **Version control** - Keep environment templates (without secrets) in git
6. **Regular updates** - Keep environment variables in sync with code changes

---

**Ready to test?** Import your environments and start using the MCP tools! 🚀
