import React, { useEffect, useRef, useState } from 'react';
import { Hexagon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const HexagonalGridPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [energyLevel, setEnergyLevel] = useState(50);
  const [gridDensity, setGridDensity] = useState(15);
  const [flowSpeed, setFlowSpeed] = useState(1);

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

    // Gradient fill
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(139, 92, 246, ${energyIntensity * 0.5})`);
    gradient.addColorStop(1, `rgba(139, 92, 246, ${energyIntensity * 0.1})`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Pulsing border
    ctx.strokeStyle = `rgba(139, 92, 246, ${energyIntensity})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Energy particles
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const particleAngle = (time * flowSpeed + (i * Math.PI * 2) / particleCount) % (Math.PI * 2);
      const distance = size * 0.5;
      const px = x + Math.cos(particleAngle) * distance;
      const py = y + Math.sin(particleAngle) * distance;

      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${energyIntensity})`;
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
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    const energyPulse = Math.sin(time * 3) * 0.3 + 0.7;
    const alpha = (energyLevel / 100) * energyPulse * 0.5;

    gradient.addColorStop(0, `rgba(139, 92, 246, 0)`);
    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${alpha})`);
    gradient.addColorStop(1, `rgba(139, 92, 246, 0)`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const time = Date.now() / 1000;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    const hexSize = width / (gridDensity * 2);
    const rows = Math.ceil(height / (hexSize * 1.5));
    const cols = Math.ceil(width / (hexSize * Math.sqrt(3)));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * Math.sqrt(3) + (row % 2) * (hexSize * Math.sqrt(3)) / 2;
        const y = row * hexSize * 1.5;
        
        // Draw connections to neighbors
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

    // Set canvas size
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
  }, [gridDensity, energyLevel, flowSpeed]);

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

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[600px] rounded-lg"
                  style={{ background: '#1a1a2e' }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Controles</h2>
                
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
                <h2 className="text-xl font-semibold mb-4">Informações</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    A malha hexagonal energética representa a distribuição e fluxo de energia
                    quântica através de uma estrutura cristalina regular.
                  </p>
                  <p>
                    Cada hexágono funciona como um nodo de energia, capaz de armazenar e
                    transmitir energia para seus vizinhos através de canais de fluxo quântico.
                  </p>
                  <p>
                    O padrão hexagonal foi escolhido por sua eficiência natural na
                    distribuição de energia e estabilidade estrutural.
                  </p>
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