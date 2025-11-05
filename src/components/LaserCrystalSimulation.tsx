import React, { useEffect, useRef, useState } from 'react';
import { initLaserScene, toggleLaserBeam, updateVoltage } from '../simulations/laserSimulation';

const LaserCrystalSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [voltage, setVoltage] = useState(17);
  const [laserOn, setLaserOn] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      initLaserScene(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    updateVoltage(voltage);
    // Atualiza MathJax com nova equação (após slider mudar)
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [voltage]);

  const handleLaserToggle = () => {
    setLaserOn((prev) => !prev);
    toggleLaserBeam();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Canvas 3D */}
      <div className="bg-[#0b0c2a] p-4 rounded-xl flex justify-center items-center">
        <canvas ref={canvasRef} className="w-[400px] h-[400px] bg-black rounded-lg" />
      </div>

      {/* Painel */}
      <div className="bg-[#030314] text-white p-6 rounded-xl">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Painel de Controle</h2>

        <div className="mb-4">
          <label htmlFor="voltage-slider">Voltagem: {voltage} kV</label>
          <input
            type="range"
            id="voltage-slider"
            min={1}
            max={50}
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button onClick={handleLaserToggle} className="bg-purple-700 px-4 py-2 rounded">
          {laserOn ? 'Desligar Laser' : 'Ligar Laser'}
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Equação</h3>
          <div id="mathjax-output" className="text-green-400">
            {`$$E = hv = \\frac{hc}{\\lambda}$$`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaserCrystalSimulation;
