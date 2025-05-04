import { create } from 'zustand';

interface AIState {
  isProcessing: boolean;
  lastCommand: string;
  lastResponse: string;
  systemStatus: {
    propulsion: boolean;
    thermalControl: boolean;
    powerGeneration: boolean;
    navigation: boolean;
    lifeSupport: boolean;
  };
  controlValues: {
    propulsionPower: number;
    thermalControlPower: number;
    powerGenerationEfficiency: number;
    lifeSupportPower: number;
  };
  setIsProcessing: (isProcessing: boolean) => void;
  setLastCommand: (command: string) => void;
  setLastResponse: (response: string) => void;
  setSystemStatus: (status: Partial<AIState['systemStatus']>) => void;
  setControlValue: (control: keyof AIState['controlValues'], value: number) => void;
  toggleSystem: (system: keyof AIState['systemStatus']) => void;
}

export const useAIStore = create<AIState>((set) => ({
  isProcessing: false,
  lastCommand: '',
  lastResponse: '',
  systemStatus: {
    propulsion: true,
    thermalControl: true,
    powerGeneration: true,
    navigation: true,
    lifeSupport: true,
  },
  controlValues: {
    propulsionPower: 0.75,
    thermalControlPower: 0.8,
    powerGenerationEfficiency: 0.9,
    lifeSupportPower: 0.7,
  },
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setLastCommand: (command) => set({ lastCommand: command }),
  setLastResponse: (response) => set({ lastResponse: response }),
  setSystemStatus: (status) => set((state) => ({
    systemStatus: { ...state.systemStatus, ...status },
  })),
  setControlValue: (control, value) => set((state) => ({
    controlValues: { ...state.controlValues, [control]: value },
  })),
  toggleSystem: (system) => set((state) => ({
    systemStatus: {
      ...state.systemStatus,
      [system]: !state.systemStatus[system],
    },
  })),
}));