import React, { useState } from 'react';
import { Layers, Zap, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';

const ThermalMeshApplication: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full">
      <button 
        className="w-full flex justify-between items-center text-left text-xl font-semibold mb-3 border-b border-gray-700 pb-2 focus:outline-none" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          <Layers className="mr-2 h-5 w-5 text-teal-400" /> Aplicação da Malha Térmica
        </span>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}> 
        <div className="space-y-3 text-gray-300 text-sm pt-2">
          <p>
            A simulação da <strong className="text-teal-400">Malha Antitérmica Multi-Camada</strong> nesta página representa um conceito chave para a gestão térmica numa espaçonave quântica: o uso de <strong className="text-purple-400">materiais termoelétricos</strong> (como os simulados: Bi₂Te₃, SnSe, Skutterudite) para controlo ativo de temperatura e recuperação de energia.
          </p>
          <p>
            <strong className="text-yellow-400">Recuperação de Calor Residual (Efeito Seebeck):</strong> O calor intenso gerado por componentes como lasers e a câmara de confinamento, em vez de ser simplesmente dissipado, pode ser parcialmente convertido em energia elétrica útil pela malha termoelétrica. Esta energia pode realimentar sistemas auxiliares, aumentando a eficiência geral da nave.
          </p>
          <p>
            <strong className="text-blue-400">Refrigeração/Aquecimento Ativo (Efeito Peltier):</strong> Embora a simulação se foque no Efeito Seebeck (geração de energia a partir do calor), os mesmos materiais podem operar em reverso (Efeito Peltier). Aplicando uma corrente elétrica, a malha pode ativamente bombear calor de um lado para o outro. Isto seria crucial para:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Manter as <strong className="text-blue-400">temperaturas criogénicas</strong> das bobinas supercondutoras.</li>
            <li>Garantir a <strong className="text-yellow-500">estabilidade térmica</strong> do controlador quântico.</li>
            <li>Controlar a <strong className="text-green-400">temperatura do habitáculo</strong> da tripulação (o nosso alvo de 28°C / 301K na simulação).</li>
          </ul>
          <p>
            A estrutura <strong className="text-teal-400">multi-camada</strong> permite otimizar o desempenho termoelétrico em diferentes gradientes de temperatura e pode ser projetada com materiais misturados ou diferentes em cada camada para maximizar a eficiência (ZT) em condições operacionais específicas.
          </p>
           <p>
            Portanto, esta simulação, embora simplificada, explora um mecanismo fundamental que poderia ser parte integrante do complexo sistema de gestão térmica necessário para viabilizar viagens interestelares quânticas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThermalMeshApplication;

