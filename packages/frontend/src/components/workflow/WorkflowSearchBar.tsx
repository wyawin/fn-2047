import React from 'react';
import { Search } from 'lucide-react';

interface WorkflowSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function WorkflowSearchBar({ search, onSearchChange }: WorkflowSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search workflows..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
}