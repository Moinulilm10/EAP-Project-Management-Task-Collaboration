"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskKanban } from "@/components/tasks/TaskKanban";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskModal } from "@/components/tasks/TaskModal";
import { Task, TaskStatus, TaskPriority } from "@/components/tasks/taskTypes";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useTaskStore } from "@/stores/taskStore";
import { notification } from "@/utils/notification";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/ui/Pagination";
import {
  MdAdd,
  MdViewKanban,
  MdFormatListBulleted,
  MdSearch,
  MdFilterList,
  MdClose,
  MdCheckCircle,
  MdPending,
  MdPlayCircle,
  MdRateReview,
} from "react-icons/md";
import "../../i18n";

// ─── KPI stat cards ───────────────────────────────────────────────────────────
const STAT_CONFIG = [
  { key: "all", label: "Total", icon: MdFormatListBulleted, accent: "text-primary", bg: "bg-primary-container/20" },
  { key: "todo", label: "To Do", icon: MdPending, accent: "text-secondary", bg: "bg-surface-container-high/50" },
  { key: "in-progress", label: "In Progress", icon: MdPlayCircle, accent: "text-primary", bg: "bg-primary-container/20" },
  { key: "review", label: "In Review", icon: MdRateReview, accent: "text-tertiary", bg: "bg-tertiary-container/20" },
  { key: "done", label: "Done", icon: MdCheckCircle, accent: "text-tertiary", bg: "bg-tertiary-container/20" },
];

type ViewMode = "list" | "kanban";

