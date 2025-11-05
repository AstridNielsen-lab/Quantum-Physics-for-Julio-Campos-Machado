import React, { useEffect, useRef, useState } from 'react';
import { TestTube, Atom, Zap, Thermometer, Microscope } from 'lucide-react';
import PeriodicTable from './PeriodicTable';

interface Material {
  name: string;
  type: 'natural' | 'isocovalent';
  conductivity: number;
  thermalConductivity: number;
  meltingPoint: number;
  structure: string;
  color: string;
}

const Materials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [temperature, setTemperature] = useState(25);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const materials: Material[] = [
    {
      name: 'Sílica',
      type: 'natural',
      conductivity: 0.1,
      thermalConductivity: 1.4,
      meltingPoint: 1713,
      structure: 'Tetraédrica',
      color: '#22d3ee'
    },
    {
      name: 'Quartzo',
      type: 'natural',
      conductivity: 0.2,
      thermalConductivity: 2.0,
      meltingPoint: 1650,
      structure: 'Hexagonal',
      color: '#a855f7'
    },
    {
      name: 'Grafeno',
      type: 'isocovalent',
      conductivity: 0.98,
      thermalConductivity: 5000,
      meltingPoint: 4800,
      structure: 'Hexagonal',
      color: '#ec4899'
    },
    {
      name: 'Diamante',
      type: 'isocovalent',
      conductivity: 0.01,
      thermalConductivity: 2200,
      meltingPoint: 3550,
      structure: 'Cúbica',
      color: '#eab308'
    },
    {
      name: 'Silício',
      type: 'isocovalent',
      conductivity: 0.5,
      thermalConductivity: 150,
      meltingPoint: 1414,
      structure: 'Cúbica',
      color: '#3b82f6'
    }
  ];

  const drawMaterialStructure = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedMaterial) return;

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

    const centerX = width / 2;
    const centerY = height / 2;

    if (selectedMaterial.structure === 'Hexagonal') {
      const hexSize = 40;
      const hexCount = 7;
      
      for (let layer = 0; layer < hexCount; layer++) {
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 + time + layer * 0.1;
          const radius = hexSize * (layer + 1) * (0.8 + Math.sin(time * 2) * 0.2);
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = selectedMaterial.color;
          ctx.fill();

          if (layer > 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            const prevAngle = angle - Math.PI / 3;
            const prevX = centerX + Math.cos(prevAngle) * radius;
            const prevY = centerY + Math.sin(prevAngle) * radius;
            ctx.lineTo(prevX, prevY);
            ctx.strokeStyle = `${selectedMaterial.color}44`;
            ctx.stroke();
          }

          // Energy particles
          const particleCount = 3;
          for (let j = 0; j < particleCount; j++) {
            const particleAngle = angle + (j * Math.PI * 2) / particleCount + time * 2;
            const particleRadius = radius * 0.8;
            const px = x + Math.cos(particleAngle) * particleRadius * 0.2;
            const py = y + Math.sin(particleAngle) * particleRadius * 0.2;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = `${selectedMaterial.color}88`;
            ctx.fill();
          }
        }
      }
    } else if (selectedMaterial.structure === 'Cúbica') {
      const cubeSize = 100;
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      const rotationX = time;
      const rotationY = time * 0.7;

      // Project 3D points to 2D
      const projectedPoints = vertices.map(([x, y, z]) => {
        // Rotate around Y axis
        const rotY = [
          x * Math.cos(rotationY) + z * Math.sin(rotationY),
          y,
          -x * Math.sin(rotationY) + z * Math.cos(rotationY)
        ];

        // Rotate around X axis
        const rotX = [
          rotY[0],
          rotY[1] * Math.cos(rotationX) - rotY[2] * Math.sin(rotationX),
          rotY[1] * Math.sin(rotationX) + rotY[2] * Math.cos(rotationX)
        ];

        // Project to 2D
        const scale = 1 / (4 - rotX[2]);
        return [
          centerX + rotX[0] * cubeSize * scale,
          centerY + rotX[1] * cubeSize * scale
        ];
      });

      // Draw edges
      const edges = [
        [0,1], [1,2], [2,3], [3,0],
        [4,5], [5,6], [6,7], [7,4],
        [0,4], [1,5], [2,6], [3,7]
      ];

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projectedPoints[a][0], projectedPoints[a][1]);
        ctx.lineTo(projectedPoints[b][0], projectedPoints[b][1]);
        ctx.strokeStyle = `${selectedMaterial.color}44`;
        ctx.stroke();
      });

      // Draw vertices
      projectedPoints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = selectedMaterial.color;
        ctx.fill();
      });
    } else if (selectedMaterial.structure === 'Tetraédrica') {
      const tetraSize = 100;
      const vertices = [
        [0, -1, 0],
        [Math.sqrt(8/9), 1/3, 0],
        [-Math.sqrt(2/9), 1/3, Math.sqrt(2/3)],
        [-Math.sqrt(2/9), 1/3, -Math.sqrt(2/3)]
      ];

      const rotationX = time;
      const rotationY = time * 0.7;

      const projectedPoints = vertices.map(([x, y, z]) => {
        // Rotate around Y axis
        const rotY = [
          x * Math.cos(rotationY) + z * Math.sin(rotationY),
          y,
          -x * Math.sin(rotationY) + z * Math.cos(rotationY)
        ];

        // Rotate around X axis
        const rotX = [
          rotY[0],
          rotY[1] * Math.cos(rotationX) - rotY[2] * Math.sin(rotationX),
          rotY[1] * Math.sin(rotationX) + rotY[2] * Math.cos(rotationX)
        ];

        // Project to 2D
        const scale = 1 / (4 - rotX[2]);
        return [
          centerX + rotX[0] * tetraSize * scale,
          centerY + rotX[1] * tetraSize * scale
        ];
      });

      // Draw edges
      const edges = [
        [0,1], [1,2], [2,0],
        [0,3], [1,3], [2,3]
      ];

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projectedPoints[a][0], projectedPoints[a][1]);
        ctx.lineTo(projectedPoints[b][0], projectedPoints[b][1]);
        ctx.strokeStyle = `${selectedMaterial.color}44`;
        ctx.stroke();
      });

      // Draw vertices
      projectedPoints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = selectedMaterial.color;
        ctx.fill();

        // Add energy particles
        const particleCount = 3;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i * Math.PI * 2) / particleCount + time * 2;
          const radius = 15;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `${selectedMaterial.color}88`;
          ctx.fill();
        }
      });
    }

    // Draw thermal effects
    const thermalRadius = 150 * (temperature / 100);
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, thermalRadius
    );
    gradient.addColorStop(0, `${selectedMaterial.color}22`);
    gradient.addColorStop(1, `${selectedMaterial.color}00`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, thermalRadius, 0, Math.PI * 2);
    ctx.fill();

    animationRef.current = requestAnimationFrame(drawMaterialStructure);
  };

  useEffect(() => {
    if (selectedMaterial) {
      drawMaterialStructure();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedMaterial, temperature]);

  return (
    <section id="materials" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-violet-900/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <TestTube className="text-violet-400" />
          Materiais Naturais e Isocovalentes
        </h2>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Atom className="text-violet-400" />
            Tabela Periódica Interativa
          </h3>
          <PeriodicTable />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400 flex items-center gap-2">
                <Microscope className="w-5 h-5" />
                Seleção de Material
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {materials.map((material) => (
                  <button
                    key={material.name}
                    onClick={() => setSelectedMaterial(material)}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      selectedMaterial?.name === material.name
                        ? 'bg-violet-600 text-white'
                        : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: material.color }}
                      />
                      <span>{material.name}</span>
                    </div>
                    <div className="mt-2 text-xs opacity-75">
                      Tipo: {material.type === 'natural' ? 'Natural' : 'Isocovalente'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedMaterial && (
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h3 className="text-xl font-semibold mb-4 text-violet-400 flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  Propriedades
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Condutividade Elétrica</span>
                      <span className="text-violet-400">
                        {(selectedMaterial.conductivity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-400"
                        style={{ width: `${selectedMaterial.conductivity * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Condutividade Térmica</span>
                      <span className="text-violet-400">
                        {selectedMaterial.thermalConductivity} W/mK
                      </span>
                    </div>
                    <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-400"
                        style={{ width: `${(selectedMaterial.thermalConductivity / 5000) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Ponto de Fusão</span>
                      <span className="text-violet-400">
                        {selectedMaterial.meltingPoint}°C
                      </span>
                    </div>
                    <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-400"
                        style={{ width: `${(selectedMaterial.meltingPoint / 5000) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Temperatura Simulada
                    </label>
                    <input
                      type="range"
                      min="25"
                      max="100"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {temperature}°C
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Comportamento sob Alta Tensão
              </h3>
              <p className="text-gray-300 mb-4">
                Sob tensão de 17kV, os materiais isocovalentes mantêm maior
                estabilidade estrutural devido às suas ligações químicas
                equivalentes, enquanto materiais naturais podem sofrer ionização
                ou alterações em sua estrutura cristalina.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-violet-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-violet-300 mb-2">Materiais Naturais</h4>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>• Ionização parcial</li>
                    <li>• Deformação estrutural</li>
                    <li>• Aquecimento localizado</li>
                  </ul>
                </div>
                <div className="bg-violet-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-violet-300 mb-2">Isocovalentes</h4>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>• Alta estabilidade</li>
                    <li>• Condução controlada</li>
                    <li>• Resistência térmica</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Visualização da Estrutura
              </h3>
              {selectedMaterial ? (
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center text-gray-400 bg-[#1a1a2e] rounded-lg">
                  Selecione um material para visualizar sua estrutura
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Características Principais
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-violet-300">
                    Materiais Naturais
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Estrutura variável</li>
                    <li>• Condutividade moderada</li>
                    <li>• Resistência térmica média</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-violet-300">
                    Materiais Isocovalentes
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Estrutura regular</li>
                    <li>• Alta condutividade</li>
                    <li>• Resistência térmica superior</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Materials;