import { ConditionConfig } from '../types/workflow';

export function evaluateCondition(value: any, config: ConditionConfig): boolean {
  const { operator, value: threshold } = config;
  
  // Convert values to appropriate types
  const compareValue = typeof value === 'string' ? value : Number(value);
  const compareThreshold = typeof threshold === 'string' ? threshold : Number(threshold);

  switch (operator) {
    case 'equals':
      return compareValue === compareThreshold;
    case 'not_equals':
      return compareValue !== compareThreshold;
    case 'greater_than':
      return compareValue > compareThreshold;
    case 'less_than':
      return compareValue < compareThreshold;
    case 'greater_than_equals':
      return compareValue >= compareThreshold;
    case 'less_than_equals':
      return compareValue <= compareThreshold;
    default:
      return false;
  }
}