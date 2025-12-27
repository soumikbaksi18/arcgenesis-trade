import React from 'react';
import { mockMarketInfo } from '../../utils/mockTradingData';
import { Info, DollarSign, Percent, Clock, TrendingUp } from 'lucide-react';

export const MarketInfoTab: React.FC = () => {
  const infoSections = [
    {
      title: 'Trading Pair',
      items: [
        { label: 'Symbol', value: mockMarketInfo.symbol },
        { label: 'Exchange', value: mockMarketInfo.exchange },
        { label: 'Base Asset', value: mockMarketInfo.baseAsset },
        { label: 'Quote Asset', value: mockMarketInfo.quoteAsset },
      ],
    },
    {
      title: 'Trading Parameters',
      items: [
        { label: 'Contract Size', value: mockMarketInfo.contractSize },
        { label: 'Tick Size', value: mockMarketInfo.tickSize },
        { label: 'Min Order Size', value: mockMarketInfo.minOrderSize },
        { label: 'Max Order Size', value: mockMarketInfo.maxOrderSize },
      ],
    },
    {
      title: 'Fees',
      items: [
        { label: 'Maker Fee', value: `${(mockMarketInfo.makerFee * 100).toFixed(3)}%` },
        { label: 'Taker Fee', value: `${(mockMarketInfo.takerFee * 100).toFixed(3)}%` },
      ],
    },
    {
      title: 'Funding & Pricing',
      items: [
        { label: 'Funding Rate', value: `${(mockMarketInfo.fundingRate * 100).toFixed(4)}%` },
        { label: 'Next Funding', value: mockMarketInfo.nextFundingTime },
        { label: 'Index Price', value: `$${mockMarketInfo.indexPrice.toFixed(2)}` },
        { label: 'Mark Price', value: `$${mockMarketInfo.markPrice.toFixed(2)}` },
      ],
    },
    {
      title: 'Market Data',
      items: [
        { label: 'Open Interest', value: `$${mockMarketInfo.openInterest.toLocaleString()}` },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-6">
        {infoSections.map((section, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-white/60" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{section.title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex flex-col">
                  <div className="text-xs text-white/40 font-medium mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

