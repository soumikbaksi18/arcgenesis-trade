import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useStrategyStore } from '../../stores/strategyStore';
import { BlockDefinition, blockDefinitions } from './BlockPalette';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI trading assistant. Describe the strategy you want to build, and I\'ll help you create the blocks and connections.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { edges, setEdges, addNode } = useStrategyStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual OpenAI API call
      const response = await processAiResponse(input);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Parse and add blocks from AI response
      parseBlocksFromText(response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processAiResponse = async (prompt: string): Promise<string> => {
    // Fallback pattern matcher if OpenAI API key is not set
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Enhanced pattern matching for common strategy requests
      const lowerPrompt = prompt.toLowerCase();
      
      // Extract token from prompt (ETH, BTC, etc.)
      const tokenMatch = lowerPrompt.match(/\b(eth|btc|apt|sol|usdc|usdt)\b/i);
      const token = tokenMatch ? tokenMatch[1].toUpperCase() : 'ETH';
      
      // Detect strategy type
      if (lowerPrompt.includes('trend following') || lowerPrompt.includes('trend')) {
        return `I'll create a trend following strategy for ${token}. This will use moving averages to detect trends and execute trades.`;
      }
      if (lowerPrompt.includes('rsi') || lowerPrompt.includes('relative strength')) {
        return `I'll create an RSI-based strategy for ${token}. This will use the Relative Strength Index to identify overbought/oversold conditions.`;
      }
      if (lowerPrompt.includes('sma') || lowerPrompt.includes('simple moving average')) {
        return `I'll create an SMA-based strategy for ${token}. This will use Simple Moving Average to identify trends.`;
      }
      if (lowerPrompt.includes('ema') || lowerPrompt.includes('exponential moving average')) {
        return `I'll create an EMA-based strategy for ${token}. This will use Exponential Moving Average for trend detection.`;
      }
      if (lowerPrompt.includes('macd')) {
        return `I'll create a MACD-based strategy for ${token}. This will use Moving Average Convergence Divergence for signals.`;
      }
      if (lowerPrompt.includes('mean reversion')) {
        return `I'll create a mean reversion strategy for ${token}. This will trade price deviations from the mean.`;
      }
      
      // Generic response
      return `I'll help you build a trading strategy for ${token}. Let me create the basic workflow.`;
    }

    // TODO: Implement actual OpenAI API call
    return 'AI response would go here';
  };

  const parseBlocksFromText = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    const nodesToAdd: Array<{ block: BlockDefinition; position: { x: number; y: number }; params?: any }> = [];
    
    // Extract token
    const tokenMatch = lowerPrompt.match(/\b(eth|btc|apt|sol|usdc|usdt)\b/i);
    const token = tokenMatch ? tokenMatch[1].toUpperCase() : 'ETH';
    
    let xPos = 250;
    let yPos = 100;
    const xSpacing = 300;
    
    // Always start with a trigger
    const triggerBlock = blockDefinitions.find(b => b.type === 'OnCandleClose');
    if (triggerBlock) {
      nodesToAdd.push({
        block: triggerBlock,
        position: { x: xPos, y: yPos },
        params: { timeframe: '15m' }
      });
      xPos += xSpacing;
    }
    
    // Add Price node
    const priceBlock = blockDefinitions.find(b => b.type === 'Price');
    if (priceBlock) {
      nodesToAdd.push({
        block: priceBlock,
        position: { x: xPos, y: yPos },
        params: { priceType: 'close' }
      });
      xPos += xSpacing;
    }
    
    // Detect strategy type and add appropriate blocks
    if (lowerPrompt.includes('trend following') || lowerPrompt.includes('trend')) {
      // Add Trend Following algorithm
      const trendBlock = blockDefinitions.find(b => b.type === 'TrendFollowing');
      if (trendBlock) {
        nodesToAdd.push({
          block: trendBlock,
          position: { x: xPos, y: yPos },
          params: { period: 20, strength: 1.5 }
        });
        xPos += xSpacing;
      }
      
      // Add SMA for trend detection
      const smaBlock = blockDefinitions.find(b => b.type === 'SMA');
      if (smaBlock) {
        nodesToAdd.push({
          block: smaBlock,
          position: { x: xPos, y: yPos - 100 },
          params: { period: 20 }
        });
      }
      
      // Add Crosses Above condition
      const crossesBlock = blockDefinitions.find(b => b.type === 'CrossesAbove');
      if (crossesBlock) {
        nodesToAdd.push({
          block: crossesBlock,
          position: { x: xPos + xSpacing, y: yPos },
        });
        xPos += xSpacing;
      }
      
      // Add Buy action
      const buyBlock = blockDefinitions.find(b => b.type === 'Buy');
      if (buyBlock) {
        nodesToAdd.push({
          block: buyBlock,
          position: { x: xPos + xSpacing, y: yPos },
          params: { amountType: 'percent', amount: 10 }
        });
      }
    } else if (lowerPrompt.includes('rsi')) {
      const rsiBlock = blockDefinitions.find(b => b.type === 'RSI');
      if (rsiBlock) {
        nodesToAdd.push({
          block: rsiBlock,
          position: { x: xPos, y: yPos },
          params: { period: 14 }
        });
        xPos += xSpacing;
      }
      
      // Add Less Than condition (RSI < 30 = oversold = buy)
      const lessThanBlock = blockDefinitions.find(b => b.type === 'LessThan');
      if (lessThanBlock) {
        nodesToAdd.push({
          block: lessThanBlock,
          position: { x: xPos, y: yPos },
        });
        xPos += xSpacing;
      }
      
      const buyBlock = blockDefinitions.find(b => b.type === 'Buy');
      if (buyBlock) {
        nodesToAdd.push({
          block: buyBlock,
          position: { x: xPos, y: yPos },
          params: { amountType: 'percent', amount: 10 }
        });
      }
    } else if (lowerPrompt.includes('sma')) {
      const smaBlock = blockDefinitions.find(b => b.type === 'SMA');
      if (smaBlock) {
        nodesToAdd.push({
          block: smaBlock,
          position: { x: xPos, y: yPos },
          params: { period: 20 }
        });
        xPos += xSpacing;
      }
      
      const greaterBlock = blockDefinitions.find(b => b.type === 'GreaterThan');
      if (greaterBlock) {
        nodesToAdd.push({
          block: greaterBlock,
          position: { x: xPos, y: yPos },
        });
        xPos += xSpacing;
      }
      
      const buyBlock = blockDefinitions.find(b => b.type === 'Buy');
      if (buyBlock) {
        nodesToAdd.push({
          block: buyBlock,
          position: { x: xPos, y: yPos },
          params: { amountType: 'percent', amount: 10 }
        });
      }
    } else {
      // Default: Simple SMA strategy
      const smaBlock = blockDefinitions.find(b => b.type === 'SMA');
      if (smaBlock) {
        nodesToAdd.push({
          block: smaBlock,
          position: { x: xPos, y: yPos },
          params: { period: 20 }
        });
        xPos += xSpacing;
      }
      
      const greaterBlock = blockDefinitions.find(b => b.type === 'GreaterThan');
      if (greaterBlock) {
        nodesToAdd.push({
          block: greaterBlock,
          position: { x: xPos, y: yPos },
        });
        xPos += xSpacing;
      }
      
      const buyBlock = blockDefinitions.find(b => b.type === 'Buy');
      if (buyBlock) {
        nodesToAdd.push({
          block: buyBlock,
          position: { x: xPos, y: yPos },
          params: { amountType: 'percent', amount: 10 }
        });
      }
    }
    
    // Add Investment blocks (Pool, Payment, Risk)
    const poolBlock = blockDefinitions.find(b => b.type === 'Pool');
    if (poolBlock) {
      nodesToAdd.push({
        block: poolBlock,
        position: { x: 250, y: yPos + 200 },
        params: { pool: `${token}/USD` }
      });
    }
    
    const paymentBlock = blockDefinitions.find(b => b.type === 'Payment');
    if (paymentBlock) {
      nodesToAdd.push({
        block: paymentBlock,
        position: { x: 550, y: yPos + 200 },
        params: { stablecoin: 'USDC', amount: 1000 }
      });
    }
    
    const riskBlock = blockDefinitions.find(b => b.type === 'InvestmentRisk');
    if (riskBlock) {
      nodesToAdd.push({
        block: riskBlock,
        position: { x: 850, y: yPos + 200 },
        params: { riskLevel: 'medium' }
      });
    }
    
    // Add nodes to canvas and track their IDs
    const timestamp = Date.now();
    const nodeIdMap: { [type: string]: string } = {};
    
    nodesToAdd.forEach((item, index) => {
      const nodeId = `${item.block.type}-${timestamp}-${index}`;
      nodeIdMap[item.block.type] = nodeId;
      
      const newNode = {
        id: nodeId,
        type: 'custom',
        position: item.position,
        data: {
          label: item.block.label,
          type: item.block.type,
          inputs: item.block.inputs,
          outputs: item.block.outputs,
          params: item.params || item.block.params || {},
        },
      };
      addNode(newNode);
    });
    
    // Create edges between nodes (basic connections)
    setTimeout(() => {
      const newEdges: any[] = [];
      
      // Connect trigger to price
      if (nodeIdMap['OnCandleClose'] && nodeIdMap['Price']) {
        newEdges.push({
          id: `edge-${nodeIdMap['OnCandleClose']}-${nodeIdMap['Price']}`,
          source: nodeIdMap['OnCandleClose'],
          sourceHandle: 'output-0',
          target: nodeIdMap['Price'],
          targetHandle: 'input-0',
        });
      }
      
      // Connect price to indicator
      const indicatorTypes = ['SMA', 'EMA', 'RSI', 'MACD', 'TrendFollowing'];
      const indicatorType = indicatorTypes.find(t => nodeIdMap[t]);
      if (nodeIdMap['Price'] && indicatorType) {
        newEdges.push({
          id: `edge-${nodeIdMap['Price']}-${nodeIdMap[indicatorType]}`,
          source: nodeIdMap['Price'],
          sourceHandle: 'output-0',
          target: nodeIdMap[indicatorType],
          targetHandle: 'input-0',
        });
      }
      
      // Connect indicator to condition
      const conditionTypes = ['GreaterThan', 'LessThan', 'CrossesAbove', 'CrossesBelow'];
      const conditionType = conditionTypes.find(t => nodeIdMap[t]);
      if (indicatorType && conditionType) {
        newEdges.push({
          id: `edge-${nodeIdMap[indicatorType]}-${nodeIdMap[conditionType]}`,
          source: nodeIdMap[indicatorType],
          sourceHandle: 'output-0',
          target: nodeIdMap[conditionType],
          targetHandle: 'input-0',
        });
      }
      
      // Connect condition to action
      const actionTypes = ['Buy', 'Sell'];
      const actionType = actionTypes.find(t => nodeIdMap[t]);
      if (conditionType && actionType) {
        newEdges.push({
          id: `edge-${nodeIdMap[conditionType]}-${nodeIdMap[actionType]}`,
          source: nodeIdMap[conditionType],
          sourceHandle: 'output-0',
          target: nodeIdMap[actionType],
          targetHandle: 'input-0',
        });
      }
      
      if (newEdges.length > 0) {
        setEdges([...edges, ...newEdges]);
      }
    }, 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/60">
      {/* Chat Header */}
      <div className="flex-shrink-0 border-b border-white/10 p-4">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">AI Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500/20 text-white'
                  : 'bg-white/5 text-white/90'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-green-400" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-white/5 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your strategy..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
