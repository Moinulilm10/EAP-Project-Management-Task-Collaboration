import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hydrateFromSession: (session: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true, error: null }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  hydrateFromSession: (session) => {
    if (session?.user) {
      set({
        user: {
          id: session.user.id || '',
          email: session.user.email,
          name: session.user.name,
          image: session.user.image || null,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
