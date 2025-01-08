import React from 'react';
import { useApplicationVariables } from '../../hooks/useApplicationVariables';
import { CreditApplication } from '../../types/application';

interface VariablesListProps {
  application: CreditApplication;
}

export function VariablesList({ application }: VariablesListProps) {
  const { loading, getVariableLabel, getColumnLabel, tableColumns, variableTypes } = useApplicationVariables(application);

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

  const renderValue = (variableId: string, value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      if (value.length === 0) return '-';
      if (typeof value[0] === 'object') {
        // Get all unique keys from the array of objects
        const keys = Array.from(
          new Set(value.flatMap(obj => Object.keys(obj)))
        );

        return (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  {keys.map(key => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {getColumnLabel(variableId, key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {value.map((row, index) => (
                  <tr key={index}>
                    {keys.map(key => (
                      <td key={key} className="px-3 py-2 text-sm text-gray-900">
                        {formatTableValue(row[key], variableId, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return value.join(', ');
    }
    return formatValue(value, variableId);
  };

  const formatTableValue = (value: any, variableId: string, columnId: string): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    const columns = tableColumns[variableId];
    const column = columns?.find(col => col.id === columnId);
    
    if (column?.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (column?.type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    if (column?.type === 'datetime') {
      return new Date(value).toLocaleString();
    }
    
    return String(value);
  };

  const formatValue = (value: any, variableId: string): string => {
    if (value === null || value === undefined) return '-';

    const type = variableTypes[variableId];
    if (!type) return String(value);

    switch (type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      
      case 'date':
        return new Date(value).toLocaleDateString();
      
      case 'datetime':
        return new Date(value).toLocaleString();
      
      case 'calculated':
      case 'table-operation':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(application.variables).map(([key, value]) => (
        <div key={key}>
          <span className="text-gray-600 font-medium">{getVariableLabel(key)}:</span>
          <div className="mt-1">
            {renderValue(key, value)}
          </div>
        </div>
      ))}
    </div>
  );
}