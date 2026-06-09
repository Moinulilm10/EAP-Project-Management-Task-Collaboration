"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MdCheckCircle,
  MdClose,
  MdFolder,
  MdPeople,
  MdPersonAdd,
} from "react-icons/md";

import { Select } from "../ui/Select";
import { AttachmentsSection } from "../ui/AttachmentsSection";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    description: string;
    status: "active" | "completed" | "on_hold";
    dueDate: string;
    progress: number;
    memberCount?: number;
    ownerName: string;
    ownerEmail: string;
    canManage: boolean;
  };
}

const ROLE_OPTIONS = ["Project Member", "Team Member"];

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailsModalProps) {
  const { t } = useTranslation();
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState(ROLE_OPTIONS[0]);

  useEffect(() => {
    if (!isOpen) {
      setInviteEmail("");
      setInviteRole(ROLE_OPTIONS[0]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-3xl rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-2xl overflow-hidden">
              <div className="flex flex-col gap-4 px-6 py-5 border-b border-outline-variant/20 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-title-md text-title-md text-on-surface">
                    {project.title}
                  </p>
                  <p className="font-body-sm text-secondary mt-1">
                    {t("Project details and member management.")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 w-11 rounded-2xl border border-outline-variant/50 text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr]">
                <div className="space-y-5">
                  <div className="rounded-3xl bg-surface-container-highest p-5 border border-outline-variant/20">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {project.canManage ? t("Admin") : t("Member")}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1 text-xs text-secondary">
                        <MdFolder className="w-4 h-4" />
                        {t(
                          project.status === "completed"
                            ? "Completed"
                            : project.status === "on_hold"
                              ? "On Hold"
                              : "Active",
                        )}
                      </span>
                    </div>

                    <p className="font-body-md text-body-md text-on-surface mb-4">
                      {project.description}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-1">
                      <div className="rounded-2xl bg-surface-container-low p-4">
                        <p className="font-label-sm text-label-sm text-secondary">
                          {t("Owner")}
                        </p>
                        <p className="font-body-md text-on-surface mt-2">
                          {project.ownerName}
                        </p>
                        <p className="text-secondary text-sm mt-1">
                          {project.ownerEmail}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-surface-container-low p-4">
                        <p className="font-label-sm text-label-sm text-secondary">
                          {t("Members")}
                        </p>
                        <p className="font-body-md text-on-surface mt-2">
                          {project.memberCount ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-surface-container-highest border border-outline-variant/20 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-label-sm text-label-sm text-secondary">
                          {t("Progress")}
                        </p>
                        <p className="font-body-md text-on-surface mt-2">
                          {project.progress}%
                        </p>
                      </div>
                      <div className="text-primary text-2xl font-bold">
                        {project.canManage ? (
                          <MdCheckCircle className="inline" />
                        ) : (
                          <MdPeople className="inline" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-lowest">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl bg-surface-container-highest border border-outline-variant/20 p-5">
                    <p className="font-label-sm text-label-sm text-secondary mb-4">
                      {t("Attachments")}
                    </p>
                    <AttachmentsSection 
                      projectId={project.id} 
                      canManage={true} 
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-label-sm text-label-sm text-secondary">
                          {t("Invite members")}
                        </p>
                        <p className="text-body-sm text-secondary mt-1">
                          {project.canManage
                            ? t(
                              "Only admins can invite members to this project.",
                            )
                            : t("Only project admins can invite members.")}
                        </p>
                      </div>
                      <MdPersonAdd className="w-6 h-6 text-primary" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-label-sm text-secondary mb-2">
                          {t("Email address")}
                        </label>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder={t("Enter team member email") || ""}
                          disabled={!project.canManage}
                          className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-label-sm text-secondary mb-2">
                          {t("Role")}
                        </label>
                        <Select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          disabled={!project.canManage}
                          options={ROLE_OPTIONS.map((role) => ({
                            label: t(role),
                            value: role,
                          }))}
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!project.canManage || !inviteEmail.trim()}
                        className="w-full rounded-2xl bg-primary px-4 py-3 text-body-md font-semibold text-on-primary transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {t("Invite member")}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-surface-container-highest border border-outline-variant/20 p-5">
                    <p className="font-label-sm text-label-sm text-secondary">
                      {t("Invite roles")}
                    </p>
                    <div className="mt-3 grid gap-3">
                      {ROLE_OPTIONS.map((role) => (
                        <div
                          key={role}
                          className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4"
                        >
                          <p className="font-body-md text-on-surface">
                            {t(role)}
                          </p>
                          <p className="text-body-sm text-secondary mt-1">
                            {role === "Project Member"
                              ? t(
                                "Can manage tasks and participate in the project.",
                              )
                              : t(
                                "Can contribute to project work as a team member.",
                              )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
