import api from './api';
import { CreditApplication } from '../types/application';

interface PaginatedResponse {
  data: CreditApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export class ApplicationService {
  async create(workflowId: string, variables: Record<string, any>): Promise<CreditApplication> {
    const response = await api.post('/applications', { workflowId, variables });
    return response.data;
  }

  async findAll(params: FindAllParams = {}): Promise<PaginatedResponse> {
    const response = await api.get('/applications', { params });
    return response.data;
  }

  async findOne(id: string): Promise<CreditApplication> {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  }

  async process(id: string): Promise<CreditApplication> {
    const response = await api.put(`/applications/${id}/process`);
    return response.data;
  }
}

export const applicationService = new ApplicationService();