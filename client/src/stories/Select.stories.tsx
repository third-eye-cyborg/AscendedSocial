import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A select component for choosing options in the spiritual social platform.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a chakra" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="root">🔴 Root Chakra</SelectItem>
        <SelectItem value="sacral">🟠 Sacral Chakra</SelectItem>
        <SelectItem value="solar">🟡 Solar Plexus</SelectItem>
        <SelectItem value="heart">💚 Heart Chakra</SelectItem>
        <SelectItem value="throat">🔵 Throat Chakra</SelectItem>
        <SelectItem value="third-eye">🟣 Third Eye</SelectItem>
        <SelectItem value="crown">🤍 Crown Chakra</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="aura-level">Aura Level</Label>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Choose your aura level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dim">✨ Dim</SelectItem>
          <SelectItem value="glowing">🌟 Glowing</SelectItem>
          <SelectItem value="radiant">💫 Radiant</SelectItem>
          <SelectItem value="luminous">⭐ Luminous</SelectItem>
          <SelectItem value="transcendent">🌠 Transcendent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const SpiritualPractice: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="practice">Primary Spiritual Practice</Label>
      <Select>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select your practice" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="meditation">🧘 Meditation</SelectItem>
          <SelectItem value="yoga">🕉️ Yoga</SelectItem>
          <SelectItem value="crystal-healing">💎 Crystal Healing</SelectItem>
          <SelectItem value="tarot">🔮 Tarot Reading</SelectItem>
          <SelectItem value="astrology">⭐ Astrology</SelectItem>
          <SelectItem value="energy-work">⚡ Energy Work</SelectItem>
          <SelectItem value="shamanism">🦅 Shamanism</SelectItem>
          <SelectItem value="herbalism">🌿 Herbalism</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const ZodiacSign: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="zodiac">Zodiac Sign</Label>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Your sign" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aries">♈ Aries</SelectItem>
          <SelectItem value="taurus">♉ Taurus</SelectItem>
          <SelectItem value="gemini">♊ Gemini</SelectItem>
          <SelectItem value="cancer">♋ Cancer</SelectItem>
          <SelectItem value="leo">♌ Leo</SelectItem>
          <SelectItem value="virgo">♍ Virgo</SelectItem>
          <SelectItem value="libra">♎ Libra</SelectItem>
          <SelectItem value="scorpio">♏ Scorpio</SelectItem>
          <SelectItem value="sagittarius">♐ Sagittarius</SelectItem>
          <SelectItem value="capricorn">♑ Capricorn</SelectItem>
          <SelectItem value="aquarius">♒ Aquarius</SelectItem>
          <SelectItem value="pisces">♓ Pisces</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const PostCategory: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="category">Post Category</Label>
      <Select>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Categorize your post" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vision">🌌 Vision</SelectItem>
          <SelectItem value="spark">✨ Spark</SelectItem>
          <SelectItem value="wisdom">🦉 Wisdom</SelectItem>
          <SelectItem value="healing">💚 Healing</SelectItem>
          <SelectItem value="divination">🔮 Divination</SelectItem>
          <SelectItem value="ritual">🕯️ Ritual</SelectItem>
          <SelectItem value="nature">🌿 Nature</SelectItem>
          <SelectItem value="cosmic">🌟 Cosmic</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};