import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@/components/ui/slider';
import * as React from 'react';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Slider for adjusting spiritual energy levels and meditation intensity.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cosmic text-white p-8 max-w-md">
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
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className="w-[60%]"
    />
  ),
};

export const WithSteps: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Volume</label>
        <Slider
          defaultValue={[33]}
          max={100}
          step={1}
          className="w-[60%]"
        />
      </div>
    </div>
  ),
};

export const EnergyLevel: Story = {
  render: () => {
    const [energyLevel, setEnergyLevel] = React.useState([75]);
    
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="text-lg">⚡</span>
            Spiritual Energy Level
          </label>
          <div className="mt-2">
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={100}
              step={5}
              className="w-[80%]"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              Current level: {energyLevel[0]}%
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const MeditationIntensity: Story = {
  render: () => {
    const [intensity, setIntensity] = React.useState([60]);
    
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="text-lg">🧘</span>
            Meditation Intensity
          </label>
          <div className="mt-2">
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={100}
              step={10}
              className="w-[80%]"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              Intensity: {intensity[0]}% - {
                intensity[0] <= 30 ? 'Gentle' :
                intensity[0] <= 60 ? 'Moderate' :
                intensity[0] <= 80 ? 'Deep' : 'Transcendent'
              }
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const ChakraBalance: Story = {
  render: () => {
    const [rootChakra, setRootChakra] = React.useState([70]);
    const [heartChakra, setHeartChakra] = React.useState([85]);
    const [crownChakra, setCrownChakra] = React.useState([60]);
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Chakra Balance Levels</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-red-400">
              <span>🔴</span>
              Root Chakra
            </label>
            <div className="mt-2">
              <Slider
                value={rootChakra}
                onValueChange={setRootChakra}
                max={100}
                step={5}
                className="w-[80%]"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Balance: {rootChakra[0]}%
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-green-400">
              <span>🟢</span>
              Heart Chakra
            </label>
            <div className="mt-2">
              <Slider
                value={heartChakra}
                onValueChange={setHeartChakra}
                max={100}
                step={5}
                className="w-[80%]"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Balance: {heartChakra[0]}%
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
              <span>🟣</span>
              Crown Chakra
            </label>
            <div className="mt-2">
              <Slider
                value={crownChakra}
                onValueChange={setCrownChakra}
                max={100}
                step={5}
                className="w-[80%]"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Balance: {crownChakra[0]}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

