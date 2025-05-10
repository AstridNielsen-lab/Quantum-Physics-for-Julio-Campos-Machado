import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, Zap, Atom, Layers, Bot, Settings, Play, Pause, RotateCcw, Target, MessageSquare, Send, Clock, Milestone, Lightbulb, Rocket, MapPin } from 'lucide-react';
import Navigation from '../components/Navigation';

interface ThermalPoint {
  x: number;
  y: number;
  layer: number;
  temperature: number;
  efficiency: number;
  power: number;
}

interface Material {
  name: string;
  seebeckCoeff: number;
  thermalConductivity: number;
  electricalConductivity: number;
  zT: number;
  color: string;
}

const ThermalMeshPage = () => {
  const [temperature, setTemperature] = useState(1000);
  const [powerOutput, setPowerOutput] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const materials: Material[] = [
    {
      name: 'Bi₂Te₃',
      seebeckCoeff: 200,
      thermalConductivity: 1.5,
      electricalConductivity: 1000,
      zT: 1.2,
      color: '#22d3ee'
    },
    {
      name: 'SnSe',
      seebeckCoeff: 500,
      thermalConductivity: 0.6,
      electricalConductivity: 700,
      zT: 2.6,
      color: '#a855f7'
    },
    {
      name: 'Skutterudite',
      seebeckCoeff: 300,
      thermalConductivity: 2.0,
      electricalConductivity: 1200,
      zT: 1.7,
      color: '#ec4899'
    }
  ];

  const drawThermalMesh = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMaterial) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const currentTime = Date.now() / 1000;

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

    // Draw thermal layers
    const layerCount = 5;
    const layerHeight = height / layerCount;
    
    for (let layer = 0; layer < layerCount; layer++) {
      const y = layer * layerHeight;
      const layerTemp = temperature * (1 - layer / layerCount);
      const alpha = 0.1 + (layerTemp / temperature) * 0.3;
      
      // Layer background
      const gradient = ctx.createLinearGradient(0, y, width, y + layerHeight);
      gradient.addColorStop(0, `${selectedMaterial.color}00`);
      gradient.addColorStop(0.5, `${selectedMaterial.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${selectedMaterial.color}00`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, layerHeight);

      // Heat flow visualization
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const t = currentTime * 2 + i * (Math.PI * 2 / particleCount);
        const x = (Math.sin(t) * 0.5 + 0.5) * width;
        const particleY = y + (Math.cos(t * 2) * 0.3 + 0.5) * layerHeight;
        
        ctx.beginPath();
        ctx.arc(x, particleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${selectedMaterial.color}`;
        ctx.fill();

        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, particleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = selectedMaterial.color;
        ctx.fill();
        ctx.restore();
      }

      // Temperature indicators
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${layerTemp.toFixed(0)}K`, width - 10, y + layerHeight / 2);
    }

    // Draw power generation indicators
    const powerHeight = (powerOutput / 1000) * height;
    ctx.fillStyle = '#22d3ee33';
    ctx.fillRect(width - 30, height - powerHeight, 20, powerHeight);
    
    ctx.strokeStyle = '#22d3ee';
    ctx.strokeRect(width - 30, height - powerHeight, 20, powerHeight);

    // Draw efficiency indicator
    const efficiencyHeight = efficiency * height;
    ctx.fillStyle = '#a855f733';
    ctx.fillRect(width - 60, height - efficiencyHeight, 20, efficiencyHeight);
    
    ctx.strokeStyle = '#a855f7';
    ctx.strokeRect(width - 60, height - efficiencyHeight, 20, efficiencyHeight);

    if (isSimulating) {
      setTime(t => t + 1);
      const newPower = calculatePower(temperature, selectedMaterial);
      const newEfficiency = calculateEfficiency(temperature, selectedMaterial);
      setPowerOutput(newPower);
      setEfficiency(newEfficiency);
    }

    animationRef.current = requestAnimationFrame(drawThermalMesh);
  };

  const calculatePower = (temp: number, material: Material) => {
    const deltaT = temp - 300; // Difference from room temperature (300K)
    return material.seebeckCoeff * material.electricalConductivity * deltaT * deltaT / 1000;
  };

  const calculateEfficiency = (temp: number, material: Material) => {
    const Tc = 300; // Cold side temperature (room temperature)
    const deltaT = temp - Tc;
    const avgT = (temp + Tc) / 2;
    return (material.zT * deltaT) / (avgT * (Math.sqrt(1 + material.zT) + 1));
  };

  useEffect(() => {
    if (selectedMaterial) {
      drawThermalMesh();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedMaterial, temperature, isSimulating]);

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
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Configurações
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temperatura (K)
                    </label>
                    <input
                      type="range"
                      min="300"
                      max="2000"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {temperature}K
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Material Termoelétrico
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {materials.map((material) => (
                        <button
                          key={material.name}
                          onClick={() => setSelectedMaterial(material)}
                          className={`p-2 rounded-lg text-center transition-colors ${
                            selectedMaterial?.name === material.name
                              ? 'bg-violet-600 text-white'
                              : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                          }`}
                        >
                          {material.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setIsSimulating(!isSimulating)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isSimulating ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Iniciar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTime(0);
                        setPowerOutput(0);
                        setEfficiency(0);
                      }}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reiniciar
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Target className="text-violet-400" />
                  Métricas de Performance
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Potência Gerada</span>
                      <span className="text-violet-400 font-mono">
                        {powerOutput.toFixed(2)} W
                      </span>
                    </div>
                    <div className="h-2 bg-violet-900 rounded-full">
                      <div
                        className="h-full bg-violet-400 rounded-full transition-all"
                        style={{ width: `${(powerOutput / 1000) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Eficiência</span>
                      <span className="text-violet-400 font-mono">
                        {(efficiency * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-2 bg-violet-900 rounded-full">
                      <div
                        className="h-full bg-violet-400 rounded-full transition-all"
                        style={{ width: `${efficiency * 100}%` }}
                      />
                    </div>
                  </div>

                  {selectedMaterial && (
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-4">
                        Propriedades do Material
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Coeficiente Seebeck</span>
                          <span className="text-violet-400">
                            {selectedMaterial.seebeckCoeff} μV/K
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Condutividade Térmica</span>
                          <span className="text-violet-400">
                            {selectedMaterial.thermalConductivity} W/mK
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Condutividade Elétrica</span>
                          <span className="text-violet-400">
                            {selectedMaterial.electricalConductivity} S/m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Figura de Mérito (zT)</span>
                          <span className="text-violet-400">
                            {selectedMaterial.zT}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização da Malha Térmica</h2>
                {selectedMaterial ? (
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className="w-full bg-[#1a1a2e] rounded-lg"
                  />
                ) : (
                  <div className="h-[600px] flex items-center justify-center text-gray-400 bg-[#1a1a2e] rounded-lg">
                    Selecione um material para iniciar a simulação
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização em tempo real do fluxo de calor</p>
                  <p>• Gradiente de temperatura entre camadas</p>
                  <p>• Indicadores de potência e eficiência</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Lightbulb className="text-violet-400" />
                  Aplicações
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Propulsão</h3>
                    <p className="text-sm text-gray-300">
                      Recuperação de calor do motor para geração de energia auxiliar
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Habitação</h3>
                    <p className="text-sm text-gray-300">
                      Controle térmico do ambiente da tripulação
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Eletrônica</h3>
                    <p className="text-sm text-gray-300">
                      Proteção de componentes sensíveis
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Energia</h3>
                    <p className="text-sm text-gray-300">
                      Sistema de backup energético
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
