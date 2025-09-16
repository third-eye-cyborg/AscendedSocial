import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Augments native scroll functionality for custom, cross-browser styling.',
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
    <ScrollArea className="h-72 w-48 rounded-md border p-4">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>
            <div className="text-sm">Tag {i + 1}</div>
            {i !== 49 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const SpiritualTexts: Story = {
  render: () => (
    <ScrollArea className="h-80 w-72 rounded-md border border-primary/20 p-4">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none flex items-center gap-2">
          <span>📜</span>
          Sacred Texts & Wisdom
        </h4>
        {[
          { title: "🧘 Meditation Practices", content: "Daily mindfulness and breath awareness" },
          { title: "🙏 Prayer & Mantras", content: "Sacred sounds and spiritual invocations" },
          { title: "⚡ Energy Healing", content: "Reiki, chakra balancing, and aura cleansing" },
          { title: "🌱 Nature Spirituality", content: "Earth-based practices and seasonal rituals" },
          { title: "🔮 Divination Arts", content: "Tarot, oracle cards, and intuitive readings" },
          { title: "✨ Manifestation", content: "Law of attraction and conscious creation" },
          { title: "🌙 Moon Magic", content: "Lunar cycles and celestial influences" },
          { title: "💎 Crystal Healing", content: "Gemstone therapy and mineral wisdom" },
          { title: "🕯️ Sacred Rituals", content: "Ceremonial practices and spiritual rites" },
          { title: "📿 Spiritual Tools", content: "Malas, singing bowls, and sacred objects" },
        ].map((item, i) => (
          <div key={i}>
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.content}</div>
            {i !== 9 && <Separator className="my-3 bg-primary/10" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const ChakraGuide: Story = {
  render: () => (
    <ScrollArea className="h-96 w-80 rounded-md border border-purple-500/20 p-4">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none flex items-center gap-2">
          <span>🌈</span>
          Complete Chakra Guide
        </h4>
        {[
          { 
            chakra: "🔴 Root Chakra", 
            name: "Muladhara", 
            color: "text-red-400",
            description: "Foundation chakra governing survival, grounding, and material security. Located at the base of the spine.",
            element: "Earth",
            affirmation: "I am safe, secure, and grounded in my being."
          },
          { 
            chakra: "🟠 Sacral Chakra", 
            name: "Svadhisthana", 
            color: "text-orange-400",
            description: "Creativity and sexuality chakra governing emotions, pleasure, and relationships. Located below the navel.",
            element: "Water",
            affirmation: "I embrace my creativity and honor my emotions."
          },
          { 
            chakra: "🟡 Solar Plexus", 
            name: "Manipura", 
            color: "text-yellow-400",
            description: "Personal power chakra governing confidence, willpower, and self-esteem. Located above the navel.",
            element: "Fire",
            affirmation: "I am confident and empowered in my choices."
          },
          { 
            chakra: "🟢 Heart Chakra", 
            name: "Anahata", 
            color: "text-green-400",
            description: "Love chakra governing compassion, relationships, and emotional healing. Located at the center of the chest.",
            element: "Air",
            affirmation: "I give and receive love unconditionally."
          },
          { 
            chakra: "🔵 Throat Chakra", 
            name: "Vishuddha", 
            color: "text-blue-400",
            description: "Communication chakra governing truth, self-expression, and authenticity. Located at the throat.",
            element: "Sound",
            affirmation: "I speak my truth with clarity and compassion."
          },
          { 
            chakra: "🟣 Third Eye", 
            name: "Ajna", 
            color: "text-indigo-400",
            description: "Intuition chakra governing wisdom, psychic abilities, and inner vision. Located between the eyebrows.",
            element: "Light",
            affirmation: "I trust my intuition and inner wisdom."
          },
          { 
            chakra: "🟣 Crown Chakra", 
            name: "Sahasrara", 
            color: "text-purple-400",
            description: "Spiritual chakra governing enlightenment, divine connection, and transcendence. Located at the top of the head.",
            element: "Thought",
            affirmation: "I am connected to the divine source of all creation."
          },
        ].map((item, i) => (
          <div key={i} className="mb-6">
            <div className={`text-sm font-medium ${item.color}`}>{item.chakra}</div>
            <div className="text-xs text-muted-foreground italic mb-2">({item.name})</div>
            <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
            <div className="text-xs">
              <strong>Element:</strong> {item.element}
            </div>
            <div className="text-xs italic mt-1 text-primary/70">
              "{item.affirmation}"
            </div>
            {i !== 6 && <Separator className="my-4 bg-primary/10" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const MeditationLog: Story = {
  render: () => (
    <ScrollArea className="h-64 w-96 rounded-md border border-blue-500/20 p-4">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none flex items-center gap-2">
          <span>🧘</span>
          Recent Meditation Sessions
        </h4>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium">
                  Session {15 - i} - {['Mindfulness', 'Loving-kindness', 'Body scan', 'Breath focus'][i % 4]}
                </div>
                <div className="text-xs text-muted-foreground">
                  {20 + (i % 3) * 10} minutes • {['Peaceful', 'Transformative', 'Grounding', 'Uplifting'][i % 4]}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {i + 1}d ago
              </div>
            </div>
            {i !== 14 && <Separator className="my-3 bg-blue-500/10" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

