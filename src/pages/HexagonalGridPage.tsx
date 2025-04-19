import React, { useState, useEffect, useRef } from 'react';
import { Hexagon, ArrowLeft, Zap, Atom, Brain, Lightbulb, Layers, BrainCircuit as Circuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface Element {
  name: string;
  symbol: string;
  color: string;
  energy: number;
}

const elements: Element[] = [
  { name: 'Boro', symbol: 'B', color: '#ec4899', energy: 3.2 },
  { name: 'Nitrogênio', symbol: 'N', color: '#22d3ee', energy: 4.5 },
  { name: 'Flúor', symbol: 'F', color: '#a855f7', energy: 5.8 }
];

const HexagonalGridPage = () => {
  const [energyLevel, setEnergyLevel] = useState(50);
  const [gridDensity, setGridDensity] = useState(15);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const [selectedElement, setSelectedElement] = useState<Element>(elements[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const drawHexagon = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    time: number,
    index: number
  ) => {
    const sides = 6;
    const angle = (Math.PI * 2) / sides;
    const energyPulse = Math.sin(time * 2 + index * 0.1) * 0.3 + 0.7;
    const energyIntensity = (energyLevel / 100) * energyPulse;

    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const pointAngle = angle * i - Math.PI / 2;
      const px = x + size * Math.cos(pointAngle);
      const py = y + size * Math.sin(pointAngle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    const rgb = hexToRgb(selectedElement.color);
    if (rgb) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${energyIntensity * 0.5})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${energyIntensity * 0.1})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${energyIntensity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      const energyValue = (selectedElement.energy * energyIntensity).toFixed(1);
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${energyValue} eV`, x, y);
    }

    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const particleAngle = (time * flowSpeed + (i * Math.PI * 2) / particleCount) % (Math.PI * 2);
      const distance = size * 0.5;
      const px = x + Math.cos(particleAngle) * distance;
      const py = y + Math.sin(particleAngle) * distance;

      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = selectedElement.color;
      ctx.fill();
    }
  };

  const drawEnergyFlows = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    time: number
  ) => {
    const rgb = hexToRgb(selectedElement.color);
    if (rgb) {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      const energyPulse = Math.sin(time * 3) * 0.3 + 0.7;
      const alpha = (energyLevel / 100) * energyPulse * 0.5;

      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = Date.now() / 1000;
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    const hexSize = width / (gridDensity * 2);
    const rows = Math.ceil(height / (hexSize * 1.5));
    const cols = Math.ceil(width / (hexSize * Math.sqrt(3)));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * Math.sqrt(3) + (row % 2) * (hexSize * Math.sqrt(3)) / 2;
        const y = row * hexSize * 1.5;
        
        if (col > 0) {
          drawEnergyFlows(ctx, x, y, x - hexSize * Math.sqrt(3), y, time);
        }
        if (row > 0) {
          if (row % 2 === 0 || col < cols - 1) {
            drawEnergyFlows(
              ctx,
              x,
              y,
              x + (row % 2 ? hexSize * Math.sqrt(3) / 2 : -hexSize * Math.sqrt(3) / 2),
              y - hexSize * 1.5,
              time
            );
          }
        }

        drawHexagon(ctx, x, y, hexSize, time, row * cols + col);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
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

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gridDensity, energyLevel, flowSpeed, selectedElement]);

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
            <Hexagon className="text-violet-400" />
            Malha Hexagonal Energética
          </h1>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Lightbulb className="text-violet-400 w-6 h-6" />
                Tecnologia Quântica
              </h2>
              
              <div className="space-y-8 text-gray-300">
                <div className="bg-violet-900/10 p-6 rounded-xl border border-violet-500/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layers className="text-violet-400 w-5 h-5" />
                    Estrutura da Malha Hexagonal
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-violet-400 to-transparent"></div>
                      <h4 className="font-semibold text-violet-300">Distribuição de Energia</h4>
                      <p className="text-sm">
                        Representa a distribuição e fluxo de energia quântica através de uma estrutura cristalina regular.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-violet-400 to-transparent"></div>
                      <h4 className="font-semibold text-violet-300">Nodos Energéticos</h4>
                      <p className="text-sm">
                        Cada hexágono funciona como um nodo de energia, capaz de armazenar e transmitir energia para seus vizinhos.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-violet-400 to-transparent"></div>
                      <h4 className="font-semibold text-violet-300">Eficiência Estrutural</h4>
                      <p className="text-sm">
                        O padrão hexagonal maximiza a eficiência na distribuição de energia e estabilidade estrutural.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-violet-900/10 p-6 rounded-xl border border-violet-500/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Brain className="text-violet-400 w-5 h-5" />
                    Tecnologia de Laser e Controle Quântico
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Zap className="text-violet-400 w-4 h-4" />
                          Zonas de Dopagem Controlada
                        </h4>
                        <p className="text-sm mb-4">
                          Sistema avançado de dopagem iônica para criar regiões de carga fixa
                          precisamente controladas, permitindo manipulação precisa de campos
                          eletromagnéticos em escala quântica.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20">
                            <div className="w-3 h-3 rounded-full bg-pink-500 mb-2 mx-auto"></div>
                            <p className="text-xs text-center">Boro: Controle de cargas positivas</p>
                          </div>
                          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20">
                            <div className="w-3 h-3 rounded-full bg-cyan-400 mb-2 mx-auto"></div>
                            <p className="text-xs text-center">Nitrogênio: Estabilização de campo</p>
                          </div>
                          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20">
                            <div className="w-3 h-3 rounded-full bg-purple-400 mb-2 mx-auto"></div>
                            <p className="text-xs text-center">Flúor: Modulação de cargas negativas</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                          <Atom className="text-violet-400 w-4 h-4" />
                          Interação Laser-Cristal
                        </h4>
                        <p className="text-sm mb-4">
                          O feixe laser atravessa o cristal em ângulos precisamente calculados,
                          alterando estados de energia dos elétrons e fótons circundantes.
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                            <p className="text-sm">Alteração controlada de estados quânticos</p>
                          </div>
                          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                            <p className="text-sm">Modulação de energia eletrônica</p>
                          </div>
                          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                            <p className="text-sm">Controle de interação fóton-elétron</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                        <Circuit className="text-violet-400 w-4 h-4" />
                        Campo Magnético Dinâmico
                      </h4>
                      <p className="text-sm mb-6">
                        A aplicação de campos magnéticos dinâmicos permite direcionar e modular
                        a trajetória dos elétrons com precisão sem precedentes, criando um
                        sistema de controle quântico avançado.
                      </p>
                      <div className="space-y-4">
                        <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-transparent flex items-center justify-center">
                              <Zap className="w-4 h-4" />
                            </div>
                            <h5 className="font-semibold text-violet-300">Canalização Quântica</h5>
                          </div>
                          <p className="text-sm">
                            Direcionamento preciso de elétrons e íons através de canais quânticos controlados
                          </p>
                        </div>
                        <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-transparent flex items-center justify-center">
                              <Layers className="w-4 h-4" />
                            </div>
                            <h5 className="font-semibold text-violet-300">Zonas de Repulsão</h5>
                          </div>
                          <p className="text-sm">
                            Criação de barreiras quânticas para controle de fluxo de partículas
                          </p>
                        </div>
                        <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-transparent flex items-center justify-center">
                              <Atom className="w-4 h-4" />
                            </div>
                            <h5 className="font-semibold text-violet-300">Atração Controlada</h5>
                          </div>
                          <p className="text-sm">
                            Geração de pontos de convergência para concentração de energia
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                  <h2 className="text-xl font-semibold mb-6">Configurações</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nível de Energia
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(Number(e.target.value))}
                        className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-violet-400 mt-1">
                        {energyLevel}%
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Densidade da Malha
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={gridDensity}
                        onChange={(e) => setGridDensity(Number(e.target.value))}
                        className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-violet-400 mt-1">
                        {gridDensity} células
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Velocidade do Fluxo
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={flowSpeed}
                        onChange={(e) => setFlowSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-violet-400 mt-1">
                        {flowSpeed.toFixed(1)}x
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                  <h2 className="text-xl font-semibold mb-6">Elementos</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {elements.map((element) => (
                      <button
                        key={element.symbol}
                        onClick={() => setSelectedElement(element)}
                        className={`p-4 rounded-lg transition-all ${
                          selectedElement?.symbol === element.symbol
                            ? 'bg-opacity-50 ring-2'
                            : 'bg-opacity-20 hover:bg-opacity-30'
                        }`}
                        style={{ backgroundColor: element.color }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold">{element.symbol}</div>
                          <div className="text-sm">{element.name}</div>
                          <div className="text-xs mt-1">{element.energy} eV</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className="w-full bg-[#1a1a2e] rounded-lg"
                  />
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

export default HexagonalGridPage;