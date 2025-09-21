import type { Meta, StoryObj } from '@storybook/react';
import CreatePost from '@/components/CreatePost';

const meta = {
  title: 'Complex/CreatePost',
  component: CreatePost,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreatePost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  render: (args) => (
    <div className="max-w-2xl space-y-4">
      <h3 className="text-lg font-semibold">Share Your Spiritual Journey</h3>
      <CreatePost {...args} />
      <p className="text-sm text-muted-foreground">
        Your post will be automatically analyzed and categorized by its spiritual frequency and chakra alignment.
      </p>
    </div>
  )
};