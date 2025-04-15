import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const AboutPage = () => {
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
            <Brain className="text-violet-400" />
            Sobre o Projeto
          </h1>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Visão Geral
              </h2>
              <p className="text-gray-300 mb-4">
                O projeto "Quantum Doors e Cristais Isocovalentes" representa uma revolução
                na física teórica, explorando a manipulação de campos magnéticos, elétricos
                e partículas subatômicas para propulsão intergaláctica e controle quântico.
              </p>
              <p className="text-gray-300">
                Nossa pesquisa se concentra na compreensão profunda de como as propriedades
                elétricas e de massa dos materiais afetam a locomoção no espaço-tempo,
                desenvolvendo tecnologias inovadoras para viagens interestelares.
              </p>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Objetivos Principais
              </h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-violet-400 font-bold">1.</span>
                  Desenvolver tecnologia de propulsão quântica revolucionária
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-400 font-bold">2.</span>
                  Criar materiais estáveis para ambientes de alta energia
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-400 font-bold">3.</span>
                  Estabelecer novos paradigmas na física teórica
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-400 font-bold">4.</span>
                  Viabilizar viagens interestelares seguras
                </li>
              </ul>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Impacto Científico
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Avanços Teóricos
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Nova compreensão da mecânica quântica</li>
                    <li>• Teorias unificadas de campos</li>
                    <li>• Modelos matemáticos inovadores</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Aplicações Práticas
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Sistemas de propulsão avançados</li>
                    <li>• Tecnologias de energia limpa</li>
                    <li>• Materiais revolucionários</li>
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

export default AboutPage;