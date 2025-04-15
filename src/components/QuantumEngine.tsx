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
                  {/* Simplified quantum engine diagram using CSS */}
                  <div className="absolute inset-0 border-4 border-violet-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-[25%] border-2 border-blue-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-[40%] bg-violet-400 rounded-full"></div>
                  
                  {/* Particle effects */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rotate-45">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
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