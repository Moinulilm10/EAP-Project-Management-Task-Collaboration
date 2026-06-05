import { v4 as uuidv4 } from 'uuid';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const session = await getSession() as any;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    // Auto-inject Idempotency-Key for mutating requests if not provided
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase() || 'GET')) {
      if (!headers['X-Idempotency-Key']) {
        headers['X-Idempotency-Key'] = uuidv4();
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    // Need credentials for HttpOnly cookies (refresh token)
    config.credentials = 'include';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle 401 Unauthorized (Trigger refresh logic here if needed, or rely on NextAuth)
      if (response.status === 401) {
        // Simple strategy: NextAuth or RouteGuard will detect session expiry.
        // For robust token rotation on client side, we could call POST /auth/refresh here.
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.error || data?.message || 'API request failed',
          details: data?.details,
        };
      }

      return data as T;
    } catch (error) {
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
