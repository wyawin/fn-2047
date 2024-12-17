import { Workflow, WorkflowNode, ConditionConfig } from '../types/workflow';
import { calculateCreditScore } from '../utils/creditScore';
import { evaluateCondition } from '../utils/conditionEvaluation';

interface ExecutionResult {
  status: 'approved' | 'rejected' | 'review';
  creditScore?: number;
  comment?: string;
}

export class WorkflowExecutionService {
  async execute(workflow: Workflow, variables: Record<string, any>): Promise<ExecutionResult> {
    // Find and execute credit score node first
    const creditScoreNode = this.findCreditScoreNode(workflow);
    let creditScore: number | undefined;

    if (creditScoreNode) {
      creditScore = calculateCreditScore(creditScoreNode.data.config, variables);
      variables.creditScore = creditScore; // Add credit score to variables for conditions
    }

    // Start execution from trigger node
    const result = await this.executeWorkflowLogic(workflow, variables, creditScore);
    return {
      ...result,
      creditScore,
    };
  }

  private findCreditScoreNode(workflow: Workflow): WorkflowNode | undefined {
    return workflow.nodes.find(node => node.type === 'credit-score');
  }

  private async executeWorkflowLogic(
    workflow: Workflow,
    variables: Record<string, any>,
    creditScore?: number
  ): Promise<ExecutionResult> {
    let currentNode = workflow.nodes.find(node => node.type === 'trigger');
    if (!currentNode) throw new Error('No trigger node found');

    while (currentNode) {
      switch (currentNode.type) {
        case 'credit-score-check':
          if (creditScore === undefined) break;
          
          const { operator, threshold } = currentNode.data.config;
          const checkResult = evaluateCondition(creditScore, {
            operator,
            value: threshold
          });
          currentNode = this.findNextNode(workflow, currentNode.id, checkResult ? 'true' : 'false');
          break;

        case 'condition':
          const conditionConfig = currentNode.data.config as ConditionConfig;
          const variableValue = variables[conditionConfig.variable];
          
          if (variableValue === undefined) {
            throw new Error(`Variable ${conditionConfig.variable} not found`);
          }

          const conditionResult = evaluateCondition(variableValue, conditionConfig);
          currentNode = this.findNextNode(workflow, currentNode.id, conditionResult ? 'true' : 'false');
          break;

        case 'action':
          return {
            status: currentNode.data.config.actionType,
            comment: currentNode.data.config.comment,
          };

        default:
          currentNode = this.findNextNode(workflow, currentNode.id, 'default');
      }

      if (!currentNode) break;
    }

    return { status: 'review', comment: 'Workflow ended without decision' };
  }

  private findNextNode(workflow: Workflow, currentNodeId: string, connectionType: string): WorkflowNode | undefined {
    const connection = workflow.connections.find(
      conn => conn.source === currentNodeId && conn.type === connectionType
    );
    if (!connection) return undefined;
    
    return workflow.nodes.find(node => node.id === connection.target);
  }
}