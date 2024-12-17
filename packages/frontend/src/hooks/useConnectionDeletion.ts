import { useCallback } from 'react';
import { Workflow } from '../types/workflow';

export function useConnectionDeletion(workflow: Workflow, onUpdateWorkflow: (workflow: Workflow) => void) {
  const deleteConnection = useCallback((connectionId: string) => {
    const updatedConnections = workflow.connections.filter(conn => conn.id !== connectionId);
    
    onUpdateWorkflow({
      ...workflow,
      connections: updatedConnections
    });
  }, [workflow, onUpdateWorkflow]);

  return { deleteConnection };
}