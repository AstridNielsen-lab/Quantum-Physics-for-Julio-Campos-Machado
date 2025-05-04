import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Thermometer, Zap, Atom, Layers, Calculator, Microscope, BrainCircuit, AlertTriangle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import AdiabaticCompressionInfo from './AdiabaticCompressionInfo';
import ThermalMeshApplication from './ThermalMeshApplication';
import QuantumThermalChallenges from './QuantumThermalChallenges';

const ThermalMeshPage = () => {
  const [temperature, setTemperature] = useState(301);
  const [conductivity, setConductivity] = useState(50);
  const [efficiency, setEfficiency] = useState(75);
  const [meshDensity, setMeshDensity] = useState(40);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const drawThermalMesh = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    // Clear canvas with dark background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a0f2a');
    gradient.addColorStop(1, '#1a1f3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = Math.floor(width / meshDensity);
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw thermal nodes
    const nodeCount = Math.floor((width * height) / (gridSize * gridSize * 4));
    for (let i = 0; i < nodeCount; i++) {
      const x = (i % Math.floor(width / gridSize)) * gridSize * 2 + gridSize;
      const y = Math.floor(i / Math.floor(width / gridSize)) * gridSize * 2 + gridSize;
      
      const tempFactor = (temperature - 273) / 100;
      const radius = 4 + Math.sin(time * 2 + i) * 2;
      const heatRadius = radius * (2 + tempFactor);
      
      // Heat glow
      const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, heatRadius);
      heatGradient.addColorStop(0, `rgba(255, ${Math.max(0, 100 - tempFactor * 50)}, 0, 0.3)`);
      heatGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = heatGradient;
      ctx.beginPath();
      ctx.arc(x, y, heatRadius, 0, Math.PI * 2);
      ctx.fill();

      // Node core
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(255, ${Math.max(0, 100 - tempFactor * 50)}, 0)`;
      ctx.fill();

      // Draw connections
      if (i > 0) {
        const prevX = ((i - 1) % Math.floor(width / gridSize)) * gridSize * 2 + gridSize;
        const prevY = Math.floor((i - 1) / Math.floor(width / gridSize)) * gridSize * 2 + gridSize;
        
        const conductivityFactor = conductivity / 100;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * conductivityFactor})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw energy flow particles
    const particleCount = Math.floor(conductivity / 2);
    for (let i = 0; i < particleCount; i++) {
      const t = time * 2 + i * (Math.PI * 2 / particleCount);
      const x = width * (0.5 + Math.cos(t) * 0.3);
      const y = height * (0.5 + Math.sin(t) * 0.3);
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(t) * 0.5})`;
      ctx.fill();
    }

    // Draw efficiency indicators
    const efficiencyFactor = efficiency / 100;
    const arcCount = 3;
    for (let i = 0; i < arcCount; i++) {
      const radius = 100 + i * 30;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2 * efficiencyFactor);
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 - i * 0.1})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(drawThermalMesh);
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
    drawThermalMesh();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [temperature, conductivity, efficiency, meshDensity]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-12 flex items-center gap-3">
            <Thermometer className="text-cyan-400" />
            Malha Antitérmica Quântica
          </h1>

          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-6">
              <div className="bg-[#0a0f2a]/80 backdrop-blur p-6 rounded-xl border border-cyan-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                <div className="relative">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <BrainCircuit className="text-cyan-400" />
                    Visualização da Malha Térmica
                  </h2>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-[600px] rounded-lg bg-[#0a0f2a]"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-[#1a1f3a]/50 p-4 rounded-lg border border-cyan-500/10">
                      <div className="text-sm text-cyan-400 mb-2">Temperatura Atual</div>
                      <div className="text-2xl font-bold">{(temperature - 273.15).toFixed(1)}°C</div>
                      <div className="text-xs text-gray-400">{temperature}K</div>
                    </div>
                    <div className="bg-[#1a1f3a]/50 p-4 rounded-lg border border-cyan-500/10">
                      <div className="text-sm text-cyan-400 mb-2">Eficiência do Sistema</div>
                      <div className="text-2xl font-bold">{efficiency}%</div>
                      <div className="text-xs text-gray-400">Taxa de Conversão</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0f2a]/80 backdrop-blur p-6 rounded-xl border border-cyan-500/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Atom className="text-cyan-400" />
                    Estatísticas do Sistema
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Densidade da Malha</span>
                        <span className="text-cyan-400">{meshDensity} nós/m²</span>
                      </div>
                      <div className="h-2 bg-[#1a1f3a] rounded-full">
                        <div 
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${(meshDensity / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Condutividade Térmica</span>
                        <span className="text-cyan-400">{conductivity} W/mK</span>
                      </div>
                      <div className="h-2 bg-[#1a1f3a] rounded-full">
                        <div 
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${conductivity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0f2a]/80 backdrop-blur p-6 rounded-xl border border-cyan-500/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calculator className="text-cyan-400" />
                    Métricas de Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">Taxa de Dissipação</div>
                        <div className="text-lg font-semibold text-cyan-400">
                          {((temperature - 273.15) * conductivity / 100).toFixed(2)} kW/m²
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center">
                        <div className="text-lg font-bold">{Math.round(efficiency)}%</div>
                      </div>
                    </div>
                    <div className="bg-[#1a1f3a]/50 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Status do Sistema</div>
                      <div className="text-cyan-400 font-semibold mt-1">
                        {temperature < 323 ? 'Operação Normal' : 'Alerta de Temperatura'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="bg-[#0a0f2a]/80 backdrop-blur p-6 rounded-xl border border-cyan-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-cyan-400" />
                  Controles do Sistema
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temperatura (°C)
                    </label>
                    <input
                      type="range"
                      min="273"
                      max="373"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-[#1a1f3a] rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">0°C</span>
                      <span className="text-cyan-400">{(temperature - 273.15).toFixed(1)}°C</span>
                      <span className="text-gray-400">100°C</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Condutividade Térmica
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={conductivity}
                      onChange={(e) => setConductivity(Number(e.target.value))}
                      className="w-full h-2 bg-[#1a1f3a] rounded-full appearance-none cursor-pointer"
                    />
                    <div className="text-right text-cyan-400 text-sm mt-1">
                      {conductivity} W/mK
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Eficiência do Sistema
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={efficiency}
                      onChange={(e) => setEfficiency(Number(e.target.value))}
                      className="w-full h-2 bg-[#1a1f3a] rounded-full appearance-none cursor-pointer"
                    />
                    <div className="text-right text-cyan-400 text-sm mt-1">
                      {efficiency}%
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Densidade da Malha
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={meshDensity}
                      onChange={(e) => setMeshDensity(Number(e.target.value))}
                      className="w-full h-2 bg-[#1a1f3a] rounded-full appearance-none cursor-pointer"
                    />
                    <div className="text-right text-cyan-400 text-sm mt-1">
                      {meshDensity} nós/m²
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <AdiabaticCompressionInfo />
                <ThermalMeshApplication />
                <QuantumThermalChallenges />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0a0f2a]/50 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default ThermalMeshPage;