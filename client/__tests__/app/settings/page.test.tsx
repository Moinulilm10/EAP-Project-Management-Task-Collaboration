import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '@/app/settings/page';
import { authService } from '@/services/auth.service';
import Swal from 'sweetalert2';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock next-auth
const mockUpdateSession = vi.fn();
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    update: mockUpdateSession,
    data: { user: { name: 'Test User', email: 'test@example.com' } },
    status: 'authenticated',
  }),
}));

// Mock authStore
const mockSetUser = vi.fn();
const mockUser = { name: 'Test User', email: 'test@example.com', bio: 'Initial Bio', picture: null };
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    setUser: mockSetUser,
  }),
}));

// Mock auth.service
vi.mock('@/services/auth.service', () => ({
  authService: {
    updateProfile: vi.fn(),
    getMe: vi.fn(),
  },
}));

// Mock Supabase client to prevent actual network calls during tests
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      }),
    },
  }),
}));

// Mock SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock Sub-components that might cause issues in a plain JSDOM environment
vi.mock('@/components/layout/TopNavBar', () => ({ TopNavBar: () => <div data-testid="top-nav-bar" /> }));
vi.mock('@/components/layout/SideNavBar', () => ({ SideNavBar: () => <div data-testid="side-nav-bar" /> }));

describe('SettingsPage Integration Tests', () => {
  let mockGetMePromise: Promise<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation for getMe returns different data so we can detect when it has loaded
    mockGetMePromise = Promise.resolve({
      user: { name: 'Fetched User', email: 'test@example.com', bio: 'Fetched Bio', picture: null }
    });
    (authService.getMe as any).mockReturnValue(mockGetMePromise);
  });

  it('populates initial state from authStore', async () => {
    render(<SettingsPage />);
    
    // Wait for the on-mount fetch to resolve and apply
    await screen.findByDisplayValue('Fetched User');
    
    // We expect the ProfileSettingsForm inputs to be populated
    const nameInput = screen.getByPlaceholderText('Full Name');
    expect(nameInput).toHaveValue('Fetched User');
    
    const bioTextarea = screen.getByPlaceholderText('Write a few sentences about yourself...');
    expect(bioTextarea).toHaveValue('Fetched Bio');
  });

  it('successfully saves profile updates', async () => {
    (authService.updateProfile as any).mockResolvedValue({
      user: { name: 'Updated User', email: 'test@example.com', bio: 'Updated Bio', picture: null }
    });

    render(<SettingsPage />);
    
    // Wait for the on-mount fetch to resolve so it doesn't overwrite our changes
    await screen.findByDisplayValue('Fetched User');

    // Change values
    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });

    const bioTextarea = screen.getByPlaceholderText('Write a few sentences about yourself...');
    fireEvent.change(bioTextarea, { target: { value: 'Updated Bio' } });

    // Click Save
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Verify API call
      expect(authService.updateProfile).toHaveBeenCalledWith({
        name: 'Updated User',
        bio: 'Updated Bio',
        picture: undefined,
      });

      // Verify Zustand store update
      expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated User',
        email: 'test@example.com',
        bio: 'Updated Bio',
        picture: null,
        image: null
      }));

      // Verify NextAuth session update
      expect(mockUpdateSession).toHaveBeenCalledWith({
        user: { name: 'Updated User', image: null }
      });

      // Verify SweetAlert
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Success!',
        text: 'Profile updated successfully!',
        icon: 'success'
      }));
    });
  });

  it('prevents saving with empty name', async () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<SettingsPage />);
    
    // Wait for the on-mount fetch to resolve
    await screen.findByDisplayValue('Fetched User');

    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: '   ' } }); // empty/whitespace

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(alertMock).toHaveBeenCalledWith('Name cannot be empty');
    expect(authService.updateProfile).not.toHaveBeenCalled();
    
    alertMock.mockRestore();
  });

  it('handles API failure during save', async () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    (authService.updateProfile as any).mockRejectedValue(new Error('Network error'));

    render(<SettingsPage />);
    
    // Wait for the on-mount fetch to resolve
    await screen.findByDisplayValue('Fetched User');

    // We need to actually change something, otherwise the API call isn't testing empty validation
    // But since name is populated from mock ('Fetched User'), it's not empty, so it will call updateProfile.
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(authService.updateProfile).toHaveBeenCalled();
      // Should show alert on error (from our catch block)
      expect(alertMock).toHaveBeenCalledWith('Failed to update profile: Network error');
      expect(Swal.fire).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
    alertMock.mockRestore();
  });

  it('resets state when cancel is clicked', async () => {
    render(<SettingsPage />);
    
    // Wait for fetch to settle
    await screen.findByDisplayValue('Fetched User');

    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Changed Name' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Should revert back to the authStore mock ('Test User') because cancel pulls from authStore
    expect(nameInput).toHaveValue('Test User');
  });
});
