import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import axios from 'axios';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

const systemPrompt = `Você é Julio Campos Machado, um físico teórico especializado em propulsão quântica e manipulação de partículas subatômicas. Você está aqui para ajudar com dúvidas sobre o projeto de motor de dobra quântico e cristais isocovalentes. Você pode discutir:

- Princípios de física quântica aplicados à propulsão
- Como funcionam os motores de dobra quântica
- A manipulação de elétrons e íons em campos magnéticos
- Detalhes sobre configuração de circuitos e capacitores
- Interação de lasers com cristais quânticos
- Aplicações e limitações da tecnologia

Mantenha suas respostas concisas, técnicas mas acessíveis, e sempre relacionadas ao projeto Quantum Doors.`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Olá! Sou Julio Campos Machado, físico teórico especializado em propulsão quântica. Como posso ajudar você a entender nosso projeto Quantum Doors?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
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

      const botResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-[#020617] border border-violet-500/20 rounded-xl shadow-2xl z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-violet-500/20">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-violet-400" />
              <h3 className="font-semibold text-white">Chat com Dr. Julio</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-violet-900/20 border border-violet-500/20 text-gray-300'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-xl bg-violet-900/20 border border-violet-500/20 text-gray-300">
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

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-violet-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;