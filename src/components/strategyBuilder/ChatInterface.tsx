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
  const { nodes, edges, setNodes, setEdges, addNode } = useStrategyStore();

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
      // Simple pattern matching fallback
      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes('sma') || lowerPrompt.includes('moving average')) {
        return 'I\'ll create a Simple Moving Average (SMA) indicator for you. This will calculate the average price over a specified period.';
      }
      if (lowerPrompt.includes('buy') || lowerPrompt.includes('purchase')) {
        return 'I\'ll add a Buy action block. This will execute a buy order when the condition is met.';
      }
      return 'I understand you want to build a trading strategy. Please describe the specific indicators, conditions, and actions you\'d like to use.';
    }

    // TODO: Implement actual OpenAI API call
    return 'AI response would go here';
  };

  const parseBlocksFromText = (text: string) => {
    // Simple pattern matching to identify block types
    const lowerText = text.toLowerCase();
    const blocksToAdd: BlockDefinition[] = [];

    // Match block types from blockDefinitions
    blockDefinitions.forEach((block) => {
      const blockLabel = block.label.toLowerCase();
      if (lowerText.includes(blockLabel.toLowerCase()) || lowerText.includes(block.type.toLowerCase())) {
        blocksToAdd.push(block);
      }
    });

    // Add blocks to canvas
    blocksToAdd.forEach((block, index) => {
      const newNode = {
        id: `${block.type}-${Date.now()}-${index}`,
        type: 'custom',
        position: {
          x: 250 + (index % 3) * 300,
          y: 100 + Math.floor(index / 3) * 150,
        },
        data: {
          label: block.label,
          type: block.type,
          inputs: block.inputs,
          outputs: block.outputs,
          params: block.params || {},
        },
      };
      addNode(newNode);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
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
