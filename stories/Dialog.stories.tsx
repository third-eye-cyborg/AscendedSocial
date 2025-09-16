import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShareVision: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Share Your Vision</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Spiritual Vision</DialogTitle>
          <DialogDescription>
            Describe a mystical experience or spiritual insight to inspire the community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <textarea 
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            placeholder="I saw myself surrounded by golden light..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Share Vision</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const MeditationGuide: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>🧘‍♀️ Start Meditation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Guided Meditation Session</DialogTitle>
          <DialogDescription>
            Choose your meditation duration and chakra focus.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-center space-y-4">
            <div>Duration: 10 minutes</div>
            <div>Focus: Heart Chakra 💚</div>
            <div className="text-2xl">🕯️</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="w-full">Begin Journey</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
};