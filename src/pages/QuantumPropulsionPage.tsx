import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Rocket, Navigation as NavIcon, Compass, Plane as Planet, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface CelestialBody {
  name: string;
  distance: number; // in AU
  radius: number; // in pixels for display
  color: string;
  orbitalPeriod: number; // in Earth years
}

const AU_TO_KM = 149597870.7; // 1 AU in kilometers

const celestialBodies: CelestialBody[] = [
  { name: "Sol", distance: 0, radius: 30, color: "#fbbf24", orbitalPeriod: 0 },
  { name: "Mercúrio", distance: 0.387, radius: 8, color: "#94a3b8", orbitalPeriod: 0.24 },
  { name: "Vênus", distance: 0.723, radius: 12, color: "#fcd34d", orbitalPeriod: 0.62 },
  { name: "Terra", distance: 1, radius: 12, color: "#60a5fa", orbitalPeriod: 1 },
  { name: "Marte", distance: 1.524, radius: 10, color: "#ef4444", orbitalPeriod: 1.88 },
  { name: "Júpiter", distance: 5.203, radius: 20, color: "#f97316", orbitalPeriod: 11.86 },
  { name: "Saturno", distance: 9.537, radius: 18, color: "#eab308", orbitalPeriod: 29.46 },
  { name: "Urano", distance: 19.191, radius: 14, color: "#22d3ee", orbitalPeriod: 84.01 },
  { name: "Netuno", distance: 30.069, radius: 14, color: "#2563eb", orbitalPeriod: 164.79 },
];

const QuantumPropulsionPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(50); // pixels per AU
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [targetBody, setTargetBody] = useState<CelestialBody | null>(null);
  const [showPath, setShowPath] = useState(false);

  const calculatePosition = (body: CelestialBody, time: number) => {
    if (body.distance === 0) return { x: 0, y: 0 };
    const angle = (time / body.orbitalPeriod) * Math.PI * 2;
    return {
      x: Math.cos(angle) * body.distance * scale,
      y: Math.sin(angle) * body.distance * scale
    };
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

    // Clear canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Draw orbital paths
    celestialBodies.forEach(body => {
      if (body.distance > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, body.distance * scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw celestial bodies
    celestialBodies.forEach(body => {
      const pos = calculatePosition(body, time);
      
      ctx.beginPath();
      ctx.arc(centerX + pos.x, centerY + pos.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();

      // Draw name
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(body.name, centerX + pos.x, centerY + pos.y + body.radius + 15);
    });

    // Draw path between selected bodies
    if (selectedBody && targetBody && showPath) {
      const startPos = calculatePosition(selectedBody, time);
      const endPos = calculatePosition(targetBody, time);
      
      ctx.beginPath();
      ctx.moveTo(centerX + startPos.x, centerY + startPos.y);
      ctx.lineTo(centerX + endPos.x, centerY + endPos.y);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate distance
      const dx = endPos.x - startPos.x;
      const dy = endPos.y - startPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy) / scale;
      const distanceKm = distance * AU_TO_KM;

      // Draw distance info
      ctx.fillStyle = '#a855f7';
      ctx.font = '14px monospace';
      ctx.fillText(
        `Distância: ${distance.toFixed(2)} AU (${(distanceKm / 1000000).toFixed(1)} milhões km)`,
        centerX,
        height - 40
      );
    }
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

    const animate = () => {
      setTime(t => t + 0.01);
      drawSolarSystem();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [scale, selectedBody, targetBody, showPath]);

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
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <NavIcon className="text-violet-400" />
                  Origem
                </h2>
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
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Compass className="text-violet-400" />
                  Destino
                </h2>
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
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Planet className="text-violet-400" />
                  Controles
                </h2>
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
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[600px] bg-[#020617] rounded-lg"
                />
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