#!/usr/bin/env node
/**
 * Automated Component Sync Script
 * Following 2025 MCP Server Best Practices for Storybook Integration
 * Syncs all components from the spiritual platform to Storybook stories
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const SPIRITUAL_THEMES = {
  chakras: ['root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown'],
  auraLevels: ['dim', 'glowing', 'radiant', 'luminous', 'transcendent'],
  elements: ['Earth', 'Water', 'Fire', 'Air', 'Space', 'Light', 'Thought']
};

const generateStoryTemplate = (componentName, componentPath, isSpiritual = false) => {
  const storyTitle = isSpiritual ? `Spiritual/${componentName}` : `UI/${componentName}`;
  
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from '${componentPath}';

const meta = {
  title: '${storyTitle}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${isSpiritual ? 'A spiritual' : 'A'} ${componentName.toLowerCase()} component for the Ascended Social platform.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

${isSpiritual ? generateSpiritualStories(componentName) : generateUIStories(componentName)}
`;
};

const generateSpiritualStories = (componentName) => {
  return `
export const WithAura: Story = {
  args: {
    auraLevel: 'radiant',
  },
};

export const AllChakras: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      ${SPIRITUAL_THEMES.chakras.map(chakra => 
        `<${componentName} chakra="${chakra}" />`
      ).join('\n      ')}
    </div>
  ),
};
`;
};

const generateUIStories = (componentName) => {
  return `
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <${componentName} variant="default" />
      <${componentName} variant="secondary" />
      <${componentName} variant="outline" />
    </div>
  ),
};
`;
};

const syncComponents = async () => {
  console.log('🔄 Starting automated component sync...');
  
  // Find all component files
  const componentFiles = await glob('client/src/components/**/*.tsx', {
    ignore: ['**/*.stories.tsx', '**/*.test.tsx']
  });
  
  let syncedCount = 0;
  
  for (const filePath of componentFiles) {
    const componentName = path.basename(filePath, '.tsx');
    const isSpiritual = filePath.includes('components/') && !filePath.includes('components/ui/');
    const relativePath = path.relative('client/src/stories', filePath).replace('.tsx', '');
    const importPath = relativePath.startsWith('..') ? relativePath : `../${relativePath}`;
    
    const storyPath = `client/src/stories/${componentName}.stories.tsx`;
    
    // Only create story if it doesn't exist
    if (!fs.existsSync(storyPath)) {
      const storyContent = generateStoryTemplate(componentName, importPath, isSpiritual);
      fs.writeFileSync(storyPath, storyContent);
      console.log(`✨ Created story for ${componentName}`);
      syncedCount++;
    }
  }
  
  console.log(`🎉 Synced ${syncedCount} new components to Storybook`);
  
  // Update design system documentation
  updateDesignSystemDocs();
};

const updateDesignSystemDocs = () => {
  console.log('📚 Updating design system documentation...');
  
  const designSystemDoc = `# Ascended Social Design System

## Spiritual Component Library
Last updated: ${new Date().toISOString()}

### Component Status
- **UI Components**: ${fs.readdirSync('client/src/components/ui').length} components
- **Spiritual Components**: ${fs.readdirSync('client/src/components').filter(f => f.endsWith('.tsx')).length} components
- **Total Stories**: ${fs.readdirSync('client/src/stories').filter(f => f.endsWith('.stories.tsx')).length} stories

### Design Tokens
- **Chakra Colors**: 7 chakra-based color schemes
- **Aura Levels**: 5 spiritual progression levels
- **Typography**: Mystical font families and spacing
- **Animation**: Spiritual motion principles

### Component Categories
1. **Core UI** - shadcn/ui based components
2. **Spiritual** - Custom mystical components
3. **Forms** - Spiritual data entry components
4. **Layout** - Sacred geometry layouts
5. **Feedback** - Oracle and guidance components

*Generated automatically by MCP sync script*
`;
  
  fs.writeFileSync('client/src/stories/DESIGN_SYSTEM.md', designSystemDoc);
  console.log('📖 Design system documentation updated');
};

// Run the sync
syncComponents().catch(console.error);