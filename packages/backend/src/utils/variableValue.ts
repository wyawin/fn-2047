import { CalculatedVariable, WorkflowVariable } from '../types/variables';

export function calculateVariableValue(
  variable: CalculatedVariable,
  variables: Record<string, any>,
  allVariables: WorkflowVariable[]
): number | null {
  const getValue = (source: CalculatedVariable['sourceVariables'][0]): number | null => {
    if (source.type === 'manual') {
      const value = Number(source.value);
      return isNaN(value) ? null : value;
    }

    const sourceVariable = allVariables.find(v => v.id === source.value);
    if (!sourceVariable) return null;

    const value = variables[source.value];
    if (value === undefined) return null;

    return typeof value === 'number' ? value : null;
  };

  const value1 = getValue(variable.sourceVariables[0]);
  const value2 = getValue(variable.sourceVariables[1]);

  if (value1 === null || value2 === null) return null;

  switch (variable.operation) {
    case 'add':
      return value1 + value2;
    case 'subtract':
      return value1 - value2;
    case 'multiply':
      return value1 * value2;
    case 'divide':
      return value2 === 0 ? null : value1 / value2;
    default:
      return null;
  }
}