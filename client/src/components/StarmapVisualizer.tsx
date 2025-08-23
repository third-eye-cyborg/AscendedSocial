import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { Group, Vector3, Color, Mesh, BufferGeometry, Material } from 'three';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Sparkles, Eye, Users } from 'lucide-react';
import { useLocation } from 'wouter';

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
  const chakraIndex = user.dominantChakra 
    ? Object.keys(chakraColors).indexOf(user.dominantChakra)
    : Math.random() * 7;
  
  const auraLevel = user.aura || 0;
  const energyLevel = user.energy || 500;
  
  // Create clustering based on spiritual attributes
  const angle = (chakraIndex / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
  const radius = 10 + (auraLevel / 100) + Math.random() * 5;
  const height = (energyLevel / 1000) * 10 + Math.random() * 5 - 2.5;
  
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
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = user.dominantChakra ? chakraColors[user.dominantChakra] : '#ffffff';
  const size = mode === 'starmap' ? 0.3 : 0.8;
  
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
            <meshBasicMaterial color={color} />
          </>
        ) : (
          <>
            <cylinderGeometry args={[0.3, 0.1, 1.5, 8]} />
            <meshLambertMaterial color={color} />
          </>
        )}
      </mesh>
      
      {hovered && (
        <Html>
          <Card className="p-2 max-w-xs bg-black/80 text-white border-purple-500">
            <div className="text-sm font-medium">{user.username || 'Anonymous'}</div>
            <div className="text-xs text-gray-300">
              Aura: {user.aura} | Energy: {user.energy}
            </div>
            {user.dominantChakra && (
              <Badge variant="outline" className="text-xs mt-1">
                {user.dominantChakra} chakra
              </Badge>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {user.connections?.length || 0} connections
            </div>
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
    
    users.forEach((user, index) => {
      if (user.connections && user.connections.length > 0) {
        const userPos = getStarPosition(user, index);
        
        user.connections.forEach((connection) => {
          const connectedUserIndex = users.findIndex(u => u.id === connection.id);
          if (connectedUserIndex !== -1) {
            const connectedPos = getStarPosition(users[connectedUserIndex], connectedUserIndex);
            
            lines.push(
              userPos.x, userPos.y, userPos.z,
              connectedPos.x, connectedPos.y, connectedPos.z
            );
          }
        });
      }
    });
    
    return new Float32Array(lines);
  }, [users]);

  if (positions.length === 0) return null;

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#444" transparent opacity={0.3} />
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

  const { data: users = [], isLoading } = useQuery<StarmapUser[]>({
    queryKey: ['/api/starmap/users', filters],
  });

  const userPositions = useMemo(() => {
    return users.map((user: StarmapUser, index: number) => ({
      user,
      position: getStarPosition(user, index)
    }));
  }, [users]);

  const handleUserClick = (user: StarmapUser) => {
    setLocation(`/profile/${user.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 animate-pulse text-purple-400" />
          <span>Mapping the spiritual cosmos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {/* Filter Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 max-w-xs">
        <Card className="p-3 bg-black/60 backdrop-blur-sm border-purple-500/20">
          <div className="text-sm font-medium text-white mb-2">Spiritual Filters</div>
          
          <div className="space-y-2">
            <Select onValueChange={(chakra) => setFilters((f) => ({ ...f, chakra }))}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Filter by chakra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Chakras</SelectItem>
                {Object.keys(chakraColors).map(chakra => (
                  <SelectItem key={chakra} value={chakra}>
                    <span className="capitalize">{chakra}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(sign) => setFilters((f) => ({ ...f, astrologySign: sign }))}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Astrology sign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Signs</SelectItem>
                <SelectItem value="aries">Aries</SelectItem>
                <SelectItem value="taurus">Taurus</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="cancer">Cancer</SelectItem>
                <SelectItem value="leo">Leo</SelectItem>
                <SelectItem value="virgo">Virgo</SelectItem>
                <SelectItem value="libra">Libra</SelectItem>
                <SelectItem value="scorpio">Scorpio</SelectItem>
                <SelectItem value="sagittarius">Sagittarius</SelectItem>
                <SelectItem value="capricorn">Capricorn</SelectItem>
                <SelectItem value="aquarius">Aquarius</SelectItem>
                <SelectItem value="pisces">Pisces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Mode indicator */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-3 bg-black/60 backdrop-blur-sm border-purple-500/20">
          <div className="flex items-center space-x-2 text-white">
            {mode === 'starmap' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Cosmic View</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span className="text-sm">Connection Network</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {mode === 'starmap' ? 'Zoom in to see connections' : 'Zoom out for cosmic view'}
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3 bg-black/60 backdrop-blur-sm border-purple-500/20">
          <div className="text-sm text-white">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{users.length} souls discovered</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 25], fov: 60 }}
        className="bg-gradient-to-b from-black via-purple-950/20 to-black"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
          
          {mode === 'starmap' && (
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} />
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
            zoomSpeed={2}
            minDistance={5}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function StarmapVisualizer() {
  return <StarmapScene />;
}