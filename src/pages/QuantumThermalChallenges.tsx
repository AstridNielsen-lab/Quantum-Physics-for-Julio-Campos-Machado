import React, { useState } from 'react';
import { Thermometer, Layers, Cpu, Hexagon, ChevronDown, ChevronUp } from 'lucide-react';

const QuantumThermalChallenges: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full">
      <button 
        className="w-full flex justify-between items-center text-left text-xl font-semibold mb-3 border-b border-gray-700 pb-2 focus:outline-none" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          <Thermometer className="mr-2 h-5 w-5 text-red-500" /> Desafios Térmicos Quânticos
        </span>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}> 
        <div className="space-y-3 text-gray-300 text-sm pt-2">
          <p>
            Um motor de propulsão quântica, como o conceptualizado, apresenta desafios térmicos extremos. Componentes como <strong className="text-pink-400">lasers de alta potência</strong> (Nd:YAG, 1.5-17kV) e <strong className="text-cyan-400">bobinas supercondutoras</strong> (YBa₂Cu₃O₇, 100kA, 15T) geram quantidades imensas de calor residual.
          </p>
          <p>
            Simultaneamente, as próprias bobinas supercondutoras exigem <strong className="text-blue-400">temperaturas criogénicas</strong> para funcionar, criando gradientes térmicos massivos dentro da espaçonave.
          </p>
          <p>
            A <strong className="text-gray-400">câmara de confinamento</strong> (Grafeno + Sílica) deve suportar e gerir a energia do plasma ou dos fenómenos quânticos confinados, adicionando outra fonte de stress térmico.
          </p>
          <p>
            Materiais avançados como o <strong className="text-purple-400">Grafeno</strong> e <strong className="text-green-400">cristais isocovalentes</strong> (h-BN, Si dopado) são essenciais, não só pelas suas propriedades quânticas ou estruturais, mas também pelas suas características térmicas únicas (alta condutividade para dissipação ou isolamento específico).
          </p>
           <p>
            O <strong className="text-yellow-500">controlador quântico</strong> (circuito fotónico) pode requerer uma estabilidade térmica excecional (<strong className="text-yellow-500">&lt; 1 ps latência</strong> implica controlo rigoroso de flutuações térmicas) para manter a precisão dos cálculos e operações quânticas.
          </p>
          <p>
            Gerir estes fluxos de calor e manter a integridade estrutural e operacional de todos os sistemas é um dos maiores obstáculos na engenharia de uma espaçonave interestelar quântica.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantumThermalChallenges;