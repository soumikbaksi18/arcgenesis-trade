// Mock Strategy Data for Automated Trading

export interface Strategy {
  id: string;
  name: string;
  type: 'Grid' | 'DCA' | 'Trend' | 'Custom';
  marketPair: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  pnl30d: number;
  drawdown30d: number;
  description: string;
  creator: string;
  followers: number;
  isVerified: boolean;
}

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'ETH Grid Bot',
    type: 'Grid',
    marketPair: 'ETH/USDT',
    riskLevel: 'Low',
    pnl30d: 12.5,
    drawdown30d: 2.3,
    description: 'Automated grid trading strategy for ETH/USDT pair',
    creator: 'ProTrader',
    followers: 1247,
    isVerified: true,
  },
  {
    id: '2',
    name: 'BTC DCA Accumulator',
    type: 'DCA',
    marketPair: 'BTC/USDT',
    riskLevel: 'Medium',
    pnl30d: 8.2,
    drawdown30d: 5.1,
    description: 'Dollar-cost averaging strategy for BTC accumulation',
    creator: 'CryptoQuant',
    followers: 892,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Trend Following Bot',
    type: 'Trend',
    marketPair: 'ETH/USDT',
    riskLevel: 'High',
    pnl30d: 18.7,
    drawdown30d: 8.9,
    description: 'Advanced trend-following strategy with dynamic stop-loss',
    creator: 'AlgoMaster',
    followers: 2156,
    isVerified: true,
  },
  {
    id: '4',
    name: 'Custom Rebalancer',
    type: 'Custom',
    marketPair: 'ETH/USDT',
    riskLevel: 'Medium',
    pnl30d: 6.4,
    drawdown30d: 3.2,
    description: 'Custom portfolio rebalancing workflow',
    creator: 'DeFiBuilder',
    followers: 456,
    isVerified: false,
  },
  {
    id: '5',
    name: 'SOL Grid Strategy',
    type: 'Grid',
    marketPair: 'SOL/USDT',
    riskLevel: 'Low',
    pnl30d: 9.8,
    drawdown30d: 1.8,
    description: 'Grid trading optimized for SOL volatility',
    creator: 'SolanaPro',
    followers: 634,
    isVerified: true,
  },
];

