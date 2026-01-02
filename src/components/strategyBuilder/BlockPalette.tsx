import React from 'react';
import { 
  Play, TrendingUp, TrendingDown, BarChart3, 
  Activity, ArrowUpDown, DollarSign, Shield,
  Clock, Zap, Brain, Sparkles, Bot, MessageSquare,
  Hash, Network, Layers, Target,
  BarChart2, Gauge, RotateCcw, Activity as ActivityIcon,
  Droplets, CreditCard, AlertTriangle
} from 'lucide-react';

export interface BlockDefinition {
  id: string;
  type: string;
  category: 'trigger' | 'market' | 'indicator' | 'condition' | 'action' | 'risk' | 'utility' | 'ai-model' | 'social-media' | 'algorithm' | 'investment';
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
    inputs: ['input1', 'input2', 'input3', 'input4'], // 4 inputs for 4 sides
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
    inputs: ['input1', 'input2', 'input3', 'input4'], // 4 inputs for 4 sides
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
  
  // AI Models
  {
    id: 'ai-deepseek',
    type: 'DeepSeekChat',
    category: 'ai-model',
    label: 'DeepSeek Chat V3.1',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'Advanced reasoning AI model',
    inputs: ['trigger', 'data'],
    outputs: ['prediction', 'signal'],
    params: { model: 'deepseek-chat-v3.1', temperature: 0.7 },
  },
  {
    id: 'ai-qwen',
    type: 'Qwen3Max',
    category: 'ai-model',
    label: 'Qwen3 Max',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'High-performance multilingual model',
    inputs: ['trigger', 'data'],
    outputs: ['prediction', 'signal'],
    params: { model: 'qwen3-max', temperature: 0.7 },
  },
  {
    id: 'ai-claude',
    type: 'ClaudeSonnet',
    category: 'ai-model',
    label: 'Claude Sonnet 4.5',
    icon: <Bot className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'Anthropic\'s powerful reasoning model',
    inputs: ['trigger', 'data'],
    outputs: ['prediction', 'signal'],
    params: { model: 'claude-sonnet-4.5', temperature: 0.7 },
  },
  {
    id: 'ai-grok',
    type: 'Grok4',
    category: 'ai-model',
    label: 'Grok 4',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'Real-time AI with live data access',
    inputs: ['trigger', 'data'],
    outputs: ['prediction', 'signal'],
    params: { model: 'grok-4', temperature: 0.7 },
  },
  {
    id: 'ai-gemini',
    type: 'GeminiPro',
    category: 'ai-model',
    label: 'Gemini 2.5 Pro',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'Google\'s multimodal AI model',
    inputs: ['trigger', 'data'],
    outputs: ['prediction', 'signal'],
    params: { model: 'gemini-2.5-pro', temperature: 0.7 },
  },
  {
    id: 'ai-gpt',
    type: 'ChatGPT',
    category: 'ai-model',
    label: 'ChatGPT / GPT-5',
    icon: <Brain className="w-4 h-4" />,
    color: 'bg-indigo-500',
    description: 'OpenAI\'s latest generation model',
    inputs: ['trigger', 'data'],
    outputs: ['prediction', 'signal'],
    params: { model: 'gpt-5', temperature: 0.7 },
  },
  
  // Social Media Sources
  {
    id: 'social-x',
    type: 'X',
    category: 'social-media',
    label: 'X (Twitter)',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'bg-sky-500',
    description: 'Monitor X/Twitter for trading signals',
    inputs: ['trigger'],
    outputs: ['sentiment', 'signal'],
    params: { platform: 'x', keywords: [] },
  },
  {
    id: 'social-reddit',
    type: 'Reddit',
    category: 'social-media',
    label: 'Reddit',
    icon: <Hash className="w-4 h-4" />,
    color: 'bg-orange-500',
    description: 'Track Reddit discussions and sentiment',
    inputs: ['trigger'],
    outputs: ['sentiment', 'signal'],
    params: { platform: 'reddit', subreddits: [] },
  },
  {
    id: 'social-telegram',
    type: 'Telegram',
    category: 'social-media',
    label: 'Telegram',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'bg-blue-500',
    description: 'Monitor Telegram channels for signals',
    inputs: ['trigger'],
    outputs: ['sentiment', 'signal'],
    params: { platform: 'telegram', channels: [] },
  },
  
