import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpiritualFAQ: Story = {
  render: (args) => (
    <Accordion {...args} type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="chakras">
        <AccordionTrigger>What are chakras?</AccordionTrigger>
        <AccordionContent>
          Chakras are energy centers within the human body that correspond to different aspects of our physical, emotional, and spiritual well-being. There are seven main chakras, each associated with specific colors, elements, and life themes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="meditation">
        <AccordionTrigger>How do I start meditating?</AccordionTrigger>
        <AccordionContent>
          Begin with just 5-10 minutes daily. Find a quiet space, sit comfortably, and focus on your breath. Let thoughts come and go without judgment. Consistency is more important than duration when starting your practice.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="energy">
        <AccordionTrigger>What is energy sharing?</AccordionTrigger>
        <AccordionContent>
          Energy sharing is a way to send positive vibrations and support to other community members. When you share energy with someone's post, you're offering spiritual encouragement and amplifying their message.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const ChakraGuide: Story = {
  render: (args) => (
    <Accordion {...args} type="multiple" className="w-full max-w-md">
      <AccordionItem value="root">
        <AccordionTrigger>🔴 Root Chakra</AccordionTrigger>
        <AccordionContent>
          Located at the base of the spine, the root chakra represents grounding, survival, and connection to Earth energy.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="sacral">
        <AccordionTrigger>🟠 Sacral Chakra</AccordionTrigger>
        <AccordionContent>
          The sacral chakra governs creativity, sexuality, and emotional expression. It's associated with the color orange and water element.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="solar">
        <AccordionTrigger>🟡 Solar Plexus</AccordionTrigger>
        <AccordionContent>
          Your personal power center, the solar plexus chakra relates to confidence, self-esteem, and inner fire.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};