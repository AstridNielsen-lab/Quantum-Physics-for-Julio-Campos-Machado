import React from 'react';
import { Target, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const MissionPage = () => {
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
            <Target className="text-violet-400" />
            Missão e Futuro
          </h1>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Nossa Missão
              </h2>
              <p className="text-gray-300 mb-6">
                Nosso objetivo é romper as barreiras da física atual, desenvolvendo
                tecnologias revolucionárias que tornarão possível a exploração
                segura do espaço interestelar.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Objetivos Principais
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Desenvolvimento de tecnologias de propulsão quântica
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Pesquisa em materiais avançados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Inovação em sistemas de energia
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Compromissos
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Excelência científica
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Inovação responsável
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Colaboração global
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Visão de Futuro
              </h2>
              <p className="text-gray-300 mb-6">
                Visualizamos um futuro onde as viagens interestelares serão uma
                realidade, impulsionadas por nossas tecnologias de propulsão
                quântica e materiais avançados.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Curto Prazo
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Desenvolvimento de protótipos</li>
                    <li>• Testes em laboratório</li>
                    <li>• Parcerias científicas</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Médio Prazo
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Testes em escala real</li>
                    <li>• Otimização de sistemas</li>
                    <li>• Expansão de pesquisa</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Longo Prazo
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Implementação comercial</li>
                    <li>• Missões espaciais</li>
                    <li>• Exploração interestelar</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Objetivos Estratégicos
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Pesquisa e Desenvolvimento
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">1.</span>
                      Aprimoramento contínuo das tecnologias de propulsão
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">2.</span>
                      Desenvolvimento de novos materiais quânticos
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">3.</span>
                      Integração de sistemas avançados
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Colaborações e Parcerias
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">1.</span>
                      Estabelecimento de redes de pesquisa
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">2.</span>
                      Cooperação com instituições acadêmicas
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">3.</span>
                      Parcerias industriais estratégicas
                    </li>
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

export default MissionPage;