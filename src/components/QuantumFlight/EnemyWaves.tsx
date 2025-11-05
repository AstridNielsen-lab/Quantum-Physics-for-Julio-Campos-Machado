import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, GameStatus } from '../../stores/gameStore';

// Define enemy types with different properties
enum EnemyType {
  BASIC = 'basic',    // Basic enemy - lowest row
  STANDARD = 'standard', // Standard enemy - middle rows
  ELITE = 'elite',    // Elite enemy - top row
  COMMANDER = 'commander' // Special enemy - appears occasionally
}

// Enemy state
enum EnemyState {
  IDLE = 'idle',
  ACTIVE = 'active',
  DAMAGED = 'damaged',
  TELEPORTING = 'teleporting',
  DYING = 'dying',
  DEAD = 'dead'
}

// Wave movement direction
enum WaveDirection {
  LEFT = 'left',
  RIGHT = 'right',
  DOWN = 'down'
}

// Enemy interface
interface Enemy {
  id: string;
  type: EnemyType;
  row: number;
  column: number;
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  state: EnemyState;
  health: number;
  maxHealth: number;
  hasShield: boolean;
  points: number;
  lastShotTime: number;
  teleportPhase: number; // For teleport animation
}

// Projectile interface
interface Projectile {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  damage: number;
  isEnemyProjectile: boolean;
  color: string;
  size: number;
}

// Props for the component
interface EnemyWavesProps {
  onEnemyDestroyed?: (points: number) => void;
  onPlayerHit?: () => void;
}

