import React, { useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Gauge, Rocket, Radio, Shield, Thermometer, Navigation as NavIcon, Compass, Crosshair, Map, Eye, ZoomIn, ZoomOut, RotateCcw, Settings, Power, Wifi, Zap, Target, Award, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import GalaxyMap from './GalaxyMap';

const Interface = () => {
  const { position, rotation, speed, setRotation, zoom, setZoom, viewMode, setViewMode } = useGameStore();
  const [showGalaxyMap, setShowGalaxyMap] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showPropulsion, setShowPropulsion] = useState(true);
  const [showWeapons, setShowWeapons] = useState(true);
  
  // Game state for the asteroid shooter
  const [score, setScore] = useState(0);
  const [asteroids, setAsteroids] = useState<Array<{
    id: number;
    position: THREE.Vector3;
    size: number;
    health: number;
    velocity: THREE.Vector3;
  }>>([]);
  const [laserCharge, setLaserCharge] = useState(100);
  const [laserCooldown, setLaserCooldown] = useState(0);
  const [laserActive, setLaserActive] = useState(false);
  const [targetedAsteroidId, setTargetedAsteroidId] = useState<number | null>(null);
  const [gameLevel, setGameLevel] = useState(1);

  // Automatic stabilizer effect
  useEffect(() => {
    const stabilize = () => {
      const targetRoll = 0;
      const targetYaw = 0;
      const targetPitch = 0;

      const currentRoll = rotation.x;
      const currentYaw = rotation.y;
      const currentPitch = rotation.z;

      const rollCorrection = Math.abs(currentRoll - targetRoll) > 0.2 ? -currentRoll * 0.1 : 0;
      const yawCorrection = Math.abs(currentYaw - targetYaw) > 0.2 ? -currentYaw * 0.1 : 0;
      const pitchCorrection = Math.abs(currentPitch - targetPitch) > 0.2 ? -currentPitch * 0.1 : 0;

      setRotation(new THREE.Euler(
        currentRoll + rollCorrection,
        currentYaw + yawCorrection,
        currentPitch + pitchCorrection
      ));
    };

    const stabilizerId = setInterval(stabilize, 16);
    return () => clearInterval(stabilizerId);
  }, [rotation, setRotation]);

  // Asteroid generation and movement
  useEffect(() => {
    // Generate new asteroids randomly
    const generateAsteroids = () => {
      // Only generate new asteroids if we have less than 5 + gameLevel
      if (asteroids.length < 5 + gameLevel) {
        const maxDistance = 1000;
        const minDistance = 200;
        
        // Random position at a distance from the ship
        const randomDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize();
        
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        const asteroidPosition = new THREE.Vector3().copy(position).add(
          randomDirection.multiplyScalar(distance)
        );
        
        // Velocity towards the ship
        const toShip = new THREE.Vector3().subVectors(position, asteroidPosition).normalize();
        const velocity = toShip.multiplyScalar(0.5 + Math.random() * gameLevel);
        
        const newAsteroid = {
          id: Date.now() + Math.random(),
          position: asteroidPosition,
          size: 10 + Math.random() * 20,
          health: 10 + Math.random() * 10 * gameLevel,
          velocity: velocity
        };
        
        setAsteroids(prev => [...prev, newAsteroid]);
      }
    };
    
    // Move asteroids and check for collisions
    const updateAsteroids = () => {
      setAsteroids(prev => prev.map(asteroid => {
        // Update position based on velocity
        const newPosition = new THREE.Vector3().copy(asteroid.position).add(asteroid.velocity);
        
        // Calculate distance to ship
        const distanceToShip = newPosition.distanceTo(position);
        
        // Return updated asteroid
        return {
          ...asteroid,
          position: newPosition
        };
      }).filter(asteroid => {
        // Remove asteroids that are too far or have been destroyed
        const distanceToShip = asteroid.position.distanceTo(position);
        return distanceToShip < 2000 && asteroid.health > 0;
      }));
      
      // Check if any asteroid is too close to the ship (collision)
      const collision = asteroids.some(asteroid => 
        asteroid.position.distanceTo(position) < asteroid.size + 10
      );
      
      if (collision) {
        // Handle collision - reduce shields or health
        console.log("Collision with asteroid!");
        // For now, just log it - we would add shield damage here
      }
    };
    
    // Find asteroid in targeting reticle
    const updateTargeting = () => {
      // Find the asteroid closest to the center of view
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(rotation);
      
      let closestAsteroid = null;
      let closestAngle = 0.2; // Maximum angle to consider targeted (in radians)
      
      asteroids.forEach(asteroid => {
        const toAsteroid = new THREE.Vector3().subVectors(asteroid.position, position).normalize();
        const angle = forward.angleTo(toAsteroid);
        
        if (angle < closestAngle) {
          closestAngle = angle;
          closestAsteroid = asteroid;
        }
      });
      
      setTargetedAsteroidId(closestAsteroid?.id || null);
    };
    
    // Laser cooldown recovery
    const updateLaser = () => {
      if (laserCooldown > 0) {
        setLaserCooldown(prev => Math.max(0, prev - 0.5));
      }
      
      // Recharge laser when not in use
      if (!laserActive && laserCharge < 100) {
        setLaserCharge(prev => Math.min(100, prev + 0.2));
      }
    };
    
    // Set up game loop
    const gameLoop = setInterval(() => {
      if (Math.random() < 0.05 + (gameLevel * 0.01)) {
        generateAsteroids();
      }
      updateAsteroids();
      updateTargeting();
      updateLaser();
    }, 16);
    
    return () => clearInterval(gameLoop);
  }, [position, rotation, asteroids, gameLevel, laserActive, laserCharge, laserCooldown]);
  
  // Firing the quantum helium laser
  const fireLaser = useCallback(() => {
    // Check if we can fire
    if (laserCooldown > 0 || laserCharge < 10) {
      return;
    }
    
    setLaserActive(true);
    
    // Consume charge
    setLaserCharge(prev => Math.max(0, prev - 10));
    
    // Set cooldown
    setLaserCooldown(20);
    
    // If we have a targeted asteroid, damage it
    if (targetedAsteroidId !== null) {
      setAsteroids(prev => prev.map(asteroid => {
        if (asteroid.id === targetedAsteroidId) {
          const newHealth = asteroid.health - 25;
          
          // If asteroid is destroyed, increase score
          if (newHealth <= 0) {
            setScore(prev => prev + Math.floor(asteroid.size * gameLevel));
            
            // Level up after every 5 asteroids
            if ((score + Math.floor(asteroid.size * gameLevel)) % (500 * gameLevel) < score % (500 * gameLevel)) {
              setGameLevel(prev => prev + 1);
            }
          }
          
          return {
            ...asteroid,
            health: newHealth
          };
        }
        return asteroid;
      }));
    }
    
    // Turn off laser after a short time
    setTimeout(() => {
      setLaserActive(false);
    }, 500);
  }, [targetedAsteroidId, laserCooldown, laserCharge, score, gameLevel]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 5));
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };


  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Central HUD - Roblox-style */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[900px] h-[900px]">
          <div className="absolute inset-0 border-2 border-[#00b4ff]/30 rounded-full"
            style={{ boxShadow: '0 0 20px rgba(0, 180, 255, 0.1)' }}>
            {/* Roll Indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
              <div className="text-cyan-400/90 font-mono">
                <div className="text-lg">{(rotation.x * (180/Math.PI)).toFixed(1)}°</div>
                <div className="text-xs">ROLL</div>
                <div className={`text-xs ${Math.abs(rotation.x) < 0.2 ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  {Math.abs(rotation.x) < 0.2 ? 'STABLE' : 'CORRECTING'}
                </div>
              </div>
            </div>

            {/* Yaw Indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
              <div className="text-cyan-400/90 font-mono">
                <div className="text-lg">{(rotation.y * (180/Math.PI)).toFixed(1)}°</div>
                <div className="text-xs">YAW</div>
                <div className={`text-xs ${Math.abs(rotation.y) < 0.2 ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  {Math.abs(rotation.y) < 0.2 ? 'STABLE' : 'CORRECTING'}
                </div>
              </div>
            </div>

            {/* Pitch Indicator */}
            <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2">
              <div className="text-cyan-400/90 font-mono">
                <div className="text-lg">{(rotation.z * (180/Math.PI)).toFixed(1)}°</div>
                <div className="text-xs">PITCH</div>
                <div className={`text-xs ${Math.abs(rotation.z) < 0.2 ? 'text-green-400' : 'text-cyan-400/50'}`}>
                  {Math.abs(rotation.z) < 0.2 ? 'STABLE' : 'CORRECTING'}
                </div>
              </div>
            </div>

            {/* Distance Markers */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/90 font-mono">
              <div>X: {position.x.toFixed(1)} m</div>
              <div>Y: {position.y.toFixed(1)} m</div>
              <div>Z: {position.z.toFixed(1)} m</div>
            </div>

            {/* Speed and Score Indicators - Roblox style */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-8">
              <div className="bg-black/75 backdrop-blur-md px-6 py-3 rounded-lg border-2 border-[#00b4ff]/50"
                style={{ boxShadow: '0 0 15px rgba(0, 180, 255, 0.2)' }}>
                <div className="text-sm text-[#00b4ff] mb-1 font-bold">SPEED</div>
                <div className="text-3xl font-mono text-white font-bold" style={{ textShadow: '0 0 8px #00b4ff' }}>
                  {speed.toFixed(1)} <span className="text-sm">m/s</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-[#00b4ff]" 
                    style={{ 
                      width: `${(speed/15)*100}%`,
                      boxShadow: '0 0 10px #00b4ff'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-black/75 backdrop-blur-md px-6 py-3 rounded-lg border-2 border-[#ff3366]/50"
                style={{ boxShadow: '0 0 15px rgba(255, 51, 102, 0.2)' }}>
                <div className="text-sm text-[#ff3366] mb-1 font-bold">SCORE</div>
                <div className="text-3xl font-mono text-white font-bold" style={{ textShadow: '0 0 8px #ff3366' }}>
                  {score}
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 ${i < Math.min(5, Math.floor(score/100)) ? 'bg-[#ff3366]' : 'bg-gray-800'} rounded-full`}
                      style={i < Math.min(5, Math.floor(score/100)) ? { boxShadow: '0 0 5px #ff3366' } : {}}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/75 backdrop-blur-md px-6 py-3 rounded-lg border-2 border-[#ffcc00]/50"
                style={{ boxShadow: '0 0 15px rgba(255, 204, 0, 0.2)' }}>
                <div className="text-sm text-[#ffcc00] mb-1 font-bold">LEVEL</div>
                <div className="text-3xl font-mono text-white font-bold" style={{ textShadow: '0 0 8px #ffcc00' }}>
                  {gameLevel}
                </div>
                <div className="flex justify-center mt-2 gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < gameLevel ? 'bg-[#ffcc00]' : 'bg-gray-800'}`}
                      style={i < gameLevel ? { boxShadow: '0 0 5px #ffcc00' } : {}}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Targeting Reticle - enhanced MS Flight Simulator style */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24">
                {/* Outer elements */}
                <div className={`absolute inset-0 border-2 ${targetedAsteroidId ? 'border-[#ff3366]' : 'border-[#00b4ff]'} rounded-full transition-colors`}
                  style={{ boxShadow: targetedAsteroidId ? '0 0 10px rgba(255, 51, 102, 0.5)' : '0 0 10px rgba(0, 180, 255, 0.3)' }} />
                
                {/* Inner circles */}
                <div className={`absolute inset-3 border ${targetedAsteroidId ? 'border-[#ff3366]/70' : 'border-[#00b4ff]/70'} rounded-full transition-colors`} />
                <div className={`absolute inset-6 border ${targetedAsteroidId ? 'border-[#ff3366]/50' : 'border-[#00b4ff]/50'} rounded-full transition-colors`} />
                
                {/* Targeting elements */}
                <div className="absolute inset-0">
                  {/* Top */}
                  <div className={`absolute top-0 left-1/2 w-1 h-3 -translate-x-1/2 ${targetedAsteroidId ? 'bg-[#ff3366]' : 'bg-[#00b4ff]'}`}></div>
                  {/* Bottom */}
                  <div className={`absolute bottom-0 left-1/2 w-1 h-3 -translate-x-1/2 ${targetedAsteroidId ? 'bg-[#ff3366]' : 'bg-[#00b4ff]'}`}></div>
                  {/* Left */}
                  <div className={`absolute left-0 top-1/2 w-3 h-1 -translate-y-1/2 ${targetedAsteroidId ? 'bg-[#ff3366]' : 'bg-[#00b4ff]'}`}></div>
                  {/* Right */}
                  <div className={`absolute right-0 top-1/2 w-3 h-1 -translate-y-1/2 ${targetedAsteroidId ? 'bg-[#ff3366]' : 'bg-[#00b4ff]'}`}></div>
                </div>
                
                {/* Crosshair center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crosshair className={`w-6 h-6 ${targetedAsteroidId ? 'text-[#ff3366]' : 'text-[#00b4ff]'} transition-colors`}
                    style={{ filter: `drop-shadow(0 0 2px ${targetedAsteroidId ? '#ff3366' : '#00b4ff'})` }} />
                </div>
                
                {/* Target locked indicator */}
                {targetedAsteroidId && (
                  <div className="absolute -bottom-8 flex items-center justify-center animate-pulse">
                    <div className="text-sm text-[#ff3366] font-mono font-bold"
                      style={{ textShadow: '0 0 5px #ff3366' }}>
                      TARGET LOCKED
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Asteroid Indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {asteroids.map(asteroid => {
                // Calculate 2D position on the HUD based on 3D position relative to ship
                const toAsteroid = new THREE.Vector3().subVectors(asteroid.position, position);
                const forward = new THREE.Vector3(0, 0, -1).applyEuler(rotation);
                const right = new THREE.Vector3(1, 0, 0).applyEuler(rotation);
                const up = new THREE.Vector3(0, 1, 0).applyEuler(rotation);
                
                // Project asteroid position onto forward/right/up axes
                const x = toAsteroid.dot(right);
                const y = toAsteroid.dot(up);
                const z = toAsteroid.dot(forward);
                
                // Only show asteroids in front of the ship
                if (z < 0) {
                  // Calculate distance and scale size accordingly
                  const distance = toAsteroid.length();
                  const scale = 100 / distance;
                  
                  // Calculate 2D position (as percentage from center)
                  const hudX = (x / Math.abs(z)) * 300;
                  const hudY = (y / Math.abs(z)) * 300;
                  
                  // Only show if within HUD bounds
                  if (Math.abs(hudX) < 390 && Math.abs(hudY) < 390) {
                    const isTargeted = asteroid.id === targetedAsteroidId;
                    const healthPercent = (asteroid.health / (10 + 10 * gameLevel)) * 100;
                    
                    return (
                      <div 
                        key={asteroid.id}
                        className={`absolute ${isTargeted ? 'bg-red-500/20' : 'bg-cyan-400/20'} rounded-full border ${isTargeted ? 'border-red-500/70' : 'border-cyan-400/50'}`}
                        style={{
                          left: `calc(50% + ${hudX}px)`,
                          top: `calc(50% + ${hudY}px)`,
                          width: `${Math.max(10, asteroid.size * scale)}px`,
                          height: `${Math.max(10, asteroid.size * scale)}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {isTargeted && (
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <div className="text-xs text-red-400 font-mono">{Math.round(distance)}m</div>
                            <div className="w-12 h-1 bg-gray-800 rounded-full mt-1">
                              <div 
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${healthPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
            
            {/* Laser Beam Effect */}
            {laserActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1 h-[2000px] bg-gradient-to-b from-yellow-500 via-red-500 to-transparent transform rotate-180 origin-top opacity-70 animate-pulse" />
              </div>
            )}

            {/* Stabilization Status - Roblox style */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-6 py-3 rounded-lg border-2 border-[#00b4ff]/50"
              style={{ boxShadow: '0 0 15px rgba(0, 180, 255, 0.2)' }}>
              <div className="text-sm text-[#00b4ff] mb-1 font-bold text-center">STABILIZER SYSTEM</div>
              <div className={`text-2xl font-mono font-bold text-center ${
                Math.abs(rotation.x) < 0.2 && 
                Math.abs(rotation.y) < 0.2 && 
                Math.abs(rotation.z) < 0.2 
                  ? 'text-[#00b4ff]'
                  : 'text-[#ffcc00]'
              }`}
              style={{ 
                textShadow: Math.abs(rotation.x) < 0.2 && Math.abs(rotation.y) < 0.2 && Math.abs(rotation.z) < 0.2 
                  ? '0 0 8px #00b4ff' 
                  : '0 0 8px #ffcc00' 
              }}>
                {Math.abs(rotation.x) < 0.2 && 
                 Math.abs(rotation.y) < 0.2 && 
                 Math.abs(rotation.z) < 0.2 
                  ? 'LOCKED'
                  : 'CORRECTING'}
              </div>
              
              {/* Stabilizer indicators */}
              <div className="flex justify-between mt-2 gap-4">
                <div className="flex-1">
                  <div className="text-xs mb-1 text-center">ROLL</div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${Math.abs(rotation.x) < 0.2 ? 'bg-[#00b4ff]' : 'bg-[#ffcc00]'}`}
                      style={{ 
                        width: `${100 - Math.min(100, Math.abs(rotation.x) * 100)}%`,
                        boxShadow: Math.abs(rotation.x) < 0.2 ? '0 0 5px #00b4ff' : '0 0 5px #ffcc00'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs mb-1 text-center">PITCH</div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${Math.abs(rotation.z) < 0.2 ? 'bg-[#00b4ff]' : 'bg-[#ffcc00]'}`}
                      style={{ 
                        width: `${100 - Math.min(100, Math.abs(rotation.z) * 100)}%`,
                        boxShadow: Math.abs(rotation.z) < 0.2 ? '0 0 5px #00b4ff' : '0 0 5px #ffcc00'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs mb-1 text-center">YAW</div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${Math.abs(rotation.y) < 0.2 ? 'bg-[#00b4ff]' : 'bg-[#ffcc00]'}`}
                      style={{ 
                        width: `${100 - Math.min(100, Math.abs(rotation.y) * 100)}%`,
                        boxShadow: Math.abs(rotation.y) < 0.2 ? '0 0 5px #00b4ff' : '0 0 5px #ffcc00'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-24 right-8 bottom-24 w-80 pointer-events-auto">
        <div className="h-full bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 space-y-4">
          {/* System Status */}
          <div>
            <button
              onClick={() => setShowSystemStatus(!showSystemStatus)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-cyan-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <span>System Status</span>
              </div>
              <Power className="w-4 h-4" />
            </button>
            
            {showSystemStatus && (
              <div className="mt-2 space-y-2 p-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Power</span>
                  <span className="text-green-400">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shields</span>
                  <span className="text-green-400">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Life Support</span>
                  <span className="text-green-400">Optimal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Communications</span>
                  <span className="text-yellow-400">Limited</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div>
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-cyan-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <NavIcon className="w-5 h-5" />
                <span>Navigation</span>
              </div>
              <Compass className="w-4 h-4" />
            </button>
            
            {showNavigation && (
              <div className="mt-2 space-y-2 p-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleViewModeChange('top')}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'top' ? 'bg-cyan-600' : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('side')}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'side' ? 'bg-cyan-600' : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <Eye className="w-4 h-4 transform rotate-90" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('front')}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      viewMode === 'front' ? 'bg-cyan-600' : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="flex-1 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors flex items-center justify-center"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="flex-1 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors flex items-center justify-center"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Propulsion Controls */}
          <div>
            <button
              onClick={() => setShowPropulsion(!showPropulsion)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-cyan-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                <span>Propulsion</span>
              </div>
              <Gauge className="w-4 h-4" />
            </button>
            
            {showPropulsion && (
              <div className="mt-2 space-y-2 p-2">
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Quantum Drive</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${(speed / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Field Strength</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div className="h-full w-3/4 bg-cyan-400 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Core Temperature</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div className="h-full w-1/2 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quantum Weapons System */}
          <div>
            <button
              onClick={() => setShowWeapons(!showWeapons)}
              className="w-full flex items-center justify-between p-2 bg-slate-700/50 rounded-lg text-red-400 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Quantum Weapons</span>
              </div>
              <Target className="w-4 h-4" />
            </button>
            
            {showWeapons && (
              <div className="mt-2 space-y-2 p-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">Helium Laser Cannon</div>
                    <div className={`text-xs ${laserCooldown > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {laserCooldown > 0 ? 'COOLING' : 'READY'}
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div
                      className={`h-full ${laserCooldown > 0 ? 'bg-yellow-400' : 'bg-red-400'} rounded-full transition-all`}
                      style={{ width: laserCooldown > 0 ? `${(1 - laserCooldown/20) * 100}%` : '100%' }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-gray-400">Laser Charge</div>
                  <div className="h-2 bg-slate-700/50 rounded-full">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${laserCharge}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-2 rounded-lg bg-slate-700/50 text-xs text-gray-300">
                  <p><span className="text-yellow-400">He+</span> Quantum Helium Laser</p>
                  <p>Temperature: 15,000,000 K</p>
                  <p>Wavelength: 587.6 nm (D3 line)</p>
                  <p>Power Output: 25.4 TW</p>
                </div>
                
                <button
                  onClick={fireLaser}
                  disabled={laserCooldown > 0 || laserCharge < 10}
                  className={`w-full p-2 rounded-lg flex justify-center items-center gap-2 ${
                    laserCooldown > 0 || laserCharge < 10
                      ? 'bg-slate-700/30 text-gray-500'
                      : 'bg-red-600/70 text-white hover:bg-red-600/90'
                  } transition-colors`}
                >
                  <Zap className="w-4 h-4" />
                  <span>FIRE QUANTUM LASER</span>
                </button>
              </div>
            )}
          </div>

          {/* Communications */}
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                <span>Communications</span>
              </div>
              <Wifi className="w-4 h-4" />
            </div>
            <div className="text-sm text-gray-400">
              Last Message: Asteroid field detected ahead. Weapons online.
            </div>
          </div>
        </div>
      </div>

      {/* Galaxy Map Button */}
      <div className="absolute left-8 bottom-8 pointer-events-auto">
        <button
          onClick={() => setShowGalaxyMap(true)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 text-cyan-400 hover:bg-slate-700/70 transition-colors"
          title="Abrir Mapa da Galáxia"
        >
          <Map className="w-5 h-5" />
          <span>Mapa da Galáxia</span>
        </button>
      </div>
      
      {/* Asteroid Warning */}
      {asteroids.length > 0 && (
        <div className="absolute left-8 top-8 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-800/50 backdrop-blur-sm rounded-lg border border-red-700/50 text-red-400 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
            <span>Asteróides Detectados: {asteroids.length}</span>
          </div>
        </div>
      )}
      
      {/* Quick Fire Button */}
      <div className="absolute right-8 bottom-8 pointer-events-auto">
        <button
          onClick={fireLaser}
          disabled={laserCooldown > 0 || laserCharge < 10}
          className={`flex items-center justify-center w-16 h-16 rounded-full ${
            laserCooldown > 0 || laserCharge < 10
              ? 'bg-slate-800/50 text-gray-500'
              : 'bg-red-600/70 text-white hover:bg-red-600/90'
          } transition-colors border-2 ${
            laserCooldown > 0 ? 'border-yellow-500/50' : 'border-red-500/50'
          }`}
          title="Disparar Laser Quântico"
        >
          <Zap className="w-8 h-8" />
        </button>
      </div>

      {/* Galaxy Map Component */}
      <GalaxyMap 
        isVisible={showGalaxyMap}
        onToggle={() => setShowGalaxyMap(!showGalaxyMap)}
        onClose={() => setShowGalaxyMap(false)}
      />
    </div>
  );
};

export default Interface;