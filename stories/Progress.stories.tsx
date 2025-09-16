import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
    className: 'w-[60%]',
  },
};

export const SpiritualProgress: Story = {
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader className="pb-3">
        <CardTitle>Spirit Evolution</CardTitle>
        <CardDescription>Your journey to enlightenment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Chakra Balance</span>
            <span>75%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Energy Level</span>
            <span>60%</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Meditation Streak</span>
            <span>90%</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const AuraLevel: Story = {
  render: (args) => (
    <div className="space-y-2 w-[300px]">
      <div className="flex justify-between text-sm">
        <span>Aura Level: Mystic 🌟</span>
        <span>2,847 / 5,000 XP</span>
      </div>
      <Progress value={57} className="h-3" />
      <div className="text-xs text-muted-foreground text-center">
        2,153 XP until Sage level 🔮
      </div>
    </div>
  ),
};