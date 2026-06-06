import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set user and update authentication status', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test' };
    useAuthStore.getState().setUser(user);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should clear auth state', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test' };
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().clearAuth();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should hydrate from session', () => {
    const session = {
      user: { id: '2', email: 'hydrate@test.com', name: 'Hydrate' }
    };
    useAuthStore.getState().hydrateFromSession(session);
    
    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('hydrate@test.com');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('should clear auth if session has no user', () => {
    useAuthStore.getState().hydrateFromSession(null);
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});
