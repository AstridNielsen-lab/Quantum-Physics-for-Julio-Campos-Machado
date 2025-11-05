import { create } from 'zustand';

interface SystemComponent {
  name: string;
  active: boolean;
  power: number;
  temperature: number;
  efficiency: number;
}

interface ThermalState {
  components: Record<string, SystemComponent>;
  setComponentActive: (id: string, active: boolean) => void;
  setComponentPower: (id: string, power: number) => void;
  updateComponentTemp: (id: string, temp: number) => void;
  updateComponentEfficiency: (id: string, efficiency: number) => void;
}

export const useThermalStore = create<ThermalState>((set) => ({
  components: {
    propulsion: {
      name: 'Sistema de Propulsão',
      active: true,
      power: 80,
      temperature: 300,
      efficiency: 0.95
    },
    thermalControl: {
      name: 'Controle Térmico',
      active: true,
      power: 90,
      temperature: 290,
      efficiency: 0.98
    },
    powerGeneration: {
      name: 'Geração de Energia',
      active: true,
      power: 85,
      temperature: 310,
      efficiency: 0.92
    },
    navigation: {
      name: 'Sistema de Navegação',
      active: true,
      power: 75,
      temperature: 285,
      efficiency: 0.97
    },
    lifeSupport: {
      name: 'Suporte Vital',
      active: true,
      power: 95,
      temperature: 295,
      efficiency: 0.99
    },
    shielding: {
      name: 'Escudos Térmicos',
      active: true,
      power: 88,
      temperature: 320,
      efficiency: 0.94
    }
  },
  setComponentActive: (id, active) =>
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          ...state.components[id],
          active
        }
      }
    })),
  setComponentPower: (id, power) =>
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          ...state.components[id],
          power
        }
      }
    })),
  updateComponentTemp: (id, temperature) =>
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          ...state.components[id],
          temperature
        }
      }
    })),
  updateComponentEfficiency: (id, efficiency) =>
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          ...state.components[id],
          efficiency
        }
      }
    }))
}));