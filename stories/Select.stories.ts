import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChakraSelect: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select chakra" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="root">🔴 Root Chakra</SelectItem>
        <SelectItem value="sacral">🟠 Sacral Chakra</SelectItem>
        <SelectItem value="solar">🟡 Solar Plexus</SelectItem>
        <SelectItem value="heart">💚 Heart Chakra</SelectItem>
        <SelectItem value="throat">💙 Throat Chakra</SelectItem>
        <SelectItem value="third-eye">💜 Third Eye</SelectItem>
        <SelectItem value="crown">🤍 Crown Chakra</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const SpiritualPractices: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose practice" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="meditation">Meditation</SelectItem>
        <SelectItem value="tarot">Tarot Reading</SelectItem>
        <SelectItem value="crystal">Crystal Healing</SelectItem>
        <SelectItem value="astrology">Astrology</SelectItem>
        <SelectItem value="reiki">Reiki Energy Work</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const AuraLevels: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Aura level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="seeker">Seeker ✨</SelectItem>
        <SelectItem value="mystic">Mystic 🌟</SelectItem>
        <SelectItem value="sage">Sage 🔮</SelectItem>
        <SelectItem value="master">Master 👁️</SelectItem>
        <SelectItem value="ascended">Ascended 🌌</SelectItem>
      </SelectContent>
    </Select>
  ),
};