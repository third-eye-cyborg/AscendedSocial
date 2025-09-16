import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

const meta: Meta<typeof HoverCard> = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'For sighted users to preview spiritual content available behind a link.',
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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const SpiritualGuide: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="text-primary">@spiritual_guide</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar className="border-2 border-primary">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
            <AvatarFallback className="bg-primary/20 text-primary text-lg">✨</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <span className="text-lg">✨</span>
              @spiritual_guide
            </h4>
            <p className="text-sm">
              Spiritual mentor helping souls on their journey to enlightenment.
            </p>
            <div className="flex items-center pt-2 text-xs text-muted-foreground space-y-1">
              <div>Chakra: Crown • Energy Level: High</div>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-2 h-3 w-3 opacity-70" />
              <span>Guiding since 2020</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const ChakraProfile: Story = {
  render: () => (
    <div className="flex gap-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" className="text-red-400 border-red-500/30">
            🔴 @root_master
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex justify-between space-x-4">
            <Avatar className="border-2 border-red-500">
              <AvatarFallback className="bg-red-500/20 text-red-500">🔴</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-red-400">Root Chakra Master</h4>
              <p className="text-sm">
                Specializes in grounding techniques and earth-based healing practices.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Primary Chakra: Root (Muladhara)</div>
                <div>Element: Earth • Color: Red</div>
                <div>Expertise: Grounding, Security, Survival</div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline" className="text-green-400 border-green-500/30">
            🟢 @heart_healer
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex justify-between space-x-4">
            <Avatar className="border-2 border-green-500">
              <AvatarFallback className="bg-green-500/20 text-green-500">🟢</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-green-400">Heart Chakra Healer</h4>
              <p className="text-sm">
                Devoted to love, compassion, and emotional healing practices.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Primary Chakra: Heart (Anahata)</div>
                <div>Element: Air • Color: Green</div>
                <div>Expertise: Love, Compassion, Relationships</div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const EnergyLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Current Energy Status</h3>
      <div className="flex items-center gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <span className="text-sm">Energy Level:</span>
              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-semibold">Spiritual Energy: 75%</h4>
              <p className="text-sm text-muted-foreground">
                Your energy is flowing well today. Perfect for meditation and healing work.
              </p>
              <div className="text-xs text-muted-foreground">
                Last updated: 2 hours ago
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <span className="text-sm">Aura:</span>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-semibold">Aura Color: Blue</h4>
              <p className="text-sm text-muted-foreground">
                Peaceful and communicative energy. Strong throat chakra activation.
              </p>
              <div className="text-xs text-muted-foreground">
                Throat chakra is particularly active today
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

