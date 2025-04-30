// Novo componente: FibonacciRotationSimulation.tsx
import React, { useEffect, useRef, useState } from 'react';

interface FibonacciRotationSimulationProps {
  pulses: number;
  energy: number;
  laserVoltage: number;
  target: string;
}

const generateFibonacci = (n: number): number[] => {
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
};

const FibonacciRotationSimulation: React.FC<FibonacciRotationSimulationProps> = ({
  pulses,
  energy,
  laserVoltage,
  target,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fibonacci, setFibonacci] = useState<number[]>([]);
  const [angle, setAngle] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setFibonacci(generateFibonacci(20));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 600;
    const height = canvas.height = 600;

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      const cx = width / 2;
      const cy = height / 2;
      const radius = 100 + fibonacci[index % fibonacci.length] * 5;
      setAngle((prev) => prev + 0.1);

      // Draw rotating Fibonacci circle
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Display calculations
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(`Fibonacci[${index}]: ${fibonacci[index % fibonacci.length]}`, 10, 30);
      ctx.fillText(`Energia Total: ${energy * pulses} J`, 10, 50);
      ctx.fillText(`Potência Laser: ${laserVoltage} kV`, 10, 70);
      ctx.fillText(`Alvo: ${target}`, 10, 90);

      setIndex((prev) => (prev + 1) % fibonacci.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [angle, fibonacci, pulses, energy, laserVoltage, target, index]);

  return (
    <div className="p-4 bg-black rounded-xl">
      <h2 className="text-white text-lg mb-2">Simulação Quântica em Espiral de Fibonacci</h2>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FibonacciRotationSimulation;
