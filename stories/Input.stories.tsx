import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your spiritual name...',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="vision">Share Your Vision</Label>
      <Input {...args} id="vision" placeholder="Describe your mystical experience..." />
    </div>
  ),
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'enlightened@ascended.social',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Your secret chakra key...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Meditation in progress...',
    disabled: true,
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search the cosmic database...',
  },
};