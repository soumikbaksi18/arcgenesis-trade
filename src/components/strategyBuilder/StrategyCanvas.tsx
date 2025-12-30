import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ReactFlowProvider,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import { BlockDefinition } from './BlockPalette';
import { initialNodes, initialEdges } from '../../utils/initialStrategyNodes';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface StrategyCanvasProps {
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  selectedNode?: Node | null;
  onNodeSelect?: (node: Node | null) => void;
  onUpdateNode?: (nodeId: string, data: any) => void;
}

export const StrategyCanvas: React.FC<StrategyCanvasProps> = ({
  onNodesChange: externalOnNodesChange,
  onEdgesChange: externalOnEdgesChange,
  selectedNode,
  onNodeSelect,
  onUpdateNode,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Internal handler for node changes
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Internal handler for edge changes
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  // Notify parent of changes
  React.useEffect(() => {
    externalOnNodesChange?.(nodes);
  }, [nodes, externalOnEdgesChange]);

  React.useEffect(() => {
    externalOnEdgesChange?.(edges);
  }, [edges, externalOnEdgesChange]);

  // Update selected node when nodes change (to keep it in sync)
  React.useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find(n => n.id === selectedNode.id);
      if (updatedNode && updatedNode !== selectedNode) {
        onNodeSelect?.(updatedNode);
      }
    }
  }, [nodes, selectedNode, onNodeSelect]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection
      if (params.source === params.target) {
        console.warn('Cannot connect node to itself');
        return;
      }

      setEdges((eds) => {
        // Check for duplicate edges
        const exists = eds.find(
          (e) =>
            e.source === params.source &&
            e.target === params.target &&
            e.sourceHandle === params.sourceHandle &&
            e.targetHandle === params.targetHandle
        );
        if (exists) {
          console.warn('Edge already exists');
          return eds;
        }
        return addEdge(params, eds);
      });
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        const blockData = event.dataTransfer.getData('application/reactflow');
        if (!blockData) {
          console.warn('No block data found in drop event');
          return;
        }

        if (!reactFlowInstance) {
          console.warn('ReactFlow instance not initialized');
          return;
        }

        const block: BlockDefinition = JSON.parse(blockData);

        // Calculate position relative to the ReactFlow viewport
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Ensure unique ID
        const nodeId = `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Initialize params with defaults, and for Pool nodes, fetch active trading pair
        let initialParams = { ...(block.params || {}) };
        if (block.type === 'Pool') {
          // Fetch from localStorage (set by Trading page) or use default
          const activePool = localStorage.getItem('activeTradingPair') || 'ETH/USD';
          initialParams.pool = activePool;
        }

        const newNode: Node = {
          id: nodeId,
          type: 'custom',
          position,
          data: {
            label: block.label,
            type: block.type,
            inputs: block.inputs || [],
            outputs: block.outputs || [],
            params: initialParams,
          },
        };

        setNodes((nds) => {
          // Check for duplicates
          const exists = nds.find((n) => n.id === nodeId);
          if (exists) {
            console.warn('Node with same ID already exists');
            return nds;
          }
          return nds.concat(newNode);
        });
      } catch (error) {
        console.error('Error dropping node:', error);
      }
    },
    [reactFlowInstance, setNodes]
  );

  const handleNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      const deletedIds = new Set(nodesToDelete.map(n => n.id));
      setNodes((nds) => nds.filter((node) => !deletedIds.has(node.id)));
      setEdges((eds) =>
        eds.filter(
          (edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)
        )
      );
      // Clear selection if deleted node was selected
      if (onNodeSelect && selectedNode && deletedIds.has(selectedNode.id)) {
        onNodeSelect(null);
      }
    },
    [setNodes, setEdges, selectedNode, onNodeSelect]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect?.(node);
    },
    [onNodeSelect]
  );

  const handlePaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  // Handle node updates from properties panel (via parent callback)
  React.useEffect(() => {
    if (onUpdateNode) {
      // Store update function to be called from parent
      (window as any).__strategyCanvasUpdateNode = (nodeId: string, data: any) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data }
              : node
          )
        );
      };
    }
  }, [setNodes, onUpdateNode]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView={nodes.length > 0}
        fitViewOptions={{ padding: 0.3, maxZoom: 1.5, minZoom: 0.4 }}
        className="bg-[#f8fafc]"
        style={{ width: '100%', height: '100%' }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        deleteKeyCode={['Backspace', 'Delete']}
        panOnDrag={[1, 2]} // Pan with middle mouse button or space
        selectNodesOnDrag={true} // Select nodes when clicking on them
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 2 }}
        connectionLineType="smoothstep"
        snapToGrid
        snapGrid={[16, 16]}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        selectionOnDrag
        selectionMode="partial"
        selectionKeyCode={['Shift']}
        onNodesDelete={handleNodesDelete}
      >
        <Background color="#e2e8f0" gap={16} size={1} />
        <Controls className="bg-white/80 border border-slate-200 shadow-lg" showInteractive />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

