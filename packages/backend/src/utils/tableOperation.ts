import { TableOperationVariable, WorkflowVariable, TableVariable } from '../types/variables';

export function calculateTableOperation(
  variable: TableOperationVariable,
  variables: Record<string, any>,
  allVariables: WorkflowVariable[]
): number | null {
  // Find the table variable definition
  const tableVariable = allVariables.find(
    (v): v is TableVariable => v.type === 'table' && v.id === variable.tableVariableId
  );
  if (!tableVariable) return null;

  // Get the table data from variables
  const tableData = variables[variable.tableVariableId] as Array<Record<string, any>> || [];
  if (!tableData.length) return null;

  // Get all values from the specified column
  const values = tableData
    .map(row => row[variable.columnId])
    .filter((value): value is number => typeof value === 'number' && !isNaN(value));

  if (!values.length) return null;

  switch (variable.operation) {
    case 'sum':
      return values.reduce((sum, value) => sum + value, 0);
    
    case 'average':
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    
    case 'min':
      return Math.min(...values);
    
    case 'max':
      return Math.max(...values);
    
    case 'median': {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    }
    
    default:
      return null;
  }
}