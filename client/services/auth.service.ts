import { apiClient } from '../utils/apiClient';

export const authService = {
  // Login/Register are mostly handled via NextAuth credentials provider, 
  // but these are useful for direct API interaction if needed.
  register: (data: any) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  refresh: () => apiClient.post('/auth/refresh'),
};
