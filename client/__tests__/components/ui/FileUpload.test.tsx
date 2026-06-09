import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from '../../../components/ui/FileUpload';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('FileUpload Component', () => {
  it('renders the upload area correctly', () => {
    render(<FileUpload onUpload={vi.fn()} />);
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText(/or drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, Image/i)).toBeInTheDocument();
  });

  it('shows uploading state', () => {
    render(<FileUpload onUpload={vi.fn()} isUploading={true} />);
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('validates file size (images)', async () => {
    const onUploadMock = vi.fn();
    render(<FileUpload onUpload={onUploadMock} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a mock image file > 5MB
    const largeImageFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [largeImageFile] } });
    
    await waitFor(() => {
      expect(screen.getByText('File size exceeds the limit (5MB).')).toBeInTheDocument();
      expect(onUploadMock).not.toHaveBeenCalled();
    });
  });

  it('validates file size (videos)', async () => {
    const onUploadMock = vi.fn();
    render(<FileUpload onUpload={onUploadMock} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a mock video file > 10MB
    const largeVideoFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.mp4', { type: 'video/mp4' });
    
    fireEvent.change(fileInput, { target: { files: [largeVideoFile] } });
    
    await waitFor(() => {
      expect(screen.getByText('File size exceeds the limit (10MB).')).toBeInTheDocument();
      expect(onUploadMock).not.toHaveBeenCalled();
    });
  });

  it('calls onUpload for valid files', async () => {
    const onUploadMock = vi.fn();
    render(<FileUpload onUpload={onUploadMock} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    const validFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    
    await waitFor(() => {
      expect(onUploadMock).toHaveBeenCalledWith(validFile);
    });
  });
});
