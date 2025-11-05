import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Magnet, Zap, Atom, Compass, Settings, Power, Wifi, Rocket, Thermometer, Scale, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface Element {
  name: string;
  symbol: string;
  color: string;
  energy: number;
  weight: number;
  thrust: number;
  repulsion: number;
  voltage: number,
  symmetryGroup: string;
  quantumStates: number;
}

const elements: Element[] = [
  { 
    name: 'Boro', 
    symbol: 'B', 
    color: '#ec4899', 
    energy: 3.2,
    weight: 10.811,
    thrust: 4500,
    repulsion: 2.8,
    voltage: 1500,
    symmetryGroup: 'U(1)',
    quantumStates: 3
  },
  { 
    name: 'Nitrogênio', 
    symbol: 'N', 
    color: '#22d3ee', 
    energy: 4.5,
    weight: 14.007,
    thrust: 6200,
    repulsion: 3.4,
    voltage: 2200,
    symmetryGroup: 'U(1)×SU(2)',
    quantumStates: 5
  },
  { 
    name: 'Flúor', 
    symbol: 'F', 
    color: '#a855f7', 
    energy: 5.8,
    weight: 18.998,
    thrust: 8100,
    repulsion: 4.2,
    voltage: 3100,
    symmetryGroup: 'U(1)×U(1)',
    quantumStates: 7
  }
];

// Componente Binary que estava faltando
const Binary = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 20h4"></path>
    <path d="M14 10h4"></path>
    <path d="M6 14h2v6"></path>
    <path d="M14 4h2v6"></path>
    <rect x="6" y="4" width="4" height="6"></rect>
    <rect x="14" y="14" width="4" height="6"></rect>
  </svg>
);

