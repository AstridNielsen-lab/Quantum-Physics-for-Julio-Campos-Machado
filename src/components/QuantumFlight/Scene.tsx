import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { create } from 'zustand';

interface GameState {
  speed: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  quantumBoost: boolean;
  setSpeed: (speed: number) => void;
  setPosition: (position: { x: number; y: number; z: number }) => void;
  setRotation: (rotation: { x: number; y: number; z: number }) => void;
  setQuantumBoost: (active: boolean) => void;
}

const useGameStore = create<GameState>((set) => ({
  speed: 0,
  position: { x: 0, y: 10, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  quantumBoost: false,
  setSpeed: (speed) => set({ speed }),
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setQuantumBoost: (active) => set({ quantumBoost: active }),
}));

function DynamicGrid({ count = 20, size = 500, spacing = 25 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { speed } = useGameStore();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const matrix = new THREE.Matrix4();
    
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const x = (i - count / 2) * spacing;
        const z = (j - count / 2) * spacing;
        let y = Math.sin((x / size + time) * 2) * Math.cos((z / size + time) * 2) * 10;
        
        // Add wave effect based on speed
        y += Math.sin(time * speed * 2 + (x + z) / 50) * 5;
        
        matrix.setPosition(x, y, z);
        meshRef.current.setMatrixAt(i * count + j, matrix);
      }
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count * count]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
      />
    </instancedMesh>
  );
}

function QuantumTrail({ length = 20 }) {
  const { speed, position } = useGameStore();
  const points = useRef<THREE.Vector3[]>([]);
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (!lineRef.current) return;
    
    // Add current position to trail
    points.current.unshift(new THREE.Vector3(position.x, position.y, position.z));
    
    // Limit trail length
    if (points.current.length > length) {
      points.current.pop();
    }
    
    // Update line geometry
    const geometry = lineRef.current.geometry;
    const positions = new Float32Array(points.current.length * 3);
    
    points.current.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial
        color="#ec4899"
        linewidth={1}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

function SpaceEnvironment() {
  const { speed } = useGameStore();
  
  return (
    <group>
      <Stars
        radius={300}
        depth={100}
        count={10000}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />
      
      <DynamicGrid />
      <QuantumTrail />
      
      {/* Background nebula */}
      <mesh position={[0, 0, -500]}>
        <sphereGeometry args={[400, 64, 64]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={0.2}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      
      {/* Quantum field effect */}
      {speed > 1 && (
        <mesh>
          <torusGeometry args={[50, 2, 16, 100]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.5}
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

function Ship() {
  const { position, rotation, speed, quantumBoost } = useGameStore();
  
  const springs = useSpring({
    position: [position.x, position.y, position.z],
    rotation: [rotation.x, rotation.y, rotation.z],
    config: { mass: 1, tension: 180, friction: 12 },
  });

  return (
    <animated.group
      position={springs.position}
      rotation={springs.rotation}
    >
      <mesh>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4a148c"
          emissiveIntensity={quantumBoost ? 2 : 0.5}
        />
      </mesh>
      
      {/* Engine glow */}
      <pointLight
        color="#f72585"
        intensity={speed * 2}
        distance={10}
        position={[0, 0, 2]}
      />
      
      {/* Quantum field effect */}
      {speed > 1 && (
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial
            color="#4a148c"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
    </animated.group>
  );
}

const Scene = () => {
  const { camera } = useThree();
  const {
    speed,
    position,
    rotation,
    quantumBoost,
    setSpeed,
    setPosition,
    setRotation,
    setQuantumBoost,
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          setSpeed(Math.min(speed + 0.1, 2));
          break;
        case 'ArrowDown':
          setSpeed(Math.max(speed - 0.1, -1));
          break;
        case 'ArrowLeft':
          setRotation({ ...rotation, y: rotation.y + 0.1 });
          break;
        case 'ArrowRight':
          setRotation({ ...rotation, y: rotation.y - 0.1 });
          break;
        case 'KeyW':
          setPosition({ ...position, y: position.y + 1 });
          break;
        case 'KeyS':
          setPosition({ ...position, y: position.y - 1 });
          break;
        case 'Space':
          setQuantumBoost(true);
          setSpeed(5);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setQuantumBoost(false);
        setSpeed(Math.min(speed, 2));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [speed, position, rotation]);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 10, 20]} />
      <ambientLight intensity={0.2} />
      <Stars
        radius={300}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <SpaceEnvironment />
      <Ship />
      <fog attach="fog" args={['#120458', 50, 400]} />
    </Canvas>
  );
};

export default Scene;