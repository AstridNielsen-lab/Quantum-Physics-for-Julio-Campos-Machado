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
                  A exploração espacial sempre dependeu de foguetes baseados em reações químicas ou nucleares, que, apesar de eficazes para viagens próximas à Terra, possuem limitações fundamentais para viagens interestelares. Nosso novo conceito de propulsão a laser com cristais isocovalentes promete superar essas barreiras.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
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
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Visão Geral do Motor
              </h2>
              <div className="aspect-square max-w-2xl mx-auto mb-8">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ec4899]" />
                  <span>Sistema de Laser Central</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span>Cristais Isocovalentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22d3ee]" />
                  <span>Plasma de Elétrons</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#a855f7]" />
                  <span>Campo Magnético</span>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Diagramas Estruturais
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Matriz Cristalina
                  </h3>
                  <div className="relative aspect-square bg-[#1a1a2e] rounded-lg overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000"
                      alt="Estrutura da matriz cristalina isocovalente"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm text-gray-300 bg-[#020617]/80 p-2 rounded">
                        Estrutura hexagonal com dopagem controlada de Boro (B), Nitrogênio (N) e Flúor (F)
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-violet-300">
                    Sistema de Laser
                  </h3>
                  <div className="relative aspect-square bg-[#1a1a2e] rounded-lg overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000"
                      alt="Sistema de laser e interação com cristais"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm text-gray-300 bg-[#020617]/80 p-2 rounded">
                        Laser de alta potência (17 kV) interagindo com cristais isocovalentes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Fundamentos Científicos
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-violet-300">
                      Eletrodinâmica Quântica (QED)
                    </h3>
                    <p className="text-gray-300">
                      Base teórica que descreve a interação entre luz e matéria, permitindo a 
                      manipulação de fótons e elétrons para gerar impulso.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-violet-300">
                      Efeito Casimir
                    </h3>
                    <p className="text-gray-300">
                      Força atrativa entre placas condutoras no vácuo, explorada de forma dinâmica 
                      para criar zonas de pressão diferencial.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-violet-300">
                      Plasma de Elétrons
                    </h3>
                    <p className="text-gray-300">
                      Estado da matéria de alta energia usado para transferência e manipulação de 
                      campos eletromagnéticos.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-violet-300">
                      Campos de Ressonância
                    </h3>
                    <p className="text-gray-300">
                      Configurações específicas que maximizam a transferência de energia e amplificação 
                      de efeitos quânticos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20">
              <h2 className="text-2xl font-semibold mb-6 text-violet-400">
                Cálculos de Performance
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-violet-900/20 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Calculator className="text-violet-400 w-5 h-5" />
                      Impulso Gerado
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Pressão de Radiação Quântica: 10³ N/m²</li>
                      <li>• Área Efetiva de Propulsão: 7,85 m²</li>
                      <li>• Impulso Total Estimado: 7,85 × 10³ N</li>
                    </ul>
                  </div>
                  <div className="bg-violet-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Rocket className="text-violet-400 w-5 h-5" />
                      Velocidade de Propulsão
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Aceleração Inicial: 0,785 m/s²</li>
                      <li>• Velocidade Terminal: 2,47 × 10⁷ m/s</li>
                      <li>• Percentual da Velocidade da Luz: 8,25%</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="bg-violet-900/20 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Microscope className="text-violet-400 w-5 h-5" />
                      Eficiência Energética
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Eficiência de Conversão: 42%</li>
                      <li>• Potência de Entrada: 15 MW</li>
                      <li>• Potência Efetiva: 6,3 MW</li>
                    </ul>
                  </div>
                  <div className="bg-violet-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Atom className="text-violet-400 w-5 h-5" />
                      Arrasto Quântico
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Coeficiente de Arrasto: 3,2 × 10⁻⁵</li>
                      <li>• Redução de Eficiência: &lt;0,5%</li>
                      <li>• Massa Efetiva: 8,5 × 10³ kg</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
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