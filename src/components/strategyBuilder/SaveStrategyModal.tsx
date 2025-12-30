import React, { useState } from 'react';
import { X } from 'lucide-react';
import { StrategyApiPayload } from '../../utils/strategyToApiJson';

interface SaveStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    marketPair: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    minInvestment?: number;
    trades24h?: number;
    drawdown7d?: number;
  }) => void;
  apiPayload: StrategyApiPayload;
}

export const SaveStrategyModal: React.FC<SaveStrategyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  apiPayload,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [marketPair, setMarketPair] = useState(`${apiPayload.token}/${apiPayload.stablecoin}`);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>(
    apiPayload.risk_level === 'safe' ? 'Low' : apiPayload.risk_level === 'medium' ? 'Medium' : 'High'
  );
  const [minInvestment, setMinInvestment] = useState(apiPayload.portfolio_amount.toString());
  const [trades24h, setTrades24h] = useState('');
  const [drawdown7d, setDrawdown7d] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      marketPair: marketPair.trim(),
      riskLevel,
      minInvestment: minInvestment ? parseFloat(minInvestment) : undefined,
      trades24h: trades24h ? parseInt(trades24h) : undefined,
      drawdown7d: drawdown7d ? parseFloat(drawdown7d) : undefined,
    });
    
    // Reset form
    setName('');
    setDescription('');
    setMarketPair(`${apiPayload.token}/${apiPayload.stablecoin}`);
    setRiskLevel(apiPayload.risk_level === 'safe' ? 'Low' : apiPayload.risk_level === 'medium' ? 'Medium' : 'High');
    setMinInvestment(apiPayload.portfolio_amount.toString());
    setTrades24h('');
    setDrawdown7d('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Save Strategy</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter details for your strategy</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Strategy Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Strategy Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., ETH Grid Bot"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your strategy..."
                rows={4}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 resize-none"
                required
              />
            </div>

            {/* Market Pair */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Market Pair
              </label>
              <input
                type="text"
                value={marketPair}
                onChange={(e) => setMarketPair(e.target.value)}
                placeholder="e.g., ETH/USDC"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              />
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Min Investment */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Minimum Investment (Optional)
              </label>
              <input
                type="number"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
                placeholder="e.g., 1000"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              />
            </div>

            {/* 24H Trades */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                24H Trades (Optional)
              </label>
              <input
                type="number"
                value={trades24h}
                onChange={(e) => setTrades24h(e.target.value)}
                placeholder="e.g., 45"
                min="0"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              />
            </div>

            {/* 7D MDD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                7D MDD (Maximum Drawdown) % (Optional)
              </label>
              <input
                type="number"
                value={drawdown7d}
                onChange={(e) => setDrawdown7d(e.target.value)}
                placeholder="e.g., 2.3"
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
              />
            </div>

            {/* Preview of API Payload */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-3">Strategy Configuration:</p>
              <div className="text-xs text-slate-600 font-mono space-y-1.5">
                <div><span className="text-slate-800 font-semibold">Token:</span> {apiPayload.token}</div>
                <div><span className="text-slate-800 font-semibold">Stablecoin:</span> {apiPayload.stablecoin}</div>
                <div><span className="text-slate-800 font-semibold">Amount:</span> {apiPayload.portfolio_amount}</div>
                <div><span className="text-slate-800 font-semibold">Risk Level:</span> {apiPayload.risk_level}</div>
                {apiPayload.model && <div><span className="text-slate-800 font-semibold">Model:</span> {apiPayload.model}</div>}
                {apiPayload.quant_algo && <div><span className="text-slate-800 font-semibold">Algorithm:</span> {apiPayload.quant_algo}</div>}
                {apiPayload.stop_loss && <div><span className="text-slate-800 font-semibold">Stop Loss:</span> {apiPayload.stop_loss}%</div>}
                {apiPayload.take_profit && <div><span className="text-slate-800 font-semibold">Take Profit:</span> {apiPayload.take_profit}%</div>}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

