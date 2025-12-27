import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const PositionHistoryTab: React.FC = () => {
  const mockPositionHistory = [
    {
      id: '1',
      symbol: 'ETH/USD',
      side: 'long',
      entryTime: '09:00:00',
      exitTime: '10:30:00',
      entryPrice: 2900.00,
      exitPrice: 2925.00,
      size: 0.5,
      pnl: 12.50,
      pnlPercent: 0.86,
      duration: '1h 30m',
    },
    {
      id: '2',
      symbol: 'BTC/USD',
      side: 'short',
      entryTime: '08:15:00',
      exitTime: '09:45:00',
      entryPrice: 87600.00,
      exitPrice: 87400.00,
      size: 0.01,
      pnl: 2.00,
      pnlPercent: 0.23,
      duration: '1h 30m',
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-9 px-4 py-3 text-[10px] text-white/40 uppercase font-bold border-b border-white/10">
        <span>Symbol</span>
        <span>Side</span>
        <span>Entry Time</span>
        <span>Exit Time</span>
        <span className="text-right">Entry</span>
        <span className="text-right">Exit</span>
        <span className="text-right">Size</span>
        <span className="text-right">P&L</span>
        <span>Duration</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockPositionHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No position history
          </div>
        ) : (
          mockPositionHistory.map((position) => (
            <div
              key={position.id}
              className="grid grid-cols-9 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 items-center text-xs"
            >
              <span className="font-bold text-white">{position.symbol}</span>
              <span className={`font-bold ${
                position.side === 'long' ? 'text-green-400' : 'text-red-400'
              }`}>
                {position.side.toUpperCase()}
              </span>
              <span className="text-white/70">{position.entryTime}</span>
              <span className="text-white/70">{position.exitTime}</span>
              <span className="text-right text-white/80">${position.entryPrice.toFixed(2)}</span>
              <span className="text-right text-white/80">${position.exitPrice.toFixed(2)}</span>
              <span className="text-right text-white/80">{position.size}</span>
              <div className={`text-right font-bold flex items-center justify-end gap-1 ${
                position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {position.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                </span>
              </div>
              <span className="text-white/60">{position.duration}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

