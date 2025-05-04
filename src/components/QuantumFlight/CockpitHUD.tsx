import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Crosshair, Gauge, Shield, Zap, Radio, Target, Bot, Thermometer, AlertTriangle } from 'lucide-react';

// Define props for CockpitHUD to receive state and setters from parent
interface CockpitHUDProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  showTempPanel: boolean;
  setShowTempPanel: (show: boolean) => void;
  showShieldPanel: boolean;
  setShowShieldPanel: (show: boolean) => void;
  showEnginePanel: boolean;
  setShowEnginePanel: (show: boolean) => void;
  messages: { role: 'user' | 'assistant'; content: string }[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
}

// Helper function for status color
const getStatusColor = (value: number, thresholds = { low: 25, mid: 75 }) => {
  if (value < thresholds.low) return 'text-red-500';
  if (value < thresholds.mid) return 'text-yellow-400';
  return 'text-green-400';
};

// Simple display components (can be expanded)
const TemperatureDisplay = () => (
  <div className="p-2 space-y-2">
    <h3 className="font-semibold border-b border-cyan-700 pb-1 mb-2">Temperature</h3>
    {/* Placeholder values - data not in store */}
    <div>Core: <span className="text-yellow-400">2,734 K</span></div>
    <div>Shields: <span className="text-yellow-400">1,253 K</span></div>
    <div>Engine: <span className="text-yellow-400">3,856 K</span></div>
    <div className="text-xs text-gray-500 mt-2">Thermal regulation: Optimal</div>
  </div>
);

const ShieldDisplay = () => {
  const { shields } = useGameStore(); // Use actual shield value
  const shieldColor = getStatusColor(shields);

  return (
    <div className="p-2 space-y-2">
      <h3 className="font-semibold border-b border-cyan-700 pb-1 mb-2">Shield Status</h3>
      {/* Using main shield value for all for now */}
      <div>Overall Integrity: <span className={shieldColor}>{shields}%</span></div>
      <div className={`w-full h-2 bg-gray-700 rounded mt-1`}>
        <div className={`h-full rounded ${shieldColor.replace('text-', 'bg-')}`} style={{ width: `${shields}%` }}></div>
      </div>
      <div className="text-xs text-gray-500 mt-2">Regeneration: Active</div>
    </div>
  );
};

const EngineDisplay = () => {
  const { speed, energy, setSpeed } = useGameStore();
  const energyColor = getStatusColor(energy);

  return (
    <div className="p-2 space-y-3">
      <h3 className="font-semibold border-b border-cyan-700 pb-1 mb-2">Engine Control</h3>
      <div>Quantum Drive: <span className="text-orange-400">{speed.toFixed(1)} m/s</span></div>
      <div>Energy Output: <span className={energyColor}>{energy}%</span></div>
      <div className={`w-full h-2 bg-gray-700 rounded mt-1`}>
        <div className={`h-full rounded ${energyColor.replace('text-', 'bg-')}`} style={{ width: `${energy}%` }}></div>
      </div>
      <div className="grid grid-cols-3 gap-1 pointer-events-auto"> {/* Enable pointer events for buttons */}
        <button onClick={() => setSpeed(1)} className="p-1 bg-cyan-900/70 rounded hover:bg-cyan-700/70 text-xs">Low</button>
        <button onClick={() => setSpeed(5)} className="p-1 bg-cyan-900/70 rounded hover:bg-cyan-700/70 text-xs">Med</button>
        <button onClick={() => setSpeed(10)} className="p-1 bg-cyan-900/70 rounded hover:bg-cyan-700/70 text-xs">High</button>
      </div>
      <div className="bg-black/50 p-2 rounded border border-cyan-900">
        <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
          <AlertTriangle size={12} /> Status
        </div>
        <p className="text-xs text-gray-400">All systems nominal.</p>
      </div>
    </div>
  );
};

