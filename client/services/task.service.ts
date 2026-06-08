import { apiClient } from '../utils/apiClient';

export const taskService = {
  getAll: (options?: any) => {
    const params = new URLSearchParams();
    if (options) {
      if (options.search) params.append('search', options.search);
      if (options.status && options.status !== 'all') {
        const backendStatus = options.status === 'in-progress' ? 'in_progress' : options.status;
        params.append('status', backendStatus);
      }
      if (options.priority && options.priority !== 'all') params.append('priority', options.priority);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
    }
    const queryString = params.toString();
    return apiClient.get(queryString ? `/tasks?${queryString}` : '/tasks');
  },
  getById: (id: string) => apiClient.get(`/tasks/${id}`),
  create: (data: any) => {
    const payload = { ...data };
    if (payload.status === 'in-progress') payload.status = 'in_progress';
    return apiClient.post('/tasks', payload);
  },
  update: (id: string, data: any) => {
    const payload = { ...data };
    if (payload.status === 'in-progress') payload.status = 'in_progress';
    return apiClient.put(`/tasks/${id}`, payload);
  },
  delete: (id: string) => apiClient.delete(`/tasks/${id}`),
};
