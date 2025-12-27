// Mock Trading Data for Spot Trading Interface

export interface MarketData {
  symbol: string;
  leverage?: string;
  volume: string;
  price: string;
  change: string;
  marketCap: string;
  icon: string;
}

export interface Trade {
  price: number;
  qty: number;
  time: string;
  side: 'buy' | 'sell';
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  side: 'buy' | 'sell';
}

export interface PriceData {
  current: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  leverage: number;
  liquidationPrice: number;
}

export interface OpenOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop';
  price: number;
  amount: number;
  filled: number;
  status: 'pending' | 'partially_filled';
  time: string;
}

export interface FillHistory {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  fee: number;
  time: string;
}

export interface OrderHistory {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop';
  price: number;
  amount: number;
  filled: number;
  status: 'filled' | 'cancelled' | 'rejected';
  time: string;
}

// Market List Data
export const mockMarkets: MarketData[] = [
  { symbol: 'ETH/USD', leverage: '10x', volume: '$6.71M', price: '2,924.49', change: '+0.01%', marketCap: '$352.9B', icon: 'Ξ' },
  { symbol: 'SOL/USD', leverage: '10x', volume: '$6.31M', price: '123.21', change: '+0.98%', marketCap: '$69.4B', icon: 'S' },
  { symbol: 'BNB/USD', leverage: '10x', volume: '$2.25M', price: '839.5', change: '+0.92%', marketCap: '$115.6B', icon: 'B' },
  { symbol: 'BTC/USD', leverage: '10x', volume: '$1.27M', price: '87,440.2', change: '+0.25%', marketCap: '$1.7T', icon: '₿' },
  { symbol: 'USDT/USD', leverage: '10x', volume: '$1.06M', price: '0.9996', change: '0.00%', marketCap: '$186.8B', icon: '₮' },
  { symbol: 'HYPE/USD', leverage: '8x', volume: '$391.34K', price: '25.593', change: '-2.75%', marketCap: '$12.7B', icon: 'H' },
  { symbol: 'SUI/USD', leverage: '10x', volume: '$171.40K', price: '1.4212', change: '+2.64%', marketCap: '$5.3B', icon: 'S' },
  { symbol: 'MON/USD', volume: '$133.01K', price: '0.022780', change: '-4.30%', marketCap: '$247.3M', icon: 'M' },
  { symbol: 'XPL/USD', leverage: '10x', volume: '$82.22K', price: '0.1513', change: '+7.61%', marketCap: '$311.6M', icon: 'X' },
  { symbol: 'APT/USD', leverage: '3x', volume: '$61.15K', price: '1.7229', change: '+2.42%', marketCap: '$1.3B', icon: 'A' },
];

// Recent Trades Data
export const mockRecentTrades: Trade[] = [
  { price: 2923.83, qty: 0.2450, time: '00:22:22', side: 'sell' },
  { price: 2923.85, qty: 0.3419, time: '00:22:22', side: 'sell' },
  { price: 2923.86, qty: 0.5131, time: '00:22:22', side: 'sell' },
  { price: 2924.49, qty: 0.5130, time: '00:20:39', side: 'buy' },
  { price: 2924.91, qty: 0.0528, time: '00:20:00', side: 'buy' },
  { price: 2924.91, qty: 0.0341, time: '00:19:58', side: 'buy' },
  { price: 2924.91, qty: 0.0341, time: '00:19:53', side: 'buy' },
  { price: 2924.91, qty: 0.0341, time: '00:19:48', side: 'buy' },
  { price: 2925.10, qty: 0.0955, time: '00:19:45', side: 'buy' },
  { price: 2925.14, qty: 0.5129, time: '00:19:45', side: 'buy' },
  { price: 2925.45, qty: 0.0204, time: '00:17:36', side: 'sell' },
  { price: 2925.48, qty: 0.0205, time: '00:16:51', side: 'buy' },
  { price: 2925.25, qty: 0.0100, time: '00:16:46', side: 'sell' },
  { price: 2925.78, qty: 0.5000, time: '00:11:04', side: 'buy' },
];

// Order Book Data
export const mockOrderBook: OrderBookEntry[] = [
  // Sell orders (asks)
  { price: 2925.50, amount: 0.1234, total: 361.01, side: 'sell' },
  { price: 2925.45, amount: 0.2450, total: 716.74, side: 'sell' },
  { price: 2925.40, amount: 0.3419, total: 1000.59, side: 'sell' },
  { price: 2925.35, amount: 0.5131, total: 1502.04, side: 'sell' },
  { price: 2925.30, amount: 0.2000, total: 585.06, side: 'sell' },
  { price: 2925.25, amount: 0.1500, total: 438.79, side: 'sell' },
  { price: 2925.20, amount: 0.3000, total: 877.56, side: 'sell' },
  { price: 2925.15, amount: 0.1000, total: 292.52, side: 'sell' },
  { price: 2925.10, amount: 0.2500, total: 731.28, side: 'sell' },
  { price: 2925.05, amount: 0.1800, total: 526.51, side: 'sell' },
  // Buy orders (bids)
  { price: 2925.00, amount: 0.2200, total: 643.50, side: 'buy' },
  { price: 2924.95, amount: 0.3500, total: 1025.73, side: 'buy' },
  { price: 2924.90, amount: 0.1500, total: 438.74, side: 'buy' },
  { price: 2924.85, amount: 0.2800, total: 819.96, side: 'buy' },
  { price: 2924.80, amount: 0.1900, total: 555.71, side: 'buy' },
  { price: 2924.75, amount: 0.3200, total: 935.92, side: 'buy' },
  { price: 2924.70, amount: 0.1400, total: 409.46, side: 'buy' },
  { price: 2924.65, amount: 0.2600, total: 760.41, side: 'buy' },
  { price: 2924.60, amount: 0.1700, total: 497.18, side: 'buy' },
  { price: 2924.55, amount: 0.3000, total: 877.37, side: 'buy' },
];

