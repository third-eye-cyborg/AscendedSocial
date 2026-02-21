// Builder.io configuration for VS Code SSH integration
module.exports = {
  // Builder.io API key - will be set via environment variable or VS Code settings
  apiKey: process.env.BUILDER_API_KEY || null,
  
  // Development environment configuration
  env: 'development',
  
  // Local development server configuration
  localProxy: {
    enabled: true,
    url: 'http://localhost:5000',
    port: 5000
  },
  
  // Builder.io API endpoints
  contentApiUrl: 'https://cdn.builder.io/api/v1/',
  previewUrl: 'https://preview.builder.io/',
  
  // Project structure mappings for SSH VS Code integration
  workspace: {
    root: './',
    client: './client',
    server: './server',
    shared: './shared',
    assets: './attached_assets'
  },
  
  // File patterns to watch for changes
  watch: [
    'client/src/**/*.{ts,tsx,js,jsx}',
    'server/**/*.{ts,js}',
    'shared/**/*.{ts,js}',
    'package.json',
    'vite.config.ts'
  ],
  
  // Content models definition
  models: [
    {
      name: 'page',
      type: 'page',
      urlPath: '/',
      schema: [
        {
          name: 'title',
          type: 'string',
          required: true,
          description: 'Page title'
        },
        {
          name: 'description',
          type: 'text',
          required: false,
          description: 'Page description for SEO'
        },
        {
          name: 'content',
          type: 'blocks',
          required: false,
          description: 'Page content blocks'
        }
      ]
    },
    {
      name: 'component',
      type: 'component',
      schema: [
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'Component name'
        },
        {
          name: 'props',
          type: 'object',
          required: false,
          description: 'Component props'
        }
      ]
    }
  ],
  
  // GitHub Copilot integration settings
  copilot: {
    enabled: true,
    suggestions: {
      typescript: true,
      javascript: true,
      react: true,
      css: true
    }
  },
  
  // SSH VS Code remote development settings
  remote: {
    platform: 'linux',
    node: {
      version: '20',
      manager: 'npm'
    },
    environment: {
      NODE_ENV: 'development',
      PORT: '5000'
    }
  },
  
  // Build configuration
  build: {
    command: 'npm run build',
    outputDir: './dist/public',
    publicPath: '/',
    sourceMaps: true
  },
  
  // Development server configuration
  dev: {
    command: 'npm run dev',
    port: 5000,
    host: '0.0.0.0',
    hmr: true,
    https: false
  },
  
  // Integration with Replit workflows
  replit: {
    workflowName: 'Start application',
    deploymentTarget: 'autoscale',
    ports: [
      { local: 5000, external: 80 },
      { local: 6006, external: 3000 }
    ]
  }
};