import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useStrategyStore } from '../../stores/strategyStore';
import { blockDefinitions, BlockDefinition } from './BlockPalette';
import OpenAI from 'openai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI strategy assistant. Tell me what trading strategy you want to build, and I'll create the blocks for you. For example: 'Create a strategy that buys ETH when the price crosses above the 20-period SMA'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { nodes, edges, setNodes, setEdges } = useStrategyStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseLLMResponse = (response: string): BlockDefinition[] => {
    // Try to parse JSON from the response
    try {
      // Look for JSON array in the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const blocks = JSON.parse(jsonMatch[0]);
        return blocks.map((block: any) => {
          // Find matching block definition
          const blockDef = blockDefinitions.find(b => b.type === block.type);
          if (blockDef) {
            return {
              ...blockDef,
              params: { ...blockDef.params, ...block.params },
            };
          }
          return blockDef;
        }).filter(Boolean);
      }
    } catch (e) {
      console.error('Failed to parse JSON from LLM response:', e);
    }

    // Fallback: Try to extract block types from text
    const extractedBlocks: BlockDefinition[] = [];
    const lowerResponse = response.toLowerCase();

    // Common patterns
    if (lowerResponse.includes('candle close') || lowerResponse.includes('candle closes')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'OnCandleClose')!);
    }
    if (lowerResponse.includes('price') && !lowerResponse.includes('sma') && !lowerResponse.includes('ema')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'Price')!);
    }
    if (lowerResponse.includes('sma') || lowerResponse.includes('moving average')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'SMA')!);
    }
    if (lowerResponse.includes('ema')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'EMA')!);
    }
    if (lowerResponse.includes('rsi')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'RSI')!);
    }
    if (lowerResponse.includes('crosses above') || lowerResponse.includes('cross above')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'CrossesAbove')!);
    }
    if (lowerResponse.includes('crosses below') || lowerResponse.includes('cross below')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'CrossesBelow')!);
    }
    if (lowerResponse.includes('greater than') || lowerResponse.includes('>')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'GreaterThan')!);
    }
    if (lowerResponse.includes('less than') || lowerResponse.includes('<')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'LessThan')!);
    }
    if (lowerResponse.includes('buy') && !lowerResponse.includes('sell')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'Buy')!);
    }
    if (lowerResponse.includes('sell') && !lowerResponse.includes('buy')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'Sell')!);
    }
    if (lowerResponse.includes('stop loss') || lowerResponse.includes('stop-loss')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'StopLoss')!);
    }
    if (lowerResponse.includes('take profit') || lowerResponse.includes('take-profit')) {
      extractedBlocks.push(blockDefinitions.find(b => b.type === 'TakeProfit')!);
    }

    return extractedBlocks.filter(Boolean);
  };

  const createNodesFromBlocks = (blocks: BlockDefinition[]) => {
    if (blocks.length === 0) return;

    const newNodes: any[] = [];
    const newEdges: any[] = [];
    const startX = 250;
    const startY = 100;
    const spacingX = 300;
    const spacingY = 200;

    blocks.forEach((block, index) => {
      const nodeId = `${block.type}-${Date.now()}-${index}`;
      const x = startX + (index % 3) * spacingX;
      const y = startY + Math.floor(index / 3) * spacingY;

      const newNode = {
        id: nodeId,
        type: 'custom',
        position: { x, y },
        data: {
          label: block.label,
          type: block.type,
          inputs: block.inputs || [],
          outputs: block.outputs || [],
          params: block.params || {},
        },
      };

      newNodes.push(newNode);

      // Create edges between sequential blocks
      if (index > 0) {
        const prevNode = newNodes[index - 1];
        if (prevNode.data.outputs.length > 0 && newNode.data.inputs.length > 0) {
          newEdges.push({
            id: `${prevNode.id}-${newNode.id}`,
            source: prevNode.id,
            target: newNode.id,
            sourceHandle: 'output-0',
            targetHandle: 'input-0',
          });
        }
      }
    });

    setNodes([...nodes, ...newNodes]);
    setEdges([...edges, ...newEdges]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize OpenAI client (you'll need to set OPENAI_API_KEY in your .env)
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        // Fallback: Use simple pattern matching if no API key
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'll create blocks based on your request. Note: OpenAI API key not configured. Using pattern matching.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
        const blocks = parseLLMResponse(input);
        if (blocks.length > 0) {
          createNodesFromBlocks(blocks);
          const successMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `Created ${blocks.length} block(s) on the canvas!`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, successMessage]);
        } else {
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: "I couldn't identify specific blocks from your request. Try being more specific, like 'Create a strategy with On Candle Close trigger, Price block, SMA indicator, and Buy action'.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
        setIsLoading(false);
        return;
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const systemPrompt = `You are an AI assistant that helps users build trading strategies using a visual node-based system.

Available block types:
- Triggers: OnCandleClose, OnPriceUpdate
- Market Data: Price, Volume
- Indicators: SMA, EMA, RSI, MACD
- Conditions: GreaterThan, LessThan, CrossesAbove, CrossesBelow
- Actions: Buy, Sell
- Risk Management: StopLoss, TakeProfit, MaxPositionSize
- Utility: Cooldown

When a user describes a trading strategy, respond with a JSON array of blocks that should be created. Each block should have:
- type: the block type (e.g., "OnCandleClose", "SMA", "Buy")
- params: any parameters (e.g., { period: 20 } for SMA, { timeframe: "15m" } for OnCandleClose)

Example response format:
[
  { "type": "OnCandleClose", "params": { "timeframe": "15m" } },
  { "type": "Price", "params": { "priceType": "close" } },
  { "type": "SMA", "params": { "period": 20 } },
  { "type": "CrossesAbove", "params": {} },
  { "type": "Buy", "params": { "amountType": "percent", "amount": 10 } }
]

Only return the JSON array, no additional text.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
        temperature: 0.7,
      });

      const responseContent = completion.choices[0]?.message?.content || '';
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Parse and create blocks
      const blocks = parseLLMResponse(responseContent);
      if (blocks.length > 0) {
        createNodesFromBlocks(blocks);
        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `✅ Created ${blocks.length} block(s) on the canvas!`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "I couldn't parse blocks from the response. Please try rephrasing your request.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error: any) {
      console.error('Error calling OpenAI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to process request'}. Make sure VITE_OPENAI_API_KEY is set in your .env file.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">AI Strategy Assistant</h3>
          <div className="text-xs text-white/40">Describe your strategy and I'll build it</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500/20 text-white border border-blue-500/30'
                  : 'bg-white/5 text-white/90 border border-white/10'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div className="text-[10px] text-white/30 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white/60" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 text-white/90 border border-white/10 rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-white/60" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your trading strategy..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="text-[10px] text-white/30 mt-2">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

