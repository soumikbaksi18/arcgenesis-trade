import React from 'react';
import { mockRecentTrades } from '../../utils/mockTradingData';

export const TradesTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 px-4 py-2 text-[10px] text-white/30 uppercase font-bold border-b border-white/10">
        <span>Price (USD)</span>
        <span className="text-right">Qty (ETH)</span>
        <span className="text-right">Time</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockRecentTrades.map((trade, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 px-4 py-1 hover:bg-white/5 transition-colors cursor-default text-[11px] font-roboto"
          >
            <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
              {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-right text-white/70">{trade.qty.toFixed(4)}</span>
            <span className="text-right text-white/40">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

