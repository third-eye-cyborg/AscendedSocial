import type { Meta, StoryObj } from '@storybook/react';
import StarmapVisualizer from '@/components/StarmapVisualizer';

const meta = {
  title: 'Complex/StarmapVisualizer',
  component: StarmapVisualizer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['starmap', 'fungal'],
      description: 'Visualization mode',
    },
  },
} satisfies Meta<typeof StarmapVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StarmapMode: Story = {
  args: {
    mode: 'starmap',
  },
};

export const FungalMode: Story = {
  args: {
    mode: 'fungal',
  },
};

export const Interactive: Story = {
  render: (args) => (
    <div className="h-screen w-full relative">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur p-4 rounded-lg">
        <h3 className="font-semibold mb-2">3D Community Starmap</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Explore the spiritual connections in our community. 
          Click and drag to navigate the cosmic network.
        </p>
      </div>
      <StarmapVisualizer {...args} />
    </div>
  ),
  args: {
    mode: 'starmap',
  },
};