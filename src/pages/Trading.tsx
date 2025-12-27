import React, { useState } from 'react';
import { 
  TrendingUp, ChevronDown, Settings, Maximize2,
  Search, Layout, Star as StarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockMarkets, mockPriceData, mockTopMovers } from '../utils/mockTradingData';
import { ChartTab } from '../components/trading/ChartTab';
import { DepthTab } from '../components/trading/DepthTab';
import { MarginTab } from '../components/trading/MarginTab';
import { MarketInfoTab } from '../components/trading/MarketInfoTab';
import { BookTab } from '../components/trading/BookTab';
import { TradesTab } from '../components/trading/TradesTab';
import { PositionsTab } from '../components/trading/PositionsTab';
import { BorrowsTab } from '../components/trading/BorrowsTab';
import { OpenOrdersTab } from '../components/trading/OpenOrdersTab';
import { TWAPTab } from '../components/trading/TWAPTab';
import { FillHistoryTab } from '../components/trading/FillHistoryTab';
import { OrderHistoryTab } from '../components/trading/OrderHistoryTab';
import { PositionHistoryTab } from '../components/trading/PositionHistoryTab';
import { TradingPanel } from '../components/trading/TradingPanel';

// Market Dropdown Component
const MarketDropdown: React.FC<{ onClose: () => void; onSelectMarket: (symbol: string) => void }> = ({ onClose, onSelectMarket }) => {
  const [activeTab, setActiveTab] = useState('Spot');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMarkets = mockMarkets.filter(m => 
    m.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-full left-0 mt-2 w-[400px] bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col overflow-hidden"
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          {['Spot', 'Futures', 'Lend'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`hover:text-white transition-colors ${activeTab === tab ? 'text-white' : ''}`}
            >
              {tab}
            </button>
          ))}
          <StarIcon className="w-3.5 h-3.5 hover:text-yellow-400 transition-colors cursor-pointer" />
          <div className="flex-1" />
          <Layout className="w-3.5 h-3.5 text-white/20" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search markets..." 
            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs font-roboto text-white focus:outline-none focus:border-white/20 transition-all"
          />
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-[1.5fr_1fr_1fr] px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
        <span>Market / Volume</span>
        <span className="text-right">Price / Change</span>
        <span className="text-right">Market Cap</span>
      </div>

      {/* Market List */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredMarkets.map((m, i) => (
          <div 
            key={i} 
            className="grid grid-cols-[1.5fr_1fr_1fr] px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer group items-center"
            onClick={() => {
              onSelectMarket(m.symbol.replace('/', ''));
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/80 group-hover:bg-white/10">
                {m.icon}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white/90">{m.symbol}</span>
                  {m.leverage && (
                    <span className="text-[9px] px-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                      {m.leverage}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/20 font-medium">{m.volume}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white/90">{m.price}</span>
              <span className={`text-[10px] font-bold ${m.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {m.change}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <span className="text-[10px] text-white/40 font-bold">{m.marketCap}</span>
              <StarIcon className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};


export const Trading: React.FC = () => {
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [chartTab, setChartTab] = useState('Chart');
  const [orderBookTab, setOrderBookTab] = useState('Book');
  const [bottomTab, setBottomTab] = useState('Open Orders');
  const [selectedSymbol, setSelectedSymbol] = useState('ETHUSD');

  const chartTabs = ['Chart', 'Depth', 'Margin', 'Market Info'];
  const orderBookTabs = ['Book', 'Trades'];
  const bottomTabs = ['Positions', 'Borrows', 'Open Orders', 'TWAP', 'Fill History', 'Order History', 'Position History'];

  const renderChartContent = () => {
    switch (chartTab) {
      case 'Chart':
        return <ChartTab symbol={selectedSymbol} />;
      case 'Depth':
        return <DepthTab />;
      case 'Margin':
        return <MarginTab />;
      case 'Market Info':
        return <MarketInfoTab />;
      default:
        return <ChartTab symbol={selectedSymbol} />;
    }
  };

  const renderOrderBookContent = () => {
    switch (orderBookTab) {
      case 'Book':
        return <BookTab />;
      case 'Trades':
        return <TradesTab />;
      default:
        return <BookTab />;
    }
  };

  const renderBottomContent = () => {
    switch (bottomTab) {
      case 'Positions':
        return <PositionsTab />;
      case 'Borrows':
        return <BorrowsTab />;
      case 'Open Orders':
        return <OpenOrdersTab />;
      case 'TWAP':
        return <TWAPTab />;
      case 'Fill History':
        return <FillHistoryTab />;
      case 'Order History':
        return <OrderHistoryTab />;
      case 'Position History':
        return <PositionHistoryTab />;
      default:
        return <OpenOrdersTab />;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16 flex flex-col text-white font-roboto overflow-hidden">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      {/* Header Info Bar */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 gap-8 relative z-[150] bg-black/40 backdrop-blur-md">
        <div className="relative z-[160]">
          <button 
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
            onClick={() => setIsMarketOpen(!isMarketOpen)}
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(59,130,246,0.5)]">Ξ</div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white/90">ETH/USD</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isMarketOpen ? 'rotate-180 text-white' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {isMarketOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-[2px]" 
                  onClick={() => setIsMarketOpen(false)} 
                />
                <MarketDropdown 
                  onClose={() => setIsMarketOpen(false)} 
                  onSelectMarket={(symbol) => setSelectedSymbol(symbol)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-8">
          <div>
            <div className={`font-bold text-sm ${mockPriceData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {mockPriceData.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-white/40 font-bold tracking-tighter">
              ${mockPriceData.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-0.5">24h Change</div>
            <div className={`text-xs font-bold ${mockPriceData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {mockPriceData.change24h >= 0 ? '+' : ''}{mockPriceData.change24h.toFixed(2)} ({mockPriceData.changePercent24h >= 0 ? '+' : ''}{mockPriceData.changePercent24h.toFixed(2)}%)
            </div>
          </div>
          
          <div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-0.5">24h High</div>
            <div className="text-white/80 text-xs font-bold">{mockPriceData.high24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          
          <div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-0.5">24h Low</div>
            <div className="text-white/80 text-xs font-bold">{mockPriceData.low24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          
    <div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-0.5">24h Volume (USD)</div>
            <div className="text-white/80 text-xs font-bold">{mockPriceData.volume24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-[1fr_320px] p-2 gap-2 relative z-10 overflow-hidden">
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="grid grid-cols-[1fr_300px] gap-2 flex-1 min-h-0">
            {/* Chart Container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-widest">
                {chartTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setChartTab(tab)}
                    className={`transition-colors hover:text-white relative pb-2 -mb-2 ${
                      chartTab === tab ? 'text-white' : ''
                    }`}
                  >
                    {tab}
                    {chartTab === tab && (
                      <motion.div
                        layoutId="chart-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-2">
                {renderChartContent()}
              </div>
            </div>
            
            {/* Order Book/Trades Column */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-white/10 text-[11px] font-roboto font-medium text-white/40 uppercase tracking-wider">
                {orderBookTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOrderBookTab(tab)}
                    className={`transition-colors hover:text-white relative pb-2 -mb-2 ${
                      orderBookTab === tab ? 'text-white' : ''
                    }`}
                  >
                    {tab}
                    {orderBookTab === tab && (
                      <motion.div
                        layoutId="orderbook-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                {renderOrderBookContent()}
              </div>
            </div>
          </div>

          {/* Bottom History Tabs */}
          <div className="h-[300px]">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 h-full flex flex-col">
              <div className="flex items-center gap-6 px-6 py-3 border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-widest overflow-x-auto">
                {bottomTabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setBottomTab(tab)}
                    className={`transition-colors hover:text-white relative pb-3 -mb-3 whitespace-nowrap ${
                      bottomTab === tab ? 'text-white' : ''
                    }`}
                  >
                    {tab}
                    {bottomTab === tab && (
                      <motion.div
                        layoutId="bottom-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      />
                    )}
                  </button>
                ))}
                <div className="flex-1" />
                <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-4">
                  <button className="text-white hover:text-white/80">All</button>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {renderBottomContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Trading Panel) */}
        <TradingPanel />
      </div>

      {/* Footer Ticker */}
      <div className="h-8 bg-black/80 backdrop-blur-md border-t border-white/5 flex items-center px-4 gap-6 text-[10px] font-bold text-white/40 uppercase relative z-20">
        <div className="flex items-center gap-2 text-orange-400">
          <TrendingUp className="w-3 h-3" />
          <span>Top Movers</span>
        </div>
        <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
          {mockTopMovers.map((mover, idx) => (
            <React.Fragment key={idx}>
              <span className="text-white/60">
                {mover.symbol} <span className={mover.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                  ${mover.price.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}%)
                </span>
              </span>
              {idx < mockTopMovers.length - 1 && <span className="text-white/20">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
