import React from 'react';
import { WorkflowVariable } from '../../types/variables';
import { TableField } from './TableField';

interface FormFieldProps {
  variable: WorkflowVariable;
  value: any;
  onChange: (variable: WorkflowVariable, value: any) => void;
}

export function FormField({ variable, value, onChange }: FormFieldProps) {
  if (variable.type === 'table') {
    return (
      <div>
        <label 
          htmlFor={variable.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {variable.name}
          {variable.description && (
            <span className="ml-2 text-gray-500 text-xs">
              ({variable.description})
            </span>
          )}
        </label>
        <TableField
          variable={variable}
          value={value || []}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div>
      <label 
        htmlFor={variable.id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {variable.name}
        {variable.description && (
          <span className="ml-2 text-gray-500 text-xs">
            ({variable.description})
          </span>
        )}
      </label>

      {variable.type === 'boolean' ? (
        <select
          id={variable.id}
          value={value || ''}
          onChange={(e) => onChange(variable, e.target.value === 'true')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">Select...</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : variable.type === 'date' ? (
        <input
          type="date"
          id={variable.id}
          value={value || ''}
          onChange={(e) => onChange(variable, e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      ) : variable.type === 'datetime' ? (
        <input
          type="datetime-local"
          id={variable.id}
          value={value || ''}
          onChange={(e) => onChange(variable, e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      ) : (
        <input
          type={variable.type === 'number' ? 'number' : 'text'}
          id={variable.id}
          value={value || ''}
          onChange={(e) => onChange(variable, variable.type === 'number' ? Number(e.target.value) : e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      )}
    </div>
  );
}