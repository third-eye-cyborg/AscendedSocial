import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays spiritual content within a desired ratio.',
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
  argTypes: {
    ratio: { control: { type: 'number', min: 0.1, max: 5, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AspectRatio ratio={16 / 9} {...args} className="bg-muted rounded-md overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Sacred mountain landscape"
        className="object-cover w-full h-full"
      />
    </AspectRatio>
  ),
};

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&dpr=2&q=80"
        alt="Sacred mountain meditation"
        className="object-cover w-full h-full"
      />
    </AspectRatio>
  ),
};

export const Portrait: Story = {
  render: () => (
    <AspectRatio ratio={3 / 4} className="bg-muted rounded-md overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&dpr=2&q=80"
        alt="Meditation space"
        className="object-cover w-full h-full"
      />
    </AspectRatio>
  ),
};

export const SpiritualGallery: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Spiritual Gallery</h3>
      <div className="grid grid-cols-2 gap-4">
        <AspectRatio ratio={1} className="bg-primary/10 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-full text-6xl">
            ✨
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-secondary/10 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-full text-6xl">
            🧘
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-accent/10 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-full text-6xl">
            🔮
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-muted/20 rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-full text-6xl">
            🌙
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

export const ChakraVisualizer: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chakra Energy Visualizer</h3>
      <div className="grid grid-cols-3 gap-3">
        <AspectRatio ratio={1} className="bg-red-500/20 rounded-full overflow-hidden border-2 border-red-500/30">
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <div className="text-3xl">🔴</div>
            <div className="text-xs">Root</div>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-green-500/20 rounded-full overflow-hidden border-2 border-green-500/30">
          <div className="flex flex-col items-center justify-center h-full text-green-400">
            <div className="text-3xl">🟢</div>
            <div className="text-xs">Heart</div>
          </div>
        </AspectRatio>
        <AspectRatio ratio={1} className="bg-purple-500/20 rounded-full overflow-hidden border-2 border-purple-500/30">
          <div className="flex flex-col items-center justify-center h-full text-purple-400">
            <div className="text-3xl">🟣</div>
            <div className="text-xs">Crown</div>
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

