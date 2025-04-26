import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Gauge, Rocket, Radio, Shield, Thermometer, Navigation as NavIcon, Compass, Crosshair, Map, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

const Interface = () => {
  const { position, rotation, speed, setRotation, zoom, setZoom, viewMode, setViewMode } = useGameStore();
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ x: number, y: number } | null>(null);

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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!startPoint) {
      setStartPoint({ x, y });
    } else if (!endPoint) {
      setEndPoint({ x, y });
    }
  };

  const resetRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
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

      {/* View Controls */}
      <div className="absolute top-24 right-8 pointer-events-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm p-2 rounded-lg border border-slate-700/50 space-y-2">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-cyan-400 hover:bg-slate-700/50 rounded transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-cyan-400 hover:bg-slate-700/50 rounded transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="h-px bg-slate-700/50" />
          <button
            onClick={() => handleViewModeChange('top')}
            className={`w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 rounded transition-colors ${
              viewMode === 'top' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleViewModeChange('side')}
            className={`w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 rounded transition-colors ${
              viewMode === 'side' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Eye className="w-5 h-5 transform rotate-90" />
          </button>
          <button
            onClick={() => handleViewModeChange('front')}
            className={`w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 rounded transition-colors ${
              viewMode === 'front' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Route Map Toggle */}
      <button
        onClick={() => setShowRouteMap(!showRouteMap)}
        className="absolute top-24 left-8 pointer-events-auto bg-slate-800/50 backdrop-blur-sm p-2 rounded-lg border border-slate-700/50 text-cyan-400 hover:bg-slate-700/50 transition-colors"
      >
        <Map className="w-5 h-5" />
      </button>

      {/* Route Map */}
      {showRouteMap && (
        <div className="absolute top-40 left-8 pointer-events-auto bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-cyan-400 font-semibold">Route Planner</h3>
            <button
              onClick={resetRoute}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div
            className="w-full h-64 bg-slate-900/50 rounded-lg border border-slate-700/50 relative"
            onClick={handleMapClick}
          >
            {startPoint && (
              <div
                className="absolute w-3 h-3 bg-green-400 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ left: startPoint.x, top: startPoint.y }}
              />
            )}
            {endPoint && (
              <div
                className="absolute w-3 h-3 bg-red-400 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ left: endPoint.x, top: endPoint.y }}
              />
            )}
            {startPoint && endPoint && (
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="#22d3ee"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Click to set start and end points for your quantum jump route
          </div>
        </div>
      )}
    </div>
  );
};

export default Interface;