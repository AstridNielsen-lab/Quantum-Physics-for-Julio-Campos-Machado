import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const AdiabaticCompressionInfo: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full">
      <button 
        className="w-full flex justify-between items-center text-left text-xl font-semibold mb-3 border-b border-gray-700 pb-2 focus:outline-none" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          <HelpCircle className="mr-2 h-5 w-5 text-blue-400" /> O que é Compressão Adiabática?
        </span>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      
      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}> 
        <div className="space-y-3 text-gray-300 text-sm pt-2">
          <p>
            A <strong className="text-blue-400">compressão adiabática</strong> é um processo termodinâmico onde um gás é comprimido rapidamente, de forma que <strong className="text-orange-400">não há troca de calor (Q = 0)</strong> significativa com o ambiente externo. Isso geralmente ocorre porque o processo é muito rápido ou porque o sistema está termicamente isolado.
          </p>
          <p>
            Durante a compressão adiabática:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>O <strong className="text-green-400">volume (V)</strong> do gás diminui.</li>
            <li>Trabalho (W) é realizado <strong className="text-yellow-400">sobre</strong> o gás pelo ambiente externo.</li>
            <li>Como não há troca de calor, a energia do trabalho realizado aumenta a <strong className="text-red-500">energia interna (ΔU)</strong> do gás.</li>
            <li>Consequentemente, a <strong className="text-red-500">temperatura (T)</strong> e a <strong className="text-purple-400">pressão (P)</strong> do gás aumentam.</li>
          </ul>
          <p>
            A relação entre pressão e volume para um processo adiabático reversível de um gás ideal é dada pela <strong className="text-cyan-400">Equação de Poisson</strong>:
          </p>
          <div className="p-2 bg-gray-700 rounded text-center font-mono text-cyan-300">
            P * V<sup>γ</sup> = constante
          </div>
          <p>
            Onde <strong className="text-cyan-400">γ (gamma)</strong> é o expoente adiabático (ou índice de Poisson), que depende do tipo de gás (por exemplo, ~1.67 para gases monoatômicos, ~1.4 para diatômicos).
          </p>
          <p>
            Pela <strong className="text-yellow-400">Primeira Lei da Termodinâmica (ΔU = Q - W)</strong>, como Q = 0, temos <strong className="text-yellow-400">ΔU = -W</strong>. Como o trabalho é realizado *sobre* o gás na compressão, W é negativo, resultando num aumento da energia interna (ΔU &gt; 0) e, portanto, da temperatura.
          </p>
          <p>
            <strong className="text-lime-400">Exemplo prático:</strong> Encher rapidamente um pneu de bicicleta com uma bomba manual. O corpo da bomba aquece devido à compressão adiabática do ar dentro dela.
          </p>
          <p>
            <strong className="text-gray-400">Contraste:</strong> Numa compressão <em className="text-gray-400">isotérmica</em>, a temperatura é mantida constante, permitindo a troca de calor com o ambiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdiabaticCompressionInfo;

