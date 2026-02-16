# Ascended Social - Style Usage Examples

## Quick Implementation Guide for Web and Mobile

### Web (React + Tailwind CSS)

#### Basic Component Structure
```tsx
import React from 'react';

const SpiritualCard: React.FC<{ chakraType?: string; children: React.ReactNode }> = ({ 
  chakraType, 
  children 
}) => {
  const chakraClass = chakraType ? `chakra-glow-${chakraType}` : '';
  
  return (
    <div className={`
      bg-card text-card-foreground 
      border border-border rounded-[var(--radius)] 
      p-4 shadow-lg
      ${chakraClass}
      transition-all duration-200
      hover:scale-[1.02]
    `}>
      {children}
    </div>
  );
};
```

#### Chakra-Themed Post Card
```tsx
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className={`
      bg-card border border-border rounded-[var(--radius)]
      p-6 mb-4 shadow-lg
      chakra-glow-${post.chakraType}
      animate-fade-in
    `}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`
          w-3 h-3 rounded-full
          bg-chakra-${post.chakraType}
          animate-gentle-pulse
        `} />
        <span className="text-chakra-${post.chakraType} font-medium">
          {post.chakraType} Chakra
        </span>
      </div>
      
      <h3 className="font-display text-xl text-foreground mb-3">
        {post.title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {post.content}
      </p>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <button className="
          bg-gradient-to-r from-primary to-secondary
          text-white px-4 py-2 rounded-lg
          font-medium transition-all duration-200
          hover:scale-105 hover:shadow-lg
        ">
          Share Energy
        </button>
        
        <span className="text-text-muted text-sm">
          {post.energyLevel} spiritual energy
        </span>
      </div>
    </div>
  );
};
```

#### Spiritual Button Components
```tsx
const SpiritualButton: React.FC<{
  variant: 'primary' | 'secondary' | 'chakra';
  chakraType?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ variant, chakraType, children, onClick }) => {
  const getButtonClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-secondary hover:scale-105';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/80';
      case 'chakra':
        return `bg-chakra-${chakraType} hover:bg-chakra-${chakraType}/80 chakra-glow-${chakraType}`;
      default:
        return 'bg-primary hover:bg-primary/80';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getButtonClasses()}
        text-white font-medium px-6 py-3 rounded-lg
        transition-all duration-200
        hover:shadow-lg active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary/50
      `}
    >
      {children}
    </button>
  );
};
```

### Mobile (React Native + Expo)

#### Basic Theme Setup
```tsx
// App.tsx
import React from 'react';
import { SpiritualThemeProvider } from './mobile/components/SpiritualThemeProvider';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  return (
    <SpiritualThemeProvider>
      <MainNavigator />
    </SpiritualThemeProvider>
  );
}
```

#### Spiritual Card Component
```tsx
// components/SpiritualCard.tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useSpiritualTheme, useChakraStyle } from '../styles/SpiritualThemeProvider';
import { GlobalStyles, createChakraStyle } from '../styles/MobileStyles';

interface SpiritualCardProps {
  chakraType?: keyof typeof SpiritualColors.chakra;
  children: React.ReactNode;
  style?: ViewStyle;
}

const SpiritualCard: React.FC<SpiritualCardProps> = ({ 
  chakraType, 
  children, 
  style 
}) => {
  const { colors } = useSpiritualTheme();
  const chakraStyle = chakraType ? useChakraStyle(chakraType) : null;
  
  return (
    <View style={[
      GlobalStyles.card,
      chakraStyle?.glowStyle,
      chakraType && { borderColor: chakraStyle?.color, borderWidth: 1 },
      style
    ]}>
      {children}
    </View>
  );
};

