import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} id="notifications" />
      <Label htmlFor="notifications">Cosmic notifications</Label>
    </div>
  ),
};

export const SpiritualSettings: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch {...args} id="oracle" defaultChecked />
        <Label htmlFor="oracle">Daily oracle readings</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch {...args} id="energy" />
        <Label htmlFor="energy">Energy sharing alerts</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch {...args} id="meditation" defaultChecked />
        <Label htmlFor="meditation">Meditation reminders</Label>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};