import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, PerspectiveCamera, useGLTF, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { create } from 'zustand';
import Navigation from '../components/Navigation';

interface GameState {
  speed: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  energy: number;
  setSpeed: (speed: number) => void;
  setPosition: (position: THREE.Vector3) => void;
  setRotation: (rotation: THREE.Euler) => void;
  setEnergy: (energy: number) => void;
}

const useGameStore = create<GameState>((set) => ({
  speed: 0,
  position: new THREE.Vector3(0, 0, -10),
  rotation: new THREE.Euler(0, 0, 0),
  energy: 100,
  setSpeed: (speed) => set({ speed }),
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setEnergy: (energy) => set({ energy }),
}));

function Ship() {
  const { position, rotation, speed } = useGameStore();
  
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1, 0.3, 2]} />
        <meshStandardMaterial color="#ffffff" emissive="#4a148c" emissiveIntensity={2} />
      </mesh>
      <pointLight color="#f72585" intensity={speed * 2} distance={10} position={[0, 0, 1]} />
      <Text
        position={[0, 1, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Quantum Ship
      </Text>
    </group>
  );
}

function QuantumField() {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={2}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} height={300} />
      <ChromaticAberration offset={[0.002, 0.002]} />
    </EffectComposer>
  );
}

function Interface() {
  const { speed, energy } = useGameStore();

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute bottom-8 left-8 bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
        <div className="space-y-2">
          <div>
            <div className="text-sm text-gray-400">Velocidade</div>
            <div className="text-2xl font-mono text-violet-400">
              {(speed * 299792).toFixed(0)} km/s
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Energia Quântica</div>
            <div className="h-2 w-48 bg-violet-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-400 transition-all duration-300"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
        <div className="text-sm text-gray-400 space-y-2">
          <div>W/S - Acelerar/Desacelerar</div>
          <div>A/D - Girar Esquerda/Direita</div>
          <div>Q/E - Rolar</div>
          <div>SPACE - Impulso Quântico</div>
        </div>
      </div>
    </div>
  );
}

export default function QuantumFlightPage() {
  const { setSpeed, setPosition, setRotation, setEnergy } = useGameStore();

  const handleKeyDown = (event: KeyboardEvent) => {
    const { speed, position, rotation, energy } = useGameStore.getState();
    const moveSpeed = 0.1;
    const rotateSpeed = 0.05;

    switch (event.code) {
      case 'KeyW':
        setSpeed(Math.min(speed + 0.1, 1));
        break;
      case 'KeyS':
        setSpeed(Math.max(speed - 0.1, -0.5));
        break;
      case 'KeyA':
        setRotation(new THREE.Euler(rotation.x, rotation.y + rotateSpeed, rotation.z));
        break;
      case 'KeyD':
        setRotation(new THREE.Euler(rotation.x, rotation.y - rotateSpeed, rotation.z));
        break;
      case 'KeyQ':
        setRotation(new THREE.Euler(rotation.x, rotation.y, rotation.z + rotateSpeed));
        break;
      case 'KeyE':
        setRotation(new THREE.Euler(rotation.x, rotation.y, rotation.z - rotateSpeed));
        break;
      case 'Space':
        if (energy >= 10) {
          setSpeed(2);
          setEnergy(energy - 10);
        }
        break;
    }

    // Update position based on current speed and rotation
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyEuler(rotation);
    direction.multiplyScalar(speed * moveSpeed);
    setPosition(position.clone().add(direction));
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="relative h-screen">
        <div className="absolute inset-0 z-10">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            <OrbitControls enableZoom={false} enablePan={false} />
            <ambientLight intensity={0.2} />
            <Suspense fallback={null}>
              <QuantumField />
              <Ship />
              <Effects />
            </Suspense>
          </Canvas>
          <Interface />
        </div>

        <Link
          to="/"
          className="absolute top-24 left-8 z-20 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 bg-violet-900/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-violet-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-violet-900/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-violet-500/20">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Rocket className="text-violet-400" />
            Quantum Flight — Navegação Quântica
          </h1>
        </div>
      </main>
    </div>
  );
}
