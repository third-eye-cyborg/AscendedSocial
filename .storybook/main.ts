// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {
      strictMode: true
    }
  },
  "typescript": {
    "check": false,
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      "shouldExtractLiteralValuesFromEnum": true,
      "shouldRemoveUndefinedFromOptional": true,
      "propFilter": (prop: any) => {
        if (prop.declarations !== undefined && prop.declarations.length > 0) {
          const hasPropAdditionalDescription = prop.declarations.find((declaration: any) => {
            return !declaration.fileName.includes("node_modules");
          });

          return Boolean(hasPropAdditionalDescription);
        }

        return true;
      },
    },
  },
  async viteFinal(config) {
    // Enhanced Vite configuration for Storybook
    const { mergeConfig } = await import('vite');
    
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../client/src"),
          "@shared": path.resolve(__dirname, "../shared"),
          "@assets": path.resolve(__dirname, "../attached_assets"),
        },
      },
      define: {
        global: 'globalThis',
      },
      server: {
        fs: {
          allow: ['..'],
        },
      },
      optimizeDeps: {
        include: [
          '@storybook/addon-docs',
          '@radix-ui/react-accordion',
          '@radix-ui/react-dialog',
          '@radix-ui/react-avatar',
          '@radix-ui/react-tabs',
          'lucide-react'
        ],
        exclude: [
          '@anthropic-ai/sdk'
        ]
      },
      esbuild: {
        target: 'esnext',
        jsx: 'automatic'
      }
    });
  },
};
export default config;