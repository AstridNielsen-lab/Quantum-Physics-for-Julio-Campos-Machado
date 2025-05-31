import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Gamepad2, Keyboard, Mouse, Settings, Target, TrendingUp, RotateCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, Zap, Shield, Gauge } from 'lucide-react';
import * as THREE from 'three';

interface CockpitControlsProps {
  isVisible: boolean;
  onToggle: () => void;
}

const CockpitControls: React.FC<CockpitControlsProps> = ({ isVisible, onToggle }) => {
  const { speed, setSpeed, position, setPosition, rotation, setRotation, energy, setEnergy, shields, setShields, zoom, setZoom } = useGameStore();
  const [thrusterPower, setThrusterPower] = useState(50);
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Controles de teclado avançados
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code;
      setKeysPressed(prev => new Set(prev).add(key));
      
      event.preventDefault();
      
      const moveSpeed = 0.2;
      const rotateSpeed = 0.03;
      const currentPos = position.clone();
      const currentRot = rotation.clone();
      
      switch (key) {
        // Movimento WASD
        case 'KeyW': // Frente
          currentPos.z -= moveSpeed * Math.cos(currentRot.y);
          currentPos.x -= moveSpeed * Math.sin(currentRot.y);
          setPosition(currentPos);
          break;
        case 'KeyS': // Trás
          currentPos.z += moveSpeed * Math.cos(currentRot.y);
          currentPos.x += moveSpeed * Math.sin(currentRot.y);
          setPosition(currentPos);
          break;
        case 'KeyA': // Esquerda
          currentRot.y += rotateSpeed;
          setRotation(currentRot);
          break;
        case 'KeyD': // Direita
          currentRot.y -= rotateSpeed;
          setRotation(currentRot);
          break;
        
        // Controles verticais
        case 'KeyQ': // Subir
          currentPos.y += moveSpeed;
          setPosition(currentPos);
          break;
        case 'KeyE': // Descer
          currentPos.y -= moveSpeed;
          setPosition(currentPos);
          break;
        
        // Controles de velocidade
        case 'ShiftLeft': // Boost
          setSpeed(Math.min(speed + 1, 15));
          break;
        case 'ControlLeft': // Desacelerar
          setSpeed(Math.max(speed - 1, 0));
          break;
        
        // Controles de sistemas
        case 'KeyR': // Regenerar escudos
          setShields(Math.min(shields + 10, 100));
          setEnergy(Math.max(energy - 5, 0));
          break;
        case 'KeyF': // Boost de energia
          setEnergy(Math.min(energy + 15, 100));
          break;
        
        // Parada de emergência
        case 'Space':
          setSpeed(0);
          break;
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.code);
        return newSet;
      });
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseControlEnabled) {
        const deltaX = event.movementX * 0.001;
        const deltaY = event.movementY * 0.001;
        
        const currentRot = rotation.clone();
        currentRot.y -= deltaX;
        currentRot.x -= deltaY;
        
        // Limitar pitch para evitar capotagem
        currentRot.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, currentRot.x));
        
        setRotation(currentRot);
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [position, rotation, speed, shields, energy, isMouseControlEnabled, setPosition, setRotation, setSpeed, setShields, setEnergy]);

  const handleThrusterChange = (power: number) => {
    setThrusterPower(power);
    setSpeed(power / 10);
  };

  const handleEmergencyStop = () => {
    setSpeed(0);
    setThrusterPower(0);
  };

  const toggleMouseControl = () => {
    setIsMouseControlEnabled(!isMouseControlEnabled);
    if (!isMouseControlEnabled) {
      document.body.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-30 p-3 bg-cyan-900/80 backdrop-blur-sm rounded-full border border-cyan-500/40 text-cyan-400 hover:bg-cyan-800/80 transition-colors pointer-events-auto"
        title="Mostrar Controles"
      >
        <Gamepad2 className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 w-96 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-cyan-500/40 text-cyan-400 pointer-events-auto">
      {/* Header */}
      <div className="p-3 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          <h3 className="font-semibold">Controles de Voo</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-cyan-800/50 rounded transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Controle de Propulsão */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Propulsão</span>
            <span className="text-cyan-300">{thrusterPower}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={thrusterPower}
              onChange={(e) => handleThrusterChange(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <button
              onClick={handleEmergencyStop}
              className="p-2 bg-red-900/50 hover:bg-red-800/70 rounded border border-red-500/50 transition-colors"
              title="Parada de Emergência"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controles Direcionais */}
        <div>
          <div className="text-sm font-medium mb-2">Direção</div>
          <div className="grid grid-cols-3 gap-1 max-w-32 mx-auto">
            <div></div>
            <button
              onMouseDown={() => {
                const currentPos = position.clone();
                currentPos.z -= 0.5;
                setPosition(currentPos);
              }}
              className="p-2 bg-slate-700/50 hover:bg-cyan-700/50 rounded transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div></div>
            <button
              onMouseDown={() => {
                const currentRot = rotation.clone();
                currentRot.y += 0.1;
                setRotation(currentRot);
              }}
              className="p-2 bg-slate-700/50 hover:bg-cyan-700/50 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setPosition(new THREE.Vector3(0, 0, 0));
                setRotation(new THREE.Euler(0, 0, 0));
              }}
              className="p-2 bg-slate-700/50 hover:bg-cyan-700/50 rounded transition-colors"
              title="Centro"
            >
              <Target className="w-4 h-4" />
            </button>
            <button
              onMouseDown={() => {
                const currentRot = rotation.clone();
                currentRot.y -= 0.1;
                setRotation(currentRot);
              }}
              className="p-2 bg-slate-700/50 hover:bg-cyan-700/50 rounded transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <div></div>
            <button
              onMouseDown={() => {
                const currentPos = position.clone();
                currentPos.z += 0.5;
                setPosition(currentPos);
              }}
              className="p-2 bg-slate-700/50 hover:bg-cyan-700/50 rounded transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <div></div>
          </div>
        </div>

        {/* Controles de Sistema */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setShields(Math.min(shields + 20, 100));
              setEnergy(Math.max(energy - 10, 0));
            }}
            className="p-2 bg-blue-900/50 hover:bg-blue-800/70 rounded border border-blue-500/50 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span className="text-xs">Escudos</span>
          </button>
          <button
            onClick={() => setEnergy(Math.min(energy + 25, 100))}
            className="p-2 bg-yellow-900/50 hover:bg-yellow-800/70 rounded border border-yellow-500/50 transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span className="text-xs">Energia</span>
          </button>
        </div>

        {/* Mouse Control Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Controle de Mouse</span>
          <button
            onClick={toggleMouseControl}
            className={`p-2 rounded transition-colors ${
              isMouseControlEnabled 
                ? 'bg-green-900/50 border border-green-500/50 text-green-400'
                : 'bg-slate-700/50 border border-slate-500/50'
            }`}
          >
            <Mouse className="w-4 h-4" />
          </button>
        </div>

        {/* Teclas Ativas */}
        {keysPressed.size > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Teclas Ativas</div>
            <div className="flex flex-wrap gap-1">
              {Array.from(keysPressed).map(key => (
                <span key={key} className="px-2 py-1 bg-cyan-900/50 rounded text-xs">
                  {key.replace('Key', '').replace('Left', 'L').replace('Right', 'R')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="text-xs text-gray-400 border-t border-cyan-800/30 pt-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>WASD: Movimento</div>
            <div>Q/E: Subir/Descer</div>
            <div>Shift: Acelerar</div>
            <div>Ctrl: Desacelerar</div>
            <div>R: Regenerar escudos</div>
            <div>F: Boost energia</div>
            <div>Space: Parar</div>
            <div>Mouse: Olhar ao redor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockpitControls;

