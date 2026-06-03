"use client";

import React from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { KPICard } from "../components/dashboard/KPICard";
import { TaskChart } from "../components/dashboard/TaskChart";
import { ProjectProgressList } from "../components/dashboard/ProjectProgressList";
import { PriorityTasks } from "../components/dashboard/PriorityTasks";
import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
import { useTranslation } from "react-i18next";
import { MdCalendarMonth, MdDownload } from "react-icons/md";
import "../i18n";

export default function DashboardHome() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            {t("Executive Overview")}
          </h2>
          <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant mt-1">
            {t("Real-time metrics and project velocity.")}
          </p>
        </div>
        <div className="flex gap-sm">
          <button className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-low hover:text-primary transition-colors flex items-center gap-2">
            <MdCalendarMonth className="w-[18px] h-[18px]" />
            {t("Last 30 Days")}
          </button>
          <button className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-low hover:text-primary transition-colors flex items-center gap-2">
            <MdDownload className="w-[18px] h-[18px]" />
            {t("Export Report")}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md mb-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <KPICard title="Total Projects" value="12" />
        <KPICard title="Total Tasks" value="48" />
        <KPICard title="Completed" value="32" subValue="/48" variant="primary-highlight" />
        <KPICard title="Pending" value="16" />
        <KPICard title="Overdue" value="3" variant="error-highlight" />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter animate-fade-in" style={{ animationDelay: "0.3s" }}>
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
    </DashboardLayout>
  );
}
