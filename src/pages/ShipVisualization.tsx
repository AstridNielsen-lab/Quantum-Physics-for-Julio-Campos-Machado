import React, { useRef, useEffect } from 'react';
import { Rocket } from 'lucide-react'; // Using an icon for simplicity

interface ShipVisualizationProps {
  velocityFractionC: number; // Current velocity as fraction of speed of light
  distanceLightYears: number; // Distance traveled in light years
}

const ShipVisualization: React.FC<ShipVisualizationProps> = ({ velocityFractionC, distanceLightYears }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; speed: number }[]>([]);

  useEffect(() => {
    // Initialize stars
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        starsRef.current.push({
          x: Math.random() * 500, // Assuming canvas width 500
          y: Math.random() * 150, // Assuming canvas height 150
          speed: Math.random() * 0.5 + 0.1 // Base speed
        });
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Animation loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = 'white';
      starsRef.current.forEach(star => {
        // Move star based on ship velocity
        star.x -= star.speed * (velocityFractionC * 50 + 1); // Speed up stars based on velocity
        if (star.x < 0) {
          star.x = width; // Reset star position
          star.y = Math.random() * height;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(0.5, velocityFractionC * 2), 0, Math.PI * 2); // Star size slightly increases with speed
        ctx.fill();
      });

      // Draw ship (simple representation)
      // Using a static icon is simpler than drawing complex shapes
      // We can simulate movement by the star field
      ctx.fillStyle = '#00ffff'; // Cyan color for the ship
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🚀', width / 2, height / 2 + 15); // Simple rocket emoji

      // Draw info text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Velocidade: ${velocityFractionC.toFixed(4)}c`, 10, height - 25);
      ctx.fillText(`Distância: ${distanceLightYears.toExponential(3)} anos-luz`, 10, height - 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [velocityFractionC, distanceLightYears]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 flex items-center">
        <Rocket className="mr-2 h-5 w-5 text-cyan-400"/> Visualização da Nave
      </h2>
      <canvas ref={canvasRef} width={500} height={150} className="bg-black rounded w-full" />
    </div>
  );
};

export default ShipVisualization;

