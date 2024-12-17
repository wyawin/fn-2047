import React from 'react';
import { useParams } from 'react-router-dom';
import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { WorkflowNameModal } from '../components/modals/WorkflowNameModal';
import { useWorkflowEditor } from '../hooks/useWorkflowEditor';
import { EditorHeader } from '../components/workflow/EditorHeader';
import { LoadingState } from '../components/workflow/LoadingState';
import { ErrorState } from '../components/workflow/ErrorState';

export function WorkflowEditorPage() {
  const { id } = useParams();
  const {
    workflow,
    loading,
    error,
    showNameModal,
    setWorkflow,
    handleSave,
    handleSaveWithName,
    setShowNameModal
  } = useWorkflowEditor(id);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!workflow) {
    return null;
  }

  return (
    <div className="h-full relative">
      <EditorHeader
        title={workflow.name}
        onSave={handleSave}
        loading={loading}
      />

      <WorkflowCanvas 
        workflow={workflow}
        onUpdateWorkflow={setWorkflow}
      />

      {showNameModal && (
        <WorkflowNameModal
          initialName={workflow.name}
          onSave={handleSaveWithName}
          onClose={() => setShowNameModal(false)}
        />
      )}
    </div>
  );
}