# Node Structure to API Call Mapping

## Visual Node Workflow Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION NODES                              │
│  (These are set at strategy creation, not dragged nodes)            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Token      │  │ Stablecoin   │  │  Portfolio   │  │ Risk Level   │
│  Selection   │  │  Selection   │  │   Amount     │  │  Selection   │
│              │  │              │  │              │  │              │
│   "BTC"      │  │   "USDC"     │  │   1000.0     │  │ "aggressive" │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
      │                  │                  │                  │
      └──────────────────┴──────────────────┴──────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         TRIGGER NODE                                 │
│  ┌──────────────┐                                                   │
│  │ On Candle    │ ──> Starts the strategy execution                │
│  │ Close        │      (params: { timeframe: '15m' })              │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA SOURCE NODES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │    Price     │  │   Volume     │  │   X / Reddit │             │
│  │     Node     │  │    Node      │  │     Node     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│       │                  │                  │                       │
│       └──────────────────┴──────────────────┘                       │
│                          │                                          │
│                          ▼                                          │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         AI MODEL NODE                                │
│  ┌────────────────────────────────────────────────────┐            │
│  │           ChatGPT / GPT-5                          │            │
│  │  inputs: [trigger, data]                           │            │
│  │  outputs: [prediction, signal]                     │            │
│  │  params: { model: 'gpt-5', temperature: 0.7 }      │            │
│  └────────────────────────────────────────────────────┘            │
│                          │                                          │
│                          ▼                                          │
│  API MAPPING: "model": "GPT-5"                                      │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    QUANT ALGORITHM NODE                              │
│  ┌────────────────────────────────────────────────────┐            │
│  │    Statistical Arbitrage /                         │            │
│  │    Kelly Criterion /                               │            │
│  │    Trend Following                                 │            │
│  │                                                    │            │
│  │  inputs: [price, volume, signal]                   │            │
│  │  outputs: [allocation, signal]                     │            │
│  │  params: { algorithm: 'kelly-criterion' }          │            │
│  └────────────────────────────────────────────────────┘            │
│                          │                                          │
│                          ▼                                          │
│  API MAPPING: "quant_algo": "Kelly Criterion"                       │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   INDICATOR/CONDITION NODES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │     SMA      │  │  GreaterThan │  │  CrossesAbove│             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│       │                  │                  │                       │
│       └──────────────────┴──────────────────┘                       │
│                          │                                          │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ACTION NODES                                    │
│  ┌──────────────┐                                                   │
│  │     Buy      │ ──> Executes trade                               │
│  │     Sell     │                                                   │
│  └──────────────┘                                                   │
│       │                                                              │
│       ▼                                                              │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   RISK MANAGEMENT NODES                              │
│  ┌──────────────────────┐  ┌──────────────────────┐               │
│  │    Stop Loss         │  │    Take Profit       │               │
│  │                      │  │                      │               │
│  │  inputs: [order]     │  │  inputs: [order]     │               │
│  │  outputs: [order]    │  │  outputs: [order]    │               │
│  │  params: {           │  │  params: {           │               │
│  │    type: 'percent',  │  │    type: 'percent',  │               │
│  │    value: 15.0       │  │    value: 100.0      │               │
│  │  }                   │  │  }                   │               │
│  └──────────────────────┘  └──────────────────────┘               │
│           │                         │                               │
│           └─────────┬───────────────┘                               │
│                     ▼                                               │
│  API MAPPING:                                                       │
│    "stop_loss": "85.0"  (100 - 15 = 85% of entry price)            │
│    "take_profit": "200.0" (100 + 100 = 200% of entry price)        │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
                    [DEPLOY / ACTIVATE]
                         │
                         ▼
              POST /api/activate
```

## Complete Node-to-API Mapping

### 1. **Configuration Parameters** (User Input / Strategy Settings)
These are set at strategy creation level, not as draggable nodes:

```javascript
{
  token: "BTC",              // Token symbol selected by user
  stablecoin: "USDC",        // Stablecoin selected by user  
  portfolio_amount: 1000.0,  // Capital allocation amount
  risk_level: "aggressive"   // Risk profile selection
}
```

### 2. **AI Model Node** → `"model"` field
```javascript
// Node in workflow:
{
  type: "ChatGPT",
  params: { model: "gpt-5" }
}

