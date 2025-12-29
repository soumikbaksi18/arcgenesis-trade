import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, CheckCircle2, Play, Pause, Square, Copy } from 'lucide-react';
import { Strategy } from '../../utils/mockStrategyData';

interface StrategyCardProps {
  strategy: Strategy;
  isMyStrategy?: boolean;
  onDeploy?: (id: string) => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, isMyStrategy = false, onDeploy }) => {
  const navigate = useNavigate();

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
      case 'Arbitrage':
        return 'text-pink-400';
      case 'Rebalancing':
        return 'text-indigo-400';
      default:
        return 'text-white/60';
    }
  };

  const getDirectionColor = (direction?: string) => {
    switch (direction) {
      case 'Long':
        return 'text-green-400';
      case 'Short':
        return 'text-red-400';
      case 'Neutral':
        return 'text-yellow-400';
      default:
        return 'text-white/60';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/10';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'stopped':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-white/60 bg-white/5';
    }
  };

  // Simple performance chart
  const maxValue = Math.max(...(strategy.performanceData || [0]), 1);
  const chartPoints = strategy.performanceData || [0, 0, 0, 0, 0, 0, 0];

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
      onClick={() => navigate(`/strategies/${strategy.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-bold text-white">{strategy.name}</h3>
            {strategy.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium ${getTypeColor(strategy.type)}`}>
              {strategy.type}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-white/60">{strategy.marketPair}</span>
            {strategy.direction && (
              <>
                <span className="text-white/20">•</span>
                <span className={`text-xs font-medium ${getDirectionColor(strategy.direction)}`}>
                  {strategy.direction}
                </span>
              </>
            )}
            {strategy.leverage && strategy.leverage > 1 && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-xs text-blue-400 font-medium">
                  {strategy.leverage}x
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getRiskColor(strategy.riskLevel)}`}>
            {strategy.riskLevel}
          </div>
          {isMyStrategy && strategy.status && (
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(strategy.status)}`}>
              {strategy.status.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[9px] text-white/40 uppercase mb-1">30D P&L</div>
          <div className={`text-lg font-bold flex items-center gap-1 ${
            strategy.pnlUSD >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {strategy.pnlUSD >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>${strategy.pnlUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={`text-xs font-medium mt-0.5 ${
            strategy.pnl30d >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {strategy.pnl30d >= 0 ? '+' : ''}{strategy.pnl30d.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-[9px] text-white/40 uppercase mb-1">ROI</div>
          <div className={`text-lg font-bold ${
            strategy.roi >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {strategy.roi >= 0 ? '+' : ''}{strategy.roi.toFixed(2)}%
          </div>
          <div className="text-xs text-white/60 mt-0.5">
            {strategy.runtime || 'N/A'}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-4 h-12 bg-black/20 rounded-lg p-2 relative overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <polyline
            points={chartPoints.map((val, idx) => `${(idx / (chartPoints.length - 1)) * 100},${40 - (val / maxValue) * 40}`).join(' ')}
            fill="none"
            stroke={strategy.pnlUSD >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-[10px]">
        <div>
          <div className="text-white/40 mb-0.5">Min. Investment</div>
          <div className="text-white/80 font-medium">
            ${strategy.minInvestment?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-white/40 mb-0.5">24H Trades</div>
          <div className="text-white/80 font-medium">
            {strategy.trades24h || 0}
          </div>
        </div>
        <div>
          <div className="text-white/40 mb-0.5">7D MDD</div>
          <div className="text-white/80 font-medium">
            {strategy.drawdown30d.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        {isMyStrategy ? (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle pause/resume
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {strategy.status === 'active' ? (
                <Pause className="w-4 h-4 text-white/60" />
              ) : (
                <Play className="w-4 h-4 text-white/60" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle stop
              }}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Square className="w-4 h-4 text-white/60" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-white/40">
            {strategy.creatorAvatar ? (
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-400">
                {strategy.creatorAvatar}
              </div>
            ) : (
              <Users className="w-3.5 h-3.5" />
            )}
            <span>{strategy.creator}</span>
            <span className="text-white/20">•</span>
            <span>{strategy.followers.toLocaleString()} followers</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {!isMyStrategy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDeploy) onDeploy(strategy.id);
              }}
              className="px-4 py-1.5 bg-yellow-500 text-black rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/strategies/${strategy.id}`);
            }}
            className="text-xs font-bold text-white/60 hover:text-white/80 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

