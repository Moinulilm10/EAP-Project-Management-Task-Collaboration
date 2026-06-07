import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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

describe('ProfileSettingsForm', () => {
  const mockProps = {
    name: 'John Doe',
    setName: vi.fn(),
    email: 'john@example.com',
    bio: 'Software Engineer',
    setBio: vi.fn(),
    picture: null as string | null,
    setPicture: vi.fn(),
  };

  it('renders correctly with initial props', () => {
    render(<ProfileSettingsForm {...mockProps} />);
    
    // Check name input
    const nameInput = screen.getByPlaceholderText('Full Name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('John Doe');

    // Check email input (which is disabled)
    const emailInput = screen.getByDisplayValue('john@example.com');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toBeDisabled();

    // Check bio textarea
    const bioTextarea = screen.getByPlaceholderText('Write a few sentences about yourself...');
    expect(bioTextarea).toBeInTheDocument();
    expect(bioTextarea).toHaveValue('Software Engineer');
  });

  it('calls setName when name input changes', () => {
    render(<ProfileSettingsForm {...mockProps} />);
    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(mockProps.setName).toHaveBeenCalledWith('Jane Doe');
  });

  it('calls setBio when bio textarea changes', () => {
    render(<ProfileSettingsForm {...mockProps} />);
    const bioTextarea = screen.getByPlaceholderText('Write a few sentences about yourself...');
    fireEvent.change(bioTextarea, { target: { value: 'Senior Software Engineer' } });
    expect(mockProps.setBio).toHaveBeenCalledWith('Senior Software Engineer');
  });
});
