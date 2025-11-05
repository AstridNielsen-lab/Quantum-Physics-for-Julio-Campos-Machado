import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Download, AlertCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import RocketEngineVisualization from '../components/RocketEngineVisualization';
import {
  simulateStep,
  PropellantComposition,
  EngineParameters,
  SimulationState,
  SimulationResults,
  PRESETS
} from '../simulations/rocketPhysics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoryPoint {
  time: number;
  thrust: number;
  Isp: number;
  temperature: number;
  velocity: number;
  mass: number;
}

export default function RocketEngineSimulation() {
  // Estado da composição
  const [composition, setComposition] = useState<PropellantComposition>({
    x_H2: 0.7,
    x_He: 0.3,
    O_F_ratio: 6.0
  });

  // Estado dos parâmetros do motor
  const [params, setParams] = useState<EngineParameters>({
    p_chamber: 10e6,      // 10 MPa
    p_ambient: 101325,    // 1 atm (nível do mar)
    T0: 300,              // 300 K
    expansion_ratio: 50,
    mass_flow_rate: 100,  // kg/s
    quantum_excitation: 0.3,
    He_role: 0.5
  });

  // Estado da simulação
  const [state, setState] = useState<SimulationState>({
    time: 0,
    mass: 10000, // kg
    velocity: 0,
    position: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'static' | 'transient'>('static');
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Calcula estado estático
  useEffect(() => {
    if (mode === 'static' || !isRunning) {
      const newResults = simulateStep(composition, params, state, 0.1);
      setResults(newResults);
    }
  }, [composition, params, mode, isRunning]);

  // Loop de simulação transiente
  useEffect(() => {
    if (mode === 'transient' && isRunning) {
      intervalRef.current = window.setInterval(() => {
        setState(prevState => {
          if (prevState.mass <= 0) {
            setIsRunning(false);
            return prevState;
          }

          const newResults = simulateStep(composition, params, prevState, 0.1);
          setResults(newResults);

          // Adiciona ao histórico
          setHistory(prev => [
            ...prev.slice(-199), // mantém últimos 200 pontos
            {
              time: newResults.state.time,
              thrust: newResults.thrust,
              Isp: newResults.Isp,
              temperature: newResults.T_adiabatic,
              velocity: newResults.state.velocity,
              mass: newResults.state.mass
            }
          ]);

          return newResults.state;
        });
      }, 100);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [mode, isRunning, composition, params]);

  const handlePresetChange = (presetName: string) => {
    const preset = PRESETS[presetName as keyof typeof PRESETS];
    if (preset) {
      setComposition(preset.composition);
      setParams(prev => ({
        ...prev,
        quantum_excitation: preset.params.quantum_excitation,
        He_role: preset.params.He_role
      }));
      handleReset();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setState({
      time: 0,
      mass: 10000,
      velocity: 0,
      position: 0
    });
    setHistory([]);
  };

  const handleExport = () => {
    const data = {
      composition,
      params,
      results,
      history
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rocket-simulation-${Date.now()}.json`;
    a.click();
  };

  // Configuração dos gráficos
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { color: 'rgba(139, 92, 246, 0.1)' } },
      y: { grid: { color: 'rgba(139, 92, 246, 0.1)' } }
    }
  };

  const thrustData = {
    labels: history.map(h => h.time.toFixed(1)),
    datasets: [{
      label: 'Empuxo (N)',
      data: history.map(h => h.thrust),
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.3
    }]
  };

  const ispData = {
    labels: history.map(h => h.time.toFixed(1)),
    datasets: [{
      label: 'Isp (s)',
      data: history.map(h => h.Isp),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3
    }]
  };

  const velocityData = {
    labels: history.map(h => h.time.toFixed(1)),
    datasets: [{
      label: 'Velocidade (m/s)',
      data: history.map(h => h.velocity),
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.3
    }]
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white py-8 px-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="p-2 hover:bg-violet-900/30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </a>
            <div>
              <h1 className="text-3xl font-bold">Simulação de Motor-Foguete</h1>
              <p className="text-gray-400">Demonstração Científica Interativa</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar Dados
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <strong className="text-yellow-500">Aviso:</strong> Esta é uma simulação educacional e teórica.
            Parâmetros como "quantum_excitation" são hipotéticos para demonstração científica.
            Não utilize como guia para projeto ou construção real de motores.
          </div>
        </div>

        <div className="grid lg:grid-cols-[400px,1fr] gap-6">
          {/* Painel de Controles */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Configurações Predefinidas</h3>
              <select
                className="w-full p-2 bg-[#020617] border border-violet-500/30 rounded-lg"
                onChange={(e) => handlePresetChange(e.target.value)}
              >
                <option value="">Selecione um preset...</option>
                {Object.keys(PRESETS).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Composição do Propelente */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Composição do Propelente</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Fração H₂: {composition.x_H2.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={composition.x_H2}
                    onChange={(e) => setComposition(prev => ({ 
                      ...prev, 
                      x_H2: parseFloat(e.target.value),
                      x_He: 1 - parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Fração He: {composition.x_He.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={composition.x_He}
                    onChange={(e) => setComposition(prev => ({ 
                      ...prev, 
                      x_He: parseFloat(e.target.value),
                      x_H2: 1 - parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Razão O/F: {composition.O_F_ratio.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.1"
                    value={composition.O_F_ratio}
                    onChange={(e) => setComposition(prev => ({ 
                      ...prev, 
                      O_F_ratio: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Parâmetros do Motor */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Parâmetros do Motor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Pressão Câmara: {(params.p_chamber / 1e6).toFixed(1)} MPa
                  </label>
                  <input
                    type="range"
                    min="5000000"
                    max="20000000"
                    step="100000"
                    value={params.p_chamber}
                    onChange={(e) => setParams(prev => ({ 
                      ...prev, 
                      p_chamber: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Pressão Ambiente: {params.p_ambient === 101325 ? 'Nível Mar' : 
                                     params.p_ambient < 10000 ? 'Alta Altitude' : 
                                     params.p_ambient < 1000 ? 'Quase Vácuo' : 'Personalizado'}
                  </label>
                  <select
                    className="w-full p-2 bg-[#020617] border border-violet-500/30 rounded-lg"
                    value={params.p_ambient}
                    onChange={(e) => setParams(prev => ({ 
                      ...prev, 
                      p_ambient: parseFloat(e.target.value)
                    }))}
                  >
                    <option value="101325">Nível do Mar (1 atm)</option>
                    <option value="30000">Alta Altitude (0.3 atm)</option>
                    <option value="1000">Muito Alta (0.01 atm)</option>
                    <option value="0">Vácuo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Razão de Expansão: {params.expansion_ratio.toFixed(0)}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={params.expansion_ratio}
                    onChange={(e) => setParams(prev => ({ 
                      ...prev, 
                      expansion_ratio: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Vazão Mássica: {params.mass_flow_rate.toFixed(0)} kg/s
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={params.mass_flow_rate}
                    onChange={(e) => setParams(prev => ({ 
                      ...prev, 
                      mass_flow_rate: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Parâmetros Experimentais */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Parâmetros Experimentais</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Excitação Quântica: {(params.quantum_excitation * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={params.quantum_excitation}
                    onChange={(e) => setParams(prev => ({ 
                      ...prev, 
                      quantum_excitation: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Ganho teórico de energia (hipotético)
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Papel do He: {params.He_role === 0 ? 'Diluente' : 
                                 params.He_role === 1 ? 'Estabilizador' : 'Híbrido'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.He_role}
                    onChange={(e) => setParams(prev => ({ 
                      ...prev, 
                      He_role: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Controles de Simulação */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Controles</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Modo</label>
                  <select
                    className="w-full p-2 bg-[#020617] border border-violet-500/30 rounded-lg"
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value as 'static' | 'transient');
                      handleReset();
                    }}
                  >
                    <option value="static">Estático</option>
                    <option value="transient">Transiente</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  {mode === 'transient' && (
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                    >
                      {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      {isRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Área Principal */}
          <div className="space-y-6">
            {/* Visualização 3D */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Visualização do Motor</h3>
              <RocketEngineVisualization
                temperature={results?.T_adiabatic || 300}
                exhaustVelocity={results?.v_exhaust || 0}
                thrust={results?.thrust || 0}
                isRunning={mode === 'static' || isRunning}
              />
            </div>

            {/* Dados em Tempo Real */}
            {results && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm text-gray-400 mb-1">Empuxo</h4>
                  <p className="text-2xl font-bold">{(results.thrust / 1000).toFixed(1)} kN</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm text-gray-400 mb-1">Isp</h4>
                  <p className="text-2xl font-bold">{results.Isp.toFixed(0)} s</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm text-gray-400 mb-1">Temperatura</h4>
                  <p className="text-2xl font-bold">{results.T_adiabatic.toFixed(0)} K</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm text-gray-400 mb-1">Vel. Escape</h4>
                  <p className="text-2xl font-bold">{(results.v_exhaust / 1000).toFixed(2)} km/s</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm text-gray-400 mb-1">Massa</h4>
                  <p className="text-2xl font-bold">{(results.state.mass / 1000).toFixed(1)} ton</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm text-gray-400 mb-1">Velocidade</h4>
                  <p className="text-2xl font-bold">{(results.state.velocity / 1000).toFixed(2)} km/s</p>
                </div>
              </div>
            )}

            {/* Gráficos Transientes */}
            {mode === 'transient' && history.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm font-semibold mb-2">Empuxo vs Tempo</h4>
                  <div className="h-48">
                    <Line data={thrustData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20">
                  <h4 className="text-sm font-semibold mb-2">Isp vs Tempo</h4>
                  <div className="h-48">
                    <Line data={ispData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 rounded-xl border border-violet-500/20 md:col-span-2">
                  <h4 className="text-sm font-semibold mb-2">Velocidade vs Tempo</h4>
                  <div className="h-48">
                    <Line data={velocityData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}

            {/* Explicações Científicas */}
            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h3 className="text-lg font-semibold mb-4">Interpretação dos Resultados</h3>
              {results && (
                <div className="space-y-3 text-sm text-gray-300">
                  <p>
                    A mistura atual tem Isp de <strong>{results.Isp.toFixed(0)} s</strong>, com temperatura 
                    de chama adiabática de <strong>{results.T_adiabatic.toFixed(0)} K</strong>.
                  </p>
                  <p>
                    A massa molecular efetiva é <strong>{results.M_mixture.toFixed(2)} kg/kmol</strong>, 
                    resultando em velocidade específica de escape de <strong>{(results.v_exhaust / 1000).toFixed(2)} km/s</strong>.
                  </p>
                  {composition.x_He > 0.1 && (
                    <p>
                      A presença de {(composition.x_He * 100).toFixed(0)}% de Hélio dilui a mistura, 
                      {params.He_role > 0.5 
                        ? ' mas atua como estabilizador térmico, reduzindo parcialmente o efeito negativo.'
                        : ' reduzindo a energia por massa, mas aumentando γ.'}
                    </p>
                  )}
                  {params.quantum_excitation > 0.2 && (
                    <p className="text-yellow-400">
                      ⚠ Parâmetro de excitação quântica em {(params.quantum_excitation * 100).toFixed(0)}% - 
                      este é um ganho teórico hipotético para fins de demonstração.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

