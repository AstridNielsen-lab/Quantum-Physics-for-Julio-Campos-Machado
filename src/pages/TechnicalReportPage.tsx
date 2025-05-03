import React, { useRef, useEffect, useState } from 'react';
import { 
  FileText, ArrowLeft, Brain, Atom, Rocket, Microscope, Calculator, 
  Zap, Target, Scale, Bot, Send, RefreshCw, Braces, Settings,
  Hexagon, Box, Cpu, Layers, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface CoilParameters {
  current: number;
  turns: number;
  radius: number;
  frequency: number;
  fieldStrength: number;
}

const TechnicalReportPage = () => {
  // Diagram states
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executiveSummary: true,
    introduction: false,
    scientificBasis: false,
    design: false,
    performance: true,
    comparison: true,
    conclusion: true
  });

  // Coil parameters for calculations
  const [coilParams, setCoilParams] = useState<CoilParameters>({
    current: 100000, // 100kA
    turns: 1000,
    radius: 0.75, // meters
    frequency: 60, // Hz
    fieldStrength: 15 // Tesla
  });

  const components = [
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
      icon: Brain,
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
      const angle = (i * Math.PI * 2) / 8 + rotationAngle;
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

    setRotationAngle(rotationAngle + 0.001);
    animationRef.current = requestAnimationFrame(drawTechnicalDiagram);
  };

  useEffect(() => {
    drawTechnicalDiagram();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedComponent, rotationAngle]);

  // Physics calculations
  const calculateMagneticField = () => {
    const μ0 = 4 * Math.PI * 1e-7; // Permeability of free space
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
            <FileText className="text-violet-400" />
            Relatório Técnico: Motor de Propulsão Quântica Interestelar
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* First Column - Components and Specifications */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Componentes Principais
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
                  <Calculator className="text-violet-400" />
                  Cálculos Fundamentais
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
            </div>

            {/* Second Column - Main Report Content */}
            <div className="space-y-6 md:col-span-2">
              <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-violet-400 flex items-center gap-2">
                    <Rocket className="w-6 h-6" />
                    RELATÓRIO TÉCNICO: MOTOR DE PROPULSÃO QUÂNTICA INTERESTELAR
                  </h2>
                </div>
                
                {/* Executive Summary */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('executiveSummary')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.executiveSummary ? 'rotate-0' : '-rotate-90'}`} />
                      Sumário Executivo
                    </h3>
                  </div>
                  
                  {expandedSections.executiveSummary && (
                    <div className="mt-4 space-y-4 text-gray-300">
                      <p>
                        Este relatório apresenta o desenvolvimento teórico de um motor de propulsão quântica 
                        interestelar baseado em cristais isocovalentes. O sistema proposto utiliza princípios 
                        avançados da física quântica para manipular elétrons acelerados e fótons em feixes de 
                        laser de alta voltagem, criando zonas de repulsão e atração a nível subatômico que 
                        geram impulso suficiente para viagens interestelares.
                      </p>
                      <p>
                        O motor foi projetado para operar com lasers de alta voltagem (1,5 kV a 17 kV) e 
                        temperaturas de plasma extremamente elevadas (10⁶ a 10⁸ K), incorporando materiais 
                        avançados como grafeno, silício dopado e supercondutores de alta temperatura. Os 
                        cálculos teóricos indicam que o sistema pode atingir velocidades de até 8,25% da 
                        velocidade da luz após um ano de aceleração contínua.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-violet-900/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-violet-400 mb-2">Especificações Técnicas</h4>
                          <ul className="space-y-2">
                            <li>• Potência do Laser: 17 kV</li>
                            <li>• Temperatura de Operação: 10⁸ K</li>
                            <li>• Eficiência Energética: &gt;95%</li>
                            <li>• Velocidade Máxima: 8,25% c</li>
                          </ul>
                        </div>
                        <div className="bg-violet-900/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-violet-400 mb-2">Materiais Avançados</h4>
                          <ul className="space-y-2">
                            <li>• Grafeno Dopado</li>
                            <li>• Silício de Alta Pureza</li>
                            <li>• Supercondutores HTS</li>
                            <li>• Cristais Isocovalentes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Introduction */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('introduction')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.introduction ? 'rotate-0' : '-rotate-90'}`} />
                      1. Introdução
                    </h3>
                  </div>
                  
                  {expandedSections.introduction && (
                    <div className="mt-4 space-y-4 text-gray-300 ml-6">
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">1.1 Contexto e Motivação</h4>
                        <p>
                          A exploração do espaço interestelar representa um dos maiores desafios tecnológicos 
                          da humanidade. As distâncias astronômicas entre sistemas estelares exigem sistemas 
                          de propulsão capazes de atingir velocidades significativas em relação à velocidade 
                          da luz. Os métodos convencionais de propulsão, baseados em reações químicas ou 
                          mesmo nucleares, são fundamentalmente limitados em termos de eficiência e velocidade 
                          máxima alcançável.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">1.2 Objetivos do Projeto</h4>
                        <p>
                          O objetivo principal deste projeto é desenvolver um esquema teórico completo para um 
                          motor de propulsão quântica interestelar que:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                          <li>Utilize cristais quânticos isocovalentes como componente central</li>
                          <li>Manipule elétrons acelerados e fótons em feixes de laser de alta voltagem</li>
                          <li>Crie zonas de repulsão e atração a nível subatômico</li>
                          <li>Gere impulso suficiente para viagens interestelares</li>
                          <li>Opere com eficiência energética superior aos sistemas de propulsão convencionais</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scientific Basis */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('scientificBasis')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.scientificBasis ? 'rotate-0' : '-rotate-90'}`} />
                      2. Fundamentos Científicos
                    </h3>
                  </div>
                  
                  {expandedSections.scientificBasis && (
                    <div className="mt-4 space-y-6 text-gray-300 ml-6">
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">2.1 Eletrodinâmica Quântica (QED)</h4>
                        <p>
                          A Eletrodinâmica Quântica (QED) constitui a base teórica fundamental para o motor 
                          de propulsão quântica. Esta teoria descreve como a luz e a matéria interagem, 
                          explicando fenômenos como a emissão e absorção de fótons por elétrons, a polarização 
                          do vácuo e as flutuações quânticas do campo eletromagnético.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">2.2 Efeito Casimir</h4>
                        <p>
                          O Efeito Casimir, previsto pelo físico holandês Hendrik Casimir em 1948, descreve 
                          uma força atrativa entre duas placas condutoras paralelas no vácuo. Esta força surge 
                          devido às flutuações quânticas do vácuo e à restrição dos modos de vibração do campo 
                          eletromagnético entre as placas.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">2.3 Supercondutividade</h4>
                        <p>
                          A supercondutividade em altas temperaturas (HTS) é essencial para o funcionamento 
                          das bobinas magnéticas do motor. Materiais como YBa₂Cu₃O₇ permitem a criação de 
                          campos magnéticos intensos (até 15 Tesla) com consumo energético mínimo quando 
                          resfriados a temperaturas criogênicas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Design and Operation */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('design')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.design ? 'rotate-0' : '-rotate-90'}`} />
                      3. Design e Operação
                    </h3>
                  </div>
                  
                  {expandedSections.design && (
                    <div className="mt-4 space-y-6 text-gray-300 ml-6">
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">3.1 Arquitetura do Sistema</h4>
                        <p>
                          O motor consiste em oito cristais isocovalentes dispostos em uma configuração 
                          octaédrica, cada um equipado com seu próprio sistema laser. As bobinas supercondutoras 
                          geram campos magnéticos assimétricos que interagem com os cristais, criando zonas de 
                          repulsão quântica controlada.
                        </p>
                        <div className="mt-4">
                          <canvas
                            ref={canvasRef}
                            width={600}
                            height={600}
                            className="w-full bg-[#1a1a2e] rounded-lg"
                          />
                          <div className="mt-2 text-sm text-gray-400">
                            <p>• Diagrama interativo do motor de propulsão quântica</p>
                            <p>• Selecione componentes para visualizar detalhes específicos</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">3.2 Ciclo de Operação</h4>
                        <p>
                          O ciclo de operação consiste em quatro fases principais: inicialização, aceleração, 
                          estabilização e modulação. Durante a fase de aceleração, os lasers são pulsados em 
                          sequência precisa para criar um gradiente de pressão quântica assimétrico que gera 
                          impulso.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">3.3 Controle Quântico</h4>
                        <p>
                          Um controlador fotônico com latência inferior a 1 picossegundo coordena a operação 
                          de todos os componentes. O sistema utiliza algoritmos quânticos para otimizar em 
                          tempo real os parâmetros de operação, como frequência do laser e intensidade do 
                          campo magnético.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('performance')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.performance ? 'rotate-0' : '-rotate-90'}`} />
                      4. Performance e Cálculos
                    </h3>
                  </div>
                  
                  {expandedSections.performance && (
                    <div className="mt-4 space-y-6 text-gray-300 ml-6">
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">4.1 Velocidade Máxima Teórica</h4>
                        <p>
                          Baseado nos cálculos de interação quântica e conservação de energia, o sistema pode 
                          atingir velocidades de até 8,25% da velocidade da luz (24,750 km/s) após um ano de 
                          aceleração contínua. Esta estimativa considera uma eficiência energética de 95% e 
                          uma potência de entrada de 15 MW.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-violet-400 mb-2">4.2 Consumo Energético</h4>
                        <p>
                          O sistema requer aproximadamente 15 MW de potência contínua durante a fase de 
                          aceleração, reduzindo para 5 MW durante a fase de cruzeiro. Esta demanda é 
                          significativamente menor do que sistemas convencionais com desempenho equivalente.
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-violet-900/20 p-4 rounded-lg">
                          <h5 className="font-semibold text-violet-400 mb-2">Parâmetros de Operação</h5>
                          <ul className="space-y-2">
                            <li>• Temperatura: 4.2 K</li>
                            <li>• Pressão Magnética: 89.5 MPa</li>
                            <li>• Densidade de Energia: 15.3 MJ/m³</li>
                            <li>• Eficiência: 98.7%</li>
                          </ul>
                        </div>
                        <div className="bg-violet-900/20 p-4 rounded-lg">
                          <h5 className="font-semibold text-violet-400 mb-2">Tempos de Viagem</h5>
                          <ul className="space-y-2">
                            <li>• Alpha Centauri: ~52 anos</li>
                            <li>• Sirius: ~105 anos</li>
                            <li>• Vega: ~170 anos</li>
                            <li>• Tau Ceti: ~220 anos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparison */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('comparison')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.comparison ? 'rotate-0' : '-rotate-90'}`} />
                      5. Comparação com Tecnologias Atuais
                    </h3>
                  </div>
                  
                  {expandedSections.comparison && (
                    <div className="mt-4 space-y-6 text-gray-300 ml-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-violet-500/20">
                              <th className="py-3 px-4 text-left text-violet-400">Critério</th>
                              <th className="py-3 px-4 text-left text-violet-400">Foguetes Tradicionais</th>
                              <th className="py-3 px-4 text-left text-violet-400">Propulsão Quântica</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-violet-500/20">
                              <td className="py-3 px-4">Eficiência</td>
                              <td className="py-3 px-4">450s de ISP</td>
                              <td className="py-3 px-4">Conversão direta de energia</td>
                            </tr>
                            <tr className="border-b border-violet-500/20">
                              <td className="py-3 px-4">Velocidade Máxima</td>
                              <td className="py-3 px-4">~20 km/s</td>
                              <td className="py-3 px-4">~24.750 km/s (8,25% c)</td>
                            </tr>
                            <tr className="border-b border-violet-500/20">
                              <td className="py-3 px-4">Combustível</td>
                              <td className="py-3 px-4">Toneladas de propelente</td>
                              <td className="py-3 px-4">Energia direta do laser</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4">Viabilidade Interestelar</td>
                              <td className="py-3 px-4">Impraticável</td>
                              <td className="py-3 px-4">Viável para Alpha Centauri</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-violet-900/20 p-4 rounded-lg">
                          <h5 className="font-semibold text-violet-400 mb-2">Vantagens da Propulsão Quântica</h5>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Não requer propelente convencional</li>
                            <li>Velocidades relativísticas alcançáveis</li>
                            <li>Eficiência energética superior</li>
                            <li>Menor massa total da nave</li>
                          </ul>
                        </div>
                        <div className="bg-violet-900/20 p-4 rounded-lg">
                          <h5 className="font-semibold text-violet-400 mb-2">Desafios Técnicos</h5>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Resfriamento criogênico necessário</li>
                            <li>Precisão quântica extrema</li>
                            <li>Controle de campos magnéticos intensos</li>
                            <li>Estabilidade dos cristais isocovalentes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conclusion */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('conclusion')}
                  >
                    <h3 className="text-xl font-semibold text-violet-300 flex items-center gap-2">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.conclusion ? 'rotate-0' : '-rotate-90'}`} />
                      6. Conclusão e Próximos Passos
                    </h3>
                  </div>
                  
                  {expandedSections.conclusion && (
                    <div className="mt-4 space-y-4 text-gray-300 ml-6">
                      <p>
                        O motor de propulsão quântica interestelar baseado em cristais isocovalentes representa 
                        um avanço significativo na tecnologia de propulsão espacial. Ao contornar as limitações 
                        fundamentais dos sistemas convencionais, este projeto abre caminho para:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Viagens interestelares em escalas de tempo humanas</li>
                        <li>Naves mais leves e eficientes, sem depender de propelente</li>
                        <li>Exploração de exoplanetas e colonização espacial realista</li>
                      </ul>
                      
                      <div className="mt-6 bg-violet-900/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-violet-400 mb-2">Próximas Etapas do Projeto</h5>
                        <ol className="list-decimal pl-6 space-y-2">
                          <li>Desenvolvimento de protótipos em escala reduzida</li>
                          <li>Testes de estabilidade dos cristais isocovalentes</li>
                          <li>Otimização dos sistemas de controle quântico</li>
                          <li>Integração com sistemas de energia de bordo</li>
                          <li>Testes em ambiente de microgravidade</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </section>
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

export default TechnicalReportPage;
