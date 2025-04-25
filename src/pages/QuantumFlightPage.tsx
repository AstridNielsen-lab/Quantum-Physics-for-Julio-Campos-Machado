import React, { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Rocket, Radio, Gauge, Compass, Plane as Planet, 
  Sun, Moon, Crosshair, Shield, Zap, Thermometer, Wind, 
  Navigation2, Wifi, Activity, Battery, AlertTriangle, 
  Maximize2, Minimize2, BarChart2, Cpu, Database, Power,
  BrainCircuit, Radar, Hexagon, Waves, Orbit, Send, Atom
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, PerspectiveCamera, useGLTF, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { create } from 'zustand';
import Navigation from '../components/Navigation';
import Interface from '../components/QuantumFlight/Interface';

// Constants for astronomical calculations
const ASTRONOMICAL_UNIT = 149597870.7; // 1 AU in kilometers
const LIGHT_SPEED = 299792.458; // Speed of light in km/s
const EARTH_ORBITAL_SPEED = 29.78; // Earth's orbital speed in km/s

// Speed levels configuration
const SPEED_LEVELS = {
  IDLE: { name: 'Idle', maxSpeed: 0.01, color: '#64748b' },
  IMPULSE: { name: 'Impulse', maxSpeed: 0.1, color: '#22d3ee' },
  WARP_1: { name: 'Warp 1', maxSpeed: 1, color: '#a855f7' },
  WARP_5: { name: 'Warp 5', maxSpeed: 5, color: '#ec4899' },
  WARP_9: { name: 'Warp 9', maxSpeed: 9.975, color: '#eab308' }
};

// AI Assistant configuration
const AI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const AI_KEY = "AIzaSyA8_qX9Yv5KaQMGrLZLNUFmZ_77kZ19S-Q";

const systemPrompt = `You are QAIS (Quantum Artificial Intelligence System), the advanced AI assistant for the Quantum Doors starship. You help monitor and control ship systems, providing advice and status updates to the crew.

Focus on:
- Ship systems status and optimization
- Navigation recommendations
- Safety protocols
- Energy management
- Quantum field stability

Keep responses concise and relevant to starship operations.`;

interface GameState {
  speed: number;
  targetSpeed: number;
  speedLevel: keyof typeof SPEED_LEVELS;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  energy: number;
  shields: number;
  temperature: number;
  quantumIntegrity: number;
  targetPlanet: string | null;
  distanceTraveled: number;
  timeElapsed: number;
  fieldStrength: number;
  hullIntegrity: number;
  lifeSupportStatus: number;
  engineEfficiency: number;
  quantumFluxLevel: number;
  systemStatus: {
    propulsion: boolean;
    navigation: boolean;
    shields: boolean;
    lifeSupportSystems: boolean;
    quantumCore: boolean;
    communications: boolean;
    sensors: boolean;
    powerGrid: boolean;
  };
  alerts: string[];
  setSpeed: (speed: number) => void;
  setTargetSpeed: (speed: number) => void;
  setSpeedLevel: (level: keyof typeof SPEED_LEVELS) => void;
  setPosition: (position: THREE.Vector3) => void;
  setRotation: (rotation: THREE.Euler) => void;
  setEnergy: (energy: number) => void;
  setShields: (shields: number) => void;
  setTemperature: (temp: number) => void;
  setQuantumIntegrity: (integrity: number) => void;
  setTargetPlanet: (planet: string | null) => void;
  setDistanceTraveled: (distance: number) => void;
  setTimeElapsed: (time: number) => void;
  setFieldStrength: (strength: number) => void;
  setHullIntegrity: (integrity: number) => void;
  setLifeSupportStatus: (status: number) => void;
  setEngineEfficiency: (efficiency: number) => void;
  setQuantumFluxLevel: (level: number) => void;
  setSystemStatus: (status: Partial<GameState['systemStatus']>) => void;
  addAlert: (alert: string) => void;
  removeAlert: (index: number) => void;
}

const useGameStore = create<GameState>((set) => ({
  speed: 0,
  targetSpeed: 0,
  speedLevel: 'IDLE',
  position: new THREE.Vector3(0, 0, -10),
  rotation: new THREE.Euler(0, 0, 0),
  energy: 100,
  shields: 100,
  temperature: 293,
  quantumIntegrity: 100,
  targetPlanet: null,
  distanceTraveled: 0,
  timeElapsed: 0,
  fieldStrength: 100,
  hullIntegrity: 100,
  lifeSupportStatus: 100,
  engineEfficiency: 100,
  quantumFluxLevel: 0,
  systemStatus: {
    propulsion: true,
    navigation: true,
    shields: true,
    lifeSupportSystems: true,
    quantumCore: true,
    communications: true,
    sensors: true,
    powerGrid: true
  },
  alerts: [],
  setSpeed: (speed) => set({ speed }),
  setTargetSpeed: (speed) => set({ targetSpeed: speed }),
  setSpeedLevel: (level) => set({ speedLevel: level }),
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setEnergy: (energy) => set({ energy }),
  setShields: (shields) => set({ shields }),
  setTemperature: (temp) => set({ temperature: temp }),
  setQuantumIntegrity: (integrity) => set({ quantumIntegrity: integrity }),
  setTargetPlanet: (planet) => set({ targetPlanet: planet }),
  setDistanceTraveled: (distance) => set({ distanceTraveled: distance }),
  setTimeElapsed: (time) => set({ timeElapsed: time }),
  setFieldStrength: (strength) => set({ fieldStrength: strength }),
  setHullIntegrity: (integrity) => set({ hullIntegrity: integrity }),
  setLifeSupportStatus: (status) => set({ lifeSupportStatus: status }),
  setEngineEfficiency: (efficiency) => set({ engineEfficiency: efficiency }),
  setQuantumFluxLevel: (level) => set({ quantumFluxLevel: level }),
  setSystemStatus: (status) => set((state) => ({
    systemStatus: { ...state.systemStatus, ...status }
  })),
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, alert]
  })),
  removeAlert: (index) => set((state) => ({
    alerts: state.alerts.filter((_, i) => i !== index)
  }))
}));

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const {
    speed, energy, shields, temperature, quantumIntegrity,
    fieldStrength, hullIntegrity, lifeSupportStatus, engineEfficiency,
    quantumFluxLevel, systemStatus, alerts
  } = useGameStore();

  const sendMessage = async (message: string) => {
    try {
      setIsTyping(true);
      const systemContext = `
        Current ship status:
        - Speed: ${speed} c
        - Energy: ${energy}%
        - Shields: ${shields}%
        - Temperature: ${temperature}K
        - Quantum Integrity: ${quantumIntegrity}%
        - Field Strength: ${fieldStrength}%
        - Hull Integrity: ${hullIntegrity}%
        - Life Support: ${lifeSupportStatus}%
        - Engine Efficiency: ${engineEfficiency}%
        - Quantum Flux: ${quantumFluxLevel}
        
        Active alerts: ${alerts.length > 0 ? alerts.join(', ') : 'None'}
      `;

      const response = await fetch(AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_KEY}`
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: systemPrompt }] },
            { parts: [{ text: systemContext }] },
            { parts: [{ text: message }] }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      setMessages(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: 'I apologize, but I am currently experiencing communication difficulties. Please try again later.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-violet-900/20 backdrop-blur-sm p-4 rounded-xl border border-violet-500/20">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="text-violet-400 w-5 h-5" />
        <h3 className="text-lg font-semibold">QAIS - Quantum AI System</h3>
      </div>

      <div className="h-64 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-900/20 border border-violet-500/20 text-gray-300'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-violet-900/20 border border-violet-500/20 p-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage(input.trim());
            setInput('');
          }
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask QAIS about ship systems..."
          className="flex-1 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
        <button
          type="submit"
          disabled={isTyping}
          className="bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

function SystemMonitor({ title, value, icon: Icon, color = "violet" }: {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: "violet" | "red" | "green" | "blue" | "yellow";
}) {
  const colorClass = {
    violet: "text-violet-400",
    red: "text-red-400",
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400"
  }[color];

  return (
    <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="h-2 bg-violet-900/50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            color === "violet" ? "bg-violet-400" :
            color === "red" ? "bg-red-400" :
            color === "green" ? "bg-green-400" :
            color === "blue" ? "bg-blue-400" :
            "bg-yellow-400"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="text-right mt-1 font-mono text-sm">
        {value.toFixed(1)}%
      </div>
    </div>
  );
}

function SpeedControl() {
  const { speedLevel, setSpeedLevel, setTargetSpeed } = useGameStore();

  const handleSpeedChange = (level: keyof typeof SPEED_LEVELS) => {
    setSpeedLevel(level);
    setTargetSpeed(SPEED_LEVELS[level].maxSpeed);
  };

  return (
    <div className="space-y-2">
      {(Object.keys(SPEED_LEVELS) as Array<keyof typeof SPEED_LEVELS>).map((level) => (
        <button
          key={level}
          onClick={() => handleSpeedChange(level)}
          className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
            speedLevel === level
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
          }`}
          style={{
            borderLeft: `4px solid ${SPEED_LEVELS[level].color}`
          }}
        >
          <span>{SPEED_LEVELS[level].name}</span>
          <span className="font-mono">{SPEED_LEVELS[level].maxSpeed}c</span>
        </button>
      ))}
    </div>
  );
}

