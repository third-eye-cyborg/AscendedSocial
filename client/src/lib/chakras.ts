export type ChakraType = "root" | "sacral" | "solar" | "heart" | "throat" | "third_eye" | "crown";

export const chakraColors: Record<ChakraType, string> = {
  root: "hsl(0, 100%, 50%)",        // Red
  sacral: "hsl(30, 100%, 50%)",     // Orange  
  solar: "hsl(60, 100%, 50%)",      // Yellow
  heart: "hsl(340, 82%, 52%)",      // Pink/Red (matching CSS)
  throat: "hsl(240, 100%, 50%)",    // Blue
  third_eye: "hsl(260, 100%, 25%)", // Indigo
  crown: "hsl(280, 100%, 41%)"      // Violet
};

export const chakraNames: Record<ChakraType, string> = {
  root: "Root Chakra",
  sacral: "Sacral Chakra", 
  solar: "Solar Plexus Chakra",
  heart: "Heart Chakra",
  throat: "Throat Chakra",
  third_eye: "Third Eye Chakra",
  crown: "Crown Chakra"
};

export const chakraDescriptions: Record<ChakraType, string> = {
  root: "Survival, grounding, security, basic needs",
  sacral: "Creativity, sexuality, pleasure, emotions",
  solar: "Personal power, confidence, self-esteem",
  heart: "Love, compassion, forgiveness, connection",
  throat: "Communication, truth, expression, authenticity",
  third_eye: "Intuition, wisdom, psychic abilities, insight",
  crown: "Spirituality, divine connection, enlightenment"
};

export function getChakraColor(chakra: string): string {
  const normalizedChakra = chakra.toLowerCase().replace(' ', '_') as ChakraType;
  return chakraColors[normalizedChakra] || chakraColors.heart;
}

export function getChakraName(chakra: string): string {
  const normalizedChakra = chakra.toLowerCase().replace(' ', '_') as ChakraType;
  return chakraNames[normalizedChakra] || "Heart Chakra";
}

export function getChakraDescription(chakra: string): string {
  const normalizedChakra = chakra.toLowerCase().replace(' ', '_') as ChakraType;
  return chakraDescriptions[normalizedChakra] || "Love, compassion, connection";
}

export function getChakraGlow(chakra: string): string {
  const normalizedChakra = chakra.toLowerCase().replace(' ', '_') as ChakraType;
  
  const glowClasses: Record<ChakraType, string> = {
    root: "chakra-glow-root",
    sacral: "chakra-glow-sacral", 
    solar: "chakra-glow-solar",
    heart: "chakra-glow-heart",
    throat: "chakra-glow-throat",
    third_eye: "chakra-glow-third",
    crown: "chakra-glow-crown"
  };
  
  return glowClasses[normalizedChakra] || "chakra-glow-heart";
}

export function getRandomChakra(): ChakraType {
  const chakras = Object.keys(chakraColors) as ChakraType[];
  return chakras[Math.floor(Math.random() * chakras.length)];
}

export function getChakraFrequency(chakra: ChakraType): number {
  // Spiritual frequencies associated with each chakra (in Hz)
  const frequencies: Record<ChakraType, number> = {
    root: 194.18,
    sacral: 210.42,
    solar: 126.22,
    heart: 341.3,
    throat: 141.27,
    third_eye: 221.23,
    crown: 172.06
  };
  
  return frequencies[chakra];
}
