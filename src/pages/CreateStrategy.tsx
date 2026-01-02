import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockDefinition } from '../components/strategyBuilder/BlockPalette';
import { StrategyCanvas } from '../components/strategyBuilder/StrategyCanvas';
import { RightPanel } from '../components/strategyBuilder/RightPanel';
import { Toolbox } from '../components/strategyBuilder/Toolbox';
import { NodePropertiesPanel } from '../components/strategyBuilder/NodePropertiesPanel';
import { JsonModal } from '../components/strategyBuilder/JsonModal';
import { SaveStrategyModal } from '../components/strategyBuilder/SaveStrategyModal';
import { ArrowLeft, Save, Play, FileJson } from 'lucide-react';
import { useStrategyStore } from '../stores/strategyStore';
import { useStrategiesStore } from '../stores/strategiesStore';

export const CreateStrategy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Zustand stores
  const {
    nodes,
    edges,
    selectedNode,
    showJsonModal,
    apiPayload,
    setSelectedNode,
    updateNode,
    setShowJsonModal,
    generateApiPayload,
    setApiPayload,
  } = useStrategyStore();

  const addStrategy = useStrategiesStore((state) => state.addStrategy);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const handleDragStart = (event: React.DragEvent, block: BlockDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSave = () => {
    // Generate API payload first if not already generated
    if (!apiPayload) {
      generateApiPayload();
    }
    // Show save modal
    setShowSaveModal(true);
  };

  const handleSaveStrategy = (strategyData: {
    name: string;
    description: string;
    marketPair: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    minInvestment?: number;
    trades24h?: number;
    drawdown7d?: number;
  }) => {
    if (!apiPayload) {
      alert('Please generate the API payload first');
      return;
    }

    // Create strategy object with static defaults for missing fields
    const newStrategy = {
      name: strategyData.name,
      type: 'Custom' as const,
      marketPair: strategyData.marketPair,
      riskLevel: strategyData.riskLevel,
      description: strategyData.description,
      creator: 'You',
      isMyStrategy: true,
      isVerified: false,
      followers: 0,
      // Static defaults (can be updated later)
      pnl30d: 0,
      pnlUSD: 0,
      drawdown30d: strategyData.drawdown7d || 0,
      roi: 0,
      runtime: '0d 0h',
      minInvestment: strategyData.minInvestment,
      trades24h: strategyData.trades24h || 0,
      totalTrades: 0,
      sharpeRatio: 0,
      aum: strategyData.minInvestment || 0,
      performanceData: [0],
      direction: 'Neutral' as const,
      leverage: 1,
      status: 'active' as const,
      // Store workflow data
      nodes,
      edges,
      apiPayload,
    };

    // Save to Zustand store
    addStrategy(newStrategy);

    // Close modal and navigate
    setShowSaveModal(false);
    navigate('/strategies');
  };

  const handleTest = () => {
    setActiveTool('chart');
    setShowRightPanel(true);
    console.log('Testing strategy');
  };

  const handleShowJson = () => {
    // Generate JSON from current canvas nodes - this will also open the modal
    generateApiPayload();
  };

  const handleSaveJson = (updatedPayload: any) => {
    setApiPayload(updatedPayload);
    // Here you could update nodes based on the JSON if needed
    // For now, we just store it for the API call
    console.log('Updated API Payload:', updatedPayload);
  };

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    setShowRightPanel(true);
    
    // Handle special actions
    if (toolId === 'simulate' || toolId === 'backtest') {
      handleTest();
    }
  };

  const handleCloseRightPanel = () => {
    setShowRightPanel(false);
    setActiveTool(null);
  };

  return (
    <div className="h-screen bg-black text-white font-roboto flex flex-col overflow-hidden pt-20">
      {/* Top Banner Accent */}
      <div className="absolute top-20 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Content - Full Screen Canvas with Floating Panels */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative z-10 min-h-0 flex"
      >
        {/* Full Screen Canvas */}
        <div
          className="flex-1 h-full overflow-hidden bg-[#121212] relative"
          onDragOver={(e) => {
            e.preventDefault(); // Allow drop
          }}
        >
          {/* Floating Action Bar - Positioned to avoid right panel */}
          <div className={`absolute top-4 transition-all duration-300 z-20 flex items-center gap-3 ${
            showRightPanel 
              ? activeTool === 'chart' ? 'right-[calc(45%+6rem)]' : 'right-[26rem]' 
              : 'right-4'
          }`}>
            <button
              onClick={handleShowJson}
              className="px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 shadow-lg rounded-lg text-sm font-bold text-white/80 hover:bg-[#2a2a2a] hover:text-white transition-colors flex items-center gap-2"
            >
              <FileJson className="w-4 h-4 text-blue-400" />
              JSON
            </button>
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 shadow-lg rounded-lg text-sm font-bold text-white/80 hover:bg-[#2a2a2a] hover:text-white transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-green-400" />
              Test
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              Save Strategy
            </button>
          </div>

          {/* Back Button Overlay */}
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => navigate('/strategies')}
              className="p-2 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 shadow-lg rounded-lg hover:bg-[#2a2a2a] transition-colors text-white/80 hover:text-white"
              title="Back to strategies"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <StrategyCanvas />
          {selectedNode && (() => {
            // Always get the latest node from nodes array
            const currentNode = nodes.find(n => n.id === selectedNode.id);
            if (!currentNode) return null;
            
            return (
              <NodePropertiesPanel
                key={`${currentNode.id}-${JSON.stringify(currentNode.data?.params || {})}`}
                node={currentNode}
                onClose={() => setSelectedNode(null)}
                onUpdateNode={updateNode}
              />
            );
          })()}
        </div>

        {/* Floating Right Panel - Positioned absolutely over canvas */}
        {showRightPanel && (
          <div 
            className={`absolute top-4 right-20 bottom-4 z-30 pointer-events-none transition-all duration-300 ${
              activeTool === 'chart' ? 'w-[45%]' : 'w-80'
            }`}
          >
            <div className="h-full pointer-events-auto">
              <RightPanel
                onDragStart={handleDragStart}
                activeTool={activeTool}
                onClose={handleCloseRightPanel}
              />
            </div>
          </div>
        )}

        {/* Rightmost Toolbox */}
        <Toolbox
          onSelectTool={handleToolSelect}
          activeTool={activeTool}
          hasBlocks={nodes.length > 0}
        />
      </div>

      {/* JSON Modal */}
      <JsonModal
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        onSave={handleSaveJson}
      />

      {/* Save Strategy Modal */}
      {apiPayload && (
        <SaveStrategyModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveStrategy}
          apiPayload={apiPayload}
        />
      )}
    </div>
  );
};

