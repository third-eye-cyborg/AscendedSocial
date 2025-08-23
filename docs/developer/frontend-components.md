# Frontend Components Guide

Comprehensive guide to the React components powering the Ascended Social spiritual community platform.

## 🎨 Component Architecture

### Design System Philosophy
Our component system reflects spiritual principles:
- **Harmony**: Consistent design language across all components
- **Balance**: Light and dark themes representing spiritual duality
- **Flow**: Smooth animations and transitions for mindful interactions
- **Authenticity**: Components that serve spiritual growth over engagement metrics

### Component Hierarchy
```
App
├── Layout Components
│   ├── Header (Navigation, Authentication)
│   ├── Sidebar (Navigation, Spirit Guide, Energy)
│   └── Main Content Container
├── Page Components
│   ├── Home (Feed, Posts)
│   ├── Profile (User, Spirit, Stats)
│   ├── Oracle (Readings, Tarot, Recommendations)
│   └── Spiritual Features (Spirit, Energy)
├── Feature Components
│   ├── PostCard (Content, Engagements)
│   ├── SpiritAvatar (Evolution, Visual)
│   └── ProfileIcon (Sigils, Avatars)
└── UI Components (shadcn/ui based)
    ├── Forms, Buttons, Cards
    ├── Dialogs, Modals, Sheets
    └── Navigation, Progress, Badges
```

## 🏗️ Layout Components

### Header Component
Main navigation and authentication interface.

**Location**: `client/src/components/Header.tsx`

```typescript
interface HeaderProps {
  user?: User;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

// Features:
// - Responsive navigation
// - Authentication status
// - Spiritual branding
// - Mobile menu support
```

**Key Features**:
- **Mystical Branding**: Cosmic design with spiritual symbols
- **Authentication Integration**: Seamless Replit Auth integration
- **Responsive Design**: Mobile-first navigation approach
- **Spiritual Navigation**: Links to Oracle, Spirit Guide, and Energy systems

### Sidebar Component
Spiritual navigation and user status display.

**Location**: `client/src/components/Sidebar.tsx`

```typescript
interface SidebarProps {
  user?: User;
  spirit?: Spirit;
  currentLocation: string;
}

// Features:
// - Spirit Guide display with evolution
// - Energy meter with visual progress
// - Navigation with active state
// - Premium features showcase
```

**Sections**:
1. **Spirit Guide Display**: Compact spirit with level and element
2. **Energy Meter**: Current energy with progress visualization
3. **Main Navigation**: Core platform features (Home, Oracle, Energy, Spirit)
4. **Premium Features**: Showcase of premium capabilities
5. **User Profile**: Quick access to profile and settings

**Design Elements**:
- **Cosmic Gradient**: Dark space background with stellar accents
- **Spiritual Icons**: FontAwesome icons for mystical feel
- **Energy Visualization**: Progress bars and level indicators
- **Interactive Elements**: Hover effects and smooth transitions

## 📝 Content Components

### PostCard Component
Display and interaction interface for spiritual content.

**Location**: `client/src/components/PostCard.tsx`

```typescript
interface PostCardProps {
  post: Post & {
    author: User;
    engagements: {
      likes: number;
      upvotes: number;
      energy: number;
      comments: number;
    };
  };
  userEngagements?: string[];
  onEngage?: (type: EngagementType) => void;
}
```

**Key Features**:
- **Chakra Visualization**: Color-coded chakra indicators
- **Spiritual Frequency**: Visual representation of spiritual depth
- **Engagement Actions**: Like, upvote, energy share, comment
- **Author Recognition**: Spirit guide integration and profile display
- **Media Support**: Images and videos with proper aspect ratios
- **Energy Cost Display**: Clear indication of energy-based actions

**Engagement System**:
```typescript
// Energy cost visualization
const getEngagementCost = (type: EngagementType) => {
  switch (type) {
    case 'energy': return 10;
    case 'like':
    case 'upvote':
    case 'downvote':
    default: return 0;
  }
};

// Spirit XP rewards
const getExperienceReward = (type: EngagementType) => {
  switch (type) {
    case 'energy': return 20;
    case 'upvote': return 10;
    case 'like': return 5;
    case 'downvote': return 2;
    default: return 0;
  }
};
```

### CreatePost Component
Spiritual content creation interface.

**Location**: `client/src/components/CreatePost.tsx`

**Features**:
- **Rich Text Input**: Multi-line text with spiritual formatting
- **Media Upload**: Image and video upload with Google Cloud Storage
- **AI Processing**: Automatic chakra categorization and frequency analysis
- **Energy Validation**: Check energy availability for premium posts
- **Preview Mode**: Live preview of post appearance

### CommentSection Component
Spiritual discussion interface.

**Features**:
- **Nested Replies**: Threaded spiritual discussions
- **Spiritual Etiquette**: Guidelines for respectful spiritual dialogue
- **Author Recognition**: Spirit guide display for commenters
- **Engagement Tracking**: Comments contribute to spirit evolution
- **Moderation Support**: Community reporting and moderation tools

## 🌟 Spiritual Feature Components

