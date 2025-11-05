import React from 'react';
import { Diamond } from 'lucide-react';

const QuantumCrystals = () => {
  return (
    <section id="crystals" className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Diamond className="text-violet-400" />
          Cristais Quânticos Iso-Carregados
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Propriedades Isocovalentes
            </h3>
            <p className="text-gray-300">
              Os cristais quânticos iso-carregados possuem propriedades únicas que
              permitem a manipulação precisa de campos magnéticos e elétricos,
              mantendo uma estabilidade atômica excepcional.
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Redução de Resistência
            </h3>
            <p className="text-gray-300">
              A estrutura única desses cristais permite uma redução significativa
              da resistência quântica, otimizando a eficiência energética e o
              controle de campos.
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Aplicações Práticas
            </h3>
            <p className="text-gray-300">
              Estes cristais são fundamentais para o desenvolvimento de motores
              quânticos e campos antigravitacionais, representando um avanço
              significativo na tecnologia de propulsão.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
          <h3 className="text-2xl font-semibold mb-6 text-violet-400">
            Características Principais
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Alta estabilidade em condições extremas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Capacidade de manipulação de campos quânticos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Resistência a altas temperaturas
              </li>
            </ul>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Propriedades supercondutoras
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Controle preciso de campos eletromagnéticos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Integração com sistemas de propulsão
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuantumCrystals;