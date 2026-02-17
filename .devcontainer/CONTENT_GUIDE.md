# Ascended Social Platform - Content & Features Guide

## 🔮 Platform Overview

Ascended Social is a spiritual social media platform that connects users through:
- Chakra-based content organization
- Energy point systems
- AI-powered oracle readings
- 3D starmap visualization
- Spiritual engagement mechanics

---

## 🧘 Core Spiritual Features

### 💫 Chakra System

The platform organizes content and user interactions around the 7 chakras:

1. **Root Chakra (Muladhara)** - Red 🔴
   - Foundation, grounding, stability
   - Community building
   - Security & belonging

2. **Sacral Chakra (Svadhisthana)** - Orange 🟠
   - Creativity, pleasure, sexuality
   - Creative content
   - Collaboration

3. **Solar Plexus Chakra (Manipura)** - Yellow 💛
   - Personal power, will, confidence
   - Leadership content
   - Personal growth

4. **Heart Chakra (Anahata)** - Green 💚
   - Love, compassion, connection
   - Relationships
   - Community support

5. **Throat Chakra (Vishuddha)** - Blue 🔵
   - Communication, truth, expression
   - Discussions, debate
   - Creative expression

6. **Third Eye Chakra (Ajna)** - Indigo 💜
   - Intuition, insight, vision
   - Wisdom sharing
   - Oracle readings

7. **Crown Chakra (Sahasrara)** - Violet/White 🟣
   - Enlightenment, connection to divine
   - Spiritual experiences
   - Transcendence

### ⚡ Energy System

**Energy Points (EP)**
- Users earn energy points through engagement
- Daily refresh cycles
- Used for special actions
- Shared between community members

**Energy Mechanics**
- Posting costs: 5-25 EP (based on chakra)
- Engagement (sparks): 1-5 EP
- Oracle readings: 10-50 EP
- Energy sharing: Custom amounts

**Spiritual Frequency** 
- Calculated from: content quality, engagement, chakra alignment
- Affects visibility and reach
- Contributes to user "aura level"

### 🃏 Oracle Readings

**Oracle System**
- AI-powered spiritual guidance
- Personalized to user profile
- Tarot-inspired structure
- Chakra-aligned interpretations

**Features**
- Daily oracle readings
- User-requested readings
- Guided meditations
- Spiritual affirmations

**Integration**
- OpenAI API for generation
- Cached results for performance
- User history tracking

### 🌌 3D Starmap Visualizer

**Visualization**
- React Three Fiber (r3f) technology
- Real-time user presence
- Spiritual connection mapping
- Interactive exploration mode

**Components**
- **Star Field**: Background universe
- **User Orbs**: Individual user presence
- **Connection Lines**: Energy/relationship paths
- **Fungal Mode**: Alternative visualization

**Technical**
- WebGL rendering
- Canvas for 2D overlays
- Interactive camera controls
- Performance optimization

### 💎 User Progression

**Aura Levels**
- Calculated from: energy spent, engagement, spiritual frequency
- 13 levels total (0-12)
- Visual badges and achievements
- Status indicators

**Achievements**
- Chakra mastery badges
- Energy milestones
- Engagement streaks
- Contribution rewards

---

## 📱 Content Types

### Post Categories

1. **Meditations & Practices**
   - Guided meditations
   - Yoga routines
   - Breathwork techniques
   - Manifestation practices

2. **Spiritual Wisdom**
   - Teachings
   - Quotes & affirmations
   - Philosophical discussions
   - Historical spirituality

3. **Oracle & Divination**
   - Tarot readings
   - Oracle cards
   - Numerology
   - Energy readings

4. **Wellness & Healing**
   - Holistic health
   - Energy healing
   - Sound therapy
   - Chakra balancing

5. **Community Experiences**
   - Group meditations
   - Events & gatherings
   - User stories
   - Testimonials

6. **Creative Expression**
   - Spiritual art
   - Music & sound
   - Poetry
   - Visual design

7. **Sacred Science**
   - Quantum spirituality
   - Consciousness research
   - Energy science
   - Mystical philosophy

### Engagement Types (Sparks)

Instead of traditional likes/dislikes:

- **⬆️ Uplift** - Positive energy (+1)
- **⬇️ Ground** - Needs refining (−1)
- **💫 Spark** - Inspiring (special effect)
- **🔄 Share Energy** - Redistribute points
- **📌 Resonate** - Save/bookmark
- **🙏 Gratitude** - Special appreciation

---

## 🎨 Design System

### Visual Identity
- **Primary**: Gradient purples & indigos
- **Chakra Colors**: Full spectrum rainbow
- **Sacred Geometry**: Mandalas, spirals, circles
- **Typography**: Modern + mystical balance

