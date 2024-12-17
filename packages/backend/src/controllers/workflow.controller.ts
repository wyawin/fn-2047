import { Request, Response, NextFunction } from 'express';
import { WorkflowService } from '../services/workflow.service';

export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      const { workflows, total } = await this.workflowService.findAll({
        page,
        limit,
        search
      });

      res.json({
        data: workflows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ... other methods remain the same
}