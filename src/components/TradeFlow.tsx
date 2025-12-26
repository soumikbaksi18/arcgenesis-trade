import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Filter,
  Layers,
  LineChart,
  Link2,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Zap,
  Code,
  GitBranch,
  TrendingUp,
  TrendingDown,
  X,
  Trash2,
} from "lucide-react";
import WorkflowDiagram from "./WorkflowDiagram";
import SimulationModal from "./SimulationModal";
import BacktestModal from "./BacktestModal";

// --- Minimal in-file UI primitives (shadcn-like) ---
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children }) => (
  <div className={`glass-card ${className}`}>{children}</div>
);
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => <div className={`flex items-center justify-between ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <h3 className={`text-lg font-semibold ${className || ''}`}>{children}</h3>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "outline" }> = ({ className = "", variant = "solid", children, ...props }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50";
  const map: Record<string, string> = {
    solid: "btn-primary",
    ghost: "hover:bg-purple-500/10 text-white hover:text-purple-300",
    outline: "btn-secondary",
  };
  return (
    <button className={`${base} ${map[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input className={`w-full rounded-xl border border-purple-500/30 bg-black/50 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder-gray-400 ${className}`} {...props} />
);
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = "", children, ...props }) => (
  <select className={`w-full rounded-xl border border-purple-500/30 bg-black/50 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 ${className}`} {...props}>
    {children}
  </select>
);
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-700"}`}>
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

// --- Types ---
type Chain = "Ethereum" | "Polygon" | "Arbitrum" | "Base";

type MCPBlock =
  | { kind: "AMM_LP"; protocol: string; pair: string; feeTierBps?: number; range?: { lower: number; upper: number } }
  | { kind: "TWAP"; windowSecs: number; maxSlippageBps: number }
  | { kind: "LIMIT_ORDER"; hook: "RANGE" | "DUTCH" | "OPTIONS"; params: Record<string, any> }
  | { kind: "LENDING"; protocol: string; asset: string; targetLTV: number }
  | { kind: "YIELD_TOKENIZE"; protocol: "Pendle"; asset: string; tenorDays: number };

type Strategy = {
  id: string;
  name: string;
  chain: Chain;
  risk: "Conservative" | "Balanced" | "Aggressive";
  blocks: MCPBlock[];
  owner: string; // strategist address
  followers: number;
  tvlUSD: number;
  aprPct: number;
  drawdownPct: number;
  status: "Live" | "Paused" | "Draft";
};

type OrderSignal = { ts: string; action: "OPEN" | "REBALANCE" | "CLOSE"; details: string };

// --- Mock data ---
const MOCK_STRATEGIES: Strategy[] = [
  {
    id: "strat-eth-pendle-lop",
    name: "ETH Range LP + Pendle YT + 1inch LOP",
    chain: "Arbitrum",
    risk: "Balanced",
    blocks: [
      { kind: "AMM_LP", protocol: "UniswapV3", pair: "ETH/USDC", feeTierBps: 500, range: { lower: 2200, upper: 3200 } },
      { kind: "LIMIT_ORDER", hook: "RANGE", params: { grid: [[2300, 5], [2600, 5], [3000, 10]] } },
      { kind: "YIELD_TOKENIZE", protocol: "Pendle", asset: "stETH", tenorDays: 90 },
    ],
    owner: "0xAbc…42f",
    followers: 1287,
    tvlUSD: 983452.23,
    aprPct: 17.6,
    drawdownPct: 7.4,
    status: "Live",
  },
  {
    id: "strat-btc-twap",
    name: "BTC TWAP Accumulator + Hedge",
    chain: "Base",
    risk: "Conservative",
    blocks: [
      { kind: "TWAP", windowSecs: 1800, maxSlippageBps: 35 },
      { kind: "LIMIT_ORDER", hook: "DUTCH", params: { start: 1.02, end: 0.98, duration: 3600 } },
    ],
    owner: "0xDeF…9c7",
    followers: 342,
    tvlUSD: 254321.11,
    aprPct: 9.4,
    drawdownPct: 3.1,
    status: "Paused",
  },
];

