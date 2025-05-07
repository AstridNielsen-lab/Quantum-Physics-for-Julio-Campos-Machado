import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Thermometer, Zap, Atom, Layers, Bot, Settings, Play, Pause, RotateCcw, Target, MessageSquare, Send, Blend, Clock, Milestone, Lightbulb, Rocket, MapPin } from 'lucide-react';
import AdiabaticCompressionInfo from './AdiabaticCompressionInfo';
import QuantumThermalChallenges from './QuantumThermalChallenges';
import ThermalMeshApplication from './ThermalMeshApplication';
import ShipVisualization from './ShipVisualization';
import AIControlInterface from '../components/AIControlInterface';
import { useAIStore } from '../stores/aiStore';

// --- Interfaces --- 
interface ThermalPoint { x: number; y: number; layer: number; temperature: number; efficiencyFactor: number; powerGenerated: number; }
interface MaterialProperties { name: string; S_eff: number; ZT: number; sigma: number; k: number; color: string; }
interface ChatMessage { sender: 'user' | 'ai'; text: string; }
interface Destination { name: string; distanceLY: number; }
interface ControlCommand { action: string; component: string; value?: any; }
interface ControlPanel { name: string; value: number; min: number; max: number; step: number; unit: string; enabled: boolean; }

// --- Materials Data --- 
const materials: Record<string, MaterialProperties> = {
  bismuth_telluride: { name: 'Telureto de Bismuto (Bi2Te3)', S_eff: 200e-6, ZT: 1.0, sigma: 1.0e5, k: 1.5, color: '#a855f7' },
  selenide_tin: { name: 'Seleneto de Estanho (SnSe)', S_eff: 300e-6, ZT: 1.2, sigma: 0.8e5, k: 1.2, color: '#f97316' },
  skutterudite: { name: 'Skutterudite (CoSb3 based)', S_eff: 250e-6, ZT: 1.4, sigma: 1.2e5, k: 1.8, color: '#22c55e' },
  default_material: { name: 'Material Padrão', S_eff: 100e-6, ZT: 0.8, sigma: 0.5e5, k: 2.0, color: '#888888' }
};
type MaterialKey = keyof typeof materials;

// --- Destinations --- 
const destinations: Record<string, Destination> = {
  none: { name: 'Nenhum (Exploração Livre)', distanceLY: Infinity },
  proxima_centauri: { name: 'Proxima Centauri', distanceLY: 4.25 },
  barnard_star: { name: 'Estrela de Barnard', distanceLY: 5.96 },
  sirius: { name: 'Sirius', distanceLY: 8.61 },
  tau_ceti: { name: 'Tau Ceti', distanceLY: 11.91 },
};
type DestinationKey = keyof typeof destinations;

// --- Constants --- 
const MESH_WIDTH = 500, MESH_HEIGHT = 300, GRID_SIZE = 20, NUM_LAYERS = 5;
const ROWS_PER_LAYER = Math.floor((MESH_HEIGHT / GRID_SIZE) / NUM_LAYERS);
const TOTAL_ROWS = ROWS_PER_LAYER * NUM_LAYERS, COLS = Math.floor(MESH_WIDTH / GRID_SIZE);
const INITIAL_INTERNAL_TEMP = 293.15, TARGET_INTERNAL_TEMP = 301.15;
const HEAT_TRANSFER_COEFFICIENT = 0.05, INTER_LAYER_HEAT_TRANSFER_COEFFICIENT = 0.1;
const TIME_STEP = 0.1, RENDER_INTERVAL_MS = 100;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

// --- Physics & Travel Constants ---
const SPEED_OF_LIGHT = 299792458;
const SECONDS_PER_YEAR = 31557600;
const METERS_PER_LIGHT_YEAR = SPEED_OF_LIGHT * SECONDS_PER_YEAR;
const MAX_SPEED_FRACTION = 0.0825;
const MAX_SPEED = MAX_SPEED_FRACTION * SPEED_OF_LIGHT;

// --- Temperature Constants ---
const COSMIC_BACKGROUND_TEMP = 3;
const MAX_EXTERNAL_TEMP = 50;

// --- Sound Effects ---
const playBeep = (frequency: number, duration: number) => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration/1000);
  oscillator.stop(audioCtx.currentTime + duration/1000);
};

const playStatusSound = () => {
  playBeep(800, 100);
  setTimeout(() => playBeep(1000, 100), 150);
};

const playAlertSound = () => {
  playBeep(1200, 200);
  setTimeout(() => playBeep(800, 200), 300);
};

// --- Fibonacci Sequence Generator ---
function* fibonacciGenerator() {
  let a = 0, b = 1;
  while (true) {
    yield b;
    [a, b] = [b, a + b];
  }
}

