import type { Meta, StoryObj } from '@storybook/react';
import SpiritAvatar from '@/components/SpiritAvatar';

const meta = {
  title: 'Spiritual/SpiritAvatar',
  component: SpiritAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    spiritId: {
      control: 'text',
      description: 'Unique identifier for the spirit guide',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    animated: {
      control: 'boolean',
      description: 'Enable floating animation',
    },
  },
} satisfies Meta<typeof SpiritAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WisdomGuide: Story = {
  args: {
    spiritId: 'spirit_wisdom_001',
    size: 'md',
    animated: true,
  },
};

export const StaticSpirit: Story = {
  args: {
    spiritId: 'spirit_protection_002',
    size: 'lg',
    animated: false,
  },
};

export const SmallGuide: Story = {
  args: {
    spiritId: 'spirit_healing_003',
    size: 'sm',
    animated: true,
  },
};

export const LargePresence: Story = {
  args: {
    spiritId: 'spirit_ancient_004',
    size: 'xl',
    animated: true,
  },
};