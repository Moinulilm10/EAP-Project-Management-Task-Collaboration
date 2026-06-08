"use client";

import React from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";
import { TaskPriorityItem } from "../../services/dashboard.service";

interface PriorityTasksProps {
  tasks: TaskPriorityItem[];
  upcoming: TaskPriorityItem[];
  isLoading?: boolean;
}

export function PriorityTasks({ tasks = [], upcoming = [], isLoading = false }: PriorityTasksProps) {
  const { t } = useTranslation();

  const renderTaskRow = (task: TaskPriorityItem) => (
    <div
      key={task.id}
      className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-colors duration-200 border border-outline-variant/10 cursor-pointer"
    >
      <div className="flex items-center gap-sm min-w-0">
        {/* Assignee Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] flex-shrink-0 bg-primary-fixed text-on-primary-fixed"
        >
          {task.assigneeInitials}
        </div>

        {/* Task Details */}
        <div className="min-w-0">
          <h4 className="font-body-md text-body-md font-semibold text-on-surface truncate" title={task.title}>
            {t(task.title)}
          </h4>
          <p className="font-label-sm text-label-sm text-secondary truncate" title={task.project}>
            {t(task.project)}
          </p>
        </div>
      </div>

      {/* Badges & Date */}
      <div className="flex items-center gap-sm flex-shrink-0 pl-sm">
        <span
          className={`font-label-sm text-label-sm ${task.isOverdue ? "text-error font-bold" : "text-secondary"
            }`}
        >
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
        </span>
        <span className={`inline-flex items-center px-xs py-1 rounded-full text-[11px] font-label-sm border uppercase ${task.priority === "critical" ? "bg-error/20 text-error border-error/50 font-bold" :
          task.priority === "high" ? "bg-error-container/30 text-error border-error/30" :
            task.priority === "medium" ? "bg-tertiary-container/20 text-tertiary border-tertiary/30" :
              "bg-secondary-container/30 text-secondary border-secondary-container"
          }`}>
          {t(task.priority)}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="p-md h-[650px] flex flex-col">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("High Priority")}
        </h3>
        <Link href="/tasks" className="font-label-sm text-label-sm text-primary hover:text-primary/70 cursor-pointer transition-colors">
          {t("See All Tasks")}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center py-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-lg">
          {/* High Priority List */}
          <div className="space-y-sm">
            {tasks.length === 0 ? (
              <div className="text-secondary font-body-md py-sm text-center">
                {t("No high priority tasks.")}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(renderTaskRow)}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines Section */}
          <div className="space-y-sm">
            <h4 className="font-title-sm text-title-sm text-on-surface pt-xs border-t border-outline-variant/10">
              {t("Upcoming Deadlines")}
            </h4>
            {upcoming.length === 0 ? (
              <div className="text-secondary font-body-md py-sm text-center">
                {t("No upcoming deadlines.")}
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map(renderTaskRow)}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
