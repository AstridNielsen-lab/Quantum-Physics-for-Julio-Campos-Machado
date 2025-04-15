import React from 'react';
import { TestTube, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const MaterialsPage = () => {
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
            <TestTube className="text-violet-400" />
            Materiais Naturais e Isocovalentes
          </h1>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Materiais Fundamentais
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Lista de Materiais
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
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Características Principais
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Alta estabilidade estrutural
                    
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Propriedades quânticas únicas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Condutividade controlável
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Resistência a condições extremas
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Propriedades Especiais
              </h2>
              <p className="text-gray-300 mb-6">
                A combinação específica destes materiais permite a criação de estruturas
                atômicas estáveis mesmo em ambientes de altíssima energia, fundamentais
                para aplicações em propulsão quântica.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Estabilidade
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Resistência térmica</li>
                    <li>• Integridade estrutural</li>
                    <li>• Durabilidade temporal</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Condutividade
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Controle elétrico</li>
                    <li>• Fluxo quântico</li>
                    <li>• Modulação de campo</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Aplicações
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Propulsão quântica</li>
                    <li>• Armazenamento de energia</li>
                    <li>• Proteção estrutural</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Tabela de Propriedades
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-violet-500/20">
                      <th className="py-3 px-4 text-violet-400">Material</th>
                      <th className="py-3 px-4 text-violet-400">Estabilidade</th>
                      <th className="py-3 px-4 text-violet-400">Condutividade</th>
                      <th className="py-3 px-4 text-violet-400">Aplicação Principal</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-violet-500/20">
                      <td className="py-3 px-4">Grafeno</td>
                      <td className="py-3 px-4">Alta</td>
                      <td className="py-3 px-4">Excelente</td>
                      <td className="py-3 px-4">Condução de energia</td>
                    </tr>
                    <tr className="border-b border-violet-500/20">
                      <td className="py-3 px-4">Diamante</td>
                      <td className="py-3 px-4">Muito Alta</td>
                      <td className="py-3 px-4">Moderada</td>
                      <td className="py-3 px-4">Estrutura de suporte</td>
                    </tr>
                    <tr className="border-b border-violet-500/20">
                      <td className="py-3 px-4">Sílica</td>
                      <td className="py-3 px-4">Média</td>
                      <td className="py-3 px-4">Baixa</td>
                      <td className="py-3 px-4">Isolamento</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Silicetos</td>
                      <td className="py-3 px-4">Alta</td>
                      <td className="py-3 px-4">Variável</td>
                      <td className="py-3 px-4">Modulação de campo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
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

export default MaterialsPage;