// Price Data
export const mockPriceData: PriceData = {
  current: 2923.83,
  change24h: 2.39,
  changePercent24h: 0.08,
  high24h: 2939.18,
  low24h: 2917.21,
  volume24h: 6707565.09,
};

// Positions Data
export const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'ETH/USD',
    side: 'long',
    size: 0.5,
    entryPrice: 2900.00,
    markPrice: 2923.83,
    pnl: 11.92,
    pnlPercent: 0.82,
    leverage: 10,
    liquidationPrice: 2610.00,
  },
  {
    id: '2',
    symbol: 'BTC/USD',
    side: 'short',
    size: 0.01,
    entryPrice: 87500.00,
    markPrice: 87440.20,
    pnl: 0.60,
    pnlPercent: 0.07,
    leverage: 5,
    liquidationPrice: 91875.00,
  },
];

// Open Orders Data
export const mockOpenOrders: OpenOrder[] = [
  {
    id: '1',
    symbol: 'ETH/USD',
    side: 'buy',
    type: 'limit',
    price: 2920.00,
    amount: 0.1,
    filled: 0,
    status: 'pending',
    time: '10:23:45',
  },
  {
    id: '2',
    symbol: 'ETH/USD',
    side: 'sell',
    type: 'limit',
    price: 2930.00,
    amount: 0.05,
    filled: 0,
    status: 'pending',
    time: '10:20:12',
  },
  {
    id: '3',
    symbol: 'ETH/USD',
    side: 'buy',
    type: 'market',
    price: 2923.83,
    amount: 0.2,
    filled: 0.15,
    status: 'partially_filled',
    time: '10:15:30',
  },
];

// Fill History Data
export const mockFillHistory: FillHistory[] = [
  {
    id: '1',
    symbol: 'ETH/USD',
    side: 'buy',
    price: 2918.50,
    amount: 0.075,
    fee: 0.22,
    time: '09:45:22',
  },
  {
    id: '2',
    symbol: 'ETH/USD',
    side: 'sell',
    price: 2919.20,
    amount: 0.1,
    fee: 0.29,
    time: '09:30:15',
  },
  {
    id: '3',
    symbol: 'ETH/USD',
    side: 'buy',
    price: 2915.00,
    amount: 0.05,
    fee: 0.15,
    time: '09:10:05',
  },
];

// Order History Data
export const mockOrderHistory: OrderHistory[] = [
  {
    id: '1',
    symbol: 'ETH/USD',
    side: 'buy',
    type: 'limit',
    price: 2918.00,
    amount: 0.075,
    filled: 0.075,
    status: 'filled',
    time: '09:45:22',
  },
  {
    id: '2',
    symbol: 'ETH/USD',
    side: 'sell',
    type: 'market',
    price: 2919.20,
    amount: 0.1,
    filled: 0.1,
    status: 'filled',
    time: '09:30:15',
  },
  {
    id: '3',
    symbol: 'ETH/USD',
    side: 'buy',
    type: 'limit',
    price: 2915.00,
    amount: 0.05,
    filled: 0,
    status: 'cancelled',
    time: '09:10:05',
  },
];

// Top Movers Data
export const mockTopMovers = [
  { symbol: 'APEX-PERP', price: 0.5348, change: 11.48 },
  { symbol: 'BTC-PERP', price: 43250, change: 2.57 },
  { symbol: 'ETH-PERP', price: 2925, change: -0.03 },
  { symbol: 'SOL-PERP', price: 98.45, change: 3.42 },
  { symbol: 'DOGE-PERP', price: 0.12275, change: 0.87 },
  { symbol: 'KBONK-PERP', price: 0.007900, change: 0.43 },
];

// Depth Chart Data (for Depth tab)
export const mockDepthData = {
  bids: mockOrderBook.filter(o => o.side === 'buy').reverse(),
  asks: mockOrderBook.filter(o => o.side === 'sell'),
};

// Market Info Data
export const mockMarketInfo = {
  symbol: 'ETH/USD',
  exchange: 'Coinbase',
  baseAsset: 'Ethereum',
  quoteAsset: 'U.S. Dollar',
  contractSize: 1,
  tickSize: 0.01,
  minOrderSize: 0.001,
  maxOrderSize: 1000,
  makerFee: 0.001,
  takerFee: 0.0015,
  fundingRate: 0.0001,
  nextFundingTime: '2024-01-28 00:00:00 UTC',
  openInterest: 1250000,
  indexPrice: 2923.50,
  markPrice: 2923.83,
};

