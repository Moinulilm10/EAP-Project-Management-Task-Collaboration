import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ImageCropperModal } from '@/components/settings/ImageCropperModal';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock JSDOM Canvas support
beforeAll(() => {
  if (typeof HTMLCanvasElement !== 'undefined') {
    HTMLCanvasElement.prototype.toBlob = function (callback) {
      // Return a dummy mock Blob
      callback(new Blob(['mock-cropped-image-data'], { type: 'image/jpeg' }));
    };
    HTMLCanvasElement.prototype.getContext = function (contextId: string) {
      if (contextId === '2d') {
        return {
          drawImage: vi.fn(),
          clearRect: vi.fn(),
          getImageData: vi.fn(),
          putImageData: vi.fn(),
          createImageData: vi.fn(),
          setTransform: vi.fn(),
          drawImageWithCanvas: vi.fn(),
        } as any;
      }
      return null;
    };
  }
});

describe('ImageCropperModal', () => {
  const mockProps = {
    isOpen: true,
    imageSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    onCancel: vi.fn(),
    onApply: vi.fn(),
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ImageCropperModal {...mockProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when isOpen is true', () => {
    render(<ImageCropperModal {...mockProps} />);
    
    expect(screen.getByText('Crop & Position Avatar')).toBeInTheDocument();
    expect(screen.getByText('Drag the image to position and use the slider to zoom.')).toBeInTheDocument();
    expect(screen.getByText('Zoom')).toBeInTheDocument();
    
    // Zoom Slider
    const zoomSlider = screen.getByLabelText('Zoom Slider');
    expect(zoomSlider).toBeInTheDocument();
    expect(zoomSlider).toHaveValue('1');

    // Action buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Crop')).toBeInTheDocument();
  });

  it('calls onCancel when clicking Cancel button', () => {
    render(<ImageCropperModal {...mockProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('changes zoom level when slider is adjusted', () => {
    render(<ImageCropperModal {...mockProps} />);
    
    const zoomSlider = screen.getByLabelText('Zoom Slider');
    fireEvent.change(zoomSlider, { target: { value: '1.85' } });
    
    expect(zoomSlider).toHaveValue('1.85');
    expect(screen.getByText('185%')).toBeInTheDocument();
  });

  it('calls onApply with cropped blob when clicking Save Crop', () => {
    // Mock the HTMLImageElement naturalWidth and naturalHeight since they default to 0 in JSDOM
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { get: () => 300 });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', { get: () => 300 });

    render(<ImageCropperModal {...mockProps} />);
    
    const saveButton = screen.getByText('Save Crop');
    fireEvent.click(saveButton);
    
    expect(mockProps.onApply).toHaveBeenCalled();
    const callArgs = mockProps.onApply.mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Blob);
  });
});
