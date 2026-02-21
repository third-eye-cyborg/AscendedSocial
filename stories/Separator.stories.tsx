import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@/components/ui/separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Visually or semantically separates content with spiritual styling.',
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
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const SpiritualSections: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🧘</span>
          Daily Practices
        </h3>
        <p className="text-sm text-muted-foreground">
          Your spiritual routine for today
        </p>
      </div>
      
      <Separator className="bg-primary/30" />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>⚡</span>
          Energy Status
        </h3>
        <p className="text-sm text-muted-foreground">
          Current chakra alignment and energy levels
        </p>
      </div>
      
      <Separator className="bg-accent/30" />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🌙</span>
          Moon Phase Guidance
        </h3>
        <p className="text-sm text-muted-foreground">
          Spiritual insights based on lunar cycles
        </p>
      </div>
    </div>
  ),
};

export const ChakraMenu: Story = {
  render: () => (
    <div className="flex h-8 items-center space-x-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="text-red-500">🔴</span>
        <span>Root</span>
      </div>
      <Separator orientation="vertical" className="bg-red-500/30" />
      
      <div className="flex items-center gap-1">
        <span className="text-orange-500">🟠</span>
        <span>Sacral</span>
      </div>
      <Separator orientation="vertical" className="bg-orange-500/30" />
      
      <div className="flex items-center gap-1">
        <span className="text-green-500">🟢</span>
        <span>Heart</span>
      </div>
      <Separator orientation="vertical" className="bg-green-500/30" />
      
      <div className="flex items-center gap-1">
        <span className="text-purple-500">🟣</span>
        <span>Crown</span>
      </div>
    </div>
  ),
};

export const SpiritualCard: Story = {
  render: () => (
    <div className="max-w-md space-y-4 p-6 border border-primary/20 rounded-lg bg-primary/5">
      <div className="space-y-1">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <span>✨</span>
          Today's Spiritual Insight
        </h4>
        <p className="text-sm text-muted-foreground">
          Your personalized guidance for spiritual growth
        </p>
      </div>
      
      <Separator className="bg-primary/20" />
      
      <div className="space-y-3">
        <p className="text-sm italic">
          "The path to enlightenment is found in the present moment. 
          Embrace what is, and let your inner light guide the way."
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Chakra Focus: Crown</span>
          <span>Energy: High</span>
        </div>
      </div>
      
      <Separator className="bg-primary/20" />
      
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center gap-1">
          <span>🧘</span>
          <span>Meditate</span>
        </div>
        <Separator orientation="vertical" className="bg-primary/30" />
        
        <div className="flex items-center gap-1">
          <span>🙏</span>
          <span>Reflect</span>
        </div>
        <Separator orientation="vertical" className="bg-primary/30" />
        
        <div className="flex items-center gap-1">
          <span>✨</span>
          <span>Share</span>
        </div>
      </div>
    </div>
  ),
};

