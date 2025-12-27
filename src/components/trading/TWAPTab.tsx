import React from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';

export const TWAPTab: React.FC = () => {
  const mockTWAPOrders = [
    {
      id: '1',
      symbol: 'ETH/USD',
      side: 'buy',
      totalAmount: 1.0,
      executed: 0.35,
      duration: '2h 30m',
      interval: '5m',
      status: 'active',
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 px-4 py-3 text-[10px] text-white/40 uppercase font-bold border-b border-white/10">
        <span>Symbol</span>
        <span>Side</span>
        <span className="text-right">Total</span>
        <span className="text-right">Executed</span>
        <span>Duration</span>
        <span>Interval</span>
        <span className="text-center">Action</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockTWAPOrders.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No active TWAP orders
          </div>
        ) : (
          mockTWAPOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-7 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 items-center text-xs"
            >
              <span className="font-bold text-white">{order.symbol}</span>
              <span className={`font-bold ${
                order.side === 'buy' ? 'text-green-400' : 'text-red-400'
              }`}>
                {order.side.toUpperCase()}
              </span>
              <span className="text-right text-white/80">{order.totalAmount}</span>
              <div className="text-right">
                <div className="text-white/80 mb-1">{order.executed}/{order.totalAmount}</div>
                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${(order.executed / order.totalAmount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/80">
                <Clock className="w-3 h-3" />
                <span>{order.duration}</span>
              </div>
              <span className="text-white/80">{order.interval}</span>
              <div className="flex items-center justify-center gap-2">
                <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                  <Pause className="w-3.5 h-3.5 text-white/60" />
                </button>
                <button className="p-1.5 hover:bg-red-500/20 rounded transition-colors">
                  <Square className="w-3.5 h-3.5 text-white/60" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

