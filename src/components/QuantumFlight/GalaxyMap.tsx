import React, { useState, useRef, useEffect } from 'react';
import { Map, Minimize2, Maximize2, Move, Navigation, Target, Zap, Orbit, Star, Globe } from 'lucide-react';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

interface GalaxyMapProps {
  isVisible: boolean;
  onToggle: () => void;
  onClose: () => void;
}

interface CelestialBody {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'station' | 'asteroid';
  x: number;
  y: number;
  radius: number;
  color: string;
  description: string;
  distanceFromEarth: number; // em milhões de km
}

interface Route {
  start: CelestialBody;
  end: CelestialBody;
  distance: number;
  estimatedTime: number; // em horas
  fuelCost: number;
}

const GalaxyMap: React.FC<GalaxyMapProps> = ({ isVisible, onToggle, onClose }) => {
  const { position, setPosition } = useGameStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 100, y: 100 });
  const [selectedStart, setSelectedStart] = useState<CelestialBody | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<CelestialBody | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });
  const [hoveredBody, setHoveredBody] = useState<CelestialBody | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Distância Terra-Marte: ~225 milhões de km (média)
  const EARTH_MARS_DISTANCE = 225;
  const SCALE_FACTOR = 2; // pixels por milhão de km

  // Corpos celestes baseados em distâncias reais do sistema solar
  const celestialBodies: CelestialBody[] = [
    {
      id: 'sol',
      name: 'Sol',
      type: 'star',
      x: 0,
      y: 0,
      radius: 15,
      color: '#FFA500',
      description: 'Estrela central do sistema solar',
      distanceFromEarth: 150 // 1 UA
    },
    {
      id: 'terra',
      name: 'Terra',
      type: 'planet',
      x: 150 * SCALE_FACTOR,
      y: 0,
      radius: 8,
      color: '#4A90E2',
      description: 'Planeta natal da humanidade',
      distanceFromEarth: 0
    },
    {
      id: 'marte',
      name: 'Marte',
      type: 'planet',
      x: (150 + EARTH_MARS_DISTANCE) * SCALE_FACTOR,
      y: 50 * SCALE_FACTOR,
      radius: 6,
      color: '#CD5C5C',
      description: 'Planeta vermelho, primeira colônia',
      distanceFromEarth: EARTH_MARS_DISTANCE
    },
    {
      id: 'venus',
      name: 'Vênus',
      type: 'planet',
      x: 108 * SCALE_FACTOR,
      y: -30 * SCALE_FACTOR,
      radius: 7,
      color: '#FFC649',
      description: 'Planeta mais quente do sistema solar',
      distanceFromEarth: 42
    },
    {
      id: 'jupiter',
      name: 'Júpiter',
      type: 'planet',
      x: 778 * SCALE_FACTOR,
      y: 100 * SCALE_FACTOR,
      radius: 12,
      color: '#D8CA9D',
      description: 'Gigante gasoso com muitas luas',
      distanceFromEarth: 628
    },
    {
      id: 'estacao-alpha',
      name: 'Estação Alpha',
      type: 'station',
      x: 200 * SCALE_FACTOR,
      y: -80 * SCALE_FACTOR,
      radius: 4,
      color: '#00FFFF',
      description: 'Estação espacial comercial',
      distanceFromEarth: 180
    },
    {
      id: 'cinturao-asteroides',
      name: 'Cinturão de Asteroides',
      type: 'asteroid',
      x: 400 * SCALE_FACTOR,
      y: 0,
      radius: 3,
      color: '#8B7355',
      description: 'Região rica em minerais',
      distanceFromEarth: 400
    },
    {
      id: 'proxima-centauri',
      name: 'Proxima Centauri',
      type: 'star',
      x: -800 * SCALE_FACTOR,
      y: -600 * SCALE_FACTOR,
      radius: 10,
      color: '#FF6B6B',
      description: 'Estrela mais próxima do Sol',
      distanceFromEarth: 40208000000 // 4.24 anos-luz em milhões de km
    }
  ];

  const calculateRoute = (start: CelestialBody, end: CelestialBody): Route => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy) / SCALE_FACTOR; // em milhões de km
    
    // Cálculos baseados em propulsão quântica fictícia
    const quantumSpeed = 50000; // km/h
    const estimatedTime = (distance * 1000000) / quantumSpeed; // em horas
    const fuelCost = Math.ceil(distance / 10); // custo simplificado
    
    return {
      start,
      end,
      distance,
      estimatedTime,
      fuelCost
    };
  };

  const handleBodyClick = (body: CelestialBody) => {
    if (!selectedStart) {
      setSelectedStart(body);
    } else if (!selectedEnd && body.id !== selectedStart.id) {
      setSelectedEnd(body);
      const route = calculateRoute(selectedStart, body);
      setCurrentRoute(route);
    } else {
      // Reset selection
      setSelectedStart(body);
      setSelectedEnd(null);
      setCurrentRoute(null);
    }
  };

  const clearRoute = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setCurrentRoute(null);
  };

  const executeRoute = () => {
    if (currentRoute) {
      // Simular navegação para o destino
      const newPos = {
        x: currentRoute.end.x / SCALE_FACTOR,
        y: 0,
        z: currentRoute.end.y / SCALE_FACTOR
      };
      setPosition(new THREE.Vector3(newPos.x, newPos.y, newPos.z));
      clearRoute();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as Element).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-30 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/40 rounded-lg overflow-hidden pointer-events-auto"
      style={{
        left: mapPosition.x,
        top: mapPosition.y,
        width: isMinimized ? '300px' : '600px',
        height: isMinimized ? '200px' : '500px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-3 border-b border-cyan-500/30 bg-slate-800/50">
        <div className="flex items-center gap-2 text-cyan-400">
          <Map className="w-5 h-5" />
          <h3 className="font-semibold">Mapa da Galáxia</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-cyan-700/30 rounded transition-colors"
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-700/30 rounded transition-colors text-red-400"
            title="Fechar"
          >
            ×
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between p-2 bg-slate-800/30 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom(0.2)}
                className="px-2 py-1 bg-cyan-900/50 hover:bg-cyan-800/70 rounded text-xs transition-colors"
              >
                +
              </button>
              <span className="text-xs text-cyan-400">{(zoomLevel * 100).toFixed(0)}%</span>
              <button
                onClick={() => handleZoom(-0.2)}
                className="px-2 py-1 bg-cyan-900/50 hover:bg-cyan-800/70 rounded text-xs transition-colors"
              >
                -
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearRoute}
                className="px-3 py-1 bg-red-900/50 hover:bg-red-800/70 rounded text-xs transition-colors"
              >
                Limpar
              </button>
              {currentRoute && (
                <button
                  onClick={executeRoute}
                  className="px-3 py-1 bg-green-900/50 hover:bg-green-800/70 rounded text-xs transition-colors"
                >
                  Navegar
                </button>
              )}
            </div>
          </div>

          {/* Map Area */}
          <div className="relative overflow-hidden bg-black/70" style={{ height: '360px' }}>
            <div
              ref={mapRef}
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomLevel}) translate(${mapCenter.x}px, ${mapCenter.y}px)`,
                transformOrigin: 'center center'
              }}
            >
              <svg width="100%" height="100%" viewBox="-1000 -800 2000 1600" className="absolute inset-0">
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Orbit lines */}
                {celestialBodies.filter(body => body.type === 'planet').map(body => (
                  <circle
                    key={`orbit-${body.id}`}
                    cx="0"
                    cy="0"
                    r={Math.sqrt(body.x * body.x + body.y * body.y)}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="5,5"
                  />
                ))}
                
                {/* Route line */}
                {selectedStart && selectedEnd && (
                  <line
                    x1={selectedStart.x}
                    y1={selectedStart.y}
                    x2={selectedEnd.x}
                    y2={selectedEnd.y}
                    stroke="#00ff00"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    opacity="0.8"
                  />
                )}
                
                {/* Celestial bodies */}
                {celestialBodies.map(body => (
                  <g key={body.id}>
                    <circle
                      cx={body.x}
                      cy={body.y}
                      r={body.radius}
                      fill={body.color}
                      stroke={selectedStart?.id === body.id ? '#00ff00' : selectedEnd?.id === body.id ? '#ff0000' : '#ffffff'}
                      strokeWidth={selectedStart?.id === body.id || selectedEnd?.id === body.id ? '3' : '1'}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleBodyClick(body)}
                    />
                    {body.type === 'star' && (
                      <circle
                        cx={body.x}
                        cy={body.y}
                        r={body.radius * 1.5}
                        fill={body.color}
                        opacity="0.3"
                        className="animate-pulse"
                      />
                    )}
                    <text
                      x={body.x}
                      y={body.y + body.radius + 15}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#22d3ee"
                      className="pointer-events-none"
                    >
                      {body.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-black/80 rounded p-2 text-xs">
            <div className="text-cyan-400 font-semibold mb-1">Legenda</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-300">Estrelas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Planetas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span className="text-gray-300">Estações</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-700"></div>
                <span className="text-gray-300">Asteroides</span>
              </div>
            </div>
          </div>

          {/* Route Info */}
          {currentRoute && (
            <div className="p-3 bg-slate-800/50 border-t border-cyan-500/30">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rota:</span>
                  <span className="text-cyan-400">{currentRoute.start.name} → {currentRoute.end.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Distância:</span>
                  <span className="text-cyan-400">{currentRoute.distance.toFixed(1)} milhões km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tempo estimado:</span>
                  <span className="text-cyan-400">{(currentRoute.estimatedTime / 24).toFixed(1)} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Combustível:</span>
                  <span className="text-cyan-400">{currentRoute.fuelCost} unidades</span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!currentRoute && (
            <div className="p-3 bg-slate-800/30 border-t border-cyan-500/20">
              <div className="text-xs text-gray-400 text-center">
                Clique em um corpo celeste para selecionar origem, depois clique em outro para destino
              </div>
            </div>
          )}
        </>
      )}

      {isMinimized && (
        <div className="p-3">
          <div className="text-sm text-cyan-400">
            {selectedStart && selectedEnd ? (
              <div>
                <div>Rota: {selectedStart.name} → {selectedEnd.name}</div>
                <div>Distância: {currentRoute?.distance.toFixed(1)} milhões km</div>
              </div>
            ) : (
              <div>Selecione origem e destino</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyMap;

