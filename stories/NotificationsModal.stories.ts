import type { Meta, StoryObj } from '@storybook/react';
import { NotificationsModal } from '@/components/NotificationsModal';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Complex/NotificationsModal',
  component: NotificationsModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof NotificationsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div>
      <Button>Open Notifications</Button>
      <NotificationsModal {...args} isOpen={true} />
    </div>
  ),
};

export const WithManyNotifications: Story = {
  render: (args) => (
    <div>
      <Button>View All Notifications</Button>
      <NotificationsModal {...args} isOpen={true} />
    </div>
  ),
};