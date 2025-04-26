import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Gauge, Rocket, Radio, Shield, Thermometer, Navigation as NavIcon, Compass, Crosshair } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

const Interface = () => {
  const { position, rotation, speed, setRotation } = useGameStore();

  // Automatic stabilizer effect
  useEffect(() => {
    const stabilize = () => {
      // Target values for perfect stabilization (center position)
      const targetRoll = 0;
      const targetYaw = 0;
      const targetPitch = 0;

      // Current rotation values
      const currentRoll = rotation.x;
      const currentYaw = rotation.y;
      const currentPitch = rotation.z;

      // Calculate correction factors (similar to the 0.2 threshold shown in the image)
      const rollCorrection = Math.abs(currentRoll - targetRoll) > 0.2 ? -currentRoll * 0.1 : 0;
      const yawCorrection = Math.abs(currentYaw - targetYaw) > 0.2 ? -currentYaw * 0.1 : 0;
      const pitchCorrection = Math.abs(currentPitch - targetPitch) > 0.2 ? -currentPitch * 0.1 : 0;

      // Apply corrections smoothly
      setRotation(new THREE.Euler(
        currentRoll + rollCorrection,
        currentYaw + yawCorrection,
        currentPitch + pitchCorrection
      ));
    };

    const stabilizerId = setInterval(stabilize, 16); // ~60fps
    return () => clearInterval(stabilizerId);
  }, [rotation, setRotation]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Central HUD */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[800px] h-[800px]">
          {/* Circular Interface (inspired by the docking interface) */}
          <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full">
            {/* Roll Indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
              <div className="text-cyan-400/90 font-mono">
                <div className="text-lg">{(rotation.x * (180/Math.PI)).toFixed(1)}°</div>
                <div className="text-xs">ROLL</div>
                <div className={`text-xs ${Math.abs(rotation.x) < 0.2 ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  {Math.abs(rotation.x) < 0.2 ? 'STABLE' : 'CORRECTING'}
                </div>
              </div>
            </div>

            {/* Yaw Indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
              <div className="text-cyan-400/90 font-mono">
                <div className="text-lg">{(rotation.y * (180/Math.PI)).toFixed(1)}°</div>
                <div className="text-xs">YAW</div>
                <div className={`text-xs ${Math.abs(rotation.y) < 0.2 ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  {Math.abs(rotation.y) < 0.2 ? 'STABLE' : 'CORRECTING'}
                </div>
              </div>
            </div>

            {/* Pitch Indicator */}
            <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2">
              <div className="text-cyan-400/90 font-mono">
                <div className="text-lg">{(rotation.z * (180/Math.PI)).toFixed(1)}°</div>
                <div className="text-xs">PITCH</div>
                <div className={`text-xs ${Math.abs(rotation.z) < 0.2 ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  {Math.abs(rotation.z) < 0.2 ? 'STABLE' : 'CORRECTING'}
                </div>
              </div>
            </div>

            {/* Distance Markers */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/90 font-mono">
              <div>X: {position.x.toFixed(1)} m</div>
              <div>Y: {position.y.toFixed(1)} m</div>
              <div>Z: {position.z.toFixed(1)} m</div>
            </div>

            {/* Speed Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                <div className="text-xs text-cyan-400/90 mb-1">SPEED</div>
                <div className="text-lg font-mono text-cyan-400">{speed.toFixed(2)} m/s</div>
              </div>
            </div>

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

            {/* Stabilization Status */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
              <div className="text-xs text-cyan-400/90 mb-1">STABILIZER</div>
              <div className={`text-lg font-mono ${
                Math.abs(rotation.x) < 0.2 && 
                Math.abs(rotation.y) < 0.2 && 
                Math.abs(rotation.z) < 0.2 
                  ? 'text-green-400'
                  : 'text-cyan-400'
              }`}>
                {Math.abs(rotation.x) < 0.2 && 
                 Math.abs(rotation.y) < 0.2 && 
                 Math.abs(rotation.z) < 0.2 
                  ? 'LOCKED'
                  : 'CORRECTING'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Pads */}
      <div className="absolute bottom-8 left-8">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/50" />
          
          {/* Direction Controls */}
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

          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800/80 rounded-lg flex items-center justify-center hover:bg-slate-700/80 transition-colors">
            <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
          </button>
        </div>
      </div>

      {/* Right Control Pad */}
      <div className="absolute bottom-8 right-8">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 bg-slate-700/50 rounded-full backdrop-blur-sm border border-slate-600/50" />
          
          <button className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-24 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-4 h-12 rounded-full border-2 border-white transform rotate-45" />
          </button>
          
          <button className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-24 bg-slate-600/80 rounded-full flex items-center justify-center hover:bg-slate-500/80 transition-colors">
            <div className="w-4 h-12 rounded-full border-2 border-white transform -rotate-45" />
          </button>

          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center hover:bg-slate-700/80 transition-colors">
            <div className="w-4 h-4 bg-cyan-400 rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interface;