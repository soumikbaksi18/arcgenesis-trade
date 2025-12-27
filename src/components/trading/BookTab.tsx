import React from 'react';
import { mockOrderBook } from '../../utils/mockTradingData';
import { motion } from 'framer-motion';

export const BookTab: React.FC = () => {
  const asks = mockOrderBook.filter(o => o.side === 'sell').slice(0, 10);
  const bids = mockOrderBook.filter(o => o.side === 'buy').slice(0, 10).reverse();
  const maxAmount = Math.max(...asks.map(a => a.amount), ...bids.map(b => b.amount));

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 px-4 py-2 text-[10px] text-white/30 uppercase font-bold border-b border-white/10">
        <span>Price (USD)</span>
        <span className="text-right">Qty (ETH)</span>
        <span className="text-right">Total</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Asks (Sell Orders) */}
        <div className="space-y-0.5 px-4 py-2">
          {asks.map((ask, idx) => (
            <motion.div
              key={`ask-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="relative flex items-center justify-between text-xs hover:bg-red-500/10 transition-colors cursor-pointer py-1.5 rounded"
            >
              <div 
                className="absolute right-0 top-0 bottom-0 bg-red-500/20 rounded-l"
                style={{ width: `${(ask.amount / maxAmount) * 100}%` }}
              />
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="text-red-400 font-medium">{ask.price.toFixed(2)}</span>
                <span className="text-white/70">{ask.amount.toFixed(4)}</span>
                <span className="text-white/60">{ask.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Price Separator */}
        <div className="px-4 py-3 bg-white/5 border-y border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">2,925.00</span>
            <span className="text-xs text-white/60">Spread: 0.50</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-0.5 px-4 py-2">
          {bids.map((bid, idx) => (
            <motion.div
              key={`bid-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="relative flex items-center justify-between text-xs hover:bg-green-500/10 transition-colors cursor-pointer py-1.5 rounded"
            >
              <div 
                className="absolute right-0 top-0 bottom-0 bg-green-500/20 rounded-r"
                style={{ width: `${(bid.amount / maxAmount) * 100}%` }}
              />
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="text-green-400 font-medium">{bid.price.toFixed(2)}</span>
                <span className="text-white/70">{bid.amount.toFixed(4)}</span>
                <span className="text-white/60">{bid.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

