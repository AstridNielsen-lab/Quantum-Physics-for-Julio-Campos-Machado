import React from 'react';
import { Rocket, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const EnginePage = () => {
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
            <Rocket className="text-violet-400" />
            Motor de Propulsão Quântica
          </h1>

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Componentes Principais
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Elementos Estruturais
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
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Características Técnicas
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Alta eficiência energética
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Controle preciso de campo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Estabilidade em operação
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      Modulação adaptativa
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Funcionamento
              </h2>
              <p className="text-gray-300 mb-6">
                O motor utiliza elétrons supercarregados em nanoestruturas de grafeno,
                controlados por campos magnéticos dinâmicos e lasers coerentes para
                criar zonas de repulsão e atração quântica controlada.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Fase 1: Inicialização
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Carregamento de elétrons</li>
                    <li>• Alinhamento de campo</li>
                    <li>• Calibração de lasers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Fase 2: Operação
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Modulação de campo</li>
                    <li>• Controle de fluxo</li>
                    <li>• Ajuste dinâmico</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Fase 3: Otimização
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Monitoramento</li>
                    <li>• Ajuste fino</li>
                    <li>• Estabilização</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Diagrama Conceitual
              </h2>
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
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-violet-300">
                  Legenda
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-violet-400 rounded-full"></div>
                    Núcleo de controle quântico
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-400 rounded-full"></div>
                    Campo magnético dinâmico
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    Partículas em aceleração
                  </li>
                </ul>
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

export default EnginePage;