// src/pages/ThermodynamicControlPanel.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, Calculator } from 'lucide-react';
import Navigation from '../components/Navigation';
import FibonacciSpiralSimulation from '../components/FibonacciSpiralSimulation';

const ThermodynamicControlPanel = () => {
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
            <Thermometer className="text-violet-400" />
            Painel de Controle Termodinâmico
          </h1>

          <div className="col-span-full">
            <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2 text-amber-400">
              <Calculator /> Simulação da Sequência de Fibonacci
            </h2>
            <FibonacciSpiralSimulation />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThermodynamicControlPanel;