### Components
- Chakra selector/indicator
- Energy gauge/meter
- Oracle card display
- Aura level badge
- Starmap viewer
- Energy transaction history

### Accessibility
- High contrast options
- Chakra color alt tags
- Meditation audio descriptions
- Screen reader support

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST /api/auth/register      - Create account
POST /api/auth/login         - Sign in
POST /api/auth/logout        - Sign out
GET  /api/auth/profile       - Get user profile
PUT  /api/auth/profile       - Update profile
```

### Content Endpoints
```
GET  /api/posts              - List posts
POST /api/posts              - Create post
GET  /api/posts/:id          - Get single post
PUT  /api/posts/:id          - Update post
DELETE /api/posts/:id        - Delete post
```

### Energy Endpoints
```
GET  /api/energy/balance     - Get energy balance
POST /api/energy/share       - Share energy
GET  /api/energy/history     - Transaction history
```

### Oracle Endpoints
```
GET  /api/oracle/daily       - Daily oracle reading
POST /api/oracle/request     - Request custom reading
GET  /api/oracle/history     - Reading history
```

### Starmap Endpoints
```
GET  /api/starmap/users      - Active user positions
WS   /ws/starmap             - Real-time updates
```

---

## 📊 Database Schema

### Key Tables

**users**
- User profiles with spiritual attributes
- Aura level, energy, spiritual frequency
- Authentication data

**posts**
- Content with chakra categorization
- Timestamps, engagement metrics
- Content moderation status

**sparks**
- Engagement actions (uplift, ground, etc.)
- Energy transactions
- User interactions

**oracles**
- AI-generated spiritual readings
- User specific
- Version & history tracking

**energy_transactions**
- Energy point movements
- User-to-user transfers
- Daily refresh records

**chakra_alignments**
- User preferences
- Chakra mastery levels
- Alignment scores

---

## 🧪 Testing the Platform

### Component Testing
```bash
npm run test:cypress         # Component tests with Cypress
```

### E2E Testing
```bash
npm run test:playwright      # Full E2E with Playwright
```

### Visual Regression
```bash
npm run chromatic:cypress    # Cypress visual regression
npm run chromatic:playwright # Playwright visual regression
```

### Coverage Reporting
```bash
npm run test:coverage        # Generate coverage report
```

---

## 📖 Content Best Practices

### Chakra-Aligned Content
- Tag posts with primary chakra
- Consider secondary chakras
- Build coherent content series
- Respect spiritual authenticity

### Engagement Guidelines
- Use appropriate spark types
- Share energy meaningfully
- Engage authentically
- Build community trust

### Oracle Consistency
- Generated readings use consistent voice
- Align with user's spiritual journey
- Provide actionable wisdom
- Respect user autonomy

### 3D Starmap
- Represent connection authentically
- Visualize energy flow
- Maintain performance
- Provide clear navigation

---

## 🔐 Spiritual Ethics

### Content Moderation
- Respect diverse spiritual paths
- Flag harmful misinformation
- Protect vulnerable users
- Maintain platform integrity

### Energy System Fairness
- Prevent energy manipulation
- Ensure equitable distribution
- Detect gaming/abuse
- Maintain system balance

### Privacy & Sacred Data
- User journey data is sacred
- Respect meditation history
- Secure oracle readings
- Transparent analytics

### Authenticity
- Require genuine accounts
- Encourage real names (optional)
- Prevent bot activity
- Foster human connection

---

## 🚀 Getting Started with Content

### Creating Your First Post
1. Sign in to your profile
2. Click "Create" button
3. Select primary chakra
4. Write your content
5. Add media (optional)
6. Set privacy level
7. Publish

### Requesting an Oracle Reading
1. Navigate to Oracle section
2. Click "Request Reading"
3. Choose reading type
4. Describe your situation
5. Pay energy cost (10-50 EP)
6. Receive personalized guidance

### Exploring the Starmap
1. Open Starmap from main menu
2. Rotate view with mouse
3. Hover over user orbs
4. Click to connect
5. View shared energy
6. Add connections

---

## 📞 Support & Resources

**Getting Help**
- Hover over info icons (ℹ️) for tooltips
- Check FAQ section
- Contact support team
- Join community Discord

**Reporting Issues**
- Use "Report" button on content
- Email: support@ascendedsocial.com
- GitHub Issues (development)

**Community Guidelines**
- Respect all spiritual traditions
- No hate speech or harassment
- No spam or self-promotion spam
- Share authentically

---

**Welcome to the spiritual community. May your journey be enlightened. 🔮✨**
