import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Gauge, Rocket, Radio, Shield, Thermometer, Navigation as NavIcon, Compass, Crosshair, Map, Eye, ZoomIn, ZoomOut, RotateCcw, Settings, Power, Wifi } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import GalaxyMap from './GalaxyMap';

const Interface = () => {
  const { position, rotation, speed, setRotation, zoom, setZoom, viewMode, setViewMode } = useGameStore();
  const [showGalaxyMap, setShowGalaxyMap] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showPropulsion, setShowPropulsion] = useState(true);

  // Automatic stabilizer effect
  useEffect(() => {
    const stabilize = () => {
      const targetRoll = 0;
      const targetYaw = 0;
      const targetPitch = 0;

      const currentRoll = rotation.x;
      const currentYaw = rotation.y;
      const currentPitch = rotation.z;

      const rollCorrection = Math.abs(currentRoll - targetRoll) > 0.2 ? -currentRoll * 0.1 : 0;
      const yawCorrection = Math.abs(currentYaw - targetYaw) > 0.2 ? -currentYaw * 0.1 : 0;
      const pitchCorrection = Math.abs(currentPitch - targetPitch) > 0.2 ? -currentPitch * 0.1 : 0;

      setRotation(new THREE.Euler(
        currentRoll + rollCorrection,
        currentYaw + yawCorrection,
        currentPitch + pitchCorrection
      ));
    };

    const stabilizerId = setInterval(stabilize, 16);
    return () => clearInterval(stabilizerId);
  }, [rotation, setRotation]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 5));
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };


  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Central HUD */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[800px] h-[800px]">
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

      {/* Control Panel */}
      <div className="absolute top-24 right-8 bottom-24 w-80 pointer-events-auto">
        <div className="h-full bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 space-y-4">
          {/* System Status */}
          <div>
            <button
              onClick={() => setShowSystemStatus(!showSystemStatus)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-cyan-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span>System Status</span>
              </div>
              <Power className="w-4 h-4" />
            </button>
            
            {showSystemStatus && (
              <div className="mt-2 space-y-2 p-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Power</span>
                  <span className="text-green-400">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shields</span>
                  <span className="text-green-400">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Life Support</span>
                  <span className="text-green-400">Optimal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Communications</span>
                  <span className="text-yellow-400">Limited</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div>
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-cyan-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <NavIcon className="w-5 h-5" />
                <span>Navigation</span>
              </div>
              <Compass className="w-4 h-4" />
            </button>
            
            {showNavigation && (
              <div className="mt-2 space-y-2 p-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleViewModeChange('top')}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'top' ? 'bg-cyan-600' : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('side')}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'side' ? 'bg-cyan-600' : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <Eye className="w-4 h-4 transform rotate-90" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('front')}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'front' ? 'bg-cyan-600' : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="flex-1 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors flex items-center justify-center"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="flex-1 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors flex items-center justify-center"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Propulsion Controls */}
          <div>
            <button
              onClick={() => setShowPropulsion(!showPropulsion)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-cyan-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                <span>Propulsion</span>
              </div>
              <Gauge className="w-4 h-4" />
            </button>
            
            {showPropulsion && (
              <div className="mt-2 space-y-2 p-2">
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Quantum Drive</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${(speed / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Field Strength</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div className="h-full w-3/4 bg-cyan-400 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Core Temperature</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div className="h-full w-1/2 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Communications */}
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                <span>Communications</span>
              </div>
              <Wifi className="w-4 h-4" />
            </div>
            <div className="text-sm text-gray-400">
              Last Message: Quantum field stable at 98.3%
            </div>
          </div>
        </div>
      </div>

      {/* Galaxy Map Button */}
      <div className="absolute left-8 bottom-8 pointer-events-auto">
        <button
          onClick={() => setShowGalaxyMap(true)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 text-cyan-400 hover:bg-slate-700/70 transition-colors"
          title="Abrir Mapa da Galáxia"
        >
          <Map className="w-5 h-5" />
          <span>Mapa da Galáxia</span>
        </button>
      </div>

      {/* Galaxy Map Component */}
      <GalaxyMap 
        isVisible={showGalaxyMap}
        onToggle={() => setShowGalaxyMap(!showGalaxyMap)}
        onClose={() => setShowGalaxyMap(false)}
      />
    </div>
  );
};

export default Interface;