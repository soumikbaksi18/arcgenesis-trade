const API_BASE_URL = 'http://localhost:8000';

export interface ActivateRequest {
  token: string;
  stablecoin?: string;
  portfolio_amount: number;
  risk_level?: string; // Backend accepts: "moderate", "safe", "aggressive" (lowercase)
  model?: string;
  stop_loss?: string;
  take_profit?: string;
  quant_algo?: string;
}

export interface ActivateResponse {
  status: string;
  message: string;
  session_id: string;
  token: string;
  stablecoin: string;
  portfolio_amount: number;
  risk_level: string;
  model?: string;
  stop_loss?: string;
  take_profit?: string;
  quant_algo?: string;
  activated_at: string;
  polling_endpoint: string;
}

export interface DeactivateRequest {
  token: string;
  stablecoin?: string;
  portfolio_amount: number;
}

export interface DeactivateResponse {
  status: string;
  message: string;
  session_id: string;
  deactivated_at?: string;
}

export interface AnalyzeResponse {
  timestamp: string;
  iteration: number;
  _poll_id: string;
  market_data: {
    price: number;
    price_id: string;
    change_24h?: number;
  };
  recommendation: 'LONG' | 'SHORT' | 'HOLD' | 'EXIT';
  confidence: number;
  sentiment_data: {
    overall_sentiment: number;
    risk_level: string;
  };
  ai_analysis?: {
    reasoning?: string;
    signals?: string[];
  };
  position_status?: 'ENTRY' | 'EXIT' | 'HOLD';
  stop_loss_triggered?: boolean;
  take_profit_triggered?: boolean;
  agent_status?: 'active' | 'stopped' | 'paused';
}

export const tradingAgentService = {
  async activateAgent(payload: ActivateRequest): Promise<ActivateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to activate agent: ${response.status} ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch {
          // If not JSON, use the text directly
          errorMessage = errorText || errorMessage;
        }
        
        console.error('Activate API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          payload: payload,
        });
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors (Failed to fetch)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Failed to connect to backend. Please ensure the Sentenex server is running on http://localhost:8000');
      }
      throw error;
    }
  },

  async deactivateAgent(payload: DeactivateRequest): Promise<DeactivateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/deactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: payload.token,
          stablecoin: payload.stablecoin || 'USDC',
          portfolio_amount: payload.portfolio_amount,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to deactivate agent: ${response.status} ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        console.error('Deactivate API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Failed to connect to backend. Please ensure the Sentenex server is running on http://localhost:8000');
      }
      throw error;
    }
  },

  async analyze(
    request: {
      token: string;
      stablecoin: string;
      portfolio_amount: number;
      risk_level?: string;
      model?: string;
      stop_loss?: string;
      take_profit?: string;
      quant_algo?: string;
    },
    pollId?: string
  ): Promise<AnalyzeResponse> {
    const url = pollId 
      ? `${API_BASE_URL}/api/analyze?poll_id=${pollId}`
      : `${API_BASE_URL}/api/analyze`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: request.token,
        stablecoin: request.stablecoin || 'USDC',
        portfolio_amount: request.portfolio_amount,
        risk_level: request.risk_level || 'moderate',
        model: request.model,
        stop_loss: request.stop_loss,
        take_profit: request.take_profit,
        quant_algo: request.quant_algo,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Analyze API error:', errorText);
      throw new Error(`Failed to get analysis: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },
};

