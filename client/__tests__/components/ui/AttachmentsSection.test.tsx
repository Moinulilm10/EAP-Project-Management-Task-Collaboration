import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachmentsSection } from '../../../components/ui/AttachmentsSection';
import { attachmentService } from '../../../services/attachment.service';
import { notification } from '../../../utils/notification';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// Mock attachment service
vi.mock('../../../services/attachment.service', () => ({
  attachmentService: {
    getByProject: vi.fn(),
    getByTask: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
  },
}));

// Mock notification
vi.mock('../../../utils/notification', () => ({
  notification: {
    confirm: vi.fn(),
    successToast: vi.fn(),
    errorToast: vi.fn(),
  },
}));

const mockAttachments = [
  {
    id: '1',
    fileName: 'document.pdf',
    fileSize: 1024 * 1024, // 1MB
    fileType: 'application/pdf',
    fileUrl: 'http://example.com/document.pdf',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    fileName: 'image.png',
    fileSize: 2.5 * 1024 * 1024, // 2.5MB
    fileType: 'image/png',
    fileUrl: 'http://example.com/image.png',
    createdAt: new Date().toISOString(),
  },
];

describe('AttachmentsSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (attachmentService.getByProject as any).mockImplementation(() => new Promise(() => {}));
    const { container } = render(<AttachmentsSection projectId="proj-1" canManage={true} />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders attachments successfully for project', async () => {
    (attachmentService.getByProject as any).mockResolvedValue(mockAttachments);
    
    render(<AttachmentsSection projectId="proj-1" canManage={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('image.png')).toBeInTheDocument();
      // Test formatting
      expect(screen.getByText('1 MB')).toBeInTheDocument();
      expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    });
    
    expect(attachmentService.getByProject).toHaveBeenCalledWith('proj-1');
  });

  it('renders "No attachments found" when empty', async () => {
    (attachmentService.getByTask as any).mockResolvedValue([]);
    
    render(<AttachmentsSection taskId="task-1" canManage={false} />);
    
    await waitFor(() => {
      expect(screen.getByText('No attachments found.')).toBeInTheDocument();
    });
  });

  it('handles attachment deletion', async () => {
    (attachmentService.getByProject as any).mockResolvedValue(mockAttachments);
    (notification.confirm as any).mockResolvedValue(true); // User confirmed
    (attachmentService.delete as any).mockResolvedValue(true);
    
    render(<AttachmentsSection projectId="proj-1" canManage={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByTitle('Delete attachment');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(notification.confirm).toHaveBeenCalled();
      expect(attachmentService.delete).toHaveBeenCalledWith('1');
      expect(notification.successToast).toHaveBeenCalledWith('Attachment deleted successfully');
      expect(screen.queryByText('document.pdf')).not.toBeInTheDocument(); // Removed from list
    });
  });

  it('does not delete if user cancels confirmation', async () => {
    (attachmentService.getByProject as any).mockResolvedValue(mockAttachments);
    (notification.confirm as any).mockResolvedValue(false); // User canceled
    
    render(<AttachmentsSection projectId="proj-1" canManage={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByTitle('Delete attachment');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(attachmentService.delete).not.toHaveBeenCalled();
    });
  });
});
