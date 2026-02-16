import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A switch component for toggling spiritual features and preferences.',
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
} satisfies Meta<typeof Switch>;

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
      <Switch id="spiritual-mode" />
      <Label htmlFor="spiritual-mode">Enable spiritual mode</Label>
    </div>
  ),
};

export const SpiritualSettings: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <h3 className="font-semibold text-lg">Spiritual Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="aura-visibility">Aura Visibility</Label>
            <p className="text-sm text-muted-foreground">
              Show your aura level to other users
            </p>
          </div>
          <Switch id="aura-visibility" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="oracle-notifications">Oracle Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive daily spiritual guidance
            </p>
          </div>
          <Switch id="oracle-notifications" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="chakra-reminders">Chakra Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get reminded to balance your chakras
            </p>
          </div>
          <Switch id="chakra-reminders" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="cosmic-alerts">Cosmic Event Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Be notified of astrological events
            </p>
          </div>
          <Switch id="cosmic-alerts" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="energy-sharing">Energy Sharing</Label>
            <p className="text-sm text-muted-foreground">
              Allow others to share energy with you
            </p>
          </div>
          <Switch id="energy-sharing" defaultChecked />
        </div>
      </div>
    </div>
  ),
};