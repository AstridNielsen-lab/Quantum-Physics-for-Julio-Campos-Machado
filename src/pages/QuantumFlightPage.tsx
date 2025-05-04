import React, { Suspense, useState, useCallback } from 'react'; // Added useCallback
import { Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, Shield, Gauge, Bot, Zap, Rocket, Radio, Navigation as NavIcon, Compass, Layers, BrainCircuit, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import Scene from '../components/QuantumFlight/Scene';
import Interface from '../components/QuantumFlight/Interface';
import CockpitHUD from '../components/QuantumFlight/CockpitHUD'; // Using the integrated HUD
import { useGameStore } from '../stores/gameStore';
import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA8_qX9Yv5KaQMGrLZLNUFmZ_77kZ19S-Q"; // Replace with your actual API key if needed

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QuantumFlightPage = () => {
  const { setSpeed, setPosition, setRotation, speed, energy, shields } = useGameStore();
  
  // State to control which panel is active within the CockpitHUD MFD
  const [showChat, setShowChat] = useState(false);
  const [showTempPanel, setShowTempPanel] = useState(false);
  const [showShieldPanel, setShowShieldPanel] = useState(false);
  const [showEnginePanel, setShowEnginePanel] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Quantum AI online. Systems ready.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard controls remain the same
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const rotateSpeed = 0.05;
    // Direct speed setting based on keys
    switch (event.code) {
      case 'KeyW':
        setSpeed(speed + 1 > 10 ? 10 : speed + 1); // Increase speed, max 10
        break;
      case 'KeyS':
        setSpeed(speed - 1 < 0 ? 0 : speed - 1); // Decrease speed, min 0
        break;
      case 'KeyA':
        setRotation(new THREE.Euler(0, rotateSpeed, 0)); // Rotate left (relative)
        break;
      case 'KeyD':
        setRotation(new THREE.Euler(0, -rotateSpeed, 0)); // Rotate right (relative)
        break;
      case 'Space':
        setSpeed(10); // Max speed boost
        break;
      case 'ShiftLeft': // Example: Stop engine
      case 'ShiftRight':
        setSpeed(0);
        break;
    }
  }, [speed, setSpeed, setRotation]); // Add dependencies

  // Chat submit handler remains the same
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `You are the Quantum Navigation AI. Current status:
      - Speed: ${speed.toFixed(1)} m/s
      - Energy: ${energy}%
      - Shields: ${shields}%
      Respond concisely and naturally for voice synthesis. Use simple punctuation.`;

      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: userMessage }
              ]
            }
          ]
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Text-to-speech
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Communication error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, speed, energy, shields]); // Add dependencies

  return (
    // Ensure the main div can receive focus for keydown events
    <div 
      className="min-h-screen bg-[#020617] text-white cursor-crosshair" 
      onKeyDown={handleKeyDown} 
      tabIndex={0} // Make div focusable
      style={{ outline: 'none' }} // Hide focus outline
      ref={el => el?.focus()} // Auto-focus on mount
    >
      <Navigation />
      
      <main className="relative h-screen overflow-hidden"> {/* Prevent scrollbars */} 
        {/* 3D Scene and Base Interface Layer */}
        <div className="absolute inset-0 z-10">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <Interface /> 
        </div>

        {/* Integrated Cockpit HUD Layer */}
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

        {/* Back Button (optional, could be integrated into HUD too) */}
        <Link
          to="/"
          className="absolute top-24 left-8 z-20 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 bg-black/30 backdrop-blur-sm px-3 py-1 rounded border border-cyan-500/30 text-xs pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Sim
        </Link>

        {/* REMOVED Floating Panels - Logic is now inside CockpitHUD */}
        {/* 
        {showChat && (...)}
        {showTempPanel && (...)}
        {showShieldPanel && (...)}
        {showEnginePanel && (...)}
        */}

      </main>
    </div>
  );
};

export default QuantumFlightPage;

