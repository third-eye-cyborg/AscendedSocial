import type { Meta, StoryObj } from '@storybook/react';
import { SigilGenerator } from '@/components/SigilGenerator';

const meta = {
  title: 'Spiritual/SigilGenerator',
  component: SigilGenerator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SigilGenerator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIntention: Story = {
  render: (args) => (
    <div className="max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Create Your Personal Sigil</h3>
      <p className="text-sm text-muted-foreground">
        A sigil is a magical symbol created from your personal intention. 
        Enter your desire or goal, and we'll generate a unique spiritual symbol for you.
      </p>
      <SigilGenerator {...args} />
    </div>
  ),
};

export const ProcessDemo: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <div className="space-y-4">
        <h4 className="font-semibold">Step 1: Enter Intention</h4>
        <SigilGenerator {...args} />
      </div>
      <div className="space-y-4">
        <h4 className="font-semibold">Example Generated Sigil</h4>
        <div className="border rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">⫸ ◈ ⟐</div>
          <p className="text-sm text-muted-foreground">
            "I attract abundance and prosperity"
          </p>
        </div>
      </div>
    </div>
  ),
};