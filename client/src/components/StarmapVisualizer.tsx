import { Suspense, useRef, useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { Group, Vector3, Color, Mesh, BufferGeometry, Material } from 'three';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Eye, Users, Filter, Home, Zap, RotateCcw, Maximize2, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const zodiacEmojis: { [key: string]: string } = {
  "aries": "♈",
  "taurus": "♉", 
  "gemini": "♊",
  "cancer": "♋",
  "leo": "♌",
  "virgo": "♍",
  "libra": "♎",
  "scorpio": "♏",
  "sagittarius": "♐",
  "capricorn": "♑",
  "aquarius": "♒",
  "pisces": "♓"
};

// Error Boundary for 3D Canvas
interface CanvasErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  CanvasErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Starmap2DFallback onRetry={() => {
        this.setState({ hasError: false, error: undefined });
        this.props.onRetry();
      }} />;
    }

    return this.props.children;
  }
}

// 2D Fallback Starmap (no WebGL)
function Starmap2DFallback({ onRetry }: { onRetry: () => void }) {
  const [filters, setFilters] = useState<{
    chakra?: string;
    astrologySign?: string;
    minAura?: number;
    maxAura?: number;
    minEnergy?: number;
    maxEnergy?: number;
  }>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: users = [], isLoading, error } = useQuery<StarmapUser[]>({
    queryKey: ['/api/starmap/users', JSON.stringify(filters)],
    queryFn: async (): Promise<StarmapUser[]> => {
      const params = new URLSearchParams();
      if (filters.chakra) params.append('chakra', filters.chakra);
      if (filters.astrologySign) params.append('astrologySign', filters.astrologySign);
      if (filters.minAura !== undefined) params.append('minAura', filters.minAura.toString());
      if (filters.maxAura !== undefined) params.append('maxAura', filters.maxAura.toString());
      if (filters.minEnergy !== undefined) params.append('minEnergy', filters.minEnergy.toString());
      if (filters.maxEnergy !== undefined) params.append('maxEnergy', filters.maxEnergy.toString());
      
      const queryString = params.toString();
      const url = `/api/starmap/users${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch starmap users: ${response.status}`);
      }
      
      return response.json();
    },
    retry: 2
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Lost",
        description: "Unable to connect to the spiritual realm. Trying again...",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin"></div>
          <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Mapping the Spiritual Cosmos</h2>
          <p className="text-purple-300 animate-pulse">Connecting to the celestial network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Cosmic Interference</h2>
          <p className="text-purple-300 mb-4">The spiritual realm seems distant right now.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reconnect to the Cosmos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black relative overflow-hidden">
      {/* Header with 3D retry option */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setLocation('/')}
          className="bg-black/60 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-900/40"
        >
          <Home className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            // Note: 3D mode functionality will be handled by the main component
            console.log('3D mode button clicked');
          }}
          className="bg-purple-600/80 backdrop-blur-sm border-purple-400/50 text-white hover:bg-purple-700/80"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          3D Visualization Active
        </Button>
      </div>

      {/* 2D Starmap Grid - Enhanced Mobile Scrolling */}
      <div className="pt-20 pb-8 px-4 h-screen overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-3xl font-bold text-white mb-2">Spiritual Community Map</h1>
          <p className="text-purple-300">Explore souls in the astral plane</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto pb-20">
          {users.filter(user => user?.id).map((user) => (
            <Card 
              key={user.id}
              className="p-4 bg-black/60 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer group"
              onClick={() => setLocation(`/profile/${user.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: user?.dominantChakra && chakraColors[user.dominantChakra] ? chakraColors[user.dominantChakra] : '#6b46c1',
                      boxShadow: `0 0 20px ${user?.dominantChakra && chakraColors[user.dominantChakra] ? chakraColors[user.dominantChakra] : '#6b46c1'}40`
                    }}
                  >
                    {user?.username ? user.username.charAt(0).toUpperCase() : '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {user?.username || 'Anonymous Soul'}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2 text-xs">
                      <div className="flex items-center text-yellow-400">
                        <Zap className="w-3 h-3 mr-1" />
                        {user?.aura || 0}
                      </div>
                      <div className="flex items-center text-blue-400">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {user?.energy || 0}
                      </div>
                    </div>
                    {user?.dominantChakra && (
                      <Badge 
                        variant="outline" 
                        className="text-xs mt-2 border-purple-300 text-purple-200 bg-purple-900/30"
                        style={{ borderColor: chakraColors[user.dominantChakra] }}
                      >
                        {user.dominantChakra}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center text-purple-300 mt-12">
            <div className="text-6xl mb-4">🌌</div>
            <p>No souls found in this realm. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Chakra color mapping for stars (using hex values for 3D compatibility)
const chakraColors: Record<string, string> = {
  root: '#ff0000',
  sacral: '#ff7f00',
  solar: '#ffff00',
  heart: '#e4467c', // Pink/red to match main heart chakra
  throat: '#0000ff',
  third_eye: '#4b0082',
  crown: '#9400d3',
};

// User type definition
interface StarmapUser {
  id: string;
  username: string | null;
  profileImageUrl: string | null;
  aura: number | null;
  energy: number | null;
  astrologySign: string | null;
  connections: Array<{ id: string; username: string | null; bondLevel: number }>;
  dominantChakra?: string;
  postCount: number;
}

// Get position based on spiritual attributes - Enhanced 3D positioning
const getStarPosition = (user: StarmapUser, index: number): Vector3 => {
  // Safe access to user properties with fallbacks
  const chakraIndex = user?.dominantChakra 
    ? Object.keys(chakraColors).indexOf(user.dominantChakra)
    : (index % 7);
  
  const auraLevel = user?.aura || 0;
  const energyLevel = user?.energy || 500;
  
  // Create clustering based on spiritual attributes with safety checks
  const safeChakraIndex = Number.isFinite(chakraIndex) ? chakraIndex : (index % 7);
  const safeAuraLevel = Number.isFinite(auraLevel) ? auraLevel : 0;
  const safeEnergyLevel = Number.isFinite(energyLevel) ? energyLevel : 500;
  
  // Enhanced 3D positioning with dramatic depth but simplified calculations
  const baseAngle = (safeChakraIndex / 7) * Math.PI * 2;
  const spiralOffset = (index * 0.5) % (Math.PI * 2); // Simpler spiral
  const angle = baseAngle + spiralOffset;
  const radius = Math.max(10, 20 + (safeAuraLevel / 100) + (index % 6));
  
  // Create dramatic 3D depth layers for true 3D experience
  const depthLayer = index % 4;
  const depthMultiplier = 1 + (depthLayer * 2.5); // More dramatic depth
  const finalRadius = radius * depthMultiplier;
  
  // Dramatic height variation for 3D distribution
  const baseHeight = (depthLayer - 1.5) * 15; // Larger Y spread
  const spiritualHeight = (safeEnergyLevel / 1000) * 8;
  const height = baseHeight + spiritualHeight + (Math.sin(index * 1.618) * 4);
  
  return new Vector3(
    Math.cos(angle) * finalRadius,
    height,
    Math.sin(angle) * finalRadius
  );
};

// Individual star component
function StarUser({ user, position, mode, onClick }: {
  user: StarmapUser;
  position: Vector3;
  mode: 'starmap' | 'fungus';
  onClick: (user: StarmapUser) => void;
}) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Early validation to prevent render issues
  if (!user?.id || !position) {
    return null;
  }
  
  useFrame((state, delta) => {
    try {
      if (meshRef.current) {
        const time = state.clock?.elapsedTime || 0;
        const userSeed = user.id?.charCodeAt(0) || 0;
        
        if (mode === 'starmap') {
          // Simplified 3D orbital motion for better performance
          const orbitSpeed = 0.05 + (user.aura || 0) / 20000; // Gentler orbit for higher aura
          const orbitRadius = 1 + (user.energy || 500) / 1000;
          
          // Create realistic orbital motion
          const orbitX = Math.cos(time * orbitSpeed + userSeed) * orbitRadius;
          const orbitZ = Math.sin(time * orbitSpeed + userSeed) * orbitRadius;
          
          meshRef.current.position.x = position.x + orbitX;
          meshRef.current.position.z = position.z + orbitZ;
          
          // Dramatic 3D rotation with multiple axes
          meshRef.current.rotation.y += delta * (hovered ? 2.5 : 0.8);
          meshRef.current.rotation.x += delta * 0.3;
          meshRef.current.rotation.z += delta * 0.15;
          
          // Enhanced pulsing with cosmic breathing
          const cosmicPulse = 1 + Math.sin(time * 2 + userSeed) * 0.15;
          const spiritualBreath = 1 + Math.sin(time * 0.5 + userSeed * 0.1) * 0.05;
          const targetScale = hovered ? 2.2 : 1;
          const currentScale = meshRef.current.scale.x;
          const newScale = currentScale + (targetScale - currentScale) * delta * 8;
          
          meshRef.current.scale.setScalar(newScale * cosmicPulse * spiritualBreath);
          
          // Simplified floating motion for better performance
          const floatY = Math.sin(time * 1.5 + userSeed) * 0.5;
          meshRef.current.position.y = position.y + floatY;
        } else {
          // Fungus mode - more grounded but still 3D
          meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.5);
          meshRef.current.rotation.x += delta * 0.2;
          
          const targetScale = hovered ? 1.8 : 1;
          const currentScale = meshRef.current.scale.x;
          const newScale = currentScale + (targetScale - currentScale) * delta * 6;
          const pulse = 1 + Math.sin(time * 3 + userSeed) * 0.1;
          
          meshRef.current.scale.setScalar(newScale * pulse);
          
          const floatOffset = Math.sin(time * 2 + userSeed) * 0.4;
          meshRef.current.position.y = position.y + floatOffset;
        }
      }
    } catch (error) {
      console.warn('Error in StarUser useFrame:', error);
    }
  });

  const color = (user?.dominantChakra && chakraColors[user.dominantChakra]) ? chakraColors[user.dominantChakra] : '#ffffff';
  
  // Safety check to ensure color is valid
  if (!color || typeof color !== 'string') {
    console.warn('Invalid color for user:', user.id, 'chakra:', user.dominantChakra);
    return null;
  }
  const auraIntensity = Math.min((user?.aura || 0) / 1000, 1);
  const size = mode === 'starmap' ? 0.2 + auraIntensity * 0.3 : 0.6 + auraIntensity * 0.4;
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(user)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {mode === 'starmap' ? (
          <>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial 
              color={color || '#ffffff'} 
              transparent
              opacity={0.8 + auraIntensity * 0.2}
            />
            {hovered && (
              <>
                <pointLight 
                  position={[0, 0, 0]} 
                  color={color} 
                  intensity={4} 
                  distance={12} 
                />
                {/* Simple glow effect */}
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[size * 1.6, 12, 12]} />
                  <meshBasicMaterial 
                    color={color || '#ffffff'} 
                    transparent 
                    opacity={0.15}
                  />
                </mesh>
              </>
            )}
          </>
        ) : (
          <>
            {/* Mushroom stem - tall and organic */}
            <mesh position={[0, -size * 0.8, 0]}>
              <cylinderGeometry args={[size * 0.15, size * 0.25, size * 1.6, 8]} />
              <meshStandardMaterial 
                color="#8B4513"
                emissive="#4A2C17"
                emissiveIntensity={0.1}
                roughness={0.9}
                metalness={0.0}
              />
            </mesh>
            
            {/* Mushroom cap - dome-shaped */}
            <mesh position={[0, size * 0.2, 0]}>
              <sphereGeometry args={[size * 0.8, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? 0.6 : 0.3}
                roughness={0.6}
                metalness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Gills under the cap */}
            <mesh position={[0, size * 0.1, 0]} rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[size * 0.75, size * 0.75, size * 0.05, 16]} />
              <meshStandardMaterial 
                color="#2D1810"
                emissive={color}
                emissiveIntensity={0.1}
                roughness={0.8}
                metalness={0.0}
                transparent
                opacity={0.6}
              />
            </mesh>
            
            {/* Spore particles when hovered */}
            {hovered && (
              <>
                <mesh position={[size * 0.3, size * 0.4, size * 0.2]}>
                  <sphereGeometry args={[size * 0.05, 6, 6]} />
                  <meshBasicMaterial 
                    color={color || '#ffffff'}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
                <mesh position={[-size * 0.2, size * 0.5, -size * 0.1]}>
                  <sphereGeometry args={[size * 0.04, 6, 6]} />
                  <meshBasicMaterial 
                    color={color || '#ffffff'}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
                <mesh position={[size * 0.1, size * 0.6, -size * 0.3]}>
                  <sphereGeometry args={[size * 0.03, 6, 6]} />
                  <meshBasicMaterial 
                    color={color || '#ffffff'}
                    transparent
                    opacity={0.5}
                  />
                </mesh>
              </>
            )}
          </>
        )}
      </mesh>
      
      {hovered && (
        <Html>
          <Card className="p-3 max-w-sm bg-black/90 backdrop-blur-md text-white border-2 border-purple-400 shadow-2xl animate-fade-in">
            <CardContent className="p-0">
              <div className="text-base font-semibold text-purple-200">
                {user.username || 'Anonymous Soul'}
              </div>
              <div className="text-xs text-gray-300 mt-1 grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                  {user.aura}
                </div>
                <div className="flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-400" />
                  {user.energy}
                </div>
              </div>
              {user.dominantChakra && (
                <Badge 
                  variant="outline" 
                  className="text-xs mt-2 border-purple-300 text-purple-200 bg-purple-900/30"
                  style={{ borderColor: chakraColors[user.dominantChakra] }}
                >
                  {user.dominantChakra} chakra
                </Badge>
              )}
              <div className="text-xs text-gray-400 mt-2 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {user.connections?.length || 0} spiritual bonds
              </div>
              <div className="text-xs text-purple-300 mt-1">
                Click to explore their journey
              </div>
            </CardContent>
          </Card>
        </Html>
      )}
    </group>
  );
}

// Connection lines for fungus mode
function ConnectionLines({ users }: { users: StarmapUser[] }) {
  const positions = useMemo(() => {
    const lines: number[] = [];
    const bondColors: number[] = [];
    
    users.forEach((user, index) => {
      if (user?.connections && Array.isArray(user.connections) && user.connections.length > 0) {
        const userPos = getStarPosition(user, index);
        const userColor = new Color(user?.dominantChakra && chakraColors[user.dominantChakra] ? chakraColors[user.dominantChakra] : '#ffffff');
        
        user.connections.forEach((connection) => {
          if (!connection?.id) return;
          const connectedUserIndex = users.findIndex(u => u?.id === connection.id);
          if (connectedUserIndex !== -1) {
            const connectedUser = users[connectedUserIndex];
            if (!connectedUser?.id) return;
            const connectedPos = getStarPosition(connectedUser, connectedUserIndex);
            const connectedColor = new Color(connectedUser?.dominantChakra && chakraColors[connectedUser.dominantChakra] ? chakraColors[connectedUser.dominantChakra] : '#ffffff');
            
            // Create gradient effect between chakra colors
            const midColor = userColor.clone().lerp(connectedColor, 0.5);
            const bondStrength = Math.min((connection.bondLevel || 0) / 10, 1);
            
            lines.push(
              userPos.x, userPos.y, userPos.z,
              connectedPos.x, connectedPos.y, connectedPos.z
            );
            
            // Add color and bond strength data with safety checks
            const safeR = Number.isFinite(midColor.r) ? midColor.r : 1;
            const safeG = Number.isFinite(midColor.g) ? midColor.g : 1;
            const safeB = Number.isFinite(midColor.b) ? midColor.b : 1;
            const safeBondStrength = Number.isFinite(bondStrength) ? bondStrength : 0.5;
            
            bondColors.push(
              safeR * safeBondStrength, safeG * safeBondStrength, safeB * safeBondStrength,
              safeR * safeBondStrength, safeG * safeBondStrength, safeB * safeBondStrength
            );
          }
        });
      }
    });
    
    return { positions: new Float32Array(lines), colors: new Float32Array(bondColors) };
  }, [users]);

  if (!positions.positions || positions.positions.length === 0) return null;

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={Math.floor(positions.positions.length / 3)}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={Math.floor(positions.colors.length / 3)}
          array={positions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.6} linewidth={2} />
    </line>
  );
}

// Camera controller for zoom-based mode switching
function CameraController({ onModeChange }: { onModeChange: (mode: 'starmap' | 'fungus') => void }) {
  const { camera } = useThree();
  const [lastMode, setLastMode] = useState<'starmap' | 'fungus'>('starmap');
  
  useFrame(() => {
    // Enhanced zoom-based mode switching with smooth transitions
    const distance = camera.position.distanceTo(new Vector3(0, 0, 0));
    
    // Use hysteresis to prevent flickering between modes
    if (distance > 35 && lastMode !== 'starmap') {
      onModeChange('starmap');  // Far = cosmic starfield view
      setLastMode('starmap');
    } else if (distance < 25 && lastMode !== 'fungus') {
      onModeChange('fungus');   // Close = fungal network view
      setLastMode('fungus');
    }
  });
  
  return null;
}

// Main starmap scene
function StarmapScene() {
  const [mode, setMode] = useState<'starmap' | 'fungus'>('starmap');
  const [filters, setFilters] = useState<{
    chakra?: string;
    astrologySign?: string;
    minAura?: number;
    maxAura?: number;
    minEnergy?: number;
    maxEnergy?: number;
  }>({});
  const [, setLocation] = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const [enable3D, setEnable3D] = useState(false); // Default to 2D for stability
  const { toast } = useToast();

  const { data: users = [], isLoading, error } = useQuery<StarmapUser[]>({
    queryKey: ['/api/starmap/users', JSON.stringify(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Only add non-empty filter parameters
      if (filters.chakra) params.append('chakra', filters.chakra);
      if (filters.astrologySign) params.append('astrologySign', filters.astrologySign);
      if (filters.minAura !== undefined) params.append('minAura', filters.minAura.toString());
      if (filters.maxAura !== undefined) params.append('maxAura', filters.maxAura.toString());
      if (filters.minEnergy !== undefined) params.append('minEnergy', filters.minEnergy.toString());
      if (filters.maxEnergy !== undefined) params.append('maxEnergy', filters.maxEnergy.toString());
      
      const queryString = params.toString();
      const url = `/api/starmap/users${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch starmap users: ${response.status}`);
      }
      
      return response.json();
    },
    retry: 2
  });

  // Add error handling with useEffect
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Lost",
        description: "Unable to connect to the spiritual realm. Trying again...",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const userPositions = useMemo(() => {
    if (!Array.isArray(users) || users.length === 0) return [];
    return users
      .filter((user: StarmapUser) => user?.id) // Only include users with valid IDs
      .map((user: StarmapUser, index: number) => ({
        user,
        position: getStarPosition(user, index)
      }));
  }, [users]);

  const handleUserClick = (user: StarmapUser) => {
    setLocation(`/profile/${user.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin"></div>
          <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Mapping the Spiritual Cosmos</h2>
          <p className="text-purple-300 animate-pulse">Connecting to the celestial network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Cosmic Interference</h2>
          <p className="text-purple-300 mb-4">The spiritual realm seems distant right now.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reconnect to the Cosmos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {/* Mobile-Responsive Control Panel */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
        <div className="flex space-x-1 md:space-x-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLocation('/')}
            className="bg-black/70 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-900/40 h-8 w-8 md:h-9 md:w-9 p-0"
          >
            <Home className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-black/70 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-900/40 h-8 w-8 md:h-9 md:w-9 p-0"
          >
            <Filter className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-black/70 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-900/40 h-8 w-8 md:h-9 md:w-9 p-0"
          >
            <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>
        
      {/* Mobile-Responsive Filter Panel */}
      {showFilters && (
        <div className="absolute top-12 left-2 md:top-16 md:left-4 z-20 max-w-[calc(100vw-1rem)] md:max-w-none">
          <Card className="p-2 md:p-3 bg-black/95 backdrop-blur-md border-purple-500/50 shadow-2xl w-[280px] md:w-64 max-w-[calc(100vw-1rem)]">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-purple-400" />
                  <span className="text-xs md:text-sm">Filters</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFilters(false)}
                  className="text-purple-300 hover:text-white p-1 h-6 w-6 md:h-6 md:w-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label className="text-[10px] md:text-xs text-white font-medium mb-1 md:mb-2 block">Chakra Energy</label>
                  <Select onValueChange={(chakra) => setFilters((f) => ({ ...f, chakra: chakra === 'all' ? undefined : chakra }))}>
                    <SelectTrigger className="h-7 md:h-8 text-[10px] md:text-xs bg-black/60 border-purple-400/50 text-white">
                      <SelectValue placeholder="All Chakras" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-md border-purple-500/50">
                      <SelectItem value="all" className="text-white hover:!bg-gray-800 hover:!text-white data-[highlighted]:!bg-gray-800 data-[highlighted]:!text-white">All Chakras</SelectItem>
                      {Object.entries(chakraColors).map(([chakra, color]) => (
                        <SelectItem key={chakra} value={chakra} className="text-white hover:!bg-gray-800 hover:!text-white data-[highlighted]:!bg-gray-800 data-[highlighted]:!text-white">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <span className="capitalize text-white">{chakra}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[10px] md:text-xs text-white font-medium mb-1 md:mb-2 block">Astrology Sign</label>
                  <Select onValueChange={(sign) => setFilters((f) => ({ ...f, astrologySign: sign === 'all' ? undefined : sign }))}>
                    <SelectTrigger className="h-7 md:h-8 text-[10px] md:text-xs bg-black/60 border-purple-400/50 text-white">
                      <SelectValue placeholder="All Signs" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-md border-purple-500/50">
                      <SelectItem value="all" className="text-white hover:!bg-gray-800 hover:!text-white data-[highlighted]:!bg-gray-800 data-[highlighted]:!text-white">All Signs</SelectItem>
                      {['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].map(sign => (
                        <SelectItem key={sign} value={sign} className="text-white hover:!bg-gray-800 hover:!text-white data-[highlighted]:!bg-gray-800 data-[highlighted]:!text-white">
                          <span className="capitalize text-white">{zodiacEmojis[sign] || "♦"} {sign}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {Object.keys(filters).some(key => filters[key as keyof typeof filters]) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFilters({})}
                    className="w-full text-[10px] md:text-xs text-purple-300 hover:text-white hover:bg-purple-900/40 h-7 md:h-8"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile-Responsive Mode indicator */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
        <Card className="p-2 md:p-3 bg-black/90 backdrop-blur-md border-purple-500/30 shadow-2xl min-w-[200px] md:min-w-[260px] max-w-[calc(100vw-1rem)]">
          <div className="flex items-center space-x-2 md:space-x-3 text-white mb-1 md:mb-2">
            {mode === 'starmap' ? (
              <>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm font-semibold">Cosmic Starfield</div>
                  <div className="text-[10px] md:text-xs text-purple-300">Universal Overview</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-600/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm font-semibold">Mycelium Network</div>
                  <div className="text-[10px] md:text-xs text-green-300">Connection Web</div>
                </div>
              </>
            )}
          </div>
          <div className="text-[10px] md:text-xs text-gray-300 border-t border-purple-500/20 pt-1 md:pt-2">
            {mode === 'starmap' ? '🔍 Zoom in to reveal network' : '🔍 Zoom out to see starfield'}
          </div>
          {mode === 'fungus' && (
            <div className="mt-2 pt-2 border-t border-green-500/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMode('starmap')}
                className="w-full bg-green-600/20 backdrop-blur-sm border-green-400/50 text-green-200 hover:bg-green-700/30 hover:text-white text-xs"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Return to Starfield
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Enhanced Stats */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-4 bg-black/70 backdrop-blur-md border-purple-500/30 shadow-2xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-4 text-sm text-white">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center">
                  <Eye className="w-3 h-3 text-purple-300" />
                </div>
                <div>
                  <div className="text-xs text-purple-300">Souls</div>
                  <div className="font-semibold">{users.length}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-600/30 flex items-center justify-center">
                  <Users className="w-3 h-3 text-green-300" />
                </div>
                <div>
                  <div className="text-xs text-green-300">Bonds</div>
                  <div className="font-semibold">
                    {users.reduce((total, user) => total + (user.connections?.length || 0), 0)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="text-xs text-gray-300 flex items-center justify-between">
                <span>Mode: {mode === 'starmap' ? 'Starfield' : 'Network'}</span>
                <span className="text-purple-300">✨ Live</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced 3D Starmap - temporarily disabled due to WebGL issues */}
      {false ? (
        <CanvasErrorBoundary onRetry={() => {
          setRetryKey(k => k + 1);
          setEnable3D(false); // Fall back to 2D on error
        }}>
          {userPositions.length > 0 ? (
            <Canvas
              key={retryKey}
              camera={{ position: [0, 25, 55], fov: 50 }}
              className="bg-gradient-to-b from-black via-purple-950/20 to-black touch-pan-y touch-pinch-zoom touch-manipulation h-full w-full"
              style={{ touchAction: 'pan-y pinch-zoom' }}
              dpr={1}
              legacy={true}
              gl={{ 
                antialias: false, 
                alpha: false,
                powerPreference: "low-power",
                preserveDrawingBuffer: false,
                stencil: false,
                depth: true,
                failIfMajorPerformanceCaveat: false
              }}
              onError={(error) => {
                console.warn('Canvas error caught:', error);
                // Don't automatically disable on error, let user retry
              }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={mode === 'starmap' ? 0.15 : 0.35} />
                
                {/* Dynamic lighting system */}
                <pointLight 
                  position={[20, 20, 20]} 
                  intensity={mode === 'starmap' ? 1.2 : 0.8} 
                  color="#8b5cf6" 
                  distance={100}
                  decay={2}
                />
                <pointLight 
                  position={[-20, -20, -20]} 
                  intensity={mode === 'starmap' ? 0.8 : 0.6} 
                  color="#06b6d4" 
                  distance={80}
                  decay={2}
                />
                <pointLight 
                  position={[0, 30, 0]} 
                  intensity={0.6} 
                  color="#fbbf24" 
                  distance={60}
                  decay={1.5}
                />
                <pointLight 
                  position={[0, -30, 0]} 
                  intensity={0.4} 
                  color="#ec4899" 
                  distance={50}
                  decay={1.8}
                />
                
                {/* Rim lighting for depth */}
                <directionalLight
                  position={[50, 50, 50]}
                  intensity={0.3}
                  color="#ffffff"
                  castShadow={false}
                />
                
                {mode === 'starmap' && (
                  <>
                    {/* Minimal cosmic background for 3D depth */}
                    <Stars radius={200} depth={150} count={2000} factor={2} saturation={0.4} fade speed={0.3} />
                    
                    {/* Deep space fog for 3D perspective */}
                    <fog attach="fog" args={['#000033', 50, 200]} />
                  </>
                )}
                
                {mode === 'fungus' && (
                  <fog attach="fog" args={['#001133', 15, 50]} />
                )}
                
                <CameraController onModeChange={setMode} />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  zoomSpeed={1.2}
                  panSpeed={1.5}
                  rotateSpeed={0.8}
                  maxDistance={100}
                  minDistance={10}
                  maxPolarAngle={Math.PI}
                  minPolarAngle={0}
                  enableDamping={true}
                  dampingFactor={0.08}
                  touches={{
                    ONE: 2, // TOUCH.ROTATE
                    TWO: 1  // TOUCH.DOLLY_PAN
                  }}
                />
                
                {userPositions.map(({ user, position }, index) => (
                  <StarUser
                    key={user.id}
                    user={user}
                    position={position}
                    mode={mode}
                    onClick={handleUserClick}
                  />
                ))}
                
                {mode === 'fungus' && <ConnectionLines users={users} />}
                
                <OrbitControls
                  enableZoom
                  enablePan
                  enableRotate
                  zoomSpeed={1.5}
                  panSpeed={1.2}
                  rotateSpeed={0.8}
                  minDistance={8}
                  maxDistance={60}
                  dampingFactor={0.05}
                  enableDamping
                  autoRotate={mode === 'starmap'}
                  autoRotateSpeed={0.3}
                  target={[0, 0, 0]}
                  makeDefault
                />
              </Suspense>
            </Canvas>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900 via-black to-purple-900">
              <div className="text-center text-white">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading spiritual cosmos...</p>
              </div>
            </div>
          )}
        </CanvasErrorBoundary>
      ) : (
        <div className="bg-gradient-to-b from-black via-purple-950/20 to-black h-full flex items-center justify-center overflow-hidden">
          <div className="text-center text-white max-w-2xl mx-auto p-4 sm:p-8 overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
            <div className="text-6xl sm:text-8xl mb-6">✨</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Spiritual Community Starmap
            </h2>
            <p className="text-purple-300 mb-6 text-base sm:text-lg leading-relaxed">
              Your cosmic community visualization is currently in stable 2D mode for optimal performance.
            </p>
            
            {users.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 px-2">
                {users.slice(0, 8).map((user, index) => (
                  <div 
                    key={user.id}
                    className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="text-2xl mb-2">
                      {user.dominantChakra === 'root' ? '🔴' :
                       user.dominantChakra === 'sacral' ? '🟠' :
                       user.dominantChakra === 'solar' ? '🟡' :
                       user.dominantChakra === 'heart' ? '💚' :
                       user.dominantChakra === 'throat' ? '🔵' :
                       user.dominantChakra === 'third_eye' ? '🟣' :
                       user.dominantChakra === 'crown' ? '⚪' : '✨'}
                    </div>
                    <div className="text-sm font-medium truncate">{user.username}</div>
                    <div className="text-xs text-purple-300">Energy: {user.energy || 0}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation('/community')}
                className="bg-purple-600 hover:bg-purple-700 mr-3"
                data-testid="button-community"
              >
                Explore Community
              </Button>
              <Button 
                onClick={() => setLocation('/')}
                variant="outline"
                className="bg-gray-800/80 border-purple-500/50 text-purple-300 hover:!bg-gray-900 hover:!text-white hover:!border-purple-400"
                data-testid="button-home"
              >
                Return Home
              </Button>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                disabled={true}
                className="bg-gray-600/50 text-gray-400 px-6 py-2 rounded-full cursor-not-allowed"
                data-testid="button-enable-3d"
                title="3D mode temporarily unavailable - working on fixing WebGL compatibility"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                3D Cosmos (Under Maintenance)
              </Button>
              <p className="text-xs text-gray-400">
                3D mode temporarily disabled while we fix compatibility issues
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StarmapVisualizer() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <StarmapScene />
      {/* Enhanced ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Realistic star field background */}
        {Array.from({ length: 50 }).map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const size = Math.random() * 3 + 1;
          const delay = Math.random() * 6000;
          const duration = Math.random() * 3000 + 2000;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-60"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `twinkle ${duration}ms ease-in-out infinite ${delay}ms`,
                boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.8)`,
              }}
            />
          );
        })}
        
        {/* Subtle shooting stars - diagonal meteors with proper comet head direction */}
        <div
          className="absolute w-0.5 h-8 bg-gradient-to-t from-white via-cyan-200 to-transparent opacity-0"
          style={{
            left: '20%',
            top: '15%',
            transform: 'rotate(135deg)', // Diagonal down-right with head at bottom
            transformOrigin: 'bottom center',
            animation: 'shootingStar 15000ms linear infinite 5000ms',
          }}
        />
        <div
          className="absolute w-0.5 h-6 bg-gradient-to-t from-white via-purple-200 to-transparent opacity-0"
          style={{
            left: '70%',
            top: '30%',
            transform: 'rotate(145deg)', // Diagonal down-right with head at bottom
            transformOrigin: 'bottom center',
            animation: 'shootingStar 18000ms linear infinite 25000ms',
          }}
        />
        
        {/* Ethereal gradient overlays */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-purple-900/10"></div>
      </div>
    </div>
  );
}