import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays user avatar with spiritual fallbacks and customizable sizes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cosmic text-white p-8">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Spiritual seeker" />
      <AvatarFallback>SS</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.com/image.jpg" alt="Broken" />
      <AvatarFallback>AS</AvatarFallback>
    </Avatar>
  ),
};

export const SpiritualSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const ChakraAvatars: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16 border-2 border-red-500">
        <AvatarFallback className="bg-red-500/20 text-red-500 text-lg">🔴</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16 border-2 border-green-500">
        <AvatarFallback className="bg-green-500/20 text-green-500 text-lg">🟢</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16 border-2 border-purple-500">
        <AvatarFallback className="bg-purple-500/20 text-purple-500 text-lg">🟣</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const SpiritualProfile: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20 border-2 border-primary">
        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Spiritual Guide" />
        <AvatarFallback className="bg-primary/20 text-primary text-2xl">✨</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">Spiritual Guide</h3>
        <p className="text-sm text-muted-foreground">Ascending Soul • Crown Chakra</p>
        <p className="text-xs text-muted-foreground">Energy Level: High</p>
      </div>
    </div>
  ),
};

