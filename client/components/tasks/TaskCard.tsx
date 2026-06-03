"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdCalendarToday,
  MdEdit,
  MdDelete,
  MdWarningAmber,
} from "react-icons/md";
import { Task, TaskStatus } from "./taskTypes";

const PRIORITY_CONFIG = {
  high: { label: "High", cls: "bg-error-container/30 text-error border-error/30" },
  medium: { label: "Medium", cls: "bg-tertiary-container/20 text-tertiary border-tertiary/30" },
  low: { label: "Low", cls: "bg-secondary-container/30 text-secondary border-secondary-container" },
};

const STATUS_ICON: Record<TaskStatus, React.ReactNode> = {
  todo: <MdRadioButtonUnchecked className="w-4 h-4 text-secondary" />,
  "in-progress": <MdRadioButtonUnchecked className="w-4 h-4 text-primary" />,
  review: <MdRadioButtonUnchecked className="w-4 h-4 text-tertiary" />,
  done: <MdCheckCircle className="w-4 h-4 text-tertiary" />,
};

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  compact?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, compact = false }: TaskCardProps) {
  const isDone = task.status === "done";
  const isOverdue = task.dueDate === "Today" && task.priority === "high" && !isDone;
  const donePct = task.subtasks.length
    ? Math.round((task.subtasks.filter((s) => s.done).length / task.subtasks.length) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" as const }}
      className={`group bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-sm shadow-sm hover:shadow-md transition-shadow ${
        isDone ? "opacity-70" : ""
      }`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-xs mb-xs">
        <div className="flex items-start gap-xs flex-1 min-w-0">
          <button
            onClick={() =>
              onStatusChange?.(task.id, isDone ? "todo" : "done")
            }
            className="mt-[2px] flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
            aria-label={isDone ? "Mark incomplete" : "Mark complete"}
          >
            {STATUS_ICON[task.status]}
          </button>
          <span
            className={`font-body-md text-body-md font-semibold leading-snug truncate ${
              isDone ? "line-through text-secondary" : "text-on-surface"
            }`}
          >
            {task.title}
          </span>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors cursor-pointer"
              aria-label="Edit task"
            >
              <MdEdit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded hover:bg-error-container/40 text-secondary hover:text-error transition-colors cursor-pointer"
              aria-label="Delete task"
            >
              <MdDelete className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description (non-compact) */}
      {!compact && (
        <p className="font-label-sm text-label-sm text-secondary line-clamp-2 mb-sm pl-[22px]">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-xs pl-[22px] mt-xs">
        <div className="flex items-center gap-xs flex-wrap">
          {/* Priority badge */}
          <span
            className={`inline-flex items-center px-xs py-0.5 rounded-full text-[10px] font-semibold border ${
              PRIORITY_CONFIG[task.priority].cls
            }`}
          >
            {PRIORITY_CONFIG[task.priority].label}
          </span>

          {/* Due date */}
          <span
            className={`inline-flex items-center gap-[3px] font-label-sm text-label-sm ${
              isOverdue ? "text-error font-bold" : "text-secondary"
            }`}
          >
            {isOverdue ? (
              <MdWarningAmber className="w-3.5 h-3.5" />
            ) : (
              <MdCalendarToday className="w-3.5 h-3.5" />
            )}
            {task.dueDate}
          </span>

          {/* Tags */}
          {!compact &&
            task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-xs py-0.5 rounded-full text-[10px] font-medium bg-primary-container/10 text-primary border border-primary/10"
              >
                {tag}
              </span>
            ))}
        </div>

        {/* Assignee avatar */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${task.assignee.bg}`}
          title={task.assignee.name}
        >
          {task.assignee.initials}
        </div>
      </div>

      {/* Subtask progress (non-compact) */}
      {!compact && task.subtasks.length > 0 && (
        <div className="mt-sm pl-[22px]">
          <div className="flex items-center justify-between mb-[3px]">
            <span className="font-label-sm text-label-sm text-secondary">
              Subtasks {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
            </span>
            <span className="font-label-sm text-label-sm text-secondary">{donePct}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${donePct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
