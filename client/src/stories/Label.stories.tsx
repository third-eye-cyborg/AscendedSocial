import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A label component for form accessibility and spiritual interface labeling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Spiritual Name',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="spiritual-name">Your Awakened Identity</Label>
      <Input type="text" id="spiritual-name" placeholder="Enter your spiritual name" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        I accept the sacred terms of spiritual service
      </Label>
    </div>
  ),
};

export const FormLabels: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="your@email.com" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chakra-focus">Primary Chakra Focus</Label>
        <Input id="chakra-focus" placeholder="Heart Chakra" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="spiritual-goal">Spiritual Goal</Label>
        <Input id="spiritual-goal" placeholder="Enlightenment and inner peace" />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">
          Subscribe to spiritual insights newsletter
        </Label>
      </div>
    </div>
  ),
};