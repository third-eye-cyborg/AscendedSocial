import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A slider component for adjusting spiritual energy levels and preferences.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'object' },
    },
    max: {
      control: { type: 'number' },
    },
    min: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const EnergyLevel: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <Label>Spiritual Energy Level</Label>
        <Slider defaultValue={[75]} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Balanced</span>
          <span>High</span>
        </div>
      </div>
    </div>
  ),
};

export const ChakraAlignment: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <h3 className="font-semibold">Chakra Alignment Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            🔴 Root Chakra
          </Label>
          <Slider defaultValue={[60]} max={100} step={5} />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            🟠 Sacral Chakra
          </Label>
          <Slider defaultValue={[45]} max={100} step={5} />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            🟡 Solar Plexus
          </Label>
          <Slider defaultValue={[80]} max={100} step={5} />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            💚 Heart Chakra
          </Label>
          <Slider defaultValue={[90]} max={100} step={5} />
        </div>
      </div>
    </div>
  ),
};

export const AuraIntensity: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <div className="space-y-2">
        <Label>Aura Intensity</Label>
        <Slider defaultValue={[65]} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>✨ Dim</span>
          <span>🌟 Glowing</span>
          <span>💫 Radiant</span>
          <span>⭐ Luminous</span>
        </div>
      </div>
    </div>
  ),
};

export const MeditationTimer: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <Label>Meditation Duration (minutes)</Label>
        <Slider defaultValue={[20]} max={120} min={5} step={5} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5 min</span>
          <span>60 min</span>
          <span>120 min</span>
        </div>
      </div>
    </div>
  ),
};