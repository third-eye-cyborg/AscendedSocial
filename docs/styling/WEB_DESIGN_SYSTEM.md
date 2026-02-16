# Ascended Social - Web Design System

## Overview
The Ascended Social web platform uses a comprehensive design system built on Tailwind CSS with custom spiritual-themed extensions. The design philosophy centers around creating an immersive, mystical experience that connects users with their spiritual journey through chakra-based color systems, cosmic aesthetics, and sophisticated visual effects.

## Color Palette

### Core Spiritual Colors
```css
/* Primary Brand Colors */
--primary: hsl(232, 100%, 67%)     /* #5771FF - Cosmic Blue */
--secondary: hsl(277, 48%, 58%)    /* #9B59B6 - Mystic Purple */

/* Cosmic Background System */
--cosmic: hsl(245, 58%, 10%)       /* #0F0F23 - Deep Space */
--cosmic-dark: hsl(245, 70%, 6%)   /* Darker cosmic variation */
--cosmic-light: hsl(245, 35%, 15%) /* #1A1A3A - Lighter cosmic */

/* Accent Colors */
--accent-light: hsl(340, 82%, 70%) /* #CCCCCC - Ethereal Light */
```

### Chakra Color System
Each chakra has a specific color used throughout the platform for content categorization and spiritual theming:

```css
/* Seven Chakra Colors */
--chakra-root: hsl(0, 100%, 50%)     /* #FF0000 - Root Chakra (Red) */
--chakra-sacral: hsl(30, 100%, 50%)  /* #FF7F00 - Sacral Chakra (Orange) */
--chakra-solar: hsl(60, 100%, 50%)   /* #FFFF00 - Solar Plexus (Yellow) */
--chakra-heart: hsl(120, 100%, 35%)  /* #E91E63 - Heart Chakra (Pink/Green) */
--chakra-throat: hsl(240, 100%, 50%) /* #0000FF - Throat Chakra (Blue) */
--chakra-third: hsl(260, 100%, 45%)  /* #4B0082 - Third Eye (Indigo) */
--chakra-crown: hsl(280, 100%, 41%)  /* #9400D3 - Crown Chakra (Violet) */
```

### Semantic Colors
```css
/* UI State Colors */
--background: hsl(245, 58%, 10%)    /* Dark cosmic background */
--foreground: hsl(0, 0%, 100%)      /* Pure white text */
--card: hsl(245, 35%, 15%)          /* Card backgrounds */
--muted: hsl(245, 35%, 15%)         /* Muted elements */
--border: hsl(245, 20%, 25%)        /* Border colors */
--destructive: hsl(356, 90%, 54%)   /* Error/warning states */

/* Text Hierarchy */
--text-muted: hsl(0, 0%, 85%)       /* Secondary text */
--text-subtle: hsl(0, 0%, 90%)      /* Tertiary text */
--text-secondary: hsl(0, 0%, 95%)   /* Quaternary text */
```

## Typography

### Font Families
```css
/* Primary Fonts */
--font-sans: 'Inter', 'Open Sans', sans-serif      /* Body text */
--font-display: 'Poppins', 'Inter', sans-serif     /* Headings */
--font-serif: Georgia, serif                        /* Emphasis text */
--font-mono: Menlo, monospace                       /* Code/technical */
```

### Usage Guidelines
- **Display Font (Poppins)**: Use for main headings, titles, and spiritual content headers
- **Sans Font (Inter)**: Use for body text, UI elements, and general content
- **Serif Font**: Use sparingly for quotes, testimonials, or emphasis
- **Mono Font**: Use for technical content, code snippets, or data display

## Visual Effects & Animations

### Chakra Glow Effects
Each chakra has corresponding glow effects that can be applied to elements:

```css
/* Chakra-specific Glow Classes */
.chakra-glow-root    /* Red glow for root chakra content */
.chakra-glow-sacral  /* Orange glow for sacral chakra content */
.chakra-glow-solar   /* Yellow glow for solar plexus content */
.chakra-glow-heart   /* Pink/Green glow for heart chakra content */
.chakra-glow-throat  /* Blue glow for throat chakra content */
.chakra-glow-third   /* Indigo glow for third eye content */
.chakra-glow-crown   /* Violet glow for crown chakra content */
```

