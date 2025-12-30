import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TrendingUp, Play, Pause, Square } from 'lucide-react';
import { useStrategyStore } from '../../stores/strategyStore';
import { tradingAgentService, AnalyzeResponse, ActivateRequest } from '../../services/tradingAgentService';
import { AiLogsPanel } from './AiLogsPanel';
import { createMarkerFromSignal, ChartMarkerManager } from '../../utils/chartMarkers';

export const ChartPanel: React.FC = () => {
  const { nodes, edges, apiPayload } = useStrategyStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'active' | 'stopped' | 'paused'>('stopped');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pollId, setPollId] = useState<string | null>(null);
  const [logs, setLogs] = useState<AnalyzeResponse[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const markerManagerRef = useRef(new ChartMarkerManager());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Determine symbol from API payload or default
    const symbol = apiPayload 
      ? `${apiPayload.token}USD`
      : 'ETHUSD';

    // Initialize TradingView chart
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && chartRef.current) {
        // Clear any existing chart
        chartRef.current.innerHTML = '';
        
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
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
    
    // Only append script if not already loaded
    if (!document.querySelector('script[src="https://s3.tradingview.com/tv.js"]')) {
      document.body.appendChild(script);
    } else if (window.TradingView && chartRef.current) {
      // Script already loaded, initialize directly
      chartRef.current.innerHTML = '';
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
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

    return () => {
      // Don't clear on unmount, let it persist
    };
  }, [apiPayload?.token]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback((initialPollId?: string, apiPayloadForPolling?: any) => {
    stopPolling();
    
    if (!apiPayloadForPolling) {
      console.error('Cannot start polling: apiPayload is missing');
      return;
    }
    
    let currentPollId = initialPollId || pollId;
    
    const poll = async () => {
      // Map risk_level for backend (same mapping as activation)
      const riskLevelMap: { [key: string]: string } = {
        'safe': 'conservative',
        'medium': 'moderate',
        'aggressive': 'aggressive',
      };
      
      const mappedRiskLevel = riskLevelMap[apiPayloadForPolling.risk_level] || apiPayloadForPolling.risk_level || 'moderate';
      try {
        const response = await tradingAgentService.analyze(
          {
            token: apiPayloadForPolling.token,
            stablecoin: apiPayloadForPolling.stablecoin || 'USDC',
            portfolio_amount: apiPayloadForPolling.portfolio_amount,
            risk_level: mappedRiskLevel,
            model: apiPayloadForPolling.model,
            stop_loss: apiPayloadForPolling.stop_loss,
            take_profit: apiPayloadForPolling.take_profit,
            quant_algo: apiPayloadForPolling.quant_algo,
          },
          currentPollId || undefined
        );
        
        // Update poll ID for next request
        if (response._poll_id) {
          currentPollId = response._poll_id;
          setPollId(response._poll_id);
        }

        // Add to logs
        setLogs((prev) => [...prev, response]);
        setErrorMessage(null); // Clear any previous errors

        // Create marker for this signal
        if (response.position_status === 'ENTRY' || response.position_status === 'EXIT') {
          const marker = createMarkerFromSignal({
            timestamp: response.timestamp,
            price: response.market_data.price,
            recommendation: response.recommendation,
            position_status: response.position_status,
          });
          markerManagerRef.current.addMarker(marker);
        }

        // Check if agent is stopped (stop-loss/take-profit triggered)
        if (response.agent_status === 'stopped' || response.stop_loss_triggered || response.take_profit_triggered) {
          setIsSimulating(false);
          setAgentStatus('stopped');
          stopPolling();
          
          // Add a final log entry
          if (response.stop_loss_triggered) {
            setLogs((prev) => [...prev, {
              ...response,
              recommendation: 'EXIT' as const,
              position_status: 'EXIT' as const,
            }]);
          }
        } else {
          setAgentStatus(response.agent_status || 'active');
        }
      } catch (error) {
        console.error('Error polling analyze endpoint:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setErrorMessage(errorMsg);
        
        // If it's a client error (4xx), stop polling
        if (errorMsg.includes('422') || errorMsg.includes('4')) {
          setIsSimulating(false);
          setAgentStatus('stopped');
          stopPolling();
        }
        // Continue polling for server errors (5xx) or network issues
      }
    };

    // Poll immediately, then every 5 seconds
    poll();
    pollingIntervalRef.current = setInterval(poll, 5000);
  }, [pollId, stopPolling, apiPayload]);

  const handleSimulate = async () => {
    if (isSimulating) {
      // Pause simulation - deactivate agent
      if (apiPayload && sessionId) {
        try {
          await tradingAgentService.deactivateAgent({
            token: apiPayload.token,
            stablecoin: apiPayload.stablecoin || 'USDC',
            portfolio_amount: apiPayload.portfolio_amount,
          });
          console.log('Agent deactivated successfully');
        } catch (error) {
          console.error('Error deactivating agent:', error);
          // Continue with pause even if deactivation fails
        }
      }
      
      setIsSimulating(false);
      setAgentStatus('paused');
      stopPolling();
      return;
    }

    // Start simulation
    if (!apiPayload) {
      alert('Please generate the API payload first by clicking the JSON button');
      return;
    }

    try {
      setIsActivating(true);

      // Activate agent - map risk_level to backend format
      // Backend accepts: "conservative", "moderate", "aggressive"
      const riskLevelMap: { [key: string]: string } = {
        'safe': 'conservative',
        'medium': 'moderate',
        'aggressive': 'aggressive',
      };
      
      const mappedRiskLevel = riskLevelMap[apiPayload.risk_level] || apiPayload.risk_level || 'moderate';
      
      // Ensure all required fields are present
      const activatePayload: ActivateRequest = {
        token: apiPayload.token,
        stablecoin: apiPayload.stablecoin || 'USDC',
        portfolio_amount: apiPayload.portfolio_amount,
        risk_level: mappedRiskLevel,
      };
      
      // Add optional fields if they exist
      if (apiPayload.model) {
        activatePayload.model = apiPayload.model;
      }
      if (apiPayload.stop_loss) {
        activatePayload.stop_loss = apiPayload.stop_loss;
      }
      if (apiPayload.take_profit) {
        activatePayload.take_profit = apiPayload.take_profit;
      }
      if (apiPayload.quant_algo) {
        activatePayload.quant_algo = apiPayload.quant_algo;
      }
      
      console.log('Activating agent with payload:', activatePayload);
      
      const activateResponse = await tradingAgentService.activateAgent(activatePayload);

      setSessionId(activateResponse.session_id);
      setIsSimulating(true);
      setAgentStatus('active');
      setLogs([]); // Clear previous logs
      markerManagerRef.current.clearMarkers(); // Clear previous markers
      setErrorMessage(null); // Clear any previous errors

      // Start polling after a short delay (backend needs time to process)
      setTimeout(() => {
        startPolling(undefined, apiPayload);
      }, 2000); // Increased delay to ensure backend is ready
    } catch (error) {
      console.error('Error activating agent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error details:', error);
      alert(`Failed to activate agent: ${errorMessage}`);
      setIsSimulating(false);
      setAgentStatus('stopped');
    } finally {
      setIsActivating(false);
    }
  };

  const handleStop = async () => {
    // Deactivate agent if it's running
    if (apiPayload && sessionId && isSimulating) {
      try {
        await tradingAgentService.deactivateAgent({
          token: apiPayload.token,
          stablecoin: apiPayload.stablecoin || 'USDC',
          portfolio_amount: apiPayload.portfolio_amount,
        });
        console.log('Agent deactivated successfully');
      } catch (error) {
        console.error('Error deactivating agent:', error);
        // Continue with stop even if deactivation fails
      }
    }
    
    setIsSimulating(false);
    setAgentStatus('stopped');
    stopPolling();
    setLogs([]);
    setSessionId(null);
    setPollId(null);
    markerManagerRef.current.clearMarkers();
    setErrorMessage(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return (
    <div className="h-full flex flex-col bg-black/40 border-l border-white/10">
      {/* Chart Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">Strategy Simulation</h3>
          <div className="text-xs text-white/40 mt-1">
            {nodes.length} blocks • {edges.length} connections
          </div>
          {errorMessage && (
            <div className="text-xs text-red-400 mt-1">
              Error: {errorMessage}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            disabled={isActivating}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActivating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Activating...
              </>
            ) : isSimulating ? (
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
          <button 
            onClick={handleStop}
            disabled={!isSimulating && agentStatus === 'stopped'}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Stop"
          >
            <Square className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Chart Area - Takes remaining space */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <div id="strategy-chart" ref={chartRef} className="w-full h-full" />
        {/* Note: TradingView widget API doesn't support direct programmatic markers
            Entry/Exit signals are displayed in the AI Logs panel below
            For actual chart markers, would need TradingView's advanced charting library */}
      </div>

      {/* AI Logs Panel */}
      <AiLogsPanel logs={logs} isActive={isSimulating} />

      {/* Simulation Stats */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex-shrink-0">
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-white/40 mb-1">Status</div>
            <div className={`font-bold ${
              agentStatus === 'active' ? 'text-green-400' : 
              agentStatus === 'paused' ? 'text-yellow-400' : 
              'text-gray-400'
            }`}>
              {agentStatus === 'active' ? 'Active' : agentStatus === 'paused' ? 'Paused' : 'Stopped'}
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Updates</div>
            <div className="text-white font-bold">{logs.length}</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Last Price</div>
            <div className="text-white font-bold">
              {logs.length > 0 ? `$${logs[logs.length - 1]?.market_data.price.toFixed(2)}` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-1">Last Signal</div>
            <div className={`font-bold ${
              logs.length > 0 && logs[logs.length - 1]?.recommendation === 'LONG' ? 'text-green-400' :
              logs.length > 0 && logs[logs.length - 1]?.recommendation === 'SHORT' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {logs.length > 0 ? logs[logs.length - 1]?.recommendation : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

