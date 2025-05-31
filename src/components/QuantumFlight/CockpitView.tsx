import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

const CockpitView = () => {
  const { position, rotation, speed, energy, shields } = useGameStore();
  const cockpitRef = useRef<THREE.Group>(null);
  const engineGlowRef = useRef<THREE.PointLight>(null);
  const thrusterParticlesRef = useRef<THREE.Points>(null);
  const [enginePulse, setEnginePulse] = useState(0);
  
  useFrame((state, delta) => {
    if (!cockpitRef.current || !engineGlowRef.current || !thrusterParticlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    setEnginePulse(Math.sin(time * 2) * 0.5 + 0.5);
    
    // Animação do brilho do motor baseado na velocidade
    engineGlowRef.current.intensity = 1 + speed * 0.3 + enginePulse * 0.5;
    engineGlowRef.current.color.setHSL(0.5 + speed * 0.05, 1, 0.5);
    
    // Efeito de partículas dos propulsores
    const positions = thrusterParticlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] -= delta * (5 + speed * 2); // Movimento das partículas
      if (positions[i + 2] < -10) {
        positions[i + 2] = 2;
        positions[i] = (Math.random() - 0.5) * 2;
        positions[i + 1] = (Math.random() - 0.5) * 2;
      }
    }
    thrusterParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Vibração da nave baseada na velocidade
    if (speed > 3) {
      const vibration = speed * 0.01;
      cockpitRef.current.position.x = Math.sin(time * 20) * vibration;
      cockpitRef.current.position.y = Math.cos(time * 15) * vibration;
    }
  });

  return (
    <group ref={cockpitRef} position={position} rotation={rotation}>
      {/* Estrutura Principal da Nave (Vista do Cockpit) */}
      <group>
        {/* Casco principal - mais visível, com cores do Roblox */}
        <mesh position={[0, 0, 5]}>
          <cylinderGeometry args={[1.5, 1.2, 8, 12]} />
          <meshStandardMaterial 
            color="#0f3460"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
            emissive="#00b4ff"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Seção de comando elevada - estilo cockpit de MS Flight Simulator */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.8, 1.5, 3, 12]} />
          <meshStandardMaterial 
            color="#193366"
            metalness={0.8}
            roughness={0.2}
            emissive="#00b4ff"
            emissiveIntensity={0.05}
          />
        </mesh>
        
        {/* Bico da nave */}
        <mesh position={[0, 0, -4]}>
          <coneGeometry args={[1.2, 4, 8]} />
          <meshStandardMaterial 
            color="#1a365d"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Janelas do cockpit iluminadas - estilo MS Flight Simulator com visibilidade melhorada */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[
                Math.cos(angle) * 1.2,
                Math.sin(angle) * 0.3 + 0.5,
                -1.5
              ]}
              rotation={[0, 0, angle]}
            >
              <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
              <meshStandardMaterial 
                color="#00b4ff"
                emissive="#00b4ff"
                emissiveIntensity={1.2}
                transparent
                opacity={0.9}
              />
            </mesh>
          );
        })}
        
        {/* Painel frontal do cockpit - visibilidade melhorada para MS Flight Simulator */}
        <mesh position={[0, 0.8, -1.7]} rotation={[Math.PI * 0.15, 0, 0]}>
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial 
            color="#111827"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Detalhes do painel - monitores e controles */}
        {[...Array(3)].map((_, i) => (
          <mesh 
            key={`monitor-${i}`} 
            position={[
              (i - 1) * 0.7,
              0.8,
              -1.65
            ]}
            rotation={[Math.PI * 0.15, 0, 0]}
          >
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial 
              color={i === 1 ? "#00b4ff" : i === 0 ? "#ff3366" : "#ffcc00"}
              opacity={0.8}
              transparent
            />
          </mesh>
        ))}
        
        {/* Asas/painéis solares mais pronunciados */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 3, 0, 2]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[6, 0.1, 1.5]} />
              <meshStandardMaterial 
                color="#0f2027"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Luzes de navegação */}
            <mesh position={[0, 3, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial 
                color={side > 0 ? "#ff0000" : "#00ff00"}
                emissive={side > 0 ? "#ff0000" : "#00ff00"}
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        ))}
        
        {/* Motor quântico com efeitos visuais aprimorados */}
        <group position={[0, 0, 8]}>
          {/* Câmara do motor principal */}
          <mesh>
            <cylinderGeometry args={[1.8, 1.2, 2, 12]} />
            <meshStandardMaterial 
              color="#0a1525"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
          
          {/* Anéis do motor quântico */}
          {[0.5, 1, 1.5].map((pos, i) => (
            <mesh key={i} position={[0, 0, pos]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[1.5 - i * 0.1, 0.08, 16, 32]} />
              <meshStandardMaterial 
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={1.5 + enginePulse}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
          
          {/* Núcleo do motor com pulsação */}
          <mesh position={[0, 0, 1]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial 
              color="#a855f7"
              transparent
              opacity={0.7 + enginePulse * 0.3}
            />
          </mesh>
          
          {/* Luz do motor */}
          <pointLight 
            ref={engineGlowRef}
            color="#00ffff"
            intensity={2}
            distance={20}
            decay={2}
            position={[0, 0, 1]}
          />
          
          {/* Partículas dos propulsores */}
          <points ref={thrusterParticlesRef}>
            <bufferGeometry>
              <bufferAttribute 
                attach="attributes-position"
                count={300}
                array={new Float32Array(900).map((_, i) => {
                  const index = i % 3;
                  if (index === 0) return (Math.random() - 0.5) * 2; // x
                  if (index === 1) return (Math.random() - 0.5) * 2; // y
                  return Math.random() * 2; // z
                })}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial 
              color="#00b4ff"
              size={0.08}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              sizeAttenuation
            />
          </points>
        </group>
        
        {/* Controles interativos do cockpit - estilo MS Flight Simulator */}
        <group position={[0, 0.4, -1.4]}>
          {/* Joystick */}
          <mesh position={[0, -0.3, 0]} rotation={[Math.PI * 0.05 * (rotation.x / 0.5), 0, Math.PI * 0.05 * (rotation.z / 0.5)]}>
            <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={0.5} />
            </mesh>
          </mesh>
          
          {/* Throttle */}
          <mesh position={[0.5, -0.2, 0]} rotation={[0, 0, Math.PI * 0.25 * (speed / 10)]}>
            <boxGeometry args={[0.05, 0.25, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.08, 0.08, 0.08]} />
              <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.5} />
            </mesh>
          </mesh>
        </group>
        
        {/* Campo de proteção quântico visível - Estilo Roblox */}
        <mesh>
          <cylinderGeometry args={[2.5, 2.5, 10, 16]} />
          <meshPhysicalMaterial 
            color="#00b4ff"
            transparent
            opacity={0.1 + (shields / 100) * 0.2}
            transmission={0.9}
            thickness={0.5}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Identificação da nave */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          QS-VOYAGER
        </Text>
        
        {/* Efeitos de velocidade quando em movimento */}
        {speed > 2 && (
          <group>
            {/* Trilhas de luz de velocidade */}
            {[...Array(40)].map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const radius = 3 + Math.random() * 2;
              return (
                <mesh 
                  key={i} 
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    -15 + i * 0.5
                  ]}
                  rotation={[0, 0, angle]}
                >
                  <boxGeometry args={[0.02, 0.02, 3 * speed]} />
                  <meshBasicMaterial 
                    color="#00ffff"
                    transparent
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              );
            })}
          </group>
        )}
        
        {/* Luzes de status */}
        <group position={[0, 1.5, -2]}>
          {/* Status da energia */}
          <mesh position={[-0.5, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={energy > 50 ? "#00ff00" : energy > 25 ? "#ffff00" : "#ff0000"}
              emissive={energy > 50 ? "#00ff00" : energy > 25 ? "#ffff00" : "#ff0000"}
              emissiveIntensity={1}
            />
          </mesh>
          
          {/* Status dos escudos */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={shields > 50 ? "#00ff00" : shields > 25 ? "#ffff00" : "#ff0000"}
              emissive={shields > 50 ? "#00ff00" : shields > 25 ? "#ffff00" : "#ff0000"}
              emissiveIntensity={1}
            />
          </mesh>
          
          {/* Status do motor */}
          <mesh position={[0.5, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={speed > 0 ? "#00ff00" : "#ff0000"}
              emissive={speed > 0 ? "#00ff00" : "#ff0000"}
              emissiveIntensity={1 + enginePulse}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default CockpitView;

