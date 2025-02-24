import React, { useCallback } from 'react';
import { Workflow, WorkflowNode as WorkflowNodeType, ConnectionType } from '../types/workflow';
import { WorkflowNode } from './nodes/WorkflowNode';
import { WorkflowConnections } from './workflow/WorkflowConnections';
import { AddNodeButton } from './workflow/AddNodeButton';
import { useWorkflowDrag } from '../hooks/useWorkflowDrag';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useConnections } from '../hooks/useConnections';
import { useNodeConfig } from '../hooks/useNodeConfig';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useNodeDeletion } from '../hooks/useNodeDeletion';
import { useConnectionDeletion } from '../hooks/useConnectionDeletion';
import { useNodeSelection } from '../hooks/useNodeSelection';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface WorkflowCanvasProps {
  workflow: Workflow;
  onUpdateWorkflow: (workflow: Workflow) => void;
}

export function WorkflowCanvas({ workflow, onUpdateWorkflow }: WorkflowCanvasProps) {
  const { draggingNode, mousePosition, handleMouseMove, handleDragStart, handleDragEnd } = 
    useWorkflowDrag(workflow, onUpdateWorkflow);
  
  const { connectingFrom, handleConnectionStart, handleConnectionEnd, isValidTarget } = 
    useConnections(workflow, onUpdateWorkflow);

  const { configuredNode, openNodeConfig, closeNodeConfig, updateNodeConfig } = 
    useNodeConfig(workflow, onUpdateWorkflow);

  const { handleDragStart: handleNodeDragStart, createNode } = useDragAndDrop();

  const { deleteNode } = useNodeDeletion(workflow, onUpdateWorkflow);
  const { deleteConnection } = useConnectionDeletion(workflow, onUpdateWorkflow);

  const { selectedNode, handleNodeSelect, handleCanvasClick, isNodeSelected } = 
    useNodeSelection(workflow);

  const [selectedConnection, setSelectedConnection] = React.useState<string | null>(null);

  useKeyboardShortcuts({
    selectedNode,
    selectedConnection,
    onDeleteNode: (nodeId) => {
      deleteNode(nodeId);
      handleNodeSelect(null);
    },
    onDeleteConnection: (connectionId) => {
      deleteConnection(connectionId);
      setSelectedConnection(null);
    },
    workflow
  });

  const { 
    zoom, 
    handleZoom, 
    resetZoom, 
    startPanning, 
    handlePanning, 
    stopPanning, 
    isPanning 
  } = useCanvasZoom();

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const rect = e.currentTarget.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      handleZoom(e.deltaY > 0 ? -1 : 1, point);
    }
  }, [handleZoom]);

  const handleMouseMoveWithPan = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      handlePanning(e);
    } else {
      handleMouseMove(e);
    }
  }, [handlePanning, handleMouseMove, isPanning]);

  const handleNodeConnectionStart = (nodeId: string, type: ConnectionType) => {
    handleConnectionStart(nodeId, type);
  };

  const handleCanvasClickWithReset = (e: React.MouseEvent) => {
    if (!isPanning) {
      handleCanvasClick(e);
      setSelectedConnection(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only start panning if clicking directly on the canvas or workflow-content
    const target = e.target as HTMLElement;
    if (
      target.classList.contains('workflow-canvas') || 
      target.classList.contains('workflow-content')
    ) {
      startPanning(e);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-[1000]">
        <div className="bg-white rounded-lg shadow-sm p-1 flex items-center gap-1">
          <button
            onClick={() => handleZoom(1, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => handleZoom(-1, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Reset View"
          >
            <Maximize size={20} />
          </button>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
          <div className="px-2 py-1">
            {Math.round(zoom.scale * 100)}%
          </div>
        </div>
      </div>

      <div 
        className={`workflow-canvas relative w-full h-full ${isPanning ? 'cursor-move' : 'cursor-default'}`}
        onWheel={handleWheel}
        onMouseMove={handleMouseMoveWithPan}
        onMouseUp={stopPanning}
        onMouseLeave={stopPanning}
        onClick={handleCanvasClickWithReset}
        onMouseDown={handleCanvasMouseDown}
      >
        <div
          className="workflow-content absolute inset-0"
          style={{
            transform: `translate(${zoom.position.x}px, ${zoom.position.y}px) scale(${zoom.scale})`,
            transformOrigin: '0 0'
          }}
        >
          <WorkflowConnections 
            workflow={workflow}
            connectingFrom={connectingFrom}
            mousePosition={{
              x: (mousePosition.x - zoom.position.x) / zoom.scale,
              y: (mousePosition.y - zoom.position.y) / zoom.scale
            }}
            onDeleteConnection={deleteConnection}
            selectedConnection={selectedConnection}
            onSelectConnection={setSelectedConnection}
          />

          {workflow.nodes.map(node => (
            <WorkflowNode
              key={node.id}
              node={node}
              workflow={workflow}
              onDragStart={() => handleDragStart(node.id)}
              onDragEnd={handleDragEnd}
              onConnectionStart={(type) => handleNodeConnectionStart(node.id, type)}
              onConnectionEnd={() => handleConnectionEnd(node.id)}
              isConnecting={!!connectingFrom.nodeId}
              isValidTarget={isValidTarget(node.id)}
              onConfigOpen={openNodeConfig}
              onConfigUpdate={updateNodeConfig}
              isConfigOpen={configuredNode === node.id}
              isSelected={isNodeSelected(node.id)}
              onSelect={handleNodeSelect}
            />
          ))}
        </div>

        <AddNodeButton
          position={mousePosition}
          onAddNode={(newNode: WorkflowNodeType) => {
            onUpdateWorkflow({
              ...workflow,
              nodes: [...workflow.nodes, newNode]
            });
          }}
        />
      </div>
    </div>
  );
}