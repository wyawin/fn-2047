import React from 'react';
import { WorkflowVariable } from '../../types/variables';
import { Trash2, Table } from 'lucide-react';
import { getVariableDisplayValue } from '../../utils/variableUtils';

interface VariableListProps {
  variables: WorkflowVariable[];
  onRemoveVariable: (id: string) => void;
}

export function VariableList({ variables, onRemoveVariable }: VariableListProps) {
  const renderTableColumns = (variable: WorkflowVariable) => {
    if (variable.type !== 'table') return null;
    
    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500">Columns:</p>
        <div className="grid grid-cols-2 gap-2">
          {variable.columns.map(column => (
            <div key={column.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {column.name} ({column.type})
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <div 
          key={variable.id}
          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{variable.name}</span>
              <span className="text-xs px-2 py-1 bg-gray-200 rounded-full flex items-center gap-1">
                {variable.type === 'table' && <Table size={12} />}
                {variable.type}
              </span>
            </div>
            {variable.description && (
              <p className="text-sm text-gray-600 mt-1">
                {variable.description}
              </p>
            )}
            {variable.type === 'calculated' && (
              <p className="text-sm text-gray-500 mt-1">
                {getVariableDisplayValue(variable, variables)}
              </p>
            )}
            {renderTableColumns(variable)}
          </div>
          <button
            onClick={() => onRemoveVariable(variable.id)}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <Trash2 size={16} className="text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}