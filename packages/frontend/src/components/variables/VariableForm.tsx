import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  WorkflowVariable, 
  VariableType, 
  CalculatedVariable,
  CalculatedSource,
  TableVariable,
  TableOperationType,
  TableOperationVariable 
} from '../../types/variables';
import { VARIABLE_OPERATIONS } from '../../constants/variables';
import { SourceInput } from './SourceInput';
import { TableVariableForm } from './TableVariableForm';
import { TableOperationForm } from './TableOperationForm';
import { detectCircularDependency } from '../../utils/variableUtils';

interface VariableFormProps {
  existingVariables: WorkflowVariable[];
  onAddVariable: (variable: WorkflowVariable) => void;
}

export function VariableForm({ existingVariables, onAddVariable }: VariableFormProps) {
  const [variableType, setVariableType] = useState<VariableType>('string');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [operation, setOperation] = useState<CalculatedVariable['operation']>('add');
  const [sourceVariables, setSourceVariables] = useState<[CalculatedSource, CalculatedSource]>([
    { type: 'variable', value: '' },
    { type: 'variable', value: '' }
  ]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [tableOperation, setTableOperation] = useState<{
    tableVariableId: string;
    columnId: string;
    operation: TableOperationType;
  }>({
    tableVariableId: '',
    columnId: '',
    operation: 'sum'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for circular dependencies
    if (variableType === 'calculated') {
      const newVarId = `var-${Date.now()}`;
      const hasCircular = sourceVariables.some(source => 
        source.type === 'variable' && 
        detectCircularDependency(newVarId, source.value, [
          ...existingVariables,
          {
            id: newVarId,
            type: 'calculated',
            name,
            description,
            operation,
            sourceVariables
          }
        ])
      );

      if (hasCircular) {
        setError('Cannot create circular dependencies between calculated variables');
        return;
      }
    }
    
    const baseVariable = {
      id: `var-${Date.now()}`,
      name,
      description
    };

    let variable: WorkflowVariable;

    if (variableType === 'calculated') {
      variable = {
        ...baseVariable,
        type: 'calculated',
        operation,
        sourceVariables
      };
    } else if (variableType === 'table') {
      variable = {
        ...baseVariable,
        type: 'table',
        columns
      };
    } else if (variableType === 'table-operation') {
      variable = {
        ...baseVariable,
        type: 'table-operation',
        ...tableOperation
      };
    } else {
      variable = {
        ...baseVariable,
        type: variableType as Exclude<VariableType, 'calculated' | 'table' | 'table-operation'>,
        value: undefined
      };
    }

    onAddVariable(variable);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setVariableType('string');
    setOperation('add');
    setSourceVariables([
      { type: 'variable', value: '' },
      { type: 'variable', value: '' }
    ]);
    setColumns([]);
    setError(null);
    setTableOperation({
      tableVariableId: '',
      columnId: '',
      operation: 'sum'
    });
  };

  const updateSource = (index: 0 | 1, source: CalculatedSource) => {
    setError(null);
    const newSources = [...sourceVariables] as [CalculatedSource, CalculatedSource];
    newSources[index] = source;
    setSourceVariables(newSources);
  };

  const isValid = () => {
    if (!name) return false;
    
    if (variableType === 'calculated') {
      if (error) return false;
      return sourceVariables.every(source => 
        (source.type === 'variable' && source.value) || 
        (source.type === 'manual' && !isNaN(Number(source.value)))
      );
    }

    if (variableType === 'table') {
      return columns.length > 0;
    }

    if (variableType === 'table-operation') {
      return tableOperation.tableVariableId && 
             tableOperation.columnId && 
             tableOperation.operation;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Variable name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 border rounded-lg"
          required
        />
        <select
          value={variableType}
          onChange={e => setVariableType(e.target.value as VariableType)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="string">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Yes/No</option>
          <option value="table">Table</option>
          <option value="calculated">Calculated</option>
          <option value="table-operation">Table Operation</option>
        </select>
      </div>

      {variableType === 'calculated' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SourceInput
              source={sourceVariables[0]}
              onChange={(source) => updateSource(0, source)}
              variables={existingVariables}
              excludeVariableId={sourceVariables[1].type === 'variable' ? sourceVariables[1].value : undefined}
              label="First Value"
            />
            <SourceInput
              source={sourceVariables[1]}
              onChange={(source) => updateSource(1, source)}
              variables={existingVariables}
              excludeVariableId={sourceVariables[0].type === 'variable' ? sourceVariables[0].value : undefined}
              label="Second Value"
            />
          </div>

          <select
            value={operation}
            onChange={e => setOperation(e.target.value as CalculatedVariable['operation'])}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {VARIABLE_OPERATIONS.map(op => (
              <option key={op.value} value={op.value}>
                {op.label} ({op.symbol})
              </option>
            ))}
          </select>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      )}

      {variableType === 'table' && (
        <TableVariableForm
          columns={columns}
          onChange={setColumns}
        />
      )}

      {variableType === 'table-operation' && (
        <TableOperationForm
          existingVariables={existingVariables}
          tableVariableId={tableOperation.tableVariableId}
          columnId={tableOperation.columnId}
          operation={tableOperation.operation}
          onChange={setTableOperation}
        />
      )}

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <button
        type="submit"
        disabled={!isValid()}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg 
          hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
        Add Variable
      </button>
    </form>
  );
}