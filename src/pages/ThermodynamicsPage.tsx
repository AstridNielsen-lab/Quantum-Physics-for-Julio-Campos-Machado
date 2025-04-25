import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Thermometer, Zap, Atom, Layers, Calculator, Microscope, Braces } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface Layer {
  units: number;
  temperature: number;
  energy: number;
}

const ThermodynamicsPage = () => {
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const layers: Layer[] = [
    { units: 1, temperature: 1.2e9, energy: 2.7234e-15 },
    { units: 1, temperature: 2.4e9, energy: 5.4468e-15 },
    { units: 2, temperature: 4.8e9, energy: 1.0894e-14 },
    { units: 3, temperature: 7.2e9, energy: 1.6341e-14 },
    { units: 5, temperature: 9.6e9, energy: 2.7234e-14 },
    { units: 8, temperature: 12.0e9, energy: 4.3575e-14 },
    { units: 13, temperature: 14.4e9, energy: 7.0809e-14 },
    { units: 21, temperature: 16.8e9, energy: 1.1438e-13 },
    { units: 34, temperature: 18.0e9, energy: 1.8519e-13 },
    { units: 55, temperature: 18.79e10, energy: 3.8945e-13 }
  ];

  const drawAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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

    // Draw layers
    const layerHeight = height / layers.length;
    layers.forEach((layer, index) => {
      const y = index * layerHeight;
      const isSelected = selectedLayer === index;
      
      // Layer background
      const gradient = ctx.createLinearGradient(0, y, width, y + layerHeight);
      const alpha = isSelected ? 0.3 : 0.1;
      gradient.addColorStop(0, `rgba(168, 85, 247, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(34, 211, 238, ${alpha})`);
      gradient.addColorStop(1, `rgba(236, 72, 153, ${alpha})`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, layerHeight);

      // Particles
      const particleCount = layer.units * 5;
      for (let i = 0; i < particleCount; i++) {
        const particleTime = currentTime + i * (Math.PI * 2 / particleCount);
        const x = (Math.sin(particleTime * 2) * 0.5 + 0.5) * width;
        const particleY = y + (Math.cos(particleTime * 3) * 0.3 + 0.5) * layerHeight;
        
        ctx.beginPath();
        ctx.arc(x, particleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.5 + Math.sin(particleTime) * 0.5})`;
        ctx.fill();

        if (isSelected) {
          ctx.save();
          ctx.filter = 'blur(4px)';
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(x, particleY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#22d3ee';
          ctx.fill();
          ctx.restore();
        }
      }

      // Layer info
      if (isSelected) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Camada ${index + 1}: ${layer.units} unidades`, 10, y + 20);
        ctx.fillText(`Temperatura: ${(layer.temperature / 1e9).toFixed(2)}B K`, 10, y + 40);
        ctx.fillText(`Energia: ${layer.energy.toExponential(2)} J`, 10, y + 60);
      }
    });

    // Draw laser beam
    const laserY = height / 2;
    const laserWidth = 10;
    const laserAngle = Math.sin(currentTime) * Math.PI / 6;
    
    ctx.save();
    ctx.translate(width / 2, laserY);
    ctx.rotate(laserAngle);
    
    const laserGradient = ctx.createLinearGradient(-width/2, 0, width/2, 0);
    laserGradient.addColorStop(0, '#ec489900');
    laserGradient.addColorStop(0.2, '#ec4899');
    laserGradient.addColorStop(0.8, '#ec4899');
    laserGradient.addColorStop(1, '#ec489900');

    ctx.fillStyle = laserGradient;
    ctx.fillRect(-width/2, -laserWidth/2, width, laserWidth);

    ctx.restore();

    animationRef.current = requestAnimationFrame(drawAnimation);
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
    drawAnimation();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedLayer]);

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
            <Calculator className="text-violet-400" />
            Análise Termodinâmica Quântica
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Microscope className="text-violet-400" />
                  Hipóteses de Trabalho
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Laser</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Potência: 17kV</li>
                      <li>• Energia por pulso: 1 Joule</li>
                      <li>• Alvo: Hidrogênio e Hélio</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Malha Quântica</h3>
                    <p className="text-gray-300 mb-2">
                      10 camadas organizadas segundo a sequência de Fibonacci
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {layers.map((layer, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedLayer(index)}
                          className={`p-2 rounded-lg text-center transition-colors ${
                            selectedLayer === index
                              ? 'bg-violet-600 text-white'
                              : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                          }`}
                        >
                          <div className="text-sm font-semibold">{index + 1}</div>
                          <div className="text-xs">{layer.units}u</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Atom className="text-violet-400" />
                  Gases Utilizados
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Hidrogênio (H)</h3>
                    <p className="text-sm text-gray-300">Massa atômica ≈ 1u</p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Hélio (He)</h3>
                    <p className="text-sm text-gray-300">Massa atômica ≈ 4u</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Braces className="text-violet-400" />
                  Cálculos Teóricos
                </h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Energia Cinética Média</h3>
                    <p className="font-mono">E = (3/2)kT</p>
                    <p className="text-sm mt-2">
                      k = 1,381×10⁻²³ J/K (constante de Boltzmann)
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Energia por Elétron</h3>
                    <p className="font-mono">Ee = e·V = 2,7234×10⁻¹⁵ J</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Energia Total</h3>
                    <p className="font-mono">Etotal = 3,8945×10⁻¹³ J</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização da Malha Quântica</h2>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Clique nas camadas para ver detalhes específicos</p>
                  <p>• Visualize o comportamento das partículas em cada nível</p>
                  <p>• Observe a interação do laser com a malha quântica</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Thermometer className="text-violet-400" />
                  Temperatura Final
                </h2>
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-violet-400">18,79 × 10¹⁰ K</div>
                    <p className="text-sm text-gray-300 mt-2">
                      Aproximadamente 18,79 bilhões de Kelvin
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Comparação</h3>
                      <p className="text-sm text-gray-300">
                        Núcleo do Sol: ~15 milhões K
                      </p>
                    </div>
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Magnitude</h3>
                      <p className="text-sm text-gray-300">
                        1000× mais quente que o núcleo solar
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="text-violet-400" />
                  Consequências e Possibilidades
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Fusão Controlada</h3>
                    <p className="text-sm text-gray-300">
                      Temperatura suficiente para fusão de H e He
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Radiação</h3>
                    <p className="text-sm text-gray-300">
                      Emissão intensa de raios gama e neutrinos
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Dissociação</h3>
                    <p className="text-sm text-gray-300">
                      Quebra de átomos pesados
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Plasma</h3>
                    <p className="text-sm text-gray-300">
                      Formação de plasma degenerado
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

export default ThermodynamicsPage;