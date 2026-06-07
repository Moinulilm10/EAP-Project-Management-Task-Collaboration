import { apiClient } from '../utils/apiClient';

export const taskService = {
  getAll: (options?: any) => {
    const params = new URLSearchParams();
    if (options) {
      if (options.search) params.append('search', options.search);
      if (options.status && options.status !== 'all') params.append('status', options.status);
      if (options.priority && options.priority !== 'all') params.append('priority', options.priority);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
    }
    const queryString = params.toString();
    return apiClient.get(queryString ? `/tasks?${queryString}` : '/tasks');
  },
  getById: (id: string) => apiClient.get(`/tasks/${id}`),
  create: (data: any) => apiClient.post('/tasks', data),
  update: (id: string, data: any) => apiClient.put(`/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tasks/${id}`),
};
