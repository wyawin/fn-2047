import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';

export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { workflowId, variables } = req.body;
      const application = await this.applicationService.create(workflowId, variables);
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || undefined;

      const { applications, total } = await this.applicationService.findAll({
        page,
        limit,
        search,
        status
      });

      res.json({
        data: applications,
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

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await this.applicationService.findOne(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      res.json(application);
    } catch (error) {
      next(error);
    }
  }

  async process(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await this.applicationService.process(req.params.id);
      res.json(application);
    } catch (error) {
      next(error);
    }
  }
}