const ThermalMeshPage: React.FC = () => {
  // --- State --- 
  const [meshState, setMeshState] = useState<ThermalPoint[][]>([]);
  const [externalTemp, setExternalTemp] = useState(COSMIC_BACKGROUND_TEMP);
  const [selectedMaterial1, setSelectedMaterial1] = useState<MaterialKey>('bismuth_telluride');
  const [selectedMaterial2, setSelectedMaterial2] = useState<MaterialKey>('selenide_tin');
  const [materialMixRatio, setMaterialMixRatio] = useState(0.5);
  const [isRunning, setIsRunning] = useState(false);
  const [totalPower, setTotalPower] = useState(0);
  const [averageInnerTemp, setAverageInnerTemp] = useState(INITIAL_INTERNAL_TEMP);
  const [simulationTime, setSimulationTime] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [fibonacciIndex, setFibonacciIndex] = useState(0);
  const [currentFibValue, setCurrentFibValue] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<DestinationKey>('none');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [autoAdjustEnabled, setAutoAdjustEnabled] = useState(true);
  const [lastStatusReport, setLastStatusReport] = useState(0);
  
  // Controles do sistema
  const [systemComponents, setSystemComponents] = useState({
    propulsion: true,
    thermalControl: true,
    powerGeneration: true,
    navigation: true,
    lifeSupport: true
  });

  // Painéis de controle
  const [controlPanels, setControlPanels] = useState<Record<string, ControlPanel>>({
    propulsionPower: {
      name: "Potência de Propulsão",
      value: 0.75,
      min: 0,
      max: 1,
      step: 0.01,
      unit: "%",
      enabled: true
    },
    thermalControlPower: {
      name: "Potência de Controle Térmico",
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.01,
      unit: "%",
      enabled: true
    },
    powerGenerationEfficiency: {
      name: "Eficiência de Geração",
      value: 0.9,
      min: 0.5,
      max: 1,
      step: 0.01,
      unit: "%",
      enabled: true
    },
    lifeSupportPower: {
      name: "Potência de Suporte Vital",
      value: 0.7,
      min: 0,
      max: 1,
      step: 0.01,
      unit: "%",
      enabled: true
    }
  });

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fibGenRef = useRef(fibonacciGenerator());
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

 
  // --- Helper Functions --- 
  const getEffectiveMaterialProps = (matKey1: MaterialKey, matKey2: MaterialKey, mixRatio: number): MaterialProperties => {
    if (matKey1 === matKey2) return materials[matKey1];
    const p1 = materials[matKey1], p2 = materials[matKey2];
    return { 
      name: `Mistura (${(mixRatio * 100).toFixed(0)}% ${p1.name} / ${((1 - mixRatio) * 100).toFixed(0)}% ${p2.name})`, 
      S_eff: p1.S_eff * mixRatio + p2.S_eff * (1 - mixRatio), 
      ZT: p1.ZT * mixRatio + p2.ZT * (1 - mixRatio), 
      sigma: p1.sigma * mixRatio + p2.sigma * (1 - mixRatio), 
      k: p1.k * mixRatio + p2.k * (1 - mixRatio), 
      color: mixColors(p1.color, p2.color, mixRatio) 
    };
  };

  const effectiveMaterial = getEffectiveMaterialProps(selectedMaterial1, selectedMaterial2, materialMixRatio);
  const targetDistanceMeters = destinations[selectedDestination].distanceLY * METERS_PER_LIGHT_YEAR;


  const mixColors = (c1: string, c2: string, r: number): string => {
    try { 
      const v1 = parseInt(c1.slice(1), 16), v2 = parseInt(c2.slice(1), 16); 
      const r1 = (v1 >> 16) & 255, g1 = (v1 >> 8) & 255, b1 = v1 & 255; 
      const r2 = (v2 >> 16) & 255, g2 = (v2 >> 8) & 255, b2 = v2 & 255; 
      const nr = Math.round(r1 * r + r2 * (1 - r)), ng = Math.round(g1 * r + g2 * (1 - r)), nb = Math.round(b1 * r + b2 * (1 - r)); 
      return `#${(1 << 24 | nr << 16 | ng << 8 | nb).toString(16).slice(1).padStart(6, '0')}`; 
    } catch (e) { return '#888888'; } 
  };

  const formatTime = (s: number): string => { 
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60); 
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`; 
  };

  // --- Text-to-Speech Function ---
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Update Control Function ---
  const updateControl = (controlName: string, newValue: number | boolean) => {
    setControlPanels(prev => {
      if (typeof newValue === 'boolean') {
        return {
          ...prev,
          [controlName]: {
            ...prev[controlName],
            enabled: newValue
          }
        };
      } else {
        return {
          ...prev,
          [controlName]: {
            ...prev[controlName],
            value: newValue
          }
        };
      }
    });
    playBeep(800, 50);
  };

  // --- Control Functions for AI ---
  const executeControlCommand = (command: ControlCommand) => {
    let success = false;
    let message = '';
    
    try {
      switch (command.component.toLowerCase()) {
        case 'propulsion':
          if (command.action === 'toggle') {
            const newState = !systemComponents.propulsion;
            setSystemComponents(prev => ({ ...prev, propulsion: newState }));
            message = `Propulsão ${newState ? 'ativada' : 'desativada'}`;
            success = true;
          }
          break;
          
        case 'thermalcontrol':
        case 'controle térmico':
          if (command.action === 'toggle') {
            const newState = !systemComponents.thermalControl;
            setSystemComponents(prev => ({ ...prev, thermalControl: newState }));
            message = `Controle térmico ${newState ? 'ativado' : 'desativado'}`;
            success = true;
          }
          break;
          
        case 'powergeneration':
        case 'geração de energia':
          if (command.action === 'toggle') {
            const newState = !systemComponents.powerGeneration;
            setSystemComponents(prev => ({ ...prev, powerGeneration: newState }));
            message = `Geração de energia ${newState ? 'ativada' : 'desativada'}`;
            success = true;
          }
          break;
          
        case 'navigation':
        case 'navegação':
          if (command.action === 'toggle') {
            const newState = !systemComponents.navigation;
            setSystemComponents(prev => ({ ...prev, navigation: newState }));
            message = `Sistema de navegação ${newState ? 'ativado' : 'desativado'}`;
            success = true;
          }
          break;
          
        case 'lifesupport':
        case 'suporte vital':
          if (command.action === 'toggle') {
            const newState = !systemComponents.lifeSupport;
            setSystemComponents(prev => ({ ...prev, lifeSupport: newState }));
            message = `Suporte vital ${newState ? 'ativado' : 'desativado'}`;
            success = true;
          }
          break;
          
        case 'simulation':
        case 'simulação':
          if (command.action === 'start') {
            setIsRunning(true);
            message = 'Simulação iniciada';
            success = true;
          } else if (command.action === 'stop') {
            setIsRunning(false);
            message = 'Simulação pausada';
            success = true;
          } else if (command.action === 'reset') {
            initializeMesh();
            message = 'Simulação reiniciada';
            success = true;
          }
          break;
          
        case 'material':
          if (command.action === 'set' && command.value) {
            const [mat1, mat2, ratio] = command.value.split(',');
            if (materials[mat1 as MaterialKey] && materials[mat2 as MaterialKey]) {
              setSelectedMaterial1(mat1 as MaterialKey);
              setSelectedMaterial2(mat2 as MaterialKey);
              setMaterialMixRatio(parseFloat(ratio));
              message = `Material alterado para mistura de ${mat1} e ${mat2} (${ratio})`;
              success = true;
            }
          }
          break;
          
        case 'destination':
        case 'destino':
          if (command.action === 'set' && command.value && destinations[command.value as DestinationKey]) {
            setSelectedDestination(command.value as DestinationKey);
            message = `Destino alterado para ${destinations[command.value as DestinationKey].name}`;
            success = true;
          }
          break;
          
        case 'autoadjust':
        case 'auto-regulação':
          if (command.action === 'toggle') {
            const newState = !autoAdjustEnabled;
            setAutoAdjustEnabled(newState);
            message = `Auto-regulação ${newState ? 'ativada' : 'desativada'}`;
            success = true;
          }
          break;
          
        case 'control':
        case 'controle':
          if (command.action === 'set' && command.value) {
            const [controlName, value] = command.value.split(':');
            if (controlPanels[controlName as keyof typeof controlPanels]) {
              updateControl(controlName, parseFloat(value));
              message = `${controlPanels[controlName as keyof typeof controlPanels].name} ajustado para ${value}`;
              success = true;
            }
          } else if (command.action === 'toggle' && command.value) {
            const controlName = command.value;
            if (controlPanels[controlName as keyof typeof controlPanels]) {
              const newState = !controlPanels[controlName as keyof typeof controlPanels].enabled;
              updateControl(controlName, newState);
              message = `${controlPanels[controlName as keyof typeof controlPanels].name} ${newState ? 'ativado' : 'desativado'}`;
              success = true;
            }
          }
          break;
          
        default:
          message = `Componente '${command.component}' não reconhecido`;
      }
    } catch (error) {
      message = `Erro ao executar comando: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    return { success, message };
  };

  // --- Parse AI Commands ---
  const parseAICommands = (text: string): { response: string; commands: ControlCommand[] } => {
    const commandRegex = /\[COMMAND:(.*?)\]/g;
    const commands: ControlCommand[] = [];
    let response = text;
    
    let match;
    while ((match = commandRegex.exec(text)) !== null) {
      try {
        const commandStr = match[1].trim();
        const [action, component, ...valueParts] = commandStr.split(':');
        const value = valueParts.join(':').trim();
        
        commands.push({
          action: action.toLowerCase(),
          component: component.toLowerCase(),
          value: value || undefined
        });
        
        // Remove the command from the response
        response = response.replace(match[0], '');
      } catch (error) {
        console.error('Error parsing command:', error);
      }
    }
    
    return { response, commands };
  };

  // --- Auto-adjust Temperature Function ---
  const autoAdjustTemperature = useCallback(() => {
    if (!autoAdjustEnabled || !systemComponents.thermalControl) return;

    const tempDiff = averageInnerTemp - TARGET_INTERNAL_TEMP;
    const absDiff = Math.abs(tempDiff);
    
    if (absDiff > 2) {
      const adjustmentFactor = 0.1 * controlPanels.thermalControlPower.value;
      const newMixRatio = Math.max(0, Math.min(1, 
        materialMixRatio - (tempDiff * adjustmentFactor * 0.01)
      ));
      
      setMaterialMixRatio(parseFloat(newMixRatio.toFixed(2)));
      playBeep(600, 50);
    }
  }, [averageInnerTemp, autoAdjustEnabled, materialMixRatio, systemComponents.thermalControl, controlPanels.thermalControlPower.value]);

  // --- Status Report Function ---
  const generateStatusReport = useCallback(() => {
    if (!systemComponents.navigation) return;

    const distanceLY = distanceTraveled / METERS_PER_LIGHT_YEAR;
    const velocityFractionC = currentVelocity / SPEED_OF_LIGHT;
    
    const statusMessage = `Relatório de Status: Velocidade atual ${velocityFractionC.toFixed(4)} da velocidade da luz. ` +
      `Temperatura interna ${averageInnerTemp.toFixed(1)} Kelvin. ` +
      `Potência gerada ${totalPower.toFixed(2)} Watts. ` +
      (selectedDestination !== 'none' 
        ? `Rumo a ${destinations[selectedDestination].name}, distância restante ${(destinations[selectedDestination].distanceLY - distanceLY).toFixed(2)} anos-luz.`
        : `Exploração livre em curso.`);
    
    setChatMessages(prev => [...prev, { 
      sender: 'ai', 
      text: `**Relatório Automático**\n${statusMessage.replace(/\. /g, '.\n')}`
    }]);
    
    speak(statusMessage);
    playStatusSound();
    setLastStatusReport(simulationTime);
  }, [distanceTraveled, currentVelocity, averageInnerTemp, totalPower, selectedDestination, simulationTime, systemComponents.navigation]);

  // --- Initialization --- 
  const initializeMesh = useCallback(() => {
    const initialMesh: ThermalPoint[][] = Array.from({ length: TOTAL_ROWS }, (_, i) => 
      Array.from({ length: COLS }, (_, j) => ({
        x: j * GRID_SIZE, y: i * GRID_SIZE, layer: Math.floor(i / ROWS_PER_LAYER),
        temperature: INITIAL_INTERNAL_TEMP, efficiencyFactor: 0, powerGenerated: 0
      }))
    );
    setMeshState(initialMesh); 
    setTotalPower(0); 
    setAverageInnerTemp(INITIAL_INTERNAL_TEMP);
    setSimulationTime(0); 
    setDistanceTraveled(0); 
    setCurrentVelocity(0);
    setExternalTemp(COSMIC_BACKGROUND_TEMP);
    setFibonacciIndex(0); 
    setCurrentFibValue(1);
    setLastStatusReport(0);
    fibGenRef.current = fibonacciGenerator();
  }, []);

  useEffect(() => { initializeMesh(); }, [initializeMesh]);

  // --- Simulation Logic --- 
  const runSimulationStep = useCallback(() => {
    if (!systemComponents.propulsion && !systemComponents.powerGeneration) return;

    const newSimTime = simulationTime + TIME_STEP;
    setSimulationTime(newSimTime);

    if (Math.floor(newSimTime) % 60 === 0 && Math.floor(newSimTime) !== Math.floor(lastStatusReport)) {
      generateStatusReport();
    }

    // --- Fibonacci Velocity & Distance Calculation --- 
    let calculatedVelocity = currentVelocity;
    let calculatedDistance = distanceTraveled;
    let nextFibIndex = fibonacciIndex;
    let nextFibValue = currentFibValue;

    const isAccelerating = systemComponents.propulsion;

    if (isAccelerating && calculatedVelocity < MAX_SPEED) {
        const baseIncrease = MAX_SPEED / 10000 * TIME_STEP;
        const velocityIncrease = nextFibValue * baseIncrease * 
          (systemComponents.propulsion ? controlPanels.propulsionPower.value : 0);
        calculatedVelocity = Math.min(MAX_SPEED, calculatedVelocity + velocityIncrease);
        
        nextFibIndex++;
        nextFibValue = fibGenRef.current.next().value as number;
        setCurrentFibValue(nextFibValue);
        setFibonacciIndex(nextFibIndex);
    } else if (!isAccelerating && calculatedVelocity > 0) {
        calculatedVelocity = Math.max(0, calculatedVelocity - (MAX_SPEED / 5000) * TIME_STEP);
    }

    const avgVelocity = (currentVelocity + calculatedVelocity) / 2;
    calculatedDistance += avgVelocity * TIME_STEP;

    if (selectedDestination !== 'none' && calculatedDistance >= targetDistanceMeters) {
        calculatedDistance = targetDistanceMeters;
        calculatedVelocity = 0;
        setIsRunning(false);
        playAlertSound();
        speak(`Destino ${destinations[selectedDestination].name} alcançado. Nave parada.`);
    }

    const calculatedExternalTemp = COSMIC_BACKGROUND_TEMP + 
        (MAX_EXTERNAL_TEMP - COSMIC_BACKGROUND_TEMP) * 
        Math.pow(calculatedVelocity / MAX_SPEED, 2);
    setExternalTemp(calculatedExternalTemp);

    setDistanceTraveled(calculatedDistance);
    setCurrentVelocity(calculatedVelocity);

    // --- Thermal Mesh Update ---
    setMeshState(prevMesh => {
      if (!prevMesh?.[0] || !systemComponents.powerGeneration) return prevMesh;
      
      const newMesh = JSON.parse(JSON.stringify(prevMesh));
      let currentTotalPower = 0, innerLayerTempSum = 0, innerLayerCount = 0;
      const matProps = effectiveMaterial;
      
      for (let i = 0; i < TOTAL_ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const p = newMesh[i][j], T = p.temperature, l = p.layer;
          let dT_intra = 0, dT_inter = 0, dT_ext = 0;
          
          const T_l = j > 0 ? newMesh[i][j - 1].temperature : T;
          const T_r = j < COLS - 1 ? newMesh[i][j + 1].temperature : T;
          dT_intra = (T_l + T_r - 2 * T);
          
          const T_u = i > 0 ? newMesh[i - 1][j].temperature : T;
          const T_d = i < TOTAL_ROWS - 1 ? newMesh[i + 1][j].temperature : T;
          dT_inter = (T_u + T_d - 2 * T);
          
          if (l === 0 && systemComponents.thermalControl) {
            dT_ext = (calculatedExternalTemp - T) * controlPanels.thermalControlPower.value;
          }
          
          const dT = (matProps.k * (dT_intra * HEAT_TRANSFER_COEFFICIENT + dT_inter * INTER_LAYER_HEAT_TRANSFER_COEFFICIENT) + 
                     dT_ext * HEAT_TRANSFER_COEFFICIENT * (l === 0 ? 1 : 0)) * TIME_STEP;
          p.temperature += dT;
          
          const dP = Math.max(0, p.temperature - INITIAL_INTERNAL_TEMP);
          const power = Math.pow(matProps.S_eff, 2) * matProps.sigma * dP * 1e-3 * 
            (systemComponents.powerGeneration ? controlPanels.powerGenerationEfficiency.value : 0);
          p.powerGenerated = power; 
          p.efficiencyFactor = matProps.ZT; 
          currentTotalPower += power;
          
          if (l === NUM_LAYERS - 1) { 
            innerLayerTempSum += p.temperature; 
            innerLayerCount++; 
          }
        }
      }
      
      setTotalPower(currentTotalPower);
      if (innerLayerCount > 0) setAverageInnerTemp(innerLayerTempSum / innerLayerCount);
      
      autoAdjustTemperature();
      
      return newMesh;
    });
  }, [
    simulationTime, effectiveMaterial, currentVelocity, distanceTraveled, 
    fibonacciIndex, currentFibValue, selectedDestination, targetDistanceMeters, 
    autoAdjustTemperature, lastStatusReport, generateStatusReport, systemComponents,
    controlPanels.propulsionPower.value, controlPanels.thermalControlPower.value,
    controlPanels.powerGenerationEfficiency.value
  ]);

  // --- Simulation Control --- 
  useEffect(() => {
    if (isRunning && (systemComponents.propulsion || systemComponents.powerGeneration)) {
      simulationIntervalRef.current = setInterval(runSimulationStep, RENDER_INTERVAL_MS);
    } else {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    }
    return () => { 
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [isRunning, runSimulationStep, systemComponents]);

  // --- Clean up speech synthesis on unmount ---
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // --- Drawing Logic --- 
  useEffect(() => {
    const canvas = canvasRef.current; 
    if (!canvas || !meshState[0]) return; 
    
    const ctx = canvas.getContext('2d'); 
    if (!ctx) return;
    
    const logH = TOTAL_ROWS * GRID_SIZE; 
    if (canvas.height !== logH) canvas.height = logH; 
    if (canvas.width !== MESH_WIDTH) canvas.width = MESH_WIDTH;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxT = Math.max(externalTemp, INITIAL_INTERNAL_TEMP + 100), 
          minT = Math.min(INITIAL_INTERNAL_TEMP, TARGET_INTERNAL_TEMP - 20);
    
    for (let i = 0; i < TOTAL_ROWS; i++) {
      for (let j = 0; j < COLS; j++) { 
        if (!meshState[i]?.[j]) continue; 
        
        const p = meshState[i][j];
        const tR = Math.max(0, Math.min(1, (p.temperature - minT) / (maxT - minT)));
        const r = Math.round(255 * tR);
        const b = Math.round(255 * (1 - tR));
        
        ctx.fillStyle = `rgb(${r}, 0, ${b})`; 
        ctx.fillRect(p.x, p.y, GRID_SIZE, GRID_SIZE); 
      }
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; 
    ctx.lineWidth = 1;
    
    for (let l = 1; l < NUM_LAYERS; l++) { 
      const y = l * ROWS_PER_LAYER * GRID_SIZE; 
      ctx.beginPath(); 
      ctx.moveTo(0, y); 
      ctx.lineTo(MESH_WIDTH, y); 
      ctx.stroke(); 
    }
  }, [meshState, externalTemp]);

  // --- Control Slider Component ---
  const ControlSlider: React.FC<{
    control: ControlPanel;
    controlName: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ control, controlName, icon, color }) => (
    <div className="mb-4 p-3 bg-gray-750 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <label className="flex items-center text-sm font-medium text-gray-300">
          {icon}
          <span className="ml-2">{control.name}</span>
        </label>
        <button
          onClick={() => updateControl(controlName, !control.enabled)}
          className={`px-2 py-1 rounded text-xs font-semibold ${
            control.enabled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {control.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="flex items-center">
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={control.value}
          onChange={(e) => updateControl(controlName, parseFloat(e.target.value))}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${color}`}
          disabled={!control.enabled}
        />
        <span className="ml-2 text-xs font-mono w-12 text-right">
          {(control.value * 100).toFixed(0)}
          {control.unit}
        </span>
      </div>
    </div>
  );

  // --- Event Handlers --- 
  const handleMaterial1Change = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMaterial1(e.target.value as MaterialKey);
  const handleMaterial2Change = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMaterial2(e.target.value as MaterialKey);
  const handleMixRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaterialMixRatio(Number(e.target.value));
  const handleDestinationChange = (destKey: DestinationKey) => setSelectedDestination(destKey);
  
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    playBeep(800, 100);
  };
  
  const resetSimulation = () => { 
    setIsRunning(false); 
    initializeMesh();
    playBeep(600, 200);
  };
  
  const toggleAutoAdjust = () => {
    setAutoAdjustEnabled(!autoAdjustEnabled);
    playBeep(autoAdjustEnabled ? 500 : 700, 100);
  };

  const toggleComponent = (component: keyof typeof systemComponents) => {
    setSystemComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
    playBeep(systemComponents[component] ? 500 : 700, 100);
  };

  // --- AI Chat Logic --- 
  const handleChatSend = async () => {
    if (!chatInput.trim() || isAiThinking) return;
    
    playBeep(1200, 50);
    const userMsg: ChatMessage = { sender: 'user', text: chatInput }; 
    setChatMessages(prev => [...prev, userMsg]); 
    setChatInput(''); 
    setIsAiThinking(true);
    
    const distanceLY = distanceTraveled / METERS_PER_LIGHT_YEAR;
    const velocityFractionC = currentVelocity / SPEED_OF_LIGHT;
    const targetInfo = selectedDestination === 'none' ? 'Exploração livre.' : `Destino: ${destinations[selectedDestination].name} (${destinations[selectedDestination].distanceLY.toFixed(2)} anos-luz).`;
    
    const componentsStatus = Object.entries(systemComponents)
      .map(([key, value]) => `${key}: ${value ? 'ON' : 'OFF'}`)
      .join(', ');
    
    const controlsStatus = Object.entries(controlPanels)
      .map(([key, panel]) => `${key}: ${panel.enabled ? 'ON' : 'OFF'} (${(panel.value * 100).toFixed(0)}%)`)
      .join(', ');
    
    const context = `Contexto: IA assistente numa simulação de Malha Antitérmica para uma espaçonave quântica interestelar. 
      Tempo: ${formatTime(simulationTime)} (${(simulationTime / SECONDS_PER_YEAR).toFixed(2)} anos). 
      Distância: ${distanceLY.toExponential(3)} anos-luz. 
      Velocidade: ${velocityFractionC.toFixed(4)}c (${(currentVelocity / 1000).toFixed(0)} km/s). 
      ${targetInfo} 
      ${NUM_LAYERS} camadas de ${effectiveMaterial.name} expostas a ${externalTemp}K. 
      Objetivo: converter calor (Seebeck) e manter temp. interna (camada ${NUM_LAYERS - 1}) próxima de ${TARGET_INTERNAL_TEMP.toFixed(1)}K (${(TARGET_INTERNAL_TEMP - 273.15).toFixed(1)}°C). 
      Temp. interna atual: ${averageInnerTemp.toFixed(1)}K (${(averageInnerTemp - 273.15).toFixed(1)}°C). 
      Potência: ${totalPower.toFixed(4)}W. 
      Props: S_eff=${effectiveMaterial.S_eff.toExponential(2)} V/K, ZT=${effectiveMaterial.ZT.toFixed(2)}, σ=${effectiveMaterial.sigma.toExponential(2)} S/m, k=${effectiveMaterial.k.toFixed(2)} W/mK.
      Status dos Componentes: ${componentsStatus}.
      Status dos Controles: ${controlsStatus}.
      
      Você pode controlar completamente a nave usando comandos especiais no formato [COMMAND:action:component:value]. 
      Ações disponíveis: toggle, start, stop, set, reset.
      Componentes disponíveis: propulsion, thermalControl, powerGeneration, navigation, lifeSupport, simulation, material, destination, autoadjust, control.
      Controles disponíveis: propulsionPower, thermalControlPower, powerGenerationEfficiency, lifeSupportPower.
      Exemplos: 
      - [COMMAND:toggle:propulsion] (alterna estado da propulsão)
      - [COMMAND:set:material:bismuth_telluride,selenide_tin,0.7] (define mistura de materiais)
      - [COMMAND:set:destination:proxima_centauri] (define novo destino)
      - [COMMAND:toggle:autoadjust] (alterna auto-regulação)
      - [COMMAND:set:control:propulsionPower:0.85] (ajusta potência de propulsão para 85%)
      - [COMMAND:toggle:control:thermalControlPower] (alterna controle térmico)
      
      Sempre responda de forma concisa e técnica, como um sistema de IA de controle de nave espacial. 
      Inclua comandos entre colchetes quando necessário para executar ações.`;
    
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ 
              text: context + "\n\nPergunta: " + userMsg.text
            }] 
          }] 
        }) 
      });
      
      if (!response.ok) { 
        const err = await response.json(); 
        throw new Error(err?.error?.message || `API fail: ${response.status}`); 
      }
      
      const data = await response.json(); 
      let aiText = 'Não consegui processar.';
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback?.blockReason) {
        aiText = `Bloqueado: ${data.promptFeedback.blockReason}`;
      }
      
      // Parse commands from AI response
      const { response: cleanResponse, commands } = parseAICommands(aiText);
      let executedCommandsInfo = '';
      
      // Execute each command
      for (const command of commands) {
        const { success, message } = executeControlCommand(command);
        if (success) {
          executedCommandsInfo += `\n[Executado: ${message}]`;
          playBeep(1000, 50);
        }
      }
      
      const finalResponse = cleanResponse + (executedCommandsInfo ? `\n\n${executedCommandsInfo}` : '');
      const aiMsg: ChatMessage = { sender: 'ai', text: finalResponse };
      
      setChatMessages(prev => [...prev, aiMsg]);
      speak(finalResponse);
      
    } catch (error) { 
      console.error('AI Error:', error); 
      const errorMsg: ChatMessage = { sender: 'ai', text: `Erro IA: ${error instanceof Error ? error.message : String(error)}` };
      setChatMessages(prev => [...prev, errorMsg]);
      speak("Ocorreu um erro ao processar sua solicitação.");
    } finally { 
      setIsAiThinking(false);
      playBeep(1000, 100);
    }
  };
  
  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [chatMessages]);

  // --- Calculate derived values for rendering ---
  const distanceLightYears = distanceTraveled / METERS_PER_LIGHT_YEAR;
  const velocityFractionC = currentVelocity / SPEED_OF_LIGHT;

  // --- Render --- 
  return (
    <div className="p-4 bg-gray-900 text-gray-100 min-h-screen flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Simulation & Controls */}
      <div className="flex flex-col items-center w-full lg:w-auto flex-shrink-0">
        <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Gestão Térmica Quântica</h1>
        <p className="text-sm text-gray-400 mb-4 text-center">Simulação de Malha Antitérmica para Espaçonave Interestelar</p>
        
        {/* Ship Visualization Component */}
        <div className="mb-6 w-full max-w-xl">
          <ShipVisualization 
            velocityFractionC={velocityFractionC} 
            distanceLightYears={distanceLightYears} 
          />
        </div>

        {/* Thermal Mesh Canvas */}
        <div className="bg-gray-800 p-1 rounded-lg shadow-lg inline-block border-2 border-gray-700 mb-6">
          <canvas ref={canvasRef} width={MESH_WIDTH} height={TOTAL_ROWS * GRID_SIZE} className="rounded" style={{ maxHeight: '40vh', width: 'auto', display: 'block' }} />
        </div>

        {/* Controls & Status Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Existing controls */}
            <AIControlInterface />
          </div>
          
          {/* Rest of the existing layout */}
        </div>

        {/* Controls & Status Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-6 w-full max-w-4xl">
          {/* Controls Card */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full md:w-auto flex-grow">
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 flex items-center"><Settings className="mr-2 h-5 w-5"/>Controles da Simulação</h2>
            <div className="space-y-4">
              {/* System Components Toggle */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(systemComponents).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => toggleComponent(key as keyof typeof systemComponents)}
                    className={`px-3 py-2 rounded text-sm font-semibold flex items-center justify-center transition-colors duration-200 ${
                      value ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    {key.split(/(?=[A-Z])/).join(' ')}: {value ? 'ON' : 'OFF'}
                  </button>
                ))}
              </div>

              {/* Power Control Sliders */}
              <div className="pt-2 border-t border-gray-700 mt-2">
                <ControlSlider
                  control={controlPanels.propulsionPower}
                  controlName="propulsionPower"
                  icon={<Rocket className="h-4 w-4 text-purple-400"/>}
                  color="bg-gradient-to-r from-purple-400 to-indigo-500"
                />
                
                <ControlSlider
                  control={controlPanels.thermalControlPower}
                  controlName="thermalControlPower"
                  icon={<Thermometer className="h-4 w-4 text-blue-400"/>}
                  color="bg-gradient-to-r from-blue-400 to-cyan-500"
                />
                
                <ControlSlider
                  control={controlPanels.powerGenerationEfficiency}
                  controlName="powerGenerationEfficiency"
                  icon={<Zap className="h-4 w-4 text-yellow-400"/>}
                  color="bg-gradient-to-r from-yellow-400 to-orange-500"
                />
                
                <ControlSlider
                  control={controlPanels.lifeSupportPower}
                  controlName="lifeSupportPower"
                  icon={<Atom className="h-4 w-4 text-green-400"/>}
                  color="bg-gradient-to-r from-green-400 to-emerald-500"
                />
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-300 mb-1">Temp. Externa Dinâmica:</p>
                <p className="font-mono text-blue-400">{externalTemp.toFixed(2)} K</p>
                <p className="text-xs text-gray-500 mt-1">Calculada baseada na velocidade: {velocityFractionC.toFixed(4)}c</p>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={toggleAutoAdjust}
                  className={`w-full py-2 rounded font-semibold flex items-center justify-center transition-colors duration-200 ${autoAdjustEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
                >
                  {autoAdjustEnabled ? 'Auto-Regulação: ATIVA' : 'Auto-Regulação: DESATIVADA'}
                </button>
              </div>
              
              {/* Destination Selection */}
              <div className="pt-2 border-t border-gray-700 mt-4">
                <h3 className="text-md font-medium text-gray-300 mb-2 flex items-center"><MapPin className="mr-2 h-4 w-4 text-green-400"/>Destino:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(destinations).map(([key, dest]) => (
                    <button 
                      key={key} 
                      onClick={() => handleDestinationChange(key as DestinationKey)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition-colors duration-200 ${selectedDestination === key ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}
                      title={dest.distanceLY === Infinity ? '' : `${dest.distanceLY.toFixed(2)} anos-luz`}
                    >
                      {dest.name}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="text-md font-medium text-gray-300 pt-2 border-t border-gray-700 mt-4">Material Termoelétrico (Mistura Global):</h3>
              <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'> 
                    <label htmlFor="material1" className="block text-sm font-medium text-gray-300 mb-1">Material 1:</label> 
                    <select 
                      id="material1" 
                      value={selectedMaterial1} 
                      onChange={handleMaterial1Change} 
                      className="w-full p-2 text-sm rounded bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                      disabled={!systemComponents.powerGeneration}
                    > 
                      {Object.entries(materials).map(([k, m]) => (
                        <option key={k} value={k}>{m.name}</option>
                      ))} 
                    </select> 
                  </div>
                  <div className='flex-1'> 
                    <label htmlFor="material2" className="block text-sm font-medium text-gray-300 mb-1">Material 2:</label> 
                    <select 
                      id="material2" 
                      value={selectedMaterial2} 
                      onChange={handleMaterial2Change} 
                      className="w-full p-2 text-sm rounded bg-gray-700 border border-gray-600 focus:ring-orange-500 focus:border-orange-500"
                      disabled={!systemComponents.powerGeneration}
                    > 
                      {Object.entries(materials).map(([k, m]) => (
                        <option key={k} value={k}>{m.name}</option>
                      ))} 
                    </select> 
                  </div>
              </div>
              <div> 
                <label htmlFor="mixRatio" className="block text-sm font-medium text-gray-300 mb-1">
                  Proporção ({(materialMixRatio * 100).toFixed(0)}% M1 / {((1 - materialMixRatio) * 100).toFixed(0)}% M2):
                </label> 
                <input 
                  type="range" 
                  id="mixRatio" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={materialMixRatio} 
                  onChange={handleMixRatioChange} 
                  className="w-full h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-lg appearance-none cursor-pointer range-lg accent-gray-500"
                  disabled={!systemComponents.powerGeneration}
                /> 
              </div>
              
              <div className="flex justify-center space-x-3 pt-2 border-t border-gray-700 mt-4"> 
                <button 
                  onClick={toggleSimulation} 
                  className={`px-4 py-2 rounded font-semibold flex items-center transition-colors duration-200 ${
                    isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={!systemComponents.propulsion && !systemComponents.powerGeneration}
                > 
                  {isRunning ? <><Pause className="mr-1 h-4 w-4"/> Pausar</> : <><Play className="mr-1 h-4 w-4"/> Iniciar</>} 
                </button> 
                <button 
                  onClick={resetSimulation} 
                  className="px-4 py-2 rounded font-semibold flex items-center bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                > 
                  <RotateCcw className="mr-1 h-4 w-4"/> Resetar 
                </button> 
              </div>
            </div>
          </div>
          
          {/* Status Card */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full md:w-auto flex-grow">
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 flex items-center"><Zap className="mr-2 h-5 w-5 text-yellow-400"/>Status da Espaçonave</h2>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-between"><span><Clock className="inline mr-1 h-4 w-4 text-cyan-400"/>Tempo Simulado:</span> <span className="font-medium font-mono">{formatTime(simulationTime)} ({`${(simulationTime / SECONDS_PER_YEAR).toFixed(2)} anos`})</span></p>
              <p className="flex items-center justify-between"><span><MapPin className="inline mr-1 h-4 w-4 text-green-400"/>Destino Atual:</span> <span className="font-medium truncate" title={destinations[selectedDestination].name}>{destinations[selectedDestination].name}</span></p>
              <p className="flex items-center justify-between"><span><Milestone className="inline mr-1 h-4 w-4 text-indigo-400"/>Distância Percorrida:</span> <span className="font-medium">{distanceLightYears.toExponential(3)} anos-luz</span></p>
              {selectedDestination !== 'none' && (
                <p className="flex items-center justify-between"><span><Milestone className="inline mr-1 h-4 w-4 text-gray-400"/>Distância Restante:</span> <span className="font-medium">{Math.max(0, destinations[selectedDestination].distanceLY - distanceLightYears).toExponential(3)} anos-luz</span></p>
              )}
              <p className="flex items-center justify-between"><span><Lightbulb className="inline mr-1 h-4 w-4 text-yellow-300"/>Velocidade Atual:</span> <span className="font-medium">{velocityFractionC.toFixed(4)}c</span></p>
              <p className="flex items-center justify-between pt-2 border-t border-gray-600"><span><Thermometer className="inline mr-1 h-4 w-4 text-red-500"/>Temp. Externa (Espaço):</span> <span className="font-medium">{externalTemp.toFixed(2)} K</span></p>
              <p className="flex items-center justify-between"><span><Target className="inline mr-1 h-4 w-4 text-green-500"/>Temp. Alvo (Habitáculo):</span> <span className="font-medium">{TARGET_INTERNAL_TEMP.toFixed(1)} K ({(TARGET_INTERNAL_TEMP - 273.15).toFixed(1)}°C)</span></p>
              <p className="flex items-center justify-between"><span><Thermometer className="inline mr-1 h-4 w-4 text-blue-500"/>Temp. Média (Habitáculo):</span> <span className={`font-medium ${Math.abs(averageInnerTemp - TARGET_INTERNAL_TEMP) < 5 ? 'text-green-400' : 'text-yellow-400'}`}>{averageInnerTemp.toFixed(1)} K ({(averageInnerTemp - 273.15).toFixed(1)}°C)</span></p>
              <p className="flex items-center justify-between pt-2 border-t border-gray-600"><span><Blend className="inline mr-1 h-4 w-4" style={{color: effectiveMaterial.color}}/>Material da Malha:</span> <span className="font-medium truncate" title={effectiveMaterial.name} style={{ color: effectiveMaterial.color }}>{effectiveMaterial.name}</span></p>
              <p className="flex items-center justify-between"><span><Layers className="inline mr-1 h-4 w-4 text-green-400"/>S_eff:</span> <span className="font-medium">{(effectiveMaterial.S_eff * 1e6).toFixed(0)} µV/K</span></p>
              <p className="flex items-center justify-between"><span><Zap className="inline mr-1 h-4 w-4 text-yellow-400"/>σ:</span> <span className="font-medium">{effectiveMaterial.sigma.toExponential(1)} S/m</span></p>
              <p className="flex items-center justify-between"><span><Thermometer className="inline mr-1 h-4 w-4 text-orange-500"/>k:</span> <span className="font-medium">{effectiveMaterial.k.toFixed(2)} W/mK</span></p>
              <p className="flex items-center justify-between"><span><Bot className="inline mr-1 h-4 w-4 text-purple-400"/>ZT:</span> <span className="font-medium">{effectiveMaterial.ZT.toFixed(2)}</span></p>
              <p className="flex items-center justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-700"><span>⚡ Potência Recuperada:</span> <span className="text-yellow-400">{totalPower.toFixed(4)} W</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Chat & Explanations */}
      <div className="flex flex-col gap-6 w-full lg:flex-grow lg:max-w-md xl:max-w-lg">
          {/* AI Chat Section */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full flex flex-col" style={{ height: 'calc(60vh + 100px)' }}>
              <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-cyan-400"/>Chat IA: Engenharia Térmica</h2>
              <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-3 text-sm">
                  {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                              {msg.text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
                                  if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
                                  if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
                                  return part;
                              })}
                          </div>
                      </div>
                  ))}
                  {isAiThinking && <div className="flex justify-start"><div className="p-2 rounded-lg bg-gray-700 animate-pulse">Processando...</div></div>}
                  <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 border-t border-gray-700 pt-3">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} 
                    placeholder="Pergunte sobre a simulação..." 
                    className="flex-grow p-2 rounded bg-gray-700 border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 text-sm" 
                    disabled={isAiThinking} 
                  />
                  <button 
                    onClick={handleChatSend} 
                    className={`p-2 rounded font-semibold flex items-center transition-colors duration-200 ${isAiThinking ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`} 
                    disabled={isAiThinking}
                  >
                    <Send className="h-4 w-4"/>
                  </button>
              </div>
               <p className="text-xs text-gray-500 mt-2 text-center">Aviso: Chave API no código fonte.</p>
          </div>

          {/* Explanations Sections */} 
          <QuantumThermalChallenges />
          <ThermalMeshApplication />
          <AdiabaticCompressionInfo />
      </div>
    </div>
  );
};

export default ThermalMeshPage;