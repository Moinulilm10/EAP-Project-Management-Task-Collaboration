"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdCalendarToday,
  MdEdit,
  MdDelete,
  MdWarningAmber,
  MdFlag,
} from "react-icons/md";
import { Task, TaskStatus } from "./taskTypes";

const PRIORITY_CONFIG = {
  high: { label: "High", cls: "bg-error-container/30 text-error border-error/30" },
  medium: { label: "Medium", cls: "bg-tertiary-container/20 text-tertiary border-tertiary/30" },
  low: { label: "Low", cls: "bg-secondary-container/30 text-secondary border-secondary-container" },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; cls: string }> = {
  todo: { label: "To Do", cls: "bg-surface-container text-secondary border-outline-variant/50" },
  "in-progress": { label: "In Progress", cls: "bg-primary-container/20 text-primary border-primary/20" },
  review: { label: "In Review", cls: "bg-tertiary-container/20 text-tertiary border-tertiary/20" },
  done: { label: "Done", cls: "bg-secondary-container/30 text-on-secondary-container border-secondary-container" },
};

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
};

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-xl border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest/50"
      >
        <MdCheckCircle className="w-10 h-10 text-secondary mb-sm" />
        <p className="font-title-md text-secondary">No tasks match your filters</p>
        <p className="font-body-md text-body-md text-secondary/70 mt-xs">Try adjusting the filters or create a new task</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_140px_100px_100px_100px_80px] gap-sm items-center px-md py-xs border-b border-outline-variant/20 bg-surface-container-low/50">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">Task</span>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">Project</span>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">Status</span>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">Priority</span>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">Due</span>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wide">Actions</span>
      </div>

      <AnimatePresence mode="popLayout">
        {tasks.map((task, i) => {
          const isDone = task.status === "done";
          const isOverdue = task.dueDate === "Today" && task.priority === "high" && !isDone;
          const statusCfg = STATUS_CONFIG[task.status];
          const priorityCfg = PRIORITY_CONFIG[task.priority];

          return (
            <motion.div
              key={task.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: i * 0.04 }}
              className="group grid grid-cols-1 md:grid-cols-[1fr_140px_100px_100px_100px_80px] gap-sm items-center px-md py-sm border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/40 transition-colors"
            >
              {/* Task title + assignee */}
              <div className="flex items-center gap-sm min-w-0">
                <button
                  onClick={() => onStatusChange(task.id, isDone ? "todo" : "done")}
                  className="flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone ? (
                    <MdCheckCircle className="w-5 h-5 text-tertiary" />
                  ) : (
                    <MdRadioButtonUnchecked className="w-5 h-5 text-secondary hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-body-md text-body-md font-semibold truncate ${
                      isDone ? "line-through text-secondary" : "text-on-surface"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-xs mt-[2px] md:hidden flex-wrap">
                    <span className="font-label-sm text-label-sm text-secondary">{task.project}</span>
                  </div>
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${task.assignee.bg}`}
                  title={task.assignee.name}
                >
                  {task.assignee.initials}
                </div>
              </div>

              {/* Project */}
              <div className="hidden md:block">
                <span className="font-label-sm text-label-sm text-secondary truncate block">{task.project}</span>
              </div>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-flex items-center px-xs py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${statusCfg.cls}`}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Priority badge */}
              <div>
                <span
                  className={`inline-flex items-center gap-[3px] px-xs py-0.5 rounded-full text-[10px] font-semibold border ${priorityCfg.cls}`}
                >
                  <MdFlag className="w-3 h-3" />
                  {priorityCfg.label}
                </span>
              </div>

              {/* Due date */}
              <div>
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
                  {task.dueDate || "—"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                  aria-label="Edit task"
                >
                  <MdEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                  aria-label="Delete task"
                >
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
