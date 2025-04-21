import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Rocket, Navigation as NavIcon, Compass, Plane as Planet, Sun, Moon, Crosshair, Pause, Play, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface CelestialBody {
  name: string;
  distance: number;
  radius: number;
  color: string;
  orbitalPeriod: number;
  orbitalSpeed: number;
  rotationPeriod: number;
  tilt: number;
}

const AU_TO_KM = 149597870.7;

const celestialBodies: CelestialBody[] = [
  { 
    name: "Sol",
    distance: 0,
    radius: 30,
    color: "#fef08a",
    orbitalPeriod: 0,
    orbitalSpeed: 0,
    rotationPeriod: 27,
    tilt: 7.25
  },
  {
    name: "Mercúrio",
    distance: 0.387,
    radius: 8,
    color: "#7dd3fc",
    orbitalPeriod: 0.24,
    orbitalSpeed: 47.87,
    rotationPeriod: 58.6,
    tilt: 0.034
  },
  {
    name: "Vênus",
    distance: 0.723,
    radius: 12,
    color: "#fda4af",
    orbitalPeriod: 0.62,
    orbitalSpeed: 35.02,
    rotationPeriod: -243,
    tilt: 177.4
  },
  {
    name: "Terra",
    distance: 1,
    radius: 12,
    color: "#67e8f9",
    orbitalPeriod: 1,
    orbitalSpeed: 29.78,
    rotationPeriod: 1,
    tilt: 23.44
  },
  {
    name: "Marte",
    distance: 1.524,
    radius: 10,
    color: "#f87171",
    orbitalPeriod: 1.88,
    orbitalSpeed: 24.13,
    rotationPeriod: 1.03,
    tilt: 25.19
  },
  {
    name: "Júpiter",
    distance: 5.203,
    radius: 20,
    color: "#fdba74",
    orbitalPeriod: 11.86,
    orbitalSpeed: 13.07,
    rotationPeriod: 0.41,
    tilt: 3.13
  },
  {
    name: "Saturno",
    distance: 9.537,
    radius: 18,
    color: "#fcd34d",
    orbitalPeriod: 29.46,
    orbitalSpeed: 9.68,
    rotationPeriod: 0.45,
    tilt: 26.73
  },
  {
    name: "Urano",
    distance: 19.191,
    radius: 14,
    color: "#93c5fd",
    orbitalPeriod: 84.01,
    orbitalSpeed: 6.80,
    rotationPeriod: -0.72,
    tilt: 97.77
  },
  {
    name: "Netuno",
    distance: 30.069,
    radius: 14,
    color: "#818cf8",
    orbitalPeriod: 164.79,
    orbitalSpeed: 5.43,
    rotationPeriod: 0.67,
    tilt: 28.32
  }
];

