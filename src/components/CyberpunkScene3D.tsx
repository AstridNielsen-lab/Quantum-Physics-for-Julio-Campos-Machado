import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CrystalModelProps {
  isActive?: boolean;
}

interface LaserBeamProps {
  power?: number;
  isActive?: boolean;
}

interface AnimatedElectronsProps {
  isActive?: boolean;
  fieldStrength?: number;
}

interface MagneticFieldProps {
  strength?: number;
  isActive?: boolean;
}

interface CyberpunkScene3DProps {
  showCrystal?: boolean;
  showLaser?: boolean;
  showElectrons?: boolean;
  showField?: boolean;
  laserPower?: number;
  fieldStrength?: number;
}

const CrystalModel: React.FC<CrystalModelProps> = ({ isActive = true }) => {
  const crystalRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  useFrame((state) => {
    if (!crystalRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    crystalRef.current.rotation.y = time * 0.1;
    crystalRef.current.rotation.z = time * 0.05;
    
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
    }
  });
  
  if (!isActive) return null;
  
  return (
    <group ref={crystalRef} position={[0, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0, 2, 4, 6, 1]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color="#a855f7" 
          transmission={0.9}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={2.5}
          thickness={0.5}
          emissive="#a855f7"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <lineSegments>
        <edgesGeometry args={[new THREE.CylinderGeometry(0, 2, 4, 6, 3)]} />
        <lineBasicMaterial color="#a855f7" transparent opacity={0.5} />
      </lineSegments>
      
      <points>
        <sphereGeometry args={[1.5, 16, 16]} />
        <pointsMaterial 
          color="#a855f7" 
          size={0.05} 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const LaserBeam: React.FC<LaserBeamProps> = ({ power = 5, isActive = true }) => {
  const laserRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!laserRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    if (laserRef.current.material instanceof THREE.Material) {
      laserRef.current.material.opacity = 0.6 + Math.sin(time * 5) * 0.2;
    }
    laserRef.current.scale.x = 0.1 + (power / 20);
    laserRef.current.scale.z = 0.1 + (power / 20);
  });
  
  if (!isActive) return null;
  
  return (
    <mesh ref={laserRef} position={[-6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.1, 0.1, 12, 16]} />
      <meshBasicMaterial 
        color={power > 10 ? "#ec4899" : "#ec4899"} 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const AnimatedElectrons: React.FC<AnimatedElectronsProps> = ({ isActive = true, fieldStrength = 5 }) => {
  const electronsRef = useRef<THREE.Group>(null);
  const electronCount = 50;
  const electrons = Array.from({ length: electronCount }).map((_, i) => ({
    id: i,
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
    size: Math.random() * 0.1 + 0.05
  }));
  
  useFrame((state) => {
    if (!electronsRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    electronsRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && index < electrons.length) {
        const electron = electrons[index];
        
        const fieldEffect = fieldStrength * 0.01;
        electron.velocity.x += Math.sin(time + electron.id) * fieldEffect;
        electron.velocity.y += Math.cos(time + electron.id) * fieldEffect;
        electron.velocity.z += Math.sin(time * 0.5 + electron.id) * fieldEffect;
        
        electron.position.add(electron.velocity);
        
        if (electron.position.length() > 5) {
          electron.position.normalize().multiplyScalar(5);
          electron.velocity.negate().multiplyScalar(0.8);
        }
        
        child.position.copy(electron.position);
      }
    });
  });
  
  if (!isActive) return null;
  
  return (
    <group ref={electronsRef}>
      {electrons.map((electron, index) => (
        <mesh key={`electron-${index}`} position={electron.position.toArray()}>
          <sphereGeometry args={[electron.size, 16, 16]} />
          <meshBasicMaterial 
            color="#22d3ee" 
            transparent 
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

const MagneticField: React.FC<MagneticFieldProps> = ({ strength = 10, isActive = true }) => {
  const fieldRef = useRef<THREE.Group>(null);
  const linesCount = 20;
  
  useFrame((state) => {
    if (!fieldRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    fieldRef.current.rotation.y = time * 0.1 * strength / 10;
  });
  
  if (!isActive) return null;
  
  return (
    <group ref={fieldRef}>
      {Array.from({ length: linesCount }).map((_, i) => {
        const radius = 4 - i * 0.1;
        
        return (
          <mesh key={`field-${i}`} position={[0, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshBasicMaterial 
              color={`hsl(${280 + i * 2}, 100%, 50%)`} 
              transparent 
              opacity={0.3 + (strength / 30)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const CyberpunkScene3D: React.FC<CyberpunkScene3DProps> = ({ 
  showCrystal = true,
  showLaser = true,
  showElectrons = true,
  showField = true,
  laserPower = 10,
  fieldStrength = 10
}) => {
  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <CrystalModel isActive={showCrystal} />
        <LaserBeam power={laserPower} isActive={showLaser} />
        <AnimatedElectrons isActive={showElectrons} fieldStrength={fieldStrength} />
        <MagneticField strength={fieldStrength} isActive={showField} />
        
        <OrbitControls enableZoom={true} enablePan={true} />
        
        <gridHelper args={[20, 20, '#a855f7', '#1a1a2e']} />
        
        <points>
          <sphereGeometry args={[50, 64, 64]} />
          <pointsMaterial 
            size={0.15} 
            color="#a855f7" 
            transparent 
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </Canvas>
    </div>
  );
};

export default CyberpunkScene3D;