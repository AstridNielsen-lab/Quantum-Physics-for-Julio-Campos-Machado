import React from 'react';
import { Power, Gauge, Thermometer, Activity } from 'lucide-react';
import { useThermalStore } from '../stores/thermalStore';

const SystemControls = () => {
  const { components, setComponentActive, setComponentPower } = useThermalStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(components).map(([id, component]) => (
        <div key={id} className="bg-violet-900/20 p-4 rounded-lg border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-violet-300">{component.name}</h3>
            <button
              onClick={() => setComponentActive(id, !component.active)}
              className={`p-2 rounded-lg transition-colors ${
                component.active 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Potência
                </span>
                <span className="text-sm text-violet-400">{component.power}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={component.power}
                onChange={(e) => setComponentPower(id, Number(e.target.value))}
                disabled={!component.active}
                className="w-full h-2 bg-violet-900/50 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temperatura
              </span>
              <span className="text-sm text-violet-400">{component.temperature}K</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Eficiência
              </span>
              <span className="text-sm text-violet-400">{(component.efficiency * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemControls;