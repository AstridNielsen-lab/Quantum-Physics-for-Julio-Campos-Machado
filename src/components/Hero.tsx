import React from 'react';
import { Atom } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with particle effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 to-[#020617]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-violet-500/10 rounded-full mb-8">
          <Atom className="text-violet-400 w-8 h-8" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
          Quantum Doors e Cristais Isocovalentes
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Explorando os limites da física quântica para revolucionar a propulsão intergaláctica
          e o controle de campos magnéticos.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="https://modern-physics-julio-campos-machado.vercel.app"
            className="px-8 py-3 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors text-white font-semibold"
          >
            Conheça o Projeto
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-transparent border border-violet-600 hover:bg-violet-600/10 rounded-full transition-colors text-white font-semibold"
          >
            Entre em Contato
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
