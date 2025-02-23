import { WorkflowVariable } from './variables';

export type NodeType = 'trigger' | 'condition' | 'action' | 'credit-score' | 'credit-score-check';
export type ConnectionType = 'default' | 'true' | 'false';

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    config: Record<string, any>;
    variables?: WorkflowVariable[];
  };
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}