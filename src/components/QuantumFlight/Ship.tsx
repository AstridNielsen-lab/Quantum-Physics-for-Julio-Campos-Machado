import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

const Ship = () => {
  const shipRef = useRef<THREE.Group>(null);
  const engineGlowRef = useRef<THREE.PointLight>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!shipRef.current || !engineGlowRef.current || !shieldRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Subtle ship hover animation
    shipRef.current.position.y = Math.sin(time) * 0.1;
    
    // Engine glow pulsing
    engineGlowRef.current.intensity = 2 + Math.sin(time * 4) * 0.5;
    
    // Shield hexagon rotation
    shieldRef.current.rotation.y = time * 0.1;
    shieldRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <group ref={shipRef}>
      {/* Main Hull */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 6, 8]} />
        <meshStandardMaterial 
          color="#2a3b4c"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Command Module */}
      <mesh position={[0, 0, -3]}>
        <cylinderGeometry args={[1.2, 1, 2, 8]} />
        <meshStandardMaterial 
          color="#34495e"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Windows */}
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.8,
            Math.sin((i / 4) * Math.PI * 2) * 0.8,
            -3.5
          ]}
        >
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial 
            color="#67e8f9"
            emissive="#67e8f9"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Solar Panels */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 2, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[4, 0.05, 1]} />
            <meshStandardMaterial 
              color="#1e293b"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[3.8, 0.1, 0.1]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      ))}

      {/* Quantum Engine */}
      <group position={[0, 0, 3]}>
        {/* Engine Housing */}
        <mesh>
          <cylinderGeometry args={[1.2, 0.8, 1, 8]} />
          <meshStandardMaterial 
            color="#1e293b"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Engine Rings */}
        {[0.2, 0.4, 0.6].map((pos, i) => (
          <mesh key={i} position={[0, 0, pos]}>
            <torusGeometry args={[1, 0.05, 16, 32]} />
            <meshStandardMaterial 
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={1}
            />
          </mesh>
        ))}

        {/* Engine Glow */}
        <pointLight 
          ref={engineGlowRef}
          color="#22d3ee"
          intensity={2}
          distance={10}
          decay={2}
        />

        {/* Particle System */}
        <points>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position"
              count={100}
              array={new Float32Array(300).map(() => Math.random() * 2 - 1)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            color="#22d3ee"
            size={0.05}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Quantum Shield */}
      <mesh ref={shieldRef} scale={[1.5, 1.5, 1.5]}>
        <cylinderGeometry args={[2, 2, 8, 6]} />
        <meshPhysicalMaterial 
          color="#67e8f9"
          transparent
          opacity={0.1}
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          metalness={1}
        />
      </mesh>

      {/* Ship Name */}
      <Text
        position={[0, 1.2, -2]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        QS Voyager
      </Text>
    </group>
  );
};

export default Ship;