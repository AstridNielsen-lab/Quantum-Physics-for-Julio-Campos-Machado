import React from 'react';
import { Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ProjectPage = () => {
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
            <Lightbulb className="text-violet-400" />
            Detalhes do Projeto
          </h1>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Propriedades Elétricas e Massa
              </h2>
              <p className="text-gray-300 mb-4">
                Nossa pesquisa demonstra como as propriedades elétricas e de massa dos
                materiais influenciam diretamente na capacidade de locomoção através do
                espaço-tempo, estabelecendo novas possibilidades para propulsão espacial.
              </p>
              <p className="text-gray-300">
                Através de experimentos detalhados e modelagem matemática avançada,
                identificamos padrões específicos que permitem otimizar a interação
                entre massa e campos eletromagnéticos.
              </p>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Arrasto Quântico
              </h2>
              <p className="text-gray-300 mb-4">
                O conceito de arrasto quântico é fundamental para nossa pesquisa,
                demonstrando como a estrutura molecular pode ser otimizada para reduzir
                a resistência ao movimento no nível quântico.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Fatores de Influência
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Densidade eletrônica</li>
                    <li>• Configuração molecular</li>
                    <li>• Campos magnéticos locais</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Otimizações Propostas
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Alinhamento molecular</li>
                    <li>• Controle de spin</li>
                    <li>• Modulação de campo</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Redução de Eletricidade
              </h2>
              <p className="text-gray-300 mb-4">
                A redução controlada da eletricidade dos materiais resulta em melhor
                eficiência de propulsão, permitindo avanços significativos no
                desenvolvimento de sistemas de propulsão quântica.
              </p>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-violet-300">
                  Processo de Otimização
                </h3>
                <ol className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">1.</span>
                    Análise da estrutura eletrônica do material
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">2.</span>
                    Identificação de pontos de controle quântico
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">3.</span>
                    Aplicação de campos moduladores
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-400 font-bold">4.</span>
                    Monitoramento e ajuste em tempo real
                  </li>
                </ol>
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

export default ProjectPage;