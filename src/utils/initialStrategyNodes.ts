import { Node } from 'reactflow';

// Initial nodes structure following React Flow patterns
export const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: {
      label: 'On Candle Close',
      type: 'OnCandleClose',
      inputs: [],
      outputs: ['trigger'],
      params: { timeframe: '15m' },
    },
  },
  {
    id: 'price-1',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: {
      label: 'Price',
      type: 'Price',
      inputs: ['trigger'],
      outputs: ['price'],
      params: { priceType: 'close' },
    },
  },
  {
    id: 'sma-1',
    type: 'custom',
    position: { x: 500, y: 250 },
    data: {
      label: 'SMA',
      type: 'SMA',
      inputs: ['price'],
      outputs: ['value'],
      params: { period: 20 },
    },
  },
  {
    id: 'buy-1',
    type: 'custom',
    position: { x: 750, y: 250 },
    data: {
      label: 'Buy',
      type: 'Buy',
      inputs: ['boolean'],
      outputs: ['order'],
      params: { amountType: 'percent', amount: 10 },
    },
  },
];

export const initialEdges = [
  {
    id: 'trigger-1-price-1',
    source: 'trigger-1',
    sourceHandle: 'output-0',
    target: 'price-1',
    targetHandle: 'input-0',
  },
  {
    id: 'price-1-sma-1',
    source: 'price-1',
    sourceHandle: 'output-0',
    target: 'sma-1',
    targetHandle: 'input-0',
  },
];