### Spiritual Animations
```css
/* Available Animation Classes */
.animate-float          /* Gentle floating motion (3s duration) */
.animate-glow           /* Subtle glow pulse effect */
.animate-gradient-shift /* Flowing gradient animation */
.animate-pulse-slow     /* Slow, gentle pulse (3s duration) */
.animate-fade-in        /* Smooth fade in transition */
.animate-slide-up       /* Slide up with fade effect */
.animate-scale-in       /* Scale in with fade effect */
.animate-gentle-pulse   /* Very subtle pulsing effect */
```

## Layout System

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1279px (md/lg)
- **Desktop**: ≥ 1280px (xl)

### Mobile-First Considerations
- Bottom navigation spacing: 100px padding on mobile/tablet
- Card max-width: `calc(100vw - 2rem)` for proper mobile margins
- Sidebar hidden on mobile, visible on desktop (≥1280px)
- Touch-friendly interactive elements (minimum 44px touch targets)

### Grid & Spacing
- Base spacing unit: `0.25rem` (4px)
- Container max-width: 100% with overflow-x: hidden
- Card border-radius: `1.3rem` (var(--radius))

## Component Guidelines

### Cards & Containers
```css
/* Standard Card Styling */
background: var(--card)              /* hsl(245, 35%, 15%) */
border: 1px solid var(--border)     /* hsl(245, 20%, 25%) */
border-radius: var(--radius)        /* 1.3rem */
color: var(--card-foreground)       /* hsl(0, 0%, 95%) */
```

### Buttons
```css
/* Primary Button */
background: linear-gradient(135deg, var(--primary), var(--secondary))
border: none
color: white
border-radius: 8px
padding: 8px 16px
font-weight: 600
transition: all 0.2s ease

/* Hover State */
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(87, 113, 255, 0.3)
```

### Interactive Elements
- All interactive elements should include hover states with gentle transforms
- Use spiritual glow effects for chakra-related content
- Implement smooth transitions (0.2s ease standard)
- Include loading states with cosmic-themed spinners

## Accessibility

### Color Contrast
- All text meets WCAG AA standards with high contrast colors
- Spiritual glow effects are supplementary to core functionality
- Clear focus indicators for keyboard navigation

### Text Hierarchy
- High contrast text: `hsl(0, 0%, 98%)`
- Medium contrast text: `hsl(0, 0%, 90%)`
- Low contrast text: `hsl(0, 0%, 80%)`

## Integration with Third-Party Components

### Uppy File Upload
- Custom dark theme styling to match cosmic aesthetic
- Spiritual gradient progress bars
- Branded close buttons and upload controls

### Select Dropdowns (Radix UI)
- Dark cosmic background with proper contrast
- Hover states matching the spiritual theme
- High z-index for proper layering

### Tooltips & Popovers
- Fixed positioning with high z-index (9999)
- Proper viewport constraints and positioning
- Dark theme with readable contrast

## Best Practices

1. **Chakra Integration**: Always use appropriate chakra colors for content categorization
2. **Glow Effects**: Apply sparingly to maintain visual hierarchy
3. **Animations**: Keep subtle to avoid overwhelming spiritual content
4. **Mobile First**: Test all components on mobile devices first
5. **Spiritual Consistency**: Maintain cosmic/mystical aesthetic throughout
6. **Performance**: Use CSS transforms for animations to leverage GPU acceleration
7. **Accessibility**: Ensure all interactive elements are keyboard accessible

## File Structure
- `client/src/index.css`: Main styling with CSS variables and component styles
- `tailwind.config.ts`: Tailwind configuration with custom colors and animations
- Component-specific styles: Integrated within component files using Tailwind classes

This design system creates a cohesive, spiritually-immersive experience that supports the platform's chakra-based content system while maintaining modern web standards and accessibility requirements.