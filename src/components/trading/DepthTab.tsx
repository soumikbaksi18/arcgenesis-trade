import React from 'react';
import { mockDepthData } from '../../utils/mockTradingData';
import { motion } from 'framer-motion';

export const DepthTab: React.FC = () => {
  const maxAmount = Math.max(
    ...mockDepthData.bids.map(b => b.amount),
    ...mockDepthData.asks.map(a => a.amount)
  );

  return (
    <div className="h-full flex flex-col p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Asks (Sell) Side */}
        <div className="flex flex-col">
          <div className="text-xs font-bold text-red-400 uppercase mb-2">Asks</div>
          <div className="flex-1 space-y-0.5">
            {mockDepthData.asks.slice(0, 10).map((ask, idx) => (
              <motion.div
                key={`ask-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="relative flex items-center justify-between text-xs hover:bg-red-500/10 transition-colors py-1 px-2 rounded"
              >
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-red-500/20 rounded-l"
                  style={{ width: `${(ask.amount / maxAmount) * 100}%` }}
                />
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-red-400 font-medium">{ask.price.toFixed(2)}</span>
                  <span className="text-white/70">{ask.amount.toFixed(4)}</span>
                  <span className="text-white/50">{ask.total.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bids (Buy) Side */}
        <div className="flex flex-col">
          <div className="text-xs font-bold text-green-400 uppercase mb-2">Bids</div>
          <div className="flex-1 space-y-0.5">
            {mockDepthData.bids.slice(0, 10).map((bid, idx) => (
              <motion.div
                key={`bid-${idx}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="relative flex items-center justify-between text-xs hover:bg-green-500/10 transition-colors py-1 px-2 rounded"
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-green-500/20 rounded-r"
                  style={{ width: `${(bid.amount / maxAmount) * 100}%` }}
                />
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-green-400 font-medium">{bid.price.toFixed(2)}</span>
                  <span className="text-white/70">{bid.amount.toFixed(4)}</span>
                  <span className="text-white/50">{bid.total.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

