/**
 * Motor Físico para Simulação de Propulsão de Foguete
 * 
 * Implementa cálculos termodinâmicos para simulação de motor-foguete virtual:
 * - Propriedades termodinâmicas de misturas H₂/He/O₂
 * - Temperatura adiabática de chama
 * - Velocidade de escape e Isp
 * - Empuxo e dinâmica temporal
 */

// Constantes físicas
const R_UNIVERSAL = 8314.46; // J/(kmol·K)
const G0 = 9.80665; // m/s² (aceleração gravitacional padrão)

// Massas molares (g/mol)
export const MOLAR_MASS = {
  H2: 2.016,
  He: 4.003,
  O2: 31.999,
  CH4: 16.04
} as const;

// Razões de calor específico (γ = cp/cv)
const GAMMA = {
  H2: 1.41,
  He: 1.66,
  O2: 1.40,
  CH4: 1.32
} as const;

// Calores específicos aproximados (J/kg·K)
const CP = {
  H2: 14300,
  He: 5193,
  O2: 918,
  CH4: 2220
} as const;

// Energia química relativa (escala normalizada)
const ENERGY_RELEASE = {
  H2: 1.0,    // máxima (referência)
  CH4: 0.55,  // metano tem ~55% da energia por massa do H₂
  He: 0.0     // hélio não combustível
} as const;

export interface PropellantComposition {
  // Fração molar do lado combustível (H2 + He = 1.0 antes de adicionar O2)
  x_H2: number;      // 0-1
  x_He: number;      // 0-1
  x_CH4?: number;    // opcional para comparação
  // Razão oxidante/combustível (massa)
  O_F_ratio: number; // oxidizer/fuel mass ratio
}

export interface EngineParameters {
  p_chamber: number;        // Pressão na câmara (Pa) - virtual
  p_ambient: number;        // Pressão ambiente (Pa)
  T0: number;               // Temperatura inicial (K)
  expansion_ratio: number;  // ε = A_exit / A_throat
  mass_flow_rate: number;   // kg/s
  
  // Parâmetros experimentais (hipotéticos)
  quantum_excitation: number; // 0-1 (ganho teórico de energia)
  He_role: number;            // 0-1 (0=diluente, 1=estabilizador térmico)
}

export interface SimulationState {
  time: number;       // s
  mass: number;       // kg
  velocity: number;   // m/s
  position: number;   // m
}

export interface SimulationResults {
  // Propriedades da mistura
  M_mixture: number;          // kg/kmol
  gamma_mixture: number;      // adimensional
  R_specific: number;         // J/(kg·K)
  cp_mixture: number;         // J/(kg·K)
  
  // Termodinâmica
  T_adiabatic: number;        // K
  p_exit: number;             // Pa
  
  // Performance
  v_exhaust: number;          // m/s
  Isp: number;                // s
  thrust: number;             // N
  thrust_momentum: number;    // componente do momento
  thrust_pressure: number;    // componente da pressão
  
  // Estado
  state: SimulationState;
}

/**
 * Calcula a massa molecular efetiva da mistura
 */
export function calculateMolarMass(comp: PropellantComposition): number {
  // Normaliza frações molares do combustível
  const fuelTotal = comp.x_H2 + comp.x_He + (comp.x_CH4 || 0);
  const x_H2 = comp.x_H2 / fuelTotal;
  const x_He = comp.x_He / fuelTotal;
  const x_CH4 = (comp.x_CH4 || 0) / fuelTotal;
  
  // Calcula massas no lado combustível e oxidante
  const M_fuel = x_H2 * MOLAR_MASS.H2 + x_He * MOLAR_MASS.He + x_CH4 * MOLAR_MASS.CH4;
  
  // Converte O/F ratio (massa) para razão molar
  const fuel_mass = 1.0;
  const ox_mass = comp.O_F_ratio * fuel_mass;
  
  const fuel_moles = fuel_mass / M_fuel;
  const ox_moles = ox_mass / MOLAR_MASS.O2;
  const total_moles = fuel_moles + ox_moles;
  
  const x_fuel_total = fuel_moles / total_moles;
  const x_O2 = ox_moles / total_moles;
  
  return x_fuel_total * M_fuel + x_O2 * MOLAR_MASS.O2;
}