const MOCK_SIGNALS: Record<string, OrderSignal[]> = {
  "strat-eth-pendle-lop": [
    { ts: new Date().toISOString(), action: "REBALANCE", details: "Shift LP range to 2350–3150; place RANGE LOP asks at 2600/3000" },
    { ts: new Date(Date.now() - 3_600_000).toISOString(), action: "OPEN", details: "Open LP at 2200–3200; mint YT on Pendle stETH 90D" },
  ],
  "strat-btc-twap": [
    { ts: new Date(Date.now() - 2_700_000).toISOString(), action: "REBALANCE", details: "TWAP chunk 1/6 filled; adjust next tranche slippage to 30bps" },
  ],
};

const fmtUSD = (v: number) => v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; hint?: string }> = ({ icon, label, value, hint }) => (
  <div className="glass-card-premium p-5 neon-glow">
    <div className="flex items-center gap-3 text-gray-300">{icon}<div className="text-sm">{label}</div></div>
    <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
  </div>
);

// Social Media Icon Component
const SocialIcon: React.FC<{ type: "twitter" | "reddit" | "telegram"; className?: string }> = ({ type, className = "h-5 w-5" }) => {
  if (type === "twitter") {
    return <X className={`${className} text-[#1DA1F2]`} />;
  }
  if (type === "reddit") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: "#FF4500" }}>
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    );
  }
  if (type === "telegram") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: "#0088cc" }}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    );
  }
  return null;
};

