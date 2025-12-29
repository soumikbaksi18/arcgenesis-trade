import React, { useRef, useEffect } from 'react';
import { TrendingUp, Play, Pause, Square } from 'lucide-react';

interface ChartPanelProps {
  nodes: any[];
  edges: any[];
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ nodes, edges }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize TradingView chart
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && chartRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'ETHUSD',
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#000000',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: chartRef.current.id,
          height: '100%',
          width: '100%',
          backgroundColor: "rgba(0, 0, 0, 0)",
          gridColor: "rgba(255, 255, 255, 0.05)",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleSimulate = () => {
    setIsSimulating(!isSimulating);
    // TODO: Run backtest simulation
  };

  return (
    <div className="h-full flex flex-col bg-black/40 border-l border-white/10">
      {/* Chart Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Strategy Simulation</h3>
          <div className="text-xs text-white/40 mt-1">
            {nodes.length} blocks • {edges.length} connections
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Simulate
              </>
            )}
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Square className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative">
        <div id="strategy-chart" ref={chartRef} className="w-full h-full" />
      </div>

      {/* Simulation Stats */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-white/40 mb-1">Total P&L</div>
            <div className="text-green-400 font-bold">+$0.00</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Win Rate</div>
            <div className="text-white font-bold">0%</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Trades</div>
            <div className="text-white font-bold">0</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Max Drawdown</div>
            <div className="text-white font-bold">0%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

