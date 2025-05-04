import React from 'react';
import { useGameStore } from '../../stores/gameStore';

// ASCII art variations based on speed
const shipAsciiIdle = `
      ▲
     / \
    / _ \
   //   \\
  // O O \\
 //=======\\
<===========>
 \\=======//
  \\ --- //
   \\___//
    | |
   (O) (O)
`;

const shipAsciiSlow = `
      ▲
     / \
    / _ \
   //   \\
  // O O \\
 //=======\\
<===========>
 \\=======//
  \\ --- //
   \\___//
    | |
   (.) (.)
`; // Subtle change in engine

const shipAsciiFast = `
      ▲
     / \
    / _ \
   //   \\
  // O O \\
 //=======\\
<<<========>>>
 \\=======//
  \\ >>> //
   \\>>>//
    ~ ~
   (^) (^)
`; // More dynamic lines and engine effect

const ShipAsciiDisplay = () => {
  const { speed } = useGameStore();

  let currentShipAscii;
  if (speed <= 0) {
    currentShipAscii = shipAsciiIdle;
  } else if (speed < 5) {
    currentShipAscii = shipAsciiSlow;
  } else {
    currentShipAscii = shipAsciiFast;
  }

  return (
    <div 
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 15, // Ensure it's above the 3D scene (z-10) but below UI elements (z-20)
        color: 'rgba(0, 255, 255, 0.7)', // Cyan color with some transparency
        fontFamily: 'monospace',
        fontSize: '10px', // Adjust size as needed
        lineHeight: '1',
        whiteSpace: 'pre',
        textAlign: 'center',
        pointerEvents: 'none', // Allow clicks to pass through to the 3D scene
        textShadow: '0 0 5px rgba(0, 255, 255, 0.5)', // Add a subtle glow
        transition: 'opacity 0.3s ease-in-out', // Smooth transition if needed
      }}
    >
      {currentShipAscii}
    </div>
  );
};

export default ShipAsciiDisplay;

