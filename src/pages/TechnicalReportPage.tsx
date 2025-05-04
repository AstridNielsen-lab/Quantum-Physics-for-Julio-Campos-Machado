import React, { useRef, useEffect } from 'react';
import { FileText, ArrowLeft, Brain, Atom, Rocket, Microscope, Calculator, Zap, Target, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const TechnicalReportPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const drawAnimation = () => {
    const canvas = canvasRef.current;
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

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw magnetic field lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200 + i * 20, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 - i * 0.02})`;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw central laser system
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();

    // Draw crystals
    const crystalCount = 8;
    for (let i = 0; i < crystalCount; i++) {
      const angle = (i * Math.PI * 2) / crystalCount + time * 0.2;
      const x = centerX + Math.cos(angle) * 120;
      const y = centerY + Math.sin(angle) * 120;

      // Draw hexagonal crystal
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const crystalAngle = j * Math.PI / 3;
        const px = x + Math.cos(crystalAngle) * 20;
        const py = y + Math.sin(crystalAngle) * 20;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#22c55e';
      ctx.fill();

      // Draw laser beam
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#ec489966';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw plasma particles
      const particleCount = 3;
      for (let j = 0; j < particleCount; j++) {
        const t = time * 3 + j * Math.PI * 2 / particleCount;
        const radius = 10;
        const px = x + Math.cos(t) * radius;
        const py = y + Math.sin(t) * radius;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.fill();
      }
    }

    animationRef.current = requestAnimationFrame(drawAnimation);
  };

  useEffect(() => {
    drawAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
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

          <div className="space-y-8">
            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400 flex items-center gap-2">
                <Rocket className="w-6 h-6" />
                Propulsão Quântica vs. Foguetes Convencionais
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">
                  A exploração espacial sempre dependeu de foguetes baseados em reações químicas ou nucleares, 
                  que, apesar de eficazes para viagens próximas à Terra, possuem limitações fundamentais para 
                  viagens interestelares. Nosso novo conceito de propulsão a laser com cristais isocovalentes 
                  promete superar essas barreiras.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-violet-900/20 p-6 rounded-lg border border-violet-500/20">
                    <h3 className="text-lg font-semibold text-violet-400 mb-4">Foguetes Convencionais</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Limitados pela equação de Tsiolkovsky</li>
                      <li>• Necessidade de grande massa de propelente</li>
                      <li>• Velocidade máxima restrita</li>
                      <li>• Inviável para viagens interestelares</li>
                    </ul>
                  </div>
                  <div className="bg-violet-900/20 p-6 rounded-lg border border-violet-500/20">
                    <h3 className="text-lg font-semibold text-violet-400 mb-4">Propulsão Quântica</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Manipulação de campos quânticos</li>
                      <li>• Sem necessidade de propelente convencional</li>
                      <li>• Potencial para velocidades relativísticas</li>
                      <li>• Ideal para exploração interestelar</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-violet-950/30 p-8 rounded-xl border border-violet-500/20 mb-8">
                  <h3 className="text-2xl font-semibold mb-6 text-violet-400">
                    RELATÓRIO TÉCNICO: MOTOR DE PROPULSÃO QUÂNTICA INTERESTELAR
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-violet-300 mb-3">Sumário Executivo</h4>
                      <div className="text-gray-300 space-y-4">
                        <p>
                          Este relatório apresenta o desenvolvimento teórico de um motor de propulsão quântica 
                          interestelar baseado em cristais isocovalentes. O sistema proposto utiliza princípios 
                          avançados da física quântica para manipular elétrons acelerados e fótons em feixes de 
                          laser de alta voltagem.
                        </p>
                        <p>
                          O motor foi projetado para operar com lasers de alta voltagem (1,5 kV a 17 kV) e 
                          temperaturas de plasma extremamente elevadas (10⁶ a 10⁸ K), incorporando materiais 
                          avançados como grafeno, silício dopado e supercondutores de alta temperatura.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-violet-900/20 p-6 rounded-lg border border-violet-500/20">
                        <h4 className="text-lg font-semibold text-violet-300 mb-4">Especificações Técnicas</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li>• Potência do Laser: 17 kV</li>
                          <li>• Temperatura de Operação: 10⁸ K</li>
                          <li>• Eficiência Energética: &gt;95%</li>
                          <li>• Velocidade Máxima: 8,25% c</li>
                        </ul>
                      </div>
                      <div className="bg-violet-900/20 p-6 rounded-lg border border-violet-500/20">
                        <h4 className="text-lg font-semibold text-violet-300 mb-4">Materiais Avançados</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li>• Grafeno Dopado</li>
                          <li>• Silício de Alta Pureza</li>
                          <li>• Supercondutores HTS</li>
                          <li>• Cristais Isocovalentes</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-violet-900/20 p-6 rounded-lg border border-violet-500/20">
                      <h4 className="text-lg font-semibold text-violet-300 mb-4">Princípios de Funcionamento</h4>
                      <div className="space-y-4 text-gray-300">
                        <p>
                          O motor utiliza uma combinação única de campos magnéticos assimétricos e lasers de alta 
                          potência para manipular elétrons em nível quântico. A interação entre os cristais 
                          isocovalentes e o feixe de laser cria zonas de repulsão controlada.
                        </p>
                        <p>
                          O sistema é capaz de gerar impulso através da manipulação do vácuo quântico, sem 
                          necessidade de ejeção de massa convencional. Isto permite uma eficiência energética 
                          sem precedentes e potencial para velocidades relativísticas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-lg mb-8 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">
                    RELATÓRIO TÉCNICO: MOTOR DE PROPULSÃO QUÂNTICA INTERESTELAR BASEADO EM CRISTAIS ISOCOVALENTES
                  </h3>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium mb-3 text-blue-200">SUMÁRIO EXECUTIVO</h4>
                    <p className="text-gray-300 mb-4">
                      Este relatório apresenta o desenvolvimento teórico de um motor de propulsão quântica 
                      interestelar baseado em cristais isocovalentes. O sistema proposto utiliza princípios 
                      avançados da física quântica para manipular elétrons acelerados e fótons em feixes de 
                      laser de alta voltagem, criando zonas de repulsão e atração a nível subatômico que 
                      geram impulso suficiente para viagens interestelares.
                    </p>
                    <p className="text-gray-300 mb-4">
                      O motor foi projetado para operar com lasers de alta voltagem (1,5 kV a 17 kV) e 
                      temperaturas de plasma extremamente elevadas (10⁶ a 10⁸ K), incorporando materiais 
                      avançados como grafeno, silício dopado e supercondutores de alta temperatura. Os 
                      cálculos teóricos indicam que o sistema pode atingir velocidades de até 8,25% da 
                      velocidade da luz após um ano de aceleração contínua.
                    </p>
                    <p className="text-gray-300">
                      Este relatório detalha os princípios científicos fundamentais, a estrutura do motor, 
                      os materiais utilizados, os mecanismos de funcionamento e os cálculos de performance, 
                      fornecendo uma base teórica completa para o desenvolvimento futuro de um protótipo funcional.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-medium mb-3 text-blue-200">1. INTRODUÇÃO</h4>
                      
                      <div className="ml-4 space-y-4">
                        <div>
                          <h5 className="font-medium text-blue-100">1.1 Contexto e Motivação</h5>
                          <p className="text-gray-300">
                            A exploração do espaço interestelar representa um dos maiores desafios tecnológicos 
                            da humanidade. As distâncias astronômicas entre sistemas estelares exigem sistemas 
                            de propulsão capazes de atingir velocidades significativas em relação à velocidade 
                            da luz. Os métodos convencionais de propulsão, baseados em reações químicas ou 
                            mesmo nucleares, são fundamentalmente limitados em termos de eficiência e velocidade 
                            máxima alcançável.
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-100">1.2 Objetivos do Projeto</h5>
                          <p className="text-gray-300">
                            O objetivo principal deste projeto é desenvolver um esquema teórico completo para um 
                            motor de propulsão quântica interestelar que:
                          </p>
                          <ul className="list-disc pl-6 text-gray-300 space-y-1 mt-2">
                            <li>Utilize cristais quânticos isocovalentes como componente central</li>
                            <li>Manipule elétrons acelerados e fótons em feixes de laser de alta voltagem</li>
                            <li>Crie zonas de repulsão e atração a nível subatômico</li>
                            <li>Gere impulso suficiente para viagens interestelares</li>
                            <li>Opere com eficiência energética superior aos sistemas de propulsão convencionais</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-3 text-blue-200">2. FUNDAMENTOS CIENTÍFICOS</h4>
                      
                      <div className="ml-4 space-y-6">
                        <div>
                          <h5 className="font-medium text-blue-100">2.1 Eletrodinâmica Quântica (QED)</h5>
                          <p className="text-gray-300">
                            A Eletrodinâmica Quântica (QED) constitui a base teórica fundamental para o motor 
                            de propulsão quântica. Esta teoria descreve como a luz e a matéria interagem, 
                            explicando fenômenos como a emissão e absorção de fótons por elétrons, a polarização 
                            do vácuo e as flutuações quânticas do campo eletromagnético.
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-100">2.2 Efeito Casimir</h5>
                          <p className="text-gray-300">
                            O Efeito Casimir, previsto pelo físico holandês Hendrik Casimir em 1948, descreve 
                            uma força atrativa entre duas placas condutoras paralelas no vácuo. Esta força surge 
                            devido às flutuações quânticas do vácuo e à restrição dos modos de vibração do campo 
                            eletromagnético entre as placas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                </div>
              </div>
            </section>

            <div className="bg-violet-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-violet-300 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Foguetes Atuais
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-violet-400">Propulsão Química</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Queima de combustível convencional</li>
                    <li>Impulso específico limitado (~450s)</li>
                    <li>Alta massa de combustível necessária</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-violet-400">Propulsão Elétrica</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Aceleração de íons/plasma</li>
                    <li>Maior eficiência energética</li>
                    <li>Empuxo muito baixo</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-violet-400">Propulsão Nuclear</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Reações de fissão/fusão</li>
                    <li>Riscos de radiação</li>
                    <li>Restrições políticas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-violet-300 flex items-center gap-2">
                <Atom className="w-5 h-5" />
                Nossa Propulsão Quântica
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-violet-400">Laser de Alta Energia</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>1,5 kV a 17 kV de potência</li>
                    <li>Plasma de 10⁶ a 10⁸ K</li>
                    <li>Sem necessidade de propelente</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-violet-400">Cristais Isocovalentes</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Grafeno dopado + silício</li>
                    <li>Campos magnéticos de 15 Tesla</li>
                    <li>Zonas de repulsão quântica</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-violet-400">Efeito Casimir</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Manipulação do vácuo quântico</li>
                    <li>Impulso sem ejeção de massa</li>
                    <li>Velocidade de até 8,25% da luz</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/20 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4 text-violet-300 flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Comparação de Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-violet-500/20">
                      <th className="py-3 px-4 text-left text-violet-400">Critério</th>
                      <th className="py-3 px-4 text-left text-violet-400">Foguetes Tradicionais</th>
                      <th className="py-3 px-4 text-left text-violet-400">Propulsão Quântica</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-violet-500/20">
                      <td className="py-3 px-4">Eficiência</td>
                      <td className="py-3 px-4">450s de ISP</td>
                      <td className="py-3 px-4">Conversão direta de energia</td>
                    </tr>
                    <tr className="border-b border-violet-500/20">
                      <td className="py-3 px-4">Velocidade Máxima</td>
                      <td className="py-3 px-4">~20 km/s</td>
                      <td className="py-3 px-4">~24.750 km/s (8,25% da luz)</td>
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
            </div>

            <div className="bg-violet-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-violet-300 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Conclusão
              </h3>
              <p className="text-gray-300 mb-4">
                Enquanto os foguetes atuais são limitados pela física newtoniana e pela necessidade de combustível, nosso sistema de propulsão a laser com cristais isocovalentes abre caminho para:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Viagens interestelares em escalas de tempo humanas</li>
                <li>Naves mais leves e eficientes, sem depender de propelente</li>
                <li>Exploração de exoplanetas e colonização espacial realista</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default TechnicalReportPage;