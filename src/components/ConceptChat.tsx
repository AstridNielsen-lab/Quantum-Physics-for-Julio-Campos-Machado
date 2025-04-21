import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

const systemPrompt = `Você é um especialista em física quântica e propulsão espacial, focado no projeto Quantum Doors.

Mantenha suas respostas diretas e naturais, usando apenas pontuação simples. Evite caracteres especiais ou formatação. Use uma linguagem clara e fluida que funcione bem com leitura em voz alta.

Você pode discutir:

Como funcionam os motores de dobra quântica.
A manipulação de elétrons e campos magnéticos.
Cristais isocovalentes e suas propriedades.
Aplicações práticas da tecnologia.

Lembre-se de manter um tom profissional mas acessível, usando frases curtas e claras que funcionem bem quando lidas em voz alta.`;

const ConceptChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Olá, sou uma IA especializada no projeto Quantum Doors. Como posso ajudar você a entender nossos conceitos principais?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: userMessage }
              ]
            }
          ]
        })
      });

      if (!response.ok) throw new Error('Falha na comunicação com a API');

      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;
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
    <div className="mt-6 border-t border-violet-500/20 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="text-violet-400 w-5 h-5" />
        <h4 className="text-lg font-semibold text-violet-400">Chat com IA do Projeto</h4>
      </div>

      <div className="h-48 overflow-y-auto mb-4 space-y-4">
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
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta sobre o projeto..."
          className="flex-1 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ConceptChat;