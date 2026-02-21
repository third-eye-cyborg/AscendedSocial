import type { Meta, StoryObj } from '@storybook/react';
import { ChakraLegend } from '@/components/ChakraLegend';

const meta = {
  title: 'Spiritual/ChakraLegend',
  component: ChakraLegend,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A visual legend showing the seven chakras and their meanings for content categorization in the spiritual platform.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    showDescriptions: {
      control: { type: 'boolean' },
    },
    interactive: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof ChakraLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    showDescriptions: true,
    interactive: false,
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    showDescriptions: true,
    interactive: false,
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    showDescriptions: true,
    interactive: false,
  },
};

export const WithoutDescriptions: Story = {
  args: {
    orientation: 'horizontal',
    showDescriptions: false,
    interactive: false,
  },
};

export const Interactive: Story = {
  args: {
    orientation: 'horizontal',
    showDescriptions: true,
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive chakra legend with clickable chakra points for more detailed information.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    orientation: 'horizontal',
    showDescriptions: false,
    interactive: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version showing only chakra colors and names, perfect for sidebars.',
      },
    },
  },
};

export const VerticalSidebar: Story = {
  render: () => (
    <div className="w-64 p-4 bg-background border rounded-lg">
      <h3 className="font-semibold mb-4">Content Categories</h3>
      <ChakraLegend 
        orientation="vertical" 
        showDescriptions={false} 
        interactive={true} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chakra legend designed for sidebar navigation and content filtering.',
      },
    },
  },
};