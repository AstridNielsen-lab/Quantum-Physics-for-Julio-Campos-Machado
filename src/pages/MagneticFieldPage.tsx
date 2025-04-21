import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Map, Compass, Waves, AlertTriangle, Info, Thermometer, Magnet, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface MagneticStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fieldStrength: number;
  declination: number;
  inclination: number;
  lastUpdate: string;
}

interface Country {
  id: string;
  name: string;
  stations: MagneticStation[];
  color: string;
}

const MagneticFieldPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Sample data - in a real app, this would come from an API
  const countries: Country[] = [
    {
      id: 'usa',
      name: 'United States',
      color: '#ec4899',
      stations: [
        { id: 'bou', name: 'Boulder', lat: 40.1375, lng: -105.2372, fieldStrength: 52000, declination: 8.5, inclination: 66.9, lastUpdate: '2024-03-21' },
        { id: 'tuc', name: 'Tucson', lat: 32.1747, lng: -110.9553, fieldStrength: 48000, declination: 9.2, inclination: 59.8, lastUpdate: '2024-03-21' },
        { id: 'hon', name: 'Honolulu', lat: 21.3069, lng: -157.8583, fieldStrength: 34000, declination: 9.7, inclination: 39.5, lastUpdate: '2024-03-21' },
        { id: 'sit', name: 'Sitka', lat: 57.0576, lng: -135.3273, fieldStrength: 54000, declination: 19.8, inclination: 74.3, lastUpdate: '2024-03-21' },
        { id: 'brw', name: 'Barrow', lat: 71.3230, lng: -156.6114, fieldStrength: 57000, declination: 18.2, inclination: 82.1, lastUpdate: '2024-03-21' },
      ]
    },
    {
      id: 'can',
      name: 'Canada',
      color: '#22d3ee',
      stations: [
        { id: 'ott', name: 'Ottawa', lat: 45.4215, lng: -75.6972, fieldStrength: 54000, declination: -14.5, inclination: 71.9, lastUpdate: '2024-03-21' },
        { id: 'res', name: 'Resolute Bay', lat: 74.6968, lng: -94.9000, fieldStrength: 58000, declination: -28.3, inclination: 88.7, lastUpdate: '2024-03-21' },
      ]
    },
    {
      id: 'mex',
      name: 'Mexico',
      color: '#a855f7',
      stations: [
        { id: 'mex', name: 'Teoloyucan', lat: 19.7460, lng: -99.1925, fieldStrength: 43000, declination: 5.9, inclination: 48.2, lastUpdate: '2024-03-21' },
      ]
    }
  ];

  const drawMagneticMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const currentTime = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = Math.min(40, width / 20);
    
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
    const lineCount = 20;
    for (let i = 0; i < lineCount; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (height / lineCount) * i);
      
      for (let x = 0; x < width; x += 5) {
        const y = (height / lineCount) * i + 
          Math.sin(x * 0.02 + currentTime + i * 0.5) * 20 +
          Math.sin(x * 0.01 + currentTime * 0.5) * 10;
        
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + (i / lineCount) * 0.2})`;
      ctx.stroke();
    }

    // Draw stations
    countries.forEach(country => {
      const isSelected = selectedCountry === country.id;
      const isHovered = hoveredCountry === country.id;
      
      country.stations.forEach(station => {
        // Convert lat/lng to canvas coordinates
        const x = ((station.lng + 180) / 360) * width;
        const y = ((90 - station.lat) / 180) * height;
        
        // Draw station marker
        ctx.beginPath();
        ctx.arc(x, y, isSelected || isHovered ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = country.color;
        ctx.fill();

        if (isSelected || isHovered) {
          // Draw magnetic field strength indicator
          const fieldRadius = 30 + Math.sin(currentTime * 2) * 5;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, fieldRadius);
          gradient.addColorStop(0, `${country.color}44`);
          gradient.addColorStop(1, `${country.color}00`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, fieldRadius, 0, Math.PI * 2);
          ctx.fill();

          // Draw declination indicator
          const declAngle = (station.declination * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(declAngle) * 40,
            y + Math.sin(declAngle) * 40
          );
          ctx.strokeStyle = country.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Station info
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(station.name, x, y - 20);
          ctx.fillText(`${station.fieldStrength} nT`, x, y + 20);
        }
      });
    });

    animationRef.current = requestAnimationFrame(drawMagneticMap);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      const height = Math.min(600, window.innerHeight * 0.6);

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    drawMagneticMap();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedCountry, hoveredCountry]);

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
            <Map className="text-violet-400" />
            Mapa de Campo Magnético Global
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                  <Compass className="text-violet-400" />
                  Estações de Monitoramento
                </h2>
                <div className="space-y-4">
                  {countries.map(country => (
                    <div
                      key={country.id}
                      className={`p-4 rounded-lg transition-colors cursor-pointer ${
                        selectedCountry === country.id
                          ? 'bg-violet-600'
                          : 'bg-violet-900/20 hover:bg-violet-900/40'
                      }`}
                      onClick={() => setSelectedCountry(country.id)}
                      onMouseEnter={() => setHoveredCountry(country.id)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: country.color }}
                        />
                        <h3 className="font-semibold">{country.name}</h3>
                        <span className="text-sm text-gray-400">
                          ({country.stations.length} estações)
                        </span>
                      </div>
                      {selectedCountry === country.id && (
                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                          {country.stations.map(station => (
                            <div
                              key={station.id}
                              className="bg-violet-900/20 p-3 rounded-lg"
                            >
                              <div className="font-semibold mb-1">{station.name}</div>
                              <div className="text-gray-300">
                                {station.fieldStrength} nT
                              </div>
                              <div className="text-gray-400 text-xs">
                                {station.lat.toFixed(2)}°N, {station.lng.toFixed(2)}°W
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                  <Info className="text-violet-400" />
                  Legenda
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Waves className="text-violet-400" />
                    <span>Linhas de campo magnético</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Radio className="text-violet-400" />
                    <span>Estações de monitoramento</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Magnet className="text-violet-400" />
                    <span>Intensidade do campo (nT)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Compass className="text-violet-400" />
                    <span>Declinação magnética</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                  <AlertTriangle className="text-violet-400" />
                  Observações
                </h2>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Dados de estações magnéticas públicas</p>
                  <p>• Atualizações em tempo real quando disponíveis</p>
                  <p>• Valores em nanotesla (nT)</p>
                  <p>• Declinação em graus em relação ao norte geográfico</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Visualização do Campo Magnético</h2>
                <canvas
                  ref={canvasRef}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-xs md:text-sm text-gray-400">
                  <p>• Selecione um país para ver detalhes das estações</p>
                  <p>• As linhas representam o fluxo do campo magnético</p>
                  <p>• Cores indicam a intensidade do campo</p>
                </div>
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

export default MagneticFieldPage;