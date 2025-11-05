import { create } from 'zustand';

interface ShipState {
  // Navigation
  speed: number;
  coordinates: { x: number; y: number; z: number };
  heading: { pitch: number; yaw: number; roll: number };
  
  // Power & Systems
  shieldPower: number;
  enginePower: number;
  batteryLevel: number;
  
  // Environmental
  internalTemp: number;
  engineTemp: number;
  internalPressure: number;
  
  // Status
  shieldsActive: boolean;
  enginesActive: boolean;
  criticalSystems: {
    [key: string]: {
      status: 'nominal' | 'warning' | 'critical';
      value: number;
    };
  };
  
  // Actions
  setSpeed: (speed: number) => void;
  setCoordinates: (coords: { x: number; y: number; z: number }) => void;
  setHeading: (heading: { pitch: number; yaw: number; roll: number }) => void;
  setShieldPower: (power: number) => void;
  setEnginePower: (power: number) => void;
  setBatteryLevel: (level: number) => void;
  setInternalTemp: (temp: number) => void;
  setEngineTemp: (temp: number) => void;
  setInternalPressure: (pressure: number) => void;
  toggleShields: (active: boolean) => void;
  toggleEngines: (active: boolean) => void;
  updateCriticalSystem: (system: string, status: 'nominal' | 'warning' | 'critical', value: number) => void;
}

export const useShipStore = create<ShipState>((set) => ({
  // Initial state
  speed: 0,
  coordinates: { x: 0, y: 0, z: 0 },
  heading: { pitch: 0, yaw: 0, roll: 0 },
  shieldPower: 0,
  enginePower: 0,
  batteryLevel: 100,
  internalTemp: 293,
  engineTemp: 350,
  internalPressure: 1,
  shieldsActive: false,
  enginesActive: false,
  criticalSystems: {
    lifeSupportPrimary: { status: 'nominal', value: 100 },
    lifeSupportBackup: { status: 'nominal', value: 100 },
    powerGrid: { status: 'nominal', value: 100 },
    navigationComputer: { status: 'nominal', value: 100 },
    quantumCore: { status: 'nominal', value: 100 }
  },

  // Actions
  setSpeed: (speed) => set({ speed }),
  setCoordinates: (coordinates) => set({ coordinates }),
  setHeading: (heading) => set({ heading }),
  setShieldPower: (power) => set({ shieldPower: power }),
  setEnginePower: (power) => set({ enginePower: power }),
  setBatteryLevel: (level) => set({ batteryLevel: level }),
  setInternalTemp: (temp) => set({ internalTemp: temp }),
  setEngineTemp: (temp) => set({ engineTemp: temp }),
  setInternalPressure: (pressure) => set({ internalPressure: pressure }),
  toggleShields: (active) => set({ shieldsActive: active }),
  toggleEngines: (active) => set({ enginesActive: active }),
  updateCriticalSystem: (system, status, value) => set((state) => ({
    criticalSystems: {
      ...state.criticalSystems,
      [system]: { status, value }
    }
  }))
}));