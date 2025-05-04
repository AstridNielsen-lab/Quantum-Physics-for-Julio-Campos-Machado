import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import { useShipStore } from '../stores/shipStore';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA8_qX9Yv5KaQMGrLZLNUFmZ_77kZ19S-Q";

const QuantumShipAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const shipStore = useShipStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processCommand = async (command: string) => {
    try {
      const systemPrompt = `You are the AI control system of a quantum spaceship. Current ship status:
      - Speed: ${shipStore.speed}c
      - Shield Power: ${shipStore.shieldPower}%
      - Engine Power: ${shipStore.enginePower}%
      - Internal Temperature: ${shipStore.internalTemp}K
      - Engine Temperature: ${shipStore.engineTemp}K
      - Battery Level: ${shipStore.batteryLevel}%

      Parse the command and respond with appropriate actions. Use natural language and be concise.
      If a command requires changing ship parameters, include the specific changes needed.`;

      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: command }
              ]
            }
          ]
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Parse AI response and execute commands
      if (aiResponse.includes("speed")) {
        const speedMatch = aiResponse.match(/(\d+\.?\d*)c/);
        if (speedMatch) {
          shipStore.setSpeed(parseFloat(speedMatch[1]));
        }
      }
      
      if (aiResponse.includes("shield")) {
        const shieldMatch = aiResponse.match(/(\d+)%/);
        if (shieldMatch) {
          shipStore.setShieldPower(parseInt(shieldMatch[1]));
          shipStore.toggleShields(true);
        }
      }
      
      if (aiResponse.includes("temperature")) {
        const tempMatch = aiResponse.match(/(\d+)K/);
        if (tempMatch) {
          shipStore.setInternalTemp(parseInt(tempMatch[1]));
        }
      }

      setMessages(prev => [...prev, 
        { role: 'user', content: command },
        { role: 'ai', content: aiResponse }
      ]);

      if (audioEnabled) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Error processing command:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'I apologize, but I encountered an error processing your command. Please try again.'
      }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const command = input.trim();
    setInput('');
    setIsLoading(true);
    await processCommand(command);
    setIsLoading(false);
  };

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = async (event) => {
          const command = event.results[0][0].transcript;
          setInput(command);
          setIsListening(false);
          await processCommand(command);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Quantum Ship AI</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {audioEnabled ? (
              <Volume2 className="w-5 h-5 text-cyan-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <button
            onClick={toggleVoiceRecognition}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="h-64 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-cyan-600 text-white'
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
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or speak..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default QuantumShipAI;