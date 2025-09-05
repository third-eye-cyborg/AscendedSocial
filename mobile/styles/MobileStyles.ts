import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Ascended Social Mobile Design System
// React Native StyleSheet for cross-platform mobile app

export const SpiritualColors = {
  // Core Brand Colors
  primary: '#5771FF',        // Cosmic Blue
  secondary: '#9B59B6',      // Mystic Purple
  
  // Cosmic Background System
  cosmic: '#0F0F23',         // Deep Space
  cosmicDark: '#0A0A1A',     // Darker cosmic variation
  cosmicLight: '#1A1A3A',    // Lighter cosmic
  
  // Accent Colors
  accentLight: '#E596CA',    // Ethereal Light
  white: '#FFFFFF',
  
  // Chakra Color System
  chakra: {
    root: '#FF0000',         // Root Chakra (Red)
    sacral: '#FF7F00',       // Sacral Chakra (Orange)
    solar: '#FFFF00',        // Solar Plexus (Yellow)
    heart: '#E91E63',        // Heart Chakra (Pink)
    throat: '#0000FF',       // Throat Chakra (Blue)
    third: '#4B0082',        // Third Eye (Indigo)
    crown: '#9400D3',        // Crown Chakra (Violet)
  },
  
  // Semantic UI Colors
  background: '#0F0F23',     // Dark cosmic background
  foreground: '#FFFFFF',     // Pure white text
  card: '#1A1A3A',          // Card backgrounds
  cardForeground: '#F2F2F2', // Card text
  muted: '#1A1A3A',         // Muted elements
  mutedForeground: '#D9D9D9', // Muted text
  border: '#404040',         // Border colors
  input: '#262640',          // Input backgrounds
  destructive: '#DC2626',    // Error/warning states
  
  // Text Hierarchy
  textPrimary: '#FFFFFF',    // Primary text
  textSecondary: '#D9D9D9',  // Secondary text
  textMuted: '#B3B3B3',      // Tertiary text
  textSubtle: '#8C8C8C',     // Quaternary text
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const SpiritualFonts = {
  // Font Families (adjust based on available fonts)
  display: 'Poppins-Medium',      // Headings and titles
  sans: 'Inter-Regular',          // Body text
  sansMedium: 'Inter-Medium',     // Medium weight
  sansBold: 'Inter-Bold',         // Bold text
  mono: 'Menlo-Regular',          // Monospace
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const SpiritualSpacing = {
  // Spacing Scale (based on 4px base unit)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  
  // Component-specific spacing
  cardPadding: 16,
  screenPadding: 20,
  sectionSpacing: 32,
  
  // Safe area adjustments
  safeAreaTop: 44,      // iOS status bar
  safeAreaBottom: 34,   // iOS home indicator
  tabBarHeight: 80,     // Bottom tab navigation
};

export const SpiritualRadius = {
  // Border Radius Scale
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
  
  // Component-specific radius
  card: 12,
  button: 8,
  input: 8,
  modal: 16,
};

export const SpiritualShadows = {
  // Shadow definitions
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Chakra-specific glows (using shadowColor)
  chakraGlow: {
    root: {
      shadowColor: '#FF0000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    sacral: {
      shadowColor: '#FF7F00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    solar: {
      shadowColor: '#FFFF00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    heart: {
      shadowColor: '#E91E63',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    throat: {
      shadowColor: '#0000FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    third: {
      shadowColor: '#4B0082',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    crown: {
      shadowColor: '#9400D3',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Main StyleSheet for common components
export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: SpiritualColors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: SpiritualColors.background,
    paddingTop: SpiritualSpacing.safeAreaTop,
    paddingBottom: SpiritualSpacing.safeAreaBottom,
  },
  
  screenContainer: {
    flex: 1,
    backgroundColor: SpiritualColors.background,
    paddingHorizontal: SpiritualSpacing.screenPadding,
  },
  
  // Card Components
  card: {
    backgroundColor: SpiritualColors.card,
    borderRadius: SpiritualRadius.card,
    padding: SpiritualSpacing.cardPadding,
    ...SpiritualShadows.md,
  },
  
  postCard: {
    backgroundColor: SpiritualColors.card,
    borderRadius: SpiritualRadius.card,
    padding: SpiritualSpacing.cardPadding,
    marginVertical: SpiritualSpacing.sm,
    marginHorizontal: SpiritualSpacing.md,
    ...SpiritualShadows.lg,
  },
  
  // Typography
  headingLarge: {
    fontFamily: SpiritualFonts.display,
    fontSize: SpiritualFonts.sizes['3xl'],
    lineHeight: SpiritualFonts.sizes['3xl'] * SpiritualFonts.lineHeights.tight,
    color: SpiritualColors.textPrimary,
    fontWeight: '600',
  },
  
  headingMedium: {
    fontFamily: SpiritualFonts.display,
    fontSize: SpiritualFonts.sizes['2xl'],
    lineHeight: SpiritualFonts.sizes['2xl'] * SpiritualFonts.lineHeights.tight,
    color: SpiritualColors.textPrimary,
    fontWeight: '600',
  },
  
  headingSmall: {
    fontFamily: SpiritualFonts.display,
    fontSize: SpiritualFonts.sizes.xl,
    lineHeight: SpiritualFonts.sizes.xl * SpiritualFonts.lineHeights.tight,
    color: SpiritualColors.textPrimary,
    fontWeight: '500',
  },
  
  bodyLarge: {
    fontFamily: SpiritualFonts.sans,
    fontSize: SpiritualFonts.sizes.lg,
    lineHeight: SpiritualFonts.sizes.lg * SpiritualFonts.lineHeights.normal,
    color: SpiritualColors.textPrimary,
  },
  
  bodyMedium: {
    fontFamily: SpiritualFonts.sans,
    fontSize: SpiritualFonts.sizes.base,
    lineHeight: SpiritualFonts.sizes.base * SpiritualFonts.lineHeights.normal,
    color: SpiritualColors.textPrimary,
  },
  
  bodySmall: {
    fontFamily: SpiritualFonts.sans,
    fontSize: SpiritualFonts.sizes.sm,
    lineHeight: SpiritualFonts.sizes.sm * SpiritualFonts.lineHeights.normal,
    color: SpiritualColors.textSecondary,
  },
  
  textMuted: {
    color: SpiritualColors.textMuted,
  },
  
  textSubtle: {
    color: SpiritualColors.textSubtle,
  },
  
  // Button Styles
  buttonPrimary: {
    backgroundColor: SpiritualColors.primary,
    borderRadius: SpiritualRadius.button,
    paddingVertical: SpiritualSpacing.md,
    paddingHorizontal: SpiritualSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SpiritualShadows.md,
  },
  
  buttonSecondary: {
    backgroundColor: SpiritualColors.secondary,
    borderRadius: SpiritualRadius.button,
    paddingVertical: SpiritualSpacing.md,
    paddingHorizontal: SpiritualSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SpiritualShadows.md,
  },
  
  buttonGradient: {
    borderRadius: SpiritualRadius.button,
    paddingVertical: SpiritualSpacing.md,
    paddingHorizontal: SpiritualSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SpiritualShadows.md,
  },
  
  buttonText: {
    fontFamily: SpiritualFonts.sansMedium,
    fontSize: SpiritualFonts.sizes.base,
    color: SpiritualColors.white,
    fontWeight: '600',
  },
  
  // Input Styles
  input: {
    backgroundColor: SpiritualColors.input,
    borderColor: SpiritualColors.border,
    borderWidth: 1,
    borderRadius: SpiritualRadius.input,
    paddingVertical: SpiritualSpacing.md,
    paddingHorizontal: SpiritualSpacing.md,
    fontFamily: SpiritualFonts.sans,
    fontSize: SpiritualFonts.sizes.base,
    color: SpiritualColors.textPrimary,
  },
  
  inputFocused: {
    borderColor: SpiritualColors.primary,
    borderWidth: 2,
  },
  
  // Layout Helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Chakra-Specific Styles
  chakraContainer: {
    borderRadius: SpiritualRadius.card,
    padding: SpiritualSpacing.md,
    marginVertical: SpiritualSpacing.sm,
  },
  
  // Spacing Utilities
  marginTop: {
    marginTop: SpiritualSpacing.md,
  },
  
  marginBottom: {
    marginBottom: SpiritualSpacing.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: SpiritualSpacing.md,
  },
  
  paddingVertical: {
    paddingVertical: SpiritualSpacing.md,
  },
  
  // Navigation Styles
  tabBar: {
    backgroundColor: SpiritualColors.card,
    borderTopColor: SpiritualColors.border,
    borderTopWidth: 1,
    height: SpiritualSpacing.tabBarHeight,
    paddingBottom: SpiritualSpacing.safeAreaBottom,
  },
  
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SpiritualSpacing.sm,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    backgroundColor: SpiritualColors.card,
    borderRadius: SpiritualRadius.modal,
    padding: SpiritualSpacing.lg,
    width: width * 0.9,
    maxHeight: height * 0.8,
    ...SpiritualShadows.lg,
  },
  
  // Avatar and Profile Styles
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SpiritualColors.muted,
  },
  
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SpiritualColors.muted,
  },
  
  // Status and Badge Styles
  badge: {
    backgroundColor: SpiritualColors.primary,
    borderRadius: SpiritualRadius.full,
    paddingHorizontal: SpiritualSpacing.sm,
    paddingVertical: SpiritualSpacing.xs,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  badgeText: {
    fontFamily: SpiritualFonts.sansBold,
    fontSize: SpiritualFonts.sizes.xs,
    color: SpiritualColors.white,
    fontWeight: '700',
  },
});

// Chakra-specific style generators
export const createChakraStyle = (chakraType: keyof typeof SpiritualColors.chakra) => {
  const chakraColor = SpiritualColors.chakra[chakraType];
  const chakraGlow = SpiritualShadows.chakraGlow[chakraType];
  
  return StyleSheet.create({
    container: {
      ...GlobalStyles.chakraContainer,
      borderColor: chakraColor,
      borderWidth: 1,
      ...chakraGlow,
    },
    accent: {
      backgroundColor: chakraColor + '20', // 20% opacity
      borderColor: chakraColor,
      borderWidth: 1,
    },
    text: {
      color: chakraColor,
    },
    button: {
      backgroundColor: chakraColor,
    },
    badge: {
      ...GlobalStyles.badge,
      backgroundColor: chakraColor,
    },
  });
};

// Responsive design helpers
export const ResponsiveStyles = {
  isSmallScreen: width < 375,
  isMediumScreen: width >= 375 && width < 414,
  isLargeScreen: width >= 414,
  
  // Dynamic font sizes based on screen size
  getDynamicFontSize: (baseSize: number) => {
    if (width < 375) return baseSize * 0.9;
    if (width >= 414) return baseSize * 1.1;
    return baseSize;
  },
  
  // Dynamic padding based on screen size
  getDynamicPadding: (basePadding: number) => {
    if (width < 375) return basePadding * 0.8;
    if (width >= 414) return basePadding * 1.2;
    return basePadding;
  },
};

export default GlobalStyles;