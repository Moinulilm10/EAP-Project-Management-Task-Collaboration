import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachmentsSection } from '../../components/ui/AttachmentsSection';
import { attachmentService } from '../../services/attachment.service';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('../../services/attachment.service', () => ({
  attachmentService: {
    getByProject: vi.fn(),
    upload: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../utils/notification', () => ({
  notification: {
    confirm: vi.fn(() => Promise.resolve(true)),
    successToast: vi.fn(),
    errorToast: vi.fn(),
  },
}));

describe('Attachment Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display, upload, and update attachments list', async () => {
    const initialAttachments = [
      {
        id: '1',
        fileName: 'existing.pdf',
        fileSize: 1000,
        fileType: 'application/pdf',
        fileUrl: 'http://example.com/existing.pdf',
        createdAt: new Date().toISOString(),
      }
    ];

    (attachmentService.getByProject as any).mockResolvedValue([...initialAttachments]);

    render(<AttachmentsSection projectId="project-1" canManage={true} />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('existing.pdf')).toBeInTheDocument();
    });

    // Upload new file
    const newFile = new File(['dummy'], 'new_upload.png', { type: 'image/png' });
    const uploadedAttachment = {
      id: '2',
      fileName: 'new_upload.png',
      fileSize: 500,
      fileType: 'image/png',
      fileUrl: 'http://example.com/new_upload.png',
      createdAt: new Date().toISOString(),
    };

    (attachmentService.upload as any).mockResolvedValue(uploadedAttachment);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [newFile] } });

    // Verify upload call and UI update
    await waitFor(() => {
      expect(attachmentService.upload).toHaveBeenCalledWith(newFile, { projectId: 'project-1', taskId: undefined });
      expect(screen.getByText('new_upload.png')).toBeInTheDocument();
      expect(screen.getByText('existing.pdf')).toBeInTheDocument();
    });
  });
});
