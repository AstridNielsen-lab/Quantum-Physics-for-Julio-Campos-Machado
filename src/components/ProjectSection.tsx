import React from 'react';
import { Lightbulb } from 'lucide-react';

const ProjectSection = () => {
  return (
    <section id="project" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-violet-900/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Lightbulb className="text-violet-400" />
          Detalhes do Projeto
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Propriedades Elétricas e Massa
              </h3>
              <p className="text-gray-300">
                Nossa pesquisa demonstra como as propriedades elétricas e de massa dos
                materiais influenciam diretamente na capacidade de locomoção através do
                espaço-tempo, estabelecendo novas possibilidades para propulsão espacial.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Arrasto Quântico
              </h3>
              <p className="text-gray-300">
                O conceito de arrasto quântico é fundamental para nossa pesquisa,
                demonstrando como a estrutura molecular pode ser otimizada para reduzir
                a resistência ao movimento no nível quântico.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Redução de Eletricidade
              </h3>
              <p className="text-gray-300">
                A redução controlada da eletricidade dos materiais resulta em melhor
                eficiência de propulsão, permitindo avanços significativos no
                desenvolvimento de sistemas de propulsão quântica.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Motor Quântico de Dobra
              </h3>
              <p className="text-gray-300">
                Nossa proposta revolucionária de um motor quântico de dobra utiliza
                campos magnéticos assimétricos para manipular elétrons acelerados,
                abrindo novas possibilidades para viagens interestelares.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;