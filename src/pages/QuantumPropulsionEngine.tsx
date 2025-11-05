import { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Rocket, Zap, Atom, Star, Thermometer, Shield, Settings, RefreshCw, Download, FileText, AlertCircle } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Html, 
  useGLTF, 
  Environment, 
  Bounds, 
  useBounds,
  PerspectiveCamera,
  useHelper,
  useAnimations,
  Stats,
  Loader,
  Float,
  CameraShake
} from '@react-three/drei';
import * as THREE from 'three';
import Navigation from '../components/Navigation';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-900/20 rounded-xl border border-red-500/30">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h2 className="text-xl font-bold text-red-400 mb-2">Erro de Renderização</h2>
    <p className="text-gray-300 mb-4">Ocorreu um erro ao renderizar o motor de propulsão quântica.</p>
    <p className="text-sm text-gray-400 mb-6 max-w-md">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
    >
      Tentar Novamente
    </button>
  </div>
);

// Loading component
const LoadingScene = () => (
  <group>
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} intensity={1} />
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh>
        <torusGeometry args={[1.5, 0.5, 16, 32]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.5, 0.5, 16, 32]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} wireframe />
      </mesh>
    </Float>
    <Text
      position={[0, -3, 0]}
      fontSize={0.5}
      color="#8b5cf6"
      anchorX="center"
      anchorY="middle"
    >
      Carregando Motor Quântico...
    </Text>
  </group>
);

// Component Labels with HTML overlay
const ComponentLabel = ({ position, children, visible = true, component }) => {
  const [opacity, setOpacity] = useState(visible ? 1 : 0);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpacity(visible ? 1 : 0);
    }, visible ? 0 : 200);
    
    return () => clearTimeout(timeout);
  }, [visible]);
  
  if (opacity === 0 && !visible) return null;
  
  // Adjust position based on component type to avoid overlaps
  const adjustedPosition = [...position];
  if (component?.includes('Core')) {
    adjustedPosition[1] += 0.5;
  } else if (component?.includes('Cooling')) {
    adjustedPosition[0] += 0.8;
  } else if (component?.includes('Nozzles')) {
    adjustedPosition[1] -= 0.5;
  }
  
  return (
    <Html
      position={adjustedPosition}
      style={{
        width: '160px',
        padding: '8px',
        background: hovered 
          ? 'rgba(124, 58, 237, 0.95)' 
          : 'rgba(109, 40, 217, 0.85)',
        color: 'white',
        textAlign: 'center',
        borderRadius: '8px',
        fontSize: '12px',
        pointerEvents: 'all',
        whiteSpace: 'normal',
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease',
        opacity: opacity,
        transform: `scale(${hovered ? 1.05 : 1})`,
        border: '1px solid rgba(139, 92, 246, 0.5)',
      }}
      center
      distanceFactor={15}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <div className="font-semibold">{children}</div>
    </Html>
  );
};

