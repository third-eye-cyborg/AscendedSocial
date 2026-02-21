// import { Client } from 'figma-api';
import { promises as fs } from 'fs';
import path from 'path';

export class FigmaMCPServer {
  private figmaClient: any;
  private fileKey: string;

  constructor() {
    if (!process.env.FIGMA_ACCESS_TOKEN) {
      console.warn('FIGMA_ACCESS_TOKEN not found, Figma sync features will be disabled');
      this.figmaClient = null;
      this.fileKey = '';
      return;
    }
    
    if (!process.env.FIGMA_FILE_KEY) {
      console.warn('FIGMA_FILE_KEY not found, Figma sync features will be disabled');
      this.figmaClient = null;
      this.fileKey = '';
      return;
    }

    // this.figmaClient = new Client({ 
    //   personalAccessToken: process.env.FIGMA_ACCESS_TOKEN 
    // });
    this.figmaClient = { mockClient: true }; // Placeholder until figma-api is properly installed
    this.fileKey = process.env.FIGMA_FILE_KEY;
    console.log('🎨 Figma MCP server initialized');
  }

  /**
   * Extract design tokens from Figma file
   */
  async extractDesignTokens() {
    if (!this.figmaClient) {
      throw new Error('Figma client not initialized - missing API credentials');
    }
    
    try {
      const file = await this.figmaClient.file(this.fileKey);
      
      // Extract color variables and styles
      const colorTokens = this.extractColorTokens(file.data);
      const spacingTokens = this.extractSpacingTokens(file.data);
      const typographyTokens = this.extractTypographyTokens(file.data);
      
      return {
        colors: colorTokens,
        spacing: spacingTokens,
        typography: typographyTokens,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting design tokens:', error);
      throw error;
    }
  }

  /**
   * Sync component designs from Figma to local component files
   */
  async syncComponentsFromFigma() {
    try {
      const file = await this.figmaClient.file(this.fileKey);
      const components = await this.findComponents(file.data);
      
      const syncResults = [];
      
      for (const component of components) {
        const componentData = {
          id: component.id,
          name: component.name,
          description: component.description || '',
          properties: this.extractComponentProperties(component),
          styling: this.extractComponentStyling(component),
          variants: this.extractComponentVariants(component)
        };
        
        // Save component metadata for use in stories
        await this.saveComponentMetadata(componentData);
        syncResults.push(componentData);
      }
      
      return syncResults;
    } catch (error) {
      console.error('Error syncing components from Figma:', error);
      throw error;
    }
  }

  /**
   * Export design updates back to Figma (bidirectional sync)
   */
  async pushDesignUpdatesToFigma(componentUpdates: any[]) {
    try {
      // This would use Figma's REST API to update component properties
      // Note: Full bidirectional sync requires Figma Enterprise features
      const results = [];
      
      for (const update of componentUpdates) {
        // Update component properties in Figma
        const result = await this.updateFigmaComponent(update);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      console.error('Error pushing updates to Figma:', error);
      throw error;
    }
  }

  private extractColorTokens(fileData: any) {
    const colors: Record<string, string> = {};
    
    // Extract from Figma styles
    if (fileData.styles) {
      Object.values(fileData.styles).forEach((style: any) => {
        if (style.styleType === 'FILL') {
          colors[style.name] = this.convertFigmaColorToCss(style);
        }
      });
    }
    
    return colors;
  }

  private extractSpacingTokens(fileData: any) {
    const spacing: Record<string, string> = {};
    
    // Extract spacing patterns from layout grids and constraints
    // This is a simplified implementation
    const commonSpacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
    commonSpacing.forEach(space => {
      spacing[`space-${space}`] = `${space}px`;
    });
    
    return spacing;
  }

  private extractTypographyTokens(fileData: any) {
    const typography: Record<string, any> = {};
    
    if (fileData.styles) {
      Object.values(fileData.styles).forEach((style: any) => {
        if (style.styleType === 'TEXT') {
          typography[style.name] = this.convertFigmaTextStyleToCss(style);
        }
      });
    }
    
    return typography;
  }

  private async findComponents(fileData: any) {
    const components: any[] = [];
    
    const traverseNode = (node: any) => {
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        components.push(node);
      }
      
      if (node.children) {
        node.children.forEach(traverseNode);
      }
    };
    
    fileData.document.children.forEach(traverseNode);
    return components;
  }

  private extractComponentProperties(component: any) {
    return {
      width: component.absoluteBoundingBox?.width || 0,
      height: component.absoluteBoundingBox?.height || 0,
      constraints: component.constraints,
      layoutMode: component.layoutMode,
      paddingLeft: component.paddingLeft || 0,
      paddingRight: component.paddingRight || 0,
      paddingTop: component.paddingTop || 0,
      paddingBottom: component.paddingBottom || 0,
      itemSpacing: component.itemSpacing || 0,
    };
  }

  private extractComponentStyling(component: any) {
    return {
      fills: component.fills || [],
      strokes: component.strokes || [],
      effects: component.effects || [],
      cornerRadius: component.cornerRadius || 0,
      opacity: component.opacity || 1,
    };
  }

  private extractComponentVariants(component: any) {
    if (component.type === 'COMPONENT_SET') {
      return component.children?.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        properties: variant.componentPropertyDefinitions || {},
      })) || [];
    }
    return [];
  }

  private async saveComponentMetadata(componentData: any) {
    const metadataDir = path.join(process.cwd(), '.storybook', 'figma-metadata');
    await fs.mkdir(metadataDir, { recursive: true });
    
    const filePath = path.join(metadataDir, `${componentData.name}.json`);
    await fs.writeFile(filePath, JSON.stringify(componentData, null, 2));
  }

  private async updateFigmaComponent(update: any) {
    // Placeholder for bidirectional sync
    // Would use Figma's REST API to update component properties
    console.log('Updating Figma component:', update.name);
    return { success: true, componentId: update.id };
  }

  private convertFigmaColorToCss(style: any): string {
    // Convert Figma color format to CSS
    // This is a simplified implementation
    return '#000000'; // Placeholder
  }

  private convertFigmaTextStyleToCss(style: any): any {
    // Convert Figma text style to CSS properties
    // This is a simplified implementation
    return {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '1.5',
      fontFamily: 'system-ui'
    };
  }
}

// Initialize server conditionally
let figmaMCPServer: FigmaMCPServer | null = null;
try {
  figmaMCPServer = new FigmaMCPServer();
} catch (error) {
  console.warn('Figma MCP server initialization skipped:', error instanceof Error ? error.message : 'Unknown error');
}

export { figmaMCPServer };