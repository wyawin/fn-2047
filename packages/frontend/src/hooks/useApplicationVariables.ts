import { useState, useEffect } from 'react';
import { CreditApplication } from '../types/application';
import { workflowService } from '../services/workflow.service';
import { TableVariable, VariableType } from '../types/variables';

export function useApplicationVariables(application: CreditApplication) {
  const [variableLabels, setVariableLabels] = useState<Record<string, string>>({});
  const [variableTypes, setVariableTypes] = useState<Record<string, VariableType>>({});
  const [tableColumns, setTableColumns] = useState<Record<string, TableVariable['columns']>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkflowVariables = async () => {
      try {
        setLoading(true);
        const workflow = await workflowService.findOne(application.workflowId);
        const triggerNode = workflow.nodes.find(node => node.type === 'trigger');
        
        if (triggerNode?.data.variables) {
          const labels: Record<string, string> = {};
          const types: Record<string, VariableType> = {};
          const columns: Record<string, TableVariable['columns']> = {};
          
          triggerNode.data.variables.forEach(variable => {
            labels[variable.id] = variable.name;
            types[variable.id] = variable.type;
            if (variable.type === 'table') {
              columns[variable.id] = variable.columns;
            }
          });
          
          setVariableLabels(labels);
          setVariableTypes(types);
          setTableColumns(columns);
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

  const getColumnLabel = (variableId: string, columnId: string): string => {
    const columns = tableColumns[variableId];
    if (!columns) return columnId;
    const column = columns.find(col => col.id === columnId);
    return column?.name || columnId;
  };

  return {
    loading,
    getVariableLabel,
    getColumnLabel,
    variableLabels,
    variableTypes,
    tableColumns
  };
}