import { AppDataSource } from '../config/database';
import { Workflow } from '../entities/Workflow';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
}

export class WorkflowService {
  private workflowRepository = AppDataSource.getRepository(Workflow);

  async create(name: string, nodes: WorkflowNode[], connections: Connection[]): Promise<Workflow> {
    const workflow = this.workflowRepository.create({
      name,
      nodes,
      connections,
    });
    return this.workflowRepository.save(workflow);
  }

  async findAll({ page, limit, search }: FindAllParams) {
    const queryBuilder = this.workflowRepository.createQueryBuilder('workflow')
      .where('workflow.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere('LOWER(workflow.name) LIKE LOWER(:search)', { search: `%${search}%` });
    }

    const total = await queryBuilder.getCount();

    const workflows = await queryBuilder
      .orderBy('workflow.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { workflows, total };
  }

  async findOne(id: string): Promise<Workflow | null> {
    return this.workflowRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: string, name: string, nodes: WorkflowNode[], connections: Connection[]): Promise<Workflow | null> {
    const workflow = await this.workflowRepository.findOne({
      where: { id, isActive: true },
    });

    if (!workflow) return null;

    workflow.name = name;
    workflow.nodes = nodes;
    workflow.connections = connections;

    return this.workflowRepository.save(workflow);
  }

  async delete(id: string): Promise<boolean> {
    const workflow = await this.workflowRepository.findOne({
      where: { id, isActive: true },
    });

    if (!workflow) return false;

    workflow.isActive = false;
    await this.workflowRepository.save(workflow);
    return true;
  }
}