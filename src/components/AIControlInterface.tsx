import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, Send, Power, AlertTriangle, Zap, Thermometer, Navigation as NavIcon, Shield } from 'lucide-react';
import { useAIStore } from '../stores/aiStore';
import axios from 'axios';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

const AIControlInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isProcessing,
    systemStatus,
    controlValues,
    setIsProcessing,
    setLastCommand,
    setLastResponse,
    setSystemStatus,
    setControlValue,
    toggleSystem
  } = useAIStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = async (command: string) => {
    try {
      setIsProcessing(true);
      setLastCommand(command);

      const systemPrompt = `You are the AI control system of a quantum spaceship. Current system status:
        - Propulsion: ${systemStatus.propulsion ? 'Online' : 'Offline'}
        - Thermal Control: ${systemStatus.thermalControl ? 'Online' : 'Offline'}
        - Power Generation: ${systemStatus.powerGeneration ? 'Online' : 'Offline'}
        - Navigation: ${systemStatus.navigation ? 'Online' : 'Offline'}
        - Life Support: ${systemStatus.lifeSupport ? 'Online' : 'Offline'}

        Control values:
        - Propulsion Power: ${controlValues.propulsionPower * 100}%
        - Thermal Control: ${controlValues.thermalControlPower * 100}%
        - Power Generation: ${controlValues.powerGenerationEfficiency * 100}%
        - Life Support: ${controlValues.lifeSupportPower * 100}%

        You can control the ship's systems using commands in the format [COMMAND:action:system:value].
        Available actions: toggle, set
        Available systems: propulsion, thermalControl, powerGeneration, navigation, lifeSupport
        Available controls: propulsionPower, thermalControlPower, powerGenerationEfficiency, lifeSupportPower

        Respond in Portuguese, be concise and technical.`;

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
      setLastResponse(aiResponse);

      // Parse and execute commands
      const commandRegex = /\[COMMAND:(.*?):(.*?)(?::(.*?))?\]/g;
      let match;
      while ((match = commandRegex.exec(aiResponse)) !== null) {
        const [_, action, system, value] = match;
        
        if (action === 'toggle' && system in systemStatus) {
          toggleSystem(system as keyof typeof systemStatus);
        } else if (action === 'set' && system in controlValues && value) {
          setControlValue(system as keyof typeof controlValues, parseFloat(value));
        }
      }

      setMessages(prev => [
        ...prev,
        { role: 'user', content: command },
        { role: 'ai', content: aiResponse }
      ]);

      speak(aiResponse.replace(/\[COMMAND:.*?\]/g, ''));

    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage = 'Desculpe, ocorreu um erro ao processar seu comando.';
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage }]);
      speak(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';

        recognition.onresult = async (event) => {
          const command = event.results[0][0].transcript;
          setInput(command);
          setIsListening(false);
          await handleCommand(command);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
      } else {
        alert('Reconhecimento de voz não suportado neste navegador.');
      }
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    setInput('');
    await handleCommand(command);
  };

  return (
    <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="text-violet-400" />
          Controle por IA
        </h2>
        <div className="flex gap-2">
          <button
            onClick={toggleVoiceRecognition}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(systemStatus).map(([system, status]) => (
            <div
              key={system}
              className={`p-3 rounded-lg border ${
                status
                  ? 'bg-green-900/20 border-green-500/20'
                  : 'bg-red-900/20 border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {system.charAt(0).toUpperCase() + system.slice(1)}
                </span>
                <Power
                  className={`w-4 h-4 ${
                    status ? 'text-green-400' : 'text-red-400'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {Object.entries(controlValues).map(([control, value]) => (
            <div key={control} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{control}</span>
                <span>{(value * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-400 rounded-full transition-all"
                  style={{ width: `${value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-64 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-900/20 border border-violet-500/20 text-gray-300'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-xl bg-violet-900/20 border border-violet-500/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
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
          placeholder="Digite um comando ou use o microfone..."
          className="flex-1 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AIControlInterface;