import React from 'react';
import { WorkflowNode as WorkflowNodeType } from '../../types/workflow';
import { NodeHeader } from './NodeHeader';
import { NodeConnector } from './NodeConnector';
import { NodeConfig } from './NodeConfig';
import { useNodeStyles } from '../../hooks/useNodeStyles';
import { NODE_DIMENSIONS } from '../../constants/dimensions';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  workflow: { nodes: WorkflowNodeType[] };
  onDragStart: () => void;
  onDragEnd: () => void;
  onConnectionStart: (type: string) => void;
  onConnectionEnd: () => void;
  isConnecting: boolean;
  isValidTarget?: boolean;
  onConfigOpen: (nodeId: string) => void;
  onConfigUpdate: (node: WorkflowNodeType) => void;
  isConfigOpen: boolean;
  isSelected: boolean;
  onSelect: (nodeId: string | null) => void;
}

export function WorkflowNode({
  node,
  workflow,
  onDragStart,
  onDragEnd,
  onConnectionStart,
  onConnectionEnd,
  isConnecting,
  isValidTarget = false,
  onConfigOpen,
  onConfigUpdate,
  isConfigOpen,
  isSelected,
  onSelect
}: WorkflowNodeProps) {
  const nodeStyle = useNodeStyles(node);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const renderNodeContent = () => {
    switch (node.type) {
      case 'condition':
        if (node.data.config.variable) {
          return (
            <div className="mt-2 text-xs text-gray-500">
              Condition: {
                workflow.nodes
                  .find(n => n.type === 'trigger')
                  ?.data.variables
                  ?.find(v => v.id === node.data.config.variable)
                  ?.name
              } {node.data.config.operator} {node.data.config.value}
            </div>
          );
        }
        break;

      case 'credit-score-check':
        if (node.data.config.creditScoreNodeId) {
          const creditScoreNode = workflow.nodes.find(n => n.id === node.data.config.creditScoreNodeId);
          return (
            <div className="mt-2 text-xs text-gray-500">
              Check: {creditScoreNode?.data.title} {node.data.config.operator} {node.data.config.threshold}
            </div>
          );
        }
        break;

      case 'action':
        const actionTypeLabels = {
          approved: 'Approve Application',
          rejected: 'Reject Application',
          review: 'Send for Review'
        };
        
        return (
          <div className="mt-2 space-y-1">
            {node.data.config.actionType && (
              <div className="text-xs text-gray-500">
                Action: {actionTypeLabels[node.data.config.actionType as keyof typeof actionTypeLabels]}
              </div>
            )}
            {node.data.config.comment && (
              <div className="text-xs text-gray-500">
                Comment: {node.data.config.comment}
              </div>
            )}
          </div>
        );
        break;
    }
    return null;
  };

  const isConditionalNode = node.type === 'condition' || node.type === 'credit-score-check';

  return (
    <>
      <div
        data-node-id={node.id}
        className={`absolute ${nodeStyle} border-2 rounded-lg shadow-sm z-[750] transition-shadow ${
          isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
        }`}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: NODE_DIMENSIONS.width,
          height: NODE_DIMENSIONS.height,
          cursor: 'grab'
        }}
        onClick={handleClick}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
      >
        <div className="p-4">
          <NodeHeader 
            node={node} 
            onConfigOpen={() => onConfigOpen(node.id)}
          />
          <p className="text-sm text-gray-600">{node.data.description}</p>
          {renderNodeContent()}
        </div>

        {/* Input Connection Point */}
        {node.type !== 'trigger' && (
          <NodeConnector
            position="input"
            onConnectionEnd={onConnectionEnd}
            isConnecting={isConnecting}
            isValidTarget={isValidTarget}
          />
        )}

        {/* Output Connection Points */}
        {isConditionalNode ? (
          <>
            <NodeConnector
              position="output"
              type="true"
              onConnectionStart={() => onConnectionStart('true')}
              label="True"
            />
            <NodeConnector
              position="output"
              type="false"
              onConnectionStart={() => onConnectionStart('false')}
              label="False"
            />
          </>
        ) : node.type !== 'action' && (
          <NodeConnector
            position="output"
            type="default"
            onConnectionStart={() => onConnectionStart('default')}
          />
        )}
      </div>

      {isConfigOpen && (
        <NodeConfig
          node={node}
          workflow={workflow}
          onClose={() => onConfigOpen('')}
          onUpdate={onConfigUpdate}
        />
      )}
    </>
  );
}