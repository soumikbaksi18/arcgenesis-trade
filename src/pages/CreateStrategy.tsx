import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockDefinition } from '../components/strategyBuilder/BlockPalette';
import { StrategyCanvas } from '../components/strategyBuilder/StrategyCanvas';
import { ChartPanel } from '../components/strategyBuilder/ChartPanel';
import { RightPanel } from '../components/strategyBuilder/RightPanel';
import { NodePropertiesPanel } from '../components/strategyBuilder/NodePropertiesPanel';
import { JsonModal } from '../components/strategyBuilder/JsonModal';
import { SaveStrategyModal } from '../components/strategyBuilder/SaveStrategyModal';
import { ArrowLeft, Save, Play, FileJson } from 'lucide-react';
import { useStrategyStore } from '../stores/strategyStore';
import { useStrategiesStore } from '../stores/strategiesStore';

export const CreateStrategy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState<number>(60); // percent for left area vs. right
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [verticalSplit, setVerticalSplit] = useState<number>(50); // percent for canvas vs. chart (vertical)
  const [isDraggingVertical, setIsDraggingVertical] = useState<boolean>(false);
  
  // Zustand stores
  const {
    nodes,
    edges,
    selectedNode,
    showJsonModal,
    apiPayload,
    setNodes,
    setEdges,
    setSelectedNode,
    updateNode,
    setShowJsonModal,
    generateApiPayload,
    setApiPayload,
  } = useStrategyStore();

  const addStrategy = useStrategiesStore((state) => state.addStrategy);
  const [showSaveModal, setShowSaveModal] = useState(false);

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
    // TODO: Run backtest
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

  return (
    <div className="h-screen bg-black text-white font-roboto flex flex-col overflow-hidden pt-20">
      {/* Top Banner Accent */}
      <div className="absolute top-20 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md relative z-10 flex-shrink-0">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/strategies')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Create Strategy</h1>
              <div className="text-xs text-white/40">Build your automated trading workflow</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShowJson}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Test
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-yellow-500 text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Takes remaining height */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden relative z-10 min-h-0"
        onMouseMove={(e) => {
          if (isDragging && containerRef.current) {
            const bounds = containerRef.current.getBoundingClientRect();
            const pct = ((e.clientX - bounds.left) / bounds.width) * 100;
            const clamped = Math.min(80, Math.max(20, pct));
            setSplit(clamped);
          }
          if (isDraggingVertical && containerRef.current) {
            const bounds = containerRef.current.getBoundingClientRect();
            const pct = ((e.clientY - bounds.top) / bounds.height) * 100;
            const clamped = Math.min(80, Math.max(20, pct));
            setVerticalSplit(clamped);
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);
          setIsDraggingVertical(false);
        }}
        onMouseLeave={() => {
          setIsDragging(false);
          setIsDraggingVertical(false);
        }}
      >
        {/* Left: Canvas (top) + Chart (bottom) - Stacked vertically */}
        <div
          className="h-full overflow-hidden flex flex-col"
          style={{ flexBasis: `${split}%` }}
        >
          {/* Canvas Section */}
          <div
            className="overflow-hidden bg-[#f8fafc] border-r border-slate-200 relative"
            style={{ flexBasis: `${verticalSplit}%` }}
            onDragOver={(e) => {
              e.preventDefault(); // Allow drop
            }}
          >
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

          {/* Vertical Drag Handle */}
          <div
            className={`h-2 cursor-row-resize bg-slate-200/80 hover:bg-slate-300 transition-colors ${
              isDraggingVertical ? 'bg-slate-400' : ''
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingVertical(true);
            }}
          />

          {/* Chart Section */}
          <div
            className="overflow-hidden bg-black"
            style={{ flexBasis: `${100 - verticalSplit}%` }}
          >
            <ChartPanel />
          </div>
        </div>

        {/* Horizontal Drag Handle between left and right */}
        <div
          className={`w-2 cursor-col-resize bg-slate-200/80 hover:bg-slate-300 transition-colors ${
            isDragging ? 'bg-slate-400' : ''
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
        />

        {/* Right: RightPanel with AI Assistant and Blocks tabs */}
        <div
          className="h-full overflow-hidden bg-black"
          style={{ flexBasis: `${100 - split}%` }}
        >
          <RightPanel onDragStart={handleDragStart} />
        </div>
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

