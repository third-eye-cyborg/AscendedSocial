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
          onClick={() => {/* 3D temporarily disabled */}}
          disabled
          className="bg-gray-600/20 border-gray-400/50 text-gray-400 cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          3D View (Coming Soon)
        </Button>
      </div>

      {/* Status Banner */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-3 bg-black/70 backdrop-blur-md border-purple-500/30">
          <div className="flex items-center space-x-2 text-sm text-white">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <span>2D Cosmos View</span>
          </div>
        </Card>
      </div>

      {/* 2D Starmap Grid */}
      <div className="pt-20 pb-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Spiritual Community Map</h1>
          <p className="text-purple-300">Explore souls in the astral plane</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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

// Chakra color mapping for stars
const chakraColors: Record<string, string> = {
  root: '#ff0000',
  sacral: '#ff8c00',
  solar: '#ffd700',
  heart: '#00ff00',
  throat: '#0088ff',
  third_eye: '#4b0082',
  crown: '#8b00ff',
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

// Get position based on spiritual attributes
const getStarPosition = (user: StarmapUser, index: number): Vector3 => {
  // Safe access to user properties with fallbacks
  const chakraIndex = user?.dominantChakra 
    ? Object.keys(chakraColors).indexOf(user.dominantChakra)
    : (index % 7); // Use index for consistent positioning instead of random
  
  const auraLevel = user?.aura || 0;
  const energyLevel = user?.energy || 500;
  
  // Create clustering based on spiritual attributes with safety checks
  const safeChakraIndex = Number.isFinite(chakraIndex) ? chakraIndex : (index % 7);
  const safeAuraLevel = Number.isFinite(auraLevel) ? auraLevel : 0;
  const safeEnergyLevel = Number.isFinite(energyLevel) ? energyLevel : 500;
  
  const angle = (safeChakraIndex / 7) * Math.PI * 2 + (Math.sin(index) * 0.5);
  const radius = Math.max(5, 10 + (safeAuraLevel / 100) + (index % 5));
  const height = Math.max(-5, Math.min(15, (safeEnergyLevel / 1000) * 10 + (Math.sin(index * 1.5) * 2.5)));
  
  return new Vector3(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
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
  
  useFrame((state, delta) => {
    try {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * (hovered ? 1.0 : 0.3);
        if (hovered) {
          meshRef.current.scale.setScalar(mode === 'starmap' ? 1.5 : 1.3);
        } else {
          meshRef.current.scale.setScalar(1);
        }
      }
    } catch (error) {
      console.warn('Error in StarUser useFrame:', error);
    }
  });

  // Defensive programming for user data
  if (!user?.id) {
    return null;
  }

  const color = (user?.dominantChakra && chakraColors[user.dominantChakra]) ? chakraColors[user.dominantChakra] : '#ffffff';
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
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={hovered ? 0.6 : 0.3}
              roughness={0.3}
              metalness={0.1}
            />
            {hovered && (
              <pointLight 
                position={[0, 0, 0]} 
                color={color} 
                intensity={2} 
                distance={5} 
              />
            )}
          </>
        ) : (
          <>
            <cylinderGeometry args={[size * 0.4, size * 0.2, size * 2, 12]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
              roughness={0.4}
              metalness={0.2}
            />
            <sphereGeometry args={[size * 0.6, 8, 8]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 0.8 : 0.4}
              transparent
              opacity={0.8}
            />
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
        const userColor = new Color(user?.dominantChakra ? chakraColors[user.dominantChakra] : '#ffffff');
        
        user.connections.forEach((connection) => {
          if (!connection?.id) return;
          const connectedUserIndex = users.findIndex(u => u?.id === connection.id);
          if (connectedUserIndex !== -1) {
            const connectedUser = users[connectedUserIndex];
            if (!connectedUser?.id) return;
            const connectedPos = getStarPosition(connectedUser, connectedUserIndex);
            const connectedColor = new Color(connectedUser?.dominantChakra ? chakraColors[connectedUser.dominantChakra] : '#ffffff');
            
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
  
  useFrame(() => {
    const distance = camera.position.distanceTo(new Vector3(0, 0, 0));
    const newMode = distance < 15 ? 'fungus' : 'starmap';
    onModeChange(newMode);
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
  const [enable3D, setEnable3D] = useState(false); // Start with 2D for stability
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
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex space-x-2 mb-3">
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
            onClick={() => setShowFilters(!showFilters)}
            className="bg-black/60 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-900/40"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-black/60 backdrop-blur-sm border-purple-500/30 text-white hover:bg-purple-900/40"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
        
      {/* Filter Panel - Separate positioning to avoid overlap */}
      {showFilters && (
        <div className="absolute top-16 left-4 z-20">
          <Card className="p-3 bg-black/90 backdrop-blur-md border-purple-500/50 shadow-2xl w-64">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-purple-400" />
                  Spiritual Filters
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFilters(false)}
                  className="text-purple-300 hover:text-white p-1 h-6 w-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white font-medium mb-2 block">Chakra Energy</label>
                  <Select onValueChange={(chakra) => setFilters((f) => ({ ...f, chakra: chakra === 'all' ? undefined : chakra }))}>
                    <SelectTrigger className="h-8 text-xs bg-black/60 border-purple-400/50 text-white">
                      <SelectValue placeholder="All Chakras" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-md border-purple-500/50">
                      <SelectItem value="all" className="text-white hover:bg-purple-900/50">All Chakras</SelectItem>
                      {Object.entries(chakraColors).map(([chakra, color]) => (
                        <SelectItem key={chakra} value={chakra} className="text-white hover:bg-purple-900/50">
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
                  <label className="text-xs text-white font-medium mb-2 block">Astrology Sign</label>
                  <Select onValueChange={(sign) => setFilters((f) => ({ ...f, astrologySign: sign === 'all' ? undefined : sign }))}>
                    <SelectTrigger className="h-8 text-xs bg-black/60 border-purple-400/50 text-white">
                      <SelectValue placeholder="All Signs" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-md border-purple-500/50">
                      <SelectItem value="all" className="text-white hover:bg-purple-900/50">All Signs</SelectItem>
                      {['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].map(sign => (
                        <SelectItem key={sign} value={sign} className="text-white hover:bg-purple-900/50">
                          <span className="capitalize text-white">♦ {sign}</span>
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
                    className="w-full text-xs text-purple-300 hover:text-white hover:bg-purple-900/40"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mode indicator */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-3 bg-black/80 backdrop-blur-md border-purple-500/30 shadow-2xl min-w-[260px]">
          <div className="flex items-center space-x-3 text-white mb-2">
            {mode === 'starmap' ? (
              <>
                <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold whitespace-nowrap">Cosmic Starfield</div>
                  <div className="text-xs text-purple-300">Universal Overview</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-green-600/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold whitespace-nowrap">Mycelium Network</div>
                  <div className="text-xs text-green-300">Connection Web</div>
                </div>
              </>
            )}
          </div>
          <div className="text-xs text-gray-300 border-t border-purple-500/20 pt-2">
            {mode === 'starmap' ? '🔍 Zoom in to reveal the fungal network' : '🔍 Zoom out to see the cosmic starfield'}
          </div>
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

      {/* Starmap - 3D temporarily disabled due to WebGL issues */}
      {false ? (
        <CanvasErrorBoundary onRetry={() => {
          setRetryKey(k => k + 1);
          setEnable3D(false); // Fall back to 2D on error
        }}>
          {userPositions.length > 0 ? (
            <Canvas
              key={retryKey}
              camera={{ position: [0, 5, 25], fov: 60 }}
              className="bg-gradient-to-b from-black via-purple-950/20 to-black"
              gl={{ 
                antialias: true, 
                alpha: false,
                powerPreference: "default",
                preserveDrawingBuffer: false,
                stencil: false,
                depth: true
              }}
              onCreated={({ gl, scene, camera }) => {
                try {
                  gl.setClearColor('#000000');
                  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                } catch (error) {
                  console.warn('WebGL setup warning:', error);
                }
              }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={mode === 'starmap' ? 0.1 : 0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.6} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={0.4} color="#06b6d4" />
                
                {mode === 'starmap' && (
                  <>
                    <Stars radius={100} depth={50} count={2000} factor={6} saturation={0.1} fade />
                    <fog attach="fog" args={['#000011', 30, 100]} />
                  </>
                )}
                
                {mode === 'fungus' && (
                  <fog attach="fog" args={['#001122', 10, 40]} />
                )}
                
                <CameraController onModeChange={setMode} />
                
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
                  minDistance={3}
                  maxDistance={60}
                  dampingFactor={0.05}
                  enableDamping
                  autoRotate={mode === 'starmap'}
                  autoRotateSpeed={0.5}
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
        <div className="bg-gradient-to-b from-black via-purple-950/20 to-black h-full">
          <Starmap2DFallback onRetry={() => setEnable3D(true)} />
        </div>
      )}
    </div>
  );
}

export default function StarmapVisualizer() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <StarmapScene />
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-ping delay-1000"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-32 w-3 h-3 bg-pink-400 rounded-full opacity-50 animate-bounce delay-3000"></div>
        <div className="absolute bottom-40 right-40 w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-ping delay-4000"></div>
      </div>
    </div>
  );
}