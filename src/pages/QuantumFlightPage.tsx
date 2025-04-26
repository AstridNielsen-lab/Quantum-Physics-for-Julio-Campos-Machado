import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Scene from '../components/QuantumFlight/Scene';
import Interface from '../components/QuantumFlight/Interface';
import { useGameStore } from '../stores/gameStore';

const QuantumFlightPage = () => {
  const { setSpeed, setPosition, setRotation } = useGameStore();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const moveSpeed = 0.1;
    const rotateSpeed = 0.05;

    switch (event.code) {
      case 'KeyW':
        setSpeed(1);
        break;
      case 'KeyS':
        setSpeed(-0.5);
        break;
      case 'KeyA':
        setRotation(new THREE.Euler(0, rotateSpeed, 0));
        break;
      case 'KeyD':
        setRotation(new THREE.Euler(0, -rotateSpeed, 0));
        break;
      case 'Space':
        setSpeed(2);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white" onKeyDown={handleKeyDown} tabIndex={0}>
      <Navigation />
      
      <main className="relative h-screen">
        <div className="absolute inset-0 z-10">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <Interface />
        </div>

        <Link
          to="/"
          className="absolute top-24 left-8 z-20 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 bg-violet-900/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-violet-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
      </main>
    </div>
  );
};

export default QuantumFlightPage;