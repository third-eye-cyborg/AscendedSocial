import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getChakraColor } from "@/lib/chakras";

const chakraInfo = [
  {
    name: "Root",
    key: "root",
    emoji: "🔴",
    description: "Survival, grounding, material security, stability",
    topics: "Money, health, family, home, work, basic needs"
  },
  {
    name: "Sacral", 
    key: "sacral",
    emoji: "🟠",
    description: "Creativity, sexuality, emotional well-being, pleasure",
    topics: "Art, creativity, relationships, emotions, passion, joy"
  },
  {
    name: "Solar",
    key: "solar", 
    emoji: "🟡",
    description: "Personal power, confidence, willpower, self-esteem",
    topics: "Goals, ambition, leadership, confidence, success, motivation"
  },
  {
    name: "Heart",
    key: "heart",
    emoji: "💚", 
    description: "Love, compassion, relationships, emotional healing",
    topics: "Love, kindness, forgiveness, healing, community, connection"
  },
  {
    name: "Throat",
    key: "throat",
    emoji: "🔵",
    description: "Communication, truth, self-expression, authenticity", 
    topics: "Speaking truth, authentic expression, communication, honesty"
  },
  {
    name: "Third Eye",
    key: "third_eye",
    emoji: "🟣",
    description: "Intuition, wisdom, psychic abilities, inner vision",
    topics: "Intuition, dreams, visions, psychic experiences, inner knowing"
  },
  {
    name: "Crown", 
    key: "crown",
    emoji: "🟤",
    description: "Spirituality, enlightenment, divine connection, transcendence",
    topics: "Meditation, spirituality, enlightenment, divine connection, unity"
  }
];

interface ChakraLegendProps {
  compact?: boolean;
}

export default function ChakraLegend({ compact = false }: ChakraLegendProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {chakraInfo.map((chakra) => (
          <div
            key={chakra.key}
            className="flex items-center space-x-2 bg-cosmic-light/30 rounded-lg px-3 py-2 border border-primary/20"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getChakraColor(chakra.key) }}
            />
            <span className="text-sm font-medium text-white">
              {chakra.emoji} {chakra.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-cosmic-light/50 border-primary/30">
      <CardHeader>
        <CardTitle className="text-white font-display flex items-center space-x-2">
          <span>🔮 Chakra Energy Guide</span>
        </CardTitle>
        <p className="text-white/70 text-sm">
          Posts are automatically categorized by AI based on their spiritual energy signature
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {chakraInfo.map((chakra) => (
          <div key={chakra.key} className="space-y-2">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full animate-pulse"
                style={{ backgroundColor: getChakraColor(chakra.key) }}
              />
              <div className="flex items-center space-x-2">
                <span className="text-lg">{chakra.emoji}</span>
                <h4 className="font-semibold text-white">{chakra.name} Chakra</h4>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: getChakraColor(chakra.key) + '40',
                    color: getChakraColor(chakra.key)
                  }}
                >
                  {chakra.key}
                </Badge>
              </div>
            </div>
            
            <div className="ml-7 space-y-1">
              <p className="text-white/90 text-sm font-medium">
                {chakra.description}
              </p>
              <p className="text-white/60 text-xs">
                <span className="text-accent-light">Common topics:</span> {chakra.topics}
              </p>
            </div>
            
            {chakra.key !== "crown" && (
              <div className="ml-7 border-b border-primary/10" />
            )}
          </div>
        ))}
        
        <div className="mt-6 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-xs text-white/80 space-y-1">
            <div>🤖 <span className="font-medium">AI Classification:</span> Posts are analyzed for spiritual themes, emotional tone, and energy signature</div>
            <div>📊 <span className="font-medium">Frequency:</span> Calculated from upvotes, downvotes, likes, and energy transfers</div>
            <div>⚡ <span className="font-medium">Energy Impact:</span> Each energy point contributes +0.2 to frequency</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}