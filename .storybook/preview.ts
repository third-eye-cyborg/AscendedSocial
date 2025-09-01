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
      default: 'spiritual-dark',
      values: [
        {
          name: 'spiritual-dark',
          value: 'hsl(222.2, 84%, 4.9%)',
        },
        {
          name: 'spiritual-light',
          value: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'cosmic-purple',
          value: 'hsl(263, 70%, 10%)',
        },
      ],
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
};

export default preview;