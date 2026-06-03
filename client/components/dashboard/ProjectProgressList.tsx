"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useTranslation } from "react-i18next";
import { MdWarning, MdCalendarToday } from "react-icons/md";

interface ProjectProgress {
  title: string;
  progress: number;
  dueDate: string;
  status: "active" | "completed" | "on-hold";
  isWarning?: boolean;
}

export function ProjectProgressList() {
  const { t } = useTranslation();

  const projects: ProjectProgress[] = [
    {
      title: "Q3 Marketing Campaign",
      progress: 80,
      dueDate: "Oct 15",
      status: "active",
    },
    {
      title: "Client Portal Redesign",
      progress: 92,
      dueDate: "Tomorrow",
      status: "active",
      isWarning: true,
    },
    {
      title: "Server Migration V2",
      progress: 100,
      dueDate: "Sep 01",
      status: "completed",
    },
  ];

  return (
    <Card className="p-md flex flex-col h-full min-h-[350px]">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("Active Project Progress")}
        </h3>
        <span className="font-label-sm text-label-sm text-secondary">
          {t("View All")}
        </span>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {projects.map((project, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">
                  {t(project.title)}
                </h4>
                <div className="flex items-center gap-xs mt-1">
                  {project.isWarning ? (
                    <span className="text-error flex items-center gap-xs font-bold text-[12px]">
                      <MdWarning className="w-3.5 h-3.5" />
                      {t(project.dueDate)}
                    </span>
                  ) : (
                    <span className="text-secondary flex items-center gap-xs text-[12px]">
                      <MdCalendarToday className="w-3.5 h-3.5" />
                      {t(project.dueDate)}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant={project.status === "on-hold" ? "on-hold" : project.status}>
                {t(project.status === "active" ? "Active" : project.status === "completed" ? "Completed" : "On Hold")}
              </Badge>
            </div>

            {/* Progress bar container */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[12px] font-label-sm">
                <span className="text-secondary">{t("Progress")}</span>
                <span className="text-primary font-bold">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    project.status === "completed" ? "bg-secondary" : "bg-primary"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
