import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays badges with spiritual chakra colors and various variants.',
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
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Spiritual',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const ChakraBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-red-500 hover:bg-red-500/80">🔴 Root</Badge>
      <Badge className="bg-orange-500 hover:bg-orange-500/80">🟠 Sacral</Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-500/80 text-black">🟡 Solar</Badge>
      <Badge className="bg-green-500 hover:bg-green-500/80">🟢 Heart</Badge>
      <Badge className="bg-blue-500 hover:bg-blue-500/80">🔵 Throat</Badge>
      <Badge className="bg-indigo-500 hover:bg-indigo-500/80">🟣 Third Eye</Badge>
      <Badge className="bg-purple-500 hover:bg-purple-500/80">🟣 Crown</Badge>
    </div>
  ),
};

export const SpiritualLevels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-primary/20 text-primary border-primary/30">✨ Beginner</Badge>
      <Badge className="bg-accent/20 text-accent border-accent/30">🧘 Intermediate</Badge>
      <Badge className="bg-secondary/20 text-secondary border-secondary/30">🔮 Advanced</Badge>
      <Badge className="bg-gradient-to-r from-primary to-accent text-white">⭐ Master</Badge>
    </div>
  ),
};

export const EnergyLevels: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Energy Level:</span>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">High</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Aura Status:</span>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Balanced</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Spiritual Growth:</span>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Ascending</Badge>
      </div>
    </div>
  ),
};

