import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { StrategyApiPayload } from '../utils/strategyToApiJson';
import { convertWorkflowToApiJson } from '../utils/strategyToApiJson';
import { initialNodes, initialEdges } from '../utils/initialStrategyNodes';

interface StrategyState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  showJsonModal: boolean;
  apiPayload: StrategyApiPayload | null;
  
  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node | null) => void;
  setShowJsonModal: (show: boolean) => void;
  generateApiPayload: () => void;
  setApiPayload: (payload: StrategyApiPayload) => void;
  resetStore: () => void;
}

const defaultNodes: Node[] = initialNodes;
const defaultEdges: Edge[] = initialEdges;

export const useStrategyStore = create<StrategyState>((set, get) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  selectedNode: null,
  showJsonModal: false,
  apiPayload: null,

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  
  updateNode: (nodeId, data) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === nodeId ? { ...node, data } : node
    ),
    // Update selected node if it's the one being updated
    selectedNode: state.selectedNode?.id === nodeId
      ? { ...state.selectedNode, data }
      : state.selectedNode,
  })),
  
  deleteNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== nodeId),
    edges: state.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ),
    selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
  })),
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  setShowJsonModal: (show) => set({ showJsonModal: show }),
  
  generateApiPayload: () => {
    const { nodes, edges } = get();
    const payload = convertWorkflowToApiJson(nodes, edges);
    set({ apiPayload: payload, showJsonModal: true });
  },
  
  setApiPayload: (payload) => set({ apiPayload: payload }),
  
  resetStore: () => set({
    nodes: defaultNodes,
    edges: defaultEdges,
    selectedNode: null,
    showJsonModal: false,
    apiPayload: null,
  }),
}));

