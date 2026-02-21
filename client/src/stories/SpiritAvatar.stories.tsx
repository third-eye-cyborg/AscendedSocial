import type { Meta, StoryObj } from '@storybook/react';
import { SpiritAvatar } from '@/components/SpiritAvatar';

const meta = {
  title: 'Spiritual/SpiritAvatar',
  component: SpiritAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'AI-generated spirit guide avatars that represent cosmic entities and spiritual guides for users.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    spiritData: {
      control: { type: 'object' },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    animated: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof SpiritAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const guardianSpirit = {
  id: 'guardian-1',
  name: 'Luminara',
  type: 'Guardian Angel',
  element: 'Light',
  chakra: 'Crown',
  description: 'A radiant guardian of divine wisdom and protection',
  imagePrompt: 'ethereal being of pure light with golden wings',
  generatedImage: null,
};

const elementalSpirit = {
  id: 'elemental-1', 
  name: 'Aquarius',
  type: 'Water Elemental',
  element: 'Water',
  chakra: 'Sacral',
  description: 'A flowing spirit of emotional healing and intuition',
  imagePrompt: 'mystical water spirit with flowing blue energy',
  generatedImage: null,
};

const animalSpirit = {
  id: 'animal-1',
  name: 'Silverwind',
  type: 'Wolf Spirit',
  element: 'Earth',
  chakra: 'Root',
  description: 'A wise wolf spirit guide for inner strength and loyalty',
  imagePrompt: 'majestic wolf with silver fur and glowing eyes',
  generatedImage: null,
};

export const Default: Story = {
  args: {
    spiritData: guardianSpirit,
    size: 'md',
    animated: false,
  },
};

export const Small: Story = {
  args: {
    spiritData: guardianSpirit,
    size: 'sm',
    animated: false,
  },
};

export const Large: Story = {
  args: {
    spiritData: guardianSpirit,
    size: 'lg',
    animated: true,
  },
};

export const ExtraLarge: Story = {
  args: {
    spiritData: guardianSpirit,
    size: 'xl',
    animated: true,
  },
};

export const Animated: Story = {
  args: {
    spiritData: guardianSpirit,
    size: 'md',
    animated: true,
  },
};

export const WaterElemental: Story = {
  args: {
    spiritData: elementalSpirit,
    size: 'md',
    animated: true,
  },
};

export const AnimalSpirit: Story = {
  args: {
    spiritData: animalSpirit,
    size: 'md',
    animated: false,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={guardianSpirit} size="sm" />
        <p className="text-xs">Small</p>
      </div>
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={guardianSpirit} size="md" />
        <p className="text-xs">Medium</p>
      </div>
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={guardianSpirit} size="lg" />
        <p className="text-xs">Large</p>
      </div>
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={guardianSpirit} size="xl" />
        <p className="text-xs">Extra Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes for spirit avatars.',
      },
    },
  },
};

export const SpiritTypes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={guardianSpirit} size="lg" animated />
        <div>
          <p className="font-semibold">{guardianSpirit.name}</p>
          <p className="text-xs text-muted-foreground">{guardianSpirit.type}</p>
        </div>
      </div>
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={elementalSpirit} size="lg" animated />
        <div>
          <p className="font-semibold">{elementalSpirit.name}</p>
          <p className="text-xs text-muted-foreground">{elementalSpirit.type}</p>
        </div>
      </div>
      <div className="text-center space-y-2">
        <SpiritAvatar spiritData={animalSpirit} size="lg" animated />
        <div>
          <p className="font-semibold">{animalSpirit.name}</p>
          <p className="text-xs text-muted-foreground">{animalSpirit.type}</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different types of spirit guides available in the platform.',
      },
    },
  },
};