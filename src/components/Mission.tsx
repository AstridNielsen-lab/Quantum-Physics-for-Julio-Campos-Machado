import React from 'react';
import { Target } from 'lucide-react';

const Mission = () => {
  return (
    <section id="mission" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-violet-900/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Target className="text-violet-400" />
          Missão e Futuro
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Nossa Missão
            </h3>
            <p className="text-gray-300 mb-6">
              Nosso objetivo é romper as barreiras da física atual, desenvolvendo
              tecnologias revolucionárias que tornarão possível a exploração
              segura do espaço interestelar.
            </p>
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

          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Visão de Futuro
            </h3>
            <p className="text-gray-300 mb-6">
              Visualizamos um futuro onde as viagens interestelares serão uma
              realidade, impulsionadas por nossas tecnologias de propulsão
              quântica e materiais avançados.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Estabelecimento de rotas interestelares seguras
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Criação de novas fontes de energia sustentável
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                Avanços na compreensão do universo quântico
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
          <h3 className="text-2xl font-semibold mb-6 text-violet-400">
            Objetivos Estratégicos
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-violet-300">
                Curto Prazo
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Desenvolvimento de protótipos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Testes em laboratório
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Parcerias científicas
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-violet-300">
                Médio Prazo
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Testes em escala real
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Otimização de sistemas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Expansão de pesquisa
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-violet-300">
                Longo Prazo
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Implementação comercial
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Missões espaciais
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Exploração interestelar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;