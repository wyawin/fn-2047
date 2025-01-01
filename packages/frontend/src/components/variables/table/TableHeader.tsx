import React from 'react';
import { Info } from 'lucide-react';

export function TableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-t-lg text-sm font-medium text-gray-700">
      <div className="col-span-4">Name</div>
      <div className="col-span-3">Type</div>
      <div className="col-span-4 flex items-center gap-1">
        Description
        <Info size={14} className="text-gray-400" />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}