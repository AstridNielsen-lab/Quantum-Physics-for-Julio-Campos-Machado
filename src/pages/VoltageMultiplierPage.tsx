import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Settings, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';
import Navigation from '../components/Navigation';

const VoltageMultiplierPage = () => {
  const [inputVoltage, setInputVoltage] = useState(5);
  const [frequency, setFrequency] = useState(60);
  const [stages, setStages] = useState(4);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [voltageReadings, setVoltageReadings] = useState<number[]>([]);
  const oscillatorsRef = useRef<Tone.Oscillator[]>([]);
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    // Initialize audio oscillators
    if (audioEnabled && oscillatorsRef.current.length === 0) {
      const baseFreqs = [220, 330, 440, 550]; // Base frequencies for each stage
      oscillatorsRef.current = baseFreqs.map(freq => {
        const osc = new Tone.Oscillator({
          frequency: freq,
          type: "sine",
          volume: -20
        }).toDestination();
        return osc;
      });
    }

    return () => {
      oscillatorsRef.current.forEach(osc => osc.dispose());
      oscillatorsRef.current = [];
    };
  }, [audioEnabled]);

  const toggleAudio = async () => {
    if (!audioEnabled) {
      await Tone.start();
      setAudioEnabled(true);
      oscillatorsRef.current.forEach(osc => osc.start());
    } else {
      oscillatorsRef.current.forEach(osc => osc.stop());
      setAudioEnabled(false);
    }
  };

  const calculateVoltages = () => {
    const efficiency = 0.95;
    const readings = [];
    for (let i = 1; i <= stages; i++) {
      const theoreticalVoltage = inputVoltage * 2 * i;
      const actualVoltage = theoreticalVoltage * Math.pow(efficiency, i);
      readings.push(Number(actualVoltage.toFixed(2)));
    }
    setVoltageReadings(readings);

    // Update audio frequencies based on voltage
    if (audioEnabled) {
      readings.forEach((voltage, index) => {
        if (oscillatorsRef.current[index]) {
          const baseFreq = 220 * (index + 1);
          const voltageFactor = voltage / inputVoltage;
          oscillatorsRef.current[index].frequency.value = baseFreq * voltageFactor;
          oscillatorsRef.current[index].volume.value = -20 + (voltage * 1.5);
        }
      });
    }
  };

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333344';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw voltage waveforms with real-time animation
    const colors = ['#22d3ee', '#a855f7', '#eab308', '#ec4899'];
    const time = Date.now() / 1000;
    
    voltageReadings.forEach((voltage, index) => {
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 4 + time * frequency / 10;
        const noise = Math.random() * 0.1; // Add slight noise for realism
        const y = canvas.height / 2 - (
          (Math.sin(t + index * Math.PI/4) * voltage * 10) +
          (Math.sin(t * 2) * voltage * 2) + // Harmonic
          (noise * voltage) // Noise
        );
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Add glow effect
      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = colors[index % colors.length];
      ctx.stroke();
      ctx.restore();
    });

    // Add oscilloscope scan line
    const scanX = (Math.sin(time * 2) + 1) * canvas.width / 2;
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(scanX, 0);
    ctx.lineTo(scanX, canvas.height);
    ctx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawOscilloscope);
  };

  useEffect(() => {
    calculateVoltages();
  }, [inputVoltage, frequency, stages]);

  useEffect(() => {
    drawOscilloscope();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [voltageReadings, frequency]);

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

          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
              <Zap className="text-violet-400" />
              Simulador de Multiplicador de Tensão
            </h1>
            <button
              onClick={toggleAudio}
              className="p-3 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors"
            >
              {audioEnabled ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Configurações
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tensão de Entrada (V)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={inputVoltage}
                      onChange={(e) => setInputVoltage(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {inputVoltage} V
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequência (Hz)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {frequency} Hz
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Número de Estágios
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={stages}
                      onChange={(e) => setStages(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {stages} estágios
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <RefreshCw className="text-violet-400" />
                  Leituras de Tensão
                </h2>
                
                <div className="space-y-3">
                  {voltageReadings.map((voltage, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">Estágio {index + 1}</span>
                      <span className="text-violet-400 font-mono">{voltage.toFixed(2)} V</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-violet-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tensão Final</span>
                      <span className="text-violet-400 font-mono">
                        {voltageReadings[voltageReadings.length - 1]?.toFixed(2) || 0} V
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
              <h2 className="text-xl font-semibold mb-6">Visualização do Osciloscópio</h2>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full bg-[#1a1a2e] rounded-lg"
              />
              <div className="mt-4 grid grid-cols-4 gap-2">
                {voltageReadings.map((_, index) => (
                  <div key={index} className="text-center">
                    <div className={`h-2 rounded ${
                      index === 0 ? 'bg-cyan-400' :
                      index === 1 ? 'bg-purple-400' :
                      index === 2 ? 'bg-yellow-400' :
                      'bg-pink-400'
                    }`} />
                    <span className="text-xs text-gray-400">Canal {index + 1}</span>
                  </div>
                ))}
              </div>
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

export default VoltageMultiplierPage;