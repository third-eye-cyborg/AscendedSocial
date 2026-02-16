import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A checkbox component for selection in forms and spiritual preference settings.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="spiritual-notifications" />
      <Label htmlFor="spiritual-notifications">
        Receive spiritual guidance notifications
      </Label>
    </div>
  ),
};

export const SpiritualPreferences: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Spiritual Notifications</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="oracle-readings" defaultChecked />
          <Label htmlFor="oracle-readings">Daily Oracle Readings</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="chakra-reminders" />
          <Label htmlFor="chakra-reminders">Chakra Alignment Reminders</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="community-updates" defaultChecked />
          <Label htmlFor="community-updates">Community Circle Updates</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="cosmic-events" />
          <Label htmlFor="cosmic-events">Cosmic Event Alerts</Label>
        </div>
      </div>
    </div>
  ),
};