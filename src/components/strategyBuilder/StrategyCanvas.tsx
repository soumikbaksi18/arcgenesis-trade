import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  Background,
  Controls,
  ReactFlowProvider,
  NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import { BlockDefinition } from './BlockPalette';
import { useStrategyStore } from '../../stores/strategyStore';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const StrategyCanvas: React.FC = () => {
  const { nodes, edges, selectedNode, setNodes, setEdges, setSelectedNode } = useStrategyStore();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Sync ReactFlow nodes/edges with Zustand store
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  // Update selected node when nodes change (to keep it in sync)
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find(n => n.id === selectedNode.id);
      if (updatedNode && updatedNode !== selectedNode) {
        setSelectedNode(updatedNode);
      }
    }
  }, [nodes, selectedNode, setSelectedNode]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection
      if (params.source === params.target) {
        console.warn('Cannot connect node to itself');
        return;
      }

      // Check for duplicate edges
      const exists = edges.find(
        (e) =>
          e.source === params.source &&
          e.target === params.target &&
          e.sourceHandle === params.sourceHandle &&
          e.targetHandle === params.targetHandle
      );
      if (exists) {
        console.warn('Edge already exists');
        return;
      }
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
    },
    [edges, setEdges]
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

        // Check for duplicates
        const exists = nodes.find((n) => n.id === nodeId);
        if (exists) {
          console.warn('Node with same ID already exists');
          return;
        }
        
        setNodes([...nodes, newNode]);
      } catch (error) {
        console.error('Error dropping node:', error);
      }
    },
    [reactFlowInstance, nodes, setNodes]
  );

  const handleNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      const deletedIds = new Set(nodesToDelete.map(n => n.id));
      setNodes(nodes.filter((node) => !deletedIds.has(node.id)));
      setEdges(edges.filter(
        (edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)
      ));
      // Clear selection if deleted node was selected
      if (selectedNode && deletedIds.has(selectedNode.id)) {
        setSelectedNode(null);
      }
    },
    [nodes, edges, selectedNode, setNodes, setEdges, setSelectedNode]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView={nodes.length > 0}
        fitViewOptions={{ padding: 0.3, maxZoom: 1.5, minZoom: 0.4 }}
        className="bg-[#121212]"
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
        <Background color="#2a2a2a" gap={16} size={1} />
        <Controls className="bg-white/80 border border-slate-200 shadow-lg" showInteractive />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

