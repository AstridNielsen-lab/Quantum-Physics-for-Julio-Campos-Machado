import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

interface LaserBeam {
  id: string;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
  position: THREE.Vector3;
  intensity: number;
  lifeTime: number;
  maxLifeTime: number;
}

interface QuantumCannonProps {
  onFire?: (beam: LaserBeam) => void;
  onHit?: (targetId: string, damage: number) => void;
}

const QuantumCannon: React.FC<QuantumCannonProps> = ({ onFire, onHit }) => {
  const { position: shipPosition, rotation: shipRotation, energy, setEnergy } = useGameStore();
  const { camera, raycaster, scene } = useThree();
  const [laserBeams, setLaserBeams] = useState<LaserBeam[]>([]);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeLevel, setChargeLevel] = useState(0);
  const [isFiring, setIsFiring] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cannonRef = useRef<THREE.Group>(null);
  const chargingSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Propriedades do laser de hélio (baseado na composição do Sol)
  const HELIUM_LASER_PROPERTIES = {
    wavelength: 632.8, // nanômetros (hélio-neônio)
    power: 50000, // watts (50kW)
    beamDiameter: 0.1, // metros
    divergence: 0.001, // radianos
    efficiency: 0.85,
    temperature: 5778, // Kelvin (temperatura da superfície solar)
    energyCost: 10, // energia por disparo
    damage: 50,
    range: 1000,
    chargeTime: 2.0, // segundos
    cooldownTime: 1.5 // segundos
  };

  // Função para calcular direção do disparo
  const getFireDirection = () => {
    const direction = new THREE.Vector3(0, 0, -1);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(shipRotation);
    direction.applyMatrix4(rotationMatrix);
    return direction.normalize();
  };

  // Função para criar raio laser
  const createLaserBeam = (startPos: THREE.Vector3, direction: THREE.Vector3): LaserBeam => {
    return {
      id: `laser-${Date.now()}-${Math.random()}`,
      startPosition: startPos.clone(),
      direction: direction.clone(),
      position: startPos.clone(),
      intensity: 1.0,
      lifeTime: 0,
      maxLifeTime: 0.5 // meio segundo de duração
    };
  };

  // Função para disparar
  const fire = () => {
    if (cooldown > 0 || energy < HELIUM_LASER_PROPERTIES.energyCost) return;
    
    const fireDirection = getFireDirection();
    const startPosition = shipPosition.clone().add(fireDirection.clone().multiplyScalar(5));
    const beam = createLaserBeam(startPosition, fireDirection);
    
    setLaserBeams(prev => [...prev, beam]);
    setEnergy(energy - HELIUM_LASER_PROPERTIES.energyCost);
    setCooldown(HELIUM_LASER_PROPERTIES.cooldownTime);
    setIsFiring(true);
    
    onFire?.(beam);
    
    // Som do disparo
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEgBkGY3/LTeyYEKHnL8N2QRAoTXrXp66hVFAhJnt/ywmMgBT6U2+/Ufi4ELIHQztiSIHI=';
    audio.volume = 0.3;
    audio.play().catch(() => {});
    
    setTimeout(() => setIsFiring(false), 100);
  };

  // Função para carregar o canhão
  const startCharging = () => {
    if (cooldown > 0) return;
    setIsCharging(true);
    setChargeLevel(0);
  };

  const stopCharging = () => {
    if (isCharging && chargeLevel >= 0.5) {
      fire();
    }
    setIsCharging(false);
    setChargeLevel(0);
  };

  // Detectar colisões dos lasers
  const checkCollisions = (beam: LaserBeam) => {
    const raycaster = new THREE.Raycaster(beam.position, beam.direction);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    for (const intersect of intersects) {
      const userData = intersect.object.userData;
      if (userData.type === 'asteroid' && userData.id) {
        // Causar dano no asteroide
        const damage = HELIUM_LASER_PROPERTIES.damage * beam.intensity;
        if (window.damageAsteroid) {
          (window as any).damageAsteroid(userData.id, damage);
        }
        onHit?.(userData.id, damage);
        
        // Remover o raio após colisão
        return true;
      }
    }
    return false;
  };

  // Controles do teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        startCharging();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        stopCharging();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCharging, chargeLevel, cooldown, energy]);

  useFrame((state, delta) => {
    // Atualizar cooldown
    if (cooldown > 0) {
      setCooldown(prev => Math.max(0, prev - delta));
    }

    // Atualizar carregamento
    if (isCharging && cooldown <= 0) {
      setChargeLevel(prev => Math.min(1, prev + delta / HELIUM_LASER_PROPERTIES.chargeTime));
    }

    // Atualizar raios laser
    setLaserBeams(prev => prev.map(beam => {
      const newBeam = { ...beam };
      newBeam.lifeTime += delta;
      
      // Mover o raio
      const speed = 500; // m/s
      newBeam.position.add(newBeam.direction.clone().multiplyScalar(speed * delta));
      
      // Verificar colisões
      const hit = checkCollisions(newBeam);
      if (hit) {
        newBeam.lifeTime = newBeam.maxLifeTime; // Marcar para remoção
      }
      
      // Reduzir intensidade com o tempo
      newBeam.intensity = Math.max(0, 1 - (newBeam.lifeTime / newBeam.maxLifeTime));
      
      return newBeam;
    }).filter(beam => beam.lifeTime < beam.maxLifeTime));
  });

  // Calcular cor do laser baseada na temperatura do hélio
  const getHeliumLaserColor = () => {
    // Cor baseada na temperatura do plasma de hélio
    const hue = 0.95; // Azul-violeta característico do hélio
    const saturation = 1.0;
    const lightness = 0.7;
    return new THREE.Color().setHSL(hue, saturation, lightness);
  };

  return (
    <group ref={cannonRef} position={shipPosition} rotation={shipRotation}>
      {/* Estrutura do Canhão Quântico */}
      <group position={[0, 0, -3]}>
        {/* Base do canhão */}
        <mesh>
          <cylinderGeometry args={[0.8, 1.0, 1.5, 12]} />
          <meshStandardMaterial
            color="#2a3b4c"
            metalness={0.9}
            roughness={0.1}
            emissive={isCharging ? getHeliumLaserColor() : '#000000'}
            emissiveIntensity={isCharging ? chargeLevel * 0.5 : 0}
          />
        </mesh>
        
        {/* Barril do canhão */}
        <mesh position={[0, 0, -1.5]}>
          <cylinderGeometry args={[0.3, 0.4, 3, 16]} />
          <meshStandardMaterial
            color="#1a2b3c"
            metalness={1.0}
            roughness={0.1}
            emissive={isCharging ? getHeliumLaserColor() : '#000000'}
            emissiveIntensity={isCharging ? chargeLevel * 0.3 : 0}
          />
        </mesh>
        
        {/* Anéis de contenção quântica */}
        {[0.5, 1.0, 1.5].map((pos, i) => (
          <mesh key={i} position={[0, 0, -pos]}>
            <torusGeometry args={[0.6 + i * 0.1, 0.05, 8, 16]} />
            <meshStandardMaterial
              color={getHeliumLaserColor()}
              emissive={getHeliumLaserColor()}
              emissiveIntensity={0.8 + (isCharging ? chargeLevel : 0)}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Cristal de foco hélio */}
        <mesh position={[0, 0, -2.8]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhysicalMaterial
            color={getHeliumLaserColor()}
            emissive={getHeliumLaserColor()}
            emissiveIntensity={1.5 + (isCharging ? chargeLevel * 2 : 0)}
            transparent
            opacity={0.8}
            transmission={0.9}
            thickness={0.5}
            roughness={0.1}
            metalness={0}
          />
        </mesh>
        
        {/* Efeito de carregamento */}
        {isCharging && (
          <mesh position={[0, 0, -1.5]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshBasicMaterial
              color={getHeliumLaserColor()}
              transparent
              opacity={chargeLevel * 0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
        
        {/* Luz do canhão */}
        <pointLight
          color={getHeliumLaserColor()}
          intensity={isCharging ? 2 + chargeLevel * 3 : 0.5}
          distance={10}
          decay={2}
          position={[0, 0, -2.5]}
        />
      </group>
      
      {/* Renderizar raios laser */}
      {laserBeams.map(beam => {
        const length = beam.position.distanceTo(beam.startPosition);
        const midPoint = beam.startPosition.clone().lerp(beam.position, 0.5);
        
        return (
          <group key={beam.id}>
            {/* Raio principal */}
            <mesh position={midPoint} lookAt={beam.position}>
              <cylinderGeometry args={[0.05 * beam.intensity, 0.02 * beam.intensity, length, 8]} />
              <meshBasicMaterial
                color={getHeliumLaserColor()}
                emissive={getHeliumLaserColor()}
                emissiveIntensity={beam.intensity * 2}
                transparent
                opacity={beam.intensity}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Halo do raio */}
            <mesh position={midPoint} lookAt={beam.position}>
              <cylinderGeometry args={[0.2 * beam.intensity, 0.1 * beam.intensity, length, 8]} />
              <meshBasicMaterial
                color={getHeliumLaserColor()}
                transparent
                opacity={beam.intensity * 0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            
            {/* Luz móvel do raio */}
            <pointLight
              position={beam.position}
              color={getHeliumLaserColor()}
              intensity={beam.intensity * 5}
              distance={20}
              decay={2}
            />
          </group>
        );
      })}
      
      {/* Efeito de disparo */}
      {isFiring && (
        <mesh position={[0, 0, -3]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color={getHeliumLaserColor()}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};

export default QuantumCannon;
export { HELIUM_LASER_PROPERTIES } from './QuantumCannon';
export type { LaserBeam };

