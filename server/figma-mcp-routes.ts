import { Router } from 'express';
import { figmaMCPServer } from './figma-mcp-server';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();

// Extract design tokens from Figma
router.post('/api/figma/extract-tokens', async (req, res) => {
  if (!figmaMCPServer) {
    return res.status(503).json({
      success: false,
      error: 'Figma MCP server not available - missing API credentials'
    });
  }
  
  try {
    const tokens = await figmaMCPServer.extractDesignTokens();
    
    // Save tokens to CSS variables file
    const cssVariables = generateCSSVariables(tokens);
    await fs.writeFile(
      path.join(process.cwd(), 'client/src/styles/figma-tokens.css'),
      cssVariables
    );
    
    res.json({
      success: true,
      tokens,
      message: 'Design tokens extracted and saved to CSS variables'
    });
  } catch (error) {
    console.error('Error extracting Figma tokens:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to extract design tokens from Figma' 
    });
  }
});

// Sync components from Figma to Storybook
router.post('/api/figma/sync-components', async (req, res) => {
  try {
    const components = await figmaMCPServer.syncComponentsFromFigma();
    
    // Generate updated story files based on Figma components
    await generateStoriesFromFigmaComponents(components);
    
    res.json({
      success: true,
      componentsCount: components.length,
      components: components.map(c => ({ id: c.id, name: c.name })),
      message: 'Components synced from Figma and Storybook updated'
    });
  } catch (error) {
    console.error('Error syncing components from Figma:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to sync components from Figma' 
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
      '.storybook', 
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

// Helper function to generate stories from Figma components
async function generateStoriesFromFigmaComponents(components: any[]) {
  const storiesDir = path.join(process.cwd(), 'client/src/stories');
  
  for (const component of components) {
    const storyContent = `
import type { Meta, StoryObj } from '@storybook/react';
import { ${component.name} } from '../components/${component.name}';

// Auto-generated from Figma component: ${component.id}
const meta: Meta<typeof ${component.name}> = {
  title: 'Figma Sync/${component.name}',
  component: ${component.name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component synced from Figma: ${component.description}'
      }
    },
    figma: {
      component: '${component.id}',
      url: 'https://www.figma.com/file/${process.env.FIGMA_FILE_KEY}/${component.name}'
    }
  },
  tags: ['autodocs', 'figma-sync'],
  argTypes: {
    chakra: {
      control: 'select',
      options: ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown']
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

${component.variants?.map((variant: any) => `
export const ${variant.name.replace(/\s+/g, '')}: Story = {
  args: {
    variant: '${variant.name.toLowerCase()}'
  }
};`).join('\n') || ''}
`;
    
    await fs.writeFile(
      path.join(storiesDir, `${component.name}.figma-sync.stories.tsx`),
      storyContent
    );
  }
}

export function registerFigmaMCPRoutes(app: any) {
  app.use(router);
  console.log('🎨 Figma MCP routes registered');
}