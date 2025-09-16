import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An interactive component which expands/collapses spiritual content.',
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
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const SpiritualPractices: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-lg">✨</span>
            Daily Spiritual Practices
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border border-primary/20 px-4 py-3 text-sm">
          🧘 Morning Meditation - 20 minutes
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border border-primary/20 px-4 py-3 text-sm">
            🙏 Gratitude Practice - 5 minutes
          </div>
          <div className="rounded-md border border-primary/20 px-4 py-3 text-sm">
            ⚡ Chakra Alignment - 15 minutes
          </div>
          <div className="rounded-md border border-primary/20 px-4 py-3 text-sm">
            🌱 Nature Connection - 30 minutes
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const ChakraDetails: Story = {
  render: () => {
    const [rootOpen, setRootOpen] = React.useState(true);
    const [heartOpen, setHeartOpen] = React.useState(false);
    
    return (
      <div className="space-y-4">
        <Collapsible open={rootOpen} onOpenChange={setRootOpen} className="w-full space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-red-400">
              <span>🔴</span>
              Root Chakra (Muladhara)
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border border-red-500/20 px-4 py-3 text-sm">
            Located at the base of the spine
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border border-red-500/20 px-4 py-3 text-sm">
              <strong>Element:</strong> Earth
            </div>
            <div className="rounded-md border border-red-500/20 px-4 py-3 text-sm">
              <strong>Affirmation:</strong> "I am safe and secure"
            </div>
            <div className="rounded-md border border-red-500/20 px-4 py-3 text-sm">
              <strong>Healing:</strong> Grounding exercises, red foods
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={heartOpen} onOpenChange={setHeartOpen} className="w-full space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-green-400">
              <span>🟢</span>
              Heart Chakra (Anahata)
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border border-green-500/20 px-4 py-3 text-sm">
            Located at the center of the chest
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border border-green-500/20 px-4 py-3 text-sm">
              <strong>Element:</strong> Air
            </div>
            <div className="rounded-md border border-green-500/20 px-4 py-3 text-sm">
              <strong>Affirmation:</strong> "I give and receive love freely"
            </div>
            <div className="rounded-md border border-green-500/20 px-4 py-3 text-sm">
              <strong>Healing:</strong> Heart-opening yoga, green foods
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

export const MoonPhaseGuide: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-lg">🌙</span>
            Moon Phase Spiritual Guide
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border border-purple-500/20 px-4 py-3 text-sm">
          🌕 Full Moon - Peak manifestation energy
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border border-purple-500/20 px-4 py-3 text-sm">
            🌑 New Moon - Perfect for setting intentions
          </div>
          <div className="rounded-md border border-purple-500/20 px-4 py-3 text-sm">
            🌓 Waxing Moon - Building energy and growth
          </div>
          <div className="rounded-md border border-purple-500/20 px-4 py-3 text-sm">
            🌗 Waning Moon - Release and letting go
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

