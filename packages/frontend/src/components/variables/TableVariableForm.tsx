import React from 'react';
import { TableColumn } from '../../types/variables';
import { TableHeader } from './table/TableHeader';
import { TableRow } from './table/TableRow';
import { AddColumnForm } from './table/AddColumnForm';

interface TableVariableFormProps {
  columns: TableColumn[];
  onChange: (columns: TableColumn[]) => void;
}

export function TableVariableForm({ columns, onChange }: TableVariableFormProps) {
  const handleAddColumn = (column: TableColumn) => {
    onChange([...columns, column]);
  };

  const handleRemoveColumn = (columnId: string) => {
    onChange(columns.filter(col => col.id !== columnId));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Table Structure</h4>
        <p className="text-xs text-gray-500">
          Define the columns for your table variable
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <TableHeader />
        
        <div className="divide-y">
          {columns.map(column => (
            <TableRow
              key={column.id}
              column={column}
              onRemove={handleRemoveColumn}
            />
          ))}
        </div>

        <AddColumnForm onAdd={handleAddColumn} />
      </div>
    </div>
  );
}