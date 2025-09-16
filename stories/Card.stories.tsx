import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Card {...args} className="w-[350px]">
        <CardHeader>
          <CardTitle>Spiritual Journey</CardTitle>
          <CardDescription>Track your progress on the path of enlightenment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your spirit guide has new insights to share with you today.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Begin Meditation</Button>
        </CardFooter>
      </Card>
    );
  },
};

export const WithoutFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Daily Oracle</CardTitle>
        <CardDescription>Receive guidance from the cosmic energies</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          "Trust in the universe's plan. Your path is illuminated by stardust and dreams."
        </p>
      </CardContent>
    </Card>
  ),
};

export const Minimal: Story = {
  render: (args) => (
    <Card {...args} className="w-[300px] p-6">
      <p className="text-center">Simple chakra card</p>
    </Card>
  ),
};