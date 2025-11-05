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

const GlobalMagneticFieldPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Global magnetic field stations data
  const countries: Country[] = [
    {
      id: 'usa',
      name: 'United States',
      color: '#ec4899',
      stations: [
        { id: 'bou', name: 'Boulder', lat: 40.1375, lng: -105.2372, fieldStrength: 52000, declination: 8.5, inclination: 66.9, lastUpdate: '2024-03-21' },
        { id: 'tuc', name: 'Tucson', lat: 32.1747, lng: -110.9553, fieldStrength: 48000, declination: 9.2, inclination: 59.8, lastUpdate: '2024-03-21' },
        { id: 'hon', name: 'Honolulu', lat: 21.3069, lng: -157.8583, fieldStrength: 34000, declination: 9.7, inclination: 39.5, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'can',
      name: 'Canada',
      color: '#22d3ee',
      stations: [
        { id: 'ott', name: 'Ottawa', lat: 45.4215, lng: -75.6972, fieldStrength: 54000, declination: -14.5, inclination: 71.9, lastUpdate: '2024-03-21' },
        { id: 'res', name: 'Resolute Bay', lat: 74.6968, lng: -94.9000, fieldStrength: 58000, declination: -28.3, inclination: 88.7, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'bra',
      name: 'Brazil',
      color: '#a855f7',
      stations: [
        { id: 'vas', name: 'Vassouras', lat: -22.4, lng: -43.6, fieldStrength: 23000, declination: -21.4, inclination: -35.8, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'rus',
      name: 'Russia',
      color: '#f43f5e',
      stations: [
        { id: 'nov', name: 'Novosibirsk', lat: 55.0, lng: 82.9, fieldStrength: 60000, declination: 8.5, inclination: 74.2, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'chn',
      name: 'China',
      color: '#eab308',
      stations: [
        { id: 'bmg', name: 'Beijing Ming Tombs', lat: 40.3, lng: 116.2, fieldStrength: 52000, declination: -6.8, inclination: 59.4, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'jpn',
      name: 'Japan',
      color: '#84cc16',
      stations: [
        { id: 'kak', name: 'Kakioka', lat: 36.2, lng: 140.2, fieldStrength: 46000, declination: -7.2, inclination: 49.7, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'aus',
      name: 'Australia',
      color: '#06b6d4',
      stations: [
        { id: 'gnr', name: 'Gnangara', lat: -31.8, lng: 116.0, fieldStrength: 57000, declination: -1.8, inclination: -64.7, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'zaf',
      name: 'South Africa',
      color: '#8b5cf6',
      stations: [
        { id: 'her', name: 'Hermanus', lat: -34.4, lng: 19.2, fieldStrength: 26000, declination: -24.9, inclination: -64.9, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'ind',
      name: 'India',
      color: '#f97316',
      stations: [
        { id: 'abg', name: 'Alibag', lat: 18.6, lng: 72.9, fieldStrength: 41000, declination: -0.7, inclination: 25.8, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'fra',
      name: 'France',
      color: '#14b8a6',
      stations: [
        { id: 'clf', name: 'Chambon-la-Forêt', lat: 48.0, lng: 2.3, fieldStrength: 47000, declination: -0.4, inclination: 64.2, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'deu',
      name: 'Germany',
      color: '#f59e0b',
      stations: [
        { id: 'ngk', name: 'Niemegk', lat: 52.1, lng: 12.7, fieldStrength: 49000, declination: 3.8, inclination: 67.7, lastUpdate: '2024-03-21' }
      ]
    },
    {
      id: 'gbr',
      name: 'United Kingdom',
      color: '#6366f1',
      stations: [
        { id: 'ler', name: 'Lerwick', lat: 60.1, lng: -1.2, fieldStrength: 50000, declination: -2.3, inclination: 73.2, lastUpdate: '2024-03-21' }
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

    // Draw latitude/longitude lines
    const latLines = 18;
    const lonLines = 36;

    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 1;

    // Draw latitude lines
    for (let i = 0; i <= latLines; i++) {
      const y = (height / latLines) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Label latitude
      const lat = 90 - (i * 180 / latLines);
      ctx.fillStyle = '#ffffff44';
      ctx.font = '10px monospace';
      ctx.fillText(`${lat}°`, 5, y - 2);
    }

    // Draw longitude lines
    for (let i = 0; i <= lonLines; i++) {
      const x = (width / lonLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Label longitude
      const lon = -180 + (i * 360 / lonLines);
      ctx.fillStyle = '#ffffff44';
      ctx.font = '10px monospace';
      ctx.fillText(`${lon}°`, x - 15, height - 5);
    }

    // Draw magnetic field lines
    const lineCount = 36;
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
          ctx.fillText(`${station.declination.toFixed(1)}°`, x, y + 35);
        }
      });
    });

    // Draw magnetic poles
    const northPoleX = ((288.3 + 180) / 360) * width; // 288.3°E
    const northPoleY = ((80.7) / 180) * height; // 80.7°N
    const southPoleX = ((109.2 + 180) / 360) * width; // 109.2°E
    const southPoleY = (((-75.2) + 90) / 180) * height; // 75.2°S

    // North magnetic pole
    ctx.beginPath();
    ctx.arc(northPoleX, northPoleY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('North Magnetic Pole', northPoleX, northPoleY - 15);

    // South magnetic pole
    ctx.beginPath();
    ctx.arc(southPoleX, southPoleY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee';
    ctx.fill();
    ctx.fillText('South Magnetic Pole', southPoleX, southPoleY + 25);

    animationRef.current = requestAnimationFrame(drawMagneticMap);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      // Calculate the aspect ratio for the map (2:1 for a world map)
      const containerWidth = container.clientWidth;
      const desiredHeight = containerWidth * 0.5; // 2:1 aspect ratio
      const maxHeight = window.innerHeight * 0.6;
      const height = Math.min(desiredHeight, maxHeight);

      canvas.width = containerWidth * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${containerWidth}px`;
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

          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                  <Compass className="text-violet-400" />
                  Estações de Monitoramento
                </h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
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
                        <div className="grid grid-cols-1 gap-4 mt-4 text-sm">
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
                                {station.lat.toFixed(2)}°N, {station.lng.toFixed(2)}°E
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
                  <p>• Polos magnéticos em movimento constante</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Visualização do Campo Magnético</h2>
                <div className="relative aspect-[2/1] w-full">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full bg-[#1a1a2e] rounded-lg"
                  />
                </div>
                <div className="mt-4 text-xs md:text-sm text-gray-400">
                  <p>• Selecione um país para ver detalhes das estações</p>
                  <p>• As linhas representam o fluxo do campo magnético</p>
                  <p>• Cores indicam a intensidade do campo</p>
                  <p>• Coordenadas em graus (latitude/longitude)</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-4 md:p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                  <Thermometer className="text-violet-400" />
                  Intensidade do Campo
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
                    <div className="text-sm text-gray-400">20.000 - 65.000 nT</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Equador Magnético</h3>
                      <p className="text-sm text-gray-300">~30.000 nT</p>
                    </div>
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Polos Magnéticos</h3>
                      <p className="text-sm text-gray-300">~60.000 nT</p>
                    </div>
                  </div>
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

export default GlobalMagneticFieldPage;