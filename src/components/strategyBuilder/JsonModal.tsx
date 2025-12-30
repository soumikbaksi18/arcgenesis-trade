import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { StrategyApiPayload } from '../../utils/strategyToApiJson';
import { useStrategyStore } from '../../stores/strategyStore';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jsonData: StrategyApiPayload) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({ isOpen, onClose, onSave }) => {
  const apiPayload = useStrategyStore((state) => state.apiPayload);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !apiPayload) return null;
  
  const jsonData = apiPayload;
  const formattedJson = JSON.stringify(jsonData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">API Payload</h2>
            <p className="text-xs text-slate-500 mt-0.5">Generated from your strategy workflow</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors relative"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col p-6">
          {/* Preview */}
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-4">API Payload Preview:</p>
            <div className="text-sm text-slate-600 font-mono space-y-2">
              <div><span className="text-slate-800 font-semibold">Token:</span> {jsonData.token}</div>
              <div><span className="text-slate-800 font-semibold">Stablecoin:</span> {jsonData.stablecoin}</div>
              <div><span className="text-slate-800 font-semibold">Amount:</span> {jsonData.portfolio_amount}</div>
              <div><span className="text-slate-800 font-semibold">Risk:</span> {jsonData.risk_level}</div>
              {jsonData.model && <div><span className="text-slate-800 font-semibold">Model:</span> {jsonData.model}</div>}
              {jsonData.quant_algo && <div><span className="text-slate-800 font-semibold">Algorithm:</span> {jsonData.quant_algo}</div>}
              {jsonData.stop_loss && <div><span className="text-slate-800 font-semibold">Stop Loss:</span> {jsonData.stop_loss}%</div>}
              {jsonData.take_profit && <div><span className="text-slate-800 font-semibold">Take Profit:</span> {jsonData.take_profit}%</div>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

