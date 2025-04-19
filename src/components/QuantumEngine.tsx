import React from 'react';
import { Rocket, Zap, Atom, Brain, Shield } from 'lucide-react';

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
                Sistema de Propulsão Quântica
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <Atom className="text-violet-400 mt-1 w-5 h-5" />
                  <span>Manipulação de elétrons em nível subatômico para propulsão</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="text-violet-400 mt-1 w-5 h-5" />
                  <span>Campos magnéticos assimétricos para controle direcional</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="text-violet-400 mt-1 w-5 h-5" />
                  <span>Sistema de controle quântico de alta precisão</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="text-violet-400 mt-1 w-5 h-5" />
                  <span>Blindagem avançada contra radiação e campos intensos</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-xl font-semibold mb-4 text-violet-400">
                Funcionamento
              </h3>
              <p className="text-gray-300 mb-4">
                O motor utiliza elétrons superacelerados em uma câmara de contenção especializada,
                controlados por campos magnéticos assimétricos para criar zonas de repulsão
                eletromagnética quântica, resultando em propulsão sem ejeção de massa convencional.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-violet-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-violet-300 mb-2">Vantagens</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• Baixo consumo energético</li>
                    <li>• Alta eficiência quântica</li>
                    <li>• Controle preciso</li>
                  </ul>
                </div>
                <div className="bg-violet-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-violet-300 mb-2">Aplicações</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• Viagens interestelares</li>
                    <li>• Exploração espacial</li>
                    <li>• Transporte quântico</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
            <h3 className="text-xl font-semibold mb-4 text-violet-400">
              Diagrama do Motor Quântico
            </h3>
            <div className="aspect-square relative bg-[#020617] rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Nave Central */}
                <div className="relative w-1/3 h-1/6 bg-violet-400/20 rounded-full border border-violet-400/40">
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-violet-400">
                    NAVE
                  </div>
                </div>

                {/* Câmara de Contenção */}
                <div className="absolute w-2/3 h-1/3 border-4 border-dashed border-violet-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                
                {/* Campo Magnético Assimétrico */}
                <div className="absolute w-3/4 h-2/5 border-2 border-blue-500/30 rounded-full animate-[spin_8s_linear_infinite]" />

                {/* Elétrons */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                    style={{
                      top: `${50 + Math.sin(i * 30) * 30}%`,
                      left: `${50 + Math.cos(i * 30) * 30}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}

                {/* Condensadores de Plasma */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-24 bg-violet-500/20 border border-violet-500/40" />
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-24 bg-violet-500/20 border border-violet-500/40" />

                {/* Forças de Casimir */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`force-${i}`}
                    className="absolute w-16 h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/50 to-violet-500/0"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      transformOrigin: 'center',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                ))}

                {/* Impulso */}
                <div className="absolute right-0 w-24 h-4">
                  <div className="w-full h-full bg-gradient-to-r from-violet-500/0 via-violet-500/30 to-violet-500/0 animate-pulse" />
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-violet-400">
                    IMPULSO →
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4 text-violet-300">
                Componentes Principais
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-dashed border-violet-500 rounded-full" />
                    <span className="text-sm text-gray-300">Câmara de Contenção</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                    <span className="text-sm text-gray-300">Elétrons Acelerados</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Campo Magnético</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-violet-500/50 rounded-full" />
                    <span className="text-sm text-gray-300">Condensadores de Plasma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuantumEngine;