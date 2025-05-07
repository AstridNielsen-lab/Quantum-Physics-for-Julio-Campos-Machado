import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Atom, Braces, Calculator, Microscope, Zap, Binary, Hexagon, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const AbelianSymmetryPage = () => {
  const [selectedElement, setSelectedElement] = useState<'B' | 'N' | 'F'>('B');
  const [showOrbitalAnimation, setShowOrbitalAnimation] = useState(true);
  const [showWaveFunction, setShowWaveFunction] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const waveAnimationRef = useRef<number>();

  const elements = {
    B: {
      name: 'Boro',
      atomicNumber: 5,
      configuration: '1s² 2s² 2p¹',
      electrons: [2, 2, 1],
      color: '#ec4899',
      symmetryGroup: 'U(1)',
      energy: 8.298
    },
    N: {
      name: 'Nitrogênio',
      atomicNumber: 7,
      configuration: '1s² 2s² 2p³',
      electrons: [2, 2, 3],
      color: '#22d3ee',
      symmetryGroup: 'U(1)×SU(2)',
      energy: 14.534
    },
    F: {
      name: 'Flúor',
      atomicNumber: 9,
      configuration: '1s² 2s² 2p⁵',
      electrons: [2, 2, 5],
      color: '#a855f7',
      symmetryGroup: 'U(1)×U(1)',
      energy: 17.422
    }
  };

  const drawOrbitalAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw nucleus
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = elements[selectedElement].color;
    ctx.fill();

    ctx.save();
    ctx.filter = 'blur(8px)';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = elements[selectedElement].color;
    ctx.fill();
    ctx.restore();

    // Draw electron shells
    const shellRadii = [50, 80, 110];
    elements[selectedElement].electrons.forEach((electronCount, shellIndex) => {
      const radius = shellRadii[shellIndex];
      
      // Draw shell orbit
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw electrons
      for (let i = 0; i < electronCount; i++) {
        const angle = (i * Math.PI * 2 / electronCount) + time * rotationSpeed;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = elements[selectedElement].color;
        ctx.fill();

        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = elements[selectedElement].color;
        ctx.fill();
        ctx.restore();
      }
    });

    // Draw symmetry lines
    const symmetryLines = 6;
    for (let i = 0; i < symmetryLines; i++) {
      const angle = (i * Math.PI) / (symmetryLines / 2) + time * 0.2;
      ctx.beginPath();
      ctx.moveTo(centerX - Math.cos(angle) * 150, centerY - Math.sin(angle) * 150);
      ctx.lineTo(centerX + Math.cos(angle) * 150, centerY + Math.sin(angle) * 150);
      ctx.strokeStyle = `${elements[selectedElement].color}44`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(drawOrbitalAnimation);
  };

  const drawWaveFunction = () => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff11';
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

    // Draw wave function
    const element = elements[selectedElement];
    const waveCount = element.atomicNumber;
    
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = x / width;
      const y = height / 2 + 
        Math.sin(t * Math.PI * waveCount + time * 2) * 50 * Math.exp(-t * 2) +
        Math.sin(t * Math.PI * (waveCount + 2) + time * 3) * 30 * Math.exp(-t * 3);
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw probability density
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = x / width;
      const y = height * 0.8 - Math.exp(-t * 4) * 100;
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `${element.color}88`;
    ctx.lineWidth = 2;
    ctx.stroke();

    waveAnimationRef.current = requestAnimationFrame(drawWaveFunction);
  };

  useEffect(() => {
    if (showOrbitalAnimation) {
      drawOrbitalAnimation();
    }
    if (showWaveFunction) {
      drawWaveFunction();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current);
      }
    };
  }, [selectedElement, showOrbitalAnimation, showWaveFunction, rotationSpeed]);

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
            <Binary className="text-violet-400" />
            Simetria Abeliana em Elementos Quânticos
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Atom className="text-violet-400" />
                  Elementos
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(elements).map(([symbol, element]) => (
                    <button
                      key={symbol}
                      onClick={() => setSelectedElement(symbol as 'B' | 'N' | 'F')}
                      className={`p-4 rounded-lg text-center transition-colors ${
                        selectedElement === symbol
                          ? 'bg-violet-600 text-white'
                          : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                      }`}
                    >
                      <div className="text-2xl font-bold" style={{ color: element.color }}>
                        {symbol}
                      </div>
                      <div className="text-sm mt-1">{element.name}</div>
                      <div className="text-xs mt-1 opacity-75">Z = {element.atomicNumber}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="text-violet-400" />
                  Propriedades Quânticas
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Configuração Eletrônica
                    </label>
                    <div className="font-mono text-lg text-violet-400">
                      {elements[selectedElement].configuration}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Grupo de Simetria
                    </label>
                    <div className="font-mono text-lg text-violet-400">
                      {elements[selectedElement].symmetryGroup}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Energia de Ionização
                    </label>
                    <div className="font-mono text-lg text-violet-400">
                      {elements[selectedElement].energy} eV
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Hexagon className="text-violet-400" />
                  Controles de Visualização
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Velocidade de Rotação
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {rotationSpeed.toFixed(1)}x
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showOrbitalAnimation}
                        onChange={(e) => setShowOrbitalAnimation(e.target.checked)}
                        className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-300">
                        Mostrar Orbitais
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showWaveFunction}
                        onChange={(e) => setShowWaveFunction(e.target.checked)}
                        className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-300">
                        Mostrar Função de Onda
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização de Orbitais</h2>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização da estrutura eletrônica e simetrias</p>
                  <p>• Orbitais e níveis de energia</p>
                  <p>• Padrões de simetria abeliana</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Função de Onda e Densidade</h2>
                <canvas
                  ref={waveCanvasRef}
                  width={600}
                  height={300}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Função de onda radial</p>
                  <p>• Densidade de probabilidade</p>
                  <p>• Simetrias na função de onda</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Microscope className="text-violet-400" />
                  Propriedades de Simetria
                </h2>
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">
                      Conservação de Carga
                    </h3>
                    <p className="text-gray-300">
                      Simetria U(1) global que preserva a carga elétrica total do sistema.
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">
                      Momento Angular
                    </h3>
                    <p className="text-gray-300">
                      Simetria rotacional que conserva o momento angular total.
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">
                      Spin
                    </h3>
                    <p className="text-gray-300">
                      Simetria SU(2) que descreve a rotação do spin eletrônico.
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

export default AbelianSymmetryPage;