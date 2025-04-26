import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import Ship from './Ship';
import { useGameStore } from '../../stores/gameStore';

const CameraController = () => {
  const { camera } = useThree();
  const { position, speed, zoom } = useGameStore();
  const cameraPositionRef = useRef(new THREE.Vector3(0, 5, 10));
  
  useFrame((state, delta) => {
    // Calculate target position with smoother interpolation
    const targetPosition = new THREE.Vector3(
      position.x,
      position.y + 3 + (zoom * 0.2),
      position.z + 8 + (zoom * 0.3)
    );
    
    // Use delta time for frame-rate independent movement
    cameraPositionRef.current.lerp(targetPosition, delta * 5);
    camera.position.copy(cameraPositionRef.current);
    
    // Smooth camera look-at
    const lookAtPos = position.clone();
    camera.lookAt(lookAtPos);

    // Enhanced camera shake based on speed
    if (speed > 1) {
      const time = state.clock.getElapsedTime();
      const shakeIntensity = Math.min(speed * 0.01, 0.1);
      camera.position.y += Math.sin(time * 10) * shakeIntensity;
      camera.position.x += Math.cos(time * 15) * shakeIntensity * 0.5;
    }
  });

  return null;
};

const SpaceEnvironment = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { speed } = useGameStore();
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      // Frame-rate independent star movement
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const speedFactor = speed * delta * 30;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += speedFactor;
        if (positions[i + 2] > 100) positions[i + 2] = -100;
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;
      starsRef.current.rotation.z += delta * speed * 0.01;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={speed > 1 ? 8000 : 5000}
        factor={6}
        saturation={0.8}
        fade
        speed={1}
      />
      
      <mesh position={[0, 0, -500]}>
        <sphereGeometry args={[400, 64, 64]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={0.2 + speed * 0.15}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {speed > 1 && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1000}
              array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 100)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#22d3ee"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      )}

      {speed > 1 && (
        <group>
          {[...Array(30)].map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              -20 - i * 2
            ]}>
              <boxGeometry args={[0.1, 0.1, 2 * speed]} />
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

const Scene = () => {
  const { zoom, setZoom, speed } = useGameStore();

  const handleWheel = (event: WheelEvent) => {
    const zoomSpeed = 0.05;
    const newZoom = Math.max(5, Math.min(20, zoom + event.deltaY * zoomSpeed));
    setZoom(newZoom);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoom]);

  return (
    <Canvas
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      }}
      dpr={[1, 2]} // Optimize for performance and quality
      performance={{ min: 0.5 }} // Allow frame drops for smoother overall experience
    >
      <PerspectiveCamera makeDefault position={[0, 5, 10]} zoom={zoom} />
      <CameraController />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      <SpaceEnvironment />
      <Ship />
      
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          offset={[0.003 * Math.min(1, Math.abs(speed) * 0.3), 0.003 * Math.min(1, Math.abs(speed) * 0.3)]}
        />
      </EffectComposer>

      <fog attach="fog" args={['#000000', 50, 400]} />
    </Canvas>
  );
};

export default Scene;