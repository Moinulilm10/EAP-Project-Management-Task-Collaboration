import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TopNavBar } from '../../../components/layout/TopNavBar';
import { SideNavBar } from '../../../components/layout/SideNavBar';

// Hoist variables needed inside vi.mock factory functions
const { 
  mockSignOut, 
  mockClearAuth, 
  mockSetLoading, 
  mockUser, 
  mockPush, 
  mockThemeState 
} = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  const themeState = {
    currentTheme: 'light',
    themeListeners: listeners,
    setThemeState: (newTheme: string) => {
      themeState.currentTheme = newTheme;
      listeners.forEach((listener) => listener());
    }
  };
  return {
    mockSignOut: vi.fn(() => Promise.resolve()),
    mockClearAuth: vi.fn(),
    mockSetLoading: vi.fn(),
    mockUser: { name: 'Test User', email: 'test@example.com', image: '/avatar.png' },
    mockPush: vi.fn(),
    mockThemeState: themeState
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signOut: mockSignOut,
}));

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    clearAuth: mockClearAuth,
    setLoading: mockSetLoading,
  }),
}));

// Mock framer-motion using a Proxy to handle all elements (motion.button, motion.div, etc.)
vi.mock('framer-motion', () => {
  const motionProxy = new Proxy({}, {
    get: (_target, key) => {
      return ({ children, whileHover, whileTap, transition, ...props }: any) => {
        const Element = key as any;
        return <Element {...props}>{children}</Element>;
      };
    }
  });
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock next-themes using our hoisted theme state with a synchronous source of truth
vi.mock('next-themes', () => ({
  useTheme: () => {
    const [, forceUpdate] = React.useState(0);
    
    React.useEffect(() => {
      const listener = () => forceUpdate((prev) => prev + 1);
      mockThemeState.themeListeners.add(listener);
      return () => {
        mockThemeState.themeListeners.delete(listener);
      };
    }, []);

    return {
      theme: mockThemeState.currentTheme,
      resolvedTheme: mockThemeState.currentTheme,
      setTheme: (t: string) => {
        mockThemeState.setThemeState(t);
      },
    };
  },
}));

describe('Theme Toggle Unit & Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockThemeState.currentTheme = 'light';
    mockThemeState.themeListeners.clear();

    // Mock requestAnimationFrame to run immediately
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('TopNavBar Theme Toggle Unit Tests', () => {
    it('renders the theme toggle button', () => {
      render(<TopNavBar />);
      
      const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles theme to dark when theme is light and button is clicked', async () => {
      render(<TopNavBar />);
      
      const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(mockThemeState.currentTheme).toBe('dark');
      });
    });

    it('toggles theme to light when theme is dark and button is clicked', async () => {
      mockThemeState.currentTheme = 'dark';
      render(<TopNavBar />);
      
      const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(mockThemeState.currentTheme).toBe('light');
      });
    });
  });

  describe('Theme Toggle Integration Tests (TopNavBar + SideNavBar)', () => {
    it('should update SideNavBar logo based on theme toggled in TopNavBar', async () => {
      // Render both TopNavBar and SideNavBar to test the theme propagation
      render(
        <div>
          <TopNavBar />
          <SideNavBar />
        </div>
      );

      // Verify initial light mode logo (needs decodeURIComponent due to next/image URL optimization)
      const logoImage = screen.getByAltText('ProjectFlow Logo') as HTMLImageElement;
      expect(decodeURIComponent(logoImage.src)).toContain('/img/logo-light-mode.png');

      // Click the theme toggle button in TopNavBar
      const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(toggleButton);

      // Verify the theme state updated to dark and SideNavBar logo updated to dark mode logo
      await waitFor(() => {
        expect(mockThemeState.currentTheme).toBe('dark');
        expect(decodeURIComponent(logoImage.src)).toContain('/img/logo-dark-mode.png');
      });

      // Click the theme toggle button again to switch back to light mode
      const toggleButton2 = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(toggleButton2);

      // Verify theme state and SideNavBar logo updated back to light mode logo
      await waitFor(() => {
        expect(mockThemeState.currentTheme).toBe('light');
        expect(decodeURIComponent(logoImage.src)).toContain('/img/logo-light-mode.png');
      });
    });
  });
});
