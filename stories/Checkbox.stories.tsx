import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Checkbox component for spiritual practices and preferences.',
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
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept spiritual terms</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Meditation completed</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled" className="text-muted-foreground">
        Premium feature (upgrade required)
      </Label>
    </div>
  ),
};

export const SpiritualPractices: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Daily Spiritual Practices</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="meditation" defaultChecked />
          <Label htmlFor="meditation">🧘 Morning meditation (20 min)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="gratitude" />
          <Label htmlFor="gratitude">🙏 Gratitude journaling</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="chakra" defaultChecked />
          <Label htmlFor="chakra">⚡ Chakra energy work</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="affirmations" />
          <Label htmlFor="affirmations">✨ Daily affirmations</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="nature" />
          <Label htmlFor="nature">🌱 Connect with nature</Label>
        </div>
      </div>
    </div>
  ),
};

export const ChakraSelection: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Focus Chakras for Today</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="root" />
          <Label htmlFor="root" className="text-red-400">🔴 Root</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sacral" />
          <Label htmlFor="sacral" className="text-orange-400">🟠 Sacral</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="solar" defaultChecked />
          <Label htmlFor="solar" className="text-yellow-400">🟡 Solar</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="heart" defaultChecked />
          <Label htmlFor="heart" className="text-green-400">🟢 Heart</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="throat" />
          <Label htmlFor="throat" className="text-blue-400">🔵 Throat</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="third-eye" />
          <Label htmlFor="third-eye" className="text-indigo-400">🟣 Third Eye</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="crown" />
          <Label htmlFor="crown" className="text-purple-400">🟣 Crown</Label>
        </div>
      </div>
    </div>
  ),
};

