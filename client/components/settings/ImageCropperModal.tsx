import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCancel: () => void;
  onApply: (croppedBlob: Blob) => void;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  onCancel,
  onApply,
}: ImageCropperModalProps) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setIsDragging(false);
      dragOffset.current = { x: 0, y: 0 };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Drag Start
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    dragOffset.current = { x: offsetX, y: offsetY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Handle Drag Move
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    setOffsetX(dragOffset.current.x + dx);
    setOffsetY(dragOffset.current.y + dy);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Handle Drag End
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const wOrig = imgElement.naturalWidth;
    const hOrig = imgElement.naturalHeight;

    const containerSize = 300;
    const cropSize = 200;

    // Cover algorithm: determine fit dimensions in container
    const isWidthBound = wOrig / hOrig > 1;
    let wFit = containerSize;
    let hFit = containerSize;
    if (isWidthBound) {
      hFit = containerSize;
      wFit = containerSize * (wOrig / hOrig);
    } else {
      wFit = containerSize;
      hFit = containerSize * (hOrig / wOrig);
    }

    const wZoomed = wFit * zoom;
    const hZoomed = hFit * zoom;

    // Crop top-left in zoomed image coordinates relative to container center
    const xCropRelZoomed = wZoomed / 2 - offsetX - 100;
    const yCropRelZoomed = hZoomed / 2 - offsetY - 100;

    // Scale coordinates back to original image
    const scale = wOrig / wZoomed;
    const sx = xCropRelZoomed * scale;
    const sy = yCropRelZoomed * scale;
    const sw = cropSize * scale;
    const sh = cropSize * scale;

    ctx.drawImage(imgElement, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onApply(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-surface rounded-2xl shadow-xl w-full max-w-md border border-outline-variant/30 flex flex-col gap-5 p-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={t("Crop & Position Avatar") as string}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-title-lg font-title-lg text-on-surface">
            {t("Crop & Position Avatar")}
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            {t("Drag the image to position and use the slider to zoom.")}
          </p>
        </div>

        {/* Cropping Workspace */}
        <div
          className="relative w-full h-[300px] bg-neutral-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-outline-variant/10 flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Raw Image */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop Preview"
            className="absolute max-w-none origin-center pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
              left: "50%",
              top: "50%",
              // Make sure aspect ratios look correct depending on image shape
              width: "auto",
              height: "100%",
            }}
            onLoad={(e) => {
              // Adjust image dimensions on load to correctly emulate "cover"
              const img = e.currentTarget;
              if (img.naturalWidth / img.naturalHeight > 1) {
                img.style.height = "100%";
                img.style.width = "auto";
              } else {
                img.style.width = "100%";
                img.style.height = "auto";
              }
            }}
          />

          {/* Mask Overlay with circular crop boundary */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div 
              className="w-[200px] h-[200px] rounded-full border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              data-testid="crop-frame"
            />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-label-md font-label-md text-on-surface-variant">
            <span>{t("Zoom")}</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label={t("Zoom Slider") as string}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outlined" onClick={onCancel} className="cursor-pointer">
            {t("Cancel")}
          </Button>
          <Button onClick={handleCrop} className="cursor-pointer">
            {t("Save Crop")}
          </Button>
        </div>
      </div>
    </div>
  );
}