// Maps to API:
"model": "GPT-5"
```

### 3. **Quant Algorithm Node** → `"quant_algo"` field
```javascript
// Node in workflow:
{
  type: "StatisticalArbitrage",  // or Kelly Criterion, etc.
  params: { algorithm: "kelly-criterion" }
}

// Maps to API:
"quant_algo": "Kelly Criterion"
```

### 4. **Risk Management Nodes** → `"stop_loss"` and `"take_profit"` fields

```javascript
// Stop Loss Node:
{
  type: "StopLoss",
  params: { 
    type: "percent", 
    value: 15.0  // 15% loss = stop at 85% of entry
  }
}
// Maps to: "stop_loss": "85.0"

// Take Profit Node:
{
  type: "TakeProfit",
  params: { 
    type: "percent", 
    value: 100.0  // 100% gain = take profit at 200% of entry
  }
}
// Maps to: "take_profit": "200.0"
```

## Example Complete Workflow

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Token   │      │ Stable   │      │ Portfolio│      │   Risk   │
│  Config  │──────│  Config  │──────│  Config  │──────│  Config  │
│  "BTC"   │      │  "USDC"  │      │  1000.0  │      │"aggressive"│
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                                                          │
                          ┌──────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │   On Candle Close     │ (Trigger)
              │   timeframe: 15m      │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │      Price Node       │ (Market Data)
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │   ChatGPT / GPT-5     │ ────┐
              │   model: "gpt-5"      │     │ "model": "GPT-5"
              └───────────┬───────────┘     │
                          │                 │
              ┌───────────▼───────────┐     │
              │  Statistical Arbitrage│ ────┤ "quant_algo": "Kelly Criterion"
              │  algorithm: "kelly"   │     │
              └───────────┬───────────┘     │
                          │                 │
              ┌───────────▼───────────┐     │
              │       SMA(20)         │     │
              └───────────┬───────────┘     │
                          │                 │
              ┌───────────▼───────────┐     │
              │    GreaterThan        │     │
              └───────────┬───────────┘     │
                          │                 │
              ┌───────────▼───────────┐     │
              │        Buy            │     │
              └───────────┬───────────┘     │
                          │                 │
          ┌───────────────┼───────────────┐ │
          │               │               │ │
┌─────────▼─────┐ ┌───────▼───────┐      │ │
│   Stop Loss   │ │  Take Profit  │      │ │
│   value: 15%  │ │  value: 100%  │ ─────┼─┤ "stop_loss": "85.0"
└───────────────┘ └───────────────┘      │ │ "take_profit": "200.0"
                                          │ │
                                          │ │
                          ┌───────────────▼─▼───────────────┐
                          │     API Payload Generator       │
                          └───────────────┬─────────────────┘
                                          │
                          ┌───────────────▼─────────────────┐
                          │  POST /api/activate             │
                          │  {                              │
                          │    "token": "BTC",              │
                          │    "stablecoin": "USDC",        │
                          │    "portfolio_amount": 1000.0,  │
                          │    "risk_level": "aggressive",  │
                          │    "model": "GPT-5",            │
                          │    "stop_loss": "85.0",         │
                          │    "take_profit": "200.0",      │
                          │    "quant_algo": "Kelly Criterion"│
                          │  }                              │
                          └─────────────────────────────────┘
```

## Implementation Notes

1. **Configuration nodes** are form inputs at strategy creation, not draggable nodes
2. **AI Model node** - only one can be used, extracts model name from `params.model`
3. **Quant Algorithm node** - only one can be used, maps to `quant_algo` field
4. **Risk Management nodes** - StopLoss and TakeProfit values are calculated:
   - `stop_loss` = 100 - stopLossPercent (as percentage of entry)
   - `take_profit` = 100 + takeProfitPercent (as percentage of entry)
5. **Trigger, Indicator, Condition nodes** are used for workflow logic but don't map directly to API fields