export default SpiritualCard;
```

#### Post Card with Chakra Theming
```tsx
// components/PostCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSpiritualTheme, useChakraStyle, SpiritualGradients } from '../styles/SpiritualThemeProvider';
import { GlobalStyles, SpiritualColors } from '../styles/MobileStyles';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    chakraType: keyof typeof SpiritualColors.chakra;
    energyLevel: number;
  };
  onEnergyShare?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEnergyShare }) => {
  const { colors } = useSpiritualTheme();
  const chakraStyle = useChakraStyle(post.chakraType);
  
  return (
    <View style={[
      GlobalStyles.postCard,
      chakraStyle.glowStyle,
      { borderColor: chakraStyle.color, borderWidth: 1 }
    ]}>
      {/* Chakra Indicator */}
      <View style={[GlobalStyles.row, { marginBottom: 16 }]}>
        <View style={[
          {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: chakraStyle.color,
          },
          chakraStyle.glowStyle
        ]} />
        <Text style={[
          GlobalStyles.bodySmall,
          { color: chakraStyle.color, marginLeft: 12, fontWeight: '500' }
        ]}>
          {post.chakraType.charAt(0).toUpperCase() + post.chakraType.slice(1)} Chakra
        </Text>
      </View>
      
      {/* Content */}
      <Text style={[GlobalStyles.headingSmall, { marginBottom: 12 }]}>
        {post.title}
      </Text>
      
      <Text style={[GlobalStyles.bodyMedium, { marginBottom: 20 }]}>
        {post.content}
      </Text>
      
      {/* Actions */}
      <View style={[GlobalStyles.row, GlobalStyles.spaceBetween, {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border
      }]}>
        <TouchableOpacity onPress={onEnergyShare}>
          <LinearGradient
            colors={SpiritualGradients.primary}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={GlobalStyles.buttonGradient}
          >
            <Text style={GlobalStyles.buttonText}>Share Energy</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={[GlobalStyles.bodySmall, GlobalStyles.textMuted]}>
          {post.energyLevel} spiritual energy
        </Text>
      </View>
    </View>
  );
};

export default PostCard;
```

#### Chakra-Specific Button Component
```tsx
// components/ChakraButton.tsx
import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useChakraStyle, SpiritualGradients } from '../styles/SpiritualThemeProvider';
import { GlobalStyles, SpiritualColors } from '../styles/MobileStyles';

interface ChakraButtonProps {
  chakraType: keyof typeof SpiritualColors.chakra;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'solid' | 'gradient' | 'outline';
}

const ChakraButton: React.FC<ChakraButtonProps> = ({ 
  chakraType, 
  title, 
  onPress, 
  style,
  variant = 'solid'
}) => {
  const chakraStyle = useChakraStyle(chakraType);
  
  const getGradientColors = () => {
    const gradientMap = {
      root: SpiritualGradients.chakraRoot,
      sacral: SpiritualGradients.chakraSacral,
      solar: SpiritualGradients.chakraSolar,
      heart: SpiritualGradients.chakraHeart,
      throat: SpiritualGradients.chakraThroat,
      third: SpiritualGradients.chakraThird,
      crown: SpiritualGradients.chakraCrown,
    };
    return gradientMap[chakraType] || SpiritualGradients.primary;
  };
  
  if (variant === 'gradient') {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <LinearGradient
          colors={getGradientColors()}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[GlobalStyles.buttonGradient, chakraStyle.glowStyle]}
        >
          <Text style={GlobalStyles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          GlobalStyles.buttonPrimary,
          {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: chakraStyle.color,
          },
          style
        ]}
      >
        <Text style={[GlobalStyles.buttonText, { color: chakraStyle.color }]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
  
  // Solid variant
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        GlobalStyles.buttonPrimary,
        { backgroundColor: chakraStyle.color },
        chakraStyle.glowStyle,
        style
      ]}
    >
      <Text style={GlobalStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ChakraButton;
```

### Shared Animation Patterns

#### Web CSS Animations
```css
/* Spiritual floating effect */
.animate-spiritual-float {
  animation: spiritual-float 4s ease-in-out infinite;
}

@keyframes spiritual-float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  25% { 
    transform: translateY(-5px) rotate(1deg);
    opacity: 0.9;
  }
  50% { 
    transform: translateY(-10px) rotate(0deg);
    opacity: 0.8;
  }
  75% { 
    transform: translateY(-5px) rotate(-1deg);
    opacity: 0.9;
  }
}
```

#### Mobile React Native Animations
```tsx
// hooks/useSpiritualAnimation.ts
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useSpiritualFloat = (duration: number = 4000) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();
    
    return () => animation.stop();
  }, [animatedValue, duration]);
  
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  
  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });
  
  return {
    transform: [{ translateY }],
    opacity,
  };
};
```

### Best Practices Summary

1. **Consistency**: Always use the design system tokens for colors, spacing, and typography
2. **Chakra Integration**: Apply chakra colors meaningfully based on content categorization
3. **Accessibility**: Ensure sufficient color contrast and touch targets
4. **Performance**: Use native drivers for animations on mobile
5. **Responsive**: Test on multiple screen sizes and orientations
6. **Spiritual Aesthetics**: Keep animations subtle and meaningful to enhance the spiritual experience

This style system creates a unified spiritual experience across both web and mobile platforms while respecting each platform's unique capabilities and user expectations.