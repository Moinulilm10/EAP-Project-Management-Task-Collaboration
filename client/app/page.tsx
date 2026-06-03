"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { KPICard } from "../components/dashboard/KPICard";
import { TaskChart } from "../components/dashboard/TaskChart";
import { ProjectProgressList } from "../components/dashboard/ProjectProgressList";
import { PriorityTasks } from "../components/dashboard/PriorityTasks";
import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
import { TaskModal } from "../components/tasks/TaskModal";
import { Task } from "../components/tasks/taskTypes";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MdCalendarMonth, MdDownload, MdCheck } from "react-icons/md";
import "../i18n";

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];

export default function DashboardHome() {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const handleSaveTask = (_task: Omit<Task, "id" | "subtasks">) => {
    // In a real app, this would dispatch to state/API
    // For demo, we just close the modal
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-lg animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            {t("Executive Overview")}
          </h2>
          <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant mt-1">
            {t("Real-time metrics and project velocity.")}
          </p>
        </div>

        <div className="flex gap-sm">
          {/* Date Range Picker */}
          <div className="relative">
            <button
              onClick={() => setIsRangeOpen((p) => !p)}
              className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-low hover:text-primary transition-colors flex items-center gap-2 cursor-pointer select-none"
            >
              <MdCalendarMonth className="w-[18px] h-[18px]" />
              {t(selectedRange)}
            </button>

            <AnimatePresence>
              {isRangeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsRangeOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-xs z-20 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                  >
                    {DATE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedRange(range);
                          setIsRangeOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-sm py-xs font-body-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer text-left"
                      >
                        {t(range)}
                        {selectedRange === range && (
                          <MdCheck className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Export Report button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleExport}
            className={`px-4 py-2 border rounded-lg font-label-md text-label-md transition-colors flex items-center gap-2 cursor-pointer ${
              exportDone
                ? "border-tertiary text-tertiary bg-tertiary-container/10"
                : "border-outline-variant text-secondary hover:bg-surface-container-low hover:text-primary"
            }`}
          >
            {exportDone ? (
              <>
                <MdCheck className="w-[18px] h-[18px]" />
                {t("Exported!")}
              </>
            ) : (
              <>
                <MdDownload className="w-[18px] h-[18px]" />
                {t("Export Report")}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* KPI Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md mb-lg animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <KPICard title="Total Projects" value="12" />
        <KPICard title="Total Tasks" value="48" />
        <KPICard title="Completed" value="32" subValue="/48" variant="primary-highlight" />
        <KPICard title="Pending" value="16" />
        <KPICard title="Overdue" value="3" variant="error-highlight" />
      </div>

      {/* Main Content Layout Grid */}
      <div
        className="grid grid-cols-1 xl:grid-cols-12 gap-gutter animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        {/* Left Side: Charts and Project Progress (8 columns) */}
        <div className="xl:col-span-8 flex flex-col gap-gutter">
          <TaskChart />
          <ProjectProgressList />
        </div>

        {/* Right Side: Priority Tasks and Activity Log (4 columns) */}
        <div className="xl:col-span-4 flex flex-col gap-gutter">
          <PriorityTasks />
          <ActivityTimeline />
        </div>
      </div>

      {/* Quick-create Task modal (triggered from TopNavBar "Create Task") */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        initial={null}
      />
    </DashboardLayout>
  );
}
