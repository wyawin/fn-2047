import React from 'react';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function SearchFilters({ search, status, onSearchChange, onStatusChange }: SearchFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Status</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="review">Under Review</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}