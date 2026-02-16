import type { Preview } from '@storybook/react-vite'
import '../client/src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        "spiritual-dark": {
          name: 'spiritual-dark',
          value: 'hsl(222.2, 84%, 4.9%)',
        },

        "spiritual-light": {
          name: 'spiritual-light',
          value: 'hsl(210, 40%, 98%)',
        },

        "cosmic-purple": {
          name: 'cosmic-purple',
          value: 'hsl(263, 70%, 10%)',
        }
      }
    },
    docs: {
      story: {
        inline: true,
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'moon',
        items: ['light', 'dark'],
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'spiritual-dark'
    }
  }
};

export default preview;