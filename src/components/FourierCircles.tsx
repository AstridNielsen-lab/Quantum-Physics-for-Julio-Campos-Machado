import React, { useRef, useEffect } from 'react';

const FourierCircles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 800;
  const height = 600;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width / 3, height / 2);

      let x = 0;
      let y = 0;

      const wave: number[] = [];
      const numCircles = 10;

      for (let i = 0; i < numCircles; i++) {
        const n = 2 * i + 1; // termos ímpares da série
        const radius = 75 * (4 / (n * Math.PI));
        const prevX = x;
        const prevY = y;

        x += radius * Math.cos(n * time);
        y += radius * Math.sin(n * time);

        // círculo
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // linha
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      wave.unshift(y);

      // linha até gráfico
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(250, wave[0]);
      ctx.stroke();

      // onda
      ctx.translate(250, 0);
      ctx.beginPath();
      ctx.moveTo(0, wave[0]);

      for (let i = 1; i < wave.length; i++) {
        ctx.lineTo(i, wave[i]);
      }
      ctx.stroke();

      time += 0.02;
      ctx.resetTransform();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex justify-center items-center mt-10">
      <canvas ref={canvasRef} width={width} height={height} className="border rounded-lg shadow-lg bg-black" />
    </div>
  );
};

export default FourierCircles;
