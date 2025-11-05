import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const QuantumSimulation = () => {
  const config = {
    loader: { load: ['[tex]/physics'] },
    tex: {
      packages: { '[+]': ['physics'] },
    },
  };

  const fibonacciLayers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

  return (
    <MathJaxContext version={3} config={config}>
      <div className="mt-10 p-6 bg-gray-800 rounded-xl border border-violet-500">
        <h2 className="text-2xl font-bold text-violet-300 mb-4">Simulação Quântica com Malha Fibonacci</h2>

        <p className="mb-4">A energia de entrada do laser é definida como:</p>
        <MathJax>{'\\[ E_{entrada} = 17kV \\times 1A = 17kJ \\]'}</MathJax>

        <p className="mt-4 mb-4">Energia por pulso emitido:</p>
        <MathJax>{'\\[ E_{pulso} = 1J \\]'}</MathJax>

        <p className="mt-4 mb-4">Considerando condutividade \\( \\sigma \\) do material e temperatura \\( T \\):</p>
        <MathJax>{'\\[ E_{saida} = E_{entrada} \\times \\sigma \\times \\left(1 + \\frac{T}{1000}\\right) \\]'}</MathJax>

        <p className="mt-4 mb-4">O campo magnético gerado é proporcional à energia total:</p>
        <MathJax>{'\\[ B = \\mu_0 \\cdot \\frac{I}{2\\pi r} \\quad \\text{(modelo simplificado)} \\]'}</MathJax>

        <p className="mt-4 mb-4">A repulsão quântica é modelada por uma função logarítmica:</p>
        <MathJax>{'\\[ R_q = \\log_{10}\\left(1 + \\frac{B \\cdot \\sigma \\cdot T}{E_{pulso}}\\right) \\]'}</MathJax>

        <p className="mt-4 mb-4">Malha quântica com 10 camadas segundo Fibonacci:</p>
        <ul className="list-disc ml-6 text-white">
          {fibonacciLayers.map((val, idx) => (
            <li key={idx}>Camada {idx + 1}: {val}u</li>
          ))}
        </ul>
      </div>
    </MathJaxContext>
  );
};

export default QuantumSimulation;