const ChatDisplay: React.FC<Pick<CockpitHUDProps, 'messages' | 'handleSubmit' | 'input' | 'setInput' | 'isLoading'>> = 
  ({ messages, handleSubmit, input, setInput, isLoading }) => (
  <div className="p-2 flex flex-col h-full">
    <h3 className="font-semibold border-b border-cyan-700 pb-1 mb-2">AI Comms</h3>
    <div className="flex-grow overflow-y-auto space-y-2 text-xs mb-2 pr-1" style={{ maxHeight: '100px' }}> {/* Limit height */} 
      {messages.slice(-5).map((message, index) => ( // Show last 5 messages
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] p-1.5 rounded ${message.role === 'user' ? 'bg-cyan-800' : 'bg-gray-700'}`}>
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && <div className="text-center text-cyan-400">...</div>}
    </div>
    <form onSubmit={handleSubmit} className="flex gap-1 pointer-events-auto"> {/* Enable pointer events */} 
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message AI..."
        className="flex-1 bg-black/70 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />
      <button type="submit" disabled={isLoading} className="bg-cyan-700 p-1 rounded hover:bg-cyan-600 disabled:opacity-50">
        <Radio size={14} />
      </button>
    </form>
  </div>
);

const CockpitHUD: React.FC<CockpitHUDProps> = ({
  showChat,
  setShowChat,
  showTempPanel,
  setShowTempPanel,
  showShieldPanel,
  setShowShieldPanel,
  showEnginePanel,
  setShowEnginePanel,
  messages,
  handleSubmit,
  input,
  setInput,
  isLoading
}) => {
  const { speed, energy, shields } = useGameStore();
  const speedColor = speed > 7 ? 'text-red-400' : speed > 3 ? 'text-yellow-400' : 'text-green-400';
  const energyColor = getStatusColor(energy);
  const shieldColor = getStatusColor(shields);

  // Determine which panel content to show in the MFD (Multi-Function Display)
  let mfdContent = null;
  let mfdTitle = "SYSTEMS";
  if (showChat) {
    mfdContent = <ChatDisplay messages={messages} handleSubmit={handleSubmit} input={input} setInput={setInput} isLoading={isLoading} />;
    mfdTitle = "AI COMMS";
  } else if (showTempPanel) {
    mfdContent = <TemperatureDisplay />;
    mfdTitle = "THERMAL";
  } else if (showShieldPanel) {
    mfdContent = <ShieldDisplay />;
    mfdTitle = "SHIELDS";
  } else if (showEnginePanel) {
    mfdContent = <EngineDisplay />;
    mfdTitle = "ENGINE";
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-15 text-cyan-400 font-mono text-xs"
      style={{ textShadow: '0 0 3px rgba(0, 255, 255, 0.4)' }}
    >
      {/* Central Reticle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Crosshair size={40} strokeWidth={1} />
      </div>

      {/* Bottom Cockpit Frame Simulation */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] border-t-4 border-l-4 border-r-4 border-gray-600 bg-gradient-to-t from-gray-800/90 via-gray-800/80 to-transparent rounded-t-lg p-3 flex justify-between items-stretch gap-3">
        
        {/* Left Panel: MFD (Multi-Function Display) */}
        <div className="w-1/3 p-2 bg-black/50 border border-cyan-600/40 rounded flex flex-col">
          <p className="text-sm font-bold mb-1 text-center border-b border-cyan-800 pb-1">{mfdTitle}</p>
          <div className="flex-grow overflow-hidden">
            {mfdContent || <div className="p-2 text-gray-500">Select system below</div>}
          </div>
          {/* System Select Buttons */}
          <div className="flex justify-around gap-1 mt-2 pt-2 border-t border-cyan-800 pointer-events-auto"> {/* Enable pointer events */} 
            <button onClick={() => { setShowChat(!showChat); setShowTempPanel(false); setShowShieldPanel(false); setShowEnginePanel(false); }} className={`p-1 rounded ${showChat ? 'bg-cyan-600 text-black' : 'bg-cyan-900/70 hover:bg-cyan-700/70'}`} title="AI Comms"><Bot size={16}/></button>
            <button onClick={() => { setShowTempPanel(!showTempPanel); setShowChat(false); setShowShieldPanel(false); setShowEnginePanel(false); }} className={`p-1 rounded ${showTempPanel ? 'bg-cyan-600 text-black' : 'bg-cyan-900/70 hover:bg-cyan-700/70'}`} title="Temperature"><Thermometer size={16}/></button>
            <button onClick={() => { setShowShieldPanel(!showShieldPanel); setShowChat(false); setShowTempPanel(false); setShowEnginePanel(false); }} className={`p-1 rounded ${showShieldPanel ? 'bg-cyan-600 text-black' : 'bg-cyan-900/70 hover:bg-cyan-700/70'}`} title="Shields"><Shield size={16}/></button>
            <button onClick={() => { setShowEnginePanel(!showEnginePanel); setShowChat(false); setShowTempPanel(false); setShowShieldPanel(false); }} className={`p-1 rounded ${showEnginePanel ? 'bg-cyan-600 text-black' : 'bg-cyan-900/70 hover:bg-cyan-700/70'}`} title="Engine"><Gauge size={16}/></button>
          </div>
        </div>

        {/* Center Panel: Basic Status */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-2 p-2 bg-black/50 border border-cyan-600/40 rounded">
           <div className={`flex items-center gap-1 ${speedColor}`}>
              <Gauge size={14} />
              <span>SPEED: {speed.toFixed(0)}</span>
            </div>
            <div className={`flex items-center gap-1 ${energyColor}`}>
              <Zap size={14} />
              <span>ENERGY: {energy}%</span>
            </div>
            <div className={`flex items-center gap-1 ${shieldColor}`}>
              <Shield size={14} />
              <span>SHIELDS: {shields}%</span>
            </div>
            {/* Add Radar or other central element here if desired */}
        </div>

        {/* Right Panel: Targeting & Weapon */}
        <div className="w-1/3 p-2 bg-black/50 border border-cyan-600/40 rounded">
          <p className="text-sm font-bold mb-1 text-center border-b border-cyan-800 pb-1">TARGET / WEAPON</p>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} />
            <span>Target: <span className="text-red-500">Dralthi</span></span> { /* Placeholder */}
          </div>
          <p>Range: <span className="text-yellow-400">1474 m</span></p> { /* Placeholder */}
          <p className="mt-2">Weapon: <span className="text-green-400">Laser Cannon</span></p> { /* Placeholder */}
          <p>Status: <span className="text-green-400">Ready</span></p> { /* Placeholder */}
          {/* Placeholder for target schematic */}
          <div className="w-full h-10 border border-cyan-500/50 bg-black/50 mt-2 flex items-center justify-center text-xs">
            Target View
          </div>
        </div>

      </div>

      {/* Top indicators (simple example) */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex gap-2">
        <div className={`w-3 h-3 rounded-full ${shields < 30 ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}></div> { /* Shield warning */}
        <div className={`w-3 h-3 rounded-full ${energy < 30 ? 'bg-yellow-600 animate-pulse' : 'bg-gray-700'}`}></div> { /* Energy warning */}
      </div>

    </div>
  );
};

export default CockpitHUD;

