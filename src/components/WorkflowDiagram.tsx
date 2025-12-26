import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Zap,
  Users,
  TrendingDown,
  TrendingUp,
  Settings,
  ArrowRight,
  CheckCircle2,
  X,
  MessageCircle,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Play,
  Wallet,
} from "lucide-react";

// Types for new strategy configuration
interface NewStrategyConfig {
  name: string;
  aiModel: string;
  socialSources: Array<{ type: "twitter" | "reddit" | "telegram"; handle: string }>;
  algorithm: "auto" | "custom";
  customAlgorithm: string;
  stopLoss: string;
  takeProfit: string;
  tokens: string[];
  amount: string;
}

// Legacy config for backward compatibility
interface StrategyConfig {
  name: string;
  type: "AMM_LP" | "TWAP" | "LENDING" | "PENDLE" | "ONEINCH_LOP";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  timeHorizon: "SHORT" | "MEDIUM" | "LONG";
  tokens: string[];
  amount: string;
  slippage: string;
  gasPrice?: string;
  conditions?: string[];
}

interface WorkflowDiagramProps {
  strategy: StrategyConfig | NewStrategyConfig;
  className?: string;
}

// Node component for N8N-style workflow
interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "output";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  x: number;
  y: number;
}

// Helper to get AI model display name
const getAIModelName = (model: string): string => {
  const modelMap: Record<string, string> = {
    "deepseek-chat-v3.1": "DeepSeek Chat V3.1",
    "qwen3-max": "Qwen3 Max",
    "claude-sonnet-4.5": "Claude Sonnet 4.5",
    "grok-4": "Grok 4",
    "gemini-2.5-pro": "Gemini 2.5 Pro",
    "openai-gpt-5.1": "OpenAI GPT-5.1",
  };
  return modelMap[model] || model;
};

// Helper to get social media icon
const getSocialIcon = (type: "twitter" | "reddit" | "telegram") => {
  if (type === "twitter") return <X className="w-4 h-4 text-[#1DA1F2]" />;
  if (type === "reddit") return <MessageCircle className="w-4 h-4 text-[#FF4500]" />;
  return <MessageCircle className="w-4 h-4 text-[#0088cc]" />;
};

// Check if config is new format
const isNewConfig = (config: StrategyConfig | NewStrategyConfig): config is NewStrategyConfig => {
  return 'aiModel' in config;
};