/**
 * Calcula γ (gamma) efetivo da mistura
 */
export function calculateGamma(comp: PropellantComposition): number {
  const fuelTotal = comp.x_H2 + comp.x_He + (comp.x_CH4 || 0);
  const x_H2 = comp.x_H2 / fuelTotal;
  const x_He = comp.x_He / fuelTotal;
  const x_CH4 = (comp.x_CH4 || 0) / fuelTotal;
  
  // Média ponderada por fração molar do lado combustível
  const gamma_fuel = x_H2 * GAMMA.H2 + x_He * GAMMA.He + x_CH4 * GAMMA.CH4;
  
  // Mix com oxidante (simplificado)
  const fuel_fraction = 1.0 / (1.0 + comp.O_F_ratio);
  const ox_fraction = 1.0 - fuel_fraction;
  
  return fuel_fraction * gamma_fuel + ox_fraction * GAMMA.O2;
}

/**
 * Calcula cp (calor específico) efetivo da mistura
 */
export function calculateCp(comp: PropellantComposition): number {
  const fuelTotal = comp.x_H2 + comp.x_He + (comp.x_CH4 || 0);
  const x_H2 = comp.x_H2 / fuelTotal;
  const x_He = comp.x_He / fuelTotal;
  const x_CH4 = (comp.x_CH4 || 0) / fuelTotal;
  
  const cp_fuel = x_H2 * CP.H2 + x_He * CP.He + x_CH4 * CP.CH4;
  
  const fuel_fraction = 1.0 / (1.0 + comp.O_F_ratio);
  const ox_fraction = 1.0 - fuel_fraction;
  
  return fuel_fraction * cp_fuel + ox_fraction * CP.O2;
}

/**
 * Calcula energia química liberada (normalizada)
 */
export function calculateEnergyRelease(comp: PropellantComposition): number {
  const fuelTotal = comp.x_H2 + comp.x_He + (comp.x_CH4 || 0);
  const x_H2 = comp.x_H2 / fuelTotal;
  const x_CH4 = (comp.x_CH4 || 0) / fuelTotal;
  
  // He não contribui com energia
  return x_H2 * ENERGY_RELEASE.H2 + x_CH4 * ENERGY_RELEASE.CH4;
}

/**
 * Calcula temperatura adiabática de chama
 */
export function calculateAdiabaticTemperature(
  comp: PropellantComposition,
  params: EngineParameters
): number {
  const E_chem = calculateEnergyRelease(comp);
  const cp = calculateCp(comp);
  
  // Efeito de diluição do hélio
  const alpha_He = comp.x_He * (1.0 - params.He_role * 0.3); // He_role reduz diluição
  
  // Ganho teórico de quantum_excitation
  const kappa = 0.5; // coeficiente máximo de ganho
  const quantum_boost = 1.0 + kappa * params.quantum_excitation;
  
  // Temperatura base (3000K para H2/O2 ideal)
  const T_base = 3000;
  
  return params.T0 + (T_base * E_chem * quantum_boost) / (1.0 + alpha_He);
}

/**
 * Calcula pressão de saída usando relação isentrópica
 */
export function calculateExitPressure(
  p_chamber: number,
  expansion_ratio: number,
  gamma: number
): number {
  // Relação isentrópica: p_e/p_0 = (1 + ((γ-1)/2) * M²)^(-γ/(γ-1))
  // Aproximação via razão de área para escoamento supersônico
  
  // Para simplificar, usamos relação empírica inversa
  const exponent = -gamma / (gamma - 1);
  const pressure_ratio = Math.pow(1.0 / expansion_ratio, gamma);
  
  return p_chamber * pressure_ratio;
}

/**
 * Calcula velocidade de escape do jato
 */