### SpiritAvatar Component
Dynamic spiritual guide visualization.

**Location**: `client/src/components/SpiritAvatar.tsx`

```typescript
interface SpiritAvatarProps {
  spirit: Spirit;
  size?: 'small' | 'medium' | 'large';
  showLevel?: boolean;
  showElement?: boolean;
  interactive?: boolean;
}
```

**Visual Evolution System**:
```typescript
const getSpiritVisual = (level: number, element: string) => {
  const symbols = {
    fire: ['🔥', '🌋', '⭐', '☀️', '💫'],
    water: ['💧', '🌊', '🔮', '🌙', '✨'],
    earth: ['🌱', '🌳', '🏔️', '💎', '🗿'],
    air: ['💨', '🦅', '⚡', '🌟', '🌈']
  };
  
  const symbolIndex = Math.min(Math.floor(level / 5), symbols[element].length - 1);
  const glowIntensity = Math.min(level * 2, 100);
  
  return {
    symbol: symbols[element][symbolIndex],
    glowIntensity,
    tier: getTier(level)
  };
};
```

**Tier System**:
- **Levels 1-5**: Awakening - Basic symbols, soft glow
- **Levels 6-10**: Growth - Enhanced symbols, medium glow, tier badge
- **Levels 11-15**: Mastery - Advanced symbols, strong glow, master badge
- **Levels 16-20**: Transcendence - Transcendent symbols, radiant aura
- **Levels 21+**: Ascension - Unique evolution, dynamic effects

### ProfileIcon Component
User avatar with spiritual sigil support.

**Location**: `client/src/components/ProfileIcon.tsx`

```typescript
interface ProfileIconProps {
  user: User;
  size?: number;
  showSigil?: boolean;
  className?: string;
}
```

**Features**:
- **Sigil Display**: Custom spiritual symbols as profile images
- **Fallback System**: Default spiritual avatars for users without sigils
- **Responsive Sizing**: Consistent sizing across different contexts
- **Spiritual Aesthetics**: Mystical borders and glow effects

### EnergyMeter Component
Visual energy level display and management.

**Features**:
- **Progress Visualization**: Circular or linear energy progress bars
- **Status Indicators**: Color-coded energy levels (high, medium, low, critical)
- **Usage Tracking**: Visual history of energy consumption
- **Reset Countdown**: Days until monthly energy refresh

## 🔮 Oracle Components

### DailyReading Component
Personalized daily spiritual guidance display.

**Features**:
- **Reading Content**: Formatted spiritual guidance with mystical styling
- **Symbolic Elements**: Visual representation of spiritual symbols
- **Meditation Focus**: Highlighted contemplation points
- **Action Items**: Practical application suggestions
- **Sharing Options**: Share readings with spiritual friends

### TarotCard Component
Interactive tarot card display for readings.

```typescript
interface TarotCardProps {
  card: {
    name: string;
    meaning: string;
    position: 'past' | 'present' | 'future';
    imageUrl?: string;
  };
  isRevealed: boolean;
  onReveal?: () => void;
}
```

**Features**:
- **Card Animation**: Smooth flip animation for card revelation
- **Position Styling**: Visual distinction for past, present, future
- **Detailed Interpretation**: Expandable card meaning and guidance
- **Interactive Elements**: Click to reveal, tap for details

### OracleRecommendations Component
AI-curated spiritual content suggestions.

**Features**:
- **Personalized Content**: Recommendations based on spiritual profile
- **Content Categories**: Practices, learning, connections, insights
- **Relevance Scoring**: Visual indicators of recommendation fit
- **Action Buttons**: Easy access to recommended content

## 🎯 Interactive Components

### SearchModal Component
Global content and user discovery interface.

**Location**: `client/src/components/SearchModal.tsx`

**Features**:
- **Unified Search**: Posts, users, and spiritual content
- **Real-time Results**: Instant search with debouncing
- **Spiritual Filtering**: Filter by chakra, element, spirit level
- **Quick Actions**: Direct engagement from search results

### EngagementButton Component
Standardized engagement action buttons.

```typescript
interface EngagementButtonProps {
  type: EngagementType;
  count: number;
  isActive: boolean;
  energyCost?: number;
  disabled?: boolean;
  onEngage: () => void;
}
```

**Button Types**:
- **Like Button**: Heart icon with count, free action
- **Upvote Button**: Arrow up with count, free action
- **Energy Button**: Lightning bolt with cost, premium action
- **Comment Button**: Chat bubble with count, free action

**Features**:
- **Visual Feedback**: Animation on interaction
- **Cost Display**: Clear energy cost for premium actions
- **State Management**: Active/inactive visual states
- **Accessibility**: ARIA labels and keyboard navigation

### NotificationDropdown Component
System and community notification display.

**Features**:
- **Notification Types**: Engagement, milestone, system, community
- **Real-time Updates**: Live notification counter
- **Grouped Display**: Organized by category and date
- **Action Items**: Quick actions from notification panel

## 📱 Form Components

### CreatePostForm Component
Enhanced post creation with spiritual features.