export default function TasksPage() {
  const { t } = useTranslation();

  // ── Store ──────────────────────────────────────────────────────────────────
  const { 
    tasks, total, page, limit, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask,
    searchQuery, statusFilter, priorityFilter, sortBy, deadlineStatus, assigneeId,
    setSearchQuery, setStatusFilter, setPriorityFilter, setSortBy, setDeadlineStatus, setAssigneeId, setPage
  } = useTaskStore();

  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const debouncedSearch = useDebounce(localSearch, 400);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, searchQuery, statusFilter, priorityFilter, sortBy, deadlineStatus, assigneeId, page]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const counts: Record<string, number> = {
      all: tasks.length,
      todo: tasks.filter((t: any) => t.status === "todo").length,
      "in-progress": tasks.filter((t: any) => t.status === "in-progress").length,
      review: tasks.filter((t: any) => t.status === "review").length,
      done: tasks.filter((t: any) => t.status === "done").length,
    };
    return counts;
  }, [tasks]);

  const activeFiltersCount = [
    priorityFilter !== "all",
    statusFilter !== "all",
    deadlineStatus !== "all",
    assigneeId !== "all",
    sortBy !== "createdAt_desc",
    !!searchQuery,
  ].filter(Boolean).length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSave = async (formData: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        notification.successToast(t("Task updated successfully") as string);
      } else {
        await createTask(formData);
        notification.successToast(t("Task created successfully") as string);
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err: any) {
      notification.errorToast(
        err?.message || (t("Failed to save task") as string)
      );
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTaskStatus(id, status);
  };

  const handleOpenNew = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setLocalSearch("");
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setDeadlineStatus("all");
    setAssigneeId("all");
    setSortBy("createdAt_desc");
  };

  return (
    <DashboardLayout>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg"
      >
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            {t("Tasks")}
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-xs">
            {t("Track, manage, and complete your work.")}
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-xs whitespace-nowrap self-start sm:self-auto" onClick={handleOpenNew}>
          <MdAdd className="w-[18px] h-[18px]" />
          {t("New Task")}
        </Button>
      </motion.div>

      {/* ── KPI Stats ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-sm mb-lg"
      >
        {STAT_CONFIG.map(({ key, label, icon: Icon, accent, bg }) => (
          <motion.button
            key={key}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              key === "all"
                ? setStatusFilter("all")
                : setStatusFilter(key as TaskStatus)
            }
            className={`flex items-center gap-sm p-sm rounded-xl border cursor-pointer transition-all ${
              (key === "all" && statusFilter === "all") ||
              statusFilter === key
                ? `border-primary/40 ${bg} shadow-sm`
                : "border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30"
            }`}
          >
            <div className={`p-xs rounded-lg ${bg}`}>
              <Icon className={`w-5 h-5 ${accent}`} />
            </div>
            <div className="text-left min-w-0">
              <p className="font-headline-md text-headline-md text-on-surface font-bold leading-none">
                {stats[key]}
              </p>
              <p className="font-label-sm text-label-sm text-secondary mt-[2px] truncate">{label}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 mb-md"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-full sm:max-w-sm">
          <MdSearch className="absolute left-sm top-1/2 -translate-y-1/2 text-secondary w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder={t("Search tasks, projects, assignees...")}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-[36px] pr-10 py-xs bg-surface-container-lowest border border-outline-variant/40 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-xs top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer transition-colors"
            >
              <MdClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setIsFiltersOpen((p) => !p)}
          className={`flex-shrink-0 relative flex items-center justify-center gap-xs px-sm py-xs rounded-lg border font-label-md text-label-md transition-all cursor-pointer ${
            isFiltersOpen || activeFiltersCount > 0
              ? "border-primary text-primary bg-primary-container/10"
              : "border-outline-variant/40 text-secondary hover:text-primary hover:border-primary/40 bg-surface-container-lowest"
          }`}
        >
          <MdFilterList className="w-[18px] h-[18px]" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="flex-shrink-0 flex rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-lowest self-start sm:self-auto">
          {(["list", "kanban"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 flex items-center justify-center gap-xs px-sm py-xs font-label-md text-label-md transition-all cursor-pointer ${
                view === v
                  ? "bg-primary text-on-primary"
                  : "text-secondary hover:bg-surface-container-low"
              }`}
            >
              {v === "list" ? (
                <MdFormatListBulleted className="w-[18px] h-[18px]" />
              ) : (
                <MdViewKanban className="w-[18px] h-[18px]" />
              )}
              <span className="hidden sm:inline capitalize">{v}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Filter Panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-6 mb-md p-sm bg-surface-container-lowest border border-outline-variant/20 rounded-xl">
              {/* Priority filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-label-sm text-label-sm text-secondary">Priority:</span>
                {(["all", "high", "medium", "low"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer capitalize ${
                      priorityFilter === p
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant/40 text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {p === "all" ? "All" : p}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />

              {/* Status filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-label-sm text-label-sm text-secondary">Status:</span>
                {(["all", "todo", "in-progress", "review", "done"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      statusFilter === s
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant/40 text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s === "all" ? "All" : s === "in-progress" ? "In Progress" : s === "todo" ? "To Do" : s === "review" ? "In Review" : "Done"}
                  </button>
                ))}
              </div>
              
              <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />

              {/* Deadline Status filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-label-sm text-label-sm text-secondary">Deadline:</span>
                {(["all", "upcoming", "overdue"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDeadlineStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer capitalize ${
                      deadlineStatus === s
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant/40 text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {s === "all" ? "All" : s}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />

              {/* Sort By */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-label-sm text-label-sm text-secondary">Sort:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-outline-variant/40 bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="createdAt_desc">Latest Created</option>
                  <option value="dueDate_asc">Nearest Deadline</option>
                  <option value="priority_desc">Highest Priority</option>
                  <option value="updatedAt_desc">Recently Updated</option>
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-2 font-label-sm text-label-sm text-error hover:text-error/80 cursor-pointer transition-colors"
                >
                  <MdClose className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results summary ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-sm">
        <p className="font-label-sm text-label-sm text-secondary">
          {total} {total === 1 ? "task" : "tasks"}
          {activeFiltersCount > 0 && " (filtered)"}
        </p>
        
        {/* Pagination Controls */}
        {total > limit && (
          <Pagination
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {view === "list" ? (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          ) : (
            <TaskKanban
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        initial={editingTask}
      />
    </DashboardLayout>
  );
}
