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

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "subtasks">) => void;
  initial?: Task | null;
}

const PROJECTS = ["Client Portal Redesign", "Q3 Marketing Campaign", "Server Migration V2"];
const ASSIGNEES = [
  { name: "Jane Doe", initials: "JD", bg: "bg-primary text-on-primary" },
  { name: "Alex Miller", initials: "AM", bg: "bg-secondary-container text-on-secondary-container" },
  { name: "Sam Kumar", initials: "SK", bg: "bg-tertiary text-on-tertiary" },
  { name: "Elena Rodriguez", initials: "ER", bg: "bg-error-container text-on-error-container" },
  { name: "Michael Chen", initials: "MC", bg: "bg-primary-container text-on-primary-container" },
  { name: "Sarah Jenkins", initials: "SJ", bg: "bg-secondary text-on-secondary" },
];

const BLANK: Omit<Task, "id" | "subtasks"> = {
  title: "",
  description: "",
  project: PROJECTS[0],
  projectId: "1",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignee: ASSIGNEES[0],
  tags: [],
};

export function TaskModal({ isOpen, onClose, onSave, initial }: TaskModalProps) {
  const [form, setForm] = React.useState<Omit<Task, "id" | "subtasks">>(BLANK);
  const [tagInput, setTagInput] = React.useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initial ? { ...initial } : { ...BLANK });
      setTagInput("");
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, initial]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      handleChange("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    handleChange("tags", form.tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  const inputCls =
    "w-full px-sm py-xs bg-surface-container border border-outline-variant/50 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all";

  const labelCls = "block font-label-sm text-label-sm text-secondary mb-[4px]";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant/20 flex-shrink-0">
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

              {/* Body */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-md py-sm space-y-md">
                {/* Title */}
                <div>
                  <label className={labelCls}>Task Title *</label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    required
                    placeholder="What needs to be done?"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Add more details..."
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Project + Status row */}
                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <label className={`${labelCls} flex items-center gap-xs`}>
                      <MdFolder className="w-4 h-4" />
                      Project
                    </label>
                    <select
                      value={form.project}
                      onChange={(e) => handleChange("project", e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                    >
                      {PROJECTS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                {/* Priority + Due Date row */}
                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <label className={`${labelCls} flex items-center gap-xs`}>
                      <MdFlag className="w-4 h-4" />
                      Priority
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => handleChange("priority", e.target.value as TaskPriority)}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className={`${labelCls} flex items-center gap-xs`}>
                      <MdCalendarToday className="w-4 h-4" />
                      Due Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oct 15"
                      value={form.dueDate}
                      onChange={(e) => handleChange("dueDate", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className={`${labelCls} flex items-center gap-xs`}>
                    <MdPerson className="w-4 h-4" />
                    Assignee
                  </label>
                  <div className="flex flex-wrap gap-xs">
                    {ASSIGNEES.map((a) => {
                      const selected = form.assignee.name === a.name;
                      return (
                        <button
                          key={a.name}
                          type="button"
                          onClick={() => handleChange("assignee", a)}
                          title={a.name}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                            a.bg
                          } ${
                            selected
                              ? "ring-2 ring-primary ring-offset-2 scale-110"
                              : "opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                        >
                          {a.initials}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className={labelCls}>Tags</label>
                  <div className="flex gap-xs mb-xs flex-wrap">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-xs px-xs py-0.5 rounded-full text-[11px] font-medium bg-primary-container/20 text-primary border border-primary/20"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-error cursor-pointer"
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-xs">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); addTag(); }
                      }}
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-sm py-xs rounded-lg bg-surface-container border border-outline-variant/50 text-secondary hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <MdAdd className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-sm px-md py-sm border-t border-outline-variant/20 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-md py-xs rounded-lg font-label-md text-label-md text-secondary border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit as unknown as React.MouseEventHandler}
                  className="px-md py-xs rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
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
