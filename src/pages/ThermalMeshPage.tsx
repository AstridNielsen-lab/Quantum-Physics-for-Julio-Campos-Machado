import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Thermometer, Zap, Atom, Layers, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface ThermalPoint {
  x: number;
  y: number;
  temperature: number;
  conductivity: number;
}

const ThermalMeshPage = () => {
  const [baseTemperature, setBaseTemperature] = useState(25);
  const [heatSources, setHeatSources] = useState<ThermalPoint[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('bismuth');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const materials = {
    bismuth: { name: 'Bismuto (Bi)', conductivity: 0.8, color: '#a855f7' },
    tellurium: { name: 'Telúrio (Te)', conductivity: 0.6, color: '#22d3ee' },
    antimony: { name: 'Antimônio (Sb)', conductivity: 0.7, color: '#ec4899' },
    silver: { name: 'Prata (Ag)', conductivity: 0.95, color: '#e2e8f0' },
    graphene: { name: 'Grafeno (C)', conductivity: 0.99, color: '#1e293b' },
    gallium: { name: 'Gálio (Ga)', conductivity: 0.85, color: '#6366f1' }
  };

  const addHeatSource = (x: number, y: number) => {
    const newSource: ThermalPoint = {
      x,
      y,
      temperature: baseTemperature + 100,
      conductivity: materials[selectedMaterial as keyof typeof materials].conductivity
    };
    setHeatSources(prev => [...prev, newSource]);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addHeatSource(x, y);
  };

  const drawThermalMesh = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
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

    // Draw heat sources and their effects
    heatSources.forEach((source) => {
      const material = materials[selectedMaterial as keyof typeof materials];
      const maxRadius = 150;
      const pulseRadius = maxRadius * (0.8 + Math.sin(time * 2) * 0.2);
      
      // Heat gradient
      const gradient = ctx.createRadialGradient(
        source.x, source.y, 0,
        source.x, source.y, pulseRadius
      );
      gradient.addColorStop(0, `${material.color}cc`);
      gradient.addColorStop(0.5, `${material.color}66`);
      gradient.addColorStop(1, `${material.color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(source.x, source.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Center point
      ctx.beginPath();
      ctx.arc(source.x, source.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = material.color;
      ctx.fill();

      // Temperature indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      const temp = source.temperature * source.conductivity;
      ctx.fillText(`${temp.toFixed(1)}°C`, source.x, source.y - 20);

      // Particle effects
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 2;
        const radius = pulseRadius * 0.5 * (0.8 + Math.sin(time * 3 + i) * 0.2);
        const px = source.x + Math.cos(angle) * radius;
        const py = source.y + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${material.color}88`;
        ctx.fill();
      }
    });

    // Draw flow lines
    ctx.strokeStyle = `${materials[selectedMaterial as keyof typeof materials].color}44`;
    ctx.lineWidth = 2;
    const lineCount = 20;
    for (let i = 0; i < lineCount; i++) {
      const y = (height / lineCount) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < width; x += 5) {
        const distortionY = Math.sin(x * 0.02 + time * 2 + i * 0.5) * 10;
        ctx.lineTo(x, y + distortionY);
      }
      
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(drawThermalMesh);
  };

  useEffect(() => {
    drawThermalMesh();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [heatSources, selectedMaterial, baseTemperature]);

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
            <Thermometer className="text-violet-400" />
            Malha Antitérmica
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Configurações</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temperatura Base (°C)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={baseTemperature}
                      onChange={(e) => setBaseTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {baseTemperature}°C
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Material
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(materials).map(([key, material]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedMaterial(key)}
                          className={`p-2 rounded-lg text-left transition-colors ${
                            selectedMaterial === key
                              ? 'bg-violet-600 text-white'
                              : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: material.color }}
                            />
                            <span className="text-sm">{material.name}</span>
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            Condutividade: {(material.conductivity * 100).toFixed(0)}%
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-4">Instruções</h2>
                <div className="space-y-3 text-gray-300">
                  <p>• Clique na malha para adicionar pontos de calor</p>
                  <p>• Ajuste a temperatura base usando o controle deslizante</p>
                  <p>• Selecione diferentes materiais para ver seus efeitos</p>
                  <p>• Observe como o calor se propaga pela malha</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-4">Propriedades dos Materiais</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Bismuto (Bi)</h3>
                      <p className="text-sm text-gray-300">
                        Elevado coeficiente termoelétrico, ideal para conversão térmica
                      </p>
                    </div>
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Telúrio (Te)</h3>
                      <p className="text-sm text-gray-300">
                        Semicondutor eficiente em combinação com Bismuto
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Grafeno (C)</h3>
                      <p className="text-sm text-gray-300">
                        Altíssima condutividade térmica e elétrica
                      </p>
                    </div>
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Gálio (Ga)</h3>
                      <p className="text-sm text-gray-300">
                        Líquido em baixas temperaturas, excelente para absorção térmica
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  onClick={handleCanvasClick}
                  className="w-full bg-[#1a1a2e] rounded-lg cursor-crosshair"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-violet-400" />
                    <span>Simulação em tempo real de propagação térmica</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Layers className="text-violet-400 w-5 h-5" />
                  Estatísticas da Simulação
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Pontos de Calor</h3>
                    <p className="text-2xl">{heatSources.length}</p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Temperatura Média</h3>
                    <p className="text-2xl">
                      {heatSources.length > 0
                        ? (heatSources.reduce((acc, src) => acc + src.temperature, 0) / heatSources.length).toFixed(1)
                        : baseTemperature}°C
                    </p>
                  </div>
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

export default ThermalMeshPage;