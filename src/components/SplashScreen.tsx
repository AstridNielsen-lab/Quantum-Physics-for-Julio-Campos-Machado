import React, { useEffect, useState } from 'react';
import { Atom } from 'lucide-react';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <Atom className="w-24 h-24 text-violet-400 mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
          Quantum Doors
        </h1>
        <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-violet-400 to-transparent mb-4" />
        <p className="text-xl text-gray-400">
          por
        </p>
        <p className="text-2xl md:text-3xl text-violet-300 font-semibold mt-2">
          Julio Campos Machado
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;