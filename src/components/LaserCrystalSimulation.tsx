// src/components/LaserCrystalSimulation.tsx
import React from 'react';

const LaserCrystalSimulation = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Simulação Gráfica (placeholder canvas/three.js scene) */}
      <div className="flex justify-center items-center bg-[#0b0c2a] rounded-xl p-4 relative">
        <div className="w-[300px] h-[300px] bg-[#0d0e4e] rounded-lg relative">
          <div className="absolute left-[-20px] top-1/2 h-1 w-1/2 bg-red-600"></div>
          <div className="absolute top-[20%] left-[30%] w-5 h-5 bg-orange-700 rounded-full"></div>
          <div className="absolute top-[50%] left-[45%] w-5 h-5 bg-purple-600 rounded-full"></div>
          <div className="absolute top-[70%] left-[60%] w-5 h-5 bg-cyan-400 rounded-full"></div>
        </div>
      </div>

      {/* Painel de Controle */}
      <div className="bg-[#030314] text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Painel de Controle e Informações</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Controles</h3>
          <label htmlFor="voltage-slider">Voltagem (kV):</label>
          <input
            type="range"
            id="voltage-slider"
            name="voltage-slider"
            min="1"
            max="50"
            defaultValue="17"
            step="1"
            className="w-full"
          />
          <span className="block mt-1">17 kV</span>
          <div className="mt-2 space-x-2">
            <button className="bg-blue-700 px-3 py-1 rounded">Boro</button>
            <button className="bg-blue-700 px-3 py-1 rounded">Nitrogênio</button>
            <button className="bg-blue-700 px-3 py-1 rounded">Flúor</button>
            <button className="bg-green-700 px-3 py-1 rounded font-bold">Todos</button>
          </div>
          <p className="mt-2">Laser: <button className="bg-purple-600 px-3 py-1 rounded">Ativar/Desativar (L)</button></p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Laser</h3>
          <p>Status: <span className="text-red-500">OFF</span></p>
          <p>Voltagem Configurada: 17 kV</p>
          <p>Energia/Pulso: 1 J (Placeholder)</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Cristal e Dopagem</h3>
          <p>Material Alvo: Cristal Dopado</p>
          <p>Zonas Ativas: <span className="text-orange-400">Boro</span>, <span className="text-blue-400">Nitrogênio</span>, <span className="text-pink-400">Flúor</span></p>
          <p>Foco Atual: Todos</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Simulação</h3>
          <p>Partículas Ativas: 0</p>
          <p>Campo Magnético: Inativo</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Equações Relevantes (MathJax)</h3>
          <div id="mathjax-output">
            <p className="text-yellow-400">Math input error</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaserCrystalSimulation;
