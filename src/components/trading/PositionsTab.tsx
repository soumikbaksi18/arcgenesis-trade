import React from 'react';
import { mockPositions } from '../../utils/mockTradingData';
import { TrendingUp, TrendingDown, AlertTriangle, X } from 'lucide-react';

export const PositionsTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-8 px-4 py-3 text-[10px] text-white/40 uppercase font-bold border-b border-white/10">
        <span>Symbol</span>
        <span>Side</span>
        <span className="text-right">Size</span>
        <span className="text-right">Entry</span>
        <span className="text-right">Mark</span>
        <span className="text-right">P&L</span>
        <span className="text-right">Liq. Price</span>
        <span className="text-center">Action</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockPositions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No open positions
          </div>
        ) : (
          mockPositions.map((position) => (
            <div
              key={position.id}
              className="grid grid-cols-8 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 items-center text-xs"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${position.side === 'long' ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="font-bold text-white">{position.symbol}</span>
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  position.side === 'long' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {position.side.toUpperCase()}
                </span>
              </div>
              <div className="text-right text-white/80">{position.size}</div>
              <div className="text-right text-white/80">${position.entryPrice.toFixed(2)}</div>
              <div className="text-right text-white/80">${position.markPrice.toFixed(2)}</div>
              <div className={`text-right font-bold flex items-center justify-end gap-1 ${
                position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {position.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                </span>
              </div>
              <div className="text-right text-yellow-400 flex items-center justify-end gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>${position.liquidationPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                  <X className="w-3.5 h-3.5 text-white/60" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

