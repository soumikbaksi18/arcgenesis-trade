import React from 'react';
import { 
  Play, TrendingUp, TrendingDown, BarChart3, 
  Activity, ArrowUpDown, DollarSign, Shield,
  Clock, Zap
} from 'lucide-react';

export interface BlockDefinition {
  id: string;
  type: string;
  category: 'trigger' | 'market' | 'indicator' | 'condition' | 'action' | 'risk' | 'utility';
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  inputs: string[];
  outputs: string[];
  params?: { [key: string]: any };
}

export const blockDefinitions: BlockDefinition[] = [
  // Triggers
  {
    id: 'trigger-candle-close',
    type: 'OnCandleClose',
    category: 'trigger',
    label: 'On Candle Close',
    icon: <Play className="w-4 h-4" />,
    color: 'bg-purple-500',
    description: 'Triggers when a candle closes',
    inputs: [],
    outputs: ['trigger'],
    params: { timeframe: '15m' },
  },
  {
    id: 'trigger-price-update',
    type: 'OnPriceUpdate',
    category: 'trigger',
    label: 'On Price Update',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-purple-500',
    description: 'Triggers on price change',
    inputs: [],
    outputs: ['trigger'],
  },
  
  // Market Data
  {
    id: 'market-price',
    type: 'Price',
    category: 'market',
    label: 'Price',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'bg-blue-500',
    description: 'Get price data (open/high/low/close)',
    inputs: ['trigger'],
    outputs: ['price'],
    params: { priceType: 'close' },
  },
  {
    id: 'market-volume',
    type: 'Volume',
    category: 'market',
    label: 'Volume',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'bg-blue-500',
    description: 'Get trading volume',
    inputs: ['trigger'],
    outputs: ['volume'],
  },
  
  // Indicators
  {
    id: 'indicator-sma',
    type: 'SMA',
    category: 'indicator',
    label: 'SMA',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Simple Moving Average',
    inputs: ['price'],
    outputs: ['value'],
    params: { period: 20 },
  },
  {
    id: 'indicator-ema',
    type: 'EMA',
    category: 'indicator',
    label: 'EMA',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Exponential Moving Average',
    inputs: ['price'],
    outputs: ['value'],
    params: { period: 20 },
  },
  {
    id: 'indicator-rsi',
    type: 'RSI',
    category: 'indicator',
    label: 'RSI',
    icon: <Activity className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Relative Strength Index',
    inputs: ['price'],
    outputs: ['value'],
    params: { period: 14 },
  },
  {
    id: 'indicator-macd',
    type: 'MACD',
    category: 'indicator',
    label: 'MACD',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Moving Average Convergence Divergence',
    inputs: ['price'],
    outputs: ['macd', 'signal', 'histogram'],
    params: { fast: 12, slow: 26, signal: 9 },
  },
  
  // Conditions
  {
    id: 'condition-greater',
    type: 'GreaterThan',
    category: 'condition',
    label: 'Greater Than',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-yellow-500',
    description: 'Check if A > B',
    inputs: ['value', 'value'],
    outputs: ['boolean'],
  },
  {
    id: 'condition-less',
    type: 'LessThan',
    category: 'condition',
    label: 'Less Than',
    icon: <TrendingDown className="w-4 h-4" />,
    color: 'bg-yellow-500',
    description: 'Check if A < B',
    inputs: ['value', 'value'],
    outputs: ['boolean'],
  },
  {
    id: 'condition-crosses-above',
    type: 'CrossesAbove',
    category: 'condition',
    label: 'Crosses Above',
    icon: <ArrowUpDown className="w-4 h-4" />,
    color: 'bg-yellow-500',
    description: 'Check if A crosses above B',
    inputs: ['value', 'value'],
    outputs: ['boolean'],
  },
  {
    id: 'condition-crosses-below',
    type: 'CrossesBelow',
    category: 'condition',
    label: 'Crosses Below',
    icon: <ArrowUpDown className="w-4 h-4" />,
    color: 'bg-yellow-500',
    description: 'Check if A crosses below B',
    inputs: ['value', 'value'],
    outputs: ['boolean'],
  },
  
  // Actions
  {
    id: 'action-buy',
    type: 'Buy',
    category: 'action',
    label: 'Buy',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-green-500',
    description: 'Execute buy order',
    inputs: ['boolean'],
    outputs: ['order'],
    params: { amountType: 'percent', amount: 10 },
  },
  {
    id: 'action-sell',
    type: 'Sell',
    category: 'action',
    label: 'Sell',
    icon: <TrendingDown className="w-4 h-4" />,
    color: 'bg-red-500',
    description: 'Execute sell order',
    inputs: ['boolean'],
    outputs: ['order'],
    params: { amountType: 'percent', amount: 10 },
  },
  
  // Risk Management
  {
    id: 'risk-stop-loss',
    type: 'StopLoss',
    category: 'risk',
    label: 'Stop Loss',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-orange-500',
    description: 'Set stop loss',
    inputs: ['order'],
    outputs: ['order'],
    params: { type: 'percent', value: 2 },
  },
  {
    id: 'risk-take-profit',
    type: 'TakeProfit',
    category: 'risk',
    label: 'Take Profit',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-orange-500',
    description: 'Set take profit',
    inputs: ['order'],
    outputs: ['order'],
    params: { type: 'percent', value: 4 },
  },
  {
    id: 'risk-max-position',
    type: 'MaxPositionSize',
    category: 'risk',
    label: 'Max Position Size',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-orange-500',
    description: 'Limit position size',
    inputs: ['order'],
    outputs: ['order'],
    params: { percent: 50 },
  },
  
  // Utility
  {
    id: 'utility-cooldown',
    type: 'Cooldown',
    category: 'utility',
    label: 'Cooldown',
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-gray-500',
    description: 'Prevent trading for X candles',
    inputs: ['order'],
    outputs: ['order'],
    params: { candles: 5 },
  },
];

export const BlockPalette: React.FC<{ onDragStart: (event: React.DragEvent, block: BlockDefinition) => void }> = ({ onDragStart }) => {
  const categories = [
    { name: 'Triggers', blocks: blockDefinitions.filter(b => b.category === 'trigger') },
    { name: 'Market Data', blocks: blockDefinitions.filter(b => b.category === 'market') },
    { name: 'Indicators', blocks: blockDefinitions.filter(b => b.category === 'indicator') },
    { name: 'Conditions', blocks: blockDefinitions.filter(b => b.category === 'condition') },
    { name: 'Actions', blocks: blockDefinitions.filter(b => b.category === 'action') },
    { name: 'Risk Management', blocks: blockDefinitions.filter(b => b.category === 'risk') },
    { name: 'Utility', blocks: blockDefinitions.filter(b => b.category === 'utility') },
  ];

  return (
    <div className="w-full h-full bg-black/40 border-r border-white/10 overflow-y-auto custom-scrollbar flex flex-col">
      <div className="p-4">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Blocks</h3>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="text-xs font-bold text-white/40 uppercase mb-2">{category.name}</div>
              <div className="space-y-2">
                {category.blocks.map((block) => (
                  <div
                    key={block.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('application/reactflow', JSON.stringify(block));
                      onDragStart(e, block);
                    }}
                    onDragEnd={(e) => {
                      // Reset drag image
                      e.dataTransfer.clearData();
                    }}
                    className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors group"
                    style={{ userSelect: 'none' }}
                  >
                    <div className={`${block.color} p-1.5 rounded`}>
                      {block.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">{block.label}</div>
                      <div className="text-[10px] text-white/40 truncate">{block.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

