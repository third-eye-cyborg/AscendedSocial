import type { Meta, StoryObj } from '@storybook/react';
import { ProfileIcon } from '@/components/ProfileIcon';

const meta = {
  title: 'Spiritual/ProfileIcon',
  component: ProfileIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A spiritual profile icon component that displays user avatars with mystical sigils and aura representations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: { type: 'object' },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof ProfileIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  id: '1',
  username: 'SpiritualSeeker',
  displayName: 'Cosmic Wanderer',
  profilePicture: null,
  sigil: '✨🌟💫',
  auraLevel: 'radiant' as const,
  isPremium: true,
};

const basicUser = {
  id: '2',
  username: 'NewSeeker',
  displayName: 'Awakening Soul',
  profilePicture: null,
  sigil: '🌱',
  auraLevel: 'dim' as const,
  isPremium: false,
};

export const Default: Story = {
  args: {
    user: mockUser,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    user: mockUser,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    user: mockUser,
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    user: mockUser,
    size: 'xl',
  },
};

export const BasicUser: Story = {
  args: {
    user: basicUser,
    size: 'md',
  },
};

export const WithProfilePicture: Story = {
  args: {
    user: {
      ...mockUser,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center space-y-2">
        <ProfileIcon user={mockUser} size="sm" />
        <p className="text-xs">Small</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon user={mockUser} size="md" />
        <p className="text-xs">Medium</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon user={mockUser} size="lg" />
        <p className="text-xs">Large</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon user={mockUser} size="xl" />
        <p className="text-xs">Extra Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes for the spiritual profile icon.',
      },
    },
  },
};

export const DifferentAuraLevels: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center space-y-2">
        <ProfileIcon 
          user={{...mockUser, auraLevel: 'dim'}} 
          size="lg" 
        />
        <p className="text-xs">Dim Aura</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon 
          user={{...mockUser, auraLevel: 'glowing'}} 
          size="lg" 
        />
        <p className="text-xs">Glowing Aura</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon 
          user={{...mockUser, auraLevel: 'radiant'}} 
          size="lg" 
        />
        <p className="text-xs">Radiant Aura</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon 
          user={{...mockUser, auraLevel: 'luminous'}} 
          size="lg" 
        />
        <p className="text-xs">Luminous Aura</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different aura levels reflected in the profile icon styling.',
      },
    },
  },
};

export const PremiumVsBasic: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center space-y-2">
        <ProfileIcon user={{...mockUser, isPremium: false}} size="lg" />
        <p className="text-xs">Basic Member</p>
      </div>
      <div className="text-center space-y-2">
        <ProfileIcon user={{...mockUser, isPremium: true}} size="lg" />
        <p className="text-xs">Premium Member</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual differences between premium and basic user profile icons.',
      },
    },
  },
};