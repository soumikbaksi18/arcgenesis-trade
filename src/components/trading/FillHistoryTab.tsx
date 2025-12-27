import React from 'react';
import { mockFillHistory } from '../../utils/mockTradingData';

export const FillHistoryTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-6 px-4 py-3 text-[10px] text-white/40 uppercase font-bold border-b border-white/10">
        <span>Time</span>
        <span>Symbol</span>
        <span>Side</span>
        <span className="text-right">Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Fee</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockFillHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No fill history
          </div>
        ) : (
          mockFillHistory.map((fill) => (
            <div
              key={fill.id}
              className="grid grid-cols-6 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 items-center text-xs"
            >
              <span className="text-white/70">{fill.time}</span>
              <span className="font-bold text-white">{fill.symbol}</span>
              <span className={`font-bold ${
                fill.side === 'buy' ? 'text-green-400' : 'text-red-400'
              }`}>
                {fill.side.toUpperCase()}
              </span>
              <span className="text-right text-white/80">${fill.price.toFixed(2)}</span>
              <span className="text-right text-white/80">{fill.amount}</span>
              <span className="text-right text-white/60">${fill.fee.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