// ===================== TradeFlow (for strategists/pros) =====================
export default function TradeFlow() {
  const [q, setQ] = useState("");
  const [onlyLive, setOnlyLive] = useState(true);
  const [risk, setRisk] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"workflow" | "json">("workflow");
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  
  // Strategy configuration state
  const [strategyConfig, setStrategyConfig] = useState({
    name: "My AI Trading Strategy",
    aiModel: "claude-sonnet-4.5" as string,
    socialSources: [] as Array<{ type: "twitter" | "reddit" | "telegram"; handle: string }>,
    algorithm: "auto" as "auto" | "custom",
    customAlgorithm: "",
    stopLoss: "5",
    takeProfit: "15",
    tokens: ["ETH", "USDC"],
    amount: "1000",
  });
  const strategies = useMemo(() => MOCK_STRATEGIES.filter((s) => (!onlyLive || s.status === "Live") && (risk === "All" || s.risk === risk) && s.name.toLowerCase().includes(q.toLowerCase())), [q, onlyLive, risk]);
  const totalTVL = strategies.reduce((a, b) => a + b.tvlUSD, 0);
  const avgAPR = strategies.length ? strategies.reduce((a, b) => a + b.aprPct, 0) / strategies.length : 0;

  // Helper function to transform new config to legacy format for compatibility
  const transformToLegacyConfig = (config: typeof strategyConfig) => ({
    name: config.name,
    type: "AMM_LP" as "AMM_LP" | "TWAP" | "LENDING" | "PENDLE" | "ONEINCH_LOP",
    riskLevel: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    timeHorizon: "MEDIUM" as "SHORT" | "MEDIUM" | "LONG",
    tokens: config.tokens,
    amount: config.amount,
    slippage: "0.5",
    gasPrice: "20",
    conditions: config.socialSources.map(s => `${s.type}: ${s.handle}`),
  });

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Stat icon={<DollarSign className="h-5 w-5 text-purple-400" />} label="Total TVL (visible)" value={fmtUSD(totalTVL)} hint="Across filtered strategies" />
        <Stat icon={<BarChart3 className="h-5 w-5 text-pink-400" />} label="Avg. APR" value={`${avgAPR.toFixed(1)}%`} hint="Last 30 days (simulated)" />
        <Stat icon={<Users className="h-5 w-5 text-purple-400" />} label="Total Followers" value={strategies.reduce((a, b) => a + b.followers, 0).toLocaleString()} />
        <Stat icon={<ShieldCheck className="h-5 w-5 text-pink-400" />} label="Risk Controls" value="Auto‑hedge ON" hint="Global setting" />
      </div>

      <Card className="p-5 md:p-6">
        <CardHeader>
          <div className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-purple-400" /><CardTitle className="text-white">Filters</CardTitle></div>
          <div className="flex items-center gap-3"><span className="text-sm text-gray-300">Live only</span><Toggle checked={onlyLive} onChange={setOnlyLive} /></div>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input placeholder="Search strategies, pairs, owners…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option>All</option><option>Conservative</option><option>Balanced</option><option>Aggressive</option>
          </Select>
          <div className="flex gap-2"><Button variant="ghost"><Filter className="h-4 w-4" /> Advanced</Button><Button variant="ghost"><RefreshCw className="h-4 w-4" /> Sync</Button></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {strategies.map((s) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="glass-card-premium p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white neon-glow flex-shrink-0"><Brain className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-white leading-tight">{s.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${s.status === "Live" ? "bg-green-500/20 text-green-400 border border-green-500/30" : s.status === "Paused" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>{s.status}</span>
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">{s.chain} · {s.risk} · Owner {s.owner}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button variant="outline" className="w-full whitespace-nowrap"><Play className="h-4 w-4" /> Simulate</Button>
                  <Button variant="solid" className="w-full whitespace-nowrap"><Rocket className="h-4 w-4" /> Deploy</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">TVL</div>
                  <div className="text-base md:text-lg font-semibold text-white">{fmtUSD(s.tvlUSD)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">APR</div>
                  <div className={`text-base md:text-lg font-semibold ${s.aprPct >= 0 ? "text-green-400" : "text-red-400"}`}>{s.aprPct.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Max DD</div>
                  <div className="text-base md:text-lg font-semibold text-white">{s.drawdownPct.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Followers</div>
                  <div className="text-base md:text-lg font-semibold text-white">{s.followers.toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase text-gray-400 mb-3 font-medium tracking-wide">MCP Blocks</div>
                <div className="flex flex-wrap gap-2.5">
                  {s.blocks.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-2 text-xs border border-purple-500/30 bg-black/30 rounded-xl px-3 py-2.5 text-white">
                      {b.kind === "AMM_LP" && <Layers className="h-4 w-4 text-purple-400 flex-shrink-0" />}
                      {b.kind === "TWAP" && <LineChart className="h-4 w-4 text-pink-400 flex-shrink-0" />}
                      {b.kind === "LIMIT_ORDER" && <Link2 className="h-4 w-4 text-purple-400 flex-shrink-0" />}
                      {b.kind === "LENDING" && <DollarSign className="h-4 w-4 text-pink-400 flex-shrink-0" />}
                      {b.kind === "YIELD_TOKENIZE" && <Zap className="h-4 w-4 text-purple-400 flex-shrink-0" />}
                      <span className="font-medium">{b.kind}</span>
                      <ChevronRight className="h-3 w-3 opacity-60 flex-shrink-0" />
                      <code className="text-[11px] opacity-80 break-all">
                        {b.kind === "AMM_LP" && `${b.protocol}:${(b as any).pair}`}
                        {b.kind === "TWAP" && `win=${(b as any).windowSecs}s · sl=${(b as any).maxSlippageBps}bps`}
                        {b.kind === "LIMIT_ORDER" && `${(b as any).hook} hook`}
                        {b.kind === "LENDING" && `${(b as any).protocol}:${(b as any).asset}@${(b as any).targetLTV}%`}
                        {b.kind === "YIELD_TOKENIZE" && `${(b as any).protocol}:${(b as any).asset}·${(b as any).tenorDays}D`}
                      </code>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="p-4 md:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium mb-4 text-white">
                    <Activity className="h-4 w-4 text-purple-400" /> 
                    <span>Recent Signals</span>
                  </div>
                  <ul className="space-y-4">
                    {(MOCK_SIGNALS[s.id] || []).map((sig, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0"><CheckCircle2 className="h-4 w-4 text-green-400" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-400 mb-1.5">{new Date(sig.ts).toLocaleString()}</div>
                          <div className="text-sm font-semibold text-white mb-1.5">{sig.action}</div>
                          <div className="text-sm text-gray-300 leading-relaxed break-words">{sig.details}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-4 md:p-5">
                  <div className="flex items-center gap-2 text-sm font-medium mb-4 text-white">
                    <Settings className="h-4 w-4 text-pink-400" /> 
                    <span>Risk Controls</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1.5 text-xs">Max Slippage</div>
                      <div className="font-semibold text-white">30 bps</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1.5 text-xs">Stop Loss</div>
                      <div className="font-semibold text-white">-6.0%</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-400 mb-1.5 text-xs">Rebalance</div>
                      <div className="font-semibold text-white break-words">volatility‑adaptive</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-400 mb-1.5 text-xs">Order Hooks</div>
                      <div className="font-semibold text-white break-words">RANGE + DUTCH</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Strategy Builder */}
      <Card className="p-5 md:p-6 lg:p-8">
        <CardHeader className="mb-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Advanced Strategy Builder</CardTitle>
          </div>
        </CardHeader>

        {/* Strategy Name */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-2 block">Strategy Name</label>
          <Input 
            placeholder="Enter strategy name..." 
            value={strategyConfig.name}
            onChange={(e) => setStrategyConfig(prev => ({ ...prev, name: e.target.value }))}
            className="max-w-md"
          />
        </div>

        {/* AI Model Selection */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-300 mb-3 block flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <span>Select AI Model</span>
          </label>
          <Select 
            value={strategyConfig.aiModel}
            onChange={(e) => setStrategyConfig(prev => ({ ...prev, aiModel: e.target.value }))}
            className="max-w-md"
          >
            <option value="deepseek-chat-v3.1">DeepSeek Chat V3.1</option>
            <option value="qwen3-max">Qwen3 Max</option>
            <option value="claude-sonnet-4.5">Claude Sonnet 4.5</option>
            <option value="grok-4">Grok 4</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            <option value="openai-gpt-5.1">OpenAI ChatGPT / GPT-5.1</option>
          </Select>
        </div>

        {/* Social Media Sources */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-300 mb-3 block flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            <span>Social Media Sources</span>
          </label>
          <p className="text-xs text-gray-400 mb-4">Add Twitter/X accounts, Reddit communities, or Telegram channels to track</p>
          
          {/* Add Source Form */}
          <div className="mb-4 p-4 rounded-xl border border-purple-500/30 bg-black/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Platform</label>
                <div className="relative">
                  <Select 
                    id="source-type"
                    defaultValue="twitter"
                    className="mb-0"
                  >
                    <option value="twitter">🐦 Twitter / X</option>
                    <option value="reddit">🔴 Reddit</option>
                    <option value="telegram">✈️ Telegram</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Account / Channel</label>
                <Input 
                  id="source-handle"
                  placeholder="e.g., @elonmusk or r/cryptocurrency"
                  className="mb-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const type = (document.getElementById("source-type") as HTMLSelectElement).value as "twitter" | "reddit" | "telegram";
                      const handle = (document.getElementById("source-handle") as HTMLInputElement).value.trim();
                      if (handle) {
                        setStrategyConfig(prev => ({
                          ...prev,
                          socialSources: [...prev.socialSources, { type, handle }]
                        }));
                        (document.getElementById("source-handle") as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => {
                  const type = (document.getElementById("source-type") as HTMLSelectElement).value as "twitter" | "reddit" | "telegram";
                  const handle = (document.getElementById("source-handle") as HTMLInputElement).value.trim();
                  if (handle) {
                    setStrategyConfig(prev => ({
                      ...prev,
                      socialSources: [...prev.socialSources, { type, handle }]
                    }));
                    (document.getElementById("source-handle") as HTMLInputElement).value = "";
                  }
                }}
              >
                <Plus className="h-4 w-4" /> Add Source
              </Button>
            </div>
          </div>

          {/* Added Sources List */}
          {strategyConfig.socialSources.length > 0 && (
            <div className="space-y-2">
              {strategyConfig.socialSources.map((source, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-purple-500/30 bg-black/30">
                  <div className="flex items-center gap-3 flex-1">
                    <SocialIcon type={source.type} className="h-5 w-5 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{source.type}</span>
                      <span className="text-sm text-white font-medium">{source.handle}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStrategyConfig(prev => ({
                        ...prev,
                        socialSources: prev.socialSources.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Algorithm Selection */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-300 mb-3 block flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-purple-400" />
            <span>Trading Algorithm</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                strategyConfig.algorithm === "auto"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-purple-500/30 bg-black/20 hover:border-purple-500/50"
              }`}
              onClick={() => setStrategyConfig(prev => ({ ...prev, algorithm: "auto" }))}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="font-medium text-white">AI Auto-Select</span>
              </div>
              <p className="text-xs text-gray-400">Let AI analyzer choose the best algorithm for your asset</p>
            </div>
            <div
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                strategyConfig.algorithm === "custom"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-purple-500/30 bg-black/20 hover:border-purple-500/50"
              }`}
              onClick={() => setStrategyConfig(prev => ({ ...prev, algorithm: "custom" }))}
            >
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-5 w-5 text-pink-400" />
                <span className="font-medium text-white">Custom Algorithm</span>
              </div>
              <p className="text-xs text-gray-400">Specify your own trading algorithm</p>
            </div>
          </div>
          {strategyConfig.algorithm === "custom" && (
            <div className="mt-4 max-w-2xl">
              <Input
                placeholder="Enter custom algorithm parameters..."
                value={strategyConfig.customAlgorithm}
                onChange={(e) => setStrategyConfig(prev => ({ ...prev, customAlgorithm: e.target.value }))}
              />
            </div>
          )}
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-300 mb-3 block flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span>Risk Management</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="text-xs text-gray-400 mb-2 block flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-red-400" />
                <span>Stop Loss (%)</span>
              </label>
              <Input
                type="number"
                placeholder="5.0"
                value={strategyConfig.stopLoss}
                onChange={(e) => setStrategyConfig(prev => ({ ...prev, stopLoss: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">AI will stop trading and move profits to wallet if loss exceeds this %</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span>Take Profit (%)</span>
              </label>
              <Input
                type="number"
                placeholder="15.0"
                value={strategyConfig.takeProfit}
                onChange={(e) => setStrategyConfig(prev => ({ ...prev, takeProfit: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">AI will stop trading and move profits to wallet if profit reaches this %</p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 pt-6 border-t border-purple-500/30">
          <div className="text-xs uppercase text-gray-400 mb-4 font-medium">Preview</div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-6 p-1 bg-black/30 rounded-lg border border-purple-500/30">
            <button
              onClick={() => setActiveTab("workflow")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "workflow"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <GitBranch className="w-4 h-4" />
              Workflow Diagram
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "json"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Code className="w-4 h-4" />
              JSON Config
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "workflow" ? (
            <WorkflowDiagram 
              strategy={transformToLegacyConfig(strategyConfig)}
              className="mb-6"
            />
          ) : (
            <div className="rounded-2xl bg-black/50 border border-purple-500/30 p-5 md:p-6 text-sm mb-6">
              <pre className="whitespace-pre-wrap text-xs text-gray-300">{JSON.stringify({
                name: strategyConfig.name,
                aiModel: strategyConfig.aiModel,
                socialSources: strategyConfig.socialSources,
                algorithm: strategyConfig.algorithm,
                customAlgorithm: strategyConfig.customAlgorithm,
                stopLoss: strategyConfig.stopLoss,
                takeProfit: strategyConfig.takeProfit,
                tokens: strategyConfig.tokens,
                amount: strategyConfig.amount,
              }, null, 2)}</pre>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setIsSimulationOpen(true)}>
              <BarChart3 className="h-4 w-4" /> Simulate Strategy
            </Button>
            <Button>
              <Rocket className="h-4 w-4" /> Deploy Bot
            </Button>
            <Button variant="outline" onClick={() => setIsBacktestOpen(true)}>
              <CalendarClock className="h-4 w-4" /> Schedule Backtest
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        strategy={transformToLegacyConfig(strategyConfig)}
      />
      
      {/* Backtest Modal */}
      <BacktestModal
        isOpen={isBacktestOpen}
        onClose={() => setIsBacktestOpen(false)}
        strategy={transformToLegacyConfig(strategyConfig)}
      />
    </div>
  );
}