function SystemsOverview() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const {
    energy, shields, temperature, quantumIntegrity,
    fieldStrength, hullIntegrity, lifeSupportStatus, engineEfficiency,
    quantumFluxLevel, systemStatus
  } = useGameStore();

  const panels = {
    power: {
      title: "Power Systems",
      icon: Power,
      content: (
        <div className="space-y-4">
          <SystemMonitor title="Energy Reserves" value={energy} icon={Battery} color="yellow" />
          <SystemMonitor title="Engine Efficiency" value={engineEfficiency} icon={Gauge} color="green" />
          <SystemMonitor title="Power Grid Stability" value={95} icon={Activity} color="blue" />
        </div>
      )
    },
    defense: {
      title: "Defense Systems",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <SystemMonitor title="Shield Strength" value={shields} icon={Shield} color="blue" />
          <SystemMonitor title="Hull Integrity" value={hullIntegrity} icon={Hexagon} color="violet" />
          <SystemMonitor title="Field Strength" value={fieldStrength} icon={Waves} color="green" />
        </div>
      )
    },
    quantum: {
      title: "Quantum Systems",
      icon: Atom,
      content: (
        <div className="space-y-4">
          <SystemMonitor title="Quantum Integrity" value={quantumIntegrity} icon={Atom} color="violet" />
          <SystemMonitor title="Quantum Flux" value={quantumFluxLevel} icon={Activity} color="yellow" />
          <SystemMonitor title="Field Coherence" value={98} icon={Waves} color="blue" />
        </div>
      )
    },
    environmental: {
      title: "Environmental Systems",
      icon: Thermometer,
      content: (
        <div className="space-y-4">
          <SystemMonitor title="Life Support" value={lifeSupportStatus} icon={Activity} color="green" />
          <SystemMonitor title="Temperature Control" value={(temperature - 273.15) / 10} icon={Thermometer} color="red" />
          <SystemMonitor title="Atmospheric Quality" value={99} icon={Wind} color="blue" />
        </div>
      )
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(panels).map(([key, panel]) => (
        <button
          key={key}
          onClick={() => setActivePanel(activePanel === key ? null : key)}
          className={`p-4 rounded-lg transition-colors ${
            activePanel === key
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <panel.icon className="w-5 h-5" />
            <span>{panel.title}</span>
          </div>
        </button>
      ))}
      
      {activePanel && (
        <div className="col-span-2 bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
          {panels[activePanel as keyof typeof panels].content}
        </div>
      )}
    </div>
  );
}

function Ship() {
  const { position, rotation, speed } = useGameStore();
  
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#4a148c"
          emissiveIntensity={speed > 1 ? 4 : 2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <pointLight 
        color="#f72585"
        intensity={speed * 4}
        distance={20}
        position={[0, 0, 2]}
      />

      <Text
        position={[0, 1, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        QS Voyager
      </Text>

      {speed > 1 && (
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial
            color="#4a148c"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

function SpaceEnvironment() {
  return (
    <group>
      <Stars
        radius={300}
        depth={100}
        count={10000}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />
      
      <mesh position={[0, 0, -500]}>
        <sphereGeometry args={[400, 64, 64]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={0.2}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        height={300}
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}
      />
    </EffectComposer>
  );
}

export default function QuantumFlightPage() {
  const {
    speed,
    position,
    rotation,
    energy,
    shields,
    temperature,
    quantumIntegrity,
    distanceTraveled,
    timeElapsed,
    setSpeed,
    setPosition,
    setRotation,
    setEnergy,
    setShields,
    setTemperature,
    setQuantumIntegrity,
    setDistanceTraveled,
    setTimeElapsed,
    addAlert,
    setSystemStatus
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const moveSpeed = 0.1;
      const rotateSpeed = 0.05;

      switch (event.code) {
        case 'KeyW':
          setSpeed(Math.min(speed + 0.1, 1));
          setTemperature(temperature + 5);
          break;
        case 'KeyS':
          setSpeed(Math.max(speed - 0.1, -0.5));
          break;
        case 'KeyA':
          setRotation(new THREE.Euler(rotation.x, rotation.y + rotateSpeed, rotation.z));
          break;
        case 'KeyD':
          setRotation(new THREE.Euler(rotation.x, rotation.y - rotateSpeed, rotation.z));
          break;
        case 'Space':
          if (energy >= 10) {
            setSpeed(2);
            setEnergy(energy - 10);
            setTemperature(temperature + 50);
            setQuantumIntegrity(quantumIntegrity - 5);
          }
          break;
      }

      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyEuler(rotation);
      direction.multiplyScalar(speed * moveSpeed);
      setPosition(position.clone().add(direction));

      setDistanceTraveled(distanceTraveled + speed * LIGHT_SPEED);
      setTimeElapsed(timeElapsed + (speed * 0.1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speed, position, rotation, energy, temperature, quantumIntegrity, distanceTraveled, timeElapsed]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (temperature > 1000) {
        addAlert("ALERTA: Temperatura crítica do núcleo!");
        setSystemStatus({ propulsion: false });
      }
      
      if (quantumIntegrity < 50) {
        addAlert("ALERTA: Integridade quântica comprometida!");
        setSystemStatus({ quantumCore: false });
      }
      
      if (shields < 100) {
        setShields(Math.min(shields + 0.1, 100));
      }
      
      if (energy < 100 && speed < 1) {
        setEnergy(Math.min(energy + 0.2, 100));
      }
      
      if (speed < 0.5 && temperature > 293) {
        setTemperature(Math.max(temperature - 1, 293));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [temperature, quantumIntegrity, shields, energy, speed]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="relative h-screen">
        <div className="absolute inset-0 z-10">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            <OrbitControls enableZoom={false} enablePan={false} />
            <ambientLight intensity={0.2} />
            
            <Suspense fallback={null}>
              <SpaceEnvironment />
              <Ship />
              <Effects />
            </Suspense>
          </Canvas>
          <Interface />
        </div>

        <Link
          to="/"
          className="absolute top-24 left-8 z-20 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 bg-violet-900/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-violet-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
      </main>
    </div>
  );
}