// Node component
const WorkflowNodeComponent: React.FC<{
  node: WorkflowNode;
  delay?: number;
}> = ({ node, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="relative z-10"
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`relative bg-gradient-to-br ${node.color} rounded-2xl p-4 shadow-xl border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-sm min-w-[200px] max-w-[220px]`}
        style={{
          boxShadow: `0 8px 32px ${node.color.includes('purple') ? 'rgba(147, 51, 234, 0.4)' : node.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : node.color.includes('green') ? 'rgba(34, 197, 94, 0.4)' : node.color.includes('red') ? 'rgba(239, 68, 68, 0.4)' : node.color.includes('yellow') ? 'rgba(234, 179, 8, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md flex-shrink-0">
            {node.icon}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="text-sm font-bold text-white mb-1.5 leading-tight">
              {node.title}
            </div>
            {node.subtitle && (
              <div className="text-xs text-white/80 leading-relaxed break-words">
                {node.subtitle}
              </div>
            )}
          </div>
        </div>
        
        {/* Node type badge */}
        <div className={`absolute -top-2 -right-2 text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide border-2 border-white/30 ${
          node.type === "trigger" ? "bg-green-500/30 text-green-200 backdrop-blur-sm" :
          node.type === "action" ? "bg-blue-500/30 text-blue-200 backdrop-blur-sm" :
          node.type === "condition" ? "bg-yellow-500/30 text-yellow-200 backdrop-blur-sm" :
          "bg-purple-500/30 text-purple-200 backdrop-blur-sm"
        }`}>
          {node.type}
        </div>

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${node.color} opacity-20 blur-xl -z-10`} />
      </div>
    </motion.div>
  );
};

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ 
  strategy,
  className = "" 
}) => {
  // Generate horizontal binary workflow
  const workflowLevels = useMemo(() => {
    if (!isNewConfig(strategy)) {
      // Legacy simple structure
      return [
        [
          { id: "start", type: "trigger" as const, title: "Strategy Start", subtitle: strategy.name, icon: <Play className="w-5 h-5 text-white" />, color: "from-green-500 to-emerald-600", x: 0, y: 0 }
        ],
        [
          { id: "execute", type: "action" as const, title: "Execute Strategy", subtitle: `${strategy.type} - ${strategy.tokens.join("/")}`, icon: <Zap className="w-5 h-5 text-white" />, color: "from-purple-500 to-pink-500", x: 0, y: 0 }
        ],
        [
          { id: "end", type: "output" as const, title: "Complete", subtitle: "Strategy execution finished", icon: <CheckCircle2 className="w-5 h-5 text-white" />, color: "from-blue-500 to-blue-600", x: 0, y: 0 }
        ]
      ];
    }

    // Build horizontal binary workflow levels
    const levels: WorkflowNode[][] = [];
    const horizontalSpacing = 280;
    const verticalSpacing = 180;

    // Level 0: Start
    levels.push([{
      id: "start",
      type: "trigger",
      title: "Strategy Start",
      subtitle: strategy.name,
      icon: <Play className="w-5 h-5 text-white" />,
      color: "from-green-500 to-emerald-600",
      x: 0,
      y: 0,
    }]);

    // Level 1: AI Model
    levels.push([{
      id: "ai-model",
      type: "action",
      title: "AI Model",
      subtitle: getAIModelName(strategy.aiModel),
      icon: <Brain className="w-5 h-5 text-white" />,
      color: "from-purple-500 to-purple-600",
      x: horizontalSpacing,
      y: 0,
    }]);

    // Level 2: Data Collection (binary: Social Sources OR Market Data)
    if (strategy.socialSources.length > 0) {
      levels.push([{
        id: "social-sources",
        type: "action",
        title: "Social Media Monitoring",
        subtitle: `${strategy.socialSources.length} source${strategy.socialSources.length > 1 ? 's' : ''}`,
        icon: <Users className="w-5 h-5 text-white" />,
        color: "from-blue-500 to-blue-600",
        x: horizontalSpacing * 2,
        y: 0,
      }]);
    } else {
      levels.push([{
        id: "market-data",
        type: "action",
        title: "Market Data Collection",
        subtitle: "Collecting market data",
        icon: <BarChart3 className="w-5 h-5 text-white" />,
        color: "from-blue-500 to-cyan-500",
        x: horizontalSpacing * 2,
        y: 0,
      }]);
    }

    // Level 3: Analysis
    levels.push([{
      id: "analysis",
      type: "action",
      title: "AI Analysis & Sentiment",
      subtitle: "Processing signals & data",
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      color: "from-purple-500 to-pink-500",
      x: horizontalSpacing * 3,
      y: 0,
    }]);

    // Level 4: Algorithm Selection (binary: Auto OR Custom)
    if (strategy.algorithm === "auto") {
      levels.push([{
        id: "algorithm",
        type: "condition",
        title: "Algorithm Selection",
        subtitle: "AI Auto-Select Best Algorithm",
        icon: <Sparkles className="w-5 h-5 text-white" />,
        color: "from-indigo-500 to-purple-600",
        x: horizontalSpacing * 4,
        y: 0,
      }]);
    } else {
      levels.push([{
        id: "algorithm",
        type: "condition",
        title: "Custom Algorithm",
        subtitle: strategy.customAlgorithm || "User-defined algorithm",
        icon: <Settings className="w-5 h-5 text-white" />,
        color: "from-indigo-500 to-purple-600",
        x: horizontalSpacing * 4,
        y: 0,
      }]);
    }

    // Level 5: Execution
    levels.push([{
      id: "execution",
      type: "action",
      title: "Trade Execution",
      subtitle: `${strategy.tokens.join(" / ")} - Amount: $${strategy.amount}`,
      icon: <Zap className="w-5 h-5 text-white" />,
      color: "from-yellow-500 to-orange-500",
      x: horizontalSpacing * 5,
      y: 0,
    }]);

    // Level 6: Risk Check (binary: Stop Loss OR Take Profit OR Continue)
    levels.push([
      {
        id: "stop-loss",
        type: "condition",
        title: "Stop Loss",
        subtitle: `Loss > ${strategy.stopLoss}%`,
        icon: <TrendingDown className="w-5 h-5 text-white" />,
        color: "from-red-500 to-pink-600",
        x: horizontalSpacing * 6,
        y: -verticalSpacing,
      },
      {
        id: "take-profit",
        type: "condition",
        title: "Take Profit",
        subtitle: `Profit > ${strategy.takeProfit}%`,
        icon: <TrendingUp className="w-5 h-5 text-white" />,
        color: "from-green-500 to-emerald-600",
        x: horizontalSpacing * 6,
        y: 0,
      },
      {
        id: "continue",
        type: "action",
        title: "Continue Trading",
        subtitle: "Within risk range",
        icon: <BarChart3 className="w-5 h-5 text-white" />,
        color: "from-blue-500 to-cyan-500",
        x: horizontalSpacing * 6,
        y: verticalSpacing,
      }
    ]);

    // Level 7: Output (binary branches converge)
    levels.push([
      {
        id: "exit-stop",
        type: "output",
        title: "Exit & Move Funds",
        subtitle: "Stop loss triggered",
        icon: <Wallet className="w-5 h-5 text-white" />,
        color: "from-red-600 to-red-700",
        x: horizontalSpacing * 7,
        y: -verticalSpacing * 0.5,
      },
      {
        id: "exit-profit",
        type: "output",
        title: "Exit & Move Funds",
        subtitle: "Take profit triggered",
        icon: <Wallet className="w-5 h-5 text-white" />,
        color: "from-green-600 to-emerald-700",
        x: horizontalSpacing * 7,
        y: verticalSpacing * 0.5,
      },
      {
        id: "monitor",
        type: "action",
        title: "Monitor Position",
        subtitle: "Ongoing monitoring",
        icon: <BarChart3 className="w-5 h-5 text-white" />,
        color: "from-purple-500 to-indigo-500",
        x: horizontalSpacing * 7,
        y: verticalSpacing * 1.5,
      }
    ]);

    return levels;
  }, [strategy]);

  return (
    <div className={`glass-card-premium p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Strategy Workflow</h3>
          <p className="text-sm text-gray-400">Dynamic binary workflow visualization</p>
        </div>
      </div>

      <div className="relative bg-black/20 rounded-2xl border border-purple-500/30 p-8 overflow-auto" style={{ minHeight: '600px' }}>
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

        {/* Workflow container */}
        <div className="relative" style={{ width: '2400px', height: '600px', position: 'relative', margin: '0 auto' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="rgba(147, 51, 234, 0.6)" />
              </marker>
            </defs>
            
            {/* Draw connections */}
            {workflowLevels.map((level, levelIndex) => {
              if (levelIndex === workflowLevels.length - 1) return null;
              
              const currentLevel = level;
              const nextLevel = workflowLevels[levelIndex + 1];
              
              return currentLevel.map((fromNode, fromIndex) => {
                const fromX = fromNode.x + 110; // center of node (half of max-width)
                const fromY = fromNode.y + 300; // center of container
                
                if (nextLevel.length === 1) {
                  // Linear connection
                  const toNode = nextLevel[0];
                  const toX = toNode.x + 110;
                  const toY = toNode.y + 300;
                  
                  return (
                    <motion.line
                      key={`${fromNode.id}-${toNode.id}`}
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke="rgba(147, 51, 234, 0.6)"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: levelIndex * 0.15 }}
                    />
                  );
                } else {
                  // Binary branching - connect to each branch
                  return nextLevel.map((toNode, toIndex) => {
                    const toX = toNode.x + 110;
                    const toY = toNode.y + 300;
                    const midX = fromX + (toX - fromX) * 0.3; // 30% of the way
                    
                    return (
                      <g key={`${fromNode.id}-${toNode.id}`}>
                        {/* Horizontal from source */}
                        <motion.line
                          x1={fromX}
                          y1={fromY}
                          x2={midX}
                          y2={fromY}
                          stroke="rgba(147, 51, 234, 0.6)"
                          strokeWidth="2"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: levelIndex * 0.15 }}
                        />
                        {/* Vertical branch */}
                        <motion.line
                          x1={midX}
                          y1={fromY}
                          x2={midX}
                          y2={toY}
                          stroke="rgba(147, 51, 234, 0.6)"
                          strokeWidth="2"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: levelIndex * 0.15 + 0.2 }}
                        />
                        {/* Horizontal to target */}
                        <motion.line
                          x1={midX}
                          y1={toY}
                          x2={toX}
                          y2={toY}
                          stroke="rgba(147, 51, 234, 0.6)"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: levelIndex * 0.15 + 0.4 }}
                        />
                      </g>
                    );
                  });
                }
              });
            })}
          </svg>

          {/* Render nodes */}
          {workflowLevels.map((level, levelIndex) =>
            level.map((node, nodeIndex) => (
              <div
                key={node.id}
                className="absolute"
                style={{
                  left: `${node.x}px`,
                  top: '50%',
                  transform: `translate(${0}px, ${node.y}px)`,
                }}
              >
                <WorkflowNodeComponent
                  node={node}
                  delay={levelIndex * 0.1 + nodeIndex * 0.05}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-6 pt-4 border-t border-purple-500/30 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          {isNewConfig(strategy) && (
            <>
              <span>Model: {getAIModelName(strategy.aiModel)}</span>
              <span>Sources: {strategy.socialSources.length}</span>
              <span>Algorithm: {strategy.algorithm === "auto" ? "Auto" : "Custom"}</span>
            </>
          )}
          {!isNewConfig(strategy) && (
            <>
              <span>Strategy: {strategy.name || 'Unnamed'}</span>
              <span>Type: {strategy.type || 'Not Set'}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          <span>Live Workflow</span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
