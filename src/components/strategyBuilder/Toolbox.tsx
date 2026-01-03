import React, { useState } from 'react';
import {
  LayoutGrid,
  Sparkles,
  BarChart3,
  Play,
  TrendingUp,
} from 'lucide-react';

interface ToolboxProps {
  onSelectTool: (tool: string) => void;
  activeTool: string | null;
  hasBlocks: boolean;
}

interface ToolItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  subTools?: { id: string; label: string }[];
}

export const Toolbox: React.FC<ToolboxProps> = ({ onSelectTool, activeTool, hasBlocks }) => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const tools: ToolItem[] = [
    {
      id: 'blocks',
      icon: <LayoutGrid className="w-5 h-5" />,
      label: 'Strategy Blocks',
    },
    {
      id: 'ai',
      icon: <Sparkles className="w-5 h-5" />,
      label: 'AI Block Maker',
    },
    {
      id: 'chart',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Market Chart',
    },
    {
      id: 'simulate',
      icon: <Play className="w-5 h-5" />,
      label: 'Run Simulation',
      disabled: !hasBlocks,
    },
    {
      id: 'backtest',
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Backtest',
      disabled: !hasBlocks,
    },
  ];

  const handleToolClick = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool?.disabled) return;
    
    // Always select the tool
    onSelectTool(toolId);
    setExpandedTool(null);
  };

  const handleSubToolClick = (subToolId: string) => {
    onSelectTool(subToolId);
    setExpandedTool(null);
  };

  return (
    <div className="w-14 bg-black/60 backdrop-blur-xl border-l border-white/10 flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id || (tool.subTools && tool.subTools.some(st => activeTool === st.id));
        const isExpanded = expandedTool === tool.id;
        const isHovered = hoveredTool === tool.id;

        return (
          <div key={tool.id} className="relative w-full">
            {/* Tool Button */}
            <button
              onClick={() => handleToolClick(tool.id)}
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              disabled={tool.disabled}
              className={`
                w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-all relative
                ${tool.disabled 
                  ? 'opacity-30 cursor-not-allowed' 
                  : isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                }
              `}
              title={tool.label}
            >
              {/* Tool Icon */}
              {tool.icon}
            </button>

            {/* Tooltip */}
            {isHovered && !tool.disabled && (
              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <div className="text-xs font-semibold text-white">{tool.label}</div>
                  {tool.subTools && (
                    <div className="text-[10px] text-white/60 mt-1">
                      {tool.subTools.length} categories
                    </div>
                  )}
                </div>
                {/* Arrow */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-white/20" />
              </div>
            )}

            {/* Sub-tools Expansion */}
            {isExpanded && tool.subTools && (
              <div className="absolute right-full mr-2 top-0 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl py-2 z-40 min-w-[180px]">
                {tool.subTools.map((subTool) => (
                  <button
                    key={subTool.id}
                    onClick={() => handleSubToolClick(subTool.id)}
                    className={`
                      w-full text-left px-4 py-2 text-xs transition-colors
                      ${activeTool === subTool.id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {subTool.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

