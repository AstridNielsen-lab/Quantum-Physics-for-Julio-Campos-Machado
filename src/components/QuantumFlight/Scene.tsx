import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import Ship from './Ship';
import CockpitView from './CockpitView';
import EnemyWaves from './EnemyWaves';
import { useGameStore, PowerUpType } from '../../stores/gameStore';

// Visual effects for power-ups, damage, and shields
const VisualEffects = () => {
  const { position, shields, energy, powerUpType, powerUpActive, gameStatus } = useGameStore();
  const [damageEffect, setDamageEffect] = useState(0);
  const [shieldImpact, setShieldImpact] = useState(0);
  const lastShields = useRef(shields);
  const lastEnergy = useRef(energy);
  
  // Track shield and health changes to trigger visual effects
  useEffect(() => {
    if (shields < lastShields.current) {
      setShieldImpact(1.0); // Start shield impact effect
      setTimeout(() => setShieldImpact(0), 300); // Fade out after 300ms
    }
    lastShields.current = shields;
    
    if (energy < lastEnergy.current) {
      setDamageEffect(1.0); // Start damage effect
      setTimeout(() => setDamageEffect(0), 500); // Fade out after 500ms
    }
    lastEnergy.current = energy;
  }, [shields, energy]);
  
  // Skip rendering if game is not playing
  if (gameStatus !== 'playing') return null;
  
  return (
    <group position={position}>
      {/* Shield impact effect */}
      {shieldImpact > 0 && (
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial 
            color="#00b4ff"
            transparent
            opacity={shieldImpact * 0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* Damage effect (red flash) */}
      {damageEffect > 0 && (
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshBasicMaterial 
            color="#ff3366"
            transparent
            opacity={damageEffect * 0.5}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Power-up indicators */}
      {powerUpActive && (
        <>
          <mesh>
            <ringGeometry args={[2, 2.2, 32]} />
            <meshBasicMaterial 
              color={
                powerUpType === 'rapidFire' ? '#ffcc00' :
                powerUpType === 'spreadShot' ? '#00b4ff' :
                powerUpType === 'quantumShield' ? '#22d3ee' :
                '#a855f7'
              }
              transparent
              opacity={0.7 + Math.sin(Date.now() * 0.01) * 0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.4}
            color={
              powerUpType === 'rapidFire' ? '#ffcc00' :
              powerUpType === 'spreadShot' ? '#00b4ff' :
              powerUpType === 'quantumShield' ? '#22d3ee' :
              '#a855f7'
            }
            anchorX="center"
            anchorY="middle"
          >
            {powerUpType === 'rapidFire' ? 'RAPID FIRE' :
             powerUpType === 'spreadShot' ? 'SPREAD SHOT' :
             powerUpType === 'quantumShield' ? 'QUANTUM SHIELD' :
             'POWER UP'}
          </Text>
        </>
      )}
    </group>
  );
};

// Player input handler for Space Invaders-style controls
const PlayerControls = () => {
  const { 
    position, 
    moveLeft, 
    moveRight, 
    fireWeapon, 
    activatePowerUp,
    gameStatus,
    startGame,
    pauseGame
  } = useGameStore();
  
  // Track key states to prevent key repeat issues
  const keyStates = useRef({
    left: false,
    right: false,
    fire: false,
    shield: false,
    weaponSwitch: false
  });
  
  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing' && e.code === 'Enter') {
        startGame();
        return;
      }
      
      if (gameStatus !== 'playing') return;
      
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          if (!keyStates.current.left) {
            keyStates.current.left = true;
            moveLeft();
          }
          break;
          
        case 'ArrowRight':
        case 'KeyD':
          if (!keyStates.current.right) {
            keyStates.current.right = true;
            moveRight();
          }
          break;
          
        case 'Space':
          if (!keyStates.current.fire) {
            keyStates.current.fire = true;
            fireWeapon();
            
            // Call the firing function from EnemyWaves component
            if (window.enemyWavesPlayerFire) {
              (window as any).enemyWavesPlayerFire(
                position.clone().add(new THREE.Vector3(0, 0, -3)),
                new THREE.Vector3(0, 0, -1)
              );
            }
          }
          break;
          
        case 'ShiftLeft':
        case 'ShiftRight':
          if (!keyStates.current.shield) {
            keyStates.current.shield = true;
            activatePowerUp('quantumShield');
          }
          break;
          
        case 'Tab':
          if (!keyStates.current.weaponSwitch) {
            keyStates.current.weaponSwitch = true;
            // Cycle between weapon types
            const weapons: PowerUpType[] = ['rapidFire', 'spreadShot', null];
            const currentIndex = weapons.indexOf(useGameStore.getState().powerUpType);
            const nextWeapon = weapons[(currentIndex + 1) % weapons.length];
            activatePowerUp(nextWeapon);
          }
          break;
          
        case 'Escape':
          pauseGame();
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keyStates.current.left = false;
          break;
          
        case 'ArrowRight':
        case 'KeyD':
          keyStates.current.right = false;
          break;
          
        case 'Space':
          keyStates.current.fire = false;
          break;
          
        case 'ShiftLeft':
        case 'ShiftRight':
          keyStates.current.shield = false;
          break;
          
        case 'Tab':
          keyStates.current.weaponSwitch = false;
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus]);
  
  return null;
};

