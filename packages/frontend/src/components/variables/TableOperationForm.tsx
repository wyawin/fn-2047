import React from 'react';
import { WorkflowVariable, TableOperationType, TableVariable } from '../../types/variables';
import { TABLE_OPERATIONS } from '../../types/variables';

interface TableOperationFormProps {
  existingVariables: WorkflowVariable[];
  tableVariableId: string;
  columnId: string;
  operation: TableOperationType;
  onChange: (updates: {
    tableVariableId: string;
    columnId: string;
    operation: TableOperationType;
  }) => void;
}

export function TableOperationForm({
  existingVariables,
  tableVariableId,
  columnId,
  operation,
  onChange
}: TableOperationFormProps) {
  const tableVariables = existingVariables.filter(
    (v): v is TableVariable => v.type === 'table'
  );

  const selectedTable = tableVariables.find(v => v.id === tableVariableId);
  const numberColumns = selectedTable?.columns.filter(c => c.type === 'number') || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Table
        </label>
        <select
          value={tableVariableId}
          onChange={(e) => onChange({
            tableVariableId: e.target.value,
            columnId: '',
            operation
          })}
          className="w-full px-3 py-2 border rounded-lg"
          required
        >
          <option value="">Select a table variable</option>
          {tableVariables.map(variable => (
            <option key={variable.id} value={variable.id}>
              {variable.name}
            </option>
          ))}
        </select>
      </div>

      {tableVariableId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Column
          </label>
          <select
            value={columnId}
            onChange={(e) => onChange({
              tableVariableId,
              columnId: e.target.value,
              operation
            })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select a numeric column</option>
            {numberColumns.map(column => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
          {numberColumns.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              No numeric columns available in this table
            </p>
          )}
        </div>
      )}

      {tableVariableId && columnId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Operation
          </label>
          <select
            value={operation}
            onChange={(e) => onChange({
              tableVariableId,
              columnId,
              operation: e.target.value as TableOperationType
            })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select operation</option>
            {TABLE_OPERATIONS.map(op => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}