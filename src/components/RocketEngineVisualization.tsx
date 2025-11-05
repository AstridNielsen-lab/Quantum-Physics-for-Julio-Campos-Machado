import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface RocketEngineVisualizationProps {
  temperature: number;      // K
  exhaustVelocity: number;  // m/s
  thrust: number;           // N
  isRunning: boolean;
}

/**
 * Mapeia temperatura para cor do jato
 * Azul frio -> Branco quente -> Violeta ultra-quente
 */
function temperatureToColor(temp: number): THREE.Color {
  // Normaliza temperatura (300K-4000K)
  const normalized = Math.max(0, Math.min(1, (temp - 300) / 3700));
  
  if (normalized < 0.3) {
    // Azul claro -> Azul
    const t = normalized / 0.3;
    return new THREE.Color().lerpColors(
      new THREE.Color(0x4080ff),
      new THREE.Color(0x2060ff),
      t
    );
  } else if (normalized < 0.6) {
    // Azul -> Branco
    const t = (normalized - 0.3) / 0.3;
    return new THREE.Color().lerpColors(
      new THREE.Color(0x2060ff),
      new THREE.Color(0xffffff),
      t
    );
  } else {
    // Branco -> Violeta
    const t = (normalized - 0.6) / 0.4;
    return new THREE.Color().lerpColors(
      new THREE.Color(0xffffff),
      new THREE.Color(0xcc00ff),
      t
    );
  }
}

/**
 * Componente do corpo do motor
 */
function RocketBody() {
  return (
    <group position={[0, 0, 0]}>
      {/* Câmara de combustão */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2, 32]} />
        <meshStandardMaterial
          color="#404040"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Garganta do bocal */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.3, 0.6, 0.6, 32]} />
        <meshStandardMaterial
          color="#606060"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Bocal de expansão */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[1.2, 0.3, 1.6, 32]} />
        <meshStandardMaterial
          color="#505050"
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      
      {/* Injetores (topo) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.4, 32]} />
        <meshStandardMaterial
          color="#303030"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/**
 * Componente da pluma de escape (jato)
 */
function ExhaustPlume({ 
  temperature, 
  exhaustVelocity, 
  isRunning 
}: { 
  temperature: number; 
  exhaustVelocity: number; 
  isRunning: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  
  // Cria partículas para a pluma
  const { positions, velocities, sizes, colors } = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Posição inicial (boca do bocal)
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -3.0 - Math.random() * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Velocidade (para baixo + spread radial)
      velocities[i * 3] = (Math.random() - 0.5) * 0.3;
      velocities[i * 3 + 1] = -0.5 - Math.random() * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      
      // Tamanho
      sizes[i] = Math.random() * 0.3 + 0.1;
      
      // Cor (será atualizada dinamicamente)
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, velocities, sizes, colors };
  }, []);
  
  // Atualiza partículas
  useFrame((_, delta) => {
    if (!particlesRef.current || !isRunning) return;
    
    timeRef.current += delta;
    const geometry = particlesRef.current.geometry;
    const posArray = geometry.attributes.position.array as Float32Array;
    const colorArray = geometry.attributes.color.array as Float32Array;
    
    const baseColor = temperatureToColor(temperature);
    const velocityFactor = Math.min(1, exhaustVelocity / 4000);
    
    for (let i = 0; i < posArray.length / 3; i++) {
      // Atualiza posição
      posArray[i * 3] += velocities[i * 3] * delta * 10 * velocityFactor;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * 10 * velocityFactor;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * 10 * velocityFactor;
      
      // Reset se saiu da área visível
      if (posArray[i * 3 + 1] < -12) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.8;
        posArray[i * 3] = Math.cos(angle) * radius;
        posArray[i * 3 + 1] = -3.0;
        posArray[i * 3 + 2] = Math.sin(angle) * radius;
      }
      
      // Atualiza cor baseada na distância (fade)
      const distance = Math.abs(posArray[i * 3 + 1] + 3);
      const fade = Math.max(0, 1 - distance / 9);
      
      colorArray[i * 3] = baseColor.r * fade;
      colorArray[i * 3 + 1] = baseColor.g * fade;
      colorArray[i * 3 + 2] = baseColor.b * fade;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        sizeAttenuation
        transparent
        opacity={0.8}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Cone de luz do jato
 */
function ExhaustGlow({ 
  temperature, 
  thrust, 
  isRunning 
}: { 
  temperature: number; 
  thrust: number; 
  isRunning: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  
  useFrame((_, delta) => {
    if (!meshRef.current || !isRunning) return;
    
    timeRef.current += delta;
    const pulsate = Math.sin(timeRef.current * 4) * 0.1 + 0.9;
    meshRef.current.scale.set(1, pulsate, 1);
  });
  
  const color = temperatureToColor(temperature);
  const intensity = Math.min(1, thrust / 100000);
  
  if (!isRunning) return null;
  
  return (
    <mesh ref={meshRef} position={[0, -6, 0]} rotation={[0, 0, 0]}>
      <coneGeometry args={[2, 8, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3 * intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Scene completa
 */
function Scene({ temperature, exhaustVelocity, thrust, isRunning }: RocketEngineVisualizationProps) {
  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#ffffff" />
      
      <RocketBody />
      <ExhaustPlume 
        temperature={temperature} 
        exhaustVelocity={exhaustVelocity}
        isRunning={isRunning}
      />
      <ExhaustGlow 
        temperature={temperature}
        thrust={thrust}
        isRunning={isRunning}
      />
      
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={30}
        target={[0, -2, 0]}
      />
      
      {/* Grid de referência */}
      <gridHelper args={[20, 20, '#444444', '#222222']} position={[0, -12, 0]} />
    </>
  );
}

/**
 * Componente principal de visualização
 */
export default function RocketEngineVisualization(props: RocketEngineVisualizationProps) {
  return (
    <div className="w-full h-[700px] md:h-[760px] rounded-xl overflow-hidden border border-violet-500/20">
      <Canvas
        camera={{ position: [8, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

