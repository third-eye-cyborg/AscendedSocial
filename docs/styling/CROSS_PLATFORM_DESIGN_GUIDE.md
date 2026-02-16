# Cross-Platform Design Guide
## Ascended Social - Web & Mobile Unified Design System

### Design Philosophy
Ascended Social maintains a consistent spiritual aesthetic across web and mobile platforms while respecting each platform's unique interaction patterns and technical capabilities. The design centers around chakra-based content categorization, cosmic aesthetics, and immersive spiritual experiences.

## Color System Mapping

### Brand Colors (Consistent Across Platforms)
| Color | Web CSS | Mobile Hex | Usage |
|-------|---------|------------|-------|
| Primary (Cosmic Blue) | `hsl(232, 100%, 67%)` | `#5771FF` | Primary buttons, links, active states |
| Secondary (Mystic Purple) | `hsl(277, 48%, 58%)` | `#9B59B6` | Secondary actions, accents |
| Cosmic Background | `hsl(245, 58%, 10%)` | `#0F0F23` | Main background |
| Cosmic Light | `hsl(245, 35%, 15%)` | `#1A1A3A` | Card backgrounds, containers |

### Chakra Colors (Universal)
| Chakra | Color | Web CSS | Mobile Hex |
|--------|-------|---------|------------|
| Root | Red | `hsl(0, 100%, 50%)` | `#FF0000` |
| Sacral | Orange | `hsl(30, 100%, 50%)` | `#FF7F00` |
| Solar | Yellow | `hsl(60, 100%, 50%)` | `#FFFF00` |
| Heart | Pink | `hsl(120, 100%, 35%)` | `#E91E63` |
| Throat | Blue | `hsl(240, 100%, 50%)` | `#0000FF` |
| Third Eye | Indigo | `hsl(260, 100%, 45%)` | `#4B0082` |
| Crown | Violet | `hsl(280, 100%, 41%)` | `#9400D3` |

## Typography Mapping

### Font Hierarchy
| Style | Web (CSS) | Mobile (React Native) | Usage |
|-------|-----------|----------------------|-------|
| Display Large | `font-display text-3xl` | `headingLarge` (30px) | Main titles, hero text |
| Display Medium | `font-display text-2xl` | `headingMedium` (24px) | Section headers |
| Display Small | `font-display text-xl` | `headingSmall` (20px) | Subsection headers |
| Body Large | `font-sans text-lg` | `bodyLarge` (18px) | Emphasized body text |
| Body Medium | `font-sans text-base` | `bodyMedium` (16px) | Standard body text |
| Body Small | `font-sans text-sm` | `bodySmall` (14px) | Secondary information |

### Font Family Mapping
- **Web**: Inter (primary), Poppins (display)
- **Mobile**: Inter-Regular, Inter-Medium, Inter-Bold, Poppins-Medium

## Component Design Patterns

### Cards
**Web Implementation:**
```css
.card {
  background: var(--card);              /* hsl(245, 35%, 15%) */
  border: 1px solid var(--border);     /* hsl(245, 20%, 25%) */
  border-radius: 1.3rem;
  padding: 1rem;
}
```

**Mobile Implementation:**
```typescript
card: {
  backgroundColor: '#1A1A3A',
  borderRadius: 12,
  padding: 16,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
}
```

### Buttons
**Web Gradient Button:**
```css
.button-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}
```

**Mobile Gradient Button:**
```typescript
// Using react-native-linear-gradient
<LinearGradient
  colors={['#5771FF', '#9B59B6']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 1}}
  style={styles.buttonGradient}
>
```

### Chakra Glow Effects
**Web:**
```css
.chakra-glow-root {
  box-shadow: 0 0 15px var(--chakra-root);
  border-color: var(--chakra-root);
}
```

**Mobile:**
```typescript
rootGlow: {
  shadowColor: '#FF0000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 4,
}
```

## Platform-Specific Considerations

### Web-Specific Features
1. **CSS Animations**: Complex keyframe animations for spiritual effects
2. **Hover States**: Interactive hover effects for desktop users
3. **CSS Grid/Flexbox**: Advanced layout capabilities
4. **Backdrop Filters**: Blur effects for modals and overlays
5. **CSS Variables**: Dynamic theming support

### Mobile-Specific Features
1. **Touch Gestures**: Swipe, pinch, long-press interactions
2. **Safe Area**: iOS safe area insets and notch handling
3. **Platform UI**: Native navigation patterns (tabs, headers)
4. **Performance**: Optimized for 60fps animations
5. **Accessibility**: Screen reader and touch accessibility

## Responsive Design Breakpoints

### Web Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1279px  
- **Desktop**: ≥ 1280px

### Mobile Considerations
- **Small Phones**: < 375px width
- **Standard Phones**: 375px - 414px width
- **Large Phones**: > 414px width
- **Tablets**: Landscape orientation handling

## Navigation Patterns

### Web Navigation
- **Desktop**: Persistent sidebar (≥1280px)
- **Tablet/Mobile**: Bottom navigation bar
- **Breadcrumbs**: For deep navigation paths

### Mobile Navigation
- **Primary**: Bottom tab navigation
- **Secondary**: Stack navigation for drill-down
- **Modals**: For forms and detailed views

## Asset Management

### Images and Icons
- **Web**: SVG icons, WebP images with fallbacks
- **Mobile**: Vector icons (react-native-vector-icons), optimized images
- **Shared**: Icon design language and sizing conventions

### Fonts
- **Web**: Web fonts loaded via Google Fonts
- **Mobile**: Bundled fonts for consistent rendering

## Animation Guidelines

### Shared Animation Principles
1. **Subtle**: Spiritual content should feel serene, not distracting
2. **Meaningful**: Animations should enhance user understanding
3. **Performance**: 60fps target on all platforms
4. **Duration**: 200-400ms for micro-interactions, longer for spiritual effects

### Web Animations
```css
/* Gentle floating effect */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Mobile Animations
```typescript
// Using React Native Animated
const floatAnimation = useRef(new Animated.Value(0)).current;

Animated.loop(
  Animated.sequence([
    Animated.timing(floatAnimation, {
      toValue: -10,
      duration: 1500,
      useNativeDriver: true,
    }),
    Animated.timing(floatAnimation, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }),
  ])
).start();
```

## Content Strategy

### Chakra-Based Organization
Both platforms organize content by chakra type with consistent visual treatments:

1. **Visual Indicators**: Chakra colors for categorization
2. **Content Flow**: Similar information hierarchy
3. **Spiritual Elements**: Consistent symbolism and imagery
4. **User Journey**: Parallel onboarding and discovery flows

### Cross-Platform Features
- **Posts**: Chakra-categorized content with consistent styling
- **Oracle**: AI-powered readings with unified design
- **Energy System**: Point-based engagement with visual consistency
- **Profiles**: User sigils and aura visualization
- **3D Starmap**: Adapted for touch on mobile, mouse on web

## Testing and Quality Assurance

### Design Consistency Checklist
- [ ] Color values match across platforms
- [ ] Typography hierarchy is consistent
- [ ] Component spacing follows design system
- [ ] Chakra colors are accurately represented
- [ ] Animations feel consistent in timing and style
- [ ] Accessibility standards met on both platforms

### Platform Testing
- **Web**: Chrome, Safari, Firefox, Edge
- **Mobile**: iOS (13+), Android (API 21+)
- **Devices**: Various screen sizes and resolutions
- **Performance**: 60fps animations, smooth scrolling

This unified design approach ensures that users have a consistent spiritual experience whether they access Ascended Social through the web or mobile app, while respecting the unique capabilities and conventions of each platform.