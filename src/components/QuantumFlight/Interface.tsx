import React from 'react';
import { Gauge, Rocket, Radio, Shield, Thermometer, Navigation as NavIcon, Compass, Crosshair } from 'lucide-react';

const Interface = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Central HUD */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[800px] h-[800px]">
          {/* Hexagonal Frame */}
          <div className="absolute inset-0 border-2 border-cyan-400/20 transform rotate-90"
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
            }}
          />
          
          {/* Inner Hexagon */}
          <div className="absolute inset-8 border border-cyan-400/30 transform rotate-90"
            style={{
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
            }}
          />

          {/* Targeting Reticle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border border-cyan-400/50 rounded-full" />
              <div className="absolute inset-2 border border-cyan-400/30 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Crosshair className="w-4 h-4 text-cyan-400/70" />
              </div>
            </div>
          </div>

          {/* Telemetry Data */}
          <div className="absolute top-1/4 left-4 text-cyan-400/90 font-mono text-sm">
            <div>X: 299.0 m</div>
            <div>Y: 1.9 m</div>
            <div>Z: 3.0 m</div>
          </div>

          {/* Attitude Indicators */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
            <div className="text-cyan-400/90 font-mono">
              <div className="text-lg">2.5°</div>
              <div className="text-xs">ROLL</div>
              <div className="text-xs text-cyan-400/50">0.0%</div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <div className="text-cyan-400/90 font-mono">
              <div className="text-lg">-1.8°</div>
              <div className="text-xs">YAW</div>
              <div className="text-xs text-cyan-400/50">0.0%</div>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-center">
            <div className="text-cyan-400/90 font-mono">
              <div className="text-lg">-0.4°</div>
              <div className="text-xs">PITCH</div>
              <div className="text-xs text-cyan-400/50">0.0%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Control Pad */}
      <div className="absolute bottom-8 left-8">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/50" />
          
          {/* Direction Buttons */}
          <button className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-8 h-1 bg-white rounded-full transform -translate-y-1" />
          </button>
          
          <button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-8 h-1 bg-white rounded-full transform translate-y-1" />
          </button>
          
          <button className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-1 h-8 bg-white rounded-full transform -translate-x-1" />
          </button>
          
          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-1 h-8 bg-white rounded-full transform translate-x-1" />
          </button>

          {/* Center Button */}
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800/80 rounded-lg flex items-center justify-center hover:bg-slate-700/80 transition-colors">
            <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
          </button>
        </div>
      </div>

      {/* Right Control Pad */}
      <div className="absolute bottom-8 right-8">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/50" />
          
          {/* Rotation Controls */}
          <button className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-24 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-4 h-12 rounded-full border-2 border-white transform rotate-45" />
          </button>
          
          <button className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-24 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-4 h-12 rounded-full border-2 border-white transform -rotate-45" />
          </button>

          {/* Center Button */}
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center hover:bg-slate-700/80 transition-colors">
            <div className="w-4 h-4 bg-cyan-400 rounded-full" />
          </button>
        </div>
      </div>

      {/* Top Status Bars */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-8">
        <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
          <div className="text-xs text-cyan-400/90 mb-1">RANGE</div>
          <div className="text-lg font-mono text-cyan-400">209.1 m</div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
          <div className="text-xs text-cyan-400/90 mb-1">RATE</div>
          <div className="text-lg font-mono text-cyan-400">-0.04 m/s</div>
        </div>
      </div>

      {/* Orientation Sphere */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full" />
          <div className="absolute inset-4 border border-cyan-400/30 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-mono text-cyan-400">3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;