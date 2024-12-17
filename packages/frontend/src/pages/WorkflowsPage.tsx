import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowList } from '../components/WorkflowList';
import { Workflow } from '../types/workflow';

export function WorkflowsPage() {
  const navigate = useNavigate();

  const handleSelectWorkflow = (workflow: Workflow) => {
    navigate(`/workflows/${workflow.id}/edit`);
  };

  const handleNewWorkflow = () => {
    navigate('/workflows/new/edit');
  };

  return (
    <WorkflowList 
      onSelect={handleSelectWorkflow}
      onNew={handleNewWorkflow}
    />
  );
}