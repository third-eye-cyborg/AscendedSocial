import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An accordion component for organizing collapsible spiritual content and FAQ sections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is spiritual awakening?</AccordionTrigger>
        <AccordionContent>
          Spiritual awakening is a profound shift in consciousness where one begins to question the nature of reality and seeks deeper meaning in life.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do chakras work?</AccordionTrigger>
        <AccordionContent>
          Chakras are energy centers in the body that correspond to different aspects of physical, emotional, and spiritual well-being. Balancing them promotes harmony.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What is the oracle system?</AccordionTrigger>
        <AccordionContent>
          Our AI-powered oracle provides personalized spiritual guidance based on your journey, combining ancient wisdom with modern insights.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const ChakraGuide: Story = {
  args: {},
  render: () => (
    <Accordion type="multiple" className="w-[500px]">
      <AccordionItem value="root">
        <AccordionTrigger>🔴 Root Chakra (Muladhara)</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Location:</strong> Base of spine</p>
            <p><strong>Element:</strong> Earth</p>
            <p><strong>Purpose:</strong> Grounding, survival, stability</p>
            <p><strong>Balanced:</strong> Feeling secure and grounded</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sacral">
        <AccordionTrigger>🟠 Sacral Chakra (Svadhisthana)</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Location:</strong> Lower abdomen</p>
            <p><strong>Element:</strong> Water</p>
            <p><strong>Purpose:</strong> Creativity, sexuality, emotions</p>
            <p><strong>Balanced:</strong> Creative and emotionally stable</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="solar">
        <AccordionTrigger>🟡 Solar Plexus (Manipura)</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Location:</strong> Upper abdomen</p>
            <p><strong>Element:</strong> Fire</p>
            <p><strong>Purpose:</strong> Personal power, confidence</p>
            <p><strong>Balanced:</strong> Confident and purposeful</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="heart">
        <AccordionTrigger>💚 Heart Chakra (Anahata)</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Location:</strong> Center of chest</p>
            <p><strong>Element:</strong> Air</p>
            <p><strong>Purpose:</strong> Love, compassion, connection</p>
            <p><strong>Balanced:</strong> Loving and compassionate</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};