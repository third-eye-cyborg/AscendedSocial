import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const meta: Meta<typeof InputOTP> = {
  title: 'UI/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible one-time password component for spiritual authentication.',
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
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <div className="text-muted-foreground">-</div>
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const SpiritualCode: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>🔮</span>
        Enter Your Spiritual Access Code
      </h3>
      <p className="text-sm text-muted-foreground">
        Please enter the 6-digit code sent to your spiritual email
      </p>
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <div className="text-primary">✨</div>
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground">
        This code helps protect your spiritual journey and personal insights
      </p>
    </div>
  ),
};

export const ChakraUnlock: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>⚡</span>
        Unlock Advanced Chakra Features
      </h3>
      <p className="text-sm text-muted-foreground">
        Enter the chakra sequence to access premium spiritual tools
      </p>
      <InputOTP maxLength={7}>
        <InputOTPGroup>
          <InputOTPSlot index={0} className="border-red-500/30" />
          <InputOTPSlot index={1} className="border-orange-500/30" />
          <InputOTPSlot index={2} className="border-yellow-500/30" />
          <InputOTPSlot index={3} className="border-green-500/30" />
          <InputOTPSlot index={4} className="border-blue-500/30" />
          <InputOTPSlot index={5} className="border-indigo-500/30" />
          <InputOTPSlot index={6} className="border-purple-500/30" />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex justify-center gap-1 text-xs">
        <span className="text-red-400">🔴</span>
        <span className="text-orange-400">🟠</span>
        <span className="text-yellow-400">🟡</span>
        <span className="text-green-400">🟢</span>
        <span className="text-blue-400">🔵</span>
        <span className="text-indigo-400">🟣</span>
        <span className="text-purple-400">🟣</span>
      </div>
    </div>
  ),
};

export const MeditationTimer: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>🧘</span>
        Set Meditation Duration
      </h3>
      <p className="text-sm text-muted-foreground">
        Enter minutes for your meditation session (up to 99)
      </p>
      <InputOTP maxLength={2}>
        <InputOTPGroup>
          <InputOTPSlot index={0} className="w-16 h-16 text-xl" />
          <InputOTPSlot index={1} className="w-16 h-16 text-xl" />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground text-center">
        Recommended: 20 minutes for beginners, 45+ for advanced practitioners
      </p>
    </div>
  ),
};

