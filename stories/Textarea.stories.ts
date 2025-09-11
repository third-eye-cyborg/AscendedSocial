import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Textarea component for spiritual journaling and extended text input.',
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
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
};

export const SpiritualJournal: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="spiritual-journal" className="text-primary">
        ✨ Spiritual Journal Entry
      </Label>
      <Textarea 
        id="spiritual-journal" 
        placeholder="Share your spiritual insights, dreams, and experiences..."
        className="min-h-[120px] border-primary/30 focus:border-primary/50"
      />
      <p className="text-xs text-muted-foreground">
        Express your spiritual journey freely. This is your sacred space for reflection.
      </p>
    </div>
  ),
};

export const MeditationReflection: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meditation-notes" className="text-purple-400">
          🧘 Meditation Reflection
        </Label>
        <Textarea 
          id="meditation-notes" 
          placeholder="What insights came to you during meditation? How did you feel?"
          className="min-h-[100px] border-purple-500/30 focus:border-purple-500/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gratitude-list" className="text-green-400">
          🙏 Today's Gratitudes
        </Label>
        <Textarea 
          id="gratitude-list" 
          placeholder="List three things you're grateful for today..."
          className="min-h-[80px] border-green-500/30 focus:border-green-500/50"
        />
      </div>
    </div>
  ),
};

export const ChakraHealing: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chakra Healing Session Notes</h3>
      
      <div className="space-y-2">
        <Label htmlFor="chakra-focus" className="text-red-400">
          🔴 Root Chakra Work
        </Label>
        <Textarea 
          id="chakra-focus" 
          placeholder="Describe any sensations, visions, or insights during root chakra healing..."
          className="min-h-[80px] border-red-500/30 focus:border-red-500/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="energy-shifts" className="text-blue-400">
          ⚡ Energy Shifts Observed
        </Label>
        <Textarea 
          id="energy-shifts" 
          placeholder="Note any changes in energy, mood, or physical sensations..."
          className="min-h-[80px] border-blue-500/30 focus:border-blue-500/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="integration" className="text-purple-400">
          ✨ Integration & Next Steps
        </Label>
        <Textarea 
          id="integration" 
          placeholder="How will you integrate today's healing into your daily life?"
          className="min-h-[80px] border-purple-500/30 focus:border-purple-500/50"
        />
      </div>
    </div>
  ),
};

export const VisionBoard: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vision-title" className="text-accent">
          🎯 Vision Title
        </Label>
        <input 
          id="vision-title"
          className="w-full h-10 rounded-md border border-accent/30 bg-background px-3 py-2 text-sm focus:border-accent/50 focus:outline-none"
          placeholder="My spiritual manifestation goal..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vision-description" className="text-accent">
          📝 Vision Description
        </Label>
        <Textarea 
          id="vision-description" 
          placeholder="Describe your vision in detail. What does success look like? How will you feel when this manifests?"
          className="min-h-[120px] border-accent/30 focus:border-accent/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="action-steps" className="text-secondary">
          🚀 Action Steps
        </Label>
        <Textarea 
          id="action-steps" 
          placeholder="What concrete steps will you take to manifest this vision?"
          className="min-h-[100px] border-secondary/30 focus:border-secondary/50"
        />
      </div>
    </div>
  ),
};

