import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  Play, TrendingUp, TrendingDown, BarChart3, 
  Activity, ArrowUpDown, DollarSign, Shield,
  Clock, Zap, X
} from 'lucide-react';

const iconMap: { [key: string]: React.ReactNode } = {
  OnCandleClose: <Play className="w-4 h-4" />,
  OnPriceUpdate: <Zap className="w-4 h-4" />,
  Price: <DollarSign className="w-4 h-4" />,
  Volume: <BarChart3 className="w-4 h-4" />,
  SMA: <TrendingUp className="w-4 h-4" />,
  EMA: <TrendingUp className="w-4 h-4" />,
  RSI: <Activity className="w-4 h-4" />,
  MACD: <BarChart3 className="w-4 h-4" />,
  GreaterThan: <TrendingUp className="w-4 h-4" />,
  LessThan: <TrendingDown className="w-4 h-4" />,
  CrossesAbove: <ArrowUpDown className="w-4 h-4" />,
  CrossesBelow: <ArrowUpDown className="w-4 h-4" />,
  Buy: <TrendingUp className="w-4 h-4" />,
  Sell: <TrendingDown className="w-4 h-4" />,
  StopLoss: <Shield className="w-4 h-4" />,
  TakeProfit: <Shield className="w-4 h-4" />,
  MaxPositionSize: <Shield className="w-4 h-4" />,
  Cooldown: <Clock className="w-4 h-4" />,
};

const colorMap: { [key: string]: string } = {
  OnCandleClose: 'bg-purple-500',
  OnPriceUpdate: 'bg-purple-500',
  Price: 'bg-blue-500',
  Volume: 'bg-blue-500',
  SMA: 'bg-green-500',
  EMA: 'bg-green-500',
  RSI: 'bg-green-500',
  MACD: 'bg-green-500',
  GreaterThan: 'bg-yellow-500',
  LessThan: 'bg-yellow-500',
  CrossesAbove: 'bg-yellow-500',
  CrossesBelow: 'bg-yellow-500',
  Buy: 'bg-green-500',
  Sell: 'bg-red-500',
  StopLoss: 'bg-orange-500',
  TakeProfit: 'bg-orange-500',
  MaxPositionSize: 'bg-orange-500',
  Cooldown: 'bg-gray-500',
};

const CustomNodeComponent: React.FC<NodeProps> = ({ data, selected, id, dragging }) => {
  const { deleteElements, getEdges } = useReactFlow();
  const nodeType = data.type || data.label;
  const icon = iconMap[nodeType] || <BarChart3 className="w-4 h-4" />;
  const color = colorMap[nodeType] || 'bg-slate-200';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Get all edges connected to this node
    const edges = getEdges();
    const connectedEdges = edges.filter(
      (edge) => edge.source === id || edge.target === id
    );
    
    // Delete the node and its connected edges
    deleteElements({ 
      nodes: [{ id }],
      edges: connectedEdges
    });
  };

  return (
    <div 
      className={`px-4 py-3 bg-white border border-slate-200 rounded-2xl min-w-[200px] relative group transition-shadow ${
        selected ? 'border-blue-500 shadow-lg shadow-blue-500/15' : 'shadow-sm'
      } ${dragging ? 'cursor-grabbing opacity-85' : 'cursor-grab'}`}
      style={{ filter: 'drop-shadow(0px 8px 24px rgba(15,23,42,0.08))' }}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-50 cursor-pointer nopan nodrag"
        title="Delete node"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>
      {/* Input Handles */}
      {data.inputs && data.inputs.length > 0 && (
        <>
          {data.inputs.map((_input: string, idx: number) => (
            <Handle
              key={`input-${idx}`}
              type="target"
              position={Position.Left}
              id={`input-${idx}`}
              style={{ 
                top: data.inputs.length === 1 ? '50%' : `${20 + (idx * (60 / (data.inputs.length - 1)))}%`,
                left: -8,
              }}
              className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400"
            />
          ))}
        </>
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3 select-none">
        <div className={`${color} p-2 rounded-xl text-slate-800`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">{data.label}</div>
          {data.params && (
            <div className="text-[11px] text-slate-500 mt-1">
              {Object.entries(data.params).map(([key, value]) => (
                <span key={key} className="mr-2">
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Output Handles */}
      {data.outputs && data.outputs.length > 0 && (
        <>
          {data.outputs.map((_output: string, idx: number) => (
            <Handle
              key={`output-${idx}`}
              type="source"
              position={Position.Right}
              id={`output-${idx}`}
              style={{ 
                top: data.outputs.length === 1 ? '50%' : `${20 + (idx * (60 / (data.outputs.length - 1)))}%`,
                right: -8,
              }}
              className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400"
            />
          ))}
        </>
      )}
    </div>
  );
};

export const CustomNode = memo(CustomNodeComponent);
