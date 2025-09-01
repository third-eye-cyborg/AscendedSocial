import type { Meta, StoryObj } from '@storybook/react';
import { OracleSidebar } from '@/components/OracleSidebar';

const meta = {
  title: 'Complex/OracleSidebar',
  component: OracleSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OracleSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex h-screen">
      <div className="flex-1 p-8 bg-muted/20">
        <h2 className="text-2xl font-bold mb-4">Main Content Area</h2>
        <p className="text-muted-foreground">
          The oracle sidebar provides spiritual guidance and daily readings 
          to enhance your journey through the platform.
        </p>
      </div>
      <OracleSidebar {...args} />
    </div>
  ),
};

export const WithDailyReading: Story = {
  render: (args) => (
    <div className="flex h-screen">
      <div className="flex-1 p-8 bg-muted/20">
        <h2 className="text-2xl font-bold mb-4">Your Spiritual Dashboard</h2>
        <div className="grid gap-4">
          <div className="p-4 bg-background rounded-lg">
            <h3 className="font-semibold">Today's Meditation</h3>
            <p className="text-sm text-muted-foreground">20 minutes completed</p>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <h3 className="font-semibold">Energy Level</h3>
            <p className="text-sm text-muted-foreground">850 ⚡ available</p>
          </div>
        </div>
      </div>
      <OracleSidebar {...args} />
    </div>
  ),
};