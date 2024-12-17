import React from 'react';
import { useApplicationVariables } from '../../hooks/useApplicationVariables';
import { CreditApplication } from '../../types/application';

interface VariablesListProps {
  application: CreditApplication;
}

export function VariablesList({ application }: VariablesListProps) {
  const { loading, getVariableLabel } = useApplicationVariables(application);

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(application.variables).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-600">{getVariableLabel(key)}:</span>
          <span className="font-medium">{formatValue(value)}</span>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}