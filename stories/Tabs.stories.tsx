import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpiritualJourney: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="chakras" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="chakras">Chakras</TabsTrigger>
        <TabsTrigger value="meditation">Meditation</TabsTrigger>
        <TabsTrigger value="energy">Energy</TabsTrigger>
      </TabsList>
      <TabsContent value="chakras" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Chakra Alignment</CardTitle>
            <CardDescription>
              Monitor your energy centers and spiritual balance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>🔴 Root</span>
              <span className="text-green-600">Balanced</span>
            </div>
            <div className="flex justify-between">
              <span>🟠 Sacral</span>
              <span className="text-yellow-600">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span>🟡 Solar Plexus</span>
              <span className="text-green-600">Balanced</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="meditation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Meditation Practice</CardTitle>
            <CardDescription>
              Track your daily meditation sessions and progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Current Streak</span>
              <span className="font-bold">7 days</span>
            </div>
            <div className="flex justify-between">
              <span>Total Sessions</span>
              <span>156</span>
            </div>
            <div className="flex justify-between">
              <span>Favorite Duration</span>
              <span>20 minutes</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="energy" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Energy Management</CardTitle>
            <CardDescription>
              Monitor your spiritual energy levels and sharing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Current Energy</span>
              <span className="text-blue-600">850 ⚡</span>
            </div>
            <div className="flex justify-between">
              <span>Energy Shared Today</span>
              <span>25 ⚡</span>
            </div>
            <div className="flex justify-between">
              <span>Energy Received</span>
              <span>42 ⚡</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};