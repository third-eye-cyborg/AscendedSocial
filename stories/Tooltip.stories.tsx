import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popup that displays spiritual guidance and information on hover.',
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="bg-cosmic text-white p-8">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a helpful tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const ChakraGuidance: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="text-lg">🔴</span>
            Root Chakra
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">Root Chakra (Muladhara)</p>
            <p className="text-sm">Grounding, survival, material security</p>
          </div>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="text-lg">🟢</span>
            Heart Chakra
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">Heart Chakra (Anahata)</p>
            <p className="text-sm">Love, compassion, relationships</p>
          </div>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="text-lg">🟣</span>
            Crown Chakra
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">Crown Chakra (Sahasrara)</p>
            <p className="text-sm">Spirituality, enlightenment, divine connection</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const SpiritualPractices: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="h-16 w-16 text-2xl" variant="outline">
            🧘
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-semibold">Meditation</p>
            <p className="text-sm">Daily mindfulness practice</p>
            <p className="text-xs text-muted-foreground">20 minutes recommended</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="h-16 w-16 text-2xl" variant="outline">
            🙏
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-semibold">Gratitude</p>
            <p className="text-sm">Express thankfulness daily</p>
            <p className="text-xs text-muted-foreground">Journal or mental practice</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="h-16 w-16 text-2xl" variant="outline">
            ⚡
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-semibold">Energy Work</p>
            <p className="text-sm">Balance your spiritual energy</p>
            <p className="text-xs text-muted-foreground">Reiki, chakra alignment</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="h-16 w-16 text-2xl" variant="outline">
            🌱
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-semibold">Nature Connection</p>
            <p className="text-sm">Connect with natural world</p>
            <p className="text-xs text-muted-foreground">Forest bathing, grounding</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const EnergyLevels: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className="text-sm">Energy Level:</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-semibold">Spiritual Energy: 75%</p>
            <p className="text-sm">Your energy is flowing well today</p>
            <p className="text-xs text-muted-foreground">Perfect for meditation and healing work</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className="text-sm">Aura:</span>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-semibold">Aura Color: Blue</p>
            <p className="text-sm">Peaceful and communicative</p>
            <p className="text-xs text-muted-foreground">Strong throat chakra energy</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

