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

      {/* Bottom Cockpit Frame Simulation - More prominent */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] border-t-4 border-l-4 border-r-4 border-[#00b4ff]/50 bg-gradient-to-t from-black/90 via-black/80 to-transparent rounded-t-lg p-3 flex justify-between items-stretch gap-3"
        style={{ 
          boxShadow: '0 -5px 20px rgba(0, 180, 255, 0.3)',
          backdropFilter: 'blur(4px)'
        }}>
        
        {/* Left Panel: MFD (Multi-Function Display) */}
        <div className="w-1/3 p-2 bg-black/60 border-2 border-[#00b4ff]/60 rounded-lg flex flex-col"
          style={{ boxShadow: '0 0 10px rgba(0, 180, 255, 0.3)' }}>
          <p className="text-base font-bold mb-2 text-center border-b-2 border-[#00b4ff]/50 pb-1 text-[#00b4ff]">{mfdTitle}</p>
          <div className="flex-grow overflow-hidden">
            {mfdContent || <div className="p-2 text-gray-400 flex items-center justify-center h-full">Select system below</div>}
          </div>
          {/* System Select Buttons - Roblox style */}
          <div className="flex justify-around gap-1 mt-3 pt-2 border-t-2 border-[#00b4ff]/50 pointer-events-auto"> {/* Enable pointer events */} 
            <button 
              onClick={() => { setShowChat(!showChat); setShowTempPanel(false); setShowShieldPanel(false); setShowEnginePanel(false); }} 
              className={`p-2 rounded-md ${showChat ? 'bg-[#00b4ff] text-black' : 'bg-black/70 hover:bg-[#00b4ff]/30'} border border-[#00b4ff]/60 transition-all duration-200`} 
              title="AI Comms"
              style={{ boxShadow: showChat ? '0 0 8px #00b4ff' : 'none' }}
            >
              <Bot size={20}/>
            </button>
            <button 
              onClick={() => { setShowTempPanel(!showTempPanel); setShowChat(false); setShowShieldPanel(false); setShowEnginePanel(false); }} 
              className={`p-2 rounded-md ${showTempPanel ? 'bg-[#00b4ff] text-black' : 'bg-black/70 hover:bg-[#00b4ff]/30'} border border-[#00b4ff]/60 transition-all duration-200`} 
              title="Temperature"
              style={{ boxShadow: showTempPanel ? '0 0 8px #00b4ff' : 'none' }}
            >
              <Thermometer size={20}/>
            </button>
            <button 
              onClick={() => { setShowShieldPanel(!showShieldPanel); setShowChat(false); setShowTempPanel(false); setShowEnginePanel(false); }} 
              className={`p-2 rounded-md ${showShieldPanel ? 'bg-[#00b4ff] text-black' : 'bg-black/70 hover:bg-[#00b4ff]/30'} border border-[#00b4ff]/60 transition-all duration-200`} 
              title="Shields"
              style={{ boxShadow: showShieldPanel ? '0 0 8px #00b4ff' : 'none' }}
            >
              <Shield size={20}/>
            </button>
            <button 
              onClick={() => { setShowEnginePanel(!showEnginePanel); setShowChat(false); setShowTempPanel(false); setShowShieldPanel(false); }} 
              className={`p-2 rounded-md ${showEnginePanel ? 'bg-[#00b4ff] text-black' : 'bg-black/70 hover:bg-[#00b4ff]/30'} border border-[#00b4ff]/60 transition-all duration-200`}
              title="Engine"
              style={{ boxShadow: showEnginePanel ? '0 0 8px #00b4ff' : 'none' }}
            >
              <Gauge size={20}/>
            </button>
          </div>
        </div>

        {/* Center Panel: Basic Status - MS Flight Simulator style */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-3 p-3 bg-black/60 border-2 border-[#00b4ff]/60 rounded-lg"
          style={{ boxShadow: '0 0 10px rgba(0, 180, 255, 0.3)' }}>
          {/* Large speed indicator */}
          <div className="w-full">
            <div className="text-xs text-center text-[#00b4ff] mb-1 font-semibold">AIRSPEED</div>
            <div className={`text-2xl text-center font-bold ${speed > 7 ? 'text-[#ff3366]' : speed > 3 ? 'text-[#ffcc00]' : 'text-[#00b4ff]'}`} 
              style={{ textShadow: '0 0 5px currentColor' }}>
              {speed.toFixed(0)}
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${speed > 7 ? 'bg-[#ff3366]' : speed > 3 ? 'bg-[#ffcc00]' : 'bg-[#00b4ff]'}`}
                style={{ width: `${(speed/15)*100}%`, boxShadow: '0 0 8px currentColor' }}
              ></div>
            </div>
          </div>
          
          {/* Energy gauge */}
          <div className="w-full flex items-center gap-3">
            <Zap size={24} className={energy < 30 ? 'text-[#ff3366]' : energy < 60 ? 'text-[#ffcc00]' : 'text-[#00b4ff]'} />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>ENERGY</span>
                <span className={energy < 30 ? 'text-[#ff3366]' : energy < 60 ? 'text-[#ffcc00]' : 'text-[#00b4ff]'}>
                  {energy}%
                </span>
              </div>
              <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className={`h-full ${energy < 30 ? 'bg-[#ff3366]' : energy < 60 ? 'bg-[#ffcc00]' : 'bg-[#00b4ff]'}`}
                  style={{ width: `${energy}%`, boxShadow: '0 0 5px currentColor' }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Shield gauge */}
          <div className="w-full flex items-center gap-3">
            <Shield size={24} className={shields < 30 ? 'text-[#ff3366]' : shields < 60 ? 'text-[#ffcc00]' : 'text-[#00b4ff]'} />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>SHIELDS</span>
                <span className={shields < 30 ? 'text-[#ff3366]' : shields < 60 ? 'text-[#ffcc00]' : 'text-[#00b4ff]'}>
                  {shields}%
                </span>
              </div>
              <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className={`h-full ${shields < 30 ? 'bg-[#ff3366]' : shields < 60 ? 'bg-[#ffcc00]' : 'bg-[#00b4ff]'}`}
                  style={{ width: `${shields}%`, boxShadow: '0 0 5px currentColor' }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Compass */}
          <div className="w-full mt-1">
            <div className="text-xs text-center text-[#00b4ff] mb-1 font-semibold">HEADING</div>
            <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute" style={{ left: `${(rotation.y / (Math.PI * 2) * 100) % 100}%` }}>
                  {[...Array(36)].map((_, i) => (
                    <span 
                      key={i} 
                      className="inline-block text-xs font-bold"
                      style={{ 
                        position: 'absolute', 
                        left: `${i * 10}%`, 
                        color: i % 9 === 0 ? '#ffcc00' : '#00b4ff',
                        opacity: i % 3 === 0 ? 1 : 0.5
                      }}
                    >
                      {i * 10}
                    </span>
                  ))}
                </div>
                <div className="absolute top-0 bottom-0 w-0.5 bg-[#ff3366]" style={{ left: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Targeting & Weapon - Roblox style */}
        <div className="w-1/3 p-3 bg-black/60 border-2 border-[#ff3366]/60 rounded-lg"
          style={{ boxShadow: '0 0 10px rgba(255, 51, 102, 0.3)' }}>
          <p className="text-base font-bold mb-2 text-center border-b-2 border-[#ff3366]/50 pb-1 text-[#ff3366]">TARGET / WEAPON</p>
          
          {/* Target indicator with Roblox-style health bar */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Target size={18} className="text-[#ff3366]" />
              <span className="font-bold">Target: <span className="text-[#ff3366]">Dralthi</span></span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">Range: <span className="text-[#ffcc00] font-bold">1474 m</span></span>
              <span className="text-xs">Class: <span className="text-[#00b4ff] font-bold">Fighter</span></span>
            </div>
            
            {/* Roblox-style health bar */}
            <div className="mt-1 relative">
              <div className="text-xs mb-1 flex justify-between">
                <span>HULL INTEGRITY</span>
                <span className="font-bold text-[#ff3366]">76%</span>
              </div>
              <div className="h-4 w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff3366] to-[#ff3366]/70 w-[76%]"
                  style={{ boxShadow: '0 0 8px #ff3366' }}></div>
                {/* Health bar segments - Roblox style */}
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute top-0 bottom-0 w-px bg-black/50" 
                    style={{ left: `${(i+1) * 10}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Weapon status - MS Flight Simulator style */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-[#00b4ff]">Quantum Laser Cannon</span>
              <span className="text-xs px-2 py-0.5 bg-[#00b4ff]/20 rounded-full text-[#00b4ff] border border-[#00b4ff]/50">READY</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <div className="text-xs mb-0.5">CHARGE</div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00b4ff] w-full" style={{ boxShadow: '0 0 5px #00b4ff' }}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs mb-0.5">HEAT</div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffcc00] w-[30%]" style={{ boxShadow: '0 0 5px #ffcc00' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Target view - improved */}
          <div className="w-full h-20 border-2 border-[#ff3366]/50 bg-black/70 rounded-lg flex items-center justify-center overflow-hidden"
            style={{ boxShadow: 'inset 0 0 10px rgba(255, 51, 102, 0.5)' }}>
            <div className="relative w-16 h-16">
              {/* Target schematic */}
              <div className="absolute inset-2 border-2 border-[#ff3366] rounded-full opacity-70"></div>
              <div className="absolute inset-5 border border-[#ff3366] rounded-full opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-4 border border-[#ff3366] opacity-80"></div>
              </div>
              {/* Targeting brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff3366]"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff3366]"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff3366]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff3366]"></div>
            </div>
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

