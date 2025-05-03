import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Zap, Atom, Layers, Settings, Rocket, Microscope, BrainCircuit as Circuit, 
  Hexagon, Box, Cpu, FileText, Brain, Calculator, Target, Scale, Bot, Send, 
  RefreshCw, Braces 
} from 'lucide-react';
import Navigation from '../components/Navigation';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CoilParameters {
  current: number;
  turns: number;
  radius: number;
  frequency: number;
  fieldStrength: number;
}

interface Component {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  specs: {
    quantity: string;
    material: string;
    specs: string;
  };
}

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyA8_qX9Yv5KaQMGrLZLNUFmZ_77kZ19S-Q";

const systemPrompt = `Você é um especialista em física quântica e engenharia de bobinas supercondutoras. Ajude a explicar os parâmetros e cálculos relacionados ao motor quântico.

Mantenha suas respostas diretas e técnicas, usando termos científicos apropriados. Foque em:

- Cálculos de campo magnético
- Interações quânticas
- Eficiência energética
- Parâmetros de operação
- Otimizações possíveis

Use uma linguagem clara e profissional, adequada para discussões técnicas.`;

const QuantumEngineDiagramPage = () => {
  // Diagram states
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [diagramRotation, setDiagramRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineCanvasRef = useRef<HTMLCanvasElement>(null);
  const crystalCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Coil simulation states
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá, sou o assistente especializado em física quântica e bobinas supercondutoras. Como posso ajudar com os cálculos e parâmetros do motor?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coilParams, setCoilParams] = useState<CoilParameters>({
    current: 100000, // 100kA
    turns: 1000,
    radius: 0.75, // meters
    frequency: 60, // Hz
    fieldStrength: 15 // Tesla
  });
  const [coilRotation, setCoilRotation] = useState(0);
  const coilCanvasRef = useRef<HTMLCanvasElement>(null);
  const coilAnimationRef = useRef<number>();

  const components: Component[] = [
    {
      id: 'crystal',
      name: 'Cristais Isocovalentes',
      icon: Hexagon,
      specs: {
        quantity: '8 (2 por eixo X,Y,Z, +2 extra)',
        material: 'Grafeno, h-BN, Si dopado',
        specs: 'Espessura: 2 µm; Área: 0,5 m²'
      }
    },
    {
      id: 'laser',
      name: 'Laser de Estado Sólido',
      icon: Zap,
      specs: {
        quantity: '8 (um por cristal)',
        material: 'Nd:YAG',
        specs: 'λ = 1064 nm; 1,5 kV – 17 kV'
      }
    },
    {
      id: 'coils',
      name: 'Bobinas Supercondutoras',
      icon: Circuit,
      specs: {
        quantity: '6 (2 por eixo)',
        material: 'YBa₂Cu₃O₇',
        specs: 'Campo: 15 Tesla; Corrente: 10⁵ A'
      }
    },
    {
      id: 'chamber',
      name: 'Câmara de Confinamento',
      icon: Box,
      specs: {
        quantity: '1',
        material: 'Grafeno + sílica',
        specs: 'Raio int: 0,75 m; Raio ext: 1,25 m'
      }
    },
    {
      id: 'controller',
      name: 'Controlador Quântico',
      icon: Cpu,
      specs: {
        quantity: '1',
        material: 'Circuito fotônico',
        specs: 'Latência < 1 ps'
      }
    }
  ];

  const drawTechnicalDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    // Draw octahedron structure
    const crystalPoints = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + diagramRotation;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      crystalPoints.push({ x, y });

      // Draw crystal
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x, y - 20);
      ctx.lineTo(x + 20, y);
      ctx.lineTo(x, y + 20);
      ctx.closePath();
      ctx.fillStyle = selectedComponent === 'crystal' ? '#a855f7' : '#a855f744';
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.stroke();

      // Draw laser beam
      if (selectedComponent === 'laser') {
        const beamAngle = angle + Math.sin(time * 2) * 0.2;
        const beamLength = radius * 0.8;
        const gradient = ctx.createLinearGradient(
          x, y,
          x + Math.cos(beamAngle) * beamLength,
          y + Math.sin(beamAngle) * beamLength
        );
        gradient.addColorStop(0, '#ec489988');
        gradient.addColorStop(1, '#ec489900');

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + Math.cos(beamAngle) * beamLength,
          y + Math.sin(beamAngle) * beamLength
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Draw magnetic field lines
      if (selectedComponent === 'coils') {
        const fieldLines = 8;
        for (let j = 0; j < fieldLines; j++) {
          const fieldAngle = angle + (j * Math.PI * 2) / fieldLines + time;
          const fieldRadius = radius * 0.3;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(fieldAngle) * fieldRadius * 0.2,
            y + Math.sin(fieldAngle) * fieldRadius * 0.2,
            fieldRadius,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 + Math.sin(fieldAngle + time) * 0.1})`;
          ctx.stroke();
        }
      }
    }

    // Draw confinement chamber
    if (selectedComponent === 'chamber') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = '#22d3ee';
      ctx.stroke();

      // Draw plasma effect
      const plasmaParticles = 50;
      for (let i = 0; i < plasmaParticles; i++) {
        const angle = (i / plasmaParticles) * Math.PI * 2 + time;
        const r = radius * (0.8 + Math.sin(time * 3 + i) * 0.2);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.5 + Math.sin(angle + time) * 0.5})`;
        ctx.fill();
      }
    }

    // Draw quantum controller connections
    if (selectedComponent === 'controller') {
      crystalPoints.forEach(point => {
        const gradient = ctx.createLinearGradient(centerX, centerY, point.x, point.y);
        gradient.addColorStop(0, '#a855f7');
        gradient.addColorStop(1, '#a855f700');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Data particles
        const particleCount = 3;
        for (let i = 0; i < particleCount; i++) {
          const t = (time * 2 + i / particleCount) % 1;
          const x = centerX + (point.x - centerX) * t;
          const y = centerY + (point.y - centerY) * t;

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#a855f7';
          ctx.fill();
        }
      });
    }

    setDiagramRotation(diagramRotation + 0.001);
    animationRef.current = requestAnimationFrame(drawTechnicalDiagram);
  };

  const drawCoilSimulation = () => {
    const canvas = coilCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw magnetic field lines
    const fieldLines = 16;
    for (let i = 0; i < fieldLines; i++) {
      const angle = (i / fieldLines) * Math.PI * 2 + coilRotation;
      const radius = 150;
      
      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(angle) * radius * 0.2,
        centerY + Math.sin(angle) * radius * 0.2,
        radius,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 + Math.sin(angle + time) * 0.1})`;
      ctx.stroke();
    }

    // Draw coil turns
    const turnCount = 32;
    const coilRadius = 100;
    for (let i = 0; i < turnCount; i++) {
      const angle = (i / turnCount) * Math.PI * 2 + coilRotation;
      const x = centerX + Math.cos(angle) * coilRadius;
      const y = centerY + Math.sin(angle) * coilRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();

      // Draw connections between turns
      if (i > 0) {
        const prevAngle = ((i - 1) / turnCount) * Math.PI * 2 + coilRotation;
        const prevX = centerX + Math.cos(prevAngle) * coilRadius;
        const prevY = centerY + Math.sin(prevAngle) * coilRadius;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw current flow particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const t = time * 2 + i * (Math.PI * 2 / particleCount);
      const radius = coilRadius * (0.8 + Math.sin(t * 3) * 0.2);
      const x = centerX + Math.cos(t + coilRotation) * radius;
      const y = centerY + Math.sin(t + coilRotation) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ec4899';
      ctx.fill();

      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ec4899';
      ctx.fill();
      ctx.restore();
    }

    // Draw field strength indicator
    const fieldStrength = coilParams.fieldStrength;
    const maxField = 20; // Tesla
    const fieldRadius = (fieldStrength / maxField) * 180;
    
    const fieldGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, fieldRadius
    );
    fieldGradient.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
    fieldGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, fieldRadius, 0, Math.PI * 2);
    ctx.fillStyle = fieldGradient;
    ctx.fill();

    // Update rotation
    setCoilRotation(coilRotation + 0.01);
    coilAnimationRef.current = requestAnimationFrame(drawCoilSimulation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `Parâmetros atuais da bobina:
                - Corrente: ${coilParams.current} A
                - Número de espiras: ${coilParams.turns}
                - Raio: ${coilParams.radius} m
                - Frequência: ${coilParams.frequency} Hz
                - Campo magnético: ${coilParams.fieldStrength} T

                Pergunta do usuário: ${userMessage}` }
              ]
            }
          ]
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMagneticField = () => {
    const μ0 = 4 * Math.PI * 1e-7; // Permeabilidade magnética do vácuo
    const B = (μ0 * coilParams.current * coilParams.turns) / (2 * Math.PI * coilParams.radius);
    return B;
  };

  const calculateInductance = () => {
    const μ0 = 4 * Math.PI * 1e-7;
    const L = (μ0 * coilParams.turns * coilParams.turns * Math.PI * coilParams.radius * coilParams.radius) / (2 * coilParams.radius);
    return L;
  };

  const calculateEnergy = () => {
    const L = calculateInductance();
    const E = 0.5 * L * coilParams.current * coilParams.current;
    return E;
  };

  useEffect(() => {
    drawTechnicalDiagram();
    drawCoilSimulation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (coilAnimationRef.current) {
        cancelAnimationFrame(coilAnimationRef.current);
      }
    };
  }, [selectedComponent, diagramRotation, coilRotation, coilParams]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid md:grid-cols-3 gap-8">
            {/* First Column - Components and Specifications */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Componentes
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {components.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedComponent(component.id)}
                      className={`p-4 rounded-lg text-left transition-colors ${
                        selectedComponent === component.id
                          ? 'bg-violet-600'
                          : 'bg-violet-900/20 hover:bg-violet-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <component.icon className="w-5 h-5 text-violet-400" />
                        <span className="font-semibold">{component.name}</span>
                      </div>
                      {selectedComponent === component.id && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Quantidade:</span>
                            <span>{component.specs.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Material:</span>
                            <span>{component.specs.material}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Especificações:</span>
                            <span>{component.specs.specs}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Microscope className="text-violet-400" />
                  Especificações Técnicas
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Voltagem do Sistema</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Laser: 1,5 kV a 17 kV por unidade</li>
                      <li>• Sistema magnético: 10⁵ A por bobina</li>
                      <li>• Controle central: 15 MW contínuos</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-violet-400 mb-2">Zonas de Dopagem</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Boro: Controle de cargas positivas</li>
                      <li>• Nitrogênio: Estabilização de campo</li>
                      <li>• Flúor: Modulação de cargas negativas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Parâmetros da Bobina
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Corrente (A)
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="200000"
                      step="1000"
                      value={coilParams.current}
                      onChange={(e) => setCoilParams({
                        ...coilParams,
                        current: Number(e.target.value)
                      })}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {(coilParams.current / 1000).toFixed(1)} kA
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Número de Espiras
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={coilParams.turns}
                      onChange={(e) => setCoilParams({
                        ...coilParams,
                        turns: Number(e.target.value)
                      })}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {coilParams.turns} voltas
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Raio da Bobina (m)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.05"
                      value={coilParams.radius}
                      onChange={(e) => setCoilParams({
                        ...coilParams,
                        radius: Number(e.target.value)
                      })}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {coilParams.radius.toFixed(2)} m
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequência (Hz)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      step="1"
                      value={coilParams.frequency}
                      onChange={(e) => setCoilParams({
                        ...coilParams,
                        frequency: Number(e.target.value)
                      })}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {coilParams.frequency} Hz
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Column - Diagrams and Simulations */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Diagrama Técnico</h2>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Selecione um componente para visualizar seus detalhes</p>
                  <p>• Diagrama com rotação automática para visualização 3D</p>
                  <p>• Interações dinâmicas entre componentes</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Simulação da Bobina Quântica</h2>
                <canvas
                  ref={coilCanvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização do campo magnético e fluxo de corrente</p>
                  <p>• Simulação em tempo real das interações quânticas</p>
                  <p>• Rotação automática para visualização 3D</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Esquema de Funcionamento</h2>
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                  <img
                    src="https://raw.githubusercontent.com/AstridNielsen-lab/Quantum-Physics-for-Julio-Campos-Machado/refs/heads/index/src/pages/desenho%20tecnico%20motor%20esbo%C3%A7o.jpg?q=80&w=2000"
                    alt="Esquema do motor de propulsão quântica"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-sm text-gray-300 bg-[#020617]/80 p-3 rounded-lg backdrop-blur-sm">
                      <p>Motor de propulsão quântica com controle direcional multiaxial</p>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li>• 8 cristais isocovalentes em configuração octaédrica</li>
                        <li>• Sistema de laser Nd:YAG com pulsos femtosegundo</li>
                        <li>• Campos magnéticos assimétricos para controle vetorial</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Column - Calculations and Assistant */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="text-violet-400" />
                  Cálculos Físicos
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Campo Magnético</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">B = μ₀NI/2πr</span>
                      <span className="text-violet-400 font-mono">
                        {(calculateMagneticField() / 1).toFixed(2)} T
                      </span>
                    </div>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Indutância</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">L = μ₀N²πr²/2r</span>
                      <span className="text-violet-400 font-mono">
                        {(calculateInductance() * 1000).toFixed(2)} mH
                      </span>
                    </div>
                  </div>

                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Energia Armazenada</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">E = ½LI²</span>
                      <span className="text-violet-400 font-mono">
                        {(calculateEnergy() / 1000).toFixed(2)} kJ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Braces className="text-violet-400" />
                  Equações Fundamentais
                </h2>
                <div className="space-y-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Lei de Biot-Savart</h3>
                    <p className="text-gray-300 font-mono">
                      dB = (μ₀/4π) × (I dl × r̂/r²)
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Lei de Faraday</h3>
                    <p className="text-gray-300 font-mono">
                      ε = -N × dΦ/dt
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Lei de Ampère</h3>
                    <p className="text-gray-300 font-mono">
                      ∮ B·dl = μ₀I
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <RefreshCw className="text-violet-400" />
                  Eficiência e Performance
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Eficiência Energética</h3>
                    <p className="text-2xl">98.7%</p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Densidade de Energia</h3>
                    <p className="text-2xl">15.3 MJ/m³</p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Temperatura</h3>
                    <p className="text-2xl">4.2 K</p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Pressão Magnética</h3>
                    <p className="text-2xl">89.5 MPa</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Bot className="text-violet-400" />
                  Assistente de Física Quântica
                </h2>
                
                <div className="h-96 overflow-y-auto mb-4 space-y-4">
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
                  {isLoading && (
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
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Faça uma pergunta sobre a física do motor..."
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
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default QuantumEngineDiagramPage;
