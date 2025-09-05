import React, { createContext, useContext, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { SpiritualColors } from '../styles/MobileStyles';

// Theme context for spiritual design system
interface SpiritualTheme {
  colors: typeof SpiritualColors;
  isDark: boolean;
  chakraType?: keyof typeof SpiritualColors.chakra;
}

interface ThemeProviderProps {
  children: ReactNode;
  chakraType?: keyof typeof SpiritualColors.chakra;
}

const SpiritualThemeContext = createContext<SpiritualTheme>({
  colors: SpiritualColors,
  isDark: true,
});

export const useSpiritualTheme = () => {
  const context = useContext(SpiritualThemeContext);
  if (!context) {
    throw new Error('useSpiritualTheme must be used within SpiritualThemeProvider');
  }
  return context;
};

export const SpiritualThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  chakraType 
}) => {
  // Set system UI colors to match spiritual theme
  React.useEffect(() => {
    // Configure status bar for cosmic theme
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(SpiritualColors.cosmic);
    }
  }, []);

  const themeValue: SpiritualTheme = {
    colors: SpiritualColors,
    isDark: true,
    chakraType,
  };

  return (
    <SpiritualThemeContext.Provider value={themeValue}>
      <StatusBar style="light" backgroundColor={SpiritualColors.cosmic} />
      {children}
    </SpiritualThemeContext.Provider>
  );
};

// Utility hook for chakra-specific styling
export const useChakraStyle = (chakraType: keyof typeof SpiritualColors.chakra) => {
  const { colors } = useSpiritualTheme();
  const chakraColor = colors.chakra[chakraType];
  
  return {
    color: chakraColor,
    backgroundColor: chakraColor + '20', // 20% opacity
    borderColor: chakraColor,
    shadowColor: chakraColor,
    glowStyle: {
      shadowColor: chakraColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
  };
};

// Gradient helper for spiritual buttons and cards
export const SpiritualGradients = {
  primary: ['#5771FF', '#9B59B6'],           // Primary brand gradient
  cosmic: ['#0F0F23', '#1A1A3A'],           // Cosmic background gradient
  chakraRoot: ['#FF0000', '#FF4444'],        // Root chakra gradient
  chakraSacral: ['#FF7F00', '#FFB366'],      // Sacral chakra gradient
  chakraSolar: ['#FFFF00', '#FFFF66'],       // Solar chakra gradient
  chakraHeart: ['#E91E63', '#F48FB1'],       // Heart chakra gradient
  chakraThroat: ['#0000FF', '#6666FF'],      // Throat chakra gradient
  chakraThird: ['#4B0082', '#8A2BE2'],       // Third eye gradient
  chakraCrown: ['#9400D3', '#BA55D3'],       // Crown chakra gradient
  ethereal: ['#E596CA', '#FFFFFF'],          // Ethereal light gradient
};

export default SpiritualThemeProvider;