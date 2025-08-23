import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Calendar, Zap } from "lucide-react";
import type { Spirit } from "@shared/schema";

interface SpiritAvatarProps {
  userId?: string;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SpiritAvatar({ userId, showDetails = true, size = "md" }: SpiritAvatarProps) {
  const [showEvolution, setShowEvolution] = useState(false);

  const { data: spirit, isLoading } = useQuery<Spirit | null>({
    queryKey: ["/api/spirit"],
    enabled: !!userId,
  });

  const getSpiritVisual = (level: number, element: string) => {
    const baseStyle = {
      sm: "w-12 h-12 text-2xl",
      md: "w-20 h-20 text-4xl", 
      lg: "w-32 h-32 text-6xl"
    }[size];

    const levelTier = Math.floor((level - 1) / 5) + 1; // Tiers: 1-5, 6-10, 11-15, etc.
    
    // Element-based base symbols with more mystical options
    const elementSymbols = {
      fire: ["🔥", "🌋", "⭐", "☀️", "💫"],
      water: ["💧", "🌊", "🔮", "🌙", "✨"],
      earth: ["🌱", "🌳", "🏔️", "💎", "🗿"],
      air: ["💨", "🦅", "⚡", "🌟", "🌈"]
    };

    const symbols = elementSymbols[element as keyof typeof elementSymbols] || elementSymbols.fire;
    const symbol = symbols[Math.min(levelTier - 1, symbols.length - 1)];

    const glowIntensity = Math.min(level * 3, 100);
    
    // Element-based color schemes
    const elementColors = {
      fire: { primary: "251, 146, 60", secondary: "239, 68, 68" }, // Orange to red
      water: { primary: "59, 130, 246", secondary: "147, 51, 234" }, // Blue to purple
      earth: { primary: "34, 197, 94", secondary: "168, 85, 247" }, // Green to purple
      air: { primary: "168, 85, 247", secondary: "59, 130, 246" }  // Purple to blue
    };
    
    const colors = elementColors[element as keyof typeof elementColors] || elementColors.air;
    
    return (
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={`${baseStyle} absolute inset-0 rounded-full animate-pulse`}
          style={{
            background: `radial-gradient(circle, rgba(${colors.primary}, 0.2) 0%, transparent 70%)`,
            filter: `blur(${size === 'lg' ? '20px' : '10px'})`,
          }}
        />
        
        {/* Main avatar */}
        <div 
          className={`${baseStyle} rounded-full flex items-center justify-center relative bg-gradient-to-br shadow-2xl`}
          style={{
            background: `linear-gradient(135deg, rgba(${colors.primary}, 0.3) 0%, rgba(${colors.secondary}, 0.2) 100%)`,
            boxShadow: `
              0 0 ${Math.min(level * 3, 30)}px rgba(${colors.primary}, 0.4),
              inset 0 0 20px rgba(${colors.primary}, 0.2)
            `,
            border: `3px solid rgba(${colors.primary}, 0.4)`,
            backdropFilter: 'blur(10px)',
          }}
          data-testid={`spirit-avatar-${level}`}
        >
          <span className="drop-shadow-2xl filter brightness-110">{symbol}</span>
          
          {/* Level indicator */}
          {level > 5 && (
            <div 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, rgba(${colors.primary}, 0.9) 0%, rgba(${colors.secondary}, 0.9) 100%)`,
              }}
            >
              <span className="text-xs text-white font-bold">{levelTier}</span>
            </div>
          )}
          
          {/* Sparkle effects for higher levels */}
          {level > 10 && (
            <>
              <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute bottom-1/4 right-0 w-1 h-1 bg-white rounded-full animate-ping animation-delay-200" />
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping animation-delay-400" />
            </>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-cosmic-light/30 rounded-lg ${size === 'lg' ? 'h-32' : size === 'md' ? 'h-20' : 'h-12'}`}>
        <div className="h-full bg-primary/20 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!spirit) return null;

  const experienceToNextLevel = ((Math.floor((spirit.experience || 0) / 100) + 1) * 100) - (spirit.experience || 0);
  const progressInCurrentLevel = (spirit.experience || 0) % 100;

  return (
    <div className="space-y-4" data-testid="spirit-avatar-container">
      <div className="flex items-center space-x-4">
        {getSpiritVisual(spirit.level || 1, spirit.element || 'fire')}
        
        {showDetails && (
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white" data-testid="spirit-name">
                {spirit.name || 'Unnamed Spirit'}
              </h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary-light">
                Level {spirit.level || 1}
              </Badge>
              <Badge variant="outline" className="border-accent-light/30 text-accent-light capitalize">
                {spirit.element || 'fire'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Experience: {spirit.experience || 0} XP</span>
                <span>{experienceToNextLevel} XP to level {(spirit.level || 1) + 1}</span>
              </div>
              <Progress 
                value={progressInCurrentLevel} 
                max={100} 
                className="h-2 bg-cosmic-light"
                data-testid="spirit-experience-bar"
              />
            </div>
          </div>
        )}
      </div>

      {showDetails && spirit.description && (
        <p className="text-sm text-gray-300 italic" data-testid="spirit-description">
          {spirit.description}
        </p>
      )}

      {showDetails && Array.isArray(spirit.evolution) && spirit.evolution.length > 0 && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEvolution(!showEvolution)}
            className="text-accent-light hover:text-accent-light/80"
            data-testid="button-toggle-evolution"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {showEvolution ? 'Hide' : 'Show'} Evolution History
          </Button>

          {showEvolution && (
            <Card className="mt-3 bg-cosmic-light/30 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-accent-light" />
                  Spirit Evolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                {(spirit.evolution as any[]).slice(-5).reverse().map((entry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-xs text-gray-300 p-2 bg-cosmic-light/20 rounded">
                    <div className="flex items-center space-x-2">
                      {entry.leveledUp && <Zap className="w-3 h-3 text-primary" />}
                      <span className="capitalize">
                        {entry.action?.replace('_', ' ') || 'Unknown action'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">+{entry.experienceGain} XP</span>
                      {entry.leveledUp && (
                        <span className="text-primary font-semibold">
                          Level {entry.newLevel}!
                        </span>
                      )}
                      <Calendar className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}