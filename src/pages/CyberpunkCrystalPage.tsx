import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Atom, Zap, Magnet, Settings } from 'lucide-react';
import Navigation from '../components/Navigation';
import CyberpunkScene3D from '../components/CyberpunkScene3D';

const CyberpunkCrystalPage = () => {
  const [laserPower, setLaserPower] = useState(10);
  const [fieldStrength, setFieldStrength] = useState(10);
  const [showCrystal, setShowCrystal] = useState(true);
  const [showLaser, setShowLaser] = useState(true);
  const [showElectrons, setShowElectrons] = useState(true);
  const [showField, setShowField] = useState(true);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <div className="absolute top-24 left-8 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 bg-violet-900/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-violet-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
      </div>

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-violet-900/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-violet-500/20">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Atom className="text-violet-400" />
          Simulação de Cristal Quântico
        </h1>
      </div>

      <div className="absolute top-24 right-8 z-20 bg-violet-900/20 backdrop-blur-sm p-6 rounded-lg border border-violet-500/20 w-80">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="text-violet-400 w-5 h-5" />
              Controles
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Potência do Laser
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={laserPower}
                  onChange={(e) => setLaserPower(Number(e.target.value))}
                  className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-violet-400 mt-1">
                  {laserPower} kV
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Magnet className="w-4 h-4" />
                  Campo Magnético
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={fieldStrength}
                  onChange={(e) => setFieldStrength(Number(e.target.value))}
                  className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-violet-400 mt-1">
                  {fieldStrength} Tesla
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Visualização</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCrystal}
                  onChange={(e) => setShowCrystal(e.target.checked)}
                  className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-300">Cristal</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLaser}
                  onChange={(e) => setShowLaser(e.target.checked)}
                  className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-300">Laser</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showElectrons}
                  onChange={(e) => setShowElectrons(e.target.checked)}
                  className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-300">Elétrons</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showField}
                  onChange={(e) => setShowField(e.target.checked)}
                  className="rounded bg-violet-900/20 border-violet-500/20 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-300">Campo Magnético</span>
              </label>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>• Use o mouse para rotacionar a visualização</p>
            <p>• Scroll para zoom</p>
            <p>• Clique no ícone de som para áudio ambiente</p>
          </div>
        </div>
      </div>

      <CyberpunkScene3D
        showCrystal={showCrystal}
        showLaser={showLaser}
        showElectrons={showElectrons}
        showField={showField}
        laserPower={laserPower}
        fieldStrength={fieldStrength}
      />
    </div>
  );
};

export default CyberpunkCrystalPage;