// Camera controller for tactical Space Invaders view
const CameraController = () => {
  const { camera } = useThree();
  const { position, speed, zoom, gameStatus } = useGameStore();
  const cameraPositionRef = useRef(new THREE.Vector3(0, 20, 20));
  
  useFrame((state, delta) => {
    // Space Invaders style camera for tactical view
    const targetPosition = new THREE.Vector3(
      position.x,
      position.y + 15 + (zoom * 0.3), // Higher up for tactical view
      position.z + 20             // Further back to see enemy formations
    );
    
    // Use delta time for frame-rate independent movement
    cameraPositionRef.current.lerp(targetPosition, delta * 3);
    camera.position.copy(cameraPositionRef.current);
    
    // Point camera down at an angle for better tactical view
    const lookAtPos = new THREE.Vector3(
      position.x,
      position.y - 5,
      position.z - 30 // Look ahead to see approaching enemies
    );
    camera.lookAt(lookAtPos);

    // Camera shake on hits or when firing
    if (speed > 1 || gameStatus === 'playing') {
      const time = state.clock.getElapsedTime();
      const shakeIntensity = Math.min(speed * 0.01, 0.1);
      camera.position.y += Math.sin(time * 10) * shakeIntensity;
      camera.position.x += Math.cos(time * 15) * shakeIntensity * 0.5;
    }
  });

  return null;
};

const SpaceEnvironment = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { speed } = useGameStore();
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      // Frame-rate independent star movement
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const speedFactor = speed * delta * 30;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += speedFactor;
        if (positions[i + 2] > 100) positions[i + 2] = -100;
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;
      starsRef.current.rotation.z += delta * speed * 0.01;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={speed > 1 ? 8000 : 5000}
        factor={6}
        saturation={0.8}
        fade
        speed={1}
      />
      
      <mesh position={[0, 0, -500]}>
        <sphereGeometry args={[400, 64, 64]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={0.2 + speed * 0.15}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {speed > 1 && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1000}
              array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 100)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#22d3ee"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      )}

      {speed > 1 && (
        <group>
          {[...Array(60)].map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 30,
              -20 - i * 2
            ]}>
              <boxGeometry args={[0.05, 0.1, 3 * speed]} />
              <meshBasicMaterial 
                color="#00b4ff"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
          {[...Array(30)].map((_, i) => (
            <mesh key={`bright-${i}`} position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15,
              -10 - i * 1.5
            ]}>
              <boxGeometry args={[0.08, 0.08, 4 * speed]} />
              <meshBasicMaterial 
                color="#ffcc00"
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

const Scene = () => {
  const { 
    zoom, 
    setZoom, 
    speed, 
    gameStatus, 
    lives,
    level,
    score,
    startGame,
    powerUpType,
    updatePowerUpDuration
  } = useGameStore();

  const handleWheel = (event: WheelEvent) => {
    const zoomSpeed = 0.05;
    const newZoom = Math.max(5, Math.min(20, zoom + event.deltaY * zoomSpeed));
    setZoom(newZoom);
  };

  // Update game state
  useFrame((state, delta) => {
    // Update power-up duration
    if (powerUpType) {
      updatePowerUpDuration(delta);
    }
  });

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoom]);
  
  // Show game start screen if not playing
  useEffect(() => {
    if (gameStatus === 'ready') {
      const handleStart = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
          startGame();
        }
      };
      
      window.addEventListener('keydown', handleStart);
      return () => window.removeEventListener('keydown', handleStart);
    }
  }, [gameStatus]);

  return (
    <Canvas
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      }}
      dpr={[1, 2]} // Optimize for performance and quality
      performance={{ min: 0.5 }} // Allow frame drops for smoother overall experience
    >
      <PerspectiveCamera makeDefault position={[0, 20, 20]} zoom={zoom} fov={60} />
      <CameraController />
      <PlayerControls />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      <SpaceEnvironment />
      <Ship />
      <EnemyWaves 
        onEnemyDestroyed={(points) => {
          // Add visual effects for destroyed enemies here if needed
        }}
        onPlayerHit={() => {
          // Add visual effects for player hits here if needed
        }}
      />
      <VisualEffects />
      
      {/* Game start overlay */}
      {gameStatus === 'ready' && (
        <group position={[0, 0, -20]}>
          <Text 
            position={[0, 5, 0]}
            fontSize={2}
            color="#00b4ff"
            anchorX="center"
            anchorY="middle"
          >
            QUANTUM INVADERS
          </Text>
          <Text 
            position={[0, 2, 0]}
            fontSize={1}
            color="#ffcc00"
            anchorX="center"
            anchorY="middle"
          >
            Press ENTER to Start
          </Text>
          <Text 
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Controls: Arrow Keys or A/D to move, SPACE to fire
          </Text>
          <Text 
            position={[0, -1, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            SHIFT for shields, TAB to change weapons
          </Text>
        </group>
      )}
      
      {/* Game over overlay */}
      {gameStatus === 'gameOver' && (
        <group position={[0, 0, -20]}>
          <Text 
            position={[0, 5, 0]}
            fontSize={2}
            color="#ff3366"
            anchorX="center"
            anchorY="middle"
          >
            GAME OVER
          </Text>
          <Text 
            position={[0, 2, 0]}
            fontSize={1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Score: {score}
          </Text>
          <Text 
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#ffcc00"
            anchorX="center"
            anchorY="middle"
          >
            Press ENTER to Play Again
          </Text>
        </group>
      )}
      
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.3} // Lower threshold to make more elements glow
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          offset={[0.005 * Math.min(1.5, Math.abs(speed) * 0.4), 0.005 * Math.min(1.5, Math.abs(speed) * 0.4)]}
          blendFunction={BlendFunction.NORMAL}
        />
        <Vignette
          darkness={0.6}
          offset={0.2}
        />
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.02}
          bokehScale={2} // Reduced for clearer tactical view
        />
      </EffectComposer>

      <fog attach="fog" args={['#000000', 50, 400]} />
    </Canvas>
  );
};

export default Scene;