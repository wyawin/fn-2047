import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow } from '../types/workflow';
import { useWorkflow } from './useWorkflow';
import toast from 'react-hot-toast';

const initialWorkflow: Omit<Workflow, 'id'> = {
  name: 'New Credit Decision Workflow',
  nodes: [
    {
      id: `node-${Date.now()}`,
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        title: 'New Application',
        description: 'Triggers when a new credit application is received',
        config: {},
        variables: []
      }
    }
  ],
  connections: []
};

export function useWorkflowEditor(workflowId: string | undefined) {
  const navigate = useNavigate();
  const { workflow, saveWorkflow, loadWorkflow, loading, error, setWorkflow } = useWorkflow();
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    const initializeWorkflow = async () => {
      if (workflowId === 'new') {
        setWorkflow(initialWorkflow as Workflow);
      } else if (workflowId) {
        try {
          await loadWorkflow(workflowId);
        } catch (error) {
          toast.error('Failed to load workflow');
          navigate('/workflows');
        }
      }
    };

    initializeWorkflow();
  }, [workflowId, loadWorkflow, setWorkflow, navigate]);

  const handleSave = () => {
    if (workflow) {
      setShowNameModal(true);
    }
  };

  const handleSaveWithName = async (name: string) => {
    if (!workflow) return;

    try {
      const savedWorkflow = await saveWorkflow({ ...workflow, name });
      setShowNameModal(false);
      toast.success('Workflow saved successfully');
      navigate(`/workflows/${savedWorkflow.id}/edit`);
    } catch (err) {
      toast.error('Failed to save workflow');
    }
  };

  return {
    workflow,
    loading,
    error,
    showNameModal,
    setWorkflow,
    handleSave,
    handleSaveWithName,
    setShowNameModal
  };
}