import { useState, useEffect } from 'react';
import { CreditApplication } from '../types/application';
import { Workflow } from '../types/workflow';
import { workflowService } from '../services/workflow.service';

export function useApplicationVariables(application: CreditApplication) {
  const [variableLabels, setVariableLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkflowVariables = async () => {
      try {
        setLoading(true);
        const workflow = await workflowService.findOne(application.workflowId);
        const triggerNode = workflow.nodes.find(node => node.type === 'trigger');
        
        if (triggerNode?.data.variables) {
          const labels = triggerNode.data.variables.reduce((acc, variable) => ({
            ...acc,
            [variable.id]: variable.name
          }), {});
          setVariableLabels(labels);
        }
      } catch (error) {
        console.error('Failed to load workflow variables:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflowVariables();
  }, [application.workflowId]);

  const getVariableLabel = (variableId: string): string => {
    return variableLabels[variableId] || variableId;
  };

  return {
    loading,
    getVariableLabel,
    variableLabels
  };
}