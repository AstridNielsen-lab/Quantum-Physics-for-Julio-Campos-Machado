import React from 'react';
import { create } from 'zustand';
import { Gauge, Rocket, Radio } from 'lucide-react';

interface GameState {
  speed: number;
  quantumBoost: boolean;
}

const useGameStore = create<GameState>((set) => ({
  speed: 0,
  quantumBoost: false,
}));

const Interface = () => {
  const { speed, quantumBoost } = useGameStore();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Speed Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
        <div className="flex items-center gap-4">
          <Gauge className="text-violet-400 w-6 h-6" />
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Velocidade</div>
            <div className="h-2 w-48 bg-violet-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-400 transition-all duration-300"
                style={{ width: `${(speed / 5) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-lg font-mono text-violet-400">
            {(speed * 1000).toFixed(0)} km/s
          </div>
        </div>
      </div>

      {/* Quantum Boost Indicator */}
      <div className="absolute top-8 right-8 bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
        <div className="flex items-center gap-3">
          <Rocket className={`w-6 h-6 ${
            quantumBoost ? 'text-pink-500' : 'text-gray-400'
          }`} />
          <div className="text-sm">
            {quantumBoost ? (
              <span className="text-pink-500">Propulsão Quântica Ativa</span>
            ) : (
              <span className="text-gray-400">Propulsão Normal</span>
            )}
          </div>
        </div>
      </div>

      {/* Distance Radar */}
      <div className="absolute top-8 left-8 bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
        <div className="flex items-center gap-3">
          <Radio className="text-violet-400 w-6 h-6" />
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Distância do Sol</div>
            <div className="text-lg font-mono text-violet-400">
              1.28M km
            </div>
          </div>
        </div>
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-8 right-8 bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
        <div className="text-sm text-gray-400 space-y-2">
          <div>↑↓ Acelerar/Desacelerar</div>
          <div>←→ Girar</div>
          <div>W/S Subir/Descer</div>
          <div>SPACE Propulsão Quântica</div>
        </div>
      </div>
    </div>
  );
};

export default Interface;