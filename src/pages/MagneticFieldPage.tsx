import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Magnet, Zap, Atom, Compass, Settings } from 'lucide-react';
import Navigation from '../components/Navigation';

interface MagneticParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number;
}

const MagneticFieldPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fieldStrength, setFieldStrength] = useState(50);
  const [particleCount, setParticleCount] = useState(50);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [particles, setParticles] = useState<MagneticParticle[]>([]);
  const animationRef = useRef<number>();

  const initParticles = () => {
    const newParticles: MagneticParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        charge: Math.random() < 0.5 ? -1 : 1
      });
    }
    setParticles(newParticles);
  };

  const drawMagneticField = () => {
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
    const gridSize = 40;
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

    // Draw magnetic field lines
    if (showFieldLines) {
      const lineCount = 20;
      const lineSpacing = height / lineCount;
      
      for (let i = 0; i < lineCount; i++) {
        const y = i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        for (let x = 0; x < width; x += 5) {
          const fieldStrengthFactor = fieldStrength / 50;
          const distortion = Math.sin(x * 0.02 + time * rotationSpeed) * 20 * fieldStrengthFactor;
          ctx.lineTo(x, y + distortion);
        }
        
        const gradient = ctx.createLinearGradient(0, y, width, y);
        gradient.addColorStop(0, '#a855f700');
        gradient.addColorStop(0.5, '#a855f766');
        gradient.addColorStop(1, '#a855f700');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Update and draw particles
    const updatedParticles = particles.map(particle => {
      const fieldStrengthFactor = fieldStrength / 50;
      const angle = Math.sin(particle.x * 0.02 + time * rotationSpeed) * Math.PI / 4 * fieldStrengthFactor;
      
      const vx = particle.vx * Math.cos(angle) - particle.vy * Math.sin(angle);
      const vy = particle.vx * Math.sin(angle) + particle.vy * Math.cos(angle);
      
      return {
        ...particle,
        x: (particle.x + vx * fieldStrengthFactor + width) % width,
        y: (particle.y + vy * fieldStrengthFactor + height) % height,
        vx,
        vy
      };
    });

    // Draw particles
    updatedParticles.forEach(particle => {
      const particleSize = 4;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = particle.charge > 0 ? '#22d3ee' : '#ec4899';
      ctx.fill();

      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particleSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = particle.charge > 0 ? '#22d3ee' : '#ec4899';
      ctx.fill();
      ctx.restore();

      // Draw particle trails
      const trailLength = 5;
      const trailOpacity = 0.2;
      
      for (let i = 1; i <= trailLength; i++) {
        const trailX = particle.x - particle.vx * i * fieldStrength / 25;
        const trailY = particle.y - particle.vy * i * fieldStrength / 25;
        
        ctx.beginPath();
        ctx.arc(trailX, trailY, particleSize * (1 - i/trailLength), 0, Math.PI * 2);
        ctx.fillStyle = `${particle.charge > 0 ? '#22d3ee' : '#ec4899'}${Math.floor(trailOpacity * (1 - i/trailLength) * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
    });

    setParticles(updatedParticles);
    animationRef.current = requestAnimationFrame(drawMagneticField);
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
    initParticles();
    drawMagneticField();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fieldStrength, particleCount, showFieldLines, rotationSpeed]);

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
            <Magnet className="text-violet-400" />
            Campo Magnético Quântico
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
                      Intensidade do Campo
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fieldStrength}
                      onChange={(e) => setFieldStrength(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {fieldStrength}%
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Número de Partículas
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={particleCount}
                      onChange={(e) => {
                        setParticleCount(Number(e.target.value));
                        initParticles();
                      }}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {particleCount} partículas
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Velocidade de Rotação
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {rotationSpeed.toFixed(1)}x
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showFieldLines"
                      checked={showFieldLines}
                      onChange={(e) => setShowFieldLines(e.target.checked)}
                      className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="showFieldLines" className="text-sm text-gray-300">
                      Mostrar Linhas de Campo
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Compass className="text-violet-400" />
                  Legenda
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#22d3ee]" />
                    <span className="text-gray-300">Partículas com carga positiva</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#ec4899]" />
                    <span className="text-gray-300">Partículas com carga negativa</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-1 bg-[#a855f7] rounded" />
                    <span className="text-gray-300">Linhas de campo magnético</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Atom className="text-violet-400" />
                  Informações
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Esta simulação demonstra o comportamento de partículas carregadas
                    em um campo magnético dinâmico. As partículas são influenciadas
                    pela força de Lorentz, que causa desvios em suas trajetórias.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Força de Lorentz</h3>
                      <p className="text-sm">F = q(E + v × B)</p>
                    </div>
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Campo Magnético</h3>
                      <p className="text-sm">B = μ₀H</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização do Campo Magnético</h2>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Observe o movimento das partículas sob influência do campo magnético</p>
                  <p>• As linhas de campo mostram a direção e intensidade do campo magnético</p>
                  <p>• Partículas de cargas opostas são desviadas em direções diferentes</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="text-violet-400" />
                  Aplicações Práticas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Propulsão</h3>
                    <p className="text-sm text-gray-300">
                      Controle de plasma para sistemas de propulsão avançados
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Contenção</h3>
                    <p className="text-sm text-gray-300">
                      Confinamento magnético de partículas carregadas
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Aceleração</h3>
                    <p className="text-sm text-gray-300">
                      Aceleração de partículas para experimentos quânticos
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Navegação</h3>
                    <p className="text-sm text-gray-300">
                      Sistemas de navegação baseados em campos magnéticos
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

export default MagneticFieldPage;