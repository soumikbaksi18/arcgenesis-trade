import React from 'react';
import { mockPositions } from '../../utils/mockTradingData';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export const MarginTab: React.FC = () => {
  const totalMargin = mockPositions.reduce((sum, pos) => {
    const margin = (pos.size * pos.entryPrice) / pos.leverage;
    return sum + margin;
  }, 0);

  const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-xs text-white/40 font-bold uppercase mb-1">Total Margin</div>
          <div className="text-lg font-bold text-white">${totalMargin.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-xs text-white/40 font-bold uppercase mb-1">Total P&L</div>
          <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="text-xs text-white/40 font-bold uppercase mb-1">Open Positions</div>
          <div className="text-lg font-bold text-white">{mockPositions.length}</div>
        </div>
      </div>

      {/* Positions List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          {mockPositions.map((position) => (
            <div
              key={position.id}
              className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${position.side === 'long' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="font-bold text-white">{position.symbol}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                    {position.leverage}x
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {position.pnl >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-bold">
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-white/40 mb-1">Size</div>
                  <div className="text-white font-medium">{position.size}</div>
                </div>
                <div>
                  <div className="text-white/40 mb-1">Entry Price</div>
                  <div className="text-white font-medium">${position.entryPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-white/40 mb-1">Mark Price</div>
                  <div className="text-white font-medium">${position.markPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-white/40 mb-1 flex items-center gap-1">
                    Liquidation
                    <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  </div>
                  <div className="text-yellow-400 font-medium">${position.liquidationPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

