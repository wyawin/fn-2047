export type VariableType = 'string' | 'number' | 'boolean' | 'calculated' | 'table' | 'table-operation';
export type SourceType = 'variable' | 'manual';
export type TableOperationType = 'sum' | 'average' | 'min' | 'max' | 'median';

export interface TableColumn {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  description?: string;
}

export interface BaseVariable {
  id: string;
  name: string;
  description?: string;
}

export interface StandardVariable extends BaseVariable {
  type: Exclude<VariableType, 'calculated' | 'table' | 'table-operation'>;
  value?: string | number | boolean;
}

export interface TableVariable extends BaseVariable {
  type: 'table';
  columns: TableColumn[];
}

export interface TableOperationVariable extends BaseVariable {
  type: 'table-operation';
  tableVariableId: string;
  columnId: string;
  operation: TableOperationType;
}

export interface CalculatedSource {
  type: SourceType;
  value: string;
}

export interface CalculatedVariable extends BaseVariable {
  type: 'calculated';
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  sourceVariables: [CalculatedSource, CalculatedSource];
}

export type WorkflowVariable = StandardVariable | CalculatedVariable | TableVariable | TableOperationVariable;