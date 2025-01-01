import { WorkflowVariable } from '../types/variables';
import { calculateVariableValue } from './variableValue';
import { calculateTableOperation } from './tableOperation';

export function calculateDerivedVariables(
  variables: Record<string, any>,
  allVariables: WorkflowVariable[]
): Record<string, any> {
  const result = { ...variables };
  const calculatedVariables = allVariables.filter(
    v => v.type === 'calculated' || v.type === 'table-operation'
  );

  // Keep calculating until all variables are resolved or we can't resolve anymore
  let hasChanges = true;
  while (hasChanges) {
    hasChanges = false;

    for (const variable of calculatedVariables) {
      // Skip if already calculated
      if (result[variable.id] !== undefined) continue;

      let value: number | null = null;

      if (variable.type === 'calculated') {
        value = calculateVariableValue(variable, variables, allVariables);
      } else if (variable.type === 'table-operation') {
        value = calculateTableOperation(variable, variables, allVariables);
      }

      if (value !== null) {
        result[variable.id] = value;
        hasChanges = true;
      }
    }
  }

  return result;
}