const QuantumPropulsionPage = () => {
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(50);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(celestialBodies[3]);
  const [targetBody, setTargetBody] = useState<CelestialBody | null>(celestialBodies[4]);
  const [showPath, setShowPath] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showRotation, setShowRotation] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [flowSpeed, setFlowSpeed] = useState(0);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    x: number;
    y: number;
    au: number;
    km: number;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const calculatePosition = (body: CelestialBody, time: number) => {
    if (body.distance === 0) return { x: 0, y: 0 };
    
    const angle = (time / body.orbitalPeriod) * Math.PI * 2;
    const x = Math.cos(angle) * body.distance * scale;
    const y = Math.sin(angle) * body.distance * scale;
    
    return { x, y };
  };

  const drawSolarSystem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const gridSize = 50;
    const time = Date.now() / (1000 / animationSpeed);
    
    for (let y = 0; y < height; y += gridSize) {
      const opacity = 0.1 + Math.sin(y * 0.01 + time) * 0.05;
      ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let x = 0; x < width; x += gridSize) {
      const opacity = 0.1 + Math.sin(x * 0.01 + time) * 0.05;
      ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.font = '10px monospace';
    for (let x = 0; x < width; x += gridSize) {
      const coordX = ((x - centerX) / scale).toFixed(1);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 5;
      ctx.fillText(coordX, x, height - 5);
    }

    for (let y = 0; y < height; y += gridSize) {
      const coordY = ((centerY - y) / scale).toFixed(1);
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 5;
      ctx.fillText(coordY, 5, y);
    }

    if (showOrbits) {
      celestialBodies.forEach(body => {
        if (body.distance > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, body.distance * scale, 0, Math.PI * 2);
          
          const gradient = ctx.createLinearGradient(
            centerX - body.distance * scale,
            centerY,
            centerX + body.distance * scale,
            centerY
          );
          
          gradient.addColorStop(0, `${body.color}00`);
          gradient.addColorStop(0.5, `${body.color}66`);
          gradient.addColorStop(1, `${body.color}00`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.shadowColor = body.color;
          ctx.shadowBlur = 10;
          ctx.stroke();
        }
      });
    }

    celestialBodies.forEach(body => {
      const pos = calculatePosition(body, time);
      
      if (body.distance > 0) {
        const trailLength = 32;
        const trailStep = 0.01;
        
        for (let i = 0; i < trailLength; i++) {
          const trailPos = calculatePosition(body, time - i * trailStep);
          const alpha = 1 - (i / trailLength);
          
          ctx.fillStyle = `${body.color}${Math.floor(alpha * 40).toString(16).padStart(2, '0')}`;
          ctx.shadowColor = body.color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(
            centerX + trailPos.x,
            centerY + trailPos.y,
            2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      const x = centerX + pos.x;
      const y = centerY + pos.y;
      
      ctx.shadowColor = body.color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(body.name, x, y + body.radius + 15);

      if (selectedBody === body || targetBody === body) {
        ctx.fillStyle = '#a855f7';
        ctx.font = '10px monospace';
        ctx.fillText(`${body.orbitalSpeed.toFixed(2)} km/s`, x, y + body.radius + 30);
      }
    });

    if (selectedCoordinate) {
      ctx.beginPath();
      ctx.arc(
        centerX + selectedCoordinate.x,
        centerY + selectedCoordinate.y,
        5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#ec4899';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX + selectedCoordinate.x - 10, centerY + selectedCoordinate.y);
      ctx.lineTo(centerX + selectedCoordinate.x + 10, centerY + selectedCoordinate.y);
      ctx.moveTo(centerX + selectedCoordinate.x, centerY + selectedCoordinate.y - 10);
      ctx.lineTo(centerX + selectedCoordinate.x, centerY + selectedCoordinate.y + 10);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (selectedBody && targetBody && showPath) {
      const startPos = calculatePosition(selectedBody, time);
      const endPos = calculatePosition(targetBody, time);
      
      ctx.beginPath();
      ctx.moveTo(centerX + startPos.x, centerY + startPos.y);
      
      const midX = (startPos.x + endPos.x) / 2;
      const midY = (startPos.y + endPos.y) / 2;
      const curvature = 0.3;
      
      ctx.quadraticCurveTo(
        centerX + midX,
        centerY + midY + (Math.abs(endPos.x - startPos.x) * curvature),
        centerX + endPos.x,
        centerY + endPos.y
      );
      
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      const dx = endPos.x - startPos.x;
      const dy = endPos.y - startPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy) / scale;
      const distanceKm = distance * AU_TO_KM;

      ctx.fillStyle = '#a855f7';
      ctx.font = '14px monospace';
      const travelTime = (distanceKm / (selectedBody.orbitalSpeed * 3600)).toFixed(2);
      ctx.fillText(
        `Distância: ${distance.toFixed(2)} AU (${(distanceKm / 1000000).toFixed(1)} milhões km)`,
        centerX,
        height - 60
      );
      ctx.fillText(
        `Tempo estimado: ${travelTime} horas`,
        centerX,
        height - 40
      );
    }

    if (mousePosition) {
      ctx.strokeStyle = '#22d3ee44';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mousePosition.x, 0);
      ctx.lineTo(mousePosition.x, height);
      ctx.moveTo(0, mousePosition.y);
      ctx.lineTo(width, mousePosition.y);
      ctx.stroke();
    }

    if (!isPaused && !isStopped) {
      setTime(t => t + 0.01);
    }
    
    if (!isStopped) {
      animationRef.current = requestAnimationFrame(drawSolarSystem);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;
    
    const distanceAU = Math.sqrt(x * x + y * y) / scale;
    const distanceKM = distanceAU * AU_TO_KM;
    
    setSelectedCoordinate({
      x: x,
      y: y,
      au: distanceAU,
      km: distanceKM
    });
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleStop = () => {
    setIsStopped(true);
    setIsPaused(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleResume = () => {
    setIsStopped(false);
    setIsPaused(false);
    drawSolarSystem();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    if (!isStopped) {
      drawSolarSystem();
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scale, selectedBody, targetBody, showPath, showOrbits, showRotation, animationSpeed, isPaused, isStopped]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-12 flex items-center gap-3">
            <Rocket className="text-violet-400" />
            Navegação Quântica Interestelar
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Origem</h2>
                <select
                  value={selectedBody?.name || ''}
                  onChange={(e) => setSelectedBody(celestialBodies.find(b => b.name === e.target.value) || null)}
                  className="w-full bg-violet-900/20 border border-violet-500/20 rounded-lg p-2 text-white"
                >
                  <option value="">Selecione um corpo celeste</option>
                  {celestialBodies.map(body => (
                    <option key={body.name} value={body.name}>{body.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Destino</h2>
                <select
                  value={targetBody?.name || ''}
                  onChange={(e) => setTargetBody(celestialBodies.find(b => b.name === e.target.value) || null)}
                  className="w-full bg-violet-900/20 border border-violet-500/20 rounded-lg p-2 text-white"
                >
                  <option value="">Selecione um corpo celeste</option>
                  {celestialBodies.map(body => (
                    <option key={body.name} value={body.name}>{body.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Controles</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Escala de Visualização
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Velocidade da Animação
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                        className="flex-1 h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                        title={isPaused ? "Continuar" : "Pausar"}
                      >
                        {isPaused ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <Pause className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={isStopped ? handleResume : handleStop}
                        className="p-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                        title={isStopped ? "Reiniciar" : "Parar"}
                      >
                        {isStopped ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="text-right text-violet-400 mt-1">
                      {animationSpeed.toFixed(1)}x
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Velocidade do Fluxo
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={flowSpeed}
                      onChange={(e) => setFlowSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {flowSpeed >= 0 ? `+${flowSpeed.toFixed(1)}` : flowSpeed.toFixed(1)}x
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showPath"
                      checked={showPath}
                      onChange={(e) => setShowPath(e.target.checked)}
                      className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="showPath" className="text-sm text-gray-300">
                      Mostrar Trajetória
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showOrbits"
                      checked={showOrbits}
                      onChange={(e) => setShowOrbits(e.target.checked)}
                      className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="showOrbits" className="text-sm text-gray-300">
                      Mostrar Órbitas
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showRotation"
                      checked={showRotation}
                      onChange={(e) => setShowRotation(e.target.checked)}
                      className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="showRotation" className="text-sm text-gray-300">
                      Mostrar Rotação
                    </label>
                  </div>
                </div>
              </div>

              {selectedCoordinate && (
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Crosshair className="text-violet-400" />
                    Coordenadas Selecionadas
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">X:</span>
                      <span className="text-violet-400 font-mono">
                        {(selectedCoordinate.x / scale).toFixed(3)} AU
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Y:</span>
                      <span className="text-violet-400 font-mono">
                        {(-selectedCoordinate.y / scale).toFixed(3)} AU
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distância:</span>
                      <span className="text-violet-400 font-mono">
                        {selectedCoordinate.au.toFixed(3)} AU
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distância (km):</span>
                      <span className="text-violet-400 font-mono">
                        {(selectedCoordinate.km / 1000000).toFixed(1)}M km
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  className="w-full h-[600px] bg-[#020617] rounded-lg cursor-crosshair"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Clique em qualquer ponto para obter coordenadas precisas</p>
                  <p>• Coordenadas em Unidades Astronômicas (AU) e quilômetros</p>
                  <p>• Animação baseada em dados reais de órbita e rotação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default QuantumPropulsionPage;