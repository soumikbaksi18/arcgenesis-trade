import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ManualTrading } from './ManualTrading';
import { AutomatedTrading } from './AutomatedTrading';

export const TradingPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'automated'>('manual');

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-2xl rounded-xl border border-white/10 p-4 shadow-2xl">
      {/* Tab Switch */}
      <div className="flex bg-black/40 p-1 rounded-xl mb-4">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 rounded-lg text-xs font-roboto font-bold transition-all relative ${
            activeTab === 'manual'
              ? 'text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Manual Trading
          {activeTab === 'manual' && (
            <motion.div
              layoutId="trading-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('automated')}
          className={`flex-1 py-2 rounded-lg text-xs font-roboto font-bold transition-all relative ${
            activeTab === 'automated'
              ? 'text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Automated Trading
          {activeTab === 'automated' && (
            <motion.div
              layoutId="trading-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'manual' ? <ManualTrading /> : <AutomatedTrading />}
      </div>
    </div>
  );
};

