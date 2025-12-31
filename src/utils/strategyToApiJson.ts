import { Node, Edge } from 'reactflow';

export interface StrategyApiPayload {
  token: string;
  stablecoin: string;
  portfolio_amount: number;
  risk_level: 'safe' | 'medium' | 'aggressive';
  model?: string;
  stop_loss?: string;
  take_profit?: string;
  quant_algo?: string;
}

/**
 * Converts a node workflow to API JSON payload
 */
export function convertWorkflowToApiJson(nodes: Node[], edges: Edge[]): StrategyApiPayload {
  const payload: StrategyApiPayload = {
    token: 'BTC', // Default
    stablecoin: 'USDC', // Default
    portfolio_amount: 1000.0, // Default
    risk_level: 'medium', // Default
  };

  // Process each node type
  nodes.forEach((node) => {
    const nodeType = node.data?.type || '';
    const params = node.data?.params || {};

    // Pool node - extract token from pool value (e.g., "ETH/USD" -> "ETH")
    if (nodeType === 'Pool' && params.pool) {
      const pool = String(params.pool);
      // Extract token from pool format like "ETH/USD" -> "ETH"
      const tokenMatch = pool.split('/')[0];
      if (tokenMatch) {
        payload.token = tokenMatch;
      }
    }

    // Payment node - extract stablecoin and amount
    if (nodeType === 'Payment') {
      if (params.stablecoin) {
        payload.stablecoin = String(params.stablecoin);
      }
      if (params.amount !== undefined && params.amount !== null && params.amount !== '') {
        payload.portfolio_amount = parseFloat(String(params.amount)) || 1000.0;
      }
    }

    // Risk node - extract risk level
    if (nodeType === 'InvestmentRisk' && params.riskLevel) {
      const riskLevel = String(params.riskLevel);
      if (['safe', 'medium', 'aggressive'].includes(riskLevel)) {
        payload.risk_level = riskLevel as 'safe' | 'medium' | 'aggressive';
      }
    }

    // AI Model nodes - extract model name
    if (['DeepSeekChat', 'Qwen3Max', 'ClaudeSonnet', 'Grok4', 'GeminiPro', 'ChatGPT'].includes(nodeType)) {
      // Map node types to API model names
      const modelMap: { [key: string]: string } = {
        'DeepSeekChat': 'DeepSeek Chat V3.1',
        'Qwen3Max': 'Qwen3 Max',
        'ClaudeSonnet': 'Claude Sonnet 4.5',
        'Grok4': 'Grok 4',
        'GeminiPro': 'Gemini 2.5 Pro',
        'ChatGPT': 'GPT-5',
      };
      payload.model = modelMap[nodeType] || params.model || nodeType;
    }

    // Quant Algorithm nodes - extract algorithm name
    if (['FundingRateArbitrage', 'MarketMaking', 'StatisticalArbitrage', 'TrendFollowing', 
         'PortfolioOptimization', 'OrderBookImbalance', 'MeanReversion', 'SignalEnsemble', 
         'LSTM', 'ReinforcementLearning'].includes(nodeType)) {
      // Map node types to API algorithm names
      const algoMap: { [key: string]: string } = {
        'FundingRateArbitrage': 'Funding Rate Arbitrage',
        'MarketMaking': 'Market Making',
        'StatisticalArbitrage': 'Statistical Arbitrage (Pairs / Cointegration)',
        'TrendFollowing': 'Trend Following (Momentum Models)',
        'PortfolioOptimization': 'Portfolio Optimization / Risk Parity',
        'OrderBookImbalance': 'Order Book Imbalance Models',
        'MeanReversion': 'Mean Reversion',
        'SignalEnsemble': 'Signal Ensemble / Meta-Strategies',
        'LSTM': 'LSTM / GRU Time-Series Models',
        'ReinforcementLearning': 'Reinforcement Learning (PPO / DQN)',
      };
      payload.quant_algo = algoMap[nodeType] || params.algorithm || nodeType;
    }

    // Stop Loss node - calculate stop_loss percentage
    if (nodeType === 'StopLoss' && params.value !== undefined) {
      const stopLossValue = parseFloat(String(params.value)) || 0;
      // stop_loss = 100 - stopLossPercent (e.g., 15% loss = 85% of entry)
      const stopLossPercent = 100 - stopLossValue;
      payload.stop_loss = stopLossPercent.toFixed(1);
    }

    // Take Profit node - calculate take_profit percentage
    if (nodeType === 'TakeProfit' && params.value !== undefined) {
      const takeProfitValue = parseFloat(String(params.value)) || 0;
      // take_profit = 100 + takeProfitPercent (e.g., 100% gain = 200% of entry)
      const takeProfitPercent = 100 + takeProfitValue;
      payload.take_profit = takeProfitPercent.toFixed(1);
    }
  });

  return payload;
}

