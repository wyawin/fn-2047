import React from 'react';
import { Trash2 } from 'lucide-react';
import { TableColumn } from '../../../types/variables';

interface TableRowProps {
  column: TableColumn;
  onRemove: (id: string) => void;
}

export function TableRow({ column, onRemove }: TableRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b last:border-b-0 items-center text-sm">
      <div className="col-span-4 font-medium text-gray-900">{column.name}</div>
      <div className="col-span-3">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
          {column.type}
        </span>
      </div>
      <div className="col-span-4 text-gray-600 truncate">
        {column.description || '-'}
      </div>
      <div className="col-span-1 flex justify-end">
        <button
          onClick={() => onRemove(column.id)}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}