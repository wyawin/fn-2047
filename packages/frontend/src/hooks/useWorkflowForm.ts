import { useState, useEffect } from 'react';
import { Workflow } from '../types/workflow';
import { WorkflowVariable } from '../types/variables';
import { CreditApplication } from '../types/application';
import { workflowService } from '../services/workflow.service';
import { applicationService } from '../services/application.service';
import { calculateVariableValues } from '../utils/variableCalculation';
import toast from 'react-hot-toast';

export function useWorkflowForm(workflowId: string | undefined) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreditApplication | null>(null);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    try {
      setLoading(true);
      const data = await workflowService.findOne(id);
      setWorkflow(data);
    } catch (error) {
      toast.error('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  const getTriggerVariables = (): WorkflowVariable[] => {
    const triggerNode = workflow?.nodes.find(node => node.type === 'trigger');
    return triggerNode?.data.variables?.filter(v => (v.type !== 'calculated' && v.type !== 'table-operation')) || [];
  };

  const getAllVariables = (): WorkflowVariable[] => {
    const triggerNode = workflow?.nodes.find(node => node.type === 'trigger');
    return triggerNode?.data.variables || [];
  };

  const handleInputChange = (variable: WorkflowVariable, value: string) => {
    setFormData(prev => ({
      ...prev,
      [variable.id]: variable.type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflow?.id) return;

    try {
      setSubmitting(true);
      
      // Get all variables including calculated ones
      const allVariables = getAllVariables();
      
      // Calculate values for calculated variables
      const calculatedValues = calculateVariableValues(allVariables, formData);
      
      // Combine input values with calculated values
      const allValues = {
        ...formData,
        ...calculatedValues
      };

      const application = await applicationService.create(workflow.id, allValues);
      setResult(application);
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const closeResult = () => {
    setResult(null);
    setFormData({});
  };

  return {
    workflow,
    loading,
    formData,
    submitting,
    result,
    getTriggerVariables,
    handleInputChange,
    handleSubmit,
    closeResult
  };
}