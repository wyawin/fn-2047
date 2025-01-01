import { AppDataSource } from '../config/database';
import { CreditApplication } from '../entities/CreditApplication';
import { WorkflowService } from './workflow.service';
import { WorkflowExecutionService } from './workflowExecution.service';
import { calculateDerivedVariables } from '../utils/variableCalculation';
import { ILike } from 'typeorm';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export class ApplicationService {
  private applicationRepository = AppDataSource.getRepository(CreditApplication);
  private workflowService = new WorkflowService();
  private workflowExecutionService = new WorkflowExecutionService();

  async create(workflowId: string, variables: Record<string, any>): Promise<CreditApplication> {
    const workflow = await this.workflowService.findOne(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Get trigger node variables for calculations
    const triggerNode = workflow.nodes.find(node => node.type === 'trigger');
    if (!triggerNode?.data.variables) {
      throw new Error('No variables defined in trigger node');
    }

    // Calculate all derived variables (calculated and table operations)
    const allVariables = calculateDerivedVariables(variables, triggerNode.data.variables);

    // Execute workflow with all variables
    const result = await this.workflowExecutionService.execute(workflow, allVariables);

    // Create application with all variables (input and calculated)
    const application = this.applicationRepository.create({
      workflowId,
      variables: allVariables, // Store both input and calculated variables
      status: result.status,
      creditScore: result.creditScore,
      comment: result.comment
    });

    return this.applicationRepository.save(application);
  }

  async findAll({ page, limit, search, status }: FindAllParams) {
    const queryBuilder = this.applicationRepository.createQueryBuilder('application');

    if (search) {
      // Check if search is a valid UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search);
      
      if (isUUID) {
        queryBuilder.where('application.id = :id', { id: search });
      } else {
        queryBuilder.where('LOWER(application.comment) LIKE LOWER(:search)', { search: `%${search}%` });
      }
    }

    if (status) {
      const condition = search ? 'AND' : 'WHERE';
      queryBuilder.andWhere('application.status = :status', { status });
    }

    const total = await queryBuilder.getCount();

    const applications = await queryBuilder
      .orderBy('application.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { applications, total };
  }

  async findOne(id: string): Promise<CreditApplication | null> {
    return this.applicationRepository.findOne({
      where: { id },
    });
  }

  async process(id: string): Promise<CreditApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const workflow = await this.workflowService.findOne(application.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const result = await this.workflowExecutionService.execute(workflow, application.variables);
    
    application.status = result.status;
    application.creditScore = result.creditScore;
    application.comment = result.comment;

    return this.applicationRepository.save(application);
  }

  async delete(id: string): Promise<void> {
    await this.applicationRepository.delete(id);
  }
}