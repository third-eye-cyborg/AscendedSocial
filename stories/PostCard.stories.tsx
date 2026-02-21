import type { Meta, StoryObj } from '@storybook/react';
import PostCard from '@/components/PostCard';

const meta = {
  title: 'Spiritual/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePost = {
  id: 'post_123',
  userId: 'user_456',
  content: 'Had the most incredible meditation experience today. I felt connected to the universal consciousness and received profound insights about my spiritual path. The energy was absolutely transcendent! 🌟✨',
  chakraType: 'crown' as const,
  spiritualFrequency: 8.7,
  createdAt: new Date('2025-01-15T10:30:00Z'),
  likes: 42,
  comments: 8,
  energyShared: 156,
};

const imagePost = {
  ...samplePost,
  id: 'post_456',
  content: 'Sunset meditation at the sacred grove. The colors spoke to my soul! 🌅🧘‍♀️',
  imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
  chakraType: 'heart' as const,
  spiritualFrequency: 9.2,
};

export const TextPost: Story = {
  args: {
    post: samplePost,
  },
};

export const WithImage: Story = {
  args: {
    post: imagePost,
  },
};

export const HighFrequency: Story = {
  args: {
    post: {
      ...samplePost,
      id: 'post_789',
      content: 'Breakthrough moment in my spiritual journey! I experienced complete ego dissolution and unity with the cosmos. This is what enlightenment feels like! 🌌🙏',
      chakraType: 'crown' as const,
      spiritualFrequency: 9.8,
      likes: 127,
      energyShared: 423,
    },
  },
};

export const RootChakra: Story = {
  args: {
    post: {
      ...samplePost,
      id: 'post_root',
      content: 'Grounding practice complete. Feeling so connected to Mother Earth and my physical body. Stability and strength flow through me. 🌳🔴',
      chakraType: 'root' as const,
      spiritualFrequency: 7.1,
    },
  },
};