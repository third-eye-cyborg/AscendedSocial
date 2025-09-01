import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog component for important interactions and content in the spiritual platform.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Spiritual Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Vision</DialogTitle>
          <DialogDescription>
            Connect with the community by sharing your spiritual insights and experiences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" placeholder="Vision title..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Input id="content" placeholder="Share your experience..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Share Vision</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const OracleReading: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500">🔮 Request Oracle Reading</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">🔮 Oracle Speaks</DialogTitle>
          <DialogDescription className="text-center">
            The cosmic forces have aligned to bring you guidance
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌟</div>
            <p className="text-lg italic">
              "The path of spiritual awakening requires both patience and courage. Trust in your inner wisdom, for it will guide you through the shadows toward the light."
            </p>
            <p className="text-sm text-muted-foreground">
              - Oracle of the Ascended Realm
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-center">
          <Button variant="outline">Request Another Reading</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const JoinCommunity: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Lightworkers Circle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>✨ Welcome to the Lightworkers Circle</DialogTitle>
          <DialogDescription>
            A sacred space for spiritual growth, healing, and connection with like-minded souls.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Community Guidelines:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Respect all spiritual paths and beliefs</li>
              <li>• Share with love and compassion</li>
              <li>• Maintain positive energy and intention</li>
              <li>• Support fellow members on their journey</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Join Circle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};