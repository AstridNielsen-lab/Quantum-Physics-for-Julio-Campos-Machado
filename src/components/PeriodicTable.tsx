import React, { useState, useRef, useEffect } from 'react';
import { Atom, Thermometer, Zap, Scale, Microscope } from 'lucide-react';

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  electronConfiguration: string;
  electronegativity: number;
  density: number;
  meltingPoint: number;
  boilingPoint: number;
  category: string;
  block: string;
  electrons: number;
  protons: number;
  neutrons: number;
  color: string;
}

const elements: Element[] = [
  {
    symbol: 'H',
    name: 'Hidrogênio',
    atomicNumber: 1,
    atomicMass: 1.008,
    electronConfiguration: '1s¹',
    electronegativity: 2.20,
    density: 0.00008988,
    meltingPoint: -259.14,
    boilingPoint: -252.87,
    category: 'non-metal',
    block: 's',
    electrons: 1,
    protons: 1,
    neutrons: 0,
    color: '#22d3ee'
  },
  {
    symbol: 'He',
    name: 'Hélio',
    atomicNumber: 2,
    atomicMass: 4.002602,
    electronConfiguration: '1s²',
    electronegativity: 0,
    density: 0.0001785,
    meltingPoint: -272.2,
    boilingPoint: -268.93,
    category: 'noble-gas',
    block: 's',
    electrons: 2,
    protons: 2,
    neutrons: 2,
    color: '#a855f7'
  },
  // Add more elements as needed
];

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const drawAtomicStructure = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedElement) return;
    
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
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();

    ctx.save();
    ctx.filter = 'blur(10px)';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.restore();

    // Draw electron shells
    const shellCount = Math.ceil(selectedElement.electrons / 8);
    for (let shell = 0; shell < shellCount; shell++) {
      const radius = 40 + shell * 30;
      const electronsInShell = Math.min(8, selectedElement.electrons - (shell * 8));
      
      // Draw shell orbit
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw electrons
      for (let i = 0; i < electronsInShell; i++) {
        const angle = (i * Math.PI * 2 / electronsInShell) + time * (1 + shell * 0.5);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.fill();

        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw quantum effects
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time;
      const radius = 30 + Math.sin(time * 2 + i) * 10;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${0.5 + Math.sin(time + i) * 0.5})`;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawAtomicStructure);
  };

  useEffect(() => {
    if (selectedElement) {
      drawAtomicStructure();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedElement]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-18 gap-1">
        {elements.map((element) => (
          <button
            key={element.symbol}
            onClick={() => setSelectedElement(element)}
            className={`p-2 rounded-lg text-center transition-colors ${
              selectedElement?.symbol === element.symbol
                ? 'bg-violet-600 text-white'
                : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
            }`}
          >
            <div className="text-xs opacity-75">{element.atomicNumber}</div>
            <div className="text-lg font-bold">{element.symbol}</div>
            <div className="text-xs truncate">{element.name}</div>
          </button>
        ))}
      </div>

      {selectedElement ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Atom className="text-violet-400" />
              Estrutura Atômica
            </h3>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full bg-[#1a1a2e] rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Microscope className="text-violet-400" />
                Propriedades Básicas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Número Atômico</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.atomicNumber}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Massa Atômica</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.atomicMass}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Elétrons</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.electrons}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Prótons</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.protons}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="text-violet-400" />
                Propriedades Físicas
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Ponto de Fusão</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.meltingPoint}°C
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Ponto de Ebulição</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.boilingPoint}°C
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Densidade</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.density} g/cm³
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-violet-400" />
                Propriedades Eletrônicas
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Configuração Eletrônica</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.electronConfiguration}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Eletronegatividade</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.electronegativity}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Bloco</div>
                  <div className="text-lg font-semibold text-violet-400">
                    {selectedElement.block}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
          <div className="text-center text-gray-400">
            Selecione um elemento para ver suas propriedades
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;