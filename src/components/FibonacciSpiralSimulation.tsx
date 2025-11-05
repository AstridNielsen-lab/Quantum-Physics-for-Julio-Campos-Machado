// src/components/FibonacciSpiralSimulation.tsx
import React, { useEffect, useRef } from 'react';

const generateFibonacci = (n: number): number[] => {
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
};

const FibonacciSpiralSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const fib = generateFibonacci(10);
    let angle = 0;

    const draw = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      angle += 0.01;
      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < fib.length; i++) {
        const radius = fib[i] * 5;
        const theta = angle + i * 0.6;

        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);

        ctx.beginPath();
        ctx.arc(x, y, 10 + i, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${i * 40}, 100%, 70%)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.fillText(`Fib(${i}) = ${fib[i]}`, x - 25, y - 12);
        ctx.fillText(`θ = ${theta.toFixed(2)}`, x - 25, y + 4);
      }

      ctx.restore();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="rounded-xl border border-violet-500/30 shadow-md" />;
};

export default FibonacciSpiralSimulation;
