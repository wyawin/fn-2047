import { useEffect, useCallback } from 'react';
import { Workflow } from '../types/workflow';

interface KeyboardShortcutsProps {
  selectedNode: string | null;
  selectedConnection: string | null;
  onDeleteNode: (nodeId: string) => void;
  onDeleteConnection: (connectionId: string) => void;
  workflow: Workflow;
}

export function useKeyboardShortcuts({ 
  selectedNode, 
  selectedConnection,
  onDeleteNode, 
  onDeleteConnection,
  workflow 
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Don't delete if we're in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (selectedConnection) {
        onDeleteConnection(selectedConnection);
      } else if (selectedNode) {
        // Don't delete the trigger node
        const node = workflow.nodes.find(n => n.id === selectedNode);
        if (node?.type === 'trigger') return;

        onDeleteNode(selectedNode);
      }
    }
  }, [selectedNode, selectedConnection, onDeleteNode, onDeleteConnection, workflow.nodes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { handleKeyDown };
}