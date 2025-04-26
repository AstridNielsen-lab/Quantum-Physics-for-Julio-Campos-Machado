import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import Ship from './Ship';

const Scene = () => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Stars 
        radius={300}
        depth={100}
        count={10000}
        factor={4}
        saturation={0.5}
        fade
        speed={2}
      />
      
      <Ship />
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration 
          offset={[0.002, 0.002]}
        />
      </EffectComposer>

      <fog attach="fog" args={['#000000', 50, 400]} />
    </Canvas>
  );
};

export default Scene;