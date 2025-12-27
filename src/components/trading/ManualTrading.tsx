import React, { useState } from 'react';

export const ManualTrading: React.FC = () => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('Limit');
  const [price, setPrice] = useState('2,925.45');
  const [quantity, setQuantity] = useState('0');
  const [percentage, setPercentage] = useState(0);
  const [postOnly, setPostOnly] = useState(false);
  const [ioc, setIoc] = useState(false);

  const percentages = [0, 25, 50, 75, 100];
  const orderValue = quantity && price ? (parseFloat(quantity.replace(',', '')) * parseFloat(price.replace(',', ''))).toFixed(2) : '0';

  return (
    <div className="h-full flex flex-col">
      <div className="flex bg-black/40 p-1 rounded-xl mb-6">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 rounded-lg text-xs font-roboto font-bold transition-all ${
            side === 'buy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 rounded-lg text-xs font-roboto font-bold transition-all ${
            side === 'sell' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Sell
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6 text-[11px] font-bold text-white/40 uppercase tracking-widest px-1">
        {['Limit', 'Market', 'Grid Buy'].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`transition-colors hover:text-white ${orderType === type ? 'text-white' : ''}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orderType !== 'Market' && (
          <div>
            <div className="flex justify-between mb-1 text-[10px] text-white/40 font-bold uppercase">
              <span>Price</span>
              <div className="flex gap-2">
                <span className="text-blue-400 cursor-pointer hover:text-blue-300">Mid</span>
                <span className="text-blue-400 cursor-pointer hover:text-blue-300">BBO</span>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-roboto text-white focus:outline-none focus:border-white/30"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-[10px]">$</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between mb-1 text-[10px] text-white/40 font-bold uppercase">
            <span>Quantity</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-roboto text-white focus:outline-none focus:border-white/30"
              placeholder="0"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-[10px]">Ξ</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {percentages.map((pct) => (
              <button
                key={pct}
                onClick={() => setPercentage(pct)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-roboto font-medium transition-all ${
                  percentage === pct
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1 text-[10px] text-white/40 font-bold uppercase">
            <span>Order Value</span>
          </div>
          <div className="relative">
            <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-lg font-roboto text-white/30">
              {orderValue}
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500/10 rounded-full flex items-center justify-center">
              <span className="text-green-400/30 text-[10px]">$</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 transition-all">
          {side === 'buy' ? 'Buy ETH' : 'Sell ETH'}
        </button>
        <button className="w-full py-3.5 bg-white/5 text-white rounded-xl font-bold text-sm hover:bg-white/10 border border-white/10 transition-all">
          Log in to trade
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={postOnly}
            onChange={(e) => setPostOnly(e.target.checked)}
            className="w-3.5 h-3.5 border border-white/20 rounded bg-transparent checked:bg-white/20 checked:border-white/40 focus:outline-none"
          />
          <span>Post Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={ioc}
            onChange={(e) => setIoc(e.target.checked)}
            className="w-3.5 h-3.5 border border-white/20 rounded bg-transparent checked:bg-white/20 checked:border-white/40 focus:outline-none"
          />
          <span>IOC</span>
        </label>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="text-[10px] text-white/40 font-bold uppercase mb-3">Market Reputation</div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">Ξ</div>
          <span className="text-xs font-bold text-white">ETH</span>
          <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">Neutral</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/40 uppercase">
            <span>Level 1</span>
            <span>Level 2</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-white/60">
            <span>$0</span>
            <span>$20</span>
          </div>
        </div>
      </div>
    </div>
  );
};

