import React, { useRef, useEffect, useState } from 'react';
import { Atom, Zap, Radio, Waves, RefreshCw, Activity, Square } from 'lucide-react';

interface AtomicElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  electronConfiguration: string;
  valenceElectrons: number;
  shellElectrons: number[];
  color: string;
  firstIonizationEnergy: number; // in kJ/mol
  atomicRadius: number; // in pm
  electronegativity: number;
  magneticSusceptibility: number;
  electricPolarizability: number; // in 10^-24 cm³
  resonanceFrequencies: {
    kShell: number; // in THz
    lShell: number; // in THz
    valence: number; // in GHz
  };
}

interface ResonanceParameters {
  frequency: number;
  voltage: number;
  magneticField: number;
  fieldType: 'electric' | 'magnetic' | 'electromagnetic';
}

const AtomicSimulation: React.FC = () => {
  // Canvas refs
  const atomCanvasRef = useRef<HTMLCanvasElement>(null);
  const resonanceCanvasRef = useRef<HTMLCanvasElement>(null);
  const fieldInteractionCanvasRef = useRef<HTMLCanvasElement>(null);
  const impedanceCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation refs
  const atomAnimationRef = useRef<number>();
  const resonanceAnimationRef = useRef<number>();
  const fieldInteractionAnimationRef = useRef<number>();
  const impedanceAnimationRef = useRef<number>();
  
  // State
  const [selectedElement, setSelectedElement] = useState<'B' | 'N' | 'F'>('B');
  const [resonanceParams, setResonanceParams] = useState<ResonanceParameters>({
    frequency: 60,
    voltage: 120,
    magneticField: 1.5,
    fieldType: 'electromagnetic'
  });
  const [showShellLabels, setShowShellLabels] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [electronExcited, setElectronExcited] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  
  // Atomic element data
  const elements: Record<string, AtomicElementData> = {
    'B': {
      symbol: 'B',
      name: 'Boro',
      atomicNumber: 5,
      electronConfiguration: '1s² 2s² 2p¹',
      valenceElectrons: 3,
      shellElectrons: [2, 3],
      color: '#00ff88',
      firstIonizationEnergy: 800.6,
      atomicRadius: 85,
      electronegativity: 2.04,
      magneticSusceptibility: -6.7e-6,
      electricPolarizability: 3.03,
      resonanceFrequencies: {
        kShell: 1960,
        lShell: 412,
        valence: 41.4
      }
    },
    'N': {
      symbol: 'N',
      name: 'Nitrogênio',
      atomicNumber: 7,
      electronConfiguration: '1s² 2s² 2p³',
      valenceElectrons: 5,
      shellElectrons: [2, 5],
      color: '#5470ff',
      firstIonizationEnergy: 1402.3,
      atomicRadius: 65,
      electronegativity: 3.04,
      magneticSusceptibility: -5.0e-6,
      electricPolarizability: 1.13,
      resonanceFrequencies: {
        kShell: 2740,
        lShell: 617,
        valence: 43.8
      }
    },
    'F': {
      symbol: 'F',
      name: 'Flúor',
      atomicNumber: 9,
      electronConfiguration: '1s² 2s² 2p⁵',
      valenceElectrons: 7,
      shellElectrons: [2, 7],
      color: '#ff5ebd',
      firstIonizationEnergy: 1681.0,
      atomicRadius: 50,
      electronegativity: 3.98,
      magneticSusceptibility: -6.3e-6,
      electricPolarizability: 0.557,
      resonanceFrequencies: {
        kShell: 3580,
        lShell: 805,
        valence: 46.5
      }
    }
  };
  
  // Calculated properties
  const calculateResonantFrequency = (element: AtomicElementData) => {
    // Base frequency adjusted by electromagnetic field parameters
    const baseFrequency = element.resonanceFrequencies.valence;
    const magneticFieldFactor = Math.sqrt(1 + resonanceParams.magneticField / 10);
    const voltageFactor = Math.log10(resonanceParams.voltage) / Math.log10(120);
    
    return baseFrequency * magneticFieldFactor * voltageFactor;
  };
  
  const calculateImpedance = (element: AtomicElementData) => {
    // Simplified impedance model based on element properties
    const baseImpedance = 50 * (element.atomicRadius / 70);
    const resonantFreq = calculateResonantFrequency(element);
    const frequencyRatio = resonanceParams.frequency / resonantFreq;
    
    // Impedance behavior near resonance
    const resonanceFactor = 1 + 10 * Math.exp(-Math.pow(frequencyRatio - 1, 2) / 0.1);
    
    return {
      magnitude: baseImpedance * resonanceFactor,
      phase: Math.atan2(frequencyRatio - 1, 0.1) * (180 / Math.PI),
      real: baseImpedance * Math.cos(Math.atan2(frequencyRatio - 1, 0.1)),
      imaginary: baseImpedance * Math.sin(Math.atan2(frequencyRatio - 1, 0.1))
    };
  };
  
  const getResonanceIntensity = (element: AtomicElementData) => {
    const resonantFreq = calculateResonantFrequency(element);
    const frequencyRatio = resonanceParams.frequency / resonantFreq;
    
    // Gaussian curve for resonance intensity
    return Math.exp(-Math.pow(frequencyRatio - 1, 2) / 0.01);
  };
  
  // Draw atom visualization
  const drawAtomVisualization = () => {
    const canvas = atomCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() / 1000 * animationSpeed;
    
    // Get current element data
    const element = elements[selectedElement];
    
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
    
    // Draw nucleus
    const nucleusRadius = 15 + Math.sin(time) * 2;
    
    // Nucleus glow
    const nucleusGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, nucleusRadius * 2
    );
    nucleusGradient.addColorStop(0, element.color + 'cc');
    nucleusGradient.addColorStop(1, element.color + '00');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = nucleusGradient;
    ctx.fill();
    
    // Nucleus solid core
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
    ctx.fillStyle = element.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff30';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw element symbol
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.symbol, centerX, centerY);
    
    // Rotate entire canvas for 3D effect
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);
    ctx.translate(-centerX, -centerY);
    
    // Draw electron shells
    for (let i = 0; i < element.shellElectrons.length; i++) {
      const shellRadius = 50 + i * 60;
      
      // Draw shell circle
      ctx.beginPath();
      ctx.ellipse(
        centerX, 
        centerY, 
        shellRadius, 
        shellRadius * 0.8, // slightly squashed for 3D effect
        0, 
        0, 
        Math.PI * 2
      );
      ctx.strokeStyle = '#ffffff20';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw shell label
      if (showShellLabels) {
        ctx.font = '12px monospace';
        ctx.fillStyle = '#ffffff80';
        ctx.fillText(i === 0 ? 'K' : 'L', centerX + shellRadius, centerY);
      }
      
      // Draw electrons in this shell
      const electronCount = element.shellElectrons[i];
      
      for (let e = 0; e < electronCount; e++) {
        const angle = (e / electronCount) * Math.PI * 2 + time * (i + 1) * 0.2;
        let electronX, electronY;
        
        // Special case for excited electron
        if (electronExcited && i === 1 && e === electronCount - 1) {
          const excitementFactor = Math.sin(time * 5) * 0.5 + 0.5;
          const excitedShellRadius = shellRadius + 30 * excitementFactor;
          
          electronX = centerX + excitedShellRadius * Math.cos(angle);
          electronY = centerY + excitedShellRadius * 0.8 * Math.sin(angle);
          
          // Draw excitement path
          ctx.beginPath();
          ctx.arc(centerX, centerY, excitedShellRadius, 0, Math.PI * 2);
          ctx.strokeStyle = element.color + '40';
          ctx.stroke();
        } else {
          electronX = centerX + shellRadius * Math.cos(angle);
          electronY = centerY + shellRadius * 0.8 * Math.sin(angle);
        }
        
        // Draw electron orbit trail
        if ((i === 1 && e === electronCount - 1) || Math.random() > 0.7) {
          ctx.beginPath();
          ctx.arc(electronX, electronY, 10, 0, Math.PI * 2);
          ctx.fillStyle = element.color + '20';
          ctx.fill();
        }
        
        // Draw electron
        ctx.beginPath();
        ctx.arc(electronX, electronY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Draw electron glow
        ctx.save();
        ctx.filter = 'blur(3px)';
        ctx.beginPath();
        ctx.arc(electronX, electronY, 4, 0, Math.PI * 2);
        ctx.fillStyle = element.color;
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.restore(); // Restore rotation
    
    // Draw element info
    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`Átomo: ${element.name} (${element.symbol})`, 20, 30);
    ctx.fillText(`Número atômico: ${element.atomicNumber}`, 20, 50);
    ctx.fillText(`Configuração: ${element.electronConfiguration}`, 20, 70);
    ctx.fillText(`Elétrons de valência: ${element.valenceElectrons}`, 20, 90);
    
    // Set rotation for next frame
    setRotationAngle(prev => (prev + 0.001 * animationSpeed) % (Math.PI * 2));
    
    atomAnimationRef.current = requestAnimationFrame(drawAtomVisualization);
  };
  
  // Draw resonance visualization
  const drawResonanceVisualization = () => {
    const canvas = resonanceCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000 * animationSpeed;
    
    // Get current element data
    const element = elements[selectedElement];
    
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
    
    // Calculate resonance parameters
    const resonantFreq = calculateResonantFrequency(element);
    const resonanceIntensity = getResonanceIntensity(element);
    
    // Draw resonance curves
    const drawResonanceCurve = (shellName: string, shellFreq: number, yPos: number, color: string) => {
      const maxWidth = width - 100;
      const curveHeight = 60;
      
      // Draw shell label
      ctx.font = '14px monospace';
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.fillText(`${shellName}:`, 20, yPos);
      ctx.fillText(`${shellFreq.toFixed(1)} ${shellName === 'Valência' ? 'GHz' : 'THz'}`, width - 80, yPos);
      
      // Draw frequency scale
      ctx.strokeStyle = '#ffffff20';
      ctx.beginPath();
      ctx.moveTo(50, yPos + 20);
      ctx.lineTo(50 + maxWidth, yPos + 20);
      ctx.stroke();
      
      // Draw ticks
      const tickCount = 10;
      for (let i = 0; i <= tickCount; i++) {
        const x = 50 + (maxWidth / tickCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, yPos + 15);
        ctx.lineTo(x, yPos + 25);
        ctx.stroke();
        
        // Draw frequency value for some ticks
        if (i % 2 === 0) {
          const tickFreq = (shellFreq * 0.5) + (shellFreq * i / tickCount);
          ctx.font = '10px monospace';
          ctx.fillStyle = '#ffffff60';
          ctx.textAlign = 'center';
          ctx.fillText(tickFreq.toFixed(0), x, yPos + 40);
        }
      }
      
      // Draw resonance curve
      ctx.beginPath();
      for (let x = 0; x < maxWidth; x++) {
        const freqRatio = (x / maxWidth) * 2; // 0 to 2 x resonant frequency
        const intensity = Math.exp(-Math.pow(freqRatio - 1, 2) / 0.1);
        const y = yPos + 20 - intensity * curveHeight;
        
        if (x === 0) {
          ctx.moveTo(50 + x, y);
        } else {
          ctx.lineTo(50 + x, y);
        }
      }
      
      // Draw animated marker for current frequency
      const currentFreqRatio = resonanceParams.frequency / shellFreq;
      if (currentFreqRatio > 0 && currentFreqRatio < 2) {
        const markerX = 50 + (currentFreqRatio / 2) * maxWidth;
        const markerIntensity = Math.exp(-Math.pow(currentFreqRatio - 1, 2) / 0.1);
        const markerY = yPos + 20 - markerIntensity * curveHeight;
        
        // Draw vertical line
        ctx.strokeStyle = color + '60';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(markerX, yPos + 20);
        ctx.lineTo(markerX, markerY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw marker
        ctx.beginPath();
        ctx.arc(markerX, markerY, 5 + Math.sin(time * 5) * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Draw pulsating glow
        ctx.save();
        ctx.filter = 'blur(8px)';
        ctx.globalAlpha = 0.3 + 0.2 * Math.sin(time * 3);
        ctx.beginPath();
        ctx.arc(markerX, markerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    
    // Draw shell resonance curves
    drawResonanceCurve('K-shell', element.resonanceFrequencies.kShell, 70, '#22d3ee');
    drawResonanceCurve('L-shell', element.resonanceFrequencies.lShell, 150, '#a855f7');
    drawResonanceCurve('Valência', element.resonanceFrequencies.valence, 230, element.color);
    
    // Draw current resonance info
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`Frequência Atual: ${resonanceParams.frequency.toFixed(1)} Hz`, width / 2, 30);
    
    // Draw resonance intensity meter
    const meterWidth = 200;
    const meterHeight = 20;
    const meterX = (width - meterWidth) / 2;
    const meterY = height - 50;
    
    ctx.fillStyle = '#ffffff20';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
    
    const gradient = ctx.createLinearGradient(meterX, 0, meterX + meterWidth, 0);
    gradient.addColorStop(0, '#22d3ee20');
    gradient.addColorStop(0.5, element.color);
    gradient.addColorStop(1, '#ec489920');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(meterX, meterY, meterWidth * resonanceIntensity, meterHeight);
    
    ctx.strokeStyle = '#ffffff40';
    ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
    
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Intensidade de Ressonância', width / 2, meterY - 10);
    ctx.fillText(`${(resonanceIntensity * 100).toFixed(1)}%`, width / 2, meterY + meterHeight + 15);
    
    resonanceAnimationRef.current = requestAnimationFrame(drawResonanceVisualization);
  };
  
  // Draw field interaction visualization
  const drawFieldInteractionVisualization = () => {
    const canvas = fieldInteractionCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() / 1000 * animationSpeed;
    
    // Get current element data
    const element = elements[selectedElement];
    const resonanceIntensity = getResonanceIntensity(element);
    
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
    
    // Draw field type label
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`Campo ${resonanceParams.fieldType === 'electric' ? 'Elétrico' : 
                         resonanceParams.fieldType === 'magnetic' ? 'Magnético' : 
                         'Eletromagnético'}`, width / 2, 30);
    
    // Draw atom
    const atomRadius = 30;
    ctx.beginPath();
    ctx.arc(centerX, centerY, atomRadius, 0, Math.PI * 2);
    ctx.fillStyle = element.color + '40';
    ctx.fill();
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw element symbol
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.symbol, centerX, centerY);
    
    // Draw field lines based on field type
    const drawElectricField = () => {
      const lineCount = 12;
      const maxLength = Math.min(width, height) * 0.4;
      
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const startX = centerX + Math.cos(angle) * atomRadius;
        const startY = centerY + Math.sin(angle) * atomRadius;
        const endX = centerX + Math.cos(angle) * maxLength;
        const endY = centerY + Math.sin(angle) * maxLength;
        
        // Draw field line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw animated charge particles
        const particleCount = 3;
        for (let p = 0; p < particleCount; p++) {
          const t = ((time * (1 + resonanceIntensity) / 2) + p / particleCount) % 1;
          const px = startX + (endX - startX) * t;
          const py = startY + (endY - startY) * t;
          
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          
          // Glow
          ctx.save();
          ctx.filter = 'blur(3px)';
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.restore();
        }
      }
    };
    
    const drawMagneticField = () => {
      const ringCount = 5;
      const maxRadius = Math.min(width, height) * 0.4;
      const ringSpacing = (maxRadius - atomRadius) / ringCount;
      
      for (let i = 0; i < ringCount; i++) {
        const radius = atomRadius + ringSpacing * (i + 1);
        
        // Draw magnetic field ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.8 - i * 0.15})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw animated particles along the ring
        const particleCount = 8;
        for (let p = 0; p < particleCount; p++) {
          const angle = ((time * (0.2 + i * 0.1) * (1 + resonanceIntensity)) + p / particleCount) % (Math.PI * 2);
          const px = centerX + Math.cos(angle) * radius;
          const py = centerY + Math.sin(angle) * radius;
          
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#a855f7';
          ctx.fill();
          
          // Glow
          ctx.save();
          ctx.filter = 'blur(3px)';
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#a855f7';
          ctx.fill();
          ctx.restore();
        }
      }
    };
    
    const drawElectromagneticField = () => {
      // Draw electromagnetic wave fronts
      const waveCount = 5;
      const maxRadius = Math.min(width, height) * 0.4;
      
      for (let i = 0; i < waveCount; i++) {
        const phase = ((time * (1 + resonanceIntensity) / 2) + i / waveCount) % 1;
        const radius = atomRadius + phase * (maxRadius - atomRadius);
        
        // Draw wave front
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(236, 72, 153, ${1 - phase})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw magnetic component (perpendicular)
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - phase})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw oscillating electric and magnetic field vectors
      const fieldLength = 80;
      const eFieldY = centerY - 100;
      const mFieldY = centerY + 100;
      
      // Electric field oscillation
      ctx.beginPath();
      for (let x = centerX - fieldLength; x <= centerX + fieldLength; x += 2) {
        const t = (x - (centerX - fieldLength)) / (fieldLength * 2);
        const amplitude = 30 * Math.sin(t * Math.PI * 6 + time * 5);
        const y = eFieldY + amplitude;
        
        if (x === centerX - fieldLength) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Magnetic field oscillation (phase shifted)
      ctx.beginPath();
      for (let x = centerX - fieldLength; x <= centerX + fieldLength; x += 2) {
        const t = (x - (centerX - fieldLength)) / (fieldLength * 2);
        const amplitude = 30 * Math.sin(t * Math.PI * 6 + time * 5 + Math.PI / 2);
        const y = mFieldY + amplitude;
        
        if (x === centerX - fieldLength) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Labels
      ctx.font = '12px monospace';
      ctx.fillStyle = '#ec4899';
      ctx.textAlign = 'right';
      ctx.fillText('Campo Elétrico', centerX - fieldLength - 10, eFieldY);
      
      ctx.fillStyle = '#a855f7';
      ctx.fillText('Campo Magnético', centerX - fieldLength - 10, mFieldY);
    };
    
    // Draw field based on selected type
    if (resonanceParams.fieldType === 'electric') {
      drawElectricField();
    } else if (resonanceParams.fieldType === 'magnetic') {
      drawMagneticField();
    } else {
      drawElectromagneticField();
    }
    
    // Draw electron excitation if resonant
    if (resonanceIntensity > 0.7) {
      const particleCount = Math.floor(resonanceIntensity * 20);
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = atomRadius + Math.random() * 30;
        const px = centerX + Math.cos(angle) * distance;
        const py = centerY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = element.color;
        ctx.fill();
        
        // Glow
        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = element.color;
        ctx.fill();
        ctx.restore();
      }
      
      // Set excited state for atom visualization
      if (!electronExcited && Math.random() > 0.9) {
        setElectronExcited(true);
        setTimeout(() => setElectronExcited(false), 2000);
      }
    }
    
    // Draw field parameters
    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`Tensão: ${resonanceParams.voltage}V`, 20, height - 70);
    ctx.fillText(`Frequência: ${resonanceParams.frequency}Hz`, 20, height - 50);
    ctx.fillText(`Campo Magnético: ${resonanceParams.magneticField}T`, 20, height - 30);
    
    fieldInteractionAnimationRef.current = requestAnimationFrame(drawFieldInteractionVisualization);
  };
  
  // Draw impedance visualization
  const drawImpedanceVisualization = () => {
    const canvas = impedanceCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now() / 1000 * animationSpeed;
    
    // Get current element data
    const element = elements[selectedElement];
    const impedance = calculateImpedance(element);
    
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
    
    // Draw impedance vector diagram
    const scaleFactor = 2;
    const resistance = impedance.real;
    const reactance = impedance.imaginary;
    
    // Draw axes
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 1;
    
    // X-axis (resistance)
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.lineTo(centerX + 150, centerY);
    ctx.stroke();
    
    // Y-axis (reactance)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 150);
    ctx.lineTo(centerX, centerY + 150);
    ctx.stroke();
    
    // Labels
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff80';
    ctx.textAlign = 'right';
    ctx.fillText('Reactância (X)', centerX - 10, centerY - 130);
    
    ctx.textAlign = 'left';
    ctx.fillText('Resistência (R)', centerX + 130, centerY - 10);
    
    // Origin point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Draw resistance component
    const resistanceX = centerX + resistance * scaleFactor;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(resistanceX, centerY);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw reactance component
    const reactanceY = centerY - reactance * scaleFactor;
    
    ctx.beginPath();
    ctx.moveTo(resistanceX, centerY);
    ctx.lineTo(resistanceX, reactanceY);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw impedance vector
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(resistanceX, reactanceY);
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw animated angle arc
    const angle = Math.atan2(-reactance, resistance);
    const arcRadius = 30;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, 0, angle, angle > 0);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw component values
    ctx.font = '14px monospace';
    
    // Resistance label
    ctx.fillStyle = '#22d3ee';
    ctx.textAlign = 'center';
    ctx.fillText(`R = ${resistance.toFixed(2)}Ω`, (centerX + resistanceX) / 2, centerY + 20);
    
    // Reactance label
    ctx.fillStyle = '#a855f7';
    ctx.textAlign = 'left';
    ctx.fillText(`X = ${Math.abs(reactance).toFixed(2)}Ω ${reactance >= 0 ? '(indutivo)' : '(capacitivo)'}`, 
                resistanceX + 10, (centerY + reactanceY) / 2);
    
    // Impedance label
    ctx.fillStyle = element.color;
    ctx.textAlign = 'center';
    ctx.fillText(`|Z| = ${impedance.magnitude.toFixed(2)}Ω ∠${impedance.phase.toFixed(1)}°`, 
                (centerX + resistanceX) / 2 - 20, (centerY + reactanceY) / 2 - 20);
    
    // Draw current/voltage phasor
    const phasorLength = 100;
    const currentTime = time % (Math.PI * 2);
    
    // Voltage phasor
    const voltageX = centerX - 120 + phasorLength * Math.cos(currentTime);
    const voltageY = height - 80 + phasorLength * Math.sin(currentTime);
    
    ctx.beginPath();
    ctx.moveTo(centerX - 120, height - 80);
    ctx.lineTo(voltageX, voltageY);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Current phasor (shifted by impedance angle)
    const currentX = centerX + 120 + phasorLength * Math.cos(currentTime - impedance.phase * Math.PI / 180);
    const currentY = height - 80 + phasorLength * Math.sin(currentTime - impedance.phase * Math.PI / 180);
    
    ctx.beginPath();
    ctx.moveTo(centerX + 120, height - 80);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Phasor labels
    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Tensão', centerX - 120, height - 130);
    ctx.fillText('Corrente', centerX + 120, height - 130);
    
    // Phase shift label
    ctx.fillStyle = '#eab308';
    ctx.fillText(`Defasagem: ${impedance.phase.toFixed(1)}°`, centerX, height - 40);
    
    impedanceAnimationRef.current = requestAnimationFrame(drawImpedanceVisualization);
  };
  
  // Initialize and clean up animations
  useEffect(() => {
    drawAtomVisualization();
    drawResonanceVisualization();
    drawFieldInteractionVisualization();
    drawImpedanceVisualization();
    
    return () => {
      if (atomAnimationRef.current) {
        cancelAnimationFrame(atomAnimationRef.current);
      }
      if (resonanceAnimationRef.current) {
        cancelAnimationFrame(resonanceAnimationRef.current);
      }
      if (fieldInteractionAnimationRef.current) {
        cancelAnimationFrame(fieldInteractionAnimationRef.current);
      }
      if (impedanceAnimationRef.current) {
        cancelAnimationFrame(impedanceAnimationRef.current);
      }
    };
  }, [selectedElement, resonanceParams, showShellLabels, animationSpeed, electronExcited]);
  
  return (
    <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Atom className="text-violet-400" />
        Simulação Atômica: Interações Eletromagnéticas
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Element selector */}
        <div className="bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Elemento Atômico</h3>
          <div className="flex gap-3 mb-4">
            {Object.entries(elements).map(([symbol, element]) => (
              <button
                key={symbol}
                onClick={() => setSelectedElement(symbol as 'B' | 'N' | 'F')}
                className={`flex-1 p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                  selectedElement === symbol 
                    ? 'bg-violet-600' 
                    : 'bg-violet-900/40 hover:bg-violet-900/60'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full mb-1 flex items-center justify-center font-bold"
                  style={{ backgroundColor: element.color + '40', color: '#ffffff' }}
                >
                  {symbol}
                </div>
                <span className="text-sm">{element.name}</span>
              </button>
            ))}
          </div>
          
          {/* Element properties */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Configuração:</span>
              <span className="text-violet-400 font-mono">{elements[selectedElement].electronConfiguration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Elétrons de valência:</span>
              <span className="text-violet-400 font-mono">{elements[selectedElement].valenceElectrons}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Raio atômico:</span>
              <span className="text-violet-400 font-mono">{elements[selectedElement].atomicRadius} pm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Eletronegatividade:</span>
              <span className="text-violet-400 font-mono">{elements[selectedElement].electronegativity}</span>
            </div>
          </div>
        </div>
        
        {/* Field parameters */}
        <div className="bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Parâmetros do Campo</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Frequência (Hz)
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                value={resonanceParams.frequency}
                onChange={(e) => setResonanceParams({
                  ...resonanceParams,
                  frequency: Number(e.target.value)
                })}
                className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-violet-400 mt-1">
                {resonanceParams.frequency}Hz
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tensão (V)
              </label>
              <input
                type="range"
                min="1"
                max="240"
                value={resonanceParams.voltage}
                onChange={(e) => setResonanceParams({
                  ...resonanceParams,
                  voltage: Number(e.target.value)
                })}
                className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-violet-400 mt-1">
                {resonanceParams.voltage}V
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Campo Magnético (T)
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={resonanceParams.magneticField}
                onChange={(e) => setResonanceParams({
                  ...resonanceParams,
                  magneticField: Number(e.target.value)
                })}
                className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-violet-400 mt-1">
                {resonanceParams.magneticField}T
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Campo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setResonanceParams({
                    ...resonanceParams,
                    fieldType: 'electric'
                  })}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    resonanceParams.fieldType === 'electric' 
                      ? 'bg-violet-600' 
                      : 'bg-violet-900/40 hover:bg-violet-900/60'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="text-xs">Elétrico</span>
                </button>
                <button
                  onClick={() => setResonanceParams({
                    ...resonanceParams,
                    fieldType: 'magnetic'
                  })}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    resonanceParams.fieldType === 'magnetic' 
                      ? 'bg-violet-600' 
                      : 'bg-violet-900/40 hover:bg-violet-900/60'
                  }`}
                >
                  <Radio className="w-4 h-4 mr-1" />
                  <span className="text-xs">Magnético</span>
                </button>
                <button
                  onClick={() => setResonanceParams({
                    ...resonanceParams,
                    fieldType: 'electromagnetic'
                  })}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    resonanceParams.fieldType === 'electromagnetic' 
                      ? 'bg-violet-600' 
                      : 'bg-violet-900/40 hover:bg-violet-900/60'
                  }`}
                >
                  <Waves className="w-4 h-4 mr-1" />
                  <span className="text-xs">EM</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Visualization settings */}
        <div className="md:col-span-2 bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Configurações de Visualização</h3>
          
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showShellLabels"
                checked={showShellLabels}
                onChange={(e) => setShowShellLabels(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="showShellLabels" className="ml-2 text-sm text-gray-300">
                Mostrar rótulos das camadas
              </label>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="animationSpeed" className="mr-2 text-sm text-gray-300">
                Velocidade:
              </label>
              <input
                type="range"
                id="animationSpeed"
                min="0.1"
                max="3"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-32 h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 text-sm text-violet-400">×{animationSpeed.toFixed(1)}</span>
            </div>
            
            <button
              onClick={() => setElectronExcited(!electronExcited)}
              className={`px-3 py-1 rounded-lg flex items-center ${
                electronExcited 
                  ? 'bg-violet-600' 
                  : 'bg-violet-900/40 hover:bg-violet-900/60'
              }`}
            >
              <Activity className="w-4 h-4 mr-1" />
              <span className="text-sm">Excitar elétron</span>
            </button>
          </div>
        </div>
        
        {/* Atom visualization */}
        <div className="bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Atom className="text-violet-400 w-5 h-5" />
            Estrutura Atômica
          </h3>
          <canvas
            ref={atomCanvasRef}
            width={400}
            height={300}
            className="w-full bg-[#1a1a2e] rounded-lg mb-2"
          />
          <p className="text-sm text-gray-400">
            Visualização da estrutura eletrônica de {elements[selectedElement].name} ({selectedElement}).
            Camadas K e L com suas respectivas distribuições eletrônicas.
          </p>
        </div>
        
        {/* Resonance visualization */}
        <div className="bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Waves className="text-violet-400 w-5 h-5" />
            Frequências de Ressonância
          </h3>
          <canvas
            ref={resonanceCanvasRef}
            width={400}
            height={300}
            className="w-full bg-[#1a1a2e] rounded-lg mb-2"
          />
          <p className="text-sm text-gray-400">
            Visualização das frequências de ressonância para cada camada eletrônica.
            A intensidade da ressonância varia conforme a frequência aplicada.
          </p>
        </div>
        
        {/* Field interaction visualization */}
        <div className="bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Radio className="text-violet-400 w-5 h-5" />
            Interação com Campo Eletromagnético
          </h3>
          <canvas
            ref={fieldInteractionCanvasRef}
            width={400}
            height={300}
            className="w-full bg-[#1a1a2e] rounded-lg mb-2"
          />
          <p className="text-sm text-gray-400">
            Simulação da interação do átomo com campos elétricos, magnéticos ou eletromagnéticos.
            Em condições de ressonância, os elétrons podem ser excitados para níveis energéticos superiores.
          </p>
        </div>
        
        {/* Impedance visualization */}
        <div className="bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Square className="text-violet-400 w-5 h-5" />
            Análise de Impedância
          </h3>
          <canvas
            ref={impedanceCanvasRef}
            width={400}
            height={300}
            className="w-full bg-[#1a1a2e] rounded-lg mb-2"
          />
          <p className="text-sm text-gray-400">
            Representação vetorial da impedância (Z) em termos de resistência (R) e reatância (X).
            A defasagem entre tensão e corrente é indicativa do comportamento capacitivo ou indutivo.
          </p>
        </div>
        
        {/* Data summary */}
        <div className="md:col-span-2 bg-violet-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="text-violet-400 w-5 h-5" />
            Parâmetros Calculados
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-violet-900/40 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-violet-400 mb-1">Frequência Ressonante</h4>
              <p className="text-lg font-mono">{calculateResonantFrequency(elements[selectedElement]).toFixed(2)} Hz</p>
            </div>
            
            <div className="bg-violet-900/40 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-violet-400 mb-1">Impedância</h4>
              <p className="text-lg font-mono">{calculateImpedance(elements[selectedElement]).magnitude.toFixed(2)} Ω</p>
            </div>
            
            <div className="bg-violet-900/40 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-violet-400 mb-1">Defasagem</h4>
              <p className="text-lg font-mono">{calculateImpedance(elements[selectedElement]).phase.toFixed(1)}°</p>
            </div>
            
            <div className="bg-violet-900/40 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-violet-400 mb-1">Intensidade de Ressonância</h4>
              <p className="text-lg font-mono">{(getResonanceIntensity(elements[selectedElement]) * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
              Este simulador é uma representação simplificada para fins educativos. As interações reais em escala atômica envolvem mecânica quântica avançada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomicSimulation;

