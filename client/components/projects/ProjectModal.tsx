"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MdCalendarToday, MdClose, MdLabel } from "react-icons/md";
import {
  ProjectCreateDTO,
  ProjectUpdateDTO,
} from "../../services/project.service";
import { Select } from "../ui/Select";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: ProjectCreateDTO | ProjectUpdateDTO) => void;
  initial?: {
    id: string;
    name: string;
    description: string | null;
    deadline: string | null;
    status: "active" | "completed" | "on_hold";
  } | null;
}

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
] as const;

export function ProjectModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: ProjectModalProps) {
  const { t } = useTranslation();
  const [name, setName] = React.useState(initial?.name || "");
  const [description, setDescription] = React.useState(
    initial?.description || "",
  );
  const [deadline, setDeadline] = React.useState(initial?.deadline || "");
  const [status, setStatus] = React.useState(initial?.status || "active");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initial?.name || "");
      setDescription(initial?.description || "");
      setDeadline(initial?.deadline ? initial.deadline.slice(0, 10) : "");
      setStatus(initial?.status || "active");
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, initial]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim() || null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status: status as ProjectCreateDTO["status"],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={submit}
              className="w-full max-w-2xl rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-2xl overflow-hidden min-h-[600px]"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
                <div>
                  <p className="font-title-md text-title-md text-on-surface">
                    {initial ? t("Edit Project") : t("New Project")}
                  </p>
                  <p className="font-body-sm text-secondary mt-1">
                    {initial
                      ? t("Update project details and permissions.")
                      : t("Create a new project and become its admin.")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 px-6 py-6">
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-2">
                    {t("Project name")}
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("Project title") || ""}
                    className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-2">
                    {t("Description")}
                  </label>
                  <textarea
                    rows={4}
                    value={description ?? ""}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("Add project purpose and goals.") || ""}
                    className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-label-sm text-label-sm text-secondary mb-2 flex items-center gap-2">
                      <MdCalendarToday className="w-4 h-4" />
                      {t("Deadline")}
                    </label>
                    <input
                      type="date"
                      value={deadline || ""}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-secondary mb-2 flex items-center gap-2">
                      <MdLabel className="w-4 h-4" />
                      {t("Status")}
                    </label>
                    <Select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as "active" | "completed" | "on_hold")
                      }
                      options={STATUS_OPTIONS.map((option) => ({
                        label: t(option.label),
                        value: option.value,
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 items-end px-6 pb-6">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-body-md font-semibold text-on-primary transition hover:bg-primary/90"
                >
                  {initial ? t("Save changes") : t("Create project")}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
