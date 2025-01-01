import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TableColumn } from '../../../types/variables';

interface AddColumnFormProps {
  onAdd: (column: TableColumn) => void;
}

export function AddColumnForm({ onAdd }: AddColumnFormProps) {
  const [column, setColumn] = useState<Partial<TableColumn>>({
    name: '',
    type: 'string'
  });

  const handleAdd = () => {
    if (!column.name) return;

    onAdd({
      id: `col-${Date.now()}`,
      name: column.name,
      type: column.type as 'string' | 'number' | 'boolean',
      description: column.description
    });

    setColumn({ name: '', type: 'string', description: '' });
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-b-lg items-start">
      <div className="col-span-4">
        <input
          type="text"
          placeholder="Column name"
          value={column.name}
          onChange={e => setColumn(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      <div className="col-span-3">
        <select
          value={column.type}
          onChange={e => setColumn(prev => ({ ...prev, type: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="string">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Yes/No</option>
        </select>
      </div>
      <div className="col-span-4">
        <input
          type="text"
          placeholder="Optional description"
          value={column.description || ''}
          onChange={e => setColumn(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      <div className="col-span-1">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!column.name}
          className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}