import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, TrendingDown, Users, CheckCircle2 } from 'lucide-react';
import { mockStrategies } from '../../utils/mockStrategyData';

export const AutomatedTrading: React.FC = () => {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = useState(true); // Mock: enabled for demo
  const [hasFunds, setHasFunds] = useState(true); // Mock: enabled for demo

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'High':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Grid':
        return 'text-blue-400';
      case 'DCA':
        return 'text-purple-400';
      case 'Trend':
        return 'text-orange-400';
      case 'Custom':
        return 'text-cyan-400';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Section A: Primary CTAs */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => navigate('/strategies/create')}
          disabled={!isWalletConnected}
          className={`w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 ${
            !isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={!isWalletConnected ? 'Connect wallet to use automated trading' : ''}
        >
          Create My Strategy
          <ArrowRight className="w-4 h-4" />
        </button>
        <div className="text-[10px] text-white/40 text-center font-medium">
          Build your own automated trading workflow
        </div>

        <button
          onClick={() => navigate('/strategies')}
          disabled={!isWalletConnected}
          className={`w-full py-4 bg-white/5 text-white rounded-xl font-bold text-sm hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 ${
            !isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={!isWalletConnected ? 'Connect wallet to use automated trading' : ''}
        >
          Explore Community Strategies
          <ArrowRight className="w-4 h-4" />
        </button>
        <div className="text-[10px] text-white/40 text-center font-medium">
          Follow and deploy strategies created by other traders
        </div>
      </div>

      {/* User Context Warnings */}
      {!isWalletConnected && (
        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <div className="text-xs text-yellow-400 font-medium">
            Connect wallet to use automated trading
          </div>
        </div>
      )}

      {isWalletConnected && !hasFunds && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="text-xs text-red-400 font-medium">
            Insufficient balance to deploy strategy
          </div>
        </div>
      )}

      {/* Section B: Strategy Cards */}
      <div className="mb-4">
        <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
          Featured Strategies
        </div>
        <div className="space-y-3">
          {mockStrategies.slice(0, 3).map((strategy) => (
            <div
              key={strategy.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => navigate(`/strategies/${strategy.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{strategy.name}</h3>
                    {strategy.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <span className={getTypeColor(strategy.type)}>{strategy.type}</span>
                    <span>•</span>
                    <span>{strategy.marketPair}</span>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getRiskColor(strategy.riskLevel)}`}>
                  {strategy.riskLevel}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[9px] text-white/40 uppercase mb-1">30D P&L</div>
                  <div className={`text-xs font-bold flex items-center gap-1 ${
                    strategy.pnl30d >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {strategy.pnl30d >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {strategy.pnl30d >= 0 ? '+' : ''}{strategy.pnl30d.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-white/40 uppercase mb-1">Drawdown</div>
                  <div className="text-xs font-bold text-white/80">
                    {strategy.drawdown30d.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                  <Users className="w-3 h-3" />
                  <span>{strategy.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/strategies/${strategy.id}`);
                    }}
                    className="text-xs font-bold text-white/60 hover:text-white/80 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/strategies/${strategy.id}/deploy`);
                    }}
                    disabled={!isWalletConnected || !hasFunds}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !isWalletConnected || !hasFunds
                        ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                    }`}
                  >
                    Deploy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="text-[10px] text-white/40 font-medium text-center">
          Automated strategies execute trades on-chain using your wallet
        </div>
      </div>
    </div>
  );
};

