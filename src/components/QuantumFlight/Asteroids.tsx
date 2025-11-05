import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

interface Asteroid {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  size: number;
  health: number;
  maxHealth: number;
  destroyed: boolean;
}

interface AsteroidsProps {
  onAsteroidDestroyed?: (asteroid: Asteroid, score: number) => void;
}

const Asteroids: React.FC<AsteroidsProps> = ({ onAsteroidDestroyed }) => {
  const { position: shipPosition, speed } = useGameStore();
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [explosions, setExplosions] = useState<Array<{ id: string; position: THREE.Vector3; time: number }>>([]);
  const groupRef = useRef<THREE.Group>(null);

  // Função para gerar asteroides
  const generateAsteroid = (id: string): Asteroid => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 300;
    const height = (Math.random() - 0.5) * 100;
    
    return {
      id,
      position: new THREE.Vector3(
        shipPosition.x + Math.cos(angle) * distance,
        shipPosition.y + height,
        shipPosition.z + Math.sin(angle) * distance
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 2
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      size: 2 + Math.random() * 4,
      health: 100,
      maxHealth: 100,
      destroyed: false
    };
  };

  // Inicializar asteroides
  useEffect(() => {
    const initialAsteroids: Asteroid[] = [];
    for (let i = 0; i < 15; i++) {
      initialAsteroids.push(generateAsteroid(`asteroid-${i}`));
    }
    setAsteroids(initialAsteroids);
  }, []);

  // Geometria e material dos asteroides
  const asteroidGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    // Adicionar variação nas formas
    const vertices = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < vertices.length; i += 3) {
      const variation = 0.3;
      vertices[i] += (Math.random() - 0.5) * variation;
      vertices[i + 1] += (Math.random() - 0.5) * variation;
      vertices[i + 2] += (Math.random() - 0.5) * variation;
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const asteroidMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B7355',
    metalness: 0.3,
    roughness: 0.8,
    envMapIntensity: 0.5
  }), []);

  // Função para causar dano ao asteroide
  const damageAsteroid = (asteroidId: string, damage: number) => {
    setAsteroids(prev => prev.map(asteroid => {
      if (asteroid.id === asteroidId && !asteroid.destroyed) {
        const newHealth = Math.max(0, asteroid.health - damage);
        if (newHealth <= 0) {
          // Asteroide destruído
          const score = Math.floor(asteroid.size * 10);
          onAsteroidDestroyed?.(asteroid, score);
          
          // Adicionar explosão
          setExplosions(prev => [...prev, {
            id: `explosion-${asteroidId}-${Date.now()}`,
            position: asteroid.position.clone(),
            time: 0
          }]);
          
          return { ...asteroid, health: 0, destroyed: true };
        }
        return { ...asteroid, health: newHealth };
      }
      return asteroid;
    }));
  };

  // Expor função para uso externo
  useEffect(() => {
    (window as any).damageAsteroid = damageAsteroid;
    return () => {
      delete (window as any).damageAsteroid;
    };
  }, []);

  useFrame((state, delta) => {
    // Atualizar posições e rotações dos asteroides
    setAsteroids(prev => prev.map(asteroid => {
      if (asteroid.destroyed) return asteroid;
      
      const newPosition = asteroid.position.clone().add(
        asteroid.velocity.clone().multiplyScalar(delta)
      );
      
      const newRotation = new THREE.Euler(
        asteroid.rotation.x + asteroid.rotationSpeed.x,
        asteroid.rotation.y + asteroid.rotationSpeed.y,
        asteroid.rotation.z + asteroid.rotationSpeed.z
      );
      
      // Respawn asteroide se estiver muito longe
      const distanceToShip = newPosition.distanceTo(shipPosition);
      if (distanceToShip > 500) {
        return generateAsteroid(asteroid.id);
      }
      
      return {
        ...asteroid,
        position: newPosition,
        rotation: newRotation
      };
    }));

    // Atualizar explosões
    setExplosions(prev => prev.map(explosion => ({
      ...explosion,
      time: explosion.time + delta
    })).filter(explosion => explosion.time < 2)); // Remover explosões antigas
  });

  return (
    <group ref={groupRef}>
      {/* Renderizar asteroides */}
      {asteroids.filter(asteroid => !asteroid.destroyed).map(asteroid => (
        <group key={asteroid.id} position={asteroid.position} rotation={asteroid.rotation}>
          <mesh
            geometry={asteroidGeometry}
            material={asteroidMaterial}
            scale={asteroid.size}
            userData={{ type: 'asteroid', id: asteroid.id, health: asteroid.health }}
          >
            {/* Barra de vida se danificado */}
            {asteroid.health < asteroid.maxHealth && (
              <group position={[0, asteroid.size + 1, 0]}>
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[2, 0.2]} />
                  <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
                </mesh>
                <mesh position={[(asteroid.health / asteroid.maxHealth - 1), 0, 0.01]}>
                  <planeGeometry args={[2 * (asteroid.health / asteroid.maxHealth), 0.2]} />
                  <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
                </mesh>
              </group>
            )}
          </mesh>
          
          {/* Efeito de brilho nos asteroides */}
          <pointLight
            color="#8B7355"
            intensity={0.2}
            distance={asteroid.size * 3}
            decay={2}
          />
        </group>
      ))}
      
      {/* Renderizar explosões */}
      {explosions.map(explosion => (
        <group key={explosion.id} position={explosion.position}>
          {/* Esfera de explosão */}
          <mesh>
            <sphereGeometry args={[explosion.time * 5, 16, 16]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(0.1, 1, 0.5)}
              transparent
              opacity={Math.max(0, 1 - explosion.time / 2)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Partículas da explosão */}
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={50}
                array={new Float32Array(150).map(() => (Math.random() - 0.5) * explosion.time * 10)}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              color={new THREE.Color().setHSL(0.1, 1, 0.7)}
              size={0.5}
              transparent
              opacity={Math.max(0, 1 - explosion.time / 2)}
              blending={THREE.AdditiveBlending}
              sizeAttenuation
            />
          </points>
          
          {/* Luz da explosão */}
          <pointLight
            color={new THREE.Color().setHSL(0.1, 1, 0.5)}
            intensity={Math.max(0, (2 - explosion.time) * 10)}
            distance={explosion.time * 20}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
};

export default Asteroids;
export type { Asteroid };

