import type { Meta, StoryObj } from '@storybook/react';
import { ProfileIcon } from '@/components/ProfileIcon';

const meta = {
  title: 'Spiritual/ProfileIcon',
  component: ProfileIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    userId: {
      control: 'text',
      description: 'User ID for the profile',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ProfileIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MysticUser: Story = {
  args: {
    userId: 'user123',
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    userId: 'user456',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    userId: 'user789',
    size: 'lg',
  },
};

export const WithFallback: Story = {
  args: {
    userId: 'unknown_user',
    size: 'md',
  },
};