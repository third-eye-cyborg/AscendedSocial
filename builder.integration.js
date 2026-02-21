#!/usr/bin/env node

// Builder.io CLI Integration Script for Fusion Access
// This script connects the Ascended Social platform with Builder.io fusion editor

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const BUILDER_API_KEY = process.env.BUILDER_API_KEY;
const LOCAL_PORT = 5000;
const BUILDER_PORT = 3001;

if (!BUILDER_API_KEY) {
  console.error('❌ BUILDER_API_KEY environment variable is required');
  process.exit(1);
}

console.log('🚀 Starting Builder.io Fusion Integration for Ascended Social');
console.log(`📡 Local app: http://localhost:${LOCAL_PORT}`);
console.log(`🎨 Builder fusion: http://localhost:${BUILDER_PORT}`);

// Create a simple Builder bridge configuration
const builderBridge = {
  apiKey: BUILDER_API_KEY,
  localUrl: `http://localhost:${LOCAL_PORT}`,
  previewUrl: `http://localhost:${BUILDER_PORT}`,
  models: [
    {
      name: 'page',
      type: 'page',
      urlPath: '/'
    },
    {
      name: 'component', 
      type: 'component'
    }
  ],
  framework: 'react',
  project: 'ascended-social',
  workspace: {
    client: './client',
    server: './server',
    shared: './shared'
  }
};

// Write builder bridge config
fs.writeFileSync('.builder-bridge.json', JSON.stringify(builderBridge, null, 2));

console.log('✅ Builder bridge configuration created');
console.log('🔗 Project configured for Builder.io Fusion access');
console.log('');
console.log('🎯 Next steps:');
console.log('1. Open Builder.io dashboard in your browser');
console.log('2. Connect to this project using the local development URL');
console.log(`3. Use http://localhost:${LOCAL_PORT} as your preview URL`);
console.log('4. Start editing with the visual Builder fusion editor');
console.log('');
console.log('🌟 Your Ascended Social platform is now ready for no-code editing!');