"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdAdd,
  MdPerson,
  MdCalendarToday,
  MdFlag,
  MdFolder,
} from "react-icons/md";
import { Task, TaskStatus, TaskPriority } from "./taskTypes";
import { Select } from "../ui/Select";
import { useProjectStore } from "../../stores/projectStore";
import { useTeamStore } from "../../stores/teamStore";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  initial?: Task | null;
}

const ASSIGNEES = [
  { name: "Jane Doe", initials: "JD", bg: "bg-primary text-on-primary" },
  { name: "Alex Miller", initials: "AM", bg: "bg-secondary-container text-on-secondary-container" },
];

export function TaskModal({ isOpen, onClose, onSave, initial }: TaskModalProps) {
  const { projects, fetchProjects } = useProjectStore();
  const { teams, fetchTeams } = useTeamStore();

  const [form, setForm] = React.useState<any>({});
  const [tagInput, setTagInput] = React.useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
    fetchTeams();
  }, [fetchProjects, fetchTeams]);

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setForm({
          title: initial.title,
          description: initial.description,
          projectId: initial.projectId || "",
          status: initial.status || "todo",
          priority: initial.priority || "medium",
          dueDate: initial.dueDate || "",
          assignee: initial.assignee || null,
          teamId: initial.teamId || "",
          tags: initial.tags || [],
        });
      } else {
        setForm({
          title: "",
          description: "",
          projectId: projects.length > 0 ? projects[0].id : "",
          status: "todo",
          priority: "medium",
          dueDate: "",
          assignee: null,
          teamId: "",
          tags: [],
        });
      }
      setTagInput("");
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, initial, projects]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags?.includes(tag)) {
      handleChange("tags", [...(form.tags || []), tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    handleChange("tags", form.tags.filter((t: string) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) {
      alert("Title and Project are required.");
      return;
    }

    const submitData = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      teamId: form.teamId || undefined,
      assigneeId: form.assignee?.id || undefined, // Keep as undefined if no actual user is mapped yet
    };
    onSave(submitData);
  };

  const inputCls =
    "w-full px-sm py-xs bg-surface-container border border-outline-variant/50 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all";

  const labelCls = "block font-label-sm text-label-sm text-secondary mb-[4px]";

  const projectOptions = projects.map(p => ({ label: p.name, value: p.id }));
  const teamOptions = [{ label: "None", value: "" }, ...teams.map(t => ({ label: t.name, value: t.id }))];

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
            className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[90%] max-w-[550px] bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh] min-h-[650px]">
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20 flex-shrink-0">
                <h2 className="font-title-md text-title-md text-on-surface">
                  {initial ? "Edit Task" : "New Task"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
                <div>
                  <label className={labelCls}>Task Title *</label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    required
                    placeholder="What needs to be done?"
                    value={form.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Add more details..."
                    value={form.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${labelCls} flex items-center gap-xs`}>
                      <MdFolder className="w-4 h-4" />
                      Project *
                    </label>
                    <Select
                      value={form.projectId}
                      onChange={(e) => handleChange("projectId", e.target.value)}
                      options={projectOptions}
                      emptyMessage="No project available"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Team (Optional)</label>
                    <Select
                      value={form.teamId || ""}
                      onChange={(e) => handleChange("teamId", e.target.value)}
                      options={teamOptions}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${labelCls} flex items-center gap-xs`}>
                      <MdFlag className="w-4 h-4" />
                      Priority
                    </label>
                    <Select
                      value={form.priority}
                      onChange={(e) => handleChange("priority", e.target.value as TaskPriority)}
                      options={[
                        { label: "High", value: "high" },
                        { label: "Medium", value: "medium" },
                        { label: "Low", value: "low" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <Select
                      value={form.status}
                      onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
                      options={[
                        { label: "To Do", value: "todo" },
                        { label: "In Progress", value: "in-progress" },
                        { label: "In Review", value: "review" },
                        { label: "Done", value: "done" },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${labelCls} flex items-center gap-xs`}>
                      <MdCalendarToday className="w-4 h-4" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={form.dueDate || ""}
                      onChange={(e) => handleChange("dueDate", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </form>

              <div className="flex justify-end gap-3 px-6 py-5 border-t border-outline-variant/20 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl font-label-md text-label-md text-secondary border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit as unknown as React.MouseEventHandler}
                  className="px-4 py-2 rounded-xl font-label-md text-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                >
                  {initial ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