const EnemyWaves: React.FC<EnemyWavesProps> = ({ onEnemyDestroyed, onPlayerHit }) => {
  // Get state and methods from game store
  const { 
    position: playerPosition,
    level, 
    gameStatus, 
    addScore,
    setEnemyCount,
    loseLife,
    shields,
    setShields,
    energy,
    setEnergy
  } = useGameStore();
  
  // Local state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [waveDirection, setWaveDirection] = useState<WaveDirection>(WaveDirection.RIGHT);
  const [moveTimer, setMoveTimer] = useState(0);
  const [formationAdvanceTimer, setFormationAdvanceTimer] = useState(0);
  const [boundaryLeft, setBoundaryLeft] = useState(-15);
  const [boundaryRight, setBoundaryRight] = useState(15);
  const [explosions, setExplosions] = useState<{id: string, position: THREE.Vector3, time: number}[]>([]);
  
  // Refs
  const waveRef = useRef<THREE.Group>(null);
  const lastUpdateTime = useRef(Date.now());
  
  // Wave configuration based on level
  const getWaveConfig = () => {
    const baseSpeed = 1.0; // Base movement speed
    const baseAdvanceTime = 10; // Seconds between advancing
    const baseFireRate = 0.5; // Base fire rate (shots per second)
    
    return {
      // Formation size - increases with level
      rows: Math.min(5, 3 + Math.floor(level / 3)),
      columns: Math.min(10, 6 + Math.floor(level / 2)),
      
      // Spacing between enemies
      spacing: 2.5,
      
      // Movement speed increases with level
      moveSpeed: baseSpeed * (1 + level * 0.1),
      
      // Time between formation advances (decreases with level)
      advanceTime: Math.max(3, baseAdvanceTime - level * 0.5),
      
      // Distance to advance
      advanceDistance: 1.0,
      
      // Enemy fire rate increases with level
      fireRate: baseFireRate * (1 + level * 0.2),
      
      // Chance for enemies to have shields
      shieldChance: Math.min(0.5, 0.1 + level * 0.05),
      
      // Enemy starting z position
      startingZ: -50
    };
  };
  
  // Initialize enemies for a new wave
  const initializeWave = () => {
    const config = getWaveConfig();
    const newEnemies: Enemy[] = [];
    
    // Create grid of enemies
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.columns; col++) {
        // Determine enemy type based on row
        let type: EnemyType;
        if (row === 0) {
          type = EnemyType.ELITE;
        } else if (row < 3) {
          type = EnemyType.STANDARD;
        } else {
          type = EnemyType.BASIC;
        }
        
        // Add commander instead of elite occasionally
        if (row === 0 && col === Math.floor(config.columns / 2) && level > 2 && Math.random() < 0.5) {
          type = EnemyType.COMMANDER;
        }
        
        // Calculate position
        const xPos = (col - (config.columns - 1) / 2) * config.spacing;
        const zPos = config.startingZ - (row * config.spacing);
        const position = new THREE.Vector3(xPos, 0, zPos);
        
        // Determine enemy properties based on type
        const baseHealth = 
          type === EnemyType.BASIC ? 10 :
          type === EnemyType.STANDARD ? 20 :
          type === EnemyType.ELITE ? 30 :
          50; // Commander
        
        const points = 
          type === EnemyType.BASIC ? 10 :
          type === EnemyType.STANDARD ? 20 :
          type === EnemyType.ELITE ? 30 :
          100; // Commander
        
        // Chance to have shields based on type and level
        const hasShield = 
          type === EnemyType.ELITE ? Math.random() < config.shieldChance * 1.5 :
          type === EnemyType.COMMANDER ? true :
          Math.random() < config.shieldChance;
        
        // Add enemy to array
        newEnemies.push({
          id: `enemy-${row}-${col}-${Date.now()}`,
          type,
          row,
          column: col,
          position,
          originalPosition: position.clone(),
          state: EnemyState.IDLE,
          health: baseHealth * (1 + level * 0.1),
          maxHealth: baseHealth * (1 + level * 0.1),
          hasShield,
          points,
          lastShotTime: 0,
          teleportPhase: 0
        });
      }
    }
    
    // Update enemy count in store
    setEnemyCount(newEnemies.length);
    
    // Set initial states
    setEnemies(newEnemies);
    setWaveDirection(WaveDirection.RIGHT);
    setMoveTimer(0);
    setFormationAdvanceTimer(0);
  };
  
  // Activate enemies with teleport effect
  const activateEnemies = () => {
    // Delay activation of each enemy for teleport effect
    let delay = 0;
    
    const newEnemies = [...enemies];
    
    for (let row = 0; row < getWaveConfig().rows; row++) {
      for (let col = 0; col < getWaveConfig().columns; col++) {
        const index = newEnemies.findIndex(e => e.row === row && e.column === col);
        if (index !== -1) {
          setTimeout(() => {
            setEnemies(prev => prev.map((enemy, i) => 
              i === index ? {...enemy, state: EnemyState.TELEPORTING, teleportPhase: 0} : enemy
            ));
            
            // After teleport animation, set to active
            setTimeout(() => {
              setEnemies(prev => prev.map((enemy, i) => 
                i === index ? {...enemy, state: EnemyState.ACTIVE} : enemy
              ));
            }, 1000);
          }, delay);
          
          delay += 100; // Staggered activation
        }
      }
    }
  };
  
  // Initialize wave when component mounts or level changes
  useEffect(() => {
    initializeWave();
    // Activate with delay to show teleport effect
    setTimeout(activateEnemies, 1000);
    
    // Setup boundary for wave movement
    setBoundaryLeft(-15);
    setBoundaryRight(15);
  }, [level]);
  
  // Enemy fire function
  const enemyFire = (enemy: Enemy) => {
    const now = Date.now();
    const config = getWaveConfig();
    
    // Determine if enemy can fire (cooldown)
    const fireInterval = 1000 / config.fireRate;
    if (now - enemy.lastShotTime < fireInterval) {
      return;
    }
    
    // Calculate projectile direction toward player with slight randomness
    const direction = new THREE.Vector3(
      playerPosition.x - enemy.position.x + (Math.random() - 0.5) * 2,
      playerPosition.y - enemy.position.y,
      playerPosition.z - enemy.position.z
    ).normalize();
    
    // Create projectile
    const projectile: Projectile = {
      id: `enemy-projectile-${Date.now()}-${enemy.id}`,
      position: enemy.position.clone().add(new THREE.Vector3(0, 0, 2)),
      velocity: direction.multiplyScalar(25),
      damage: enemy.type === EnemyType.COMMANDER ? 25 : 10,
      isEnemyProjectile: true,
      color: getEnemyColor(enemy.type),
      size: enemy.type === EnemyType.COMMANDER ? 0.5 : 0.3
    };
    
    // Add projectile and update enemy's last shot time
    setProjectiles(prev => [...prev, projectile]);
    setEnemies(prev => prev.map(e => 
      e.id === enemy.id ? {...e, lastShotTime: now} : e
    ));
    
    // Play sound effect
    playSound('enemyShot');
  };
  
  // Player fire function (called from parent component)
  const playerFire = (position: THREE.Vector3, direction: THREE.Vector3, damage: number = 10) => {
    // Create projectile
    const projectile: Projectile = {
      id: `player-projectile-${Date.now()}`,
      position: position.clone(),
      velocity: direction.clone().normalize().multiplyScalar(40),
      damage,
      isEnemyProjectile: false,
      color: '#00b4ff',
      size: 0.3
    };
    
    // Add projectile
    setProjectiles(prev => [...prev, projectile]);
    
    // Play sound
    playSound('playerShot');
  };
  
  // Damage enemy function
  const damageEnemy = (enemyId: string, damage: number) => {
    setEnemies(prev => prev.map(enemy => {
      if (enemy.id === enemyId) {
        if (enemy.hasShield) {
          // Destroy shield but no damage
          playSound('shieldHit');
          return {
            ...enemy,
            hasShield: false,
            state: EnemyState.DAMAGED
          };
        } else {
          // Apply damage
          const newHealth = enemy.health - damage;
          
          if (newHealth <= 0) {
            // Enemy destroyed
            playSound('explosion');
            
            // Add score
            addScore(enemy.points);
            if (onEnemyDestroyed) onEnemyDestroyed(enemy.points);
            
            // Update enemy count
            setEnemyCount(prev => prev - 1);
            
            // Add explosion effect
            setExplosions(prev => [...prev, {
              id: `explosion-${Date.now()}-${enemy.id}`,
              position: enemy.position.clone(),
              time: 0
            }]);
            
            // Mark as dying (will be removed after explosion animation)
            return {
              ...enemy,
              health: 0,
              state: EnemyState.DYING
            };
          } else {
            // Just damaged
            playSound('enemyHit');
            return {
              ...enemy,
              health: newHealth,
              state: EnemyState.DAMAGED
            };
          }
        }
      }
      return enemy;
    }));
  };
  
  // Helper function to get enemy color based on type
  const getEnemyColor = (type: EnemyType): string => {
    switch (type) {
      case EnemyType.BASIC:
        return '#00b4ff'; // Cyan
      case EnemyType.STANDARD:
        return '#ffcc00'; // Yellow
      case EnemyType.ELITE:
        return '#ff3366'; // Red
      case EnemyType.COMMANDER:
        return '#a855f7'; // Purple
      default:
        return '#00b4ff';
    }
  };
  
  // Play sound effects
  const playSound = (type: 'playerShot' | 'enemyShot' | 'enemyHit' | 'shieldHit' | 'explosion' | 'playerHit') => {
    const audio = new Audio();
    
    switch (type) {
      case 'playerShot':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEgBkGY3/LTeyYEKHnL8N2QRAoTXrXp66hVFAhJnt/ywmMgBT6U2+/Ufi4ELIHQztiSIHI=';
        break;
      case 'enemyShot':
        audio.src = 'data:audio/wav;base64,UklGRmoFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUYFAAAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM8wAAP9eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5e';
        break;
      case 'enemyHit':
        audio.src = 'data:audio/wav;base64,UklGRt4DAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YboDAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgH9/f3+AgICAgH9/gICBgX9/fn+BgYCAf3+AgIGBgIB/f4CBgYGAf39/gIGBgIB/f3+AgYGAgH9/f4CBgYCAf39/gIGBgIB/f3+AgYGAgH9/f4CBgYCAf39/gIGBgIB/f3+AgYGAgH9/f4CBgYCAf39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f39/gIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgIGBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f39/gICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f3+AgICBgIB/f39/gICBgIB/f39/gA==';
        break;
      case 'shieldHit':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEgBkGY3/LTeyYEKHnL8N2QRAoTXrXp66hVFAhJnt/ywmMgBT6U2+/Ufi4ELIHQztiSIHI=';
        break;
      case 'explosion':
        audio.src = 'data:audio/wav;base64,UklGRjQHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAG';
        break;
      case 'playerHit':
        audio.src = 'data:audio/wav;base64,UklGRlgFAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YTQFAAB+gIKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/';
        break;
    }
    
    audio.volume = 0.3;
    audio.play().catch(e => console.error("Audio error:", e));
  };
  
  // Update loop
  useFrame((state, delta) => {
    // Only update if game is playing
    if (gameStatus !== 'playing') return;
    
    const now = Date.now();
    const elapsedTime = (now - lastUpdateTime.current) / 1000;
    lastUpdateTime.current = now;
    
    const config = getWaveConfig();
    
    // Update move timer
    setMoveTimer(prevTimer => {
      const newTimer = prevTimer + delta;
      
      // Move formation at regular intervals
      if (newTimer >= 1 / config.moveSpeed) {
        // Calculate furthest left and right enemies
        let leftmost = Infinity;
        let rightmost = -Infinity;
        
        enemies.forEach(enemy => {
          if (enemy.state === EnemyState.ACTIVE || enemy.state === EnemyState.DAMAGED) {
            leftmost = Math.min(leftmost, enemy.position.x);
            rightmost = Math.max(rightmost, enemy.position.x);
          }
        });
        
        // Check if formation needs to change direction
        let newDirection = waveDirection;
        let shouldAdvance = false;
        
        if (waveDirection === WaveDirection.RIGHT && rightmost >= boundaryRight) {
          newDirection = WaveDirection.LEFT;
          shouldAdvance = true;
        } else if (waveDirection === WaveDirection.LEFT && leftmost <= boundaryLeft) {
          newDirection = WaveDirection.RIGHT;
          shouldAdvance = true;
        }
        
        if (shouldAdvance) {
          setWaveDirection(newDirection);
          setFormationAdvanceTimer(1); // Start advance
        }
        
        // Move enemies
        setEnemies(prev => prev.map(enemy => {
          // Skip inactive or dead enemies
          if (enemy.state !== EnemyState.ACTIVE && enemy.state !== EnemyState.DAMAGED) {
            return enemy;
          }
          
          const newPosition = enemy.position.clone();
          
          // Advance formation if needed
          if (formationAdvanceTimer > 0) {
            newPosition.z += config.advanceDistance;
          } 
          // Otherwise move sideways
          else if (waveDirection === WaveDirection.RIGHT) {
            newPosition.x += 0.2 * config.moveSpeed;
          } else if (waveDirection === WaveDirection.LEFT) {
            newPosition.x -= 0.2 * config.moveSpeed;
          }
          
          // Add slight hover movement
          newPosition.y = Math.sin(now * 0.001 + enemy.column * 0.5) * 0.2;
          
          return {
            ...enemy,
            position: newPosition,
            // Reset damaged state after a short time
            state: enemy.state === EnemyState.DAMAGED && now - lastUpdateTime.current > 200 
              ? EnemyState.ACTIVE 
              : enemy.state
          };
        }));
        
        return 0; // Reset timer
      }
      
      return newTimer;
    });
    
    // Update formation advance timer
    if (formationAdvanceTimer > 0) {
      setFormationAdvanceTimer(prevTimer => Math.max(0, prevTimer - delta * 2));
    }
    
    // Update wave advance timer (move entire formation forward periodically)
    setFormationAdvanceTimer(prevTimer => {
      if (prevTimer <= 0) {
        const advanceProbability = delta * (1 / config.advanceTime);
        if (Math.random() < advanceProbability) {
          return 1; // Start advance
        }
      }
      return Math.max(0, prevTimer - delta);
    });
    
    // Update enemies for random firing and teleport animations
    setEnemies(prev => prev.map(enemy => {
      // Only active enemies can fire
      if (enemy.state === EnemyState.ACTIVE) {
        // Chance to fire based on level and type
        const fireChance = delta * config.fireRate * 
          (enemy.type === EnemyType.COMMANDER ? 0.05 : 
           enemy.type === EnemyType.ELITE ? 0.03 : 
           enemy.type === EnemyType.STANDARD ? 0.01 : 0.005);
        
        if (Math.random() < fireChance) {
          enemyFire(enemy);
        }
      }
      
      // Update teleport animation
      if (enemy.state === EnemyState.TELEPORTING) {
        const newPhase = enemy.teleportPhase + delta * 2;
        
        // Complete teleport after animation
        if (newPhase >= 1) {
          return {
            ...enemy,
            state: EnemyState.ACTIVE,
            teleportPhase: 0
          };
        }
        
        return {
          ...enemy,
          teleportPhase: newPhase
        };
      }
      
      // Check if enemy has reached player position
      if ((enemy.state === EnemyState.ACTIVE || enemy.state === EnemyState.DAMAGED) && 
          enemy.position.z >= playerPosition.z - 5) {
        // Enemy reached player - player loses life
        loseLife();
        playSound('playerHit');
        
        // Mark enemy as dying
        return {
          ...enemy,
          state: EnemyState.DYING
        };
      }
      
      return enemy;
    }));
    
    // Update projectiles
    setProjectiles(prev => {
      const updatedProjectiles = prev.map(projectile => {
        // Move projectile
        const newPosition = projectile.position.clone().add(
          projectile.velocity.clone().multiplyScalar(delta)
        );
        
        return {
          ...projectile,
          position: newPosition
        };
      });
      
      // Remove projectiles that have gone too far
      return updatedProjectiles.filter(projectile => {
        const maxDistance = 200;
        return Math.abs(projectile.position.z - playerPosition.z) < maxDistance;
      });
    });
    
    // Check for collisions
    projectiles.forEach(projectile => {
      // Player projectiles hitting enemies
      if (!projectile.isEnemyProjectile) {
        enemies.forEach(enemy => {
          if (enemy.state === EnemyState.ACTIVE || enemy.state === EnemyState.DAMAGED) {
            const distance = projectile.position.distanceTo(enemy.position);
            const hitThreshold = 1.0; // Adjust based on enemy size
            
            if (distance < hitThreshold) {
              // Remove projectile
              setProjectiles(prev => prev.filter(p => p.id !== projectile.id));
              
              // Damage enemy
              damageEnemy(enemy.id, projectile.damage);
            }
          }
        });
      }
      // Enemy projectiles hitting player
      else {
        const distance = projectile.position.distanceTo(playerPosition);
        const hitThreshold = 2.0; // Player hitbox
        
        if (distance < hitThreshold) {
          // Remove projectile
          setProjectiles(prev => prev.filter(p => p.id !== projectile.id));
          
          if (shields > 0) {
            // Damage shields
            setShields(Math.max(0, shields - projectile.damage));
            playSound('shieldHit');
          } else {
            // Player hit
            loseLife();
            setEnergy(Math.max(0, energy - projectile.damage));
            playSound('playerHit');
            
            if (onPlayerHit) onPlayerHit();
          }
        }
      }
    });
    
    // Update explosions
    setExplosions(prev => {
      return prev.map(explosion => ({
        ...explosion,
        time: explosion.time + delta
      })).filter(explosion => explosion.time < 1.5); // Remove old explosions
    });
    
    // After explosions finish, remove dead enemies
    if (explosions.length > 0) {
      setEnemies(prev => prev.filter(enemy => 
        enemy.state !== EnemyState.DYING || 
        !explosions.some(e => e.time > 1.0 && e.position.equals(enemy.position))
      ));
    }
  });
  
  // Expose player fire function to parent
  useEffect(() => {
    (window as any).enemyWavesPlayerFire = playerFire;
    return () => {
      delete (window as any).enemyWavesPlayerFire;
    };
  }, []);
  
  return (
    <group ref={waveRef}>
      {/* Render enemies */}
      {enemies.map(enemy => (
        <group key={enemy.id} position={enemy.position}>
          {/* Skip rendering for DEAD state */}
          {enemy.state !== EnemyState.DEAD && (
            <>
              {/* Enemy model based on type */}
              <mesh visible={enemy.state !== EnemyState.TELEPORTING || enemy.teleportPhase > 0.5}>
                {/* Different geometry based on enemy type */}
                {enemy.type === EnemyType.BASIC && <boxGeometry args={[1, 0.5, 1]} />}
                {enemy.type === EnemyType.STANDARD && <tetrahedronGeometry args={[0.7]} />}
                {enemy.type === EnemyType.ELITE && <octahedronGeometry args={[0.7]} />}
                {enemy.type === EnemyType.COMMANDER && <dodecahedronGeometry args={[0.8]} />}
                
                <meshStandardMaterial 
                  color={getEnemyColor(enemy.type)}
                  emissive={getEnemyColor(enemy.type)}
                  emissiveIntensity={enemy.state === EnemyState.DAMAGED ? 2 : 0.5}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              
              {/* Quantum shield effect */}
              {enemy.hasShield && (
                <mesh>
                  <sphereGeometry args={[1.2, 16, 16]} />
                  <meshPhysicalMaterial 
                    color="#67e8f9"
                    transparent
                    opacity={0.3}
                    transmission={0.9}
                    thickness={0.5}
                    roughness={0.1}
                    metalness={0.9}
                  />
                </mesh>
              )}
              
              {/* Teleportation effect */}
              {enemy.state === EnemyState.TELEPORTING && (
                <>
                  <mesh scale={[
                    enemy.teleportPhase < 0.5 ? enemy.teleportPhase * 2 : (1 - enemy.teleportPhase) * 2,
                    enemy.teleportPhase < 0.5 ? enemy.teleportPhase * 2 : (1 - enemy.teleportPhase) * 2,
                    enemy.teleportPhase < 0.5 ? enemy.teleportPhase * 2 : (1 - enemy.teleportPhase) * 2
                  ]}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial 
                      color={getEnemyColor(enemy.type)}
                      transparent
                      opacity={0.5}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                  <pointLight 
                    color={getEnemyColor(enemy.type)} 
                    intensity={2 * (enemy.teleportPhase < 0.5 ? enemy.teleportPhase * 2 : (1 - enemy.teleportPhase) * 2)}
                    distance={5}
                    decay={2}
                  />
                </>
              )}
              
              {/* Health bar for damaged enemies */}
              {enemy.state === EnemyState.ACTIVE && enemy.health < enemy.maxHealth && (
                <group position={[0, 1.2, 0]}>
                  <mesh>
                    <boxGeometry args={[1.2, 0.1, 0.1]} />
                    <meshBasicMaterial color="#ff0000" />
                  </mesh>
                  <mesh position={[(enemy.health / enemy.maxHealth - 1) * 0.6, 0, 0]}>
                    <boxGeometry args={[1.2 * (enemy.health / enemy.maxHealth), 0.1, 0.1]} />
                    <meshBasicMaterial color="#00ff00" />
                  </mesh>
                </group>
              )}
              
              {/* Enemy glow */}
              <pointLight 
                color={getEnemyColor(enemy.type)}
                intensity={enemy.state === EnemyState.DAMAGED ? 2 : 0.5}
                distance={3}
                decay={2}
              />
            </>
          )}
        </group>
      ))}
      
      {/* Render projectiles */}
      {projectiles.map(projectile => (
        <group key={projectile.id} position={projectile.position}>
          {/* Projectile body */}
          <mesh>
            <sphereGeometry args={[projectile.size, 8, 8]} />
            <meshBasicMaterial 
              color={projectile.color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Projectile trail */}
          <mesh position={[0, 0, projectile.isEnemyProjectile ? 1 : -1]}>
            <cylinderGeometry args={[
              projectile.size * 0.5, 
              projectile.size * 0.1, 
              projectile.isEnemyProjectile ? 2 : 3, 
              8
            ]} />
            <meshBasicMaterial 
              color={projectile.color}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Projectile light */}
          <pointLight 
            color={projectile.color}
            intensity={1.5}
            distance={3}
            decay={2}
          />
        </group>
      ))}
      
      {/* Render explosions */}
      {explosions.map(explosion => (
        <group key={explosion.id} position={explosion.position}>
          {/* Explosion sphere */}
          <mesh scale={[explosion.time * 2, explosion.time * 2, explosion.time * 2]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color="#ff3366"
              transparent
              opacity={Math.max(0, 1 - explosion.time / 1.5)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Explosion particles */}
          <points>
            <bufferGeometry>
              <bufferAttribute 
                attach="attributes-position"
                count={20}
                array={new Float32Array(60).map(() => (Math.random() - 0.5) * explosion.time * 4)}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial 
              color="#ffcc00"
              size={0.2}
              transparent
              opacity={Math.max(0, 1 - explosion.time / 1.5)}
              blending={THREE.AdditiveBlending}
              sizeAttenuation
            />
          </points>
          
          {/* Explosion light */}
          <pointLight 
            color="#ff3366"
            intensity={Math.max(0, 5 - explosion.time * 3)}
            distance={5}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
};

export default EnemyWaves;

