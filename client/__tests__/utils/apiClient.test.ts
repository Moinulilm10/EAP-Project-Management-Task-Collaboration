import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../utils/apiClient';

// Mock getSession and fetch
vi.mock('next-auth/react', () => ({
  getSession: vi.fn().mockResolvedValue({ accessToken: 'mock-token' }),
}));

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: 'success' }),
});

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should attach Authorization header and X-Idempotency-Key on POST requests', async () => {
    await apiClient.post('/test', { hello: 'world' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
        }),
        body: JSON.stringify({ hello: 'world' }),
      })
    );

    const callArgs = (global.fetch as any).mock.calls[0][1];
    expect(callArgs.headers['X-Idempotency-Key']).toBeDefined();
  });

  it('should not attach X-Idempotency-Key on GET requests', async () => {
    await apiClient.get('/test');

    const callArgs = (global.fetch as any).mock.calls[0][1];
    expect(callArgs.headers['X-Idempotency-Key']).toBeUndefined();
    expect(callArgs.headers['Authorization']).toBe('Bearer mock-token');
  });
});
