import React from 'react';
import { TestTube } from 'lucide-react';

const Materials = () => {
  return (
    <section id="materials" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-violet-900/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <TestTube className="text-violet-400" />
          Materiais Naturais e Isocovalentes
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Materiais Fundamentais
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Sílica e Quartzo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Grafeno
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Diamante
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Borato de Alumínio
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Silicetos
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Propriedades Especiais
              </h3>
              <p className="text-gray-300">
                A combinação específica destes materiais permite a criação de estruturas
                atômicas estáveis mesmo em ambientes de altíssima energia, fundamentais
                para aplicações em propulsão quântica.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Tabela de Propriedades
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-violet-500/20">
                    <th className="py-2 px-4 text-violet-400">Material</th>
                    <th className="py-2 px-4 text-violet-400">Estabilidade</th>
                    <th className="py-2 px-4 text-violet-400">Condutividade</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-violet-500/20">
                    <td className="py-2 px-4">Grafeno</td>
                    <td className="py-2 px-4">Alta</td>
                    <td className="py-2 px-4">Excelente</td>
                  </tr>
                  <tr className="border-b border-violet-500/20">
                    <td className="py-2 px-4">Diamante</td>
                    <td className="py-2 px-4">Muito Alta</td>
                    <td className="py-2 px-4">Moderada</td>
                  </tr>
                  <tr className="border-b border-violet-500/20">
                    <td className="py-2 px-4">Sílica</td>
                    <td className="py-2 px-4">Média</td>
                    <td className="py-2 px-4">Baixa</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Silicetos</td>
                    <td className="py-2 px-4">Alta</td>
                    <td className="py-2 px-4">Variável</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Materials;