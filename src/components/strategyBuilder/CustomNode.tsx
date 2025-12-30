import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { 
  Play, TrendingUp, TrendingDown, BarChart3, 
  Activity, ArrowUpDown, DollarSign, Shield,
  Clock, Zap, X, Brain, Sparkles, Bot, MessageSquare,
  Hash, Network, Layers, Target, BarChart2, Gauge,
  RotateCcw, Activity as ActivityIcon, Droplets,
  CreditCard, AlertTriangle
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
  // AI Models
  DeepSeekChat: <Brain className="w-4 h-4" />,
  Qwen3Max: <Sparkles className="w-4 h-4" />,
  ClaudeSonnet: <Bot className="w-4 h-4" />,
  Grok4: <Sparkles className="w-4 h-4" />,
  GeminiPro: <Brain className="w-4 h-4" />,
  ChatGPT: <Brain className="w-4 h-4" />,
  // Social Media
  X: <MessageSquare className="w-4 h-4" />,
  Reddit: <Hash className="w-4 h-4" />,
  Telegram: <MessageSquare className="w-4 h-4" />,
  // Algorithms
  FundingRateArbitrage: <ArrowUpDown className="w-4 h-4" />,
  MarketMaking: <Target className="w-4 h-4" />,
  StatisticalArbitrage: <BarChart2 className="w-4 h-4" />,
  TrendFollowing: <TrendingUp className="w-4 h-4" />,
  PortfolioOptimization: <Gauge className="w-4 h-4" />,
  OrderBookImbalance: <BarChart3 className="w-4 h-4" />,
  MeanReversion: <RotateCcw className="w-4 h-4" />,
  SignalEnsemble: <Network className="w-4 h-4" />,
  LSTM: <Layers className="w-4 h-4" />,
  ReinforcementLearning: <ActivityIcon className="w-4 h-4" />,
  // Investment
  Pool: <Droplets className="w-4 h-4" />,
  Payment: <CreditCard className="w-4 h-4" />,
  InvestmentRisk: <AlertTriangle className="w-4 h-4" />,
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
  // AI Models
  DeepSeekChat: 'bg-indigo-500',
  Qwen3Max: 'bg-indigo-500',
  ClaudeSonnet: 'bg-indigo-500',
  Grok4: 'bg-indigo-500',
  GeminiPro: 'bg-indigo-500',
  ChatGPT: 'bg-indigo-500',
  // Social Media
  X: 'bg-sky-500',
  Reddit: 'bg-orange-500',
  Telegram: 'bg-blue-500',
  // Algorithms
  FundingRateArbitrage: 'bg-pink-500',
  MarketMaking: 'bg-pink-500',
  StatisticalArbitrage: 'bg-pink-500',
  TrendFollowing: 'bg-pink-500',
  PortfolioOptimization: 'bg-pink-500',
  OrderBookImbalance: 'bg-pink-500',
  MeanReversion: 'bg-pink-500',
  SignalEnsemble: 'bg-pink-500',
  LSTM: 'bg-pink-500',
  ReinforcementLearning: 'bg-pink-500',
  // Investment
  Pool: 'bg-cyan-500',
  Payment: 'bg-cyan-500',
  InvestmentRisk: 'bg-cyan-500',
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
          {(() => {
            const nodeType = data.type || '';
            // For trigger nodes (OnCandleClose, OnPriceUpdate), place 4 handles at center of each side
            if ((nodeType === 'OnCandleClose' || nodeType === 'OnPriceUpdate') && data.inputs.length >= 4) {
              return [
                <Handle key="input-top" type="target" position={Position.Top} id="input-top" style={{ top: -8, left: '50%', transform: 'translateX(-50%)' }} className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400" />,
                <Handle key="input-right" type="target" position={Position.Right} id="input-right" style={{ right: -8, top: '50%', transform: 'translateY(-50%)' }} className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400" />,
                <Handle key="input-bottom" type="target" position={Position.Bottom} id="input-bottom" style={{ bottom: -8, left: '50%', transform: 'translateX(-50%)' }} className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400" />,
                <Handle key="input-left" type="target" position={Position.Left} id="input-left" style={{ left: -8, top: '50%', transform: 'translateY(-50%)' }} className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400" />,
              ];
            }
            // For other nodes, use original logic (left side only)
            return data.inputs.map((_input: string, idx: number) => {
              const totalInputs = data.inputs.length;
              const topPosition = totalInputs === 1 
                ? '50%' 
                : `${20 + (idx * (60 / Math.max(1, totalInputs - 1)))}%`;
              return (
                <Handle
                  key={`input-${idx}`}
                  type="target"
                  position={Position.Left}
                  id={`input-${idx}`}
                  style={{ 
                    top: topPosition,
                    left: -8,
                  }}
                  className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400"
                />
              );
            });
          })()}
        </>
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3 select-none">
        <div className={`${color} p-2 rounded-xl text-slate-800`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">{data.label}</div>
        </div>
      </div>

      {/* Output Handles */}
      {data.outputs && data.outputs.length > 0 && (
        <>
          {data.outputs.map((_output: string, idx: number) => {
            const nodeType = data.type || '';
            // For Pool, Payment, Risk - use 2 outputs (top and bottom on right side)
            if ((nodeType === 'Pool' || nodeType === 'Payment' || nodeType === 'InvestmentRisk') && data.outputs.length >= 2) {
              const positions = ['30%', '70%'];
              return (
                <Handle
                  key={`output-${idx}`}
                  type="source"
                  position={Position.Right}
                  id={`output-${idx}`}
                  style={{ 
                    top: positions[idx] || '50%',
                    right: -8,
                  }}
                  className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400"
                />
              );
            }
            // For other nodes, use original logic
            const totalOutputs = data.outputs.length;
            const topPosition = totalOutputs === 1 
              ? '50%' 
              : `${20 + (idx * (60 / Math.max(1, totalOutputs - 1)))}%`;
            return (
              <Handle
                key={`output-${idx}`}
                type="source"
                position={Position.Right}
                id={`output-${idx}`}
                style={{ 
                  top: topPosition,
                  right: -8,
                }}
                className="!w-3 !h-3 !bg-slate-200 !border-2 !border-slate-400"
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export const CustomNode = memo(CustomNodeComponent);