  // Quant Algorithms
  {
    id: 'algo-funding-arb',
    type: 'FundingRateArbitrage',
    category: 'algorithm',
    label: 'Funding Rate Arbitrage',
    icon: <ArrowUpDown className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Exploit funding rate differentials',
    inputs: ['price', 'data'],
    outputs: ['signal'],
    params: { threshold: 0.1 },
  },
  {
    id: 'algo-market-making',
    type: 'MarketMaking',
    category: 'algorithm',
    label: 'Market Making',
    icon: <Target className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Provide liquidity with bid-ask spreads',
    inputs: ['price', 'volume'],
    outputs: ['order'],
    params: { spread: 0.5, inventory: 100 },
  },
  {
    id: 'algo-stat-arb',
    type: 'StatisticalArbitrage',
    category: 'algorithm',
    label: 'Statistical Arbitrage',
    icon: <BarChart2 className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Pairs trading & cointegration strategies',
    inputs: ['price', 'price'],
    outputs: ['signal'],
    params: { lookback: 60, threshold: 2 },
  },
  {
    id: 'algo-trend-following',
    type: 'TrendFollowing',
    category: 'algorithm',
    label: 'Trend Following',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Momentum-based trend detection',
    inputs: ['price'],
    outputs: ['signal'],
    params: { period: 20, strength: 1.5 },
  },
  {
    id: 'algo-portfolio-opt',
    type: 'PortfolioOptimization',
    category: 'algorithm',
    label: 'Portfolio Optimization',
    icon: <Gauge className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Risk parity & portfolio rebalancing',
    inputs: ['price', 'volatility'],
    outputs: ['allocation'],
    params: { rebalancePeriod: 24, riskBudget: 1.0 },
  },
  {
    id: 'algo-orderbook-imbalance',
    type: 'OrderBookImbalance',
    category: 'algorithm',
    label: 'Order Book Imbalance',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Trade on order book pressure signals',
    inputs: ['orderbook'],
    outputs: ['signal'],
    params: { depth: 10, threshold: 0.7 },
  },
  {
    id: 'algo-mean-reversion',
    type: 'MeanReversion',
    category: 'algorithm',
    label: 'Mean Reversion',
    icon: <RotateCcw className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Trade price deviations from mean',
    inputs: ['price'],
    outputs: ['signal'],
    params: { period: 20, zScore: 2.0 },
  },
  {
    id: 'algo-ensemble',
    type: 'SignalEnsemble',
    category: 'algorithm',
    label: 'Signal Ensemble',
    icon: <Network className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Combine multiple signals with ML',
    inputs: ['signal', 'signal', 'signal'],
    outputs: ['signal'],
    params: { method: 'weighted', weights: [] },
  },
  {
    id: 'algo-lstm',
    type: 'LSTM',
    category: 'algorithm',
    label: 'LSTM / GRU Models',
    icon: <Layers className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'Deep learning time-series prediction',
    inputs: ['price', 'volume'],
    outputs: ['prediction'],
    params: { layers: 2, neurons: 64, lookback: 60 },
  },
  {
    id: 'algo-rl',
    type: 'ReinforcementLearning',
    category: 'algorithm',
    label: 'Reinforcement Learning',
    icon: <ActivityIcon className="w-4 h-4" />,
    color: 'bg-pink-500',
    description: 'PPO / DQN for adaptive trading',
    inputs: ['state'],
    outputs: ['action'],
    params: { algorithm: 'PPO', episodes: 1000 },
  },
  
  // Investment
  {
    id: 'investment-pool',
    type: 'Pool',
    category: 'investment',
    label: 'Pool',
    icon: <Droplets className="w-4 h-4" />,
    color: 'bg-cyan-500',
    description: 'Liquidity pool allocation strategy',
    inputs: ['input1', 'input2'], // 2 inputs
    outputs: ['output1', 'output2'], // 2 outputs
    params: { pool: 'ETH/USD' }, // Will be fetched from trade view
  },
  {
    id: 'investment-payment',
    type: 'Payment',
    category: 'investment',
    label: 'Payment',
    icon: <CreditCard className="w-4 h-4" />,
    color: 'bg-cyan-500',
    description: 'Payment processing and distribution',
    inputs: ['input1', 'input2'], // 2 inputs
    outputs: ['output1', 'output2'], // 2 outputs
    params: { stablecoin: 'USDC', amount: 1000 },
  },
  {
    id: 'investment-risk',
    type: 'InvestmentRisk',
    category: 'investment',
    label: 'Risk',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-cyan-500',
    description: 'Investment risk assessment and limits',
    inputs: ['input1', 'input2'], // 2 inputs
    outputs: ['output1', 'output2'], // 2 outputs
    params: { riskLevel: 'medium' },
  },
];

interface BlockPaletteProps {
  onDragStart: (event: React.DragEvent, block: BlockDefinition) => void;
  categoryFilter?: string;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onDragStart, categoryFilter }) => {
  const categoryMap: { [key: string]: string } = {
    'triggers': 'trigger',
    'market': 'market',
    'indicators': 'indicator',
    'conditions': 'condition',
    'actions': 'action',
    'risk': 'risk',
    'ai': 'ai-model',
    'algorithms': 'algorithm',
    'investment': 'investment',
  };

  // If categoryFilter is provided but doesn't match, show all
  const filterCategory = categoryFilter ? categoryMap[categoryFilter] : null;

  const allCategories = [
    { name: 'Investment', blocks: blockDefinitions.filter(b => b.category === 'investment') },
    { name: 'Triggers', blocks: blockDefinitions.filter(b => b.category === 'trigger') },
    { name: 'Market Data', blocks: blockDefinitions.filter(b => b.category === 'market') },
    { name: 'Indicators', blocks: blockDefinitions.filter(b => b.category === 'indicator') },
    { name: 'AI Models', blocks: blockDefinitions.filter(b => b.category === 'ai-model') },
    { name: 'Quant Algorithms', blocks: blockDefinitions.filter(b => b.category === 'algorithm') },
    { name: 'Conditions', blocks: blockDefinitions.filter(b => b.category === 'condition') },
    { name: 'Actions', blocks: blockDefinitions.filter(b => b.category === 'action') },
    { name: 'Risk Management', blocks: blockDefinitions.filter(b => b.category === 'risk') },
    { name: 'Social Media', blocks: blockDefinitions.filter(b => b.category === 'social-media') },
    { name: 'Utility', blocks: blockDefinitions.filter(b => b.category === 'utility') },
  ];

  // Filter categories if categoryFilter is provided and valid
  const categories = filterCategory
    ? allCategories
        .map(cat => ({
          ...cat,
          blocks: cat.blocks.filter(b => b.category === filterCategory)
        }))
        .filter(cat => cat.blocks.length > 0)
    : allCategories;

  return (
    <div className="w-full h-full bg-black/60 overflow-y-auto custom-scrollbar flex flex-col">
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

