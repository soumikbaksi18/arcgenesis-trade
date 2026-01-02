import React, { useState } from 'react';
import { MessageSquare, Blocks } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { BlockPalette, BlockDefinition } from './BlockPalette';
import { motion } from 'framer-motion';

interface RightPanelProps {
  onDragStart: (event: React.DragEvent, block: BlockDefinition) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ onDragStart }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'blocks'>('chat');

  return (
    <div className="h-full flex flex-col bg-black/40 border-l border-white/10">
      {/* Tab Header */}
      <div className="flex items-center border-b border-white/10">
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
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <ChatInterface />
        ) : (
          <div className="h-full overflow-hidden">
            <BlockPalette onDragStart={onDragStart} />
          </div>
        )}
      </div>
    </div>
  );
};
