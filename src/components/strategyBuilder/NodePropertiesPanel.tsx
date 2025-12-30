import React, { useMemo } from 'react';
import { Node } from 'reactflow';
import { X } from 'lucide-react';

interface NodePropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
}

// Mapping of node types to their editable API fields
const nodeFieldMappings: { [key: string]: Array<{ key: string; label: string; type: 'text' | 'number' | 'select' | 'readonly'; options?: string[]; value?: string }> } = {
  // Investment nodes
  Pool: [
    { key: 'pool', label: 'Pool', type: 'readonly', value: 'ETH/USD' }, // Will be fetched from trade view
  ],
  Payment: [
    { key: 'stablecoin', label: 'Stablecoin', type: 'select', options: ['USDC', 'USDT', 'DAI'] },
    { key: 'amount', label: 'Amount', type: 'number' },
  ],
  InvestmentRisk: [
    { key: 'riskLevel', label: 'Risk Level', type: 'select', options: ['safe', 'medium', 'aggressive'] },
  ],
  // AI Models - all have same fields
  DeepSeekChat: [{ key: 'model', label: 'Model', type: 'text' }, { key: 'temperature', label: 'Temperature', type: 'number' }],
  Qwen3Max: [{ key: 'model', label: 'Model', type: 'text' }, { key: 'temperature', label: 'Temperature', type: 'number' }],
  ClaudeSonnet: [{ key: 'model', label: 'Model', type: 'text' }, { key: 'temperature', label: 'Temperature', type: 'number' }],
  Grok4: [{ key: 'model', label: 'Model', type: 'text' }, { key: 'temperature', label: 'Temperature', type: 'number' }],
  GeminiPro: [{ key: 'model', label: 'Model', type: 'text' }, { key: 'temperature', label: 'Temperature', type: 'number' }],
  ChatGPT: [{ key: 'model', label: 'Model', type: 'text' }, { key: 'temperature', label: 'Temperature', type: 'number' }],
  // Algorithms
  StatisticalArbitrage: [
    { key: 'lookback', label: 'Lookback Period', type: 'number' },
    { key: 'threshold', label: 'Threshold', type: 'number' },
  ],
  MarketMaking: [
    { key: 'spread', label: 'Spread %', type: 'number' },
    { key: 'inventory', label: 'Inventory', type: 'number' },
  ],
  TrendFollowing: [
    { key: 'period', label: 'Period', type: 'number' },
    { key: 'strength', label: 'Strength', type: 'number' },
  ],
  PortfolioOptimization: [
    { key: 'rebalancePeriod', label: 'Rebalance Period (hours)', type: 'number' },
    { key: 'riskBudget', label: 'Risk Budget', type: 'number' },
  ],
  OrderBookImbalance: [
    { key: 'depth', label: 'Depth', type: 'number' },
    { key: 'threshold', label: 'Threshold', type: 'number' },
  ],
  MeanReversion: [
    { key: 'period', label: 'Period', type: 'number' },
    { key: 'zScore', label: 'Z-Score', type: 'number' },
  ],
  SignalEnsemble: [
    { key: 'method', label: 'Method', type: 'select', options: ['weighted', 'majority', 'average'] },
  ],
  LSTM: [
    { key: 'layers', label: 'Layers', type: 'number' },
    { key: 'neurons', label: 'Neurons', type: 'number' },
    { key: 'lookback', label: 'Lookback', type: 'number' },
  ],
  ReinforcementLearning: [
    { key: 'algorithm', label: 'Algorithm', type: 'select', options: ['PPO', 'DQN', 'A3C'] },
    { key: 'episodes', label: 'Episodes', type: 'number' },
  ],
  // Risk Management
  StopLoss: [
    { key: 'type', label: 'Type', type: 'select', options: ['percent', 'fixed'] },
    { key: 'value', label: 'Value', type: 'number' },
  ],
  TakeProfit: [
    { key: 'type', label: 'Type', type: 'select', options: ['percent', 'fixed'] },
    { key: 'value', label: 'Value', type: 'number' },
  ],
  MaxPositionSize: [
    { key: 'percent', label: 'Max Position %', type: 'number' },
  ],
  // Triggers
  OnCandleClose: [
    { key: 'timeframe', label: 'Timeframe', type: 'select', options: ['1m', '5m', '15m', '1h', '4h', '1d'] },
  ],
  // Market Data
  Price: [
    { key: 'priceType', label: 'Price Type', type: 'select', options: ['open', 'high', 'low', 'close'] },
  ],
  // Indicators
  SMA: [{ key: 'period', label: 'Period', type: 'number' }],
  EMA: [{ key: 'period', label: 'Period', type: 'number' }],
  RSI: [{ key: 'period', label: 'Period', type: 'number' }],
  MACD: [
    { key: 'fast', label: 'Fast', type: 'number' },
    { key: 'slow', label: 'Slow', type: 'number' },
    { key: 'signal', label: 'Signal', type: 'number' },
  ],
  // Actions
  Buy: [
    { key: 'amountType', label: 'Amount Type', type: 'select', options: ['percent', 'fixed'] },
    { key: 'amount', label: 'Amount', type: 'number' },
  ],
  Sell: [
    { key: 'amountType', label: 'Amount Type', type: 'select', options: ['percent', 'fixed'] },
    { key: 'amount', label: 'Amount', type: 'number' },
  ],
  // Utility
  Cooldown: [
    { key: 'candles', label: 'Candles', type: 'number' },
  ],
  // Social Media
  X: [{ key: 'keywords', label: 'Keywords (comma-separated)', type: 'text' }],
  Reddit: [{ key: 'subreddits', label: 'Subreddits (comma-separated)', type: 'text' }],
  Telegram: [{ key: 'channels', label: 'Channels (comma-separated)', type: 'text' }],
};

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({ node, onClose, onUpdateNode }) => {
  if (!node) return null;

  const nodeType = node.data?.type || '';
  const fields = nodeFieldMappings[nodeType] || [];
  
  // Get params directly from node.data - this will update on every render when node changes
  const baseParams = node.data?.params || {};
  
  // For Pool node, initialize with active trading pair if not set (don't mutate original)
  const params = useMemo(() => {
    if (nodeType === 'Pool' && !baseParams.pool) {
      const activePool = localStorage.getItem('activeTradingPair') || 'ETH/USD';
      return { ...baseParams, pool: activePool };
    }
    return baseParams;
  }, [node.data, nodeType]); // Use node.data as dependency so it updates when node changes

  const handleFieldChange = (fieldKey: string, value: any) => {
    const newParams = {
      ...params,
      [fieldKey]: value,
    };

    onUpdateNode(node.id, {
      ...node.data,
      params: newParams,
    });
  };

  const renderField = (field: { key: string; label: string; type: 'text' | 'number' | 'select' | 'readonly'; options?: string[]; value?: string }) => {
    // For readonly Pool field, fetch from trade view or use default
    let currentValue: string | number = '';
    
    if (field.type === 'readonly') {
      // Try to get from localStorage or use default (in production, this would come from trade view context)
      const activePool = localStorage.getItem('activeTradingPair') || field.value || 'ETH/USD';
      currentValue = params[field.key] || activePool;
    } else {
      // Get value from params, use empty string if undefined
      currentValue = params[field.key] !== undefined && params[field.key] !== null 
        ? params[field.key] 
        : (field.value ?? '');
    }

    if (field.type === 'readonly') {
      return (
        <div key={field.key} className="mb-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
          <input
            type="text"
            value={currentValue}
            readOnly
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
          />
          <p className="text-[10px] text-slate-500 mt-1">Fetched from active trading pair</p>
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      // Ensure currentValue is a string and handle undefined/null
      const selectValue = currentValue !== undefined && currentValue !== null && currentValue !== '' 
        ? String(currentValue) 
        : '';
      
      return (
        <div key={field.key} className="mb-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
          <select
            value={selectValue || ''}
            onChange={(e) => {
              handleFieldChange(field.key, e.target.value);
            }}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          >
            <option value="" disabled>Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'number') {
      // Format number to display with up to 2 decimal places
      const displayValue = currentValue !== '' && currentValue !== undefined && currentValue !== null
        ? (typeof currentValue === 'number' ? currentValue.toFixed(2) : String(currentValue))
        : '';
      
      return (
        <div key={field.key} className="mb-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={displayValue}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty input while typing
              if (inputValue === '' || inputValue === '-') {
                handleFieldChange(field.key, '');
                return;
              }
              // Parse and validate number with max 2 decimal places
              const numValue = parseFloat(inputValue);
              if (!isNaN(numValue)) {
                // Round to 2 decimal places
                const roundedValue = Math.round(numValue * 100) / 100;
                handleFieldChange(field.key, roundedValue);
              }
            }}
            onBlur={(e) => {
              // Ensure value is set even if user leaves field empty
              const inputValue = e.target.value;
              if (inputValue === '' || inputValue === '-') {
                handleFieldChange(field.key, 0);
              }
            }}
            placeholder="0.00"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          />
        </div>
      );
    }

    // text input
    return (
      <div key={field.key} className="mb-3">
        <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
    );
  };

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Node Properties</h3>
          <p className="text-xs text-slate-500 mt-0.5">{node.data?.label || nodeType}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-200 rounded transition-colors"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {fields.length > 0 ? (
          fields.map(renderField)
        ) : (
          <p className="text-xs text-slate-500">No configurable properties for this node type.</p>
        )}
      </div>
    </div>
  );
};

