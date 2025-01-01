import { WorkflowVariable } from '../types/variables';
import { calculateVariableValue } from './variableValue';
import { calculateTableOperation } from './tableOperation';

export function calculateDerivedVariables(
  variables: Record<string, any>,
  allVariables: WorkflowVariable[]
): Record<string, any> {
  const result = { ...variables };

  // First, calculate all table operations since they don't depend on other calculations
  const tableOperationVariables = allVariables.filter(v => v.type === 'table-operation');
  for (const variable of tableOperationVariables) {
    const value = calculateTableOperation(variable, variables, allVariables);
    if (value !== null) {
      result[variable.id] = value;
    }
  }

  // Then calculate variables that might depend on table operations
  const calculatedVariables = allVariables.filter(v => v.type === 'calculated');
  let hasChanges = true;
  let iterations = 0;
  const maxIterations = calculatedVariables.length * 2; // Prevent infinite loops

  while (hasChanges && iterations < maxIterations) {
    hasChanges = false;
    iterations++;

    for (const variable of calculatedVariables) {
      // Skip if already calculated
      if (result[variable.id] !== undefined) continue;

      const value = calculateVariableValue(variable, result, allVariables);
      if (value !== null) {
        result[variable.id] = value;
        hasChanges = true;
      }
    }
  }

  return result;
}