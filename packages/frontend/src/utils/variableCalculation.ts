import { WorkflowVariable, CalculatedVariable, TableOperationVariable } from '../types/variables';
import { calculateVariableValue } from './variableUtils';
import { calculateTableOperation } from './tableOperationUtils';

export function calculateVariableValues(
  variables: WorkflowVariable[],
  inputValues: Record<string, any>
): Record<string, number> {
  const calculatedValues: Record<string, number> = {};
  const calculatedVariables = variables.filter(
    v => v.type === 'calculated' || v.type === 'table-operation'
  );

  // Convert input variables to the format expected by calculateVariableValue
  const formattedVariables = variables.map(v => ({
    ...v,
    value: inputValues[v.id]
  }));

  // Calculate values for all calculated variables
  for (const variable of calculatedVariables) {
    let value: number | null = null;

    if (variable.type === 'calculated') {
      value = calculateVariableValue(variable, formattedVariables);
    } else if (variable.type === 'table-operation') {
      value = calculateTableOperation(variable, formattedVariables);
    }

    if (value !== null) {
      calculatedValues[variable.id] = value;
    }
  }

  return calculatedValues;
}