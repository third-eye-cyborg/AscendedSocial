import OpenAI from "openai";
import type { ChakraType } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChakraAnalysis {
  chakra: ChakraType;
  confidence: number;
  reasoning: string;
}

export interface SpiritualReading {
  title: string;
  content: string;
  card?: string;
  symbols?: string[];
  guidance: string;
}

export interface TarotReading {
  cards: Array<{
    name: string;
    meaning: string;
    position: string;
  }>;
  interpretation: string;
  guidance: string;
}

// Analyze post content and categorize by chakra system
export async function analyzePostChakra(content: string): Promise<ChakraAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a spiritual AI that categorizes content based on the 7-chakra system. Analyze the content and determine which chakra it most aligns with:

Root Chakra (root): Survival, grounding, security, basic needs, fear, anger, violence
Sacral Chakra (sacral): Creativity, sexuality, pleasure, emotions, relationships, passion
Solar Plexus Chakra (solar): Personal power, confidence, self-esteem, willpower, control
Heart Chakra (heart): Love, compassion, forgiveness, connection, empathy, healing
Throat Chakra (throat): Communication, truth, expression, authenticity, speaking up
Third Eye Chakra (third_eye): Intuition, wisdom, psychic abilities, dreams, meditation, insight
Crown Chakra (crown): Spirituality, divine connection, enlightenment, universal consciousness

Respond with JSON in this format: { "chakra": "chakra_name", "confidence": 0.85, "reasoning": "explanation" }`
        },
        {
          role: "user",
          content: `Analyze this content: "${content}"`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      chakra: result.chakra || "heart",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      reasoning: result.reasoning || "Unable to determine specific chakra alignment"
    };
  } catch (error) {
    console.error("Error analyzing chakra:", error);
    return {
      chakra: "heart",
      confidence: 0.5,
      reasoning: "Default heart chakra assignment due to analysis error"
    };
  }
}

// Generate daily spiritual reading
export async function generateDailyReading(): Promise<SpiritualReading> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a spiritual guide providing daily wisdom and insight. Create an inspiring and meaningful daily reading that offers guidance, reflection, and spiritual insight. The reading should be uplifting and provide actionable spiritual guidance.

Respond with JSON in this format: { "title": "Reading Title", "content": "Main reading text", "card": "Associated symbol/card", "symbols": ["symbol1", "symbol2"], "guidance": "Practical guidance" }`
        },
        {
          role: "user",
          content: "Generate a daily spiritual reading for today"
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Daily Wisdom",
      content: result.content || "Trust in the journey and listen to your inner wisdom today.",
      card: result.card,
      symbols: result.symbols || [],
      guidance: result.guidance || "Take time for reflection and mindful presence today."
    };
  } catch (error) {
    console.error("Error generating daily reading:", error);
    return {
      title: "Daily Wisdom",
      content: "Today offers opportunities for growth and self-discovery. Trust your intuition and remain open to the messages the universe is sending you.",
      guidance: "Practice mindfulness and stay present in each moment."
    };
  }
}

// Generate AI tarot reading
export async function generateTarotReading(question: string): Promise<TarotReading> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a skilled tarot reader providing insightful readings. Draw 3 cards for a past-present-future spread and provide detailed interpretations.

