import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component for spiritual data entry and user interactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'search', 'url', 'tel'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
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
      <Label htmlFor="spiritual-name">Spiritual Name</Label>
      <Input id="spiritual-name" {...args} />
    </div>
  ),
  args: {
    placeholder: 'Your awakened identity',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'your.email@spiritual.realm',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter sacred password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search visions and sparks...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'SpiritualSeeker✨',
    placeholder: 'Your spiritual username',
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="grid w-full max-w-md gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="text">Text Input</Label>
        <Input id="text" type="text" placeholder="Enter text..." />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email Input</Label>
        <Input id="email" type="email" placeholder="your@email.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password Input</Label>
        <Input id="password" type="password" placeholder="Password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="search">Search Input</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="disabled">Disabled Input</Label>
        <Input id="disabled" placeholder="Disabled" disabled />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various input types for different spiritual data entry needs.',
      },
    },
  },
};