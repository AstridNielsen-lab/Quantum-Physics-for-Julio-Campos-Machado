import { create } from 'zustand';
import * as THREE from 'three';

// Define power-up types
export type PowerUpType = 'rapidFire' | 'spreadShot' | 'quantumShield' | null;
export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver';

interface GameState {
  // Original ship properties
  speed: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  zoom: number;
  energy: number;
  shields: number;
  viewMode: string;

  // Space Invaders game mechanics
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameStatus: GameStatus;
  enemyCount: number;
  powerUpType: PowerUpType;
  powerUpActive: boolean;
  powerUpDuration: number;

  // Original ship methods
  setSpeed: (speed: number) => void;
  setPosition: (position: THREE.Vector3) => void;
  setRotation: (rotation: THREE.Euler) => void;
  setZoom: (zoom: number) => void;
  setEnergy: (energy: number) => void;
  setShields: (shields: number) => void;
  setViewMode: (mode: string) => void;

  // Space Invaders game methods
  startGame: () => void;
  pauseGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  loseLife: () => void;
  nextLevel: () => void;
  activatePowerUp: (type: PowerUpType) => void;
  deactivatePowerUp: () => void;
  updatePowerUpDuration: (delta: number) => void;
  setEnemyCount: (count: number) => void;
  moveLeft: () => void;
  moveRight: () => void;
  fireWeapon: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Original ship properties
  speed: 0,
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  zoom: 10,
  energy: 100,
  shields: 100,
  viewMode: 'front',

  // Space Invaders game mechanics
  score: 0,
  highScore: 0,
  lives: 3,
  level: 1,
  gameStatus: 'ready',
  enemyCount: 0,
  powerUpType: null,
  powerUpActive: false,
  powerUpDuration: 0,

  // Original ship methods
  setSpeed: (speed) => set({ speed }),
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setZoom: (zoom) => set({ zoom }),
  setEnergy: (energy) => set({ energy }),
  setShields: (shields) => set({ shields }),
  setViewMode: (mode) => set({ viewMode }),

  // Space Invaders game methods
  startGame: () => set({ 
    gameStatus: 'playing',
    score: 0,
    lives: 3,
    level: 1,
    enemyCount: 10 + (get().level * 2), // More enemies per level
    powerUpType: null,
    powerUpActive: false,
    powerUpDuration: 0,
    shields: 100,
    energy: 100
  }),

  pauseGame: () => set({ gameStatus: 'paused' }),

  endGame: () => {
    const { score } = get();
    const highScore = Math.max(score, get().highScore);
    set({ gameStatus: 'gameOver', highScore });
  },

  addScore: (points) => {
    const newScore = get().score + points;
    const newHighScore = Math.max(newScore, get().highScore);
    set({ score: newScore, highScore: newHighScore });
  },

  loseLife: () => {
    const lives = get().lives - 1;
    if (lives <= 0) {
      get().endGame();
    } else {
      set({ lives });
    }
  },

  nextLevel: () => {
    const level = get().level + 1;
    const enemyCount = 10 + (level * 2); // More enemies per level
    set({ level, enemyCount });
  },

  activatePowerUp: (type) => {
    const duration = 
      type === 'rapidFire' ? 10 : 
      type === 'spreadShot' ? 8 : 
      type === 'quantumShield' ? 15 : 0;
    
    // Apply power-up effects
    if (type === 'quantumShield') {
      set({ shields: 100 });
    }
    
    set({ 
      powerUpType: type,
      powerUpActive: true,
      powerUpDuration: duration
    });
  },

  deactivatePowerUp: () => set({ 
    powerUpType: null,
    powerUpActive: false,
    powerUpDuration: 0
  }),

  updatePowerUpDuration: (delta) => {
    const { powerUpDuration, powerUpActive } = get();
    if (powerUpActive) {
      const newDuration = powerUpDuration - delta;
      if (newDuration <= 0) {
        get().deactivatePowerUp();
      } else {
        set({ powerUpDuration: newDuration });
      }
    }
  },

  setEnemyCount: (count) => {
    set({ enemyCount: count });
    if (count <= 0) {
      // Level complete
      get().nextLevel();
    }
  },

  // Space Invaders movement (left/right only)
  moveLeft: () => {
    const { position } = get();
    const newPosition = new THREE.Vector3(
      Math.max(position.x - 1, -15), // Limit left movement
      position.y,
      position.z
    );
    set({ position: newPosition });
  },

  moveRight: () => {
    const { position } = get();
    const newPosition = new THREE.Vector3(
      Math.min(position.x + 1, 15), // Limit right movement
      position.y,
      position.z
    );
    set({ position: newPosition });
  },

  fireWeapon: () => {
    // This will be implemented in the game component
    // We add it here just as a placeholder to represent the action
    // The actual firing logic will use the current position to create projectiles
    const { energy, powerUpType } = get();
    
    // Energy cost varies by power-up
    const energyCost = 
      powerUpType === 'spreadShot' ? 5 :
      powerUpType === 'rapidFire' ? 2 :
      3; // default
    
    if (energy >= energyCost) {
      set({ energy: Math.max(0, energy - energyCost) });
      // Actual firing will be handled by components
    }
  },

  resetGame: () => set({
    score: 0,
    lives: 3,
    level: 1,
    gameStatus: 'ready',
    enemyCount: 10,
    powerUpType: null,
    powerUpActive: false,
    powerUpDuration: 0,
    shields: 100,
    energy: 100,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0)
  })
}));