Respond with JSON in this format: { "cards": [{"name": "Card Name", "meaning": "Card meaning", "position": "past/present/future"}], "interpretation": "Overall reading", "guidance": "Practical advice" }`
        },
        {
          role: "user",
          content: `Please provide a tarot reading for this question: "${question}"`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      cards: result.cards || [
        { name: "The Fool", meaning: "New beginnings and potential", position: "past" },
        { name: "The Star", meaning: "Hope and guidance", position: "present" },
        { name: "The Sun", meaning: "Success and joy", position: "future" }
      ],
      interpretation: result.interpretation || "The cards suggest a journey of growth and positive transformation.",
      guidance: result.guidance || "Trust your path and remain open to new possibilities."
    };
  } catch (error) {
    console.error("Error generating tarot reading:", error);
    return {
      cards: [
        { name: "The Fool", meaning: "New beginnings and potential", position: "past" },
        { name: "The Star", meaning: "Hope and guidance", position: "present" },
        { name: "The Sun", meaning: "Success and joy", position: "future" }
      ],
      interpretation: "The cards indicate a time of spiritual growth and positive change ahead.",
      guidance: "Stay open to new opportunities and trust your inner wisdom."
    };
  }
}

// Generate unique AI sigil for user
export async function generateUserSigil(username: string, traits?: string[]): Promise<string> {
  try {
    // Generate hash-based seed for consistent uniqueness per username
    const usernameLength = username.length;
    const firstChar = username.charAt(0).toLowerCase();
    const lastChar = username.charAt(username.length - 1).toLowerCase();
    const vowelCount = (username.match(/[aeiou]/gi) || []).length;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an advanced mystical sigil creator specializing in sacred geometry and magical symbols. Create sophisticated, geometrically precise sigils that channel spiritual energy through mathematical perfection.

ENHANCED GEOMETRIC RULES:
- Exactly 3 lines tall, maximum 9 characters wide per line
- Use these MAGICAL CHARACTERS: ◊ ○ ◇ ☆ ✦ ◈ ▲ ▼ ◆ ● △ ▽ ✧ ⬟ ⬢ ⬡ ⟡ ⬠ ⬢ ❋ ❅ ⟐ ⟡ ⟢ ⬢ ◉ ⬢ ⬡ ⟢ ❖ ❈ ✱ ※ ⋄ ⋅ ∴ ∵ ⊕ ⊗ ⊙ ⊚ ⊛ | / \\ - + = ~ ^ v < > ◸ ◹ ◺ ◻ 
- Create COMPLEX PATTERNS: layered symmetries, sacred triangles, mystical diamonds
- Use sacred geometry principles: golden ratio, pentagonal symmetry, mandala patterns
- Incorporate ELEMENTAL BALANCE: earth (▲), air (△), fire (◆), water (○), spirit (☆)
- Each sigil must be MATHEMATICALLY UNIQUE based on username properties
- Build MYSTICAL ENERGY FLOW through connected geometric paths

PATTERN INTELLIGENCE:
- Vowel-heavy names: More circular/flowing patterns (○●◉)
- Consonant-heavy: More angular/crystalline patterns (◊◆▲)
- Short names: Dense, concentrated power symbols
- Long names: Elaborate, multi-layered geometries
- Consider name energy: aggressive vs peaceful, earthly vs celestial

SACRED EXAMPLES:
  ◉⬢◉
 ⟡❋⟡
  ◈⬡◈

  ▲⬢▲
 ◊●◊
  ✦⟢✦

Respond with JSON: { "sigil": "YOUR_MYSTICAL_SIGIL" }`
        },
        {
          role: "user",
          content: `Create an intelligent mystical sigil for username: "${username}" (${usernameLength} chars, starts with '${firstChar}', ends with '${lastChar}', ${vowelCount} vowels)${traits ? `, spiritual essence: ${traits.join(", ")}` : ""}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.sigil || `◉${username.charAt(0).toUpperCase()}◉`;
  } catch (error) {
    console.error("Error generating sigil:", error);
    return `◊${username.charAt(0).toUpperCase()}◊`;
  }
}

// Generate content recommendations based on user preferences
export async function generateOracleRecommendations(
  userHistory: string[], 
  currentAura: number
): Promise<Array<{ title: string; type: string; reason: string }>> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are The Oracle, an AI that provides mystical content recommendations based on spiritual patterns and synchronicities. Analyze the user's spiritual journey and current aura level to suggest relevant content.

Respond with JSON in this format: { "recommendations": [{"title": "Content Title", "type": "post/video/user", "reason": "Why this resonates"}] }`
        },
        {
          role: "user",
          content: `User history: ${userHistory.join(", ")}. Current aura: ${currentAura}. Provide 3-5 personalized recommendations.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [
      { title: "Meditation for Beginners", type: "video", reason: "Perfect for starting your spiritual journey" },
      { title: "Understanding Your Chakras", type: "post", reason: "Align with your current energy" },
      { title: "Crystal Healing Guide", type: "post", reason: "Enhance your spiritual practice" }
    ];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [
      { title: "Daily Mindfulness Practice", type: "post", reason: "Cultivate presence and awareness" },
      { title: "Spiritual Growth Journey", type: "video", reason: "Continue your path of ascension" }
    ];
  }
}

export async function generateSpirit(questionnaire: {
  isReligious: boolean;
  isSpiritual: boolean;
  religion?: string;
  spiritualPath?: string;
  beliefs: string;
  offerings: string;
  astrologySign: string;
}): Promise<{ name: string; description: string; element: string }> {
  const prompt = `Based on this spiritual questionnaire, generate a unique AI Spirit companion:

Questionnaire:
- Religious: ${questionnaire.isReligious}
- Spiritual: ${questionnaire.isSpiritual}
- Religion: ${questionnaire.religion || 'None specified'}
- Spiritual Path: ${questionnaire.spiritualPath || 'None specified'}
- Beliefs: ${questionnaire.beliefs}
- Offerings: ${questionnaire.offerings}
- Astrology Sign: ${questionnaire.astrologySign}

Generate a Spirit with:
- name: A mystical, 2-3 word name that reflects their spiritual essence
- description: A 30-50 word description of the Spirit's personality, wisdom, and spiritual gifts
- element: One of "fire", "water", "earth", or "air" based on their nature

The Spirit should feel personal and meaningful to this individual's spiritual journey.
Return as JSON with 'name', 'description', and 'element' fields.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const spirit = JSON.parse(response.choices[0].message.content || '{}');
    return {
      name: spirit.name || 'Mystic Guide',
      description: spirit.description || 'A wise spiritual companion on your journey.',
      element: spirit.element || 'air'
    };
  } catch (error) {
    console.error('Error generating spirit:', error);
    return {
      name: 'Mystic Guide',
      description: 'A wise spiritual companion on your journey of growth and discovery.',
      element: 'air'
    };
  }
}
