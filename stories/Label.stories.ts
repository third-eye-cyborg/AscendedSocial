import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Renders an accessible label for form controls with spiritual context.',
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
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="Enter your email" />
    </div>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="spiritual-name">Spiritual Name</Label>
        <Input id="spiritual-name" placeholder="Your spiritual name" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="meditation-goal">Meditation Goal (minutes)</Label>
        <Input id="meditation-goal" type="number" placeholder="20" />
      </div>
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="daily-meditation" />
        <Label htmlFor="daily-meditation">Daily meditation practice</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="energy-healing" />
        <Label htmlFor="energy-healing">Energy healing sessions</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="chakra-work" />
        <Label htmlFor="chakra-work">Chakra balancing work</Label>
      </div>
    </div>
  ),
};

export const SpiritualForm: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Spiritual Profile Setup</h3>
        
        <div className="space-y-2">
          <Label htmlFor="spiritual-path" className="text-primary">
            Primary Spiritual Path
          </Label>
          <Input id="spiritual-path" placeholder="e.g., Buddhism, Hinduism, Eclectic" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience-level" className="text-accent">
            Experience Level
          </Label>
          <select id="experience-level" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Master/Teacher</option>
          </select>
        </div>
        
        <div className="space-y-3">
          <Label className="text-secondary">Daily Practices</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="meditation-practice" />
              <Label htmlFor="meditation-practice">🧘 Meditation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="yoga-practice" />
              <Label htmlFor="yoga-practice">🤸 Yoga</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="prayer-practice" />
              <Label htmlFor="prayer-practice">🙏 Prayer</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ChakraLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chakra Focus Areas</h3>
      <RadioGroup defaultValue="heart">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="root" id="root-chakra" />
          <Label htmlFor="root-chakra" className="text-red-400 flex items-center gap-2">
            <span>🔴</span>
            Root Chakra - Grounding & Security
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sacral" id="sacral-chakra" />
          <Label htmlFor="sacral-chakra" className="text-orange-400 flex items-center gap-2">
            <span>🟠</span>
            Sacral Chakra - Creativity & Passion
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="heart" id="heart-chakra" />
          <Label htmlFor="heart-chakra" className="text-green-400 flex items-center gap-2">
            <span>🟢</span>
            Heart Chakra - Love & Compassion
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="crown" id="crown-chakra" />
          <Label htmlFor="crown-chakra" className="text-purple-400 flex items-center gap-2">
            <span>🟣</span>
            Crown Chakra - Spirituality & Unity
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const EnergySettings: Story = {
  render: () => (
    <div className="space-y-6 max-w-sm">
      <h3 className="text-lg font-semibold">Energy Preferences</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            ⚡ Daily Energy Goal
          </Label>
          <div className="text-xs text-muted-foreground">
            Set your target spiritual energy level for each day
          </div>
          <Input placeholder="80%" />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-accent">
            🌙 Moon Phase Notifications
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="new-moon" defaultChecked />
              <Label htmlFor="new-moon" className="text-sm">New Moon</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="full-moon" defaultChecked />
              <Label htmlFor="full-moon" className="text-sm">Full Moon</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-secondary">
            ✨ Spiritual Reminders
          </Label>
          <div className="text-xs text-muted-foreground">
            How often would you like spiritual practice reminders?
          </div>
          <select className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Never</option>
          </select>
        </div>
      </div>
    </div>
  ),
};

