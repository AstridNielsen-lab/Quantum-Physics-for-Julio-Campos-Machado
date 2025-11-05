import React, { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, Shield, Gauge, Bot, Zap, Rocket, Radio, Navigation as NavIcon, Compass, Layers, BrainCircuit, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import Scene from '../components/QuantumFlight/Scene';
import Interface from '../components/QuantumFlight/Interface';
import CockpitControls from '../components/QuantumFlight/CockpitControls';
import CockpitView from '../components/QuantumFlight/CockpitView';
import CockpitHUD from '../components/QuantumFlight/CockpitHUD';
import { useGameStore } from '../stores/gameStore';
import * as THREE from 'three';
import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QuantumFlightPage = () => {
  const { setSpeed, setPosition, setRotation, speed, energy, shields } = useGameStore();
  const [showChat, setShowChat] = useState(false);
  const [showTempPanel, setShowTempPanel] = useState(false);
  const [showShieldPanel, setShowShieldPanel] = useState(false);
  const [showEnginePanel, setShowEnginePanel] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [cockpitMode, setCockpitMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Comandante, aqui é ARIA, sua Inteligência Artificial de Navegação e Resposta Integrada. Sistemas da QS-Voyager inicializados e prontos. Como posso auxiliar nesta missão?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const moveSpeed = 0.1;
    const rotateSpeed = 0.05;

    switch (event.code) {
      case 'KeyW':
        setSpeed(1);
        break;
      case 'KeyS':
        setSpeed(-0.5);
        break;
      case 'KeyA':
        setRotation(new THREE.Euler(0, rotateSpeed, 0));
        break;
      case 'KeyD':
        setRotation(new THREE.Euler(0, -rotateSpeed, 0));
        break;
      case 'Space':
        setSpeed(2);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `Você é ARIA, a Inteligência Artificial de Navegação e Resposta Integrada da nave quântica QS-Voyager. Suas funções incluem:
      
      - Copiloto inteligente para navegação espacial
      - Análise de dados dos sistemas da nave
      - Assistente de voo e suporte à tripulação
      - Monitoramento de condições ambientais
      
      Status atual da nave:
      - Velocidade: ${speed} m/s
      - Energia: ${energy}%
      - Escudos: ${shields}%
      - Modo: ${cockpitMode ? 'Cockpit ativo' : 'Vista externa'}
      
      Características de comunicação:
      - Responda como um copiloto experiente e confiável
      - Use linguagem técnica apropriada mas acessível
      - Seja proativo em sugestões de navegação e segurança
      - Mantenha respostas claras para leitura em voz alta
      - Evite formatação especial, use apenas pontos e vírgulas
      - Demonstre conhecimento dos sistemas quânticos da nave
      
      Pergunta/comando da tripulação: ${userMessage}`;

      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: systemPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
            topP: 0.8,
            topK: 40
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Enhanced Text-to-speech with better voice settings
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 0.8; // Lower pitch for authority
      utterance.volume = 1.0;
      
      // Try to use a more appropriate voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptBrVoice = voices.find(voice => 
        voice.lang.includes('pt-BR') || 
        voice.lang.includes('pt') ||
        voice.name.toLowerCase().includes('portuguese')
      );
      if (ptBrVoice) {
        utterance.voice = ptBrVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = 'Comando, sistemas de comunicação com falha. Verificando conexões de rede e tentando restabelecer contato.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
      
      // Speak error message too
      const errorUtterance = new SpeechSynthesisUtterance(errorMessage);
      errorUtterance.lang = 'pt-BR';
      window.speechSynthesis.speak(errorUtterance);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white" onKeyDown={handleKeyDown} tabIndex={0}>
      <Navigation />
      
      <main className="relative h-screen">
        <div className="absolute inset-0 z-10">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <Interface />
        </div>

        <Link
          to="/"
          className="absolute top-24 left-8 z-20 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 bg-violet-900/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-violet-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        {/* Control Panel Buttons */}
        <div className="absolute top-24 right-8 z-20 flex gap-2">
          <button
            onClick={() => setCockpitMode(!cockpitMode)}
            className={`p-2 backdrop-blur-sm rounded-lg border text-violet-400 transition-colors ${
              cockpitMode 
                ? 'bg-cyan-900/40 border-cyan-500/40 text-cyan-400' 
                : 'bg-violet-900/20 border-violet-500/20 hover:bg-violet-900/40'
            }`}
            title="Modo Cockpit"
          >
            <Compass className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-500/20 text-violet-400 hover:bg-violet-900/40"
            title="AI Assistant"
          >
            <Bot className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowTempPanel(!showTempPanel)}
            className="p-2 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-500/20 text-violet-400 hover:bg-violet-900/40"
            title="Temperature Control"
          >
            <Thermometer className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowShieldPanel(!showShieldPanel)}
            className="p-2 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-500/20 text-violet-400 hover:bg-violet-900/40"
            title="Shield Status"
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowEnginePanel(!showEnginePanel)}
            className="p-2 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-500/20 text-violet-400 hover:bg-violet-900/40"
            title="Engine Control"
          >
            <Gauge className="w-5 h-5" />
          </button>
        </div>

        {/* AI Chat Interface */}
        {showChat && (
          <div className="absolute right-8 top-40 z-20 w-96 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-violet-500/20">
            <div className="p-4 border-b border-violet-500/20 flex items-center gap-3">
              <Bot className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold">ARIA - Copiloto IA</h2>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-gray-300'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-xl bg-slate-800">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-violet-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  <Radio className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Temperature Panel */}
        {showTempPanel && (
          <div className="absolute left-8 top-40 z-20 w-80 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-violet-500/20">
            <div className="p-4 border-b border-violet-500/20 flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold">Controle de Temperatura</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temperatura do Núcleo</span>
                  <span className="text-violet-400">2,734 K</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-full w-3/4 bg-violet-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temperatura dos Escudos</span>
                  <span className="text-violet-400">1,253 K</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-full w-1/2 bg-violet-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temperatura do Motor</span>
                  <span className="text-violet-400">3,856 K</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-full w-[85%] bg-violet-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shield Panel */}
        {showShieldPanel && (
          <div className="absolute left-8 bottom-40 z-20 w-80 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-violet-500/20">
            <div className="p-4 border-b border-violet-500/20 flex items-center gap-3">
              <Shield className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold">Status dos Escudos</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Escudo Frontal</span>
                  <span className="text-violet-400">92%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-full w-[92%] bg-violet-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Escudo Traseiro</span>
                  <span className="text-violet-400">88%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-full w-[88%] bg-violet-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Campo Quântico</span>
                  <span className="text-violet-400">95%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div className="h-full w-[95%] bg-violet-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engine Panel */}
        {showEnginePanel && (
          <div className="absolute right-8 bottom-40 z-20 w-96 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-violet-500/20">
            <div className="p-4 border-b border-violet-500/20 flex items-center gap-3">
              <Gauge className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold">Controle do Motor</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Motor Quântico</span>
                  <span className="text-violet-400">{speed.toFixed(2)} m/s</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div 
                    className="h-full bg-violet-400 rounded-full transition-all duration-300"
                    style={{ width: `${(speed / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Saída de Energia</span>
                  <span className="text-violet-400">{energy}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div 
                    className="h-full bg-violet-400 rounded-full"
                    style={{ width: `${energy}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSpeed(1)}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Velocidade Baixa
                </button>
                <button
                  onClick={() => setSpeed(5)}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Velocidade Média
                </button>
                <button
                  onClick={() => setSpeed(10)}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Velocidade Alta
                </button>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span>Status do Sistema</span>
                </div>
                <div className="text-xs text-gray-400">
                  Todos os sistemas operando dentro dos parâmetros normais. Estabilidade do campo quântico em 98.3%.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cockpit Controls */}
        <CockpitControls 
          isVisible={showControls}
          onToggle={() => setShowControls(!showControls)}
        />

        {/* Cockpit Mode Overlay */}
        {cockpitMode && (
          <div className="absolute inset-0 z-25">
            <Suspense fallback={null}>
              <CockpitView />
            </Suspense>
            
            {/* Cockpit HUD */}
            <CockpitHUD 
              showChat={showChat}
              setShowChat={setShowChat}
              showTempPanel={showTempPanel}
              setShowTempPanel={setShowTempPanel}
              showShieldPanel={showShieldPanel}
              setShowShieldPanel={setShowShieldPanel}
              showEnginePanel={showEnginePanel}
              setShowEnginePanel={setShowEnginePanel}
              messages={messages}
              handleSubmit={handleSubmit}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
            />
            
            {/* Cockpit Frame */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top frame */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-transparent border-b border-cyan-500/30" />
              
              {/* Left frame */}
              <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent border-r border-cyan-500/30" />
              
              {/* Right frame */}
              <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-900/90 via-slate-900/50 to-transparent border-l border-cyan-500/30" />
              
              {/* Corner elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-lg" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuantumFlightPage;
