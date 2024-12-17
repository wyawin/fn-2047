import React from 'react';
import { Save } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  onSave: () => void;
  loading: boolean;
}

export function EditorHeader({ title, onSave, loading }: EditorHeaderProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <button 
        className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        onClick={onSave}
        disabled={loading}
      >
        <Save size={20} />
        {loading ? 'Saving...' : 'Save Workflow'}
      </button>
    </div>
  );
}