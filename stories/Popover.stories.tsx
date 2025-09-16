import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays rich spiritual content in a portal, triggered by a button.',
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const SpiritualInsights: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <span className="mr-2">✨</span>
          Daily Insights
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2">
              <span className="text-lg">🔮</span>
              Today's Spiritual Guidance
            </h4>
            <p className="text-sm text-muted-foreground">
              Your personalized spiritual insights for today.
            </p>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-sm">
                "Today, focus on your heart chakra. Practice compassion and love in all your interactions."
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Chakra Focus: Heart • Energy Level: Balanced
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const ChakraDetails: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            Root
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-red-400">Root Chakra (Muladhara)</h4>
              <p className="text-sm text-muted-foreground">
                Foundation of your spiritual energy system
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Element</Label>
                <p className="text-sm">Earth</p>
              </div>
              <div>
                <Label className="text-xs">Location</Label>
                <p className="text-sm">Base of spine</p>
              </div>
              <div>
                <Label className="text-xs">Affirmation</Label>
                <p className="text-sm italic">"I am safe, secure, and grounded"</p>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            Heart
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-green-400">Heart Chakra (Anahata)</h4>
              <p className="text-sm text-muted-foreground">
                Center of love and compassion
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Element</Label>
                <p className="text-sm">Air</p>
              </div>
              <div>
                <Label className="text-xs">Location</Label>
                <p className="text-sm">Center of chest</p>
              </div>
              <div>
                <Label className="text-xs">Affirmation</Label>
                <p className="text-sm italic">"I give and receive love freely"</p>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const MeditationGuide: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <span className="mr-2">🧘</span>
          Start Meditation
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Guided Meditation Session</h4>
            <p className="text-sm text-muted-foreground">
              Choose your meditation style and duration
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="duration">Duration</Label>
              <select className="col-span-2 h-8 rounded border bg-background px-3 text-sm">
                <option>5 minutes</option>
                <option>10 minutes</option>
                <option>20 minutes</option>
                <option>30 minutes</option>
              </select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="style">Style</Label>
              <select className="col-span-2 h-8 rounded border bg-background px-3 text-sm">
                <option>Mindfulness</option>
                <option>Loving-kindness</option>
                <option>Body scan</option>
                <option>Breath focus</option>
              </select>
            </div>
          </div>
          <Button className="w-full">
            Begin Session
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

