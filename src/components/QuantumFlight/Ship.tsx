import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

const Ship = () => {
  const { position, rotation, speed } = useGameStore();
  const engineGlowRef = useRef<THREE.PointLight>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const engineParticlesRef = useRef<THREE.Points>(null);
  
  useFrame((state, delta) => {
    if (!engineGlowRef.current || !shieldRef.current || !engineParticlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth engine glow pulsing
    engineGlowRef.current.intensity = 2 + Math.sin(time * 8) * 0.5 + speed * 0.5;
    
    // Dynamic shield rotation and distortion
    shieldRef.current.rotation.y = time * 0.2;
    shieldRef.current.rotation.z = Math.sin(time * 0.8) * 0.15;
    shieldRef.current.scale.set(
      1.5 + Math.sin(time * 2) * 0.05,
      1.5 + Math.cos(time * 2) * 0.05,
      1.5 + Math.sin(time * 2) * 0.05
    );

    // Update engine particles
    const positions = engineParticlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] += delta * (10 + speed * 5);
      if (positions[i + 2] > 5) positions[i + 2] = -5;
    }
    engineParticlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main Hull */}
      <mesh>
        <cylinderGeometry args={[1, 1, 6, 8]} />
        <meshStandardMaterial 
          color="#2a3b4c"
          metalness={0.9}
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
            emissiveIntensity={0.8}
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
              metalness={0.7}
              roughness={0.3}
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
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}

        {/* Engine Glow */}
        <pointLight 
          ref={engineGlowRef}
          color="#22d3ee"
          intensity={2}
          distance={15}
          decay={2}
        />

        {/* Engine Particles */}
        <points ref={engineParticlesRef}>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position"
              count={200}
              array={new Float32Array(600).map(() => (Math.random() - 0.5) * 2)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            color="#22d3ee"
            size={0.05}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      </group>

      {/* Quantum Shield */}
      <mesh ref={shieldRef}>
        <cylinderGeometry args={[2, 2, 8, 16]} />
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

      {/* Speed Effects */}
      {speed > 1 && (
        <group>
          {/* Speed Lines */}
          {[...Array(30)].map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4,
              -10 + i * 0.3
            ]}>
              <boxGeometry args={[0.05, 0.05, 2]} />
              <meshBasicMaterial 
                color="#22d3ee"
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export default Ship;