"use client";

import React, { useRef, useState } from "react";
// Importing specific icons from react-icons/md
import { MdCloudUpload as MdCloudUploadIcon, MdInsertDriveFile as MdInsertDriveFileIcon, MdClose as MdCloseIcon, MdImage as MdImageIcon, MdOndemandVideo as MdOndemandVideoIcon, MdPictureAsPdf as MdPictureAsPdfIcon } from "react-icons/md";
import { Button } from "./Button";

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSizeMB?: number; // fallback max size
  maxImageSizeMB?: number;
  maxVideoSizeMB?: number;
  isUploading?: boolean;
}

export function FileUpload({
  onUpload,
  accept = "image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx",
  maxSizeMB = 10,
  maxImageSizeMB = 5,
  maxVideoSizeMB = 10,
  isUploading = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await validateAndUpload(e.target.files[0]);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const validateAndUpload = async (file: File) => {
    setError(null);

    // Validate size based on type
    let allowedMaxSize = maxSizeMB * 1024 * 1024;
    
    if (file.type.startsWith("image/")) {
      allowedMaxSize = maxImageSizeMB * 1024 * 1024;
    } else if (file.type.startsWith("video/")) {
      allowedMaxSize = maxVideoSizeMB * 1024 * 1024;
    }

    if (file.size > allowedMaxSize) {
      setError(`File size exceeds the limit (${allowedMaxSize / 1024 / 1024}MB).`);
      return;
    }

    try {
      await onUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload file.");
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low"
        } ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <MdCloudUploadIcon className={`w-10 h-10 mb-3 ${dragActive ? 'text-primary' : 'text-secondary'}`} />
        <p className="font-body-md text-on-surface text-center mb-1">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="font-body-sm text-secondary text-center">
          PDF, Image (max {maxImageSizeMB}MB), Video (max {maxVideoSizeMB}MB), Docs, Excel
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={accept}
          disabled={isUploading}
        />
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/80 rounded-xl backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2"></div>
              <p className="font-label-md text-primary">Uploading...</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error font-body-sm">{error}</p>
      )}
    </div>
  );
}

export function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <MdImageIcon className="w-5 h-5 text-primary" />;
  }
  if (mimeType.startsWith("video/")) {
    return <MdOndemandVideoIcon className="w-5 h-5 text-tertiary" />;
  }
  if (mimeType === "application/pdf") {
    return <MdPictureAsPdfIcon className="w-5 h-5 text-error" />;
  }
  return <MdInsertDriveFileIcon className="w-5 h-5 text-secondary" />;
}
