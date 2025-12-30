import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnalyzeResponse } from '../../services/tradingAgentService';

interface AiLogsPanelProps {
  logs: AnalyzeResponse[];
  isActive: boolean;
}

export const AiLogsPanel: React.FC<AiLogsPanelProps> = ({ logs, isActive }) => {
  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'LONG':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'SHORT':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      case 'EXIT':
        return <Minus className="w-3 h-3 text-yellow-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'LONG':
        return 'text-green-400 border-green-400/30';
      case 'SHORT':
        return 'text-red-400 border-red-400/30';
      case 'EXIT':
        return 'text-yellow-400 border-yellow-400/30';
      default:
        return 'text-gray-400 border-gray-400/30';
    }
  };

  const getPositionStatusColor = (status?: string) => {
    switch (status) {
      case 'ENTRY':
        return 'bg-green-500/20 text-green-400 border-green-400/50';
      case 'EXIT':
        return 'bg-red-500/20 text-red-400 border-red-400/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/50';
    }
  };

  if (!isActive && logs.length === 0) {
    return (
      <div className="h-64 bg-black/60 border-t border-white/10 p-4 flex items-center justify-center flex-shrink-0">
        <div className="text-white/40 text-sm">Agent logs will appear here when simulation starts</div>
      </div>
    );
  }

  return (
    <div className="h-64 bg-black/60 border-t border-white/10 flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isActive ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-xs font-bold text-white">AI Agent Logs</span>
          {isActive && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-400/30">
              Active
            </span>
          )}
        </div>
        <span className="text-xs text-white/40">{logs.length} updates</span>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-white/40 text-sm text-center py-8">Waiting for agent updates...</div>
        ) : (
          [...logs].reverse().map((log, idx) => (
            <div
              key={log._poll_id || idx}
              className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {getRecommendationIcon(log.recommendation)}
                  <span className={`text-xs font-bold ${getRecommendationColor(log.recommendation)}`}>
                    {log.recommendation}
                  </span>
                  {(log.position_status === 'ENTRY' || log.position_status === 'EXIT') && (
                    <span className={`px-2 py-0.5 text-xs rounded border font-semibold ${getPositionStatusColor(log.position_status)}`}>
                      {log.position_status === 'ENTRY' ? '🟢 ENTRY' : '🔴 EXIT'}
                    </span>
                  )}
                  {log.stop_loss_triggered && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded border border-red-400/50">
                      Stop Loss
                    </span>
                  )}
                  {log.take_profit_triggered && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-400/50">
                      Take Profit
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/40">
                  #{log.iteration} • ${log.market_data.price.toFixed(2)}
                </span>
              </div>

              {/* Details Row */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-white/60">Confidence:</span>
                  <span className="text-white font-semibold">{log.confidence.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white/60">Sentiment:</span>
                  <span className="text-white font-semibold">{log.sentiment_data.overall_sentiment.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white/60">Risk:</span>
                  <span className="text-white font-semibold">{log.sentiment_data.risk_level}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-white/40">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

