import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TableVariable } from '../../types/variables';

interface TableFieldProps {
  variable: TableVariable;
  value: any[];
  onChange: (variable: TableVariable, value: any[]) => void;
}

export function TableField({ variable, value = [], onChange }: TableFieldProps) {
  const [newRow, setNewRow] = useState<Record<string, any>>({});

  const handleAddRow = () => {
    const hasAllRequiredValues = variable.columns.every(col => 
      newRow[col.id] !== undefined && newRow[col.id] !== ''
    );
    
    if (!hasAllRequiredValues) return;

    onChange(variable, [...value, newRow]);
    setNewRow({});
  };

  const handleRemoveRow = (index: number) => {
    onChange(variable, value.filter((_, i) => i !== index));
  };

  const handleInputChange = (columnId: string, inputValue: string) => {
    const column = variable.columns.find(col => col.id === columnId);
    if (!column) return;

    let parsedValue: any = inputValue;
    if (column.type === 'number') {
      parsedValue = inputValue === '' ? '' : Number(inputValue);
    } else if (column.type === 'boolean') {
      parsedValue = inputValue === 'true';
    }

    setNewRow(prev => ({
      ...prev,
      [columnId]: parsedValue
    }));
  };

  const formatValue = (value: any, columnType: string): string => {
    if (value === null || value === undefined) return '-';

    switch (columnType) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {variable.columns.map(column => (
                <th
                  key={column.id}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: '240px' }}
                >
                  {column.name}
                </th>
              ))}
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {value.map((row, index) => (
              <tr key={index}>
                {variable.columns.map(column => (
                  <td key={column.id} className="px-5 py-3 text-sm whitespace-nowrap">
                    {formatValue(row[column.id], column.type)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              {variable.columns.map(column => (
                <td key={column.id} className="px-5 py-3">
                  {column.type === 'boolean' ? (
                    <select
                      value={newRow[column.id] || ''}
                      onChange={e => handleInputChange(column.id, e.target.value)}
                      className="w-full px-4 py-2 text-sm border rounded"
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <input
                      type={column.type === 'number' ? 'number' : 'text'}
                      value={newRow[column.id] || ''}
                      onChange={e => handleInputChange(column.id, e.target.value)}
                      className="w-full px-4 py-2 text-sm border rounded"
                      placeholder={`Enter ${column.name.toLowerCase()}`}
                    />
                  )}
                </td>
              ))}
              <td className="px-4 py-3">
                <button
                  onClick={handleAddRow}
                  disabled={!variable.columns.every(col => 
                    newRow[col.id] !== undefined && newRow[col.id] !== ''
                  )}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-primary-500 disabled:opacity-50"
                >
                  <Plus size={14} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}