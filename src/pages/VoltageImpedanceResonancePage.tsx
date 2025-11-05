import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Zap, Radio, Compass, Settings, RefreshCw, Atom, Layers, Magnet, Waves, AlertTriangle, Calculator, Orbit, Target, Zap as Electric, Lightbulb, Beaker, Cpu, Rocket, Gem, Navigation as NavigationIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface FrequencyBand {
  name: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

interface MaterialProperty {
  name: string;
  resistivity: number;
  permeability: number;
  permittivity: number;
  color: string;
}

const VoltageImpedanceResonancePage = () => {
  const [voltage, setVoltage] = useState(17000);
  const [frequency, setFrequency] = useState(60);
  const [impedance, setImpedance] = useState(50);
  const [magneticField, setMagneticField] = useState(1.5);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("copper");
  const [resonanceMode, setResonanceMode] = useState<number>(1);
  const [angle, setAngle] = useState(0);
  
  const voltageCanvasRef = useRef<HTMLCanvasElement>(null);
  const impedanceCanvasRef = useRef<HTMLCanvasElement>(null);
  const resonanceCanvasRef = useRef<HTMLCanvasElement>(null);
  const fieldCanvasRef = useRef<HTMLCanvasElement>(null);

  const voltageAnimationRef = useRef<number>();
  const impedanceAnimationRef = useRef<number>();
  const resonanceAnimationRef = useRef<number>();
  const fieldAnimationRef = useRef<number>();

  const frequencyBands: FrequencyBand[] = [
    { name: "ELF", min: 3, max: 30, color: "#ec4899", description: "Extremely Low Frequency" },
    { name: "SLF", min: 30, max: 300, color: "#a855f7", description: "Super Low Frequency" },
    { name: "ULF", min: 300, max: 3000, color: "#8b5cf6", description: "Ultra Low Frequency" },
    { name: "VLF", min: 3, max: 30, color: "#6366f1", description: "Very Low Frequency", },
    { name: "LF", min: 30, max: 300, color: "#3b82f6", description: "Low Frequency" },
    { name: "MF", min: 300, max: 3000, color: "#22d3ee", description: "Medium Frequency" },
  ];

  const materials: Record<string, MaterialProperty> = {
    // Elementos Básicos de Simulação
    boron: { name: "Boro (B)", resistivity: 1.8e6, permeability: 0.9999, permittivity: 2.5, color: "#3b82f6" },
    nitrogen: { name: "Nitrogênio (N)", resistivity: 1e15, permeability: 0.999999, permittivity: 1.0006, color: "#8b5cf6" },
    fluorine: { name: "Flúor (F) - Z=9", resistivity: 1e16, permeability: 0.999998, permittivity: 1.0008, color: "#10b981" },
    
    // Materiais Condutores Tradicionais
    copper: { name: "Cobre", resistivity: 1.68e-8, permeability: 0.999994, permittivity: 1, color: "#d97706" },
    aluminum: { name: "Alumínio", resistivity: 2.65e-8, permeability: 1.000022, permittivity: 1.6, color: "#94a3b8" },
    iron: { name: "Ferro", resistivity: 9.71e-8, permeability: 5000, permittivity: 1, color: "#6b7280" },
    gold: { name: "Ouro", resistivity: 2.44e-8, permeability: 0.999964, permittivity: 1, color: "#eab308" },
    silver: { name: "Prata", resistivity: 1.59e-8, permeability: 0.9999736, permittivity: 1, color: "#cbd5e1" },
    
    // Materiais Avançados
    superconductor: { name: "Supercondutor", resistivity: 1e-25, permeability: 0, permittivity: 1, color: "#22d3ee" },
    
    // Elementos Adicionais para Simulação
    carbon: { name: "Carbono (C)", resistivity: 3.5e-5, permeability: 0.999979, permittivity: 5.7, color: "#4b5563" },
    silicon: { name: "Silício (Si)", resistivity: 640, permeability: 0.999981, permittivity: 11.7, color: "#6366f1" },
    germanium: { name: "Germânio (Ge)", resistivity: 0.46, permeability: 0.999982, permittivity: 16.0, color: "#ec4899" },
    titanium: { name: "Titânio (Ti)", resistivity: 4.2e-7, permeability: 1.00018, permittivity: 1, color: "#64748b" },
    nickel: { name: "Níquel (Ni)", resistivity: 6.99e-8, permeability: 600, permittivity: 1, color: "#84cc16" },
    cobalt: { name: "Cobalto (Co)", resistivity: 6.24e-8, permeability: 250, permittivity: 1, color: "#f59e0b" },
    platinum: { name: "Platina (Pt)", resistivity: 1.06e-7, permeability: 1.0003, permittivity: 1, color: "#e5e7eb" },
    palladium: { name: "Paládio (Pd)", resistivity: 1.08e-7, permeability: 1.0008, permittivity: 1, color: "#d1d5db" },
    tungsten: { name: "Tungstênio (W)", resistivity: 5.6e-8, permeability: 1.00008, permittivity: 1, color: "#374151" },
    molybdenum: { name: "Molibdênio (Mo)", resistivity: 5.34e-8, permeability: 1.00012, permittivity: 1, color: "#6b7280" },
    
    // Ligas e Compostos Especiais
    brass: { name: "Latão", resistivity: 7e-8, permeability: 0.999991, permittivity: 1, color: "#fbbf24" },
    bronze: { name: "Bronze", resistivity: 9e-8, permeability: 0.999992, permittivity: 1, color: "#92400e" },
    steel: { name: "Aço", resistivity: 1.43e-7, permeability: 2000, permittivity: 1, color: "#52525b" },
    stainless_steel: { name: "Aço Inoxidável", resistivity: 7.2e-7, permeability: 1.02, permittivity: 1, color: "#71717a" },
    
    // Semicondutores e Materiais Quânticos
    gallium_arsenide: { name: "GaAs", resistivity: 1e-3, permeability: 0.999998, permittivity: 12.9, color: "#7c3aed" },
    indium_phosphide: { name: "InP", resistivity: 1e-2, permeability: 0.999997, permittivity: 12.5, color: "#a855f7" },
    silicon_carbide: { name: "SiC", resistivity: 1e5, permeability: 0.999995, permittivity: 9.7, color: "#059669" },
    gallium_nitride: { name: "GaN", resistivity: 1e10, permeability: 0.999996, permittivity: 9.0, color: "#0891b2" },
    
    // Materiais Exóticos
    graphene: { name: "Grafeno", resistivity: 1e-6, permeability: 0.9999995, permittivity: 2.6, color: "#1f2937" },
    metamaterial: { name: "Metamaterial", resistivity: 1e-4, permeability: -1.5, permittivity: -2.1, color: "#db2777" },
    quantum_dots: { name: "Pontos Quânticos", resistivity: 1e3, permeability: 1.0001, permittivity: 8.5, color: "#f97316" },
    superlattice: { name: "Super-rede", resistivity: 1e-1, permeability: 1.0002, permittivity: 15.2, color: "#84cc16" }
  };

  // Calculate resonant frequency
  const calculateResonantFrequency = () => {
    const L = calculateInductance();
    const C = 1e-6; // Capacitância fixa de 1 microfarad
    return 1 / (2 * Math.PI * Math.sqrt(L * C));
  };

  // Calculate impedance
  const calculateImpedance = () => {
    const material = materials[selectedMaterial];
    const resonantFreq = calculateResonantFrequency();
    const Q = 2 * Math.PI * frequency * calculateInductance() / resistance();
    
    // Impedância ajustada pela proximidade com a frequência ressonante
    const resonanceFactor = 1 + 10 * Math.exp(-Math.pow(frequency - resonantFreq, 2) / (2 * Math.pow(resonantFreq / 10, 2)));
    
    return impedance * resonanceFactor;
  };

  // Calculate inductance based on material and magnetic field
  const inductance = () => {
    const material = materials[selectedMaterial];
    return material.permeability * 4 * Math.PI * 1e-7 * 1000 * magneticField;
  };

  // Calculate resistance based on material properties
  const resistance = () => {
    const material = materials[selectedMaterial];
    return material.resistivity * 100; // Normalizado para exibição
  };

  // Calculate skin depth
  const skinDepth = () => {
    const material = materials[selectedMaterial];
    return Math.sqrt(material.resistivity / (Math.PI * frequency * 4 * Math.PI * 1e-7 * material.permeability));
  };

  // Calculate power dissipation
  const powerDissipation = () => {
    return Math.pow(voltage, 2) / calculateImpedance();
  };

  // Calculate magnetic field strength
  const calculateMagneticFieldStrength = () => {
    const current = voltage / calculateImpedance();
    return 2e-7 * current; // B = μ₀I/2πr, simplificado para r=1m
  };

  // Calculate wavelength
  const calculateWavelength = () => {
    const c = 299792458; // Velocidade da luz em m/s
    const material = materials[selectedMaterial];
    const v = c / Math.sqrt(material.permittivity * material.permeability);
    return v / frequency;
  };

  // Draw voltage waveform visualization
  const drawVoltageWaveform = () => {
    const canvas = voltageCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw voltage waveform
    const amplitude = Math.min(voltage / 50, height / 3); // Scale amplitude for high voltages
    const centerY = height / 2;
    
    // Draw waveform
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 4 + time * frequency / 10;
      const y = centerY - amplitude * Math.sin(t);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw glow effect
    ctx.save();
    ctx.filter = 'blur(4px)';
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#ec4899';
    ctx.stroke();
    ctx.restore();

    // Draw center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw voltage value
    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    const voltageText = voltage >= 1000 ? `${(voltage/1000).toFixed(1)}kV` : `${voltage}V`;
    ctx.fillText(voltageText, width - 10, 20);

    // Draw frequency
    ctx.fillText(`${frequency}Hz`, width - 10, 40);

    // Draw current time marker
    const markerX = (Math.sin(time) + 1) * width / 2;
    ctx.beginPath();
    ctx.moveTo(markerX, 0);
    ctx.lineTo(markerX, height);
    ctx.strokeStyle = '#ffffff30';
    ctx.stroke();

    voltageAnimationRef.current = requestAnimationFrame(drawVoltageWaveform);
  };

  // Draw impedance visualization
  const drawImpedanceVisualization = () => {
    const canvas = impedanceCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;
    const material = materials[selectedMaterial];

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw impedance vector
    const impedanceValue = calculateImpedance();
    const angle = time * 0.5;
    const vectorLength = Math.min(impedanceValue, 200);
    
    // Draw resistance component (real)
    const resistanceX = centerX + Math.cos(0) * resistance();
    const resistanceY = centerY;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(resistanceX, resistanceY);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw reactance component (imaginary)
    const reactanceX = resistanceX;
    const reactanceY = centerY - Math.sqrt(Math.pow(vectorLength, 2) - Math.pow(resistance(), 2));
    
    ctx.beginPath();
    ctx.moveTo(resistanceX, resistanceY);
    ctx.lineTo(reactanceX, reactanceY);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw total impedance vector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(reactanceX, reactanceY);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw component labels
    ctx.font = '12px monospace';
    ctx.fillStyle = '#22d3ee';
    ctx.textAlign = 'center';
    ctx.fillText(`R = ${resistance().toFixed(2)}Ω`, (centerX + resistanceX) / 2, resistanceY - 10);
    
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`X = ${Math.sqrt(Math.pow(vectorLength, 2) - Math.pow(resistance(), 2)).toFixed(2)}Ω`, reactanceX + 10, (centerY + reactanceY) / 2);
    
    ctx.fillStyle = '#eab308';
    ctx.fillText(`Z = ${impedanceValue.toFixed(2)}Ω`, (centerX + reactanceX) / 2 - 10, (centerY + reactanceY) / 2 + 20);
    
    // Draw material indicator
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = material.color;
    ctx.fill();
    
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(material.name.substring(0, 2), centerX, centerY + 4);

    impedanceAnimationRef.current = requestAnimationFrame(drawImpedanceVisualization);
  };

  // Draw resonance visualization
  const drawResonanceVisualization = () => {
    const canvas = resonanceCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 100;
    
    // Calculate resonant frequency
    const resonantFreq = calculateResonantFrequency();
    
    // Calculate how close current frequency is to resonance
    const resonanceRatio = Math.exp(-Math.pow(frequency - resonantFreq, 2) / (2 * Math.pow(resonantFreq / 5, 2)));
    
    // Draw resonance circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw standing wave based on resonance mode
    const wavePoints = 100;
    ctx.beginPath();
    
    for (let i = 0; i < wavePoints; i++) {
      const angle = (i / wavePoints) * Math.PI * 2;
      const r = radius * (1 + 0.2 * resonanceRatio * Math.sin(resonanceMode * angle + time * 2));
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    gradient.addColorStop(0, '#22d3ee');
    gradient.addColorStop(0.5, '#a855f7');
    gradient.addColorStop(1, '#ec4899');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2 + 3 * resonanceRatio;
    ctx.stroke();
    
    // Draw resonance particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particleAngle = (i / particleCount) * Math.PI * 2 + time * resonanceRatio * 2;
      const r = radius * (1 + 0.3 * resonanceRatio * Math.sin(resonanceMode * particleAngle));
      const x = centerX + r * Math.cos(particleAngle);
      const y = centerY + r * Math.sin(particleAngle);
      
      ctx.beginPath();
      ctx.arc(x, y, 3 * resonanceRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236, 72, 153, ${resonanceRatio})`;
      ctx.fill();
      
      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.3 * resonanceRatio;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ec4899';
      ctx.fill();
      ctx.restore();
    }
    
    // Draw resonance info
    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`Frequência Ressonante: ${resonantFreq.toFixed(2)}Hz`, centerX, 30);
    ctx.fillText(`Modo: ${resonanceMode}`, centerX, 50);
    
    // Draw resonance level indicator
    ctx.fillStyle = `rgba(236, 72, 153, ${resonanceRatio})`;
    ctx.fillRect(centerX - 50, height - 30, 100 * resonanceRatio, 10);
    ctx.strokeStyle = '#ffffff20';
    ctx.strokeRect(centerX - 50, height - 30, 100, 10);

    resonanceAnimationRef.current = requestAnimationFrame(drawResonanceVisualization);
  };

  // Draw magnetic field visualization
  const drawMagneticFieldVisualization = () => {
    const canvas = fieldCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;
    setAngle(angle + 0.01);

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff10';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw magnetic field lines
    const fieldStrength = magneticField;
    const lineCount = 16;
    const maxRadius = Math.min(width, height) * 0.4;
    
    for (let i = 0; i < lineCount; i++) {
      const lineAngle = (i / lineCount) * Math.PI * 2 + angle;
      
      ctx.beginPath();
      
      // Field lines shape depends on the selected material's permeability
      const material = materials[selectedMaterial];
      const permeabilityFactor = Math.min(10, material.permeability) / 10;
      
      if (material.permeability < 1) {
        // Diamagnetic materials - field lines are pushed outward
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          const distortionFactor = 1 + 0.3 * (1 - permeabilityFactor) * Math.sin(t * 6);
          const r = maxRadius * distortionFactor;
          const x = centerX + r * Math.cos(t + lineAngle);
          const y = centerY + r * Math.sin(t + lineAngle);
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      } else if (material.permeability > 1) {
        // Paramagnetic/ferromagnetic materials - field lines are pulled inward
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          const distortionFactor = 1 - 0.5 * permeabilityFactor * Math.sin(t * 3);
          const r = maxRadius * distortionFactor;
          const x = centerX + r * Math.cos(t + lineAngle);
          const y = centerY + r * Math.sin(t + lineAngle);
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      } else {
        // Non-magnetic materials - regular field lines
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      }
      
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 + 0.2 * Math.sin(lineAngle + time)})`;
      ctx.lineWidth = 1 + fieldStrength * 0.5;
      ctx.stroke();
    }
    
    // Draw material in center
    const materialRadius = 30 + 10 * Math.sin(time);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, materialRadius, 0, Math.PI * 2);
    ctx.fillStyle = materials[selectedMaterial].color + '80';
    ctx.fill();
    ctx.strokeStyle = materials[selectedMaterial].color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw material name
    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(materials[selectedMaterial].name, centerX, centerY + 5);
    
    // Draw field strength indicator
    const fieldGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius * 1.5
    );
    fieldGradient.addColorStop(0, `rgba(168, 85, 247, ${0.1 * fieldStrength})`);
    fieldGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = fieldGradient;
    ctx.fill();
    
    // Draw field lines around the material
    const arrowCount = 12;
    for (let i = 0; i < arrowCount; i++) {
      const arrowAngle = (i / arrowCount) * Math.PI * 2 + time * 0.5;
      const r1 = materialRadius + 10;
      const r2 = materialRadius + 30;
      
      const x1 = centerX + r1 * Math.cos(arrowAngle);
      const y1 = centerY + r1 * Math.sin(arrowAngle);
      const x2 = centerX + r2 * Math.cos(arrowAngle);
      const y2 = centerY + r2 * Math.sin(arrowAngle);
      
      // Draw field line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1 + fieldStrength * 0.3;
      ctx.stroke();
      
      // Draw arrow head
      const headLength = 10;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLength * Math.cos(angle - Math.PI / 6),
        y2 - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        x2 - headLength * Math.cos(angle + Math.PI / 6),
        y2 - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = '#a855f7';
      ctx.fill();
    }

    fieldAnimationRef.current = requestAnimationFrame(drawMagneticFieldVisualization);
  };

  useEffect(() => {
    drawVoltageWaveform();
    drawImpedanceVisualization();
    drawResonanceVisualization();
    drawMagneticFieldVisualization();
    
    return () => {
      if (voltageAnimationRef.current) {
        cancelAnimationFrame(voltageAnimationRef.current);
      }
      if (impedanceAnimationRef.current) {
        cancelAnimationFrame(impedanceAnimationRef.current);
      }
      if (resonanceAnimationRef.current) {
        cancelAnimationFrame(resonanceAnimationRef.current);
      }
      if (fieldAnimationRef.current) {
        cancelAnimationFrame(fieldAnimationRef.current);
      }
    };
  }, [voltage, frequency, impedance, magneticField, selectedMaterial, resonanceMode]);

  // Calculate inductance based on properties (unified function)
  const calculateInductance = () => {
    const material = materials[selectedMaterial];
    return material.permeability * 4 * Math.PI * 1e-7 * 1000 * magneticField;
  };

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
            <Zap className="text-violet-400" />
            Tensão, Impedância e Ressonância Magnética
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="text-violet-400" />
                  Configurações
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tensão (V)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="17000"
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {voltage}V {voltage >= 1000 ? `(${(voltage/1000).toFixed(1)}kV)` : ''}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequência (Hz)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {frequency}Hz
                      {frequencyBands.find(band => frequency >= band.min && frequency < band.max) && (
                        <span className="ml-2 text-sm">
                          ({frequencyBands.find(band => frequency >= band.min && frequency < band.max)?.name})
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Impedância Base (Ω)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      step="1"
                      value={impedance}
                      onChange={(e) => setImpedance(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {impedance}Ω
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Campo Magnético (T)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={magneticField}
                      onChange={(e) => setMagneticField(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {magneticField}T
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Modo de Ressonância
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="1"
                      value={resonanceMode}
                      onChange={(e) => setResonanceMode(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      Modo {resonanceMode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Layers className="text-violet-400" />
                  Material
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {Object.entries(materials).map(([key, material]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMaterial(key)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                        selectedMaterial === key 
                          ? 'bg-violet-600' 
                          : 'bg-violet-900/20 hover:bg-violet-900/40'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full mb-2" 
                        style={{ backgroundColor: material.color }}
                      ></div>
                      <span className="text-sm">{material.name}</span>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Resistividade:</span>
                    <span className="text-violet-400 font-mono">{materials[selectedMaterial].resistivity.toExponential(2)} Ω·m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Permeabilidade:</span>
                    <span className="text-violet-400 font-mono">{materials[selectedMaterial].permeability}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Permissividade:</span>
                    <span className="text-violet-400 font-mono">{materials[selectedMaterial].permittivity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="text-violet-400" />
                  Dados Calculados
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Impedância Total:</span>
                    <span className="text-violet-400 font-mono">{calculateImpedance().toFixed(2)} Ω</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Indutância:</span>
                    <span className="text-violet-400 font-mono">{calculateInductance().toExponential(3)} H</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Resistência:</span>
                    <span className="text-violet-400 font-mono">{resistance().toFixed(2)} Ω</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Freq. Ressonante:</span>
                    <span className="text-violet-400 font-mono">{calculateResonantFrequency().toFixed(2)} Hz</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Profundidade de Penetração:</span>
                    <span className="text-violet-400 font-mono">{skinDepth().toExponential(3)} m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Potência Dissipada:</span>
                    <span className="text-violet-400 font-mono">
                      {powerDissipation() >= 1000000 
                        ? `${(powerDissipation()/1000000).toFixed(2)} MW` 
                        : powerDissipation() >= 1000 
                        ? `${(powerDissipation()/1000).toFixed(2)} kW` 
                        : `${powerDissipation().toFixed(2)} W`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Campo Magnético:</span>
                    <span className="text-violet-400 font-mono">{calculateMagneticFieldStrength().toExponential(3)} T</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Comprimento de Onda:</span>
                    <span className="text-violet-400 font-mono">{calculateWavelength().toExponential(3)} m</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Waves className="text-violet-400" />
                  Bandas de Frequência
                </h2>
                <div className="space-y-3">
                  {frequencyBands.map(band => (
                    <div key={band.name} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                        style={{ backgroundColor: band.color }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{band.name}</span>
                          <span className="text-gray-400">{band.min}-{band.max} Hz</span>
                        </div>
                        <div className="text-xs text-gray-400">{band.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Forma de Onda da Tensão</h2>
                <canvas
                  ref={voltageCanvasRef}
                  width={600}
                  height={300}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização em tempo real da forma de onda de tensão</p>
                  <p>• Frequência e amplitude ajustáveis pelos controles</p>
                  <p>• As linhas verticais representam marcadores de tempo</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Diagrama de Impedância</h2>
                <canvas
                  ref={impedanceCanvasRef}
                  width={600}
                  height={400}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• O diagrama vetorial mostra os componentes de impedância</p>
                  <p>• Azul: componente resistivo (R)</p>
                  <p>• Roxo: componente reativo (X)</p>
                  <p>• Amarelo: impedância total (Z)</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização de Ressonância</h2>
                <canvas
                  ref={resonanceCanvasRef}
                  width={600}
                  height={400}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização das ondas estacionárias no sistema</p>
                  <p>• O modo de ressonância determina o padrão das ondas</p>
                  <p>• A intensidade da ressonância depende da proximidade com a frequência ressonante</p>
                  <p>• Barra inferior: nível de ressonância atual</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Campo Magnético</h2>
                <canvas
                  ref={fieldCanvasRef}
                  width={600}
                  height={400}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização do campo magnético ao redor do material selecionado</p>
                  <p>• As linhas de campo são influenciadas pelas propriedades magnéticas do material</p>
                  <p>• Materiais diamagnéticos (µr &lt; 1) empurram as linhas de campo para fora</p>
                  <p>• Materiais paramagnéticos/ferromagnéticos (µr &gt; 1) atraem as linhas de campo</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Magnet className="text-violet-400" />
                  Aplicações Práticas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Ressonância Magnética</h3>
                    <p className="text-sm text-gray-300">
                      Diagnóstico médico por imagem utilizando campos magnéticos ressonantes
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Transformadores</h3>
                    <p className="text-sm text-gray-300">
                      Transferência de energia e conversão de tensão em sistemas elétricos
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Filtros LC</h3>
                    <p className="text-sm text-gray-300">
                      Circuitos de filtro para sistemas de comunicação e processamento de sinais
                    </p>
                  </div>
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-violet-400 mb-2">Sensores</h3>
                    <p className="text-sm text-gray-300">
                      Detecção de anomalias e medição de propriedades físicas em materiais
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <AlertTriangle className="text-violet-400" />
                  Notas Importantes
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Este simulador demonstra os princípios fundamentais da interação entre
                    tensão, impedância e ressonância magnética em diferentes materiais.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Lei de Ohm</h3>
                      <p className="text-sm font-mono">V = I × Z</p>
                    </div>
                    <div className="bg-violet-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-violet-400 mb-2">Frequência Ressonante</h3>
                      <p className="text-sm font-mono">f = 1/(2π√LC)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nova seção para Análise Atômica dos Elementos */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Atom className="text-violet-400" />
              Simulação de Campos Atômicos: Boro, Nitrogênio e Flúor
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Boro (B) */}
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Orbit className="text-blue-400" />
                  Boro (B) - Z=5
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Configuração Eletrônica</h4>
                    <p className="text-sm font-mono">1s² 2s² 2p¹</p>
                    <p className="text-xs text-gray-400 mt-2">3 elétrons de valência (2s² 2p¹)</p>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Propriedades Físicas</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Massa Atômica:</span>
                        <span className="text-blue-400">10.811 u</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Raio Atômico:</span>
                        <span className="text-blue-400">87 pm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Energia de Ionização:</span>
                        <span className="text-blue-400">8.30 eV</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Campo Elétrico Nuclear</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carga Nuclear:</span>
                        <span className="text-blue-400">+5e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Campo E (1s):</span>
                        <span className="text-blue-400">2.87×10¹¹ V/m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Momento Magnético:</span>
                        <span className="text-blue-400">0.0 μB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Potencial de Criação Artificial</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">Fusão Nuclear:</p>
                      <p className="text-xs font-mono">⁴He + ¹H → ⁵B (instável)</p>
                      <p className="text-xs font-mono">⁶Li + p → α + ³He + ⁵B</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400">Energia Necessária:</span>
                        <span className="text-blue-400">~1.5 MeV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nitrogênio (N) */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Orbit className="text-purple-400" />
                  Nitrogênio (N) - Z=7
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">Configuração Eletrônica</h4>
                    <p className="text-sm font-mono">1s² 2s² 2p³</p>
                    <p className="text-xs text-gray-400 mt-2">5 elétrons de valência (2s² 2p³)</p>
                  </div>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">Propriedades Físicas</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Massa Atômica:</span>
                        <span className="text-purple-400">14.007 u</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Raio Atômico:</span>
                        <span className="text-purple-400">65 pm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Energia de Ionização:</span>
                        <span className="text-purple-400">14.53 eV</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">Campo Elétrico Nuclear</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carga Nuclear:</span>
                        <span className="text-purple-400">+7e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Campo E (1s):</span>
                        <span className="text-purple-400">4.01×10¹¹ V/m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Momento Magnético:</span>
                        <span className="text-purple-400">0.404 μB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">Potencial de Criação Artificial</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">Captura de Nêutrons:</p>
                      <p className="text-xs font-mono">¹⁴C + n → ¹⁴N + p</p>
                      <p className="text-xs font-mono">¹²C + α → ¹⁵N + n</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400">Energia Necessária:</span>
                        <span className="text-purple-400">~7.3 MeV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Flúor (F) */}
              <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 p-6 rounded-xl border border-green-500/20">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Orbit className="text-green-400" />
                  Flúor (F) - Z=9
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">Configuração Eletrônica</h4>
                    <p className="text-sm font-mono">1s² 2s² 2p⁵</p>
                    <p className="text-xs text-gray-400 mt-2">7 elétrons de valência (2s² 2p⁵)</p>
                  </div>
                  
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">Propriedades Físicas</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Massa Atômica:</span>
                        <span className="text-green-400">18.998 u</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Raio Atômico:</span>
                        <span className="text-green-400">64 pm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Energia de Ionização:</span>
                        <span className="text-green-400">17.42 eV</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">Campo Elétrico Nuclear</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carga Nuclear:</span>
                        <span className="text-green-400">+9e</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Campo E (1s):</span>
                        <span className="text-green-400">5.15×10¹¹ V/m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Momento Magnético:</span>
                        <span className="text-green-400">2.629 μB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">Potencial de Criação Artificial</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">Bombardeamento de Oxigênio:</p>
                      <p className="text-xs font-mono">¹⁶O + ³He → ¹⁹F + γ</p>
                      <p className="text-xs font-mono">¹⁸O + p → ¹⁸F + n</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400">Energia Necessária:</span>
                        <span className="text-green-400">~2.4 MeV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seção de Simulação de Criação de Elementos */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Beaker className="text-yellow-400" />
                Simulação de Criação de Elementos com Campos Eletromagnéticos
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Teoria de Criação Artificial */}
                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6 rounded-xl border border-yellow-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" />
                    Fundamentos Teóricos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">Configuração Eletrônica e Campos</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300">A criação artificial de elementos requer:</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          <li>Controle preciso de campos elétricos (E &gt; 10¹¹ V/m)</li>
                          <li>Campos magnéticos intensos (B &gt; 10 Tesla)</li>
                          <li>Sincronização de frequências ressonantes</li>
                          <li>Manipulação de orbitais eletrônicos</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">Equações Fundamentais</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <p className="text-gray-300">Energia de Ionização:</p>
                        <p className="text-yellow-400">E = 13.6 × Z²eff / n² eV</p>
                        <p className="text-gray-300">Campo Elétrico Nuclear:</p>
                        <p className="text-yellow-400">E = ke × Z / r²</p>
                        <p className="text-gray-300">Frequência de Bohr:</p>
                        <p className="text-yellow-400">f = E₁ - E₂ / h</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">Métodos de Criação</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-orange-900/20 p-2 rounded">
                          <span className="text-orange-400 font-semibold">Fusão Nuclear</span>
                          <p className="text-gray-400">Combinação de núcleos leves</p>
                        </div>
                        <div className="bg-orange-900/20 p-2 rounded">
                          <span className="text-orange-400 font-semibold">Captura</span>
                          <p className="text-gray-400">Absorção de partículas</p>
                        </div>
                        <div className="bg-orange-900/20 p-2 rounded">
                          <span className="text-orange-400 font-semibold">Bombardeamento</span>
                          <p className="text-gray-400">Aceleração de projéteis</p>
                        </div>
                        <div className="bg-orange-900/20 p-2 rounded">
                          <span className="text-orange-400 font-semibold">Fissão</span>
                          <p className="text-gray-400">Fragmentação de núcleos pesados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Simulação Prática */}
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Cpu className="text-cyan-400" />
                    Simulação Prática
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Parâmetros de Controle</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Campo Elétrico (×10¹¹ V/m)</span>
                            <span className="text-cyan-400">2.87</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-cyan-400 h-2 rounded-full" style={{width: '57%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Campo Magnético (Tesla)</span>
                            <span className="text-cyan-400">15.2</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-cyan-400 h-2 rounded-full" style={{width: '76%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Energia de Feixe (MeV)</span>
                            <span className="text-cyan-400">7.3</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-cyan-400 h-2 rounded-full" style={{width: '73%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Sincronização (Hz)</span>
                            <span className="text-cyan-400">3.29×10¹⁵</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-cyan-400 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Status do Sistema</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estabilidade do Plasma:</span>
                          <span className="text-green-400">87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confinamento Magnético:</span>
                          <span className="text-green-400">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Eficiência Energética:</span>
                          <span className="text-yellow-400">64%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Taxa de Produção:</span>
                          <span className="text-cyan-400">10⁶ átomos/s</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Elemento Alvo: Nitrogênio-15</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300 font-mono">¹²C + α → ¹⁵N + n</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Probabilidade de Sucesso:</span>
                          <span className="text-green-400">78%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tempo Estimado:</span>
                          <span className="text-cyan-400">245 μs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Energia Total:</span>
                          <span className="text-cyan-400">7.297 MeV</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comparação de Elementos */}
              <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 p-6 rounded-xl border border-violet-500/20 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Target className="text-violet-400" />
                  Comparação: Parâmetros de Criação dos Elementos
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-violet-500/20">
                        <th className="text-left py-3 px-4 text-violet-400">Elemento</th>
                        <th className="text-center py-3 px-4 text-violet-400">Z</th>
                        <th className="text-center py-3 px-4 text-violet-400">Campo E (×10¹¹ V/m)</th>
                        <th className="text-center py-3 px-4 text-violet-400">Energia (MeV)</th>
                        <th className="text-center py-3 px-4 text-violet-400">Método Principal</th>
                        <th className="text-center py-3 px-4 text-violet-400">Dificuldade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-violet-500/10">
                      <tr>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                            <span className="text-blue-400 font-medium">Boro (B)</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-300">5</td>
                        <td className="text-center py-3 px-4 text-gray-300">2.87</td>
                        <td className="text-center py-3 px-4 text-gray-300">1.5</td>
                        <td className="text-center py-3 px-4 text-gray-300">Fusão α + p</td>
                        <td className="text-center py-3 px-4">
                          <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded text-xs">Baixa</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            <span className="text-purple-400 font-medium">Nitrogênio (N)</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-300">7</td>
                        <td className="text-center py-3 px-4 text-gray-300">4.01</td>
                        <td className="text-center py-3 px-4 text-gray-300">7.3</td>
                        <td className="text-center py-3 px-4 text-gray-300">Captura n</td>
                        <td className="text-center py-3 px-4">
                          <span className="bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded text-xs">Média</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="text-green-400 font-medium">Flúor (F)</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-300">9</td>
                        <td className="text-center py-3 px-4 text-gray-300">5.15</td>
                        <td className="text-center py-3 px-4 text-gray-300">2.4</td>
                        <td className="text-center py-3 px-4 text-gray-300">Bombardeamento O</td>
                        <td className="text-center py-3 px-4">
                          <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded text-xs">Baixa</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Configuração Experimental */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-6 rounded-xl border border-red-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Electric className="text-red-400" />
                    Configuração do Acelerador
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Especificações do Equipamento</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tipo de Acelerador:</span>
                          <span className="text-red-400">Cíclotron Superconduto</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Energia Máxima:</span>
                          <span className="text-red-400">50 MeV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Campo Magnético:</span>
                          <span className="text-red-400">20 Tesla</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frequência RF:</span>
                          <span className="text-red-400">100 MHz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vácuo:</span>
                          <span className="text-red-400">10⁻¹⁰ Torr</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Sistema de Controle</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-pink-900/20 p-2 rounded">
                            <span className="text-pink-400 font-semibold block">Monitoramento</span>
                            <span className="text-gray-400 text-xs">Sensores quânticos</span>
                          </div>
                          <div className="bg-pink-900/20 p-2 rounded">
                            <span className="text-pink-400 font-semibold block">Feedback</span>
                            <span className="text-gray-400 text-xs">Controle adaptativo</span>
                          </div>
                          <div className="bg-pink-900/20 p-2 rounded">
                            <span className="text-pink-400 font-semibold block">Segurança</span>
                            <span className="text-gray-400 text-xs">Múltiplos failsafes</span>
                          </div>
                          <div className="bg-pink-900/20 p-2 rounded">
                            <span className="text-pink-400 font-semibold block">Precisão</span>
                            <span className="text-gray-400 text-xs">± 0.001 MeV</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 p-6 rounded-xl border border-indigo-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Waves className="text-indigo-400" />
                    Dinâmica dos Campos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2">Campos Eletromagnéticos</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Intensidade E</span>
                            <span className="text-indigo-400">Real-time</span>
                          </div>
                          <div className="w-full bg-indigo-900/20 rounded-full h-1">
                            <div className="bg-gradient-to-r from-indigo-400 to-blue-400 h-1 rounded-full animate-pulse" style={{width: '78%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Intensidade B</span>
                            <span className="text-indigo-400">Sincronizado</span>
                          </div>
                          <div className="w-full bg-indigo-900/20 rounded-full h-1">
                            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1 rounded-full animate-pulse" style={{width: '82%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Ressonância</span>
                            <span className="text-indigo-400">Ótima</span>
                          </div>
                          <div className="w-full bg-indigo-900/20 rounded-full h-1">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-1 rounded-full animate-pulse" style={{width: '95%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2">Eficiência de Conversão</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Energia → Partículas:</span>
                          <span className="text-green-400">73.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confinamento:</span>
                          <span className="text-green-400">91.7%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Captura de Produtos:</span>
                          <span className="text-yellow-400">68.4%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rendimento Total:</span>
                          <span className="text-cyan-400">46.8%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2">Condições Críticas</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Temperatura do Plasma:</span>
                          <span className="text-orange-400">10⁸ K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Densidade de Partículas:</span>
                          <span className="text-orange-400">10¹⁴ cm⁻³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tempo de Confinamento:</span>
                          <span className="text-orange-400">150 ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Aplicações Futuras */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 p-6 rounded-xl border border-emerald-500/20">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Atom className="text-emerald-400" />
                  Aplicações Futuras e Potencial Tecnológico
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-400 mb-3">Medicina Nuclear</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Isótopos para diagnóstico</li>
                      <li>• Radiofármacos personalizados</li>
                      <li>• Terapia direcionada</li>
                      <li>• Marcadores moleculares</li>
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-400 mb-3">Propulsão Espacial</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Combustíveis exóticos</li>
                      <li>• Propulsão iônica avançada</li>
                      <li>• Reatores de fusão compactos</li>
                      <li>• Blindagem contra radiação</li>
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-400 mb-3">Computação Quântica</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Qubits estáveis</li>
                      <li>• Memória quântica</li>
                      <li>• Processamento atômico</li>
                      <li>• Comunicação quântica</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg">
                  <h4 className="font-semibold text-emerald-400 mb-2">Desafios Tecnológicos</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 font-medium">Controle de Precisão:</span>
                      <p className="text-gray-300 mt-1">Necessário controle sub-atômico de campos e energias para reproduzir configurações eletrônicas específicas.</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Estabilidade Temporal:</span>
                      <p className="text-gray-300 mt-1">Manutenção de condições extremas por períodos suficientes para permitir reações nucleares.</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Eficiência Energética:</span>
                      <p className="text-gray-300 mt-1">Otimização do consumo energético para tornar o processo economicamente viável.</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Controle de Produtos:</span>
                      <p className="text-gray-300 mt-1">Captura seletiva e purificação dos elementos criados para aplicações práticas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Nova Seção: Cristais Quânticos para Propulsão Espacial */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Gem className="text-cyan-400" />
                Cristais Quânticos: Propulsão Espacial com Laser 17kV
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Configuração do Sistema Laser */}
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-cyan-400" />
                    Sistema Laser Quântico 17kV
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Especificações do Laser</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tensão de Operação:</span>
                          <span className="text-cyan-400 font-mono">17.000V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Potência de Saída:</span>
                          <span className="text-cyan-400 font-mono">850 MW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frequência:</span>
                          <span className="text-cyan-400 font-mono">3.29×10¹⁵ Hz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Comprimento de Onda:</span>
                          <span className="text-cyan-400 font-mono">91.2 nm (UV-C)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Densidade de Energia:</span>
                          <span className="text-cyan-400 font-mono">2.87×10¹² J/m³</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Manipulação Eletrônica</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Campo E Induzido (V/m)</span>
                            <span className="text-cyan-400">4.12×10¹¹</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full animate-pulse" style={{width: '82%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Força de Lorentz (N)</span>
                            <span className="text-cyan-400">6.59×10⁻⁷</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full animate-pulse" style={{width: '78%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Deslocamento Quântico (pm)</span>
                            <span className="text-cyan-400">147.3</span>
                          </div>
                          <div className="w-full bg-cyan-900/20 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full animate-pulse" style={{width: '91%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Controle de Elementos</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-900/40 p-2 rounded text-center">
                          <span className="text-blue-400 font-semibold block">Boro (B)</span>
                          <span className="text-gray-400">Z=5 - Ativo</span>
                        </div>
                        <div className="bg-purple-900/40 p-2 rounded text-center">
                          <span className="text-purple-400 font-semibold block">Nitrogênio (N)</span>
                          <span className="text-gray-400">Z=7 - Ativo</span>
                        </div>
                        <div className="bg-green-900/40 p-2 rounded text-center">
                          <span className="text-green-400 font-semibold block">Flúor (F)</span>
                          <span className="text-gray-400">Z=9 - Ativo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cristais Quânticos e Repulsão */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-400" />
                    Estrutura de Cristais Quânticos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Configuração BNF</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estrutura Cristalina:</span>
                          <span className="text-purple-400">Hexagonal Multicamadas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Parâmetro de Rede:</span>
                          <span className="text-purple-400">2.487 Å</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gap Energético:</span>
                          <span className="text-purple-400">5.97 eV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Densidade:</span>
                          <span className="text-purple-400">2.34 g/cm³</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Propriedades Quânticas</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coerência Quântica:</span>
                          <span className="text-green-400">97.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tempo de Decoerência:</span>
                          <span className="text-purple-400">2.47 ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Superposição de Estados:</span>
                          <span className="text-purple-400">|ψ⟩ = α|0⟩ + β|1⟩</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entrelaçamento:</span>
                          <span className="text-green-400">Ativo</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Força de Repulsão Quântica</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Força Resultante:</span>
                          <span className="text-purple-400 font-mono">8.92×10⁻⁶ N</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Aceleração:</span>
                          <span className="text-purple-400 font-mono">3.47 m/s²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Impulso Específico:</span>
                          <span className="text-purple-400 font-mono">12,450 s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Eficiência:</span>
                          <span className="text-green-400">84.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sistema de Navegação Quântica */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 p-6 rounded-xl border border-indigo-500/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <NavigationIcon className="text-indigo-400" />
                    Campo de Navegação X
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-indigo-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2 text-sm">Matriz Boro (B⁵⁺)</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Concentração:</span>
                          <span className="text-indigo-400">47.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Polarização:</span>
                          <span className="text-indigo-400">+X</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Campo Induzido:</span>
                          <span className="text-indigo-400">2.1×10¹⁰ V/m</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2 text-sm">Resposta do Sistema</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Thrust Vector X</span>
                            <span className="text-indigo-400">78%</span>
                          </div>
                          <div className="w-full bg-indigo-900/20 rounded-full h-1">
                            <div className="bg-indigo-400 h-1 rounded-full" style={{width: '78%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 p-6 rounded-xl border border-purple-500/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <NavigationIcon className="text-purple-400" />
                    Campo de Navegação Y
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-purple-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2 text-sm">Matriz Nitrogênio (N⁷⁺)</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Concentração:</span>
                          <span className="text-purple-400">31.7%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Polarização:</span>
                          <span className="text-purple-400">+Y</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Campo Induzido:</span>
                          <span className="text-purple-400">2.8×10¹⁰ V/m</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2 text-sm">Resposta do Sistema</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Thrust Vector Y</span>
                            <span className="text-purple-400">63%</span>
                          </div>
                          <div className="w-full bg-purple-900/20 rounded-full h-1">
                            <div className="bg-purple-400 h-1 rounded-full" style={{width: '63%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <NavigationIcon className="text-green-400" />
                    Campo de Navegação Z
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-green-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2 text-sm">Matriz Flúor (F⁹⁺)</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Concentração:</span>
                          <span className="text-green-400">21.0%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Polarização:</span>
                          <span className="text-green-400">+Z</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Campo Induzido:</span>
                          <span className="text-green-400">3.6×10¹⁰ V/m</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2 text-sm">Resposta do Sistema</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Thrust Vector Z</span>
                            <span className="text-green-400">85%</span>
                          </div>
                          <div className="w-full bg-green-900/20 rounded-full h-1">
                            <div className="bg-green-400 h-1 rounded-full" style={{width: '85%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Equações e Teoria Quântica */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Calculator className="text-orange-400" />
                    Equações Fundamentais
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-3">Força de Repulsão Quântica</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <p className="text-gray-300">F = q·E + (q·v × B) + Fquântica</p>
                        <p className="text-orange-400">Fquântica = ℏ∇φ / (2π·m·λdB)</p>
                        <p className="text-gray-300">onde λdB = h/(m·v) - Comprimento de de Broglie</p>
                      </div>
                    </div>
                    
                    <div className="bg-orange-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-3">Campo Eletromagnético Induzido</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <p className="text-gray-300">E_induzido = (17kV / d) × ε_cristal</p>
                        <p className="text-orange-400">B_induzido = μ₀ × (I_laser × n_elétrons)</p>
                        <p className="text-gray-300">P_laser = V² / Z_impedância</p>
                      </div>
                    </div>
                    
                    <div className="bg-orange-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-3">Hamiltoniano do Sistema</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <p className="text-gray-300">Ĥ = Ĥ₀ + Ĥ_interação + Ĥ_laser</p>
                        <p className="text-orange-400">Ĥ_laser = -d̂·Ê·cos(ωt + φ)</p>
                        <p className="text-gray-300">|ψ(t)⟩ = Σcₙ(t)·e^(-iEₙt/ℏ)·|n⟩</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 p-6 rounded-xl border border-teal-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Rocket className="text-teal-400" />
                    Performance de Propulsão
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-teal-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-teal-400 mb-3">Parâmetros de Voo</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Impulso Específico:</span>
                          <span className="text-teal-400 font-mono">12,450 s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ΔV Máximo:</span>
                          <span className="text-teal-400 font-mono">47,320 m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Aceleração Contínua:</span>
                          <span className="text-teal-400 font-mono">3.47 m/s²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Força de Thrust:</span>
                          <span className="text-teal-400 font-mono">8.92×10⁻⁶ N</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-teal-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-teal-400 mb-3">Eficiência Energética</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Conversão Laser → Thrust</span>
                            <span className="text-teal-400">84.7%</span>
                          </div>
                          <div className="w-full bg-teal-900/20 rounded-full h-2">
                            <div className="bg-teal-400 h-2 rounded-full" style={{width: '84.7%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Coerência Quântica</span>
                            <span className="text-teal-400">97.3%</span>
                          </div>
                          <div className="w-full bg-teal-900/20 rounded-full h-2">
                            <div className="bg-gradient-to-r from-teal-400 to-green-400 h-2 rounded-full" style={{width: '97.3%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Estabilidade Direcional</span>
                            <span className="text-teal-400">91.2%</span>
                          </div>
                          <div className="w-full bg-teal-900/20 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{width: '91.2%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-teal-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-teal-400 mb-3">Missões Possíveis</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-900/40 p-2 rounded">
                          <span className="text-green-400 font-semibold block">Órbita Lunar</span>
                          <span className="text-gray-400">3.2 dias</span>
                        </div>
                        <div className="bg-blue-900/40 p-2 rounded">
                          <span className="text-blue-400 font-semibold block">Marte</span>
                          <span className="text-gray-400">47 dias</span>
                        </div>
                        <div className="bg-purple-900/40 p-2 rounded">
                          <span className="text-purple-400 font-semibold block">Júpiter</span>
                          <span className="text-gray-400">8.3 meses</span>
                        </div>
                        <div className="bg-red-900/40 p-2 rounded">
                          <span className="text-red-400 font-semibold block">Sistema α-Cen</span>
                          <span className="text-gray-400">127 anos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simulação Visual dos Cristais */}
              <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 p-6 rounded-xl border border-violet-500/20 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Gem className="text-violet-400" />
                  Visualização do Cristal Quântico BNF
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-400 mb-3">Estrutura Atômica</h4>
                    <div className="relative h-32 bg-black/20 rounded-lg border border-violet-500/20 overflow-hidden">
                      {/* Simulação visual simples da estrutura cristalina */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
                          <div className="w-4 h-4 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" style={{animationDelay: '0.8s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: '1.0s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" style={{animationDelay: '1.2s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: '1.4s'}}></div>
                          <div className="w-4 h-4 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '1.6s'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-400">
                      <p>• B (azul) - Camada base</p>
                      <p>• N (roxo) - Camada intermediária</p>
                      <p>• F (verde) - Camada superior</p>
                    </div>
                  </div>
                  
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-400 mb-3">Campos Eletromagnéticos</h4>
                    <div className="relative h-32 bg-black/20 rounded-lg border border-violet-500/20 overflow-hidden">
                      <div className="absolute inset-0">
                        {/* Linhas de campo representando o laser */}
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute h-0.5 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-pulse"
                            style={{
                              top: `${10 + i * 10}%`,
                              left: '0%',
                              width: '100%',
                              animationDelay: `${i * 0.1}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-400">
                      <p>• Laser 17kV pulsado</p>
                      <p>• Frequência: 3.29×10¹⁵ Hz</p>
                      <p>• Penetração: 91.2 nm</p>
                    </div>
                  </div>
                  
                  <div className="bg-violet-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-400 mb-3">Vetores de Thrust</h4>
                    <div className="relative h-32 bg-black/20 rounded-lg border border-violet-500/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Setas representando os vetores de thrust */}
                        <div className="relative">
                          {/* Vetor X */}
                          <div className="absolute w-8 h-0.5 bg-indigo-400 transform -translate-y-2" style={{left: '0px'}}>
                            <div className="absolute right-0 top-0 w-0 h-0 border-l-2 border-l-indigo-400 border-t border-b border-transparent" style={{transform: 'translateY(-1px)'}}></div>
                          </div>
                          {/* Vetor Y */}
                          <div className="absolute h-8 w-0.5 bg-purple-400 transform -translate-x-1" style={{top: '-16px'}}>
                            <div className="absolute top-0 left-0 w-0 h-0 border-b-2 border-b-purple-400 border-l border-r border-transparent" style={{transform: 'translateX(-1px)'}}></div>
                          </div>
                          {/* Vetor Z (diagonal) */}
                          <div className="absolute w-6 h-0.5 bg-green-400 transform rotate-45 translate-x-1 translate-y-1">
                            <div className="absolute right-0 top-0 w-0 h-0 border-l-2 border-l-green-400 border-t border-b border-transparent" style={{transform: 'translateY(-1px) rotate(-45deg)'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-400">
                      <p>• X: 78% (Boro dominante)</p>
                      <p>• Y: 63% (Nitrogênio ativo)</p>
                      <p>• Z: 85% (Flúor máximo)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Controles de Simulação */}
              <div className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 p-6 rounded-xl border border-gray-500/20 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="text-gray-400" />
                  Controles da Simulação Quântica
                </h3>
                
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Intensidade Laser (kV)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value="17"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-cyan-400 mt-1 font-mono">17.0 kV</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Concentração Boro (%)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      value="47"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-blue-400 mt-1 font-mono">47.3%</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Concentração Nitrogênio (%)
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="45"
                      value="32"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-purple-400 mt-1 font-mono">31.7%</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Concentração Flúor (%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="35"
                      value="21"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-green-400 mt-1 font-mono">21.0%</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequência Laser (×10¹⁵ Hz)
                    </label>
                    <input
                      type="range"
                      min="2.5"
                      max="4.0"
                      step="0.1"
                      value="3.29"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-cyan-400 mt-1 font-mono">3.29×10¹⁵ Hz</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Orientação Cristal (°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value="120"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1 font-mono">120°</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Coerência Quântica (%)
                    </label>
                    <input
                      type="range"
                      min="75"
                      max="99"
                      value="97"
                      className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-green-400 mt-1 font-mono">97.3%</div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all">
                    Iniciar Simulação
                  </button>
                  <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-violet-700 transition-all">
                    Calibrar Sistema
                  </button>
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all">
                    Teste de Thrust
                  </button>
                  <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all">
                    Parada de Emergência
                  </button>
                </div>
              </div>
              
              {/* Aplicações e Considerações */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Rocket className="text-indigo-400" />
                    Vantagens da Propulsão Quântica
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2">Eficiência Superior</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Impulso específico 50x maior que químico</li>
                        <li>• Não requer massa de reação convencional</li>
                        <li>• Eficiência energética de 84.7%</li>
                        <li>• Operação contínua por anos</li>
                      </ul>
                    </div>
                    
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2">Controle Tridimensional</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Vetor thrust ajustável em tempo real</li>
                        <li>• Precisão sub-miligrau em orientação</li>
                        <li>• Resposta instantânea a comandos</li>
                        <li>• Estabilização automática de atitude</li>
                      </ul>
                    </div>
                    
                    <div className="bg-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-400 mb-2">Escalabilidade</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Módulos de cristais podem ser combinados</li>
                        <li>• Potência escalável com arrays de laser</li>
                        <li>• Aplicável desde nano-sats até naves grandes</li>
                        <li>• Manutenção mínima necessária</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 rounded-xl border border-red-500/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-red-400" />
                    Desafios e Limitações
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Desafios Técnicos</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Manutenção da coerência quântica</li>
                         <li>• Controle preciso de temperatura (∆T &lt; 1 mK)</li>
                        <li>• Isolamento de vibrações externas</li>
                        <li>• Sincronização de múltiplos lasers</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Limitações Físicas</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Força máxima limitada por decoerência</li>
                        <li>• Dependente de qualidade dos cristais</li>
                        <li>• Consumo energético alto (850 MW)</li>
                        <li>• Degradação gradual dos elementos BNF</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Considerações de Segurança</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Radiação laser de alta potência</li>
                        <li>• Campos eletromagnéticos intensos</li>
                        <li>• Risco de descontrole quântico</li>
                        <li>• Blindagem necessária para tripulação</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default VoltageImpedanceResonancePage;
