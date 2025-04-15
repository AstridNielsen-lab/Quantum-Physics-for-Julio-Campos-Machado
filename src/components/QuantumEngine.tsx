import React from 'react';
import { Rocket } from 'lucide-react';

const QuantumEngine = () => {
  return (
    <section id="engine" className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Rocket className="text-violet-400" />
          Motor de Propulsão Quântica
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Componentes Principais
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Nanoestruturas de Grafeno
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Campos Magnéticos Dinâmicos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Lasers Coerentes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  Sistema de Controle Quântico
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Funcionamento
              </h3>
              <p className="text-gray-300">
                O motor utiliza elétrons supercarregados em nanoestruturas de grafeno,
                controlados por campos magnéticos dinâmicos e lasers coerentes para
                criar zonas de repulsão e atração quântica controlada.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Diagrama Conceitual
            </h3>
            <div className="aspect-square relative bg-violet-900/30 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 relative">
                  {/* Camada Externa - Campo de Contenção */}
                  <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-pulse opacity-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-emerald-400 text-xs">Campo de Contenção</span>
                    </div>
                  </div>

                  {/* Camada de Plasma Quântico */}
                  <div className="absolute inset-[10%] border-4 border-fuchsia-400 rounded-full animate-pulse opacity-60">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-fuchsia-400 text-xs">Plasma Quântico</span>
                    </div>
                  </div>

                  {/* Camada de Campo Magnético */}
                  <div className="absolute inset-[20%] border-2 border-blue-400 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-blue-400 text-xs">Campo Magnético</span>
                    </div>
                  </div>

                  {/* Camada de Cristais */}
                  <div className="absolute inset-[30%] border-2 border-amber-400 rounded-full animate-spin" style={{ animationDuration: '6s' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-amber-400 text-xs">Cristais Isocovalentes</span>
                    </div>
                  </div>

                  {/* Núcleo de Energia */}
                  <div className="absolute inset-[40%] bg-gradient-to-br from-red-500 to-orange-500 rounded-full animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs">Núcleo</span>
                    </div>
                  </div>
                  
                  {/* Raios de Laser */}
                  <div className="absolute inset-0">
                    {/* Laser 1 */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-500/50 to-transparent transform -translate-y-1/2 animate-pulse" />
                    {/* Laser 2 */}
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-cyan-500 via-cyan-500/50 to-transparent transform -translate-x-1/2 animate-pulse" />
                    {/* Laser 3 */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-500/50 to-transparent transform rotate-45 origin-left animate-pulse" />
                    </div>
                  </div>

                  {/* Partículas em Movimento */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rotate-45">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-violet-300">
                Legenda
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  Campo de Contenção - Estabilização do Sistema
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-fuchsia-400 rounded-full"></div>
                  Plasma Quântico - Meio de Propulsão
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  Campo Magnético - Controle Direcional
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  Cristais Isocovalentes - Amplificação de Energia
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                  Núcleo - Geração de Energia Primária
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  Lasers - Excitação dos Cristais
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuantumEngine;