import React from 'react';
import { Node } from 'reactflow';
import { 
  Play, TrendingUp, TrendingDown, BarChart3, 
  Activity, ArrowUpDown, DollarSign, Shield,
  Clock, Zap, Plus
} from 'lucide-react';

interface NodesPaletteProps {
  nodes: Node[];
  onAddNode: (nodeType: string) => void;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId?: string;
}

const nodeTypeInfo: { [key: string]: { icon: React.ReactNode; color: string; label: string } } = {
  OnCandleClose: { icon: <Play className="w-4 h-4" />, color: 'bg-purple-500', label: 'On Candle Close' },
  OnPriceUpdate: { icon: <Zap className="w-4 h-4" />, color: 'bg-purple-500', label: 'On Price Update' },
  Price: { icon: <DollarSign className="w-4 h-4" />, color: 'bg-blue-500', label: 'Price' },
  Volume: { icon: <BarChart3 className="w-4 h-4" />, color: 'bg-blue-500', label: 'Volume' },
  SMA: { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500', label: 'SMA' },
  EMA: { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500', label: 'EMA' },
  RSI: { icon: <Activity className="w-4 h-4" />, color: 'bg-green-500', label: 'RSI' },
  MACD: { icon: <BarChart3 className="w-4 h-4" />, color: 'bg-green-500', label: 'MACD' },
  GreaterThan: { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-yellow-500', label: 'Greater Than' },
  LessThan: { icon: <TrendingDown className="w-4 h-4" />, color: 'bg-yellow-500', label: 'Less Than' },
  CrossesAbove: { icon: <ArrowUpDown className="w-4 h-4" />, color: 'bg-yellow-500', label: 'Crosses Above' },
  CrossesBelow: { icon: <ArrowUpDown className="w-4 h-4" />, color: 'bg-yellow-500', label: 'Crosses Below' },
  Buy: { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500', label: 'Buy' },
  Sell: { icon: <TrendingDown className="w-4 h-4" />, color: 'bg-red-500', label: 'Sell' },
  StopLoss: { icon: <Shield className="w-4 h-4" />, color: 'bg-orange-500', label: 'Stop Loss' },
  TakeProfit: { icon: <Shield className="w-4 h-4" />, color: 'bg-orange-500', label: 'Take Profit' },
  MaxPositionSize: { icon: <Shield className="w-4 h-4" />, color: 'bg-orange-500', label: 'Max Position Size' },
  Cooldown: { icon: <Clock className="w-4 h-4" />, color: 'bg-gray-500', label: 'Cooldown' },
};

export const NodesPalette: React.FC<NodesPaletteProps> = ({ 
  nodes, 
  onAddNode, 
  onSelectNode, 
  selectedNodeId 
}) => {
  const nodeGroups = nodes.reduce((acc, node) => {
    const type = node.data?.type || 'unknown';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(node);
    return acc;
  }, {} as { [key: string]: Node[] });

  return (
    <div className="w-full h-full bg-white/5 border-r border-white/10 overflow-y-auto custom-scrollbar flex flex-col">
      <div className="p-4 flex-shrink-0">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Nodes</h3>
        
        {/* Add Node Button */}
        <button
          onClick={() => onAddNode('OnCandleClose')}
          className="w-full flex items-center gap-2 p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-colors mb-4"
        >
          <Plus className="w-4 h-4 text-white/60" />
          <span className="text-sm font-medium text-white">Add Node</span>
        </button>
        {/* Node Groups */}
        <div className="space-y-4">
          {Object.entries(nodeGroups).map(([type, typeNodes]) => {
            const info = nodeTypeInfo[type] || { icon: <BarChart3 className="w-4 h-4" />, color: 'bg-gray-500', label: type };
            
            return (
              <div key={type}>
                <div className="text-xs font-bold text-white/40 uppercase mb-2 flex items-center gap-2">
                  <div className={`${info.color} p-1 rounded`}>
                    {info.icon}
                  </div>
                  <span>{info.label}</span>
                  <span className="text-white/20">({typeNodes.length})</span>
                </div>
                <div className="space-y-1">
                  {typeNodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => onSelectNode(node.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedNodeId === node.id
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-medium text-white">{node.data?.label || node.id}</div>
                      {node.data?.params && (
                        <div className="text-[10px] text-white/40 mt-0.5">
                          {Object.entries(node.data.params).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {nodes.length === 0 && (
          <div className="text-center py-8 text-white/40 text-sm">
            No nodes yet. Add nodes to build your strategy.
          </div>
        )}
      </div>
    </div>
  );
};
