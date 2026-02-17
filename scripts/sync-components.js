#!/usr/bin/env node
/**
 * Automated Component Catalog Script
 * Scans components and generates a design system catalog
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const syncComponents = async () => {
  console.log('🔄 Starting automated component catalog sync...');
  
  // Find all component files
  const componentFiles = await glob('client/src/components/**/*.tsx', {
    ignore: ['**/*.stories.tsx', '**/*.test.tsx']
  });
  
  const uiComponents = componentFiles.filter(f => f.includes('components/ui/'));
  const spiritualComponents = componentFiles.filter(f => !f.includes('components/ui/'));
  
  console.log(`📦 Found ${componentFiles.length} components (${uiComponents.length} UI, ${spiritualComponents.length} spiritual)`);
  
  // Generate catalog
  const catalog = {
    timestamp: new Date().toISOString(),
    total: componentFiles.length,
    ui: uiComponents.map(f => path.basename(f, '.tsx')),
    spiritual: spiritualComponents.map(f => path.basename(f, '.tsx'))
  };
  
  const catalogDir = path.join('config', 'component-catalog');
  if (!fs.existsSync(catalogDir)) {
    fs.mkdirSync(catalogDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(catalogDir, 'catalog.json'),
    JSON.stringify(catalog, null, 2)
  );
  
  console.log(`🎉 Component catalog generated with ${componentFiles.length} components`);
};

// Run the sync
syncComponents().catch(console.error);