const AbelianSymmetryPage = () => {
  const [energyLevel, setEnergyLevel] = useState(50);
  const [gridDensity, setGridDensity] = useState(15);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const [selectedElement, setSelectedElement] = useState<Element>(elements[0]);
  const [repulsionForce, setRepulsionForce] = useState(1);
  const [magneticField, setMagneticField] = useState(10);
  const [voltage, setVoltage] = useState(1500);
  const [temperature, setTemperature] = useState(1000);
  const [thrust, setThrust] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Calculate thrust based on element properties and current settings
    const calculateThrust = () => {
      if (!selectedElement) return 0;
      
      const baseThrust = selectedElement.thrust;
      const energyFactor = energyLevel / 100;
      const tempFactor = temperature / 1000;
      const magFactor = magneticField / 10;
      
      const thrust = baseThrust * energyFactor * tempFactor * magFactor;
      setThrust(thrust);
    };

    calculateThrust();
  }, [selectedElement, energyLevel, temperature, magneticField]);

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

    // Draw repulsion field
    const repulsionRadius = size * (1 + repulsionForce * 0.2);
    const repulsionGradient = ctx.createRadialGradient(x, y, 0, x, y, repulsionRadius);
    repulsionGradient.addColorStop(0, `rgba(255, 255, 255, 0.1)`);
    repulsionGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = repulsionGradient;
    ctx.beginPath();
    ctx.arc(x, y, repulsionRadius, 0, Math.PI * 2);
    ctx.fill();
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

    // Draw magnetic field lines
    const fieldLines = 10;
    for (let i = 0; i < fieldLines; i++) {
      ctx.beginPath();
      ctx.moveTo(0, height * (i / fieldLines));
      
      for (let x = 0; x < width; x += 5) {
        const y = height * (i / fieldLines) + 
          Math.sin(x * 0.02 + time * flowSpeed) * 20 * (magneticField / 10);
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = `${selectedElement.color}22`;
      ctx.stroke();
    }

    // Draw hexagonal grid with quantum states
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * Math.sqrt(3) + (row % 2) * (hexSize * Math.sqrt(3)) / 2;
        const y = row * hexSize * 1.5;
        
        drawHexagon(ctx, x, y, hexSize, time, row * cols + col);
      }
    }

    // Draw voltage indicators
    const voltagePoints = 8;
    for (let i = 0; i < voltagePoints; i++) {
      const angle = (i * Math.PI * 2) / voltagePoints + time * flowSpeed;
      const radius = width * 0.4;
      const x = width/2 + Math.cos(angle) * radius;
      const y = height/2 + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = selectedElement.color;
      ctx.fill();

      // Draw voltage arcs
      if (i > 0) {
        const prevAngle = ((i - 1) * Math.PI * 2) / voltagePoints + time * flowSpeed;
        const px = width/2 + Math.cos(prevAngle) * radius;
        const py = height/2 + Math.sin(prevAngle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `${selectedElement.color}44`;
        ctx.stroke();
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
  }, [selectedElement, energyLevel, gridDensity, flowSpeed, repulsionForce, magneticField, voltage]);

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
                  <Atom className="text-violet-400 w-5 h-5" />
                  Elementos
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {elements.map((element) => (
                    <button
                      key={element.symbol}
                      onClick={() => setSelectedElement(element)}
                      className={`p-4 rounded-lg text-center transition-colors ${
                        selectedElement === element
                          ? 'bg-violet-600 text-white'
                          : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                      }`}
                    >
                      <div className="text-2xl font-bold" style={{ color: element.color }}>
                        {element.symbol}
                      </div>
                      <div className="text-sm mt-1">{element.name}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {element.symmetryGroup}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="text-violet-400 w-5 h-5" />
                  Parâmetros de Controle
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nível de Energia (eV)
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
                      Força de Repulsão (kN)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={repulsionForce}
                      onChange={(e) => setRepulsionForce(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {repulsionForce.toFixed(1)} kN
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Campo Magnético (Tesla)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={magneticField}
                      onChange={(e) => setMagneticField(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {magneticField} T
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tensão (V)
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="5000"
                      step="100"
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {voltage} V
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temperatura (K)
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {temperature} K
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Scale className="text-violet-400 w-5 h-5" />
                  Cálculos de Propulsão
                </h2>
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Empuxo Total</h3>
                    <div className="text-2xl font-mono">{thrust.toFixed(2)} N</div>
                    <p className="text-sm text-gray-400 mt-1">
                      Baseado em energia, temperatura e campo magnético
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Energia de Repulsão</h3>
                    <div className="text-2xl font-mono">
                      {(selectedElement.repulsion * repulsionForce * magneticField).toFixed(2)} kJ
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Energia gerada pela força de repulsão
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Eficiência Energética</h3>
                    <div className="text-2xl font-mono">
                      {((thrust / (voltage * magneticField)) * 100).toFixed(2)}%
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Razão entre empuxo e energia consumida
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Thermometer className="text-violet-400 w-5 h-5" />
                  Análise Termodinâmica
                </h2>
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Energia Térmica</h3>
                    <div className="text-2xl font-mono">
                      {(1.380649e-23 * temperature * selectedElement.weight).toExponential(2)} J
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Energia cinética média por partícula
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Pressão de Radiação</h3>
                    <div className="text-2xl font-mono">
                      {((thrust / (Math.PI * 0.1 * 0.1)) * 1e-6).toFixed(2)} MPa
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Pressão exercida pelo feixe de laser
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização da Simetria</h2>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização dos estados quânticos e simetrias</p>
                  <p>• Campo magnético e forças de repulsão</p>
                  <p>• Interações entre partículas</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="text-violet-400 w-5 h-5" />
                  Equações Fundamentais
                </h2>
                <div className="space-y-4 font-mono text-sm">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Empuxo</h3>
                    <p>F = T₀ × (E/E₀) × (T/T₀) × (B/B₀)</p>
                    <p className="text-gray-400 mt-1">
                      T₀: Empuxo base, E: Energia, T: Temperatura, B: Campo magnético
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Energia de Repulsão</h3>
                    <p>E_r = R × F_r × B</p>
                    <p className="text-gray-400 mt-1">
                      R: Coeficiente de repulsão, F_r: Força de repulsão, B: Campo magnético
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Energia Térmica</h3>
                    <p>E_t = k_B × T × m</p>
                    <p className="text-gray-400 mt-1">
                      k_B: Constante de Boltzmann, T: Temperatura, m: Massa atômica
                    </p>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Pressão de Radiação</h3>
                    <p>P = F / (π × r²)</p>
                    <p className="text-gray-400 mt-1">
                      F: Força total, r: Raio do feixe de laser
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Rocket className="text-violet-400 w-5 h-5" />
                  Aplicações Práticas
                </h2>
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Propulsão Espacial</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Empuxo específico: {(thrust / (voltage * 0.001)).toFixed(2)} N/kW</li>
                      <li>• Eficiência de conversão: {((thrust / (voltage * magneticField)) * 100).toFixed(2)}%</li>
                      <li>• Temperatura de operação: {temperature} K</li>
                    </ul>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Controle de Campo</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Intensidade magnética: {magneticField} T</li>
                      <li>• Força de repulsão: {repulsionForce.toFixed(1)} kN</li>
                      <li>• Tensão aplicada: {voltage} V</li>
                    </ul>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Eficiência do Sistema</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Consumo de energia: {(voltage * magneticField * 0.001).toFixed(2)} kW</li>
                      <li>• Densidade de potência: {(thrust / (Math.PI * 0.1 * 0.1)).toFixed(2)} N/m²</li>
                      <li>• Eficiência térmica: {((1 - 300/temperature) * 100).toFixed(2)}%</li>
                    </ul>
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
