import React from 'react';
import { Diamond, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const CrystalsPage = () => {
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
            <Diamond className="text-violet-400" />
            Cristais Quânticos Iso-Carregados
          </h1>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Propriedades Isocovalentes
              </h2>
              <p className="text-gray-300 mb-4">
                Os cristais quânticos iso-carregados possuem propriedades únicas que
                permitem a manipulação precisa de campos magnéticos e elétricos,
                mantendo uma estabilidade atômica excepcional.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Características Fundamentais
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Estrutura cristalina estável</li>
                    <li>• Distribuição eletrônica uniforme</li>
                    <li>• Alta condutividade quântica</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Aplicações Avançadas
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Controle de campos quânticos</li>
                    <li>• Sistemas de propulsão</li>
                    <li>• Armazenamento de energia</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Redução de Resistência
              </h2>
              <p className="text-gray-300 mb-4">
                A estrutura única desses cristais permite uma redução significativa
                da resistência quântica, otimizando a eficiência energética e o
                controle de campos.
              </p>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-violet-300">
                  Processo de Otimização
                </h3>
                <ol className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">1.</span>
                    Alinhamento molecular preciso
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">2.</span>
                    Controle de densidade eletrônica
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">3.</span>
                    Modulação de campos locais
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">4.</span>
                    Estabilização quântica
                  </li>
                </ol>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Aplicações Práticas
              </h2>
              <p className="text-gray-300 mb-4">
                Estes cristais são fundamentais para o desenvolvimento de motores
                quânticos e campos antigravitacionais, representando um avanço
                significativo na tecnologia de propulsão.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Propulsão
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Motores quânticos</li>
                    <li>• Campos de força</li>
                    <li>• Controle inercial</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Energia
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Armazenamento</li>
                    <li>• Conversão</li>
                    <li>• Distribuição</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Proteção
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Blindagem</li>
                    <li>• Estabilização</li>
                    <li>• Isolamento</li>
                  </ul>
                </div>
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

export default CrystalsPage;