import { Router } from 'express';
import { figmaMCPServer } from './figma-mcp-server';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();

// Extract design tokens from Figma with enhanced error handling
router.post('/api/figma/extract-tokens', async (req, res) => {
  const startTime = Date.now();
  
  console.log(`🎨 [FIGMA-TOKENS] Starting design token extraction at ${new Date().toISOString()}`);
  
  if (!figmaMCPServer) {
    console.error('❌ [FIGMA-TOKENS] Server not available - missing credentials');
    return res.status(503).json({
      success: false,
      error: 'Figma MCP server not available - missing API credentials',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    });
  }
  
  try {
    // Check server health before proceeding
    const healthCheck = await figmaMCPServer.healthCheck();
    if (!healthCheck.success) {
      throw new Error(`Figma server health check failed: ${healthCheck.error}`);
    }
    
    console.log('✅ [FIGMA-TOKENS] Server health check passed, extracting tokens...');
    
    const tokens = await figmaMCPServer.extractDesignTokens();
    
    if (!tokens || Object.keys(tokens).length === 0) {
      console.warn('⚠️ [FIGMA-TOKENS] No tokens extracted from Figma');
      return res.json({
        success: false,
        error: 'No design tokens found in Figma file',
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      });
    }
    
    // Save tokens to CSS variables file with backup
    const cssVariables = generateCSSVariables(tokens);
    const tokensPath = path.join(process.cwd(), 'client/src/styles/figma-tokens.css');
    
    // Create backup of existing tokens
    try {
      const existingTokens = await fs.readFile(tokensPath, 'utf8');
      await fs.writeFile(`${tokensPath}.backup`, existingTokens);
      console.log('📋 [FIGMA-TOKENS] Created backup of existing tokens');
    } catch (e) {
      // File doesn't exist yet, which is fine
    }
    
    await fs.writeFile(tokensPath, cssVariables);
    
    const tokenCount = Object.keys(tokens).length;
    const duration = Date.now() - startTime;
    
    console.log(`✅ [FIGMA-TOKENS] Successfully extracted ${tokenCount} tokens in ${duration}ms`);
    
    res.json({
      success: true,
      tokens,
      tokenCount,
      duration,
      message: `Design tokens extracted and saved to CSS variables (${tokenCount} tokens)`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [FIGMA-TOKENS] Extraction failed after ${duration}ms:`, error.message);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to extract design tokens from Figma',
      errorType: error.constructor.name,
      duration,
      timestamp: new Date().toISOString()
    });
  }
});

// Sync components from Figma to Storybook with comprehensive monitoring
router.post('/api/figma/sync-components', async (req, res) => {
  const startTime = Date.now();
  const syncId = `sync-${Date.now()}`;
  
  console.log(`🔄 [FIGMA-SYNC] Starting component sync ${syncId} at ${new Date().toISOString()}`);
  
  if (!figmaMCPServer) {
    console.error(`❌ [FIGMA-SYNC] ${syncId} - Server not available`);
    return res.status(503).json({
      success: false,
      error: 'Figma MCP server not available',
      syncId,
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    // Health check first
    const healthCheck = await figmaMCPServer.healthCheck();
    if (!healthCheck.success) {
      throw new Error(`Server health check failed: ${healthCheck.error}`);
    }
    
    console.log(`✅ [FIGMA-SYNC] ${syncId} - Health check passed, syncing components...`);
    
    const components = await figmaMCPServer.syncComponentsFromFigma();
    
    if (!components || components.length === 0) {
      console.warn(`⚠️ [FIGMA-SYNC] ${syncId} - No components found in Figma`);
      return res.json({
        success: false,
        error: 'No components found in Figma file',
        syncId,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      });
    }
    
    console.log(`📦 [FIGMA-SYNC] ${syncId} - Found ${components.length} components`);
    
    const duration = Date.now() - startTime;
    console.log(`✅ [FIGMA-SYNC] ${syncId} - Completed in ${duration}ms: ${components.length} components`);
    
    res.json({
      success: true,
      syncId,
      componentsCount: components.length,
      components: components.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type || 'component',
        figmaUrl: c.figmaUrl
      })),
      duration,
      message: `Components synced from Figma: ${components.length} components`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [FIGMA-SYNC] ${syncId} - Sync failed after ${duration}ms:`, error.message);
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to sync components from Figma',
      errorType: error.constructor.name,
      syncId,
      duration,
      timestamp: new Date().toISOString()
    });
  }
});

// Push design updates back to Figma (bidirectional sync)
router.post('/api/figma/push-updates', async (req, res) => {
  try {
    const { componentUpdates } = req.body;
    
    if (!componentUpdates || !Array.isArray(componentUpdates)) {
      return res.status(400).json({ 
        success: false, 
        error: 'componentUpdates array is required' 
      });
    }
    
    const results = await figmaMCPServer.pushDesignUpdatesToFigma(componentUpdates);
    
    res.json({
      success: true,
      updatedComponents: results.length,
      results,
      message: 'Design updates pushed to Figma'
    });
  } catch (error) {
    console.error('Error pushing updates to Figma:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to push updates to Figma' 
    });
  }
});

// Get Figma component metadata
router.get('/api/figma/component-metadata/:componentName', async (req, res) => {
  try {
    const { componentName } = req.params;
    const metadataPath = path.join(
      process.cwd(), 
      'config', 
      'figma-metadata', 
      `${componentName}.json`
    );
    
    const metadata = await fs.readFile(metadataPath, 'utf8');
    res.json({
      success: true,
      metadata: JSON.parse(metadata)
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: 'Component metadata not found' 
    });
  }
});

// Helper function to generate CSS variables from design tokens
function generateCSSVariables(tokens: any): string {
  let css = `/* Auto-generated from Figma design tokens - ${tokens.timestamp} */\n:root {\n`;
  
  // Color tokens
  Object.entries(tokens.colors).forEach(([name, value]) => {
    css += `  --color-${name.toLowerCase().replace(/\s+/g, '-')}: ${value};\n`;
  });
  
  // Spacing tokens
  Object.entries(tokens.spacing).forEach(([name, value]) => {
    css += `  --${name}: ${value};\n`;
  });
  
  // Typography tokens
  Object.entries(tokens.typography).forEach(([name, style]: [string, any]) => {
    const safeName = name.toLowerCase().replace(/\s+/g, '-');
    css += `  --font-size-${safeName}: ${style.fontSize};\n`;
    css += `  --font-weight-${safeName}: ${style.fontWeight};\n`;
    css += `  --line-height-${safeName}: ${style.lineHeight};\n`;
  });
  
  css += '}\n\n';
  
  // Add utility classes
  css += '/* Utility classes for Figma design tokens */\n';
  Object.keys(tokens.colors).forEach(name => {
    const safeName = name.toLowerCase().replace(/\s+/g, '-');
    css += `.text-${safeName} { color: var(--color-${safeName}); }\n`;
    css += `.bg-${safeName} { background-color: var(--color-${safeName}); }\n`;
  });
  
  return css;
}

// Helper function to save Figma component metadata
async function saveFigmaComponentMetadata(components: any[]) {
  const metadataDir = path.join(process.cwd(), 'config', 'figma-metadata');
  await fs.mkdir(metadataDir, { recursive: true });
  
  for (const component of components) {
    const filePath = path.join(metadataDir, `${component.name}.json`);
    await fs.writeFile(filePath, JSON.stringify(component, null, 2));
  }
}

export function registerFigmaMCPRoutes(app: any) {
  app.use(router);
  console.log('🎨 Figma MCP routes registered');
}