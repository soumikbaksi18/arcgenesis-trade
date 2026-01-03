import React, { useState, useEffect } from 'react';
import { MessageSquare, Blocks, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { BlockPalette, BlockDefinition } from './BlockPalette';
import { ChartPanel } from './ChartPanel';
import { motion } from 'framer-motion';

interface RightPanelProps {
  onDragStart: (event: React.DragEvent, block: BlockDefinition) => void;
  activeTool: string | null;
  onClose: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ onDragStart, activeTool, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'blocks' | 'chart'>('chat');
  const [blockCategory, setBlockCategory] = useState<string | null>(null);

  useEffect(() => {
    // Set default view based on active tool
    if (activeTool === 'ai') {
      setActiveTab('chat');
    } else if (activeTool === 'blocks') {
      setActiveTab('blocks');
      setBlockCategory(null); // Show all blocks, no filter
    } else if (activeTool?.startsWith('blocks-')) {
      setActiveTab('blocks');
      // Extract category from tool ID (e.g., 'blocks-triggers' -> 'trigger')
      const category = activeTool.replace('blocks-', '');
      setBlockCategory(category);
    } else if (activeTool === 'chart') {
      setActiveTab('chart');
    }
  }, [activeTool]);

  const getPanelTitle = () => {
    if (activeTool === 'ai') return 'AI Assistant';
    if (activeTool === 'chart') return 'Market Chart';
    if (activeTool === 'blocks') return 'Strategy Blocks';
    if (activeTool?.startsWith('blocks-')) {
      const categoryMap: { [key: string]: string } = {
        'triggers': 'Triggers',
        'market': 'Market Data',
        'indicators': 'Indicators',
        'conditions': 'Conditions',
        'actions': 'Actions',
        'risk': 'Risk Management',
        'ai': 'AI Models',
        'algorithms': 'Algorithms',
        'investment': 'Investment',
      };
      return categoryMap[activeTool.replace('blocks-', '')] || 'Strategy Blocks';
    }
    return 'Panel';
  };

  return (
    <div className="h-full flex flex-col bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {getPanelTitle()}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Header - Only show if not chart */}
      {activeTool !== 'chart' && (
        <div className="flex items-center border-b border-white/10">
          {activeTool === 'ai' && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors relative ${
                activeTab === 'chat'
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-bold">AI Assistant</span>
              {activeTab === 'chat' && (
                <motion.div
                  layoutId="right-panel-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          )}
          {(activeTool === 'blocks' || activeTool?.startsWith('blocks-')) && (
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors relative ${
                activeTab === 'blocks'
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Blocks className="w-4 h-4" />
              <span className="text-sm font-bold">Blocks</span>
              {activeTab === 'blocks' && (
                <motion.div
                  layoutId="right-panel-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTool === 'chart' ? (
          <ChartPanel />
        ) : activeTab === 'chat' ? (
          <ChatInterface />
        ) : (
          <div className="h-full overflow-hidden">
            <BlockPalette
              onDragStart={onDragStart}
              categoryFilter={blockCategory || undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};
