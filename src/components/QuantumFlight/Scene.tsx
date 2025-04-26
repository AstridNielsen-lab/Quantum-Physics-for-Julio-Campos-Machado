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
  
  useFrame(() => {
    // Calculate target position based on ship's position and direction
    const targetPosition = new THREE.Vector3(
      position.x,
      position.y + 5,
      position.z + 10 + (zoom * 0.5) // Adjust camera distance based on zoom
    );
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition, 0.1);
    camera.lookAt(position);

    // Add camera shake based on speed
    if (speed > 1) {
      const shake = Math.sin(Date.now() * 0.01) * 0.02 * speed;
      camera.position.y += shake;
      camera.position.x += Math.cos(Date.now() * 0.02) * 0.01 * speed;
    }
  });

  return null;
};

const SpaceEnvironment = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { speed } = useGameStore();

  useFrame(() => {
    if (starsRef.current) {
      // Move stars based on ship speed to create travel effect
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += speed * 0.5; // Increased star movement speed
        if (positions[i + 2] > 100) positions[i + 2] = -100;
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;

      // Rotate stars slightly for additional effect
      starsRef.current.rotation.z += speed * 0.0001;
    }
  });

  return (
    <group>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={speed > 1 ? 7000 : 5000} // More stars at higher speeds
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />
      
      {/* Space nebula effect */}
      <mesh position={[0, 0, -500]}>
        <sphereGeometry args={[400, 64, 64]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={0.2 + speed * 0.1}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* Speed trails */}
      {speed > 1 && (
        <group>
          {[...Array(20)].map((_, i) => (
            <mesh key={i} position={[0, 0, -10 + i * -2]}>
              <boxGeometry args={[0.1, 0.1, 2 * speed]} />
              <meshBasicMaterial 
                color="#22d3ee"
                transparent
                opacity={0.3}
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
    // Adjust zoom with mouse wheel
    const newZoom = Math.max(5, Math.min(20, zoom + event.deltaY * 0.01));
    setZoom(newZoom);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoom]);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} zoom={zoom} />
      <CameraController />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <SpaceEnvironment />
      <Ship />
      
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          offset={[0.002 * Math.min(1, Math.abs(speed) * 0.2), 0.002 * Math.min(1, Math.abs(speed) * 0.2)]}
        />
      </EffectComposer>

      <fog attach="fog" args={['#000000', 50, 400]} />
    </Canvas>
  );
};

export default Scene;