export function calculateExhaustVelocity(
  T_chamber: number,
  p_chamber: number,
  p_exit: number,
  gamma: number,
  R_specific: number
): number {
  const pressure_ratio = p_exit / p_chamber;
  const exponent = (gamma - 1) / gamma;
  
  const term = 1.0 - Math.pow(pressure_ratio, exponent);
  
  return Math.sqrt((2 * gamma / (gamma - 1)) * R_specific * T_chamber * term);
}

/**
 * Calcula impulso específico (Isp)
 */
export function calculateIsp(v_exhaust: number): number {
  return v_exhaust / G0;
}

/**
 * Calcula empuxo total
 */
export function calculateThrust(
  mass_flow: number,
  v_exhaust: number,
  p_exit: number,
  p_ambient: number,
  A_exit: number
): { total: number; momentum: number; pressure: number } {
  const momentum = mass_flow * v_exhaust;
  const pressure = (p_exit - p_ambient) * A_exit;
  
  return {
    total: momentum + pressure,
    momentum,
    pressure
  };
}

/**
 * Calcula área de saída do bocal
 */
export function calculateExitArea(
  A_throat: number,
  expansion_ratio: number
): number {
  return A_throat * expansion_ratio;
}

/**
 * Executa um passo da simulação
 */
export function simulateStep(
  comp: PropellantComposition,
  params: EngineParameters,
  state: SimulationState,
  dt: number,
  A_throat: number = 0.01 // m² (área da garganta, padrão para demo)
): SimulationResults {
  // 1. Propriedades da mistura
  const M_mixture = calculateMolarMass(comp);
  const gamma_mixture = calculateGamma(comp);
  const R_specific = (R_UNIVERSAL / M_mixture) * 1000; // J/(kg·K)
  const cp_mixture = calculateCp(comp);
  
  // 2. Termodinâmica
  const T_adiabatic = calculateAdiabaticTemperature(comp, params);
  const p_exit = calculateExitPressure(params.p_chamber, params.expansion_ratio, gamma_mixture);
  
  // 3. Velocidade e Isp
  const v_exhaust = calculateExhaustVelocity(
    T_adiabatic,
    params.p_chamber,
    p_exit,
    gamma_mixture,
    R_specific
  );
  const Isp = calculateIsp(v_exhaust);
  
  // 4. Empuxo
  const A_exit = calculateExitArea(A_throat, params.expansion_ratio);
  const thrust = calculateThrust(
    params.mass_flow_rate,
    v_exhaust,
    p_exit,
    params.p_ambient,
    A_exit
  );
  
  // 5. Atualização de estado (integração simples de Euler)
  const new_mass = Math.max(0, state.mass - params.mass_flow_rate * dt);
  const acceleration = new_mass > 0 ? thrust.total / new_mass : 0;
  const new_velocity = state.velocity + acceleration * dt;
  const new_position = state.position + state.velocity * dt + 0.5 * acceleration * dt * dt;
  
  return {
    M_mixture,
    gamma_mixture,
    R_specific,
    cp_mixture,
    T_adiabatic,
    p_exit,
    v_exhaust,
    Isp,
    thrust: thrust.total,
    thrust_momentum: thrust.momentum,
    thrust_pressure: thrust.pressure,
    state: {
      time: state.time + dt,
      mass: new_mass,
      velocity: new_velocity,
      position: new_position
    }
  };
}

/**
 * Presets de configuração
 */
export const PRESETS = {
  'H2/O2 Ideal': {
    composition: { x_H2: 1.0, x_He: 0.0, O_F_ratio: 6.0 },
    params: { quantum_excitation: 0, He_role: 0 }
  },
  'H2+He/O2 Experimental': {
    composition: { x_H2: 0.7, x_He: 0.3, O_F_ratio: 6.0 },
    params: { quantum_excitation: 0.3, He_role: 0.5 }
  },
  'CH4/O2 Referência': {
    composition: { x_H2: 0.0, x_He: 0.0, x_CH4: 1.0, O_F_ratio: 3.5 },
    params: { quantum_excitation: 0, He_role: 0 }
  },
  'H2+He Quantum': {
    composition: { x_H2: 0.8, x_He: 0.2, O_F_ratio: 6.5 },
    params: { quantum_excitation: 0.8, He_role: 0.8 }
  }
} as const;

