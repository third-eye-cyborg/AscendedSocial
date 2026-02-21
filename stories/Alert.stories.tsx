import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays important messages with different variants and spiritual context.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cosmic text-white p-4 min-h-[200px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Spiritual Insight</AlertTitle>
      <AlertDescription>
        Your chakras are aligned today. Perfect time for meditation and spiritual growth.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Energy Imbalance</AlertTitle>
      <AlertDescription>
        Your spiritual energy seems low. Consider taking time for self-care and grounding.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert className="border-green-500 bg-green-500/10 text-green-500">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Spiritual Achievement!</AlertTitle>
      <AlertDescription>
        Congratulations! You've completed your 30-day meditation challenge.
      </AlertDescription>
    </Alert>
  ),
};

export const ChakraWarning: Story = {
  render: () => (
    <Alert className="border-yellow-500 bg-yellow-500/10 text-yellow-500">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Chakra Attention Needed</AlertTitle>
      <AlertDescription>
        Your root chakra needs attention. Focus on grounding exercises and connection with nature.
      </AlertDescription>
    </Alert>
  ),
};

export const SpiritualGuidance: Story = {
  render: () => (
    <Alert className="border-primary bg-primary/10 text-primary">
      <div className="text-2xl">✨</div>
      <AlertTitle>Daily Spiritual Guidance</AlertTitle>
      <AlertDescription>
        Today's energy supports transformation and growth. Embrace change with an open heart.
      </AlertDescription>
    </Alert>
  ),
};

