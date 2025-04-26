import { create } from 'zustand';
import * as THREE from 'three';

interface GameState {
  speed: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  zoom: number;
  energy: number;
  shields: number;
  viewMode: string;
  setSpeed: (speed: number) => void;
  setPosition: (position: THREE.Vector3) => void;
  setRotation: (rotation: THREE.Euler) => void;
  setZoom: (zoom: number) => void;
  setEnergy: (energy: number) => void;
  setShields: (shields: number) => void;
  setViewMode: (mode: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  speed: 0,
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  zoom: 10,
  energy: 100,
  shields: 100,
  viewMode: 'front',
  setSpeed: (speed) => set({ speed }),
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setZoom: (zoom) => set({ zoom }),
  setEnergy: (energy) => set({ energy }),
  setShields: (shields) => set({ shields }),
  setViewMode: (mode) => set({ viewMode }),
}));