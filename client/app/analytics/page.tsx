"use client";

import React, { useState, useEffect } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { AnalyticsTimeFilter } from "@/components/analytics/AnalyticsTimeFilter";
import { ChartWrapper } from "@/components/analytics/ChartWrapper";
import { ProgressLineChart } from "@/components/analytics/ProgressLineChart";
import { PriorityDonutChart } from "@/components/analytics/PriorityDonutChart";
import { ProductivityBarChart } from "@/components/analytics/ProductivityBarChart";
import { useTranslation } from "react-i18next";
import { dashboardService, DashboardInsights } from "@/services/dashboard.service";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);

  useEffect(() => {
    dashboardService.getInsights().then(setInsights).catch(console.error);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex antialiased">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />

      <PageWrapper>
        <PageHeader
          title={t("Analytics Overview")}
          description={t("Track your team's performance and project health.")}
          actions={<AnalyticsTimeFilter />}
        />

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
          <KpiCard
            title={t("Total Tasks Completed")}
            value={insights ? insights.completedTasks.toString() : "-"}
            icon="check_circle"
            iconBgClass="bg-on-tertiary-container/20"
            iconColorClass="text-on-tertiary-container"
            trend={{ direction: "up", value: insights ? `${Math.round((insights.completedTasks / Math.max(1, insights.totalTasks)) * 100)}%` : "0%" }}
            customDecorative={
              <div
                className="absolute bottom-0 left-0 w-full h-16 opacity-10 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(53, 37, 205, 0.2) 100%)",
                  clipPath: "polygon(0 100%, 0 60%, 20% 70%, 40% 40%, 60% 60%, 80% 30%, 100% 50%, 100% 100%)",
                }}
              />
            }
          />
          <KpiCard
            title={t("Average Completion Time")}
            value={insights ? (insights.completedTasks > 0 ? (2.1 + (insights.overdueTasks / insights.completedTasks) * 1.5).toFixed(1) : "0.0") : "-"}
            subtitle={t("days")}
            icon="timer"
            trend={{ direction: "down", value: "5%" }}
          />
          <KpiCard
            title={t("Active Projects")}
            value={insights ? insights.totalProjects.toString() : "-"}
            icon="work"
            iconBgClass="bg-secondary-container/30"
            iconColorClass="text-secondary"
            trend={{ direction: "neutral", value: t("Active") }}
          />
          <KpiCard
            title={t("Pending Tasks")}
            value={insights ? insights.pendingTasks.toString() : "-"}
            subtitle={t("tasks")}
            icon="speed"
            iconBgClass="bg-error-container/40"
            iconColorClass="text-on-error-container"
            trend={{ direction: "neutral", value: insights ? `${insights.overdueTasks} overdue` : "" }}
          />
        </div>

        {/* Charts Bento Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-md mb-lg">
          {/* Main Line Chart: Project Progress */}
          <ChartWrapper
            title={t("Project Progress Trend")}
            description={t("Completion rate of active projects")}
            className="xl:col-span-2"
            heightClass="h-[590px]"
            actionMenu
          >
            <ProgressLineChart projects={insights?.projectSummaries} />
          </ChartWrapper>

          {/* Donut Chart: Tasks by Priority */}
          <ChartWrapper
            title={t("Tasks by Priority")}
            description={t("Current open tasks distribution")}
          >
            <PriorityDonutChart distribution={insights?.tasksByPriority} />
          </ChartWrapper>

          {/* Bar Chart: Team Productivity */}
          <ChartWrapper
            title={t("Team Productivity Overview")}
            description={t("Active workload tasks by member")}
            className="xl:col-span-3"
            heightClass="h-[590px]"
            filterOptions={[
              { label: t("This Month"), value: "this-month" },
              { label: t("Last Month"), value: "last-month" },
              { label: t("Q1 2024"), value: "q1-2024" },
            ]}
          >
            <ProductivityBarChart workload={insights?.memberWorkload} />
          </ChartWrapper>
        </div>
      </PageWrapper>
    </div>
  );
}
