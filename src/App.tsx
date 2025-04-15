import React from 'react';
import { Atom, Brain, Contact, Download, ExternalLink, TestTube, Rocket, Send, Stars, Zap } from 'lucide-react';
import ContactForm from './components/ContactForm';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import ProjectSection from './components/ProjectSection';
import QuantumCrystals from './components/QuantumCrystals';
import QuantumEngine from './components/QuantumEngine';
import Materials from './components/Materials';
import Mission from './components/Mission';

function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main>
        <Hero />
        
        <section id="about" className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
              <Brain className="text-violet-400" />
              Sobre o Projeto
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-gray-300">
                  O projeto "Quantum Doors e Cristais Isocovalentes" representa uma revolução
                  na física teórica, explorando a manipulação de campos magnéticos, elétricos
                  e partículas subatômicas para propulsão intergaláctica e controle quântico.
                </p>
                <p className="text-gray-300">
                  Nossa pesquisa se concentra na compreensão profunda de como as propriedades
                  elétricas e de massa dos materiais afetam a locomoção no espaço-tempo,
                  desenvolvendo tecnologias inovadoras para viagens interestelares.
                </p>
              </div>
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h3 className="text-xl font-semibold mb-4 text-violet-400">
                  Principais Conceitos
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Zap className="text-violet-400 mt-1 w-5 h-5" />
                    <span>Arrasto quântico e sua redução através de estruturas moleculares específicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Atom className="text-violet-400 mt-1 w-5 h-5" />
                    <span>Manipulação de elétrons acelerados usando campos magnéticos assimétricos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Stars className="text-violet-400 mt-1 w-5 h-5" />
                    <span>Desenvolvimento de motores quânticos de dobra espacial</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <ProjectSection />
        <QuantumCrystals />
        <Materials />
        <QuantumEngine />
        <Mission />
        
        <section id="contact" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-violet-900/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
              <Contact className="text-violet-400" />
              Contato
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Julio Campos Machado</h3>
                <p className="text-gray-300 mb-4">Presidente da Like Look Solutions</p>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/5511992946628"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    +55 11 99294-6628
                  </a>
                  <a
                    href="https://likelook.wixsite.com/solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Like Look Solutions
                  </a>
                  <a
                    href="/projeto-quantum.pdf"
                    download
                    className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download do Projeto (PDF)
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;