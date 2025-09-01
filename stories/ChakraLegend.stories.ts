import type { Meta, StoryObj } from '@storybook/react';
import { ChakraLegend } from '@/components/ChakraLegend';

const meta = {
  title: 'Spiritual/ChakraLegend',
  component: ChakraLegend,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChakraLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactView: Story = {
  args: {
    compact: true,
  },
};

export const WithDescription: Story = {
  render: (args) => (
    <div className="max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Chakra Energy Centers</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Each chakra represents different aspects of your spiritual and physical well-being.
        Posts are automatically categorized by their spiritual frequency.
      </p>
      <ChakraLegend {...args} />
    </div>
  ),
};