**Features**:
- **Rich Text Editor**: Formatted text with spiritual symbols
- **Media Upload**: Drag-and-drop image and video support
- **Chakra Preview**: Live chakra categorization preview
- **Energy Validation**: Real-time energy availability check
- **Scheduling Options**: Premium users can schedule posts

### SpiritualProfileForm Component
Onboarding questionnaire for spirit guide generation.

**Form Fields**:
- **Religious Background**: Relationship with organized religion
- **Spiritual Practices**: Meditation, prayer, energy work preferences
- **Belief Systems**: Personal spiritual philosophy
- **Astrological Information**: Birth date and zodiac sign
- **Sacred Offerings**: Spiritual gifts and talents

### CommentForm Component
Spiritual discussion participation interface.

**Features**:
- **Respectful Guidelines**: Spiritual etiquette reminders
- **Character Limits**: Encourage thoughtful, concise responses
- **Emoji Support**: Spiritual symbols and supportive reactions
- **Preview Mode**: See comment formatting before submission

## 🎨 UI Component System

### Card Components
Consistent container styling across the platform.

```typescript
// Base card with spiritual styling
<Card className="bg-cosmic-light border-primary/30 hover-lift">
  <CardHeader>
    <CardTitle className="text-white">Spiritual Content</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Mystical content */}
  </CardContent>
</Card>
```

**Card Variants**:
- **Content Cards**: Posts, readings, recommendations
- **Profile Cards**: User information and spirit guides
- **Feature Cards**: Premium features and spiritual tools
- **Navigation Cards**: Menu items and quick actions

### Button System
Comprehensive button variants for spiritual interactions.

```typescript
// Primary spiritual action
<Button className="bg-primary hover:bg-primary/90">
  Share Energy
</Button>

// Secondary community action  
<Button variant="secondary" className="bg-cosmic-light">
  Add Comment
</Button>

// Premium feature access
<Button className="bg-gradient-to-r from-yellow-600 to-orange-600">
  Unlock Premium
</Button>
```

### Badge System
Visual indicators for spiritual status and achievements.

**Badge Types**:
- **Spirit Level**: Numerical level with elemental colors
- **Premium Status**: Golden crown for premium subscribers
- **Community Role**: Mentor, leader, contributor badges
- **Achievement**: Milestone and spiritual accomplishment badges

## 🔧 Component Development Guidelines

### Spiritual Design Principles

#### Color Philosophy
```css
/* Cosmic color palette */
:root {
  --cosmic: #0a0a0a;           /* Deep space background */
  --cosmic-light: #1a1a1a;    /* Lighter cosmic areas */
  --primary: #6366f1;         /* Spiritual purple */
  --accent-light: #fbbf24;    /* Golden spiritual accent */
}
```

#### Animation Guidelines
- **Smooth Transitions**: 200-300ms for hover effects
- **Spiritual Animations**: Gentle, flowing movements
- **Meaningful Motion**: Animations support spiritual atmosphere
- **Performance**: Minimize animations on mobile devices

### Component Standards

#### TypeScript Integration
```typescript
// Full type safety for all props
interface ComponentProps {
  user: User;
  spirit?: Spirit;
  onAction: (action: string) => Promise<void>;
}

// Proper error handling
const Component: React.FC<ComponentProps> = ({ user, spirit, onAction }) => {
  const handleAction = async (action: string) => {
    try {
      await onAction(action);
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div data-testid="component-container">
      {/* Component content */}
    </div>
  );
};
```

#### Accessibility Requirements
- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Tab order and keyboard shortcuts
- **Screen Reader Support**: Semantic HTML and descriptions
- **Focus Management**: Clear focus indicators and logical flow

#### Testing Standards
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { SpiritAvatar } from './SpiritAvatar';

describe('SpiritAvatar', () => {
  it('displays spirit information correctly', () => {
    const mockSpirit = {
      name: 'Luna Dreamweaver',
      element: 'water',
      level: 7
    };
    
    render(<SpiritAvatar spirit={mockSpirit} />);
    
    expect(screen.getByTestId('spirit-avatar-7')).toBeInTheDocument();
    expect(screen.getByText('Luna Dreamweaver')).toBeInTheDocument();
  });
});
```

### Performance Optimization

#### Component Memoization
```typescript
// Memoize expensive spirit visual calculations
const SpiritAvatar = React.memo<SpiritAvatarProps>(({ spirit, size }) => {
  const visualData = useMemo(() => 
    getSpiritVisual(spirit.level, spirit.element), 
    [spirit.level, spirit.element]
  );
  
  return (
    <div className={`spirit-avatar spirit-avatar--${size}`}>
      {/* Optimized spirit display */}
    </div>
  );
});
```

#### Image Optimization
- **Lazy Loading**: Images load as they enter viewport
- **Responsive Images**: Multiple sizes for different screen sizes
- **WebP Support**: Modern format with fallback to JPEG/PNG
- **CDN Integration**: Google Cloud Storage for optimized delivery

---

*These components create a harmonious spiritual interface that serves authentic growth and meaningful community connection. Each component is designed to support the user's spiritual journey while maintaining excellent technical performance.* 🎨✨