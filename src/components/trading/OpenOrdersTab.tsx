import React from 'react';
import { mockOpenOrders } from '../../utils/mockTradingData';
import { X } from 'lucide-react';

export const OpenOrdersTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-8 px-4 py-3 text-[10px] text-white/40 uppercase font-bold border-b border-white/10">
        <span>Time</span>
        <span>Type</span>
        <span>Side</span>
        <span className="text-right">Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Filled</span>
        <span className="text-right">Status</span>
        <span className="text-center">Action</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockOpenOrders.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No open orders
          </div>
        ) : (
          mockOpenOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-8 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 items-center text-xs"
            >
              <span className="text-white/70">{order.time}</span>
              <span className="text-white/80 font-medium">{order.type}</span>
              <span className={`font-bold ${
                order.side === 'buy' ? 'text-green-400' : 'text-red-400'
              }`}>
                {order.side.toUpperCase()}
              </span>
              <span className="text-right text-white/80">${order.price.toFixed(2)}</span>
              <span className="text-right text-white/80">{order.amount}</span>
              <span className="text-right text-white/80">
                {order.filled}/{order.amount}
              </span>
              <span className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  order.status === 'filled'
                    ? 'bg-green-500/20 text-green-400'
                    : order.status === 'partially_filled'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </span>
              <div className="flex items-center justify-center">
                <button className="p-1.5 hover:bg-red-500/20 rounded transition-colors group">
                  <X className="w-3.5 h-3.5 text-white/60 group-hover:text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

