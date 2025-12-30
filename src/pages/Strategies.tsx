import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, TrendingUp, Plus, Settings, RefreshCw, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockMyStrategies, mockMarketplaceStrategies, Strategy } from '../utils/mockStrategyData';
import { StrategyCard } from '../components/strategies/StrategyCard';
import { useStrategiesStore } from '../stores/strategiesStore';

export const Strategies: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'marketplace'>('my');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Top PNL');
  const [timeframe, setTimeframe] = useState<string>('30 Days');

  // Get saved strategies from Zustand store
  const savedStrategies = useStrategiesStore((state) => state.strategies);

  // Combine mock strategies with saved strategies for "My Strategies"
  const myStrategies = useMemo(() => {
    // Convert saved strategies to Strategy format (exclude nodes/edges/apiPayload)
    const convertedSavedStrategies: Strategy[] = savedStrategies.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      marketPair: s.marketPair,
      riskLevel: s.riskLevel,
      pnl30d: s.pnl30d,
      pnlUSD: s.pnlUSD,
      drawdown30d: s.drawdown30d,
      roi: s.roi,
      description: s.description,
      creator: s.creator,
      creatorAvatar: s.creatorAvatar,
      followers: s.followers,
      isVerified: s.isVerified,
      isMyStrategy: s.isMyStrategy,
      runtime: s.runtime,
      minInvestment: s.minInvestment,
      trades24h: s.trades24h,
      totalTrades: s.totalTrades,
      sharpeRatio: s.sharpeRatio,
      aum: s.aum,
      performanceData: s.performanceData,
      direction: s.direction,
      leverage: s.leverage,
      status: s.status,
    }));
    return [...mockMyStrategies, ...convertedSavedStrategies];
  }, [savedStrategies]);

  const strategies = activeTab === 'my' ? myStrategies : mockMarketplaceStrategies;
  const strategyTypes = ['All', 'Grid', 'DCA', 'Trend', 'Arbitrage', 'Rebalancing', 'Custom'];

  // Filter strategies
  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.marketPair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || strategy.type === filterType;
    return matchesSearch && matchesType;
  });

  // Sort strategies
  const sortedStrategies = [...filteredStrategies].sort((a, b) => {
    switch (sortBy) {
      case 'Top PNL':
        return b.pnlUSD - a.pnlUSD;
      case 'Top ROI':
        return b.roi - a.roi;
      case 'Low MDD':
        return a.drawdown30d - b.drawdown30d;
      case 'High Sharpe':
        return (b.sharpeRatio || 0) - (a.sharpeRatio || 0);
      default:
        return 0;
    }
  });

  const handleDeploy = (id: string) => {
    navigate(`/strategies/${id}/deploy`);
  };

  const totalBalance = myStrategies.reduce((sum, s) => sum + (s.aum || 0), 0);
  const totalPnL = myStrategies.reduce((sum, s) => sum + s.pnlUSD, 0);
  const totalPnLPercent = totalBalance > 0 ? (totalPnL / totalBalance) * 100 : 0;

  return (
    <div className="min-h-screen bg-black pt-20 text-white font-roboto">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Strategies</h1>
            {activeTab === 'my' && (
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-white/40 uppercase mb-1">Total Balance</div>
                  <div className="text-2xl font-bold text-white">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase mb-1">30D P&L</div>
                  <div className={`text-2xl font-bold flex items-center gap-2 ${
                    totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-lg">
                      ({totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {activeTab === 'my' && (
            <button
              onClick={() => navigate('/strategies/create')}
              className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Strategy
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('my')}
            className={`pb-4 px-2 text-sm font-bold transition-colors relative ${
              activeTab === 'my' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            My Strategies
            {activeTab === 'my' && (
              <motion.div
                layoutId="strategy-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`pb-4 px-2 text-sm font-bold transition-colors relative ${
              activeTab === 'marketplace' ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            Marketplace
            {activeTab === 'marketplace' && (
              <motion.div
                layoutId="strategy-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              />
            )}
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {strategyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'my' ? 'Search my strategies...' : 'Search strategies...'}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg py-2 px-4 pr-8 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="Top PNL">Top PNL</option>
              <option value="Top ROI">Top ROI</option>
              <option value="Low MDD">Low MDD</option>
              <option value="High Sharpe">High Sharpe</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>

          {/* Timeframe (for marketplace) */}
          {activeTab === 'marketplace' && (
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-lg py-2 px-4 pr-8 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="30 Days">30 Days</option>
                <option value="7 Days">7 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-white/60" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-white/60" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <List className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Strategies Grid */}
        {sortedStrategies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-white/40 text-lg mb-2">No strategies found</div>
            <div className="text-white/20 text-sm">
              {activeTab === 'my' 
                ? 'Create your first strategy to get started'
                : 'Try adjusting your filters'}
            </div>
            {activeTab === 'my' && (
              <button
                onClick={() => navigate('/strategies/create')}
                className="mt-4 px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all"
              >
                Create Strategy
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                isMyStrategy={activeTab === 'my'}
                onDeploy={handleDeploy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
