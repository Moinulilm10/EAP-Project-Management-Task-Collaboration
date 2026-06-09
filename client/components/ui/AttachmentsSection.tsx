"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import { Attachment, attachmentService } from "../../services/attachment.service";
import { notification } from "../../utils/notification";
import { FileIcon, FileUpload } from "./FileUpload";

interface AttachmentsSectionProps {
  projectId?: string;
  taskId?: string;
  teamId?: string;
  canManage?: boolean;
}

export function AttachmentsSection({
  projectId,
  taskId,
  teamId,
  canManage = false,
}: AttachmentsSectionProps) {
  const { t } = useTranslation();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, taskId, teamId]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      if (projectId) {
        const data = await attachmentService.getByProject(projectId);
        setAttachments(data);
      } else if (taskId) {
        const data = await attachmentService.getByTask(taskId);
        setAttachments(data);
      } else if (teamId) {
        const data = await attachmentService.getByTeam(teamId);
        setAttachments(data);
      }
    } catch (error) {
      console.error("Failed to load attachments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const newAttachment = await attachmentService.upload(file, { projectId, taskId, teamId });
      setAttachments((prev) => [newAttachment, ...prev]);
      notification.successToast(t("File uploaded successfully") as string);
    } catch (error: any) {
      notification.errorToast(error.message || (t("Failed to upload file") as string));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await notification.confirm(
      t("Are you sure you want to delete this attachment?") as string,
      t("This action cannot be undone") as string,
      t("Delete") as string,
      t("Cancel") as string,
    );

    if (!confirmed) return;

    try {
      await attachmentService.delete(id);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
      notification.successToast(t("Attachment deleted successfully") as string);
    } catch (error: any) {
      notification.errorToast(error.message || (t("Failed to delete attachment") as string));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {canManage && (
        <FileUpload
          onUpload={handleUpload}
          isUploading={uploading}
        />
      )}

      {loading ? (
        <div className="flex justify-center p-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : attachments.length === 0 ? (
        <div className="text-center p-4 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/30">
          <p className="text-body-sm text-secondary">{t("No attachments found.")}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-surface-container-lowest rounded-lg">
                  <FileIcon mimeType={attachment.fileType} />
                </div>
                <div className="overflow-hidden">
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-sm text-on-surface hover:text-primary truncate block"
                    title={attachment.fileName}
                  >
                    {attachment.fileName}
                  </a>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-secondary">
                    <span>{formatSize(attachment.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {canManage && (
                <button
                  type="button"
                  onClick={() => handleDelete(attachment.id)}
                  className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors flex-shrink-0"
                  title={t("Delete attachment") as string}
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
