import React from 'react';
import { Target, Zap, Atom, Lightbulb } from 'lucide-react';

const Mission = () => {
  return (
    <section id="mission" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-violet-900/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Target className="text-violet-400" />
          Missão e Tecnologia
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
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

        <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20 mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-violet-400 flex items-center gap-3">
            <Lightbulb className="text-violet-400" />
            Tecnologia de Laser e Controle Quântico
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-violet-300 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Zonas de Dopagem Controlada
              </h4>
              <p className="text-gray-300 mb-4">
                Desenvolvemos um sistema avançado de dopagem iônica utilizando boro, 
                nitrogênio e flúor para criar regiões de carga fixa precisamente 
                controladas. Estas zonas de dopagem permitem a manipulação precisa 
                de campos eletromagnéticos em escala quântica.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Boro: Controle de cargas positivas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Nitrogênio: Estabilização de campo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Flúor: Modulação de cargas negativas
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-violet-300 flex items-center gap-2">
                <Atom className="w-5 h-5" />
                Interação Laser-Cristal
              </h4>
              <p className="text-gray-300 mb-4">
                O feixe laser atravessa o cristal em ângulos precisamente calculados, 
                interagindo com a matriz cristalina para alterar o estado de energia 
                dos elétrons e fótons circundantes. Esta interação é fundamental para 
                o controle quântico do sistema.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Alteração controlada de estados quânticos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Modulação de energia eletrônica
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Controle de interação fóton-elétron
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4 text-violet-300">
              Campo Magnético Dinâmico e Controle Quântico
            </h4>
            <p className="text-gray-300 mb-4">
              A aplicação de campos magnéticos dinâmicos permite direcionar e modular 
              a trajetória dos elétrons com precisão sem precedentes. A interação 
              combinada entre o laser, as zonas de dopagem e o campo magnético cria 
              um sistema de controle quântico capaz de:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
                <h5 className="font-semibold text-violet-300 mb-2">Canalização Quântica</h5>
                <p className="text-gray-300 text-sm">
                  Direcionamento preciso de elétrons e íons através de canais quânticos controlados
                </p>
              </div>
              <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
                <h5 className="font-semibold text-violet-300 mb-2">Zonas de Repulsão</h5>
                <p className="text-gray-300 text-sm">
                  Criação de barreiras quânticas para controle de fluxo de partículas
                </p>
              </div>
              <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
                <h5 className="font-semibold text-violet-300 mb-2">Atração Controlada</h5>
                <p className="text-gray-300 text-sm">
                  Geração de pontos de convergência para concentração de energia
                </p>
              </div>
            </div>
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
                <li>• Desenvolvimento de protótipos</li>
                <li>• Testes em laboratório</li>
                <li>• Parcerias científicas</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-violet-300">
                Médio Prazo
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Testes em escala real</li>
                <li>• Otimização de sistemas</li>
                <li>• Expansão de pesquisa</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-violet-300">
                Longo Prazo
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Implementação comercial</li>
                <li>• Missões espaciais</li>
                <li>• Exploração interestelar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;