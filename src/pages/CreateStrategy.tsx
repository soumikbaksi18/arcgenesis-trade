import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockPalette, BlockDefinition } from '../components/strategyBuilder/BlockPalette';
import { ChartPanel } from '../components/strategyBuilder/ChartPanel';
import { StrategyCanvas } from '../components/strategyBuilder/StrategyCanvas';
import { NodePropertiesPanel } from '../components/strategyBuilder/NodePropertiesPanel';
import { ArrowLeft, Save, Play } from 'lucide-react';
import type { Node, Edge } from 'reactflow';

export const CreateStrategy: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState<number>(60); // percent for center area vs. right
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleDragStart = (event: React.DragEvent, block: BlockDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSave = () => {
    // TODO: Save strategy
    console.log('Saving strategy');
    navigate('/strategies');
  };

  const handleTest = () => {
    // TODO: Run backtest
    console.log('Testing strategy');
  };

  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
  };

  const handleUpdateNode = (nodeId: string, data: any) => {
    // Update parent's nodes state
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
    // Also update StrategyCanvas internal state via exposed function
    if ((window as any).__strategyCanvasUpdateNode) {
      (window as any).__strategyCanvasUpdateNode(nodeId, data);
    }
    // Update selected node if it's the one being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, data });
    }
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
          if (!isDragging || !containerRef.current) return;
          const bounds = containerRef.current.getBoundingClientRect();
          const pct = ((e.clientX - bounds.left) / bounds.width) * 100;
          const clamped = Math.min(80, Math.max(20, pct));
          setSplit(clamped);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Left: Block Palette */}
        <div className="w-56 flex-shrink-0 h-full overflow-hidden">
          <BlockPalette onDragStart={handleDragStart} />
        </div>

        {/* Center: Node Editor - Resizable with right pane */}
        <div
          className="h-full overflow-hidden bg-[#f8fafc] border-r border-slate-200 relative"
          style={{ flexBasis: `${split}%` }}
          onDragOver={(e) => {
            e.preventDefault(); // Allow drop
          }}
        >
          <StrategyCanvas
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            onUpdateNode={(nodeId, data) => {
              handleUpdateNode(nodeId, data);
              // Also update selected node if it's the one being updated
              if (selectedNode && selectedNode.id === nodeId) {
                setSelectedNode({ ...selectedNode, data });
              }
            }}
          />
          {selectedNode && (() => {
            // Always get the latest node from nodes array
            const currentNode = nodes.find(n => n.id === selectedNode.id);
            if (!currentNode) return null;
            
            return (
              <NodePropertiesPanel
                key={`${currentNode.id}-${JSON.stringify(currentNode.data?.params || {})}`}
                node={currentNode}
                onClose={() => setSelectedNode(null)}
                onUpdateNode={(nodeId, data) => {
                  // Update nodes state
                  setNodes((currentNodes) => {
                    const updatedNodes = currentNodes.map((n) =>
                      n.id === nodeId ? { ...n, data } : n
                    );
                    // Update selectedNode if it's the one being updated
                    const updatedNode = updatedNodes.find(n => n.id === nodeId);
                    if (updatedNode && selectedNode.id === nodeId) {
                      // Use setTimeout to update selectedNode after state update
                      setTimeout(() => setSelectedNode({ ...updatedNode }), 0);
                    }
                    return updatedNodes;
                  });
                  // Also call handleUpdateNode for other updates
                  handleUpdateNode(nodeId, data);
                }}
              />
            );
          })()}
        </div>

        {/* Drag handle between center and right */}
        <div
          className={`w-2 cursor-col-resize bg-slate-200/80 hover:bg-slate-300 transition-colors ${
            isDragging ? 'bg-slate-400' : ''
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
        />

        {/* Right: Chart Panel - Resizable with handle */}
        <div
          className="h-full overflow-hidden bg-black"
          style={{ flexBasis: `${100 - split}%` }}
        >
          <ChartPanel nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
};

