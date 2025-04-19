import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Settings, RefreshCw, Volume2, VolumeX, AlertTriangle, Thermometer, Atom, Layers, BrainCircuit as Circuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';
import Navigation from '../components/Navigation';

interface Element {
  name: string;
  symbol: string;
  electrons: number;
  temperature: number;
  shells: number[];
}

const VoltageMultiplierPage = () => {
  const [inputVoltage, setInputVoltage] = useState(5);
  const [frequency, setFrequency] = useState(60);
  const [stages, setStages] = useState(4);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioPermission, setAudioPermission] = useState<PermissionState>('prompt');
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atomCanvasRef = useRef<HTMLCanvasElement>(null);
  const quantumZonesCanvasRef = useRef<HTMLCanvasElement>(null);
  const circuitCanvasRef = useRef<HTMLCanvasElement>(null);
  const circuit3DCanvasRef = useRef<HTMLCanvasElement>(null);
  const atomAnimationRef = useRef<number>();
  const quantumAnimationRef = useRef<number>();
  const circuitAnimationRef = useRef<number>();
  const circuit3DAnimationRef = useRef<number>();
  const [voltageReadings, setVoltageReadings] = useState<number[]>([]);
  const oscillatorsRef = useRef<Tone.Oscillator[]>([]);
  const animationFrameRef = useRef<number>();
  const [rotationAngle, setRotationAngle] = useState(0);

  const elements: Element[] = [
    { symbol: 'H', name: 'Hidrogênio', electrons: 1, temperature: 14.01, shells: [1] },
    { symbol: 'He', name: 'Hélio', electrons: 2, temperature: 4.22, shells: [2] },
    { symbol: 'Li', name: 'Lítio', electrons: 3, temperature: 453.69, shells: [2, 1] },
    { symbol: 'Be', name: 'Berílio', electrons: 4, temperature: 1560, shells: [2, 2] },
    { symbol: 'B', name: 'Boro', electrons: 5, temperature: 2349, shells: [2, 3] },
    { symbol: 'C', name: 'Carbono', electrons: 6, temperature: 3915, shells: [2, 4] },
    { symbol: 'N', name: 'Nitrogênio', electrons: 7, temperature: 77.36, shells: [2, 5] },
    { symbol: 'O', name: 'Oxigênio', electrons: 8, temperature: 90.20, shells: [2, 6] },
    { symbol: 'F', name: 'Flúor', electrons: 9, temperature: 85.03, shells: [2, 7] },
    { symbol: 'Ne', name: 'Neônio', electrons: 10, temperature: 27.07, shells: [2, 8] },
    { symbol: 'Na', name: 'Sódio', electrons: 11, temperature: 371, shells: [2, 8, 1] },
    { symbol: 'Mg', name: 'Magnésio', electrons: 12, temperature: 923, shells: [2, 8, 2] },
    { symbol: 'Al', name: 'Alumínio', electrons: 13, temperature: 933.47, shells: [2, 8, 3] },
    { symbol: 'Si', name: 'Silício', electrons: 14, temperature: 1687, shells: [2, 8, 4] },
    { symbol: 'P', name: 'Fósforo', electrons: 15, temperature: 317.3, shells: [2, 8, 5] },
    { symbol: 'S', name: 'Enxofre', electrons: 16, temperature: 388.36, shells: [2, 8, 6] },
    { symbol: 'Cl', name: 'Cloro', electrons: 17, temperature: 239.11, shells: [2, 8, 7] },
    { symbol: 'Ar', name: 'Argônio', electrons: 18, temperature: 87.30, shells: [2, 8, 8] },
  ].sort((a, b) => a.electrons - b.electrons);

  useEffect(() => {
    if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
      setBrowserSupported(false);
      return;
    }

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(permissionStatus => {
          setAudioPermission(permissionStatus.state);
          permissionStatus.onchange = () => {
            setAudioPermission(permissionStatus.state);
          };
        })
        .catch(() => {
          setAudioPermission('prompt');
        });
    }
  }, []);

  useEffect(() => {
    if (audioEnabled && oscillatorsRef.current.length === 0) {
      const baseFreqs = [220, 330, 440, 550, 660, 770, 880, 990];
      oscillatorsRef.current = baseFreqs.map(freq => {
        const osc = new Tone.Oscillator({
          frequency: freq,
          type: "sine",
          volume: -20
        }).toDestination();
        return osc;
      });
    }

    return () => {
      oscillatorsRef.current.forEach(osc => osc.dispose());
      oscillatorsRef.current = [];
    };
  }, [audioEnabled]);

  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setAudioPermission('granted');
      setShowPermissionDialog(false);
      toggleAudio();
    } catch (error) {
      console.error('Error requesting audio permission:', error);
      setAudioPermission('denied');
    }
  };

  const toggleAudio = async () => {
    if (!browserSupported) {
      alert('Seu navegador não suporta os recursos de áudio necessários.');
      return;
    }

    if (!audioEnabled) {
      if (audioPermission === 'prompt') {
        setShowPermissionDialog(true);
        return;
      } else if (audioPermission === 'denied') {
        alert('Permissão de áudio negada. Por favor, habilite o acesso ao áudio nas configurações do seu navegador.');
        return;
      }

      await Tone.start();
      setAudioEnabled(true);
      oscillatorsRef.current.forEach(osc => osc.start());
    } else {
      oscillatorsRef.current.forEach(osc => osc.stop());
      setAudioEnabled(false);
    }
  };

  const calculateVoltages = () => {
    const efficiency = 0.95;
    const readings = [];
    const baseVoltage = selectedElement ? (inputVoltage * selectedElement.electrons) : inputVoltage;
    
    for (let i = 1; i <= stages; i++) {
      const theoreticalVoltage = baseVoltage * 2 * i;
      const actualVoltage = theoreticalVoltage * Math.pow(efficiency, i);
      readings.push(Number(actualVoltage.toFixed(2)));
    }
    setVoltageReadings(readings);

    if (audioEnabled) {
      readings.forEach((voltage, index) => {
        if (oscillatorsRef.current[index]) {
          const baseFreq = 220 * (index + 1);
          const voltageFactor = voltage / baseVoltage;
          oscillatorsRef.current[index].frequency.value = baseFreq * voltageFactor;
          oscillatorsRef.current[index].volume.value = -20 + (voltage * 1.5);
        }
      });
    }
  };

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#333344';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    const colors = ['#22d3ee', '#a855f7', '#eab308', '#ec4899'];
    const time = Date.now() / 1000;
    
    voltageReadings.forEach((voltage, index) => {
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 4 + time * frequency / 10;
        const noise = Math.random() * 0.1;
        const y = canvas.height / 2 - (
          (Math.sin(t + index * Math.PI/4) * voltage * 10) +
          (Math.sin(t * 2) * voltage * 2) +
          (noise * voltage)
        );
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = colors[index % colors.length];
      ctx.stroke();
      ctx.restore();
    });

    const scanX = (Math.sin(time * 2) + 1) * canvas.width / 2;
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(scanX, 0);
    ctx.lineTo(scanX, canvas.height);
    ctx.stroke();

    animationFrameRef.current = requestAnimationFrame(drawOscilloscope);
  };

  const drawAtomicVisualization = () => {
    const canvas = atomCanvasRef.current;
    if (!canvas || !selectedElement) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.strokeStyle = '#ec489966';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.filter = 'blur(8px)';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.restore();

    const time = Date.now() / 1000;
    const shellRadii = [50, 80, 110];
    
    selectedElement.shells.forEach((electronCount, shellIndex) => {
      const radius = shellRadii[shellIndex];
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < electronCount; i++) {
        const angle = (i * (Math.PI * 2) / electronCount) + time * (1 + shellIndex * 0.5);
        const electronX = centerX + radius * Math.cos(angle);
        const electronY = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(electronX, electronY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.fill();

        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(electronX, electronY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.fill();
        ctx.restore();
      }
    });

    const laserAngle = Math.sin(time * 2) * Math.PI / 6;
    const laserLength = width;
    const laserStartX = centerX - Math.cos(laserAngle) * laserLength;
    const laserStartY = centerY - Math.sin(laserAngle) * laserLength;
    const laserEndX = centerX + Math.cos(laserAngle) * laserLength;
    const laserEndY = centerY + Math.sin(laserAngle) * laserLength;

    const gradient = ctx.createLinearGradient(laserStartX, laserStartY, laserEndX, laserEndY);
    gradient.addColorStop(0, '#a855f700');
    gradient.addColorStop(0.4, '#a855f7');
    gradient.addColorStop(0.6, '#a855f7');
    gradient.addColorStop(1, '#a855f700');

    ctx.beginPath();
    ctx.moveTo(laserStartX, laserStartY);
    ctx.lineTo(laserEndX, laserEndY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.filter = 'blur(8px)';
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particleTime = time + i * (Math.PI * 2 / particleCount);
      const distance = Math.sin(particleTime * 3) * 30;
      const angle = particleTime * 2;
      
      const particleX = centerX + distance * Math.cos(angle);
      const particleY = centerY + distance * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${0.5 + Math.sin(particleTime) * 0.5})`;
      ctx.fill();
    }

    atomAnimationRef.current = requestAnimationFrame(drawAtomicVisualization);
  };

  const drawQuantumZones = () => {
    const canvas = quantumZonesCanvasRef.current;
    if (!canvas || !selectedElement) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

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

    const dopants = [
      { element: 'B', color: '#ec4899', x: width * 0.2, y: height * 0.3 },
      { element: 'N', color: '#22d3ee', x: width * 0.6, y: height * 0.7 },
      { element: 'F', color: '#a855f7', x: width * 0.8, y: height * 0.4 }
    ];

    dopants.forEach(dopant => {
      const radius = 40 + Math.sin(time * 2) * 5;
      
      ctx.save();
      ctx.filter = 'blur(20px)';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(dopant.x, dopant.y, radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = dopant.color;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(dopant.x, dopant.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `${dopant.color}33`;
      ctx.fill();
      ctx.strokeStyle = dopant.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(dopant.element, dopant.x, dopant.y + 5);

      const charge = selectedElement.electrons / 10;
      ctx.fillStyle = '#ffffff88';
      ctx.font = '12px monospace';
      ctx.fillText(`${charge.toFixed(2)}e⁻`, dopant.x, dopant.y + 25);
    });

    const laserAngle = Math.sin(time) * Math.PI / 6;
    const laserWidth = 10;
    
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(laserAngle);
    
    const gradient = ctx.createLinearGradient(-width/2, 0, width/2, 0);
    gradient.addColorStop(0, '#22d3ee00');
    gradient.addColorStop(0.2, '#22d3ee');
    gradient.addColorStop(0.8, '#22d3ee');
    gradient.addColorStop(1, '#22d3ee00');

    ctx.fillStyle = gradient;
    ctx.fillRect(-width/2, -laserWidth/2, width, laserWidth);

    for (let i = 0; i < 20; i++) {
      const x = (Math.sin(time * 3 + i) * width/3);
      const y = (Math.cos(time * 2 + i) * laserWidth);
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${0.5 + Math.sin(time + i) * 0.5})`;
      ctx.fill();
    }
    ctx.restore();

    const zoneCount = 3;
    for (let i = 0; i < zoneCount; i++) {
      const centerX = width * (0.25 + (i * 0.25));
      const centerY = height * (0.3 + Math.sin(time + i) * 0.1);
      const radius = 30 + Math.sin(time * 2 + i) * 5;

      const repulsionGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 2
      );
      repulsionGradient.addColorStop(0, `rgba(236, 72, 153, ${0.3 + Math.sin(time + i) * 0.1})`);
      repulsionGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = repulsionGradient;
      ctx.fill();

      const lineCount = 8;
      for (let j = 0; j < lineCount; j++) {
        const angle = (j / lineCount) * Math.PI * 2 + time + i;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius * 1.5);
        const y2 = centerY + Math.sin(angle) * (radius * 1.5);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.5 + Math.sin(time + j) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const energy = (selectedElement?.electrons || 1) * (i + 1) * 1.5;
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${energy.toFixed(1)} eV`, centerX, centerY - radius - 10);
    }

    const electronCount = 30;
    for (let i = 0; i < electronCount; i++) {
      const progress = (time * 2 + i / electronCount) % 1;
      const x = width * progress;
      const y = height * 0.5 + Math.sin(progress * Math.PI * 4) * 50;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();

      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();
      ctx.restore();
    }

    const fieldLineCount = 5;
    for (let i = 0; i < fieldLineCount; i++) {
      const y = height * (0.2 + (i * 0.15));
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < width; x += 5) {
        const offset = Math.sin(x * 0.02 + time * 2) * 10;
        ctx.lineTo(x, y + offset);
      }
      
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    quantumAnimationRef.current = requestAnimationFrame(drawQuantumZones);
  };

  const drawCircuitAnimation = () => {
    const canvas = circuitCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    const hexSize = 40;
    const hexHeight = hexSize * Math.sqrt(3);
    const hexWidth = hexSize * 2;
    
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 1;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x = col * hexWidth * 0.75 + (row % 2) * (hexWidth * 0.375);
        const y = row * hexHeight * 0.5;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;
          const px = x + hexSize * Math.cos(angle);
          const py = y + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const circleRadius = 100;

    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    const points = [];
    const pointCount = 6;
    for (let i = 0; i < pointCount; i++) {
      const angle = (i * Math.PI * 2) / pointCount;
      points.push({
        x: centerX + Math.cos(angle) * circleRadius * 0.6,
        y: centerY + Math.sin(angle) * circleRadius * 0.6
      });
    }

    points.forEach((point, i) => {
      const nextPoint = points[(i + 1) % points.length];
      
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();

      const midX = (point.x + nextPoint.x) / 2;
      const midY = (point.y + nextPoint.y) / 2;
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);
      
      ctx.beginPath();
      ctx.moveTo(-5, -8);
      ctx.lineTo(-5, 8);
      ctx.moveTo(5, -8);
      ctx.lineTo(5, 8);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    });

    const flowPoints = 6;
    for (let i = 0; i < flowPoints; i++) {
      const angle = time * 2 + (i * Math.PI * 2) / flowPoints;
      const x = centerX + Math.cos(angle) * circleRadius;
      const y = centerY + Math.sin(angle) * circleRadius;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();

      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();
      ctx.restore();
    }

    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('5V/20A', centerX - circleRadius - 40, centerY);
    ctx.fillText('17kV', centerX + circleRadius + 40, centerY);

    const stageInfo = [
      { stage: 1, c: 'C', r: '10Ω' },
      { stage: 2, c: '33', r: '56Ω' },
      { stage: 3, c: '100', r: '5Ω' }
    ];

    ctx.textAlign = 'left';
    stageInfo.forEach((info, i) => {
      const y = centerY + circleRadius + 30 + i * 20;
      ctx.fillText(`Stage ${info.stage}: ${info.c} ${info.r}`, centerX - 60, y);
    });

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const t = time * 2 + i * (Math.PI * 2 / particleCount);
      const radius = circleRadius * (0.8 + Math.sin(t * 3) * 0.2);
      const x = centerX + Math.cos(t) * radius;
      const y = centerY + Math.sin(t) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236, 72, 153, ${0.5 + Math.sin(t) * 0.5})`;
      ctx.fill();
    }

    circuitAnimationRef.current = requestAnimationFrame(drawCircuitAnimation);
  };

  const draw3DCircuit = () => {
    const canvas = circuit3DCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() / 1000;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = 120;
    const verticalScale = 0.3;
    
    const gridLayers = 5;
    const gridSpacing = 40;
    
    for (let layer = 0; layer < gridLayers; layer++) {
      const depth = layer * gridSpacing;
      const scale = 1 - depth * 0.001;
      const opacity = 1 - depth * 0.1;
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + rotationAngle;
        const nextAngle = ((i + 1) * Math.PI) / 3 + rotationAngle;
        
        const x1 = centerX + Math.cos(angle) * baseRadius * scale;
        
        const y1 = centerY + Math.sin(angle) * baseRadius * scale * verticalScale;
        const x2 = centerX + Math.cos(nextAngle) * baseRadius * scale;
        const y2 = centerY + Math.sin(nextAngle) * baseRadius * scale * verticalScale;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1 - depth);
        ctx.lineTo(x2, y2 - depth);
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + rotationAngle;
      vertices.push({
        x: centerX + Math.cos(angle) * baseRadius,
        y: centerY + Math.sin(angle) * baseRadius * verticalScale,
        angle: angle
      });
    }

    const centerPoint = { x: centerX, y: centerY };
    vertices.forEach((vertex, i) => {
      const sourceRadius = 15;
      const sourceAngle = vertex.angle;
      const sourceX = vertex.x + Math.cos(sourceAngle) * sourceRadius;
      const sourceY = vertex.y + Math.sin(sourceAngle) * sourceRadius * verticalScale;

      const flowPhase = (time * 2 + i * Math.PI / 3) % (Math.PI * 2);
      const flowPoints = 5;
      
      for (let j = 0; j < flowPoints; j++) {
        const t = (j / flowPoints + flowPhase) % 1;
        const flowX = vertex.x * (1 - t) + centerPoint.x * t;
        const flowY = vertex.y * (1 - t) + centerPoint.y * t;
        
        ctx.beginPath();
        ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${(1 - t) * 0.8})`;
        ctx.fill();
      }

      const capAngle = Math.atan2(centerPoint.y - vertex.y, centerPoint.x - vertex.x);
      const capDist = 40;
      const capX = vertex.x + Math.cos(capAngle) * capDist;
      const capY = vertex.y + Math.sin(capAngle) * capDist;

      ctx.save();
      ctx.translate(capX, capY);
      ctx.rotate(capAngle);
      
      const plateLength = 12;
      const plateGap = 6;
      
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(-plateLength, -plateGap);
      ctx.lineTo(plateLength, -plateGap);
      ctx.moveTo(-plateLength, plateGap);
      ctx.lineTo(plateLength, plateGap);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();

      const diodeAngle = Math.atan2(centerPoint.y - capY, centerPoint.x - capX);
      const diodeDist = 30;
      const diodeX = capX + Math.cos(diodeAngle) * diodeDist;
      const diodeY = capY + Math.sin(diodeAngle) * diodeDist;

      ctx.save();
      ctx.translate(diodeX, diodeY);
      ctx.rotate(diodeAngle);
      
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(-8, -8);
      ctx.lineTo(8, 0);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.strokeStyle = '#22d3ee';
      ctx.stroke();
      
      ctx.restore();
    });

    const pulseScale = 1 + Math.sin(time * 4) * 0.2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10 * pulseScale, 0, Math.PI * 2);
    ctx.fillStyle = '#a855f7';
    ctx.fill();

    ctx.save();
    ctx.filter = 'blur(8px)';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10 * pulseScale, 0, Math.PI * 2);
    ctx.fillStyle = '#a855f7';
    ctx.fill();
    ctx.restore();

    ctx.font = '14px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    vertices.forEach((vertex) => {
      const labelX = vertex.x + Math.cos(vertex.angle) * 30;
      const labelY = vertex.y + Math.sin(vertex.angle) * 30 * verticalScale;
      ctx.fillText('V₁', labelX, labelY);
    });

    ctx.fillText('V₀', centerX, centerY - 25);

    const stageInfo = [
      { stage: 1, value: '10Ω' },
      { stage: 2, value: '33µF/56Ω' },
      { stage: 3, value: '100µF/5Ω' }
    ];

    ctx.textAlign = 'left';
    stageInfo.forEach((info, i) => {
      const y = height - 80 + i * 20;
      ctx.fillText(`Stage ${info.stage}: ${info.value}`, 20, y);
    });

    ctx.fillText('Input: 5V/20A', 20, 40);
    ctx.fillText('Output: 17kV', width - 120, 40);

    setRotationAngle(rotationAngle + 0.002);

    circuit3DAnimationRef.current = requestAnimationFrame(draw3DCircuit);
  };

  useEffect(() => {
    calculateVoltages();
  }, [inputVoltage, frequency, stages, selectedElement]);

  useEffect(() => {
    drawOscilloscope();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [voltageReadings, frequency]);

  useEffect(() => {
    if (selectedElement) {
      drawAtomicVisualization();
      drawQuantumZones();
    }
    return () => {
      if (atomAnimationRef.current) {
        cancelAnimationFrame(atomAnimationRef.current);
      }
      if (quantumAnimationRef.current) {
        cancelAnimationFrame(quantumAnimationRef.current);
      }
    };
  }, [selectedElement]);

  useEffect(() => {
    drawCircuitAnimation();
    return () => {
      if (circuitAnimationRef.current) {
        cancelAnimationFrame(circuitAnimationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    draw3DCircuit();
    return () => {
      if (circuit3DAnimationRef.current) {
        cancelAnimationFrame(circuit3DAnimationRef.current);
      }
    };
  }, [rotationAngle]);

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

          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
              <Zap className="text-violet-400" />
              Simulador de Multiplicador de Tensão
            </h1>
            <button
              onClick={toggleAudio}
              className="p-3 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors"
              title={!browserSupported ? "Áudio não suportado neste navegador" : ""}
              disabled={!browserSupported}
            >
              {audioEnabled ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
          </div>

          {!browserSupported && (
            <div className="mb-8 p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-lg flex items-center gap-3">
              <AlertTriangle className="text-yellow-500 w-6 h-6 flex-shrink-0" />
              <p className="text-yellow-200">
                Seu navegador não suporta os recursos de áudio necessários para a simulação sonora.
                O visualizador continuará funcionando normalmente.
              </p>
            </div>
          )}

          {showPermissionDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#1a1a2e] p-6 rounded-xl border border-violet-500/20 max-w-md">
                <h3 className="text-xl font-semibold mb-4">Permissão de Áudio Necessária</h3>
                <p className="text-gray-300 mb-6">
                  Para experimentar a simulação sonora, precisamos da sua permissão para usar o áudio.
                  Isso nos permitirá criar uma experiência interativa mais rica.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowPermissionDialog(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={requestAudioPermission}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                  >
                    Permitir Áudio
                  </button>
                </div>
              </div>
            </div>
          )}

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
                      Tensão de Entrada (kV)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={inputVoltage}
                      onChange={(e) => setInputVoltage(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {inputVoltage} kV
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequência (MHz)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="600"
                      step="1"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {frequency} MHz
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Número de Estágios
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={stages}
                      onChange={(e) => setStages(Number(e.target.value))}
                      className="w-full h-2 bg-violet-900 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-violet-400 mt-1">
                      {stages} estágios
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Thermometer className="text-violet-400" />
                  Elementos Químicos
                </h2>
                <div className="grid grid-cols-6 gap-2">
                  {elements.map((element) => (
                    <button
                      key={element.symbol}
                      onClick={() => setSelectedElement(element)}
                      className={`p-2 rounded-lg text-center transition-colors ${
                        selectedElement?.symbol === element.symbol
                          ? 'bg-violet-600 text-white'
                          : 'bg-violet-900/20 hover:bg-violet-900/40 text-gray-300'
                      }`}
                      title={`${element.name}
                      - ${element.electrons} elétrons`}
                    >
                      {element.symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <RefreshCw className="text-violet-400" />
                  Leituras
                </h2>
                
                <div className="space-y-3">
                  {selectedElement && (
                    <div className="flex justify-between items-center text-gray-300 mb-4">
                      <span>Elemento Selecionado</span>
                      <span className="text-violet-400">
                        {selectedElement.name} ({selectedElement.electrons} e⁻)
                      </span>
                    </div>
                  )}
                  
                  {voltageReadings.map((voltage, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">Estágio {index + 1}</span>
                      <div className="text-right">
                        <span className="text-violet-400 font-mono">{voltage.toFixed(2)} kV</span>
                        {selectedElement && (
                          <span className="text-gray-400 ml-4">
                            {selectedElement.temperature.toFixed(2)} K
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-violet-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tensão Final</span>
                      <span className="text-violet-400 font-mono">
                        {voltageReadings[voltageReadings.length - 1]?.toFixed(2) || 0} kV
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Circuito Multiplicador 2D</h2>
                <canvas
                  ref={circuitCanvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização 3D do Circuito</h2>
                <canvas
                  ref={circuit3DCanvasRef}
                  width={600}
                  height={600}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Visualização tridimensional com rotação automática</p>
                  <p>• Fluxo de energia animado entre componentes</p>
                  <p>• Indicadores de tensão e corrente em tempo real</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Atom className="text-violet-400" />
                  Visualização Atômica
                </h2>
                {selectedElement ? (
                  <canvas
                    ref={atomCanvasRef}
                    width={400}
                    height={400}
                    className="w-full bg-[#1a1a2e] rounded-lg"
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-400 bg-[#1a1a2e] rounded-lg">
                    Selecione um elemento para visualizar a interação atômica
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Layers className="text-violet-400" />
                  Zonas Quânticas e Dopagem
                </h2>
                {selectedElement ? (
                  <>
                    <canvas
                      ref={quantumZonesCanvasRef}
                      width={600}
                      height={400}
                      className="w-full bg-[#1a1a2e] rounded-lg"
                    />
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="h-2 bg-[#ec4899] rounded" />
                        <span className="text-xs text-gray-400">Boro (B)</span>
                      </div>
                      <div className="text-center">
                        <div className="h-2 bg-[#22d3ee] rounded" />
                        <span className="text-xs text-gray-400">Nitrogênio (N)</span>
                      </div>
                      <div className="text-center">
                        <div className="h-2 bg-[#a855f7] rounded" />
                        <span className="text-xs text-gray-400">Flúor (F)</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-400 bg-[#1a1a2e] rounded-lg">
                    Selecione um elemento para visualizar as zonas quânticas
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-6 rounded-xl border border-violet-500/20">
                <h2 className="text-xl font-semibold mb-6">Visualização do Osciloscópio</h2>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full bg-[#1a1a2e] rounded-lg"
                />
                <div className="mt-4 grid grid-cols-8 gap-2">
                  {voltageReadings.map((_, index) => (
                    <div key={index} className="text-center">
                      <div className={`h-2 rounded ${
                        index % 8 === 0 ? 'bg-cyan-400' :
                        index % 8 === 1 ? 'bg-purple-400' :
                        index % 8 === 2 ? 'bg-yellow-400' :
                        index % 8 === 3 ? 'bg-pink-400' :
                        index % 8 === 4 ? 'bg-green-400' :
                        index % 8 === 5 ? 'bg-orange-400' :
                        index % 8 === 6 ? 'bg-blue-400' :
                        'bg-red-400'
                      }`} />
                      <span className="text-xs text-gray-400">Canal {index + 1}</span>
                    </div>
                  ))}
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

export default VoltageMultiplierPage;