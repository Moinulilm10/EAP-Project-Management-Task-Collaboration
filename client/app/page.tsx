"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { KPICard } from "../components/dashboard/KPICard";
import { TaskChart } from "../components/dashboard/TaskChart";
import { ProjectProgressList } from "../components/dashboard/ProjectProgressList";
import { PriorityTasks } from "../components/dashboard/PriorityTasks";
import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
import { MemberWorkload } from "../components/dashboard/MemberWorkload";
import { TaskModal } from "../components/tasks/TaskModal";
import { Task } from "../components/tasks/taskTypes";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MdCalendarMonth, MdDownload, MdCheck } from "react-icons/md";
import "../i18n";
import * as Sentry from "@sentry/nextjs";
import { dashboardService, DashboardInsights } from "../services/dashboard.service";

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year", "Custom Range"];

export default function DashboardHome() {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isCustomRangeModalOpen, setIsCustomRangeModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportDone, setExportDone] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' });
    setIsLoading(true);
    dashboardService.getInsights()
      .then(setInsights)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const handleSaveTask = (_task: Omit<Task, "id" | "subtasks">) => {
    // In a real app, this would dispatch to state/API
    // For demo, we just close the modal
    dashboardService.getInsights().then(setInsights).catch(console.error);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-lg animate-fade-in relative z-30"
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
          <div className="relative z-20">
            <button
              onClick={() => setIsRangeOpen((p) => !p)}
              className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-low hover:text-primary transition-colors flex items-center gap-2 cursor-pointer select-none"
            >
              <MdCalendarMonth className="w-[18px] h-[18px]" />
              {selectedRange === "Custom Range" && startDate && endDate
                ? `${startDate} to ${endDate}`
                : t(selectedRange)}
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
                    className="absolute right-0 top-full mt-xs z-20 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden min-w-[220px]"
                  >
                    {DATE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          if (range === "Custom Range") {
                            setIsRangeOpen(false);
                            setIsCustomRangeModalOpen(true);
                          } else {
                            setSelectedRange(range);
                            setIsRangeOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between px-md py-sm font-body-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer text-left"
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
        <KPICard title="Total Projects" value={insights ? insights.totalProjects.toString() : "-"} isLoading={isLoading} />
        <KPICard title="Total Tasks" value={insights ? insights.totalTasks.toString() : "-"} isLoading={isLoading} />
        <KPICard title="Completed" value={insights ? insights.completedTasks.toString() : "-"} subValue={insights ? `/${insights.totalTasks}` : ""} variant="primary-highlight" isLoading={isLoading} />
        <KPICard title="Pending" value={insights ? insights.pendingTasks.toString() : "-"} isLoading={isLoading} />
        <KPICard title="Overdue" value={insights ? insights.overdueTasks.toString() : "-"} variant="error-highlight" isLoading={isLoading} />
      </div>

      {/* Main Content Layout Grid */}
      <div
        className="grid grid-cols-1 xl:grid-cols-12 gap-gutter animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        {/* Left Side: Charts and Project Progress (8 columns) */}
        <div className="xl:col-span-8 flex flex-col gap-gutter">
          <TaskChart distribution={insights?.tasksByStatus} />
          <ProjectProgressList projects={insights ? insights.projectSummaries : []} isLoading={isLoading} />
          <MemberWorkload workload={insights?.memberWorkload || []} isLoading={isLoading} />
        </div>

        {/* Right Side: Priority Tasks and Activity Log (4 columns) */}
        <div className="xl:col-span-4 flex flex-col gap-gutter">
          <PriorityTasks 
            tasks={insights?.highPriorityTasks || []} 
            upcoming={insights?.upcomingDeadlines || []} 
            isLoading={isLoading}
          />
          <ActivityTimeline activities={insights?.recentActivities || []} isLoading={isLoading} />
        </div>
      </div>

      {/* Quick-create Task modal (triggered from TopNavBar "Create Task") */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        initial={null}
      />

      {/* Custom Date Range Modal */}
      <AnimatePresence>
        {isCustomRangeModalOpen && (
          <>
            <motion.div
              key="custom-range-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsCustomRangeModalOpen(false)}
              className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm"
            />
            <motion.div
              key="custom-range-modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[90%] max-w-[400px] bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-outline-variant/20">
                  <h2 className="font-title-md text-title-md text-on-surface">
                    {t("Select Custom Range")}
                  </h2>
                </div>
                
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-secondary">{t("Start Date")}</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-sm py-xs bg-surface-container border border-outline-variant/50 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer" 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-secondary">{t("End Date")}</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full px-sm py-xs bg-surface-container border border-outline-variant/50 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-5 border-t border-outline-variant/20 bg-surface-container-low/30">
                  <button
                    type="button"
                    onClick={() => setIsCustomRangeModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-label-md text-label-md text-secondary border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRange("Custom Range");
                      setIsCustomRangeModalOpen(false);
                    }}
                    disabled={!startDate || !endDate}
                    className="px-4 py-2 rounded-xl font-label-md text-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("Apply")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
