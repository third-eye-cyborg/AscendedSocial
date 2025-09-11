import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A two-state button for spiritual preferences and settings.',
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
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
};

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
      Italic
    </Toggle>
  ),
};

export const SpiritualToggles: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Spiritual Preferences</h3>
      <div className="flex flex-wrap gap-2">
        <Toggle aria-label="Daily meditation reminder">
          🧘 Daily Meditation
        </Toggle>
        <Toggle aria-label="Moon phase notifications" defaultPressed>
          🌙 Moon Phases
        </Toggle>
        <Toggle aria-label="Chakra insights">
          ⚡ Chakra Insights
        </Toggle>
        <Toggle aria-label="Energy sharing" defaultPressed>
          ✨ Energy Sharing
        </Toggle>
      </div>
    </div>
  ),
};

export const ChakraToggles: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Active Chakra Focus</h3>
      <div className="grid grid-cols-2 gap-2">
        <Toggle variant="outline" aria-label="Root chakra" className="text-red-400 border-red-500/30">
          🔴 Root
        </Toggle>
        <Toggle variant="outline" aria-label="Sacral chakra" className="text-orange-400 border-orange-500/30">
          🟠 Sacral
        </Toggle>
        <Toggle variant="outline" aria-label="Solar chakra" className="text-yellow-400 border-yellow-500/30">
          🟡 Solar
        </Toggle>
        <Toggle variant="outline" aria-label="Heart chakra" defaultPressed className="text-green-400 border-green-500/30">
          🟢 Heart
        </Toggle>
        <Toggle variant="outline" aria-label="Throat chakra" className="text-blue-400 border-blue-500/30">
          🔵 Throat
        </Toggle>
        <Toggle variant="outline" aria-label="Third eye chakra" className="text-indigo-400 border-indigo-500/30">
          🟣 Third Eye
        </Toggle>
        <Toggle variant="outline" aria-label="Crown chakra" defaultPressed className="text-purple-400 border-purple-500/30 col-span-2">
          🟣 Crown
        </Toggle>
      </div>
    </div>
  ),
};

export const ToggleGroupExample: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Meditation Style</h3>
      <ToggleGroup type="single" defaultValue="mindfulness">
        <ToggleGroupItem value="mindfulness" aria-label="Mindfulness">
          🧘 Mindfulness
        </ToggleGroupItem>
        <ToggleGroupItem value="loving-kindness" aria-label="Loving-kindness">
          💝 Loving-kindness
        </ToggleGroupItem>
        <ToggleGroupItem value="transcendental" aria-label="Transcendental">
          ✨ Transcendental
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const EnergySettings: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Energy Sharing Preferences</h3>
        <ToggleGroup type="multiple" defaultValue={["posts", "comments"]}>
          <ToggleGroupItem value="posts" aria-label="Share energy with posts">
            📝 Posts
          </ToggleGroupItem>
          <ToggleGroupItem value="comments" aria-label="Share energy with comments">
            💬 Comments
          </ToggleGroupItem>
          <ToggleGroupItem value="profiles" aria-label="Share energy with profiles">
            👤 Profiles
          </ToggleGroupItem>
          <ToggleGroupItem value="communities" aria-label="Share energy with communities">
            👥 Communities
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Types</h3>
        <ToggleGroup type="multiple" defaultValue={["spiritual", "community"]}>
          <ToggleGroupItem value="spiritual" aria-label="Spiritual notifications">
            ✨ Spiritual
          </ToggleGroupItem>
          <ToggleGroupItem value="community" aria-label="Community notifications">
            👥 Community
          </ToggleGroupItem>
          <ToggleGroupItem value="oracle" aria-label="Oracle notifications">
            🔮 Oracle
          </ToggleGroupItem>
          <ToggleGroupItem value="moon" aria-label="Moon phase notifications">
            🌙 Moon Phases
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

