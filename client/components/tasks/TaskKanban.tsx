"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, TaskStatus } from "./taskTypes";
import { TaskCard } from "./TaskCard";

const COLUMNS: { id: TaskStatus; label: string; accent: string; dot: string }[] = [
  { id: "todo", label: "To Do", accent: "border-t-secondary", dot: "bg-secondary" },
  { id: "in-progress", label: "In Progress", accent: "border-t-primary", dot: "bg-primary" },
  { id: "review", label: "In Review", accent: "border-t-tertiary", dot: "bg-tertiary" },
  { id: "done", label: "Done", accent: "border-t-outline", dot: "bg-outline" },
];

interface TaskKanbanProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskKanban({ tasks, onEdit, onDelete, onStatusChange }: TaskKanbanProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter overflow-x-auto">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        return (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex flex-col min-w-[260px] rounded-xl border-t-[3px] ${col.accent} bg-surface-container-lowest border border-outline-variant/20 shadow-sm`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-sm pt-sm pb-xs border-b border-outline-variant/15">
              <div className="flex items-center gap-xs">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {col.label}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-container rounded-full px-xs py-0.5 min-w-[20px] text-center">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 p-sm space-y-xs overflow-y-auto max-h-[calc(100vh-280px)]">
              <AnimatePresence mode="popLayout">
                {columnTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-xl text-secondary font-label-sm text-label-sm border-2 border-dashed border-outline-variant/30 rounded-lg"
                  >
                    No tasks here
                  </motion.div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      compact
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
