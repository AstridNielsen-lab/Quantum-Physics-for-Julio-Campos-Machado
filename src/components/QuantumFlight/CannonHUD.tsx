import React from 'react';
import { Zap, Target, Thermometer, Gauge, Star } from 'lucide-react';

interface CannonHUDProps {
  chargeLevel: number;
  cooldown: number;
  energy: number;
  score: number;
  asteroidsDestroyed: number;
  isCharging: boolean;
  isFiring: boolean;
}

const CannonHUD: React.FC<CannonHUDProps> = ({
  chargeLevel,
  cooldown,
  energy,
  score,
  asteroidsDestroyed,
  isCharging,
  isFiring
}) => {
  // Propriedades do laser de hélio para exibição
  const laserProperties = {
    wavelength: 632.8, // nanômetros
    power: 50000, // watts
    temperature: 5778, // Kelvin
    efficiency: 85 // porcentagem
  };

  return (
    <div className="fixed top-4 left-4 z-30 pointer-events-none">
      {/* Painel Principal do Canhão */}
      <div className="bg-slate-900/95 backdrop-blur-sm border border-cyan-500/40 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-cyan-400 font-semibold">Canhão Quântico de Hélio</h3>
        </div>
        
        {/* Barra de Carga */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Carga</span>
            <span className={`${chargeLevel >= 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
              {(chargeLevel * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                chargeLevel >= 0.5 ? 'bg-green-400' : 'bg-yellow-400'
              } ${isCharging ? 'animate-pulse' : ''}`}
              style={{ width: `${chargeLevel * 100}%` }}
            />
            {chargeLevel >= 0.5 && (
              <div className="absolute inset-0 bg-green-400/30 animate-pulse" />
            )}
          </div>
          {isCharging && (
            <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              Carregando...
            </div>
          )}
        </div>
        
        {/* Cooldown */}
        {cooldown > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Cooldown</span>
              <span className="text-red-400">{cooldown.toFixed(1)}s</span>
            </div>
            <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-400 transition-all duration-100"
                style={{ width: `${(cooldown / 1.5) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Energia */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Energia</span>
            <span className={`${
              energy >= 50 ? 'text-green-400' : 
              energy >= 20 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {energy}%
            </span>
          </div>
          <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                energy >= 50 ? 'bg-green-400' : 
                energy >= 20 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>
        
        {/* Status de Disparo */}
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className={`${
              isFiring ? 'text-red-400' :
              isCharging ? 'text-yellow-400' :
              cooldown > 0 ? 'text-orange-400' :
              energy < 10 ? 'text-red-400' :
              'text-green-400'
            }`}>
              {isFiring ? 'DISPARANDO' :
               isCharging ? 'CARREGANDO' :
               cooldown > 0 ? 'RESFRIANDO' :
               energy < 10 ? 'SEM ENERGIA' :
               'PRONTO'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Custo por disparo:</span>
            <span className="text-cyan-400">10 energia</span>
          </div>
        </div>
      </div>
      
      {/* Especificações Técnicas do Laser */}
      <div className="bg-slate-900/95 backdrop-blur-sm border border-violet-500/40 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="w-5 h-5 text-violet-400" />
          <h3 className="text-violet-400 font-semibold">Especificações do Laser</h3>
        </div>
        
        <div className="text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-400">Comprimento de onda:</span>
              <div className="text-violet-300">{laserProperties.wavelength}nm</div>
            </div>
            <div>
              <span className="text-gray-400">Potência:</span>
              <div className="text-violet-300">{(laserProperties.power/1000)}kW</div>
            </div>
            <div>
              <span className="text-gray-400">Temperatura:</span>
              <div className="text-violet-300">{laserProperties.temperature}K</div>
            </div>
            <div>
              <span className="text-gray-400">Eficiência:</span>
              <div className="text-violet-300">{laserProperties.efficiency}%</div>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-violet-500/20">
            <div className="text-violet-400 font-medium mb-1">Composição Solar (Hélio)</div>
            <div className="text-xs text-gray-400">
              Baseado na atmosfera do Sol: 24% Hélio, temperatura de superfície 5778K,
              produzindo laser de alta energia com características únicas de penetração.
            </div>
          </div>
        </div>
      </div>
      
      {/* Pontuação e Estatísticas */}
      <div className="bg-slate-900/95 backdrop-blur-sm border border-green-500/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-green-400" />
          <h3 className="text-green-400 font-semibold">Pontuação</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Score:</span>
            <span className="text-green-400 font-mono text-lg">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Asteroides destruídos:</span>
            <span className="text-green-400 font-mono">{asteroidsDestroyed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pontos por asteroide:</span>
            <span className="text-green-400 font-mono">
              {asteroidsDestroyed > 0 ? Math.round(score / asteroidsDestroyed) : 0}
            </span>
          </div>
        </div>
      </div>
      
      {/* Controles */}
      <div className="bg-slate-900/95 backdrop-blur-sm border border-cyan-500/40 rounded-lg p-3 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <h4 className="text-cyan-400 font-semibold text-sm">Controles</h4>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div><span className="text-cyan-400">ESPAÇO:</span> Segurar para carregar e disparar</div>
          <div><span className="text-cyan-400">WASD:</span> Movimentar nave</div>
          <div><span className="text-cyan-400">Mouse:</span> Rotacionar câmera</div>
        </div>
      </div>
    </div>
  );
};

export default CannonHUD;