// Component for each engine part
const EnginePart = ({ 
  position, 
  color, 
  geometry, 
  label, 
  description, 
  size = [1, 1, 1], 
  rotation = [0, 0, 0],
  emissive = false,
  emissiveIntensity = 0.5,
  opacity = 1,
  showLabels,
  selected,
  onClick
}) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const isSelected = selected === label;
  const [hovered, setHovered] = useState(false);
  const [meshScale, setMeshScale] = useState([1, 1, 1]);
  
  // Calculate scaled size for hover effect
  useEffect(() => {
    if (hovered || isSelected) {
      setMeshScale([1.05, 1.05, 1.05]);
    } else {
      setMeshScale([1, 1, 1]);
    }
  }, [hovered, isSelected]);
  
  useFrame((state) => {
    if (meshRef.current && emissive) {
      // Pulsating emission for active components
      const pulseFactor = isSelected 
        ? (0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.3)
        : (0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5);
        
      meshRef.current.material.emissiveIntensity = 
        emissiveIntensity * pulseFactor;
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.01;
      glowRef.current.rotation.z += 0.005;
      
      // Glow intensity based on hover/selected state
      glowRef.current.material.opacity = isSelected 
        ? 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        : hovered 
          ? 0.25
          : 0.2;
    }
    
    // Smooth scale transition
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(...meshScale), 
        0.1
      );
    }
  });

  return (
    <group 
      position={position} 
      rotation={rotation} 
      onClick={(e) => {
        e.stopPropagation();
        // Add vibration effect on click
        if (meshRef.current) {
          const timeline = gsap.timeline();
          timeline.to(meshRef.current.scale, {
            x: 1.1, y: 1.1, z: 1.1,
            duration: 0.1,
            ease: "power2.out"
          });
          timeline.to(meshRef.current.scale, {
            x: meshScale[0], y: meshScale[1], z: meshScale[2],
            duration: 0.2,
            ease: "elastic.out(1, 0.3)"
          });
        }
        onClick(label);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
      >
        {geometry === 'box' && <boxGeometry args={size} />}
        {geometry === 'sphere' && <sphereGeometry args={[size[0], 32, 32]} />}
        {geometry === 'cylinder' && <cylinderGeometry args={[size[0], size[1], size[2], 32]} />}
        {geometry === 'torus' && <torusGeometry args={[size[0], size[1], 16, 100]} />}
        {geometry === 'cone' && <coneGeometry args={[size[0], size[1], 32]} />}
        
        <meshStandardMaterial 
          color={color} 
          emissive={emissive || isSelected ? color : '#000000'} 
          emissiveIntensity={emissiveIntensity * (isSelected ? 1.5 : 1)}
          metalness={0.8}
          roughness={hovered ? 0.1 : 0.2}
          transparent={opacity < 1}
          opacity={opacity}
          wireframe={isSelected}
          envMapIntensity={isSelected ? 1.5 : 1}
        />
      </mesh>
      
      {/* Outline effect for selected components */}
      {isSelected && (
        <mesh scale={[1.07, 1.07, 1.07]}>
          {geometry === 'box' && <boxGeometry args={size} />}
          {geometry === 'sphere' && <sphereGeometry args={[size[0], 32, 32]} />}
          {geometry === 'cylinder' && <cylinderGeometry args={[size[0], size[1], size[2], 32]} />}
          {geometry === 'torus' && <torusGeometry args={[size[0], size[1], 16, 100]} />}
          {geometry === 'cone' && <coneGeometry args={[size[0], size[1], 32]} />}
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.2} 
            side={THREE.BackSide}
            wireframe
          />
        </mesh>
      )}
      
      {/* Glow effect for emissive components */}
      {(emissive || hovered) && (
        <mesh ref={glowRef} scale={[1.05, 1.05, 1.05]}>
          {geometry === 'sphere' && <sphereGeometry args={[size[0], 32, 32]} />}
          {geometry === 'cylinder' && <cylinderGeometry args={[size[0], size[1], size[2], 32]} />}
          {geometry === 'torus' && <torusGeometry args={[size[0], size[1], 16, 100]} />}
          {geometry === 'box' && <boxGeometry args={size} />}
          {geometry === 'cone' && <coneGeometry args={[size[0], size[1], 32]} />}
          <meshBasicMaterial 
            color={hovered && !isSelected ? "#ffffff" : color} 
            transparent 
            opacity={0.2} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      <ComponentLabel 
        position={[0, size[geometry === 'cylinder' ? 2 : 0] + 0.5, 0]} 
        visible={showLabels || isSelected || hovered}
        component={label}
      >
        {label}
      </ComponentLabel>
    </group>
  );
};

// Flow particles for energy visualization
const QuantumFlow = ({ startPosition, endPosition, color, count = 30, speed = 1 }) => {
  const instancedMeshRef = useRef();
  const dummy = useRef(new THREE.Object3D());
  const particles = useRef(Array.from({ length: count }, (_, i) => ({
    position: new THREE.Vector3(),
    speed: 0.5 + Math.random() * 0.5,
    offset: i / count,
    size: 0.05 + Math.random() * 0.05, // Varying particle sizes
    randomOffset: {
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.2
    }
  })));

  useFrame((state) => {
    if (instancedMeshRef.current) {
      const direction = new THREE.Vector3().subVectors(
        new THREE.Vector3(...endPosition),
        new THREE.Vector3(...startPosition)
      );
      
      particles.current.forEach((particle, i) => {
        // Calculate position along the path
        const t = ((state.clock.elapsedTime * particle.speed * speed) + particle.offset) % 1;
        const position = new THREE.Vector3().lerpVectors(
          new THREE.Vector3(...startPosition),
          new THREE.Vector3(...endPosition),
          t
        );
        
        // Add some randomness for a more natural flow
        position.x += (Math.sin(t * Math.PI * 2) * 0.15) + particle.randomOffset.x;
        position.y += (Math.cos(t * Math.PI * 4) * 0.08) + particle.randomOffset.y;
        position.z += (Math.sin(t * Math.PI * 3) * 0.15) + particle.randomOffset.z;
        
        // Pulse size based on position in flow
        const pulseFactor = 0.8 + Math.sin(state.clock.elapsedTime * 3 + i * 0.2) * 0.2;
        const particleSize = particle.size * pulseFactor;
        
        // Set the position and scale
        dummy.current.position.copy(position);
        dummy.current.scale.set(particleSize, particleSize, particleSize);
        dummy.current.updateMatrix();
        
        instancedMeshRef.current.setMatrixAt(i, dummy.current.matrix);
      });
      
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh 
      ref={instancedMeshRef} 
      args={[null, null, count]}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

// Magnetic field visualization
const MagneticField = ({ position, radius, color, intensity = 1 }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005 * intensity;
      groupRef.current.rotation.z += 0.002 * intensity;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, (Math.PI / 4) * i, 0]}>
          <torusGeometry args={[radius, 0.03, 16, 100]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Selection and camera control
const SelectToZoom = ({ children }) => {
  const api = useBounds();
  
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        e.delta <= 2 && api.refresh(e.object).fit();
      }}
      onPointerMissed={(e) => {
        e.button === 0 && api.refresh().fit();
      }}
    >
      {children}
    </group>
  );
};

// Scene with Engine components
const QuantumEngineScene = ({ showLabels, selectedComponent, setSelectedComponent }) => {
  const { camera } = useThree();
  
  // Define light references for helpers (for development)
  const directionalLightRef = useRef();
  const spotLightRef = useRef();
  const cameraShakeRef = useRef();
  
  // Uncomment for light helpers during development
  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'green');
  
  // Set initial camera position with smooth animation
  useEffect(() => {
    const targetPosition = new THREE.Vector3(5, 3, 10);
    const initialPosition = new THREE.Vector3(0, 5, 20);
    
    // Set initial position first
    camera.position.copy(initialPosition);
    camera.lookAt(0, 0, 0);
    camera.fov = 60;
    camera.updateProjectionMatrix();
    
    // Animate to target position
    const timeline = gsap.timeline();
    timeline.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
      }
    });
    
    return () => {
      timeline.kill();
    };
  }, [camera]);
  
  // Add subtle camera shake when components are selected
  useEffect(() => {
    if (cameraShakeRef.current) {
      if (selectedComponent) {
        cameraShakeRef.current.intensity = 0.2;
        setTimeout(() => {
          if (cameraShakeRef.current) {
            cameraShakeRef.current.intensity = 0.05;
          }
        }, 300);
      } else {
        cameraShakeRef.current.intensity = 0;
      }
    }
  }, [selectedComponent]);
  
  // Engine component definitions with improved spacing and organization
  const engineComponents = [
    {
      name: "Quantum Vacuum Chamber",
      geometry: "cylinder",
      position: [0, 0, 0],
      rotation: [Math.PI / 2, 0, 0],
      size: [1.5, 1.5, 4],
      color: "#334155",
      opacity: 0.8,
      description: "Contém o vácuo quântico onde as flutuações de ponto zero são amplificadas para propulsão. Isolado do ambiente externo para prevenir decoerência."
    },
    {
      name: "Quantum Entanglement Core",
      geometry: "sphere",
      position: [0, 0, 0],
      size: [0.9],
      color: "#8b5cf6",
      emissive: true,
      emissiveIntensity: 1.3,
      description: "Núcleo central que mantém partículas em estado de entrelaçamento quântico, permitindo transferência instantânea de informação entre componentes do motor."
    },
    {
      name: "Plasma Containment Field Generators",
      geometry: "torus",
      position: [0, 0.1, 0],
      size: [1.3, 0.15],
      rotation: [Math.PI / 2, 0, 0],
      color: "#3b82f6",
      emissive: true,
      emissiveIntensity: 0.8,
      description: "Gera campos eletromagnéticos de alta intensidade para confinar o plasma superaquecido, utilizando geometria toroidal para maximizar estabilidade."
    },
    {
      name: "Zero-point Energy Collectors",
      geometry: "box",
      position: [0, 1.8, 0],
      size: [0.35, 0.35, 0.35],
      color: "#10b981",
      emissive: true,
      emissiveIntensity: 0.9,
      description: "Capturam energia do vácuo quântico através de efeito Casimir dinâmico, convertendo flutuações quânticas em energia utilizável."
    },
    {
      name: "Quantum Field Manipulators",
      geometry: "cone",
      position: [0, -2.5, 0],
      rotation: [Math.PI, 0, 0],
      size: [0.8, 1.4],
      color: "#f59e0b",
      emissive: true,
      emissiveIntensity: 1.0,
      description: "Controlam e direcionam os campos quânticos para produzir empuxo vetorial, permitindo manobras precisas em todas direções."
    },
    {
      name: "Propulsion Nozzles",
      geometry: "cylinder",
      position: [0, -3.5, 0],
      rotation: [Math.PI / 2, 0, 0],
      size: [0.7, 1.2, 1.2],
      color: "#64748b",
      emissive: true,
      emissiveIntensity: 0.3,
      description: "Aceleram e ejetam o fluxo de partículas carregadas modificadas quanticamente, gerando empuxo através de princípios de conservação de momento."
    },
    {
      name: "Cooling System",
      geometry: "torus",
      position: [0, 1.0, 0],
      size: [1.9, 0.12],
      rotation: [Math.PI / 2, 0, 0],
      color: "#06b6d4",
      emissive: true,
      emissiveIntensity: 0.4,
      description: "Sistema criogênico que mantém os supercondutores em temperatura próxima ao zero absoluto, essencial para manter propriedades quânticas."
    },
    {
      name: "Quantum Decoherence Shielding",
      geometry: "sphere",
      position: [0, 0, 0],
      size: [2.2],
      color: "#6b7280",
      opacity: 0.25,
      description: "Camada protetora que isola o sistema de interferências externas que poderiam causar decoerência quântica e colapso das funções de onda."
    }
  ];
  
  // Energy flow paths
  const flowPaths = [
    { 
      start: [0, 1.8, 0], 
      end: [0, 0, 0], 
      color: "#10b981",
      count: 35,
      speed: 1.2
    },
    { 
      start: [0, 0, 0], 
      end: [0, -2.5, 0], 
      color: "#8b5cf6",
      count: 40,
      speed: 1.5
    },
    { 
      start: [0, -2.5, 0], 
      end: [0, -3.5, 0], 
      color: "#f59e0b",
      count: 30,
      speed: 2.0
    }
  ];

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        ref={directionalLightRef}
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      <spotLight 
        ref={spotLightRef}
        position={[-5, 5, 5]} 
        angle={0.3} 
        penumbra={0.2} 
        intensity={1.5} 
        castShadow
      />
      
      {/* Environment and background */}
      <Environment preset="warehouse" background blur={0.6} />
      
      {/* Camera shake for subtle movement */}
      <CameraShake 
        ref={cameraShakeRef}
        maxYaw={0.01} 
        maxPitch={0.01} 
        maxRoll={0.01} 
        yawFrequency={0.5} 
        pitchFrequency={0.5} 
        rollFrequency={0.4}
        intensity={0}
      />
      
      {/* Magnetic field visualizations */}
      <MagneticField position={[0, 0, 0]} radius={2.5} color="#3b82f6" intensity={0.8} />
      <MagneticField position={[0, -2.5, 0]} radius={1.4} color="#f59e0b" intensity={1.2} />
      
      {/* Quantum flows */}
      {flowPaths.map((path, index) => (
        <QuantumFlow 
          key={index}
          startPosition={path.start} 
          endPosition={path.end} 
          color={path.color}
          count={path.count || 30}
          speed={path.speed || 1.5}
        />
      ))}
      
      {/* Engine components */}
      <SelectToZoom>
        {engineComponents.map((component) => (
          <EnginePart 
            key={component.name}
            label={component.name}
            description={component.description}
            position={component.position}
            rotation={component.rotation}
            size={component.size}
            geometry={component.geometry}
            color={component.color}
            emissive={component.emissive}
            emissiveIntensity={component.emissiveIntensity}
            opacity={component.opacity}
            showLabels={showLabels}
            selected={selectedComponent}
            onClick={setSelectedComponent}
          />
        ))}
      </SelectToZoom>
      
      {/* Controls for camera */}
      <OrbitControls 
        makeDefault 
        enableDamping 
        dampingFactor={0.05} 
        minDistance={3.5} 
        maxDistance={20}
        enablePan={true}
        panSpeed={0.5}
        rotateSpeed={0.7}
        zoomSpeed={1.2}
      />
      
      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && <Stats />}
    </>
  );
};
// Import missing GSAP for animations
import gsap from 'gsap';

// Main page component
const QuantumPropulsionEngine = () => {
  const [showLabels, setShowLabels] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentData, setComponentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading time for models and textures
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(loadingTimer);
  }, []);
  
  // Find the data for the selected component
  useEffect(() => {
    if (selectedComponent) {
      const engineComponents = [
        {
          name: "Quantum Vacuum Chamber",
          description: "Contém o vácuo quântico onde as flutuações de ponto zero são amplificadas para propulsão. Isolado do ambiente externo para prevenir decoerência.",
          technicalSpecs: [
            { label: "Material", value: "Liga de Nióbio-Titânio" },
            { label: "Pressão Interna", value: "10⁻¹² Pa" },
            { label: "Campo EM", value: "15.7 Tesla" },
            { label: "Temperatura", value: "2.1 K" }
          ]
        },
        {
          name: "Quantum Entanglement Core",
          description: "Núcleo central que mantém partículas em estado de entrelaçamento quântico, permitindo transferência instantânea de informação entre componentes do motor.",
          technicalSpecs: [
            { label: "Partículas", value: "Bósons de Higgs modificados" },
            { label: "Coerência", value: "99.97%" },
            { label: "Taxa de Entrelaçamento", value: "10¹⁸ pares/s" },
            { label: "Dissipação Térmica", value: "0.05 mW" }
          ]
        },
        {
          name: "Plasma Containment Field Generators",
          description: "Gera campos eletromagnéticos de alta intensidade para confinar o plasma superaquecido, utilizando geometria toroidal para maximizar estabilidade.",
          technicalSpecs: [
            { label: "Potência", value: "1.2 GW" },
            { label: "Densidade de Plasma", value: "10²⁵ m⁻³" },
            { label: "Temperatura de Plasma", value: "10⁸ K" },
            { label: "Corrente Toroidal", value: "15 MA" }
          ]
        },
        {
          name: "Zero-point Energy Collectors",
          description: "Capturam energia do vácuo quântico através de efeito Casimir dinâmico, convertendo flutuações quânticas em energia utilizável.",
          technicalSpecs: [
            { label: "Eficiência", value: "85.3%" },
            { label: "Potência de Saída", value: "500 TW" },
            { label: "Frequência de Oscilação", value: "10²³ Hz" },
            { label: "Densidade de Energia", value: "10¹⁶ J/m³" }
          ]
        },
        {
          name: "Quantum Field Manipulators",
          description: "Controlam e direcionam os campos quânticos para produzir empuxo vetorial, permitindo manobras precisas em todas direções.",
          technicalSpecs: [
            { label: "Precisão Direcional", value: "10⁻⁹ rad" },
            { label: "Tempo de Resposta", value: "10⁻¹⁵ s" },
            { label: "Gradiente de Campo", value: "10⁶ T/m" },
            { label: "Momento Angular", value: "10³⁸ kg·m²/s" }
          ]
        },
        {
          name: "Propulsion Nozzles",
          description: "Aceleram e ejetam o fluxo de partículas carregadas modificadas quanticamente, gerando empuxo através de princípios de conservação de momento.",
          technicalSpecs: [
            { label: "Velocidade de Exaustão", value: "0.9c" },
            { label: "Empuxo Máximo", value: "10⁷ N" },
            { label: "Impulso Específico", value: "10⁸ s" },
            { label: "Eficiência de Conversão", value: "99.7%" }
          ]
        },
        {
          name: "Cooling System",
          description: "Sistema criogênico que mantém os supercondutores em temperatura próxima ao zero absoluto, essencial para manter propriedades quânticas.",
          technicalSpecs: [
            { label: "Temperatura de Operação", value: "1.8 K" },
            { label: "Capacidade de Refrigeração", value: "15 kW" },
            { label: "Fluido Criogênico", value: "Hélio Superflúido" },
            { label: "Eficiência Termodinâmica", value: "95.2%" }
          ]
        },
        {
          name: "Quantum Decoherence Shielding",
          description: "Camada protetora que isola o sistema de interferências externas que poderiam causar decoerência quântica e colapso das funções de onda.",
          technicalSpecs: [
            { label: "Material", value: "Metamaterial de Grafeno-Ítrio" },
            { label: "Atenuação de Ruído", value: "99.9999%" },
            { label: "Espessura", value: "0.5 mm" },
            { label: "Tempo de Coerência", value: "10³ s" }
          ]
        }
      ];
      
      setComponentData(engineComponents.find(comp => comp.name === selectedComponent));
    } else {
      setComponentData(null);
    }
  }, [selectedComponent]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-12 flex items-center gap-3">
            <Rocket className="text-violet-400" />
            Motor de Propulsão Quântica
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Info className="text-violet-400" />
                  Visão Geral
                </h2>
                <p className="text-gray-300 mb-4">
                  O Motor de Propulsão Quântica representa a vanguarda da tecnologia de propulsão interestelar. Utilizando 
                  princípios da física quântica, este motor manipula flutuações do vácuo quântico e fenômenos de entrelaçamento 
                  para gerar empuxo sem necessidade de propelente convencional.
                </p>
                <p className="text-gray-300">
                  Sua eficiência supera em ordens de magnitude os sistemas de propulsão tradicionais, permitindo 
                  velocidades próximas à da luz sem os problemas de massa relativística associados à propulsão convencional.
                </p>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Controles de Visualização
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Mostrar Rótulos</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showLabels} 
                        onChange={() => setShowLabels(!showLabels)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <p className="text-gray-300 mb-2">Interação:</p>
                    <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                      <li>Clique em um componente para detalhes</li>
                      <li>Arraste para rotacionar a visualização</li>
                      <li>Scroll para zoom</li>
                      <li>Clique duplo para focar um componente</li>
                      <li>Clique em área vazia para visão completa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {componentData && (
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Atom className="text-violet-400" />
                    {componentData.name}
                  </h2>
                  
                  <p className="text-gray-300 mb-4">{componentData.description}</p>
                  
                  <div className="space-y-3 mt-4">
                    <h3 className="font-semibold text-violet-400">Especificações Técnicas:</h3>
                    {componentData.technicalSpecs.map((spec, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-400">{spec.label}:</span>
                        <span className="text-violet-300 font-mono">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <RefreshCw className="text-violet-400" />
                  Especificações de Performance
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eficiência Energética:</span>
                    <span className="text-violet-300 font-mono">99.97%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Velocidade Máxima:</span>
                    <span className="text-violet-300 font-mono">0.92c</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Empuxo por Unidade de Potência:</span>
                    <span className="text-violet-300 font-mono">2.1×10⁷ N/W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Massa Total:</span>
                    <span className="text-violet-300 font-mono">3,850 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tempo Médio Entre Falhas:</span>
                    <span className="text-violet-300 font-mono">85.7 anos</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Download className="text-violet-400" />
                  Recursos
                </h2>
                
                <div className="space-y-4">
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-white w-full shadow-lg shadow-violet-900/20 hover:shadow-violet-900/40"
                  >
                    <FileText className="w-4 h-4" />
                    Documentação Técnica
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-white w-full shadow-lg shadow-violet-900/20 hover:shadow-violet-900/40"
                  >
                    <Download className="w-4 h-4" />
                    Modelo 3D (STEP)
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20 h-[650px] relative">
                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-violet-950/80 z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-violet-300 font-medium">Inicializando Motor Quântico...</p>
                  </div>
                )}
                
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault fov={60} />
                    <Suspense fallback={<LoadingScene />}>
                      <Bounds fit clip observe margin={1.4}>
                        <QuantumEngineScene 
                          showLabels={showLabels} 
                          selectedComponent={selectedComponent}
                          setSelectedComponent={setSelectedComponent}
                        />
                      </Bounds>
                    </Suspense>
                  </Canvas>
                </ErrorBoundary>
                
                {/* External loader for better UX */}
                <Loader
                  containerStyles={{
                    background: 'transparent',
                    zIndex: 1,
                  }}
                  innerStyles={{
                    background: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                  }}
                  barStyles={{
                    background: '#8b5cf6',
                    height: '4px',
                  }}
                  dataStyles={{
                    color: '#c4b5fd',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  dataInterpolation={(p) => `Carregando ${p.toFixed(0)}%`}
                />
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-violet-900/20 p-4 rounded-lg hover:bg-violet-900/30 transition-colors shadow-md hover:shadow-lg border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Atom className="text-violet-400 w-5 h-5" />
                    <h3 className="font-semibold text-violet-400">Princípio Quântico</h3>
                  </div>
                  <p className="text-sm text-gray-300">Manipulação de flutuações do vácuo quântico para gerar diferenças de pressão direcional.</p>
                </div>
                
                <div className="bg-violet-900/20 p-4 rounded-lg hover:bg-violet-900/30 transition-colors shadow-md hover:shadow-lg border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-violet-400 w-5 h-5" />
                    <h3 className="font-semibold text-violet-400">Fonte de Energia</h3>
                  </div>
                  <p className="text-sm text-gray-300">Captação de energia do ponto zero via oscilações de placas Casimir em frequências superluminais.</p>
                </div>
                
                <div className="bg-violet-900/20 p-4 rounded-lg hover:bg-violet-900/30 transition-colors shadow-md hover:shadow-lg border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-violet-400 w-5 h-5" />
                    <h3 className="font-semibold text-violet-400">Segurança</h3>
                  </div>
                  <p className="text-sm text-gray-300">Contenção magnética de fluxos de partículas com redundâncias quânticas auto-estabilizadoras.</p>
                </div>
                
                <div className="bg-violet-900/20 p-4 rounded-lg hover:bg-violet-900/30 transition-colors shadow-md hover:shadow-lg border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="text-violet-400 w-5 h-5" />
                    <h3 className="font-semibold text-violet-400">Térmica</h3>
                  </div>
                  <p className="text-sm text-gray-300">Resfriamento criogênico com hélio superflúido em circuito fechado de zero-perda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2025 Julio Campos Machado - Todos os direitos reservados</p>
          <p className="text-xs mt-2 text-gray-500">Visualização de Motor Quântico v2.0</p>
        </div>
      </footer>
    </div>
  );
};

export default QuantumPropulsionEngine;

