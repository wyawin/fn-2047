export type NodeType = 'trigger' | 'condition' | 'action' | 'credit-score' | 'credit-score-check';
export type ConnectionType = 'default' | 'true' | 'false';

export interface ConditionConfig {
  variable: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_than_equals' | 'less_than_equals';
  value: string | number;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
}

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
}