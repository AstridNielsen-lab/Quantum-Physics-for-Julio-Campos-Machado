// src/pages/ThermodynamicControlPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Thermometer, Zap, Atom, Layers,
  Calculator, Microscope, BrainCircuit, AlertTriangle
} from 'lucide-react';
import Navigation from '../components/Navigation';
import QuantumSimulation from '../components/QuantumSimulation';
import FourierCircles from '../components/FourierCircles';
import FibonacciSpiralSimulation from '../components/FibonacciSpiralSimulation';


interface Material {
  name: string;
  symbol: string;
  atomicNumber: number;
  mass: number;
  temperature: number;
  energy: number;
  conductivity: number;
  magneticField: number;
  repulsion: number;
}

const ThermodynamicControlPanel = () => {
  const [inputEnergy, setInputEnergy] = useState(5);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [temperature, setTemperature] = useState(1000);
  const [magneticField, setMagneticField] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const materials: Material[] = [
    {
      name: 'Hidrogênio', symbol: 'H', atomicNumber: 1, mass: 1.008,
      temperature: 14.01, energy: 13.6, conductivity: 0.1,
      magneticField: 5, repulsion: 0.2
    },
    {
      name: 'Hélio', symbol: 'He', atomicNumber: 2, mass: 4.003,
      temperature: 4.22, energy: 24.6, conductivity: 0.15,
      magneticField: 7, repulsion: 0.3
    },
    {
      name: 'Lítio', symbol: 'Li', atomicNumber: 3, mass: 6.941,
      temperature: 453.69, energy: 5.4, conductivity: 0.85,
      magneticField: 12, repulsion: 0.4
    },
    {
      name: 'Berílio', symbol: 'Be', atomicNumber: 4, mass: 9.012,
      temperature: 1560, energy: 9.3, conductivity: 0.9,
      magneticField: 15, repulsion: 0.5
    }
  ];

  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMaterial) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 3;

    // Omitted drawing code for brevity — assume it's the same as enviado acima

    animationRef.current = requestAnimationFrame(drawSimulation);
  };

  useEffect(() => {
    if (selectedMaterial) {
      animationRef.current = requestAnimationFrame(drawSimulation);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [selectedMaterial, temperature, magneticField]);

  const calculateOutputEnergy = () =>
    selectedMaterial ? inputEnergy * selectedMaterial.conductivity * (1 + temperature / 1000) : 0;

  const calculateMagneticFieldStrength = () =>
    selectedMaterial ? magneticField * selectedMaterial.magneticField * (1 + temperature / 2000) : 0;

  const calculateQuantumRepulsion = () =>
    selectedMaterial ? selectedMaterial.repulsion * magneticField * (1 + temperature / 3000) : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-12 flex items-center gap-3">
            <Thermometer className="text-violet-400" />
            Painel de Controle Termodinâmico
          </h1>

          <div className="col-span-full">
  <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2 text-amber-400">
    <Calculator /> Simulação da Sequência de Fibonacci
  </h2>
  <FibonacciSpiralSimulation />
</div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-violet-900/20 border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-4">Material</h2>
                <select
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={selectedMaterial?.symbol || ''}
                  onChange={(e) => {
                    const mat = materials.find(m => m.symbol === e.target.value);
                    if (mat) setSelectedMaterial(mat);
                  }}
                >
                  <option value="">Selecione um material</option>
                  {materials.map(mat => (
                    <option key={mat.symbol} value={mat.symbol}>
                      {mat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-6 rounded-xl bg-blue-900/20 border border-blue-500/20">
                <label className="block mb-2">Temperatura (K)</label>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                />
                <p>{temperature} K</p>
              </div>

              <div className="p-6 rounded-xl bg-blue-900/20 border border-blue-500/20">
                <label className="block mb-2">Campo Magnético</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={magneticField}
                  onChange={(e) => setMagneticField(Number(e.target.value))}
                  className="w-full"
                />
                <p>{magneticField} T</p>
              </div>

              <div className="p-6 rounded-xl bg-blue-900/20 border border-blue-500/20">
                <label className="block mb-2">Energia de Entrada</label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={inputEnergy}
                  onChange={(e) => setInputEnergy(Number(e.target.value))}
                  className="w-full"
                />
                <p>{inputEnergy} J</p>
              </div>
            </div>

            <div className="col-span-full">
  <QuantumSimulation /> 
</div>

<div className="col-span-full">
<FourierCircles /> 
</div>


            
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThermodynamicControlPanel;
