import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Atom, Brain, Contact, Download, ExternalLink, TestTube, Rocket, Send, Stars, Zap, Bot, FileText, Users, Globe, Thermometer, Magnet, Map, Cpu } from 'lucide-react';
import ContactForm from './components/ContactForm';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import ProjectSection from './components/ProjectSection';
import QuantumCrystals from './components/QuantumCrystals';
import QuantumEngine from './components/QuantumEngine';
import Materials from './components/Materials';
import Mission from './components/Mission';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';
import CrystalsPage from './pages/CrystalsPage';
import MaterialsPage from './pages/MaterialsPage';
import EnginePage from './pages/EnginePage';
import MissionPage from './pages/MissionPage';
import BlogPage from './pages/BlogPage';
import VoltageMultiplierPage from './pages/VoltageMultiplierPage';
import HexagonalGridPage from './pages/HexagonalGridPage';
import ThermalMeshPage from './pages/ThermalMeshPage';
import QuantumPropulsionPage from './pages/QuantumPropulsionPage';
import ThermodynamicsPage from './pages/ThermodynamicsPage';
import QuantumFlightPage from './pages/QuantumFlightPage';
import MagneticFieldPage from './pages/MagneticFieldPage';
import GlobalMagneticFieldPage from './pages/GlobalMagneticFieldPage';
import TechnicalReportPage from './pages/TechnicalReportPage';
import ThermodynamicControlPanel from './pages/ThermodynamicControlPanel';
import SplashScreen from './components/SplashScreen';
import ChatBot from './components/ChatBot';
import ConceptChat from './components/ConceptChat';
import SEO from './components/SEO';
import QuantumEngineDiagramPage from './pages/QuantumEngineDiagramPage';
import AbelianSymmetryPage from './pages/AbelianSymmetryPage';

function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO />
      <SplashScreen />
      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-[#020617] text-white">
              <Navigation />
              
              <main>
                <Hero />
                
                <section id="about" className="py-20 px-4 md:px-8">
                  <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
                      <Brain className="text-violet-400" />
                      Sobre o Projeto
                    </h2>
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                          <div className="space-y-4">
                            <a
                              href="/voltage-multiplier"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-white font-semibold w-full"
                            >
                              <Zap className="w-5 h-5" />
                              Simulador de Tensão
                            </a>
                            <a
                              href="/quantum-propulsion"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-white font-semibold w-full"
                            >
                              <Rocket className="w-5 h-5" />
                              Navegação Quântica
                            </a>
                          </div>
                          <div className="space-y-4">
                            <a
                              href="/thermal-mesh"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-white font-semibold w-full"
                            >
                              <Thermometer className="w-5 h-5" />
                              Malha Antitérmica
                            </a>
                            <a
                              href="/hexagonal-grid"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-white font-semibold w-full"
                            >
                              <Atom className="w-5 h-5" />
                              Malha Hexagonal Energética
                            </a>
                          </div>
                        </div>

                        <div className="space-y-4 mt-4">
                          <a
                            href="/quantum-flight"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold w-full"
                          >
                            <Stars className="w-5 h-5" />
                            Simulador de Voo Quântico
                          </a>

                          <a
                            href="/AbelianSymmetry"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold w-full"
                          >
                            <Stars className="w-5 h-5" />
                            Simetria Abeliana
                          </a>
                          
                          <a
                            href="/magnetic-field"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold w-full"
                          >
                            <Magnet className="w-5 h-5" />
                            Campo Magnético
                          </a>
                          <a
                            href="/global-magnetic-field"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold w-full"
                          >
                            <Map className="w-5 h-5" />
                            Campo Magnético Global
                          </a>
                          <a
                            href="/quantum-engine-diagram"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold w-full"
                          >
                            <Cpu className="w-5 h-5" />
                            Diagrama do Motor Quântico
                          </a>
                          <a
                            href="/technical-report"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold w-full"
                          >
                            <FileText className="w-5 h-5" />
                            Relatório Técnico Completo
                          </a>
                        </div>

                        <div className="pt-8 border-t border-violet-500/20 space-y-4">
                          <h3 className="text-xl font-semibold text-violet-400">
                            Interaja com o Projeto
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <a
                              href="https://character.ai/chat/r2V7YMoEfqe6V_e3UGYAlhj5UKHTQClxkjY9TJSYOK4"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold"
                            >
                              <Bot className="w-5 h-5" />
                              Converse com Einstein-Tesla Quantum AI
                            </a>
                            
                            <a
                              href="https://www.chatpdf.com/share/23YthM6FKlZIW9ugicrwI"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 rounded-lg transition-colors text-white font-semibold"
                            >
                              <FileText className="w-5 h-5" />
                              Converse com o Documento do Projeto
                            </a>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <a
                              href="https://jcm-tecnologia.vercel.app"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-900/50 hover:bg-violet-900/70 rounded-lg transition-colors text-white"
                            >
                              <Brain className="w-4 h-4" />
                              Projetos
                            </a>
                            
                            <a
                              href="https://discord.gg/cgD28qgrUT"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-900/50 hover:bg-violet-900/70 rounded-lg transition-colors text-white"
                            >
                              <Bot className="w-4 h-4" />
                              Discord
                            </a>
                            
                            <a
                              href="https://radiotatuapefm.wixsite.com/disparattechno"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-900/50 hover:bg-violet-900/70 rounded-lg transition-colors text-white"
                            >
                              <Globe className="w-4 h-4" />
                              Site
                            </a>
                          </div>
                        </div>
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

                        <ConceptChat />
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
                            href="https://docs.google.com/document/d/17rhZ6zljcakYO3IYjIxXz8LPJ9_rtq1jpKT-TGxUOEo/edit?usp=sharing"
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
              <ChatBot />
            </div>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/crystals" element={<CrystalsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/engine" element={<EnginePage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/voltage-multiplier" element={<VoltageMultiplierPage />} />
          <Route path="/hexagonal-grid" element={<HexagonalGridPage />} />
          <Route path="/thermal-mesh" element={<ThermalMeshPage />} />
          <Route path="/quantum-propulsion" element={<QuantumPropulsionPage />} />
          <Route path="/thermodynamics" element={<ThermodynamicsPage />} />
          <Route path="/quantum-flight" element={<QuantumFlightPage />} />
          <Route path="/magnetic-field" element={<MagneticFieldPage />} />
          <Route path="/AbelianSymmetry" element={<AbelianSymmetryPage />} />
          <Route path="/global-magnetic-field" element={<GlobalMagneticFieldPage />} />
          <Route path="/technical-report" element={<TechnicalReportPage />} />
          <Route path="/thermodynamic-control" element={<ThermodynamicControlPanel />} />
          <Route path="/quantum-engine-diagram" element={<QuantumEngineDiagramPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
