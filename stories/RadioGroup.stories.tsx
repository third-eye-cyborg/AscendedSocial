import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Radio group for selecting spiritual preferences and chakra focus.',
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
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const ChakraFocus: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Your Primary Chakra Focus</h3>
      <RadioGroup defaultValue="heart">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="root" id="root" />
          <Label htmlFor="root" className="flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            Root Chakra - Grounding
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sacral" id="sacral" />
          <Label htmlFor="sacral" className="flex items-center gap-2">
            <span className="text-orange-500">🟠</span>
            Sacral Chakra - Creativity
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="solar" id="solar" />
          <Label htmlFor="solar" className="flex items-center gap-2">
            <span className="text-yellow-500">🟡</span>
            Solar Plexus - Personal Power
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="heart" id="heart" />
          <Label htmlFor="heart" className="flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            Heart Chakra - Love & Compassion
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="throat" id="throat" />
          <Label htmlFor="throat" className="flex items-center gap-2">
            <span className="text-blue-500">🔵</span>
            Throat Chakra - Communication
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="third-eye" id="third-eye" />
          <Label htmlFor="third-eye" className="flex items-center gap-2">
            <span className="text-indigo-500">🟣</span>
            Third Eye - Intuition
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="crown" id="crown" />
          <Label htmlFor="crown" className="flex items-center gap-2">
            <span className="text-purple-500">🟣</span>
            Crown Chakra - Spirituality
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const MeditationStyle: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Your Meditation Style</h3>
      <RadioGroup defaultValue="mindfulness">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mindfulness" id="mindfulness" />
          <Label htmlFor="mindfulness" className="flex items-center gap-2">
            <span>🧘</span>
            Mindfulness Meditation
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="transcendental" id="transcendental" />
          <Label htmlFor="transcendental" className="flex items-center gap-2">
            <span>✨</span>
            Transcendental Meditation
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="loving-kindness" id="loving-kindness" />
          <Label htmlFor="loving-kindness" className="flex items-center gap-2">
            <span>💝</span>
            Loving-Kindness Meditation
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="walking" id="walking" />
          <Label htmlFor="walking" className="flex items-center gap-2">
            <span>🚶</span>
            Walking Meditation
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const SpiritualLevel: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">What's Your Spiritual Experience Level?</h3>
      <RadioGroup defaultValue="intermediate">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="beginner" id="beginner" />
          <Label htmlFor="beginner" className="flex items-center gap-2">
            <span>🌱</span>
            Beginner - Just starting my journey
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="intermediate" id="intermediate" />
          <Label htmlFor="intermediate" className="flex items-center gap-2">
            <span>🧘</span>
            Intermediate - Regular practice
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advanced" id="advanced" />
          <Label htmlFor="advanced" className="flex items-center gap-2">
            <span>🔮</span>
            Advanced - Deep spiritual practice
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="master" id="master" />
          <Label htmlFor="master" className="flex items-center gap-2">
            <span>⭐</span>
            Master - Spiritual teacher/guide
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

